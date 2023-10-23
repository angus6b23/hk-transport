/* eslint-disable */
<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Tab 3</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true"> </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
} from '@ionic/vue'
import ExploreContainer from '@/components/ExploreContainer.vue'
import LeafletMap from '@/components/leaflet.vue'

export default defineComponent({
    name: 'Tab3Page',
    components: {
        ExploreContainer,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonPage,
        LeafletMap,
    },
})
</script>
