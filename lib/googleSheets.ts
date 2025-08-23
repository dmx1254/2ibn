// lib/googleSheets.ts
import { google } from "googleapis";

// Configuration de l'authentification
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = google.sheets({ version: "v4", auth });

// Fonction pour lire des données du Sheet
export async function readFromSheet(range: string = "A:Z") {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error("Erreur lecture Google Sheets:", error);
    throw error;
  }
}

// Fonction pour ajouter une nouvelle ligne
export async function addRowToSheet(data: any[], range: string = "Sheet1!A:Z") {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
      valueInputOption: "RAW",
      requestBody: {
        values: [data],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur ajout Google Sheets:", error);
    throw error;
  }
}

export async function addMultipleRowsToSheet(
  data: string[][],
  range: string = "Sheet1!A:Z"
) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: range,
      valueInputOption: "RAW",
      requestBody: {
        values: data,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur ajout multiple Google Sheets:", error);
    throw error;
  }
}

// Fonction pour mettre à jour une ligne spécifique
export async function updateRowInSheet(
  row: number,
  data: any[],
  range: string = "Sheet1"
) {
  try {
    const updateRange = `${range}!A${row}:Z${row}`;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: updateRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [data],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur mise à jour Google Sheets:", error);
    throw error;
  }
}

// Fonction pour supprimer une ligne
export async function deleteRowInSheet(rowIndex: number, sheetId: number = 0) {
  try {
    const response = await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetId,
                dimension: "ROWS",
                startIndex: rowIndex - 1, // Google Sheets utilise un index basé sur 0
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erreur suppression Google Sheets:", error);
    throw error;
  }
}

// Fonction pour obtenir les informations du Sheet
export async function getSheetInfo() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
    });

    const res = response.data.sheets?.forEach((sheet, index) => {
      console.log(`${index}: "${sheet.properties?.title}"`);
    });

    console.log(res);

    return response.data;
  } catch (error) {
    console.error("Erreur info Google Sheets:", error);
    throw error;
  }
}
