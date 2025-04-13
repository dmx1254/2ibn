import { ibenModels } from "@/lib/models/ibendouma-models";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { OrderConfirmationTemplate } from "@/app/[locale]/components/orderConfirm-template";
import { NewOrderConfirmationTemplate } from "@/app/[locale]/components/neworder-template";
import { OrderGameTemplate } from "@/app/[locale]/components/order-game-template";
import { OrderGameAdminTemplate } from "@/app/[locale]/components/order-admin-game-template";

const resend = new Resend(process.env.RESEND_2IBN_API_KEY);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const type = searchParams.get("type");
    const object = searchParams.get("object");
    
    // const { orderId, type, object } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const { OrderModelIben, UserIbenModel, GameModel } = await ibenModels;

    let order;

    if (type && type === "game") {
      order = await GameModel.findOne({ orderNum: orderId });
    } else {
      order = await OrderModelIben.findOne({ orderNum: orderId });
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Vérifier si la commande est déjà payée
    if (order.status === "paid") {
      return NextResponse.json(
        { success: true, message: "Order already paid" },
        { status: 200 }
      );
    }

    // Mettre à jour le statut de la commande
    let updatedOrder;

    if (type && type === "game") {
      updatedOrder = await GameModel.findOneAndUpdate(
        { orderNum: orderId },
        { status: "paid" },
        { new: true }
      );
    } else {
      updatedOrder = await OrderModelIben.findOneAndUpdate(
        { orderNum: orderId },
        { status: "paid" },
        { new: true }
      );
    }

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Failed to update order status" },
        { status: 500 }
      );
    }

    // Récupérer les informations de l'utilisateur
    const user = await UserIbenModel.findById(updatedOrder.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (type && type === "game") {
      // Envoyer l'email de confirmation au client
      try {
        await resend.emails.send({
          from: "Ibendouma Support <support@ibendouma.com>",
          to: ["support@ibendouma.com"],
          subject: object || "Confirmation of your order",
          react: OrderGameAdminTemplate({
            orderNum: updatedOrder.orderNum,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            telephone: user.phone,
            cur: updatedOrder.cur,
            totalPrice: updatedOrder.totalPrice,
            dateCreated: updatedOrder.createdAt,
            name: updatedOrder.name,
            amount: updatedOrder.amount,
            status: "paid",
            paymentMethod: updatedOrder.paymentMethod,
          }),
        });

        // Envoyer l'email de notification à l'administrateur
        await resend.emails.send({
          from: "Ibendouma Notification <noreply@ibendouma.com>",
          to: [user.email],
          subject: "Notification de commande de ibendouma",
          react: OrderGameTemplate({
            orderNum: updatedOrder.orderNum,
            dateCreated: new Date(),
            firstname: user.firstname,
            lastname: user.lastname,
            name: updatedOrder.name,
            amount: updatedOrder.amount,
            totalPrice: updatedOrder.totalPrice,
            cur: updatedOrder.cur,
            buyDetails: {
              status: "paid",
              paymentMethod: updatedOrder.paymentMethod,
            },
          }),
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // On continue même si l'envoi d'email échoue
      }

      return NextResponse.json(
        { success: true, message: "Order status updated successfully" },
        { status: 200 }
      );
    } else {
      // Envoyer l'email de confirmation au client
      try {
        await resend.emails.send({
          from: "Ibendouma Support <support@ibendouma.com>",
          to: [updatedOrder.billing.email],
          subject: object || "Confirmation of your order",
          react: OrderConfirmationTemplate({
            orderNum: updatedOrder.orderNum,
            firstname: updatedOrder.billing.firstname,
            lastname: updatedOrder.billing.lastname,
            cur: updatedOrder.cur,
            totalPrice: updatedOrder.totalPrice,
            dateCreated: updatedOrder.createdAt,
            products: updatedOrder.products,
            status: "paid",
            paymentMethod: updatedOrder.paymentMethod,
          }),
        });

        // Envoyer l'email de notification à l'administrateur
        await resend.emails.send({
          from: "Ibendouma Notification <noreply@ibendouma.com>",
          to: ["support@ibendouma.com"],
          subject: "Notification de commande de ibendouma",
          react: NewOrderConfirmationTemplate({
            orderNum: updatedOrder.orderNum,
            dateCreated: new Date(),
            type: "Commande d'achat",
            billing: {
              firstname: updatedOrder.billing.firstname,
              lastname: updatedOrder.billing.lastname,
              email: updatedOrder.billing.email || user?.email,
              phone: updatedOrder.billing.phone || user?.phone,
            },
            products: updatedOrder.products,
            totalPrice: updatedOrder.totalPrice,
            cur: updatedOrder.cur,
            buyDetails: {
              status: "paid",
              paymentMethod: updatedOrder.paymentMethod,
            },
          }),
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // On continue même si l'envoi d'email échoue
      }

      return NextResponse.json(
        { success: true, message: "Order status updated successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error in PayPal success route:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
