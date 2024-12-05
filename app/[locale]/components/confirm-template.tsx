import * as React from "react";
import { getScopedI18n } from "@/locales/server";

interface EmailTemplateProps {
  lastname: string;
  firstname: string;
}

export const ConfirmEmailTemplate: React.FC<EmailTemplateProps> = async ({
  lastname,
  firstname,
}) => {
  const tScope = await getScopedI18n("confirmEmail");
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
        {/* En-tête */}
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
                src="https://2ibn.vercel.app/ibennewapp-logo.png"
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

        {/* Contenu principal */}
        <tr>
          <td style={{ padding: "40px 30px" }}>
            <h1
              style={{
                color: "#333333",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              {tScope("title")} {`${lastname} ${firstname}`}
            </h1>

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
                {tScope("subtitle")}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                {tScope("start")}
                <a
                  href="https://2ibn.com"
                  style={{
                    color: "#d97706",
                    textDecoration: "none",
                    margin: "0 10px",
                  }}
                >
                  2ibn.com
                </a>
              </p>
            </div>

            <p
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("contact")}
            </p>
            <p
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("bientot")} <br />
              {tScope("thanks")}
            </p>
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
              © 2024 JBK Services INTERNATIONAL FZ-LLC. {tScope("copyright")}.
            </p>

            <div style={{ marginTop: "20px" }}>
              <a
                href="https://2ibn.com"
                style={{
                  color: "#d97706",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                {tScope("website")}
              </a>{" "}
              |
              <a
                href="https://2ibn.com/echange-de-kamas"
                style={{
                  color: "#d97706",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                {tScope("exchangeLink")}
              </a>{" "}
              |
              <a
                href="https://2ibn.com/vendre-des-kamas"
                style={{
                  color: "#d97706",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                {tScope("sellLink")}
              </a>
            </div>
          </td>
        </tr>
      </table>

      {/* Message anti-spam */}
      <table
        role="presentation"
        width="100%"
        style={{ maxWidth: "600px", margin: "20px auto" }}
      >
        <tr>
          <td
            style={{ textAlign: "center", color: "#999999", fontSize: "12px" }}
          >
            <p>{tScope("bottomSpam")}</p>
          </td>
        </tr>
      </table>
    </div>
  );
};
