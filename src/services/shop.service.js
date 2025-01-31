import LocalSource from "@/datasource/controller";

async function shopLogin(data) {
  console.log("[ShopService] Tentative de connexion avec :", data);
  try {
    // Appel à LocalSource
    const response = await LocalSource.shopLogin(data);
    console.log("[ShopService] Réponse reçue de shopLogin :", response);

    // Vérifie la réponse
    if (response.error === 0) {
      console.log("[ShopService] Connexion réussie :", response.data);
      return response;
    } else {
      console.warn("[ShopService] Erreur lors de la connexion :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    // Gestion des erreurs réseau
    console.error("[ShopService] Erreur réseau lors de la connexion :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
  }
}


async function getAllViruses() {
  console.log("[ShopService] 🦠 Récupération des articles disponibles...");
  try {
    return await LocalSource.getItems(); // 🔥 Pas de transformation ici !
  } catch (err) {
    console.error("[ShopService] ❌ Erreur réseau :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les articles." };
  }
}


async function getOrders(userId) {
  console.log("[ShopService] Récupération des commandes pour userId :", userId);
  try {
    const response = await LocalSource.getOrders(userId);
    console.log("[ShopService] Réponse reçue de getOrders :", response);

    if (response.error === 0) {
      response.data = response.data.map((order) => ({
        ...order,
        total: order.total || 0,
        orderDate: order.date?.$date || "N/A",
        transactionDate: order.date?.$date || "N/A", //
      }));
      console.log("[ShopService] Commandes formatées avec succès :", response.data);
    }

    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la récupération des commandes :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les commandes." };
  }
}

async function getBasket(userId) {
  console.log("[ShopService] Récupération du panier pour userId :", userId);
  try {
    const response = await LocalSource.getBasket(userId);
    console.log("[ShopService] Réponse reçue de getBasket :", response);

    if (response.error === 0) {
      console.log("[ShopService] Panier récupéré avec succès :", response.data);
    } else {
      console.warn("[ShopService] Erreur lors de la récupération du panier :", response.data);
    }
    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la récupération du panier :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer le panier." };
  }
}

async function addToBasket(userId, { item, quantity }) {
  console.log("[ShopService] Tentative d'ajout au panier pour userId :", userId, "avec item :", item, "quantité :", quantity);
  try {
    const response = await LocalSource.addToBasket(userId, { item, quantity });
    console.log("[ShopService] Réponse reçue de addToBasket :", response);

    if (response.error === 0) {
      console.log(`[ShopService] Article ajouté au panier : ${item.name}, Quantité : ${quantity}`);
    } else {
      console.warn(`[ShopService] Erreur lors de l'ajout de "${item.name}" au panier :`, response.data);
    }
    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de l'ajout au panier :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible d'ajouter l'article." };
  }
}

async function removeFromBasket(userId, itemName) {
  console.log("[ShopService] Suppression de l'article pour userId :", userId, "article :", itemName);
  try {
    const response = await LocalSource.removeFromBasket(userId, itemName);
    console.log("[ShopService] Réponse reçue de removeFromBasket :", response);

    if (response.error === 0) {
      console.log(`[ShopService] Article "${itemName}" supprimé avec succès.`);
    } else {
      console.warn(`[ShopService] Erreur lors de la suppression de "${itemName}" :`, response.data);
    }
    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la suppression de l'article :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de supprimer l'article." };
  }
}

async function clearBasket(userId) {
  console.log("[ShopService] Vidage du panier pour userId :", userId);
  try {
    const response = await LocalSource.clearBasket(userId);
    console.log("[ShopService] Réponse reçue de clearBasket :", response);

    if (response.error === 0) {
      console.log("[ShopService] Panier vidé avec succès.");
    } else {
      console.warn("[ShopService] Erreur lors du vidage du panier :", response.data);
    }
    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors du vidage du panier :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de vider le panier." };
  }
}

async function createOrder(userId) {
  console.log("[ShopService] Création d'une commande pour userId :", userId);
  try {
    const response = await LocalSource.createOrder(userId);
    console.log("[ShopService] Réponse reçue de createOrder :", response);

    if (response.error === 0) {
      console.log("[ShopService] Commande créée avec succès :", response.data);
    } else {
      console.warn("[ShopService] Erreur lors de la création de la commande :", response.data);
    }
    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la création de la commande :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de créer la commande." };
  }
}

async function getOrder(uuid) {
  console.log(`[ShopService] 🔍 Récupération de la commande UUID : ${uuid}`);

  try {
    const response = await LocalSource.getOrder(uuid);
    console.log("[ShopService] ✅ Réponse reçue de getOrder :", response);

    if (response.error === 0 && response.data) {
      return {
        error: 0,
        status: response.status,
        data: {
          ...response.data,
          orderDate: response.data.date?.$date || "N/A", // ✅ Ajout de la date de commande
          transactionDate: response.data.transactionDate?.$date || "N/A", // ✅ Ajout de la date de transaction
        },
      };
    }

    return { error: 1, status: response.status, data: response.data || "Commande introuvable." };

  } catch (err) {
    console.error("[ShopService] ❌ Erreur réseau lors de la récupération de la commande :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer la commande." };
  }
}


async function payOrder(orderUuid, transactionUuid) {
  console.log(`[ShopService] 💳 Paiement de la commande UUID : ${orderUuid} avec transaction UUID : ${transactionUuid}`);

  try {
    const response = await LocalSource.payOrder({ orderUuid, transactionUuid }); // ✅ Correction : envoi sous forme d'objet
    console.log("[ShopService] ✅ Réponse reçue de payOrder :", response);

    if (response.error === 0) {
      console.log(`[ShopService] 🎉 Commande "${orderUuid}" payée avec succès.`);

      return {
        ...response,
        data: {
          ...response.data,
          transactionDate: new Date().toISOString(), // ✅ Ajout de la date de transaction
        },
      };
    }

    console.warn(`[ShopService] ⚠️ Erreur lors du paiement de la commande "${orderUuid}" :`, response.data);
    return response;

  } catch (err) {
    console.error("[ShopService] ❌ Erreur réseau lors du paiement :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de payer la commande." };
  }
}


async function cancelOrder(uuid) {
  console.log(`[ShopService] Annulation de la commande UUID : ${uuid}`);
  try {
    const response = await LocalSource.cancelOrder(uuid);
    console.log("[ShopService] Réponse reçue de cancelOrder :", response);

    if (response.error === 0) {
      console.log(`[ShopService] Commande UUID "${uuid}" annulée avec succès.`);
    } else {
      console.warn(`[ShopService] Erreur lors de l'annulation de la commande UUID "${uuid}" :`, response.data);
    }
    return response;
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de l'annulation :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible d'annuler la commande." };
  }
}

export default {
  shopLogin,
  getAllViruses,
  getOrders,
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
  createOrder,
  getOrder,
  payOrder,
  cancelOrder,
};
