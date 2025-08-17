import { NextResponse } from "next/server";
import { getSheetInfo } from "@/lib/googleSheets";

export async function GET() {
  try {
    const sheetInfo = await getSheetInfo();
    return NextResponse.json(sheetInfo);
  } catch (error) {
    console.error("Erreur info Google Sheets:", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
