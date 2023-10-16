<template>
    <ion-item v-for="i in 10">
        <ion-grid>
            <ion-row class="ion-align-items-center">
                <ion-col size-xs="2" size-md="2">
                    <h5 class="ion-margin-start">
                        <ion-skeleton-text
                            :animated="true"
                            style="width: 80%"
                        ></ion-skeleton-text>
                    </h5>
                </ion-col>
                <ion-col size-xs="7" size-md="7">
                    <h5 class="ion-margin-start">
                        <ion-skeleton-text
                            :animated="true"
                            style="width: 80%"
                        ></ion-skeleton-text>
                    </h5>
                </ion-col>
                <ion-col size-xs="3" size-md="3"> </ion-col>
            </ion-row>
        </ion-grid>
    </ion-item>
</template>

<script>
import { IonGrid, IonRow, IonCol, IonItem, IonSkeletonText } from '@ionic/vue'
export default {
    name: 'SkeletonItems',
    components: { IonGrid, IonRow, IonCol, IonItem, IonSkeletonText },
}
</script>
