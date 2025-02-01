<template>
  <v-container class="bank-container">
    <v-row>
      <v-col cols="2" v-if="hasActiveBankAccount">
        <VerticalMenu :items="menuItems" @menu-click="setCurrentView" />
      </v-col>

      <v-col :cols="hasActiveBankAccount ? 10 : 12">
        <v-btn v-if="hasActiveBankAccount" color="red" class="mb-3" @click="logout">
          <v-icon left>mdi-logout</v-icon> Déconnexion
        </v-btn>

        <BankAccountLogin v-if="!hasActiveBankAccount" @account-validated="activateAccount" />

        <!-- Affichage des composants dynamiques avec passage des props -->
        <component v-if="currentView" :is="currentView" :account="currentAccount" />

        <v-card v-if="hasActiveBankAccount && !currentView" class="pa-4 account-info-card" elevation="2">
          <v-row align="center">
            <v-col>
              <h2>🏦 Bienvenue dans votre espace bancaire</h2>
              <p><strong>Numéro de compte :</strong> {{ accountNumber }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import VerticalMenu from "@/components/VerticalMenu.vue";
import BankAmount from "@/views/BankAmount.vue";
import BankTransactionList from "@/components/Bank/BankTransactionList.vue";
import BankWithdrawForm from "@/components/Bank/BankWithdrawForm.vue";
import BankAccountLogin from "@/components/Bank/BankAccountLogin.vue";

export default {
  name: "BankAccountView",
  components: {
    VerticalMenu,
    BankAmount,
    BankTransactionList,
    BankWithdrawForm,
    BankAccountLogin,
  },
  data() {
    return {
      currentView: null,
    };
  },
  computed: {
    ...mapState("bank", ["accountNumber", "accountAmount", "accountTransactions"]),
    hasActiveBankAccount() {
      return this.accountNumber !== "";
    },
    currentAccount() {
      return {
        number: this.accountNumber,
        amount: this.accountAmount,
      };
    },
    menuItems() {
      return [
        { type: "button", label: "Solde", view: "BankAmount", disabled: !this.hasActiveBankAccount },
        { type: "button", label: "Débit/Virement", view: "BankWithdrawForm", disabled: !this.hasActiveBankAccount },
        { type: "button", label: "Historique", view: "BankTransactionList", disabled: !this.hasActiveBankAccount },
      ];
    },
  },
  methods: {
    ...mapMutations("bank", ["updateAccountNumber", "clearCurrentAccount"]),
    ...mapActions("bank", ["getAccountAmount", "getAccountTransactions"]),

    async activateAccount(accountNumber) {
      console.log("✅ [BankAccountView] Événement `account-validated` reçu avec :", accountNumber);
      this.updateAccountNumber(accountNumber);
      await this.getAccountAmount(accountNumber);
      await this.getAccountTransactions(accountNumber);
      console.log("🔍 [BankAccountView] Transactions après activation du compte :", this.accountTransactions);
    },
    setCurrentView(view) {
      this.currentView = view;
    },

    logout() {
      this.clearCurrentAccount();
      this.currentView = null;
    },
  },
};
</script>
