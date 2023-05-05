<template>
	<SearchView dataType="bus"></SearchView>
</template>

<script>
import { defineComponent } from 'vue';
import SearchView from '@/views/search-view.vue'

export default defineComponent({
	name: 'bus',
	components: { SearchView }
})
</script>