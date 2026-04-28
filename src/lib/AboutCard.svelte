<script lang="ts">
	import { tick } from 'svelte';

	interface Props {
		visible?: boolean;
	}

	let { visible = false }: Props = $props();

	const heyChars = 'Hey,'.split('');
	const nameChars = "I'm Tejas Sahoo".split('');

	let viewportWidth = $state(0);
	let viewportHeight = $state(0);
	let introTextWrap = $state<HTMLDivElement>();
	let nameLine = $state<HTMLDivElement>();
	let aboutContent = $state<HTMLDivElement>();
	let introLine = $state<HTMLParagraphElement>();
	let nameSlideY = $state('19vh');
	let mobileNameArrived = $state(false);

	function waitForFrame() {
		if (typeof requestAnimationFrame === 'undefined') {
			return Promise.resolve();
		}

		return new Promise<void>((resolve) => {
			requestAnimationFrame(() => resolve());
		});
	}

	function getDefaultNameSlideY() {
		return viewportWidth <= 768 ? '15vh' : '19vh';
	}

	async function updateNameSlide() {
		if (typeof window === 'undefined') return;

		await tick();
		await waitForFrame();

		if (!introTextWrap || !nameLine || !aboutContent || !introLine) {
			nameSlideY = getDefaultNameSlideY();
			return;
		}

		const isMobileViewport = viewportWidth <= 768;
		const introRect = introTextWrap.getBoundingClientRect();
		const introLineRect = introLine.getBoundingClientRect();
		const nameTop = introRect.top + nameLine.offsetTop;
		const nameHeight = nameLine.offsetHeight;
		const targetScale = isMobileViewport ? 0.84 : 0.8;
		const landingGap = Math.min(18, Math.max(8, viewportHeight * 0.016));
		const targetTop = introLineRect.top - nameHeight * targetScale - landingGap;
		const distance = targetTop - nameTop;

		nameSlideY = Number.isFinite(distance) ? `${Math.round(distance)}px` : getDefaultNameSlideY();
	}

	$effect(() => {
		const hasMeasuredElements =
			visible && Boolean(introTextWrap && nameLine && aboutContent && introLine);
		const isMobileReady =
			visible &&
			viewportWidth <= 768 &&
			Boolean(introTextWrap && nameLine && aboutContent && introLine);

		void updateNameSlide();

		if (!hasMeasuredElements) {
			mobileNameArrived = false;
			return;
		}

		if (!isMobileReady) {
			mobileNameArrived = false;
			const timeout = setTimeout(() => {
				void updateNameSlide();
			}, 4050);

			return () => clearTimeout(timeout);
		}

		mobileNameArrived = false;

		const timeout = setTimeout(() => {
			void updateNameSlide().then(() => {
				requestAnimationFrame(() => {
					mobileNameArrived = true;
				});
			});
		}, 4150);

		return () => clearTimeout(timeout);
	});
</script>

<svelte:window bind:innerWidth={viewportWidth} bind:innerHeight={viewportHeight} />

{#if visible}
	<div class="about-stage" style="--name-slide-y: {nameSlideY};">
		<div class="intro-layer">
			<div class="intro-text-wrap" bind:this={introTextWrap}>
				<div class="hey-line zalando">
					{#each heyChars as char, i (i)}
						<span class="char" style="animation-delay: {0.2 + i * 0.08}s;"
							>{char === ' ' ? '\u00A0' : char}</span
						>
					{/each}
				</div>

				<div class="name-mask">
					<div
						class="name-line zalando persistent-name"
						class:mobile-arrived={mobileNameArrived}
						bind:this={nameLine}
					>
						{#each nameChars as char, i (i)}
							<span class="char" style="animation-delay: {2.2 + i * 0.055}s;"
								>{char === ' ' ? '\u00A0' : char}</span
							>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="about-content" bind:this={aboutContent}>
			<p class="zalando intro-line" bind:this={introLine}>
				I'm currently studying B.Tech, focused on cybersecurity.
			</p>

			<p class="zalando paragraph">
				I'm into a lot of things, but the ones that stuck are SaaS development, web dev, UI/UX, and
				<strong>Cybersecurity</strong>. I spend most of my time building, redesigning, or just
				figuring out how things work behind the scenes. When I'm not doing that, I'm probably
				drawing, messing with music, or getting into anything that's creative, really.
			</p>
		</div>
	</div>
{/if}

<style>
	.about-stage {
		position: absolute;
		inset: 0;
	}

	.intro-layer {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding-right: 2.75rem;
		z-index: 2;
		pointer-events: none;
	}

	.intro-text-wrap {
		width: min(76vw, 1040px);
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		transform: translateY(0);
	}

	.hey-line {
		display: inline-flex;
		font-size: var(--font-about-hey);
		line-height: 0.9;
		letter-spacing: -0.055em;
		color: var(--color-blue);
		font-weight: 200;
		justify-content: flex-end;
		width: 100%;
		animation:
			hey-weight 0.72s cubic-bezier(0.65, 0, 0.35, 1) 1.1s forwards,
			hey-fade-out 0.52s cubic-bezier(0.65, 0, 0.35, 1) 4.1s forwards;
	}

	.name-mask {
		width: 100%;
		display: flex;
		justify-content: flex-end;
		overflow: visible;
		margin-top: 0.2rem;
	}

	.name-line {
		display: inline-flex;
		font-size: var(--font-about-name);
		line-height: 0.95;
		letter-spacing: -0.045em;
		color: var(--color-blue);
		font-weight: 300;
		justify-content: flex-end;
		width: 100%;
		text-align: right;
	}

	.persistent-name {
		transform-origin: right top;
		transform: translateY(0) scale(1);
		animation: name-slide-down 0.92s cubic-bezier(0.22, 1, 0.36, 1) 4.15s forwards;
	}

	.char {
		display: inline-block;
		opacity: 0;
		transform: translateY(0.35em);
		animation: char-reveal 0.62s cubic-bezier(0.22, 1, 0.36, 1) forwards;
	}

	.about-content {
		position: absolute;
		right: 2.75rem;
		bottom: 0;
		width: 75vw;
		max-height: calc(100vh - 12rem);
		overflow-y: auto;
		padding-bottom: 2rem;
		opacity: 0;
		animation: paragraph-fade-in 0.55s ease 4.9s forwards;
		text-align: right;
		z-index: 1;
	}

	.paragraph {
		font-size: var(--font-about-body);
		font-weight: 340;
		line-height: 1.24;
		letter-spacing: -0.012em;
		color: color-mix(in srgb, var(--color-blue) 82%, black 18%);
		margin: 0;
		text-wrap: pretty;
		width: 100%;
	}

	.intro-line {
		font-size: var(--font-about-intro);
		font-weight: 430;
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: color-mix(in srgb, var(--color-blue) 92%, black 8%);
		margin: 0 0 0.55rem 0;
		width: 100%;
	}

	.paragraph:last-child {
		margin-bottom: 0;
	}

	.paragraph strong {
		font-weight: 600;
		color: var(--color-blue);
	}

	@keyframes char-reveal {
		from {
			opacity: 0;
			transform: translateY(0.35em);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes hey-weight {
		from {
			font-weight: 200;
		}
		to {
			font-weight: 500;
		}
	}

	@keyframes hey-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}

	@keyframes paragraph-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes name-slide-down {
		from {
			transform: translateY(0) scale(1);
		}
		to {
			transform: translateY(var(--name-slide-y, 19vh)) scale(0.8);
		}
	}

	@media (max-width: 900px) {
		.about-content,
		.intro-text-wrap {
			width: calc(100vw - 4rem);
		}

		.intro-layer {
			padding: 0 2rem;
		}

		.persistent-name {
			animation: name-slide-down-mobile 0.92s cubic-bezier(0.22, 1, 0.36, 1) 4.15s forwards;
		}
	}

	@keyframes name-slide-down-mobile {
		from {
			transform: translateY(0) scale(1);
		}
		to {
			transform: translateY(var(--name-slide-y, 15vh)) scale(0.84);
		}
	}

	@media (max-width: 768px) {
		.persistent-name {
			animation: none;
			transform: translateY(0) scale(1);
			transition: transform 0.92s cubic-bezier(0.22, 1, 0.36, 1);
		}

		.persistent-name.mobile-arrived {
			transform: translateY(var(--name-slide-y, 15vh)) scale(0.84);
		}

		.intro-layer {
			align-items: center;
			justify-content: flex-end;
			padding: 0 1rem;
		}

		.intro-text-wrap {
			width: calc(100vw - 2rem);
			align-items: flex-end;
		}

		.hey-line {
			justify-content: flex-end;
			letter-spacing: -0.06em;
		}

		.name-mask {
			justify-content: flex-end;
		}

		.name-line {
			justify-content: flex-end;
			text-align: right;
		}

		.about-content {
			left: 1rem;
			right: 1rem;
			bottom: 0;
			width: auto;
			max-height: calc(100svh - 10rem);
			padding-bottom: 1rem;
			text-align: right;
			scrollbar-width: none;
		}

		.about-content::-webkit-scrollbar {
			display: none;
		}

		.intro-line {
			line-height: 1.1;
		}

		.paragraph {
			line-height: 1.32;
		}
	}
</style>
