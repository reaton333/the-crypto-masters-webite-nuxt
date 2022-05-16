<template>   
  <v-card
    max-width="344"
    class="primary blog_card d-flex flex-column"
    align="left"
    dark
  >
    <v-img
      class="mt-2"
      contain
      :src="postdata.data.blog_img.url"
      :alt="postdata.data.blog_img.alt"
      lazy-src="url('assets/crypo_masters_logoIcon_withBg.png)"
      height="250px"
    ></v-img>
    <v-card-title class="font-weight-bold">
      {{ postdata.data.blog_title[0].text }}
    </v-card-title>
    <v-card-text class="flex">
      {{ postdata.data.release_date }}
    </v-card-text>
    <v-card-text>
      <v-chip
          v-for="(tag, idx) in postdata.tags"
          :key="idx"
          color="secondary"
          text-color="primary"
          pill
          light
          class="mr-1 mb-1 font-weight-bold"
      >
          {{ tag }}
      </v-chip>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="goToBlog(postdata.uid)"
        color="secondary"
        text
        class="font-weight-bold"
        name="goToBlog"
      >
        Go to Blog
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
 
<script> 
export default {
  props: {
    postdata: {
      type: Object,
      default: null
    },
    imgsize: {
      type: String,
      default: '100vw'
    }
  },
  methods: {
    goToBlog(blogId){
        this.$router.push(`/blog/${blogId}`)
    },
  }
}
</script>