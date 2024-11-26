import { NextResponse } from "next/server";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(req: Request) {
  const { UserPaymentModel } = await ibenModels;
  try {
    const { id } = await req.json();
    await UserPaymentModel.findByIdAndDelete(id);

    return NextResponse.json(
      { successMessage: "Méthode de paiement supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
