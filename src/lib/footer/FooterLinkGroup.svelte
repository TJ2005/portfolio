<script lang="ts">
    interface LinkItem {
        label: string;
        href: string;
    }

    interface Props {
        links: LinkItem[];
        large?: boolean;
    }

    let { links, large = true }: Props = $props();
</script>

<nav class="link-group" aria-label="Footer link group">
    {#each links as link (link.label)}
        <a href={link.href} class="link" class:large onclick={(e) => e.preventDefault()}>{link.label}</a>
    {/each}
</nav>

<style>
    .link-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .link {
        color: #0004eb;
        text-decoration: none;
        border-bottom: 1px solid transparent;
        width: fit-content;
        font-family: "Zalando Sans", sans-serif;
        font-size: 1.05rem;
        font-weight: 300;
    }

    .link.large {
        font-size: clamp(26px, 3vw, 48px);
        line-height: 1.03;
        letter-spacing: -0.03em;
        font-weight: 400;
    }

    .link:hover {
        border-bottom-color: currentColor;
    }
</style>
