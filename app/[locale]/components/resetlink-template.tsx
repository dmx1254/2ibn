import * as React from "react";

interface PasswordResetEmailProps {
  resetLink: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = ({
  resetLink,
}) => (
  <div
    style={{
      fontFamily: "Arial, sans-serif",
      color: "#333",
      backgroundColor: "#f4f4f4",
      padding: "20px",
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
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <tr>
        <td
          style={{
            backgroundColor: "#d97706",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#ffffff", fontSize: "24px", margin: "0" }}>
            2IBN
          </h1>
        </td>
      </tr>

      {/* Main content */}
      <tr>
        <td style={{ padding: "40px 30px" }}>
          <h2
            style={{ color: "#333333", fontSize: "24px", marginBottom: "20px" }}
          >
            Bonjour,
          </h2>
          <p
            style={{
              color: "#666666",
              fontSize: "16px",
              lineHeight: "1.5",
              marginBottom: "20px",
            }}
          >
            Nous avons reçu une demande de réinitialisation de votre mot de
            passe. Si cette demande est de votre part, veuillez cliquer sur le
            lien ci-dessous pour créer un nouveau mot de passe :
          </p>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <a
              href={resetLink}
              style={{
                backgroundColor: "#d97706",
                color: "#ffffff",
                padding: "12px 24px",
                textDecoration: "none",
                borderRadius: "5px",
                fontSize: "16px",
              }}
            >
              Réinitialiser mon mot de passe
            </a>
          </div>
          <p style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}>
            Ce lien expirera dans <strong>30 minutes</strong>. Si vous n'avez
            pas demandé cette réinitialisation, vous pouvez ignorer cet email.
          </p>
        </td>
      </tr>

      {/* Footer */}
      <tr>
        <td
          style={{
            backgroundColor: "#f8f9fa",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <p style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}>
            © 2024 2IBN. Tous droits réservés.
          </p>
          <p style={{ color: "#999999", fontSize: "14px", margin: "0" }}>
            Cet email a été envoyé à votre demande. Si vous avez des questions,
            contactez-nous à{" "}
            <a
              href="mailto:support@2ibn.com"
              style={{ color: "#d97706", textDecoration: "none" }}
            >
              support@2ibn.com
            </a>
            .
          </p>
        </td>
      </tr>
    </table>
  </div>
);
