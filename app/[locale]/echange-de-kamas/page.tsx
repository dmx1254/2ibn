"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader, ArrowRightLeft, Coins } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useQuery } from "@tanstack/react-query";
import { ServerExchange } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const EchangeDeKamas = () => {
  const tScope = useScopedI18n("exchange");
  const [serversExchange, setServersExchange] = useState<
    ServerExchange[] | null
  >(null);
  const [loadingExchange, setLoadingExchange] = useState<boolean>(false);

  const formSchema = z.object({
    serverToPay: z.string().min(1, { message: tScope("serverToPayErr") }),
    quantityToPay: z.string().min(1, { message: tScope("qtyToPayErr") }),
    characterToPay: z.string().min(1, { message: tScope("characterToPayErr") }),
    serverToReceive: z
      .string()
      .min(1, { message: tScope("serverToReceiveErr") }),
    quantityToReceive: z
      .string()
      .min(1, { message: tScope("qtyToReceiveErr") }),
    characterToReceive: z
      .string()
      .min(1, { message: tScope("characterToReceiveErr") }),
    exchangeCode: z.string().min(1, { message: tScope("exchangeCodeErr") }),
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
      codeToExchange: values.exchangeCode,
      characterToPay: values.characterToPay,
      characterToReceive: values.characterToReceive,
      qtyToPay: Number(values.quantityToPay),
      qtyToReceive: Number(values.quantityToReceive),
    };
    try {
      setLoadingExchange(true);
      const response = await axios.post("/api/go/exchange", data);
      if (response) {
        toast.success(tScope("success"), {
          style: { color: "#16a34a" },
        });
      }
    } catch (error) {
      console.log(error);
      toast.success(tScope("error"), {
        style: { color: "#dc2626" },
      });
    } finally {
      setLoadingExchange(false);
    }
  }

  const { data } = useQuery({
    queryKey: ["dofus-exchange"],
    queryFn: async () => {
      const response = await fetch("/api/go/server");
      if (!response.ok) throw new Error("Fetching currency failed");
      return response.json();
    },
  });

  useMemo(() => {
    if (data) setServersExchange(data);
  }, [data]);

  return (
    <div className="p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
            {tScope("headeartitle")}
          </h1>
          <p className="text-gray-600 text-lg">{tScope("info")}</p>
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
                    {tScope("info")}
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="destructive"
                  className="bg-red-50 border-red-200"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle className="font-semibold">
                    {tScope("title")}
                  </AlertTitle>
                  <AlertDescription className="text-red-700">
                    {tScope("notice")}
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
                              {tScope("serverToPay")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white">
                                  <SelectValue
                                    placeholder={tScope("placeholderServer")}
                                  />
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
                              {tScope("qtyToPay")}
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
                            {tScope("characterToPay")}
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
                              {tScope("serverToReceive")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-12 bg-white">
                                  <SelectValue
                                    placeholder={tScope("placeholderServer")}
                                  />
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
                              {tScope("qtyToReceive")}
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
                            {tScope("characterToReceive")}
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
                            {tScope("exchangeCode")}
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
                        {tScope("btnLoading")}
                      </span>
                    ) : (
                      tScope("btn")
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
