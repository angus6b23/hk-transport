<template>
    <SearchView dataType="minibus"></SearchView>
</template>

<script>
import { defineComponent } from 'vue';
import SearchView from '@/views/search-view.vue'

export default defineComponent({
    name: 'minibus',
    components: { SearchView }
})
</script>