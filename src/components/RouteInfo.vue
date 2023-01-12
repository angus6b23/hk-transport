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
        <ion-item :href="item.infoLink" target="_blank">
            <ion-grid>
                <ion-row>
                    <ion-col size="6" class="ion-text-left">路線詳情</ion-col>
                </ion-row>
            </ion-grid>
        </ion-item>
    </ion-list>
</template>

<script>
import { ref } from 'vue';
import { IonList, IonItem, IonGrid, IonRow, IonCol } from '@ionic/vue';
export default {
    name: "RouteInfo",
    components: { IonList, IonItem, IonGrid, IonRow, IonCol },
    props: ['item'],
    setup(props){
        const item = ref(props.item);
        return{
            item
        }
    }
}
</script>
<style scoped>
</style>
