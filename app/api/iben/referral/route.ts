import { NextRequest, NextResponse } from "next/server";
import {  generateReferralCode, calculateReferralLevel, ibenModels } from "@/lib/models/ibendouma-models";

// Generate referral code for a user
export async function POST(request: NextRequest) {
  try {
    const { ReferralCodeModel, UserIbenModel } = await ibenModels;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user already has a referral code
    const existingCode = await ReferralCodeModel.findOne({ userId });
    if (existingCode) {
      return NextResponse.json(
        { 
          success: true, 
          referralCode: existingCode.code,
          message: "Referral code already exists" 
        },
        { status: 200 }
      );
    }

    // Generate unique referral code
    let referralCode = "";
    let isUnique = false;
    
    while (!isUnique) {
      referralCode = generateReferralCode();
      const existingCodeCheck = await ReferralCodeModel.findOne({ code: referralCode });
      if (!existingCodeCheck) {
        isUnique = true;
      }
    }

    // Create referral code
    const referralCodeModel = new ReferralCodeModel({
      userId,
      code: referralCode,
      isActive: true,
    });

    await referralCodeModel.save();
    console.log("referralCodeModel: ", referralCodeModel);

    // Update user with referral code
    await UserIbenModel.findByIdAndUpdate(userId, {
      referralCode: referralCode,
    });

    return NextResponse.json(
      { 
        success: true, 
        referralCode: referralCode,
        message: "Referral code generated successfully" 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error generating referral code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get referral information for a user
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { ReferralCodeModel, UserIbenModel, ReferralModel } = await ibenModels;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's referral code
    const referralCode = await ReferralCodeModel.findOne({ userId });
    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code not found" },
        { status: 404 }
      );
    }

    // Get user's referrals
    const referrals = await ReferralModel.find({ referrerId: userId })
      .populate("referredId", "firstname lastname email")
      .sort({ createdAt: -1 });

    // Get user's referral stats
    const user = await UserIbenModel.findById(userId);
    const referralStats = {
      totalReferrals: user?.totalReferrals || 0,
      referralPoints: user?.referralPoints || 0,
      referralLevel: user?.referralLevel || "bronze",
      maxReferrals: referralCode.maxReferrals,
      remainingReferrals: referralCode.maxReferrals - referralCode.totalReferrals,
    };

    return NextResponse.json({
      success: true,
      referralCode: referralCode.code,
      referrals,
      stats: referralStats,
    });
  } catch (error) {
    console.error("Error getting referral info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Use referral code during registration
export async function PUT(request: NextRequest) {
  try {
    const { ReferralCodeModel, UserIbenModel, ReferralModel } = await ibenModels;
    const { referralCode, newUserId } = await request.json();

    if (!referralCode || !newUserId) {
      return NextResponse.json(
        { error: "Referral code and user ID are required" },
        { status: 400 }
      );
    }

    // Find the referral code
    const codeDoc = await ReferralCodeModel.findOne({ code: referralCode.toUpperCase() });
    if (!codeDoc || !codeDoc.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive referral code" },
        { status: 400 }
      );
    }

    // Check if user has reached max referrals
    if (codeDoc.totalReferrals >= codeDoc.maxReferrals) {
      return NextResponse.json(
        { error: "Referral code has reached maximum usage" },
        { status: 400 }
      );
    }

    // Check if user is trying to use their own code
    if (codeDoc.userId.toString() === newUserId) {
      return NextResponse.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      );
    }

    // Create referral relationship
    const referral = new ReferralModel({
      referrerId: codeDoc.userId,
      referredId: newUserId,
      referralCode: referralCode.toUpperCase(),
      status: "pending",
    });

    await referral.save();

    // Update referral code stats
    await ReferralCodeModel.findByIdAndUpdate(codeDoc._id, {
      $inc: { totalReferrals: 1 },
    });

    // Update referrer stats
    const referrer = await UserIbenModel.findById(codeDoc.userId);
    const newLevel = calculateReferralLevel((referrer?.referralPoints || 0) + 1);
    
    await UserIbenModel.findByIdAndUpdate(codeDoc.userId, {
      $inc: { 
        totalReferrals: 1,
        referralPoints: 1,
      },
      referralLevel: newLevel,
    });

    // Update new user with referral info
    await UserIbenModel.findByIdAndUpdate(newUserId, {
      usedReferralCode: referralCode.toUpperCase(),
      referredBy: codeDoc.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Referral code applied successfully",
      referrerId: codeDoc.userId,
    });
  } catch (error) {
    console.error("Error applying referral code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
