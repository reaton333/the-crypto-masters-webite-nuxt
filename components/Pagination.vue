<template>
<div>
    <p v-if="$fetchState.pending">Fetching coins...</p>
    <p v-else-if="$fetchState.error">An error occurred :(</p>
    <v-pagination
      v-else
      v-model="currPage"
      total-visible="8"
      :length="Math.floor(parseInt(geckoData.data.active_cryptocurrencies,10) / pageSize) + 1"
      @input="paginationRedirect"
    ></v-pagination>
</div>
</template>

<script>
export default {
  props: {
    pageSize: {
      type: Number,
      require: true,
      default: 100,
    }
  },
  data () {
    return {
        geckoData: {},
        currPage: this.$route.params.page ? parseInt(this.$route.params.page) : 1,
    }
  },
  // async fetch({ $axios }) {
  async fetch() {
    const api = `https://api.coingecko.com/api/v3/global`;
    this.geckoData = await fetch(
        api
      ).then(res => res.json())
  },
  methods: {
    paginationRedirect(page) {
      this.$router.push(`/crypto/${page}`)
    },
  }

}
</script>

<style>
</style>