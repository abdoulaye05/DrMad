import ShopService from '../services/shop.service';

const state = {
    viruses: [], // Liste des virus disponibles
    shopUser: null, // Utilisateur courant
    basket: { items: [] }, // Panier de l'utilisateur courant
};

const mutations = {
    updateViruses(state, viruses) {
        state.viruses = viruses;
    },
    updateShopUser(state, user) {
        state.shopUser = user;
        if (!user) {
            state.basket = { items: [] };
        }
    },
    updateBasket(state, basket) {
        state.basket = basket;
    },
    addItemToBasket(state, { item, quantity }) {
        const existingItem = state.basket.items.find((i) => i.item.name === item.name);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            state.basket.items.push({ item, quantity });
        }
    },
    removeItemFromBasket(state, index) {
        state.basket.items.splice(index, 1);
    },
    clearBasket(state) {
        state.basket.items = [];
    },
};

const actions = {
    async shopLogin({ commit }, data) {
        console.log('je rentre dans le shopLogin');
        let response = await ShopService.shopLogin(data);
        if (response.error === 0) {
            commit('updateShopUser', response.data);
        } else {
            console.log(response.data);
        }
        console.log("shopLogin réussi,", response);
        return response;
    },
    async getAllViruses({ commit }) {
        console.log('Récupération des virus');
        let response = await ShopService.getAllViruses();
        if (response.error === 0) {
            commit('updateViruses', response.data);
        } else {
            console.log(response.data);
        }
        return response;
    },
    async loadBasket({ commit }) {
        console.log('Chargement du panier');
        const response = await ShopService.getBasket();
        if (response.error === 0) {
            commit('updateBasket', response.data);
        } else {
            console.log(response.data);
        }
    },
    async addToBasket({ commit }, { item, quantity }) {
        try {
            // Vérification de la quantité
            if (!quantity || quantity <= 0) {
                console.error('La quantité doit être un nombre positif.');
                return Promise.reject('Invalid quantity');
            }

            console.log(`Ajout de l'article ${item.name} au panier avec une quantité de ${quantity}.`);

            // Appel au service pour ajouter l'article au panier
            const response = await ShopService.addToBasket(item, quantity);

            if (response.error === 0) {
                // Mise à jour du panier si l'ajout est réussi
                commit('addItemToBasket', { item, quantity });
                console.log(`Article ajouté avec succès : ${item.name} (${quantity}).`);
            } else {
                console.error('Erreur lors de l\'ajout au panier : ', response.data);
                return Promise.reject(response.data);
            }
        } catch (error) {
            // Gestion des erreurs générales (API, réseau, etc.)
            console.error('Une erreur inattendue est survenue :', error);
            return Promise.reject(error.message || 'Unknown error');
        }
    },
    async removeFromBasket({ commit }, index) {
        console.log('Suppression d\'un article du panier');
        const response = await ShopService.removeFromBasket(index);
        if (response.error === 0) {
            commit('removeItemFromBasket', index);
        } else {
            console.log(response.data);
        }
    },
    async clearBasket({ commit }) {
        console.log('Vider le panier');
        const response = await ShopService.clearBasket();
        if (response.error === 0) {
            commit('clearBasket');
        } else {
            console.log(response.data);
        }
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
