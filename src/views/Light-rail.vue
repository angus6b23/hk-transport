<template>
    <ListView dataType="lightRail"></ListView>
</template>

<script>
import { defineComponent } from 'vue'
import ListView from '@/views/List-view.vue'

export default defineComponent({
    name: 'lightRail',
    components: { ListView },
})
</script>
