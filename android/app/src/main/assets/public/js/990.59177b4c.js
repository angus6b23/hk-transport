"use strict";(self["webpackChunkhk_bus"]=self["webpackChunkhk_bus"]||[]).push([[990],{8990:function(t,e,n){n.r(e),n.d(e,{createSwipeBackGesture:function(){return i}});var r=n(6587),s=n(545),c=n(6515);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const i=(t,e,n,i,o)=>{const a=t.ownerDocument.defaultView;let u=(0,s.i)(t);const h=t=>{const e=50,{startX:n}=t;return u?n>=a.innerWidth-e:n<=e},l=t=>u?-t.deltaX:t.deltaX,d=t=>u?-t.velocityX:t.velocityX,k=n=>(u=(0,s.i)(t),h(n)&&e()),b=t=>{const e=l(t),n=e/a.innerWidth;i(n)},f=t=>{const e=l(t),n=a.innerWidth,s=e/n,c=d(t),i=n/2,u=c>=0&&(c>.2||e>i),h=u?1-s:s,k=h*n;let b=0;if(k>5){const t=k/Math.abs(c);b=Math.min(t,540)}o(u,s<=0?.01:(0,r.h)(0,s,.9999),b)};return(0,c.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:k,onStart:n,onMove:b,onEnd:f})}}}]);
//# sourceMappingURL=990.59177b4c.js.map