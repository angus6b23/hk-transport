<template>
    <ion-page>
        <ion-loading :is-open="loading" :message="loading_message"></ion-loading>
        <div v-if="!settingFound" id="init">
            <ion-card id="welcome_card">
                <div>
                    <ion-card-header>
                        <ion-card-title class="ion-text-center">歡迎 Welcome</ion-card-title>
                        <ion-card-subtitle class="ion-margin-top">請選擇語言</ion-card-subtitle>
                        <ion-card-subtitle>Please select language</ion-card-subtitle>
                    </ion-card-header>
                    <ion-card-content>
                        <ion-button expand="block" class="ion-margin-top" @click="set_language('zh')">正體中文</ion-button>
                        <ion-button expand="block" class="ion-margin-top" @click="set_language('en')">English</ion-button>
                    </ion-card-content>
                </div>
            </ion-card>
        </div>
        <div v-else>
            <ion-tabs>
                <ion-router-outlet></ion-router-outlet>
                <ion-tab-bar slot="bottom">
                    <ion-tab-button tab="tab1" href="/tabs/bus">
                        <ion-icon :icon="bus" />
                        <ion-label>巴士</ion-label>
                    </ion-tab-button>

                    <ion-tab-button tab="tab2" href="/tabs/minibus">
                        <ion-icon :icon="speedometerOutline" />
                        <ion-label>專線小巴</ion-label>
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
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading } from '@ionic/vue';
import { business, square, bus, speedometerOutline } from 'ionicons/icons';
import { loadData, setData } from '@/components/loadData.js'
import { fetchBuses, fetchMinibuses } from '@/components/fetchData.js'

export default defineComponent({
    name: 'TabsPage',
    components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading },
    setup() {
        const settingFound = ref(false);
        const setting = ref({});
        const loading = ref(false);
        const busData = [];
        const minibusData = [];
        const loading_message = ref('請稍侯...<br>Please Wait...');
        return {
            speedometerOutline,
            business,
            square,
            bus,
            settingFound,
            setting,
            loading,
            loading_message,
        }
    },
    methods:{
        async set_language(lang){
            // Set Language
            this.setting.lang = lang;
            let clone_setting = {...this.setting};
            let setting_promise = await setData('setting', clone_setting);
            // Initiate loading after selection
            try{
                this.loading = true;
                this.loading_message = '正在獲取交通資訊...<br>Fetching Transport data...';
                // loadData(key, forceReload, chunk);
                this.busData = await loadData('busData', false, true); 
                this.minibusData = await loadData('minibusData', false, false);
                this.loading = false;
            }
            catch(err){
                console.error(err);
            }
            this.settingFound = true;
        },
    },
    async mounted(){
        try{
            let loadSetting = await loadData('setting', false, false);
            console.log(`Current setting: ${loadSetting}`)
            if (loadSetting){
                this.setting = loadSetting;
                this.settingFound = true;
            }
        } catch(err){
            console.error(err);
        }
    }
});
</script>
<style scoped>
#init{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}
#welcome_card{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 40vh;
    height: 40vh;
}
</style>
