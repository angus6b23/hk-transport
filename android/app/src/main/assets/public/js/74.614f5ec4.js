"use strict";(self["webpackChunkhk_bus"]=self["webpackChunkhk_bus"]||[]).push([[74],{4074:function(e,t,n){n.r(t),n.d(t,{startTapClick:function(){return s}});var o=n(6587);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const s=e=>{let t,n,s,f=10*-l,v=0;const p=e.getBoolean("animated",!0)&&e.getBoolean("rippleEffect",!0),h=new WeakMap,m=e=>{f=(0,o.u)(e),k(e)},L=e=>{f=(0,o.u)(e),T(e)},w=e=>{if(2===e.button)return;const t=(0,o.u)(e)-l;f<t&&k(e)},E=e=>{const t=(0,o.u)(e)-l;f<t&&T(e)},b=()=>{s&&clearTimeout(s),s=void 0,t&&(y(!1),t=void 0)},k=e=>{t||g(i(e),e)},T=e=>{g(void 0,e)},g=(e,n)=>{if(e&&e===t)return;s&&clearTimeout(s),s=void 0;const{x:i,y:r}=(0,o.p)(n);if(t){if(h.has(t))throw new Error("internal error");t.classList.contains(c)||C(t,i,r),y(!0)}if(e){const t=h.get(e);t&&(clearTimeout(t),h.delete(e)),e.classList.remove(c);const n=()=>{C(e,i,r),s=void 0};a(e)?n():s=setTimeout(n,d)}t=e},C=(e,t,o)=>{if(v=Date.now(),e.classList.add(c),!p)return;const s=r(e);null!==s&&(R(),n=s.addRipple(t,o))},R=()=>{void 0!==n&&(n.then((e=>e())),n=void 0)},y=e=>{R();const n=t;if(!n)return;const o=u-Date.now()+v;if(e&&o>0&&!a(n)){const e=setTimeout((()=>{n.classList.remove(c),h.delete(n)}),u);h.set(n,e)}else n.classList.remove(c)},S=document;S.addEventListener("ionGestureCaptured",b),S.addEventListener("touchstart",m,!0),S.addEventListener("touchcancel",L,!0),S.addEventListener("touchend",L,!0),S.addEventListener("pointercancel",b,!0),S.addEventListener("mousedown",w,!0),S.addEventListener("mouseup",E,!0)},i=e=>{if(void 0===e.composedPath)return e.target.closest(".ion-activatable");{const t=e.composedPath();for(let e=0;e<t.length-2;e++){const n=t[e];if(!(n instanceof ShadowRoot)&&n.classList.contains("ion-activatable"))return n}}},a=e=>e.classList.contains("ion-activatable-instant"),r=e=>{if(e.shadowRoot){const t=e.shadowRoot.querySelector("ion-ripple-effect");if(t)return t}return e.querySelector("ion-ripple-effect")},c="ion-activated",d=200,u=200,l=2500}}]);
//# sourceMappingURL=74.614f5ec4.js.map