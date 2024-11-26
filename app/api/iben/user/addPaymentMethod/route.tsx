import { NextResponse } from "next/server";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(req: Request) {
  const { UserPaymentModel } = await ibenModels;
  try {
    const data = await req.json();
    const response = await UserPaymentModel.create(data);
    if (response) {
      return NextResponse.json(
        { successMessage: "Nouvelle méthode de paiement ajoutée" },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
