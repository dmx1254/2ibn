"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useScopedI18n } from "@/locales/client";

type Terms = {
  title: string;
  content: string;
  subType?: {
    title: string;
    desc: string;
    subContents: {
      title?: string;
      desc: string;
      subSubContent?: string[];
    }[];
  }[];
};

const PrivacyAndPolicy = () => {
  const tScope = useScopedI18n("privacyandpolicy");
  const termsData: Terms[] = [
    {
      title: tScope("title"),
      content: tScope("intro"),
    },
    {
      title: tScope("consent.title"),
      content: tScope("consent"),
      subType: [
        {
          title: tScope("typesTitle"),
          desc: tScope("typesDesc"),
          subContents: [
            {
              title: tScope("typesContTitle1"),
              desc: tScope("typesContDesc1"),
            },
            {
              title: tScope("typesContTitle2"),
              desc: tScope("typesContDesc2"),
            },
            {
              title: tScope("typesContTitle3"),
              desc: tScope("typesContDesc3"),
              subSubContent: [
                tScope("typesContSub1"),
                tScope("typesContSub2"),
                tScope("typesContSub3"),
                tScope("typesContSub4"),
                tScope("typesContSub5"),
              ],
            },
            {
              title: tScope("typesContTitle4"),
              desc: tScope("typesContDesc4"),
              subSubContent: [
                tScope("typesContSub6"),
                tScope("typesContSub7"),
                tScope("typesContSub8"),
              ],
            },
            {
              title: tScope("typesContTitle5"),
              desc: tScope("typesContDesc5"),
            },
          ],
        },
        {
          title: tScope("useInfoTitle"),
          desc: tScope("useInfoDesc"),
          subContents: [
            {
              desc: tScope("useInfoCont1"),
            },
            {
              desc: tScope("useInfoCont2"),
            },
            {
              desc: tScope("useInfoCont3"),
            },
            {
              desc: tScope("useInfoCont4"),
            },
            {
              desc: tScope("useInfoCont5"),
            },
            {
              desc: tScope("useInfoCont6"),
            },
          ],
        },
      ],
    },
    {
      title: tScope("informationCollectionAndUse.title"),
      content: tScope("informationCollectionAndUse"),
    },
    {
      title: tScope("registration.title"),
      content: tScope("registration"),
    },
    {
      title: tScope("promotions.title"),
      content: tScope("promotions"),
    },
    {
      title: tScope("otherInfoCollected.title"),
      content: tScope("otherInfoCollected"),
    },
    {
      title: tScope("newsletters.title"),
      content: tScope("newsletters"),
    },
    {
      title: tScope("cookies.title"),
      content: tScope("cookies"),
    },
    {
      title: tScope("logFiles.title"),
      content: tScope("logFiles"),
    },
    {
      title: tScope("clearGifs.title"),
      content: tScope("clearGifs"),
    },
    {
      title: tScope("thirdPartySources.title"),
      content: tScope("thirdPartySources"),
    },
    {
      title: tScope("thirdPartyAdvertising.title"),
      content: tScope("thirdPartyAdvertising"),
    },
    {
      title: tScope("specialOffers.title"),
      content: tScope("specialOffers"),
    },
    {
      title: tScope("serviceAnnouncements.title"),
      content: tScope("serviceAnnouncements"),
    },
    {
      title: tScope("research.title"),
      content: tScope("research"),
    },
    {
      title: tScope("customerService.title"),
      content: tScope("customerService"),
    },
    {
      title: tScope("preferences.title"),
      content: tScope("preferences"),
    },
    {
      title: tScope("informationSharing.title"),
      content: tScope("informationSharing"),
    },
    {
      title: tScope("serviceProviders.title"),
      content: tScope("serviceProviders"),
    },
    {
      title: tScope("otherThirdParties.title"),
      content: tScope("otherThirdParties"),
    },
    {
      title: tScope("compliance.title"),
      content: tScope("compliance"),
    },
    {
      title: tScope("choiceOptOut.title"),
      content: tScope("choiceOptOut"),
    },
    {
      title: tScope("links.title"),
      content: tScope("links"),
    },
    {
      title: tScope("storageSecurity.title"),
      content: tScope("storageSecurity"),
    },
    {
      title: tScope("security.title"),
      content: tScope("security"),
    },
    {
      title: tScope("internetFraud.title"),
      content: tScope("internetFraud"),
    },
    {
      title: tScope("internationalTransfer.title"),
      content: tScope("internationalTransfer"),
    },
    {
      title: tScope("children.title"),
      content: tScope("children"),
    },
    {
      title: tScope("changes.title"),
      content: tScope("changes"),
    },
    {
      title: tScope("contactInformation.title"),
      content: tScope("contactInformation"),
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
                <h3 className="text-lg font-semibold mb-2">
                  {section.title}
                </h3>
                <p className="">{section.content}</p>
                {section.subType &&
                  section.subType.map((sec, index) => (
                    <div key={index} className="flex flex-col items-start mt-2">
                      <p className="text-base font-semibold mb-2">
                        2.{index + 1} {sec.title} :
                      </p>
                      <p className="">{sec.desc}</p>

                      {sec.subContents &&
                        sec.subContents.map((c, index) => (
                          <div key={index} className="ml-12">
                            <div>
                              <span className="font-semibold">
                                {`● ${c.title ?? ""}`}
                              </span>{" "}
                              {c.title && ":"} {c.desc}
                            </div>
                            <div className="flex flex-col items-start gap-2 ml-12">
                              {c.subSubContent &&
                                c.subSubContent.map((sb, index) => (
                                  <div key={index}>
                                    <span className="text-xs">○</span> {sb}
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  ))}
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

export default PrivacyAndPolicy;
