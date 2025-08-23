import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import {
  addSingleUserClientToSheet,
  UserClient,
} from "@/lib/orderSheets-exchange";

export async function POST(request: Request) {
  const { UserIbenModel, CodeIbenModel, ReferralCodeModel } = await ibenModels;
  try {
    const data = await request.json();

    const existingUser = await UserIbenModel.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { userError: "This user with this email is already registered" },
        { status: 500 }
      );
    } else {
      const hashedPasspord = await bcrypt.hash(data.password, 10);
      const user = {
        ...data,
        password: hashedPasspord,
      };
      await UserIbenModel.create(user);
      if (user.code) {
        await CodeIbenModel.findOneAndDelete({ code: user.code });
      }
      if (data.referralCode) {
        const referralCode = await ReferralCodeModel.findOne({
          code: data.referralCode,
        });
        if (referralCode) {
          await ReferralCodeModel.findOneAndUpdate(
            { code: data.referralCode },
            { $inc: { totalReferrals: 1, totalPoints: 1 } }
          );
          await UserIbenModel.findOneAndUpdate(
            { email: data.email },
            {
              $set: {
                referralCode: data.referralCode,
                usedReferralCode: data.referralCode,
                referredBy: referralCode.userId,
                referralPoints: referralCode.totalPoints + 1,
                totalReferrals: referralCode.totalReferrals + 1,
                referralLevel: referralCode.referralLevel,
              },
            }
          );
        }
      }

      const userData: UserClient = {
        lastname: user.lastname,
        firstname: user.firstname,
        email: user.email,
        phone: user.phone,
      };
      await addSingleUserClientToSheet(userData);

      return NextResponse.json(
        { successMessage: "Your account has been created" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
