<template>
    <ion-item>
        <ion-grid>
            <ion-row class="ion-align-items-center">
                <ion-col size-xs="2" size-md="2">
                    <h5 class="ion-margin-start highlight">
                        {{ parseInt(stop.seq) }}
                    </h5>
                </ion-col>
                <ion-col size-xs="10" size-md="10" v-if="noEta">
                    <h5
                        v-if="$i18next.language === 'zh'"
                        class="ion-margin-start highlight"
                    >
                        {{ stop.nameTC }}
                    </h5>
                    <h5 v-else class="ion-margin-start highlight">
                        {{ stop.nameEN }}
                    </h5>
                </ion-col>
                <ion-col size-xs="7" size-md="7" v-else>
                    <h5
                        v-if="$i18next.language === 'zh'"
                        class="ion-margin-start highlight"
                    >
                        {{ stop.nameTC }}
                    </h5>
                    <h5 v-else class="ion-margin-start highlight">
                        {{ stop.nameEN }}
                    </h5>
                </ion-col>
                <ion-col
                    size-xs="3"
                    size-md="3"
                    class="ion-no-margin ion-text-right"
                    v-if="!noEta"
                >
                    <div v-if="eta.etaStatus === 'N/A'">
                        <ion-text color="medium">
                            <span>{{ $t('etaPopup.upcoming.noService') }}</span>
                        </ion-text>
                    </div>
                    <!-- <div v-else-if="eta.etaStatus === 'pending'"> -->
                    <!--     <ion-spinner color="primary"></ion-spinner> -->
                    <!-- </div> -->
                    <div v-else-if="eta.eta.length > 0">
                        <ion-text>
                            <span>{{ eta.eta.join(', ') }}</span>
                            <br />
                            <span>{{ $t('common.minute') }}</span>
                        </ion-text>
                    </div>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-item>
</template>

<script>
import {
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    IonSpinner,
    IonText,
} from '@ionic/vue'

export default {
    name: 'StopItems',
    components: { IonGrid, IonRow, IonCol, IonItem, IonSpinner, IonText },
    props: ['stop', 'noEta', 'eta'],
    emits: ['getETA'],
}
</script>
<style scoped></style>
