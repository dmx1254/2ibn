import { NextResponse } from "next/server";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { ibenModels } from "@/lib/models/ibendouma-models";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  try {
    const data = await req.json();
    const { ServerModel, EuroModel, AedModel, DollarModel } =
      await goapiModels;
    const { ServerModelIben, EuroModelIben, MadModelIben, CadModelIben } =
      await ibenModels;

    // console.log(data);
    // return;

    if (data.sheetName === "servers" && data.column === 13) {
      const euro = await EuroModel.find();
      await EuroModel.findByIdAndUpdate(euro[0]._id, {
        $set: {
          euro: Number(data.rowData.row13),
        },
      });
      return NextResponse.json(
        {
          message: "Euro updated successfully",
          received: true,
        },
        { headers }
      );
    }

    if (data.sheetName === "servers" && data.column === 15) {
      const dollar = await DollarModel.find();
      await DollarModel.findByIdAndUpdate(dollar[0]._id, {
        $set: {
          dollar: Number(data.rowData.row15),
        },
      });
      return NextResponse.json(
        {
          message: "Dollar updated successfully",
          received: true,
        },
        { headers }
      );
    }

    if (data.sheetName === "servers" && data.column === 17) {
      const aed = await AedModel.find();
      await AedModel.findByIdAndUpdate(aed[0]._id, {
        $set: {
          aed: Number(data.rowData.row17),
        },
      });
      return NextResponse.json(
        {
          message: "Aed updated successfully",
          received: true,
        },
        { headers }
      );
    }

    if (data.sheetName === "servers" && data.column === 19) {
      const euroiben = await EuroModelIben.find();
      await EuroModelIben.findByIdAndUpdate(euroiben[0]._id, {
        $set: {
          euro: Number(data.rowData.row19),
        },
      });
      return NextResponse.json(
        {
          message: "Euroiben updated successfully",
          received: true,
        },
        { headers }
      );
    }

    if (data.sheetName === "servers" && data.column === 21) {
      const mad = await MadModelIben.find();
      await MadModelIben.findByIdAndUpdate(mad[0]._id, {
        $set: {
          mad: Number(data.rowData.row21),
        },
      });
      return NextResponse.json(
        {
          message: "Madiben updated successfully",
          received: true,
        },
        { headers }
      );
    }

    if (data.sheetName === "servers" && data.column === 22) {
      const cadiben = await CadModelIben.find();
      await CadModelIben.findByIdAndUpdate(cadiben[0]._id, {
        $set: {
          cad: Number(data.rowData.row22),
        },
      });
      return NextResponse.json(
        {
          message: "Aediben updated successfully",
          received: true,
        },
        { headers }
      );
    }

    const serverVenteUpdated = [];
    const serverAchatUpdated = [];

    // Server Vente mis à jour
    const serverDetail = data.rowData;
    const serverVenteConcerned = await ServerModel.findOne({
      serverName: serverDetail.server,
    });

    if (serverVenteConcerned) {
      const updatedServer = await ServerModel.findByIdAndUpdate(
        serverVenteConcerned._id,
        {
          serverPriceDh: serverDetail.prixachat
            ? Number(serverDetail.prixachat)
            : serverVenteConcerned.serverPriceDh,
          serverStatus: serverDetail.status
            ? serverDetail.status
            : serverVenteConcerned.serverStatus,
          rate: serverDetail.tauxchange
            ? Number(serverDetail.tauxchange)
            : serverVenteConcerned.rate,
        },
        { new: true }
      );
      serverVenteUpdated.push(updatedServer);
    } else {
      if (
        serverDetail.server &&
        serverDetail.category &&
        serverDetail.status &&
        serverDetail.prixachat &&
        typeof serverDetail.prixachat === "number" &&
        serverDetail.tauxchange &&
        typeof serverDetail.tauxchange === "number"
      ) {
        await ServerModel.create({
          serverName: serverDetail.server,
          serverCategory: serverDetail.category,
          serverStatus: serverDetail.status,
          serverPriceDh: serverDetail.prixachat
            ? Number(serverDetail.prixachat)
            : 0,
          serverMinQty: 1000000,
          rate: serverDetail.tauxchange,
        });
        console.log("Server created successfully");
        return NextResponse.json(
          {
            message: "Server created successfully",
            received: true,
          },
          { headers }
        );
      } else {
        console.log("Server not created");
      }
    }

    // Server Achat mis à jour

    const serverAchatConcerned = await ServerModelIben.findOne({
      serverName: serverDetail.server,
    });
    if (serverAchatConcerned) {
      const updatedServer = await ServerModelIben.findByIdAndUpdate(
        serverAchatConcerned._id,
        {
          serverPrice: serverDetail.prixvente
            ? Number(serverDetail.prixvente)
            : serverAchatConcerned.serverPrice,
          serverStatus: serverDetail.status
            ? serverDetail.status
            : serverAchatConcerned.serverStatus,
        },
        { new: true }
      );
      serverAchatUpdated.push(updatedServer);
    } else {
      if (
        serverDetail.server &&
        serverDetail.category &&
        serverDetail.status &&
        serverDetail.prixvente &&
        typeof serverDetail.prixvente === "number"
      ) {
        await ServerModelIben.create({
          serverName: serverDetail.server,
          serverCategory: serverDetail.category,
          serverStatus: serverDetail.status,
          serverPrice: serverDetail.prixvente
            ? Number(serverDetail.prixvente)
            : 0,
          serverMinQty: 1000000,
        });
      }
      console.log("Server not created");
      return NextResponse.json(
        {
          message: "Server not created",
          received: false,
        },
        { headers }
      );
    }

    // console.log(serverVenteUpdated);
    // console.log(serverAchatUpdated);

    return NextResponse.json(
      {
        serverVenteUpdated: serverVenteUpdated,
        serverAchatUpdated: serverAchatUpdated,
        message: "Webhook received successfully",
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

export async function GET() {
  try {
    const { ServerModelIben } = await ibenModels;
    const servers = await ServerModelIben.find();
    return NextResponse.json(servers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching servers" },
      { status: 500 }
    );
  }
}
