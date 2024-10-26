"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { ServerExchange } from "@/lib/utils";
import SellKamasDialog from "@/components/SellKamasDialog";

const VendreKamas = () => {
  const [serversSell, setServersSell] = useState<ServerExchange[] | null>(null);
  const [selectedServer, setSelectedServer] = useState("");
  const [serverPriceEuro, setServerPriceEuro] = useState<number | null>();
  const [serverPriceDollar, setServerPriceDollar] = useState<number | null>(
    null
  );

  const fetchServers = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IBYTRADE_CLIENT_URL}/server`
    );
    if (!response.ok) {
      throw new Error("Fetching currency failed");
    }
    return response.json();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["dofus-exchange"],
    queryFn: () => fetchServers(),
  });

  useMemo(() => {
    if (data) {
      setServersSell(data);
    }
  }, [data]);

  // EURO CURRENCY FETCHING

  const fetchCurrencyEuro = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IBENDOUMA_CLIENT_URL}/euro`
    );
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IBENDOUMA_CLIENT_URL}/dollar`
    );
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

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-900">
            Sell Dofus Server
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-900">
                Server:
              </label>
              <Input
                value="Only available servers can be sold"
                className="border-amber-200 focus:border-amber-400 pointer-events-none"
                placeholder="Enter amount"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-amber-900">
                Quantity of Kamas:
              </label>
              <Input
                value="The minimum quantity of kamas to sell is 5M"
                className="border-amber-200 focus:border-amber-400 pointer-events-none"
                placeholder="Enter amount"
                readOnly
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mt-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-amber-100">
                  <TableHead className="text-amber-900">Server</TableHead>
                  <TableHead className="text-amber-900 text-right">
                    Price (DH/M)
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    Price (€/M)
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    Price ($/M)
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    Status
                  </TableHead>
                  <TableHead className="text-amber-900 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {serversSell?.map((server) => (
                  <TableRow key={server._id} className="hover:bg-amber-50">
                    <TableCell className="font-medium">
                      {server.serverName}
                    </TableCell>
                    <TableCell className="text-right">
                      {server.serverPriceDh.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(server.serverPriceDh / (serverPriceEuro || 1)).toFixed(
                        2
                      )}
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
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {server.serverStatus === "Disponible"
                          ? "Available"
                          : "Full Stock"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <SellKamasDialog
                        serverStatus={server.serverStatus}
                        server={server}
                      />
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

export default VendreKamas;
