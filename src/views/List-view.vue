<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>
                    <i18next :translation="$t('listView.title')">
                        <template #transportType>
                            <span>{{ $t(`common.${type}`) }}</span>
                        </template>
                    </i18next>
                </ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="openOption">
                        <ion-icon :icon="cog"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-modal
                ref="modal"
                :is-open="optionIsOpen"
                @WillDismiss="closeOption"
            >
                <Option @closeOption="closeOption" />
            </ion-modal>
            <ion-list v-if="dataReady">
                <!-- Change List Header according to bus search -->
                <ion-list-header>
                    <ion-label class="hint">{{ $t('listView.hint') }}</ion-label>
                </ion-list-header>
                <!-- Bus route display list here -->
                <div v-for="(route, index) in data" :key="route.id">
                    <ion-item v-if="route.direction == 1" button>
                        <ion-grid>
                            <!-- Row Button for MTR -->
                            <ion-row
                                v-if="route.type == 'mtr'"
                                class="open-modal"
                                expand="block"
                                @click="openModal(index)"
                            >
                                <ion-col
                                    size-xs="3"
                                    size-md="1"
                                    class="route-no ion-align-items-center"
                                >
                                    <div
                                        class="line-color-indicator"
                                        :style="{
                                            'background-color':
                                                '#' + route.color,
                                        }"
                                    ></div>
                                </ion-col>
                                <ion-col size-xs="9" size-md="11">
                                    <h5
                                        v-if="$i18next.language === 'zh'"
                                        class="ion-no-margin ion-margin-start ion-padding-vertical"
                                    >
                                        {{ route.routeNameTC }}
                                    </h5>
                                    <h5
                                        v-else
                                        class="ion-no-margin ion-margin-start ion-padding-vertical"
                                    >
                                        {{ route.routeNameEN }}
                                    </h5>
                                </ion-col>
                            </ion-row>
                            <!-- Row Button for lightRail -->
                            <ion-row
                                v-if="route.type == 'lightRail'"
                                class="open-modal"
                                expand="block"
                                @click="openModal(index)"
                            >
                                <ion-col
                                    size-xs="3"
                                    size-md="1"
                                    class="route-no ion-align-items-center"
                                >
                                    <h5>{{ route.routeId }}</h5>
                                </ion-col>
                                <ion-col size-xs="9" size-md="11">
                                    <h5
                                        v-if="$i18next.language === 'zh'"
                                        class="ion-no-margin ion-margin-start ion-padding-vertical"
                                    >
                                        {{ route.originTC }} -
                                        {{ route.destTC }}
                                    </h5>
                                    <h5
                                        v-else
                                        class="ion-no-margin ion-margin-start ion-padding-vertical"
                                    >
                                        {{ route.originEN }} -
                                        {{ route.destEN }}
                                    </h5>
                                </ion-col>
                            </ion-row>
                            <!-- Row Button for Tram -->
                            <ion-row
                                v-if="route.type == 'tram'"
                                class="open-modal"
                                expand="block"
                                @click="openModal(index)"
                            >
                                <ion-col size-xs="8" size-md="10">
                                    <h5
                                        v-if="$i18next.language === 'zh'"
                                        class="ion-no-margin ion-margin-start ion-padding-vertical"
                                    >
                                        {{ route.routeNameTC }}
                                    </h5>
                                    <h5
                                        v-else
                                        class="ion-no-margin ion-margin-start ion-padding-vertical"
                                    >
                                        {{ route.routeNameEN }}
                                    </h5>
                                </ion-col>
                                <ion-col size-xs="2" size-md="1" class="d-flex">
                                    <ion-button
                                        @click.stop="openModal(index)"
                                        class="direction1-button direction-button"
                                        >{{
                                            $t('listView.westbound')
                                        }}</ion-button
                                    >
                                </ion-col>
                                <ion-col size-xs="2" size-md="1" class="d-flex">
                                    <ion-button
                                        @click.stop="openAltModal(index)"
                                        class="direction2-button direction-button"
                                        >{{
                                            $t('listView.eastbound')
                                        }}</ion-button
                                    >
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
        <!-- Modal for displaying bus details -->
        <ion-modal :is-open="modalIsOpen" ref="modal" @WillDismiss="closeModal">
            <ETAPopup
                :item="itemSelected"
                :noEta="checkNoEta"
                :altRoutes="altRoutes"
                @closeModal="closeModal"
                @swapDirection="swapDirection"
            />
        </ion-modal>
    </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonTitle,
    IonIcon,
    IonButtons,
    IonButton,
} from '@ionic/vue'
import { cog } from 'ionicons/icons'
import { loadChunk } from '@/components/loadData.js'
import presentToast from '@/components/presentToast'
import ETAPopup from '@/components/ETAPopup.vue'
import Option from '@/views/Option.vue'
import sleep from '@/components/sleep.js'

export default defineComponent({
    name: 'ListView',
    components: {
        IonHeader,
        IonToolbar,
        IonContent,
        IonPage,
        IonItem,
        IonLabel,
        IonList,
        IonListHeader,
        IonModal,
        IonGrid,
        IonRow,
        IonCol,
        IonTitle,
        IonIcon,
        IonButtons,
        IonButton,
        ETAPopup,
        Option,
    },
    props: ['dataType'],
    setup(props) {
        // Create ref for loading and show map for ui control
        const itemSelected = ref({}) // Reference for selected bus on query
        const modalIsOpen = ref(false)
        const optionIsOpen = ref(false)
        const data = ref([]) // For storage of routes and stops
        const type = ref(props.dataType)
        const dataReady = ref(false)
        const altRoutes = ref([]) // For saving directions with same routeNo, which will be passed to etaPopup
        // Event listeners
        addEventListener('ionModalDidDismiss', function () {
            modalIsOpen.value = false
        })
        return {
            data,
            itemSelected,
            altRoutes,
            modalIsOpen,
            optionIsOpen,
            type,
            dataReady,
            cog,
        }
    },
    methods: {
        openModal(index) {
            this.itemSelected = JSON.parse(JSON.stringify(this.data[index])) //Use Deep copy to prevent problems when clicked again
            this.getAltRoutes()
            console.log(this.itemSelected)
            this.modalIsOpen = true
        },
        openAltModal(index) {
            let alt = this.data[index]
            let targetIndex = this.data.findIndex(
                (item) =>
                    item.routeId == alt.routeId &&
                    item.direction != alt.direction
            )
            if (targetIndex != -1) {
                this.openModal(targetIndex)
            } else {
                presentToast('info', '未找到相關方向，正在顯示順行')
                this.openModal(index)
            }
        },
        closeModal() {
            this.modalIsOpen = false
        },
        openOption() {
            this.optionIsOpen = true
        },
        closeOption() {
            this.optionIsOpen = false
        },
        currentSelectedItem(x) {
            // For finding index of currently selected bus
            return (
                x.routeId == this.itemSelected.routeId &&
                x.routeDirection == this.itemSelected.routeDirection
            )
        },
        getAltRoutes() {
            if (this.type == 'tram') {
                this.altRoutes = JSON.parse(
                    JSON.stringify(
                        this.data.filter(
                            (item) =>
                                item.routeNo == this.itemSelected.routeNo &&
                                item.direction != this.itemSelected.direction
                        )
                    )
                )
            } else if (this.type == 'mtr' || this.type == 'lightRail') {
                this.altRoutes = JSON.parse(
                    JSON.stringify(
                        this.data.filter(
                            (item) =>
                                item.routeId == this.itemSelected.routeId &&
                                item.direction != this.itemSelected.direction
                        )
                    )
                )
            }
        },
        async swapDirection(route = undefined) {
            if (route) {
                this.modalIsOpen = false
                await sleep(100)
                this.itemSelected = JSON.parse(JSON.stringify(route))
                this.getAltRoutes()
                this.modalIsOpen = true
                console.log(this.itemSelected)
            } else {
                presentToast('error', '此路線未有對頭車')
            }
        },
    },
    async mounted() {
        this.data = await loadChunk(this.type)
        this.dataReady = true
    },
    computed: {
        checkNoEta() {
            if (
                this.type == 'ferry' ||
                this.type == 'tram' ||
                this.type == 'lightRail'
            ) {
                return true
            } else {
                return false
            }
        },
    },
})
</script>
<style scoped>
.direction1-badge {
    --background: #5e6fa1;
}

.direction2-badge {
    --background: #a1905e;
}

.line-color-indicator {
    height: 15px;
    width: 80%;
    border-radius: 10px;
}
.d-flex {
    display: flex;
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
.route-no {
    display: flex;
}
.hint{
    font-size: 1.2rem
}
</style>
