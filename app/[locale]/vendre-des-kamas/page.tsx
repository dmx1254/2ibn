"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ServerExchange, parsedDevise } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import SellKamasDialog from "../components/SellKamasDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import ServerSkeleton from "@/components/ui/skeletons/skeletons";
import Link from "next/link";
import useStore from "@/lib/store-manage";
import SellKamasComponents from "../components/SellKamasComponents";

const VendreKamas = () => {
  const { devise } = useStore();
  const tScope = useScopedI18n("sellkamas");
  const [serversSell, setServersSell] = useState<ServerExchange[] | null>(null);
  const [selectedServer, setSelectedServer] = useState("");
  const [serverPriceEuro, setServerPriceEuro] = useState<number | null>();
  const [serverPriceDollar, setServerPriceDollar] = useState<number | null>(
    null
  );

  const fetchServers = async () => {
    const response = await fetch("/api/go/server");
    if (!response.ok) {
      throw new Error("Fetching currency failed");
    }
    return response.json();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["dofus-sell-server"],
    queryFn: () => fetchServers(),
  });

  useMemo(() => {
    if (data) {
      setServersSell(data);
    }
  }, [data]);

  // EURO CURRENCY FETCHING

  const fetchCurrencyEuro = async () => {
    const response = await fetch("/api/go/currency/euro");
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };

  const {
    isLoading: IsLoadingEuro,
    error: errorEuro,
    data: euroData,
  } = useQuery({
    queryKey: ["euro"],
    queryFn: () => fetchCurrencyEuro(),
  });

  // DOLLAR CURRENCY FETCHING

  const fetchCurrencyDollar = async () => {
    const response = await fetch("/api/go/currency/dollar");
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };

  const {
    isLoading: IsLoadingDollar,
    error: errorDollar,
    data: dollarData,
  } = useQuery({
    queryKey: ["dollar"],
    queryFn: () => fetchCurrencyDollar(),
  });

  useEffect(() => {
    if (euroData) {
      setServerPriceEuro(euroData[0]?.euro);
    }
  }, [euroData]);

  useEffect(() => {
    if (dollarData) {
      setServerPriceDollar(dollarData[0]?.dollar);
    }
  }, [dollarData]);

  const currency = parsedDevise(devise.currencyName);

  if (isLoading) return <ServerSkeleton />;

  return (
    <div className="container font-poppins mx-auto p-6 space-y-6 max-w-4xl min-h-screen">
      <Card className="w-full bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 my-6 p-6">
        <div className="w-full flex flex-col items-center">
          <p className="text-2xl font-semibold text-[#374151] mb-2">
            {tScope("descTitle")}
          </p>
          <div className="flex flex-col items-start gap-2 text-base text-[#374151]">
            <p>{tScope("desc1")}</p>
            <p>
              {tScope("desc2", {
                minVal: `${(200 / devise.curencyVal).toFixed(2)} ${currency}`,
              })}
            </p>
            <p>{tScope("desc3")}</p>
            <p>
              {tScope("desc4", {
                price: `${(300 / devise.curencyVal).toFixed(2)} ${currency}`,
              })}
            </p>
            <p>
              {tScope("desc5", {
                bonus: `${(50 / devise.curencyVal).toFixed(2)} ${currency}`,
                total: `${(3000 / devise.curencyVal).toFixed(2)} ${currency}`,
              })}
            </p>
            <p className="uppercase">
              {tScope("desc6", {
                total: `${(3000 / devise.curencyVal).toFixed(2)} ${currency}`,
                totalPlusBonus: `${(3050 / devise.curencyVal).toFixed(
                  2
                )} ${currency}`,
                exemplePrice1: `${(8000 / devise.curencyVal).toFixed(
                  2
                )} ${currency}`,
                exempleBonus1: `${(8050 / devise.curencyVal).toFixed(
                  2
                )} ${currency}`,
                exemplePrice2: `${(10000 / devise.curencyVal).toFixed(
                  2
                )} ${currency}`,
                exempleBonus2: `${(10050 / devise.curencyVal).toFixed(
                  2
                )} ${currency}`,
              })}
            </p>
            <p className="uppercase">{tScope("desc7")}</p>

            <p>
              {tScope("desc8")}{" "}
              <Link
                href="/echange-de-kamas"
                className="underline text-yellow-600"
              >
                {" "}
                {tScope("linkdofs")}
              </Link>
            </p>
          </div>
        </div>
      </Card>
      <Card className="w-full bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 my-6">
        <SellKamasComponents servers={serversSell} />
      </Card>
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 mt-6">
        <CardContent className="space-y-4">
          <div className="bg-white flex flex-col items-center gap-3 rounded-lg shadow-md overflow-hidden mt-6">
            <p className="text-2xl font-semibold pt-2">Dofus Kamas</p>
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-100">
                  <TableHead className="text-amber-900">
                    {tScope("headertableServ")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceDH")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceEUR")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceUSD")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertableStatus")}
                  </TableHead>
                  {/* <TableHead className="text-amber-900 text-right">
                    {tScope("headertableAction")}
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell
                  ?.filter((item) => item.serverCategory === "dofus-kamas")
                  ?.map((server) => (
                    <TableRow key={server._id} className="hover:bg-amber-50">
                      <TableCell className="font-medium">
                        {server.serverName}
                      </TableCell>
                      <TableCell className="text-right">
                        {server.serverPriceDh.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          server.serverPriceDh / (serverPriceDollar || 1)
                        ).toFixed(2)}
                      </TableCell>

                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            server.serverStatus === "Disponible"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {server.serverStatus === "Disponible"
                            ? tScope("headertableStatusInTableAva")
                            : tScope("headertableStatusInTableComp")}
                        </span>
                      </TableCell>
                      {/* <TableCell className="text-right">
                        <SellKamasDialog
                          serverStatus={server.serverStatus}
                          server={server}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-white rounded-lg  flex flex-col items-center gap-3 shadow-md overflow-hidden mt-6">
            <p className="text-2xl font-semibold pt-2">Dofus Retro</p>
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-100">
                  <TableHead className="text-amber-900">
                    {tScope("headertableServ")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceDH")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceEUR")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceUSD")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertableStatus")}
                  </TableHead>
                  {/* <TableHead className="text-amber-900 text-right">
                    {tScope("headertableAction")}
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell
                  ?.filter((item) => item.serverCategory === "dofus-retro")
                  ?.map((server) => (
                    <TableRow key={server._id} className="hover:bg-amber-50">
                      <TableCell className="font-medium">
                        {server.serverName}
                      </TableCell>
                      <TableCell className="text-right">
                        {server.serverPriceDh.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          server.serverPriceDh / (serverPriceDollar || 1)
                        ).toFixed(2)}
                      </TableCell>

                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            server.serverStatus === "Disponible"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {server.serverStatus === "Disponible"
                            ? tScope("headertableStatusInTableAva")
                            : tScope("headertableStatusInTableComp")}
                        </span>
                      </TableCell>
                      {/* <TableCell className="text-right">
                        <SellKamasDialog
                          serverStatus={server.serverStatus}
                          server={server}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-white rounded-lg  flex flex-col items-center gap-3 shadow-md overflow-hidden mt-6">
            <p className="text-2xl font-semibold pt-2">Dofus Touch</p>
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-100">
                  <TableHead className="text-amber-900">
                    {tScope("headertableServ")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceDH")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceEUR")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertablePriceUSD")}
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    {tScope("headertableStatus")}
                  </TableHead>
                  {/* <TableHead className="text-amber-900 text-right">
                    {tScope("headertableAction")}
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell
                  ?.filter((item) => item.serverCategory === "dofus-touch")
                  ?.map((server) => (
                    <TableRow key={server._id} className="hover:bg-amber-50">
                      <TableCell className="font-medium">
                        {server.serverName}
                      </TableCell>
                      <TableCell className="text-right">
                        {server.serverPriceDh.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        {(
                          server.serverPriceDh / (serverPriceDollar || 1)
                        ).toFixed(2)}
                      </TableCell>

                      <TableCell className="text-right">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            server.serverStatus === "Disponible"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {server.serverStatus === "Disponible"
                            ? tScope("headertableStatusInTableAva")
                            : tScope("headertableStatusInTableComp")}
                        </span>
                      </TableCell>
                      {/* <TableCell className="text-right">
                        <SellKamasDialog
                          serverStatus={server.serverStatus}
                          server={server}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendreKamas;
