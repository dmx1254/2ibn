import mongoose from "mongoose";

// Types pour la gestion globale des connexions
type MongooseConnection = {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

type GlobalWithMongoose = typeof globalThis & {
  mongoConnections: {
    goapiDB: MongooseConnection;
    ibendDB: MongooseConnection;
  };
};

// Initialisation des connexions globales
if (!(global as GlobalWithMongoose).mongoConnections) {
  (global as GlobalWithMongoose).mongoConnections = {
    goapiDB: { conn: null, promise: null },
    ibendDB: { conn: null, promise: null },
  };
}

const globalConnections = (global as GlobalWithMongoose).mongoConnections;

/**
 * Crée une connexion à une base de données MongoDB
 * @param uri URI de connexion MongoDB
 * @param dbName Nom de la base de données pour le logging
 * @returns Promise<mongoose.Connection>
 */
const createConnection = async (uri: string, dbName: string): Promise<mongoose.Connection> => {
  try {
    const connection = await mongoose.createConnection(uri).asPromise();
    console.log(`Connected to ${dbName} successfully`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to ${dbName}:`, error);
    throw error;
  }
};

/**
 * Connecte aux deux bases de données
 * @returns Promise<{goapiDB: mongoose.Connection, ibendDB: mongoose.Connection}>
 */
export const connectDB = async () => {
  try {
    // Vérifier et obtenir la connexion GOAPI
    if (!globalConnections.goapiDB.conn) {
      if (!globalConnections.goapiDB.promise) {
        globalConnections.goapiDB.promise = createConnection(
          process.env.MONGO_URI_IBYTRADE_GOAPI! || '',
          'IBYTRADE Database'
        );
      }
      globalConnections.goapiDB.conn = await globalConnections.goapiDB.promise;
    }

    // Vérifier et obtenir la connexion IBEND
    if (!globalConnections.ibendDB.conn) {
      if (!globalConnections.ibendDB.promise) {
        globalConnections.ibendDB.promise = createConnection(
          process.env.DB_CONNECT_IBENDOUMA_API! || '',
          'IBENDOUMA Database'
        );
      }
      globalConnections.ibendDB.conn = await globalConnections.ibendDB.promise;
    }

    return {
      goapiDB: globalConnections.goapiDB.conn,
      ibendDB: globalConnections.ibendDB.conn,
    };
  } catch (error) {
    console.error('Error in connectDB:', error);
    throw error;
  }
};

// Fonction pour obtenir les connexions
export const getConnections = () => {
  return {
    goapiDB: globalConnections.goapiDB.conn,
    ibendDB: globalConnections.ibendDB.conn,
  };
};

// Fonction pour fermer les connexions
export const closeConnections = async () => {
  try {
    if (globalConnections.goapiDB.conn) {
      await globalConnections.goapiDB.conn.close();
      globalConnections.goapiDB = { conn: null, promise: null };
    }
    if (globalConnections.ibendDB.conn) {
      await globalConnections.ibendDB.conn.close();
      globalConnections.ibendDB = { conn: null, promise: null };
    }
    console.log('All database connections closed');
  } catch (error) {
    console.error('Error closing connections:', error);
    throw error;
  }
};