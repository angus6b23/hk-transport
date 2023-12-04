<template>
    <!-- Header for news -->
    <ion-header>
        <ion-toolbar>
            <!-- Title -->
            <ion-title>{{ $t('news.title') }}</ion-title>
            <!-- Back button -->
            <ion-buttons slot="start">
                <ion-button @click="closeNews">
                    <ion-icon :icon="chevronBack" />
                </ion-button>
            </ion-buttons>
            <!-- refresh Button -->
            <ion-buttons slot="end">
                <ion-button @click="fetchNews">
                    <ion-icon :icon="refreshOutline" />
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-bottom">
        <!-- List Starts here -->
        <ion-list>
            <ion-list-header>
                <ion-label>{{ $t('news.sourceHeader') }}</ion-label>
            </ion-list-header>
            <ion-item v-for="(message, index) of news" :key="index">
                <ion-label style="white-space: unset">
                    <h2 style="margin-bottom: 0.5rem">
                        {{ message.message.trim().replace(/\\t/g, '') }}
                    </h2>
                    <p>{{ message.timestamp }}</p>
                </ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script>
import axios from 'axios'
import {
    IonHeader,
    IonLabel,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    loadingController,
} from '@ionic/vue'
import { chevronBack, refreshOutline } from 'ionicons/icons'
import presentToast from '@/components/presentToast.js'
import { inject, ref } from 'vue'

export default {
    name: 'News-popup',
    emits: 'closeNews',
    components: {
        IonHeader,
        IonLabel,
        IonTitle,
        IonContent,
        IonList,
        IonListHeader,
        IonItem,
        IonIcon,
        IonButton,
        IonButtons,
        IonToolbar,
    },
    setup() {
        const config = inject('globalConfig')
        const news = ref([])
        return {
            chevronBack,
            refreshOutline,
            config,
            news,
        }
    },
    async mounted() {
        await this.fetchNews()
    },
    methods: {
        async fetchNews() {
            const loader = await loadingController.create({
                message: this.$t('news.fetching'),
            })
            try {
                loader.present()
                const res = await axios({
                    method: 'get',
                    baseURL:
                        this.config.fetchMethod === 'self'
                            ? this.config.apiBaseUrl
                            : 'https://api.12a.app/hk-transport',
                    url: 'get-news',
                })
                this.news = res.data
                loader.dismiss()
                if (this.$i18next.language === 'en') {
                    presentToast(
                        'info',
                        'Traffic news are currently only avaliable in Chinese'
                    )
                }
            } catch (err) {
                loader.dismiss()
                presentToast('error', err)
            }
        },
        closeNews() {
            this.$emit('closeNews')
        },
    },
}
</script>
<style></style>
