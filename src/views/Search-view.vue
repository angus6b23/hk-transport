<template src="@/views/Search-view.html"></template>

<script>
import { defineComponent, inject, ref } from 'vue'
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    IonItem,
    IonText,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonGrid,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonTitle,
    IonButtons,
    IonReorder,
    IonReorderGroup,
    IonProgressBar
} from '@ionic/vue'
import {
    cog,
    chevronBack,
    swapVerticalOutline,
    newspaperOutline,
    locationOutline,
} from 'ionicons/icons'
import { loadChunk } from '@/components/loadData.js'
import ETAPopup from '@/components/ETAPopup.vue'
import OptionView from '@/views/Option.vue'
import News from './News.vue'
import Badges from '@/components/Badges'
import sleep from '@/components/sleep.js'
import localforage from 'localforage'
import presentToast from '@/components/presentToast.js'
import Keypad from '@/components/Keypad'
import { useMemoize } from '@vueuse/core'
import { filterData } from '@/components/search'
import RegularSearchItems from '@/components/SearchResultItems/RegularSearchItems.vue'
import CompactSearchItemsLeft from '@/components/SearchResultItems/CompactSearchItemsLeft.vue'
import CompactSearchItemsRight from '@/components/SearchResultItems/CompactSearchItemsRight'
import DetailSearchItems from '@/components/SearchResultItems/DetailSearchItems.vue'
import getNearbyRoutesPromise from '@/components/getNearbyRoutes'

export default defineComponent({
    components: {
        IonHeader,
        IonToolbar,
        IonContent,
        IonText,
        IonPage,
        IonSearchbar,
        IonItem,
        IonLabel,
        IonList,
        IonListHeader,
        IonModal,
        IonGrid,
        IonRow,
        IonCol,
        Badges,
        IonButton,
        IonIcon,
        IonTitle,
        IonButtons,
        ETAPopup,
        OptionView,
        News,
        Keypad,
        IonReorder,
        IonReorderGroup,
        IonProgressBar,
        RegularSearchItems,
        CompactSearchItemsLeft,
        CompactSearchItemsRight,
        DetailSearchItems,
    },
    name: 'SearchView',
    props: ['dataType'],
    setup(props) {
        // Create ref for loading and show map for ui control
        const query = ref('') // Reference for two way bind of search bar value
        const displayArray = ref([]) // Reference for displaying search results
        const itemSelected = ref({}) // Reference for selected bus on query
        const altRoutes = ref([]) //Reference for alternate routes of selected bus
        const modalIsOpen = ref(false) // For controlling the showing of ETA Modal
        const optionIsOpen = ref(false) //For controlling the showing of Option Modal
        const newsIsOpen = ref(false) // For controlling the showing of news modal
        const data = ref([]) // For storage of bus routes and stops
        const starred = ref([])
        const type = ref(props.dataType)
        const dataReady = ref(false)
        const disableReorder = ref(true)
        const keypadOpen = ref(false) // pass as a prop for keypad, will close the keypad if the value changes
        const locationLoading = ref(false); // For displaying the loading bar while finding nearby routes
        
        const memoFilterQuery = useMemoize(filterData, {
            getKey: (data, type, query, lang, maxResults) =>
                `${query.toUpperCase()}-${lang}-${maxResults}`,
        })
        // Event listeners
        addEventListener('ionModalDidDismiss', function () {
            modalIsOpen.value = false
        })
        const config = inject('globalConfig')
        return {
            data,
            memoFilterQuery,
            query,
            displayArray,
            itemSelected,
            keypadOpen,
            altRoutes,
            config,
            modalIsOpen,
            optionIsOpen,
            newsIsOpen,
            disableReorder,
            starred,
            type,
            dataReady,
            locationLoading,
            cog,
            chevronBack,
            swapVerticalOutline,
            newspaperOutline,
            locationOutline,
        }
    },
    methods: {
        openModal(index) {
            this.itemSelected = JSON.parse(
                JSON.stringify(this.displayArray[index])
            ) // Use Deep copy to prevent problems when clicked again
            // console.log(this.itemSelected)
            this.getAltRoutes()
            this.modalIsOpen = true
        },
        openAltModal(index) {
            let alt = this.displayArray[index]
            let targetIndex = this.data.findIndex(
                (item) =>
                    item.routeId === alt.routeId &&
                    item.direction != alt.direction
            )
            if (targetIndex != -1) {
                this.itemSelected = JSON.parse(
                    JSON.stringify(this.data[targetIndex])
                )
                // console.log(this.itemSelected)
                this.getAltRoutes()
                this.modalIsOpen = true
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
        openNews() {
            this.newsIsOpen = true
        },
        closeOption() {
            this.optionIsOpen = false
        },
        closeNews() {
            this.newsIsOpen = false
        },
        async addStar() {
            this.starred.push(this.itemSelected)
            await this.saveStar()
        },
        async removeStar() {
            const removeIndex = this.starred.findIndex(
                (route) =>
                    route.routeId === this.itemSelected.routeId &&
                    route.direction === this.itemSelected.direction
            )
            this.starred.splice(removeIndex, 1)
            await this.saveStar()
        },
        async saveStar() {
            const starredOriginal = await localforage.getItem('starred')
            const starredClone = {
                ...starredOriginal,
                [this.type]: JSON.parse(JSON.stringify(this.starred)),
            }
            await localforage.setItem('starred', starredClone)
        },
        hideKeypad() {
            this.keypadOpen = !this.keypadOpen
        },
        /*
        Old Code, saveData currently not used
        async saveData(data) {
            if (this.type == 'bus') {
    // Link to currently displayed bus
                const displayIndex = this.displayArray.findIndex(this.currentSelectedItem)
                this.displayArray[displayIndex] = data;
    // Link to global bus array
                const index = this.data.findIndex(this.currentSelectedItem);
                this.data[index] = JSON.parse(JSON.stringify(data));
    // console.log(index);
    // Save to localforage
                const key = 'busData-chunk' + Math.floor(index / 100);
                const chunkIndex = index % 100;
                let chunk = await loadData(key, false, false);
                chunk[chunkIndex] = JSON.parse(JSON.stringify(data));
                await setData(key, chunk);
            }

        }, */
        currentSelectedItem(x) {
            // For finding index of currently selected bus
            return (
                x.routeId == this.itemSelected.routeId &&
                x.routeDirection == this.itemSelected.routeDirection
            )
        },
        filterQuery(newQuery) {
            let resArr = []
            if (newQuery === '') {
                return this.starred
            } else {
                if (this.type == 'ferry') {
                    resArr = this.data.filter(
                        (x) =>
                            x.direction == 1 &&
                            (x.routeNameTC.includes(newQuery) ||
                                x.routeNameEN
                                    .toLowerCase()
                                    .includes(newQuery.toLowerCase()))
                    )
                } else {
                    if (this.$i18next.language === 'zh') {
                        resArr =
                            newQuery < 10
                                ? this.data.filter(
                                      (x) =>
                                          (x.routeNo.length <= 2 &&
                                              x.routeNo.indexOf(
                                                  newQuery.toUpperCase()
                                              ) == 0) ||
                                          x.destTC.includes(newQuery)
                                  )
                                : this.data.filter(
                                      (x) =>
                                          x.routeNo.indexOf(
                                              newQuery.toUpperCase()
                                          ) == 0 || x.destTC.includes(newQuery)
                                  ) // Filter by route numbers and destinations.
                    } else {
                        resArr =
                            newQuery < 10
                                ? this.data.filter(
                                      (x) =>
                                          (x.routeNo.length <= 2 &&
                                              x.routeNo.indexOf(
                                                  newQuery.toUpperCase()
                                              ) == 0) ||
                                          x.destEN
                                              .toLowerCase()
                                              .includes(newQuery.toLowerCase())
                                  )
                                : this.data.filter(
                                      (x) =>
                                          x.routeNo.indexOf(
                                              newQuery.toUpperCase()
                                          ) == 0 ||
                                          x.destEN
                                              .toLowerCase()
                                              .includes(newQuery.toLowerCase())
                                  ) // Filter by route numbers and destinations.
                    }
                    // Limit small number query
                    resArr = resArr.sort(function (a, b) {
                        a = Number(a.routeNo.replace(/[A-Z]/g, 0))
                        b = Number(b.routeNo.replace(/[A-Z]/g, 0))
                        return a - b
                    })
                    return resArr.slice(0, 50) // Only show first 50 results
                }
            }
        },
        padUpdateQuery(value) {
            if (value === 'clear') {
                this.clearQuery()
            } else if (value === 'back') {
                this.query = this.query.substring(0, this.query.length - 1)
            } else {
                this.query = `${this.query}${value}`
            }
        },
        listAll() {
            this.query = ' '
        },
        clearQuery() {
            this.query = ''
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
        getAltRoutes() {
            if (
                this.itemSelected.type == 'bus' &&
                this.itemSelected.company.includes('KMB')
            ) {
                //Filter for KMB: Same company, same routeNo (different direction / servicemode / specialtype)
                this.altRoutes = this.data.filter(
                    (altRoute) =>
                        altRoute.routeNo == this.itemSelected.routeNo &&
                        altRoute.company.join('') ==
                            this.itemSelected.company.join('') &&
                        (altRoute.direction != this.itemSelected.direction ||
                            altRoute.serviceMode !=
                                this.itemSelected.serviceMode ||
                            altRoute.specialType !=
                                this.itemSelected.specialType)
                )
            } else if (
                this.itemSelected.type == 'bus' &&
                this.itemSelected.company.includes('NLB')
            ) {
                // Filter for NLB: Same routeNo with different routeId
                this.altRoutes = this.data.filter(
                    (altRoute) =>
                        altRoute.company.includes('NLB') &&
                        altRoute.routeNo == this.itemSelected.routeNo &&
                        altRoute.routeId != this.itemSelected.routeId
                )
            } else if (this.itemSelected.type == 'bus') {
                this.altRoutes = this.data.filter(
                    (altRoute) =>
                        altRoute.company.join('') ==
                            this.itemSelected.company.join('') &&
                        altRoute.routeNo == this.itemSelected.routeNo &&
                        (altRoute.routeId != this.itemSelected.routeId ||
                            altRoute.direction != this.itemSelected.direction)
                )
            } else if (this.itemSelected.type == 'minibus') {
                // Filter for minibus: Same district, same routeNo, different routeId / direction
                this.altRoutes = this.data.filter(
                    (altRoute) =>
                        altRoute.routeNo == this.itemSelected.routeNo &&
                        altRoute.district == this.itemSelected.district &&
                        (altRoute.routeId != this.itemSelected.routeId ||
                            altRoute.direction != this.itemSelected.direction)
                )
            } else {
                this.altRoutes = this.data.filter(
                    (altRoute) =>
                        altRoute.routeId == this.itemSelected.routeId &&
                        altRoute.direction != this.itemSelected.direction
                )
            }
        },
        toggleReorder() {
            this.disableReorder = !this.disableReorder
        },
        async reorder(event) {
            event.detail.complete(this.starred)
            await this.saveStar()
        },
        updateQuery(newQuery) {
            this.hideKeypad();
            this.query = newQuery
        },
    },
    async mounted() {
        this.data = await loadChunk(this.type)
        let starStorage = await localforage.getItem('starred')
        if (!starStorage || !starStorage[this.type]) {
            this.starred = []
        } else {
            this.starred = starStorage[this.type]
        }
        this.displayArray = this.starred
        this.dataReady = true
    },
    watch: {
        query(newQuery) {
            if (newQuery === '') {
                this.displayArray = this.starred
            } else if (
                newQuery === 'Routes Nearby' ||
                newQuery === '附近的路線'
            ) {
                this.locationLoading = true;
                getNearbyRoutesPromise(this.data, this.config.maxResults).then(res => {
                    this.locationLoading = false
                    if (res instanceof Error){
                        presentToast('error', this.$t('toast.locationFail'))
                    } else {
                        // console.log(res)
                        if (this.type === 'ferry'){
                            this.displayArray = res.filter(route => route.direction === 1)
                        } else {
                            this.displayArray = res
                        }
                    }
                })
            } else {
                this.displayArray = this.memoFilterQuery(
                    this.data,
                    this.type,
                    newQuery,
                    this.$i18next.language,
                    this.config.maxResults
                )
            }
            this.disableReorder = true
        },
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
    unmounted() {
        this.memoFilterQuery.clear()
    },
})
</script>
<style scoped>
.no-content {
    display: flex;
    flex-direction: column;
    height: 70vh;
    align-items: center;
    justify-content: center;
}

.small-padding {
    padding-top: 10px;
    padding-bottom: 10px;
}

.route-no {
    display: flex;
}

.d-flex {
    display: flex;
}
.star-wrapper {
    font-size: 1.2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.hint {
    font-size: 1.2rem;
}
.swap-icon {
    margin-right: 1rem;
}
.location-buttons.md{
    align-self: flex-start;
    margin-top: 0.5rem
}
</style>
