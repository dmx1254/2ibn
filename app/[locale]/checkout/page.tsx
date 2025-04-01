"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "../components/ui/card";
import Link from "next/link";
import CheckoutConnect from "../components/CheckoutConnect";
import AccountAndBilling from "../components/AccountAndBilling";
import { useSession } from "next-auth/react";
import { FaCaretDown } from "react-icons/fa";
import {
  Billing,
  orderBuyNumGenerated,
  parsedDevise,
  paymentMethod,
  paymentMethodMorroco,
} from "@/lib/utils";
import Image from "next/image";
import useStore from "@/lib/store-manage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import axios from "axios";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

// Composant pour l'étape de connexion
const ConnectionStep = ({
  onContinue,
  setActiveStep,
  cartControl,
  isNewAccount,
  setIsNewAccount,
  invitedAccount,
  setInvitedAccount,
  handleChangeNewAccount,
  handleChangeInvitedAccount,
}: {
  onContinue: () => void;
  setActiveStep: (step: string) => void;
  cartControl: number;
  isNewAccount: boolean;
  setIsNewAccount: (type: boolean) => void;
  invitedAccount: boolean;
  setInvitedAccount: (type: boolean) => void;
  handleChangeNewAccount: (type: boolean) => void;
  handleChangeInvitedAccount: (type: boolean) => void;
}) => {
  return (
    <CheckoutConnect
      onContinue={onContinue}
      isNewAccount={isNewAccount}
      setIsNewAccount={setIsNewAccount}
      setActiveStep={setActiveStep}
      cartControl={cartControl}
      invitedAccount={invitedAccount}
      setInvitedAccount={setInvitedAccount}
      handleChangeNewAccount={handleChangeNewAccount}
      handleChangeInvitedAccount={handleChangeInvitedAccount}
    />
  );
};

// Composant pour l'étape des informations de facturation

// Composant pour l'étape du mode de paiement
const PaymentStep = ({
  isActivePayment,
  handleActivePayment,
}: {
  isActivePayment: string;
  handleActivePayment: (pay: string) => void;
}) => {
  const tsCope = useScopedI18n("paymentMode");
  return (
    <Card className="w-full flex max-md:flex-col items-start gap-8 justify-between border-none shadow-none">
      <Card className="w-full flex flex-col items-start border-none h-full  shadow-none">
        <h2 className="text-base mb-6 font-semibold">{tsCope("title")}</h2>
        <div className="w-full flex flex-col items-start gap-6">
          {paymentMethod.map((p) => (
            <div
              aria-label={`${p.title} payment method`}
              key={p.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleActivePayment(p.title)}
            >
              <input
                type="radio"
                className="cursor-pointer"
                onChange={() => handleActivePayment(p.title)}
                checked={isActivePayment === p.title}
              />
              <Image
                className="w-full h-auto object-cover object-center"
                src={p.imgPay}
                width={200}
                height={200}
                alt="payment method"
              />
              {p.fee && (
                <span className="w-full">{`${p.fee}% ${tsCope("fee")}`}</span>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card className="w-full flex flex-col items-start border-none h-full  shadow-none">
        <h2 className="text-base mb-6 font-semibold">
          {tsCope("titleMorroco")}
        </h2>
        <div className="w-full flex flex-col items-start gap-6">
          {paymentMethodMorroco.map((p) => (
            <div
              aria-label={`${p.title} payment method`}
              key={p.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleActivePayment(p.title)}
            >
              <input
                type="radio"
                className="cursor-pointer"
                onChange={() => handleActivePayment(p.title)}
                checked={isActivePayment === p.title}
              />
              <Image
                className="object-cover object-center"
                src={p.imgPay}
                width={250}
                height={250}
                alt="payment method"
              />
              {p.fee && (
                <span className="w-full">{`${p.fee}% ${tsCope("fee")}`}</span>
              )}
            </div>
          ))}
        </div>
      </Card>
    </Card>
  );
};

// Composant pour l'étape de confirmation
const ConfirmationStep = ({
  isOrderLoading,
  handleCheckout,
  status,
  invitedAccount,
}: {
  isOrderLoading: boolean;
  handleCheckout: () => void;
  status: string;
  invitedAccount: boolean;
}) => {
  const tScope = useScopedI18n("checkout");
  const { carts } = useStore();
  const subtotal = carts.reduce((total, item) => total + item.totalPrice, 0);
  const shipping = 0.0;
  const total = subtotal + shipping;

  return (
    <div className="w-full max-w-6xl">
      <Table className="w-full text-black/80 text-center">
        <TableHeader>
          <TableRow className="bg-black/80 border-[#76828D]">
            <TableHead className="text-amber-600 text-left">
              {tScope("orderTitle")}
            </TableHead>
            <TableHead className="text-amber-600 text-left">
              {tScope("jeu")}
            </TableHead>
            <TableHead className="text-amber-600 text-left">
              {tScope("qty")}
            </TableHead>

            <TableHead className="text-amber-600 text-left">
              {tScope("price")}
            </TableHead>
            <TableHead className="text-amber-600 text-left">
              {tScope("total")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carts?.map((item, index) => (
            <TableRow
              className="border-gray-200"
              key={item.productId}
              style={{
                border: index === carts.length - 1 ? "none" : "",
              }}
            >
              <TableCell className="font-medium text-left">
                <div className="inline-flex flex-col items-start">
                  <p>
                    {tScope("server")}: {item.server}
                  </p>
                  <p>
                    {tScope("qtyDeliver")}: {item.amount}M
                  </p>
                  <p>
                    {tScope("characterName")}:{" "}
                    <strong className="capitalize">{item.character}</strong>
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium text-left">
                <span className="uppercase">
                  {item.category.split("-").join(" ")}{" "}
                </span>
              </TableCell>
              <TableCell className="font-medium text-left">
                <span className="mx-3 font-medium">{item.amount}</span>
              </TableCell>
              <TableCell className="font-medium text-left">
                <span className="font-semibold whitespace-nowrap">
                  {item.unitPrice.toFixed(2)} {parsedDevise(item.currency)}
                </span>
              </TableCell>
              <TableCell className="font-medium text-left">
                {item.totalPrice.toFixed(2)} {parsedDevise(item.currency)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="w-full border-gray-200 bg-gray-100">
            <TableCell
              className="font-medium text-end self-end placeholder:text-white"
              colSpan={6}
            >
              <div className="w-full text-right text-black/80">
                <p className="w-full">
                  {tScope("sousTotal")}:{" "}
                  <span className="ml-12">{subtotal.toFixed(2)}</span>
                  {parsedDevise(carts[0].currency)}
                </p>

                <p className="w-full mt-4">
                  {tScope("total")}:{" "}
                  <span className="ml-12">
                    {total.toFixed(2)}
                    {parsedDevise(carts[0].currency)}
                  </span>
                </p>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div className="w-full mt-6 mb-2">
        <div className="w-full flex items-end justify-end">
          <button
            onClick={handleCheckout}
            className="p-3 bg-black/80 text-white rounded transition-colors hover:opacity-85"
            disabled={status !== "authenticated" && !invitedAccount}
            style={{
              opacity: status !== "authenticated" && !invitedAccount ? 0.6 : 1,
            }}
          >
            {isOrderLoading ? (
              <span className="flex items-center gap-1">
                <Loader className="animate-spin" size={24} />
              </span>
            ) : (
              tScope("btnCom")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Checkout = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState<any>({
    lastname: "",
    firstname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    city: "",
    codePostal: "",
    country: "",
    departement: "",
  });

  const [billingInfo, setBillingInfo] = useState<Billing>({
    lastname: "",
    firstname: "",
    address: "",
    phone: "",
    email: "",
    city: "",
    codePostal: "",
    country: "",
    departement: "",
  });

  // console.log(billingInfo);

  const tScope = useScopedI18n("cartpage");
  const tScopeR = useScopedI18n("signup");
  const tScopeCheck = useScopedI18n("checkout");
  const tScopeConfirm = useScopedI18n("orderConfirmation");
  const { carts } = useStore();
  const isConnected = status === "authenticated" ? "facturation" : "connexion";
  const [activeStep, setActiveStep] = useState<string>(isConnected);
  const [isOrderLoading, setIsOrderLoading] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [isActivePayment, setIsActivePayment] = useState<string>("");

  const [isNewAccount, setIsNewAccount] = useState<boolean>(true);
  const [invitedAccount, setInvitedAccount] = useState<boolean>(false);

  const handleChangeNewAccount = (checked: boolean) => {
    if (checked) {
      setIsNewAccount(true);
      setInvitedAccount(false);
    }
  };
  const handleChangeInvitedAccount = (checked: boolean) => {
    if (checked) {
      setInvitedAccount(true);
      setIsNewAccount(false);
    } else {
      setIsNewAccount(true);
      setInvitedAccount(false);
    }
  };

  const subtotal = carts.reduce((total, item) => total + item.totalPrice, 0);
  const shipping = 0.0;
  const total = subtotal + shipping;

  const handleActivePayment = (payment: string) => {
    setIsActivePayment(payment);
  };

  // console.log(isActivePayment);

  const handleContinue = () => {
    if (activeStep === "connexion") {
      setActiveStep("facturation");
    } else if (activeStep === "facturation") {
      setActiveStep("paiement");
    } else if (activeStep === "paiement") {
      setActiveStep("confirmation");
    }
  };

  const handleCreateAccountSubmit = async () => {
    // console.log(formData);
    const data = {
      email: formData.email,
      password: formData.password,
      code: "",
      isAdmin: false,
      moderator: false,
      profil: "",
      lastname: formData.lastname,
      firstname: formData.firstname,
      phone: formData.phone,
      address: formData.address,
      country: formData.country,
      city: formData.city,
      departement: formData.departement,
      postalCode: formData.codePostal,
      isEmailVerified: false,
    };

    try {
      setLoadingRegister(true);
      await axios.post("/api/iben/user/register", data).then((response) => {
        if (response.data) {
          toast.success(tScopeR("serverSuccess.successMessage"), {
            style: { color: "#22c55e" },
          });
          setLoadingRegister(false);
          setTimeout(() => {
            setActiveStep("connexion");
          }, 1000);
        }
      });
    } catch (error: any) {
      // console.log(error);
      if (error?.response?.data?.userError) {
        toast.error(tScopeR("serverError.userError"), {
          style: { color: "#dc2626" },
        });
      }
    } finally {
      setLoadingRegister(false);
    }
  };

  function handleChatClick() {
    //@ts-ignore
    void window?.Tawk_API.toggle();
  }

  const handleCheckout = async () => {
    const products = carts.map((cart) => {
      return {
        productId: cart.productId,
        category: cart.category,
        server: cart.server,
        qty: cart.qty,
        amount: cart.amount,
        bonus: cart.bonus,
        price: cart.unitPrice.toFixed(2),
        character: cart.character,
        totalPrice: cart.totalPrice.toFixed(2),
      };
    });

    const userId =
      status === "authenticated"
        ? session?.user.id
        : invitedAccount
        ? `invitedOrder-${billingInfo.phone}`
        : "Commande invite";
    const data = {
      userId: userId,
      orderNum: orderBuyNumGenerated(),
      products: products,
      address: "",
      status: "En attente",
      totalPrice: total.toFixed(2),
      paymentMethod: isActivePayment,
      orderIdPaid: "",
      cur: carts[0]?.currency,
      valCurency: Number(carts[0]?.valCurrency),
      billing: billingInfo,
    };

    // const billing = billingInfo;
    if (isActivePayment === "paypal") {
      // try {
      //   setIsOrderLoading(true);
      //   const result = await axios.post("/api/paypal", {
      //     data,
      //     object: tScopeConfirm("object"),
      //   });
      //   window.location.href = result.data.redirectUrl;
      // } catch (error) {
      //   console.log(error);
      // } finally {
      //   setIsOrderLoading(false);
      // }
      console.log("yes");
    } else {
      try {
        setIsOrderLoading(true);
        const result = await axios.post("/api/iben/order", {
        data,
        object: tScopeConfirm("object"),
      });
      if (result.data) {
        toast.success(tScope("success"), {
          style: { color: "#16a34a" },
        });

        setTimeout(() => {
          // handleChatClick();
          router.push("/order-success");
        }, 1000);
      }
    } catch (error) {
      toast.success(tScope("error"), {
        style: { color: "#dc2626" },
      });
      console.log(error);
      } finally {
        setIsOrderLoading(false);
      }
    }
  };

  return carts.length > 0 ? (
    <div className="max-w-7xl mx-auto p-4 text-black/80">
      <div className="flex items-center justify-center text-sm text-gray-500">
        <Link href="/" className="transition-colors hover:text-yellow-600">
          {tScopeCheck("acc")}
        </Link>
        &nbsp;»&nbsp;
        <Link href="/cart" className="transition-colors hover:text-yellow-600">
          {tScopeCheck("pan")}
        </Link>
        &nbsp;»&nbsp;
        <Link
          href="/checkout"
          className="transition-colors hover:text-yellow-600"
        >
          {tScopeCheck("com")}
        </Link>
      </div>
      <div className="w-full flex flex-col items-start">
        <div className="w-full border-b py-2 my-4">
          <h1 className="w-full text-xl font-bold">{tScopeCheck("com")}</h1>
        </div>

        <Card className="w-full shadow-none border-none mt-2">
          <Accordion
            type="single"
            value={activeStep}
            onValueChange={setActiveStep}
            collapsible
          >
            {status !== "authenticated" && (
              <AccordionItem value="connexion">
                <AccordionTrigger
                  className="px-4 bg-black/80 text-white"
                  isShowIcon={false}
                  disabled={carts.length < 1}
                >
                  <span className="flex items-center gap-1">
                    {tScopeCheck("step1", { step1: 1 })}
                    <FaCaretDown className="text-white" />
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4">
                    <ConnectionStep
                      onContinue={() => handleContinue()}
                      setActiveStep={setActiveStep}
                      cartControl={carts.length}
                      isNewAccount={isNewAccount}
                      setIsNewAccount={setIsNewAccount}
                      invitedAccount={invitedAccount}
                      setInvitedAccount={setInvitedAccount}
                      handleChangeNewAccount={handleChangeNewAccount}
                      handleChangeInvitedAccount={handleChangeInvitedAccount}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="facturation">
              <AccordionTrigger
                className="px-4 bg-black/80 text-white"
                isShowIcon={false}
                disabled={carts.length < 1}
              >
                <span className="flex items-center gap-1">
                  {status === "authenticated"
                    ? tScopeCheck("step2Conn", {
                        step2: status === "authenticated" ? 1 : 2,
                      })
                    : tScopeCheck(
                        invitedAccount ? "step2Conn" : "step2NoConn",
                        {
                          step2: status === "unauthenticated" ? 2 : 1,
                        }
                      )}
                  <FaCaretDown className="text-white" />
                </span>
              </AccordionTrigger>
              <AccordionContent className="w-full">
                <AccountAndBilling
                  status={status}
                  onContinue={() => handleContinue()}
                  formData={formData}
                  setFormData={setFormData}
                  createAccount={handleCreateAccountSubmit}
                  loadingRegister={loadingRegister}
                  billingInfo={billingInfo}
                  setBillingInfo={setBillingInfo}
                  invitedAccount={invitedAccount}
                />
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="paiement">
              <AccordionTrigger
                className="px-4 bg-black/80 text-white"
                isShowIcon={false}
                disabled={carts.length < 1 || !billingInfo.firstname}
              >
                <span className="flex items-center gap-1">
                  {tScopeCheck("step3", {
                    step3: status === "authenticated" ? 2 : 3,
                  })}
                  <FaCaretDown className="text-white" />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <PaymentStep
                    isActivePayment={isActivePayment}
                    handleActivePayment={handleActivePayment}
                  />
                  <div className="mt-8">
                    <button
                      onClick={() => handleContinue()}
                      className="bg-yellow-600 text-base text-white px-6 py-2 rounded hover:bg-yellow-700 transition-colors"
                      disabled={!isActivePayment}
                      style={{
                        opacity: isActivePayment ? 1 : 0.7,
                      }}
                    >
                      {tScopeCheck("continu")}
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="confirmation">
              <AccordionTrigger
                className="px-4 bg-black/80 text-white"
                isShowIcon={false}
                disabled={carts.length < 1 || !isActivePayment}
              >
                <span className="flex items-center gap-1">
                  {tScopeCheck("step4", {
                    step4: status === "authenticated" ? 3 : 4,
                  })}
                  <FaCaretDown className="text-white" />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  <ConfirmationStep
                    isOrderLoading={isOrderLoading}
                    handleCheckout={handleCheckout}
                    status={status}
                    invitedAccount={invitedAccount}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      </div>
    </div>
  ) : (
    <div className="w-full max-w-3xl m-28 flex items-center justify-center mx-auto p-8 bg-red-50 rounded">
      <p className="text-red-600 text-lg">{tScopeCheck("notCartFound")}</p>
    </div>
  );
};

export default Checkout;
