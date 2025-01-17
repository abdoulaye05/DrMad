import { items, shopusers } from './data';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

function shopLogin(data) {
  if (!data.login || !data.password) {
    console.log('Aucun login/pass fourni');
    return { error: 1, status: 404, data: 'Aucun login/pass fourni' };
  }

  // Recherche d'un utilisateur par login
  let user = shopusers.find(e => e.login === data.login);
  if (!user) {
    console.log('Login/pass incorrect');
    return { error: 1, status: 404, data: 'Login/pass incorrect' };
  }

  // Vérification du mot de passe avec bcrypt.compareSync
  const isPasswordValid = bcrypt.compareSync(data.password, user.password);
  if (!isPasswordValid) {
    console.log('Login/pass incorrect');
    return { error: 1, status: 404, data: 'Login/pass incorrect' };
  }

  // Création de la session si elle n'existe pas encore
  if (!user.session) {
    console.log('Création de la session');
    user.session = uuidv4();
  }

  // Construction de l'objet utilisateur
  const u = {
    _id: user._id,
    name: user.name,
    login: user.login,
    email: user.email,
    session: user.session,
  };

  console.log('Utilisateur connecté', u);
  return { error: 0, status: 200, data: u };
}


// Récupérer tous les articles
function getAllViruses() {
  return { error: 0, data: items };
}

// Panier : Récupérer le panier de l'utilisateur
function getBasket(userId) {
  let user = shopusers.find(u => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };
  return { error: 0, status: 200, data: user.basket || { items: [] } };
}

// Panier : Ajouter un article
function addToBasket(userId, { item, quantity }) {
  let user = shopusers.find(u => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };

  if (!user.basket) user.basket = { items: [] };

  let existingItem = user.basket.items.find(i => i.item.name === item.name);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.basket.items.push({ item, quantity });
  }

  return { error: 0, status: 200, data: user.basket };
}

// Panier : Supprimer un article
function removeFromBasket(userId, itemName) {
  let user = shopusers.find(u => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };

  if (!user.basket) return { error: 1, status: 404, data: "Panier vide" };

  user.basket.items = user.basket.items.filter(i => i.item.name !== itemName);

  return { error: 0, status: 200, data: user.basket };
}

// Panier : Vider complètement
function clearBasket(userId) {
  let user = shopusers.find(u => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };

  user.basket = { items: [] };

  return { error: 0, status: 200, data: user.basket };
}

// Créer une commande
function createOrder(userId) {
  let user = shopusers.find(u => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };

  if (!user.basket || user.basket.items.length === 0) {
    return { error: 1, status: 400, data: "Panier vide" };
  }

  let total = user.basket.items.reduce((sum, { item, quantity }) => {
    let discount = item.promotion ? item.promotion.discount : 0;
    let priceAfterDiscount = item.price * (1 - discount / 100);
    return sum + priceAfterDiscount * quantity;
  }, 0);

  let order = {
    items: user.basket.items.map(({ item, quantity }) => ({
      item: { name: item.name, price: item.price },
      quantity,
    })),
    total,
    date: new Date(),
    status: "waiting_payment",
    uuid: uuidv4(),
  };

  if (!user.orders) user.orders = [];
  user.orders.push(order);

  // Vider le panier après création
  user.basket = { items: [] };

  return { error: 0, status: 200, data: { uuid: order.uuid } };
}

function finalizeOrder(userId, orderId) {
  let user = shopusers.find(u => u._id === userId);
  if (!user) return { error: 1, status: 404, data: "Utilisateur non trouvé" };

  let order = user.orders ? user.orders.find(o => o.uuid === orderId) : null;
  if (!order) return { error: 1, status: 404, data: "Commande non trouvée" };

  if (order.status === "finalized") {
    return { error: 1, status: 400, data: "Commande déjà finalisée" };
  }

  order.status = "finalized";

  return { error: 0, status: 200, data: "Commande finalisée avec succès" };
}



export default {
  shopLogin,
  getAllViruses,
  getBasket,
  addToBasket,
  removeFromBasket,
  clearBasket,
  finalizeOrder,
  createOrder,
};
