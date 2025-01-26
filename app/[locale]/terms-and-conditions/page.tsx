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
  subDesc1?: {
    title: string;
    desc: string;
  }[];
  subDesc2?: {
    title: string;
    desc: string;
  }[];
  middleDesc?: string;
}

// refundsubTitle1
// refundsubDesc1
// refundsubTitle2
// refundsubDesc2
// desMiddle
// refundsubTitle3
// refundsubDesc3
// refundsubTitle4
// refundsubDesc4

const TermsAndConditions = () => {
  const tScope = useScopedI18n("termsandconditions");
  const tScopeLegal = useScopedI18n("termsandconditions.legalNotice");
  const termsData: CardDesc[] = [
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
      subDesc1: [
        {
          title: tScope("refundsubTitle1"),
          desc: tScope("refundsubDesc1"),
        },
        {
          title: tScope("refundsubTitle2"),
          desc: tScope("refundsubDesc2"),
        },
      ],
      subDesc2: [
        {
          title: tScope("refundsubTitle3"),
          desc: tScope("refundsubDesc3"),
        },
        {
          title: tScope("refundsubTitle4"),
          desc: tScope("refundsubDesc4"),
        },
      ],
      middleDesc: tScope("desMiddle"),
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
    // {
    //   title: tScopeLegal("transTitle"),
    //   content: tScopeLegal("transDesc"),
    // },
    // {
    //   title: tScopeLegal("contTitle"),
    //   content: tScopeLegal("contDesc"),
    // },
    // {
    //   title: tScopeLegal("presTitle"),
    //   content: tScopeLegal("presDesc"),
    // },
    // {
    //   title: tScopeLegal("verifTitle"),
    //   content: tScopeLegal("verifDesc"),
    //   steps: [
    //     tScopeLegal("verifStep1"),
    //     tScopeLegal("verifStep2"),
    //     tScopeLegal("verifStep3"),
    //   ],
    // },
    // {
    //   title: tScopeLegal("payTitle"),
    //   content: tScopeLegal("payDesc"),
    //   steps: [tScopeLegal("payStep1"), tScopeLegal("payStep2")],
    // },
    // {
    //   title: tScopeLegal("cryptoTitle"),
    //   content: tScopeLegal("cryptoDesc"),
    // },
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
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="">{section.content.replace("<br></br>", "")}</p>
                <div className="flex flex-col items-start gap-4">
                  {section.subDesc1 &&
                    section.subDesc1.map((sec1, i) => (
                      <div key={i}>
                        <span className="font-semibold">
                          {`● ${sec1.title}`} :{" "}
                        </span>
                        {sec1.desc}
                      </div>
                    ))}
                </div>
                {section.middleDesc && (
                  <p className="my-4">{section.middleDesc}</p>
                )}
                <div className="flex flex-col items-start gap-4">
                  {section.subDesc2 &&
                    section.subDesc2.map((sec2, i) => (
                      <div key={i}>
                        <span className="font-semibold">
                          {`● ${sec2.title}`} :{" "}
                        </span>
                        {sec2.desc}
                      </div>
                    ))}
                </div>
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
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <p className="">{section.content}</p>
                {section.steps && (
                  <ul className="list-disc ml-6">
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
            <p>© 2024 ibendouma.com. {tScope("bottomDescAllRight")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
