"use client";

import React from "react";
import { Minus, Plus } from "lucide-react";
import useStore from "@/lib/store-manage";
import { parsedDevise } from "@/lib/utils";
import Link from "next/link";
import { useScopedI18n } from "@/locales/client";
import EmptyCart from "../components/EmptyCart";

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
  const tScope = useScopedI18n("cartpage");
  const tScope2 = useScopedI18n("hero");
  const { carts, removeFromCart, updateToCart, clearCart } = useStore();

  const subtotal = carts.reduce((total, item) => total + item.totalPrice, 0);
  const shipping = 0.0;
  const total = subtotal + shipping;

  // console.log(carts);

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
                    key={`${item.productId}-${index}`}
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
          <div className="w-full flex max-sm:flex-col gap-4 items-center justify-between p-4 border border-gray-200">
            <Link
              href="/"
              className="bg-black/80 max-sm:w-full text-center text-white/80 p-2 rounded transition-colors hover:bg-black/90"
            >
              {tScope("continueShop")}
            </Link>

            <Link
              href="/checkout"
              className="bg-black/80 max-sm:w-full text-center text-white/80 p-2 rounded transition-colors hover:bg-black/90"
            >
              {tScope("order")}
            </Link>
          </div>
          {carts.length > 0 && (
            <button
              onClick={() => clearCart()}
              className="bg-black/80 max-sm:w-full text-center text-white/80 p-2 rounded transition-colors hover:bg-black/90"
              aria-label="Clear cart"
            >
              {tScope2("clearCart")}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPage;
