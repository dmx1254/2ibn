import * as React from "react";
import { getScopedI18n } from "@/locales/server";
import { parsedDevise } from "@/lib/utils";

interface Product {
  productId: string;
  category: string;
  server: string;
  qty: number;
  amount: number;
  price: number;
  character: string;
  totalPrice: number;
}

interface OrderConfirmationTemplateProps {
  lastname: string;
  firstname: string;
  cur: string;
  totalPrice: number;
  status: string;
  paymentMethod: string;
  orderNum: string;
  dateCreated: Date;
  products: Product[];
}

export const OrderConfirmationTemplate: React.FC<
  OrderConfirmationTemplateProps
> = async ({
  lastname,
  firstname,
  cur,
  totalPrice,
  status,
  paymentMethod,
  orderNum,
  dateCreated,
  products,
}) => {
  const tScope = await getScopedI18n("orderConfirmation");
  const tScope2 = await getScopedI18n("confirmEmail");

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return `${amount} ${parsedDevise(currency)}`;
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
              {tScope("title")} {`${firstname} ${lastname}`}
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
                <strong>{tScope("orderNumber")}:</strong> {orderNum}
              </p>

              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>{tScope("product")}:</strong> Dofus
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>{tScope("totalPrice")}:</strong>{" "}
                {formatCurrency(totalPrice, cur)}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>{tScope("orderDate")}:</strong>{" "}
                {formatDate(dateCreated)}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>{tScope("statusText")}:</strong>{" "}
                <span
                  style={{
                    color:
                      status === "paid"
                        ? "green"
                        : status === "pending"
                        ? "yellow"
                        : status === "failed"
                        ? "red"
                        : status === "refunded"
                        ? "yellow"
                        : "blue",
                  }}
                >
                  {status === "paid"
                    ? tScope2("orderpaid")
                    : status === "pending"
                    ? tScope2("orderpending")
                    : status === "failed"
                    ? tScope2("orderfailed")
                    : status === "refunded"
                    ? tScope2("orderrefunded")
                    : tScope2("orderpending")}
                </span>
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>{tScope2("paymentmethod")}:</strong> {paymentMethod}
              </p>
            </div>

            {/* Product Table */}
            <table
              width="100%"
              style={{
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "left",
                    }}
                  >
                    {tScope("productTab")}
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "left",
                    }}
                  >
                    {tScope("server")}
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "right",
                    }}
                  >
                    {tScope("quantity")}
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "right",
                    }}
                  >
                    {tScope("price")}
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      backgroundColor: "#f2f2f2",
                      textAlign: "right",
                    }}
                  >
                    {tScope("totalText")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#666666",
                      }}
                    >
                      {product.category} - {product.character}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#666666",
                      }}
                    >
                      {product.server}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#666666",
                        textAlign: "right",
                      }}
                    >
                      {product.amount}M
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#666666",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(product.price, cur)}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        color: "#666666",
                        textAlign: "right",
                      }}
                    >
                      {formatCurrency(product.totalPrice, cur)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {tScope("totalPrice")}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {formatCurrency(totalPrice, cur)}
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <span
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  lineHeight: "1.5",
                }}
              >
                {tScope("supportMessage")}
              </span>
              <span
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  lineHeight: "1.5",
                  marginLeft: "4px",
                }}
              >
                {tScope("myAccount")}{" "}
                <a
                  href="https://ibendouma.com/profile"
                  style={{
                    color: "#d97706",
                    textDecoration: "none",
                  }}
                >
                  {tScope("website")}
                </a>
              </span>
            </div>
            <p
              style={{ color: "#666666", fontSize: "15px", lineHeight: "1.5" }}
            >
              {tScope("emailInform")}
            </p>
            <p
              style={{ color: "#666666", fontSize: "15px", lineHeight: "1.5" }}
            >
              {tScope("contactSupport")}
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
      </table>

      {/* Anti-spam Message */}
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
