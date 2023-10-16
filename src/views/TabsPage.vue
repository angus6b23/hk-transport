<template>
    <ion-page>
        <ion-loading
            :is-open="loading"
            :message="loadingMessage"
            :translucent="true"
        >
        </ion-loading>
        <div v-if="!settingFound" id="init">
            <Landing @finishConfig="finishConfig"></Landing>
        </div>
        <div v-else>
            <ion-tabs @ionTabsDidChange="afterTabChange">
                <ion-router-outlet></ion-router-outlet>
                <ion-tab-bar
                    slot="bottom"
                    class="scrollable-bar ion-padding-start"
                >
                    <ion-tab-button
                        tab="bus"
                        href="/tabs/bus"
                        class="scrollable-item"
                    >
                        <ion-icon v-if="currentTab == 'bus'" :icon="bus" />
                        <ion-icon v-else :icon="busOutline" />
                        <ion-label class="label-text">{{
                            $t('common.bus')
                        }}</ion-label>
                    </ion-tab-button>
                    <ion-tab-button
                        tab="mtr"
                        href="/tabs/mtr"
                        class="scrollable-item"
                    >
                        <BIconTrainFrontFill
                            v-if="currentTab == 'mtr'"
                            class="bi-icons"
                        />
                        <BIconTrainFront v-else class="bi-icons" />
                        <ion-label class="label-text">{{
                            $t('common.underground')
                        }}</ion-label>
                    </ion-tab-button>
                    <ion-tab-button
                        tab="minibus"
                        href="/tabs/minibus"
                        class="scrollable-item"
                    >
                        <BIconTruckFrontFill
                            v-if="currentTab == 'minibus'"
                            class="bi-icons"
                        />
                        <BIconTruckFront v-else class="bi-icons" />
                        <ion-label class="label-text">{{
                            $t('common.minibus')
                        }}</ion-label>
                    </ion-tab-button>
                    <ion-tab-button
                        tab="tram"
                        href="/tabs/tram"
                        class="scrollable-item"
                    >
                        <ion-icon v-if="currentTab == 'tram'" :icon="train" />
                        <ion-icon v-else :icon="trainOutline" />
                        <ion-label class="label-text">{{
                            $t('common.tram')
                        }}</ion-label>
                    </ion-tab-button>
                    <ion-tab-button
                        tab="lightRail"
                        href="/tabs/light-rail"
                        class="scrollable-item"
                    >
                        <BIconTrainLightrailFrontFill
                            v-if="currentTab == 'lightRail'"
                            class="bi-icons"
                        />
                        <BIconTrainLightrailFront v-else class="bi-icons" />
                        <ion-label class="label-text">{{
                            $t('common.lightRail')
                        }}</ion-label>
                    </ion-tab-button>
                    <ion-tab-button
                        tab="ferry"
                        href="/tabs/ferry"
                        class="scrollable-item"
                    >
                        <ion-icon v-if="currentTab == 'ferry'" :icon="boat" />
                        <ion-icon v-else :icon="boatOutline" />
                        <ion-label class="label-text">{{
                            $t('common.ferry')
                        }}</ion-label>
                    </ion-tab-button>
                    <!-- <ion-tab-button tab="tab3" href="/tabs/tab3">
                        <ion-icon :icon="square" />
                        <ion-label>Tab 3</ion-label>
                    </ion-tab-button> -->
                </ion-tab-bar>
            </ion-tabs>
        </div>
    </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
    IonLoading,
} from '@ionic/vue'
import {
    square,
    bus,
    busOutline,
    speedometer,
    speedometerOutline,
    boat,
    boatOutline,
    train,
    trainOutline,
} from 'ionicons/icons'
import {
    BIconTruckFrontFill,
    BIconTruckFront,
    BIconTrainFront,
    BIconTrainFrontFill,
    BIconTrainLightrailFront,
    BIconTrainLightrailFrontFill,
} from 'bootstrap-icons-vue'
import localforage from 'localforage'
import presentToast from '@/components/presentToast'
import fetchAPIData from '@/fetch/fetchAPIData'
import Landing from '@/views/Landing.vue'

export default defineComponent({
    name: 'TabsPage',
    components: {
        IonLabel,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonPage,
        IonRouterOutlet,
        IonLoading,
        BIconTruckFrontFill,
        BIconTruckFront,
        BIconTrainFront,
        BIconTrainFrontFill,
        BIconTrainLightrailFront,
        BIconTrainLightrailFrontFill,
        Landing,
    },
    setup() {
        const settingFound = ref(true)
        const config = ref({})
        const loading = ref(false)
        const loadingMessage = ref('請稍侯...<br>Please Wait...')
        const currentTab = ref('')
        const body = document.body
        // const afterTabChange = (e) => {
        //     // do something after tab change
        //     currentTab.value = e.tab;
        // }
        return {
            speedometer,
            speedometerOutline,
            boat,
            boatOutline,
            train,
            trainOutline,
            square,
            bus,
            busOutline,
            settingFound,
            config,
            loading,
            loadingMessage,
            currentTab,
            body,
        }
    },
    methods: {
        afterTabChange(e) {
            //Change icon upon changing tab
            this.currentTab = e.tab
        },
        async finishConfig(config) {
            //Save config and fetch data after initial setup
            await localforage.setItem('config', { ...config, dataFilled: true })
            this.settingFound = true
        },
    },
    async mounted() {
        try {
            const config = await localforage.getItem('config')
            if (config && config.dataFilled) {
                this.config = config
                this.settingFound = true
                this.$i18next.changeLanguage(this.config.lang)
                if (config.theme && config.theme == 'dark') {
                    this.body.classList.toggle('dark', true)
                } else if (config.theme && config.theme == 'light') {
                    this.body.classList.toggle('dark', false)
                } else if (
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                ) {
                    this.body.classList.toggle('dark', true)
                }
            } else {
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.body.classList.toggle('dark', true)
                }
                this.settingFound = false
            }
        } catch (err) {
            this.settingFound = false
            console.error(err)
        }
    },
})
</script>
<style scoped>
.bi-icons {
    padding-top: 2px;
    padding-bottom: 2px;
}
.md .bi-icons {
    font-size: 22px;
}

.ios .bi-icons {
    font-size: 30px;
}

.scrollable-bar {
    display: flex;
    overflow-x: auto;
    flex-direction: row;
    justify-content: flex-start;
}

.scrollable-item {
    min-width: 96px;
}
.label-text {
    font-size: 0.75rem;
}
@media screen and (min-width: 1000px) {
    .scrollable-bar {
        justify-content: center;
    }
}
</style>
