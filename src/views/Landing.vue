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
                            <ion-button expand="block" class="ion-margin-top" @click="$i18next.changeLanguage('zh'); setLang('zh')">正體中文</ion-button>
                            <ion-button expand="block" class="ion-margin-top"
                                @click="$i18next.changeLanguage('en'); setLang('en')">English</ion-button>
                        </ion-card-content>
                    </div>
                </ion-card>
            </div>
            <div v-if="step == 2" class="ion-margin-start ion-margin-end ion-margin-top">
                <div>
                    <ion-title>{{ $t('landing.selectSource') }}</ion-title>
                    <form @submit.prevent="finishConfig()">
                        <ion-list class="ion-margin-top">
                            <ion-radio-group v-model="radioSelect">
                                <ion-item>
                                    <ion-label class="ion-text-wrap">{{ $t('landing.optionPrefetch') }}</ion-label>
                                    <ion-radio slot="end" value="default" checked></ion-radio>
                                </ion-item>
        
                                <ion-item>
                                    <ion-label class="ion-text-wrap">{{ $t('landing.optionGovAPI') }}</ion-label>
                                    <ion-radio slot="end" value="hkgov"></ion-radio>
                                </ion-item>
        
                                <ion-item>
                                    <ion-label class="ion-text-wrap">{{ $t('landing.optionSelfHost') }}</ion-label>
                                    <ion-radio slot="end" value="self"></ion-radio>
                                </ion-item>
                            </ion-radio-group>
                            <ion-item v-if="radioSelect == 'self'">
                                <ion-label position="stacked">{{ $t('landing.hostHint') }}</ion-label>
                                <ion-input v-model="hostUrl" :placeholder="$t('landing.urlPlaceholder')" required></ion-input>
                            </ion-item>
                        </ion-list>
                        <div class="button-container">
                            <ion-button fill="clear" type="button" @click="back()">
                                <ion-icon :icon="chevronBackOutline" slot="start"></ion-icon>
                                {{ $t('common.back') }}
                            </ion-button>
                            <ion-button fill="solid" type="submit">
                                <ion-icon :icon="checkmarkOutline" ></ion-icon>
                                {{ $t('common.finish') }}
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
import { IonPage, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonList, IonRadio, IonTitle, IonItem, IonContent, IonLabel, IonInput, IonRadioGroup, IonIcon } from '@ionic/vue';
import { chevronBackOutline, checkmarkOutline } from 'ionicons/icons';

export default defineComponent({
    name: 'Landing',
    components: { IonPage, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonLoading, IonList, IonRadio, IonTitle, IonItem, IonContent, IonLabel, IonInput, IonRadioGroup, IonIcon},
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
                theme: 'system',
                fetchMethod: this.radioSelect,
                apiBaseUrl: (this.radioSelect == 'self') ? this.hostUrl : '',
                dataFilled: false,
                autoScroll: true
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
