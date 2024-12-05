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
  orderNum,
  dateCreated,
  products,
}) => {
  const tScope = await getScopedI18n("orderConfirmation");

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
                    color: "#2563eb",
                  }}
                >
                  {tScope("status")}
                </span>
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
                  href="https://2ibn.vercel.app/profile"
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
            <p
              style={{ color: "#666666", fontSize: "15px", lineHeight: "1.5" }}
            >
              {tScope("cordial")} <br />
              {tScope("teams")}
            </p>
          </td>
        </tr>

        {/* Footer */}
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
