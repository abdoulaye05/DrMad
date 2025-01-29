import ShopService from "../services/shop.service";

const state = {
    viruses: [], // Liste des articles disponibles
    shopUser: null, // Utilisateur connecté
    basket: { items: [] }, // Panier de l'utilisateur connecté
    lastOrder: null, // Dernière commande effectuée
    orders: [], // Liste des commandes de l'utilisateur
};

const mutations = {
    updateViruses(state, viruses) {
        console.log("[Shop] Mise à jour des articles :", viruses);
        state.viruses = viruses;
    },
    updateShopUser(state, user) {
        console.log("[Shop] Mise à jour de l'utilisateur :", user);
        state.shopUser = user;
    },
    updateBasket(state, basket) {
        console.log("[Shop] Mise à jour du panier :", basket);
        state.basket = basket;
    },
    updateOrders(state, orders) {
        console.log("[Shop] Mise à jour des commandes :", orders);
        state.orders = orders.map((order) => ({
            ...order,
            transactionDate: order.date?.$date || "N/A", // Gérer les cas où transactionDate est absent
        }));
    },
    addItemToBasket(state, { item, quantity }) {
        console.log("[Shop] Ajout d'un article :", item.name, "Quantité :", quantity);

        const existingItem = state.basket.items.find((i) => i.item.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
            console.log(`[Shop] Nouvelle quantité pour "${item.name}" : ${existingItem.quantity}`);
        } else {
            state.basket.items.push({ item, quantity });
            console.log(`[Shop] Nouvel article ajouté : "${item.name}", Quantité : ${quantity}`);
        }
    },
    removeItemFromBasket(state, itemName) {
        console.log(`[Shop] Suppression de l'article : ${itemName}`);
        const itemIndex = state.basket.items.findIndex((i) => i.item.name === itemName);
        if (itemIndex !== -1) {
            state.basket.items.splice(itemIndex, 1);
            console.log(`[Shop] Article "${itemName}" supprimé avec succès.`);
        } else {
            console.warn(`[Shop] Article "${itemName}" introuvable dans le panier.`);
        }
    },
    clearBasket(state) {
        console.log("[Shop] Vidage du panier.");
        state.basket.items = [];
    },
    updateLastOrder(state, order) {
        console.log("[Shop] Dernière commande mise à jour :", order);
        state.lastOrder = order;
    },
};

const actions = {
    async shopLogin({ commit }, data) {
        console.log("[Shop] Tentative de connexion avec :", data);
        try {
            const response = await ShopService.shopLogin(data);
            if (response.error === 0) {
                commit("updateShopUser", response.data);
                console.log("[Shop] Connexion réussie :", response.data);
            } else {
                console.error("[Shop] Erreur lors de la connexion :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de la connexion :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de se connecter." };
        }
    },

    async getAllViruses({ commit }) {
        console.log("[Shop] Récupération des articles disponibles...");
        try {
            const response = await ShopService.getAllViruses();
            if (response.error === 0) {
                commit("updateViruses", response.data);
                console.log("[Shop] Articles récupérés avec succès :", response.data);
            } else {
                console.error("[Shop] Erreur lors de la récupération des articles :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de la récupération des articles :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les articles." };
        }
    },

    async loadBasket({ commit, state }) {
        console.log("[Shop] Chargement du panier pour l'utilisateur :", state.shopUser);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.getBasket(state.shopUser._id);
            if (response.error === 0) {
                commit("updateBasket", response.data);
                console.log("[Shop] Panier chargé avec succès :", response.data);
            } else {
                console.error("[Shop] Erreur lors du chargement du panier :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors du chargement du panier :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer le panier." };
        }
    },

    async addToBasket({ commit, state }, { item, quantity }) {
        console.log("[Shop] Ajout d'un article :", item.name, "Quantité :", quantity);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.addToBasket(state.shopUser._id, { item, quantity });
            if (response.error === 0) {
                commit("updateBasket", response.data);
                console.log("[Shop] Article ajouté au panier :", item.name);
            } else {
                console.error("[Shop] Erreur lors de l'ajout au panier :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de l'ajout au panier :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible d'ajouter l'article." };
        }
    },

    async removeFromBasket({ commit, state }, itemName) {
        console.log("[Shop] Suppression de l'article :", itemName);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.removeFromBasket(state.shopUser._id, itemName);
            if (response.error === 0) {
                commit("removeItemFromBasket", itemName);
                console.log(`[Shop] Article "${itemName}" supprimé avec succès.`);
            } else {
                console.error(`[Shop] Erreur lors de la suppression de "${itemName}" :`, response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de la suppression de l'article :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de supprimer l'article." };
        }
    },

    async clearBasket({ commit, state }) {
        console.log("[Shop] Vidage du panier pour l'utilisateur :", state.shopUser);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.clearBasket(state.shopUser._id);
            if (response.error === 0) {
                commit("clearBasket");
                console.log("[Shop] Panier vidé avec succès.");
            } else {
                console.error("[Shop] Erreur lors du vidage du panier :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors du vidage du panier :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de vider le panier." };
        }
    },

    async createOrder({ commit, state }) {
        console.log("[Shop] Création d'une commande pour l'utilisateur :", state.shopUser);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.createOrder(state.shopUser._id);
            if (response.error === 0) {
                commit("updateLastOrder", response.data);
                console.log("[Shop] Commande créée avec succès :", response.data);
            } else {
                console.error("[Shop] Erreur lors de la création de la commande :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de la création de la commande :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de créer la commande." };
        }
    },

    async getOrders({ commit, state }) {
        console.log("[Shop] Récupération des commandes pour l'utilisateur :", state.shopUser);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.getOrders(state.shopUser._id);
            if (response.error === 0) {
                commit("updateOrders", response.data);
                console.log("[Shop] Commandes récupérées avec succès :", response.data);
            } else {
                console.error("[Shop] Erreur lors de la récupération des commandes :", response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de la récupération des commandes :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer les commandes." };
        }
    },

    async cancelOrder({ state }, uuid) {
        console.log(`[Shop] Annulation de la commande UUID : ${uuid}`);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.cancelOrder(uuid);
            if (response.error === 0) {
                console.log(`[Shop] Commande UUID "${uuid}" annulée avec succès.`);
            } else {
                console.error(`[Shop] Erreur lors de l'annulation de la commande UUID "${uuid}" :`, response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de l'annulation :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible d'annuler la commande." };
        }
    },

    async payOrder({ state }, { orderId, transactionId }) {
        console.log("[Shop] Paiement de la commande :", orderId);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.payOrder(orderId, transactionId);
            if (response.error === 0) {
                console.log(`[Shop] Commande "${orderId}" payée avec succès.`);
            } else {
                console.error(`[Shop] Erreur lors du paiement de la commande "${orderId}" :`, response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors du paiement :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de valider le paiement." };
        }
    },

    async getOrder({ state }, uuid) {
        console.log(`[Shop] Récupération de la commande UUID : ${uuid}`);
        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }
        try {
            const response = await ShopService.getOrder(uuid);
            if (response.error === 0) {
                console.log(`[Shop] Commande UUID "${uuid}" récupérée avec succès :`, response.data);
            } else {
                console.error(`[Shop] Erreur lors de la récupération de la commande UUID "${uuid}" :`, response.data);
            }
            return response;
        } catch (err) {
            console.error("[Shop] Erreur réseau lors de la récupération de la commande :", err);
            return { error: 1, status: 500, data: "Erreur réseau, impossible de récupérer la commande." };
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
