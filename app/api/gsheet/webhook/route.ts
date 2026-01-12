import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  
  try {
    const body = await req.json();
    console.log("Données reçues de Google Sheets:", body);
    
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