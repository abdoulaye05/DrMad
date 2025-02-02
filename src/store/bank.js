    import BankAccountService from '../services/bankaccount.service';

    const state = {
        accountNumber: '', // contient
        accountAmount: 0,
        accountTransactions: [],
        accountNumberError: 0,
        currentAccount: null,
    };

    const mutations = {
        updateAccountAmount(state, amount) {
            state.accountAmount = amount;
        },
        updateAccountTransactions(state, transactions) {
            state.accountTransactions = transactions;
        },
        updateAccountNumberError(state, error) {
            state.accountNumberError = error;
        },
        updateAccountNumber(state, number) {
            state.accountNumber = number
        },
        updateCurrentAccount(state, account) {
            state.currentAccount = account;
        },
    };

    const actions = {
        async getAccountAmount({commit}, number) {
            let response = await BankAccountService.getAccountAmount(number);
            if (response.error === 0) {
                commit('updateAccountAmount', response.data.amount);
                commit('updateAccountNumber', number);
                commit("updateAccountTransactions", response.data.transactions ? response.data.transactions : []);
                commit('updateAccountNumberError', 1);
            } else {
                commit('updateAccountNumberError', -1);
            }
        },
        async getAccountTransactions({ commit }, number) {
            let response = await BankAccountService.getAccountTransactions(number);
            if (response.error === 0) {
                commit("updateAccountTransactions", response.data.transactions);
                commit("updateAccountNumberError", 1);
            } else {
                commit("updateAccountNumberError", -1);
            }
        },
        async createWithdraw({commit}, {idAccount, amount}) {
            let response = await BankAccountService.createWithdraw(idAccount, amount);
            if (response.error === 0) {
                commit('updateAccountAmount', response.data.amount);
                commit('updateAccountNumberError', 1);
                commit('updateAccountTransactions', response.data.transactions);
                return response;
            } else {
                console.log(response.data);
                commit('updateAccountNumberError', -1);
            }
        },
        async createPayement({ commit, dispatch }, { idAccount, amount, destination }) {
            try {
                let response = await BankAccountService.createPaiement({ idAccount, amount, destination });
                if (!response || response.error !== 0) {
                    console.error("❌ [store/bank.js] Erreur dans la réponse du service :", response);
                    commit('updateAccountNumberError', -1);
                    return response;
                }
                commit('updateAccountAmount', response.data.amount); // Mise à jour du solde
                commit('updateAccountNumberError', 1);
                commit('updateAccountTransactions', response.data.transactions);

                // ⚡ Recharger les transactions
                await dispatch("getAccountTransactions", idAccount);

                return response;
            } catch (error) {
                console.error("🔥 [store/bank.js] Erreur inattendue dans createPaiement :", error);
                commit('updateAccountNumberError', -1);
                return { error: 1, message: "Erreur inattendue" };
            }
        },
        async getAccount({ commit }, number) {
            try {
                const response = await BankAccountService.getAccount(number);
                if (response.error === 0) {
                    commit("updateCurrentAccount", response.data);
                } else {
                    commit("clearCurrentAccount");
                }
            } catch (error) {
                commit("clearCurrentAccount");
            }
        },
        logoutAccount({ commit }) {
            commit("clearCurrentAccount");
            commit("updateAccountTransactions", []);
        },

    };

    export default {
        namespaced: true,
        state,
        mutations,
        actions,
    };
