import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const verifyToken = await jwt.verify(token, process.env.TOKEN_SECRET!);

    return NextResponse.json(verifyToken, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error, { status: 500 });
  }
}
