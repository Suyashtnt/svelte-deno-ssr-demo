<script lang="ts">
    import Component from "./component.svelte";
    let number: number = 1
</script>

<button on:click={() => number += 1} class="btn">
    count: {number}
</button>

<Component />

<style lang="less">
    @col: red;

    .btn {
        background-color: @col;
    }
</style>