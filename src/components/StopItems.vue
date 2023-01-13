<template>
    <ion-item>
        <ion-grid>
            <ion-row class="ion-align-items-center">
                <ion-col size-xs="2" size-md="2">
                    <h5 class="ion-margin-start">{{ stop.seq }}</h5>
                </ion-col>
                <ion-col size-xs="7" size-md="7">
                    <h5 class="ion-margin-start">{{ stop.nameTC }}</h5>
                </ion-col>
                <ion-col size-xs="3" size-md="3">
                    <p class="ion-no-margin ion-text-right">
                    <div v-if="stop.etaMessage == 'NA'">暫無班次</div>
                    <div v-else>
                        <span v-if="stop.etas[0] != null">{{ stop.etas.join(', ') }}</span>
                        <span><br>分鐘</span>
                    </div>
                    </p>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-item>
</template>

<script>
import { ref } from 'vue';
import { IonGrid, IonRow, IonCol, IonItem } from '@ionic/vue';

export default {
    name: "StopItems",
    components: { IonGrid, IonRow, IonCol, IonItem },
    props: ['stop'],
    setup(props){
        const stop = ref(props.stop);
        return{
            stop
        }
    }
};
</script>
<style scoped>
</style>