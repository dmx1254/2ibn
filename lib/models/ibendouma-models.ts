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

  interface ICode extends Document {
    code: string;
  }

  interface IUser extends Document {
    lastname: string;
    firstname: string;
    email: string;
    password: string;
    isAdmin: boolean;
    moderator: boolean;
    profil: string;
    phone: string;
    address: string;
    country: string;
    city: string;
    postalCode: string;
  }

  const userSchema: Schema = new Schema(
    {
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
        max: 1024,
      },

      isAdmin: {
        type: Boolean,
        default: false,
      },

      moderator: {
        type: Boolean,
        default: false,
      },

      profil: {
        type: String,
        default: "",
      },
      lastname: {
        type: String,
        default: "",
      },
      firstname: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      postalCode: {
        type: String,
        default: "",
      },
    },
    {
      timestamps: true,
    }
  );

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

  const codeSchema: Schema = new Schema(
    {
      code: {
        type: String,
        required: true,
        unique: true,
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
  const CodeIbenModel =
    ibendDB.models.code || ibendDB.model<ICode>("code", codeSchema);
  const UserIbenModel =
    ibendDB.models.user || ibendDB.model<IUser>("user", userSchema);

  return {
    ServerModelIben,
    EuroModelIben,
    DollarModelIben,
    CadModelIben,
    MadModelIben,
    OrderModelIben,
    CodeIbenModel,
    UserIbenModel,
  };
}

// Exporter les modèles
export const ibenModels = initializeModels().catch((error) => {
  console.error("Erreur lors de l'initialisation des modèles :", error);
});
