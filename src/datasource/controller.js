import {bankaccounts, items, shopusers, transactions} from "./data";
import {v4 as uuidv4} from "uuid";
import bcrypt from "bcryptjs";

// - - - - - SHOP - - - - - -

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

    return {error: 0, status: 200, data: itemsWithPromotions};
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
    return {error: 0, status: 200, data: order};
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
        return {error: 1, status: 404, data: "Utilisateur introuvable."};
    }
    const order = user.orders.find((o) => o.uuid === uuid);
    if (!order) {
        return {error: 1, status: 404, data: "Commande introuvable."};
    }
    return {error: 0, status: 200, data: order};
}


// - - - - - BANK - - - - - -
function getAccountAmount(number) {
    if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
    let account = bankaccounts.find(a => a.number === number)
    if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
    return {error: 0, status: 200, data: account.amount}
}

function getAccountTransactions(number) {
    if (!number) return {error: 1, status: 404, data: 'aucun numéro de compte bancaire fourni'}
    let account = bankaccounts.find(a => a.number === number)
    if (!account) return {error: 1, status: 404, data: 'numéro de compte bancaire incorrect'}
    // récupérer les transactions grâce à l'_id du compte
    let trans = transactions.filter(t => t.account === account._id)
    return {error: 0, status: 200, data: trans}
}

function getTransactions(idAccount = null) {
    if (idAccount === "" || idAccount === undefined || idAccount === null) return {
        error: 1,
        status: 404,
        data: "Aucun compte bancaire fourni"
    };
    const account = transactions.filter((t) => t.account === idAccount || t.destination === idAccount);
    if (!account.length) return {error: 1, status: 404, data: "Aucune transaction trouvée"};
    return {error: 0, status: 200, data: account};
}

function getTransaction(uuid) {
    const transaction = transactions.find((t) => t.uuid === uuid);
    if (!transaction) {
        return null;
    }
    return transaction;
}

function getAccount(number) {
    if (number === "" || number === undefined) return {
        error: 1,
        status: 404,
        data: "Aucun numéro de compte bancaire fourni"
    };
    const account = bankaccounts.find((account) => account.number === number);
    if (!account) return {error: 1, status: 404, data: "Numéro de compte invalide"};
    account.transactions = transactions.filter((t) => t.account === account._id || t.destination === account._id);
    return {error: 0, status: 200, data: account};
}

function createWithdraw(idAccount, amount) {
    const account = bankaccounts.find((a) => a._id === idAccount);
    if (!account) return {error: 1, status: 404, data: "Compte introuvable"};
    if (amount <= 0) return {error: 1, status: 400, data: "Montant invalide"};
    if (account.amount < amount) return {error: 1, status: 400, data: "Fonds insuffisants"};

    const transaction = {
        _id: uuidv4(),
        amount: -Math.abs(amount),
        account: idAccount,
        date: {$date: new Date().toISOString()},
        uuid: uuidv4(),
    };

    account.transactions.push(transaction);
    account.amount -= amount;

    return {error: 0, status: 200, data: {uuid: transaction.uuid, amount: account.amount}};
}

function createPayment(data) {
    const sourceAccount = bankaccounts.find((a) => a._id === data.idAccount);
    const destinationAccount = bankaccounts.find((a) => a.number === data.destNumber);

    if (!sourceAccount) {
        return {error: 1, status: 404, data: "ID de compte source invalide"};
    }
    if (!destinationAccount) {
        return {error: 1, status: 404, data: "Compte destinataire inexistant"};
    }
    if (sourceAccount.amount < data.amount) {
        return {error: 1, status: 400, data: "Fonds insuffisants"};
    }
    if (data.amount <= 0) {
        return {error: 1, status: 400, data: "Montant invalide"};
    }

    // vérif transaction
    if (sourceAccount._id === destinationAccount._id) {
        return {error: 1, status: 400, data: "Impossible de faire un virement sur le même compte"};
    }
    if (!sourceAccount.transactions) sourceAccount.transactions = [];
    if (!destinationAccount.transactions) destinationAccount.transactions = [];

    const withdrawTransaction = {
        _id: uuidv4(),
        amount: -Math.abs(data.amount),
        account: data.idAccount,
        destination: destinationAccount._id,
        date: {$date: new Date().toISOString()},
        uuid: uuidv4(),
    };

    const depositTransaction = {
        _id: uuidv4(),
        amount: Math.abs(data.amount),
        account: destinationAccount._id,
        source: sourceAccount._id,
        date: {$date: new Date().toISOString()},
        uuid: uuidv4(),
    };

    sourceAccount.transactions.push(withdrawTransaction);
    destinationAccount.transactions.push(depositTransaction);
    transactions.push(withdrawTransaction, depositTransaction);

    sourceAccount.amount -= data.amount;
    destinationAccount.amount += data.amount;

    return {
        error: 0,
        status: 200,
        data: {
            withdrawTransaction: withdrawTransaction.uuid,
            depositTransaction: depositTransaction.uuid,
            newSourceAmount: sourceAccount.amount,
        },
    };
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
    getAccount,
    getAccountTransactions,
    createWithdraw,
    createPayment,
    getTransaction,
};
