import { items, shopusers } from "./data";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

function shopLogin(data) {
  console.log("[Controller] Tentative de login avec :", data);

  if (!data.login || !data.password) {
    console.error("[Controller] Aucun login/mot de passe fourni");
    return { error: 1, status: 400, data: "Login et mot de passe requis" };
  }

  const user = shopusers.find((e) => e.login === data.login);
  if (!user) {
    console.error("[Controller] Login non trouvé :", data.login);
    return { error: 1, status: 404, data: "Login ou mot de passe incorrect" };
  }

  const isPasswordValid = bcrypt.compareSync(data.password, user.password);
  if (!isPasswordValid) {
    console.error("[Controller] Mot de passe incorrect pour l'utilisateur :", data.login);
    return { error: 1, status: 403, data: "Login ou mot de passe incorrect" };
  }

  if (!user.session) {
    user.session = uuidv4();
    console.log("[Controller] Session créée pour l'utilisateur :", user.login);
  }

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session,
  };

  console.log("[Controller] Connexion réussie pour :", sanitizedUser);
  return { error: 0, status: 200, data: sanitizedUser };
}

function getItems() {
  console.log("[Controller] Récupération des articles disponibles :", items);
  const itemsWithPromotions = items.map((item) => {
    const bestPromotion = item.promotion?.reduce((best, promo) => {
      return promo.discount > (best?.discount || 0) ? promo : best;
    }, null);

    return {
      ...item,
      promotion: bestPromotion,
    };
  });

  return { error: 0, status: 200, data: itemsWithPromotions };
}

function getBasket(userId) {
  console.log("[Controller] Tentative de récupération du panier pour userId :", userId);

  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    console.error("[Controller] Utilisateur non trouvé pour userId :", userId);
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  if (!user.basket) {
    user.basket = { items: [] };
    console.log("[Controller] Panier initialisé pour l'utilisateur :", user.login);
  }

  const basket = user.basket;
  console.log("[Controller] Panier récupéré pour user :", user.login, basket);
  return { error: 0, status: 200, data: basket };
}

function addToBasket(userId, { item, quantity }) {
  console.log("[Controller] Tentative d'ajout au panier pour userId :", userId);

  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    console.error("[Controller] Utilisateur non trouvé :", userId);
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  if (!item || typeof item.name !== "string" || typeof item.price !== "number" || quantity <= 0) {
    console.error("[Controller] Données invalides pour l'article :", { item, quantity });
    return { error: 1, status: 400, data: "Données invalides pour l'article" };
  }

  if (!user.basket) user.basket = { items: [] };

  const existingItem = user.basket.items.find((i) => i.item.name === item.name);
  if (existingItem) {
    existingItem.quantity += quantity;
    console.log("[Controller] Quantité mise à jour pour :", item.name, "Nouvelle quantité :", existingItem.quantity);
  } else {
    user.basket.items.push({ item, quantity });
    console.log("[Controller] Nouvel article ajouté :", item.name);
  }

  console.log("[Controller] Panier actuel pour userId :", userId, user.basket.items);
  return { error: 0, status: 200, data: user.basket };
}

function removeFromBasket(userId, itemName) {
  console.log("[Controller] Tentative de suppression de l'article :", itemName, "pour userId :", userId);

  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    console.error("[Controller] Utilisateur non trouvé :", userId);
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  if (!user.basket || !user.basket.items) {
    console.error("[Controller] Panier introuvable ou vide pour l'utilisateur :", user.login);
    return { error: 1, status: 400, data: "Panier vide ou introuvable" };
  }

  const itemIndex = user.basket.items.findIndex((i) => i.item.name === itemName);
  if (itemIndex === -1) {
    console.error("[Controller] Article non trouvé dans le panier :", itemName);
    return { error: 1, status: 404, data: "Article non trouvé dans le panier" };
  }

  user.basket.items.splice(itemIndex, 1);
  console.log("[Controller] Article supprimé avec succès :", itemName);
  return { error: 0, status: 200, data: user.basket };
}

function clearBasket(userId) {
  console.log("[Controller] Tentative de vidage du panier pour userId :", userId);

  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    console.error("[Controller] Utilisateur non trouvé :", userId);
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  user.basket.items = [];
  console.log("[Controller] Panier vidé avec succès pour l'utilisateur :", user.login);
  return { error: 0, status: 200, data: user.basket };
}

export default {
  shopLogin,
  getItems,
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
};
