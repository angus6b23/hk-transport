<template>
	<SearchView dataType="ferry"></SearchView>
</template>

<script>
import { defineComponent } from 'vue';
import SearchView from '@/views/search-view.vue'

export default defineComponent({
	name: 'ferry',
	components: { SearchView }
})
</script>