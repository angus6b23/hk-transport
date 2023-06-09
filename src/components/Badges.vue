<template>
	<!-- Badges for bus -->
	<div v-if="route.type === 'bus'">
		<ion-badge v-if="route.company.includes('KMB')"
			class="kmb-badge ion-margin-start">九巴</ion-badge>
		<ion-badge v-if="route.company.includes('CTB')"
			class="ctb-badge ion-margin-start">城巴</ion-badge>
		<ion-badge v-if="route.company.includes('LWB')"
			class="lwb-badge ion-margin-start">龍運</ion-badge>
		<ion-badge v-if="route.company.includes('NWFB')"
			class="nwfb-badge ion-margin-start">新巴</ion-badge>
		<ion-badge v-if="route.company.includes('DB')"
			class="db-badge ion-margin-start">愉景</ion-badge>
		<ion-badge v-if="route.company.includes('NLB')"
			class="nlb-badge ion-margin-start">大嶼</ion-badge>
		<ion-badge v-if="route.company.includes('PI')"
			class="pi-badge ion-margin-start">馬灣</ion-badge>
		<ion-badge v-if="route.company.includes('XB')"
			class="xb-badge ion-margin-start">過境</ion-badge>
		<ion-badge v-if="route.company.includes('LRTFeeder')"
			class="ltr-badge ion-margin-start">港鐵</ion-badge>
		<ion-badge v-if="route.serviceMode.includes('N')"
			class="night-badge ion-margin-start">晚間</ion-badge>
		<ion-badge v-if="route.serviceMode == 'T'"
			class="special-badge ion-margin-start">特別</ion-badge>
	</div>
	<div v-if="route.type === 'minibus'">
		<ion-badge v-if="route.district.includes('HKI')"
			class="hki-badge ion-margin-start">港島</ion-badge>
		<ion-badge v-if="route.district.includes('KLN')"
			class="kln-badge ion-margin-start">九龍</ion-badge>
		<ion-badge v-if="route.district.includes('NT')"
			class="nt-badge ion-margin-start">新界</ion-badge>
		<ion-badge v-if="route.serviceMode.includes('N')"
			class="night-badge ion-margin-start">晚間</ion-badge>
		<ion-badge v-if="route.serviceMode == 'T'"
			class="special-badge ion-margin-start">特別</ion-badge>
	</div>
	<div v-if="route.type === 'ferry'">
		<ion-badge v-if="route.district == 'KAITO'"
			class="hki-badge ion-margin-start">街渡</ion-badge>
		<ion-badge v-if="route.district == 'OUTLYING'"
			class="kln-badge ion-margin-start">離島</ion-badge>
		<ion-badge v-if="route.district == 'INNER'"
			class="nt-badge ion-margin-start">內陸</ion-badge>
	</div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonBadge } from '@ionic/vue';
export default defineComponent({
	name: 'Badges',
	props: ['route'],
	components: { IonBadge },
	mount(props){
		console.log('setup called');
		const route = ref(props.route);
		return {
			route
		}
	},
})
</script>
<style scoped>
/* Bus Badges color */
.kmb-badge {
	--background: #e51f28;
}

.lwb-badge {
	--background: #f05323;
}

.ctb-badge {
	--background: #0563ad;
}

.nwfb-badge {
	--background: #6e449d;
}

.nlb-badge {
	--background: #00897b;
}

.pi-badge {
	--background: #febc22;
}

.db-badge {
	--background: #e7222b;
}

.xb-badge {
	--background: #ff67de;
}

/* Minibus Badges */
.hki-badge {
	--background: #e66dca;
}

.kln-badge {
	--background: #6dcae6;
}

.nt-badge {
	--background: #cae66d;
}

/* Common Badges */
.night-badge {
	--background: #36454f;
}

.special-badge {
	--background: #663399;
}

.direction1-badge {
	--background: #5E6FA1;
}

.direction2-badge {
	--background: #A1905E;
}
</style>
