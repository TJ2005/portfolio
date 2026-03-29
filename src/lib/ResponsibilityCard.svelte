<script lang="ts">
    import { fade } from "svelte/transition";

    interface ResponsibilityCategory {
        title: string;
        items: string[];
    }

    interface ResponsibilityData {
        name: string;
        committeeDepartment: string;
        organizationName: string;
        durationFrom: string;
        durationTo: string;
        description: string;
        categories: ResponsibilityCategory[];
    }

    interface Props {
        data: ResponsibilityData;
        visible?: boolean;
    }

    let { data, visible = true }: Props = $props();
</script>

{#if visible}
    <article class="responsibility-card" in:fade={{ duration: 600, delay: 200 }}>
        <header class="meta-grid">
            <div class="meta-item">
                <p class="meta-label mondwest">Name *</p>
                <p class="meta-value zalando">{data.name}</p>
            </div>

            <div class="meta-item">
                <p class="meta-label mondwest">Event/Committee/Department Name</p>
                <p class="meta-value zalando">{data.committeeDepartment}</p>
            </div>

            <div class="meta-item">
                <p class="meta-label mondwest">Organization Name</p>
                <p class="meta-value zalando">{data.organizationName}</p>
            </div>

            <div class="meta-item">
                <p class="meta-label mondwest">Duration</p>
                <p class="meta-value zalando">{data.durationFrom}</p>
            </div>

            <div class="meta-item">
                <p class="meta-label mondwest">To</p>
                <p class="meta-value zalando">{data.durationTo}</p>
            </div>

            <div class="meta-item meta-item-wide">
                <p class="meta-label mondwest">Description</p>
                <p class="meta-value zalando">{data.description}</p>
            </div>
        </header>

        {#each data.categories as category (category.title)}
            <section class="category-section">
                <h3 class="category-title mondwest">{category.title}</h3>
                <ul class="category-list">
                    {#each category.items as item (item)}
                        <li class="category-item zalando">{item}</li>
                    {/each}
                </ul>
            </section>
        {/each}
    </article>

{/if}


<style>
    .responsibility-card {
        width: 75vw;
        max-width: 75vw;
        margin: 0;
        padding: 0;
        color: var(--color-blue);
    }

    .meta-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem 2rem;
        margin-bottom: 1.5rem;
    }

    .meta-item-wide {
        grid-column: 1 / -1;
    }

    .meta-label {
        margin: 0 0 0.3rem 0;
        font-size: clamp(1rem, 0.8rem + 0.7vw, 1.4rem);
        line-height: 1.2;
        font-weight: bold;
    }

    .meta-value {
        margin: 0;
        font-size: clamp(1.05rem, 0.9rem + 0.8vw, 1.45rem);
        line-height: 1.35;
    }

    .category-section {
        margin-top: 1.25rem;
    }

    .category-title {
        margin: 0 0 0.45rem 0;
        font-size: clamp(1.1rem, 0.95rem + 0.9vw, 1.7rem);
        line-height: 1.2;
    }

    .category-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .category-item {
        position: relative;
        margin: 0 0 0.35rem 0;
        padding-left: 1.35rem;
        font-size: clamp(0.95rem, 0.8rem + 0.75vw, 1.25rem);
        line-height: 1.4;
    }

    .category-item::before {
        content: "•";
        position: absolute;
        left: 0;
    }

    @media (max-width: 960px) {
        .responsibility-card {
            width: calc(100vw - 2.5rem);
            max-width: calc(100vw - 2.5rem);
        }

        .meta-grid {
            grid-template-columns: 1fr;
            gap: 0.8rem;
        }
    }
</style>
