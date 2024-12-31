"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScopedI18n } from "@/locales/client";

const FaqPage = () => {
  const tScope = useScopedI18n("faq");
  const faqData = [
    {
      title: tScope("guaranteTitle"),
      content: tScope("guaranteDesc"),
    },
    {
      title: tScope("processTitle"),
      content: tScope("processDesc"),
    },
    {
      title: tScope("kamasRTitle"),
      content: tScope("kamasRDesc"),
    },
    {
      title: tScope("scamTitle"),
      content: tScope("scamDesc"),
    },
    {
      title: tScope("roolbackTitle"),
      content: tScope("rollbackDesc"),
    },
    {
      title: tScope("supportTitle"),
      content: tScope("supportDesc"),
    },
    {
      title: tScope("paymentTitle"),
      content: tScope("paymentDesc"),
    },
    {
      title: tScope("safetyTitle"),
      content: tScope("safetyDesc"),
    },
    {
      title: tScope("exchangeTitle"),
      content: tScope("exchangeDesc"),
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 font-poppins">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {tScope("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center mb-6 text-gray-600 text-lg">
            {tScope("desc")}
          </p>

          <Accordion type="single" collapsible className="w-full px-4 py-12">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:bg-gray-100 p-4 rounded-md text-lg font-semibold">
                  {faq.title}
                </AccordionTrigger>
                <AccordionContent className="p-4 text-lg">
                  {faq.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FaqPage;
