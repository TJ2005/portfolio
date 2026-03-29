<script lang="ts">
    import LoadingAnimator from "$lib/loadingAnimator.svelte";
    import LandingIndexAnim from "$lib/landingIndexAnim.svelte";
    import ScrollParallax from "$lib/ScrollParallax.svelte";
    import ExperienceCard from "$lib/ExperienceCard.svelte";
    import AboutCard from "$lib/AboutCard.svelte";
    import EducationCard from "$lib/EducationCard.svelte";
    import TechStack from "$lib/TechStack.svelte";
    import ProjectsPanel from "$lib/ProjectsPanel.svelte";
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
	import { onMount } from "svelte";

    const aboutTitleChars = "ABOUT ME*".split("");
    const experienceTitleChars = "EXPERIENCE*".split("");
    const educationTitleChars = "EDUCATION*".split("");
    const expertiseTitleChars = "MY EXPERTISE*".split("");
    const projectsTitleChars = "PROJECTS*".split("");

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
    let previousSlide = $state(0);
    let activeSection = $state('home');
    let startAnimation = $state(true);
    let showLoader = $state(true);
    let startMainAnimation = $state(false);
    let assetsLoaded = $state(false);
    let snapContainer = $state<HTMLDivElement | null>(null);
    
    // Experience data
    const experienceData = [
        {
            companyName: "Adzzat",
            jobTitle: "Machine Learning Systems Contributor",
            employmentType: "Contributor",
            startYear: "Dec 2025",
            endYear: "Present",
            responsibilities: [
                "Resolved and structured GitHub issue data for model training and evaluation cycles.",
                "Built validation checks to catch leakage and regression risks early.",
                "Delivered reproducible PRs with clean documentation and versioned workflows."
            ]
        },
        {
            companyName: "Manorama Supply Chain Solutions Group",
            jobTitle: "Web Developer / IT Admin",
            employmentType: "Full Time",
            startYear: "Oct 2020",
            endYear: "Present",
            responsibilities: [
                "Own end-to-end web and IT operations across domains, SSL, email infrastructure, and backups.",
                "Built and maintain internal and public-facing systems for logistics operations.",
                "Managed server infrastructure and governance for sensitive BL/MBL documentation flows.",
                "Driving workflow automation to reduce manual errors and improve turnaround time."
            ]
        },
        {
            companyName: "Codeloom",
            jobTitle: "Lead Web Developer",
            employmentType: "Full Time",
            startYear: "Jan 2025",
            endYear: "Oct 2026",
            responsibilities: [
                "Led delivery of production websites using React and modern JavaScript stacks.",
                "Owned UI/UX implementation, database optimization, and SEO/performance standards.",
                "Built testing frameworks, custom WordPress plugins, and managed Webflow deployments.",
                "Mentored interns on CLI usage, development workflows, and requirement engineering."
            ]
        }
        
    ];

    // Education data
    const educationData = [
        {
            institutionName: "SVKM NMIMS",
            degree: "B.Tech",
            fieldOfStudy: "Engineering",
            startYear: "2023",
            endYear: "2027",
            achievements: [
                "Pursuing B.Tech in Mumbai",
                "Positions of Responsibility:",
                "Technical Head, Cyber Chakravyuh - led CTF ops and event tech.",
                "Technical and Digital Creatives Head, FOSS MPSTME - managed tech flows and creatives."
            ]
        },
        {
            institutionName: "DPS Panvel, CBSE",
            degree: "Class 12",
            fieldOfStudy: "Science - Mathematics",
            startYear: "2023",
            endYear: "2023",
            achievements: [
                "Completed Senior Secondary education in Navi Mumbai.",
                "During this period, delivered freelance projects in brand development and web development."
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
                return new Promise<void>((resolve) =>{
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
        { id:'about', label:'About Me - Intro', count:2, subSlide: 0 },
        { id:'about', label:'About Me - Narrative', count:3, subSlide: 1 },
        { id:'work', label:'Work Experience', count:4, subSlide: 0 },
        { id:'work', label:'Work Experience - Job 1', count:5, subSlide: 1 },
        { id:'work', label:'Work Experience - Job 2', count:6, subSlide: 2 },
        { id:'work', label:'Work Experience - Job 3', count:7, subSlide: 3 },
        { id:'education', label:'Education', count:8, subSlide: 0 },
        { id:'education', label:'Education - Degree 1', count:9, subSlide: 1 },
        { id:'education', label:'Education - Degree 2', count:10, subSlide: 2 },
        { id:'cs-stack', label:'Computer Science Stack', count:11, subSlide: 0 },
        { id:'cs-stack', label:'Computer Science Stack - Detail', count:12, subSlide: 1 },
        { id:'projects', label:'Projects - Intro', count:13, subSlide: 0 },
        { id:'projects', label:'Projects - Grid', count:14, subSlide: 1 },
        { id: 'contact', label: "Let's get in Touch", count: 15 },
        { id: 'footer', label: 'Footer', count: 16 }
    ]
    
    // Track scroll and update current slide
    $effect(()=>{
        const container = snapContainer;
        if (!(container instanceof HTMLDivElement)) return;
        
        function handleScroll(){
            const scrollPercentage = (container as HTMLDivElement).scrollTop / window.innerHeight;
            const newSlide = Math.round(scrollPercentage);
            
            // Only update if slide actually changed
            if(newSlide !== currentSlide){
                const priorSlide = currentSlide;
                previousSlide = priorSlide;
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
        (container as HTMLDivElement).addEventListener('scroll', handleScroll, { passive: true });
        
        // Cleanup on unmount
        return () => (container as HTMLDivElement).removeEventListener('scroll', handleScroll);
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
    <!-- Fixed About Title (shows on about slides) -->
    {#if currentSlide >= 1 && currentSlide <= 2}
        <div
            class="fixed-about-title"
            in:fly={{ y: 56, duration: 720, easing: cubicOut }}
            out:fade={{ duration: 600 }}
            style="
                position: fixed;
                top: {currentSlide === 1 ? 'calc(100vh - 8rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
        >
            <h1 class="mondwest animated-section-title" class:intro-active={currentSlide === 1 && previousSlide < currentSlide} style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue);">
                {#each aboutTitleChars as char, i (i)}
                    <span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span>
                {/each}
            </h1>
        </div>
    {/if}

    <!-- Fixed Experience Title (shows on work slides) -->
    {#if currentSlide >= 3 && currentSlide <= 6}
        <div 
            class="fixed-experience-title"
            in:fly={{ y: 56, duration: 720, easing: cubicOut }}
            out:fade={{ duration: 600 }}
            style="
                position: fixed;
                top: {currentSlide === 3 ? 'calc(100vh - 8rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
        >
            <h1 class="mondwest animated-section-title" class:intro-active={currentSlide === 3 && previousSlide < currentSlide} style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue);">
                {#each experienceTitleChars as char, i (i)}
                    <span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span>
                {/each}
            </h1>
        </div>
    {/if}

    <!-- Fixed Education Title (shows on education slides) -->
    {#if currentSlide >= 7 && currentSlide <= 9}
        <div 
            class="fixed-education-title"
            in:fly={{ y: 56, duration: 720, easing: cubicOut }}
            out:fade={{ duration: 600 }}
            style="
                position: fixed;
                top: {currentSlide === 7 ? 'calc(100vh - 8rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
        >
            <h1 class="mondwest animated-section-title" class:intro-active={currentSlide === 7 && previousSlide < currentSlide} style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue);">
                {#each educationTitleChars as char, i (i)}
                    <span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span>
                {/each}
            </h1>
        </div>
    {/if}

    <!-- Fixed CS Stack Title (shows on tech stack slides) -->
    {#if currentSlide >= 10 && currentSlide <= 11}
        <div 
            class="fixed-csstack-title"
            in:fly={{ y: 56, duration: 720, easing: cubicOut }}
            out:fade={{ duration: 600 }}
            style="
                position: fixed;
                top: {currentSlide === 10 ? 'calc(100vh - 8rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
        >
            <!-- blur halo anchored to the title -->
            <div style="
                position: absolute;
                top: 50%; right: -2rem;
                transform: translateY(-50%);
                width: calc(100% + 50rem);
                height: calc(100% + 6rem);
                backdrop-filter: blur(36px);
                -webkit-backdrop-filter: blur(36px);
                mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 65%, transparent 100%),
                            linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 80%, transparent 100%);
                -webkit-mask-image: linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 65%, transparent 100%),
                                    linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,1) 40%, rgba(0,0,0,1) 60%, rgba(0,0,0,0.6) 80%, transparent 100%);
                mask-composite: intersect;
                -webkit-mask-composite: source-in;
                pointer-events: none;
                z-index: -1;
            "></div>
            <h1 class="mondwest animated-section-title" class:intro-active={currentSlide === 10 && previousSlide < currentSlide} style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue); position: relative;">
                {#each expertiseTitleChars as char, i (i)}
                    <span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span>
                {/each}
            </h1>
        </div>
    {/if}

    <!-- Fixed Projects Title -->
    {#if currentSlide >= 12 && currentSlide <= 13}
        <div
            in:fly={{ y: 56, duration: 720, easing: cubicOut }}
            out:fade={{ duration: 600 }}
            style="
                position: fixed;
                top: {currentSlide === 12 ? 'calc(100vh - 8rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
        >
            <h1 class="mondwest animated-section-title" class:intro-active={currentSlide === 12 && previousSlide < currentSlide} style="font-size: 96px; line-height: 1; margin: 0; color: var(--color-blue);">
                {#each projectsTitleChars as char, i (i)}
                    <span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span>
                {/each}
            </h1>
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

        <!-- Slide 1: About - Title Intro -->
        <section id="about" class="snap-section bg-white">
        </section>

        <!-- Slide 2: About - Animated Intro + Content Reveal -->
        <section id="about-narrative" class="snap-section bg-white">
            <AboutCard visible={currentSlide === 2} />
        </section>
        
        <!-- Slide 3: Work Experience - Title Intro -->
        <section id="work" class="snap-section bg-white">
        </section>
        
        <!-- Slide 4: Work Experience - First Job -->
        <section id="work-1" class="snap-section bg-white">
            <!-- First Job Card -->
            <div class="experience-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <ExperienceCard data={experienceData[0]} visible={currentSlide >= 4} />
            </div>
        </section>
        
        <!-- Slide 5: Work Experience - Second Job -->
        <section id="work-2" class="snap-section bg-white">
            <!-- Second Job Card -->
            <div class="experience-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <ExperienceCard data={experienceData[1]} visible={currentSlide >= 5} />
            </div>
        </section>

        <!-- Slide 6: Work Experience - Third Job -->
        <section id="work-3" class="snap-section bg-white">
            <div class="experience-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <ExperienceCard data={experienceData[2]} visible={currentSlide >= 6} />
            </div>
        </section>

        <!-- Slide 7: Education Title Intro -->
        <section id="education-intro" class="snap-section bg-white">
            <!-- Title will be handled by fixed position div -->
        </section>

        <!-- Slide 8: Education - First Entry -->
        <section id="education-0" class="snap-section bg-white">
            <div class="education-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <EducationCard data={educationData[0]} visible={currentSlide >= 8} />
            </div>
        </section>

        <!-- Slide 9: Education - Second Entry -->
        <section id="education-1" class="snap-section bg-white">
            <div class="education-content" style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;">
                <EducationCard data={educationData[1]} visible={currentSlide >= 9} />
            </div>
        </section>

        <!-- Slide 10: CS Stack - Scrolling Animation -->
        <section id="cs-stack" class="snap-section bg-white">
            <TechStack currentSlide={currentSlide} />
        </section>

        <!-- Slide 11: CS Stack - Detailed Grid -->
        <section id="cs-stack-detail" class="snap-section bg-white">
            <TechStack currentSlide={currentSlide} />
        </section>

        <!-- Slide 12: Projects Intro -->
        <section id="projects" class="snap-section bg-white">
        </section>

        <!-- Slide 13: Projects Grid -->
        <section id="projects-grid" class="snap-section bg-white">
            <ProjectsPanel visible={currentSlide === 13} />
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

    .animated-section-title {
        display: inline-flex;
        white-space: nowrap;
    }

    .intro-char {
        display: inline-block;
        opacity: 1;
        transform: translateY(0);
    }

    .animated-section-title.intro-active .intro-char {
        animation: section-title-rise 560ms cubic-bezier(0.22, 1, 0.36, 1) both;
        animation-delay: calc(var(--char-index) * 45ms);
    }

    @keyframes section-title-rise {
        from {
            opacity: 0;
            transform: translateY(0.62em);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
</style>

