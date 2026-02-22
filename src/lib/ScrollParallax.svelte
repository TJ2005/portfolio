<script lang="ts">
	interface ParallaxLayer {
		id: string;
		src: string;
		depth: number;  // Changed from speed to depth
		zIndex: number;
		alt?: string;
	}

	interface Props {
		layers: ParallaxLayer[];
		maxShift?: number;
	}

	let { layers, maxShift = 50 }: Props = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let containerRef: HTMLDivElement;

	function handleMouseMove(event: MouseEvent) {
		if (!containerRef) return;
		
		const rect = containerRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Normalize to -1 to 1 range
		mouseX = (event.clientX - centerX) / (rect.width / 2);
		mouseY = (event.clientY - centerY) / (rect.height / 2);
	}

	$effect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});

	function getLayerTransform(depth: number): string {
		const offsetX = mouseX * maxShift * depth;
		const offsetY = mouseY * maxShift * depth;
		return `translate3d(${offsetX}px, ${offsetY}px, 0)`;
	}
</script>

<div bind:this={containerRef} class="parallax-container">
	{#each layers as layer (layer.id)}
		<div
			class="parallax-layer"
			style:z-index={layer.zIndex}
			style:transform={getLayerTransform(layer.depth)}
		>
			<img src={layer.src} alt={layer.alt || layer.id} class="parallax-image" />
		</div>
	{/each}
	<div class="gradient-fade"></div>
</div>

<style>
	.parallax-container {
		position: relative;
		width: 100%;
		max-width: 100vw;
		height: 150vh;
		overflow: hidden;
	}

	.parallax-layer {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 140vh;
		will-change: transform;
	}

	.parallax-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		scale: 1.2;
	}
	
	.gradient-fade {
		position: absolute;
		bottom: -25vh;
		left: 0;
		width: 100%;
		height: 20vh;
		background: linear-gradient(to bottom, transparent 0%, white 100%);
		pointer-events: none;
		z-index: 50;
	}
</style>
