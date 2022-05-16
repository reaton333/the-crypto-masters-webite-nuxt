<template>
  <div>
    <v-row no-gutters class="pa-0 ma-0">
      <v-col> </v-col>
      <v-col>
        <CoinSearch />
      </v-col>
    </v-row>
    <v-row class="pa-0 mb-0" no-gutters>
      <v-col
        class="
          text-left
          pt-2
          pb-0
          mb-0
          font-weight-bold
          text-xl-h4 text-lg-h5 text-md-h6 text-sm-h6
          subtitle-1
        "
      >
        <CryptoMarketData :currency=currency />
      </v-col>
    </v-row>
    <v-row class="pa-0 mb-0" align="end" justify="end" no-gutters>
      <v-col
        class="
          text-left
          pt-2
          pb-0
          mb-0
          font-weight-bold
          text-xl-h4 text-lg-h5 text-md-h6 text-sm-h6
          subtitle-1
        "
      >
        Cryptocurrency Prices by Market Cap
      </v-col>
    </v-row>
    <v-row class="pt-0">
      <v-col class="pt-0">
        <div class="coinGeckoApi">
          Powered by
          <a href="#" @click="linkToNewTab('https://www.coingecko.com/en/api')"
            >CoinGecko API</a
          >
        </div>
      </v-col>
    </v-row>
    <v-data-table
      class="
        elevation-1
        font-weight-medium
        text-sm-caption-2 text-xs-caption-2
        font-xs-weight-light
      "
      :headers="headers"
      :items="coins"
      :items-per-page="pageSize"
      :mobile-breakpoint="0"
      :dense="isMobile"
      hide-default-footer
      @click:row="handleClick"
    >
      <template #[`item.name`]="{ item }">
        <v-row v-if="!isMobile">
          <v-img
            class="coinLogo"
            :src="item.image"
            :alt="item.name"
            contain
            max-width="30"
            max-height="30"
          >
          </v-img>
          <v-btn
            plain
            text
            name="goToCoinDescription"
            @click="goToCoinDescription(item.id)"
          >
            {{ item.name }} - {{ item.symbol.toUpperCase() }}
          </v-btn>
        </v-row>
        <v-row v-else no-gutters>
          <v-img
            class="coinLogo"
            :src="item.image"
            :alt="item.name"
            contain
            max-width="16"
            max-height="16"
          >
          </v-img>
          <v-btn
            plain
            text
            x-small
            name="goToCoinDescription"
            @click="goToCoinDescription(item.id)"
          >
            {{ item.symbol.toUpperCase() }}
          </v-btn>
        </v-row>
      </template>
      <template #[`item.current_price`]="{ item }">
        <span>{{ formatPrice(item.current_price) }}</span>
      </template>
      <template #[`item.price_change_percentage_24h_in_currency`]="{ item }">
        <span
          :class="
            item.price_change_percentage_24h_in_currency >= 0
              ? 'success--text'
              : 'error--text'
          "
        >
          {{ formatPercentGain(item.price_change_percentage_24h_in_currency) }}
        </span>
      </template>
      <template #[`item.price_change_percentage_7d_in_currency`]="{ item }">
        <span
          :class="
            item.price_change_percentage_7d_in_currency >= 0
              ? 'success--text'
              : 'error--text'
          "
        >
          {{ formatPercentGain(item.price_change_percentage_7d_in_currency) }}
        </span>
      </template>
      <template #[`item.price_change_percentage_30d_in_currency`]="{ item }">
        <span
          :class="
            item.price_change_percentage_30d_in_currency >= 0
              ? 'success--text'
              : 'error--text'
          "
        >
          {{ formatPercentGain(item.price_change_percentage_30d_in_currency) }}
        </span>
      </template>
      <template #[`item.market_cap`]="{ item }">
        <span>{{ formatMarketCap(item.market_cap) }}</span>
      </template>
      <template #[`item.sparkline_in_7d`]="{ item }">
        <v-sparkline
          :value="item.sparkline_in_7d.price"
          smooth="5"
          line-width="4"
          type="trend"
          :color="
            item.price_change_percentage_7d_in_currency >= 0
              ? 'success'
              : 'error'
          "
        ></v-sparkline>
      </template>
    </v-data-table>
    <Pagination :pageSize="pageSize"/>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.description,
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.title,
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: require('~/assets/imgs/coin_prices_charts.png'),
        },
        {
          hid: 'og:image:alt',
          name: 'og:image:alt',
          content: 'Coin Chart Image'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.description,
        },
        {
          hid: 'og:url',
          name: 'og:url',
          content: `${process.env.baseUrl}/crypto/1`,
        },
        { 
          hid: "twitter:card", 
          name: "twitter:card", 
          content: "summary_large_image" },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: `${process.env.baseUrl}/crypto/1`,
        },
        { 
          hid: "twitter:title", 
          name: "twitter:title", 
          content: this.title },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: this.description,
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: require('~/assets/imgs/coin_prices_charts.png'),
        },
      ],
    }
  },
  validate({ params }) {

    return /^\d+$/.test(params.page);
  },
  created() {
    
    if (process.browser) {
      window.addEventListener('resize', this.handleResize)
      this.handleResize();
    }
  },
  async asyncData({ params, $axios }) {
    // console.log(params.slug);
    const coins_api = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${params.page}&sparkline=true&price_change_percentage=24h%2C7d%2C30d`;

    try {
      const coins = await $axios.$get(coins_api);
      return { coins };
    } catch (error) {
      redirect("/error");
    }
  },
  data() {
    return {
      title: `Crypto Prices, Charts, and Rankings by Market Cap`,
      description: `Checkout crypto chart data, live prices, marketcaps, general info about the crypto market as a whole and much more!`,
      isMobile: false,
      showStats: false,
      window: {
        width: 0,
        height: 0,
      },
      headers: [
        {
          index: 0,
          type: "detail",
          text: "#",
          align: "start",
          sortable: false,
          value: "market_cap_rank",
        },
        {
          index: 1,
          type: "detail",
          text: "Coin",
          align: "start",
          value: "name",
        },
        {
          index: 2,
          type: "detail",
          text: "Price",
          align: "end",
          value: "current_price",
        },
        {
          index: 3,
          type: "change",
          text: "24h",
          align: "end",
          value: "price_change_percentage_24h_in_currency",
        },
        {
          index: 4,
          type: "change",
          text: "7d",
          align: "end",
          value: "price_change_percentage_7d_in_currency",
        },
        {
          index: 5,
          type: "change",
          text: "30d",
          align: "end",
          value: "price_change_percentage_30d_in_currency",
        },
        {
          index: 6,
          type: "detail",
          text: "Market Cap",
          align: "end",
          value: "market_cap",
        },
        {
          index: 7,
          type: "detail",
          text: "Last 7 Days",
          align: "end",
          value: "sparkline_in_7d",
        },
      ],
      // Storing the headers I remove here so I can add them back later
      // This is for mobile resizing
      removedHeaders: [],
      searchableCoinList: [],
      loading: true,
      currentSort: "market_cap",
      sortDesc: true,
      pageSize: 100,
      allCoins: [],
      currency: "usd",
      tableResize: 777,
    };
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener('resize', this.handleResize);
    }
  },
  methods: {
    goToCoinDescription(coinId) {
      this.$router.push(`/coin/${coinId}`)
    },
    formatPrice(value) {
      // Create our number formatter.
      let formatOptions = {
        minimumFractionDigits: 2,
        style: "currency",
        currency: this.currency,
      };
      // Such small floats should have a minimum significant digits visible
      if (value < 10) formatOptions.minimumFractionDigits = 3;
      if (value < 0.01) {
        formatOptions.minimumSignificantDigits = 2;
        formatOptions.maximumSignificantDigits = 2;
      }

      var formatter = new Intl.NumberFormat("en-US", formatOptions);

      return formatter.format(value);
    },
    formatPercent(value) {
      // Create our number formatter.
      var formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: this.currency,
      });

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
    formatPercentGain(value) {
      let formattedNum = parseFloat(value).toFixed(2);

      if (isNaN(formattedNum)) {
        return this.formatPrice(0.0).replace("$", "") + "%";
      } else {
        return this.formatPrice(formattedNum).replace("$", "") + "%";
      }
    },
    filterCoinAndSymbol(item, queryText) {
      return (
        item.id.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1 ||
        item.symbol.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
          -1
      );
    },
    linkToNewTab(theLink) {
      window.open(theLink, "_blank");
    },
    handleClick(value) {
      // console.log(value.id)
      this.goToCoinDescription(value.id);
    },
    async handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;

      if (this.window.width < this.tableResize && !this.isMobile) {
        this.isMobile = true;
        this.reformatCoinTable();
      } else if (this.window.width >= this.tableResize && this.isMobile) {
        this.isMobile = false;
        this.reformatCoinTable();
      }
    },
    async reformatCoinTable() {

      if (this.isMobile) {

        // Store removed items in removedHeaders array
        this.removedHeaders = this.headers.filter(function( obj ) {
          return obj.type === 'change';
        });
        this.headers = this.headers.filter(function( obj ) {
          return obj.type !== 'change';
        });

      } else { 

        // add change items to headers list
        var tempHeaders = this.headers;
        tempHeaders = tempHeaders.concat(this.removedHeaders);
        this.removedHeaders = [];

        // reorder list by id
        tempHeaders.sort((a, b) => (a.index > b.index) ? 1 : -1)

        // overwrite headers list
        this.headers = tempHeaders;
      }
    },
  },
};
</script>

<style scoped>
.coinGeckoApi {
  text-align: right;
  font-size: 14px;
}

.coinLogo {
  transition: all 0.3s ease-in-out 0s;
}

@media screen and (max-width: 775px) {
  .coinGeckoApi {
    text-align: right;
    font-size: 10px;
  }

  #coinListContainer {
    padding: 2px !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td:first-child,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > th:first-child,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > td:first-child,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > th:first-child,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td:first-child,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th:first-child {
    padding-left: 8px !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td:last-child,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > th:last-child,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > td:last-child,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > th:last-child,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td:last-child,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th:last-child {
    padding-right: 8px !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td,
  .v-data-table > .v-data-table__wrapper > table > tbody > tr > th,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > td,
  .v-data-table > .v-data-table__wrapper > table > thead > tr > th,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td,
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > th {
    padding: 0 8px !important;
  }

  .v-data-table > .v-data-table__wrapper > table > thead > tr > th {
    padding: 2px !important;
    font-size: 12px !important;
  }

  .v-btn:not(.v-btn--round).v-size--x-small {
    padding: 2px !important;
  }

  .v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
    padding: 2px !important;
    font-size: 12px !important;
  }
}

.coinLogo:hover {
  cursor: default;
  -webkit-transform-origin: 50% 50%;
  -moz-transform-origin: 50% 50%;
  -o-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
  transform: rotate(360deg);
  transition: all 0.3s ease-in-out 0s;
}
</style>
