import { ibenModels } from "@/lib/models/ibendouma-models";
import { goapiModels } from "@/lib/models/ibytrade-models";
import {
  codeGenerated,
  codeGeneratedBuy,
  parsedSymboleToDevise,
} from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const { UserIbenModel, OrderModelIben, ServerModelIben } = await ibenModels;
    const { BuyModel, ExchangeModel, OrderAccountModel } = await goapiModels;

    let data;
    try {
      data = await req.json();
    } catch (jsonError) {
      console.error("❌ Erreur parsing JSON:", jsonError);
      return NextResponse.json(
        {
          message: "Invalid JSON format",
          error:
            jsonError instanceof Error
              ? jsonError.message
              : "Unknown JSON error",
          received: false,
        },
        { status: 400, headers }
      );
    }

    if (!data || !data.rowData) {
      console.error(
        "❌ Données manquantes - data ou data.rowData est undefined"
      );
      console.error("Data reçue:", JSON.stringify(data, null, 2));
      return NextResponse.json(
        {
          message: "Missing data or rowData",
          received: false,
        },
        { status: 400, headers }
      );
    }

    // console.log("-------------- data -----------------------");
    // console.log(data);

    let cleanCode, buyCode, infopay;

    try {
      cleanCode = data.rowData.code
        ? data.rowData.code.match(/#[^\n]+/)?.[0]?.trim()
        : null;
      buyCode = cleanCode?.split("#")[1];

      infopay = data.rowData.infopay
        ? data.rowData.infopay.split("\n")[1]?.trim()
        : null;
    } catch (parseError) {
      console.error("❌ Erreur parsing code/infopay:", parseError);
      console.error("data.rowData:", JSON.stringify(data.rowData, null, 2));
    }

    // CASE TYPE ACHAT CREATE AN ORDER ON THE SITE
    if (data.rowData.type === "Vente") {
      if (buyCode) {
        const order = await BuyModel.findOne({
          numBuy: buyCode,
        });
        if (order) {
          // console.log(order);
          // console.log(data.rowData);
          await BuyModel.findByIdAndUpdate(
            order._id,
            {
              $set: {
                status: data.rowData.etatcommande
                  ? data.rowData.etatcommande
                  : order.status,
              },
            },
            { new: true }
          );
          console.log(
            "✅ Commande de vente mise à jour avec succès:",
            order.numBuy
          );
          return NextResponse.json(
            {
              message: "Buy order updated successfully",
              received: true,
            },
            { status: 200, headers }
          );
        } else {
          console.error("❌ Commande d'achat non trouvée:", buyCode);
          return NextResponse.json(
            {
              message: "Buy order not found",
              received: false,
            },
            { status: 404, headers }
          );
        }
      } else {
        if (
          data.rowData.produit &&
          data.rowData.qte &&
          data.rowData.montant &&
          data.rowData.puA &&
          data.rowData.personnage &&
          data.rowData.infopay &&
          data.rowData.payment &&
          data.rowData.etatcommande &&
          data.rowData.email
        ) {
          console.log("✅ Toutes les informations sont présentes");

          let user;
          const email = data.rowData.email.trim();
          try {
            user = await UserIbenModel.findOne({
              email: email,
            });

            if (!user) {
              console.log(
                "-------------- user not found -----------------------"
              );
              console.log(email);
              console.log(
                "-------------- user not found -----------------------"
              );
              return NextResponse.json(
                { message: "User not found", received: false },
                { status: 404, headers }
              );
            }
          } catch (userError) {
            console.error("❌ Erreur recherche utilisateur:", userError);
            return NextResponse.json(
              {
                message: "Error finding user",
                error:
                  userError instanceof Error
                    ? userError.message
                    : "Unknown error",
                received: false,
              },
              { status: 500, headers }
            );
          }

          if (user) {
            console.log("✅ Utilisateur trouvé:", user._id);
            const userId = user._id;
            if (!userId) {
              console.error(
                "❌ userId est undefined pour l'utilisateur:",
                user.email
              );
              return NextResponse.json(
                { message: "User ID not found", received: false },
                { status: 400, headers }
              );
            }

            let newOrder;
            try {
              // Parsing sécurisé des valeurs numériques
              const puValue = data.rowData.puA
                ? parseFloat(data.rowData.puA)
                : 0;
              const montantValue = data.rowData.montant
                ? parseFloat(data.rowData.montant)
                : 0;

              newOrder = await BuyModel.create({
                numBuy: codeGenerated(),
                userId: userId,
                jeu: data.rowData.personnage,
                server: data.rowData.produit,
                pu: puValue,
                qte: data.rowData.qte,
                totalPrice: montantValue,
                paymentMethod: data.rowData.payment,
                paymentInfoDetails:
                  data.rowData.payment + "<br/>" + (infopay || ""),
                currencymethod: "dollar",
                buyCode: codeGeneratedBuy(),
                lastname: user.lastname + user.firstname,
                firstname: user.firstname,
                status: data.rowData.etatCommande,
              });
              console.log("✅ Commande créée avec succès:", newOrder.numBuy);
              return NextResponse.json(
                {
                  message: "Order created successfully",
                  received: true,
                  orderId: newOrder._id,
                },
                { status: 200, headers }
              );
            } catch (createError) {
              console.error("❌ Erreur création commande:", createError);
              console.error("Données de la commande:", {
                personnage: data.rowData.personnage,
                produit: data.rowData.produit,
                qte: data.rowData.qte,
                email: data.rowData.email,
              });
              return NextResponse.json(
                {
                  message: "Error creating order",
                  error:
                    createError instanceof Error
                      ? createError.message
                      : "Unknown error",
                  received: false,
                },
                { status: 500, headers }
              );
            }
          } else {
            console.error(
              "❌ Utilisateur non trouvé avec l'email:",
              data.rowData.email
            );
            return NextResponse.json(
              {
                message: "User not found",
                email: data.rowData.email,
                received: false,
              },
              { status: 404, headers }
            );
          }
        } else {
          console.error("❌ Informations manquantes pour créer la commande");
          console.error("Données reçues:", {
            produit: data.rowData.produit,
            qte: data.rowData.qte,
            montant: data.rowData.montant,
            puA: data.rowData.puA,
            personnage: data.rowData.personnage,
            infoPay: data.rowData.infoPay,
            payment: data.rowData.payment,
            etatCommande: data.rowData.etatCommande,
            email: data.rowData.email,
          });
        }
        return NextResponse.json(
          {
            message: "Order not found or some information are missing",
            received: false,
          },
          { status: 400, headers }
        );
      }
      // CASE TYPE ECHANGE CREATE AN EXCHANGE ON THE SITE
    } else if (data.rowData.type === "Echange") {
      // Extraire le numExchange du code
      const numExchange = buyCode || cleanCode?.split("#")[1] || null;

      if (numExchange) {
        const exchange = await ExchangeModel.findOne({
          numExchange: numExchange,
        });
        if (exchange) {
          await ExchangeModel.findByIdAndUpdate(exchange._id, {
            $set: {
              status: data.rowData.etatcommande
                ? data.rowData.etatcommande
                : exchange.status,
            },
          }, { new: true });
          console.log(
            "✅ Échange mise à jour avec succès:",
            exchange.numExchange
          );

          return NextResponse.json(
            {
              message: "Exchange updated successfully",
              received: true,
            },
            { status: 200, headers }
          );
        } else {
          console.error("❌ Échange non trouvée:", numExchange);
          return NextResponse.json(
            {
              message: "Exchange not found",
              received: false,
            },
            { status: 404, headers }
          );
        }
      } else {
        // Créer un nouvel échange
        if (
          data.rowData.produit &&
          data.rowData.qte &&
          data.rowData.montant &&
          data.rowData.personnage &&
          data.rowData.payment &&
          data.rowData.etatcommande &&
          data.rowData.email
        ) {
          console.log(
            "✅ Toutes les informations sont présentes pour l'échange"
          );

          // Extraire les informations du personnage
          let characterToPay = "";
          let characterToReceive = "";
          let codeToExchange = "";

          try {
            const personnageText = data.rowData.personnage;

            // Extraire "Personnage à payer: kilo"
            const payMatch = personnageText.match(
              /Personnage à payer:\s*([^\n]+)/i
            );
            if (payMatch) {
              characterToPay = payMatch[1].trim();
            }

            // Extraire "Personnage à recevoir: bghu-kio"
            const receiveMatch = personnageText.match(
              /Personnage à recevoir:\s*([^\n]+)/i
            );
            if (receiveMatch) {
              characterToReceive = receiveMatch[1].trim();
            }

            // Extraire "Code d'échange: MJH12R"
            const codeMatch = personnageText.match(
              /Code d'échange:\s*([^\n]+)/i
            );
            if (codeMatch) {
              codeToExchange = codeMatch[1].trim();
            }
          } catch (parseError) {
            console.error("❌ Erreur parsing personnage:", parseError);
            console.error("personnage:", data.rowData.personnage);
          }

          const exchangeNum = codeGenerated();

          let user;
          const email = data.rowData.email.trim();
          try {
            user = await UserIbenModel.findOne({
              email: email,
            });

            if (!user) {
              console.error("❌ Utilisateur non trouvé pour l'échange:", email);
              return NextResponse.json(
                { message: "User not found", received: false },
                { status: 404, headers }
              );
            }
          } catch (userError) {
            console.error("❌ Erreur recherche utilisateur:", userError);
            return NextResponse.json(
              {
                message: "Error finding user",
                error:
                  userError instanceof Error
                    ? userError.message
                    : "Unknown error",
                received: false,
              },
              { status: 500, headers }
            );
          }

          if (user) {
            console.log("✅ Utilisateur trouvé:", user._id);
            const userId = user._id.toString();

            // console.log(userId);
            // console.log(exchangeNum);
            // console.log(data.rowData.produit);
            // console.log(Number(data.rowData.qte));
            // console.log(characterToPay);
            // console.log(data.rowData.payment);
            // console.log(Number(data.rowData.montant));
            // console.log(characterToReceive);
            // console.log(codeToExchange);
            // console.log(data.rowData.etatcommande);

            try {
              const newExchange = await ExchangeModel.create({
                userId: userId,
                numExchange: exchangeNum,
                serverOut: data.rowData.produit,
                qtyToPay: Number(data.rowData.qte),
                characterToPay: characterToPay,
                serverIn: data.rowData.payment,
                qtyToReceive: Number(data.rowData.montant),
                characterToReceive: characterToReceive,
                codeToExchange: codeToExchange,
                status: data.rowData.etatcommande,
              });

              console.log(
                "✅ Échange créé avec succès:",
                newExchange.numExchange
              );
              return NextResponse.json(
                {
                  message: "Exchange created successfully",
                  received: true,
                  exchangeId: newExchange._id,
                },
                { status: 200, headers }
              );
            } catch (createError) {
              console.error("❌ Erreur création échange:", createError);
              console.error("Données de l'échange:", {
                produit: data.rowData.produit,
                qte: data.rowData.qte,
                montant: data.rowData.montant,
                personnage: data.rowData.personnage,
                email: data.rowData.email,
                characterToPay,
                characterToReceive,
                codeToExchange,
              });
              return NextResponse.json(
                {
                  message: "Error creating exchange",
                  error:
                    createError instanceof Error
                      ? createError.message
                      : "Unknown error",
                  received: false,
                },
                { status: 500, headers }
              );
            }
          }
        } else {
          console.error("❌ Informations manquantes pour créer l'échange");
          console.error("Données reçues:", {
            produit: data.rowData.produit,
            qte: data.rowData.qte,
            montant: data.rowData.montant,
            personnage: data.rowData.personnage,
            payment: data.rowData.payment,
            etatcommande: data.rowData.etatcommande,
            email: data.rowData.email,
          });
          return NextResponse.json(
            {
              message: "Exchange not found or some information are missing",
              received: false,
            },
            { status: 400, headers }
          );
        }
      }
    }

    // CASE TYPE VENTE CREATE AN ORDER ON THE SITE
    else if (data.rowData.type === "Achat") {
      const orderCode = buyCode || cleanCode?.split("#")[1] || null;

      if (orderCode) {
        const order = await OrderModelIben.findOne({
          orderNum: orderCode,
        });
        if (order) {
          await OrderModelIben.findByIdAndUpdate(order._id, {
            $set: {
              status: data.rowData.etatcommande
                ? data.rowData.etatcommande
                : order.status,
            },
          }, { new: true });
          console.log(
            "✅ Commande de vente mise à jour avec succès:",
            order.orderNum
          );
          return NextResponse.json(
            {
              message: "Sale order updated successfully",
              received: true,
            },
            { status: 200, headers }
          );
        } else {
          console.error("❌ Commande de vente non trouvée:", orderCode);
          return NextResponse.json(
            {
              message: "Sale order not found",
              received: false,
            },
            { status: 404, headers }
          );
        }
      } else {
        // Créer une nouvelle commande
        if (
          data.rowData.produit &&
          data.rowData.qte &&
          data.rowData.montant &&
          data.rowData.puV &&
          data.rowData.personnage &&
          data.rowData.payment &&
          data.rowData.etatcommande &&
          data.rowData.email
        ) {
          console.log(
            "✅ Toutes les informations sont présentes pour la vente"
          );

          // Récupérer le serveur par produit
          let server;
          try {
            server = await ServerModelIben.findOne({
              serverName: data.rowData.produit,
            });

            if (!server) {
              console.error("❌ Serveur non trouvé:", data.rowData.produit);
              return NextResponse.json(
                {
                  message: "Server not found",
                  server: data.rowData.produit,
                  received: false,
                },
                { status: 404, headers }
              );
            }
          } catch (serverError) {
            console.error("❌ Erreur recherche serveur:", serverError);
            return NextResponse.json(
              {
                message: "Error finding server",
                error:
                  serverError instanceof Error
                    ? serverError.message
                    : "Unknown error",
                received: false,
              },
              { status: 500, headers }
            );
          }

          // Récupérer l'utilisateur
          let user;
          const email = data.rowData.email.trim();
          try {
            user = await UserIbenModel.findOne({
              email: email,
            });

            if (!user) {
              console.error("❌ Utilisateur non trouvé pour la vente:", email);
              return NextResponse.json(
                { message: "User not found", received: false },
                { status: 404, headers }
              );
            }
          } catch (userError) {
            console.error("❌ Erreur recherche utilisateur:", userError);
            return NextResponse.json(
              {
                message: "Error finding user",
                error:
                  userError instanceof Error
                    ? userError.message
                    : "Unknown error",
                received: false,
              },
              { status: 500, headers }
            );
          }

          if (user && server) {
            console.log("✅ Utilisateur et serveur trouvés");
            const userId = user._id.toString();

            // Extraire le symbole de devise du montant (ex: "34.61€" -> "€")
            const montantStr = String(data.rowData.montant);
            let currencySymbol = "€"; // Par défaut
            const symbolMatch = montantStr.match(/[€$£]|EUR|USD|MAD|DH|CAD/i);
            if (symbolMatch) {
              currencySymbol = symbolMatch[0];
            }

            // Convertir le symbole en devise
            const cur = parsedSymboleToDevise(currencySymbol);

            // Valeur de conversion pour l'euro (environ 11 MAD = 1 EUR)
            const valCurency =
              cur === "euro" ? "11" : cur === "dollar" ? "10" : "1";

            // Parser les valeurs numériques (enlever les symboles)
            const totalPrice = parseFloat(
              montantStr.replace(/[€$£]|EUR|USD|MAD|DH|CAD/gi, "").trim()
            );
            const price = parseFloat(
              String(data.rowData.puV)
                .replace(/[€$£]|EUR|USD|MAD|DH|CAD/gi, "")
                .trim()
            );

            // Créer le billing depuis les infos utilisateur
            const billing = {
              lastname: user.lastname || "",
              firstname: user.firstname || "",
              address: user.address || "",
              city: user.city || "",
              codePostal: user.codePostal || "",
              country: user.country || "",
              email: user.email || "",
              phone: user.phone || "",
              departement: user.departement || "",
            };

            try {
              const newOrder = await OrderModelIben.create({
                userId: userId,
                orderNum: codeGenerated(),
                paymentMethod: data.rowData.payment,
                products: [
                  {
                    productId: server._id.toString(),
                    category: server.serverCategory,
                    server: data.rowData.produit,
                    qty: 1000000, // Valeur fixe selon les instructions
                    amount: Number(data.rowData.qte),
                    bonus: 0,
                    price: price,
                    character: data.rowData.personnage,
                    totalPrice: totalPrice,
                  },
                ],
                address: user.address || "",
                status: data.rowData.etatcommande,
                totalPrice: totalPrice,
                orderIdPaid: "",
                cur: cur,
                valCurency: valCurency,
                billing: billing,
              });

              console.log(
                "✅ Commande de vente créée avec succès:",
                newOrder.orderNum
              );
              return NextResponse.json(
                {
                  message: "Sale order created successfully",
                  received: true,
                  orderId: newOrder._id,
                },
                { status: 200, headers }
              );
            } catch (createError) {
              console.error(
                "❌ Erreur création commande de vente:",
                createError
              );
              console.error("Données de la commande:", {
                produit: data.rowData.produit,
                qte: data.rowData.qte,
                montant: data.rowData.montant,
                email: data.rowData.email,
                serverId: server._id,
              });
              return NextResponse.json(
                {
                  message: "Error creating sale order",
                  error:
                    createError instanceof Error
                      ? createError.message
                      : "Unknown error",
                  received: false,
                },
                { status: 500, headers }
              );
            }
          }
        } else {
          console.error(
            "❌ Informations manquantes pour créer la commande de vente"
          );
          console.error("Données reçues:", {
            produit: data.rowData.produit,
            qte: data.rowData.qte,
            montant: data.rowData.montant,
            puV: data.rowData.puV,
            personnage: data.rowData.personnage,
            payment: data.rowData.payment,
            etatcommande: data.rowData.etatcommande,
            email: data.rowData.email,
          });
          return NextResponse.json(
            {
              message: "Sale order not found or some information are missing",
              received: false,
            },
            { status: 400, headers }
          );
        }
      }
    }

    // CASE TYPE MARKETPLACE CREATE AN ORDER ON THE SITE
    else if (data.rowData.type === "Marketplace") {
      const orderCode = buyCode || cleanCode?.split("#")[1] || null;

      if (orderCode) {
        const order = await OrderAccountModel.findOne({
          numOrder: orderCode,
        });
        if (order) {
          await OrderAccountModel.findByIdAndUpdate(order._id, {
            $set: {
              status: data.rowData.etatcommande
                ? data.rowData.etatcommande
                : order.status,
            },
          }, { new: true });
          console.log(
            "✅ Commande Marketplace mise à jour avec succès:",
            order.numOrder
          );
          return NextResponse.json(
            {
              message: "Marketplace order updated successfully",
              received: true,
            },
            { status: 200, headers }
          );
        } else {
          console.error("❌ Commande Marketplace non trouvée:", orderCode);
          return NextResponse.json(
            {
              message: "Marketplace order not found",
              received: false,
            },
            { status: 404, headers }
          );
        }
      } else {
        // Créer une nouvelle commande
        if (
          data.rowData.produit &&
          data.rowData.qte &&
          data.rowData.montant &&
          data.rowData.puV &&
          data.rowData.personnage &&
          data.rowData.payment &&
          data.rowData.etatcommande &&
          data.rowData.email
        ) {
          console.log(
            "✅ Toutes les informations sont présentes pour la commande Marketplace"
          );

          // Extraire category, licence et deliveryDelay du champ personnage
          let category = "";
          let licence = "";
          let deliveryDelay = 0;

          try {
            const personnageText = data.rowData.personnage;

            // Extraire "category: accounts"
            const categoryMatch = personnageText.match(/category:\s*([^\n]+)/i);
            if (categoryMatch) {
              category = categoryMatch[1].trim();
            }

            // Extraire "licence: dofus retro"
            const licenceMatch = personnageText.match(/licence:\s*([^\n]+)/i);
            if (licenceMatch) {
              licence = licenceMatch[1].trim();
            }

            // Extraire "deliveryDelay: 25"
            const deliveryMatch = personnageText.match(
              /deliveryDelay:\s*([^\n]+)/i
            );
            if (deliveryMatch) {
              deliveryDelay = parseInt(deliveryMatch[1].trim(), 10) || 0;
            }
          } catch (parseError) {
            console.error("❌ Erreur parsing personnage:", parseError);
            console.error("personnage:", data.rowData.personnage);
          }

          // Récupérer l'utilisateur
          let user;
          const email = data.rowData.email.trim();
          try {
            user = await UserIbenModel.findOne({
              email: email,
            });

            if (!user) {
              console.error(
                "❌ Utilisateur non trouvé pour la commande Marketplace:",
                email
              );
              return NextResponse.json(
                { message: "User not found", received: false },
                { status: 404, headers }
              );
            }
          } catch (userError) {
            console.error("❌ Erreur recherche utilisateur:", userError);
            return NextResponse.json(
              {
                message: "Error finding user",
                error:
                  userError instanceof Error
                    ? userError.message
                    : "Unknown error",
                received: false,
              },
              { status: 500, headers }
            );
          }

          if (user) {
            console.log("✅ Utilisateur trouvé:", user._id);
            const userId = user._id.toString();

            // Extraire le symbole de devise du montant (ex: "123.08€" -> "€")
            const montantStr = String(data.rowData.montant);
            let currencySymbol = "€"; // Par défaut
            const symbolMatch = montantStr.match(/[€$£]|EUR|USD|MAD|DH|CAD/i);
            if (symbolMatch) {
              currencySymbol = symbolMatch[0];
            }

            // Convertir le symbole en devise
            const cur = parsedSymboleToDevise(currencySymbol);

            // Valeur de conversion pour l'euro (environ 11 MAD = 1 EUR)
            const valCurency = cur === "euro" ? 11 : cur === "dollar" ? 10 : 1;

            // Parser les valeurs numériques (enlever les symboles)
            const totalPrice = parseFloat(
              montantStr.replace(/[€$£]|EUR|USD|MAD|DH|CAD/gi, "").trim()
            );
            const price = parseFloat(
              String(data.rowData.puV)
                .replace(/[€$£]|EUR|USD|MAD|DH|CAD/gi, "")
                .trim()
            );

            // Créer le billing depuis les infos utilisateur
            const billing = {
              lastname: user.lastname || "",
              firstname: user.firstname || "",
              address: user.address || "",
              city: user.city || "",
              codePostal: user.codePostal || "",
              country: user.country || "",
              email: user.email || "",
              phone: user.phone || "",
              departement: user.departement || "",
            };

            try {
              const newOrder = await OrderAccountModel.create({
                userId: userId,
                numOrder: codeGenerated(),
                products: [
                  {
                    description: data.rowData.produit,
                    qty: Number(data.rowData.qte),
                    price: price,
                    totalPrice: totalPrice,
                    product: data.rowData.produit,
                    category: category,
                    licence: licence,
                    deliveryDelay: deliveryDelay,
                  },
                ],
                totalPrice: totalPrice,
                paymentMethod: data.rowData.payment,
                status: data.rowData.etatcommande,
                address: user.address || "",
                billing: billing,
                cur: cur,
                valCurency: valCurency,
              });

              console.log(
                "✅ Commande Marketplace créée avec succès:",
                newOrder.numOrder
              );
              return NextResponse.json(
                {
                  message: "Marketplace order created successfully",
                  received: true,
                  orderId: newOrder._id,
                },
                { status: 200, headers }
              );
            } catch (createError) {
              console.error(
                "❌ Erreur création commande Marketplace:",
                createError
              );
              console.error("Données de la commande:", {
                produit: data.rowData.produit,
                qte: data.rowData.qte,
                montant: data.rowData.montant,
                email: data.rowData.email,
                category,
                licence,
                deliveryDelay,
              });
              return NextResponse.json(
                {
                  message: "Error creating marketplace order",
                  error:
                    createError instanceof Error
                      ? createError.message
                      : "Unknown error",
                  received: false,
                },
                { status: 500, headers }
              );
            }
          }
        } else {
          console.error(
            "❌ Informations manquantes pour créer la commande Marketplace"
          );
          console.error("Données reçues:", {
            produit: data.rowData.produit,
            qte: data.rowData.qte,
            montant: data.rowData.montant,
            puV: data.rowData.puV,
            personnage: data.rowData.personnage,
            payment: data.rowData.payment,
            etatcommande: data.rowData.etatcommande,
            email: data.rowData.email,
          });
          return NextResponse.json(
            {
              message:
                "Marketplace order not found or some information are missing",
              received: false,
            },
            { status: 400, headers }
          );
        }
      }
    }

    // console.log(data);
    return NextResponse.json(
      { message: "Webhook received successfully", received: true },
      { headers }
    );
  } catch (error) {
    console.error("❌ ERREUR CRITIQUE dans le webhook:");
    console.error(
      "Type d'erreur:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    console.error(
      "Erreur complète:",
      JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
    );

    return NextResponse.json(
      {
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
        received: false,
      },
      { status: 500, headers }
    );
  }
}
