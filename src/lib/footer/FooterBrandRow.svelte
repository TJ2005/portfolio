<script lang="ts">
	interface Props {
		shortBrand: string;
		longBrand: string;
		year: number;
		rightsLine: string;
	}

	let { shortBrand, longBrand, year, rightsLine }: Props = $props();
</script>

<div class="brand-row" aria-hidden="true">
	<div class="brand-short">{shortBrand}</div>
	<div class="brand-long-box">{longBrand}</div>
</div>

<p class="meta-line">{rightsLine} © {shortBrand} {year}.</p>

<style>
	.brand-row {
		margin-top: 1.9rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.brand-short {
		color: #0004eb;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-footer-brand);
		line-height: 0.9;
		letter-spacing: -0.06em;
		font-weight: 500;
	}

	.brand-long-box {
		background: #0004eb;
		color: #ffffff;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-footer-city);
		letter-spacing: -0.02em;
		font-weight: 400;
		line-height: 1;
		padding: 0.4em 0.7em;
		border-radius: 4px;
	}

	.meta-line {
		margin: 0.65rem 0 0;
		color: #979797;
		font-family: 'Zalando Sans', sans-serif;
		font-size: var(--font-footer-copy);
		line-height: 1.35;
		font-weight: 300;
	}
</style>
