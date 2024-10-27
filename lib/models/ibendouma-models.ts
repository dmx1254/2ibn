import { Schema, Document } from "mongoose";
import { connectDB, getConnections } from "../db";

// Fonction asynchrone pour initialiser les modèles
async function initializeModels(): Promise<any> {
  await connectDB(); // Attendre l'établissement de la connexion

  const { ibendDB } = getConnections();

  // Vérifiez si la connexion à la base de données est établie
  if (!ibendDB) {
    throw new Error("Database connection not initialized");
  }

  // Définir les interfaces pour les documents
  interface IEuro extends Document {
    euro: number;
  }

  interface IDollar extends Document {
    dollar: number;
  }

  interface ICad extends Document {
    cad: number;
  }

  interface IMad extends Document {
    mad: number; // Corrigé ici pour correspondre à l'interface
  }

  interface IServer extends Document {
    serverName: string;
    serverCategory: string;
    serverStatus: string;
    serverPrice: number; // Changez à number si c'est un nombre
    serverMinQty: number;
  }

  interface Product extends Document {
    productId: string;
    category: string;
    server: string;
    qty: number;
    amount: number;
    price: number;
    character: string;
    totalPrice: number;
  }

  interface IOrder extends Document {
    userId: string;
    orderNum: string;
    products: Product[];
    totalPrice: number;
    paymentMethod: string;
    orderIdPaid: string;
    cur: string;
    valCurency: number;
    status: string;
    address: string;
  }

  const orderSchema: Schema = new Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      orderNum: {
        type: String,
        required: true,
      },
      paymentMethod: {
        type: String,
      },
      products: [
        {
          productId: { type: String, required: true },
          category: {
            type: String,
            required: true,
          },
          server: {
            type: String,
            required: true,
          },
          qty: { type: Number, required: true },
          amount: {
            type: Number,
            required: true,
          },
          price: { type: Number, required: true },
          character: {
            type: String,
            required: true,
          },
          totalPrice: { type: Number },
        },
      ],
      address: {
        type: String,
      },

      status: {
        type: String,
        default: "En attente...",
      },
      totalPrice: {
        type: Number,
        required: true,
      },
      detailUser: {
        type: Object,
      },

      orderIdPaid: {
        type: String,
        default: "",
      },

      cur: {
        type: String,
        default: "",
      },
      valCurency: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

  const serverSchema: Schema = new Schema(
    {
      serverName: {
        type: String,
        required: true,
        unique: true,
      },
      serverCategory: {
        type: String,
        required: true,
      },
      serverStatus: {
        type: String,
        required: true,
      },
      serverPrice: {
        type: Number,
        required: true,
      },
      serverMinQty: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const euroSchema: Schema = new Schema(
    {
      euro: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const dollarSchema: Schema = new Schema(
    {
      dollar: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const cadSchema: Schema = new Schema(
    {
      cad: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  const madSchema: Schema = new Schema(
    {
      mad: {
        type: Number,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  // Créer les modèles si ils n'existent pas déjà
  const ServerModelIben =
    ibendDB.models.server || ibendDB.model<IServer>("server", serverSchema);
  const EuroModelIben =
    ibendDB.models.euro || ibendDB.model<IEuro>("euro", euroSchema);
  const DollarModelIben =
    ibendDB.models.dollar || ibendDB.model<IDollar>("dollar", dollarSchema);
  const CadModelIben =
    ibendDB.models.cadStore || ibendDB.model<ICad>("cadStore", cadSchema);
  const MadModelIben =
    ibendDB.models.madStore || ibendDB.model<IMad>("madStore", madSchema);
  const OrderModelIben =
    ibendDB.models.order || ibendDB.model<IOrder>("order", orderSchema);

  return {
    ServerModelIben,
    EuroModelIben,
    DollarModelIben,
    CadModelIben,
    MadModelIben,
    OrderModelIben,
  };
}

// Exporter les modèles
export const ibenModels = initializeModels().catch((error) => {
  console.error("Erreur lors de l'initialisation des modèles :", error);
});
