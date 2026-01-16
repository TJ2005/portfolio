<script>
    import LoadingAnimator from "$lib/loadingAnimator.svelte";
    import LandingIndexAnim from "$lib/landingIndexAnim.svelte";
    import BackgroundParallax from "$lib/backgroundParallax.svelte";
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";


    let showLoader = $state(true);
    let startMainAnimation = $state(false);
    let assetsLoaded = $state(false);

    function hideLoader(){
        showLoader = false;
        setTimeout(()=>{
            startMainAnimation = true;
        },300);
    }

    onMount(()=>{
        const imagesToPreload = [
            '$/Background _ Parallax.jpg'
        ];
        Promise.all(
            imagesToPreload.map(src=>{
                return new Promise((resolve) =>{
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve();
                    img.onerror = () => {
                        console.warn(`failed to load: ${src}`);
                        resolve();
                    };
                });
            })
        ).then(() => {
            console.log('All images preloaded');
            assetsLoaded = true;
        });
    })



    setTimeout(()=> {
        hideLoader();
    }, 5000);
</script>



{#if showLoader}
    <div transition:fade={{duration:600, easing:cubicOut}}>
        <LoadingAnimator on:animationComplete={hideLoader} />
    </div>
    {:else}
    <div in:fade={{ duration: 1850 }} class="relative overflow-hidden">
        <LandingIndexAnim startAnimation={startMainAnimation}/>
        <BackgroundParallax/>
    </div>
{/if}

