<template src="@/views/TabsPage.html"></template>

<script>
import { defineComponent, ref, provide } from 'vue'
import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
    IonLoading,
} from '@ionic/vue'
import {
    square,
    bus,
    busOutline,
    speedometer,
    speedometerOutline,
    boat,
    boatOutline,
    train,
    trainOutline,
} from 'ionicons/icons'
import {
    BIconTruckFrontFill,
    BIconTruckFront,
    BIconTrainFront,
    BIconTrainFrontFill,
    BIconTrainLightrailFront,
    BIconTrainLightrailFrontFill,
} from 'bootstrap-icons-vue'
import localforage from 'localforage'
import Landing from '@/views/Landing.vue'

export default defineComponent({
    name: 'TabsPage',
    components: {
        IonLabel,
        IonTabs,
        IonTabBar,
        IonTabButton,
        IonIcon,
        IonPage,
        IonRouterOutlet,
        IonLoading,
        BIconTruckFrontFill,
        BIconTruckFront,
        BIconTrainFront,
        BIconTrainFrontFill,
        BIconTrainLightrailFront,
        BIconTrainLightrailFrontFill,
        Landing,
    },
    setup() {
        const settingFound = ref(true)
        const config = ref({})
        const loading = ref(false)
        const loadingMessage = ref('請稍侯...<br>Please Wait...')
        const currentTab = ref('')
        const body = document.body
        provide('globalConfig', config)
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
            body,
        }
    },
    methods: {
        afterTabChange(e) {
            //Change icon upon changing tab
            this.currentTab = e.tab
        },
        async finishConfig(config) {
            //Save config and fetch data after initial setup
            await localforage.setItem('config', { ...config, dataFilled: true })
            this.settingFound = true
            this.config = { ...config, dataFilled: true }
        },
    },
    async mounted() {
        try {
            // Load config from local forage
            const config = await localforage.getItem('config')
            let changesApplied = false
            // If there is config and the data is filled
            if (config && config.dataFilled) {
                this.config = config
                this.settingFound = true
                // Change the language according to config
                this.$i18next.changeLanguage(this.config.lang)
                // Change the theme to according to config
                if (config.theme && config.theme == 'dark') {
                    this.body.classList.toggle('dark', true)
                } else if (config.theme && config.theme == 'light') {
                    this.body.classList.toggle('dark', false)
                } else if (
                    window.matchMedia('(prefers-color-scheme: dark)').matches
                ) {
                    this.body.classList.toggle('dark', true)
                }
                // Fill unfilled config
                // Before v1.0.5, search item style should be undefined
                if (config.selectItemStyle === undefined){
                    this.config.searchItemStyle = 'comfort' //Default to comfort
                    console.log(this.config.searchItemStyle)
                    changesApplied = true
                }
                if ( changesApplied ){ // Save the new setting if changes apply is detected
                    await localforage.setItem(
                        'config',
                        JSON.parse(JSON.stringify(this.config))
                    )
                }
            } else {
                // otherwire, try to set to dark theme if device prefers that
                if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    this.body.classList.toggle('dark', true)
                }
                // This will show the landing view
                this.settingFound = false
            }
        } catch (err) {
            this.settingFound = false
            console.error(err)
        }
    },
})
</script>
<style scoped>
.bi-icons {
    padding-top: 2px;
    padding-bottom: 2px;
}
.md .bi-icons {
    font-size: 22px;
}

.ios .bi-icons {
    font-size: 30px;
}

.scrollable-bar {
    display: flex;
    overflow-x: auto;
    flex-direction: row;
    justify-content: flex-start;
}

.scrollable-item {
    min-width: 96px;
}
.label-text {
    font-size: 0.75rem;
}
@media screen and (min-width: 1000px) {
    .scrollable-bar {
        justify-content: center;
    }
}
</style>
