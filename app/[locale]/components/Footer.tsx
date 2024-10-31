"use client";

import React from "react";

import Image from "next/image";
import visa from "../../../assets/iben/visa.webp";
import crypto from "../../../assets/iben/crypto.webp";
import giropay from "../../../assets/iben/giropay.webp";
import mastercard from "../../../assets/iben/mastercard.webp";
import neosurf from "../../../assets/iben/neosurf.webp";
import paysafecard from "../../../assets/iben/paysafecard.webp";
import marocbank from "../../../assets/iben/marocbank.webp";
import paypal from "../../../assets/iben/paypal.png";
import crd_agricole from "../../../assets/iben/crd_agricole.png";
import sg from "../../../assets/iben/sg.png";
import cdmaroc from "../../../assets/iben/cdm-maroc.svg";

import nortonbrand from "../../../assets/secure/nortonbrand.png";
import ssl from "../../../assets/secure/ssl.png";
import trustS from "../../../assets/secure/trustS.png";

import { AiFillLike } from "react-icons/ai";
import { MdSecurity, MdFlashOn } from "react-icons/md";
import { IoArrowUndo } from "react-icons/io5";
import { useScopedI18n } from "@/locales/client";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { FaFacebookF, FaInstagram, FaSkype } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const pathname = usePathname();
  const tScope = useScopedI18n("footer");
  return (
    !pathname.includes("signin") &&
    !pathname.includes("signup") &&
    !pathname.includes("reset-password") &&
    !pathname.includes("profile") &&
    !pathname.includes("resetpassword") && (
      <footer className="font-poppins w-full bg-white text-white">
        {/* Stats Banner */}
        <div className="bg-[#18191A] p-6">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-start gap-2">
              <p className="text-base font-semibold text-white/90 w-full border-b border-dashed pb-2 border-gray-400">
                {tScope("satisfaction")}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="flex items-center justify-center rounded-full bg-white p-2 shadow-sm">
                  <AiFillLike size={30} className="text-black" />
                </span>
                <p className="text-sm text-white/80">
                  {tScope("satisfactionDesc")}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="text-base font-semibold text-white/90 w-full border-b border-dashed pb-2 border-gray-400">
                {tScope("secure")}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="flex items-center justify-center rounded-full bg-white p-2 shadow-sm">
                  <MdSecurity size={30} className="text-black" />
                </span>
                <p className="text-sm text-white/80">{tScope("secureDesc")}</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="text-base font-semibold text-white/90 w-full border-b border-dashed pb-2 border-gray-400">
                {tScope("fast")}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="flex items-center justify-center rounded-full bg-white p-2 shadow-sm">
                  <MdFlashOn size={30} className="text-black" />
                </span>
                <p className="text-sm text-white/80">{tScope("fastDesc")}</p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="text-base font-semibold text-white/90 w-full border-b border-dashed pb-2 border-gray-400">
                {tScope("refund")}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="flex items-center justify-center rounded-full bg-white p-2 shadow-sm">
                  <IoArrowUndo size={30} className="text-black" />
                </span>
                <p className="text-sm text-white/80">{tScope("refundDesc")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="bg-zinc-900 p-8">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Us Section */}
            <div>
              <h3 className="text-white/80 font-bold mb-4">
                {tScope("aboutTitle")}
              </h3>
              <p className="text-sm text-gray-300">{tScope("aboutDesc")}</p>
            </div>

            {/* Security Badges */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <Image
                src={nortonbrand}
                alt="Norton Secured"
                width={100}
                height={100}
                className="object-cover"
              />
              <Image
                src={ssl}
                alt="SSL Certificate"
                width={100}
                height={100}
                className="object-cover"
              />
              <Image
                src={trustS}
                alt="TrustedSite"
                width={100}
                height={100}
                className="object-cover"
              />
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white/80 font-bold mb-4">
                {tScope("quickLinkTitle")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="vendre-des-kamas"
                    className="text-gray-300 hover:text-white"
                  >
                    {tScope("quickLink1")}
                  </Link>
                </li>
                <li>
                  <a
                    href="/echange-de-kamas"
                    className="text-gray-300 hover:text-white"
                  >
                    {tScope("quickLink2")}
                  </a>
                </li>
                <li>
                  <a href="#home" className="text-gray-300 hover:text-white">
                    {tScope("quickLink3")}
                  </a>
                </li>
                <li>
                  <Link
                    href="/profile/orders-buys"
                    className="text-gray-300 hover:text-white"
                  >
                    {tScope("quickLink4")}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-white/80 font-bold mb-4">
                {tScope("infoTitle")}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white">
                    {tScope("info1")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-and-policy"
                    className="text-gray-300 hover:text-white"
                  >
                    {tScope("info2")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="text-gray-300 hover:text-white"
                  >
                    {tScope("info3")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-gray-300 hover:text-white"
                  >
                    {tScope("info4")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-8 border-t border-gray-700 pt-8">
            <p className="text-xs text-gray-400 text-center mb-4">
              &copy; 2024 JBK Services INTERNATIONAL FZ-LLC, Compass Building,
              Al Shohada Road, AL Hamra Industrial Zone-FZ, Ras Al Khaimah,
              United Arab Emirates JBIK INTERNATIONAL CO., LIMITED (payment
              processing for Cardpay). Registered address :ROOMS
              1318-20,HOLLYWOODPLAZA, 610 NATHAN ROAD, MONGKOK KOWLOON
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4">
              <Image
                src={visa}
                alt="Visa"
                width={50}
                height={20}
                className="object-cover"
              />
              <Image
                width={40}
                height={10}
                src={mastercard}
                alt="Mastercard"
                className="object-cover"
              />
              <Image
                src={paysafecard}
                width={90}
                height={85}
                alt="PaySafeCard"
                className="object-cover"
              />
              <Image
                src={crypto}
                width={130}
                height={80}
                alt="Cryptocurrency"
                className="object-cover"
              />
              <Image
                src={paypal}
                width={95}
                height={60}
                alt="PayPal"
                className="object-cover"
              />
              <Image
                src={neosurf}
                width={70}
                height={55}
                alt="Neosurf"
                className="object-cover"
              />
              <Image
                src={giropay}
                width={60}
                height={40}
                alt="Giropay"
                className="object-cover"
              />
              <Image
                src={marocbank}
                width={100}
                height={50}
                alt="Marocco bank"
                className="object-cover"
              />

              <Image
                src={crd_agricole}
                width={100}
                height={50}
                alt="Marocco bank"
                className="object-cover"
              />
              <Image
                src={sg}
                width={100}
                height={50}
                alt="Marocco bank"
                className="object-cover"
              />
              <Image
                src={cdmaroc}
                width={70}
                height={70}
                alt="Marocco bank"
                className="object-cover"
              />
            </div>
            <div className="sm:hidden flex  items-center justify-center gap-4 max-sm:flex-col self-center">
              <span className="text-white/80">Follow us</span>
              <div className="flex space-x-4">
                <Link
                  href="#"
                  className="flex items-center justify-center p-2 rounded-full border border-zinc-500 text-blue-600 hover:border-zinc-800"
                >
                  <FaFacebookF size={18} />
                </Link>

                <Link
                  href="#"
                  className="flex items-center justify-center p-2 rounded-full border border-zinc-500 hover:border-zinc-800 text-pink-600"
                >
                  <FaInstagram size={18} />
                </Link>

                <Link
                  href="#"
                  className="flex items-center justify-center p-2 rounded-full border border-zinc-500 text-black hover:border-zinc-800"
                >
                  <FaXTwitter size={18} />
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-center p-2 rounded-full border border-zinc-500 text-blue-600 hover:border-zinc-800"
                >
                  <FaSkype size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
