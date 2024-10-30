import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { UserIbenModel } = await ibenModels;
  try {
    const { userId } = params;
    const { currentPassword, newPassword } = await request.json();

    const user = await UserIbenModel.findById(userId);

    const checkValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!checkValidPassword)
      return NextResponse.json(
        { errorMessage: "Current password is different from your password" },
        { status: 500 }
      );

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserIbenModel.findByIdAndUpdate(
      userId,
      {
        $set: { password: hashedPassword },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { successMessage: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
