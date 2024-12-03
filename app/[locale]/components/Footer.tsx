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
import barid from "../../../assets/iben/barid.webp";
import bnpParibas from "../../../assets/iben/bnpParibas.jpg";
import paypal from "../../../assets/iben/paypal.png";
import crd_agricole from "../../../assets/iben/crd_agricole.png";
import sg from "../../../assets/iben/sg.png";
import cdmaroc from "../../../assets/iben/cdm-maroc.svg";

import nortonbrand from "../../../assets/secure/nortonbrand.png";
import sslShopper from "../../../assets/secure/ssl-shopper.svg";
import ssl from "../../../assets/secure/ssl.png";
import trustS from "../../../assets/secure/trustS.png";

import { AiFillLike } from "react-icons/ai";
import { MdSecurity, MdFlashOn } from "react-icons/md";
import { IoArrowUndo } from "react-icons/io5";
import { useScopedI18n } from "@/locales/client";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  FaDiscord,
  FaFacebookF,
  FaInstagram,
  FaSkype,
  FaTelegramPlane,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const pathname = usePathname();
  const tScope = useScopedI18n("footer");
  return (
    !pathname.includes("signin") &&
    !pathname.includes("signup") &&
    !pathname.includes("reset-password") &&
    !pathname.includes("profile") &&
    !pathname.includes("resetpassword") && (
      <footer className="bg-[#18191A] font-poppins flex items-center justify-center self-center mx-auto w-full text-white">
        <div className="w-full">
          {/* Stats Banner */}
          <div className="p-4">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 md:px-44">
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
                  <p className="text-sm text-white/80">
                    {tScope("secureDesc")}
                  </p>
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
                  <p className="text-sm text-white/80">
                    {tScope("refundDesc")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="w-full">
            <div className="w-full bg-white p-6">
              <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-center gap-12 bg-white">
                {/* About Us Section */}
                <div className="md:w-[500px] bg-[#18191A] p-2 rounded">
                  <h3 className="text-white/80 font-bold mb-4 w-full">
                    {tScope("aboutTitle")}
                  </h3>
                  <p className="text-sm text-gray-300">{tScope("aboutDesc")}</p>
                </div>

                {/* Security Badges */}
                <div className="bg-[#18191A] p-2 md:p-4 rounded">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Image
                      src={sslShopper}
                      alt="ssl Shopper"
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                    <Image
                      src={ssl}
                      alt="SSL Certificate"
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                    <Image
                      src={trustS}
                      alt="TrustedSite"
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-[#18191A] w-full md:w-[220px] p-2 md:p-4 rounded">
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
                      <a
                        href="#home"
                        className="text-gray-300 hover:text-white"
                      >
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
                <div className="bg-[#18191A] w-full md:w-[220px] p-2 md:p-4 rounded">
                  <h3 className="text-white/80 font-bold mb-4">
                    {tScope("infoTitle")}
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link
                        href="/faq"
                        className="text-gray-300 hover:text-white"
                      >
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
            </div>

            {/* Payment Methods */}
            <div className="border-t border-gray-700 pt-8 pb-8 gap-4 px-4 md:px-56">
              <p className="text-xs text-gray-400 text-center">
                &copy; {tScope("address")}
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
                  width={120}
                  height={60}
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
                  src={barid}
                  width={35}
                  height={35}
                  alt="Barid bank"
                  className="object-cover rounded"
                />
                <Image
                  src={cdmaroc}
                  width={70}
                  height={70}
                  alt="Marocco bank"
                  className="object-cover"
                />

                <Image
                  src={bnpParibas}
                  width={35}
                  height={35}
                  alt="Barid bank"
                  className="object-cover rounded"
                />
              </div>
              <div className="sm:hidden flex items-center justify-center gap-4 max-sm:flex-col self-center my-4">
                <span className="text-white/80">{tScope("followUs")}</span>
                <div className="flex gap-4 flex-wrap">
                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-blue-600 hover:opacity-80"
                  >
                    <FaFacebookF size={15} />
                  </Link>

                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-sky-600 hover:opacity-80"
                  >
                    <FaTelegramPlane size={14} />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-green-600 hover:opacity-80"
                  >
                    <FaWhatsapp size={15} />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-gray-500 hover:opacity-80"
                  >
                    <FaTiktok size={14} />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-violet-500 hover:opacity-80"
                  >
                    <FaDiscord size={14} />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-[#E1306C] hover:opacity-80"
                  >
                    <FaInstagram size={14} />
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center justify-center p-1.5 rounded-full border-[2px] bg-[#363A3D] border-[#45494e] text-blue-600 hover:opacity-80"
                  >
                    <FaSkype size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
