<template>
    <ion-header>
        <ion-toolbar>
            <ion-title>{{ $t('option.title') }}</ion-title>
            <ion-buttons slot="start">
                <ion-button @click="closeOption">
                    <ion-icon :icon="chevronBack" />
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-bottom">
        <ion-list-header>
            <ion-label>{{ $t('option.basic') }}</ion-label>
        </ion-list-header>
        <ion-list>
            <ion-item button @click="presentLangAction">
                <ion-icon :icon="languageOutline" slot="start" />
                <ion-label>
                    <h5>語言 / Language</h5>
                    <p v-if="config.lang == 'zh'">正體中文</p>
                    <p v-else-if="config.lang == 'en'">English</p>
                </ion-label>
            </ion-item>
            <ion-item button @click="presentThemeAction">
                <ion-icon :icon="colorPaletteOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.theme') }}</h5>
                    <p v-if="config.theme == 'light'">
                        {{ $t('option.light') }}
                    </p>
                    <p v-else-if="config.theme == 'dark'">
                        {{ $t('option.dark') }}
                    </p>
                    <p v-else-if="config.theme == 'system'">
                        {{ $t('option.systemTheme') }}
                    </p>
                </ion-label>
            </ion-item>
            <ion-item button @click="presentSourceAction">
                <ion-icon :icon="serverOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.dataSource') }}</h5>
                    <p v-if="config.fetchMethod == 'default'">
                        {{ $t('option.defaultSource') }}
                    </p>
                    <p v-else-if="config.fetchMethod == 'hkgov'">
                        {{ $t('option.govApi') }}
                    </p>
                    <p v-else-if="config.fetchMethod == 'self'">
                        {{ $t('option.selfHost') }}
                    </p>
                </ion-label>
            </ion-item>
            <ion-item v-if="config.fetchMethod == 'self'">
                <ion-label position="stacked">{{
                    $t('option.selfHostUrl')
                }}</ion-label>
                <ion-input
                    placeholder="https://your.api"
                    v-model="apiBaseUrl"
                ></ion-input>
            </ion-item>
            <ion-item>
                <ion-icon :icon="returnDownForwardOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.autoScroll') }}</h5>
                </ion-label>
                <ion-checkbox slot="end" v-model="autoScroll"></ion-checkbox>
            </ion-item>
        </ion-list>
        <ion-list-header>
            <ion-label>{{ $t('option.manageData') }}</ion-label>
        </ion-list-header>
        <ion-list class="ion-padding-bottom ion-margin-bottom">
            <ion-item button @click="updateData">
                <ion-icon :icon="cloudDownloadOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.updateRoute') }}</h5>
                </ion-label>
            </ion-item>
            <ion-item button @click="downloadData">
                <ion-icon :icon="reloadOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.reloadRoute') }}</h5>
                </ion-label>
            </ion-item>
            <ion-item button @click="clearStarred">
                <ion-icon :icon="starHalfOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.removeAllStar') }}</h5>
                </ion-label>
            </ion-item>
            <ion-item button @click="confirmClearData">
                <ion-icon :icon="trashOutline" slot="start" />
                <ion-label>
                    <h5>{{ $t('option.resetAll') }}</h5>
                </ion-label>
            </ion-item>
        </ion-list>
    </ion-content>
</template>

<script>
import { ref } from 'vue'
import { Dialog } from '@capacitor/dialog'
import {
    IonHeader,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonLabel,
    IonItem,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    IonInput,
    IonCheckbox,
    actionSheetController,
    loadingController,
} from '@ionic/vue'
import {
    chevronBack,
    languageOutline,
    serverOutline,
    cloudDownloadOutline,
    reloadOutline,
    starHalfOutline,
    trashOutline,
    colorPaletteOutline,
    returnDownForwardOutline,
} from 'ionicons/icons'
import fetchApiData from '@/fetch/fetchAPIData'
import presentToast from '@/components/presentToast.js'
import localforage from 'localforage'

export default {
    name: 'Option-popup',
    components: {
        IonHeader,
        IonTitle,
        IonContent,
        IonList,
        IonListHeader,
        IonLabel,
        IonItem,
        IonIcon,
        IonButton,
        IonButtons,
        IonToolbar,
        IonInput,
        IonCheckbox,
    },
    emits: ['closeOption', 'updateData', 'downloadData', 'changeLanguage'],
    setup() {
        const config = ref({})
        const apiBaseUrl = ref('')
        const autoScroll = ref(false)
        const body = document.body
        return {
            chevronBack,
            languageOutline,
            serverOutline,
            cloudDownloadOutline,
            reloadOutline,
            starHalfOutline,
            trashOutline,
            colorPaletteOutline,
            returnDownForwardOutline,
            config,
            apiBaseUrl,
            body,
            autoScroll,
        }
    },
    async mounted() {
        this.config = await localforage.getItem('config')
        this.apiBaseUrl = this.config.apiBaseUrl
        this.autoScroll = this.config.autoScroll
    },
    methods: {
        closeOption() {
            this.$emit('closeOption')
        },
        async updateApiUrl() {
            await localforage.setItem(
                'config',
                JSON.parse(JSON.stringify(this.config))
            )
        },
        async clearStarred() {
            const { value } = await Dialog.confirm({
                title: this.$t('option.removeAllStar'),
                message: this.$t('option.removeAllStarPrompt'),
            })
            if (value) {
                await localforage.setItem('starred', [])
                presentToast('info', this.$t('toast.removedStar'))
            }
        },
        async confirmClearData() {
            const { value } = await Dialog.confirm({
                title: this.$t('option.resetAll'),
                message: this.$t('option.resetAllPrompt'),
            })
            if (value) {
                let keys = await localforage.keys()
                for (let key of keys) {
                    await localforage.removeItem(key)
                }
                presentToast('info', this.$t('toast.resetAll'))
                setTimeout(() => {
                    location.replace(location.origin)
                }, 3000)
            }
        },
        async updateData() {
            const loading = await loadingController.create({
                message:
                    this.$t('option.updatingData') +
                    '<br><span id="loading-progress"><span>',
            })
            try {
                let res
                loading.present()
                if (this.config.fetchMethod == 'self') {
                    res = await fetchApiData(this.config.apiBaseUrl)
                } else {
                    res = await fetchApiData()
                }
                if (res && !(res instanceof Error)) {
                    loading.dismiss()
                    location.replace(location.origin)
                } else {
                    throw new Error(res.message)
                }
            } catch (err) {
                loading.dismiss()
                presentToast('error', this.$t('toast.networkError'))
            }
        },
        async downloadData() {
            const loading = await loadingController.create({
                message:
                    this.$t('option.redownloadData') +
                    '<br><span id="loading-progress"><span>',
            })
            loading.present()
            let keys = await localforage.keys()
            for (let key of keys) {
                if (key !== 'config' && key != 'starred') {
                    await localforage.removeItem(key)
                }
            }
            if (this.config.fetchMethod == 'self') {
                await fetchApiData(this.config.apiBaseUrl)
            } else {
                await fetchApiData()
            }
            loading.dismiss()
            location.replace(location.origin)
        },
        async presentLangAction() {
            const langActions = [
                {
                    text: '正體中文',
                    data: { action: 'zh' },
                },
                {
                    text: 'English',
                    data: { action: 'en' },
                },
            ]
            const langSheet = await actionSheetController.create({
                header: '請選擇語言 / Select Language ',
                buttons: langActions,
            })
            await langSheet.present()
            const res = await langSheet.onDidDismiss()
            if (res.data) {
                if (this.config.lang != res.data.action) {
                    this.config.lang = res.data.action
                    this.$i18next.changeLanguage(this.config.lang)
                    await localforage.setItem(
                        'config',
                        JSON.parse(JSON.stringify(this.config))
                    )
                }
            }
        },
        async presentSourceAction() {
            const sourceActions = [
                {
                    text: this.$t('option.defaultSource'),
                    data: { action: 'default' },
                },
                //				{
                //					text: this.$t('option.govApi'),
                //					data: {action: 'hkgov'}
                //				},
                {
                    text: this.$t('option.selfHost'),
                    data: { action: 'self' },
                },
            ]
            const sourceSheet = await actionSheetController.create({
                header: this.$t('option.selectSource'),
                buttons: sourceActions,
            })
            await sourceSheet.present()
            const res = await sourceSheet.onDidDismiss()
            if (res.data && this.config.fetchMethod != res.data.action) {
                this.config.fetchMethod = res.data.action
                await localforage.setItem(
                    'config',
                    JSON.parse(JSON.stringify(this.config))
                )
                await presentToast('info', this.$t('toast.changeSourceHint'))
            }
        },
        async presentThemeAction() {
            const themeActions = [
                {
                    text: this.$t('option.systemTheme'),
                    data: { action: 'system' },
                },
                {
                    text: this.$t('option.light'),
                    data: { action: 'light' },
                },
                {
                    text: this.$t('option.dark'),
                    data: { action: 'dark' },
                },
            ]
            const themeSheet = await actionSheetController.create({
                header: this.$t('option.selectTheme'),
                buttons: themeActions,
            })
            await themeSheet.present()
            const res = await themeSheet.onDidDismiss()
            if (res.data) {
                this.config.theme = res.data.action
                await localforage.setItem(
                    'config',
                    JSON.parse(JSON.stringify(this.config))
                )
                if (res.data.action == 'dark') {
                    this.body.classList.toggle('dark', true)
                } else if (res.data.action == 'light') {
                    this.body.classList.toggle('dark', false)
                } else if (
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                ) {
                    this.body.classList.toggle('dark', true)
                } else {
                    this.body.classList.toggle('dark', false)
                }
            }
        },
    },
    watch: {
        async apiBaseUrl() {
            this.config = {
                ...this.config,
                apiBaseUrl: this.apiBaseUrl,
            }
            await localforage.setItem(
                'config',
                JSON.parse(JSON.stringify(this.config))
            )
        },
        async autoScroll() {
            this.config = {
                ...this.config,
                autoScroll: this.autoScroll,
            }
            await localforage.setItem(
                'config',
                JSON.parse(JSON.stringify(this.config))
            )
        },
    },
}
</script>
<style></style>
