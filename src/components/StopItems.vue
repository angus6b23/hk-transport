<template>
    <ion-item :button="options.clickable" @click="getETA(stop.seq)">
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
                        <div v-if="stop.etaMessage == 'N/A'">
                            <span>暫無班次</span>
                        </div>
                        <div v-else-if="stop.etaMessage == 'loading'">
                            <span>Loading</span>
                        </div>
                        <div v-else-if="stop.etas.length > 0">
                            <span>{{ stop.etas.join(', ') }}</span>
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
    props: ['stop', 'options'],
    emits: ['getETA'],
    setup(props){
        const stop = ref(props.stop);
        const options = ref(props.options);
        return{
            stop,
            options
        }
    },
    methods: {
        getETA(seq){
            if (this.options.clickable){
                this.$emit('getETA', seq);
            }
        }
    }
};
</script>
<style scoped>
</style>