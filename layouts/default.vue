<template>
  <v-app>
    <NavBar></NavBar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {};
  },
};
</script>
<style>
div[data-app="true"] {
  background: url("~/assets/imgs/crypto_shattered.png") center center fixed !important;
  background-size: cover;
}
</style>
