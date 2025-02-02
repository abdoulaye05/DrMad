<template>
  <v-container class="bank-container">
    <!-- Navigation Bar -->
    <nav>
      <NavBar>
        <template #nav-button="{ label }">
          <span v-if="label === 'Déconnexion'">
            <v-icon left>mdi-logout</v-icon>{{ label }}
          </span>
          <span v-else>{{ label }}</span>
        </template>
      </NavBar>
    </nav>

    <v-row class="bank-layout">
      <!-- Vertical Menu visible seulement si connecté -->
      <v-col v-if="isAccountConnected" cols="2">
        <VerticalMenu :items="menuItems">
          <template #menu-title="{ label }">
            <h3 class="menu-title">{{ label }}</h3>
          </template>
          <template #menu-link="{ label, to }">
            <v-btn
                block
                color="red"
                @click="navigateTo(to)"
                class="menu-button"
            >
              {{ label }}
            </v-btn>
          </template>
        </VerticalMenu>

        <!-- Bouton de déconnexion -->
        <v-btn
            v-if="isAccountConnected"
            block
            color="red"
            class="mt-3"
            @click="logout"
            :disabled="isLoggingOut"
        >
          <v-icon left>mdi-logout</v-icon> Déconnexion
          <v-progress-circular
              v-if="isLoggingOut"
              indeterminate
              size="20"
              color="white"
              class="ml-2"
          />
        </v-btn>
      </v-col>

      <!-- Contenu principal : Affiche BankHome si non connecté -->
      <v-col :cols="isAccountConnected ? 10 : 12">
        <router-view/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import VerticalMenu from "@/components/VerticalMenu.vue";
import { mapState, mapMutations } from "vuex";

export default {
  name: "BankView",
  components: {
    NavBar,
    VerticalMenu,
  },
  data() {
    return {
      isLoggingOut: false,
      menuItems: [
        { type: "title", label: "Opérations" },
        { type: "link", label: "Solde", to: "/bank/amount" },
        { type: "link", label: "Débit/Virement", to: "/bank/operation" },
        { type: "title", label: "États" },
        { type: "link", label: "Historique", to: "/bank/history" },
      ],
    };
  },
  computed: {
    ...mapState("bank", ["currentAccount"]),
    isAccountConnected() {
      return !!this.currentAccount;
    },
  },
  methods: {
    ...mapMutations("bank", ["clearCurrentAccount"]),

    navigateTo(route) {
      if (route && this.$route.path !== route) {
        this.$router.push(route).catch(err => {
          console.warn("Navigation error:", err.message);
        });
      }
    },


    logout() {
      this.isLoggingOut = true;
      setTimeout(() => {
        this.clearCurrentAccount(); // Efface les données du compte
        this.isLoggingOut = false;
        this.$router.push("/bank/home");
        window.location.reload();
      }, 1000);
    },
  },
};
</script>

<style scoped>
.bank-container {
  padding: 20px;
}

.bank-layout {
  margin-top: 20px;
}

.menu-title {
  font-weight: bold;
  text-decoration: underline;
}

.menu-button {
  margin: 5px 0;
}
</style>
