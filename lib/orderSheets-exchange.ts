import { addRowToSheet } from "./googleSheets";

export interface OrderExhange {
  code: string;
  serveurARecevoir: string;
  quantiteA: number;
  serveurADonner: string;
  quantiteB: number;
  contact: string;
  etatCommande: string;
  idCommande: string;
}

export interface OrderAchat {
  code: string;
  serveur: string;
  total: string;
  InfoPay: string;
  personnage: string;
  contact: string;
  status: string;
  idCommande: string;
}

export interface OrderVente {
  code: string;
  serveur: string;
  total: string;
  InfoPay: string;
  personnage: string;
  livraisondetails: string;
  etatCommande: string;
  idCommande: string;
}

export async function addOrderToSheet(order: OrderExhange) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.code, // Colonne 0: Code
      order.serveurARecevoir, // Colonne 1: Serveur à recevoir/Personnages
      order.quantiteA, // Colonne 2: Quantité A
      order.serveurADonner, // Colonne 3: Serveur à donner/Personnages
      order.quantiteB, // Colonne 4: Quantité B
      order.contact, // Colonne 5: Contact
      order.etatCommande, // Colonne 6: État de la commande
      order.idCommande, // Colonne 7: ID de la commande
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'Orders echanges'!A:H");

    // console.log("✅ Commande ajoutée:", order.idCommande);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}

//Orders vente vers le sheet Orders ventes
export async function addOrderVenteToSheet(order: OrderVente) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.code, // Colonne 0: Code
      order.serveur, // Colonne 1: Serveur à recevoir/Personnages
      order.total, // Colonne 2: Quantité A
      order.InfoPay, // Colonne 3: Serveur à donner/Personnages
      order.personnage, // Colonne 4: Quantité B
      order.livraisondetails, // Colonne 5: Contact
      order.etatCommande, // Colonne 6: État de la commande
      order.idCommande, // Colonne 7: ID de la commande
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'Orders ventes'!A:H");

    // console.log("✅ Commande ajoutée:", order.idCommande);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}

//Orders achat vers le sheet Orders achats
export async function addOrderAchatToSheet(order: OrderAchat) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.code, // Colonne 0: Code
      order.serveur, // Colonne 1: Serveur à recevoir/Personnages
      order.total, // Colonne 2: Quantité A
      order.InfoPay, // Colonne 3: Serveur à donner/Personnages
      order.personnage, // Colonne 4: Quantité B
      order.contact, // Colonne 5: Contact
      order.status, // Colonne 6: État de la commande
      order.idCommande, // Colonne 7: ID de la commande
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'Orders achats'!A:H");

    // console.log("✅ Commande ajoutée:", order.idCommande);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}
