import LocalSource from "@/datasource/controller";

async function shopLogin(data) {
  try {
    const response = await LocalSource.shopLogin(data);
    return response.error === 0 ? response : { error: 1, status: response.status, data: response.data };
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la connexion :", err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
  }
}

async function getAllViruses() {
  try {
    const response = await LocalSource.getItems();
    if (response.error === 0) {
      console.log("[ShopService] Articles récupérés avec succès :", response.data);
    }
    return response.error === 0 ? response : { error: 1, status: response.status, data: response.data };
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la récupération des articles :", err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les articles." };
  }
}

async function getBasket(userId) {
  try {
    const response = await LocalSource.getBasket(userId);
    if (response.error === 0) {
      console.log("[ShopService] Panier récupéré avec succès :", response.data);
    }
    return response.error === 0 ? response : { error: 1, status: response.status, data: response.data };
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la récupération du panier :", err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer le panier." };
  }
}

async function addToBasket(userId, { item, quantity }) {
  console.log("[ShopService] Tentative d'ajout au panier :", item.name, "Quantité :", quantity);
  try {
    const response = await LocalSource.addToBasket(userId, { item, quantity });
    if (response.error === 0) {
      console.log(`[ShopService] Article "${item.name}" ajouté au panier avec succès. Nouvelle quantité : ${quantity}`);
    }
    return response.error === 0 ? response : { error: 1, status: response.status, data: response.data };
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de l'ajout au panier :", err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible d'ajouter l'article." };
  }
}

async function removeFromBasket(userId, itemName) {
  console.log("[ShopService] Tentative de suppression de l'article :", itemName);
  try {
    const response = await LocalSource.removeFromBasket(userId, itemName);
    if (response.error === 0) {
      console.log(`[ShopService] Article "${itemName}" supprimé avec succès.`);
    }
    return response.error === 0 ? response : { error: 1, status: response.status, data: response.data };
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors de la suppression de l'article :", err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de supprimer l'article." };
  }
}

async function clearBasket(userId) {
  console.log("[ShopService] Tentative de vidage du panier pour l'utilisateur :", userId);
  try {
    const response = await LocalSource.clearBasket(userId);
    if (response.error === 0) {
      console.log("[ShopService] Panier vidé avec succès.");
    }
    return response.error === 0 ? response : { error: 1, status: response.status, data: response.data };
  } catch (err) {
    console.error("[ShopService] Erreur réseau lors du vidage du panier :", err);
    return { error: 1, status: 500, data: "Erreur réseau, impossible de vider le panier." };
  }
}

export default {
  shopLogin,
  getAllViruses,
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
};
