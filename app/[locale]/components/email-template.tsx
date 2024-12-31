import * as React from "react";
import { getScopedI18n } from "@/locales/server";

interface EmailTemplateProps {
  email: string;
  verificationCode: string;
  lastname: string;
  firstname: string;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = async ({
  email,
  verificationCode,
  lastname,
  firstname,
}) => {
  const tScope = await getScopedI18n("emailtemplate");
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
                src="https://ibendouma.vercel.app/ibennewapp-logo.png"
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
            <p
              style={{
                color: "#666666",
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "30px",
              }}
            >
              {tScope("subtitle")} : {email}
            </p>
            <div
              style={{
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                padding: "20px",
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
                {tScope("verifDesc")}
              </p>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#d97706",
                  letterSpacing: "4px",
                }}
              >
                {verificationCode}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                {tScope("enterCode")}
              </p>
            </div>

            <span
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("anyQuestions")}{" "}
              <a
                href="mailto:"
                style={{
                  color: "#d97706",
                  textDecoration: "none",
                  margin: "0 10px",
                }}
              >
                support@ibendouma.com
              </a>
            </span>
            <p
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("codeExpireText")}{" "}
              <strong>{tScope("codeExpireTime")}</strong>.
            </p>
            <p
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("notice")}
            </p>
          </td>
        </tr>

        {/* Instructions de sécurité */}
        <tr>
          <td style={{ padding: "0 30px 30px" }}>
            <div
              style={{
                backgroundColor: "#fff8e1",
                borderRadius: "6px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  color: "#996c00",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                <strong>🔒 {tScope("secureTitle")} :</strong>
                <br />
                {tScope("secureDesc")}
              </p>
            </div>
            <div
              style={{
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {tScope("thanks")}
              </p>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {tScope("cordial")} <br />
                {tScope("teams")}
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
              © 2024 JBK Services INTERNATIONAL FZ-LLC. {tScope("copyright")}.
            </p>
            <p
              style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}
            >
              {tScope("peopleSendTo")} {email}
            </p>
            <div style={{ marginTop: "20px" }}>
              <a
                href="https://ibendouma.com"
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
                href="https://ibendouma.com/echange-de-kamas"
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
                href="https://ibendouma.com/vendre-des-kamas"
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
