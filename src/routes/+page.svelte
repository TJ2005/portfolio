<script>
    import LoadingAnimator from "$lib/loadingAnimator.svelte";
    import LandingIndexAnim from "$lib/landingIndexAnim.svelte";
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    let showLoader = $state(true);
    let startMainAnimation = $state(false);

        function hideLoader(){
        showLoader = false;
        setTimeout(()=>{
            startMainAnimation = true;
        },300);
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
        <LandingIndexAnim startAnimation={startMainAnimation}/>
    </div>
{/if}

