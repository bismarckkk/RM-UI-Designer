if(!self.define){let i,e={};const r=(r,n)=>(r=new URL(r+".js",n).href,e[r]||new Promise((e=>{if("document"in self){const i=document.createElement("script");i.src=r,i.onload=e,document.head.appendChild(i)}else i=r,importScripts(r),e()})).then((()=>{let i=e[r];if(!i)throw new Error(`Module ${r} didn’t register its module`);return i})));self.define=(n,s)=>{const c=i||("document"in self?document.currentScript.src:"")||location.href;if(e[c])return;let o={};const t=i=>r(i,c),u={module:{uri:c},exports:o,require:t};e[c]=Promise.all(n.map((i=>u[i]||t(i)))).then((i=>(s(...i),o)))}}define(["./workbox-c28d2e23"],(function(i){"use strict";i.setCacheNameDetails({prefix:"rmui-pwa"}),self.skipWaiting(),i.clientsClaim(),i.precacheAndRoute([{url:"/images/icon.png",revision:"bf310a9c19d122753bef728c0011d512"},{url:"/images/narrow.png",revision:"cfe5e069c814bec7c206476818aca00a"},{url:"/images/wide.png",revision:"672f4464c5bed06ffdefd2dba0ded62b"},{url:"/src__pages__index.async.js",revision:"35e231cd25ccc889b0166cc1505e23c1"},{url:"/static/YouSheBiaoTiHei.d9bd0ee7.woff2",revision:null},{url:"/static/YouSheBiaoTiHei.fb1919be.woff",revision:null},{url:"/static/about.6af660a8.md",revision:null},{url:"/static/background.d741a18b.png",revision:null},{url:"/static/ds-digi-webfont.d694d02e.woff",revision:null},{url:"/static/ds-digi-webfont.f1610b3c.woff2",revision:null},{url:"/static/eula.61e7cc28.md",revision:null},{url:"/static/ui_interface.33202de4.c",revision:null},{url:"/static/ui_interface.6e21894b.h",revision:null},{url:"/static/ui_types.c92a992c.h",revision:null},{url:"/umi.css",revision:"763a0e6799f68afc27baa9bd672776b9"},{url:"/umi.js",revision:"27ac5965cf57950ac993f9d9cb74007f"}],{}),i.cleanupOutdatedCaches()}));
