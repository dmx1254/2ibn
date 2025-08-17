import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Hello word");
    return NextResponse.json(
      {
        message: "Hello World",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
