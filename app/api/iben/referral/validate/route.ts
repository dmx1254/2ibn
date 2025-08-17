import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ReferralCode, User } from "@/lib/models/ibendouma-models";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    // Find the referral code
    const codeDoc = await ReferralCode.findOne({ 
      code: referralCode.toUpperCase(),
      isActive: true 
    });

    if (!codeDoc) {
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

    // Get referrer information
    const referrer = await User.findById(codeDoc.userId);
    if (!referrer) {
      return NextResponse.json(
        { error: "Referrer not found" },
        { status: 404 }
      );
    }

    // Check if referrer is banned
    if (referrer.isBan) {
      return NextResponse.json(
        { error: "Referrer account is banned" },
        { status: 400 }
      );
    }

    // Check if referrer email is verified
    if (!referrer.isEmailVerified) {
      return NextResponse.json(
        { error: "Referrer email is not verified" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Referral code is valid",
      referrerId: codeDoc.userId,
      referrerName: `${referrer.firstname} ${referrer.lastname}`.trim() || referrer.email,
      maxReferrals: codeDoc.maxReferrals,
      currentReferrals: codeDoc.totalReferrals,
      remainingReferrals: codeDoc.maxReferrals - codeDoc.totalReferrals,
    });
  } catch (error) {
    console.error("Error validating referral code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
