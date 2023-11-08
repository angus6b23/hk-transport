<template>
    <ion-page>
        <ion-content class="ion-margin-top ion-margin-start ion-margin-end">
            <div v-if="step == 1" id="init">
                <ion-card id="welcome_card">
                    <div>
                        <ion-card-header>
                            <ion-card-title class="ion-text-center"
                                >歡迎 Welcome</ion-card-title
                            >
                            <ion-card-subtitle class="ion-margin-top"
                                >請選擇語言</ion-card-subtitle
                            >
                            <ion-card-subtitle
                                >Please select language</ion-card-subtitle
                            >
                        </ion-card-header>
                        <ion-card-content>
                            <ion-button
                                expand="block"
                                class="ion-margin-top"
                                @click="setLang('zh')"
                                >正體中文</ion-button
                            >
                            <ion-button
                                expand="block"
                                class="ion-margin-top"
                                @click="setLang('en')"
                                >English</ion-button
                            >
                            <div class="ion-margin-top customApiDiag">
                                <ion-item>
                                    <ion-checkbox
                                        slot="start"
                                        v-model="useOwnAPI"
                                    ></ion-checkbox>
                                    <ion-label
                                        >使用自訂的站台 <br />
                                        Use your own endpoint</ion-label
                                    >
                                </ion-item>
                                <ion-item
                                    :class="{
                                        hidden: !useOwnAPI,
                                        'ion-margin-top': true,
                                    }"
                                >
                                    <ion-input
                                        v-model="hostUrl"
                                        placeholder="https://your.endpoint.api/"
                                        required
                                    ></ion-input>
                                </ion-item>
                            </div>
                        </ion-card-content>
                    </div>
                </ion-card>
            </div>
            <div v-if="step == 2" class="card-wrapper">
                <ion-card class="tour-card">
                    <ion-card-header>
                        <ion-card-title>
                            {{ $t('landing.quicktour') }}
                        </ion-card-title>
                    </ion-card-header>
                    <ion-card-content>
                        <swiper
                            style="max-height: 60vh"
                            :modules="modules"
                            :slides-per-view="1"
                            :space-between="50"
                            pagination
                        >
                            <swiper-slide>
                                <div class="swipe-slide">
                                    <div class="video-wrapper">
                                        <video autoplay muted loop>
                                            <source
                                                src="assets/videos/hint1.webm"
                                            />
                                        </video>
                                    </div>
                                    <p>{{ $t('landing.hint1') }}</p>
                                </div>
                            </swiper-slide>
                            <swiper-slide>
                                <div class="swipe-slide">
                                    <div class="video-wrapper">
                                        <video
                                            autoplay
                                            muted
                                            loop
                                            preload="none"
                                        >
                                            <source
                                                src="assets/videos/hint2.webm"
                                            />
                                        </video>
                                    </div>
                                    <p>{{ $t('landing.hint2') }}</p>
                                </div>
                            </swiper-slide>
                            <swiper-slide>
                                <div class="swipe-slide">
                                    <div class="video-wrapper">
                                        <video
                                            autoplay
                                            muted
                                            loop
                                            preload="none"
                                        >
                                            <source
                                                src="assets/videos/hint3.webm"
                                            />
                                        </video>
                                    </div>
                                    <p>{{ $t('landing.hint3') }}</p>
                                </div>
                            </swiper-slide>
                            <swiper-slide>
                                <div class="swipe-slide">
                                    <div class="video-wrapper">
                                        <video
                                            autoplay
                                            muted
                                            loop
                                            preload="none"
                                        >
                                            <source
                                                src="assets/videos/hint4.webm"
                                            />
                                        </video>
                                    </div>
                                    <p>{{ $t('landing.hint4') }}</p>
                                </div>
                            </swiper-slide>
                            <swiper-slide>
                                <div class="swipe-slide">
                                    <img
                                        style="
                                            object-fit: contain;
                                            height: 100%;
                                            width: 100%;
                                            max-height: 50vh;
                                        "
                                        src="assets/hk-transport-animated.svg"
                                    />
                                    <p>{{ $t('landing.hint5') }}</p>
                                </div>
                            </swiper-slide>
                        </swiper>
                        <div class="option-wrapper">
                            <div>
                                <ion-item>
                                    <ion-checkbox
                                        slot="start"
                                        v-model="autoStart"
                                    />
                                    <ion-label class="ion-text-wrap">{{
                                        $t('landing.autoStart')
                                    }}</ion-label>
                                </ion-item>
                            </div>
                            <div class="finish-wrapper">
                                <ion-text class="ion-margin-end">
                                    {{ downloadText }}
                                </ion-text>
                                <ion-button
                                    @click="finishConfig()"
                                    :disabled="!downloadFinish"
                                    >{{ $t('common.finish') }}</ion-button
                                >
                            </div>
                        </div>
                        <ion-progress-bar
                            :value="downloadProgress"
                            class="ion-margin-top"
                        />
                    </ion-card-content>
                </ion-card>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import {
    IonPage,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardSubtitle,
    IonCardTitle,
    IonCardHeader,
    IonContent,
    IonLabel,
    IonInput,
    IonCheckbox,
    IonProgressBar,
    IonItem,
    IonText,
} from '@ionic/vue'
import { chevronBackOutline, checkmarkOutline } from 'ionicons/icons'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination } from 'swiper/modules'
import fetchAPIData from '@/fetch/fetchAPIData'
import presentToast from '@/components/presentToast'
import 'swiper/css'
import 'swiper/css/pagination'

export default defineComponent({
    name: 'Landing',
    components: {
        IonPage,
        IonButton,
        IonCard,
        IonCardContent,
        IonCardSubtitle,
        IonCardTitle,
        IonCardHeader,
        IonContent,
        IonLabel,
        IonInput,
        IonCheckbox,
        Swiper,
        SwiperSlide,
        IonProgressBar,
        IonItem,
        IonText,
    },
    emits: ['finishConfig'],
    setup() {
        const lang = ref('')
        const useOwnAPI = ref(false)
        const hostUrl = ref('')
        const step = ref(1)
        const downloadProgress = ref(0)
        const downloadText = ref('')
        const downloadFinish = ref(false)
        const autoStart = ref(true)
        return {
            hostUrl,
            step,
            chevronBackOutline,
            checkmarkOutline,
            lang,
            useOwnAPI,
            downloadProgress,
            downloadFinish,
            autoStart,
            downloadText,
            modules: [Pagination],
        }
    },
    mounted() {
        this.$el.addEventListener(
            'downloadProgress',
            this.handleDownloadProgress
        )
    },
    methods: {
        async setLang(lang) {
            this.$i18next.changeLanguage(lang)
            this.lang = lang
            this.step = 2
            if (this.useOwnAPI && this.hostUrl === '') {
                this.useOwnAPI = false
                presentToast('info', this.$t('landing.nullUrl'))
            }
            await this.initiateDownload()
        },
        finishConfig() {
            let config = {
                lang: this.lang,
                theme: 'system',
                fetchMethod: this.useOwnAPI ? 'self' : 'default',
                apiBaseUrl: this.useOwnAPI ? this.hostUrl : '',
                dataFilled: false,
                autoScroll: true,
            }
            this.$emit('finishConfig', config)
        },
        handleDownloadProgress(progress) {
            this.downloadProgress =
                progress.detail.current / progress.detail.objSize
            this.downloadText = `${progress.detail.current} / ${progress.detail.objSize}`
        },
        checkURL() {
            try {
                const url = new URL(this.hostUrl)
                return url.protocol === 'http:' || url.protocol === 'https:'
            } catch (err) {
                return false
            }
        },
        async initiateDownload() {
            try {
                if (this.useOwnAPI) {
                    if (!this.checkURL()) {
                        throw new Error('Invalid Url')
                    }
                }
                let isSuccess = false
                let config = {
                    lang: this.lang,
                    theme: 'system',
                    fetchMethod: this.useOwnAPI ? 'self' : 'default',
                    apiBaseUrl: this.useOwnAPI ? this.hostUrl : '',
                    dataFilled: false,
                    autoScroll: true,
                }
                switch (config.fetchMethod) {
                    case 'default':
                        isSuccess = await fetchAPIData(undefined, this.$el)
                        break
                    case 'self':
                        isSuccess = await fetchAPIData(
                            config.apiBaseUrl,
                            this.$el
                        )
                        break
                    default:
                        throw new Error('Unknown fetch method')
                }
                if (isSuccess) {
                    this.downloadFinish = true
                    if (this.autoStart) {
                        this.$emit('finishConfig', config)
                    }
                } else {
                    throw new Error('Fetch Failed')
                }
            } catch (err) {
                this.step = 1
                if (err.message === 'Fetch Failed') {
                    console.log('hit')
                    presentToast('error', this.$i18next.t('toast.networkError'))
                } else if (err.message === 'Invalid Url') {
                    console.log('invalidurl')
                    presentToast('error', this.$i18next.t('toast.invalidUrl'))
                }
            }
        },
    },
})
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
    padding: 2rem;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    min-width: fit-content;
    height: 50vh;
    min-width: 300px;
    min-height: 300px;
}
.option-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
}
.hidden {
    visibility: hidden;
}
.card-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}
.button-wrapper {
    display: flex;
    justify-content: space-between;
}
.swipe-slide {
    height: 100%;
    display: flex !important;
    flex-wrap: wrap;
    justify-content: center;
}
.video-wrapper {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
}
.video-wrapper > video {
    max-height: 50vh;
    object-fit: contain;
}
.swipe-slide > p {
    margin-top: 0.5rem;
    margin-bottom: 2rem;
}
.tour-card {
    min-height: fit-content;
}
.finish-wrapper {
    display: flex;
    align-items: center;
}
@media only screen and (max-width: 640px) {
    .finish-wrapper {
        width: 100%;
        justify-content: space-around;
    }
}
</style>
