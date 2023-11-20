import { toastController } from '@ionic/vue'
import {
    alertCircleOutline,
    checkmarkCircleOutline,
    informationCircleOutline,
    logoIonic,
} from 'ionicons/icons'

export default async function presentToast(type, message) {
    const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: 'bottom',
        htmlAttributes: { 'data-testid': 'toast' },
        icon:
            type == 'error'
                ? alertCircleOutline
                : type == 'done'
                ? checkmarkCircleOutline
                : type == 'info'
                ? informationCircleOutline
                : logoIonic,
    })
    await toast.present()
}
