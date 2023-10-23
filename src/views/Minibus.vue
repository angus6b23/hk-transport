<template>
    <SearchView dataType="minibus"></SearchView>
</template>

<script>
import { defineComponent } from 'vue'
import SearchView from '@/views/Search-view.vue'

export default defineComponent({
    name: 'minibus',
    components: { SearchView },
})
</script>
