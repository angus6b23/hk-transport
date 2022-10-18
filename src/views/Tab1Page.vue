<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-searchbar autocorrect="off" v-model="kmb_query"></ion-searchbar>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-list>
                <ion-list-header>Search: {{ kmb_query }}</ion-list-header>
                <div v-for="route in kmb_display_array">
                    <ion-item button>
                        <ion-grid>
                            <ion-row>
                                <ion-col size-xs="3" size-md="1" class="route">
                                    <h3>{{ route.route }}</h3>
                                </ion-col>
                                <ion-col size-xs="9" size-md="11">
                                    <h5 class="ion-margin-start">{{ route.dest_tc }}</h5>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>
                </div>
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script>
import { defineComponent, ref, onMounted, watch } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow } from '@ionic/vue';
import { fetch_kmb } from '@/components/fetch.js';

export default defineComponent({
    name: 'Tab1Page',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSearchbar, IonItem, IonLabel, IonList, IonListHeader, IonGrid, IonCol, IonRow },
    setup(){
        const kmb = ref({});
        onMounted(async()=>{
            if(localStorage.getItem('kmb')){
                kmb.value = JSON.parse(localStorage.getItem('kmb'));
            } else{
                kmb.value = await fetch_kmb();
                localStorage.setItem("kmb", JSON.stringify(kmb.value));
            }
        });
        const kmb_query = ref('');
        const kmb_display_array = ref([]);
        watch(kmb_query, ()=>{
            if (kmb_query.value == ''){
                kmb_display_array.value = [];
            } else {
                kmb_display_array.value = kmb.value.route.filter(x => x.route.indexOf(kmb_query.value.toUpperCase()) == 0 ||
                x.dest_tc.includes(kmb_query.value));
                kmb_display_array.value.splice(50);
            }
        })
        return{
            kmb,
            kmb_query,
            kmb_display_array
        }
    }
});

</script>
<style scoped>
.route{
    text-align : left;
}
</style>
