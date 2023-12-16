<template>
    <ion-list>
        <ion-item>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">{{
                        $t('etaPopup.info.journeyTime')
                    }}</ion-col>
                    <ion-col size="6" class="ion-text-right"
                        >{{ `${item.journeyTime} ${$t('common.minute')}` }}
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>
        <ion-item>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">{{
                        $t('etaPopup.info.fullFare')
                    }}</ion-col>
                    <ion-col size="6" class="ion-text-right"
                        >${{ item.fullFare }}</ion-col
                    >
                </ion-row>
            </ion-grid>
        </ion-item>
        <ion-item :href="item.infoLinkTC" target="_blank" button>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">
                        {{ $t('etaPopup.info.details') }}
                    </ion-col>
                    <ion-col size="6" class="ion-text-right">
                        <ion-icon :icon="openOutline"></ion-icon>
                    </ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>
        <ion-item v-if="item.timetable">
            <ion-grid>
                <ion-row
                    v-for="(section, index) in item.timetable"
                    :key="index"
                >
                    <ion-card class="timetable-card ion-padding">
                        <ion-card-title v-if="section.title == 'MF'">{{
                            $t('etaPopup.info.MF')
                        }}</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'MS'">{{
                            $t('etaPopup.info.MS')
                        }}</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'S'">{{
                            $t('etaPopup.info.S')
                        }}</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'H'">{{
                            $t('etaPopup.info.H')
                        }}</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'D'">{{
                            $t('etaPopup.info.D')
                        }}</ion-card-title>
                        <ion-card-content>
                            <ion-grid>
                                <ion-row
                                    v-for="(detail, index) in section.details"
                                    :key="`detail-${index}`"
                                >
                                    <ion-col
                                        size="6"
                                        class="ion-text-left"
                                        v-if="detail.period"
                                    >
                                        <ion-text>{{ detail.period }}</ion-text>
                                    </ion-col>
                                    <ion-col
                                        size="6"
                                        class="ion-text-right"
                                        v-if="detail.freq"
                                    >
                                        <ion-text>{{ detail.freq }}</ion-text>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-card-content>
                    </ion-card>
                </ion-row>
            </ion-grid>
        </ion-item>
    </ion-list>
</template>

<script>
import { ref, defineComponent } from 'vue'
import {
    IonList,
    IonItem,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonIcon,
} from '@ionic/vue'
import { openOutline } from 'ionicons/icons'
export default defineComponent({
    name: 'RouteInfo',
    components: {
        IonList,
        IonItem,
        IonGrid,
        IonRow,
        IonCol,
        IonText,
        IonCard,
        IonCardTitle,
        IonCardContent,
        IonIcon,
    },
    props: ['item'],
    setup(props) {
        const item = ref(props.item)
        return {
            item,
            openOutline,
        }
    },
})
</script>
<style scoped>
.timetable-card {
    width: 100%;
}
</style>
