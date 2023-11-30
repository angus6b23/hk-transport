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
                expand="block"
                @click="openModal(index)"
            >
                <ion-col
                    size-xs="3"
                    size-md="1"
                    class="route-no-wrapper ion-align-items-center"
                >
                    <div className="badge-wrapper">
                        <Badges
                            :route="route"
                            :compact="compact"
                            position="default"
                        />
                    </div>
                    <h3 v-if="route.routeNo.length < 10" class="route-no">
                        {{ route.routeNo }}
                    </h3>
                    <h3 v-else></h3>
                    <!-- Hide Route with long route number -->
                </ion-col>
                <ion-col size-xs="9" size-md="11" class="dest-wrapper">
                    <div
                        v-if="$i18next.language === 'zh'"
                        class="ion-margin-start"
                    >
                        <span class="ion-text item-subtitle">
                            <span class="small-scale">{{
                                $t('searchView.from')
                            }}</span>
                            {{ route.originTC }}
                        </span>
                        <h4 class="ion-no-margin">
                            <span class="small-scale">{{
                                $t('searchView.to')
                            }}</span>
                            {{ route.destTC }}
                        </h4>
                    </div>
                    <div
                        v-else-if="$i18next.language === 'en'"
                        class="ion-margin-start"
                    >
                        <span class="ion-text item-subtitle">
                            <span class="small-scale">{{
                                $t('searchView.from')
                            }}</span>
                            {{ route.originEN }}
                        </span>
                        <h5 class="ion-no-margin">
                            <span class="small-scale">{{
                                $t('searchView.to')
                            }}</span>
                            {{ route.destEN }}
                        </h5>
                    </div>
                </ion-col>
            </ion-row>
            <!-- Rows for Ferry -->
            <ion-row v-else expand="block" @click="openModal(index)">
                <ion-col size-xs="8" size-md="10">
                    <Badges :route="route" :compact="compact" />
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
    emits: ['openModal'],
    setup() {
        const compact = ref(false)
        return {
            compact,
        }
    },
    mounted() {},
    methods: {
        openModal(index) {
            this.$emit('openModal', index)
        },
    },
    beforeUnmount() {},
}
</script>
<style scoped>
ion-col {
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
.item-subtitle {
    font-size: 1rem;
    color: var(--ion-color-medium);
}
.route-no-wrapper {
    display: block;
}
.route-no {
    margin-top: 2px;
    margin-bottom: 2px;
}
.badge-wrapper {
    margin-left: -16px;
}
.dest-wrapper {
    display: flex;
    align-items: center;
}
.small-scale {
    font-size: 0.8rem;
}
</style>
