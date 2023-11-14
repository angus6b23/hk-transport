"use strict";(self["webpackChunkhk_transport"]=self["webpackChunkhk_transport"]||[]).push([[990],{8990:function(t,e,n){n.r(e),n.d(e,{createSwipeBackGesture:function(){return a}});var r=n(6587),o=n(545),s=n(1779);
/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
const a=(t,e,n,a,c)=>{const i=t.ownerDocument.defaultView;let u=(0,o.i)(t);const h=t=>{const e=50,{startX:n}=t;return u?n>=i.innerWidth-e:n<=e},l=t=>u?-t.deltaX:t.deltaX,d=t=>u?-t.velocityX:t.velocityX,k=n=>(u=(0,o.i)(t),h(n)&&e()),p=t=>{const e=l(t),n=e/i.innerWidth;a(n)},f=t=>{const e=l(t),n=i.innerWidth,o=e/n,s=d(t),a=n/2,u=s>=0&&(s>.2||e>a),h=u?1-o:o,k=h*n;let p=0;if(k>5){const t=k/Math.abs(s);p=Math.min(t,540)}c(u,o<=0?.01:(0,r.m)(0,o,.9999),p)};return(0,s.createGesture)({el:t,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:k,onStart:n,onMove:p,onEnd:f})}}}]);
//# sourceMappingURL=990.2662712e.js.map