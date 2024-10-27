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

const CartPage: React.FC = () => {
  const tScope = useScopedI18n("cartpage");
  const { carts, removeFromCart, updateToCart, clearCart } = useStore();
  const [activePaymentMethod, setActivePaymentMethod] = useState("");
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);

  const subtotal = carts.reduce((total, item) => total + item.totalPrice, 0);
  const shipping = 0.0;
  const total = subtotal + shipping;

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
      userId: "63c52df8f1adcc81fad062b3",
      orderNum: orderBuyNumGenerated(),
      products: products,
      address: "Casablanca Ain sbaa",
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
    <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8  min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="lg:flex gap-8 p-6 lg:p-8">
          <div className="lg:w-2/3 mb-8 lg:mb-0">
            <Link href="/" className="flex items-center mb-6">
              <ArrowLeft className="mr-2 cursor-pointer" />
              <h1 className="text-xl font-semibold">{tScope("returnLink")}</h1>
            </Link>
            <h2 className="text-lg font-semibold mb-2">{tScope("subtitle")}</h2>
            <p className="text-sm text-gray-500 mb-6">
              {tScope("itemhave", {
                items: carts.length,
                item: carts.length !== 1 ? "s" : "",
              })}
            </p>
            <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-4 -mr-4 scroll-thumb">
              {carts.length <= 0 ? (
                <EmptyCart />
              ) : (
                carts.map((item: Cart) => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl transition-all duration-300"
                    style={{
                      boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                    }}
                  >
                    <Image
                      src={imageReturn(item.category)}
                      alt={item.server}
                      width={80}
                      height={80}
                      className="rounded-lg"
                    />
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-semibold capitalize text-lg mb-1">
                        {item.category.split("-").join(" ")}
                      </h3>
                      <p className="text-sm opacity-75 mb-1">
                        {tScope("server")}: {item.server}
                      </p>
                      <p className="text-sm opacity-75">
                        {tScope("character")}: {item.character}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 sm:mt-0">
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateToCart(
                              item.productId,
                              Math.max(1, item.amount - 1)
                            )
                          }
                          className="text-current hover:opacity-75 focus:outline-none bg-indigo-200 rounded-full p-2 transition-colors duration-200 shadow-sm"
                        >
                          <Minus size={16} className="text-black/90" />
                        </button>
                        <span className="mx-3 font-medium">{item.amount}</span>
                        <button
                          onClick={() =>
                            updateToCart(item.productId, item.amount + 1)
                          }
                          className="text-current hover:opacity-75 focus:outline-none bg-indigo-200 rounded-full p-2 transition-colors duration-200 shadow-sm"
                        >
                          <Plus size={16} className="text-black/90" />
                        </button>
                      </div>
                      <span className="font-semibold whitespace-nowrap">
                        {item.totalPrice.toFixed(2)}{" "}
                        {parsedDevise(item.currency)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="text-current hover:opacity-75 text-indigo-200 rounded-full p-2 transition-colors duration-200 shadow-sm"
                      >
                        <Trash2 size={20} className="text-black/60" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="lg:w-1/3 bg-indigo-600 p-6 rounded-2xl lg:sticky lg:top-8 self-start">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {tScope("orderSummary")}
            </h2>
            <div className="mb-6">
              <p className="text-sm text-indigo-200 mb-3">
                {tScope("paymethod")}
              </p>
              <div className="space-y-3">
                {["cards", "paypal", "crypto", "cardspay", "trc20"].map(
                  (method) => (
                    <button
                      key={method}
                      className={clsx(
                        "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                        activePaymentMethod === method
                          ? "bg-indigo-500 shadow-md"
                          : "bg-indigo-700 hover:bg-indigo-500"
                      )}
                      onClick={() => setActivePaymentMethod(method)}
                    >
                      <Image
                        src={`/pay/${method}.png`}
                        alt={method}
                        width={120}
                        height={30}
                        className="h-6 w-auto"
                      />
                      <Check
                        size={22}
                        className={clsx("transition-colors duration-200", {
                          "text-green-400": activePaymentMethod === method,
                          "text-indigo-400": activePaymentMethod !== method,
                        })}
                      />
                    </button>
                  )
                )}
              </div>
            </div>
            <div className="border-t border-indigo-500 pt-4 mb-6">
              <div className="flex justify-between mb-2 text-indigo-200">
                <span>{tScope("subtotal")}</span>
                <span>
                  {subtotal.toFixed(2)} {parsedDevise(carts[0]?.currency)}
                </span>
              </div>
              <div className="flex justify-between mb-2 text-indigo-200">
                <span>{tScope("shipping")}</span>
                <span>
                  {shipping.toFixed(2)} {parsedDevise(carts[0]?.currency)}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-white text-lg mt-4">
                <span>Total (Tax incl.)</span>
                <span>
                  {total.toFixed(2)} {parsedDevise(carts[0]?.currency)}
                </span>
              </div>
            </div>
            <button
              className={clsx(
                "w-full bg-green-400 text-indigo-800 py-4 rounded-xl font-semibold text-lg hover:bg-green-300 transition-colors flex items-center justify-center",
                {
                  "opacity-75": total <= 0 || isOrderLoading,
                }
              )}
              onClick={handleCheckout}
              disabled={total <= 0 || isOrderLoading || !activePaymentMethod}
            >
              {isOrderLoading ? (
                <span className="flex items-center gap-1">
                  <Loader className="animate-spin" size={24} />
                  {tScope("checkoutLoadingBtn")}
                </span>
              ) : (
                <>
                  <span>
                    {total.toFixed(2)} {parsedDevise(carts[0]?.currency)}
                  </span>
                  <span className="ml-2">{tScope("checkout")} →</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center mx-auto w-full py-5">
        <InfoSection />
      </div>
    </div>
  );
};

export default CartPage;
