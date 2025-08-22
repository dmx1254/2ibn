import { addRowToSheet } from "./googleSheets";

export interface OrderExhange {
  newTime: string;
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
  newTime: string;
  code: string;
  serveur: string;
  personnage: string;
  total: string;
  InfoPay: string;
  contact: string;
  status: string;
  idCommande: string;
}

export interface OrderVente {
  newTime: string;
  code: string;
  serveur: string;
  personnage: string;
  total: string;
  livraisondetails: string;
  InfoPay: string;
  etatCommande: string;
  idCommande: string;
}

export async function addOrderToSheet(order: OrderExhange) {
  try {
    // Préparer les données dans l'ordre des colonnes
    const rowData = [
      order.newTime, // Colonne 0: Code
      order.code, // Colonne 1: Code
      order.serveurARecevoir, // Colonne 2: Serveur à recevoir/Personnages
      order.quantiteA, // Colonne 3: Quantité A
      order.serveurADonner, // Colonne 4: Serveur à donner/Personnages
      order.quantiteB, // Colonne 5: Quantité B
      order.contact, // Colonne 6: Contact
      order.etatCommande, // Colonne 7: État de la commande
      order.idCommande, // Colonne 8: ID de la commande
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'Orders echanges'!A:I");

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
      order.newTime, // Colonne 0: Code
      order.code, // Colonne 1: Code
      order.serveur, // Colonne 2: Serveur à recevoir/Personnages
      order.personnage, // Colonne 3: Quantité B
      order.total, // Colonne 4: Quantité A
      order.livraisondetails, // Colonne 5: Contact
      order.InfoPay, // Colonne 6: Serveur à donner/Personnages
      order.etatCommande, // Colonne 7: État de la commande
      order.idCommande, // Colonne 8: ID de la commande
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'Orders ventes'!A:I");

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
      order.newTime, // Colonne 0: Code
      order.code, // Colonne 1: Code
      order.serveur, // Colonne 2: Serveur à recevoir/Personnages
      order.personnage, // Colonne 3: Quantité B
      order.total, // Colonne 4: Quantité A
      order.InfoPay, // Colonne 3: Serveur à donner/Personnages
      order.contact, // Colonne 6: Contact
      order.status, // Colonne 7: État de la commande
      order.idCommande, // Colonne 8: ID de la commande
    ];

    // Spécifier la plage de votre table (ajustez selon votre sheet)
    const result = await addRowToSheet(rowData, "'Orders achats'!A:I");

    // console.log("✅ Commande ajoutée:", order.idCommande);
    return result;
  } catch (error) {
    console.error("❌ Erreur ajout commande:", error);
    throw error;
  }
}
