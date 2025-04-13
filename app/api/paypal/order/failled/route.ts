import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const type = searchParams.get("type");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const { OrderModelIben, GameModel } = await ibenModels;

    // Vérifier si la commande existe

    if (type && type === "game") {
      await GameModel.deleteOne({ orderNum: orderId });
      return NextResponse.json(
        { success: true, message: "Order deleted successfully" },
        { status: 200 }
      );
    } else {
      await OrderModelIben.deleteOne({ orderNum: orderId });
      return NextResponse.json(
        { success: true, message: "Order deleted successfully" },
        { status: 200 }
      );
    }

    // Supprimer la commande en cas d'échec
  } catch (error) {
    console.error("Error in PayPal failed route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
