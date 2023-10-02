<template>
    <ion-page>
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
                            <ion-button expand="block" class="ion-margin-top" @click="$i18next.changeLanguage('en'); setLang('en')">English</ion-button>
                            <div class="ion-margin-top customApiDiag">
                                <ion-checkbox slot="start" v-model="useOwnAPI"></ion-checkbox>
                                <ion-label>使用自訂的站台 / Use your own endpoint</ion-label>
                                <div :class="{'hidden':!useOwnAPI, 'ion-margin-top': true}">
                                    <ion-input v-model="hostUrl" :placeholder="$t('landing.urlPlaceholder')" required></ion-input>
                                </div>
                            </div>
                        </ion-card-content>
                    </div>
                </ion-card>
            </div>
            <div v-if="step == 2" class="swipe-wrapper ion-margin-start ion-margin-end ion-margin-top swipe-wrapper">
                <ion-card>
                    <ion-card-header>
                        <ion-card-title>
                            {{ $t('landing.quicktour') }}
                        </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <swiper class="ion-margin-top ion-margin-bottom" :modules="modules" :slides-per-view="1" :space-between="50" pagination>
                        <swiper-slide>
                            <div class="swipe-slide">
                                <div class="video-wrapper">
                                    <video autoplay muted loop>
                                        <source src="assets/videos/hint1.webm" />
                                    </video>
                                </div>
                                <p>{{ $t('landing.hint1') }}</p>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="swipe-slide">
                                <div class="video-wrapper">
                                    <video autoplay muted loop preload="none">
                                        <source src="assets/videos/hint2.webm" />
                                    </video>
                                </div>
                                <p>{{ $t('landing.hint2') }}</p>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="swipe-slide">
                                <div class="video-wrapper">
                                    <video autoplay muted loop preload="none">
                                        <source src="assets/videos/hint3.webm" />
                                    </video>
                                </div>
                                <p>{{ $t('landing.hint3') }}</p>
                            </div>
                        </swiper-slide>
                        <swiper-slide>
                            <div class="swipe-slide">
                                <div class="video-wrapper">
                                    <video autoplay muted loop preload="none">
                                        <source src="assets/videos/hint4.webm" />
                                    </video>
                                </div>
                                <p>{{ $t('landing.hint4') }}</p>
                            </div>
                        </swiper-slide>
                        </swiper>
                        <div class="button-wrapper">
                            <ion-button fill="clear">{{ $t('common.skip') }}</ion-button>
                            <ion-button @click="finishConfig()">{{ $t('common.next') }}</ion-button>
                        </div>
                        <ion-progress-bar :value="downloadProgress" class="ion-margin-top" />
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonPage, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonContent, IonLabel, IonInput, IonCheckbox, IonProgressBar } from '@ionic/vue';
import { chevronBackOutline, checkmarkOutline } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import fetchAPIData from '@/fetch/fetchAPIData'
import presentToast from '@/components/presentToast';
import 'swiper/css'
import 'swiper/css/pagination';


export default defineComponent({
    name: 'Landing',
    components: { IonPage, IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonContent, IonLabel, IonInput, IonCheckbox, Swiper, SwiperSlide, IonProgressBar },
    emits: ['finishConfig'],
    setup() {
        const lang = ref('');
        const useOwnAPI = ref(false);
        const hostUrl = ref('');
        const step = ref(1);
        const downloadProgress = ref(0);
        return {
            hostUrl,
            step,
            chevronBackOutline,
            checkmarkOutline,
            lang,
            useOwnAPI,
            downloadProgress,
            modules: [Pagination]
        }
    },
    mounted(){
        this.$el.addEventListener('downloadProgress', this.handleDownloadProgress);
    },
    methods: {
        async setLang(lang) {
            this.lang = lang
            this.step = 2
            await this.initiateDownload();
        },
        back(){
            this.step = 1;
        },
        finishConfig(){
            let config = {
                lang: this.lang,
                theme: 'system',
                fetchMethod: this.useOwnAPI ? 'self' : 'default',
                apiBaseUrl: this.useOwnAPI ? this.hostUrl : '',
                dataFilled: false,
                autoScroll: true
            }
            this.$emit('finishConfig', config)
        },
        handleDownloadProgress(progress){
            this.downloadProgress = progress.detail.current / progress.detail.objSize;
        },
        async initiateDownload(){
            try{
                let isSuccess = false;
                let config = {
                    lang: this.lang,
                    theme: 'system',
                    fetchMethod: this.useOwnAPI ? 'self' : 'default',
                    apiBaseUrl: this.useOwnAPI ? this.hostUrl : '',
                    dataFilled: false,
                    autoScroll: true
                }
                switch (config.fetchMethod) {
                    case 'default':
                        isSuccess = await fetchAPIData(undefined, this.$el);
                        break;
                    case 'self':
                        isSuccess = await fetchAPIData(config.apiBaseUrl. this.$el);
                        break;
                    case 'hkgov':
                        console.log('hkgov')
                        break;
                }
                if (isSuccess) {
                    this.$emit('finishConfig', config);
                } else {
                    if (config.lang == 'zh') {
                        presentToast('error', '未能取得路線資料，請檢查網路設定')
                    } else {
                        presentToast('error', 'Unable to fetch route data, please check your internet connection')
                    }
                }
            } catch (err) {
                console.error(err);
            }
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
    height: 50vh;
    min-width: 300px;
    min-height: 300px;
}
.button-container{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.hidden {
    visibility: hidden;
}
.swipe-wrapper{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%
}
.button-wrapper{
    display: flex;
    justify-content: space-between
}
.swipe-slide {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: center;
}
.video-wrapper{
    width:100%;
    display: flex;
    justify-content: center;
}
.video-wrapper > video{
    max-height: 60vh;
    object-fit: contain;
}
.swipe-slide > p{
    margin-bottom: 30px;
}
</style>
