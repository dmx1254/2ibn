import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const { UserIbenModel, CodeIbenModel } = await ibenModels;
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
      await CodeIbenModel.findOneAndDelete({ code: user.code });
      return NextResponse.json(
        { successMessage: "Your account has been created" },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
