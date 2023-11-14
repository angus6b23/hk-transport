<template src="@/views/List-view.html"></template>

<script>
import { defineComponent, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonTitle,
    IonIcon,
    IonButtons,
    IonButton,
} from '@ionic/vue'
import { cog, newspaperOutline } from 'ionicons/icons'
import { loadChunk } from '@/components/loadData.js'
import presentToast from '@/components/presentToast'
import ETAPopup from '@/components/ETAPopup.vue'
import OptionView from '@/views/Option.vue'
import News from './News.vue'
import sleep from '@/components/sleep.js'

export default defineComponent({
    name: 'ListView',
    components: {
        IonHeader,
        IonToolbar,
        IonContent,
        IonPage,
        IonItem,
        IonLabel,
        IonList,
        IonListHeader,
        IonModal,
        IonGrid,
        IonRow,
        IonCol,
        IonTitle,
        IonIcon,
        IonButtons,
        IonButton,
        ETAPopup,
        OptionView,
        News
    },
    props: ['dataType'],
    setup(props) {
        // Create ref for loading and show map for ui control
        const itemSelected = ref({}) // Reference for selected bus on query
        const modalIsOpen = ref(false)
        const optionIsOpen = ref(false)
        const newsIsOpen = ref(false)
        const data = ref([]) // For storage of routes and stops
        const type = ref(props.dataType)
        const dataReady = ref(false)
        const altRoutes = ref([]) // For saving directions with same routeNo, which will be passed to etaPopup
        // Event listeners
        addEventListener('ionModalDidDismiss', function () {
            modalIsOpen.value = false
        })
        return {
            data,
            itemSelected,
            altRoutes,
            modalIsOpen,
            optionIsOpen,
            newsIsOpen,
            type,
            dataReady,
            cog,
            newspaperOutline
        }
    },
    methods: {
        openModal(index) {
            this.itemSelected = JSON.parse(JSON.stringify(this.data[index])) //Use Deep copy to prevent problems when clicked again
            this.getAltRoutes()
            console.log(this.itemSelected)
            this.modalIsOpen = true
        },
        openAltModal(index) {
            let alt = this.data[index]
            let targetIndex = this.data.findIndex(
                (item) =>
                    item.routeId == alt.routeId &&
                    item.direction != alt.direction
            )
            if (targetIndex != -1) {
                this.openModal(targetIndex)
            } else {
                presentToast('info', '未找到相關方向，正在顯示順行')
                this.openModal(index)
            }
        },
        closeModal() {
            this.modalIsOpen = false
        },
        openOption() {
            this.optionIsOpen = true
        },
        closeOption() {
            this.optionIsOpen = false
        },
        openNews() {
            this.newsIsOpen = true
        },
        closeNews() {
            this.newsIsOpen = false
        },
        currentSelectedItem(x) {
            // For finding index of currently selected bus
            return (
                x.routeId == this.itemSelected.routeId &&
                x.routeDirection == this.itemSelected.routeDirection
            )
        },
        getAltRoutes() {
            if (this.type == 'tram') {
                this.altRoutes = JSON.parse(
                    JSON.stringify(
                        this.data.filter(
                            (item) =>
                                item.routeNo == this.itemSelected.routeNo &&
                                item.direction != this.itemSelected.direction
                        )
                    )
                )
            } else if (this.type == 'mtr' || this.type == 'lightRail') {
                this.altRoutes = JSON.parse(
                    JSON.stringify(
                        this.data.filter(
                            (item) =>
                                item.routeId == this.itemSelected.routeId &&
                                item.direction != this.itemSelected.direction
                        )
                    )
                )
            }
        },
        async swapDirection(route = undefined) {
            if (route) {
                this.modalIsOpen = false
                await sleep(100)
                this.itemSelected = JSON.parse(JSON.stringify(route))
                this.getAltRoutes()
                this.modalIsOpen = true
                console.log(this.itemSelected)
            } else {
                presentToast('error', '此路線未有對頭車')
            }
        },
    },
    async mounted() {
        this.data = await loadChunk(this.type)
        this.dataReady = true
    },
    computed: {
        checkNoEta() {
            if (this.type == 'ferry' || this.type == 'tram') {
                return true
            } else {
                return false
            }
        },
    },
})
</script>
<style scoped>
.direction1-badge {
    --background: #5e6fa1;
}

.direction2-badge {
    --background: #a1905e;
}

.line-color-indicator {
    height: 15px;
    width: 80%;
    border-radius: 10px;
}
.d-flex {
    display: flex;
}
.direction-button {
    width: 100%;
    align-self: center;
    justify-self: center;
}
.direction1-button {
    --background: #5e6fa1;
}
.direction2-button {
    --background: #a1905e;
}
.route-no {
    display: flex;
}
.hint {
    font-size: 1.2rem;
}
</style>
