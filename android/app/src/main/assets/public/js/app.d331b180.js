(function(){var t={1993:function(t){function e(t){return Promise.resolve().then((function(){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}))}e.keys=function(){return[]},e.resolve=e,e.id=1993,t.exports=e},6009:function(t,e,n){"use strict";n.d(e,{Z:function(){return a}});var o=n(3269),i=n(8903);async function a(t,e){const n=await o.Mn.create({message:e,duration:1500,position:"bottom",htmlAttributes:{"data-testid":"toast"},icon:"error"==t?i.nLD:"done"==t?i.Nwd:"info"==t?i.yo2:i._YA});await n.present()}},1547:function(t,e,n){"use strict";n(7658);var o=n(6154),i=n(8662),a=n(9483),r=n.n(a),s=n(4165),l=n.n(s);(0,i.ZP)(o.Z,{retry:3});const u=async(t="https://api.12a.app/hk-transport",e)=>{try{let n={},i=await r().keys();for(let t of i)n[t]=l()(JSON.stringify(await r().getItem(t)));const{data:a}=await(0,o.Z)(`${t}/get-hash`),s=[];for(let t in a)n[t]&&n[t]===a[t]||s.push(t);const u=s.length;let c=0;const f=s.map((n=>(0,o.Z)({method:"get",baseURL:t,url:`/chunked/${n}.json`}).then((({data:t})=>(c++,d(e,c,u),r().setItem(n,t))))));return await Promise.all(f),!0}catch(n){return console.error(n),!1}},d=(t,e,n)=>{const o=document.querySelector("#loading-progress");o&&(o.textContent=`${e}/${n}`);const i={current:e,objSize:n},a=new CustomEvent("downloadProgress",{detail:i});t&&t.dispatchEvent(a)};e.Z=u},9095:function(t,e,n){"use strict";var o=n(9963),i=n(6609),a=n(3950),r=n(2372);function s(t){return t.use(a.ZP,{i18next:i.ZP}),t}i.ZP.use(r.Z).init({debug:!1,fallbackLng:["en","zh"]});var l=n(6252);function u(t,e,n,o,i,a){const r=(0,l.up)("ion-router-outlet"),s=(0,l.up)("ion-app");return(0,l.wg)(),(0,l.j4)(s,null,{default:(0,l.w5)((()=>[(0,l.Wm)(r)])),_:1})}var d=n(3269),c=(0,l.aZ)({name:"App",components:{IonApp:d.dr,IonRouterOutlet:d.jP}}),f=n(3744);const h=(0,f.Z)(c,[["render",u]]);var p=h,m=n(4297),g=n(3577);const b={key:0,id:"init"},w={key:1};function v(t,e){const n=(0,l.up)("ion-loading"),o=(0,l.up)("Landing"),i=(0,l.up)("ion-router-outlet"),a=(0,l.up)("ion-icon"),r=(0,l.up)("ion-label"),s=(0,l.up)("ion-tab-button"),u=(0,l.up)("BIconTrainFrontFill"),d=(0,l.up)("BIconTrainFront"),c=(0,l.up)("BIconTruckFrontFill"),f=(0,l.up)("BIconTruckFront"),h=(0,l.up)("BIconTrainLightrailFrontFill"),p=(0,l.up)("BIconTrainLightrailFront"),m=(0,l.up)("ion-tab-bar"),v=(0,l.up)("ion-tabs"),_=(0,l.up)("ion-page");return(0,l.wg)(),(0,l.j4)(_,null,{default:(0,l.w5)((()=>[(0,l.Wm)(n,{"is-open":t.loading,message:t.loadingMessage,translucent:!0},null,8,["is-open","message"]),t.settingFound?((0,l.wg)(),(0,l.iD)("div",w,[(0,l.Wm)(v,{onIonTabsDidChange:t.afterTabChange},{default:(0,l.w5)((()=>[(0,l.Wm)(i),(0,l.Wm)(m,{slot:"bottom",class:"scrollable-bar ion-padding-start"},{default:(0,l.w5)((()=>[(0,l.Wm)(s,{tab:"bus",href:"/tabs/bus",class:"scrollable-item","data-testid":"tab-bus"},{default:(0,l.w5)((()=>["bus"==t.currentTab?((0,l.wg)(),(0,l.j4)(a,{key:0,icon:t.bus},null,8,["icon"])):((0,l.wg)(),(0,l.j4)(a,{key:1,icon:t.busOutline},null,8,["icon"])),(0,l.Wm)(r,{class:"label-text"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.bus")),1)])),_:1})])),_:1}),(0,l.Wm)(s,{tab:"mtr",href:"/tabs/mtr",class:"scrollable-item","data-testid":"tab-mtr"},{default:(0,l.w5)((()=>["mtr"==t.currentTab?((0,l.wg)(),(0,l.j4)(u,{key:0,class:"bi-icons"})):((0,l.wg)(),(0,l.j4)(d,{key:1,class:"bi-icons"})),(0,l.Wm)(r,{class:"label-text"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.underground")),1)])),_:1})])),_:1}),(0,l.Wm)(s,{tab:"minibus",href:"/tabs/minibus",class:"scrollable-item","data-testid":"tab-minibus"},{default:(0,l.w5)((()=>["minibus"==t.currentTab?((0,l.wg)(),(0,l.j4)(c,{key:0,class:"bi-icons"})):((0,l.wg)(),(0,l.j4)(f,{key:1,class:"bi-icons"})),(0,l.Wm)(r,{class:"label-text"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.minibus")),1)])),_:1})])),_:1}),(0,l.Wm)(s,{tab:"tram",href:"/tabs/tram",class:"scrollable-item","data-testid":"tab-tram"},{default:(0,l.w5)((()=>["tram"==t.currentTab?((0,l.wg)(),(0,l.j4)(a,{key:0,icon:t.train},null,8,["icon"])):((0,l.wg)(),(0,l.j4)(a,{key:1,icon:t.trainOutline},null,8,["icon"])),(0,l.Wm)(r,{class:"label-text"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.tram")),1)])),_:1})])),_:1}),(0,l.Wm)(s,{tab:"lightRail",href:"/tabs/light-rail",class:"scrollable-item","data-testid":"tab-light-rail"},{default:(0,l.w5)((()=>["lightRail"==t.currentTab?((0,l.wg)(),(0,l.j4)(h,{key:0,class:"bi-icons"})):((0,l.wg)(),(0,l.j4)(p,{key:1,class:"bi-icons"})),(0,l.Wm)(r,{class:"label-text"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.lightRail")),1)])),_:1})])),_:1}),(0,l.Wm)(s,{tab:"ferry",href:"/tabs/ferry",class:"scrollable-item","data-testid":"tab-ferry"},{default:(0,l.w5)((()=>["ferry"==t.currentTab?((0,l.wg)(),(0,l.j4)(a,{key:0,icon:t.boat},null,8,["icon"])):((0,l.wg)(),(0,l.j4)(a,{key:1,icon:t.boatOutline},null,8,["icon"])),(0,l.Wm)(r,{class:"label-text"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.ferry")),1)])),_:1})])),_:1})])),_:1})])),_:1},8,["onIonTabsDidChange"])])):((0,l.wg)(),(0,l.iD)("div",b,[(0,l.Wm)(o,{onFinishConfig:t.finishConfig},null,8,["onFinishConfig"])]))])),_:1})}var _=n(2262),k=n(8903),y=n(6180),I=n(9483),O=n.n(I);const W=t=>((0,l.dD)("data-v-2a5fb40f"),t=t(),(0,l.Cn)(),t),P={key:0,id:"init"},T={class:"ion-margin-top customApiDiag"},C=W((()=>(0,l._)("br",null,null,-1))),F={key:1,class:"card-wrapper"},U={class:"swipe-slide"},j=W((()=>(0,l._)("div",{class:"video-wrapper"},[(0,l._)("video",{autoplay:"",muted:"",loop:""},[(0,l._)("source",{src:"assets/videos/hint1.webm"})])],-1))),x={class:"swipe-slide"},L=W((()=>(0,l._)("div",{class:"video-wrapper"},[(0,l._)("video",{autoplay:"",muted:"",loop:"",preload:"none"},[(0,l._)("source",{src:"assets/videos/hint2.webm"})])],-1))),$={class:"swipe-slide"},A=W((()=>(0,l._)("div",{class:"video-wrapper"},[(0,l._)("video",{autoplay:"",muted:"",loop:"",preload:"none"},[(0,l._)("source",{src:"assets/videos/hint3.webm"})])],-1))),S={class:"swipe-slide"},E=W((()=>(0,l._)("div",{class:"video-wrapper"},[(0,l._)("video",{autoplay:"",muted:"",loop:"",preload:"none"},[(0,l._)("source",{src:"assets/videos/hint4.webm"})])],-1))),Z={class:"swipe-slide"},z=W((()=>(0,l._)("img",{style:{"object-fit":"contain",height:"100%",width:"100%","max-height":"50vh"},src:"assets/hk-transport-animated.svg"},null,-1))),B={class:"option-wrapper"},N={class:"finish-wrapper"};function D(t,e,n,o,i,a){const r=(0,l.up)("ion-card-title"),s=(0,l.up)("ion-card-subtitle"),u=(0,l.up)("ion-card-header"),d=(0,l.up)("ion-button"),c=(0,l.up)("ion-checkbox"),f=(0,l.up)("ion-label"),h=(0,l.up)("ion-item"),p=(0,l.up)("ion-input"),m=(0,l.up)("ion-card-content"),b=(0,l.up)("ion-card"),w=(0,l.up)("swiper-slide"),v=(0,l.up)("swiper"),_=(0,l.up)("ion-text"),k=(0,l.up)("ion-progress-bar"),y=(0,l.up)("ion-content"),I=(0,l.up)("ion-page");return(0,l.wg)(),(0,l.j4)(I,null,{default:(0,l.w5)((()=>[(0,l.Wm)(y,{class:"ion-margin-top ion-margin-start ion-margin-end"},{default:(0,l.w5)((()=>[1==t.step?((0,l.wg)(),(0,l.iD)("div",P,[(0,l.Wm)(b,{id:"welcome_card"},{default:(0,l.w5)((()=>[(0,l._)("div",null,[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(r,{class:"ion-text-center"},{default:(0,l.w5)((()=>[(0,l.Uk)("歡迎 Welcome")])),_:1}),(0,l.Wm)(s,{class:"ion-margin-top"},{default:(0,l.w5)((()=>[(0,l.Uk)("請選擇語言")])),_:1}),(0,l.Wm)(s,null,{default:(0,l.w5)((()=>[(0,l.Uk)("Please select language")])),_:1})])),_:1}),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(d,{expand:"block",class:"ion-margin-top",onClick:e[0]||(e[0]=e=>t.setLang("zh")),"data-testid":"zh-button"},{default:(0,l.w5)((()=>[(0,l.Uk)("正體中文")])),_:1}),(0,l.Wm)(d,{expand:"block",class:"ion-margin-top",onClick:e[1]||(e[1]=e=>t.setLang("en")),"data-testid":"en-button"},{default:(0,l.w5)((()=>[(0,l.Uk)("English")])),_:1}),(0,l._)("div",T,[(0,l.Wm)(h,null,{default:(0,l.w5)((()=>[(0,l.Wm)(c,{slot:"start",modelValue:t.useOwnAPI,"onUpdate:modelValue":e[2]||(e[2]=e=>t.useOwnAPI=e),"data-testid":"endpoint-checkbox"},null,8,["modelValue"]),(0,l.Wm)(f,null,{default:(0,l.w5)((()=>[(0,l.Uk)("使用自訂的站台 "),C,(0,l.Uk)(" Use your own endpoint")])),_:1})])),_:1}),(0,l.Wm)(h,{class:(0,g.C_)({hidden:!t.useOwnAPI,"ion-margin-top":!0})},{default:(0,l.w5)((()=>[(0,l.Wm)(p,{modelValue:t.hostUrl,"onUpdate:modelValue":e[3]||(e[3]=e=>t.hostUrl=e),placeholder:"https://your.endpoint.api/","data-testid":"endpoint-input",required:""},null,8,["modelValue"])])),_:1},8,["class"])])])),_:1})])])),_:1})])):(0,l.kq)("",!0),2==t.step?((0,l.wg)(),(0,l.iD)("div",F,[(0,l.Wm)(b,{class:"tour-card"},{default:(0,l.w5)((()=>[(0,l.Wm)(u,null,{default:(0,l.w5)((()=>[(0,l.Wm)(r,{"data-testid":"tour-title"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("landing.quicktour")),1)])),_:1})])),_:1}),(0,l.Wm)(m,null,{default:(0,l.w5)((()=>[(0,l.Wm)(v,{style:{"max-height":"60vh"},modules:t.modules,"slides-per-view":1,"space-between":50,pagination:""},{default:(0,l.w5)((()=>[(0,l.Wm)(w,null,{default:(0,l.w5)((()=>[(0,l._)("div",U,[j,(0,l._)("p",null,(0,g.zw)(t.$t("landing.hint1")),1)])])),_:1}),(0,l.Wm)(w,null,{default:(0,l.w5)((()=>[(0,l._)("div",x,[L,(0,l._)("p",null,(0,g.zw)(t.$t("landing.hint2")),1)])])),_:1}),(0,l.Wm)(w,null,{default:(0,l.w5)((()=>[(0,l._)("div",$,[A,(0,l._)("p",null,(0,g.zw)(t.$t("landing.hint3")),1)])])),_:1}),(0,l.Wm)(w,null,{default:(0,l.w5)((()=>[(0,l._)("div",S,[E,(0,l._)("p",null,(0,g.zw)(t.$t("landing.hint4")),1)])])),_:1}),(0,l.Wm)(w,null,{default:(0,l.w5)((()=>[(0,l._)("div",Z,[z,(0,l._)("p",null,(0,g.zw)(t.$t("landing.hint5")),1)])])),_:1})])),_:1},8,["modules"]),(0,l._)("div",B,[(0,l._)("div",null,[(0,l.Wm)(h,null,{default:(0,l.w5)((()=>[(0,l.Wm)(c,{slot:"start",modelValue:t.autoStart,"onUpdate:modelValue":e[4]||(e[4]=e=>t.autoStart=e),"data-testid":"tour-checkbox"},null,8,["modelValue"]),(0,l.Wm)(f,{class:"ion-text-wrap"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("landing.autoStart")),1)])),_:1})])),_:1})]),(0,l._)("div",N,[(0,l.Wm)(_,{class:"ion-margin-end"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.downloadText),1)])),_:1}),(0,l.Wm)(d,{onClick:e[5]||(e[5]=e=>t.finishConfig()),disabled:!t.downloadFinish,"data-testid":"tour-finish-button"},{default:(0,l.w5)((()=>[(0,l.Uk)((0,g.zw)(t.$t("common.finish")),1)])),_:1},8,["disabled"])])]),(0,l.Wm)(k,{value:t.downloadProgress,class:"ion-margin-top"},null,8,["value"])])),_:1})])),_:1})])):(0,l.kq)("",!0)])),_:1})])),_:1})}n(6229),n(7330),n(2062);var H=n(7552),q=n(9304),M=n(1547),R=n(6009),V=(0,l.aZ)({name:"Landing",components:{IonPage:d._i,IonButton:d.YG,IonCard:d.PM,IonCardContent:d.FN,IonCardSubtitle:d.tO,IonCardTitle:d.Dq,IonCardHeader:d.Zi,IonContent:d.W2,IonLabel:d.Q$,IonInput:d.pK,IonCheckbox:d.nz,Swiper:H.tq,SwiperSlide:H.o5,IonProgressBar:d.X7,IonItem:d.Ie,IonText:d.yW},emits:["finishConfig"],setup(){const t=(0,_.iH)(""),e=(0,_.iH)(!1),n=(0,_.iH)(""),o=(0,_.iH)(1),i=(0,_.iH)(0),a=(0,_.iH)(""),r=(0,_.iH)(!1),s=(0,_.iH)(!0);return{hostUrl:n,step:o,chevronBackOutline:k.ZY4,checkmarkOutline:k.TjA,lang:t,useOwnAPI:e,downloadProgress:i,downloadFinish:r,autoStart:s,downloadText:a,modules:[q.tl]}},mounted(){this.$el.addEventListener("downloadProgress",this.handleDownloadProgress)},methods:{async setLang(t){this.$i18next.changeLanguage(t),this.lang=t,this.step=2,this.useOwnAPI&&""===this.hostUrl&&(this.useOwnAPI=!1,(0,R.Z)("info",this.$t("landing.nullUrl"))),await this.initiateDownload()},finishConfig(){let t={lang:this.lang,theme:"system",fetchMethod:this.useOwnAPI?"self":"default",apiBaseUrl:this.useOwnAPI?this.hostUrl:"",dataFilled:!1,autoScroll:!0,maxResults:20};this.$emit("finishConfig",t)},handleDownloadProgress(t){this.downloadProgress=t.detail.current/t.detail.objSize,this.downloadText=`${t.detail.current} / ${t.detail.objSize}`},checkURL(){try{const t=new URL(this.hostUrl);return"http:"===t.protocol||"https:"===t.protocol}catch(t){return!1}},async initiateDownload(){try{if(this.useOwnAPI&&!this.checkURL())throw new Error("Invalid Url");let t=!1;const e=this.useOwnAPI?"self":"default",n=this.useOwnAPI?this.hostUrl:"";switch(e){case"default":t=await(0,M.Z)(void 0,this.$el);break;case"self":t=await(0,M.Z)(n,this.$el);break;default:throw new Error("Unknown fetch method")}if(!t)throw new Error("Fetch Failed");this.downloadFinish=!0,this.autoStart&&this.finishConfig()}catch(t){this.step=1,"Fetch Failed"===t.message?(0,R.Z)("error",this.$i18next.t("toast.networkError")):"Invalid Url"===t.message&&(0,R.Z)("error",this.$i18next.t("toast.invalidUrl"))}}}});const G=(0,f.Z)(V,[["render",D],["__scopeId","data-v-2a5fb40f"]]);var J=G,Q=(0,l.aZ)({name:"TabsPage",components:{IonLabel:d.Q$,IonTabs:d.UN,IonTabBar:d.yq,IonTabButton:d.ZU,IonIcon:d.gu,IonPage:d._i,IonRouterOutlet:d.jP,IonLoading:d.wh,BIconTruckFrontFill:y.dqP,BIconTruckFront:y.S2E,BIconTrainFront:y.r7O,BIconTrainFrontFill:y.yeL,BIconTrainLightrailFront:y.Cyf,BIconTrainLightrailFrontFill:y.fUr,Landing:J},setup(){const t=(0,_.iH)(!0),e=(0,_.iH)({}),n=(0,_.iH)(!1),o=(0,_.iH)("請稍侯...<br>Please Wait..."),i=(0,_.iH)(""),a=document.body;return(0,l.JJ)("globalConfig",e),{speedometer:k.kAS,speedometerOutline:k.hkG,boat:k.cqT,boatOutline:k.rkQ,train:k.p_j,trainOutline:k.Seq,square:k.h62,bus:k.$xG,busOutline:k.kml,settingFound:t,config:e,loading:n,loadingMessage:o,currentTab:i,body:a}},methods:{afterTabChange(t){this.currentTab=t.tab},async finishConfig(t){await O().setItem("config",{...t,dataFilled:!0}),this.settingFound=!0,this.config={...t,dataFilled:!0}}},async mounted(){try{const t=await O().getItem("config");t&&t.dataFilled?(this.config=t,this.settingFound=!0,this.$i18next.changeLanguage(this.config.lang),t.theme&&"dark"==t.theme?this.body.classList.toggle("dark",!0):t.theme&&"light"==t.theme?this.body.classList.toggle("dark",!1):window.matchMedia("(prefers-color-scheme: dark)").matches&&this.body.classList.toggle("dark",!0)):(window.matchMedia("(prefers-color-scheme: dark)").matches&&this.body.classList.toggle("dark",!0),this.settingFound=!1)}catch(t){this.settingFound=!1,console.error(t)}}});const Y=(0,f.Z)(Q,[["render",v],["__scopeId","data-v-cff26e46"]]);var K=Y;const X=[{path:"/",redirect:"/tabs"},{path:"/tabs/",component:K,children:[{path:"",redirect:"/tabs/bus"},{path:"bus",component:()=>Promise.all([n.e(996),n.e(889),n.e(435)]).then(n.bind(n,8435))},{path:"minibus",component:()=>Promise.all([n.e(996),n.e(889),n.e(224)]).then(n.bind(n,4224))},{path:"ferry",component:()=>Promise.all([n.e(996),n.e(889),n.e(146)]).then(n.bind(n,8146))},{path:"tram",component:()=>Promise.all([n.e(996),n.e(528)]).then(n.bind(n,5405))},{path:"mtr",component:()=>Promise.all([n.e(996),n.e(450)]).then(n.bind(n,8680))},{path:"light-rail",component:()=>Promise.all([n.e(996),n.e(865)]).then(n.bind(n,9102))}]}],tt=(0,m.p7)({history:(0,m.PO)("/"),routes:X});var et=tt,nt=(n(8851),n(1292),n(1633),n(1045),n(6187),n(2299),n(3423),n(4687),n(9147),n(6250),n(5205));(0,nt.z)("/service-worker.js",{ready(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered(){console.log("Service worker has been registered.")},cached(){console.log("Content has been cached for offline use.")},updatefound(){console.log("New content is downloading.")},updated(){console.log("New content is available; please refresh.")},offline(){console.log("No internet connection found. App is running in offline mode.")},error(t){console.error("Error during service worker registration:",t)}});const ot=s((0,o.ri)(p)).use(d.oX,{innerHTMLTemplatesEnabled:!0}).use(et);et.isReady().then((()=>{ot.mount("#app")}))}},e={};function n(o){var i=e[o];if(void 0!==i)return i.exports;var a=e[o]={exports:{}};return t[o].call(a.exports,a,a.exports,n),a.exports}n.m=t,function(){var t=[];n.O=function(e,o,i,a){if(!o){var r=1/0;for(d=0;d<t.length;d++){o=t[d][0],i=t[d][1],a=t[d][2];for(var s=!0,l=0;l<o.length;l++)(!1&a||r>=a)&&Object.keys(n.O).every((function(t){return n.O[t](o[l])}))?o.splice(l--,1):(s=!1,a<r&&(r=a));if(s){t.splice(d--,1);var u=i();void 0!==u&&(e=u)}}return e}a=a||0;for(var d=t.length;d>0&&t[d-1][2]>a;d--)t[d]=t[d-1];t[d]=[o,i,a]}}(),function(){n.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return n.d(e,{a:e}),e}}(),function(){var t,e=Object.getPrototypeOf?function(t){return Object.getPrototypeOf(t)}:function(t){return t.__proto__};n.t=function(o,i){if(1&i&&(o=this(o)),8&i)return o;if("object"===typeof o&&o){if(4&i&&o.__esModule)return o;if(16&i&&"function"===typeof o.then)return o}var a=Object.create(null);n.r(a);var r={};t=t||[null,e({}),e([]),e(e)];for(var s=2&i&&o;"object"==typeof s&&!~t.indexOf(s);s=e(s))Object.getOwnPropertyNames(s).forEach((function(t){r[t]=function(){return o[t]}}));return r["default"]=function(){return o},n.d(a,r),a}}(),function(){n.d=function(t,e){for(var o in e)n.o(e,o)&&!n.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:e[o]})}}(),function(){n.f={},n.e=function(t){return Promise.all(Object.keys(n.f).reduce((function(e,o){return n.f[o](t,e),e}),[]))}}(),function(){n.u=function(t){return"js/"+t+"."+{74:"127c59f8",78:"834f1e3a",146:"b2e29bf8",224:"71fb8959",338:"df00ac77",435:"19cb8f8f",450:"94f237d5",528:"c6fb869a",544:"e4f01d80",576:"408edc9a",674:"66c141c6",753:"a5347b0e",775:"d7fae4b1",865:"ab5bed40",889:"e158a8db",990:"2662712e",996:"84a0257b"}[t]+".js"}}(),function(){n.miniCssF=function(t){return"css/"+t+"."+{450:"8205a367",528:"8205a367",865:"8205a367",889:"650006fc"}[t]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"===typeof window)return window}}()}(),function(){n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)}}(),function(){var t={},e="hk-transport:";n.l=function(o,i,a,r){if(t[o])t[o].push(i);else{var s,l;if(void 0!==a)for(var u=document.getElementsByTagName("script"),d=0;d<u.length;d++){var c=u[d];if(c.getAttribute("src")==o||c.getAttribute("data-webpack")==e+a){s=c;break}}s||(l=!0,s=document.createElement("script"),s.charset="utf-8",s.timeout=120,n.nc&&s.setAttribute("nonce",n.nc),s.setAttribute("data-webpack",e+a),s.src=o),t[o]=[i];var f=function(e,n){s.onerror=s.onload=null,clearTimeout(h);var i=t[o];if(delete t[o],s.parentNode&&s.parentNode.removeChild(s),i&&i.forEach((function(t){return t(n)})),e)return e(n)},h=setTimeout(f.bind(null,void 0,{type:"timeout",target:s}),12e4);s.onerror=f.bind(null,s.onerror),s.onload=f.bind(null,s.onload),l&&document.head.appendChild(s)}}}(),function(){n.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){if("undefined"!==typeof document){var t=function(t,e,n,o,i){var a=document.createElement("link");a.rel="stylesheet",a.type="text/css";var r=function(n){if(a.onerror=a.onload=null,"load"===n.type)o();else{var r=n&&("load"===n.type?"missing":n.type),s=n&&n.target&&n.target.href||e,l=new Error("Loading CSS chunk "+t+" failed.\n("+s+")");l.code="CSS_CHUNK_LOAD_FAILED",l.type=r,l.request=s,a.parentNode&&a.parentNode.removeChild(a),i(l)}};return a.onerror=a.onload=r,a.href=e,n?n.parentNode.insertBefore(a,n.nextSibling):document.head.appendChild(a),a},e=function(t,e){for(var n=document.getElementsByTagName("link"),o=0;o<n.length;o++){var i=n[o],a=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(a===t||a===e))return i}var r=document.getElementsByTagName("style");for(o=0;o<r.length;o++){i=r[o],a=i.getAttribute("data-href");if(a===t||a===e)return i}},o=function(o){return new Promise((function(i,a){var r=n.miniCssF(o),s=n.p+r;if(e(r,s))return i();t(o,s,null,i,a)}))},i={143:0};n.f.miniCss=function(t,e){var n={450:1,528:1,865:1,889:1};i[t]?e.push(i[t]):0!==i[t]&&n[t]&&e.push(i[t]=o(t).then((function(){i[t]=0}),(function(e){throw delete i[t],e})))}}}(),function(){var t={143:0};n.f.j=function(e,o){var i=n.o(t,e)?t[e]:void 0;if(0!==i)if(i)o.push(i[2]);else{var a=new Promise((function(n,o){i=t[e]=[n,o]}));o.push(i[2]=a);var r=n.p+n.u(e),s=new Error,l=function(o){if(n.o(t,e)&&(i=t[e],0!==i&&(t[e]=void 0),i)){var a=o&&("load"===o.type?"missing":o.type),r=o&&o.target&&o.target.src;s.message="Loading chunk "+e+" failed.\n("+a+": "+r+")",s.name="ChunkLoadError",s.type=a,s.request=r,i[1](s)}};n.l(r,l,"chunk-"+e,e)}},n.O.j=function(e){return 0===t[e]};var e=function(e,o){var i,a,r=o[0],s=o[1],l=o[2],u=0;if(r.some((function(e){return 0!==t[e]}))){for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(l)var d=l(n)}for(e&&e(o);u<r.length;u++)a=r[u],n.o(t,a)&&t[a]&&t[a][0](),t[a]=0;return n.O(d)},o=self["webpackChunkhk_transport"]=self["webpackChunkhk_transport"]||[];o.forEach(e.bind(null,0)),o.push=e.bind(null,o.push.bind(o))}();var o=n.O(void 0,[998],(function(){return n(9095)}));o=n.O(o)})();
//# sourceMappingURL=app.d331b180.js.map