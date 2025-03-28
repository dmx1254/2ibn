import * as React from "react";
import { getScopedI18n } from "@/locales/server";
import { parsedDevise } from "@/lib/utils";

interface OrderConfirmationTemplateProps {
  orderNum: string;
  dateCreated: Date;
  type: string;
  // Détails pour la commande d'achat
  billing?: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  };
  products?: Array<{
    category: string;
    server: string;
    qty: number;
    amount: number;
    bonus: number;
    price: number;
    character: string;
    totalPrice: number;
  }>;
  totalPrice?: number;
  cur?: string;

  // Détails pour la commande de vente
  saleDetails?: {
    numBuy: string;
    jeu: string;
    server: string;
    pu: number;
    qte: number;
    totalPrice: number;
    paymentMethod: string;
    paymentDetails: string;
    lastname: string;
    firstname: string;
    cur: string;
    gameName: string;
  };
  // Détails pour l'échange
  exchangeDetails?: {
    userId: string;
    serverOut: string;
    serverIn: string;
    codeToExchange: string;
    characterToPay: string;
    characterToReceive: string;
    qtyToPay: number;
    qtyToReceive: number;
  };

  buyDetails?: {
    status: string;
    paymentMethod: string;
  };
}

export const NewOrderConfirmationTemplate: React.FC<
  OrderConfirmationTemplateProps
> = async ({
  orderNum,
  dateCreated,
  type,
  billing,
  products,
  totalPrice,
  cur,
  saleDetails,
  exchangeDetails,
  buyDetails,
}) => {
  const tScope2 = await getScopedI18n("confirmEmail");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderOrderDetails = () => {
    switch (type) {
      case "Commande d'achat":
        return (
          <>
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Détails de la commande
              </h3>
              <p style={{ marginBottom: "8px" }}>
                <strong>Statut:</strong> {buyDetails?.status}
              </p>
              <p style={{ marginBottom: "8px" }}>
                <strong>Méthode de paiement:</strong>{" "}
                {buyDetails?.paymentMethod}
              </p>
            </div>
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Informations du client
              </h3>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Client:</strong> {billing?.firstname}{" "}
                {billing?.lastname}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Email:</strong> {billing?.email}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Téléphone:</strong> {billing?.phone}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Montant total:</strong> {totalPrice}{" "}
                {parsedDevise(cur || "")}
              </p>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Produits commandés
              </h3>
              {products?.map((product, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "15px",
                    padding: "15px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Catégorie:</strong> {product.category}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Serveur:</strong> {product.server}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Quantité:</strong> {product.amount}M
                  </p>

                  <p style={{ marginBottom: "8px" }}>
                    <strong>Bonus:</strong> {product.bonus}M
                  </p>

                  <p style={{ marginBottom: "8px" }}>
                    <strong>Prix:</strong> {product.price}{" "}
                    {parsedDevise(cur || "")}
                  </p>
                  <p style={{ marginBottom: "8px" }}>
                    <strong>Personnage:</strong> {product.character}
                  </p>
                  <p style={{ marginBottom: "0" }}>
                    <strong>Total:</strong> {product.totalPrice}{" "}
                    {parsedDevise(cur || "")}
                  </p>
                </div>
              ))}
            </div>
          </>
        );
      case "Commande de vente":
        return (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Informations du client
              </h3>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Client:</strong> {saleDetails?.firstname}{" "}
                {saleDetails?.lastname}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Email:</strong> {billing?.email}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Téléphone:</strong> {billing?.phone}
              </p>

              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Méthode de paiement:</strong>{" "}
                {saleDetails?.paymentMethod}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Détails du paiement:</strong>{" "}
                {saleDetails?.paymentDetails.split("<br/>")[0]} {" : "}
                {saleDetails?.paymentDetails.split("<br/>")[1]}
              </p>
            </div>

            <div
              style={{
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Détails de la vente
              </h3>
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                }}
              >
                <p style={{ marginBottom: "8px" }}>
                  <strong>Numéro de vente:</strong> {saleDetails?.numBuy}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Nom dans le jeu:</strong> {saleDetails?.jeu}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Serveur à vendre:</strong> {saleDetails?.server}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Personnage:</strong> {saleDetails?.gameName}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Prix unitaire:</strong> {saleDetails?.pu}{" "}
                  {parsedDevise(saleDetails?.cur || "")}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Quantité:</strong> {saleDetails?.qte}M
                </p>
                <p style={{ marginBottom: "0" }}>
                  <strong>Prix total:</strong> {saleDetails?.totalPrice}{" "}
                  {parsedDevise(saleDetails?.cur || "")}
                </p>
              </div>
            </div>
          </div>
        );
      case "Échange":
        return (
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Informations du client
              </h3>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Client:</strong> {billing?.firstname}{" "}
                {billing?.lastname}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                  marginBottom: "8px",
                }}
              >
                <strong>Email:</strong> {billing?.email}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Téléphone:</strong> {billing?.phone}
              </p>
            </div>

            <div
              style={{
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#333333",
                  fontSize: "18px",
                  marginBottom: "15px",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "10px",
                }}
              >
                Détails de l&apos;échange
              </h3>
              <div
                style={{
                  padding: "15px",
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e9ecef",
                }}
              >
                <p style={{ marginBottom: "8px" }}>
                  <strong>Code d&apos;échange:</strong>{" "}
                  {exchangeDetails?.codeToExchange}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Serveur à payer:</strong> {exchangeDetails?.serverOut}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Serveur à recevoir:</strong>{" "}
                  {exchangeDetails?.serverIn}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Personnage à payer:</strong>{" "}
                  {exchangeDetails?.characterToPay}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Personnage à recevoir:</strong>{" "}
                  {exchangeDetails?.characterToReceive}
                </p>
                <p style={{ marginBottom: "8px" }}>
                  <strong>Quantité à échanger:</strong>{" "}
                  {exchangeDetails?.qtyToPay}M
                </p>
                <p style={{ marginBottom: "0" }}>
                  <strong>Quantité à recevoir:</strong>{" "}
                  {exchangeDetails?.qtyToReceive}M
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "10px",
      }}
    >
      <table
        role="presentation"
        width="100%"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header */}
        <tr>
          <td
            style={{
              backgroundColor: "#363A3D",
              padding: "10px",
              textAlign: "center",
              fontSize: "24px",
              color: "#ffffff",
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <img
                src="https://www.ibendouma.com/logo.png"
                alt="ibendouma logo"
                style={{
                  width: "100px",
                  height: "70px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            </div>
          </td>
        </tr>

        {/* Main Content */}
        <tr>
          <td style={{ padding: "40px 30px" }}>
            <h1
              style={{
                color: "#333333",
                fontSize: "24px",
                marginBottom: "10px",
              }}
            >
              Bonjour Ilyass
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#666666",
                marginBottom: "20px",
              }}
            >
              Nouvelle {type}
            </p>

            {/* Order Details */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Numéro de {type}:</strong> {orderNum}
              </p>

              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Date:</strong> {formatDate(dateCreated)}
              </p>

              {renderOrderDetails()}
            </div>
          </td>
        </tr>

        {/* Pied de page */}
        <tr>
          <td
            style={{
              padding: "30px",
              backgroundColor: "#f8f9fa",
              textAlign: "center",
            }}
          >
            <p
              style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}
            >
              © 2024 JBK Services INTERNATIONAL FZ-LLC. tous droits réservés.
            </p>

            <div style={{ marginTop: "20px" }}>
              <a
                href="https://www.ibendouma.com/faq"
                style={{
                  color: "#999999",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                {tScope2("helpCenter")}
              </a>{" "}
              -
              <a
                href="https://www.ibendouma.com/privacy-and-policy"
                style={{
                  color: "#999999",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                {tScope2("privacyPolicy")}
              </a>{" "}
              -
              <a
                href="https://ibendouma.com/terms-and-conditions"
                style={{
                  color: "#999999",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                {tScope2("termsAndConditions")}
              </a>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};
