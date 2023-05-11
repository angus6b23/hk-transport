<template>
    <ion-page>
        <ion-loading :is-open="loading" :message="loadingMessage" :translucent="true">
        </ion-loading>
        <div v-if="!settingFound" id="init">
            <Landing @finishConfig="finishConfig"></Landing>
        </div>
        <div v-else>
            <ion-tabs @ionTabsDidChange="afterTabChange">
                <ion-router-outlet></ion-router-outlet>
                <ion-tab-bar slot="bottom" >
                    <ion-tab-button tab="bus" href="/tabs/bus">
                        <ion-icon v-if="currentTab == 'bus'" :icon="bus" />
                        <ion-icon v-else :icon="busOutline" />
                        <ion-label>巴士</ion-label>
                    </ion-tab-button>

                    <ion-tab-button tab="minibus" href="/tabs/minibus">
                        <ion-icon v-if="currentTab == 'minibus'" :icon="speedometer" />
                        <ion-icon v-else :icon="speedometerOutline" />
                        <ion-label>專線小巴</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="tram" href="/tabs/tram">
                        <ion-icon v-if="currentTab == 'tram'" :icon="train" />
                        <ion-icon v-else :icon="trainOutline" />
                        <ion-label>電車</ion-label>
                    </ion-tab-button>
                    <ion-tab-button tab="ferry" href="/tabs/ferry">
                        <ion-icon v-if="currentTab == 'ferry'" :icon="boat" />
                        <ion-icon v-else :icon="boatOutline" />
                        <ion-label>渡輪</ion-label>
                    </ion-tab-button>

                    <ion-tab-button tab="tab3" href="/tabs/tab3">
                        <ion-icon :icon="square" />
                        <ion-label>Tab 3</ion-label>
                    </ion-tab-button>
                </ion-tab-bar>
            </ion-tabs>
        </div>
    </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonProgressBar } from '@ionic/vue';
import { square, bus, busOutline, speedometer, speedometerOutline, boat, boatOutline, train, trainOutline } from 'ionicons/icons';
import localforage from 'localforage';
import presentToast from '@/components/presentToast';
import fetchAPIData from '@/fetch/fetchAPIData';
import Landing from '@/views/Landing.vue';

export default defineComponent({
    name: 'TabsPage',
    components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonProgressBar, Landing },
    setup() {
        const settingFound = ref(true);
        const config = ref({});
        const loading = ref(false);
        const loadingMessage = ref('請稍侯...<br>Please Wait...');
        const currentTab = ref('');
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
        }
    },
    methods:{
        afterTabChange(e){ //Change icon upon changing tab
            this.currentTab = e.tab
        },
        async finishConfig(config){ //Save config and fetch data after initial setup
            try {
                this.loading = true;
                this.loadingMessage = '正在獲取交通資訊...<br>Fetching Transport data...<br><span id="loading-progress">Progress<span>';
                let isSuccess = false 
                switch (config.fetchMethod){
                    case 'default':
                        isSuccess = await fetchAPIData();
                        break;
                    case 'self':
                        isSuccess = await fetchAPIData(config.apiBaseUrl);
                        break;
                    case 'hkgov':
                        console.log('hkgov')
                        break;
                }
                if (isSuccess){
                    this.loading = false;
                    await localforage.setItem('config', config);
                    this.settingFound = true;
                } else {
                    this.loading = false;
                    if (config.lang == 'zh'){
                        presentToast('error', '未能取得路線資料，請檢查網路設定')
                    } else {
                        presentToast('error', 'Unable to fetch route data, please check your internet connection')
                    }
                }
            } catch(err){
                console.error(err);
            }
            
        }
    },
    async mounted(){
        try{
            const config = await localforage.getItem('config')
            if (config){
                this.config = config
                this.settingFound = true
            } else {
                this.settingFound = false
            }
        } catch(err){
            this.settingFound = false
            console.error(err);
        }
    }
});
</script>
<style scoped>

</style>
