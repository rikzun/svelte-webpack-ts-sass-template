<script lang="ts">
    import SvelteLogoURL from '../static/svelte_logo.png'
</script>

<template>
    <img alt="svelte logo" src={SvelteLogoURL} />
</template>

<style global lang="sass">
    @keyframes logo-rotate
        0%
            transform: rotate(0deg)
        100%
            transform: rotate(360deg)

    body
        display: flex
        align-items: center
        justify-content: center

        margin: 0
        width: 100vw
        height: 100vh

        > img
            animation: logo-rotate 5s ease-out infinite
</style>