if(!self.define){let e,i={};const n=(n,r)=>(n=new URL(n+".js",r).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(r,s)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const f=e=>n(e,o),u={module:{uri:o},exports:t,require:f};i[o]=Promise.all(r.map((e=>u[e]||f(e)))).then((e=>(s(...e),t)))}}define(["./workbox-c28d2e23"],(function(e){"use strict";e.setCacheNameDetails({prefix:"rmui-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/images/icon.png",revision:"bf310a9c19d122753bef728c0011d512"},{url:"/images/narrow.png",revision:"cfe5e069c814bec7c206476818aca00a"},{url:"/images/wide.png",revision:"672f4464c5bed06ffdefd2dba0ded62b"},{url:"/manifest.json",revision:"cb74bc92609dc718eb908befa9669877"},{url:"/src__pages__index.async.js",revision:"ed5625ee5dfe228735d94f604d8003c2"},{url:"/static/YouSheBiaoTiHei.d9bd0ee7.woff2",revision:null},{url:"/static/YouSheBiaoTiHei.fb1919be.woff",revision:null},{url:"/static/about.6af660a8.md",revision:null},{url:"/static/background.d741a18b.png",revision:null},{url:"/static/ds-digi-webfont.d694d02e.woff",revision:null},{url:"/static/ds-digi-webfont.f1610b3c.woff2",revision:null},{url:"/static/ui_interface.33202de4.c",revision:null},{url:"/static/ui_interface.6e21894b.h",revision:null},{url:"/static/ui_types.acde8fff.h",revision:null},{url:"/umi.css",revision:"763a0e6799f68afc27baa9bd672776b9"},{url:"/umi.js",revision:"61ff8dd854f6f7c1406a3315fae159f4"}],{}),e.cleanupOutdatedCaches()}));
