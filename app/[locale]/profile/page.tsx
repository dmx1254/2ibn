"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Settings,
  ChevronRight,
  ShoppingBag,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/skeleton";
import axios from "axios";
import {
  OrderLength,
  USERLOGINRESPONSE,
  UserPaymentMethodResponse,
} from "@/lib/types/types";
import { useSession } from "next-auth/react";
import { useScopedI18n } from "@/locales/client";
import { formatTimeAgo } from "@/lib/utils";
import PaymentMethodsCard from "../components/PaymentMethodsCard";
import { toast } from "sonner";

const ProfilePage = () => {
  const tScope = useScopedI18n("profile");
  const optionsHours = {
    hourText: tScope("acountDetail.parsedTimeHourText"),
    minuteText: tScope("acountDetail.parsedTimeMinuteText"),
    suffix: tScope("acountDetail.parsedTimesuffix"),
    dayText: tScope("acountDetail.parsedTimedayText"),
    monthText: tScope("acountDetail.parsedTimemonthText"),
    yearText: tScope("acountDetail.parsedTimeyearText"),
  };
  const { data: session, status } = useSession();
  const [user, setUser] = useState<USERLOGINRESPONSE | null>(null);
  const [ordersL, setOrdersL] = useState<OrderLength | null>(null);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<
    UserPaymentMethodResponse[]
  >([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
  // console.log(ordersL);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "payée":
      case "paid":
        return "bg-green-500 rounded p-1 text-sm text-black/80";
      case "en attente":
      case "pending":
        return "bg-yellow-500 rounded p-1 text-sm text-black/80";
      case "en cours de payment":
      case "processing":
        return "bg-blue-500 rounded p-1 text-sm text-black/80";
      case "annulée":
      case "cancelled":
        return "bg-red-500 rounded p-1 text-sm text-black/80";
      default:
        return "bg-gray-500 rounded p-1 text-sm text-black/80";
    }
  };

  const getUser = async () => {
    const response = await axios.get(`/api/iben/user/${session?.user.id}`);
    return response.data;
  };
  const { isLoading, data, error } = useQuery({
    queryKey: ["user", session?.user.id],
    queryFn: getUser,
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setReferralCode(data.referralCode || "");
    }
  }, [data]);

  console.log(ordersL);

  useEffect(() => {
    const getPaymentMethods = async () => {
      const data = { userId: session?.user.id };
      const response = await axios.post(
        `/api/iben/user/getPaymentMethods`,
        data
      );
      if (response) {
        setPaymentMethods(response.data);
      }
    };
    if (session?.user.id) {
      getPaymentMethods();
    }
  }, [session?.user.id]);
  // GET ORDERS LENGTHS

  useEffect(() => {
    const getOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await axios.get(
          `/api/iben/getordersDetails/${session?.user.id}`
        );
        if (response) {
          setOrdersL(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setOrdersLoading(false);
      }
    };

    if (session?.user.id) {
      getOrders();
    }
  }, [session?.user.id]);

  const QuickAction = ({
    icon: Icon,
    title,
    description,
    link,
  }: {
    icon: any;
    title: string;
    description: string;
    link: string;
  }) => (
    <Link href={link} className="block">
      <Card className="hover:bg-gray-50 transition-colors">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-50">
                <Icon className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const Stat = ({
    label,
    value,
    loader,
  }: {
    label: string;
    value: number;
    loader: boolean;
  }) => (
    <div className="text-center">
      {loader ? (
        <Skeleton className="flex items-center justify-center self-center mx-auto w-[100px] h-[20px]" />
      ) : (
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      )}

      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-2 sm:p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {tScope("headerTitle")}, {user?.firstname}!
        </h1>
        <p className="text-gray-700">{tScope("headerDesc")}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <Stat
              label={tScope("cardSell")}
              value={ordersL?.ordersSellLength || 0}
              loader={ordersLoading}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <Stat
              label={tScope("cardBuy")}
              value={ordersL?.ordersBuysLength || 0}
              loader={ordersLoading}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <Stat
              label={tScope("cardTotal")}
              value={
                (ordersL?.ordersSellLength || 0) +
                (ordersL?.ordersBuysLength || 0) +
                (ordersL?.exchangeLength || 0)
              }
              loader={ordersLoading}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 sm:p-4">
            <Stat
              label={tScope("cardExchange")}
              value={ordersL?.exchangeLength || 0}
              loader={ordersLoading}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <QuickAction
          icon={ShoppingBag}
          title={tScope("orderBuyLinkTitle")}
          description={tScope("orderBuyLinkDesc")}
          link="/profile/orders-buys"
        />
        <QuickAction
          icon={TrendingUp}
          title={tScope("orderSellLinkTitle")}
          description={tScope("orderSellLinkDesc")}
          link="/profile/order-sell"
        />
        <QuickAction
          icon={BarChart2}
          title={tScope("orderExchangeLinkTitle")}
          description={tScope("orderExchangeLinkDesc")}
          link="/profile/exchange"
        />
        <QuickAction
          icon={Settings}
          title={tScope("orderupadteProfileLinkTitle")}
          description={tScope("orderupadteProfileLinkDesc")}
          link="/profile/update-profile"
        />
      </div>

      {/* Account Details */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              {tScope("acountDetail.title")}
            </h2>
            <Link
              href="/profile/update-profile"
              className="text-yellow-600 hover:text-yellow-700 text-sm"
            >
              {tScope("acountDetail.link")}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {tScope("acountDetail.fullName")}
              </p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="w-[50px] h-[20px]" />
                  <Skeleton className="w-[50px] h-[20px]" />
                </div>
              ) : (
                <p className="font-medium">
                  {user?.firstname} {user?.lastname}
                </p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {tScope("acountDetail.email")}
              </p>
              {isLoading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                <p className="font-medium">{user?.email}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {tScope("acountDetail.phone")}
              </p>
              {isLoading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                <p className="font-medium">{user?.phone}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {tScope("acountDetail.location")}
              </p>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Skeleton className="w-[50px] h-[20px]" />
                  <Skeleton className="w-[50px] h-[20px]" />
                </div>
              ) : (
                <p className="font-medium">
                  {user?.city}, {user?.country}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {tScope("acountDetail.referralLevel")} :
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`font-medium text-sm ${
                  user?.referralLevel === "bronze"
                    ? "bg-amber-600 text-white/80 px-2 py-1 rounded-md"
                    : user?.referralLevel === "silver"
                    ? "bg-gray-400 text-white/80 px-2 py-1 rounded-md"
                    : user?.referralLevel === "gold"
                    ? "bg-yellow-400 text-white/80 px-2 py-1 rounded-md"
                    : user?.referralLevel === "platinum"
                    ? "bg-blue-400 text-white/80 px-2 py-1 rounded-md"
                    : user?.referralLevel === "diamond"
                    ? "bg-purple-400 text-white/80 px-2 py-1 rounded-md"
                    : "bg-gray-400 text-white/80 px-2 py-1 rounded-md"
                }`}
              >
                {user?.referralLevel || "N/A"}
              </div>
            </div>

            <div className="text-sm text-gray-500 flex items-center gap-2">
              {tScope("acountDetail.referralPoints")} :
            </div>
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm bg-amber-600 text-white/80 px-2 py-1 rounded-md">
                {user?.referralPoints || 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="mb-8 w-full">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {tScope("acountDetail.orderRecentTitle")}
          </h2>
          <div className="space-y-4">
            {ordersL?.lastOrder ? (
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-green-50">
                  <Package className="w-4 h-4 text-green-600" />
                </div>

                <div className="">
                  <div className="font-medium">
                    {ordersL?.lastOrder &&
                      tScope("acountDetail.lastOrder", {
                        orderNum: ordersL?.lastOrder[0]?.numBuy,
                      })}
                    <span
                      className={`${getStatusColor(
                        ordersL?.lastOrder[0]?.status || ""
                      )}`}
                    >
                      {ordersL?.lastOrder[0]?.status === "En attente" &&
                        tScope("acountDetail.lastOrderStatusEnt")}
                      {ordersL?.lastOrder[0]?.status === "Payée" &&
                        tScope("acountDetail.lastOrderStatusD")}
                      {ordersL?.lastOrder[0]?.status ===
                        "En Cours de payment" &&
                        tScope("acountDetail.lastOrderStatusEnc")}
                      {ordersL?.lastOrder[0]?.status === "Annulée" &&
                        tScope("acountDetail.lastOrderStatusAnn")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 max-sm:mt-2">
                    {formatTimeAgo(
                      new Date(ordersL?.lastOrder[0]?.createdAt!),
                      optionsHours
                    )}
                  </p>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-full shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">
              {tScope("acountDetail.referralCode")}
            </h2>
            <div className="space-y-4">
              {referralCode ? (
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {tScope("acountDetail.referralCodeTitle")}
                  </p>
                  <div className="flex items-center gap-3">
                    <code className="bg-gray-100 px-3 py-2 rounded-lg font-mono text-lg">
                      {referralCode}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(referralCode);
                        toast.success(
                          tScope("acountDetail.referralCodeCopied")
                        );
                      }}
                      className="text-yellow-600 hover:opacity-80 text-sm font-medium"
                    >
                      {tScope("acountDetail.copyReferralCode")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">
                    {tScope("acountDetail.referralCodeTitle")}
                  </p>
                  <button
                    onClick={async () => {
                      if (!session?.user?.id) return;

                      try {
                        setIsGeneratingCode(true);
                        const response = await fetch("/api/iben/referral", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: session.user.id }),
                        });
                        const data = await response.json();
                        if (data.success) {
                          setReferralCode(data.referralCode);
                          // Update user state locally
                          setUser((prev) =>
                            prev
                              ? { ...prev, referralCode: data.referralCode }
                              : null
                          );
                        }
                      } catch (error) {
                        console.error("Error generating referral code:", error);
                      } finally {
                        setIsGeneratingCode(false);
                      }
                    }}
                    disabled={isGeneratingCode}
                    className="bg-yellow-600 hover:opacity-80 text-white/80 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {isGeneratingCode
                      ? tScope("acountDetail.generating")
                      : tScope("acountDetail.generateReferralCode")}
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full">
          <PaymentMethodsCard methods={paymentMethods} />
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
