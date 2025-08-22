import * as React from "react";

interface TypeofOrder {
  type: string;
}

export const NotifyIlyasstemplate: React.FC<TypeofOrder> = ({ type }) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        padding: "20px",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          width: "100%",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          border: "1px solid #e9ecef",
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: "#363A3D",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <img
            src="https://www.ibendouma.com/logo.png"
            alt="ibendouma logo"
            style={{
              width: "120px",
              height: "80px",
              objectFit: "cover",
              objectPosition: "center",
              marginBottom: "20px",
            }}
          />
          <h1
            style={{
              color: "#ffffff",
              fontSize: "28px",
              margin: "0",
              fontWeight: "600",
            }}
          >
            Bonjour Ilyass
          </h1>
        </div>

        {/* Main Content */}
        <div style={{ padding: "40px 30px", textAlign: "center" }}>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "12px",
              border: "2px solid #e9ecef",
              marginBottom: "30px",
            }}
          >
            <h2
              style={{
                color: "#333333",
                fontSize: "22px",
                margin: "0 0 15px 0",
                fontWeight: "600",
              }}
            >
              Nouvelle notification
            </h2>

            {/* Type Badge */}
            <div
              style={{
                display: "inline-block",
                backgroundColor: "#363A3D",
                color: "#ffffff",
                padding: "12px 24px",
                borderRadius: "25px",
                fontSize: "18px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 4px 12px rgba(54, 58, 61, 0.3)",
                border: "2px solid #4a4f53",
              }}
            >
              {type}
            </div>
          </div>

          <p
            style={{
              color: "#666666",
              fontSize: "16px",
              lineHeight: "1.6",
              margin: "0",
            }}
          >
            Une nouvelle {type.toLowerCase()} a été faite à partir de votre site
            site ibendouma.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "30px",
            backgroundColor: "#f8f9fa",
            textAlign: "center",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <p
            style={{
              color: "#999999",
              fontSize: "14px",
              margin: "0 0 15px 0",
            }}
          >
            © 2024 JBK Services INTERNATIONAL FZ-LLC. Tous droits réservés.
          </p>

          <div style={{ marginTop: "20px" }}>
            <a
              href="https://www.ibendouma.com/faq"
              style={{
                color: "#666666",
                textDecoration: "none",
                margin: "0 10px",
                fontSize: "14px",
              }}
            >
              Centre d'aide
            </a>
            <span style={{ color: "#999999" }}> - </span>
            <a
              href="https://www.ibendouma.com/privacy-and-policy"
              style={{
                color: "#666666",
                textDecoration: "none",
                margin: "0 10px",
                fontSize: "14px",
              }}
            >
              Politique de confidentialité
            </a>
            <span style={{ color: "#999999" }}> - </span>
            <a
              href="https://ibendouma.com/terms-and-conditions"
              style={{
                color: "#666666",
                textDecoration: "none",
                margin: "0 10px",
                fontSize: "14px",
              }}
            >
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
