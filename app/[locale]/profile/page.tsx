"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Package,
  ShoppingCart,
  CreditCard,
  MapPin,
  Bell,
  Settings,
  ChevronRight,
  Heart,
  Clock,
  Shield,
  ShoppingBag,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../components/ui/skeleton";
import axios from "axios";
import { OrderLength } from "@/lib/types/types";
import { useSession } from "next-auth/react";

interface USERLOGINRESPONSE {
  _id: string;
  address: string;
  city: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<USERLOGINRESPONSE | null>(null);
  const [ordersL, setOrdersL] = useState<OrderLength | null>(null);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  // console.log(ordersL);

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
    }
  }, [data]);

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
        <CardContent className="p-4">
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
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.firstname}!
        </h1>
        <p className="text-gray-500">
          Manage your account and view your recent activity
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <Stat
              label="Orders Sell"
              value={ordersL?.ordersSellLength || 0}
              loader={ordersLoading}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Stat
              label="Orders buy"
              value={ordersL?.ordersBuysLength || 0}
              loader={ordersLoading}
            />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Stat
              label="Total Orders"
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
          <CardContent className="p-4">
            <Stat
              label="Order exchange"
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
          title="Orders Buy"
          description="View and track your recent kamas purchases"
          link="/profile/orders-buys"
        />
        <QuickAction
          icon={TrendingUp}
          title="Orders Sell"
          description="Track your recent kamas sales"
          link="/profile/order-sell"
        />
        <QuickAction
          icon={BarChart2}
          title="Orders Exchange"
          description="Manage your kamas exchanges"
          link="/profile/exchange"
        />
        <QuickAction
          icon={Settings}
          title="Update Profile"
          description="Manage your profile information and settings"
          link="/profile/update-profile"
        />
      </div>

      {/* Account Details */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Account Details</h2>
            <Link
              href="/profile/update-profile"
              className="text-yellow-600 hover:text-yellow-700 text-sm"
            >
              Edit Profile
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
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
              <p className="text-sm text-gray-500 mb-1">Email</p>
              {isLoading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                <p className="font-medium">{user?.email}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              {isLoading ? (
                <Skeleton className="w-[100px] h-[20px]" />
              ) : (
                <p className="font-medium">{user?.phone}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Location</p>
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
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-50">
                <Package className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Order #12345 delivered</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Heart className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="font-medium">Added item to wishlist</p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-50">
                <CreditCard className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Updated payment method</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
