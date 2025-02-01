    import BankAccountService from '../services/bankaccount.service';

    const state = {
        accountNumber: '',
        accountAmount: 0,
        accountTransactions: [],
        accountNumberError: 0,
        paymentUUID: null,
    };

    const mutations = {
        updateAccountAmount(state, amount) {
            state.accountAmount = amount;
        },
        updateAccountTransactions(state, transactions) {
            console.log("🔄 Transactions reçues avant mise à jour :", JSON.stringify(transactions, null, 2));
            state.accountTransactions = Array.isArray(transactions) ? transactions : [];
            console.log("✅ Transactions stockées dans Vuex :", JSON.stringify(state.accountTransactions, null, 2));
        },
        updateAccountNumberError(state, error) {
            state.accountNumberError = error;
        },
        updateAccountNumber(state, number) {
            state.accountNumber = number
        },
        clearCurrentAccount(state) {
            state.accountNumber = "";
            state.accountAmount = 0;
            state.accountTransactions = [];
            state.accountNumberError = 0;
            state.paymentUUID = null;
        },
        setPaymentUUID(state, uuid) {
            state.paymentUUID = uuid;
        }
    };

    const actions = {
        async getAccountAmount({commit}, number) {
            console.log("🔍 [Vuex] Demande des infos du compte :", number);
            let response = await BankAccountService.getAccountAmount(number);
            console.log("🔍 [Vuex] pipi :", response.data.transactions);
            if (response.error === 0) {
                console.log("✅ [Vuex] Compte reçu :", response.data);
                commit('updateAccountAmount', response.data.amount);
                commit('updateAccountNumber', number);
                console.log("🔍 [Vuex] Transactions reçues avant commit :", JSON.stringify(response.data.transactions, null, 2));
                console.log("📌 [Vuex] Transactions reçues :", response.data.transactions);
                commit("updateAccountTransactions", response.data.transactions ? response.data.transactions : []);
                commit('updateAccountNumberError', 1);
                return response;
            } else {
                console.error("❌ [Vuex] Erreur récupération du compte :", response.data);
                console.log(response.data);
                commit('updateAccountNumberError', -1);
            }
        },
        async getAccountTransactions({ commit }, number) {
            console.log("🔍 [Vuex] Demande des transactions pour :", number);
            let response = await BankAccountService.getAccountTransactions(number);

            if (response.error === 0) {
                const cleanData = JSON.parse(JSON.stringify(response.data)); // ✅ Nettoyage
                commit("updateAccountTransactions", cleanData);
                console.log("✅ [Vuex] Transactions stockées :", cleanData);
                commit("updateAccountNumberError", 1);
            } else {
                console.error("❌ [Vuex] Erreur transactions :", response.data);
                commit("updateAccountNumberError", -1);
            }
        },
        async createWithdraw({commit}, {id_account, amount}) {
            console.log('create withdrawal');
            let response = await BankAccountService.createWithdraw(id_account, amount);
            if (response.error === 0) {
                commit('updateAccountAmount', response.data);
                commit('updateAccountNumberError', 1);
            } else {
                console.log(response.data);
                commit('updateAccountNumberError', -1);
            }
        },
        async createPaiement({ commit, dispatch }, { id_account, amount, destination }) {
            console.log("🟢 [store/bank.js] Début createPaiement avec :", { id_account, amount, destination });
            try {
                let response = await BankAccountService.createPaiement({ id_account, amount, destination });

                console.log("🔍 [store/bank.js] Réponse reçue de BankAccountService :", response);

                if (!response || response.error !== 0) {
                    console.error("❌ [store/bank.js] Erreur dans la réponse du service :", response);
                    commit('updateAccountNumberError', -1);
                    return response;
                }

                commit('updateAccountAmount', response.data.amount); // Mise à jour du solde
                commit('setPaymentUUID', response.data.uuid); // ✅ Stocke l’UUID pour affichage
                commit('updateAccountNumberError', 1);

                // ⚡ Recharger les transactions
                await dispatch("getAccountTransactions", id_account);

                return response;
            } catch (error) {
                console.error("🔥 [store/bank.js] Erreur inattendue dans createPaiement :", error);
                commit('updateAccountNumberError', -1);
                return { error: 1, message: "Erreur inattendue" };
            }
        }
    };

    export default {
        namespaced: true,
        state,
        mutations,
        actions,
    };
