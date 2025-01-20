<template>
  <v-container fluid>
    // NavBar component with title and items props and is-logged-in computed property
    <NavBar
      :title="`Compte Bancaire ${$store.state.bank.accountNumber}`"
      :items="navLinks"
      :is-logged-in="isLoggedIn"
      @logout="logout"
    />
    <v-row>
      <!-- Menu vertical -->
      <v-col cols="3">
        <VerticalMenu :items="menuItems">
          <template #menu-title="{ label }">
            <h3 style="font-weight: bold; text-decoration: underline;">{{ label }}</h3>
          </template>
        </VerticalMenu>
      </v-col>

      <!-- Contenu principal -->
      <v-col cols="9">
        <router-view name="bankmain" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import VerticalMenu from "@/components/VerticalMenu.vue";
import BankAmount from "@/views/BankAmount.vue";
import BankOperation from "@/views/BankOperation.vue";

export default {
  name: "BankView",
  components: { NavBar, VerticalMenu },
  data() {
    return {
      menuItems: [
        { type: "title", label: "Opérations" },
        { type: "link", label: "Solde", to: BankAmount },
        { type: "link", label: "Débit/Virement", to: BankOperation },
        { type: "title", label: "États" },
        { type: "link", label: "Historique", to: { name: "bankhistory"} },
      ],
    };
  },
};
</script>
