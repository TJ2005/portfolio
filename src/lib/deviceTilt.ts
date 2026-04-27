import { writable } from 'svelte/store';

export interface DeviceTiltState {
	x: number;
	y: number;
	supported: boolean;
	permissionRequired: boolean;
	permissionGranted: boolean;
	active: boolean;
}

type DeviceOrientationEventWithPermission = typeof DeviceOrientationEvent & {
	requestPermission?: () => Promise<'granted' | 'denied'>;
};

const initialState: DeviceTiltState = {
	x: 0,
	y: 0,
	supported: false,
	permissionRequired: false,
	permissionGranted: false,
	active: false
};

const tiltState = writable<DeviceTiltState>(initialState);
let listenerAttached = false;

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

function getOrientationConstructor() {
	if (typeof window === 'undefined') return undefined;
	return window.DeviceOrientationEvent as DeviceOrientationEventWithPermission | undefined;
}

export function syncDeviceTiltSupport() {
	const OrientationEvent = getOrientationConstructor();
	const supported = Boolean(OrientationEvent);
	const permissionRequired = Boolean(OrientationEvent?.requestPermission);

	tiltState.update((state) => ({
		...state,
		supported,
		permissionRequired,
		permissionGranted: permissionRequired ? state.permissionGranted : supported
	}));
}

function handleDeviceOrientation(event: DeviceOrientationEvent) {
	if (event.gamma === null || event.beta === null) return;

	const gamma = event.gamma;
	const beta = event.beta;

	tiltState.update((state) => ({
		...state,
		x: clamp(gamma / 35, -1, 1),
		y: clamp(beta / 45, -1, 1),
		active: true
	}));
}

export function startDeviceTilt() {
	if (typeof window === 'undefined') return;

	syncDeviceTiltSupport();

	tiltState.update((state) => {
		if (!state.supported || (state.permissionRequired && !state.permissionGranted)) return state;

		if (!listenerAttached) {
			window.addEventListener('deviceorientation', handleDeviceOrientation, true);
			listenerAttached = true;
		}

		return state;
	});
}

export async function requestDeviceTiltPermission() {
	if (typeof window === 'undefined') return;

	const OrientationEvent = getOrientationConstructor();
	if (!OrientationEvent) {
		syncDeviceTiltSupport();
		return;
	}

	if (!OrientationEvent.requestPermission) {
		tiltState.update((state) => ({
			...state,
			supported: true,
			permissionRequired: false,
			permissionGranted: true
		}));
		startDeviceTilt();
		return;
	}

	try {
		const permission = await OrientationEvent.requestPermission();
		tiltState.update((state) => ({
			...state,
			supported: true,
			permissionRequired: true,
			permissionGranted: permission === 'granted'
		}));

		if (permission === 'granted') {
			startDeviceTilt();
		}
	} catch {
		tiltState.update((state) => ({
			...state,
			supported: true,
			permissionRequired: true,
			permissionGranted: false
		}));
	}
}

export const deviceTilt = {
	subscribe: tiltState.subscribe
};
