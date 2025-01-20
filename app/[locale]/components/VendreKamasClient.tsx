"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ServerExchange, parsedDevise } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
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

const VendreKamasClient = () => {
  const { devise } = useStore();
  const tScope = useScopedI18n("sellkamas");
  const [serversSell, setServersSell] = useState<ServerExchange[] | null>(null);
  const [selectedServer, setSelectedServer] = useState("");
  const [serverPriceEuro, setServerPriceEuro] = useState<number | null>();
  const [serverPriceAed, setServerPriceAed] = useState<number | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverPriceDollar, setServerPriceDollar] = useState<number | null>(
    null
  );

  useEffect(() => {
    const getServer = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/go/server", {
          cache: "no-store",
        });
        const res = await response.json();
        if (res) {
          setServersSell(res);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération :", error);
      } finally {
        setIsLoading(false);
      }
    };

    getServer();
  }, []);

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

  const fetchCurrencyAed = async () => {
    const response = await fetch("/api/go/currency/aed");
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };

  const {
    isLoading: IsLoadingAed,
    error: errorAed,
    data: aedData,
  } = useQuery({
    queryKey: ["aed"],
    queryFn: () => fetchCurrencyAed(),
  });

  useEffect(() => {
    if (euroData) {
      setServerPriceEuro(euroData[0]?.euro);
    }
  }, [euroData]);

  useEffect(() => {
    if (aedData) {
      setServerPriceAed(aedData[0]?.aed);
    }
  }, [aedData]);

  useEffect(() => {
    if (dollarData) {
      setServerPriceDollar(dollarData[0]?.dollar);
    }
  }, [dollarData]);

  const currency = parsedDevise(devise.currencyName);

  if (isLoading) return <ServerSkeleton />;

  return (
    <div className="container font-poppins mx-auto p-2 md:p-6 space-y-6 max-w-5xl min-h-screen">
      <Card className="w-full bg-[#1A1D21] my-6 p-6">
        <div className="bg-[#1A1D21] rounded-lg">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white/90 mb-4">
              {tScope("descTitle")}
            </h2>
            <div className="flex flex-col items-start gap-3 text-base text-white/90">
              <p>{tScope("desc2")}</p>
              <p>
                {tScope("qtyDesc")}: {tScope("desc1min")}
              </p>
              <p>{tScope("desc2min")}</p>
              <p>{tScope("desc3")}</p>

              <div className="border-t border-white/20 pt-3">
                <p className="mb-2">
                  <strong>{tScope("paymentMethodSell")}:</strong>
                </p>
                <div className="flex flex-col gap-2">
                  <p>
                    <strong className="text-amber-600">Paypal:</strong>{" "}
                    {tScope("paymentMethodSellPaypal")}
                  </p>
                  <p>
                    <strong className="text-amber-600">Skrill:</strong>{" "}
                    {tScope("paymentMethodSellSkrill")}
                  </p>
                  <p>
                    <strong className="text-amber-600">Sepa:</strong>{" "}
                    {tScope("paymentMethodSellSepa")}
                  </p>
                  <p>
                    <strong className="text-amber-600">Bitcoin:</strong>{" "}
                    {tScope("paymentMethodSellBitcoin")}
                  </p>
                  <p className="">
                    <strong className="text-amber-600">Usdt:</strong>{" "}
                    {tScope("paymentMethodSellUsdt")}
                  </p>
                  <p>
                    <strong className="text-amber-600">
                      {tScope("qtyDescBankTransfer")}:
                    </strong>{" "}
                    {tScope("paymentMethodSellBankTransfer")}
                  </p>
                </div>
              </div>
              <p>{tScope("desc5")}</p>
              <p className="uppercase">
                <strong className="text-amber-600 uppercase">I:</strong>{" "}
                {tScope("desc6")}
              </p>
              <p className="uppercase">
                <strong className="text-amber-600 uppercase">II:</strong>{" "}
                {tScope("desc7")}
              </p>
              <p>
                {tScope("desc8")}{" "}
                <Link
                  href="/echange-de-kamas"
                  className="underline text-yellow-600"
                >
                  {tScope("linkdofs")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Card>
      <Card className="w-full bg-[#1A1D21] my-6">
        <SellKamasComponents servers={serversSell} />
      </Card>
      <Card className="w-full mt-6 bg-transparent border-none">
        <CardContent className="w-full space-y-4 p-0">
          <div className="bg-[#363A3D] flex flex-col items-center gap-3 rounded-lg shadow-md overflow-hidden mt-6">
            <p className="text-2xl font-semibold pt-2 text-white/80">
              Dofus Kamas
            </p>
            <Table className="text-white/90">
              <TableHeader>
                <TableRow className="bg-[#151d20] border-[#76828D]">
                  <TableHead className="text-amber-600 max-md:text-xs">
                    {tScope("headertableServ")}
                  </TableHead>
                  <TableHead className="text-amber-600 md:text-center max-md:text-xs">
                    {tScope("headertablePriceDH")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Paypal
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Skrill
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Sepa
                  </TableHead>
                  <TableHead className="text-amber-600 text-right max-md:text-xs">
                    Usdt(TRC20/ERC20)
                  </TableHead>
                  <TableHead className="text-amber-600 text-right max-md:text-xs">
                    {tScope("headertablePriceAED")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    {tScope("headertableStatus")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell
                  ?.filter((item) => item.serverCategory === "dofus-kamas")
                  ?.map((server) => (
                    <TableRow
                      key={server._id}
                      className="border-[#76828D] hover:bg-yellow-700 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium max-md:text-xs">
                        {server.serverName}
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {server.serverPriceDh.toFixed(2)} DH/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceDollar || 1)
                        ).toFixed(3)}{" "}
                        Usdt/M
                      </TableCell>
                      <TableCell className="text-right max-md:text-xs">
                        {(server.serverPriceDh / (serverPriceAed || 1)).toFixed(
                          2
                        )}{" "}
                        AED/M
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
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-[#363A3D] rounded-lg  flex flex-col items-center gap-3 shadow-md overflow-hidden mt-6">
            <p className="text-2xl font-semibold pt-2 text-white/80">
              Dofus Retro
            </p>
            <Table className="text-white/90">
              <TableHeader>
                <TableRow className="bg-[#151d20] border-[#76828D]">
                  <TableHead className="text-amber-600 max-md:text-xs">
                    {tScope("headertableServ")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    {tScope("headertablePriceDH")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Paypal
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Skrill
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Sepa
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Usdt(TRC20/ERC20)
                  </TableHead>
                  <TableHead className="text-amber-600 text-right max-md:text-xs">
                    {tScope("headertablePriceAED")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    {tScope("headertableStatus")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell
                  ?.filter((item) => item.serverCategory === "dofus-retro")
                  ?.map((server) => (
                    <TableRow
                      key={server._id}
                      className="border-[#76828D] hover:bg-yellow-700 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium max-md:text-xs">
                        {server.serverName}
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {server.serverPriceDh.toFixed(2)} DH/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceDollar || 1)
                        ).toFixed(3)}{" "}
                        Usdt/M
                      </TableCell>
                      <TableCell className="text-right max-md:text-xs">
                        {(server.serverPriceDh / (serverPriceAed || 1)).toFixed(
                          2
                        )}{" "}
                        AED/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
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
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          <div className="bg-[#363A3D] rounded-lg  flex flex-col items-center gap-3 shadow-md overflow-hidden mt-6">
            <p className="text-2xl font-semibold pt-2 text-white/80">
              Dofus Touch
            </p>
            <Table className="text-white/90">
              <TableHeader>
                <TableRow className="bg-[#151d20] border-[#76828D]">
                  <TableHead className="text-amber-600 max-md:text-xs">
                    {tScope("headertableServ")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    {tScope("headertablePriceDH")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Paypal
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Skrill
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Sepa
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    Usdt(TRC20/ERC20)
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    {tScope("headertablePriceAED")}
                  </TableHead>
                  <TableHead className="text-amber-600 text-center max-md:text-xs">
                    {tScope("headertableStatus")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell
                  ?.filter((item) => item.serverCategory === "dofus-touch")
                  ?.map((server) => (
                    <TableRow
                      key={server._id}
                      className="border-[#76828D] hover:bg-yellow-700 transition-colors cursor-pointer"
                    >
                      <TableCell className="font-medium max-md:text-xs">
                        {server.serverName}
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {server.serverPriceDh.toFixed(2)} DH/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceEuro || 1)
                        ).toFixed(2)}{" "}
                        €/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(
                          server.serverPriceDh / (serverPriceDollar || 1)
                        ).toFixed(2)}{" "}
                        Usdt/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        {(server.serverPriceDh / (serverPriceAed || 1)).toFixed(
                          2
                        )}{" "}
                        AED/M
                      </TableCell>
                      <TableCell className="text-center max-md:text-xs">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            server.serverStatus === "Disponible"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {server.serverStatus === "Disponible"
                            ? tScope("headertableStatusInTableAva")
                            : tScope("headertableStatusInTableComp")}
                        </span>
                      </TableCell>
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

export default VendreKamasClient;
