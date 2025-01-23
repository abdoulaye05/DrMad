import ShopService from "../services/shop.service";

const state = {
    viruses: [], // Liste des articles disponibles
    shopUser: null, // Utilisateur connecté
    basket: { items: [] }, // Panier de l'utilisateur connecté
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
    addItemToBasket(state, { item, quantity }) {
        console.log("[Shop] Ajout d'un article :", item.name, "Quantité :", quantity);

        const existingItem = state.basket.items.find((i) => i.item.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity; // Ajout à la quantité existante
            console.log(`[Shop] Nouvelle quantité pour "${item.name}" : ${existingItem.quantity}`);
        } else {
            state.basket.items.push({ item, quantity }); // Ajout comme nouvel article
            console.log(`[Shop] Nouvel article ajouté : "${item.name}", Quantité : ${quantity}`);
        }
    },
    removeItemFromBasket(state, itemName) {
        console.log(`[Shop] Suppression de l'article : ${itemName}`);
        const itemIndex = state.basket.items.findIndex((i) => i.item.name === itemName);
        if (itemIndex !== -1) {
            state.basket.items.splice(itemIndex, 1); // Supprimer l'article du panier
            console.log(`[Shop] Article "${itemName}" supprimé avec succès.`);
        } else {
            console.warn(`[Shop] Article "${itemName}" introuvable dans le panier.`);
        }
    },
    clearBasket(state) {
        console.log("[Shop] Vidage du panier.");
        state.basket.items = [];
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
        console.log("[Shop] Tentative de récupération du panier pour l'utilisateur :", state.shopUser);
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
        console.log("[Shop] Tentative d'ajout au panier pour :", item.name, "Quantité :", quantity);

        if (!state.shopUser) {
            console.error("[Shop] Aucun utilisateur connecté.");
            return { error: 1, status: 401, data: "Utilisateur non connecté." };
        }

        try {
            const response = await ShopService.addToBasket(state.shopUser._id, { item, quantity });
            if (response.error === 0) {
                commit("addItemToBasket", { item, quantity });
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
        console.log("[Shop] Tentative de vidage du panier pour :", state.shopUser);
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
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
