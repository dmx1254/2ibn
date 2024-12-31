"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { useScopedI18n } from "@/locales/client";

const PrivacyAndPolicy = () => {
  const tScope = useScopedI18n("privacyandpolicy");
  const termsData = [
    {
      title: tScope("title"),
      content: tScope("intro"),
    },
    {
      title: tScope("consent.title"),
      content: tScope("consent"),
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
                <h3 className="text-lg font-semibold mb-2 text-gray-800">
                  {section.title}
                </h3>
                <p className="text-gray-600">{section.content}</p>
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
