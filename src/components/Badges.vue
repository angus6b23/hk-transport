<template>
    <!-- Badges for bus -->
    <div v-if="route.type === 'bus'">
        <ion-badge
            v-if="route.company.includes('KMB')"
            class="kmb-badge ion-margin-start"
            >{{ $t('badges.kmb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('CTB')"
            class="ctb-badge ion-margin-start"
            >{{ $t('badges.ctb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('LWB')"
            class="lwb-badge ion-margin-start"
            >{{ $t('badges.lwb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('NWFB')"
            class="nwfb-badge ion-margin-start"
            >{{ $t('badges.nwfb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('DB')"
            class="db-badge ion-margin-start"
            >{{ $t('badges.db') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('NLB')"
            class="nlb-badge ion-margin-start"
            >{{ $t('badges.nlb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('PI')"
            class="pi-badge ion-margin-start"
            >{{ $t('badges.pi') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('XB')"
            class="xb-badge ion-margin-start"
            >{{ $t('badges.xb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('LRTFeeder')"
            class="ltr-badge ion-margin-start"
            >{{ $t('badges.lrt') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode.includes('N')"
            class="night-badge ion-margin-start"
            >{{ $t('badges.night') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode == 'T'"
            class="special-badge ion-margin-start"
            >{{ $t('badges.special') }}</ion-badge
        >
    </div>
    <div v-if="route.type === 'minibus'">
        <ion-badge
            v-if="route.district.includes('HKI')"
            class="hki-badge ion-margin-start"
            >{{ $t('badges.hki') }}</ion-badge
        >
        <ion-badge
            v-if="route.district.includes('KLN')"
            class="kln-badge ion-margin-start"
            >{{ $t('badges.kln') }}</ion-badge
        >
        <ion-badge
            v-if="route.district.includes('NT')"
            class="nt-badge ion-margin-start"
            >{{ $t('badges.nt') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode.includes('N')"
            class="night-badge ion-margin-start"
            >{{ $t('badges.night') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode == 'T'"
            class="special-badge ion-margin-start"
            >{{ $t('badges.special') }}</ion-badge
        >
    </div>
    <div v-if="route.type === 'ferry'">
        <ion-badge
            v-if="route.district == 'KAITO'"
            class="hki-badge ion-margin-start"
            >{{ $t('badges.kaito') }}</ion-badge
        >
        <ion-badge
            v-if="route.district == 'OUTLYING'"
            class="kln-badge ion-margin-start"
            >{{ $t('badges.outlying') }}</ion-badge
        >
        <ion-badge
            v-if="route.district == 'INNER'"
            class="nt-badge ion-margin-start"
            >{{ $t('badges.inner') }}</ion-badge
        >
    </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { IonBadge } from '@ionic/vue'
export default defineComponent({
    name: 'Badges-component',
    props: ['route'],
    components: { IonBadge },
    mount(props) {
        console.log('setup called')
        const route = ref(props.route)
        return {
            route,
        }
    },
})
</script>
<style scoped>
/* Bus Badges color */
.kmb-badge {
    --background: #e51f28;
}

.lwb-badge {
    --background: #f05323;
}

.ctb-badge {
    --background: #0563ad;
}

.nwfb-badge {
    --background: #6e449d;
}

.nlb-badge {
    --background: #00897b;
}

.pi-badge {
    --background: #febc22;
}

.db-badge {
    --background: #e7222b;
}

.xb-badge {
    --background: #ff67de;
}

/* Minibus Badges */
.hki-badge {
    --background: #e66dca;
}

.kln-badge {
    --background: #6dcae6;
}

.nt-badge {
    --background: #cae66d;
}

/* Common Badges */
.night-badge {
    --background: #36454f;
}

.special-badge {
    --background: #663399;
}

.direction1-badge {
    --background: #5e6fa1;
}

.direction2-badge {
    --background: #a1905e;
}
</style>
