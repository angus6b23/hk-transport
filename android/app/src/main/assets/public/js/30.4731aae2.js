"use strict";(self["webpackChunkhk_bus"]=self["webpackChunkhk_bus"]||[]).push([[30],{6484:function(e,t,i){i.d(t,{Z:function(){return E}});var a=i(6252),o=i(3577),l=i(9963);const s={key:0,class:"star-wrapper"},n={key:2},r={key:0},d={key:1},c={key:0,class:"ion-no-margin ion-margin-start"},u={key:1,class:"ion-no-margin ion-margin-start"},m={key:0,class:"ion-no-margin ion-margin-start"},p={key:1,class:"ion-no-margin ion-margin-start"},w={key:3,class:"no-content"};function h(e,t,i,h,g,y){const k=(0,a.up)("i18next"),f=(0,a.up)("ion-title"),b=(0,a.up)("ion-icon"),_=(0,a.up)("ion-button"),I=(0,a.up)("ion-buttons"),C=(0,a.up)("ion-toolbar"),S=(0,a.up)("ion-searchbar"),W=(0,a.up)("Keypad"),z=(0,a.up)("ion-header"),N=(0,a.up)("ion-label"),q=(0,a.up)("ion-list-header"),U=(0,a.up)("ion-col"),O=(0,a.up)("Badges"),$=(0,a.up)("ion-row"),j=(0,a.up)("ion-grid"),R=(0,a.up)("ion-reorder"),v=(0,a.up)("ion-item"),A=(0,a.up)("ion-reorder-group"),D=(0,a.up)("ion-text"),L=(0,a.up)("ion-list"),x=(0,a.up)("ion-content"),M=(0,a.up)("ETAPopup"),T=(0,a.up)("ion-modal"),H=(0,a.up)("Option"),B=(0,a.up)("ion-page");return(0,a.wg)(),(0,a.j4)(B,null,{default:(0,a.w5)((()=>[(0,a.Wm)(z,null,{default:(0,a.w5)((()=>[(0,a.Wm)(C,null,{default:(0,a.w5)((()=>[(0,a.Wm)(f,null,{default:(0,a.w5)((()=>[(0,a.Wm)(k,{translation:e.$t("searchView.title")},{transportType:(0,a.w5)((()=>[(0,a._)("span",null,(0,o.zw)(e.$t(`common.${e.type}`)),1)])),_:1},8,["translation"])])),_:1}),(0,a.Wm)(I,{slot:"end"},{default:(0,a.w5)((()=>[(0,a.Wm)(_,{onClick:e.openOption},{default:(0,a.w5)((()=>[(0,a.Wm)(b,{icon:e.cog},null,8,["icon"])])),_:1},8,["onClick"])])),_:1})])),_:1}),(0,a.Wm)(C,null,{default:(0,a.w5)((()=>[(0,a.Wm)(S,{autocorrect:"off",modelValue:e.query,"onUpdate:modelValue":t[0]||(t[0]=t=>e.query=t),placeholder:e.$t("searchView.searchPlaceHolder")},null,8,["modelValue","placeholder"]),"ferry"!=e.type?((0,a.wg)(),(0,a.j4)(W,{key:0,query:e.query,data:e.data,onPadClick:e.padUpdateQuery},null,8,["query","data","onPadClick"])):(0,a.kq)("",!0)])),_:1})])),_:1}),(0,a.Wm)(x,{fullscreen:!0},{default:(0,a.w5)((()=>[e.dataReady?((0,a.wg)(),(0,a.j4)(L,{key:0},{default:(0,a.w5)((()=>[e.query.length>0?((0,a.wg)(),(0,a.j4)(q,{key:0},{default:(0,a.w5)((()=>[(0,a.Wm)(N,{class:"hint"},{default:(0,a.w5)((()=>[(0,a.Wm)(k,{translation:e.$t("searchView.searchPrompt",{query:e.query})},{transportType:(0,a.w5)((()=>[(0,a._)("span",null,(0,o.zw)(e.$t(`common.${e.type}`)),1)])),_:1},8,["translation"])])),_:1}),(0,a.Wm)(_,{fill:"clear",onClick:e.clearQuery},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("searchView.clearSearch")),1)])),_:1},8,["onClick"])])),_:1})):((0,a.wg)(),(0,a.j4)(q,{key:1},{default:(0,a.w5)((()=>[e.starred.length>0?((0,a.wg)(),(0,a.iD)("div",s,[(0,a.Wm)(N,null,{default:(0,a.w5)((()=>[(0,a.Wm)(k,{translation:e.$t("searchView.starredPrompt")},{transportType:(0,a.w5)((()=>[(0,a._)("span",null,(0,o.zw)(e.$t(`common.${e.type}`)),1)])),_:1},8,["translation"])])),_:1}),e.disableReorder?((0,a.wg)(),(0,a.j4)(_,{key:0,fill:"clear",onClick:t[1]||(t[1]=t=>e.toggleReorder()),class:"swap-icon"},{default:(0,a.w5)((()=>[(0,a.Wm)(b,{slot:"icon-only",icon:e.swapVerticalOutline},null,8,["icon"])])),_:1})):((0,a.wg)(),(0,a.j4)(_,{key:1,fill:"solid",onClick:t[2]||(t[2]=t=>e.toggleReorder()),class:"swap-icon"},{default:(0,a.w5)((()=>[(0,a.Wm)(b,{slot:"icon-only",icon:e.swapVerticalOutline},null,8,["icon"])])),_:1}))])):(0,a.kq)("",!0)])),_:1})),e.displayArray.length>0?((0,a.wg)(),(0,a.iD)("div",n,[(0,a.Wm)(A,{disabled:e.disableReorder,onIonItemReorder:t[3]||(t[3]=t=>e.reorder(t))},{default:(0,a.w5)((()=>[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(e.displayArray,((t,i)=>((0,a.wg)(),(0,a.j4)(v,{key:t.id,button:""},{default:(0,a.w5)((()=>[(0,a.Wm)(j,null,{default:(0,a.w5)((()=>["bus"==e.type||"minibus"==e.type?((0,a.wg)(),(0,a.j4)($,{key:0,class:"open-modal",expand:"block",onClick:t=>e.openModal(i)},{default:(0,a.w5)((()=>[(0,a.Wm)(U,{"size-xs":"3","size-md":"1",class:"route-no ion-align-items-center"},{default:(0,a.w5)((()=>[t.routeNo.length<10?((0,a.wg)(),(0,a.iD)("h3",r,(0,o.zw)(t.routeNo),1)):((0,a.wg)(),(0,a.iD)("h3",d))])),_:2},1024),(0,a.Wm)(U,{"size-xs":"9","size-md":"11"},{default:(0,a.w5)((()=>[(0,a.Wm)(O,{route:t},null,8,["route"]),"zh"===e.$i18next.language?((0,a.wg)(),(0,a.iD)("h5",c,(0,o.zw)(t.destTC),1)):((0,a.wg)(),(0,a.iD)("h5",u,(0,o.zw)(t.destEN),1))])),_:2},1024)])),_:2},1032,["onClick"])):((0,a.wg)(),(0,a.j4)($,{key:1,class:"open-modal",expand:"block",onClick:t=>e.openModal(i)},{default:(0,a.w5)((()=>[(0,a.Wm)(U,{"size-xs":"8","size-md":"10"},{default:(0,a.w5)((()=>[(0,a.Wm)(O,{route:t},null,8,["route"]),"zh"===e.$i18next.language?((0,a.wg)(),(0,a.iD)("h5",m,(0,o.zw)(t.routeNameTC),1)):((0,a.wg)(),(0,a.iD)("h5",p,(0,o.zw)(t.routeNameEN),1))])),_:2},1024),(0,a.Wm)(U,{"size-xs":"2","size-md":"1",class:"d-flex"},{default:(0,a.w5)((()=>[(0,a.Wm)(_,{onClick:(0,l.iM)((t=>e.openModal(i)),["stop"]),class:"direction1-button direction-button"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("searchView.inbound")),1)])),_:2},1032,["onClick"])])),_:2},1024),(0,a.Wm)(U,{"size-xs":"2","size-md":"1",class:"d-flex"},{default:(0,a.w5)((()=>[(0,a.Wm)(_,{onClick:(0,l.iM)((t=>e.openAltModal(i)),["stop"]),class:"direction2-button direction-button"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("searchView.outbound")),1)])),_:2},1032,["onClick"])])),_:2},1024)])),_:2},1032,["onClick"]))])),_:2},1024),(0,a.Wm)(R,{slot:"end"})])),_:2},1024)))),128))])),_:1},8,["disabled"])])):((0,a.wg)(),(0,a.iD)("div",w,[(0,a.Wm)(D,{color:"medium"},{default:(0,a.w5)((()=>[(0,a._)("p",null,(0,o.zw)(e.$t("searchView.noItem")),1)])),_:1}),(0,a.Wm)(D,{color:"medium"},{default:(0,a.w5)((()=>[(0,a._)("p",null,(0,o.zw)(e.$t("searchView.noItemHint")),1)])),_:1}),"ferry"==e.type?((0,a.wg)(),(0,a.j4)(_,{key:0,fill:"clear",onClick:e.listAll},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("searchView.showFerry")),1)])),_:1},8,["onClick"])):(0,a.kq)("",!0)]))])),_:1})):(0,a.kq)("",!0)])),_:1}),(0,a.Wm)(T,{"is-open":e.modalIsOpen,onWillDismiss:e.closeModal},{default:(0,a.w5)((()=>[(0,a.Wm)(M,{item:e.itemSelected,starred:e.starred,noEta:e.checkNoEta,altRoutes:e.altRoutes,onCloseModal:e.closeModal,onAddStar:e.addStar,onRemoveStar:e.removeStar,onSwapDirection:e.swapDirection},null,8,["item","starred","noEta","altRoutes","onCloseModal","onAddStar","onRemoveStar","onSwapDirection"])])),_:1},8,["is-open","onWillDismiss"]),(0,a.Wm)(T,{"is-open":e.optionIsOpen,onWillDismiss:e.closeOption},{default:(0,a.w5)((()=>[(0,a.Wm)(H,{onCloseOption:e.closeOption,onChangeLanguage:e.changeLanguage},null,8,["onCloseOption","onChangeLanguage"])])),_:1},8,["is-open","onWillDismiss"])])),_:1})}i(7658);var g=i(2262),y=i(5001),k=i(8903),f=i(3978),b=i(7128),_=i(1809);const I={key:0},C={key:1},S={key:2};function W(e,t,i,l,s,n){const r=(0,a.up)("ion-badge");return(0,a.wg)(),(0,a.iD)(a.HY,null,["bus"===e.route.type?((0,a.wg)(),(0,a.iD)("div",I,[e.route.company.includes("KMB")?((0,a.wg)(),(0,a.j4)(r,{key:0,class:"kmb-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.kmb")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("CTB")?((0,a.wg)(),(0,a.j4)(r,{key:1,class:"ctb-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.ctb")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("LWB")?((0,a.wg)(),(0,a.j4)(r,{key:2,class:"lwb-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.lwb")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("NWFB")?((0,a.wg)(),(0,a.j4)(r,{key:3,class:"nwfb-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.nwfb")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("DB")?((0,a.wg)(),(0,a.j4)(r,{key:4,class:"db-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.db")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("NLB")?((0,a.wg)(),(0,a.j4)(r,{key:5,class:"nlb-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.nlb")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("PI")?((0,a.wg)(),(0,a.j4)(r,{key:6,class:"pi-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.pi")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("XB")?((0,a.wg)(),(0,a.j4)(r,{key:7,class:"xb-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.xb")),1)])),_:1})):(0,a.kq)("",!0),e.route.company.includes("LRTFeeder")?((0,a.wg)(),(0,a.j4)(r,{key:8,class:"ltr-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.lrt")),1)])),_:1})):(0,a.kq)("",!0),e.route.serviceMode.includes("N")?((0,a.wg)(),(0,a.j4)(r,{key:9,class:"night-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.night")),1)])),_:1})):(0,a.kq)("",!0),"T"==e.route.serviceMode?((0,a.wg)(),(0,a.j4)(r,{key:10,class:"special-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.special")),1)])),_:1})):(0,a.kq)("",!0)])):(0,a.kq)("",!0),"minibus"===e.route.type?((0,a.wg)(),(0,a.iD)("div",C,[e.route.district.includes("HKI")?((0,a.wg)(),(0,a.j4)(r,{key:0,class:"hki-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.hki")),1)])),_:1})):(0,a.kq)("",!0),e.route.district.includes("KLN")?((0,a.wg)(),(0,a.j4)(r,{key:1,class:"kln-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.kln")),1)])),_:1})):(0,a.kq)("",!0),e.route.district.includes("NT")?((0,a.wg)(),(0,a.j4)(r,{key:2,class:"nt-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.nt")),1)])),_:1})):(0,a.kq)("",!0),e.route.serviceMode.includes("N")?((0,a.wg)(),(0,a.j4)(r,{key:3,class:"night-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.night")),1)])),_:1})):(0,a.kq)("",!0),"T"==e.route.serviceMode?((0,a.wg)(),(0,a.j4)(r,{key:4,class:"special-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.special")),1)])),_:1})):(0,a.kq)("",!0)])):(0,a.kq)("",!0),"ferry"===e.route.type?((0,a.wg)(),(0,a.iD)("div",S,["KAITO"==e.route.district?((0,a.wg)(),(0,a.j4)(r,{key:0,class:"hki-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.kaito")),1)])),_:1})):(0,a.kq)("",!0),"OUTLYING"==e.route.district?((0,a.wg)(),(0,a.j4)(r,{key:1,class:"kln-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.outlying")),1)])),_:1})):(0,a.kq)("",!0),"INNER"==e.route.district?((0,a.wg)(),(0,a.j4)(r,{key:2,class:"nt-badge ion-margin-start"},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.$t("badges.inner")),1)])),_:1})):(0,a.kq)("",!0)])):(0,a.kq)("",!0)],64)}var z=(0,a.aZ)({name:"Badges-component",props:["route"],components:{IonBadge:y.yp},mount(e){console.log("setup called");const t=(0,g.iH)(e.route);return{route:t}}}),N=i(3744);const q=(0,N.Z)(z,[["render",W],["__scopeId","data-v-79aad7cf"]]);var U=q,O=i(7942),$=i(9483),j=i.n($),R=i(6009);const v={id:"summary-tag"},A={class:"grid"},D={class:"numbers"},L={class:"letters"};function x(e,t,i,l,s,n){const r=(0,a.up)("ion-icon"),d=(0,a.up)("ion-text"),c=(0,a.up)("ion-button"),u=(0,a.up)("ion-row");return(0,a.wg)(),(0,a.iD)("div",null,[(0,a._)("details",null,[(0,a._)("summary",v,[(0,a.Wm)(d,{color:"primary"},{default:(0,a.w5)((()=>[(0,a.Wm)(r,{icon:l.keypadOutline,class:"ion-margin-end keypad-icon"},null,8,["icon"]),(0,a.Uk)(" "+(0,o.zw)(e.$t("searchView.toggleRouteKeypad")),1)])),_:1})]),(0,a._)("div",A,[(0,a._)("div",D,[(0,a._)("div",null,[(0,a.Wm)(u,{class:"ion-justify-content-around"},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[1],onClick:t[0]||(t[0]=e=>n.emitClick(1))},{default:(0,a.w5)((()=>[(0,a.Uk)("1")])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[2],onClick:t[1]||(t[1]=e=>n.emitClick(2))},{default:(0,a.w5)((()=>[(0,a.Uk)("2")])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[3],onClick:t[2]||(t[2]=e=>n.emitClick(3))},{default:(0,a.w5)((()=>[(0,a.Uk)("3")])),_:1},8,["disabled"])])),_:1}),(0,a.Wm)(u,{class:"ion-justify-content-around"},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[4],onClick:t[3]||(t[3]=e=>n.emitClick(4))},{default:(0,a.w5)((()=>[(0,a.Uk)("4")])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[5],onClick:t[4]||(t[4]=e=>n.emitClick(5))},{default:(0,a.w5)((()=>[(0,a.Uk)("5")])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[6],onClick:t[5]||(t[5]=e=>n.emitClick(6))},{default:(0,a.w5)((()=>[(0,a.Uk)("6")])),_:1},8,["disabled"])])),_:1}),(0,a.Wm)(u,{class:"ion-justify-content-around"},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[7],onClick:t[6]||(t[6]=e=>n.emitClick(7))},{default:(0,a.w5)((()=>[(0,a.Uk)("7")])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[8],onClick:t[7]||(t[7]=e=>n.emitClick(8))},{default:(0,a.w5)((()=>[(0,a.Uk)("8")])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[9],onClick:t[8]||(t[8]=e=>n.emitClick(9))},{default:(0,a.w5)((()=>[(0,a.Uk)("9")])),_:1},8,["disabled"])])),_:1}),(0,a.Wm)(u,{class:"ion-justify-content-around"},{default:(0,a.w5)((()=>[(0,a.Wm)(c,{class:"icon-button",fill:"clear",size:"4",disabled:0===i.query.length,onClick:t[9]||(t[9]=e=>n.emitClick("clear"))},{default:(0,a.w5)((()=>[(0,a.Wm)(r,{slot:"icon-only",icon:l.trashBinOutline},null,8,["icon"])])),_:1},8,["disabled"]),(0,a.Wm)(c,{fill:"clear",size:"4",disabled:!l.numpad[0],onClick:t[10]||(t[10]=e=>n.emitClick(0))},{default:(0,a.w5)((()=>[(0,a.Uk)("0")])),_:1},8,["disabled"]),(0,a.Wm)(c,{class:"icon-button",fill:"clear",size:"4",disabled:0===i.query.length,onClick:t[11]||(t[11]=e=>n.emitClick("back"))},{default:(0,a.w5)((()=>[(0,a.Wm)(r,{slot:"icon-only",icon:l.backspaceOutline},null,8,["icon"])])),_:1},8,["disabled"])])),_:1})])]),(0,a._)("div",L,[((0,a.wg)(!0),(0,a.iD)(a.HY,null,(0,a.Ko)(l.letterRow,((e,t)=>((0,a.wg)(),(0,a.j4)(c,{fill:"clear",key:t,disabled:!e.enable,onClick:t=>n.emitClick(e.letter)},{default:(0,a.w5)((()=>[(0,a.Uk)((0,o.zw)(e.letter),1)])),_:2},1032,["disabled","onClick"])))),128))])])])])}var M={name:"ComponentName",components:{IonGrid:y.jY,IonRow:y.Nd,IonCol:y.wI,IonButton:y.YG,IonIcon:y.gu,IonText:y.yW},props:["data","query"],emits:["padClick"],setup(){const e={0:!1,1:!1,2:!1,3:!1,4:!1,5:!1,6:!1,7:!1,8:!1,9:!1},t=(0,g.iH)(e),i=(0,g.iH)([]),a=(0,g.iH)([]);return{numpad:t,letterRow:i,routeNoList:a,backspaceOutline:k.RtN,trashBinOutline:k.Ub0,keypadOutline:k.JW_}},mounted(){this.data.length>0&&this.hydrateList()},methods:{hydrateList:function(){let e=new Set,t=new Set(this.data.map((e=>e.routeNo)).filter((e=>e.length<=5)));this.routeNoList=Array.from(t);const i=/([A-Za-z])/g;for(let a of t)a.match(i)&&a.match(i).forEach((t=>e.add(t)));this.letterRow=Array.from(e).sort().map((e=>({letter:e,enable:!1})))},updateButtonStates:function(e){let t=this.routeNoList.filter((t=>0===t.indexOf(e)&&t.length>e.length)),i={0:!1,1:!1,2:!1,3:!1,4:!1,5:!1,6:!1,7:!1,8:!1,9:!1},a=this.letterRow.map((e=>({...e,enable:!1}))).sort(((e,t)=>e.letter.localeCompare(t.letter)));for(let o of t)o[e.length].match(/\d/)?i[o[e.length]]=!0:a=a.map((t=>o[e.length]==t.letter?{...t,enable:!0}:{...t}));this.letterRow=[...a.filter((e=>e.enable)),...a.filter((e=>!e.enable))],this.numpad=i},emitClick:function(e){this.$emit("padClick",e)}},watch:{data(e){e.length&&(this.hydrateList(),this.updateButtonStates(""))},query:function(e){this.updateButtonStates(e)}},beforeUnmount(){}};const T=(0,N.Z)(M,[["render",x],["__scopeId","data-v-af56f39a"]]);var H=T,B=(0,a.aZ)({components:{IonHeader:y.Gu,IonToolbar:y.sr,IonContent:y.W2,IonText:y.yW,IonPage:y._i,IonSearchbar:y.VI,IonItem:y.Ie,IonLabel:y.Q$,IonList:y.q_,IonListHeader:y.yh,IonModal:y.ki,IonGrid:y.jY,IonRow:y.Nd,IonCol:y.wI,Badges:U,IonButton:y.YG,IonIcon:y.gu,IonTitle:y.wd,IonButtons:y.Sm,ETAPopup:b.Z,Option:_.Z,Keypad:H,IonReorder:y.Nh,IonReorderGroup:y.oz},name:"SearchView",props:["dataType"],setup(e){const t=(0,g.iH)(""),i=(0,g.iH)([]),a=(0,g.iH)({}),o=(0,g.iH)([]),l=(0,g.iH)({}),s=(0,g.iH)(!1),n=(0,g.iH)(!1),r=(0,g.iH)([]),d=(0,g.iH)([]),c=(0,g.iH)(e.dataType),u=(0,g.iH)(!1),m=(0,g.iH)(!0);return addEventListener("ionModalDidDismiss",(function(){s.value=!1})),{data:r,query:t,displayArray:i,itemSelected:a,altRoutes:o,config:l,modalIsOpen:s,optionIsOpen:n,disableReorder:m,starred:d,type:c,dataReady:u,cog:k.Mjo,chevronBack:k.Mny,swapVerticalOutline:k.CLz}},methods:{openModal(e){this.itemSelected=JSON.parse(JSON.stringify(this.displayArray[e])),console.log(this.itemSelected),this.getAltRoutes(),this.modalIsOpen=!0},openAltModal(e){let t=this.displayArray[e],i=this.data.findIndex((e=>e.routeId===t.routeId&&e.direction!=t.direction));-1!=i?(this.itemSelected=JSON.parse(JSON.stringify(this.data[i])),console.log(this.itemSelected),this.getAltRoutes(),this.modalIsOpen=!0):((0,R.Z)("info","未找到相關方向，正在顯示順行"),this.openModal(e))},closeModal(){this.modalIsOpen=!1},openOption(){this.optionIsOpen=!0},closeOption(){this.optionIsOpen=!1},async changeLanguage(){this.config=await j().getItem("config")},async addStar(){this.starred.push(this.itemSelected),await this.saveStar()},async removeStar(){const e=this.starred.findIndex((e=>e.routeId===this.itemSelected.routeId&&e.direction===this.itemSelected.direction));this.starred.splice(e,1),await this.saveStar()},async saveStar(){const e=await j().getItem("starred"),t={...e,[this.type]:JSON.parse(JSON.stringify(this.starred))};await j().setItem("starred",t)},currentSelectedItem(e){return e.routeId==this.itemSelected.routeId&&e.routeDirection==this.itemSelected.routeDirection},updateQuery(e){""===e?this.displayArray=this.starred:"ferry"==this.type?this.displayArray=this.data.filter((t=>1==t.direction&&(t.routeNameTC.includes(e)||t.routeNameEN.toLowerCase().includes(e.toLowerCase())))):("zh"===this.$i18next.language?this.displayArray=e<10?this.data.filter((t=>t.routeNo.length<=2&&0==t.routeNo.indexOf(e.toUpperCase())||t.destTC.includes(e))):this.data.filter((t=>0==t.routeNo.indexOf(e.toUpperCase())||t.destTC.includes(e))):this.displayArray=e<10?this.data.filter((t=>t.routeNo.length<=2&&0==t.routeNo.indexOf(e.toUpperCase())||t.destEN.toLowerCase().includes(e.toLowerCase()))):this.data.filter((t=>0==t.routeNo.indexOf(e.toUpperCase())||t.destEN.toLowerCase().includes(e.toLowerCase()))),this.displayArray.sort((function(e,t){return e=Number(e.routeNo.replace(/[A-Z]/g,0)),t=Number(t.routeNo.replace(/[A-Z]/g,0)),e-t})),this.displayArray.splice(50))},padUpdateQuery(e){"clear"===e?this.clearQuery():this.query="back"===e?this.query.substring(0,this.query.length-1):`${this.query}${e}`},listAll(){this.query=" "},clearQuery(){this.query=""},async swapDirection(e=void 0){e?(this.modalIsOpen=!1,await(0,O.Z)(100),this.itemSelected=JSON.parse(JSON.stringify(e)),this.getAltRoutes(),this.modalIsOpen=!0,console.log(this.itemSelected)):(0,R.Z)("error","此路線未有對頭車")},getAltRoutes(){"bus"==this.itemSelected.type&&this.itemSelected.company.includes("KMB")?this.altRoutes=this.data.filter((e=>e.routeNo==this.itemSelected.routeNo&&e.company.join("")==this.itemSelected.company.join("")&&(e.direction!=this.itemSelected.direction||e.serviceMode!=this.itemSelected.serviceMode||e.specialType!=this.itemSelected.specialType))):"bus"==this.itemSelected.type&&this.itemSelected.company.includes("NLB")?this.altRoutes=this.data.filter((e=>e.company.includes("NLB")&&e.routeNo==this.itemSelected.routeNo&&e.routeId!=this.itemSelected.routeId)):"bus"==this.itemSelected.type?this.altRoutes=this.data.filter((e=>e.company.join("")==this.itemSelected.company.join("")&&e.routeNo==this.itemSelected.routeNo&&(e.routeId!=this.itemSelected.routeId||e.direction!=this.itemSelected.direction))):"minibus"==this.itemSelected.type?this.altRoutes=this.data.filter((e=>e.routeNo==this.itemSelected.routeNo&&e.district==this.itemSelected.district&&(e.routeId!=this.itemSelected.routeId||e.direction!=this.itemSelected.direction))):this.altRoutes=this.data.filter((e=>e.routeId==this.itemSelected.routeId&&e.direction!=this.itemSelected.direction))},toggleReorder(){this.disableReorder=!this.disableReorder},async reorder(e){e.detail.complete(this.starred),await this.saveStar()}},async mounted(){this.data=await(0,f.FS)(this.type),this.config=await j().getItem("config");let e=await j().getItem("starred");e&&e[this.type]?this.starred=e[this.type]:this.starred=[],this.displayArray=this.starred,this.dataReady=!0},watch:{query(e){this.updateQuery(e),this.disableReorder=!0}},computed:{checkNoEta(){return"ferry"==this.type||"tram"==this.type}}});const V=(0,N.Z)(B,[["render",h],["__scopeId","data-v-2404a7f0"]]);var E=V}}]);
//# sourceMappingURL=30.4731aae2.js.map