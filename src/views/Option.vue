<template src="@/views/Option.html"></template>

<script>
import { inject, watch } from 'vue'
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
    IonRange,
    actionSheetController,
    loadingController,
} from '@ionic/vue'
import {
    chevronBack,
    languageOutline,
    cloudDownloadOutline,
    serverOutline,
    reloadOutline,
    starHalfOutline,
    trashOutline,
    colorPaletteOutline,
    returnDownForwardOutline,
    bookOutline,
    iceCreamOutline,
    codeSlashOutline,
    shieldCheckmarkOutline,
    linkOutline,
    listOutline,
    menuOutline
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
        IonRange,
    },
    emits: ['closeOption', 'updateData', 'downloadData', 'changeLanguage'],
    setup() {
        const config = inject('globalConfig')
        const body = document.body
        console.log(config)
        watch(
            () => [
                config.value.autoScroll,
                config.value.apiBaseUrl,
                config.value.fetchMethod,
                config.value.theme,
                config.value.lang,
                config.value.maxResults,
                config.value.selectItemStyle
            ],
            async () => {
                console.log(config.value)
                await localforage.setItem(
                    'config',
                    JSON.parse(JSON.stringify(config.value))
                )
            }
        )
        return {
            chevronBack,
            linkOutline,
            codeSlashOutline,
            shieldCheckmarkOutline,
            languageOutline,
            iceCreamOutline,
            serverOutline,
            cloudDownloadOutline,
            reloadOutline,
            starHalfOutline,
            trashOutline,
            colorPaletteOutline,
            returnDownForwardOutline,
            bookOutline,
            listOutline,
            menuOutline,
            config,
            body,
        }
    },
    async mounted() {
        console.log(this.config)
    },
    methods: {
        closeOption() {
            this.$emit('closeOption')
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
                await presentToast('info', this.$t('toast.changeSourceHint'))
            }
        },
        async presentSearchItemStyleAction() {
            const sourceActions = [
                {
                    text: this.$t('option.itemStyleComfort'),
                    data: { action: 'comfort' },
                },
                {
                    text: this.$t('option.itemStyleCompactLeft'),
                    data: { action: 'compact_left' },
                },
                {
                    text: this.$t('option.itemStyleCompactRight'),
                    data: { action: 'compact_right' },
                },
//                {
//                    text: this.$t('option.itemStyleCompactLeft'),
//                    data: { action: 'compact_left' },
//                },
            ]
            const sourceSheet = await actionSheetController.create({
                header: this.$t('option.selectItemStyle'),
                buttons: sourceActions,
            })
            await sourceSheet.present()
            const res = await sourceSheet.onDidDismiss()
            if (res.data && this.config.searchItemStyle !== res.data.action) {
                this.config.searchItemStyle = res.data.action
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
}
</script>
<style scoped>
.flex {
    display: flex;
}
.flex-wrap {
    flex-wrap: wrap;
}
.w-full {
    width: 100%;
}
.py-0 {
    padding-top: 0px;
    padding-bottom: 0px;
}
</style>
