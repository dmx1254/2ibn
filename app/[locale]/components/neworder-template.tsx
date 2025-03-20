import * as React from "react";
import { getScopedI18n } from "@/locales/server";

interface OrderConfirmationTemplateProps {
  orderNum: string;
  dateCreated: Date;
  type: string;
}

export const NewOrderConfirmationTemplate: React.FC<
  OrderConfirmationTemplateProps
> = async ({ orderNum, dateCreated, type }) => {
  const tScope = await getScopedI18n("orderConfirmation");
  const tScope2 = await getScopedI18n("confirmEmail");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            <p>Nouvelle {type}</p>

            <div
              style={{
                padding: "10px",
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  color: "#666666",
                }}
              >
                {tScope("orderConfirmed")}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  color: "#666666",
                }}
              >
                {tScope("confirmedV")}
              </p>
            </div>

            {/* Order Details */}
            <div style={{ marginBottom: "20px" }}>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Numero de {type}:</strong> {orderNum}
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
