<template>
    <div>
        <details ref="keypad">
            <summary id="summary-tag">
                <ion-text color="primary">
                    <ion-icon
                        :icon="keypadOutline"
                        class="ion-margin-end keypad-icon"
                        ></ion-icon>
                    {{ $t('searchView.toggleRouteKeypad') }}
                </ion-text>
            </summary>
            <div class="grid keypad-wrapper">
                <div class="numbers">
                    <div>
                        <ion-row
                            class="ion-justify-content-around ion-align-items-center"
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[1]"
                                @click="emitClick(1)"
                                >1</ion-button
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[2]"
                                @click="emitClick(2)"
                                >2</ion-button
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[3]"
                                @click="emitClick(3)"
                                >3</ion-button
                            >
                        </ion-row>
                        <ion-row
                            class="ion-justify-content-around ion-align-items-center"
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[4]"
                                @click="emitClick(4)"
                                >4</ion-button
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[5]"
                                @click="emitClick(5)"
                                >5</ion-button
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[6]"
                                @click="emitClick(6)"
                                >6</ion-button
                            >
                        </ion-row>
                        <ion-row
                            class="ion-justify-content-around ion-align-items-center"
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[7]"
                                @click="emitClick(7)"
                                >7</ion-button
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[8]"
                                @click="emitClick(8)"
                                >8</ion-button
                            >
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[9]"
                                @click="emitClick(9)"
                                >9</ion-button
                            >
                        </ion-row>
                        <ion-row
                            class="ion-justify-content-around ion-align-items-center"
                            >
                            <ion-button
                                class="icon-button"
                                fill="clear"
                                size="4"
                                :disabled="query.length === 0"
                                @click="emitClick('clear')"
                                >
                                <ion-icon
                                    slot="icon-only"
                                    :icon="trashBinOutline"
                                    />
                            </ion-button>
                            <ion-button
                                fill="clear"
                                size="4"
                                :disabled="!numpad[0]"
                                @click="emitClick(0)"
                                >0</ion-button
                            >
                            <ion-button
                                class="icon-button"
                                fill="clear"
                                size="4"
                                :disabled="query.length === 0"
                                @click="emitClick('back')"
                                >
                                <ion-icon
                                    slot="icon-only"
                                    :icon="backspaceOutline"
                                    />
                            </ion-button>
                        </ion-row>
                    </div>
                </div>
                <div class="letters">
                    <ion-button
                        fill="clear"
                        v-for="(letter, index) of letterRow"
                        :key="index"
                        @click="emitClick(letter.letter)"
                        >{{ letter.letter }}</ion-button
                    >
                </div>
            </div>
        </details>
    </div>
</template>

<script>
import { ref } from 'vue'
import {
    IonRow,
    IonButton,
    IonIcon,
    IonText,
} from '@ionic/vue'
import {
    backspaceOutline,
    trashBinOutline,
    keypadOutline,
} from 'ionicons/icons'
import { getKeypadList, getKeypadLetter, updateButtonState } from '@/components/search'
import { useMemoize } from '@vueuse/core'
export default {
    name: 'ComponentName',
    components: { IonRow, IonButton, IonIcon, IonText },
    props: ['data', 'query', 'keypadOpen'],
    emits: ['padClick'],
    setup() {
        const numberInitState = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
        }
        const numpad = ref(numberInitState)
        const letterRow = ref([])
        const routeNoList = ref([]);
        const memoUpdateButton = useMemoize(updateButtonState, {getKey: (list, query) => query})
        return {
            numpad,
            letterRow,
            routeNoList,
            memoUpdateButton,
            backspaceOutline,
            trashBinOutline,
            keypadOutline,
        }
    },
    mounted() {
    },
    methods: {
        hydrateList: function () {
            this.routeNoList = getKeypadList(this.data)
            this.letterRow = getKeypadLetter(this.routeNoList)
        },
        //        updateButtonStates: function (query) {
        //            let updated = this.routeNoList.filter(
        //                (route) =>
        //                route.indexOf(query) === 0 && route.length > query.length
        //            )
        //            let numberState = {
        //                0: false,
        //                1: false,
        //                2: false,
        //                3: false,
        //                4: false,
        //                5: false,
        //                6: false,
        //                7: false,
        //                8: false,
        //                9: false,
        //            }
        //            let letterState = this.letterRow
        //                .map((item) => {
        //                    return { ...item, enable: false }
        //                })
        //                .sort((a, b) => a.letter.localeCompare(b.letter))
        //            for (let route of updated) {
        //                if (route[query.length].match(/\d/)) {
        //                    numberState[route[query.length]] = true
        //                } else {
        //                    letterState = letterState.map((letter) => {
        //                        if (route[query.length] == letter.letter) {
        //                            return { ...letter, enable: true }
        //                        } else {
        //                            return { ...letter }
        //                        }
        //                    })
        //                }
        //            }
        //            this.letterRow = [
        //                ...letterState.filter((item) => item.enable),
        //                ...letterState.filter((item) => !item.enable),
        //            ]
        //            this.numpad = numberState
        //            //            console.log(letterState);
        //            //            console.log(numberState);
        //        },
        emitClick: function (value) {
            this.$emit('padClick', value)
        },
    },
    watch: {
        data(data) {
            if (data.length) {
                this.hydrateList()
                const updatedState = this.memoUpdateButton(this.routeNoList, '');
                this.letterRow = updatedState.letterState;
                this.numpad = updatedState.numberState
            }
        },
        query: function (newQuery) {
            const updatedState = this.memoUpdateButton(this.routeNoList, newQuery);
            this.letterRow = updatedState.letterState;
            this.numpad = updatedState.numberState
        },
        keypadOpen(){
            this.$refs.keypad.open = false;
        }
    },
    beforeUnmount() {
        this.memoUpdateButton.clear()
    },
}
</script>
<style scoped>
.grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
}
.grid ion-button.ios {
    height: 2.5rem;
    font-size: 1.5rem;
}
.grid .md.button.icon-button {
    font-size: 1rem;
}
.grid .md.button {
    height: 2.5rem;
    font-size: 1.5rem;
}
.keypad-wrapper {
    height: 25vh;
}
.numbers {
    grid-column: span 9 / span 9;
    display: flex;
    justify-content: center;
    align-items: center;
}
.letters {
    grid-column: span 3 / span 3;
    height: 100%;
    overflow-y: auto;
}
.grid ion-button.icon-button {
    font-size: 1rem;
}
details summary::-webkit-details-marker {
    display: none;
}
details > summary {
    list-style: none;
}

details > summary {
    cursor: pointer;
    margin-top: 0.5rem;
    margin-left: 1rem;
}
@media screen and (min-width: 800px) {
    .grid {
        margin-left: auto;
        margin-right: auto;
        width: 75%;
    }
    .grid ion-button {
        font-size: 1.5rem;
    }
    .grid ion-button.icon-button {
        font-size: 1.2rem;
    }
}
</style>
