<template>
    <div>
        <details>
            <summary id="summary-tag">
                <ion-text color="primary">
                <ion-icon :icon="keypadOutline" class="ion-margin-end keypad-icon"></ion-icon>
                {{ $t('searchView.toggleRouteKeypad') }}
                </ion-text>
            </summary>
            <div class="wrapper">
                <div class="center">
                    <ion-grid class="keypad">
                        <ion-row>
                            <ion-col size="9" size-md="6" class="numbers">
                                <ion-row class="ion-justify-content-around">
                                    <ion-button fill="clear" size="4" :disabled="!numpad[1]" @click="emitClick(1)">1</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[2]" @click="emitClick(2)">2</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[3]" @click="emitClick(3)">3</ion-button>
                                </ion-row>
                                <ion-row class="ion-justify-content-around">
                                    <ion-button fill="clear" size="4" :disabled="!numpad[4]" @click="emitClick(4)">4</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[5]" @click="emitClick(5)">5</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[6]" @click="emitClick(6)">6</ion-button>
                                </ion-row>
                                <ion-row class="ion-justify-content-around">
                                    <ion-button fill="clear" size="4" :disabled="!numpad[7]" @click="emitClick(7)">7</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[8]" @click="emitClick(8)">8</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[9]" @click="emitClick(9)">9</ion-button>
                                </ion-row>
                                <ion-row class="ion-justify-content-around">
                                    <ion-button fill="clear" size="4" :disabled="query.length === 0" @click="emitClick('clear')">
                                        <ion-icon slot="icon-only" :icon="trashBinOutline" />
                                    </ion-button>
                                    <ion-button fill="clear" size="4" :disabled="!numpad[0]" @click="emitClick(0)">0</ion-button>
                                    <ion-button fill="clear" size="4" :disabled="query.length === 0" @click="emitClick('back')">
                                        <ion-icon slot="icon-only" :icon="backspaceOutline" />
                                    </ion-button>
                                </ion-row>
                            </ion-col>
                            <ion-col size="3" size-md="6" class="letter-column">
                                <ion-button fill="clear" v-for="(letter, index) of letterRow" :key="index" :disabled="!letter.enable" @click="emitClick(letter.letter)">{{letter.letter}}</ion-button>
                            </ion-col>
                        </ion-row>
                    </ion-grid>
                </div>
            </div>
        </details>
    </div>
</template>

<script>
import { ref } from 'vue';
import { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonText } from '@ionic/vue';
import { backspaceOutline, trashBinOutline, keypadOutline } from 'ionicons/icons';

export default {
    name: "ComponentName",
    components: { IonGrid, IonRow, IonCol, IonButton, IonIcon, IonText },
    props: ['data', 'query'],
    emits: ['padClick'],
    setup(){
        const numberInitState = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false };
        const numpad = ref(numberInitState)
        const letterRow = ref([]);
        const routeNoList = ref([])
        return {
            numpad,
            letterRow,
            routeNoList,
            backspaceOutline,
            trashBinOutline,
            keypadOutline
        }
    },
    mounted(){
        if(this.data.length > 0){
            this.hydrateList();
        }
    },
    methods:{
        hydrateList: function (){
            let letters = new Set();
            let routeNoList = new Set(this.data.map(route => route.routeNo).filter(no => no.length <= 5))
            this.routeNoList = Array.from(routeNoList)
            const regex = /([A-Za-z])/g
            for (let routeNo of routeNoList){
                if (routeNo.match(regex)){
                    routeNo.match(regex).forEach((val) => letters.add(val))
                }
            }
            this.letterRow = Array.from(letters).sort().map(letter => { return {letter: letter, enable: false}});
        },
        updateButtonStates: function(query){
            let updated = this.routeNoList.filter(route => route.indexOf(query) === 0 && route.length > query.length);
            let numberState = { 0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false };
            let letterState = this.letterRow.map(item => { return { ...item ,enable: false}}).sort((a,b) => a.letter.localeCompare(b.letter));
            for (let route of updated){
                if (route[query.length].match(/\d/)){
                    numberState[route[query.length]] = true
                } else {
                    letterState = letterState.map(letter => {
                        if (route[query.length] == letter.letter){
                            return { ...letter, enable: true}
                        } else {
                            return { ...letter }
                        }
                    });
                }
            }
            this.letterRow = [...letterState.filter(item=>item.enable), ...letterState.filter(item=>!item.enable)];
            this.numpad = numberState
            //            console.log(letterState);
            //            console.log(numberState);
        },
        emitClick: function(value){
            this.$emit('padClick', value);
        },
    },
    watch:{
        data(data){
            if (data.length){
                this.hydrateList();
                this.updateButtonStates('');
            }
        },
        query: function(newQuery){
            this.updateButtonStates(newQuery);
        }
    },
    beforeUnmount(){
    }
}

</script>
<style scoped>
.wrapper{
    display: flex;
    justify-content: center;
}
#summary-tag{
    margin-left: 1rem;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    cursor: pointer
}
summary::marker{
    display: none;
}
summary {
    list-style-type: none;
}
ion-button {
    font-size: 1.5rem;
    width: 5rem;
}
ion-button > ion-icon{
    font-size: 1.5rem;
}
.letter-column{
    max-height: 25vh;
    overflow-y: scroll
}
.numbers{
    min-width: 300px;
}
.keypad-icon{
    transform: translateY(0.2rem);
}
@media screen and (min-width: 800px){
    .center{
        width: 60vw;
    }
}
</style>
