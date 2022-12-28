<script lang="ts">
    import confetti from "https://esm.sh/canvas-confetti@1.6.0"
    import { saying } from "./test.js"

    function runConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
    }
</script>

<p>{saying}</p>

<button on:click={runConfetti}>Click me</button>