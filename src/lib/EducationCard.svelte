<script lang="ts">
	import { fade } from 'svelte/transition';

	interface EducationData {
		institutionName: string;
		degree: string;
		fieldOfStudy: string;
		startYear: string;
		endYear: string;
		achievements?: string[];
		achievementGroups?: { title: string; items: string[] }[];
		gpa?: string;
	}

	interface Props {
		data: EducationData;
		visible?: boolean;
	}

	let { data, visible = true }: Props = $props();
</script>

{#if visible}
	<div class="education-card" in:fade={{ duration: 600, delay: 200 }}>
		<!-- Header Section -->
		<div class="header-section">
			<div class="left-content">
				<h2 class="zalando institution-name">{data.institutionName}</h2>
				<p class="zalando degree-info">{data.degree} - {data.fieldOfStudy}</p>
			</div>

			<div class="right-content">
				<div class="timespan zalando">{data.startYear}-{data.endYear}</div>
				{#if data.gpa}
					<div class="gpa mondwest">GPA: {data.gpa}</div>
				{/if}
			</div>
		</div>

		<!-- Achievements List -->
		{#if (data.achievements && data.achievements.length > 0) || (data.achievementGroups && data.achievementGroups.length > 0)}
			<div class="achievements-section">
				<div class="achievements-label mondwest">Highlights</div>

				{#if data.achievements && data.achievements.length > 0}
					<ul class="achievements-list">
						{#each data.achievements as achievement (achievement)}
							<li class="zalando achievement-item">{achievement}</li>
						{/each}
					</ul>
				{/if}

				{#if data.achievementGroups && data.achievementGroups.length > 0}
					{#each data.achievementGroups as group (group.title)}
						<div class="achievement-group">
							<h3 class="zalando achievement-group-title">{group.title}</h3>
							<ul class="achievements-list">
								{#each group.items as item (item)}
									<li class="zalando achievement-item">{item}</li>
								{/each}
							</ul>
						</div>
					{/each}
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	.education-card {
		width: 75vw;
		max-width: 75vw;
		margin: 0;
		padding: 0;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 2rem;
		gap: 2rem;
	}

	.left-content {
		flex: 1;
	}

	.right-content {
		text-align: right;
	}

	.institution-name {
		font-size: var(--font-card-title);
		font-weight: 700;
		line-height: 1.1;
		margin: 0 0 0.5rem 0;
		color: var(--color-blue);
	}

	.degree-info {
		font-size: var(--font-card-meta);
		font-weight: 400;
		line-height: 1.3;
		margin: 0;
		color: var(--color-blue);
	}

	.timespan {
		font-size: var(--font-card-title);
		font-weight: 400;
		line-height: 1.1;
		margin: 0 0 0.25rem 0;
		color: var(--color-blue);
	}

	.gpa {
		font-size: var(--font-card-meta);
		line-height: 1.3;
		color: var(--color-mutedgray);
	}

	.achievements-section {
		margin-top: 2rem;
		margin-bottom: 2rem;
	}

	.achievements-label {
		font-size: var(--font-card-meta);
		line-height: 1.3;
		color: var(--color-blue);
		margin-bottom: 1rem;
	}

	.achievements-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.achievement-group {
		margin-top: 1rem;
	}

	.achievement-group-title {
		font-size: var(--font-card-meta);
		font-weight: 600;
		color: var(--color-blue);
		margin: 0 0 0.4rem 0;
	}

	.achievement-item {
		font-size: var(--font-card-body);
		font-weight: 200;
		line-height: 1.4;
		margin-bottom: 0.5rem;
		color: var(--color-blue);
		padding-left: 1.5rem;
		position: relative;
	}

	.achievement-item::before {
		content: '•';
		position: absolute;
		left: 0;
	}

	@media (max-width: 768px) {
		.education-card {
			width: 100%;
			max-width: 100%;
		}

		.header-section {
			flex-direction: column;
			gap: 0.8rem;
			margin-bottom: 1.15rem;
		}

		.right-content {
			width: 100%;
			text-align: left;
		}

		.institution-name {
			line-height: 0.98;
			letter-spacing: -0.035em;
			margin-bottom: 0.45rem;
		}

		.degree-info {
			line-height: 1.18;
		}

		.timespan {
			line-height: 1;
			margin-bottom: 0.15rem;
		}

		.gpa,
		.achievements-label,
		.achievement-group-title {
			line-height: 1.1;
		}

		.achievements-section {
			margin-top: 1.15rem;
			margin-bottom: 1rem;
		}

		.achievement-item {
			line-height: 1.32;
			padding-left: 1.05rem;
			margin-bottom: 0.6rem;
		}
	}
</style>
