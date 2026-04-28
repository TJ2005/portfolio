<script lang="ts">
	import LoadingAnimator from '$lib/loadingAnimator.svelte';
	import LandingIndexAnim from '$lib/landingIndexAnim.svelte';
	import ScrollParallax from '$lib/ScrollParallax.svelte';
	import ExperienceCard from '$lib/ExperienceCard.svelte';
	import AboutCard from '$lib/AboutCard.svelte';
	import EducationCard from '$lib/EducationCard.svelte';
	import TechStack from '$lib/TechStack.svelte';
	import ProjectsPanel from '$lib/ProjectsPanel.svelte';
	import SiteFooter from '$lib/SiteFooter.svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	const aboutTitleChars = 'ABOUT ME*'.split('');
	const experienceTitleChars = 'EXPERIENCE*'.split('');
	const educationTitleChars = 'EDUCATION*'.split('');
	const expertiseTitleChars = 'MY EXPERTISE*'.split('');
	const projectsTitleChars = 'PROJECTS*'.split('');
	const contactTitleChars = "LET'S GET IN TOUCH*".split('');
	const contactOfferPhrases = [
		'ideas',
		'SaaS Product',
		'Startup MVP',
		'next Big Thing',
		'Tech Solution'
	];
	const MIN_LOADER_DURATION = 5000;

	// Parallax layer configuration (cursor-based)
	const parallaxLayers = [
		{
			id: 'layer-0',
			src: '/layers/Layer 0.png',
			depth: 1.0, // Back layer - moves most
			zIndex: 1,
			alt: 'Background layer'
		},
		{
			id: 'layer-1',
			src: '/layers/Layer 1.png',
			depth: 0.7, // Middle back
			zIndex: 2,
			alt: 'Middle back layer'
		},
		{
			id: 'layer-2',
			src: '/layers/Layer 2.png',
			depth: 0.5, // Middle front
			zIndex: 3,
			alt: 'Middle front layer'
		},
		{
			id: 'layer-3',
			src: '/layers/Layer 3.png',
			depth: 0.3, // Front layer - moves least
			zIndex: 4,
			alt: 'Foreground layer'
		}
	];

	const techStackLogoSources = [
		'/Tech Stack Logos/angularjs 1.png',
		'/Tech Stack Logos/AWS.png',
		'/Tech Stack Logos/Bootstrap.png',
		'/Tech Stack Logos/cloudflare.png',
		'/Tech Stack Logos/Docker.png',
		'/Tech Stack Logos/Framer.png',
		'/Tech Stack Logos/Git.png',
		'/Tech Stack Logos/Mongodb .png',
		'/Tech Stack Logos/React-icon.svg 1-1.png',
		'/Tech Stack Logos/Svelte.png',
		'/Tech Stack Logos/Tailwind.png',
		'/Tech Stack Logos/Vue.js_Logo_2.svg 1.png'
	];

	const preloadImageSources = [
		...parallaxLayers.map((layer) => layer.src),
		...techStackLogoSources
	];

	let currentSlide = $state(0);
	let previousSlide = $state(0);
	let activeSection = $state('home');
	let startAnimation = $state(true);
	let showLoader = $state(true);
	let startMainAnimation = $state(false);
	let assetsLoaded = $state(false);
	let loaderMinimumElapsed = $state(false);
	let contactPhraseIndex = $state(0);

	// Experience data
	const experienceData = [
		{
			companyName: 'Adzzat',
			jobTitle: 'Machine Learning Systems Contributor',
			employmentType: 'Contributor',
			startYear: 'Dec 2025',
			endYear: 'Present',
			responsibilities: [
				'Resolved and structured GitHub issue data for model training and evaluation cycles.',
				'Built validation checks to catch leakage and regression risks early.',
				'Delivered reproducible PRs with clean documentation and versioned workflows.'
			]
		},
		{
			companyName: 'Manorama Supply Chain Solutions Group',
			jobTitle: 'Web Developer / IT Admin',
			employmentType: 'Full Time',
			startYear: 'Oct 2020',
			endYear: 'Present',
			responsibilities: [
				'Own end-to-end web and IT operations across domains, SSL, email infrastructure, and backups.',
				'Built and maintain internal and public-facing systems for logistics operations.',
				'Managed server infrastructure and governance for sensitive BL/MBL documentation flows.',
				'Driving workflow automation to reduce manual errors and improve turnaround time.'
			]
		},
		{
			companyName: 'Codeloom',
			jobTitle: 'Lead Web Developer',
			employmentType: 'Full Time',
			startYear: 'Jan 2025',
			endYear: 'Oct 2026',
			responsibilities: [
				'Led delivery of production websites using React and modern JavaScript stacks.',
				'Owned UI/UX implementation, database optimization, and SEO/performance standards.',
				'Built testing frameworks, custom WordPress plugins, and managed Webflow deployments.',
				'Mentored interns on CLI usage, development workflows, and requirement engineering.'
			]
		}
	];

	// Education data
	const educationData = [
		{
			institutionName: 'SVKM NMIMS',
			degree: 'B.Tech',
			fieldOfStudy: 'Engineering',
			startYear: '2023',
			endYear: '2027',
			achievements: [
				'Pursuing B.Tech in Mumbai',
				'Positions of Responsibility:',
				'Technical Head, Cyber Chakravyuh - led CTF ops and event tech.',
				'Technical and Digital Creatives Head, FOSS MPSTME - managed tech flows and creatives.'
			]
		},
		{
			institutionName: 'DPS Panvel, CBSE',
			degree: 'Class 12',
			fieldOfStudy: 'Science - Mathematics',
			startYear: '2023',
			endYear: '2023',
			achievements: [
				'Completed Senior Secondary education in Navi Mumbai.',
				'During this period, delivered freelance projects in brand development and web development.'
			]
		}
	];

	function hideLoader() {
		if (!assetsLoaded || !loaderMinimumElapsed || !showLoader) return;

		showLoader = false;
		setTimeout(() => {
			startMainAnimation = true;
		}, 300);
	}

	function preloadImage(src: string, timeoutMs = 20000) {
		return new Promise<void>((resolve) => {
			const img = new Image();
			let settled = false;
			const timeout = setTimeout(finish, timeoutMs);

			function finish() {
				if (settled) return;
				settled = true;
				clearTimeout(timeout);
				resolve();
			}

			img.decoding = 'async';
			img.onload = () => {
				if (typeof img.decode === 'function') {
					void img
						.decode()
						.catch(() => undefined)
						.finally(finish);
				} else {
					finish();
				}
			};
			img.onerror = finish;
			img.src = src;
		});
	}

	async function preloadVisualAssets() {
		await Promise.all(preloadImageSources.map((src) => preloadImage(src)));
	}

	onMount(() => {
		const minimumLoaderTimer = setTimeout(() => {
			loaderMinimumElapsed = true;
		}, MIN_LOADER_DURATION);

		void preloadVisualAssets().then(() => {
			assetsLoaded = true;
		});

		return () => clearTimeout(minimumLoaderTimer);
	});

	$effect(() => {
		if (assetsLoaded && loaderMinimumElapsed) {
			hideLoader();
		}
	});

	onMount(() => {
		const rotator = setInterval(() => {
			if (contactPhraseIndex === contactOfferPhrases.length - 1) contactPhraseIndex = 0;
			else contactPhraseIndex++;
		}, 1250);

		return () => clearInterval(rotator);
	});

	const slides = [
		{ id: 'home', label: 'Home', count: 1 },
		{ id: 'about', label: 'About Me - Intro', count: 2, subSlide: 0 },
		{ id: 'about', label: 'About Me - Narrative', count: 3, subSlide: 1 },
		{ id: 'work', label: 'Work Experience', count: 4, subSlide: 0 },
		{ id: 'work', label: 'Work Experience - Job 1', count: 5, subSlide: 1 },
		{ id: 'work', label: 'Work Experience - Job 2', count: 6, subSlide: 2 },
		{ id: 'work', label: 'Work Experience - Job 3', count: 7, subSlide: 3 },
		{ id: 'education', label: 'Education', count: 8, subSlide: 0 },
		{ id: 'education', label: 'Education - Degree 1', count: 9, subSlide: 1 },
		{ id: 'education', label: 'Education - Degree 2', count: 10, subSlide: 2 },
		{ id: 'cs-stack', label: 'Computer Science Stack', count: 11, subSlide: 0 },
		{ id: 'cs-stack', label: 'Computer Science Stack - Detail', count: 12, subSlide: 1 },
		{ id: 'projects', label: 'Projects - Intro', count: 13, subSlide: 0 },
		{ id: 'projects', label: 'Projects - Grid', count: 14, subSlide: 1 },
		{ id: 'contact', label: "Let's get in Touch - Intro", count: 15, subSlide: 0 },
		{ id: 'contact', label: "Let's get in Touch - Detail", count: 16, subSlide: 1 },
		{ id: 'footer', label: 'Footer', count: 17 }
	];

	function updateSlideFromContainer(container: HTMLDivElement) {
		const slideHeight = container.clientHeight || window.innerHeight;
		const scrollPercentage = container.scrollTop / slideHeight;
		const newSlide = Math.round(scrollPercentage);

		if (newSlide === currentSlide) return;

		previousSlide = currentSlide;
		currentSlide = newSlide;

		const nextSection = slides.find((slide) => slide.count === newSlide + 1);
		if (nextSection) {
			activeSection = nextSection.id;
		}
	}

	function trackContainerScroll(container: HTMLDivElement) {
		const handleScroll = () => updateSlideFromContainer(container);
		const frame = requestAnimationFrame(handleScroll);

		container.addEventListener('scroll', handleScroll, { passive: true });

		return {
			destroy() {
				cancelAnimationFrame(frame);
				container.removeEventListener('scroll', handleScroll);
			}
		};
	}
</script>

<svelte:head>
	{#each preloadImageSources as src (src)}
		<link rel="preload" as="image" href={src} />
	{/each}
</svelte:head>

{#if showLoader}
	<div transition:fade={{ duration: 600, easing: cubicOut }}>
		<LoadingAnimator on:animationComplete={hideLoader} />
	</div>
{:else}
	<!-- Fixed About Title (shows on about slides) -->
	{#if currentSlide >= 1 && currentSlide <= 2}
		<div
			class="fixed-section-title fixed-about-title"
			in:fly={{ y: 56, duration: 720, easing: cubicOut }}
			out:fade={{ duration: 600 }}
			style="
                position: fixed;
                top: {currentSlide === 1 ? 'calc(100vh - 8rem)' : '2rem'};
                --mobile-title-top: {currentSlide === 1 ? 'calc(100vh - 4rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
		>
			<h1
				class="mondwest animated-section-title"
				class:intro-active={currentSlide === 1 && previousSlide < currentSlide}
				style="font-size: var(--font-section-title); line-height: 1; margin: 0; color: var(--color-blue);"
			>
				{#each aboutTitleChars as char, i (i)}
					<span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span
					>
				{/each}
			</h1>
		</div>
	{/if}

	<!-- Fixed Experience Title (shows on work slides) -->
	{#if currentSlide >= 3 && currentSlide <= 6}
		<div
			class="fixed-section-title fixed-experience-title"
			in:fly={{ y: 56, duration: 720, easing: cubicOut }}
			out:fade={{ duration: 600 }}
			style="
                position: fixed;
                top: {currentSlide === 3 ? 'calc(100vh - 8rem)' : '2rem'};
                --mobile-title-top: {currentSlide === 3 ? 'calc(100vh - 4rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
		>
			<h1
				class="mondwest animated-section-title"
				class:intro-active={currentSlide === 3 && previousSlide < currentSlide}
				style="font-size: var(--font-section-title); line-height: 1; margin: 0; color: var(--color-blue);"
			>
				{#each experienceTitleChars as char, i (i)}
					<span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span
					>
				{/each}
			</h1>
		</div>
	{/if}

	<!-- Fixed Education Title (shows on education slides) -->
	{#if currentSlide >= 7 && currentSlide <= 9}
		<div
			class="fixed-section-title fixed-education-title"
			in:fly={{ y: 56, duration: 720, easing: cubicOut }}
			out:fade={{ duration: 600 }}
			style="
                position: fixed;
                top: {currentSlide === 7 ? 'calc(100vh - 8rem)' : '2rem'};
                --mobile-title-top: {currentSlide === 7 ? 'calc(100vh - 4rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
		>
			<h1
				class="mondwest animated-section-title"
				class:intro-active={currentSlide === 7 && previousSlide < currentSlide}
				style="font-size: var(--font-section-title); line-height: 1; margin: 0; color: var(--color-blue);"
			>
				{#each educationTitleChars as char, i (i)}
					<span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span
					>
				{/each}
			</h1>
		</div>
	{/if}

	<!-- Fixed CS Stack Title (shows on tech stack slides) -->
	{#if currentSlide >= 10 && currentSlide <= 11}
		<div
			class="fixed-section-title fixed-csstack-title"
			in:fly={{ y: 56, duration: 720, easing: cubicOut }}
			out:fade={{ duration: 600 }}
			style="
                position: fixed;
                top: {currentSlide === 10 ? 'calc(100vh - 8rem)' : '2rem'};
                --mobile-title-top: {currentSlide === 10 ? 'calc(100vh - 4rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
		>
			<!-- blur halo anchored to the title -->
			<div
				style="
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
            "
			></div>
			<h1
				class="mondwest animated-section-title"
				class:intro-active={currentSlide === 10 && previousSlide < currentSlide}
				style="font-size: var(--font-section-title); line-height: 1; margin: 0; color: var(--color-blue); position: relative;"
			>
				{#each expertiseTitleChars as char, i (i)}
					<span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span
					>
				{/each}
			</h1>
		</div>
	{/if}

	<!-- Fixed Projects Title -->
	{#if currentSlide >= 12 && currentSlide <= 13}
		<div
			class="fixed-section-title fixed-projects-title"
			in:fly={{ y: 56, duration: 720, easing: cubicOut }}
			out:fade={{ duration: 600 }}
			style="
                position: fixed;
                top: {currentSlide === 12 ? 'calc(100vh - 8rem)' : '2rem'};
                --mobile-title-top: {currentSlide === 12 ? 'calc(100vh - 4rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
		>
			<h1
				class="mondwest animated-section-title"
				class:intro-active={currentSlide === 12 && previousSlide < currentSlide}
				style="font-size: var(--font-section-title); line-height: 1; margin: 0; color: var(--color-blue);"
			>
				{#each projectsTitleChars as char, i (i)}
					<span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span
					>
				{/each}
			</h1>
		</div>
	{/if}

	<!-- Fixed Contact Title -->
	{#if currentSlide >= 14 && currentSlide <= 15}
		<div
			class="fixed-section-title fixed-contact-title"
			in:fly={{ y: 56, duration: 720, easing: cubicOut }}
			out:fade={{ duration: 600 }}
			style="
                position: fixed;
                top: {currentSlide === 14 ? 'calc(100vh - 8rem)' : '2rem'};
                --mobile-title-top: {currentSlide === 14 ? 'calc(100vh - 4rem)' : '2rem'};
                right: 2rem;
                z-index: 90;
                transition: top 0.8s cubic-bezier(0.65, 0, 0.35, 1);
            "
		>
			<h1
				class="mondwest animated-section-title"
				class:intro-active={currentSlide === 14 && previousSlide < currentSlide}
				style="font-size: var(--font-section-title); line-height: 1; margin: 0; color: var(--color-blue);"
			>
				{#each contactTitleChars as char, i (i)}
					<span class="intro-char" style="--char-index: {i};">{char === ' ' ? '\u00A0' : char}</span
					>
				{/each}
			</h1>
		</div>
	{/if}

	<div use:trackContainerScroll class="snap-container" in:fade={{ duration: 1850 }}>
		<!-- Slide 0: Home/Landing -->
		<section id="home" class="snap-section">
			<ScrollParallax layers={parallaxLayers} maxShift={80} enabled={currentSlide === 0} />
			<LandingIndexAnim {activeSection} {currentSlide} startAnimation={startMainAnimation} />
		</section>

		<!-- Slide 1: About - Title Intro -->
		<section id="about" class="snap-section bg-white"></section>

		<!-- Slide 2: About - Animated Intro + Content Reveal -->
		<section id="about-narrative" class="snap-section bg-white">
			<AboutCard visible={currentSlide === 2} />
		</section>

		<!-- Slide 3: Work Experience - Title Intro -->
		<section id="work" class="snap-section bg-white"></section>

		<!-- Slide 4: Work Experience - First Job -->
		<section id="work-1" class="snap-section bg-white">
			<!-- First Job Card -->
			<div
				class="experience-content"
				style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;"
			>
				<ExperienceCard data={experienceData[0]} visible={currentSlide >= 4} />
			</div>
		</section>

		<!-- Slide 5: Work Experience - Second Job -->
		<section id="work-2" class="snap-section bg-white">
			<!-- Second Job Card -->
			<div
				class="experience-content"
				style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;"
			>
				<ExperienceCard data={experienceData[1]} visible={currentSlide >= 5} />
			</div>
		</section>

		<!-- Slide 6: Work Experience - Third Job -->
		<section id="work-3" class="snap-section bg-white">
			<div
				class="experience-content"
				style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;"
			>
				<ExperienceCard data={experienceData[2]} visible={currentSlide >= 6} />
			</div>
		</section>

		<!-- Slide 7: Education Title Intro -->
		<section id="education-intro" class="snap-section bg-white">
			<!-- Title will be handled by fixed position div -->
		</section>

		<!-- Slide 8: Education - First Entry -->
		<section id="education-0" class="snap-section bg-white">
			<div
				class="education-content"
				style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;"
			>
				<EducationCard data={educationData[0]} visible={currentSlide >= 8} />
			</div>
		</section>

		<!-- Slide 9: Education - Second Entry -->
		<section id="education-1" class="snap-section bg-white">
			<div
				class="education-content"
				style="position: absolute; bottom: 0rem; right: 2.75rem; max-height: calc(100vh - 12rem); overflow-y: auto;"
			>
				<EducationCard data={educationData[1]} visible={currentSlide >= 9} />
			</div>
		</section>

		<!-- Slide 10: CS Stack - Scrolling Animation -->
		<section id="cs-stack" class="snap-section bg-white">
			<TechStack {currentSlide} />
		</section>

		<!-- Slide 11: CS Stack - Detailed Grid -->
		<section id="cs-stack-detail" class="snap-section bg-white">
			<TechStack {currentSlide} />
		</section>

		<!-- Slide 12: Projects Intro -->
		<section id="projects" class="snap-section bg-white"></section>

		<!-- Slide 13: Projects Grid -->
		<section id="projects-grid" class="snap-section bg-white">
			<ProjectsPanel visible={currentSlide === 13} />
		</section>

		<!-- Slide 14: Contact Intro -->
		<section id="contact" class="snap-section bg-white"></section>

		<!-- Slide 15: Contact Detail -->
		<section id="contact-detail" class="snap-section contact-detail-section bg-white">
			<div class="contact-card-wrap" class:is-visible={currentSlide === 15}>
				<article class="contact-card">
					<h2 class="contact-card-heading">
						Looking to
						<span class="nc-highlight contact-inline-highlight-word">
							<span class="nc-text-line">
								<span class="nc-text-ani contact-build-ani">Build</span>
								<span class="nc-high-grey" aria-hidden="true"></span>
								<span class="nc-high-blue" aria-hidden="true"></span>
							</span>
						</span>
						something?
					</h2>
					<p class="contact-card-copy contact-flow-line contact-flow-line-1">
						I am just the right guy to get it done.
					</p>

					<p class="contact-card-meta contact-flow-line contact-flow-line-2">Contact me at</p>
					<a
						class="contact-card-email contact-flow-line contact-flow-line-3"
						href="mailto:tejas.kamal.sahu@gmail.com">tejas.kamal.sahu@gmail.com</a
					>

					<div class="contact-rotate-block contact-flow-line contact-flow-line-4">
						<p class="contact-rotate-line">Lets build your</p>
						<span class="contact-rotate-slot" aria-live="polite" aria-atomic="true">
							{#key contactPhraseIndex}
								<span
									class="contact-rotate-item"
									transition:slide={{ axis: 'y', duration: 320, easing: cubicOut }}
								>
									<span class="nc-highlight contact-rotate-highlight">
										<span class="nc-text-line">
											<span class="nc-text-ani contact-rotate-ani"
												>{contactOfferPhrases[contactPhraseIndex]}</span
											>
											<span class="nc-high-grey" aria-hidden="true"></span>
											<span class="nc-high-blue" aria-hidden="true"></span>
										</span>
									</span>
								</span>
							{/key}
						</span>
					</div>
				</article>
			</div>
		</section>

		<!-- Slide 16: Footer -->
		<section id="footer" class="snap-section footer-section">
			<SiteFooter />
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

	.footer-section {
		height: auto;
		min-height: 100vh;
	}

	.contact-detail-section {
		overflow: hidden;
	}

	.contact-card-wrap {
		position: absolute;
		right: 2.5rem;
		bottom: 2.5rem;
		width: max-content;
		max-width: calc(100vw - 5rem);
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.55s ease,
			transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.contact-card-wrap.is-visible {
		opacity: 1;
		transform: translateY(0);
	}

	.contact-card {
		width: max-content;
		max-width: 100%;
		border: 0;
		background: transparent;
		padding: 0;
		color: var(--color-blue);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		text-align: right;
	}

	.contact-card-heading {
		margin: 0;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-contact-heading);
		line-height: 1.04;
		letter-spacing: -0.02em;
		font-weight: 600;
		white-space: nowrap;
	}

	.contact-inline-highlight-word {
		margin-left: 0.12em;
		margin-right: 0.12em;
	}

	.nc-text-line {
		display: inline-block;
		opacity: 0;
		position: relative;
		transform: translateY(20px);
		transition:
			transform 0.35s ease,
			opacity 0.35s ease;
	}

	.nc-highlight {
		display: inline-block;
		isolation: isolate;
		margin: 0 2px;
		position: relative;
	}

	.nc-highlight .nc-text-line {
		color: transparent;
		opacity: 1;
		transform: none;
	}

	.nc-text-ani {
		-webkit-background-clip: text;
		background-clip: text;
		background-image: linear-gradient(#ffffff, #ffffff);
		background-repeat: no-repeat;
		background-size: 0 100%;
		box-decoration-break: clone;
		color: #ffffff;
		display: inline-block;
		left: 3%;
		padding: 0 4px;
		position: relative;
		transition:
			left 0.35s ease,
			background-size 0.35s ease;
		-webkit-text-fill-color: transparent;
		z-index: 2;
	}

	.contact-build-ani {
		font-family: 'PP Mondwest', serif;
		font-weight: 400;
		font-style: italic;
	}

	.nc-high-grey,
	.nc-high-blue {
		backface-visibility: hidden;
		display: block;
		inset: 0;
		position: absolute;
		transform: translateZ(0);
		transition: width 0.35s ease;
		width: 0;
		z-index: 0;
	}

	.nc-high-grey {
		background: #979797;
	}

	.nc-high-blue {
		background: var(--color-blue);
	}

	.contact-card-wrap.is-visible .nc-high-grey {
		width: 100%;
		transition-delay: 0.05s;
	}

	.contact-card-wrap.is-visible .nc-high-blue {
		width: 100%;
		transition-delay: 0.2s;
	}

	.contact-card-wrap.is-visible .nc-text-ani {
		background-size: 100% 100%;
		left: 0;
		transition-delay: 0.12s;
	}

	.contact-card-wrap.is-visible .contact-build-ani {
		transition-delay: 0.34s;
	}

	.contact-flow-line {
		opacity: 0;
		transform: translateY(14px);
		transition:
			opacity 0.42s ease,
			transform 0.42s ease;
	}

	.contact-card-wrap.is-visible .contact-flow-line {
		opacity: 1;
		transform: translateY(0);
	}

	.contact-flow-line-1 {
		transition-delay: 0.48s;
	}

	.contact-flow-line-2 {
		transition-delay: 0.58s;
	}

	.contact-flow-line-3 {
		transition-delay: 0.68s;
	}

	.contact-flow-line-4 {
		transition-delay: 0.78s;
	}

	.contact-card-copy {
		margin: 0.52rem 0 0;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-contact-copy);
		line-height: 1.15;
		letter-spacing: -0.01em;
	}

	.contact-card-meta {
		margin: 0.5rem 0 0;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-contact-copy);
		line-height: 1.15;
		letter-spacing: -0.01em;
	}

	.contact-card-email {
		display: inline-block;
		margin-top: 0.2rem;
		color: var(--color-blue);
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-contact-copy);
		line-height: 1.15;
		letter-spacing: -0.01em;
		text-decoration: none;
		border-bottom: 1px solid rgba(25, 0, 255, 0.35);
		transition:
			border-bottom-color 0.25s ease,
			color 0.25s ease;
	}

	.contact-card-email:hover {
		border-bottom-color: var(--color-blue);
		color: #1200b7;
	}

	.contact-rotate-block {
		margin: 1rem 0 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 0;
	}

	.contact-rotate-line {
		margin: 0;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-contact-copy);
		line-height: 1.15;
		letter-spacing: -0.01em;
		color: rgba(25, 0, 255, 0.88);
	}

	.contact-rotate-slot {
		display: block;
		width: 18ch;
		height: 1.6em;
		text-align: right;
		line-height: 1.28;
		overflow: hidden;
		contain: layout;
	}

	.contact-rotate-item {
		display: block;
		width: 100%;
		text-align: right;
		white-space: nowrap;
		line-height: 1.28;
		will-change: transform;
	}

	.contact-rotate-highlight {
		margin: 0;
		display: inline-block;
	}

	.contact-rotate-ani {
		font-family: 'PP Mondwest', serif;
		font-style: italic;
		font-weight: 400;
		font-size: var(--font-contact-copy);
		line-height: 1.15;
		left: 0;
		transition: background-size 0.35s ease;
	}

	.contact-card-wrap.is-visible .contact-rotate-ani {
		transition-delay: 0.12s;
	}

	.bg-white {
		background-color: var(--color-white);
	}

	.animated-section-title {
		display: inline-flex;
		font-size: var(--font-section-title) !important;
		white-space: nowrap;
	}

	.fixed-csstack-title .animated-section-title,
	.fixed-contact-title .animated-section-title {
		font-size: var(--font-section-title-long) !important;
	}

	.fixed-contact-title .animated-section-title {
		font-size: var(--font-section-title-contact) !important;
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

	@media (max-width: 768px) {
		.fixed-section-title {
			top: var(--mobile-title-top, calc(100vh - 4rem)) !important;
			right: 2rem !important;
			max-width: calc(100vw - 4.4rem);
			overflow: hidden;
		}

		.fixed-section-title .animated-section-title {
			display: flex !important;
			flex-wrap: wrap;
			max-width: 100%;
			white-space: normal;
			font-size: var(--font-section-title) !important;
			line-height: 0.86 !important;
		}

		.fixed-contact-title .animated-section-title,
		.fixed-csstack-title .animated-section-title {
			font-size: var(--font-section-title-long) !important;
			line-height: 0.9 !important;
		}

		.fixed-contact-title .animated-section-title {
			flex-wrap: nowrap;
			white-space: nowrap;
			font-size: var(--font-section-title-contact) !important;
		}

		.fixed-csstack-title > div {
			display: none;
		}

		.experience-content,
		.education-content {
			left: 2.5rem !important;
			right: 1rem !important;
			bottom: 0 !important;
			width: auto !important;
			max-height: calc(100svh - 10rem) !important;
			padding-bottom: 1rem;
			scrollbar-width: none;
		}

		.experience-content::-webkit-scrollbar,
		.education-content::-webkit-scrollbar {
			display: none;
		}

		.contact-card-wrap {
			right: 1rem;
			left: 1rem;
			bottom: 1.1rem;
			width: calc(100vw - 2rem);
			max-width: calc(100vw - 2rem);
		}

		.contact-card {
			width: 100%;
			max-width: 100%;
		}

		.contact-card-heading {
			font-size: var(--font-contact-heading);
			white-space: normal;
		}

		.contact-card-copy,
		.contact-card-meta,
		.contact-card-email,
		.contact-rotate-line {
			font-size: var(--font-contact-copy);
		}

		.contact-rotate-ani {
			font-size: var(--font-contact-copy);
		}

		.contact-rotate-slot {
			width: 12ch;
		}
	}
</style>
