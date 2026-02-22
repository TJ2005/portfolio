<script>
    import LoadingAnimator from "$lib/loadingAnimator.svelte";
    import LandingIndexAnim from "$lib/landingIndexAnim.svelte";
    import ScrollParallax from "$lib/ScrollParallax.svelte";
    import ExperienceCard from "$lib/ExperienceCard.svelte";
    import { fade } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";

    // Parallax layer configuration (cursor-based)
    const parallaxLayers = [
        {
            id: 'layer-0',
            src: '/layers/Layer 0.png',
            depth: 1.0,    // Back layer - moves most
            zIndex: 1,
            alt: 'Background layer'
        },
        {
            id: 'layer-1',
            src: '/layers/Layer 1.png',
            depth: 0.7,    // Middle back
            zIndex: 2,
            alt: 'Middle back layer'
        },
        {
            id: 'layer-2',
            src: '/layers/Layer 2.png',
            depth: 0.5,    // Middle front
            zIndex: 3,
            alt: 'Middle front layer'
        },
        {
            id: 'layer-3',
            src: '/layers/Layer 3.png',
            depth: 0.3,    // Front layer - moves least
            zIndex: 4,
            alt: 'Foreground layer'
        }
    ];


    let currentSlide = $state(0);
    let activeSection = $state('home');
    let startAnimation = $state(true);
    let showLoader = $state(true);
    let startMainAnimation = $state(false);
    let assetsLoaded = $state(false);
    let snapContainer = $state(null);
    let workPhase = $state(0); // Track which phase in work section (0: title bottom, 1: title moved to top, 2+: job cards)
    
    // Experience data
    const experienceData = [
        {
            companyName: "Placeholder Name",
            jobTitle: "Lead Web Developer",
            employmentType: "Full Time",
            startYear: "2024",
            endYear: "2025",
            responsibilities: [
                "Handling Deployments",
                "Lorem Ipsum Lorets Lorem Ipsum Lorets Lorem Ipsum Lorets",
                "Managing customer requirements",
                "Design Revisions adhoc",
                "Handling Deployments",
                "Lorem Ipsum Lorets Lorem Ipsum Lorets Lorem Ipsum Lorets",
                "Managing customer requirements"
            ]
        },
        {
            companyName: "Another Company",
            jobTitle: "Senior Developer",
            employmentType: "Contract",
            startYear: "2022",
            endYear: "2024",
            responsibilities: [
                "Building scalable applications",
                "Code reviews and mentoring",
                "Architecture planning"
            ]
        }
    ];

    function hideLoader(){
        showLoader = false;
        setTimeout(()=>{
            startMainAnimation = true;
        },300);
    }

    onMount(()=>{
        const imagesToPreload = [
            '/layers/Layer 0.png',
            '/layers/Layer 1.png',
            '/layers/Layer 2.png',
            '/layers/Layer 3.png'
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

    const slides = [
        { id:'home', label:'Home',count:1},
        { id:'work', label:'Work Experience',count:2},
        { id:'education', label:'Education',count:3},
        { id:'cs-stack', label:'Computer Science Stack',count:4},
        { id:'projects', label:'Projects',count:5},
        { id:'github', label:'GitHub',count:6},
        { id: 'content-stack', label: 'Content Creation Stack', count: 7 },
        { id: 'about', label: 'About Me', count: 8 },
        { id: 'contact', label: "Let's get in Touch", count: 9 },
        { id: 'extras', label: "Extra's", count: 10 },
        { id: 'footer', label: 'Footer', count: 11 }
    ]
    
    // Track scroll and update current slide
    $effect(()=>{
        if (!snapContainer) return;
        
        function handleScroll(){
            const scrollPercentage = snapContainer.scrollTop / window.innerHeight;
            const newSlide = Math.round(scrollPercentage);
            
            console.log('Scroll detected:', { scrollTop: snapContainer.scrollTop, scrollPercentage, newSlide });
            
            // Only update if slide actually changed
            if(newSlide !== currentSlide){
                currentSlide = newSlide;
                console.log('Slide changed to:', newSlide);

                // Update active section based on slide number
                slides.forEach(element => {
                    if(element.count === currentSlide + 1){
                        activeSection = element.id;
                        console.log('Active section set to:', element.id);
                    }
                });
            }
        }
        
        // Attach scroll listener to the container
        snapContainer.addEventListener('scroll', handleScroll, { passive: true });
        
        // Cleanup on unmount
        return () => snapContainer.removeEventListener('scroll', handleScroll);
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
    <div class="snap-container" bind:this={snapContainer} in:fade={{ duration: 1850 }}>
        <!-- Slide 0: Home/Landing -->
        <section id="home" class="snap-section">
            <ScrollParallax layers={parallaxLayers} maxShift={80} />
            <LandingIndexAnim 
                {activeSection}
                {currentSlide}
                startAnimation={startMainAnimation}
            />
        </section>
        
        <!-- Slide 1: Work Experience -->
        <section id="work" class="snap-section bg-white" style="scroll-snap-align: start;">
            <!-- Experience Title - animates from bottom-right to top-right -->
            <div 
                class="experience-title"
                style="
                    position: absolute;
                    {workPhase === 0 ? 'bottom: 2rem; right: 2rem;' : 'top: 2rem; right: 2rem;'}
                    transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1), bottom 0.8s cubic-bezier(0.65, 0, 0.35, 1);
                "
            >
                <h1 class="mondwest" style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue);">EXPERIENCE*</h1>
            </div>
            
            <!-- Experience Cards Container -->
            {#if workPhase >= 1}
                <div class="experience-content" style="padding-top: 8rem; overflow-y: auto; height: 100%;">
                    {#each experienceData as experience, index}
                        {#if workPhase >= index + 2}
                            <ExperienceCard data={experience} />
                        {/if}
                    {/each}
                </div>
            {/if}
        </section>
        
        
        <!-- Add more sections as needed -->
    </div>
{/if}

<style>
    .snap-container {
        scroll-snap-type: y mandatory;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100vh;
        width: 100vw;
    }
    
    .snap-section {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        height: 100vh;
        width: 100vw;
        position: relative;
    }
    
    .bg-white {
        background-color: white;
    }
    
    .content-wrapper {
        padding: 4rem;
        max-width: 1200px;
        margin: 0 auto;
        position: relative;
        z-index: 60;
    }
</style>

