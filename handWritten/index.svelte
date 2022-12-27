<script lang="ts">
    let number: number = 1
</script>

<button on:click={() => number += 1} class="btn">
    count: {number}
</button>

<style lang="less">
    @col: red;

    .btn {
        background-color: @col;
    }
</style>