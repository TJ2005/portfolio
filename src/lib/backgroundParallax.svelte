<script lang="ts">
    import { onMount } from 'svelte';
    import bgImage from '$lib/assets/Background _ Parallax.jpg';

    let mouseX = $state(0);
    let mouseY = $state(0);
    let scrollY = $state(0);
    
    let smoothX = $state(0);
    let smoothY = $state(0);
    
    const CURSOR_SPEED = 0.05; // How quickly image follows cursor (0.01 = slow, 0.1 = fast)
    const CURSOR_INTENSITY = 30; // Max pixels image can move from cursor
    const SCROLL_INTENSITY = 0.3; // Scroll parallax multiplier
    
    let animationFrameId: number;
    
    function animate() {
        // Smooth cursor follow with lag
        const distX = mouseX - smoothX;
        const distY = mouseY - smoothY;
        
        smoothX += distX * CURSOR_SPEED;
        smoothY += distY * CURSOR_SPEED;
        
        animationFrameId = requestAnimationFrame(animate);
    }
    
    function handleMouseMove(event: MouseEvent) {
        // Convert mouse position to -1 to 1 range, then scale
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        mouseX = ((event.clientX - centerX) / centerX) * CURSOR_INTENSITY;
        mouseY = ((event.clientY - centerY) / centerY) * CURSOR_INTENSITY;
    }
    
    function handleScroll() {
        scrollY = window.scrollY;
    }
    
    onMount(() => {
        animate();
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    });
    
    // Combined transform for cursor and scroll
    $effect(() => {
        const scrollOffset = scrollY * SCROLL_INTENSITY;
        void smoothX, smoothY; // Track reactivity
    });
</script>

<div 
    class="parallax-bg"
    style="transform: translate({smoothX}px, {smoothY + (scrollY * SCROLL_INTENSITY)}px)"
>
    <img src={bgImage} alt="Background" />
</div>

<style>
    .parallax-bg {
        position: fixed;
        top: -10%;
        left: -10%;
        width: 120%;
        height: 120%;
        z-index: -1;
        will-change: transform;
    }
    
    .parallax-bg img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
    
    /* Ensure smooth rendering */
    @media (prefers-reduced-motion: reduce) {
        .parallax-bg {
            transform: none !important;
        }
    }
</style>
