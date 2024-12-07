"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Trash2, Minus, Plus, Check, Loader } from "lucide-react";
import useStore from "@/lib/store-manage";
import { imageReturn, orderBuyNumGenerated, parsedDevise } from "@/lib/utils";
import { Cart } from "@/lib/types/types";
import clsx from "clsx";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";
import axios from "axios";
import { toast } from "sonner";
import InfoSection from "../components/InfoSection";
import EmptyCart from "../components/EmptyCart";
import { useSession } from "next-auth/react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import { TiDelete } from "react-icons/ti";

const CartPage: React.FC = () => {
  const { data: session } = useSession();
  const tScope = useScopedI18n("cartpage");
  const { carts, removeFromCart, updateToCart, clearCart } = useStore();
  const [activePaymentMethod, setActivePaymentMethod] = useState("");
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);

  const subtotal = carts.reduce((total, item) => total + item.totalPrice, 0);
  const shipping = 0.0;
  const total = subtotal + shipping;

  // console.log(carts);

  const handleCheckout = async () => {
    const products = carts.map((cart) => {
      return {
        productId: cart.productId,
        category: cart.category,
        server: cart.server,
        qty: cart.qty,
        amount: cart.amount,
        price: cart.unitPrice.toFixed(2),
        character: cart.character,
        totalPrice: cart.totalPrice.toFixed(2),
      };
    });
    const data = {
      userId: session?.user.id,
      orderNum: orderBuyNumGenerated(),
      products: products,
      address: "",
      status: "En attente",
      totalPrice: total.toFixed(2),
      paymentMethod: activePaymentMethod,
      orderIdPaid: "",
      cur: carts[0]?.currency,
      valCurency: Number(carts[0]?.valCurrency),
    };
    try {
      setIsOrderLoading(true);
      const result = await axios.post("/api/iben/order", data);
      if (result.data) {
        toast.success(tScope("success"), {
          style: { color: "#16a34a" },
        });

        setTimeout(() => {
          clearCart();
        }, 2000);
      }
    } catch (error) {
      toast.success(tScope("error"), {
        style: { color: "#dc2626" },
      });
    } finally {
      setIsOrderLoading(false);
    }
  };

  return (
    <div className="w-full py-6 sm:py-12 px-4 sm:px-6 lg:px-8  min-h-screen">
      {carts.length <= 0 ? (
        <EmptyCart />
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 overflow-hidden">
          <div className="w-full bg-white">
            <Table className="w-full text-black/80 text-center">
              <TableHeader>
                <TableRow className="bg-[#151d20] border-[#76828D]">
                  <TableHead className="text-amber-600 text-left">
                    <span className="md:ml-12">{tScope("name")}</span>
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:hidden">
                    {tScope("jeu")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center">
                    {tScope("qty")}
                  </TableHead>

                  <TableHead className="text-amber-600 text-center">
                    {tScope("unitPrice")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center">
                    {tScope("total")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carts?.map((item, index) => (
                  <TableRow
                    className="border-gray-200 py-1"
                    style={{
                      border: index === carts.length - 1 ? "none" : "",
                    }}
                  >
                    <TableCell className="font-medium text-center">
                      <div className="flex flex-col items-start -gap-0.5">
                        <p className="uppercase text-yellow-600">
                          Kamas {item.category.split("-").join(" ")}
                        </p>
                        <p>
                          {tScope("server")}: {item.server}
                        </p>
                        <p>
                          {tScope("deliverQty")}: {item.amount}M
                        </p>
                        <p>
                          {tScope("characterName")}:{" "}
                          <strong className="text-base text-red-600 capitalize">
                            {item.character}
                          </strong>
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-center max-md:hidden">
                      <span className="uppercase">
                        {item.category.split("-").join(" ")}{" "}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      {" "}
                      <div className="inline-flex items-center">
                        <button
                          onClick={() =>
                            updateToCart(
                              item.productId,
                              Math.max(1, item.amount - 1)
                            )
                          }
                          className="text-current hover:opacity-75 focus:outline-none bg-yellow-600 rounded-tl-full rounded-bl-full p-1.5 transition-colors duration-200 shadow-sm"
                          aria-label="Decrease cart amount"
                        >
                          <Minus size={16} className="text-black/80" />
                        </button>
                        <span className="mx-3 font-medium">{item.amount}</span>
                        <button
                          onClick={() =>
                            updateToCart(item.productId, item.amount + 1)
                          }
                          className="text-current hover:opacity-75 focus:outline-none bg-yellow-600 rounded-tr-full rounded-br-full p-1.5 transition-colors duration-200 shadow-sm"
                          aria-label="Increase cart amount"
                        >
                          <Plus size={16} className="text-black/80" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <span className="font-semibold whitespace-nowrap">
                        {item.unitPrice.toFixed(2)}
                        {parsedDevise(item.currency)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-left md:text-center">
                      <div className="inline-flex items-center">
                        <span>
                          {item.totalPrice.toFixed(2)}
                          {parsedDevise(item.currency)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="bg-red-600 text-white rounded hover:opacity-75 p-0.5 ml-1.5 transition-colors duration-200 shadow-sm"
                          aria-label="Remove from cart"
                        >
                          <TiDelete />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="w-full border-gray-200">
                  <TableCell
                    className="font-medium text-end self-end"
                    colSpan={5}
                  >
                    <div className="w-full text-right">
                      <p className="w-full">
                        {tScope("sousTotal")}:{" "}
                        <span className="ml-12">
                          {subtotal.toFixed(2)}
                          {parsedDevise(carts[0].currency)}
                        </span>
                      </p>

                      <p className="w-full mt-4">
                        {tScope("total")}:{" "}
                        <span className="ml-12">
                          {total.toFixed(2)}
                          {parsedDevise(carts[0].currency)}
                        </span>
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="w-full flex items-center justify-between p-4 border border-gray-200">
            <Link
              href="/"
              className="bg-black/80 text-white/80 p-2 rounded transition-colors hover:bg-black/90"
            >
              {tScope("continueShop")}
            </Link>
            <Link
              href="/checkout"
              className="bg-black/80 text-white/80 p-2 rounded transition-colors hover:bg-black/90"
            >
              {tScope("order")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
