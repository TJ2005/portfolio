<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		line1: string;
		line2: string;
		buttonText: string;
		motionEnabled?: boolean;
	}

	let { line1, line2, buttonText, motionEnabled = true }: Props = $props();

	let ctaText: HTMLDivElement | undefined;
	let ctaLink: HTMLDivElement | undefined;
	let ctaTextVisible = $state(false);
	let ctaLinkVisible = $state(false);
	let ctaHovered = $state(false);

	onMount(() => {
		if (!motionEnabled) {
			ctaTextVisible = true;
			ctaLinkVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target === ctaText) ctaTextVisible = true;
						if (entry.target === ctaLink) ctaLinkVisible = true;
					}
				});
			},
			{ threshold: 0.9 }
		);

		if (ctaText) observer.observe(ctaText);
		if (ctaLink) observer.observe(ctaLink);

		return () => observer.disconnect();
	});
</script>

<div class="nc-bg-grey-l">
	<div class="footer-cta-section container" class:no-motion={!motionEnabled}>
		<div class="nc-footer-cta-wrapper">
			<div
				class="nc-padding-top-section-l nc-padding-bottom-l nc-hxl"
				class:is-visible={ctaTextVisible}
				bind:this={ctaText}
			>
				<p class="footer-copy">
					<span>
						<span class="nc-text-block">
							<span class="nc-text-line">{line1}</span>
						</span>
						<br />
					</span>
					<span>
						<span class="nc-color-grey-light nc-highlight nc-italic nc-text-block">
							<span class="nc-text-line">
								<span class="nc-text-ani">{line2}</span>
								<span class="nc-high-grey" aria-hidden="true"></span>
								<span class="nc-high-blue" aria-hidden="true"></span>
							</span>
						</span>
						<br />
					</span>
				</p>
			</div>
		</div>

		<div
			class="cta-button-wrapper nc-padding-bottom-m-s nc-padding-top-s contact-link"
			class:is-visible={ctaLinkVisible}
			bind:this={ctaLink}
		>
			<a
				href="mailto:tejas.kamal.sahu@gmail.com"
				class="cta-button black"
				class:is-hovered={ctaHovered}
				aria-label={buttonText}
				onmouseenter={() => (ctaHovered = true)}
				onmouseleave={() => (ctaHovered = false)}
			>
				<span class="nc-cta-border"></span>
				<span class="cta-text nc-h3 nc-padding-bottom-m-s">{buttonText}</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="22"
					height="22"
					viewBox="0 0 22 22"
					fill="none"
					class="cta-arrow"
					aria-hidden="true"
				>
					<path
						d="M10 0.787109L20 10.7871M20 10.7871L10 20.7871M20 10.7871L0 10.7871"
						stroke="#050516"
						stroke-width="2"
					></path>
				</svg>
			</a>
		</div>
	</div>
</div>

<style>
	.container {
		margin-left: auto;
		margin-right: auto;
		max-width: 2400px;
		padding-left: 20px;
		padding-right: 20px;
	}

	@media (min-width: 768px) {
		.container {
			padding-left: 40px;
			padding-right: 40px;
		}
	}

	.nc-bg-grey-l {
		background: #ffffff;
	}

	.footer-cta-section {
		background: #ffffff;
		position: relative;
	}

	.nc-padding-top-section-l {
		opacity: 0;
		transition: opacity 0.5s ease;
	}

	.contact-link {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.85s cubic-bezier(0.19, 1, 0.22, 1),
			transform 0.85s cubic-bezier(0.19, 1, 0.22, 1);
	}

	.nc-padding-top-section-l.is-visible {
		opacity: 1;
	}

	.contact-link.is-visible {
		opacity: 1;
		transform: translateY(0);
		transition-delay: 0.24s;
	}

	.no-motion .nc-padding-top-section-l,
	.no-motion .contact-link {
		opacity: 1;
		transform: none;
		transition: none;
	}

	.no-motion .nc-text-line,
	.no-motion .nc-text-ani,
	.no-motion .nc-high-grey,
	.no-motion .nc-high-blue {
		transition: none;
	}

	.no-motion .nc-text-block:not(.nc-highlight) .nc-text-line {
		opacity: 1;
		transform: none;
	}

	.no-motion .nc-text-ani {
		background-size: 100% 100%;
		left: 0;
	}

	.no-motion .nc-high-grey,
	.no-motion .nc-high-blue {
		width: 100%;
	}

	.nc-hxl {
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-footer-cta);
		font-weight: 500;
		letter-spacing: -0.03em;
		line-height: 110%;
		text-transform: capitalize;
		color: #0004eb;
	}

	@media (max-width: 769px) {
		.nc-hxl {
			line-height: 1.04;
		}
	}

	.nc-h3 {
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-footer-copy);
		font-weight: 500;
		letter-spacing: -0.01em;
		line-height: 120%;
	}

	.nc-italic {
		font-family: 'PP Mondwest', serif;
		font-style: italic;
	}

	.nc-text-block {
		display: inline-block;
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
		padding: 0 2px;
		position: relative;
		transition:
			left 0.35s ease,
			background-size 0.35s ease;
		-webkit-text-fill-color: transparent;
		z-index: 2;
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
		background: #0004eb;
	}

	.nc-padding-top-section-l.is-visible .nc-text-block:not(.nc-highlight) .nc-text-line {
		opacity: 1;
		transform: translateY(0);
	}

	.nc-padding-top-section-l.is-visible .nc-high-grey {
		width: 100%;
		transition-delay: 0.05s;
	}

	.nc-padding-top-section-l.is-visible .nc-high-blue {
		width: 100%;
		transition-delay: 0.2s;
	}

	.nc-padding-top-section-l.is-visible .nc-text-ani {
		background-size: 100% 100%;
		left: 0;
		transition-delay: 0.12s;
	}

	.nc-padding-top-section-l {
		padding-top: 315px;
	}

	.nc-padding-bottom-l {
		padding-bottom: 70px;
	}

	.nc-padding-bottom-m-s {
		padding-bottom: 20px;
	}

	.nc-padding-top-s {
		padding-top: 12px;
	}

	@media (max-width: 769px) {
		.nc-padding-top-section-l {
			padding-top: 160px;
		}

		.nc-padding-bottom-l {
			padding-bottom: 35px;
		}

		.nc-padding-top-s {
			padding-top: 6px;
		}
	}

	.cta-button-wrapper {
		color: #ffffff;
		display: inline-block;
	}

	@media (max-width: 551px) {
		.cta-button-wrapper {
			max-width: 550px;
			width: 100%;
		}

		.nc-footer-cta-wrapper {
			max-width: 21rem;
		}
	}

	.cta-button {
		background: none;
		border: none;
		cursor: pointer;
		display: block;
		outline: none;
		position: relative;
		text-decoration: none;
		width: 210px;
		color: #050516;
	}

	@media (max-width: 551px) {
		.cta-button {
			max-width: 550px;
			width: 100%;
		}
	}

	.cta-button .nc-cta-border {
		bottom: 0;
		height: 2px;
		left: 0;
		pointer-events: none;
		position: absolute;
		width: 100%;
		background: #050516;
		transition:
			height 0.3s ease,
			bottom 0.3s ease;
	}

	.cta-button .cta-text {
		display: block;
		padding-right: 25px;
		text-align: left;
		color: #050516;
		transition: transform 0.3s ease;
	}

	.cta-arrow {
		position: absolute;
		right: 0;
		top: 0;
		transition: transform 0.3s ease;
	}

	.cta-button.is-hovered .nc-cta-border {
		bottom: 100%;
		height: 2px;
	}

	.cta-button.is-hovered .cta-text,
	.cta-button.is-hovered .cta-arrow {
		transform: translateY(20px);
	}

	.contact-link {
		bottom: 40px;
		position: absolute;
		right: 40px;
	}

	@media (max-width: 769px) {
		.contact-link {
			bottom: 0;
			position: relative;
			right: 0;
		}
	}

	.footer-copy {
		line-height: 1.02;
		margin: 0;
	}
</style>
