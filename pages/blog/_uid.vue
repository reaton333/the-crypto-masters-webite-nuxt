<template>
  <div>
        <v-row>
            <v-breadcrumbs
                :items="breadCrumbItems"
                customDivider
                divider="/"
            ></v-breadcrumbs>
        </v-row>

        <div 
            v-if="loading"
            class="pt-12"
            max-width="900px" 
            align="center"
            justify="center"
        >
            <v-skeleton-loader
                v-if="loading"                    
                max-width="950"
                min-width="300"
                type="image, article"
            ></v-skeleton-loader>
        </div>
        <div 
            v-else
        >
            <v-row 
                justify="space-around"
                align="center"
                class="pb-8"
            >
            <v-card
                class="pa-8"
                align="center"
                justify="center"
                style="max-width: 900px"
            >
                <v-row 
                    justify="space-around"
                    align="center"
                >
                    <h1
                        class="
                            text-h4 
                            text-md-h3
                            text-sm-h4
                            font-weight-bold
                            px-4 pb-2 mb-2"
                    >
                        {{ document.data.blog_title[0].text }}
                    </h1>
                </v-row>
                <v-row>
                    <v-chip
                        v-for="(tag, idx) in document.tags"
                        :key="idx"
                        color="secondary"
                        text-color="primary"
                        pill
                        light
                        class="mx-1 mb-1 font-weight-bold"
                    >
                        {{ tag }}
                    </v-chip>
                </v-row>
                <v-row>
                    <v-col md="4">
                        <v-card
                            class="py-2"
                            flat
                        >
                            <p
                                style="float: left;"
                            >
                                {{ blogReleaseDate }}
                            </p>
                        </v-card>
                    </v-col>
                    <v-col
                        md="4"
                        offset-md="4"
                    >
                        <v-card
                            class="py-2"
                            flat
                        >
                            <p
                                style="float: right;"
                            >
                                {{ readTime }} {{ READ_TIME_TEXT }}
                            </p>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row 
                    justify="space-around"
                    align="center"
                >
                    <v-img 
                        align="center"
                        class="blogImage"
                        justify="space-around"
                        contain
                        height="400"
                        :src="document.data.blog_img.url" 
                        :alt="document.data.blog_img.alt"
                    ></v-img>
                </v-row>
                <!-- Loop through slices from prismic CM and produce cooresponding data -->
                <v-row
                    v-for="(item, idx) in document.data.body"
                    :key="idx"
                    justify="space-around"
                    align="center"
                    class="py-8"
                    style="max-width: 750px"
                >
                    <div
                        v-if="item.slice_type == 'text'"
                    >
                        <prismic-rich-text
                            :field="item.primary.text"
                            align="left"
                            max-width="640px"
                        />
                        <hr v-if="idx != (document.data.body.length - 1)">
                    </div>
                    <div
                        v-if="item.slice_type == 'youtube_link'"
                        v-html="item.primary.youtube_video_link.html"
                    >
                    </div>
                    <v-row 
                        v-if="item.slice_type == 'image'"
                        justify="space-around"
                    >
                        <v-img
                            align="center"
                            class="blogImage"
                            contain
                            max-height="700"
                            max-width="700"
                            :src="item.primary.image.url" 
                            :alt="item.primary.image.alt"
                        ></v-img>
                    </v-row>
                    <v-card
                        v-if="item.slice_type == 'quote'"
                        class="mx-auto px-auto"
                        color="#eee"
                        max-width="700"
                    >
                        <v-card-text 
                            class="
                                text-h5 
                                text-md-h4
                                text-sm-h5
                                font-weight-bold
                            "
                        >
                            "{{ item.primary.quote[0].text }}"
                        </v-card-text>

                        <v-card-actions>
                            <v-list-item class="grow">

                            <v-list-item-content>
                                <v-list-item-title
                                    class="
                                        subtitle-2
                                        text-md-subtitle-1
                                        text-sm-subtitle-2
                                        text-xs-body-1
                                    "
                                >
                                    - {{ item.primary.quote_author[0].text }}
                                </v-list-item-title>
                            </v-list-item-content>
                            </v-list-item>
                        </v-card-actions>
                    </v-card>
                </v-row>                
            </v-card>
            </v-row> 
        </div>
    </div>
</template>

<script>
export default {
    head() {
        return {
            title: this.document.data.blog_title[0].text,
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content: this.document.data.meta_description[0].text,
                },
                {
                    hid: 'og:title',
                    name: 'og:title',
                    content: this.document.data.blog_title[0].text,
                },
                {
                    hid: 'og:image',
                    name: 'og:image',
                    content: this.document.data.blog_img.url,
                },
                {
                    hid: 'og:image:alt',
                    name: 'og:image:alt',
                    content: this.document.data.blog_img.alt
                },
                {
                    hid: 'og:description',
                    name: 'og:description',
                    content: this.document.data.meta_description[0].text,
                },
                {
                    hid: 'og:url',
                    name: 'og:url',
                    content: `${process.env.baseUrl}${this.$route.path}`,
                },
                { 
                hid: "twitter:card", 
                name: "twitter:card", 
                content: "summary_large_image" },
                {
                hid: "twitter:url",
                name: "twitter:url",
                content: `${process.env.baseUrl}${this.$router.currentRoute.path}`,
                },
                { 
                hid: "twitter:title", 
                name: "twitter:title", 
                content: this.document.data.blog_title[0].text },
                {
                hid: "twitter:description",
                name: "twitter:description",
                content: this.document.data.meta_description[0].text,
                },
                {
                hid: "twitter:image",
                name: "twitter:image",
                content: this.document.data.blog_img.url,
                },
            ],
        }
    },
    data () {
        return {
            loading: false,
            prismicPageType: 'blog-article',
            READ_TIME_TEXT: ' MIN READ',
            readTime: 0,
            breadCrumbItems: [
                {
                    text: 'Back to Blogs',
                    disabled: false,
                    href: '/blog',
                },
            ],
        }
    },
    created(){
        this.setReadTime(this.document.data.body)

        const theDate = new Date(this.document.data.release_date)
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        this.blogReleaseDate = theDate.toLocaleDateString('en-us', options)
    },
    async asyncData({ $prismic, params, error }) {
        const document = await $prismic.api.getByUID("blog-article", params.uid)
        if (document) {
            return { document }
        } else {
            error({ statusCode: 404, message: "Page not found" })
        }
    },
    methods: {
        async setReadTime(blogDataBody) {
            const blogText = blogDataBody.filter(body => body.slice_type === 'text')

            // console.log(blogText)
            let totalBlogText = ''
            let averageWordsPerMinute = 250

            for(let i = 0; i < blogText.length; i++) {
                let currBlogText = blogText[i]

                let blogTextArr = currBlogText.primary.text
                for(let j = 0; j < blogTextArr.length; j++) {
                    totalBlogText += blogTextArr[j].text
                }
            }
            // console.log(totalBlogText)
            this.readTime =  Math.ceil(totalBlogText.split(/\s+/).length / averageWordsPerMinute)
        },
    },
}
</script>
<style scoped>
@media screen and (min-width: 981px) {
    iframe {
        width: 900px !important;
        height: 508px !important;
    }  
} 

@media screen and (max-width: 980px) {
    iframe {
        width: 600px !important;
        height: 339px !important;
    }  
}

@media screen and (max-width: 900px) {
    iframe {
        width: 450px  !important; 
        height: 253px !important;
    }
    .blogImage {
        width: 301px !important; 
        height: 301px !important;
    }
}

@media screen and (max-width: 500px) {
    iframe {
        width: 300px !important; 
        height: 169px !important;
    }
    .blogImage {
        width: 201px !important; 
        height: 201px !important;
    }
}

.episode-div {
    background-color: white;
}
</style>