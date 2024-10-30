"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, Server } from "lucide-react";
import { parsedDevise } from "@/lib/utils";
import useStore from "@/lib/store-manage";

interface OrderSell {
  userId: string;
  numBuy: string;
  jeu: string;
  server: string;
  pu: number;
  qte: number;
  totalPrice: number;
  paymentMethod: string;
  gameName: string;
  paymentInfoDetails: string;
  currencymethod: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSellPage = () => {
  const { devise } = useStore();
  const { data: session, status } = useSession();
  const {
    isLoading,
    data: ordersSell,
    error,
  } = useQuery({
    queryKey: ["user-order-sell", session?.user.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/go/order/getOrders/${session?.user.id}`
      );
      return response.data as OrderSell[];
    },
    enabled: !!session?.user.id,
  });

  //   console.log(ordersSell);

  const totalSum = React.useMemo(() => {
    if (!ordersSell) return 0;
    return ordersSell.reduce((sum, order) => sum + order.totalPrice, 0);
  }, [ordersSell]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-red-500">
        Error loading orders
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "payée":
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

  return (
    <div className="p-6 space-y-6 font-poppins">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">
                {totalSum}
                {ordersSell ? parsedDevise(ordersSell[0]?.currencymethod) : ""}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersSell?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Average Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ordersSell?.length
                ? `${totalSum / ordersSell.length} ${
                    ordersSell
                      ? parsedDevise(ordersSell[0]?.currencymethod)
                      : parsedDevise(devise.currencyName)
                  }`
                : parsedDevise(devise.currencyName) + "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="font-poppins">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ordersSell?.map((order) => (
              <div
                key={order.numBuy}
                className="rounded-lg border p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Order ID
                    </p>
                    <p className="font-medium">{order.numBuy}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Game Details
                    </p>
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4" />
                      <span>
                        {order.jeu} - {order.server}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Payment method
                    </p>
                    <div className="flex items-center space-x-2">
                      <span>{order.paymentMethod}</span>
                      <Badge variant="secondary">{order.currencymethod}</Badge>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">
                        {order.totalPrice}
                        {ordersSell
                          ? parsedDevise(ordersSell[0]?.currencymethod)
                          : parsedDevise(devise.currencyName)}
                      </span>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    // hour: "2-digit",
                    // minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSellPage;
