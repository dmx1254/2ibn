"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, Loader, ArrowRightLeft, Coins } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { codeGenerated, ServerExchange } from "@/lib/utils";
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
import { useSession } from "next-auth/react";
import Testimonials from "./Testimonials";
import { useRouter } from "next/navigation";

const EchangeKamasClient = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const tScope = useScopedI18n("exchange");
  const [serversExchange, setServersExchange] = useState<
    ServerExchange[] | null
  >(null);
  const [loadingExchange, setLoadingExchange] = useState<boolean>(false);
  const [exchangeRate, setExchangeRate] = useState<number | undefined>();
  const [serverExchangeRate, setServerExchangeRate] = useState<string>("");
  const [puV, setPuV] = useState<number>(0);

  // console.log(serversExchange);

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

  useEffect(() => {
    const getServerExchange = async () => {
      try {
        const response = await fetch(`/api/go/server`, {
          method: "POST",
          body: JSON.stringify({
            serverCategory: "dofus-kamas",
          }),
        });
        const res = await response.json();

        if (res) {
          setServersExchange(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getServerExchange();
  }, []);

  function handleChatClick() {
    //@ts-expect-error
    void window?.Tawk_API.toggle();
  }

  const { watch, setValue } = form;
  const serverToPay = watch("serverToPay");
  const quantityToPay = watch("quantityToPay");
  const serverToReceive = watch("serverToReceive");

  useEffect(() => {
    const serverToPayPrice = serversExchange?.find(
      (s) => s.serverName === serverToPay
    )?.serverPriceDh;

    setPuV(serverToPayPrice || 0);

    const serverToReceivePrice = serversExchange?.find(
      (s) => s.serverName === serverToReceive
    )?.serverPriceDh;

    // const receive = serversExchange?.find(
    //   (s) => s.serverName === serverToReceive
    // )

    // console.log("serverToReceive", receive);

    const serverToReceiveRate = serversExchange?.find(
      (s) => s.serverName === serverToReceive
    )?.rate;

    const activeServer = serversExchange?.find(
      (s) => s.serverName === serverToReceive
    )?.serverName;

    setServerExchangeRate(activeServer || "");

    const activeServerRate = serversExchange?.find(
      (s) => s.serverName === serverToReceive
    );

    setExchangeRate(activeServerRate?.rate || 1);

    // console.log("activeServerRate: ", activeServerRate);

    // console.log("serverToReceiveRate: ", serverToReceiveRate);

    // console.log(serverToPayPrice, serverToReceivePrice);
    const serverPayCus = Number(serverToPayPrice) * Number(quantityToPay);
    const serverReceiveCus =
      Number(serverToReceivePrice) *
      (1 - Number(serverToReceiveRate === 1 ? 0 : serverToReceiveRate));
    // console.log(serverPayCus);
    // const total =
    //   ((Number(serverToPayPrice) * Number(quantityToPay)) /
    //     Number(serverToReceivePrice)) *
    //   (1 - Number(serverToReceiveRate));

    const totalToReceive = Number(serverPayCus / serverReceiveCus).toFixed(2);
    // console.log("totalToReceive", totalToReceive);
    // console.log(
    //   "serverPayCus / serverReceiveCus",
    //   serverPayCus / serverReceiveCus
    // );
    if (totalToReceive)
      setValue("quantityToReceive", totalToReceive.toString());
  }, [serverToPay, serverToReceive, quantityToPay]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const getStatusServer = serversExchange?.find(
      (s) => s.serverName === values.serverToPay
    )?.serverStatus;

    if (
      getStatusServer?.toLocaleLowerCase() === "stock complet" ||
      getStatusServer?.toLocaleLowerCase() === "complet"
    ) {
      toast.error(
        `desolé, nous n'avons pas besoin du serveur: ${values.serverToPay} pour le moment`,
        {
          style: { color: "#dc2626" },
          position: "top-right",
        }
      );
      return;
    }

    if (
      !values.serverToPay ||
      !values.serverToReceive ||
      !values.exchangeCode ||
      !values.characterToPay ||
      !values.characterToReceive ||
      !Number(values.quantityToPay)
    ) {
      toast.error(tScope("missingfield"), {
        style: { color: "#dc2626" },
      });
      return;
    } else if (!session?.user.id) {
      toast.error(tScope("usernotlogin"), {
        style: { color: "#dc2626" },
      });
      return;
    } else {
      const data = {
        numExchange: codeGenerated(),
        userId: session?.user.id,
        serverOut: values.serverToPay,
        serverIn: values.serverToReceive,
        codeToExchange: values.exchangeCode,
        characterToPay: values.characterToPay,
        characterToReceive: values.characterToReceive,
        qtyToPay: Number(values.quantityToPay),
        qtyToReceive: Number(values.quantityToReceive),
        puV: puV,
        status: "En attente",
      };
      try {
        setLoadingExchange(true);
        const response = await axios.post("/api/go/exchange", data);
        if (response) {
          toast.success(tScope("success"), {
            style: { color: "#16a34a" },
          });
          handleChatClick();
          setTimeout(() => {
            router.push("/order-success");
          }, 1000);
        }
      } catch (error) {
        //   console.log(error);
        toast.success(tScope("error"), {
          style: { color: "#dc2626" },
        });
      } finally {
        setLoadingExchange(false);
      }

      // console.log("Yes");
    }
  }

  return (
    <div className="font-poppins p-4 md:p-8 min-h-screen">
      <div className="max-w-6xl mx-auto mt-16 space-y-4 bg-[#1A1D21] p-4 rounded-[10px]">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
            {tScope("headeartitle")}
          </h1>
          <p className="text-white/90 text-sm">{tScope("info")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Card className="border-none shadow-lg backdrop-blur-sm">
              <CardContent className="p-0 bg-[#1A1D21]">
                <Alert
                  variant="success"
                  className="bg-[#363A3D] border-[#45494e] mb-2 p-2"
                >
                  <Coins className="h-4 w-4 text-green-500 -mt-2 -ml-0.5" />
                  <AlertDescription className="text-green-700">
                    {tScope("info")}
                  </AlertDescription>
                </Alert>

                <Alert
                  variant="destructive"
                  className="bg-[#363A3D] border-[#45494e] p-2"
                >
                  <AlertTriangle className="h-4 w-4 -mt-2 -ml-0.5" />
                  <AlertTitle className="font-semibold">
                    {tScope("title")}
                  </AlertTitle>
                  <AlertDescription className="text-red-500">
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

          <Card className="border-none shadow-xl bg-[#363A3D] backdrop-blur-sm">
            <CardContent className="p-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serverToPay"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90 font-medium">
                              {tScope("serverToPay")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 bg-[#1A1D21] text-white/90 border-[#45494e] focus:ring-0 focus:ring-offset-0">
                                  <SelectValue
                                    placeholder={tScope("placeholderServer")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#1A1D21] border-[#45494e] text-white">
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
                            <FormLabel className="text-white/90  font-medium">
                              {tScope("qtyToPay")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="h-11 bg-[#1A1D21] text-white/90 border-[#45494e] pl-4 pr-20 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                          <FormLabel className="text-white/90 font-medium">
                            {tScope("characterToPay")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-11 bg-[#1A1D21] text-white/90  border-[#45494e] outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="relative py-4">
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1D21] text-yellow-500 rounded-full p-2">
                        <ArrowRightLeft className="h-6 w-6 text-yellow-500" />
                      </div>
                      <hr className="border-[#5c5f63] " />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="serverToReceive"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white/90 font-medium">
                              {tScope("serverToReceive")}
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 bg-[#1A1D21] text-white/90 border-[#45494e] focus:ring-0 focus:ring-offset-0">
                                  <SelectValue
                                    placeholder={tScope("placeholderServer")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-[#1A1D21] border-[#45494e] text-white">
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
                            <FormLabel className="text-white/90 font-medium">
                              {tScope("qtyToReceive")}
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  className="h-11 bg-[#1A1D21] text-white/90 border-[#45494e] pl-4 pr-20 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                    {/* {serverExchangeRate && exchangeRate && (
                      <p className="text-white/90 font-medium text-sm text-center">
                        {tScope("serverExchangeRate", {
                          servername: serverExchangeRate,
                          serverRate:
                            Math.round(Number(exchangeRate) * 100) + "%",
                        })}
                      </p>
                    )} */}

                    <FormField
                      control={form.control}
                      name="characterToReceive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/90 font-medium">
                            {tScope("characterToReceive")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-11 bg-[#1A1D21] text-white/90 border-[#45494e] outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
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
                          <FormLabel className="text-white/90 font-medium">
                            {tScope("exchangeCode")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-11 bg-[#1A1D21] text-white/90 border-[#45494e] outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold text-lg transition-colors duration-200"
                    disabled={loadingExchange}
                    aria-label="Exchange order button"
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
      <Card className="w-full flex flex-col items-center justify-center mx-auto my-10 gap-4 max-w-6xl p-6 self-center bg-[#1A1D21] border-[#45494e]">
        <p className="text-base text-white/90">{tScope("desc1")}</p>
        <p className="text-base text-white/90">{tScope("desc2")}</p>
      </Card>
      <div className="w-full max-w-6xl my-5 mx-auto">
        <Testimonials />
      </div>
    </div>
  );
};

export default EchangeKamasClient;
