<template>
    <SearchView dataType="ferry"></SearchView>
</template>

<script>
import { defineComponent } from 'vue'
import SearchView from '@/views/Search-view.vue'

export default defineComponent({
    name: 'ferry',
    components: { SearchView },
})
</script>
