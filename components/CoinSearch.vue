<template>
    <v-autocomplete
        style="max-width: 400px; margin-left: auto; margin-right: 0;"
        :items="coins"
        solo
        filled
        :allow-overflow="false"
        :filter="filterCoinAndSymbol"
        item-text="name"
        item-value="id"
        no-data-text="No coins match search"
        auto-select-first
        dense
        label="Search"
        @input="goToCoinDescription"
    >
        <template 
            v-slot:item="data"
        >
            <v-list-item-content>
                <v-list-item-title>
                    #{{ data.item.market_cap_rank }} &nbsp; {{ data.item.name }}
                </v-list-item-title>
                <v-list-item-subtitle v-text="data.item.symbol"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-avatar>
                <v-img 
                :src="data.item.thumb"
                :alt="data.item.name"
                max-height="24"
                max-width="24"
                >
                </v-img>
            </v-list-item-avatar>
        </template>
    </v-autocomplete>
</template>

<script>

export default {
    name: 'CoinSearch',
    props: {},
    data () {
        return {
            search: null,
            model: null,
            coins: [],
            listLoading: false,
            noMatchedSearch: 'No match for your search',
            minSearchLength: 2
        }
    },
    created(){},
    async fetch() {
        const api = `https://api.coingecko.com/api/v3/search?local=en`;
        const response = await fetch(
            api
        ).then(res => res.json())

        this.coins = response.coins
    },
    methods: {
        goToCoinDescription(coinId) {
            this.$router.push(`/coin/${coinId}`)
        },
        filterCoinAndSymbol(item, queryText, itemText) {
            return (
                item.id.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) >
                    -1 ||
                item.symbol.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
            );
        }
    },
}
</script>

<style>
</style>