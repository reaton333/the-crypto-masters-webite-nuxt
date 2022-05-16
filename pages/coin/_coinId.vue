<template>
  <div>
    <v-row>
      <v-breadcrumbs
        :items="breadCrumbItems"
        customDivider
        divider="/"
      ></v-breadcrumbs>
    </v-row>
    <v-row no-gutters class="pa-0 ma-0">
      <v-col> </v-col>
      <v-col> </v-col>
      <v-col>
        <CoinSearch />
      </v-col>
    </v-row>
    <div v-if="loading">
      <v-skeleton-loader
        type="list-item-avatar-three-line, image, article"
      ></v-skeleton-loader>
    </div>
    <v-row v-else no-gutters>
      <v-col cols="6">
        <v-card
          elevation="0"
          color="rgb(255, 0, 0, 0)"
          class="font-weight-bold"
        >
          <v-card-title v-if="coinDetails.name">
            <v-avatar left size="50">
              <img :src="coinDetails.image.large" :alt="coinDetails.name" />
            </v-avatar>
            <span
              class="
                ml-2
                text-xl-h4 text-lg-h4 text-md-h4 text-sm-h4 text-xs-h4
                font-weight-bold
              "
            >
              {{ coinDetails.name }} ({{ coinDetails.symbol.toUpperCase() }})
            </span>
          </v-card-title>
          <v-card-text>
            <v-chip
              v-if="coinDetails.market_cap_rank"
              class="mb-2 font-weight-bold"
              color="primary"
            >
              <span> Rank </span>
              <v-avatar right class="secondary black--text">
                {{ coinDetails.market_cap_rank }}
              </v-avatar>
            </v-chip>
            <br />
            <v-chip
              v-if="coinDetails.links.homepage[0]"
              class="mb-2 font-weight-bold"
              @click="linkToNewTab(coinDetails.links.homepage[0])"
              color="primary"
            >
              Website
              <v-icon right> mdi-link-variant </v-icon>
            </v-chip>
            <br />
            <v-chip
              v-if="coinDetails.links.repos_url.github[0]"
              class="mb-2 text-subtitle-2 font-weight-bold"
              @click="linkToNewTab(coinDetails.links.repos_url.github[0])"
              color="primary"
            >
              Source Code
              <v-icon right> mdi-code-braces </v-icon>
            </v-chip>
          </v-card-text>
        </v-card>
      </v-col>
      <v-spacer v-if="!$vuetify.breakpoint.mobile"></v-spacer>
      <v-col cols="6">
        <v-card elevation="0" color="rgb(255, 0, 0, 0)">
          <v-card-text class="text-right">
            <span
              class="
                black--text
                text-xl-h4 text-lg-h4 text-md-h4 text-sm-h4 text-h6
                font-weight-bold
              "
            >
              {{ this.formatPrice(coinDetails.market_data.current_price.usd) }}
            </span>
            <span
              class="
                text-xl-h5 text-lg-h5 text-md-h5 text-sm-h6 text-subtitle-1
                font-weight-bold
              "
              :class="
                coinDetails.market_data.price_change_percentage_24h >= 0 ? 'success--text' : 'error--text'
              "
            >
              {{ formatPercentGain(coinDetails.market_data.price_change_percentage_24h) }}
            </span>
            <br />
            <br />

            <span class="font-weight-bold"> Market Cap </span>
            <p
              class="
                black--text
                text-xl-subtitle-1
                text-lg-subtitle-1
                text-md-subtitle-1
                text-sm-body-1
                text-xs-body-2
                font-weight-medium
              "
            >
              {{ this.formatMarketCap(coinDetails.market_data.market_cap.usd) }}
            </p>
            <span class="font-weight-bold"> Total Supply </span>
            <p
              v-if="coinDetails.market_data.total_supply"
              class="black--text subtitle-1 font-weight-medium"
            >
              {{ this.numberWithCommas(coinDetails.market_data.total_supply) }}
            </p>
            <p v-else class="black--text subtitle-1 font-weight-medium">∞</p>
            <span class="font-weight-bold"> Max Supply </span>
            <p
              v-if="coinDetails.market_data.max_supply"
              class="black--text subtitle-1 font-weight-medium"
            >
              {{ this.numberWithCommas(coinDetails.market_data.max_supply) }}
            </p>
            <p v-else class="black--text subtitle-1 font-weight-medium">∞</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <div align="center">
      <v-row v-if="coinDetails.description.en" class="pa-3" style="max-width: 900px">
        <v-expansion-panels accordion>
          <v-expansion-panel class="mb-12">
            <v-expansion-panel-header class="font-weight-bold">
              {{ coinDetails.name }} Overview
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p class="text-justify" v-html="coinDetails.description.en"></p>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </div>
    <v-divider></v-divider>
    <CoinChart :coinDetails=coinDetails />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.coinDetails.name} price, historical data, and more!`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Check out ${this.coinDetails.name} price, ${this.coinDetails.symbol.toUpperCase()} chart data, marketcap with ranking, general info and more`,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.coinDetails.name,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: this.coinDetails.image.large,
        },
        {
          hid: 'og:image:alt',
          name: 'og:image:alt',
          content: `${this.coinDetails.name} Image`
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: `Check out ${this.coinDetails.name} price, ${this.coinDetails.symbol.toUpperCase()} chart data, marketcap with ranking, general info and more`,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `${process.env.baseUrl}${this.$route.path}`,
        },
      ],
    }
  },
  data() {
    return {
      chartNumberSampling: 0.0,
      loading: false,
      currency: "usd",
      marketCaps: [],
      totalVolumes: [],
      firstLoad: false,
      breadCrumbItems: [
        {
          text: "Coin List",
          disabled: false,
          href: '/crypto/1',
        }
      ],
    };
  },
  async asyncData({ params, $axios }) {
    const coin_info = `https://api.coingecko.com/api/v3/coins/${params.coinId}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;

    try {
      const coinDetails = await $axios.$get(coin_info);
      return { coinDetails };
    } catch (error) {
      return {};
    }
  },
  watch: {},
  methods: {
    async formatDateForApi(theDate) {
      var theDateAsDate = new Date(
        theDate.substring(0, 4),
        theDate.substring(5, 7) - 1,
        theDate.substring(8, 10)
      );
      return (
        ("0" + theDateAsDate.getDate()).slice(-2) +
        "-" +
        ("0" + (theDateAsDate.getMonth() + 1)).slice(-2) +
        "-" +
        theDateAsDate.getFullYear()
      );
    },
    formatPrice(value) {
      let formatOptions = {
        style: "currency",
        currency: "USD",
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      };

      if (value < 0.01) {
        formatOptions.minimumSignificantDigits = 2;
        formatOptions.maximumSignificantDigits = 2;
      }
      // Create our number formatter
      var formatter = new Intl.NumberFormat("en-US", formatOptions);

      return formatter.format(value);
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
    numberWithCommas(x) {
      return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : null;
    },
    formatPercentGain(value) {
      let formattedNum = parseFloat(value).toFixed(2);

      if (isNaN(formattedNum)) {
        return this.formatPrice(0.0).replace("$", "") + "%";
      } else {
        return this.formatPrice(formattedNum).replace("$", "") + "%";
      }
    },
    linkToNewTab(theLink) {
      window.open(theLink, "_blank");
    },
  },
};
</script>

<style scoped>
</style>