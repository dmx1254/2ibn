import { addMultipleRowsToSheet, addRowToSheet } from "./googleSheets";

export interface OrderExhange {
  newTime: string;
  type: string;
  produit: string;
  qtyToPay: number;
  montant: number;
  puV: string;
  personnage: string;
  payment: string;
  statutPayment: string;
  platform: string;
  userInfo: string;
  email: string;
}

export interface OrderAchat {
  newTime: string;
  type: string;
  produit: string;
  qte: number;
  montant: string;
  puA: string;
  personnage: string;
  infoPay: string;
  payment: string;
  etatCommande: string;
  platform: string;
  methodContact: string;
  userInfo: string;
  email: string;
}

//Orders ventes vers le sheet correspond a l'achat sur le site
export interface OrderVente {
  newTime: string;
  type: string;
  produit: string;
  qte: number;
  montant: string;
  puV: string;
  personnage: string;
  payment: string;
  etatCommande: string;
  platform: string;
  userInfo: string;
  email: string;
}

export interface OrderMarketplace {
  newTime: string;
  type: string;
  produit: string;
  qte: number;
  montant: string;
  puV: string;
  personnage: string;
  payment: string;
  etatCommande: string;
  platform: string;
  userInfo: string;
  email: string;
}

export interface UserClient {
  lastname?: string;
  firstname?: string;
  email: string;
  phone?: string;
}

export async function addOrderExchangeToSheet(order: OrderExhange) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.newTime, // Colonne C: Code
      order.type, // Colonne D: Type
      order.produit, // Colonne E: Produit
      order.qtyToPay, // Colonne F: Quantité
      order.montant, // Colonne G: Montant
      "", // Colonne H: PU A
      "", // Colonne I: PU A
      order.puV, // Colonne J: PU V
      order.personnage, // Colonne K: Personnage
      "", // Colonne L: Info Payment
      order.payment, // Colonne M: Payment
      order.statutPayment, // Colonne N: État de la commande
      order.platform, // Colonne O: Platform
      "", // Colonne P: Contact Method
      order.userInfo, // Colonne Q: User Info
      order.email, // Colonne R: Email
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'orders'!C:R");

    console.log("✅ Commande ajoutée:", order.email);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}

//Orders vente vers le sheet Orders ventes
export async function addOrderVentesToSheet(order: OrderVente) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.newTime, // Colonne C: Code
      order.type, // Colonne D: Type
      order.produit, // Colonne E: Produit
      order.qte, // Colonne F: Quantité
      order.montant, // Colonne G: Montant
      "", // Colonne H: PU A
      "", // Colonne I: PU A
      order.puV, // Colonne J: PU V
      order.personnage, // Colonne K: Personnage
      "", // Colonne L: Info P
      order.payment, // Colonne M: Payment
      order.etatCommande, // Colonne N: État de la commande
      order.platform, // Colonne O: Platform
      "", // Colonne P: Contact Method
      order.userInfo, // Colonne Q: User Info
      order.email, // Colonne R: Email
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'orders'!C:R");

    console.log("✅ Commande ajoutée:", order.email);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}


//Orders marketplace vers le sheet Orders marketplace
export async function addOrderMarketplaceToSheet(order: OrderMarketplace) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.newTime, // Colonne C: Code
      order.type, // Colonne D: Type
      order.produit, // Colonne E: Produit
      order.qte, // Colonne F: Quantité
      order.montant, // Colonne G: Montant
      "", // Colonne H: PU A
      "", // Colonne I: PU A
      order.puV, // Colonne J: PU V
      order.personnage, // Colonne K: Personnage
      "", // Colonne L: Info P
      order.payment, // Colonne M: Payment
      order.etatCommande, // Colonne N: État de la commande
      order.platform, // Colonne O: Platform
      "", // Colonne P: Contact Method
      order.userInfo, // Colonne Q: User Info
      order.email, // Colonne R: Email
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'orders'!C:R");

    console.log("✅ Commande ajoutée:", order.email);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}

//Add users clients informations to sheet Users clients
export async function addUsersClientsToSheet(users: UserClient[]) {
  try {
    const usersData = users.map((user) => [
      user.lastname ?? "",
      user.firstname ?? "",
      user.email ?? "",
      user.phone ?? "",
    ]);
    const result = await addMultipleRowsToSheet(usersData, "clients!A:D");
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout utilisateurs:", error);
    throw error;
  }
}

// Add single user client to sheet Users clients
export async function addSingleUserClientToSheet(user: UserClient) {
  try {
    const userData = [
      user.lastname ?? "",
      user.firstname ?? "",
      user.email ?? "",
      user.phone ?? "",
    ];
    const result = await addRowToSheet(userData, "clients!A:D");
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout utilisateur:", error);
    throw error;
  }
}

//Orders achat vers le sheet Orders achats
export async function addOrderAchatToSheet(order: OrderAchat) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.newTime, // Colonne C: Code
      order.type, // Colonne D: Type
      order.produit, // Colonne E: Produit
      order.qte, // Colonne F: Quantité
      order.montant, // Colonne G: Montant
      order.puA, // Colonne H: PU A
      "", // Colonne I: PU V
      "", // Colonne J: PU A
      order.personnage, // Colonne K: Personnage
      order.infoPay, // Colonne L: Info Payment
      order.payment, // Colonne M: Payment
      order.etatCommande, // Colonne N: État de la commande
      order.platform, // Colonne O: Platform
      order.methodContact, // Colonne P: Contact Method
      order.userInfo, // Colonne Q: User Info
      order.email, // Colonne R: Email
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'orders'!C:R");

    console.log("✅ Commande ajoutée:", order.email);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}
