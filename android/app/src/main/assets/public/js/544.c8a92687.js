"use strict";(self["webpackChunkhk_bus"]=self["webpackChunkhk_bus"]||[]).push([[544],{8544:function(e,t,s){s.r(t),s.d(t,{startFocusVisible:function(){return c}});
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const o="ion-focused",n="ion-focusable",r=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp","Home","End"],c=e=>{let t=[],s=!0;const c=e?e.shadowRoot:document,i=e||document.body,d=e=>{t.forEach((e=>e.classList.remove(o))),e.forEach((e=>e.classList.add(o))),t=e},u=()=>{s=!1,d([])},a=e=>{s=r.includes(e.key),s||d([])},v=e=>{if(s&&void 0!==e.composedPath){const t=e.composedPath().filter((e=>!!e.classList&&e.classList.contains(n)));d(t)}},f=()=>{c.activeElement===i&&d([])};c.addEventListener("keydown",a),c.addEventListener("focusin",v),c.addEventListener("focusout",f),c.addEventListener("touchstart",u),c.addEventListener("mousedown",u);const E=()=>{c.removeEventListener("keydown",a),c.removeEventListener("focusin",v),c.removeEventListener("focusout",f),c.removeEventListener("touchstart",u),c.removeEventListener("mousedown",u)};return{destroy:E,setFocus:d}}}}]);
//# sourceMappingURL=544.c8a92687.js.map