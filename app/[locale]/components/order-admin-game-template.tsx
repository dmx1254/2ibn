import * as React from "react";
import { getScopedI18n } from "@/locales/server";
import { parsedDevise } from "@/lib/utils";

interface OrderConfirmationTemplateProps {
  orderNum: string;
  cur: string;
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  totalPrice: number;
  dateCreated: Date;
  name: string;
  amount: number;
  status: string;
  paymentMethod: string;
}

export const OrderGameAdminTemplate: React.FC<
  OrderConfirmationTemplateProps
> = async ({
  orderNum,
  cur,
  firstname,
  lastname,
  email,
  telephone,
  totalPrice,
  dateCreated,
  name,
  amount,
  status,
  paymentMethod,
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
              {tScope("title")} Ilyass
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
                Nouvelle commande de {`${firstname} ${lastname}`}
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
                <strong>{tScope("product")}:</strong> {name}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>{tScope("qty")}:</strong> {amount}
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
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Prénom et nom:</strong> {`${lastname} ${firstname}`}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Email:</strong> {email}
              </p>
              <p
                style={{
                  color: "#666666",
                  fontSize: "15px",
                  lineHeight: "1.5",
                }}
              >
                <strong>Téléphone:</strong> {telephone}
              </p>
            </div>

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
