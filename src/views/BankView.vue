<template>
  <div>
    <BankHome />
<!--
    <router-view />
-->
  </div>
</template>

<script>
import BankHome from "@/views/BankHome.vue";

export default {
  name: "BankView",
  components: {
    BankHome,
  },
};
</script>
