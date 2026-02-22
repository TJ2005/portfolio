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
                        resolve();
                    };
                });
            })
        ).then(() => {
            assetsLoaded = true;
        });
    })

    const slides = [
        { id:'home', label:'Home', count:1 },
        { id:'work', label:'Work Experience', count:2, subSlide: 0 }, // Title at bottom
        { id:'work', label:'Work Experience - Job 1', count:3, subSlide: 1 }, // Title at top + first card
        { id:'work', label:'Work Experience - Job 2', count:4, subSlide: 2 }, // Second card
        { id:'education', label:'Education', count:5 },
        { id:'cs-stack', label:'Computer Science Stack', count:6 },
        { id:'projects', label:'Projects', count:7 },
        { id:'github', label:'GitHub', count:8 },
        { id: 'content-stack', label: 'Content Creation Stack', count: 9 },
        { id: 'about', label: 'About Me', count: 10 },
        { id: 'contact', label: "Let's get in Touch", count: 11 },
        { id: 'extras', label: "Extra's", count: 12 },
        { id: 'footer', label: 'Footer', count: 13 }
    ]
    
    // Track scroll and update current slide
    $effect(()=>{
        if (!snapContainer) return;
        
        function handleScroll(){
            const scrollPercentage = snapContainer.scrollTop / window.innerHeight;
            const newSlide = Math.round(scrollPercentage);
            
            // Only update if slide actually changed
            if(newSlide !== currentSlide){
                currentSlide = newSlide;

                // Update active section based on slide number
                slides.forEach(element => {
                    if(element.count === currentSlide + 1){
                        activeSection = element.id;
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
    <!-- Fixed Experience Title (shows on work slides) -->
    {#if currentSlide >= 1 && currentSlide <= 3}
        <div 
            class="fixed-experience-title"
            in:fade={{ duration: 600 }}
            out:fade={{ duration: 600 }}
            style="
                position: fixed;
                top: {currentSlide === 1 ? 'calc(100vh - 8rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
        >
            <h1 class="mondwest" style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue);">EXPERIENCE*</h1>
        </div>
    {/if}
    
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
        
        <!-- Slide 1: Work Experience - Title Intro -->
        <section id="work" class="snap-section bg-white">
        </section>
        
        <!-- Slide 2: Work Experience - First Job -->
        <section id="work-1" class="snap-section bg-white">
            <!-- First Job Card -->
            <div class="experience-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <ExperienceCard data={experienceData[0]} visible={currentSlide >= 2} />
            </div>
        </section>
        
        <!-- Slide 3: Work Experience - Second Job -->
        <section id="work-2" class="snap-section bg-white">
            <!-- Second Job Card -->
            <div class="experience-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <ExperienceCard data={experienceData[1]} visible={currentSlide >= 3} />
            </div>
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

