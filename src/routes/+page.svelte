<script>
    import LoadingAnimator from "$lib/loadingAnimator.svelte";
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    let showLoader = true;
    function hideLoader(){
        showLoader = false;
    }

    setTimeout(()=> {
        hideLoader();
    }, 5000);
</script>


{#if showLoader}
    <div transition:fade={{duration:300, easing:cubicOut}}>
        <LoadingAnimator on:animationComplete={hideLoader} />
    </div>
    {:else}
    <div>
        
    </div>
{/if}

