import { Schema, Document } from "mongoose";
import { connectDB, getConnections } from "../db";
import { Billing } from "../utils";

// Fonction asynchrone pour initialiser les modèles
async function initializeModels(): Promise<any> {
  await connectDB(); // Attendre l'établissement de la connexion

  const { goapiDB } = getConnections();

  // Vérifiez si la connexion à la base de données est établie
  if (!goapiDB) {
    throw new Error("Database connection not initialized");
  }

  // Définir les interfaces pour les documents
  interface IExchange extends Document {
    userId: string;
    serverOut: string;
    qtyToPay: number;
    characterToPay: string;
    serverIn: string;
    qtyToReceive: number;
    characterToReceive: string;
    codeToExchange: string;
    status: string;
  }

  interface IServer extends Document {
    serverName: string;
    serverCategory: string;
    serverStatus: string;
    serverPriceDh: number;
    serverMinQty?: number;
    rate: number;
  }

  interface IAccount extends Document {
    category: string;
    licence: string;
    description: string;
    minQ: number;
    stock: number;
    deliveryDelay: number;
    price: number;
    status: string;
    moreDetails: string;
  }

  interface IProduct extends Document {
    description: string;
    qty: number;
    price: number;
    totalPrice: number;
    product: string;
    category: string;
    licence: string;
    deliveryDelay: number;
  }

  interface IorderAccount extends Document {
    userId: string;
    numOrder: string;
    products: IProduct[];
    totalPrice: number;
    paymentMethod: string;
    status: string;
    address: string;
    billing: Billing;
    cur: string;
    valCurency: number;
  }

  interface IEuro extends Document {
    euro: number;
  }

  interface IMad extends Document {
    mad: number;
  }

  interface IDollar extends Document {
    dollar: number;
  }

  interface ISkrillSepa extends Document {
    skrillSepa: number;
  }

  interface IAed extends Document {
    aed: number;
  }

  interface Iusdt extends Document {
    usdt: number;
  }

  interface IChangeRate extends Document {
    rate: number;
  }

  interface IOrder extends Document {
    userId: string;
    numBuy: string;
    jeu: string;
    server: string;
    pu: number;
    qte: number;
    totalPrice: number;
    paymentMethod: string;
    gameName: string;
    paymentInfoDetails: string;
    currencymethod: string;
    buyCode: string;
    lastname: string;
    firstname: string;
    status: string;
  }

  const productSchema: Schema = new Schema({
    description: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    product: { type: String, required: true },
    category: { type: String, required: true },
    licence: { type: String, required: true },
    deliveryDelay: { type: Number, required: true },
  });

  const accountSchema: Schema = new Schema(
    {
      category: { type: String, required: true },
      licence: { type: String, required: true },
      description: { type: String, default: "" },
      minQ: { type: Number, required: true },
      stock: { type: Number, required: true },
      deliveryDelay: { type: Number, required: true },
      price: { type: Number, required: true },
      status: { type: String, required: true },
      moreDetails: { type: String, default: "" },
    },
    { timestamps: true }
  );

  const orderAccountSchema: Schema = new Schema(
    {
      userId: { type: String, required: true },
      numOrder: { type: String, required: true },
      products: { type: [productSchema], required: true },
      totalPrice: { type: Number, required: true },
      paymentMethod: { type: String, required: true },
      status: { type: String, default: "En attente" },
      address: { type: String, default: "" },
      billing: { type: Object, default: {} },
      cur: { type: String, default: "" },
      valCurency: { type: Number, default: 0 },
    },
    { timestamps: true }
  );

  // Définition des schémas
  const buySchema: Schema = new Schema(
    {
      userId: { type: String, required: true },
      numBuy: { type: String, required: true },
      jeu: { type: String, required: true },
      server: { type: String, required: true },
      pu: { type: Number, required: true },
      qte: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
      paymentMethod: { type: String },
      gameName: { type: String },
      paymentInfoDetails: { type: String },
      currencymethod: { type: String },
      buyCode: { type: String },
      lastname: { type: String },
      firstname: { type: String },
      status: { type: String, default: "En attente" },
    },
    { timestamps: true }
  );

  const rateSchemas = new Schema(
    {
      rate: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const serverSchema: Schema = new Schema(
    {
      serverName: { type: String, required: true, unique: true },
      serverCategory: { type: String, required: true },
      serverStatus: { type: String, required: true },
      serverPriceDh: { type: Number, required: true },
      serverMinQty: { type: Number },
      rate: { type: Number, required: true, default: 1 },
    },
    { timestamps: true }
  );

  const exchangeSchema: Schema = new Schema(
    {
      userId: { type: String, required: true },
      numExchange: { type: String, required: true },
      serverOut: { type: String, required: true },
      qtyToPay: { type: Number, required: true },
      characterToPay: { type: String, required: true },
      serverIn: { type: String, required: true },
      qtyToReceive: { type: Number, required: true },
      characterToReceive: { type: String, required: true },
      codeToExchange: { type: String, required: true },
      status: { type: String, default: "En attente" },
    },
    { timestamps: true }
  );

  const euroSchema: Schema = new Schema(
    { euro: { type: Number, required: true } },
    { timestamps: true }
  );

  const skrillSepaSchema: Schema = new Schema(
    { skrillSepa: { type: Number, required: true } },
    { timestamps: true }
  );

  const dollarSchema: Schema = new Schema(
    { dollar: { type: Number, required: true } },
    { timestamps: true }
  );

  const madSchema: Schema = new Schema(
    { mad: { type: Number, required: true } },
    { timestamps: true }
  );

  const aedSchema: Schema = new Schema(
    { aed: { type: Number, required: true } },
    { timestamps: true }
  );

  const usdtSchema: Schema = new Schema(
    { usdt: { type: Number, required: true } },
    { timestamps: true }
  );

  // Créer les modèles si ils n'existent pas déjà
  const ExchangeModel =
    goapiDB.models.exchange ||
    goapiDB.model<IExchange>("exchange", exchangeSchema);
  const ServerModel =
    goapiDB.models.server || goapiDB.model<IServer>("server", serverSchema);
  const EuroModel =
    goapiDB.models.euro || goapiDB.model<IEuro>("euro", euroSchema);
  const DollarModel =
    goapiDB.models.dollar || goapiDB.model<IDollar>("dollar", dollarSchema);
  const MadModel = goapiDB.models.mad || goapiDB.model<IMad>("mad", madSchema);
  const AedModel = goapiDB.models.aed || goapiDB.model<IAed>("aed", aedSchema);
  const SkrillSepaModel =
    goapiDB.models.skrillsepa ||
    goapiDB.model<ISkrillSepa>("skrillsepa", skrillSepaSchema);
  const BuyModel =
    goapiDB.models.buy || goapiDB.model<IOrder>("buy", buySchema);
  const RateModel =
    goapiDB.models.rate || goapiDB.model<IChangeRate>("rate", rateSchemas);
  const UsdtModel =
    goapiDB.models.usdt || goapiDB.model<Iusdt>("usdt", usdtSchema);
  const AccountModel =
    goapiDB.models.account || goapiDB.model<IAccount>("account", accountSchema);
  const OrderAccountModel =
    goapiDB.models.orderAccount ||
    goapiDB.model<IorderAccount>("orderAccount", orderAccountSchema);

  return {
    ExchangeModel,
    ServerModel,
    EuroModel,
    DollarModel,
    MadModel,
    AedModel,
    BuyModel,
    SkrillSepaModel,
    RateModel,
    UsdtModel,
    AccountModel,
    OrderAccountModel,
  };
}

// Exporter les modèles
export const goapiModels = initializeModels().catch((error) => {
  console.error("Erreur lors de l'initialisation des modèles :", error);
});
