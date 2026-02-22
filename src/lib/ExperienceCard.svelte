<script lang="ts">
    import { fade, fly } from "svelte/transition";
    
    interface ExperienceData {
        companyName: string;
        jobTitle: string;
        employmentType: string;
        startYear: string;
        endYear: string;
        responsibilities: string[];
        optionalText?: string;
    }
    
    interface Props {
        data: ExperienceData;
        visible?: boolean;
    }
    
    let { data, visible = true }: Props = $props();
</script>

{#if visible}
    <div 
        class="experience-card"
        in:fade={{ duration: 600, delay: 200 }}
    >
        <!-- Header Section -->
        <div class="header-section">
            <div class="left-content">
                <h2 class="zalando company-name">{data.companyName}</h2>
                <p class="zalando job-title">{data.jobTitle} ( {data.employmentType} )</p>
            </div>
            
            <div class="right-content">
                <div class="timespan zalando">{data.startYear}-{data.endYear}</div>
                <div class="responsibilities-label mondwest">Responsibilities</div>
            </div>
        </div>
        
        <!-- Responsibilities List -->
        <ul class="responsibilities-list">
            {#each data.responsibilities as responsibility}
                <li class="zalando responsibility-item">{responsibility}</li>
            {/each}
        </ul>
        
        <!-- Optional Text -->
        {#if data.optionalText}
            <p class="zalando optional-text">{data.optionalText}</p>
        {/if}
    </div>
{/if}

<style>
    .experience-card {
        width: 100%;
        max-width: 90vw;
        margin: 0 auto;
        padding: 2rem;
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
    
    .company-name {
        font-size: 54px;
        font-weight: 700;
        line-height: 1.1;
        margin: 0 0 0.5rem 0;
        color: var(--color-blue);
    }
    
    .job-title {
        font-size: 28px;
        font-weight: 400;
        line-height: 1.3;
        margin: 0;
        color: var(--color-blue);
    }
    
    .timespan {
        font-size: 54px;
        font-weight: 400;
        line-height: 1.1;
        margin: 0 0 0.25rem 0;
        color: var(--color-blue);
    }
    
    .responsibilities-label {
        font-size: 28px;
        line-height: 1.3;
        color: var(--color-mutedgray);
    }
    
    .responsibilities-list {
        list-style: none;
        padding: 0;
        margin: 0 0 2rem 0;
    }
    
    .responsibility-item {
        font-size: 28px;
        font-weight: 200;
        line-height: 1.4;
        margin-bottom: 0.5rem;
        color: var(--color-blue);
        padding-left: 1.5rem;
        position: relative;
    }
    
    .responsibility-item::before {
        content: "•";
        position: absolute;
        left: 0;
    }
    
    .optional-text {
        font-size: 24px;
        font-weight: 300;
        line-height: 1.5;
        color: var(--color-mutedgray);
        margin: 0;
    }
</style>
