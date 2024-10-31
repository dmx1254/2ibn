"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ArrowLeftRight, ArrowRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { ExchangeKamas } from "@/lib/types/types";
import { useScopedI18n } from "@/locales/client";

const StatusBadge = ({ status }: { status: string }) => {
  const tScope = useScopedI18n("exchangeKamas");
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "terminée":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "en attente":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      case "annulée":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Badge
      className={`${getStatusStyle(
        status
      )} font-medium hover:bg-yellow-100 hover:text-yellow-700`}
    >
      {status === "Terminée" && tScope("completed")}
      {status === "En attente" && tScope("pending")}
      {status === "Annulée" && tScope("cancelled")}
    </Badge>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="h-8 w-full max-w-md" />
    </div>
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  </div>
);

const NoExchanges = () => {
  const tScope = useScopedI18n("exchangeKamas");
  return (
    <Card className="text-center p-6">
      <div className="flex flex-col items-center gap-2">
        <ArrowLeftRight className="h-8 w-8 text-gray-400" />
        <h3 className="text-lg font-semibold">{tScope("noExchangeTitle")}</h3>
        <p className="text-gray-500">{tScope("noExchangeDesc")}</p>
      </div>
    </Card>
  );
};

const ExchangeTable = ({ exchanges }: { exchanges: ExchangeKamas[] }) => {
  const tScope = useScopedI18n("exchangeKamas");
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{tScope("code")}</TableHead>
            <TableHead>{tScope("serverOut")}</TableHead>
            <TableHead>{tScope("amountOut")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {tScope("charactertOut")}
            </TableHead>
            <TableHead>{tScope("serverIn")}</TableHead>
            <TableHead>{tScope("amountIn")}</TableHead>
            <TableHead className="hidden md:table-cell">
              {tScope("characterIn")}
            </TableHead>
            <TableHead>{tScope("status")}</TableHead>
            <TableHead className="hidden lg:table-cell">
              {tScope("date")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {exchanges.map((exchange) => {
            const date = new Date(exchange.createdAt).toLocaleDateString(
              "fr-FR",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
                // hour: "2-digit",
                // minute: "2-digit",
              }
            );

            return (
              <TableRow
                key={exchange.codeToExchange}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="font-medium">
                  #{exchange.codeToExchange}
                </TableCell>
                <TableCell>{exchange.serverOut}</TableCell>
                <TableCell className="font-medium">
                  {exchange.qtyToPay.toLocaleString()} M
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {exchange.characterToPay}
                </TableCell>
                <TableCell>{exchange.serverIn}</TableCell>
                <TableCell className="font-medium">
                  {exchange.qtyToReceive.toLocaleString()} M
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {exchange.characterToReceive}
                </TableCell>
                <TableCell>
                  <StatusBadge status={exchange.status} />
                </TableCell>
                <TableCell className="hidden lg:table-cell text-gray-500">
                  {date}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const ProfileExchangePage = () => {
  const tScope = useScopedI18n("exchangeKamas");
  const { data: session, status } = useSession();
  const {
    isLoading,
    data: exchanges,
    error,
  } = useQuery({
    queryKey: ["user-exchange", session?.user.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/go/exchange/getUserExchange/${session?.user.id}`
      );
      return response.data;
    },
    enabled: !!session?.user.id,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">{tScope("title")}</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">{tScope("title")}</h1>
        <Card className="bg-red-50 dark:bg-red-900/20 p-6">
          <p className="text-red-600 dark:text-red-400 text-center">
            {tScope("errorLoadingExchange")}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{tScope("title")}</h1>
        </div>

        {exchanges?.length ? (
          <ExchangeTable exchanges={exchanges} />
        ) : (
          <NoExchanges />
        )}
      </div>
    </div>
  );
};

export default ProfileExchangePage;
