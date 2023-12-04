<template>
    <ion-item
        v-for="(route, index) in displayArray"
        :key="route.id"
        :data-testid="`search-item-${type}-${index}`"
        button
    >
        <ion-grid>
            <!-- Rows for Bus and minibus -->
            <ion-row
                v-if="type == 'bus' || type == 'minibus'"
                class="open-modal"
                expand="block"
                @click="openModal(index)"
            >
                <ion-col
                    size-xs="2"
                    size-md="1"
                    class="route-no ion-align-items-center"
                >
                    <h3 v-if="route.routeNo.length < 10">
                        {{ route.routeNo }}
                    </h3>
                    <h3 v-else></h3>
                    <!-- Hide Route with long route number -->
                </ion-col>
                <ion-col size-xs="8" size-md="10">
                    <h5
                        v-if="$i18next.language === 'zh'"
                        class="ion-margin-start"
                    >
                        {{ route.destTC }}
                    </h5>
                    <h5 v-else class="ion-margin-start">
                        {{ route.destEN }}
                    </h5>
                </ion-col>
                <ion-col size-xs="2" size-md="1" class="badge-col">
                    <Badges
                        :route="route"
                        :compact="compact"
                        position="right"
                    />
                </ion-col>
            </ion-row>
            <!-- Rows for Ferry -->
            <ion-row
                v-else
                class="open-modal"
                expand="block"
                @click="openModal(index)"
            >
                <ion-col size-xs="6" size-md="9">
                    <h5
                        v-if="$i18next.language === 'zh'"
                        class="ion-no-margin ion-margin-start"
                    >
                        {{ route.routeNameTC }}
                    </h5>
                    <h5 v-else class="ion-no-margin ion-margin-start">
                        {{ route.routeNameEN }}
                    </h5>
                </ion-col>
                <ion-col size-xs="2" size-md="1" class="badge-col">
                    <Badges
                        :route="route"
                        :compact="compact"
                        position="right"
                    />
                </ion-col>
                <ion-col size-xs="2" size-md="1" class="d-flex">
                    <ion-button
                        @click.stop="openModal(index)"
                        class="direction1-button direction-button"
                        >{{ $t('searchView.inbound') }}</ion-button
                    >
                </ion-col>
                <ion-col size-xs="2" size-md="1" class="d-flex">
                    <ion-button
                        @click.stop="openAltModal(index)"
                        class="direction2-button direction-button"
                        >{{ $t('searchView.outbound') }}</ion-button
                    >
                </ion-col>
            </ion-row>
        </ion-grid>
        <ion-reorder slot="end" />
    </ion-item>
</template>

<script>
import { ref } from 'vue'
import {
    IonItem,
    IonReorder,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
} from '@ionic/vue'
import Badges from '@/components/Badges'

export default {
    name: 'Regular-Search-Items',
    components: {
        IonItem,
        IonReorder,
        IonGrid,
        IonRow,
        IonCol,
        IonButton,
        Badges,
    },
    props: ['displayArray', 'type'],
    emits: ['openModal', 'openAltModal'],
    setup() {
        const compact = ref(true)
        return {
            compact,
        }
    },
    mounted() {},
    methods: {
        openModal(index) {
            this.$emit('openModal', index)
        },
        openAltModal(index){
            this.$emit('openAltModal', index)
        }
    },
    beforeUnmount() {},
}
</script>
<style scoped>
ion-grid {
    padding-top: 0px;
    padding-bottom: 0px;
}
ion-row {
    padding-top: 0px;
    padding-bottom: 0px;
}
ion-col {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-top: 0px;
    padding-bottom: 0px;
}
.direction-button {
    width: 100%;
    align-self: center;
    justify-self: center;
}
.direction1-button {
    --background: #5e6fa1;
}
.direction2-button {
    --background: #a1905e;
}
.badge-left {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
