<template>
  <div>
    <v-row>
      <v-switch
        v-model="showStats"
        label="Show Crypto Market Stats"
        class="
          font-weight-bold
          text-xl-h4 text-lg-h5 text-md-h6 text-sm-h6
          subtitle-1
        "
        color="primary"
      ></v-switch>
    </v-row>
    <v-row v-if="showStats" class="pa-0">
      <v-col
        class="
          text-left
          pt-2
          font-weight-bold
          pb-0
          text-xl-h4 text-lg-h5 text-md-h6 text-sm-h6
          subtitle-1
        "
      >
        <v-card elevation="2">
          <v-card-title>{{
            this.numberWithCommas(geckoData.data.active_cryptocurrencies)
          }}</v-card-title>
          <v-card-subtitle># OF COINS</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col
        class="
          text-left
          pt-2
          font-weight-bold
          pb-6
          text-xl-h4 text-lg-h5 text-md-h6 text-sm-h6
          subtitle-1
        "
      >
        <v-card elevation="2">
          <v-card-title>
            {{
              this.formatMarketCap(geckoData.data.total_market_cap.usd)
            }}
          </v-card-title>
          <v-card-subtitle>TOTAL MARKET CAP</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col
        class="
          text-left
          pt-2
          font-weight-bold
          pb-6
          text-xl-h4 text-lg-h5 text-md-h6 text-sm-h6
          subtitle-1
        "
      >
        <v-card elevation="2">
          <v-card-title>{{
            parseFloat(geckoData.data.market_cap_percentage.btc).toFixed(1) +
            "%"
          }}</v-card-title>
          <v-card-subtitle>BITCOIN DOMINANCE</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  props: {
    currency: {
      type: String,
      require: true,
      default: 'usd',
    }
  },
  data() {
    return {
      geckoData: {},
      showStats: false,
    };
  },
  async fetch() {
    const api = `https://api.coingecko.com/api/v3/global`;
    this.geckoData = await fetch(
        api
      ).then(res => res.json())
  },
  methods: {
    numberWithCommas(x) {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
    },
    formatMarketCap(value) {
      // Create our number formatter.
      var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.currency,
        minimumFractionDigits: 0,
      });

      return formatter.format(value);
    },
  }
};
</script>

<style></style>
