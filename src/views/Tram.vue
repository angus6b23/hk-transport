<template>
    <ListView dataType="tram"></ListView>
</template>

<script>
import { defineComponent } from 'vue'
import ListView from '@/views/List-view.vue'

export default defineComponent({
    name: 'tram',
    components: { ListView },
})
</script>
