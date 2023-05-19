<template>
	<ListView dataType="mtr"></ListView>
</template>

<script>
import { defineComponent } from 'vue';
import ListView from '@/views/List-view.vue'

export default defineComponent({
	name: 'mtr',
	components: { ListView }
})
</script>