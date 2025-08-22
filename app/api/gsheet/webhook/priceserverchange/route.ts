// import { ibenModels } from "@/lib/models/ibendouma-models";
// import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  const { ServerModel, SkrillSepaModel } = await goapiModels;
  const { EuroModelIben, DollarModelIben, CadModelIben, ServerModelIben } =
    await ibenModels;

  //   const { OrderModelIben } = await ibenModels;
  //   const { ExchangeModel, BuyModel } = await goapiModels;

  try {
    const data = await req.json();
    // console.log("Données reçues de Google Sheets:", data);

    const server = await ServerModel.findOne({
      serverName: data.rowData.server,
    });
    // console.log(server);

    if (!server) {
      return NextResponse.json(
        {
          message: "Server not found",
          received: false,
        },
        { headers }
      );
    }

    if (data.columnLetter === "F") {
      await ServerModel.findByIdAndUpdate(server._id, {
        $set: {
          serverStatus: data.rowData.etatServeur,
        },
      });
    }
    if (data.columnLetter === "G") {
      await ServerModelIben.findByIdAndUpdate(server._id, {
        $set: {
          serverPrice: Number(data.rowData.prixVenteFace),
        },
      });
    }

    if (data.columnLetter === "D") {
      await ServerModel.findByIdAndUpdate(server._id, {
        $set: {
          serverPriceDh: Number(data.rowData.prixAchatFace),
        },
      });
    }

    if (data.columnLetter === "E") {
      await ServerModel.findByIdAndUpdate(server._id, {
        $set: {
          rate: data.rowData.tauxChange,
        },
      });
    }

    if (data.columnLetter === "I") {
      const euro = await EuroModelIben.find();

      await EuroModelIben.findByIdAndUpdate(euro[0]._id, {
        $set: {
          euro: Number(data.rowData.euro),
        },
      });
    }
    if (data.columnLetter === "J") {
      const dollar = await DollarModelIben.find();

      await DollarModelIben.findByIdAndUpdate(dollar[0]._id, {
        $set: {
          dollar: Number(data.rowData.dollar),
        },
      });
    }
    if (data.columnLetter === "K") {
      const cad = await CadModelIben.find();

      await CadModelIben.findByIdAndUpdate(cad[0]._id, {
        $set: {
          cad: Number(data.rowData.cad),
        },
      });
    }
    if (data.columnLetter === "L") {
      const skrillsepa = await SkrillSepaModel.find();

      await SkrillSepaModel.findByIdAndUpdate(skrillsepa[0]._id, {
        $set: {
          skrillSepa: Number(data.rowData.skrillSepa),
        },
      });
    }

    // Ici vous pouvez traiter les données et les sauvegarder en MongoDB
    // await saveToMongoDB(body);

    return NextResponse.json(
      {
        message: "Webhook received successfully",
        received: true,
      },
      { headers }
    );
  } catch (error) {
    console.error("Erreur webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 500, headers }
    );
  }
}

export async function OPTIONS() {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type"); // Retiré Authorization

  return new NextResponse(null, {
    status: 200,
    headers,
  });
}
