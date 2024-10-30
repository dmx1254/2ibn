import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { UserIbenModel } = await ibenModels;
  try {
    const { userId } = params;
    // console.log("userId: " + userId);
    const user = await UserIbenModel.findById(userId);
    user.password = undefined;
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
