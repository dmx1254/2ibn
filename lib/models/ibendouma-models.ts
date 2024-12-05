import { Schema, Document } from "mongoose";
import { connectDB, getConnections } from "../db";

const crypto = require("crypto");

const secretKey = process.env.TOKEN_SECRET_PAYMENT_CRYPT; // À stocker de manière sécurisée, par exemple dans des variables d'environnement.

function encrypt(text: string) {
  const iv = crypto.randomBytes(16); // Génère un vecteur d'initialisation aléatoire
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey!),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text: string) {
  const [iv, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey!),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

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
    billing?:any;
    status: string;
    address: string;
  }

  interface ICode extends Document {
    code: string;
  }

  interface Card extends Document {
    code: string;
    expirationDate: string;
  }

  interface IPaymentMethod extends Document {
    userId: string;
    method: string;
    rib?: string;
    trc20Address?: string;
    email?: string;
    cardInfo?: Card;
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
    isEmailVerified?: boolean;
    departement?: string;
  }

  const paymentMethodSchema = new Schema({
    userId: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    rib: {
      type: String,
      get: (val: string) => (val ? decrypt(val) : val),
      set: (val: string) => (val ? encrypt(val) : val),
    },
    trc20Address: {
      type: String,
      get: (val: string) => (val ? decrypt(val) : val),
      set: (val: string) => (val ? encrypt(val) : val),
    },
    email: {
      type: String,
      get: (val: string) => (val ? decrypt(val) : val),
      set: (val: string) => (val ? encrypt(val) : val),
    },
    cardInfo: {
      code: {
        type: String,
        get: (val: string) => (val ? decrypt(val) : val),
        set: (val: string) => (val ? encrypt(val) : val),
      },

      expirationDate: {
        type: String,
        get: (val: string) => (val ? decrypt(val) : val),
        set: (val: string) => (val ? encrypt(val) : val),
      },
    },
  });

  paymentMethodSchema.set("toJSON", {
    getters: true,
  });

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
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
      departement: {
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
      billing: {
        type: Object,
        default: {},
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
  const UserPaymentModel =
    ibendDB.models.payment ||
    ibendDB.model<IPaymentMethod>("payment", paymentMethodSchema);

  return {
    ServerModelIben,
    EuroModelIben,
    DollarModelIben,
    CadModelIben,
    MadModelIben,
    OrderModelIben,
    CodeIbenModel,
    UserIbenModel,
    UserPaymentModel,
  };
}

// Exporter les modèles
export const ibenModels = initializeModels().catch((error) => {
  console.error("Erreur lors de l'initialisation des modèles :", error);
});
