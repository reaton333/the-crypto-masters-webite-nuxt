<template>
  <div>
    <!-- {{ rss }} -->
    <!-- <v-card>
      <v-img
        :src="require('~/assets/imgs/tcmLogo_capNoBg.png')"
        height="125"
        contain
      ></v-img>
      <v-card-title class="text-h6 text-center">
        Under Maintenance! Check back later!
      </v-card-title>
    </v-card> -->
    <v-row>
      <v-spacer>&nbsp;</v-spacer>
      <v-spacer>&nbsp;</v-spacer>
      <v-spacer>&nbsp;</v-spacer>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-card
        color="primary"
        dark
        size="50"
      >
        <div class="d-flex flex-no-wrap justify-space-between">
          <div>
            <v-card-title class="text-h5">
              Under Maintenance!
            </v-card-title>
            <v-card-subtitle>Check back later</v-card-subtitle>
          </div>

          <v-avatar
            class="ma-3"
            size="125"
            tile
          >
            <v-img contain :src="require('~/assets/imgs/tcmLogo_capNoBg.png')"></v-img>
          </v-avatar>
        </div>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import * as cheerio from 'cheerio';
export default {
  // head: {
  //   title: "Podcast Episodes",
  //   description:
  //     "Check out our latest episodes where we take a look at various crypto assets and latest crypto news.",
  //   meta: [
  //     { property: "og:type", content: "website" },
  //     { property: "og:url", content: `${this.$router.currentRoute.path}` },
  //     {
  //       property: "og:title",
  //       content: "Podcast Episodes | The Crypto Masters",
  //     },
  //     {
  //       property: "og:description",
  //       content:
  //         "Check out our latest episodes where we take a look at various crypto assets and latest crypto news.",
  //     },
  //     {
  //       property: "og:image",
  //       content: require("~/assets/imgs/meta_tag_logo_podcast.png"),
  //     },

  //     { property: "twitter:card", content: "summary_large_image" },
  //     {
  //       property: "twitter:url",
  //       content: `${this.$router.currentRoute.path}`,
  //     },
  //     {
  //       property: "twitter:title",
  //       content: "Podcast Episodes | The Crypto Masters",
  //     },
  //     {
  //       property: "twitter:description",
  //       content:
  //         "Check out our latest episodes where we take a look at various crypto assets and latest crypto news.",
  //     },
  //     {
  //       property: "twitter:image",
  //       content: require("~/assets/imgs/meta_tag_logo_podcast.png"),
  //     },
  //   ],
  // },
  data() {
    return {
      data: ''
    }
  },
  created() {
    this.parseItems(this.rss)
  },
  async asyncData({ $axios }) {
    
    const podcast_rss = `https://feed.podbean.com/theCryptoMasters/feed.xml`

    try {
      const rss = await $axios.$get(podcast_rss);
      return { rss }
    } catch (error) {
      redirect("/error");
    }
  },
  methods: {
    parseItems(podcastXML){

      const $ = cheerio.load(podcastXML, 
        {
          xmlMode: true,
          decodeEntities: true, // Decode HTML entities.
          withStartIndices: false, // Add a `startIndex` property to nodes.
          withEndIndices: false, // Add an `endIndex` property to nodes.
        })

      // console.log('How xml parser thingy:')
      // console.log($('channel').text())
      // console.log($("channel").find("title").text())

    }
  },
}
</script>

<style scoped>
/* this is for setting the max width of the search box */
.v-input {
  max-width: 800px;
}
.episode_card {
  /* overflow-y: auto;  */
  height: 520px;
  min-width: "344px";
  max-width: "345px";
}
</style>