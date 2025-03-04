import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(request: Request) {
  const { UserIbenModel } = await ibenModels;
  try {
    const { userId, password } = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserIbenModel.findByIdAndUpdate(
      userId,
      {
        $set: { password: hashedPassword },
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({successMessage: "Password reset successfully"}, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
