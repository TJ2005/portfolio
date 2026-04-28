<script lang="ts">
	import {
		deviceTilt,
		requestDeviceTiltPermission,
		startDeviceTilt,
		type DeviceTiltState
	} from '$lib/deviceTilt';
	import { onMount } from 'svelte';

	interface ParallaxLayer {
		id: string;
		src: string;
		depth: number; // Changed from speed to depth
		zIndex: number;
		alt?: string;
	}

	interface Props {
		layers: ParallaxLayer[];
		maxShift?: number;
		enabled?: boolean;
	}

	let { layers, maxShift = 50, enabled = true }: Props = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let containerRef: HTMLDivElement;
	let viewportWidth = $state(1200);
	let isMobile = $derived(viewportWidth <= 768);
	let tilt = $state<DeviceTiltState>({
		x: 0,
		y: 0,
		supported: false,
		permissionRequired: false,
		permissionGranted: false,
		active: false
	});

	function handleMouseMove(event: MouseEvent) {
		if (!containerRef || !enabled) return;

		const rect = containerRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Normalize to -1 to 1 range
		mouseX = (event.clientX - centerX) / (rect.width / 2);
		mouseY = (event.clientY - centerY) / (rect.height / 2);
	}

	onMount(() => {
		const unsubscribe = deviceTilt.subscribe((value) => {
			tilt = value;
		});
		startDeviceTilt();

		return unsubscribe;
	});

	$effect(() => {
		if (!enabled) {
			mouseX = 0;
			mouseY = 0;
			return;
		}

		if (isMobile) {
			mouseX = tilt.permissionGranted ? tilt.x : 0;
			mouseY = tilt.permissionGranted ? tilt.y : 0;
			return;
		}

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

	async function requestMotionPermission() {
		await requestDeviceTiltPermission();
		startDeviceTilt();
	}
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div bind:this={containerRef} class="parallax-container">
	{#if isMobile && enabled && tilt.supported && tilt.permissionRequired && !tilt.permissionGranted}
		<button class="gyro-permission-btn" type="button" onclick={requestMotionPermission}
			>Enable motion</button
		>
	{/if}

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

	.gyro-permission-btn {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 80;
		border: 1px solid rgba(25, 0, 255, 0.32);
		background: rgba(255, 255, 255, 0.92);
		color: var(--color-blue);
		padding: 0.4rem 0.7rem;
		border-radius: 999px;
		font-family: 'Zalando Sans', sans-serif;
		font-size: 0.8rem;
		cursor: pointer;
	}
</style>
