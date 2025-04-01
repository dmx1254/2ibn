// import { ibenModels } from "@/lib/models/ibendouma-models";
// import { NextResponse } from "next/server";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const orderId = searchParams.get("orderId");

//     if (!orderId) {
//       return NextResponse.json(
//         { success: false, message: "Order ID is required" },
//         { status: 400 }
//       );
//     }

//     const { OrderModelIben } = await ibenModels;

//     // Vérifier si la commande existe
//     const order = await OrderModelIben.findOne({ orderNum: orderId });
//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Order not found" },
//         { status: 404 }
//       );
//     }

//     // Supprimer la commande en cas d'échec
//     await OrderModelIben.deleteOne({ orderNum: orderId });

//     return NextResponse.json(
//       { success: true, message: "Order deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error in PayPal failed route:", error);
//     return NextResponse.json(
//       { success: false, message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }