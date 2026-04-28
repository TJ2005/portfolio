<script>
	import { fade, fly } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';

	let { currentSlide = $bindable(0) } = $props();

	const techStack = [
		{ name: 'Angular', logo: '/Tech Stack Logos/angularjs 1.png', category: 'Frontend Framework' },
		{ name: 'AWS', logo: '/Tech Stack Logos/AWS.png', category: 'Cloud Platform' },
		{ name: 'Bootstrap', logo: '/Tech Stack Logos/Bootstrap.png', category: 'CSS Framework' },
		{ name: 'Cloudflare', logo: '/Tech Stack Logos/cloudflare.png', category: 'CDN & Security' },
		{ name: 'Docker', logo: '/Tech Stack Logos/Docker.png', category: 'Containerization' },
		{ name: 'Framer', logo: '/Tech Stack Logos/Framer.png', category: 'Design Tool' },
		{ name: 'Git', logo: '/Tech Stack Logos/Git.png', category: 'Version Control' },
		{ name: 'MongoDB', logo: '/Tech Stack Logos/Mongodb .png', category: 'Database' },
		{
			name: 'React',
			logo: '/Tech Stack Logos/React-icon.svg 1-1.png',
			category: 'Frontend Library'
		},
		{ name: 'Svelte', logo: '/Tech Stack Logos/Svelte.png', category: 'Frontend Framework' },
		{ name: 'Tailwind', logo: '/Tech Stack Logos/Tailwind.png', category: 'CSS Framework' },
		{
			name: 'Vue.js',
			logo: '/Tech Stack Logos/Vue.js_Logo_2.svg 1.png',
			category: 'Frontend Framework'
		}
	];

	const row = [...techStack, ...techStack, ...techStack];
</script>

<!-- ═══════════════════════════════════════════════
     SLIDE 8 — infinite marquee
════════════════════════════════════════════════ -->
{#if currentSlide === 10}
	<div class="marquee-stage" in:fade={{ duration: 700 }}>
		<div class="track left">
			{#each row as t, i (i)}<div class="chip"><img src={t.logo} alt={t.name} /></div>{/each}
		</div>
		<div class="track right">
			{#each row as t, i (i)}<div class="chip"><img src={t.logo} alt={t.name} /></div>{/each}
		</div>
		<div class="track left d1">
			{#each row as t, i (i)}<div class="chip"><img src={t.logo} alt={t.name} /></div>{/each}
		</div>
		<div class="track right d2">
			{#each row as t, i (i)}<div class="chip"><img src={t.logo} alt={t.name} /></div>{/each}
		</div>
	</div>

	<!-- ═══════════════════════════════════════════════
     SLIDE 9 — tools list (matches experience card style)
════════════════════════════════════════════════ -->
{:else if currentSlide === 11}
	<div class="tools-wrap" in:fly={{ y: 60, duration: 900, easing: cubicInOut }}>
		<!-- label row identical to "Responsibilities" in ExperienceCard -->
		<p class="tools-label mondwest">My Tools</p>

		<ul class="tools-list">
			{#each techStack as tech, i (tech.name)}
				<li class="tool-row" in:fly={{ x: 40, duration: 500, delay: i * 50, easing: cubicInOut }}>
					<!-- logo, tinted blue -->
					<span class="tool-logo">
						<img src={tech.logo} alt={tech.name} />
						<span class="logo-tint"></span>
					</span>

					<!-- name -->
					<span class="tool-name zalando">{tech.name}</span>

					<!-- category -->
					<span class="tool-cat">{tech.category}</span>
				</li>
			{/each}
		</ul>
	</div>
{/if}

<style>
	/* ── MARQUEE ─────────────────────────────────────────────── */
	.marquee-stage {
		position: absolute;
		inset: 0;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		gap: 1.75rem;
		padding-bottom: 2.5rem;
	}

	.track {
		display: flex;
		gap: 1.25rem;
		width: max-content;
		will-change: transform;
	}

	.left {
		animation: goLeft 40s linear infinite;
	}
	.right {
		animation: goRight 40s linear infinite;
	}
	.d1 {
		animation-delay: -13s;
	}
	.d2 {
		animation-delay: -26s;
	}

	@keyframes goLeft {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-33.333%);
		}
	}
	@keyframes goRight {
		from {
			transform: translateX(-33.333%);
		}
		to {
			transform: translateX(0);
		}
	}

	.chip {
		flex-shrink: 0;
		width: 80px;
		height: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-white);
		border-radius: 14px;
		padding: 0.9rem;
	}
	.chip img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	/* ── TOOLS LIST ───────────────────────────────────────────── */
	.tools-wrap {
		position: absolute;
		bottom: 0;
		right: 2.75rem;
		max-height: calc(100vh - 10rem);
		width: 75vw;
		overflow-y: auto;
		scrollbar-width: none;
		display: flex;
		flex-direction: column;
		padding-bottom: 2rem;
	}
	.tools-wrap::-webkit-scrollbar {
		display: none;
	}

	/* "MY TOOLS" — same size/style as "Responsibilities" in ExperienceCard */
	.tools-label {
		font-size: var(--font-panel-label);
		color: var(--color-blue);
		margin: 0 0 1.25rem 0;
		letter-spacing: 0.02em;
	}

	.tools-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.tool-row {
		display: flex;
		align-items: center;
		gap: 1.25rem;
		padding: 0.65rem 0;
		border-bottom: 1px solid rgba(25, 0, 255, 0.08);
	}
	.tool-row:last-child {
		border-bottom: none;
	}

	.tool-logo {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.tool-logo img {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.logo-tint {
		position: absolute;
		inset: 0;
		background: var(--color-blue);
		opacity: 1;
		mix-blend-mode: color;
		border-radius: 4px;
		pointer-events: none;
	}

	.tool-name {
		flex: 1;
		font-size: var(--font-tool-name);
		font-weight: 400;
		color: var(--color-blue);
		line-height: 1;
	}

	.tool-cat {
		font-family: 'Inter Variable', sans-serif;
		font-size: var(--font-tool-category);
		font-weight: 300;
		color: var(--color-mutedgray);
		white-space: nowrap;
	}

	@media (max-width: 768px) {
		.marquee-stage {
			gap: 1rem;
			padding-bottom: 1.5rem;
		}

		.track {
			gap: 0.85rem;
		}

		.chip {
			width: 62px;
			height: 62px;
			border-radius: 10px;
			padding: 0.7rem;
		}

		.tools-wrap {
			left: 2.5rem;
			right: 1rem;
			bottom: 0;
			width: auto;
			max-height: calc(100svh - 10rem);
			padding-bottom: 1rem;
		}

		.tools-label {
			margin-bottom: 0.8rem;
		}

		.tool-row {
			gap: 0.75rem;
			padding: 0.55rem 0;
		}

		.tool-logo {
			width: 26px;
			height: 26px;
		}

		.tool-name {
			min-width: 0;
		}

		.tool-cat {
			max-width: 7.5rem;
			white-space: normal;
			text-align: right;
			line-height: 1.15;
		}
	}
</style>
