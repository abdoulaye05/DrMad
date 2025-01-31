import BankAccountService from '../services/bankaccount.service';

const state = {
    accountNumber: '',
    accountAmount: 0,
    accountTransactions: [],
    accountNumberError: 0,
};

const mutations = {
    updateAccountAmount(state, amount) {
        state.accountAmount = amount;
    },
    updateAccountTransactions(state, transactions) {
        console.log("🔄 Transactions reçues avant mise à jour :", JSON.stringify(transactions, null, 2));
        state.accountTransactions = transactions;
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
    },
};

const actions = {
    async getAccountAmount({commit}, number) {
        console.log('get account amount');
        let response = await BankAccountService.getAccountAmount(number);
        if (response.error === 0) {
            commit('updateAccountAmount', response.data);
            commit('updateAccountNumberError', 1);
        } else {
            console.log(response.data);
            commit('updateAccountNumberError', -1);
        }
    },
    async getAccountTransactions({ commit }, number) {
        console.log('get account transactions');
        let response = await BankAccountService.getAccountTransactions(number);
        if (response.error === 0) {
            const cleanData = JSON.parse(JSON.stringify(response.data)); // ✅ Nettoyage des transactions
            console.log("✅ Transactions nettoyées avant mise à jour dans Vuex :", cleanData);
            commit('updateAccountTransactions', cleanData);
            commit('updateAccountNumberError', 1);
        } else {
            console.log(response.data);
            commit('updateAccountNumberError', -1);
        }
    },
    async resetAccountNumber({commit}) {
        commit('updateAccountNumber', '');
        commit('updateAccountAmount', 0);
        commit('updateAccountNumberError', 0);
        console.log('reset account number');
    },
    async createWithdrawal({commit}, {id_account, amount}) {
        console.log('create withdrawal');
        let response = await BankAccountService.createWithdrawal(id_account, amount);
        if (response.error === 0) {
            commit('updateAccountAmount', response.data);
            commit('updateAccountNumberError', 1);
        } else {
            console.log(response.data);
            commit('updateAccountNumberError', -1);
        }
    },
    async createPaiement({commit}, {id_account, amount, destination}) {
        console.log("[store/bank.js] createPaiement");
        try {
            let response = await BankAccountService.createPaiement(id_account, amount, destination);
            if (response.error === 0) {
                commit('updateAccountAmount', response.data); // mise à jour du solde du compte
                commit('updateAccountNumberError', 1); // mise à jour du message d'erreur
                await this.getAccountTransactions(id_account); // rechargement des transactions
            } else {
                console.log(response.data);
                commit('updateAccountNumberError', -1);
            }
            return response;
        } catch (error) {
            console.error("Erreur inattendue lors de la création du paiement :", error);
            commit('updateAccountNumberError', -1);
            return {error: 1, message: "Erreur inattendue"};
        }
    },
    logoutAccount({ commit }) {
        commit("clearCurrentAccount");
    },


};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
