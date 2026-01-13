<script lang="ts">
    interface Props{
        activeSection?:string;
    }

    const { activeSection=''}: Props=$props()

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
</script>

<div class="min-h-screen bg-gradient-to-br from-purple-400 via-blue-500 to-blue-600" >
    
</div>