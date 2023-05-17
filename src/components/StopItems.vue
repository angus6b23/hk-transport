<template>
    <ion-item :button="options.clickable" @click="getETA(stop.seq)">
        <ion-grid>
            <ion-row class="ion-align-items-center">
                <ion-col size-xs="2" size-md="2">
                    <h5 class="ion-margin-start highlight">{{ stop.seq }}</h5>
                </ion-col>
                <ion-col size-xs="10" size-md="10" v-if="noEta">
                    <h5 class="ion-margin-start highlight">{{ stop.nameTC }}</h5>
                </ion-col>
                <ion-col size-xs="7" size-md="7" v-else>
                    <h5 class="ion-margin-start highlight">{{ stop.nameTC }}</h5>
                </ion-col>
                <ion-col size-xs="3" size-md="3" v-if="!noEta">
                    <p class="ion-no-margin ion-text-right">
                        <div v-if="stop.etaMessage == 'N/A'">
                            <ion-text color="medium">
                                <span>暫無班次</span>
                            </ion-text>
                        </div>
                        <div v-else-if="stop.etaMessage == 'loading'">
                            <ion-spinner color="primary"></ion-spinner>
                        </div>
                        <div v-else-if="stop.etas.length > 0">
                            <ion-text>
                                <span>{{ stop.etas.join(', ') }}</span>
                                <br />
                                <span>分鐘</span>
                            </ion-text>
                        </div>
                    </p>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-item>
</template>

<script>
import { ref } from 'vue';
import { IonGrid, IonRow, IonCol, IonItem, IonSpinner, IonText } from '@ionic/vue';

export default {
    name: "StopItems",
    components: { IonGrid, IonRow, IonCol, IonItem, IonSpinner, IonText },
    props: ['stop', 'options', 'noEta'],
    emits: ['getETA'],
    setup(props){
        const stop = ref(props.stop);
        const options = ref(props.options);
        const noEta = ref(props.noEta);
        return{
            stop,
            options,
            noEta
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