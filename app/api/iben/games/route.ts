import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function GET() {
  const { GameModel } = await ibenModels;

  try {
    const games = await GameModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json(games, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
