<template>
    <ion-list>
        <ion-item>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">車程</ion-col>
                    <ion-col size="6" class="ion-text-right">{{ item.journeyTime }} 分鐘</ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>
        <ion-item>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">全程收費</ion-col>
                    <ion-col size="6" class="ion-text-right">${{ item.fullFare }}</ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>
        <ion-item :href="item.infoLinkTC" target="_blank" button>
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">路線詳情</ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>
        <ion-item v-if="item.timetable">
            <ion-grid>
                <ion-row v-for="(section, index) in item.timetable" :key="index">
                    <ion-card class="timetable-card ion-padding">
                        <ion-card-title v-if="section.title == 'MF'">星期一至五</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'S'">星期六</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'H'">星期日及公眾假期</ion-card-title>
                        <ion-card-title v-else-if="section.title == 'D'">每日</ion-card-title>
                        <ion-card-content>
                            <ion-grid>
                                <ion-row v-for="(detail, index) in section.details" :key="`detail-${index}`">
                                    <ion-col size="6" class="ion-text-left" v-if="detail.period">
                                        <ion-text>{{detail.period}}</ion-text>
                                    </ion-col>
                                    <ion-col size="6" class="ion-text-right" v-if="detail.freq">
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
import { ref, defineComponent } from 'vue';
import { IonList, IonItem, IonGrid, IonRow, IonCol, IonText, IonCard, IonCardTitle, IonCardContent } from '@ionic/vue';
export default defineComponent({
    name: "RouteInfo",
    components: { IonList, IonItem, IonGrid, IonRow, IonCol, IonText, IonCard, IonCardTitle, IonCardContent },
    props: ['item'],
    setup(props){
        const item = ref(props.item);
        return{
            item
        }
    }
});
</script>
<style scoped>
.timetable-card{
    width: 100%;
}
</style>
