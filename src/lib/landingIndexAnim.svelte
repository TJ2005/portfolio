<script lang="ts">
	import { VariableTextTweener, Easing } from '@studioursus/variable-width-text-core';
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';
	import { fly, fade } from 'svelte/transition';

	interface Props {
		activeSection?: string;
		startAnimation?: boolean;
		currentSlide?: number;
	}

	let { activeSection = 'home', startAnimation = false, currentSlide = 0 }: Props = $props();
	let viewportWidth = $state(1200);
	let isMobile = $derived(viewportWidth <= 768);
	let mobileIndexOpen = $state(false);

	const MENU_ITEM_GAP = new Tween(2, { duration: 800, easing: cubicInOut });

	const MENU_WEIGHT_DEFAULT = 300;
	const MENU_WEIGHT_HOVER = 600;
	const MENU_WEIGHT_ACTIVE = 600;

	const HOME_NAME_WEIGHT_INITIAL = 240;
	const HOME_NAME_WEIGHT_BOLD = 600;
	const HOME_NAME_APPEAR_DELAY = 260;
	const HOME_NAME_BOLD_DURATION = 520;
	const HOME_POST_BOLD_PAUSE = 480;
	const HOME_NAME_MOVE_DURATION = 700;
	const HOME_TAGLINE_DELAY = 240;
	const HOME_INDEX_STAGGER = 190;
	const TOP_LEFT_FULL_HOLD = 120;
	const TOP_LEFT_MOVE_DURATION = 560;
	const TOP_LEFT_POST_MOVE_HOLD = 220;
	const TOP_LEFT_INITIALS_HOLD = 260;
	const TOP_LEFT_WEIGHT_FULL = 600;
	const TOP_LEFT_WEIGHT_INITIALS = 600;
	const TOP_LEFT_WEIGHT_FINAL = 600;
	const TOP_LEFT_TRAVEL_START_X = 50;
	const TOP_LEFT_TRAVEL_START_Y = 50;
	const TOP_LEFT_FONT_FULL = 32;
	const TOP_LEFT_FONT_FINAL = 36;
	const TOP_LEFT_LETTER_SPACING_FULL = -0.08;
	const TOP_LEFT_LETTER_SPACING_FINAL = -0.06;
	const INDEX_LEFT_CASCADE_STAGGER = 85;
	const INDEX_LEFT_CASCADE_DURATION = 620;
	const INDEX_LEFT_CASCADE_VIEWPORT_RATIO = 0.1;
	const INDEX_LEFT_CASCADE_MIN_OFFSET = 84;
	const MENU_DOCK_HORIZONTAL_DURATION = 820;
	const MENU_DOCK_VERTICAL_DURATION = 980;
	const HOME_RECENTER_SETTLE_DELAY = 180;
	const TOP_LEFT_RETURN_FADE_DURATION = 320;

	const menuItems = [
		{ id: 'about', label: 'About Me', roman: 'I' },
		{ id: 'work', label: 'Work Experience', roman: 'II' },
		{ id: 'education', label: 'Education', roman: 'III' },
		{ id: 'cs-stack', label: 'Computer Science Stack', roman: 'IV' },
		{ id: 'projects', label: 'Projects', roman: 'V' },
		{ id: 'contact', label: "Let's get in Touch", roman: 'VI' }
	];

	let indexItemXOffsets = $state<number[]>(menuItems.map(() => 0));
	let indexItemInstantSet = $state<boolean[]>(menuItems.map(() => false));

	const containerX = new Tween(50, { duration: 800, easing: cubicInOut });
	const containerY = new Tween(50, { duration: 800, easing: cubicInOut });

	const bgOpacity = new Tween(0.3, { duration: 50, easing: cubicInOut });
	const bgBlur = new Tween(4, { duration: 600, easing: cubicInOut });

	const topLeftTitleOpacity = new Tween(0, { duration: 600, easing: cubicInOut });
	let topLeftTitleWeight = $state(300);
	const topLeftTitleWeightTweener = new VariableTextTweener({
		duration: 600,
		easing: Easing.easeInOutCubic,
		onUpdate: (value) => {
			topLeftTitleWeight = value;
		}
	});

	let homeNameWeight = $state(HOME_NAME_WEIGHT_INITIAL);
	let homeNameVisible = $state(false);
	let homeNameAtTop = $state(false);
	let homeTaglineVisible = $state(false);
	let homeIndexVisible = $state(false);
	let homeVisibleItemCount = $state(0);
	let homeIntroPlayed = $state(false);
	let homeIntroRunning = $state(false);
	let homeIntroToken = 0;
	let homeRecentering = $state(false);
	let homeTaglineReady = $state(true);
	let homeBgReady = $state(true);
	let homeRecenterToken = 0;
	let previousSlideForHomeRecenter: number | null = null;

	let previousSlideForDock: number | null = null;
	let allowDockTransition = $state(true);

	type TopLeftMorphStage = 'full' | 'initials' | 'final';
	let topLeftMorphStage = $state<TopLeftMorphStage>('full');
	let topLeftMorphToken = 0;
	let topLeftMorphRunning = false;
	let topLeftTravelVisible = $state(false);
	let topLeftTravelAtTarget = $state(false);
	let topLeftFadingOut = $state(false);
	let previousSlideForTopLeft: number | null = null;
	let previousSlideForIndexCascade: number | null = null;
	let indexCascadeToken = 0;

	$effect(() => {
		if (!isMobile || activeSection === 'footer') {
			mobileIndexOpen = false;
		}
	});

	function wait(ms: number) {
		return new Promise<void>((resolve) => setTimeout(resolve, ms));
	}

	async function runHomeRecenterSequence() {
		const token = ++homeRecenterToken;
		homeRecentering = true;
		homeTaglineReady = false;
		homeBgReady = false;

		await wait(MENU_DOCK_VERTICAL_DURATION);

		if (token !== homeRecenterToken || currentSlide !== 0) {
			return;
		}

		homeRecentering = false;
		homeBgReady = true;

		await wait(HOME_RECENTER_SETTLE_DELAY);

		if (token !== homeRecenterToken || currentSlide !== 0) {
			return;
		}

		homeTaglineReady = true;
	}

	function getIndexCascadeStartOffsetPx() {
		if (typeof window === 'undefined') {
			return 360;
		}
		return Math.max(
			INDEX_LEFT_CASCADE_MIN_OFFSET,
			Math.round(window.innerWidth * INDEX_LEFT_CASCADE_VIEWPORT_RATIO)
		);
	}

	function resetIndexItemXOffsets() {
		for (let i = 0; i < indexItemXOffsets.length; i += 1) {
			indexItemXOffsets[i] = 0;
			indexItemInstantSet[i] = false;
		}
	}

	function cancelIndexLeftCascade() {
		indexCascadeToken += 1;
	}

	async function runIndexLeftCascade(targetSlide: number, direction: 1 | -1, reverseOrder = false) {
		const token = ++indexCascadeToken;
		const startOffset = getIndexCascadeStartOffsetPx() * direction;
		const itemCount = indexItemXOffsets.length;

		function triggerCascadeStep(index: number) {
			if (token !== indexCascadeToken || currentSlide !== targetSlide) {
				return;
			}

			// Set the row start offset instantly, then animate only the settle pass.
			indexItemInstantSet[index] = true;
			indexItemXOffsets[index] = startOffset;

			setTimeout(() => {
				if (token !== indexCascadeToken || currentSlide !== targetSlide) {
					return;
				}
				indexItemInstantSet[index] = false;
				indexItemXOffsets[index] = 0;
			}, 16);
		}

		for (let i = 0; i < itemCount; i += 1) {
			const index = reverseOrder ? itemCount - 1 - i : i;
			if (i === 0) {
				triggerCascadeStep(index);
				continue;
			}

			setTimeout(() => {
				triggerCascadeStep(index);
			}, i * INDEX_LEFT_CASCADE_STAGGER);
		}
	}

	// Delay home-only visuals until the recenter transition has completed.
	$effect(() => {
		const next = currentSlide;

		if (previousSlideForHomeRecenter === null) {
			previousSlideForHomeRecenter = next;
			homeRecentering = false;
			homeTaglineReady = next === 0;
			homeBgReady = next === 0;
			return;
		}

		const previous = previousSlideForHomeRecenter;
		const isEnteringHome = previous > 0 && next === 0;

		if (isEnteringHome) {
			runHomeRecenterSequence();
		} else {
			homeRecenterToken += 1;
			homeRecentering = false;
			homeTaglineReady = next === 0;
			homeBgReady = next === 0;
		}

		previousSlideForHomeRecenter = next;
	});

	function getMenuContainerTransition() {
		if (!allowDockTransition) {
			return 'none';
		}

		const vertical = `top ${MENU_DOCK_VERTICAL_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1), transform ${MENU_DOCK_VERTICAL_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1)`;
		return `left ${MENU_DOCK_HORIZONTAL_DURATION}ms cubic-bezier(0.65, 0, 0.35, 1), ${vertical}`;
	}

	function resetHomeIntroState() {
		homeNameWeight = HOME_NAME_WEIGHT_INITIAL;
		homeNameVisible = false;
		homeNameAtTop = false;
		homeTaglineVisible = false;
		homeIndexVisible = false;
		homeVisibleItemCount = 0;
	}

	function setHomeIntroFinalState() {
		homeNameWeight = HOME_NAME_WEIGHT_BOLD;
		homeNameVisible = true;
		homeNameAtTop = true;
		homeTaglineVisible = true;
		homeIndexVisible = true;
		homeVisibleItemCount = menuItems.length;
	}

	function cancelHomeIntro() {
		homeIntroToken += 1;
		homeIntroRunning = false;
	}

	async function runHomeIntroSequence() {
		if (homeIntroRunning || homeIntroPlayed || currentSlide !== 0) {
			return;
		}

		homeIntroRunning = true;
		const token = ++homeIntroToken;

		resetHomeIntroState();
		homeNameVisible = true;
		await wait(HOME_NAME_APPEAR_DELAY);

		if (token !== homeIntroToken || currentSlide !== 0) {
			homeIntroRunning = false;
			return;
		}

		homeNameWeight = HOME_NAME_WEIGHT_BOLD;
		await wait(HOME_NAME_BOLD_DURATION);

		if (token !== homeIntroToken || currentSlide !== 0) {
			homeIntroRunning = false;
			return;
		}

		await wait(HOME_POST_BOLD_PAUSE);

		if (token !== homeIntroToken || currentSlide !== 0) {
			homeIntroRunning = false;
			return;
		}

		homeNameAtTop = true;
		await wait(HOME_NAME_MOVE_DURATION);

		if (token !== homeIntroToken || currentSlide !== 0) {
			homeIntroRunning = false;
			return;
		}

		homeTaglineVisible = true;
		await wait(HOME_TAGLINE_DELAY);

		if (token !== homeIntroToken || currentSlide !== 0) {
			homeIntroRunning = false;
			return;
		}

		homeIndexVisible = true;
		for (let i = 0; i < menuItems.length; i += 1) {
			homeVisibleItemCount = i + 1;
			await wait(HOME_INDEX_STAGGER);

			if (token !== homeIntroToken || currentSlide !== 0) {
				homeIntroRunning = false;
				return;
			}
		}

		homeIntroPlayed = true;
		homeIntroRunning = false;
	}

	// Move the index card between center (home) and bottom-left (other slides).
	$effect(() => {
		if (currentSlide === 0) {
			containerX.set(50);
			containerY.set(50);
			MENU_ITEM_GAP.set(homeRecentering ? 0.5 : 2);
			bgOpacity.set(homeBgReady ? 0.3 : 0);
			bgBlur.set(homeBgReady ? 4 : 0);
			topLeftTitleOpacity.set(0);
		} else if (currentSlide === 1) {
			containerX.set(0);
			containerY.set(100);
			MENU_ITEM_GAP.set(0.5);
			bgOpacity.set(0);
			bgBlur.set(0);
			topLeftTitleOpacity.set(1);
		} else {
			containerX.set(0);
			containerY.set(100);
			MENU_ITEM_GAP.set(0.5);
			bgOpacity.set(0);
			bgBlur.set(0);
			topLeftTitleOpacity.set(1);
		}
	});

	// Keep docked index sticky on reverse non-home moves (e.g. 2 -> 1),
	// but preserve forward behavior (e.g. 1 -> 2).
	$effect(() => {
		const next = currentSlide;

		if (previousSlideForDock === null) {
			previousSlideForDock = next;
			allowDockTransition = true;
			return;
		}

		const previous = previousSlideForDock;
		const isCrossingHome = previous === 0 || next === 0;
		const isReverseNonHome = previous > next && previous > 0 && next > 0;

		allowDockTransition = isCrossingHome || !isReverseNonHome;
		previousSlideForDock = next;
	});

	// Downward move stays unified on the container; leftward settle cascades per index row.
	$effect(() => {
		const next = currentSlide;

		if (previousSlideForIndexCascade === null) {
			previousSlideForIndexCascade = next;
			resetIndexItemXOffsets();
			return;
		}

		const previous = previousSlideForIndexCascade;
		const isLeavingHome = previous === 0 && next > 0;
		const isEnteringHome = previous > 0 && next === 0;

		if (isLeavingHome) {
			runIndexLeftCascade(next, 1);
		} else if (isEnteringHome) {
			// Start reverse cascade instantly from the first row for a clearer return-to-center motion.
			runIndexLeftCascade(next, -1, false);
		} else {
			cancelIndexLeftCascade();
			resetIndexItemXOffsets();
		}

		previousSlideForIndexCascade = next;
	});

	// Run the home intro once: name appears -> emboldens -> slides up -> reveal tagline + index.
	$effect(() => {
		if (currentSlide !== 0) {
			cancelHomeIntro();
			if (startAnimation) {
				homeIntroPlayed = true;
			}
			setHomeIntroFinalState();
			return;
		}

		if (!startAnimation) {
			if (!homeIntroPlayed) {
				resetHomeIntroState();
			} else {
				setHomeIntroFinalState();
			}
			return;
		}

		if (!homeIntroPlayed) {
			runHomeIntroSequence();
		} else {
			setHomeIntroFinalState();
		}
	});

	let itemWeights: Record<string, number> = $state({});
	let itemTweeners: Record<string, VariableTextTweener> = {};
	let hoveredItem: string | null = $state(null);

	menuItems.forEach((item) => {
		itemWeights[item.id] = MENU_WEIGHT_DEFAULT;
		itemTweeners[item.id] = new VariableTextTweener({
			duration: 300,
			easing: Easing.easeInOutCubic,
			onUpdate: (value) => {
				itemWeights[item.id] = value;
			}
		});
		itemTweeners[item.id].animateTo(MENU_WEIGHT_DEFAULT);
	});

	$effect(() => {
		const slide = currentSlide;
		const section = activeSection;
		const hovered = hoveredItem;

		menuItems.forEach((item) => {
			if (hovered === item.id) {
				itemTweeners[item.id].animateTo(MENU_WEIGHT_HOVER);
			} else if (slide === 0) {
				itemTweeners[item.id].animateTo(MENU_WEIGHT_DEFAULT);
			} else if (item.id === section) {
				itemTweeners[item.id].animateTo(MENU_WEIGHT_ACTIVE);
			} else {
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
			if (isMobile) {
				mobileIndexOpen = false;
			}
		}
	}

	function getItemOpacity(itemId: string): number {
		if (currentSlide === 0) {
			return 1;
		}
		return itemId === activeSection ? 1 : 0.7;
	}

	function getMenuItemOpacity(index: number): number {
		if (isMobile) {
			return 1;
		}

		if (currentSlide !== 0) {
			return 1;
		}
		return homeIndexVisible && index < homeVisibleItemCount ? 1 : 0;
	}

	function canInteractWithMenuItem(index: number): boolean {
		if (isMobile) {
			return true;
		}

		if (currentSlide !== 0) {
			return true;
		}
		return homeIndexVisible && index < homeVisibleItemCount;
	}

	function cancelTopLeftMorph() {
		topLeftMorphToken += 1;
		topLeftMorphRunning = false;
		topLeftFadingOut = false;
	}

	async function runTopLeftMorphSequence() {
		if (topLeftMorphRunning) {
			return;
		}

		topLeftMorphRunning = true;
		const token = ++topLeftMorphToken;
		topLeftFadingOut = false;

		topLeftMorphStage = 'full';
		topLeftTravelVisible = true;
		topLeftTravelAtTarget = false;
		topLeftTitleWeight = TOP_LEFT_WEIGHT_FULL;
		topLeftTitleWeightTweener.animateTo(TOP_LEFT_WEIGHT_FULL);
		await wait(TOP_LEFT_FULL_HOLD);

		if (token !== topLeftMorphToken || currentSlide === 0) {
			topLeftMorphRunning = false;
			return;
		}

		await wait(16);

		if (token !== topLeftMorphToken || currentSlide === 0) {
			topLeftMorphRunning = false;
			return;
		}

		topLeftTravelAtTarget = true;
		await wait(TOP_LEFT_MOVE_DURATION);

		if (token !== topLeftMorphToken || currentSlide === 0) {
			topLeftMorphRunning = false;
			return;
		}

		await wait(TOP_LEFT_POST_MOVE_HOLD);

		if (token !== topLeftMorphToken || currentSlide === 0) {
			topLeftMorphRunning = false;
			return;
		}

		topLeftMorphStage = 'initials';
		topLeftTitleWeightTweener.animateTo(TOP_LEFT_WEIGHT_INITIALS);
		await wait(TOP_LEFT_INITIALS_HOLD);

		if (token !== topLeftMorphToken || currentSlide === 0) {
			topLeftMorphRunning = false;
			return;
		}

		topLeftMorphStage = 'final';
		topLeftTitleWeightTweener.animateTo(TOP_LEFT_WEIGHT_FINAL);
		topLeftMorphRunning = false;
	}

	async function runTopLeftReturnSequence() {
		topLeftMorphRunning = true;
		const token = ++topLeftMorphToken;

		topLeftTravelVisible = true;
		topLeftTravelAtTarget = true;
		topLeftMorphStage = 'final';
		topLeftTitleWeightTweener.animateTo(TOP_LEFT_WEIGHT_FINAL);
		topLeftFadingOut = true;

		await wait(TOP_LEFT_RETURN_FADE_DURATION);

		if (token !== topLeftMorphToken || currentSlide !== 0) {
			topLeftMorphRunning = false;
			return;
		}

		topLeftTravelVisible = false;
		topLeftFadingOut = false;
		topLeftMorphStage = 'full';
		topLeftTravelAtTarget = false;
		topLeftTitleWeightTweener.animateTo(MENU_WEIGHT_DEFAULT);
		topLeftMorphRunning = false;
	}

	// Morph top-left title from full name to TJ25 when leaving home slide.
	$effect(() => {
		const next = currentSlide;

		if (previousSlideForTopLeft === null) {
			previousSlideForTopLeft = next;
			if (next === 0) {
				topLeftMorphStage = 'full';
				topLeftTravelVisible = false;
				topLeftTravelAtTarget = false;
				topLeftFadingOut = false;
				topLeftTitleWeightTweener.animateTo(MENU_WEIGHT_DEFAULT);
			} else {
				topLeftMorphStage = 'final';
				topLeftTravelVisible = true;
				topLeftTravelAtTarget = true;
				topLeftFadingOut = false;
				topLeftTitleWeightTweener.animateTo(TOP_LEFT_WEIGHT_FINAL);
			}
			return;
		}

		const previous = previousSlideForTopLeft;

		if (next === 0) {
			if (previous > 0) {
				cancelTopLeftMorph();
				runTopLeftReturnSequence();
			} else {
				cancelTopLeftMorph();
				topLeftMorphStage = 'full';
				topLeftTravelVisible = false;
				topLeftTravelAtTarget = false;
				topLeftFadingOut = false;
				topLeftTitleWeightTweener.animateTo(MENU_WEIGHT_DEFAULT);
			}
		} else if (previous === 0) {
			cancelTopLeftMorph();
			runTopLeftMorphSequence();
		} else {
			cancelTopLeftMorph();
			topLeftMorphStage = 'final';
			topLeftTravelVisible = true;
			topLeftTravelAtTarget = true;
			topLeftFadingOut = false;
			topLeftTitleWeightTweener.animateTo(TOP_LEFT_WEIGHT_FINAL);
		}

		previousSlideForTopLeft = next;
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<!-- Top-left title (appears on slide 1+) -->
{#if !isMobile && activeSection !== 'footer' && (currentSlide >= 1 || topLeftTravelVisible)}
	<div
		class="top-left-title"
		style="
            position: fixed;
            top: {topLeftTravelAtTarget ? '2rem' : `${TOP_LEFT_TRAVEL_START_Y}%`};
            left: {topLeftTravelAtTarget ? '2rem' : `${TOP_LEFT_TRAVEL_START_X}%`};
            transform: {topLeftTravelAtTarget ? 'translate(0, 0)' : 'translate(-50%, -50%)'};
            z-index: 100;
            opacity: {topLeftFadingOut ? 0 : 1};
            transition: left 0.62s cubic-bezier(0.22, 1, 0.36, 1), top 0.62s cubic-bezier(0.22, 1, 0.36, 1), transform 0.62s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.32s ease;
        "
	>
		<div
			class="zalando"
			style="
                font-size: {topLeftMorphStage === 'full'
				? `${TOP_LEFT_FONT_FULL}px`
				: `${TOP_LEFT_FONT_FINAL}px`};
                line-height: 1em;
                letter-spacing: {topLeftMorphStage === 'full'
				? `${TOP_LEFT_LETTER_SPACING_FULL}em`
				: `${TOP_LEFT_LETTER_SPACING_FINAL}em`};
                font-weight: {topLeftTitleWeight};
                color: {topLeftMorphStage === 'full' ? 'white' : 'var(--color-blue)'};
                filter: {topLeftMorphStage === 'full'
				? 'none'
				: 'drop-shadow(0 2px 8px rgba(25, 0, 255, 0.3))'};
                white-space: nowrap;
                transition: color 0.62s ease, font-weight 0.52s ease, filter 0.62s ease, font-size 0.54s ease, letter-spacing 0.54s ease;
            "
		>
			{#if topLeftMorphStage === 'full'}
				Tejas Kamal <br />Sahoo
			{:else}
				<span class="tj-mark"
					><span class="tj-initials">TJ</span><span
						class="tj-suffix"
						class:visible={topLeftMorphStage === 'final'}>25</span
					></span
				>
			{/if}
		</div>
	</div>
{/if}

{#if activeSection !== 'footer'}
	<div
		class="menu-container"
		class:mobile-drawer={isMobile}
		in:fade={{ duration: 850 }}
		style="
            position: fixed;
            {isMobile
			? `left: 0.5rem; top: 50%; bottom: auto; transform: translate(${mobileIndexOpen ? '0' : 'calc(-100% + 0.1rem)'}, -50%);`
			: currentSlide === 0
				? `left: ${containerX.current}%; top: ${containerY.current}%; bottom: auto; transform: translate(-50%, -50%);`
				: 'left: 2rem; top: calc(100% - 2rem); bottom: auto; transform: translate(0, -100%);'}
            z-index: {isMobile ? 130 : 100};
            transition: {isMobile
			? 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)'
			: getMenuContainerTransition()};
        "
	>
		{#if isMobile}
			<button
				type="button"
				class="mobile-index-toggle"
				aria-label={mobileIndexOpen ? 'Close index' : 'Open index'}
				aria-expanded={mobileIndexOpen}
				onclick={() => (mobileIndexOpen = !mobileIndexOpen)}
			>
				{mobileIndexOpen ? '<' : '>'}
			</button>
		{/if}

		<!-- Gradient blur backdrop -->
		{#if currentSlide === 10}
			<div class="blur-backdrop"></div>
			<div class="white-glow"></div>
		{/if}

		<div
			class="index-shell min-w-[20em]"
			class:mobile-shell={isMobile}
			class:py-[0.875em]={currentSlide === 0}
			class:pt-[0.875em]={currentSlide !== 0}
			class:pb-0={currentSlide !== 0}
			class:px-[1.125em]={currentSlide === 0}
			in:fly={{ y: -40, duration: 1000 }}
			style="background-color: rgba(25, 0, 255, {bgOpacity.current}); backdrop-filter:blur({bgBlur.current}px); transition: all 0.6s ease; position: relative; z-index: 2;"
		>
			<div class="home-stage">
				<div
					class="zalando hero-name text-[2em]"
					class:centered={currentSlide === 0 && !homeNameAtTop && !homeRecentering}
					class:at-top={currentSlide === 0 && homeNameAtTop && !homeRecentering}
					class:visible={currentSlide === 0 && homeNameVisible && !homeRecentering}
					class:non-home={currentSlide !== 0}
					style="
                        line-height:1em;
                        letter-spacing:-0.08em;
                        font-weight:{homeNameWeight};
                        color: white;
                    "
				>
					Tejas Kamal <br />Sahoo
				</div>

				<div
					class="home-details"
					class:visible={isMobile || currentSlide !== 0 || homeTaglineVisible || homeIndexVisible}
					class:home-slide={currentSlide === 0}
					class:docked-bottom={currentSlide > 1}
				>
					<div
						class="home-tagline"
						style="opacity: {currentSlide === 0 && homeTaglineVisible && homeTaglineReady
							? 1
							: 0}; pointer-events: none;"
					>
						<p class="mondwest pt-[2em] text-[1.125em] text-white">I Build. I Create.</p>
					</div>

					<div id="item-menu">
						<ul class="list-none p-0">
							{#each menuItems as item, index (item.id)}
								<li
									class="home-index-item w-full"
									style="
                                        opacity: {getMenuItemOpacity(index)};
                                        pointer-events: {canInteractWithMenuItem(index)
										? 'auto'
										: 'none'};
                                        transform: translate3d({indexItemXOffsets[index]}px, 0, 0);
                                        transition: transform {indexItemInstantSet[index]
										? 0
										: INDEX_LEFT_CASCADE_DURATION}ms cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease;
                                    "
								>
									<button
										class="zalando flex w-full cursor-pointer items-center border-none bg-transparent text-left text-[1em] transition-opacity"
										onclick={() => scrollToSection(item.id)}
										style="
                                            font-weight:{itemWeights[item.id]};
                                            opacity: {currentSlide === 0
											? 1
											: getItemOpacity(item.id)};
                                            gap: {MENU_ITEM_GAP.current}rem;
                                            transition: opacity 0.3s ease, color 0.3s ease;
                                            color: {isMobile
											? 'white'
											: activeSection === '' || activeSection === 'home'
												? 'white'
												: 'var(--color-blue)'};
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
	</div>
{/if}

<style>
	.home-stage {
		position: relative;
		min-height: 15.25rem;
	}

	.hero-name {
		position: absolute;
		left: 0;
		top: 0;
		opacity: 0;
		width: max-content;
		transform: translate(0, 0);
		transition:
			opacity 0.4s ease,
			top 0.7s cubic-bezier(0.65, 0, 0.35, 1),
			left 0.7s cubic-bezier(0.65, 0, 0.35, 1),
			transform 0.7s cubic-bezier(0.65, 0, 0.35, 1),
			font-weight 0.52s cubic-bezier(0.65, 0, 0.35, 1);
	}

	.hero-name.centered {
		left: 0;
		top: 50%;
		text-align: left;
		transform: translateY(-50%);
	}

	.hero-name.at-top {
		left: 0;
		top: 0;
		text-align: left;
		transform: translate(0, 0);
	}

	.hero-name.visible {
		opacity: 1;
	}

	.hero-name.non-home {
		opacity: 0;
		transition: none;
	}

	.home-details {
		opacity: 0;
		position: relative;
		transition: opacity 0.45s ease;
	}

	.home-details.visible {
		opacity: 1;
	}

	.home-details.home-slide {
		padding-top: 4.75rem;
	}

	.home-details.docked-bottom {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.home-index-item {
		transition: opacity 0.5s ease;
	}

	.home-tagline {
		transition: opacity 0.42s ease;
	}

	.blur-backdrop {
		position: absolute;
		bottom: -3rem;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% + 20rem);
		height: calc(100% + 7rem);
		backdrop-filter: blur(40px);
		-webkit-backdrop-filter: blur(40px);
		/* fade out on all sides - nothing above the top of the menu */
		mask-image:
			linear-gradient(
				to top,
				rgba(0, 0, 0, 1) 0%,
				rgba(0, 0, 0, 0.9) 40%,
				rgba(0, 0, 0, 0.5) 70%,
				transparent 100%
			),
			linear-gradient(
				to right,
				transparent 0%,
				rgba(0, 0, 0, 0.8) 12%,
				rgba(0, 0, 0, 1) 30%,
				rgba(0, 0, 0, 1) 70%,
				rgba(0, 0, 0, 0.8) 88%,
				transparent 100%
			);
		-webkit-mask-image:
			linear-gradient(
				to top,
				rgba(0, 0, 0, 1) 0%,
				rgba(0, 0, 0, 0.9) 40%,
				rgba(0, 0, 0, 0.5) 70%,
				transparent 100%
			),
			linear-gradient(
				to right,
				transparent 0%,
				rgba(0, 0, 0, 0.8) 12%,
				rgba(0, 0, 0, 1) 30%,
				rgba(0, 0, 0, 1) 70%,
				rgba(0, 0, 0, 0.8) 88%,
				transparent 100%
			);
		mask-composite: intersect;
		-webkit-mask-composite: source-in;
		z-index: 1;
		pointer-events: none;
	}

	.white-glow {
		position: absolute;
		bottom: -3rem;
		left: 50%;
		transform: translateX(-50%);
		width: calc(100% + 40rem);
		height: calc(100% + 7rem);
		background: radial-gradient(
			ellipse at center bottom,
			rgba(255, 255, 255, 0.18) 0%,
			transparent 70%
		);
		z-index: 1;
		pointer-events: none;
	}

	.tj-mark {
		display: inline-flex;
		align-items: baseline;
		line-height: 1;
	}

	.tj-initials,
	.tj-suffix {
		line-height: 1;
	}

	.tj-suffix {
		display: inline-block;
		max-width: 0;
		opacity: 0;
		overflow: hidden;
		margin-left: 0.01em;
		vertical-align: baseline;
		transform: translateY(0);
		transition:
			max-width 0.5s ease,
			opacity 0.5s ease;
	}

	.tj-suffix.visible {
		max-width: 2ch;
		opacity: 1;
	}

	.mobile-index-toggle {
		display: none;
	}

	@media (max-width: 768px) {
		.mobile-index-toggle {
			position: absolute;
			top: 50%;
			right: -1.45rem;
			transform: translateY(-50%);
			width: 1.75rem;
			height: 3.15rem;
			border: 1px solid rgba(25, 0, 255, 0.25);
			border-left: none;
			border-radius: 0 999px 999px 0;
			background: rgba(255, 255, 255, 0.96);
			color: var(--color-blue);
			font-family: 'Zalando Sans', sans-serif;
			font-size: 1.15rem;
			line-height: 1;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			z-index: 4;
		}

		.index-shell.mobile-shell {
			min-width: min(78vw, 19rem);
			padding: 0.85rem 0.85rem 0.55rem;
			background-color: rgba(25, 0, 255, 0.9) !important;
			backdrop-filter: blur(8px);
		}

		.index-shell.mobile-shell .hero-name,
		.index-shell.mobile-shell .home-tagline {
			display: none;
		}

		.index-shell.mobile-shell .home-stage {
			min-height: 0;
		}

		.index-shell.mobile-shell .home-details {
			opacity: 1;
			padding-top: 0;
			position: relative;
		}

		.index-shell.mobile-shell .home-details.docked-bottom {
			position: relative;
			left: auto;
			right: auto;
			bottom: auto;
		}
	}
</style>
