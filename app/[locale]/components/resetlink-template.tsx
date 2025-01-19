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
  const tScope2 = await getScopedI18n("confirmEmail");
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
                src="https://ibendouma.com/ibennewapp-logo.png"
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

        {/* Pied de page */}
        <tr>
          <td style={{ padding: "0 30px 30px" }}>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "16px",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  🎮 {tScope2("joinComs")}:
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginLeft: "8px",
                  }}
                >
                  <a
                    href="https://www.facebook.com/ibendouma1"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/733/733547.png"
                      alt="Facebook"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="https://www.threads.net/@ibendouma_com?hl=fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                    }}
                  >
                    <img
                      src="https://tse4.mm.bing.net/th?id=OIP.FJ2rxJYdlVhRJ2kGR9-g6QHaHa&w=474&h=474&c=7"
                      alt="Threads"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="https://t.me/ibendouma"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                      marginLeft: "2px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/2111/2111646.png"
                      alt="Telegram"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="https://wa.me/971529087560"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                      marginLeft: "2px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/733/733585.png"
                      alt="WhatsApp"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="https://www.tiktok.com/@ibendouma.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                      marginLeft: "2px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/3046/3046121.png"
                      alt="TikTok"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="https://discordapp.com/users/369803701725954048/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                      marginLeft: "2px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/3670/3670157.png"
                      alt="Discord"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="https://www.instagram.com/ibendouma_com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                      marginLeft: "2px",
                    }}
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png"
                      alt="Instagram"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>

                  <a
                    href="skype:bendouma.ilyass?chat"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      borderRadius: "9999px",
                      border: "2px solid #45494e",
                      backgroundColor: "#363A3D",
                      textDecoration: "none",
                      marginLeft: "2px",
                    }}
                  >
                    <img
                      src="https://tse4.mm.bing.net/th?id=OIP.DZtr8Ssjo5BUHKRNRYiw3gHaHa&w=474&h=474&c=7"
                      alt="Skype"
                      style={{
                        display: "block",
                        width: "14px",
                        height: "14px",
                      }}
                    />
                  </a>
                </div>
              </div>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: "1.5",
                  margin: 0,
                }}
              >
                {tScope2("cordialy")}, <br />
                {tScope2("ibenTeam")}
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
              © 2024 JBK Services INTERNATIONAL FZ-LLC. {tScope2("rightreser")}.
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
        <tr>
          <td
            style={{
              backgroundColor: "#f8f9fa",
              padding: "30px",
              textAlign: "center",
            }}
          >
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
