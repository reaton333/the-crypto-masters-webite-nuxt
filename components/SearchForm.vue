<template>
    <form
    action="/search">
    <input
        type="search"
        name="search"
        id="search"
        placeholder="Search"
        v-model="searchinput"
        class="w-full outline-none appearance-none focus:outline-none active:outline-none"
    />
    <button
        type="submit"
        class="ml-1 text-gray-400 outline-none hover:text-black focus:outline-none active:outline-none"
    ></button>
    </form>
</template>