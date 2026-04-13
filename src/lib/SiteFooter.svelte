<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { gsap } from "gsap";
    import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
    import FooterCta from "$lib/footer/FooterCta.svelte";

    let year = new Date().getFullYear();
    const motionEnabled = true;

    const homeHref = "/";
    const studioHref = "/";
    const aboutHref = "/";
    const contactHref = "/";
    const linkedinHref = "/";
    const notesHref = "/";
    const instagramHref = "/";

    const MOUSE_STEP = 80;
    const FOOTER_SHIFT_MAX = 180;
    let footerSectionEl: HTMLElement | undefined;
    let footerWrapEl: HTMLDivElement | undefined;
    let footerMoveEl: HTMLDivElement | undefined;
    let footerEntered = $state(false);
    let lastX: number | null = null;
    let scrollContainerEl: HTMLDivElement | null = null;
    const prefersReducedMotion =
        typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    gsap.registerPlugin(ScrambleTextPlugin);

    function isMobileViewport() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    function applyFooterTransform() {
        if (!footerMoveEl || !motionEnabled) return;
        if (!footerWrapEl) return;

        if (isMobileViewport()) {
            footerMoveEl.style.transform = "translate3d(0, 0px, 0)";
            return;
        }

        const rect = (footerSectionEl ?? footerWrapEl).getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / viewportHeight));
        let scrollShift = -(1 - progress) * FOOTER_SHIFT_MAX;

        // Once the footer section reaches the snapped position, lock to zero shift.
        if (rect.top <= 0 || Math.abs(scrollShift) < 0.5) {
            scrollShift = 0;
        }

        footerMoveEl.style.transform = `translate3d(0, ${scrollShift}px, 0)`;
    }

    function handleMouseMove(event: MouseEvent) {
        if (!motionEnabled || isMobileViewport()) return;

        const x = event.clientX;
        if (lastX === null) {
            lastX = x;
            return;
        }

        const delta = Math.abs(x - lastX);
        if (delta >= MOUSE_STEP) {
            lastX = x;
        }
    }

    function resetMouseState() {
        lastX = null;
        applyFooterTransform();
    }

    function scrambleHover(event: MouseEvent, text: string) {
        if (prefersReducedMotion) return;

        const currentTarget = event.currentTarget as HTMLElement | null;
        if (!currentTarget) return;
        const target = (currentTarget.querySelector(".hover-scramble") as HTMLElement | null) || currentTarget;

        const timeline = gsap.timeline();
        timeline.to(target, { width: `${target.offsetWidth}px`, duration: 0 });
        timeline.to(target, { duration: 0.5, scrambleText: { text, chars: "lowerCase" } });
        timeline.to(target, { width: "auto", duration: 0 });
    }

    onMount(() => {
        scrollContainerEl = document.querySelector(".snap-container");

        const onScroll = () => applyFooterTransform();
        const onResize = () => {
            if (!motionEnabled || isMobileViewport()) {
                resetMouseState();
            }
            applyFooterTransform();
        };

        const entryObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) footerEntered = true;
                });
            },
            { threshold: 0.18, root: scrollContainerEl }
        );

        if (footerWrapEl) entryObserver.observe(footerWrapEl);

        applyFooterTransform();
        if (scrollContainerEl) {
            scrollContainerEl.addEventListener("scroll", onScroll, { passive: true });
        } else {
            window.addEventListener("scroll", onScroll, { passive: true });
        }
        window.addEventListener("resize", onResize);

        return () => {
            entryObserver.disconnect();
            if (scrollContainerEl) {
                scrollContainerEl.removeEventListener("scroll", onScroll);
            } else {
                window.removeEventListener("scroll", onScroll);
            }
            window.removeEventListener("resize", onResize);
        };
    });

    onDestroy(() => {
        if (footerMoveEl) footerMoveEl.style.transform = "";
    });
</script>

<section id="footer" class="nc-padding-bottom-s nc-bg-black nc-color-blue" bind:this={footerSectionEl}>
    <FooterCta line1="Have an Idea?" line2="Let's Make it Happen." buttonText="Get in touch" {motionEnabled} />

    <div
        class="footer-ani-wrapper nc-padding-x-m nc-padding-bottom-s"
        class:is-entered={footerEntered}
        bind:this={footerWrapEl}
        role="presentation"
        onmousemove={handleMouseMove}
    >
        <div class="footer-ani" bind:this={footerMoveEl}>
            <div class="nc-padding-y-l footer-main-wrap">
                <div class="row row-right footer-nav-row">
                    <div class="col-6 col-12-sm"></div>

                    <div class="col-6 col-12-sm">
                        <div class="footer-links row">
                            <div class="col-4 col-12-sm">
                                <a
                                    href={homeHref}
                                    class="nc-h1 nc-margin-bottom-s footer-link"
                                    onclick={(e) => e.preventDefault()}
                                    onmouseenter={(e) => scrambleHover(e, "Home")}
                                ><span class="hover-scramble">Home</span></a><br />
                                <a
                                    href={studioHref}
                                    class="nc-h1 footer-link"
                                    onclick={(e) => e.preventDefault()}
                                    onmouseenter={(e) => scrambleHover(e, "Studio")}
                                ><span class="hover-scramble">Studio</span></a>
                            </div>
                            <div class="col-4 col-12-sm">
                                <a
                                    href={aboutHref}
                                    class="nc-h1 nc-margin-bottom-s footer-link"
                                    onclick={(e) => e.preventDefault()}
                                    onmouseenter={(e) => scrambleHover(e, "About")}
                                ><span class="hover-scramble">About</span></a><br />
                                <a
                                    href={contactHref}
                                    class="nc-h1 footer-link"
                                    onclick={(e) => e.preventDefault()}
                                    onmouseenter={(e) => scrambleHover(e, "Contact")}
                                ><span class="hover-scramble">Contact</span></a>
                            </div>
                            <div class="col-4 col-12-sm">
                                <a
                                    class="nc-h1 nc-margin-bottom-s footer-link"
                                    href={linkedinHref}
                                    onclick={(e) => e.preventDefault()}
                                    onmouseenter={(e) => scrambleHover(e, "LinkedIn")}
                                >
                                    <div class="link-text"><span class="hover-scramble">LinkedIn</span></div>
                                </a><br />
                                <a
                                    class="nc-h1 footer-link"
                                    href={notesHref}
                                    onclick={(e) => e.preventDefault()}
                                    onmouseenter={(e) => scrambleHover(e, "Notes")}
                                >
                                    <div class="link-text"><span class="hover-scramble">Notes</span></div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="footer-brand-row" aria-hidden="true">
                    <div class="brand-nkd">TJ25</div>
                    <div class="brand-city-track">
                        <div class="brand-city-text">Tejas Sahoo</div>
                    </div>
                </div>

                <div class="footer-bottom-line nc-margin-y-s">
                    <div>
                        <a href={instagramHref} class="f-bottom-link" onclick={(e) => e.preventDefault()}>Instagram</a>
                    </div>
                    <div>
                        <span class="nc-copy-rights">All Rights Reserved © TJ25 {year}.</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .nc-bg-black {
        background: #050516;
    }

    .nc-color-blue {
        color: #0004eb;
    }

    .nc-h1 {
        font-family: "Zalando Sans", sans-serif;
        font-size: 48px;
        font-weight: 500;
        letter-spacing: -0.03em;
        line-height: 110%;
    }

    @media (max-width: 1024px) {
        .nc-h1 {
            font-size: 34px;
        }
    }

    @media (max-width: 769px) {
        .nc-h1 {
            font-size: 28px;
        }
    }

    .row {
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        grid-column-gap: 6px;
    }

    @media (min-width: 768px) {
        .row {
            grid-column-gap: 12px;
        }
    }

    .row-right {
        justify-content: end;
    }

    .col-4 {
        grid-column: span 4;
    }

    .col-6 {
        grid-column: span 6;
    }

    @media (max-width: 768px) {
        .col-12-sm {
            grid-column: span 12;
        }
    }

    .nc-padding-x-m {
        padding-left: 40px;
        padding-right: 40px;
    }

    .nc-padding-bottom-s {
        padding-bottom: 12px;
    }

    .nc-padding-y-l {
        padding-top: 70px;
        padding-bottom: 70px;
    }

    .nc-margin-bottom-s {
        margin-bottom: 12px;
    }

    .nc-margin-y-s {
        margin-top: 12px;
        margin-bottom: 12px;
    }

    @media (max-width: 769px) {
        .nc-padding-x-m {
            padding-left: 20px;
            padding-right: 20px;
        }

        .nc-padding-bottom-s {
            padding-bottom: 6px;
        }

        .nc-padding-y-l {
            padding-top: 35px;
            padding-bottom: 35px;
        }

        .nc-margin-bottom-s {
            margin-bottom: 6px;
        }

        .nc-margin-y-s {
            margin-top: 6px;
            margin-bottom: 6px;
        }
    }

    .footer-ani-wrapper {
        overflow: visible;
        opacity: 0;
        transition: opacity 0.95s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .footer-ani-wrapper.is-entered {
        opacity: 1;
    }

    .footer-ani {
        transition: transform 0.1s linear;
        will-change: transform;
    }

    .footer-main-wrap {
        min-height: 350px;
    }

    .footer-nav-row {
        margin-bottom: 42px;
    }

    .footer-brand-row {
        align-items: stretch;
        display: flex;
        margin-bottom: 16px;
        width: 100%;
    }

    .brand-nkd {
        color: #0004eb;
        font-family: "Zalando Sans", sans-serif;
        font-size: clamp(120px, 14vw, 190px);
        font-weight: 700;
        letter-spacing: -0.04em;
        line-height: 0.68;
        margin-right: 18px;
    }

    .brand-city-track {
        align-items: center;
        background: #0004eb;
        display: flex;
        flex: 1;
        justify-content: flex-end;
        min-height: 130px;
        padding-right: 22px;
    }

    .brand-city-text {
        color: #050516;
        font-family: "Zalando Sans", sans-serif;
        font-size: clamp(48px, 5.5vw, 70px);
        font-weight: 700;
        letter-spacing: -0.03em;
        line-height: 0.9;
    }

    .footer-links {
        border-bottom: 1px solid transparent;
    }

    @media (max-width: 769px) {
        .footer-links {
            border-bottom: 1px solid #0004eb;
            margin-bottom: 20px;
            padding-bottom: 5px;
        }
    }

    .footer-link {
        border-bottom: 1px solid transparent;
        display: inline-block;
        position: relative;
        text-decoration: none;
        transition: color 0.35s ease, border-bottom-color 0.35s ease;
        color: #0004eb;
    }

    .footer-link:hover {
        border-bottom-color: currentColor;
        color: #979797;
    }

    @media (max-width: 769px) {
        .footer-link {
            margin-bottom: 15px;
        }
    }

    .link-text {
        display: inline-block;
        position: relative;
    }

    .hover-scramble {
        display: inline-block;
    }

    .footer-bottom-line {
        display: flex;
        justify-content: space-between;
        font-family: "Zalando Sans", sans-serif;
        font-size: 28px;
        letter-spacing: -0.01em;
        line-height: 1;
    }

    .f-bottom-link,
    .nc-copy-rights {
        font-size: 24px;
        color: #0004eb;
    }

    .f-bottom-link {
        border-bottom: 1px solid transparent;
        text-decoration: none;
        transition: border-bottom-color 0.35s ease, color 0.35s ease;
    }

    .f-bottom-link:hover {
        border-bottom-color: currentColor;
        color: #979797;
    }

    @media (max-width: 769px) {
        .footer-main-wrap {
            min-height: auto;
        }

        .footer-nav-row {
            margin-bottom: 16px;
        }

        .footer-brand-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
        }

        .brand-nkd {
            font-size: clamp(100px, 26vw, 150px);
            line-height: 0.7;
            margin-right: 0;
        }

        .brand-city-track {
            min-height: 96px;
            width: 100%;
        }

        .brand-city-text {
            font-size: clamp(42px, 11vw, 62px);
        }

        .footer-bottom-line {
            border-bottom: 1px solid #0004eb;
            flex-direction: column;
            font-size: 14px;
            gap: 8px;
            padding-bottom: 12px;
            width: 100%;
        }

        .f-bottom-link,
        .nc-copy-rights {
            font-size: 14px;
        }

        .f-bottom-link,
        .nc-copy-rights {
            display: block;
            padding: 4px 0;
        }
    }
</style>
