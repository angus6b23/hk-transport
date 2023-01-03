<template>
    <ion-page>
        <ion-loading :is-open="loading" :message="loading_message"></ion-loading>
        <div v-if="!setting_found" id="init">
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
import { fetch_bus, get_buses, get_minibuses } from '@/components/fetch.js';

export default defineComponent({
    name: 'TabsPage',
    components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonRouterOutlet, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading },
    setup() {
        const setting_found = ref(false);
        const setting = ref({});
        const loading = ref(true);
        const loading_message = ref('請稍侯...<br>Please Wait...');
        return {
            speedometerOutline,
            business,
            square,
            bus,
            setting_found,
            setting,
            loading,
            loading_message,
        }
    },
    methods:{
        async set_language(lang){
            this.setting.lang = lang;
            let clone_setting = {...this.setting}
            let setting_promise = await this.localforage.setItem('setting', clone_setting);
            this.setting_found = true;
        }
    },
    async mounted(){
        try{
            let load_setting = await this.localforage.getItem('setting')
            if (load_setting){
                this.setting = load_setting;
                this.setting_found = true;
            }
        } catch(err){
            console.error(err);
        }
        this.loading = false;
        try{
            let bus_data = await this.localforage.getItem('bus_data');
            if (!bus_data){
                this.loading = true;
                this.loading_message = '正在獲取巴士資訊...<br>Fetching Bus data...';
                bus_data = await get_buses();
                this.localforage.setItem('bus_data', bus_data).then(()=>{this.loading = false});
            }
            let minibus_data = await this.localforage.getItem('minibus_data');
            if (!minibus_data){
                console.log('fetch minibus data');
                this.loading = true;
                this.loading_message = '正在獲取小巴資訊...<br>Fetching Minibus data...';
                minibus_data = await get_minibuses();
                this.localforage.setItem('minibus_data', minibus_data).then(()=>{this.loading = false});
            }
        } catch (err){
            console.error(err)
        }
        this.loading = false;
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
