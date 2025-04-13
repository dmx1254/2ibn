// import { NextResponse } from "next/server";
// import { ibenModels } from "@/lib/models/ibendouma-models";
// import { NowPaymentsIPN } from "@/lib/utils";
// import { Resend } from "resend";
// import crypto from "crypto";
// import { OrderConfirmationTemplate } from "@/app/[locale]/components/orderConfirm-template";
// import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";

// const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

// // Fonction récursive pour trier les clés d'un objet (équivalent à tksort en PHP)
// function sortObjectKeys(obj: any): any {
//   // Si ce n'est pas un objet, retourner tel quel
//   if (typeof obj !== "object" || obj === null) {
//     return obj;
//   }

//   // Si c'est un tableau, trier les éléments du tableau
//   if (Array.isArray(obj)) {
//     return obj.map(sortObjectKeys);
//   }

//   // Créer un nouvel objet avec les clés triées
//   const sortedObj: Record<string, any> = {};
//   const keys = Object.keys(obj).sort();

//   for (const key of keys) {
//     sortedObj[key] = sortObjectKeys(obj[key]);
//   }

//   return sortedObj;
// }

// export async function POST(req: Request) {
//   const headers = new Headers();
//   headers.set("Access-Control-Allow-Origin", "*");
//   headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
//   headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Nowpayments-Sig"
//   );
//   const { OrderModelIben, UserIbenModel } = await ibenModels;

//   try {
//     const ipnSecret = process.env.NOWPAYMENT_IPN_SECRET;
//     if (!ipnSecret) {
//       console.error(
//         "NOWPAYMENT_IPN_SECRET is not defined in environment variables"
//       );
//       return new NextResponse(
//         JSON.stringify({ error: "Server configuration error" }),
//         {
//           status: 500,
//           headers,
//         }
//       );
//     }

//     // Récupérer la signature HMAC de l'en-tête
//     const receivedHmac = req.headers.get("x-nowpayments-sig");

//     if (!receivedHmac) {
//       console.error("No HMAC signature sent");
//       return new NextResponse(
//         JSON.stringify({ error: "No HMAC signature sent" }),
//         {
//           status: 400,
//           headers,
//         }
//       );
//     }

//     // Récupérer le contenu brut de la requête
//     const requestJson = await req.text();

//     if (!requestJson) {
//       console.error("Error reading POST data");
//       return new NextResponse(
//         JSON.stringify({ error: "Error reading POST data" }),
//         {
//           status: 400,
//           headers,
//         }
//       );
//     }

//     // Parser le JSON
//     const requestData = JSON.parse(requestJson) as NowPaymentsIPN;

//     // Trier les clés de l'objet récursivement
//     const sortedData = sortObjectKeys(requestData);

//     // Convertir en JSON avec les mêmes options que PHP
//     const sortedJson = JSON.stringify(sortedData, null, 0).replace(
//       /\//g,
//       "\\/"
//     );

//     // Calculer le HMAC
//     const hmac = crypto
//       .createHmac("sha512", ipnSecret.trim())
//       .update(sortedJson)
//       .digest("hex");

//     // Vérifier que les signatures correspondent
//     if (hmac !== receivedHmac) {
//       console.error("HMAC signature does not match");
//       return new NextResponse(
//         JSON.stringify({ error: "HMAC signature does not match" }),
//         {
//           status: 401,
//           headers,
//         }
//       );
//     }

//     // Si tout est OK, traiter la notification IPN
//     console.log("IPN verification successful", requestData);

//     // Récupérer les détails que vous souhaitez
//     const {
//       payment_id,
//       payment_status,
//       order_id,
//       price_amount,
//       price_currency,
//       pay_amount,
//       pay_currency,
//       created_at,
//       updated_at,
//     } = requestData;

//     if (order_id) {
//       const order = await OrderModelIben.findOne({ orderNum: order_id });
//       if (!order) {
//         return new NextResponse(JSON.stringify({ error: "Order not found" }), {
//           status: 404,
//           headers,
//         });
//       }

//       if (order.status === "paid") {
//         return NextResponse.json(
//           { success: true, message: "Order already paid" },
//           { status: 200, headers }
//         );
//       }

//       if (payment_status === "finished" || payment_status === "confirmed") {
//         // Mettre à jour le statut de la commande
//         const updatedOrder = await OrderModelIben.findOneAndUpdate(
//           { orderNum: order_id },
//           { status: "paid" },
//           { new: true }
//         );
//         if (updatedOrder) {
//           // Récupérer les informations de l'utilisateur
//           const user = await UserIbenModel.findById(updatedOrder.userId);
//           if (!user) {
//             console.error("User not found for order:", order_id);
//             return NextResponse.json(
//               { success: true, message: "Order updated but user not found" },
//               { status: 200, headers }
//             );
//           }

//           // Envoyer l'email de confirmation au client
//           try {
//             await resend.emails.send({
//               from: "Ibendouma Support <support@ibendouma.com>",
//               to: [user.email],
//               subject: "Confirmation of your order",
//               react: OrderConfirmationTemplate({
//                 orderNum: updatedOrder.orderNum,
//                 firstname: updatedOrder.billing.firstname,
//                 lastname: updatedOrder.billing.lastname,
//                 cur: updatedOrder.cur,
//                 totalPrice: updatedOrder.totalPrice,
//                 dateCreated: updatedOrder.createdAt,
//                 products: updatedOrder.products,
//                 status: "paid",
//                 paymentMethod: "crypto-nowpayment",
//               }),
//             });

//             // Envoyer l'email de notification à l'administrateur
//             await resend.emails.send({
//               from: "Ibendouma Notification <noreply@ibendouma.com>",
//               to: ["support@ibendouma.com"],
//               subject: "Notification de commande de ibendouma",
//               react: NewOrderConfirmationTemplate({
//                 orderNum: updatedOrder.orderNum,
//                 dateCreated: new Date(),
//                 type: "Commande d'achat",
//                 billing: {
//                   firstname: updatedOrder.billing.firstname,
//                   lastname: updatedOrder.billing.lastname,
//                   email: updatedOrder.billing.email || user?.email,
//                   phone: updatedOrder.billing.phone || user?.phone,
//                 },
//                 products: updatedOrder.products,
//                 totalPrice: updatedOrder.totalPrice,
//                 cur: updatedOrder.cur,
//                 buyDetails: {
//                   status: "paid",
//                   paymentMethod: "crypto-nowpayment",
//                 },
//               }),
//             });
//           } catch (emailError) {
//             console.error("Error sending email:", emailError);
//             // On continue même si l'envoi d'email échoue
//           }

//           return NextResponse.json(
//             { success: true, message: "Order status updated successfully" },
//             { status: 200 }
//           );
//         }
//         return NextResponse.json(
//           { message: "Order not updated" },
//           { status: 500, headers }
//         );
//       } else {
//         // Mettre à jour avec le statut approprié
//         await OrderModelIben.findOneAndUpdate(
//           { orderNum: order_id },
//           { status: payment_status },
//           { new: true }
//         );

//         return NextResponse.json(
//           {
//             success: true,
//             message: `Order status updated to ${payment_status}`,
//           },
//           { status: 200 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { success: true, message: "IPN processed but no order_id found" },
//       { status: 200, headers }
//     );
//   } catch (error) {
//     return NextResponse.json(error, { status: 500, headers });
//   }
// }

// // Gestion des requêtes OPTIONS pour CORS
// export async function OPTIONS() {
//   const headers = new Headers();
//   headers.set("Access-Control-Allow-Origin", "*");
//   headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
//   headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Nowpayments-Sig"
//   );

//   return new NextResponse(null, {
//     status: 200,
//     headers,
//   });
// }
