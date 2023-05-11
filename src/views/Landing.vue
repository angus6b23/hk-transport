<template>
    <ion-page>
        <ion-loading :is-open="loading" :message="loadingMessage" :translucent="true">
        </ion-loading>
        <ion-content class="ion-margin-top ion-margin-start ion-margin-end">
            <div v-if="step == 1" id="init">
                <ion-card id="welcome_card">
                    <div>
                        <ion-card-header>
                            <ion-card-title class="ion-text-center">歡迎 Welcome</ion-card-title>
                            <ion-card-subtitle class="ion-margin-top">請選擇語言</ion-card-subtitle>
                            <ion-card-subtitle>Please select language</ion-card-subtitle>
                        </ion-card-header>
                        <ion-card-content>
                            <ion-button expand="block" class="ion-margin-top" @click="setLang('zh')">正體中文</ion-button>
                            <ion-button expand="block" class="ion-margin-top"
                                @click="setLang('en')">English</ion-button>
                        </ion-card-content>
                    </div>
                </ion-card>
            </div>
            <div v-if="step == 2" class="ion-margin-start ion-margin-end ion-margin-top">
                <div v-if="lang == 'zh'">
                    <ion-title>請選擇資料來源</ion-title>
                    <form @submit.prevent="finishConfig()">
                        <ion-list class="ion-margin-top">
                            <ion-radio-group v-model="radioSelect">
                                <ion-item>
                                    <ion-label class="ion-text-wrap">預先整理好的資料(建議)</ion-label>
                                    <ion-radio slot="end" value="default" checked></ion-radio>
                                </ion-item>
        
                                <ion-item>
                                    <ion-label class="ion-text-wrap">直接從gov.hk API 獲取</ion-label>
                                    <ion-radio slot="end" value="hkgov"></ion-radio>
                                </ion-item>
        
                                <ion-item>
                                    <ion-label class="ion-text-wrap">使用自後搭建的後台</ion-label>
                                    <ion-radio slot="end" value="self"></ion-radio>
                                </ion-item>
                            </ion-radio-group>
                            <ion-item v-if="radioSelect == 'self'">
                                <ion-label position="stacked">你可以在 12a.app github 找到自行搭建的方法</ion-label>
                                <ion-input v-model="hostUrl" placeholder="在此輸入網址: https://your.api/" required></ion-input>
                            </ion-item>
                        </ion-list>
                        <div class="button-container">
                            <ion-button fill="clear" type="button" @click="back()">
                                <ion-icon :icon="chevronBackOutline" slot="start"></ion-icon>
                                上一步
                            </ion-button>
                            <ion-button fill="solid" type="submit">
                                <ion-icon :icon="checkmarkOutline" ></ion-icon>
                                完成
                            </ion-button>
                        </div>
                    </form>
                </div>
                <div v-else>
                    <ion-title>Please select data source</ion-title>
                    <form @submit.prevent="finishConfig()">
                        <ion-list class="ion-margin-top">
                            <ion-radio-group v-model="radioSelect">
                                <ion-item>
                                    <ion-label class="ion-text-wrap">Pre-fetched data from backend (Recommended)</ion-label>
                                    <ion-radio slot="end" value="default" checked></ion-radio>
                                </ion-item>
        
                                <ion-item>
                                    <ion-label class="ion-text-wrap">Direct from api.gov.hk</ion-label>
                                    <ion-radio slot="end" value="hkgov"></ion-radio>
                                </ion-item>
        
                                <ion-item>
                                    <ion-label class="ion-text-wrap">Use self-hosted backend</ion-label>
                                    <ion-radio slot="end" value="self"></ion-radio>
                                </ion-item>
                            </ion-radio-group>
                            <ion-item v-if="radioSelect == 'self'">
                                <ion-label position="stacked">You can find ways to self-host from 12a.app github</ion-label>
                                <ion-input v-model="hostUrl" placeholder="Enter the url: https://your.api/" required></ion-input>
                            </ion-item>
                        </ion-list>
                        <div class="button-container">
                            <ion-button fill="clear" type="button" @click="back()">
                                <ion-icon :icon="chevronBackOutline" slot="start"></ion-icon>
                                Back
                            </ion-button>
                            <ion-button fill="solid" type="submit">
                                <ion-icon :icon="checkmarkOutline" ></ion-icon>
                                Finish
                            </ion-button>
                        </div>
                    </form>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonPage, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonList, IonRadio, IonTitle, IonItem, IonContent, IonLabel, IonInput, IonRadioGroup, IonIcon } from '@ionic/vue';
import { chevronBackOutline, checkmarkOutline } from 'ionicons/icons';
import presentToast from '@/components/presentToast'

export default defineComponent({
    name: 'Landing',
    components: { IonPage, IonText, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonList, IonRadio, IonTitle, IonItem, IonContent, IonLabel, IonInput, IonRadioGroup, IonIcon, presentToast },
    emits: ['finishConfig'],
    setup() {
        const loading = ref(false);
        const lang = ref('');
        const loadingMessage = ref('');
        const radioSelect = ref('default');
        const hostUrl = ref('');
        const step = ref(1);
        return {
            radioSelect,
            hostUrl,
            step,
            loading,
            loadingMessage,
            chevronBackOutline,
            checkmarkOutline,
            lang
        }
    },
    methods: {
        setLang(lang) {
            this.lang = lang
            this.step = 2
        },
        back(){
            this.step = 1;
        },
        finishConfig(){
            let config = {
                lang: this.lang,
                fetchMethod: this.radioSelect,
                apiBaseUrl: (this.radioSelect == 'self') ? this.hostUrl : '',
            }
            this.$emit('finishConfig', config)
        }
    }
});
</script>
<style scoped>
#init {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

#welcome_card {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 30vw;
    height: 45vh;
    min-width: 300px;
    min-height: 300px;
}
.button-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
