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

// Retourne les articles disponibles avec leurs promotions optimisées
function getItems() {
    console.log("[Controller] Récupération des articles disponibles.");
    const itemsWithPromotions = items.map((item) => {
        const bestPromotion = item.promotion?.reduce((best, promo) => {
            return promo.discount > (best?.discount || 0) ? promo : best;
        }, null);

        return {
            ...item,
            promotion: bestPromotion,
        };
    });

    console.log("[Controller] Articles récupérés :", itemsWithPromotions);
    return {error: 0, status: 200, data: itemsWithPromotions};
}

// Retourne le panier d'un utilisateur
function getBasket(userId) {
    console.log(`[Controller] Récupération du panier pour l'utilisateur : ${userId}`);
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!user.basket) {
        user.basket = {items: []};
    }

    console.log("[Controller] Panier récupéré avec succès :", user.basket);
    return {error: 0, status: 200, data: user.basket};
}

// Ajoute un article au panier
function addToBasket(userId, {item, quantity}) {
    console.log(`[Controller] Ajout au panier pour l'utilisateur : ${userId}`);
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!item || typeof item.name !== "string" || typeof item.price !== "number" || quantity <= 0) {
        console.error("[Controller] Données invalides pour l'article :", {item, quantity});
        return {error: 1, status: 400, data: "Données invalides pour l'article."};
    }

    if (!user.basket) user.basket = {items: []};

    const existingItem = user.basket.items.find((i) => i.item.name === item.name);
    if (existingItem) {
        existingItem.quantity += quantity;
        console.log(`[Controller] Quantité mise à jour pour l'article : ${item.name}`);
    } else {
        user.basket.items.push({item, quantity});
        console.log(`[Controller] Article ajouté au panier : ${item.name}`);
    }

    return {error: 0, status: 200, data: user.basket};
}

// Supprime un article du panier
function removeFromBasket(userId, itemName) {
    console.log(`[Controller] Suppression de l'article "${itemName}" du panier.`);
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const itemIndex = user.basket.items.findIndex((i) => i.item.name === itemName);
    if (itemIndex === -1) {
        console.warn("[Controller] Article non trouvé dans le panier :", itemName);
        return {error: 1, status: 404, data: "Article non trouvé dans le panier."};
    }

    user.basket.items.splice(itemIndex, 1);
    console.log(`[Controller] Article supprimé avec succès : ${itemName}`);
    return {error: 0, status: 200, data: user.basket};
}

// Vide le panier
function clearBasket(userId) {
    console.log(`[Controller] Vidage du panier pour l'utilisateur : ${userId}`);
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    user.basket.items = [];
    console.log("[Controller] Panier vidé avec succès.");
    return {error: 0, status: 200, data: user.basket};
}

// Crée une commande
function createOrder(userId) {
    console.log(`[Controller] Tentative de création d'une commande pour l'utilisateur : ${userId}`);
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!user.basket || user.basket.items.length === 0) {
        console.error("[Controller] Le panier est vide.");
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

    console.log("[Controller] Commande créée avec succès :", order);

    user.basket.items = [];
    console.log("[Controller] Panier vidé après création de la commande.");

    return {error: 0, status: 200, data: {uuid: order.uuid}};
}

// Finalise une commande
function payOrder({orderUuid, transactionAmount}) {
    console.log(`[Controller] Tentative de paiement pour la commande UUID : ${orderUuid}`);
    const user = shopusers.find((u) => u.orders.some((order) => order.uuid === orderUuid));
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const order = user.orders.find((o) => o.uuid === orderUuid);
    if (!order) {
        console.error("[Controller] Commande introuvable !");
        return {error: 1, status: 404, data: "Commande introuvable."};
    }

    if (order.status !== "waiting_payment") {
        console.warn("[Controller] Commande déjà payée ou annulée.");
        return {error: 1, status: 400, data: "Commande déjà payée ou annulée."};
    }

    if (transactionAmount !== order.total) {
        console.error("[Controller] Montant payé incorrect !");
        return {error: 1, status: 400, data: "Montant payé incorrect."};
    }

    order.status = "finalized";
    console.log("[Controller] Commande payée avec succès :", order);
    return {error: 0, status: 200, data: order};
}

// Annule une commande
function cancelOrder(uuid) {
    console.log(`[Controller] Annulation de la commande UUID : ${uuid}`);
    const user = shopusers.find((u) => u.orders.some((order) => order.uuid === uuid));
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const order = user.orders.find((o) => o.uuid === uuid);
    if (!order) {
        console.error("[Controller] Commande introuvable !");
        return {error: 1, status: 404, data: "Commande introuvable."};
    }

    if (order.status !== "waiting_payment") {
        console.warn("[Controller] Commande déjà finalisée ou annulée.");
        return {error: 1, status: 400, data: "Commande déjà finalisée ou annulée."};
    }

    order.status = "cancelled";
    console.log("[Controller] Commande annulée avec succès :", order);
    return {error: 0, status: 200, data: order};
}

// Retourne les commandes d'un utilisateur
function getOrders(userId) {
    console.log(`[Controller] Récupération des commandes pour l'utilisateur : ${userId}`);
    const user = shopusers.find((u) => u._id === userId);
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    if (!user.orders) {
        console.warn("[Controller] Aucune commande trouvée pour l'utilisateur.");
        user.orders = [];
    }

    console.log("[Controller] Commandes récupérées :", user.orders);
    return {error: 0, status: 200, data: user.orders};
}

// Retourne une commande spécifique par UUID
function getOrder(uuid) {
    console.log(`[Controller] Récupération de la commande UUID : ${uuid}`);
    const user = shopusers.find((u) => u.orders.some((order) => order.uuid === uuid));
    if (!user) {
        console.error("[Controller] Utilisateur introuvable !");
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }

    const order = user.orders.find((o) => o.uuid === uuid);
    if (!order) {
        console.error("[Controller] Commande introuvable !");
        return {error: 1, status: 404, data: "Commande introuvable."};
    }

    console.log("[Controller] Commande récupérée avec succès :", order);
    return {error: 0, status: 200, data: order};
}

// Retourne le montant d'un compte bancaire
function getAccountAmount(number) {
    if (!number) return {error: 1, status: 404, data: "empty number"};
    console.log("[Controller] - Requête pour le compte :", number);
    let account = bankaccounts.find((e) => e.number === number);
    if (!account) {
        console.error("[Controller] - Compte non trouvé !");
        return {error: 1, status: 404, data: "compte inconnu"};
    }
    console.log("[Controller] - Compte trouvé :", JSON.stringify(account, null, 2));
    return {error: 0, data: account.amount};
}

// Retourne les transactions d'un compte bancaire
function getTransactions(number) {
    if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
    console.log("[Controller] - number :", number)
    let account = bankaccounts.find(a => a.number === number)
    console.log("[Controller] - compte trouvé :", JSON.stringify(account, null, 2))
    if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
    // Récupérer les transactions pour cet ID de compte
    let trans = transactions.filter(t => t.account.toString() === account._id.toString());
    console.log("[Controller] - transactions trouvées :", JSON.stringify(trans, null, 2))
    return {error: 0, status: 200, data: trans}
}

// Crée un retrait
function createWithdrawal(id_account, amount) {
    console.log("create withdrawal");
    if (amount === "" || amount === undefined) return {error: 1, status: 404, data: 'montant vide'};
    const account = bankaccounts.find(e => e._id === id_account);
    if (!account) return {error: 1, status: 404, data: 'compte inexistant'};
    if (account.amount < amount || account.amount < amount) return {error: 1, status: 404, data: 'solde insuffisant'};
    const transaction = {
        _id: uuidv4(),
        amount: -amount,
        account: id_account,
        date: new Date(),
        uuid: uuidv4(),
    }
    console.log(transaction);
    account.transactions.push(transaction);
    account.amount -= amount;
    return {error: 0, status: 200, data: {uuid: transaction.uuid, amount: account.amount}};

}

// Crée un paiement
function createPaiement(id_account, amount, destination) {
    console.log("create paiement");
    const account = bankaccounts.find(e => e._id === id_account);
    const destination_account = bankaccounts.find(e => e._id === destination);
    if (!account) return {error: 1, status: 404, data: 'compte invalide'};
    if (!destination_account) return {error: 1, status: 404, data: 'compte de destination invalide'};
    if (amount <= 0 || account.amount < amount) return {
        error: 1,
        status: 404,
        data: 'montant invalide ou solde insuffisant'
    };
    const transaction = {
        _id: uuidv4(),
        amount: -amount,
        account: id_account,
        destination: destination,
        date: {"$date": new Date().toISOString()},
        uuid: uuidv4(),
    }
    console.log(transaction);
    account.transactions.push(transaction);
    account.amount -= amount;
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
    createWithdrawal,
    createPaiement
};
