import { ibenModels } from "@/lib/models/ibendouma-models";
import { goapiModels } from "@/lib/models/ibytrade-models";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");

  const { OrderModelIben } = await ibenModels;
  const { ExchangeModel, BuyModel } = await goapiModels;
  
  try {
    const data = await req.json();
    // console.log("Données reçues de Google Sheets:", data);

    if(data.sheetName === "Orders echanges"){
      await ExchangeModel.findByIdAndUpdate(data.rowData.idCommande, {
        $set: {
          status: data.rowData.etatCommande,
        }
      })
    }


    if(data.sheetName === "Orders achats"){
      await BuyModel.findByIdAndUpdate(data.rowData.idCommande, {
        $set: {
          status: data.rowData.etatCommande,
        }
      })
    }


    if(data.sheetName === "Orders ventes"){
      await OrderModelIben.findByIdAndUpdate(data.rowData.idCommande, {
        $set: {
          status: data.rowData.etatCommande,
        }
      })
    }


    
    // Ici vous pouvez traiter les données et les sauvegarder en MongoDB
    // await saveToMongoDB(body);
    
    return NextResponse.json({ 
      message: "Webhook received successfully",
      received: true 
    }, { headers });
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