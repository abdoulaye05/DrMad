<template>
  <v-container class="d-flex justify-center align-center" style="min-height: 100vh; background-image: url('https://source.unsplash.com/featured/?shopping'); background-size: cover; background-position: center;">
    <div v-if="showLogo" class="d-flex justify-center align-center" style="min-height: 100vh;">
      <v-img
          src="@/assets/logo1.png"
          max-width="600"
          alt="Logo"
          class="fade-in-out"
      ></v-img>
    </div>

    <div v-else class="text-center" style="width: 100%; color: white;">
      <div class="text-h2 font-weight-bold mb-5">Bienvenue sur le DrMad</div>
      <div class="d-flex justify-center w-[400px]">
        <v-btn color="primary" class="mr-2" elevation="5" style="font-size: 16px; max-width: 150px;">
          Login
        </v-btn>
        <v-btn outlined color="secondary" elevation="2" style="font-size: 16px; max-width: 150px;">
          Bank Account
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      showLogo: true,
    };
  },
  mounted() {
    setTimeout(() => {
      this.showLogo = false;
    }, 3000); // Logo disappears after 3 seconds
  },
};
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}

.fade-in-out {
  animation: fadeInOut 3s ease-in-out forwards;
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.8);
  }
}
</style>
