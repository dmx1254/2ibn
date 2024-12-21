import { clsx, type ClassValue } from "clsx";
import dofk from "@/public/dofus-images/dofus-k.png";
import dofr from "@/public/dofus-images/dofus-r.png";
import doft from "@/public/dofus-images/dofus-t.png";

import es from "@/public/flags/spain.png";
import fr from "@/public/flags/fr.png";
import en from "@/public/flags/en.png";
import ar from "@/public/flags/arabic.png";

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
  { code: "ar", name: "Arabe", flag: ar },
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
    fee: 7,
  },
  {
    id: "OPLAW1",
    title: "crypto",
    imgPay: "/payMethod/crypto.webp",
  },
];

export const paymentMethodMorroco: BankPayment[] = [
  {
    id: "JUK51L5",
    title: "marobank",
    imgPay: "/iben/marocbank.webp",
  },
  {
    id: "LPA27P7",
    title: "credit-du-maroc",
    imgPay: "/iben/cdm.webp",
  },
  {
    id: "YHA4KO2",
    title: "societe-generale",
    imgPay: "/iben/sg.jpg",
  },
  {
    id: "BQX8P46",
    title: "barid-bank",
    imgPay: "/iben/barid-bank.png",
  },
];

export type Billing = {
  lastname: string;
  firstname: string;
  address: string;
  city: string;
  codePostal: string;
  country: string;
  email?: string;
  departement?: string;
  phone?: string;
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

export function detectDeviceType(os: string): string {
  const mobileOS = ["ios", "android", "harmonyos"];
  const desktopOS = ["macos", "windows", "linux"];

  const osLower = os.toLowerCase();

  if (mobileOS.includes(osLower)) return "Mobile";
  if (desktopOS.includes(osLower)) return "Desktop";
  return "unknown";
}

export interface Review {
  id: number;
  name: string;
  reviews: number;
  date: string;
  message: string;
  titre: string;
  image: string;
}

export const trustpilotReviews: Review[] = [
  {
    id: 1,
    name: "Yassine Yousfani",
    reviews: 5,
    date: "19 septembre 2024",
    message:
      "excelllente experience, mlle khadija etait tres professionnelle, respectueuse et donne le temps au clients, merci !",
    titre: "excelllente experience",
    image: "",
  },
  {
    id: 2,
    name: "ystech dof",
    reviews: 5,
    date: "23 septembre 2024",
    message: "excellent service 100% faible",
    titre: "excellent service 100% faible",
    image: "",
  },
  {
    id: 3,
    name: "Yassine Bayla",
    reviews: 5,
    date: "16 mars 2024",
    message:
      "Jai déjà vendu et acheter avec la personne sans même le connaître en vrai très professionnel rien à dire, vous pouvez lui faire confiance les yeux fermés",
    titre:
      "Jai déjà vendu et acheter avec la personne sans même le connaître en vrai très professionnel rien à dire, vous pouvez lui faire confiance les yeux fermés",
    image: "",
  },
  {
    id: 4,
    name: "Hamada N",
    reviews: 5,
    date: "15 mars 2024",
    message:
      "Je recommande chaudement Bendouma pour son professionnalisme et son service irréprochable. C'est un partenaire sur lequel on peut compter en toute confiance a propos du kama, super fiable.",
    titre: "Service fiable, rapide",
    image: "",
  },
  {
    id: 5,
    name: "Mohamed",
    reviews: 5,
    date: "16 mars 2024",
    message:
      "Bonjour,Je valide que ce site est un site de confiance depuis plus de 5ans , je n'ai pas eu bcp de probleme avec le service en ligne .Il sont toujours disponible au horaire definit et l'écoute de mes attentes.Je vous le recommande",
    titre: "Bonjour,",
    image: "",
  },
  {
    id: 6,
    name: "Mehdi",
    reviews: 5,
    date: "23 mars 2024",
    message:
      "Les agents sont cools, les échanges sont rapides et les transactions sont bien sécurisés. Je recommande fortement !",
    titre: "Experience client avec ibytrade",
    image: "",
  },
  {
    id: 7,
    name: "Client",
    reviews: 5,
    date: "16 septembre 2024",
    message: "Meilleur Prix tous sites Compris !",
    titre: "Meilleur Prix tous sites Compris !",
    image: "",
  },
  {
    id: 8,
    name: "Walid Ouroui",
    reviews: 5,
    date: "18 mars 2024",
    message: "Rapide et efficaces sans problème ni encombre",
    titre: "Rapide et efficaces sans problème ni encombre",
    image: "",
  },
  {
    id: 9,
    name: "Othmane",
    reviews: 5,
    date: "16 mars 2024",
    message: "site fiable service qualité je le recommande",
    titre: "site fiable service qualité je le recommande",
    image: "",
  },
  {
    id: 9,
    name: "Taha",
    reviews: 5,
    date: "15 mars 2024",
    message: "Service rapide et fiable.Mercii beaucoup",
    titre: "Service rapide et fiable",
    image: "",
  },
  {
    id: 10,
    name: "Jowem",
    reviews: 5,
    date: "15 mars 2024",
    message: "Fiable, rapide et serviable ! je recommande.",
    titre: "Fiable, je recommande !",
    image: "",
  },
  {
    id: 10,
    name: "Hox y",
    reviews: 5,
    date: "18 mars 2024",
    message: "service top et rapide je recommande",
    titre: "service top et rapide.",
    image: "",
  },
  {
    id: 11,
    name: "Hatim El Harti",
    reviews: 5,
    date: "18 mars 2024",
    message: "Service fiable , parfait , immédiat, accessible et sécurisé :D",
    titre: "Échange professionnel et fiable",
    image:
      "https://user-images.trustpilot.com/65f8469a3bd3830012a05976/73x73.png",
  },
  {
    id: 12,
    name: "Achraf Belfquih",
    reviews: 5,
    date: "16 mars 2024",
    message: "Site fiable, je recommande !",
    titre: "Retour d'expérience",
    image: "",
  },
  {
    id: 13,
    name: "الزنديق",
    reviews: 5,
    date: "18 mars 2024",
    message: "Fiable et service rapide",
    titre: "Fiable et service rapide",
    image:
      "https://user-images.trustpilot.com/64ece8dd24b3c30012b8972d/73x73.png",
  },
  {
    id: 14,
    name: "Drissi Melna",
    reviews: 5,
    date: "15 mars 2024",
    message: "service de qualité, rapide et efficace, je recommande vivement",
    titre: "service de qualité",
    image: "",
  },
  {
    id: 15,
    name: "Laptop Loco",
    reviews: 5,
    date: "16 mars 2024",
    message: "Service de qualité, rapidité, fiabilité 💯👌",
    titre: "Service de qualité, recommande à tous",
    image: "",
  },
  {
    id: 16,
    name: "Laptop Loco",
    reviews: 5,
    date: "16 mars 2024",
    message: "Fiable et rapide comme d'hab",
    titre: "Fiable et rapide comme d'hab",
    image: "",
  },
  {
    id: 17,
    name: "Mouhamed SY",
    reviews: 5,
    date: "8 mars 2024",
    message: "Livraison rapide et service clientèle professionnel",
    titre: "Livraison rapide et service clientèle professionnel",
    image: "",
  },
  {
    id: 18,
    name: "Simo Sedraty",
    reviews: 5,
    date: "16 mars 2024",
    message: "Meilleur service !",
    titre: "Meilleur service !",
    image: "",
  },
];

export type TitleType = {
  "title-1": string;
  "title-2": string;
  "title-3": string;
  "title-4": string;
  "title-5": string;
  "title-6": string;
  "title-7": string;
  "title-8": string;
  "title-9": string;
  "title-10": string;
  "title-11": string;
  "title-12": string;
  "title-13": string;
  "title-14": string;
  "title-15": string;
  "title-16": string;
  "title-17": string;
  "title-18": string;
  "title-19": string;
  "title-20": string;
};

export type MessageType = {
  "message-1": string;
  "message-2": string;
  "message-3": string;
  "message-4": string;
  "message-5": string;
  "message-6": string;
  "message-7": string;
  "message-8": string;
  "message-9": string;
  "message-10": string;
  "message-11": string;
  "message-12": string;
  "message-13": string;
  "message-14": string;
  "message-15": string;
  "message-16": string;
  "message-17": string;
  "message-18": string;
  "message-19": string;
  "message-20": string;
};
