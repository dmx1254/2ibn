"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { useScopedI18n } from "@/locales/client";

interface CardDesc {
  title: string;
  content: string;
  steps?: string[];
}

const TermsAndConditions = () => {
  const tScope = useScopedI18n("termsandconditions");
  const tScopeLegal = useScopedI18n("termsandconditions.legalNotice");
  const termsData = [
    {
      title: tScope("title"),
      content: tScope("companyInfo"),
    },
    {
      title: tScope("privacyTitle"),
      content: tScope("privacyDesc"),
    },
    {
      title: tScope("communicationTitle"),
      content: tScope("communicationDesc"),
    },
    {
      title: tScope("copyrightTitle"),
      content: tScope("copyrightDesc"),
    },
    {
      title: tScope("licenceTitle"),
      content: tScope("licenceDesc"),
    },
    {
      title: tScope("accountTitle"),
      content: tScope("accountDesc"),
    },
    {
      title: tScope("pricingTitle"),
      content: tScope("pricingDesc"),
    },
    {
      title: tScope("refundTitle"),
      content: tScope("refundDesc"),
    },
    {
      title: tScope("thirdPartyTitle"),
      content: tScope("thirdPartyDesc"),
    },
    {
      title: tScope("deliveryPolicyTitle"),
      content: tScope("deliveryPolicyDesc"),
    },
    {
      title: tScope("policyModifTitle"),
      content: tScope("policyModifDesc"),
    },
  ];

  const legalNotices: CardDesc[] = [
    {
      title: tScopeLegal("amlTitle"),
      content: tScopeLegal("amlDesc"),
    },
    {
      title: tScopeLegal("secTitle"),
      content: tScopeLegal("secDesc"),
    },
    {
      title: tScopeLegal("transTitle"),
      content: tScopeLegal("transDesc"),
    },
    {
      title: tScopeLegal("contTitle"),
      content: tScopeLegal("contDesc"),
    },
    {
      title: tScopeLegal("presTitle"),
      content: tScopeLegal("presDesc"),
    },
    {
      title: tScopeLegal("verifTitle"),
      content: tScopeLegal("verifDesc"),
      steps: [
        tScopeLegal("verifStep1"),
        tScopeLegal("verifStep2"),
        tScopeLegal("verifStep3"),
      ],
    },
    {
      title: tScopeLegal("payTitle"),
      content: tScopeLegal("payDesc"),
      steps: [tScopeLegal("payStep1"), tScopeLegal("payStep2")],
    },
    {
      title: tScopeLegal("cryptoTitle"),
      content: tScopeLegal("cryptoDesc"),
    },
  ];

  return (
    <div className="container font-poppins mx-auto max-w-4xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {tScope("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {termsData.map((section, index) => (
              <div key={index} className="p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {section.title}
                </h3>
                <p className="text-gray-600">{section.content}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {tScopeLegal("title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {legalNotices.map((section, index) => (
              <div key={index} className="p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {section.title}
                </h3>
                <p className="text-gray-600">{section.content}</p>
                {section.steps && (
                  <ul className="list-disc ml-6 text-gray-600">
                    {section.steps.map((step, index) => (
                      <li className="font-semibold" key={index}>
                        {step}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>{tScope("bottomDesc")}</p>
            <p>© 2024 2IBN.com. {tScope("bottomDescAllRight")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
