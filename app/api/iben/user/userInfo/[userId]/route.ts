import { NextResponse } from "next/server";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { UserIbenModel } = await ibenModels;
  try {
    const { userId } = params;
    const data = await request.json();

    const userExist = await UserIbenModel.findById(userId);
    if (!userExist) {
      return NextResponse.json(
        { errorMessage: "Utilisateur non trouvé" },
        { status: 500 }
      );
    }

    // Fusionner les données existantes avec les nouvelles données, en préférant les nouvelles données lorsqu'elles sont disponibles
    const donneesMAJ = {
      ...userExist.toObject(),
      ...Object.fromEntries(
        Object.entries(data).filter(
          ([_, valeur]) => valeur !== undefined && valeur !== ""
        )
      ),
    };

    await UserIbenModel.findByIdAndUpdate(
      userId,
      { $set: donneesMAJ },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      {
        successMessage:
          "User information updated successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
