import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { CodeIbenModel } = await ibenModels;

  try {
    const { code } = await request.json();
    const codeFind = await CodeIbenModel.findOne({ code: code });
    if (!codeFind)
      return NextResponse.json(
        { codeError: "The code you entered is invalid" },
        { status: 500 }
      );

    return NextResponse.json(codeFind);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
