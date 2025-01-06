import { Schema, Document, Model } from "mongoose";
import { connectDB, getConnections } from "../db";

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
  }

  interface IEuro extends Document {
    euro: number;
  }

  interface IDollar extends Document {
    dollar: number;
  }

  interface IAed extends Document {
    aed: number;
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
    lastname: string;
    firstname: string;
    status: string;
  }

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
    },
    { timestamps: true }
  );

  const exchangeSchema: Schema = new Schema(
    {
      userId: { type: String, required: true },
      exchangeId: { type: String, default: "" },
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

  const dollarSchema: Schema = new Schema(
    { dollar: { type: Number, required: true } },
    { timestamps: true }
  );

  const aedSchema: Schema = new Schema(
    { aed: { type: Number, required: true } },
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
  const AedModel = goapiDB.models.aed || goapiDB.model<IAed>("aed", aedSchema);
  const BuyModel =
    goapiDB.models.buy || goapiDB.model<IOrder>("buy", buySchema);
  const RateModel =
    goapiDB.models.rate || goapiDB.model<IChangeRate>("rate", rateSchemas);

  return {
    ExchangeModel,
    ServerModel,
    EuroModel,
    DollarModel,
    AedModel,
    BuyModel,
    RateModel,
  };
}

// Exporter les modèles
export const goapiModels = initializeModels().catch((error) => {
  console.error("Erreur lors de l'initialisation des modèles :", error);
});
