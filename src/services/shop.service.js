import LocalSource from "@/datasource/controller";

async function shopLogin(data) {
  try {
    console.log("[ShopService] Tentative de connexion avec :", data);
    const response = await LocalSource.shopLogin(data);
    console.log("[ShopService] Réponse de shopLogin :", response);

    if (response.error === 0) {
      return response;
    } else {
      console.error("[ShopService] Erreur lors de la connexion :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de shopLogin :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
  }
}

async function getAllViruses() {
  try {
    console.log("[ShopService] Tentative de récupération des articles disponibles...");
    const response = await LocalSource.getItems();
    console.log("[ShopService] Réponse de getItems :", response);

    if (response.error === 0) {
      return response;
    } else {
      console.error("[ShopService] Erreur lors de la récupération des articles :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de getAllViruses :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les articles." };
  }
}

async function getBasket(userId) {
  try {
    console.log("[ShopService] Tentative de récupération du panier pour userId :", userId);
    const response = await LocalSource.getBasket(userId);
    console.log("[ShopService] Réponse de getBasket :", response);

    if (response.error === 0) {
      return response;
    } else {
      console.error("[ShopService] Erreur lors de la récupération du panier :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de getBasket :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer le panier." };
  }
}

async function addToBasket(userId, { item, quantity }) {
  try {
    console.log("[ShopService] Tentative d'ajout au panier :", { userId, item, quantity });

    if (!item || quantity <= 0) {
      console.error("[ShopService] Données invalides pour l'ajout au panier :", { item, quantity });
      return { error: 1, status: 400, data: "Article ou quantité invalide." };
    }

    const calculatedPrice = calculatePrice(item, quantity);

    const response = await LocalSource.addToBasket(userId, {
      item: { ...item, finalPrice: calculatedPrice },
      quantity,
    });

    console.log("[ShopService] Réponse de addToBasket :", response);

    if (response.error === 0) {
      return response;
    } else {
      console.error("[ShopService] Erreur lors de l'ajout au panier :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de addToBasket :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible d'ajouter au panier." };
  }
}

async function removeFromBasket(userId, itemName) {
  try {
    console.log("[ShopService] Tentative de suppression de l'article :", itemName, "pour userId :", userId);
    const response = await LocalSource.removeFromBasket(userId, itemName);
    console.log("[ShopService] Réponse de removeFromBasket :", response);

    if (response.error === 0) {
      return response;
    } else {
      console.error("[ShopService] Erreur lors de la suppression de l'article :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de removeFromBasket :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de supprimer l'article." };
  }
}

async function clearBasket(userId) {
  try {
    console.log("[ShopService] Tentative de vidage du panier pour userId :", userId);
    const response = await LocalSource.clearBasket(userId);
    console.log("[ShopService] Réponse de clearBasket :", response);

    if (response.error === 0) {
      return response;
    } else {
      console.error("[ShopService] Erreur lors du vidage du panier :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de clearBasket :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de vider le panier." };
  }
}

async function createOrder(userId) {
  try {
    console.log("[ShopService] Tentative de création de commande pour userId :", userId);
    const response = await LocalSource.createOrder(userId);
    console.log("[ShopService] Réponse de createOrder :", response);

    if (response.error === 0) {
      // Synchronisation : vider le panier après création de la commande
      const clearResponse = await clearBasket(userId);
      if (clearResponse.error === 0) {
        console.log("[ShopService] Commande créée et panier vidé.");
      }
      return response;
    } else {
      console.error("[ShopService] Erreur lors de la création de commande :", response.data);
      return { error: 1, status: response.status, data: response.data };
    }
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de createOrder :", err.message);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de créer une commande." };
  }
}

// Fonction pour appliquer les promotions
function calculatePrice(item, quantity) {
  if (item.promotion && item.promotion.length > 0) {
    const applicablePromo = item.promotion.find((promo) => quantity >= promo.amount);
    if (applicablePromo) {
      console.log(`[Promotion] Réduction appliquée : ${applicablePromo.discount}%`);
      return item.price * quantity * (1 - applicablePromo.discount / 100);
    }
  }
  return item.price * quantity;
}

export default {
  shopLogin,
  getAllViruses,
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
  createOrder,
};
