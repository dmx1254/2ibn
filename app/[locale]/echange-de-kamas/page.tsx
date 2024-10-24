"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { ServerExchange } from "@/lib/utils";

import axios from "axios";
import clsx from "clsx";
import { toast } from "sonner";
import { useScopedI18n } from "@/locales/client";

const EchangeDeKamas = () => {
  const tScope = useScopedI18n("exchange");

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

  const [serversExchange, setServersExchange] = useState<
    ServerExchange[] | null
  >(null);

  const [loadingExchange, setLoadingExchange] = useState<boolean>(false);

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

  // console.log("quantityToPay: " + quantityToPay);
  // console.log("serverToPay: " + serverToPay);
  // console.log("serverToReceive: " + serverToReceive);

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

    const totalToReicive = Number(total).toFixed(2);
    if (totalToReicive) {
      setValue("quantityToReceive", totalToReicive.toString());
    }
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
        console.log(response);
        toast.success(tScope("success"), {
          style: { color: "#16a34a" },
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingExchange(false);
    }
  }

  const fetchSevers = async () => {
    // const currency = queryKey[1];
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_IBYTRADE_CLIENT_URL}/server`
    );
    if (!response.ok) {
      throw new Error("Fetching currency failed: ");
    }

    return response.json();
  };
  const { isLoading, error, data } = useQuery({
    queryKey: ["dofus-exchange"],
    queryFn: () => fetchSevers(),
  });

  // console.log(data);

  useMemo(() => {
    if (data) {
      setServersExchange(data);
    }
  }, [data]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Card className="max-w-4xl mx-auto bg-white/80">
        <CardHeader>
          <Alert variant="default" className="bg-green-50 text-green-600 mb-4">
            <AlertDescription className="text-base">
              {tScope("info")}
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-base">{tScope("title")}</AlertTitle>
            <AlertDescription className="text-base">
              {tScope("notice")}
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-3xl md:text-4xl font-bold text-center text-yellow-500 mb-8">
            {tScope("headeartitle")}
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <Image
                src="/exchange/dofus-exchange.jpg"
                width={400}
                height={400}
                alt="Dofus"
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="md:w-1/2 space-y-4"
              >
                <FormField
                  control={form.control}
                  name="serverToPay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {tScope("serverToPay")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-6">
                            <SelectValue
                              placeholder={tScope("placeholderServer")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-base">
                          {serversExchange?.map((s) => (
                            <SelectItem value={s.serverName}>
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
                      <FormLabel className="text-base">
                        {tScope("qtyToPay")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="relative text-base p-6 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            type="number"
                            placeholder="0"
                            {...field}
                          />
                          <span className="absolute text-base text-[#a1a0a0] top-[-15%] left-[75%] sm:left-[80%] z-20 py-[18px] rounded-tr-[10px] rounded-br-[10px]">
                            M Kamas
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="characterToPay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {tScope("characterToPay")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base p-6 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="serverToReceive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {tScope("serverToReceive")}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-6">
                            <SelectValue
                              placeholder={tScope("placeholderServer")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="text-base">
                          {serversExchange?.map((s) => (
                            <SelectItem value={s.serverName}>
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
                      <FormLabel className="text-base">
                        {tScope("qtyToReceive")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="relative text-base p-6 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pointer-events-none"
                            type="number"
                            placeholder="0"
                            {...field}
                            readOnly
                          />
                          <span className="absolute text-base text-[#a1a0a0] top-[-15%] left-[75%] sm:left-[80%] z-20 py-[18px] rounded-tr-[10px] rounded-br-[10px]">
                            M Kamas
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="characterToReceive"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        {tScope("characterToReceive")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base p-6 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
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
                      <FormLabel className="text-base">
                        {tScope("exchangeCode")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="text-base p-6 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className={clsx(
                    "w-full text-base p-6 outline-none font-bold bg-yellow-500 hover:opacity-90 hover:bg-yellow-500",
                    {
                      "opacity-75": loadingExchange,
                    }
                  )}
                  disabled={loadingExchange}
                >
                  {loadingExchange ? (
                    <span className="flex items-center gap-1">
                      <Loader className="animate-spin" size={24} />
                      {tScope("btnLoading")}
                    </span>
                  ) : (
                    tScope("btn")
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EchangeDeKamas;
