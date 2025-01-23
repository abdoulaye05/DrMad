import { items, shopusers } from "./data";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

function shopLogin(data) {
  if (!data.login || !data.password) {
    return { error: 1, status: 400, data: "Login et mot de passe requis" };
  }

  const user = shopusers.find((e) => e.login === data.login);
  if (!user || !bcrypt.compareSync(data.password, user.password)) {
    return { error: 1, status: 403, data: "Login ou mot de passe incorrect" };
  }

  if (!user.session) {
    user.session = uuidv4();
  }

  const sanitizedUser = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session,
  };

  return { error: 0, status: 200, data: sanitizedUser };
}

function getItems() {
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
  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  if (!user.basket) {
    user.basket = { items: [] };
  }

  return { error: 0, status: 200, data: user.basket };
}

function addToBasket(userId, { item, quantity }) {
  console.log("[LocalSource] Tentative d'ajout au panier :", item.name, "Quantité :", quantity);

  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    console.error("[LocalSource] Utilisateur non trouvé :", userId);
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  if (!item || typeof item.name !== "string" || typeof item.price !== "number" || quantity <= 0) {
    console.error("[LocalSource] Données invalides pour l'article :", item);
    return { error: 1, status: 400, data: "Données invalides pour l'article" };
  }

  if (!user.basket) user.basket = { items: [] };

  const existingItem = user.basket.items.find((i) => i.item.name === item.name);
  if (existingItem) {
    existingItem.quantity += quantity;
    console.log(`[LocalSource] Nouvelle quantité pour "${item.name}" : ${existingItem.quantity}`);
  } else {
    user.basket.items.push({ item, quantity });
    console.log(`[LocalSource] Nouvel article ajouté au panier : "${item.name}", Quantité : ${quantity}`);
  }

  return { error: 0, status: 200, data: user.basket };
}

function removeFromBasket(userId, itemName) {
  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  const itemIndex = user.basket.items.findIndex((i) => i.item.name === itemName);
  if (itemIndex === -1) {
    return { error: 1, status: 404, data: "Article non trouvé dans le panier" };
  }

  user.basket.items.splice(itemIndex, 1);
  return { error: 0, status: 200, data: user.basket };
}

function clearBasket(userId) {
  const user = shopusers.find((u) => u._id === userId);
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  }

  user.basket.items = [];
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
