"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Package,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import useStore from "@/lib/store-manage";
import { OrderBuy, Product } from "@/lib/types/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parsedDevise } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";

const ProfileBuyPage = () => {
  const tScope = useScopedI18n("ordersBuyKamas");
  const { devise } = useStore();
  const { data: session } = useSession();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const {
    isLoading,
    data: ordersBuy,
    error,
  } = useQuery({
    queryKey: ["user-order-buy", session?.user.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/iben/orderbuys/${session?.user.id}`
      );
      return response.data as OrderBuy[];
    },
    enabled: !!session?.user.id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // console.log(ordersBuy);

  const toggleOrderExpansion = (orderNum: string) => {
    setExpandedOrder(expandedOrder === orderNum ? null : orderNum);
  };

  const totalSum = ordersBuy?.reduce((acc, item) => acc + item.totalPrice, 0);
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "terminée":
        return "bg-green-500";
      case "en attente":
        return "bg-yellow-500";
      case "en cours de payment":
        return "bg-blue-500";
      case "annulée":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 text-red-500">
        Error loading orders
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      <h1 className="text-4xl font-bold text-black mb-8">{tScope("title")}</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {tScope("cardTotalSales")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {totalSum?.toFixed(2) || 0}
                {ordersBuy
                  ? parsedDevise(ordersBuy[0]?.cur)
                  : parsedDevise(devise.currencyName)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {tScope("cardTotalOrders")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersBuy?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              {tScope("cardAverage")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordersBuy?.length
                ? `${((totalSum || 0) / ordersBuy.length).toFixed(2)} ${
                    ordersBuy
                      ? parsedDevise(ordersBuy[0]?.cur)
                      : parsedDevise(devise.currencyName)
                  }`
                : parsedDevise(devise.currencyName) + "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {ordersBuy?.map((order) => (
          <Card
            key={order.orderNum}
            className="bg-white/80 backdrop-blur-sm shadow-xl"
          >
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleOrderExpansion(order.orderNum)}
            >
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-bold text-black/90">
                  {tScope("cardOrderTitle")} #{order.orderNum}
                </CardTitle>
                <div className="flex items-center space-x-4">
                  <Badge
                    className={`${getStatusColor(
                      order.status
                    )} text-white hover:bg-yellow-500`}
                  >
                    {order.status === "Terminée" && tScope("completed")}
                    {order.status === "En attente" && tScope("pending")}
                    {order.status === "Annulée" && tScope("cancelled")}
                    {order.status === "En Cours de payment" &&
                      tScope("processing")}
                  </Badge>
                  {expandedOrder === order.orderNum ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 text-black/90 mt-2 font-semibold">
                <span className="mr-4 font-semibold text-base">
                  {order.totalPrice.toFixed(2)}{" "}
                  {ordersBuy
                    ? parsedDevise(ordersBuy[0]?.cur)
                    : parsedDevise(devise.currencyName)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="inline-block w-4 h-4 mr-1" />
                  {format(new Date(), "MMMM dd, yyyy")}
                </span>
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedOrder === order.orderNum && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardContent>
                    <div className="space-y-4">
                      {order.products.map((product, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p className="font-bold text-black/80">
                              {product.category}
                            </p>
                            <p className="text-sm text-black/80 font-semibold">
                              Server: {product.server}
                            </p>
                            <p className="text-sm text-black/80 font-semibold">
                              Character: {product.character}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-black/80">
                              {product.totalPrice.toFixed(2)} {order.cur}
                            </p>
                            <p className="text-sm text-black/80 font-semibold">
                              Qty: {product.amount}M
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-base bg-yellow-600 text-black font-semibold rounded-[10px] p-2">
                        {tScope("paymentMethod")}: {order.paymentMethod}
                      </p>
                      {/* <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              aria-label="track order button"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              {tScope("track")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{tScope("trackTooltip")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider> */}
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>

      {ordersBuy?.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <p className="text-xl font-semibold text-black">
            {tScope("notFoundTitle")}
          </p>
          <p className="text-gray-600 mt-2">{tScope("notFoundDesc")}</p>
          <Button
            className="mt-4"
            onClick={() => (window.location.href = "/vendre-des-kamas")}
            aria-label="sell kamas page link"
          >
            {tScope("notFoundLink")}
          </Button>
        </Card>
      )}
    </div>
  );
};

export default ProfileBuyPage;
