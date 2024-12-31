import { getScopedI18n } from "@/locales/server";
import * as React from "react";

interface PasswordResetEmailProps {
  resetLink: string;
  lastname: string;
  firstname: string;
}

export const PasswordResetEmail: React.FC<PasswordResetEmailProps> = async ({
  resetLink,
  lastname,
  firstname,
}) => {
  const tScope = await getScopedI18n("resetlinktemplate");
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#333",
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
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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

        {/* Main content */}
        <tr>
          <td style={{ padding: "40px 30px" }}>
            <h2
              style={{
                color: "#333333",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              {tScope("title")} {`${lastname} ${firstname}`},
            </h2>
            <p
              style={{
                color: "#666666",
                fontSize: "16px",
                lineHeight: "1.5",
                marginBottom: "20px",
              }}
            >
              {tScope("subtitle")}
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
                {tScope("resetPasstitle")}
              </a>
            </div>
            <p
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("resetDesc1")} <strong>{tScope("resetDesc2")}</strong>.{" "}
              {tScope("resetDesc3")}
            </p>

            <p
              style={{ color: "#666666", fontSize: "16px", lineHeight: "1.5" }}
            >
              {tScope("resetDesc4")}
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
            <p
              style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}
            >
              {tScope("thanks")}
            </p>
            <p
              style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}
            >
              {tScope("cordial")},
              <br />
              {tScope("teams")}
            </p>
            <p
              style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}
            >
              {tScope("sec")}
            </p>
            <p
              style={{ color: "#999999", fontSize: "14px", margin: "0 0 10px" }}
            >
              © 2024 ibendouma. {tScope("copyright")}
            </p>
            <p style={{ color: "#999999", fontSize: "14px", margin: "0" }}>
              {tScope("peopleToSend")}{" "}
              <a
                href="mailto:support@ibendouma.com"
                style={{ color: "#d97706", textDecoration: "none" }}
              >
                support@ibendouma.com
              </a>
              .
            </p>
          </td>
        </tr>
      </table>
    </div>
  );
};
