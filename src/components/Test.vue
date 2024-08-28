<template>
    <IonTitle>{{ count }}</IonTitle>
    <IonButton @click="increment">Increment</IonButton>
</template>

<script>
import { IonTitle, IonButton } from '@ionic/vue'
import { useTestStore } from '../store/test'

export default {
    name: 'Test',
    components: { IonTitle, IonButton },
    setup() {
        const { count, increment } = useTestStore()
        console.log(increment)
        return { count, increment }
    },
}
</script>
<style scoped></style>
