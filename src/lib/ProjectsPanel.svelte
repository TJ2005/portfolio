<script lang="ts">
    import { cubicOut } from "svelte/easing";

    let { visible = false } = $props();

    const projects = [
        { title: "Portfolio Website",    description: "This very site — SvelteKit, snap-scroll, cursor parallax & variable fonts." },
        { title: "AI Data Pipeline",     description: "End-to-end ML data labelling & human review system built for scale." },
        { title: "Dashboard UI",         description: "Analytics dashboard with real-time charts, filters & live data viz." },
        { title: "DevOps Toolkit",       description: "Docker + Cloudflare deployment pipeline with one-click CI/CD." },
        { title: "Design System",        description: "Component library + Storybook docs for a cross-platform product suite." },
        { title: "Mobile App",           description: "React Native app with offline-first sync and biometric auth." },
        { title: "E-Commerce Platform",  description: "Headless storefront with real-time inventory and custom checkout flow." },
        { title: "Open Source CLI",      description: "Node.js CLI tool for scaffolding projects — 2k+ weekly downloads." },
    ];

    const PAGE_SIZE = 4;
    const pages = Array.from(
        { length: Math.ceil(projects.length / PAGE_SIZE) },
        (_, i) => projects.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE)
    );

    let currentPage = $state(0);
    let dir = $state<1 | -1>(1); // 1 = forward/down, -1 = backward/up

    // Reset page when section becomes invisible
    $effect(() => { if (!visible) { currentPage = 0; dir = 1; } });

    // ── TILT STATE (4 slots, reset on page change) ────────────────
    let tilts = $state(Array.from({ length: PAGE_SIZE }, () => ({ rx: 0, ry: 0, hovering: false })));
    $effect(() => {
        // reference currentPage to re-run when it changes
        currentPage;
        tilts = Array.from({ length: PAGE_SIZE }, () => ({ rx: 0, ry: 0, hovering: false }));
    });

    function onMouseMove(e: MouseEvent, i: number) {
        const el = e.currentTarget as HTMLElement;
        const rect = el.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width  * 2 - 1;
        const ny = (e.clientY - rect.top)  / rect.height * 2 - 1;
        const MAX = 12;
        tilts[i] = { rx: -ny * MAX, ry: nx * MAX, hovering: true };
    }
    function onMouseLeave(i: number) {
        tilts[i] = { rx: 0, ry: 0, hovering: false };
    }

    // ── NON-PASSIVE WHEEL LISTENER (intercepts snap scroll) ───────
    let container: HTMLElement | null = $state(null);
    let cooling = false;

    $effect(() => {
        if (!container) return;
        const handler = (e: WheelEvent) => {
            if (cooling) { e.preventDefault(); return; }
            if (e.deltaY > 0 && currentPage < pages.length - 1) {
                e.preventDefault();
                dir = 1;
                currentPage++;
                cooling = true;
                setTimeout(() => (cooling = false), 900);
            } else if (e.deltaY < 0 && currentPage > 0) {
                e.preventDefault();
                dir = -1;
                currentPage--;
                cooling = true;
                setTimeout(() => (cooling = false), 900);
            }
            // else let event bubble → parent snap scroll takes over
        };
        container.addEventListener("wheel", handler, { passive: false });
        return () => container!.removeEventListener("wheel", handler);
    });

    // ── TRANSITIONS ────────────────────────────────────────────────
    //
    // Old grid slides OUT (up or down), new grid slides IN from the opposite edge.
    // Both grids are absolutely positioned inside .grid-viewport (overflow:hidden),
    // so they physically pass each other — real slide-within-slide.

    function slideIn(node: Element, { duration = 640 }: { duration?: number }) {
        const d = dir;
        return {
            duration,
            css: (t: number) => {
                const e = cubicOut(t);
                return `
                    opacity: ${e};
                    transform: translateY(${(1 - e) * (d === 1 ? 100 : -100)}%);
                `;
            }
        };
    }

    function slideOut(node: Element, { duration = 640 }: { duration?: number }) {
        const d = dir;
        return {
            duration,
            css: (t: number) => {
                const e = cubicOut(1 - t);
                return `
                    opacity: ${t};
                    transform: translateY(${e * (d === 1 ? -100 : 100)}%);
                `;
            }
        };
    }
</script>

{#if visible}
<div class="projects-wrap" bind:this={container}>
    <!-- header row -->
    <div class="header-row">
        <p class="section-label mondwest">My Work</p>
        <!-- dot indicators -->
        <div class="dots">
            {#each pages as _, pi}
                <button
                    class="dot"
                    class:active={pi === currentPage}
                    onclick={() => { dir = pi > currentPage ? 1 : -1; currentPage = pi; }}
                    aria-label="Page {pi + 1}"
                ></button>
            {/each}
        </div>
    </div>

    <!-- viewport clips the sliding grids -->
    <div class="grid-viewport">
    <!-- keyed grid — both old+new exist simultaneously, slide past each other -->
    {#key currentPage}
    <div
        class="cards-grid"
        in:slideIn={{ duration: 640 }}
        out:slideOut={{ duration: 640 }}
    >
        {#each pages[currentPage] as project, i}
            <div
                class="card-wrap"
                style="perspective: 1100px;"
                onmousemove={(e) => onMouseMove(e, i)}
                onmouseleave={() => onMouseLeave(i)}
                role="button"
                tabindex="0"
            >
                <div
                    class="card"
                    style="
                        transform: rotateX({tilts[i].rx}deg) rotateY({tilts[i].ry}deg) scale({tilts[i].hovering ? 1.025 : 1});
                        box-shadow: {tilts[i].hovering
                            ? `${-tilts[i].ry * 0.7}px ${tilts[i].rx * 0.7}px 52px rgba(25,0,255,0.20), inset 0 1px 0 rgba(255,255,255,0.58)`
                            : 'inset 0 1px 0 rgba(255,255,255,0.45), 0 4px 24px rgba(25,0,255,0.07)'};
                    "
                >
                    <div class="card-visual"></div>
                    <div class="card-footer">
                        <span class="card-title zalando" class:bold={tilts[i].hovering}>{project.title}</span>
                        <span class="card-desc">{project.description}</span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    {/key}
    </div>
</div>
{/if}

<style>
    /* ── CONTAINER — matches ExperienceCard positioning ─────────── */
    .projects-wrap {
        position: absolute;
        bottom: 0;
        right: 2.75rem;
        width: 75vw;
        max-height: calc(100vh - 8rem);
        display: flex;
        flex-direction: column;
        padding-bottom: 2rem;
    }

    /* ── HEADER ──────────────────────────────────────────────────── */
    .header-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        margin-bottom: 1.25rem;
        flex-shrink: 0;
    }

    .section-label {
        font-size: 28px;
        color: var(--color-blue);
        margin: 0;
        letter-spacing: 0.02em;
    }

    /* ── PAGE DOTS ───────────────────────────────────────────────── */
    .dots {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        border: none;
        background: rgba(25, 0, 255, 0.18);
        cursor: pointer;
        transition: background 0.25s ease, transform 0.25s ease;
        padding: 0;
    }
    .dot.active {
        background: var(--color-blue);
        transform: scale(1.35);
    }

    /* ── GRID VIEWPORT (clips sliding grids) ─────────────────────── */
    .grid-viewport {
        position: relative;
        height: calc(100vh - 14rem);
        max-height: 640px;
        flex-shrink: 0;
        /* no overflow:hidden — shadows would get clipped.
           opacity-fade in transitions hides off-screen grids instead. */
    }

    /* ── 2×2 GRID ────────────────────────────────────────────────── */
    .cards-grid {
        position: absolute;
        inset: 0;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
    }

    .card-wrap {
        cursor: pointer;
        height: 100%;
    }

    /* ── LIQUID GLASS CARD ───────────────────────────────────────── */
    .card {
        width: 100%;
        height: 100%;
        border-radius: 28px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background:
            linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.32) 0%,
                rgba(25, 0, 255, 0.05) 40%,
                rgba(80, 60, 255, 0.10) 100%
            );
        backdrop-filter: blur(18px) saturate(160%);
        -webkit-backdrop-filter: blur(18px) saturate(160%);
        border: 1px solid rgba(25, 0, 255, 0.14);
        border-top-color: rgba(255, 255, 255, 0.5);
        border-left-color: rgba(255, 255, 255, 0.3);
        transition:
            transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            box-shadow 0.22s ease;
        transform-style: preserve-3d;
        will-change: transform;
    }

    /* ── VISUAL PLACEHOLDER ──────────────────────────────────────── */
    .card-visual {
        flex: 1;
        margin: 1.1rem 1.1rem 0 1.1rem;
        border-radius: 18px;
        background:
            linear-gradient(
                135deg,
                rgba(25, 0, 255, 0.08) 0%,
                rgba(100, 80, 255, 0.14) 50%,
                rgba(25, 0, 255, 0.06) 100%
            );
        border: 1px solid rgba(25, 0, 255, 0.10);
    }

    /* ── FOOTER ──────────────────────────────────────────────────── */
    .card-footer {
        padding: 1rem 1.4rem 1.4rem 1.4rem;
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
    }

    .card-title {
        font-size: 20px;
        font-weight: 400;
        color: var(--color-blue);
        line-height: 1;
        transition: font-weight 0.18s ease;
    }
    .card-title.bold { font-weight: 700; }

    .card-desc {
        font-family: "Inter Variable", sans-serif;
        font-size: 12.5px;
        font-weight: 300;
        color: rgba(25, 0, 255, 0.52);
        line-height: 1.5;
    }
</style>
