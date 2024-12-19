import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { UserIbenModel } = await ibenModels;
    const data = await req.json();
    // console.log(data);

    if (!data.userId) return NextResponse.json({ userIdError: "Id invalide" });

    await UserIbenModel.findByIdAndUpdate(
      data.userId,
      {
        $set: {
          online: data.online,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return NextResponse.json({
      successMessage: "Status mis à jour avec succès",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
