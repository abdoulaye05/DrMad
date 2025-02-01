import {bankaccounts, items, shopusers, transactions} from "./data";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcryptjs";

// Gestion de la connexion des utilisateurs
function shopLogin(data) {
    console.log("[Controller] Tentative de connexion avec :", data);

    // Vérification des données d'entrée
    if (!data.login || !data.password) {
        console.error("[Controller] Login ou mot de passe manquant.");
        return {error: 1, status: 400, data: "Login et mot de passe requis."};
    }

    // Recherche de l'utilisateur
    const user = shopusers.find((e) => e.login === data.login);
    console.log("[Controller] Utilisateur trouvé :", user);

    if (!user) {
        console.error("[Controller] Utilisateur introuvable pour le login :", data.login);
        return {error: 1, status: 403, data: "Login ou mot de passe incorrect."};
    }

    // Vérification du mot de passe
    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    console.log("[Controller] Mot de passe fourni :", data.password);
    console.log("[Controller] Mot de passe stocké :", user.password);
    console.log("[Controller] Résultat de bcrypt.compareSync :", isPasswordValid);

    if (!isPasswordValid) {
        console.error("[Controller] Mot de passe incorrect pour le login :", data.login);
        return {error: 1, status: 403, data: "Login ou mot de passe incorrect."};
    }

    // Générer une session si elle n'existe pas
    if (!user.session) {
        user.session = uuidv4();
    }

    // Préparer les données utilisateur à retourner
    const sanitizedUser = {
        _id: user._id,
        name: user.name,
        login: user.login,
        email: user.email,
        session: user.session,
        orders: user.orders || [],
    };

    console.log("[Controller] Utilisateur connecté avec succès :", sanitizedUser);
    return {error: 0, status: 200, data: sanitizedUser};
}

// Retourne les articles disponibles avec leurs promotions
function getItems() {
  const itemsWithPromotions = items.map((item) => ({
    ...item,
    promotion: Array.isArray(item.promotion) ? item.promotion : [],
  }));

  return { error: 0, status: 200, data: itemsWithPromotions };
}

// Retourne le panier d'un utilisateur
function getBasket(userId) {
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!user.basket) {
        user.basket = {items: []};
    }

    return {error: 0, status: 200, data: user.basket};
}

// Ajoute un article au panier
function addToBasket(userId, {item, quantity}) {
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!item || typeof item.name !== "string" || typeof item.price !== "number" || quantity <= 0) {
        return {error: 1, status: 400, data: "Données invalides pour l'article."};
    }

    if (!user.basket) user.basket = {items: []};

    const existingItem = user.basket.items.find((i) => i.item.name === item.name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        user.basket.items.push({item, quantity});
    }

    return {error: 0, status: 200, data: user.basket};
}

// Supprime un article du panier
function removeFromBasket(userId, itemName) {
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const itemIndex = user.basket.items.findIndex((i) => i.item.name === itemName);
    if (itemIndex === -1) {
        return {error: 1, status: 404, data: "Article non trouvé dans le panier."};
    }

    user.basket.items.splice(itemIndex, 1);
    return {error: 0, status: 200, data: user.basket};
}

// Vide le panier
function clearBasket(userId) {
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    user.basket.items = [];
    return {error: 0, status: 200, data: user.basket};
}

// Crée une commande
function createOrder(userId) {
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!user.basket || user.basket.items.length === 0) {
        return {error: 1, status: 400, data: "Le panier est vide."};
    }

    const order = {
        _id: uuidv4(),
        uuid: uuidv4(),
        userId: user._id,
        items: [...user.basket.items],
        total: user.basket.items.reduce((sum, basketItem) => {
            const price = basketItem.item.price;
            const quantity = basketItem.quantity;

            const discount = basketItem.item.promotion?.reduce((best, promo) => {
                return quantity >= promo.amount ? Math.max(best, promo.discount) : best;
            }, 0) || 0;

            return sum + price * quantity * (1 - discount / 100);
        }, 0),
        createdAt: new Date(),
        status: "waiting_payment",
    };

    if (!user.orders) user.orders = [];
    user.orders.push(order);

    user.basket.items = [];
    return {error: 0, status: 200, data: {uuid: order.uuid}};
}

// Finalise une commande
function payOrder({orderUuid, transactionAmount}) {
    const user = shopusers.find((u) => u.orders.some((order) => order.uuid === orderUuid));
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const order = user.orders.find((o) => o.uuid === orderUuid);
    if (!order) {
        return {error: 1, status: 404, data: "Commande introuvable."};
    }

    if (order.status !== "waiting_payment") {
        return {error: 1, status: 400, data: "Commande déjà payée ou annulée."};
    }

    if (transactionAmount !== order.total) {
        return {error: 1, status: 400, data: "Montant payé incorrect."};
    }

  order.status = "finalized";
  order.transactionDate = new Date();
  return { error: 0, status: 200, data: order };
}

// Annule une commande
function cancelOrder(uuid) {
    const user = shopusers.find((u) => u.orders.some((order) => order.uuid === uuid));
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const order = user.orders.find((o) => o.uuid === uuid);
    if (!order) {
        return {error: 1, status: 404, data: "Commande introuvable."};
    }

    if (order.status !== "waiting_payment") {
        return {error: 1, status: 400, data: "Commande déjà finalisée ou annulée."};
    }

    order.status = "cancelled";
    return {error: 0, status: 200, data: order};
}

// Retourne les commandes d'un utilisateur
function getOrders(userId) {
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    return {error: 0, status: 200, data: user.orders || []};
}

// Retourne une commande spécifique par UUID
function getOrder(uuid) {
  const user = shopusers.find((u) => u.orders.some((order) => order.uuid === uuid));
  if (!user) {
    return { error: 1, status: 404, data: "Utilisateur introuvable." };
  }
  const order = user.orders.find((o) => o.uuid === uuid);
  if (!order) {
    return { error: 1, status: 404, data: "Commande introuvable." };
  }
  return { error: 0, status: 200, data: order };
}

// Retourne le montant d'un compte bancaire
function getAccountAmount(number) {
    if (!number) return {error: 1, status: 404, data: "empty number"};

    console.log("🔍 [Controller] - Requête pour le compte :", number);

    let account = bankaccounts.find((e) => e.number === number);
    if (!account) {
        console.error("❌ [Controller] - Compte non trouvé !");
        return {error: 1, status: 404, data: "compte inconnu"};
    }

    // Récupération des transactions liées à ce compte
    account.transactions = transactions.filter((trans) =>
        trans.account === account._id
    );

    console.log("✅ [Controller] - Compte trouvé :", JSON.stringify(account, null, 2));
    console.log("📝 [Controller] Réponse finale envoyée :", JSON.stringify({error: 0, data: account}, null, 2));

    return {error: 0, data: account};
}

// Retourne les transactions d'un compte bancaire
function getTransactions(number) {
    console.log("controller.js - getTransactions")
    if (!number) {
        return {error: 1, status: 404, data: "Aucun numéro de compte bancaire fourni"};
    }
    console.log("🔍 [Controller] - Recherche des transactions pour le compte :", number);
    let account = bankaccounts.find(a => a.number === number);
    if (!account) {
        console.error("❌ [Controller] - Numéro de compte incorrect :", number);
        return {error: 1, status: 404, data: "Numéro de compte incorrect"};
    }
    // ✅ CORRECTION : Filtrer par `_id` et non par `number`
    let trans = transactions.filter(t => t.account === account._id || t.destination === account._id);
    console.log("✅ [Controller] - Transactions trouvées :", JSON.stringify(trans, null, 2));
    return {error: 0, status: 200, data: trans};
}

// Crée un retrait
function createWithdraw(id_account, amount) {
    console.log("💰 [Controller] Création d'un retrait pour :", id_account, "Montant :", amount);
    if (!amount || amount <= 0) {
        return {error: 1, status: 400, data: "Montant invalide"};
    }
    const account = bankaccounts.find(acc => acc._id === id_account);
    if (!account) {
        return {error: 1, status: 404, data: "Compte inexistant"};
    }
    if (account.amount < amount) {
        return {error: 1, status: 400, data: "Solde insuffisant"};
    }
    // Génération d'un UUID unique pour la transaction
    const transaction = {
        _id: uuidv4(),
        amount: -amount,
        account: id_account,
        date: {$date: new Date().toISOString()},
        uuid: uuidv4(),
    };
    console.log("🔄 [Controller] Transaction créée :", transaction);
    // Ajout de la transaction et mise à jour du solde
    transactions.push(transaction);
    account.amount -= amount;
    return {error: 0, status: 200, data: {uuid: transaction.uuid, amount: account.amount}};

}

// Crée un paiement
function createPaiement(id_account, amount, destination) {
    console.log("🟢 [Controller] createPaiement appelé avec :", {id_account, amount, destination});

    const account = bankaccounts.find(e => e._id === id_account);
    const destination_account = bankaccounts.find(e => e._id === destination);

    if (!account) {
        console.error("❌ [Controller] Compte source introuvable !");
        return {error: 1, status: 404, data: 'Compte source invalide'};
    }
    if (!destination_account) {
        console.error("❌ [Controller] Compte destination introuvable !");
        return {error: 1, status: 404, data: 'Compte de destination invalide'};
    }
    if (amount <= 0 || account.amount < amount) {
        console.error("❌ [Controller] Montant invalide ou solde insuffisant !");
        return {error: 1, status: 400, data: 'Montant invalide ou solde insuffisant'};
    }

    // Générer un UUID unique pour la transaction
    const transaction = {
        _id: uuidv4(),
        amount: -amount,
        account: id_account,
        destination: destination,
        date: {"$date": new Date().toISOString()},
        uuid: uuidv4(),
    };

    const transactionDest = {
        _id: uuidv4(),
        amount: amount, // Positif pour le compte destinataire
        account: destination,
        date: {"$date": new Date().toISOString()},
        uuid: transaction.uuid, // Même UUID pour le lien entre les deux
    };

    console.log("✅ [Controller] Transaction créée :", transaction);

    // Ajouter aux transactions globales
    transactions.push(transaction);
    transactions.push(transactionDest);

    // Mettre à jour les comptes
    console.log("💰 [Controller] Avant paiement - Solde initial :", account.amount);
    account.amount -= amount;
    destination_account.amount += amount;
    console.log("💰 [Controller] Après paiement - Nouveau solde :", account.amount);


    return {error: 0, status: 200, data: {uuid: transaction.uuid, amount: account.amount}};
}

export default {
    shopLogin,
    getItems,
    getBasket,
    addToBasket,
    removeFromBasket,
    clearBasket,
    createOrder,
    payOrder,
    cancelOrder,
    getOrders,
    getOrder,
    getAccountAmount,
    getTransactions,
    createWithdraw,
    createPaiement
}
