<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { Tween } from "svelte/motion";
    import { fly, fade } from "svelte/transition";

    interface Props{
        activeSection?: string;
        startAnimation?: boolean;
    }

    const { activeSection='', startAnimation=false }: Props = $props()

    const menuItems = [
        { id:'work', label:'Work Experience',roman:'I'},
        { id:'education', label:'Education',roman:'II'},
        { id:'cs-stack', label:'Computer Science Stack',roman:'III'},
        { id:'projects', label:'Projects',roman:'IV'},
        { id:'github', label:'GitHub',roman:'V'},
        { id: 'content-stack', label: 'Content Creation Stack', roman: 'VI' },
        { id: 'about', label: 'About Me', roman: 'VII' },
        { id: 'contact', label: "Let's get in Touch", roman: 'VIII' },
        { id: 'extras', label: "Extra's", roman: 'IX' }
    ]

    const blurAmount = new Tween(4,{
        duration:2000,
        easing:cubicInOut
    });

    const variableTextWeight = new Tween(0,{
        duration:1000,
        easing:cubicInOut
    });

    // Trigger animation when startAnimation becomes true
    $effect(() => {
        if (startAnimation) {
            (async() => {
                await Promise.all([
                    blurAmount.set(0),
                    variableTextWeight.set(200)
                ]);
                await Promise.all([
                    blurAmount.set(4),
                    variableTextWeight.set(600)
                ]);;
            })();
        }
    });

    // Create individual Tween for each menu item
    let itemWeights: Record<string, Tween> = {};
    menuItems.forEach(item => {
        itemWeights[item.id] = new Tween(600, {
            duration: 500,
            easing: cubicInOut
        });
    });

    // Update font weights based on active section
    $effect(() => {
        if (activeSection === '') {
            // Home: all items semibold (600)
            menuItems.forEach(item => {
                itemWeights[item.id].set(400);
            });
        } else {
            // Not home: active item bold (900), others normal (400)
            menuItems.forEach(item => {
                if (item.id === activeSection) {
                    itemWeights[item.id].set(900);
                } else {
                    itemWeights[item.id].set(400);
                }
            });
        }
    });
</script>

<div 
    class="flex items-center justify-center min-h-screen transition-colors duration-300" 
    in:fade={{ duration: 850 }}
    class:text-white={activeSection === ''}
    class:text-[var(--color-blue)]={activeSection !== ''}
    class:opacity-50={activeSection !== ''}
>
    <div class="bg-[var(--color-blue)]/30 min-w-[20em] px-[1.125em] py-[0.875em]" in:fly={{y:40,duration:1000}} style="backdrop-filter:blur({blurAmount.current}px);">
        <div class="zalando text-[2em]" in:fade={{ duration: 700 }}
            style="line-height:1em; letter-spacing:-0.08em;
                font-weight:{variableTextWeight.current};"
        >
            Tejas Kamal <br />Sahoo
        </div>
        <div>
            <div>
                <p class="mondwest pt-[2em] text-[1.125em]">I Build. I Create.</p>
            </div>
            <div id="item-menu">
                <ul class="list-none p-0">
                    {#each menuItems as item}
                        <li class="w-full">
                            <a 
                                class="zalando text-[1em] w-full flex justify-between items-center transition-opacity duration-300"
                                href="#{item.id}"
                                class:opacity-100={activeSection === '' || activeSection === item.id}
                                class:opacity-50={activeSection !== '' && activeSection !== item.id}
                                style="font-weight:{itemWeights[item.id].current};"
                            >
                                <span>
                                    {item.label}
                                </span>
                                <span class="mondwest">
                                    {item.roman}
                                </span>
                            </a>
                        </li>   
                    {/each}
                </ul>
            </div>
        </div>
    </div>
</div>