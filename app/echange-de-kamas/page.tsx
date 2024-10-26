"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader, ArrowRightLeft, Coins } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { ServerExchange } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

const EchangeDeKamas = () => {
  const [serversExchange, setServersExchange] = useState<
    ServerExchange[] | null
  >(null);
  const [loadingExchange, setLoadingExchange] = useState<boolean>(false);

  const formSchema = z.object({
    serverToPay: z.string().min(1, { message: "Server to Pay is required" }),
    quantityToPay: z
      .string()
      .min(1, { message: "Quantity to Pay is required" }),
    characterToPay: z
      .string()
      .min(1, { message: "Character to Pay is required" }),
    serverToReceive: z
      .string()
      .min(1, { message: "Server to Receive is required" }),
    quantityToReceive: z
      .string()
      .min(1, { message: "Quantity to receive is required" }),
    characterToReceive: z
      .string()
      .min(1, { message: "Character to Receive is required" }),
    exchangeCode: z.string().min(1, { message: "Exchange Code is required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverToPay: "",
      quantityToPay: "",
      characterToPay: "",
      serverToReceive: "",
      quantityToReceive: "",
      characterToReceive: "",
      exchangeCode: "",
    },
  });

  const { watch, setValue } = form;
  const serverToPay = watch("serverToPay");
  const quantityToPay = watch("quantityToPay");
  const serverToReceive = watch("serverToReceive");

  useEffect(() => {
    const serverToPayPrice = serversExchange?.find(
      (s) => s.serverName === serverToPay
    )?.serverPriceDh;
    const serverToReceivePrice = serversExchange?.find(
      (s) => s.serverName === serverToReceive
    )?.serverPriceDh;
    const total =
      ((Number(serverToPayPrice) * Number(quantityToPay)) /
        Number(serverToReceivePrice)) *
      0.8;
    const totalToReceive = Number(total).toFixed(2);
    if (totalToReceive)
      setValue("quantityToReceive", totalToReceive.toString());
  }, [serverToPay, serverToReceive, quantityToPay]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      userId: "63c52df8f1adcc81fad062b3",
      serverOut: values.serverToPay,
      serverIn: values.serverToReceive,
      numExchange: values.exchangeCode,
      codeToExchange: values.exchangeCode,
      characterToPay: values.characterToPay,
      characterToReceive: values.characterToReceive,
      qtyToPay: Number(values.quantityToPay),
      qtyToReceive: Number(values.quantityToReceive),
    };
    try {
      setLoadingExchange(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_IBYTRADE_CLIENT_URL}/exchange`,
        data
      );
      if (response) {
        toast.success(
          "Exchange request submitted successfully. Open the chat to proceed with the exchange.",
          {
            style: { color: "#16a34a" },
          }
        );
      }
    } catch (error) {
      console.log(error);
      toast.success("Something went wrong, please try again later.", {
        style: { color: "#dc2626" },
      });
    } finally {
      setLoadingExchange(false);
    }
  }

  const { data } = useQuery({
    queryKey: ["dofus-exchange"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_IBYTRADE_CLIENT_URL}/server`
      );
      if (!response.ok) throw new Error("Fetching currency failed");
      return response.json();
    },
  });

  useMemo(() => {
    if (data) setServersExchange(data);
  }, [data]);

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
            KAMAS EXCHANGE
          </h1>
          {/* <p className="text-gray-600 text-lg">We will send you private messages in-game with the exchange code you provided, in order to confirm that the recipient exchanging with you is part of our staff.</p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="border-none shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <Alert
                  variant="default"
                  className="bg-green-50 border-green-200 mb-4"
                >
                  <Coins className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    We will send you private messages in-game with the exchange
                    code you provided, in order to confirm that the recipient
                    exchanging with you is part of our staff.
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Attention</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Do not share your code with anyone else. If someone gives
                    you an incorrect code, block them!!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <div className="relative">
              <Image
                src="/exchange/dofus-exchange.jpg"
                width={600}
                height={400}
                alt="Dofus"
                className="rounded-xl shadow-xl w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-xl" />
            </div>
          </div>

          <Card className="border-none shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serverToPay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Server to Pay
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white">
                                  <SelectValue placeholder="Choose server" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serversExchange?.map((s) => (
                                  <SelectItem
                                    key={s.serverName}
                                    value={s.serverName}
                                  >
                                    {s.serverName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantityToPay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Quantity to Pay (M)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="h-12 bg-white pl-4 pr-20"
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  M Kamas
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="characterToPay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Character to Pay
                          </FormLabel>
                          <FormControl>
                            <Input className="h-12 bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="relative py-4">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 rounded-full p-2">
                        <ArrowRightLeft className="h-6 w-6 text-white" />
                      </div>
                      <hr className="border-gray-200" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serverToReceive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Server to Receive
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white">
                                  <SelectValue placeholder="Choose server" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {serversExchange?.map((s) => (
                                  <SelectItem
                                    key={s.serverName}
                                    value={s.serverName}
                                  >
                                    {s.serverName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="quantityToReceive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">
                              Quantity to Receive (M)
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="h-12 bg-white/50 pl-4 pr-20"
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  readOnly
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                  M Kamas
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="characterToReceive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Character to Receive
                          </FormLabel>
                          <FormControl>
                            <Input className="h-12 bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="exchangeCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">
                            Exchange Code
                          </FormLabel>
                          <FormControl>
                            <Input className="h-12 bg-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg transition-colors duration-200"
                    disabled={loadingExchange}
                  >
                    {loadingExchange ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader className="animate-spin h-5 w-5" />
                        Exchanging...
                      </span>
                    ) : (
                      "Exchange"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EchangeDeKamas;
