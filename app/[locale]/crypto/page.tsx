"use client";

import React from "react";
import { useScopedI18n } from "@/locales/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/[locale]/components/ui/card";
import { Shield, Zap, Headset, Banknote, Send } from "lucide-react";
import Link from "next/link";
import { BsPaypal } from "react-icons/bs";
import { SiSepa } from "react-icons/si";
import { RiBankFill } from "react-icons/ri";
import { MdOutlinePayment } from "react-icons/md";

const CryptoPage = () => {
  const t = useScopedI18n("crypto");

  const paymentMethods = [
    {
      icon: <BsPaypal className="w-6 h-6" />,
      title: "PayPal",
      description: t("paypalDesc"),
    },
    {
      icon: <MdOutlinePayment className="w-6 h-6" />,
      title: "Skrill",
      description: t("skrillDesc"),
    },
    {
      icon: <SiSepa className="w-6 h-6" />,
      title: "SEPA",
      description: t("sepaDesc"),
    },
    {
      icon: <RiBankFill className="w-6 h-6" />,
      title: t("bankTransfer"),
      description: t("bankTransferDesc"),
    },
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("security"),
      description: t("securityDesc"),
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t("speed"),
      description: t("speedDesc"),
    },
    {
      icon: <Headset className="w-6 h-6" />,
      title: t("support"),
      description: t("supportDesc"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#eab308] to-[#f97316] text-transparent bg-clip-text">
            {t("title")}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t("description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="https://t.me/ibendouma"
              target="_blank"
              className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077aa] text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              {t("telegram")}
            </Link>
            <Link
              href="https://wa.me/971529087560"
              target="_blank"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-6 py-3 rounded-lg transition-all duration-300"
            >
              <Send className="w-5 h-5" />
              {t("whatsapp")}
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("paymentMethods")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {paymentMethods.map((method, index) => (
              <Card
                key={index}
                className="bg-[#18191A] border border-[#45494e] hover:shadow-lg hover:border-[#eab308]/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-[#eab308]/60 rounded-lg flex items-center justify-center mb-4">
                    {method.icon}
                  </div>
                  <CardTitle className="text-xl text-white/80">
                    {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{method.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t("whyChooseUs")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-[#18191A] border border-[#45494e] hover:shadow-lg hover:border-[#eab308]/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-[#eab308]/60 rounded-lg flex items-center justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl text-white/80">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Legal Notice */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {t("legalNotice")}
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {t("legalNoticeDesc")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CryptoPage;
