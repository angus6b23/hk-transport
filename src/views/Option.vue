<template>

	<ion-content>
		test
	</ion-content>
</template>

<script>
import { ref } from 'vue';
import { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/vue';
import { star, starOutline, chevronBack, swapHorizontalOutline } from 'ionicons/icons'
import presentToast from '@/components/presentToast.js';

export default {
	name: "Option",
	components: { IonHeader, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonIcon, IonButton, IonButtons, IonSegment, IonSegmentButton, IonToolbar },
	setup() {
		return {
			chevronBack
		}
	},
	async mounted() {
	},
	methods: {
		closeModal(){
			this.$refs.modal.$el.dismiss();
		}
	}
};
</script>
<style></style>
