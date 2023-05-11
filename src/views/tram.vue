<template>
	<SearchView dataType="tram"></SearchView>
</template>

<script>
import { defineComponent } from 'vue';
import SearchView from '@/views/search-view.vue'

export default defineComponent({
	name: 'tram',
	components: { SearchView }
})
</script>