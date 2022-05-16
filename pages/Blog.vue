<template>
  <div>
    <v-row
      align="center"
      justify="center"
    >
      <v-card
        elevation="0"
        color="rgb(255, 0, 0, 0)"
      >
        <v-card-title
          class="text-h3 font-weight-bold"
        >
          {{ pageTitle }}
        </v-card-title>
      </v-card>
    </v-row>
    <v-row
      v-if="posts"
      align="center"
      justify="center"
    >
      <v-col 
        align="center"
        v-for="(post, idx) in posts" 
        :key="idx"
      >
        <GridPost :postdata="post" :imgsize="'(min-width: 768px) 33vw, 90vw'" />
      </v-col>
    </v-row>
    <v-row>
      <button
        class="px-8 py-2 mx-auto text-lg text-center border-2 border-black border-solid cursor-pointer dark-mode:border-white hover:border-accent-dark"
        @click="loadMorePosts()"
        v-if="posts.length % 9 === 0 && !nonewposts"
      >
        Load more
      </button>
      <button
        v-else
        class="px-8 py-2 mx-auto text-lg text-center border-2 border-black border-solid cursor-pointer dark-mode:border-white"
      >
        You reached the bottom!
      </button>
    </v-row>
  </div>
  
</template>

<script>
export default {
  head() {
    return {
      title: "Blog",
      description: this.metaDescription,
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:url", content: `${process.env.baseUrl}${this.$router.currentRoute.path}` },
        { property: "og:title", content: "Blog | The Crypto Masters" },
        {
          property: "og:description",
          content: this.metaDescription,
        },
        {
          property: "og:image",
          content: require("~/assets/imgs/meta_tag_logo_blog.png"),
        },
        {
          hid: 'og:image:alt',
          property: 'og:image:alt',
          content: 'Crypto Blog Image'
        },
        { property: "twitter:card", content: "summary_large_image" },
        {
          hid: "twitter:url",
          property: "twitter:url",
          content: `${process.env.baseUrl}${this.$router.currentRoute.path}`,
        },
        { 
          hid: "twitter:title", 
          property: "twitter:title", 
          content: "Blog | The Crypto Masters" },
        {
          hid: "twitter:description",
          property: "twitter:description",
          content: this.metaDescription,
        },
        {
          hid: "twitter:image",
          property: "twitter:image",
          content: require("~/assets/imgs/meta_tag_logo_blog.png"),
        },
      ],
    };
  },
  data() {
    return {
      pageTitle: 'Blogs',
      nonewposts: false,
      metaDescription: "Our blog has the latest and greatest in the crypto space including coin reviews and news!"
    }

  },
  async asyncData({ $prismic, error }) {
    try {
      // Query last posts
      const posts = await $prismic.api.query(
        $prismic.predicates.at('document.type', 'blog-article'),
        {
          orderings: '[document.release_date desc]',
          pageSize: 9
        }
      )
      // Returns data to be used in template
      return {
        posts: posts.results
      }
    } catch (e) {
      // Returns error page
      error({ statusCode: 404, message: 'Page not found' })
    }
  },
  methods: {
    async loadMorePosts() {
      try {
        // Query Posts
        const posts = await this.$prismic.api.query(
          this.$prismic.predicates.at('document.type', 'post'),
          {
            orderings: '[document.first_publication_date desc]',
            pageSize: 9,
            page: this.currentpage + 1
          }
        )
 
        if (posts.results.length > 0) {
          // Merge with the other posts
          this.posts = this.posts.concat(posts.results)
        } else {
          // No more new posts
          this.nonewposts = true
        }
 
        // Save current page
        this.currentpage++
      } catch (e) {
        console.error(e)
      }
    },
  }
};
</script>

<style scoped>
/* this is for setting the max width of the search box */
.v-input {
  max-width: 800px;
}
</style>