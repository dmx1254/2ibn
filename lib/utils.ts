import { clsx, type ClassValue } from "clsx";
import dofk from "@/public/dofus-images/dofus-k.png";
import dofr from "@/public/dofus-images/dofus-r.png";
import doft from "@/public/dofus-images/dofus-t.png";

import es from "@/public/flags/spain.png";
import fr from "@/public/flags/fr.png";
import en from "@/public/flags/en.png";

import { StaticImageData } from "next/image";

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dofusItem: DofusItem[] = [
  {
    id: "erst14",
    name: "Dofus",
    slug: "dofus-kamas",
    img: dofk,
  },
  {
    id: "kopa68",
    name: "Dofus Retro",
    slug: "dofus-retro",
    img: dofr,
  },

  {
    id: "bqoa71",
    name: "Dofus Touch",
    slug: "dofus-touch",
    img: doft,
  },
];

export const dofusItemNav: DofusItemNav[] = [
  {
    id: "bqoa71",
    name: "Dofus Touch",
    slug: "dofus-touch",
  },
  {
    id: "kopa68",
    name: "Dofus Retro",
    slug: "dofus-retro",
  },
  {
    id: "erst14",
    name: "Dofus 2.0 (pc)",
    slug: "dofus-kamas",
  },
];
export const dofusItemNavSheetMenu: SheetMenuNav[] = [
  {
    id: "bqoa71",
    name: "Dofus Touch",
    slug: "dofus-touch",
    typeslug: "touch",
  },
  {
    id: "kopa68",
    name: "Dofus Retro",
    slug: "dofus-retro",
    typeslug: "retro",
  },
  {
    id: "erst14",
    name: "Dofus 2.0 (pc)",
    slug: "dofus-kamas",
    typeslug: "kamas",
  },
];

export interface ServerBuy {
  _id: string;
  serverName: string;
  serverCategory: string;
  serverStatus: string;
  serverPrice: number;
  serverMinQty: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServerExchange {
  _id: string;
  serverName: string;
  serverCategory: string;
  serverStatus: string;
  serverPriceDh: number;
  serverMinQty: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DofusItem {
  id: string;
  name: string;
  slug: string;
  img: StaticImageData;
}
interface DofusItemNav {
  id: string;
  name: string;
  slug: string;
}

interface SheetMenuNav extends DofusItemNav {
  typeslug: string;
}

export interface CURRENCY {
  currencyName: string;
  curencyVal: number;
}

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
  slug: string;
}

export interface Language {
  code: string;
  name: string;
  flag: StaticImageData;
}

export const languages: Language[] = [
  { code: "fr", name: "Français", flag: fr },
  { code: "en", name: "Englais", flag: en },
  { code: "es", name: "Español", flag: es },
];

export const currencies: CurrencyItem[] = [
  { code: "EUR", name: "Euro", symbol: "€", slug: "euro" },
  { code: "USD", name: "US Dollar", symbol: "$", slug: "dollar" },
  { code: "MAD", name: "Moroccan Dirham", symbol: "DH", slug: "mad" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", slug: "cad" },
];

export const parsedDevise = (cur: string) => {
  let symbole = "";
  switch (cur) {
    case "euro":
      symbole = "€";
      break;
    case "dollar":
      symbole = "$";
      break;
    case "mad":
      symbole = "DH";
      break;
    case "cad":
      symbole = "CAD";
      break;

    default:
      symbole = "€";
      break;
  }

  return symbole;
};
export const imageReturn = (slug: string): string => {
  let img = "";
  switch (slug) {
    case "dofus-touch":
      img = "/dofus-images/dofus-k.png";
      break;
    case "dofus-retro":
      img = "/dofus-images/dofus-r.png";
      break;
    case "dofus-kamas":
      img = "/dofus-images/dofus-t.png";
      break;

    default:
      img = "/dofus-images/dofus-k.png";
      break;
  }

  return img;
};

export const codeGenerated = () => {
  const generateRandomCode =
    "0123456789abcdefghijklmnopkrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let myCode = "";
  for (let i = 0; i < 7; i++) {
    let code = Math.floor(Math.random() * generateRandomCode.length);
    myCode += generateRandomCode[code];
  }
  return myCode;
};

export const orderBuyNumGenerated = () => {
  const generateOrderNum = "0123456789";

  let myCode = "";
  for (let i = 0; i < 6; i++) {
    let code = Math.floor(Math.random() * generateOrderNum.length);
    myCode += generateOrderNum[code];
  }
  return myCode;
};

export function formatTimeAgo(
  date: Date,
  options: {
    hourText: string;
    minuteText: string;
    dayText: string;
    monthText: string;
    yearText: string;
    suffix: string;
  }
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximation de 30 jours par mois
  const diffInYears = Math.floor(diffInDays / 365); // Approximation de 365 jours par an

  if (diffInYears > 0) {
    return `${diffInYears} ${options.yearText} ${options.suffix}`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} ${options.monthText} ${options.suffix}`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ${options.dayText} ${options.suffix}`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${options.hourText} ${options.suffix}`;
  } else {
    return `${diffInMinutes} ${options.minuteText} ${options.suffix}`;
  }
}

type BankPayment = {
  id: string;
  title: string;
  imgPay: string;
  fee?: number;
};

export const paymentMethod: BankPayment[] = [
  {
    id: "JUK51L",
    title: "visa-google-pay",
    imgPay: "/payMethod/creditcardgooglepay.webp",
  },
  {
    id: "LPA27P",
    title: "visa-and-jcb",
    imgPay: "/payMethod/creditcard_pay.webp",
  },
  {
    id: "YHA4KO",
    title: "google-pay",
    imgPay: "/payMethod/google_pay.webp",
  },
  {
    id: "BQXP46",
    title: "paypal",
    imgPay: "/payMethod/paypals.webp",
    fee: 3,
  },
  {
    id: "AWB8YT",
    title: "paysafecard",
    imgPay: "/payMethod/paysafecard.webp",
    fee: 3,
  },
  {
    id: "OPLAW1",
    title: "crypto",
    imgPay: "/payMethod/crypto.webp",
  },
  {
    id: "RTFL43",
    title: "morocco-local-banks",
    imgPay: "/payMethod/moroccolocalbanks.webp",
  },
];

export type Billing = {
  lastname: string;
  firstname: string;
  address: string;
  city: string;
  codePostal: string;
  country: string;
  departement?: string;
};


export function maskDisplayName(name: string) {
  if (!name || name.length < 3) {
    // Si le nom est trop court, ne pas le masquer complètement
    return name;
  }
  
  const firstChar = name[0]; // Premier caractère
  const lastChar = name[name.length - 1]; // Dernier caractère
  
  // Remplir les caractères intermédiaires par des étoiles
  const maskedPart = "*".repeat(name.length - 2);
  
  return `${firstChar}${maskedPart}${lastChar}`;
}
