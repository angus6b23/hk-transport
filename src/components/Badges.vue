<template>
    <!-- Badges for bus -->
    <div v-if="route.type === 'bus'" :class="{'badge-left': position !== 'default'}">
        <ion-badge
            v-if="route.company.includes('KMB')"
            class="kmb-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.kmb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('CTB')"
            class="ctb-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.ctb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('LWB')"
            class="lwb-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.lwb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('NWFB')"
            class="nwfb-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.nwfb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('DB')"
            class="db-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.db') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('NLB')"
            class="nlb-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.nlb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('PI')"
            class="pi-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.pi') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('XB')"
            class="xb-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.xb') }}</ion-badge
        >
        <ion-badge
            v-if="route.company.includes('LRTFeeder')"
            class="ltr-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.lrt') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode.includes('N')"
            class="night-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.night') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode == 'T'"
            class="special-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.special') }}</ion-badge
        >
    </div>
    <div v-if="route.type === 'minibus'">
        <ion-badge
            v-if="route.district.includes('HKI')"
            class="hki-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.hki') }}</ion-badge
        >
        <ion-badge
            v-if="route.district.includes('KLN')"
            class="kln-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.kln') }}</ion-badge
        >
        <ion-badge
            v-if="route.district.includes('NT')"
            class="nt-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.nt') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode.includes('N')"
            class="night-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.night') }}</ion-badge
        >
        <ion-badge
            v-if="route.serviceMode == 'T'"
            class="special-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.special') }}</ion-badge
        >
    </div>
    <div v-if="route.type === 'ferry'">
        <ion-badge
            v-if="route.district == 'KAITO'"
            class="hki-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.kaito') }}</ion-badge
        >
        <ion-badge
            v-if="route.district == 'OUTLYING'"
            class="kln-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.outlying') }}</ion-badge
        >
        <ion-badge
            v-if="route.district == 'INNER'"
            class="nt-badge"
            :class="{ compact: compact, 'ion-margin-start': position !== 'left' }"
            >{{ $t('badges.inner') }}</ion-badge
        >
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import { IonBadge } from '@ionic/vue'
export default defineComponent({
    name: 'Badges-component',
    props: ['route', 'compact', 'position'],
    components: { IonBadge },
    mounted() {
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
.compact {
    scale: 0.8;
}
.badge-left {
    display: flex;
    flex-wrap: wrap;
    flex-direction:column;
}
@media screen and (min-width: 768px){
    .compact {
        scale: 1;
        margin-bottom: 0.2rem;
    }
    
}
</style>
