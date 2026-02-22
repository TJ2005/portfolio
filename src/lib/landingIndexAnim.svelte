    <script lang="ts">
    import { VariableTextTweener, Easing } from '@studioursus/variable-width-text-core';
    import { cubicInOut } from "svelte/easing";
    import { Tween } from "svelte/motion";
    import { fly, fade } from "svelte/transition";

    interface Props{
        activeSection?: string;
        startAnimation?: boolean;
        currentSlide?: number;
    }

    let { activeSection = 'home', startAnimation = false, currentSlide = 0 }: Props = $props()

    // Configurable spacing and positioning
    const MENU_SPACING_HOME = '2rem';        // Wide spacing on home
    const MENU_SPACING_SECTIONS = '0.5rem';   // Tight spacing on sections (configurable)
    const MENU_ITEM_GAP = new Tween(2, { duration: 800, easing: cubicInOut }); // Gap in rem

    // Configurable weights
    const MENU_WEIGHT_DEFAULT = 300;    // Default weight for all items
    const MENU_WEIGHT_HOVER = 600;      // When hovering over item
    const MENU_WEIGHT_ACTIVE = 600;     // When section is active (slide 1+)

    const menuItems = [
        { id:'work', label:'Work Experience',roman:'I'},
        { id:'education', label:'Education',roman:'II'},
        { id:'cs-stack', label:'Computer Science Stack',roman:'III'},
        { id:'projects', label:'Projects',roman:'IV'},
        { id:'github', label:'GitHub',roman:'V'},
        { id: 'content-stack', label: 'Content Creation Stack', roman: 'VI' },
        { id: 'about', label: 'About Me', roman: 'VII' },
        { id: 'contact', label: "Let's get in Touch", roman: 'VIII' },
        { id: 'extras', label: "Extra's", roman: 'IX' }
    ]

    const blurAmount = new Tween(4,{
        duration:2000,
        easing:cubicInOut
    });

    // Position tweens for moving menu to bottom-left
    const containerX = new Tween(50, { duration: 800, easing: cubicInOut }); // Start at center (50%)
    const containerY = new Tween(50, { duration: 800, easing: cubicInOut }); // Start at center (50%)
    
    // Fade tweens for title and subtitle
    const titleOpacity = new Tween(0, { duration: 600, easing: cubicInOut });
    const subtitleOpacity = new Tween(0, { duration: 600, easing: cubicInOut });
    
    // Background opacity and blur tweens
    const bgOpacity = new Tween(0.3, { duration: 50, easing: cubicInOut });
    const bgBlur = new Tween(4, { duration: 600, easing: cubicInOut });
    
    // Top-left title (appears on slide 1+)
    const topLeftTitleOpacity = new Tween(0, { duration: 600, easing: cubicInOut });
    let topLeftTitleWeight = $state(300);
    const topLeftTitleWeightTweener = new VariableTextTweener({
        duration: 600,
        easing: Easing.easeInOutCubic,
        onUpdate: (value, progress) => {
            topLeftTitleWeight = value;
        }
    });

    let variableTextWeight = $state(0);
    const textWeightTweener = new VariableTextTweener({
        duration: 1000,
        easing: Easing.easeInOutCubic,
        onUpdate: (value, progress) => {
            variableTextWeight = value;
        }
    });

    // Trigger animation when startAnimation becomes true
    $effect(() => {
        if (startAnimation) {
            (async() => {
                blurAmount.set(0);
                await textWeightTweener.animateTo(200);
                blurAmount.set(20);
                await textWeightTweener.animateTo(600);
            })();
        }
    });

    // Animate position and fade when currentSlide changes
    $effect(() => {
        if (currentSlide === 0) {
            // Slide 0: Center position, full opacity, wide spacing, blue bg with blur
            containerX.set(50);  // 50% = center
            containerY.set(50);  // 50% = center
            titleOpacity.set(1);
            subtitleOpacity.set(1);
            MENU_ITEM_GAP.set(2); // 2rem gap (wide)
            bgOpacity.set(0.3); // Blue background 30%
            bgBlur.set(4); // 4px blur
            topLeftTitleOpacity.set(0); // Hide top-left title
        } else if (currentSlide === 1) {
            // Slide 1: Move to bottom-left corner, fade out title/subtitle, show top-left title in white
            containerX.set(0);
            containerY.set(100);
            titleOpacity.set(0);
            subtitleOpacity.set(0);
            MENU_ITEM_GAP.set(0.5);
            bgOpacity.set(0);
            bgBlur.set(0);
            topLeftTitleOpacity.set(1); // Fade in top-left title
            
            // Tween weight smoothly to 600
            (async() => {
                await topLeftTitleWeightTweener.animateTo(300);
                await topLeftTitleWeightTweener.animateTo(600);
            })();
        } else {
            // Slide 2+: Top-left title becomes blue with variable weight
            containerX.set(0);
            containerY.set(100);
            titleOpacity.set(0);
            subtitleOpacity.set(0);
            MENU_ITEM_GAP.set(0.5);
            bgOpacity.set(0);
            bgBlur.set(0);
            topLeftTitleOpacity.set(1); // Keep visible
            topLeftTitleWeightTweener.animateTo(600); // Blue weight
        }
    });

    // Create individual VariableTextTweener for each menu item
    let itemWeights: Record<string, number> = $state({});
    let itemTweeners: Record<string, VariableTextTweener> = {};
    let hoveredItem: string | null = $state(null);
    
    menuItems.forEach(item => {
        itemWeights[item.id] = MENU_WEIGHT_DEFAULT;
        itemTweeners[item.id] = new VariableTextTweener({
            duration: 300,
            easing: Easing.easeInOutCubic,
            onUpdate: (value, progress) => {
                itemWeights[item.id] = value;
            }
        });
        // Initialize starting value
        itemTweeners[item.id].animateTo(MENU_WEIGHT_DEFAULT);
    });

    // Update font weights based on active section and hover
    $effect(() => {
        // Explicitly read reactive values to track them
        const slide = currentSlide;
        const section = activeSection;
        const hovered = hoveredItem;
        
        console.log('Weight effect triggered:', { slide, section, hovered });
        
        menuItems.forEach(item => {
            if (hovered === item.id) {
                // Hovered state: weight 600
                console.log(`${item.id}: hover -> 600`);
                itemTweeners[item.id].animateTo(MENU_WEIGHT_HOVER);
            } else if (slide === 0) {
                // Slide 0 (Home): All items weight 300
                console.log(`${item.id}: home -> 300`);
                itemTweeners[item.id].animateTo(MENU_WEIGHT_DEFAULT);
            } else if (item.id === section) {
                // Slide 1+: Active item weight 600
                console.log(`${item.id}: active (matches ${section}) -> 600`);
                itemTweeners[item.id].animateTo(MENU_WEIGHT_ACTIVE);
            } else {
                // Slide 1+: Inactive items weight 300
                console.log(`${item.id}: inactive -> 300`);
                itemTweeners[item.id].animateTo(MENU_WEIGHT_DEFAULT);
            }
        });
    });

    function handleMouseEnter(itemId: string) {
        hoveredItem = itemId;
    }

    function handleMouseLeave() {
        hoveredItem = null;
    }

    function scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Helper function to get opacity for a menu item
    function getItemOpacity(itemId: string): number {
        const slide = currentSlide;
        const section = activeSection;
        
        if (slide === 0) {
            return 1;
        }
        return itemId === section ? 1 : 0.7;
    }
</script>

<!-- Top-left title (appears on slide 1+) -->
{#if currentSlide >= 1}
    <div 
        class="top-left-title"
        style="
            position: fixed;
            top: 2rem;
            left: 2rem;
            z-index: 100;
            opacity: {topLeftTitleOpacity.current};
            transition: opacity 0.6s ease;
        "
    >
        <div 
            class="zalando"
            style="
                font-size: 32px;
                line-height: 1.2em;
                letter-spacing: -0.05em;
                font-weight: {topLeftTitleWeight};
                color: {currentSlide === 1 ? 'white' : 'var(--color-blue)'};
                filter: drop-shadow(0 2px 8px rgba(25, 0, 255, 0.4));
                transition: color 0.6s ease, font-weight 0.6s ease, filter 0.6s ease;
            "
        >
            Tejas Kamal<br />Sahoo
        </div>
    </div>
{/if}

<div 
    class="menu-container" 
    in:fade={{ duration: 850 }}
    style="
        position: fixed;
        {currentSlide === 0 ? `left: ${containerX.current}%; top: ${containerY.current}%; transform: translate(-50%, -50%);` : 'left: 2rem; bottom: 2rem;'}
        z-index: 100;
        transition: left 0.8s cubic-bezier(0.65, 0, 0.35, 1), bottom 0.8s cubic-bezier(0.65, 0, 0.35, 1), top 0.8s cubic-bezier(0.65, 0, 0.35, 1), transform 0.8s cubic-bezier(0.65, 0, 0.35, 1);
    "
>
    <div class="min-w-[20em] py-[0.875em]" class:px-[1.125em]={currentSlide === 0} in:fly={{y:-40,duration:1000}} style="background-color: rgba(25, 0, 255, {bgOpacity.current}); backdrop-filter:blur({bgBlur.current}px); transition: all 0.6s ease;">
        <div 
            class="zalando text-[2em]" 
            in:fade={{ duration: 700 }}
            style="
                line-height:1em; 
                letter-spacing:-0.08em;
                font-weight:{variableTextWeight};
                opacity:{titleOpacity.current};
                transition: opacity 0.6s ease;
                color: white;
            "
        >
            Tejas Kamal <br />Sahoo
        </div>
        <div>
            <div 
                style="
                    opacity:{subtitleOpacity.current};
                    transition: opacity 0.6s ease;
                    color: white;
                "
            >
                <p class="mondwest pt-[2em] text-[1.125em]">I Build. I Create.</p>
            </div>
            <div id="item-menu">
                <ul class="list-none p-0">
                    {#each menuItems as item}
                        <li class="w-full">
                            <button 
                                class="zalando text-[1em] w-full flex items-center transition-opacity cursor-pointer bg-transparent border-none text-left"
                                onclick={() => scrollToSection(item.id)}
                                style="
                                    font-weight:{itemWeights[item.id]};
                                    opacity: {getItemOpacity(item.id)};
                                    gap: {MENU_ITEM_GAP.current}rem;
                                    transition: opacity 0.3s ease, color 0.3s ease;
                                    color: {activeSection === '' || activeSection === 'home' ? 'white' : 'var(--color-blue)'};
                                "
                                onmouseenter={() => handleMouseEnter(item.id)}
                                onmouseleave={handleMouseLeave}
                            >
                                <span style="flex: 1;">
                                    {item.label}
                                </span>
                                <span class="mondwest">
                                    {item.roman}
                                </span>
                            </button>
                        </li>   
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>
