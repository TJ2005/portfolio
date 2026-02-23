<script lang="ts">
    import { fade } from "svelte/transition";
    
    interface EducationData {
        institutionName: string;
        degree: string;
        fieldOfStudy: string;
        startYear: string;
        endYear: string;
        achievements?: string[];
        gpa?: string;
    }
    
    interface Props {
        data: EducationData;
        visible?: boolean;
    }
    
    let { data, visible = true }: Props = $props();
</script>

{#if visible}
    <div 
        class="education-card"
        in:fade={{ duration: 600, delay: 200 }}
    >
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
        {#if data.achievements && data.achievements.length > 0}
            <div class="achievements-section">
                <div class="achievements-label mondwest">Highlights</div>
                <ul class="achievements-list">
                    {#each data.achievements as achievement}
                        <li class="zalando achievement-item">{achievement}</li>
                    {/each}
                </ul>
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
        font-size: 54px;
        font-weight: 700;
        line-height: 1.1;
        margin: 0 0 0.5rem 0;
        color: var(--color-blue);
    }
    
    .degree-info {
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
    
    .gpa {
        font-size: 28px;
        line-height: 1.3;
        color: var(--color-mutedgray);
    }
    
    .achievements-section {
        margin-top: 2rem;
    }
    
    .achievements-label {
        font-size: 28px;
        line-height: 1.3;
        color: var(--color-blue);
        margin-bottom: 1rem;
    }
    
    .achievements-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .achievement-item {
        font-size: 28px;
        font-weight: 200;
        line-height: 1.4;
        margin-bottom: 0.5rem;
        color: var(--color-blue);
        padding-left: 1.5rem;
        position: relative;
    }
    
    .achievement-item::before {
        content: "•";
        position: absolute;
        left: 0;
    }
</style>
