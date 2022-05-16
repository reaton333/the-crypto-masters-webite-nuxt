<template>
  <v-container>
    <v-row justify="space-around" align="center">
      <v-col sm="7">
        <v-card class="pa-2 mt-8" color="rgb(255, 0, 0, 0)" elevation="0">
          <v-card-title
            class="
              text-left
              pb-12
              font-weight-bold
              text-xl-h3 text-lg-h3 text-md-h3 text-sm-h4 text-h4
            "
          >
            {{ catchPhrase }}
          </v-card-title>
          <v-card-subtitle
            class="
              text-left
              font-weight-medium
              text-xl-h5 text-lg-h5 text-md-h5 text-sm-h6 text-subtitle-2
            "
            elevation="0"
          >
            {{ subPhrase }}
          </v-card-subtitle>
          <v-card-actions align="left">
            <!-- <v-row
              justify="space-around"
            > -->
            <v-btn
              x-large
              color="secondary"
              dark
              class="
                text-left
                black--text
                font-weight-medium
                text-xl-body-1
                text-lg-body-1
                text-md-body-1
                text-sm-body-2
                text-body-2
              "
              name="cryptoPrices"
              @click="$router.push('/crypto/1')"
            >
              Crypto Prices
              <v-icon right light> mdi-bitcoin </v-icon>
            </v-btn>
            <v-btn
              x-large
              color="success"
              dark
              class="
                text-left
                font-weight-medium
                text-xl-body-1
                text-lg-body-1
                text-md-body-1
                text-sm-body-2
                text-body-2
              "
              name="listenNow"
              @click="$router.push('/blog/')"
            >
              Blog
              <v-icon right dark> mdi-post </v-icon>
            </v-btn>
            <!-- </v-row> -->
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col sm="4">
        <v-card class="" color="rgb(255, 0, 0, 0)" elevation="0">
          <v-img
            contain
            aspect-ratio="1"
            eager
            alt="The Crypto Masters Logo"
            :src="
              require('~/assets/imgs/crypto_masters_logo_withText_rounded.svg')
            "
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pa-12" />
    <v-row align="center" justify="space-around">
      <PodcastListenCard />
    </v-row>
    <v-spacer class="pa-12" />
    <v-row align="center" justify="center">
      <CryptoToolCard align="center" justify="space-around" max-width="1100" />
    </v-row>
    <v-spacer class="pa-12" />
    <v-row align="center" justify="center">
      <YoutubeCarousel />
    </v-row>
    <v-row class="pa-12" />
  </v-container>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Home",
  head() {
    return {
      title: this.metaTitle,
      titleTemplate: null,
      meta: [
        { 
          hid: "og:type",
          name: "og:type", 
          content: "website" 
        },
        { 
          hid: "og:url", 
          name: "og:url", 
          content: `${process.env.baseUrl}` 
        },
        { 
          hid: "og:title", 
          name: "og:title", 
          content: this.metaTitle 
        },
        {
          hid: "og:description",
          name: "og:description",
          content: "Helping You Master an Understanding of Crypto Assets",
        },
        {
          hid: "og:image",
          name: "og:image",
          content: require("~/assets/imgs/meta_tag_logo.png"),
        },
        { 
          hid: "twitter:card", 
          name: "twitter:card", 
          content: "summary_large_image" 
        },
        {
          hid: "twitter:url",
          name: "twitter:url",
          content: `${process.env.baseUrl}`,
        },
        { 
          hid: "twitter:title",
          name: "twitter:title", 
          content: this.metaTitle 
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: "Helping You Master an Understanding of Crypto Assets",
        },
        {
          hid: "twitter:image",
          name: "twitter:image",
          content: require("~/assets/imgs/meta_tag_logo.png"),
        },
      ],
    };
  },
  data() {
    return {
      metaTitle: "The Crypto Masters - Your Crypto One-Stop-Shop",
      metaLogo: require("~/assets/imgs/meta_tag_logo.png"),
      catchPhrase: "Helping You Master an Understanding of Crypto Assets",
      subPhrase:
        "We provide information about crypto assets to assist the public in making their own investment decisions",
    };
  },
  methods: {},
};
</script>

<style>
.v-card__text,
.v-card__title {
  word-break: normal !important;
}
</style>
