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
		enabled?: boolean;
	}

	let { layers, maxShift = 50, enabled = true }: Props = $props();

	let mouseX = $state(0);
	let mouseY = $state(0);
	let containerRef: HTMLDivElement;
	let viewportWidth = $state(1200);
	let isMobile = $derived(viewportWidth <= 768);
	let gyroPermissionRequired = $state(false);
	let gyroPermissionGranted = $state(true);

	function handleMouseMove(event: MouseEvent) {
		if (!containerRef || !enabled) return;
		
		const rect = containerRef.getBoundingClientRect();
		const centerX = rect.left + rect.width / 2;
		const centerY = rect.top + rect.height / 2;

		// Normalize to -1 to 1 range
		mouseX = (event.clientX - centerX) / (rect.width / 2);
		mouseY = (event.clientY - centerY) / (rect.height / 2);
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(max, Math.max(min, value));
	}

	function handleDeviceOrientation(event: DeviceOrientationEvent) {
		if (!enabled || !isMobile) return;
		if (event.gamma === null || event.beta === null) return;

		// Normalize device tilt so layers move within the same -1..1 range as mouse input.
		mouseX = clamp(event.gamma / 35, -1, 1);
		mouseY = clamp(event.beta / 45, -1, 1);
	}

	async function requestGyroPermission() {
		if (typeof window === "undefined") return;

		const orientationWithPermission =
			typeof (window as Window & { DeviceOrientationEvent?: typeof DeviceOrientationEvent }).DeviceOrientationEvent !== "undefined" &&
			typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> }).requestPermission === "function";

		if (!orientationWithPermission) {
			gyroPermissionGranted = true;
			gyroPermissionRequired = false;
			return;
		}

		try {
			const permission = await (DeviceOrientationEvent as typeof DeviceOrientationEvent & {
				requestPermission: () => Promise<"granted" | "denied">;
			}).requestPermission();
			gyroPermissionGranted = permission === "granted";
			gyroPermissionRequired = permission !== "granted";
		} catch {
			gyroPermissionGranted = false;
			gyroPermissionRequired = true;
		}
	}

	$effect(() => {
		if (typeof window === "undefined") return;

		if (!isMobile) {
			gyroPermissionRequired = false;
			gyroPermissionGranted = true;
			return;
		}

		const orientationWithPermission =
			typeof (window as Window & { DeviceOrientationEvent?: typeof DeviceOrientationEvent }).DeviceOrientationEvent !== "undefined" &&
			typeof (DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> }).requestPermission === "function";

		gyroPermissionRequired = orientationWithPermission;
		gyroPermissionGranted = !orientationWithPermission;
	});

	$effect(() => {
		if (!enabled) {
			mouseX = 0;
			mouseY = 0;
			return;
		}

		if (isMobile) {
			if (gyroPermissionRequired && !gyroPermissionGranted) {
				return;
			}

			window.addEventListener('deviceorientation', handleDeviceOrientation, true);
			return () => {
				window.removeEventListener('deviceorientation', handleDeviceOrientation, true);
			};
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
</script>

<svelte:window bind:innerWidth={viewportWidth} />

<div bind:this={containerRef} class="parallax-container">
	{#if isMobile && enabled && gyroPermissionRequired && !gyroPermissionGranted}
		<button class="gyro-permission-btn" type="button" onclick={requestGyroPermission}>Enable motion</button>
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
		font-family: "Zalando Sans", sans-serif;
		font-size: 0.8rem;
		cursor: pointer;
	}
</style>
