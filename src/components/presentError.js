import { toastController } from '@ionic/vue';
export default function presentError(message){
    const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: 'bottom'
    })
}
