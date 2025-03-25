import{_ as l,C as a,c as p,o as h,j as i,G as t,a4 as k,a as r}from"./chunks/framework.CPoHb7av.js";const _=JSON.parse('{"title":"linux 重启java服务脚本","description":"","frontmatter":{"title":"linux 重启java服务脚本","date":"2024-05-10T00:00:00.000Z","tags":["java","linux"]},"headers":[],"relativePath":"posts/p-java-restart.md","filePath":"posts/p-java-restart.md","lastUpdated":1742879492000}'),d={name:"posts/p-java-restart.md"};function o(c,s,E,g,F,y){const n=a("PostMeta"),e=a("PostNav");return h(),p("div",null,[s[0]||(s[0]=i("h1",{id:"linux-重启java服务脚本",tabindex:"-1"},[r("linux 重启java服务脚本 "),i("a",{class:"header-anchor",href:"#linux-重启java服务脚本","aria-label":'Permalink to "linux 重启java服务脚本"'},"​")],-1)),t(n),s[1]||(s[1]=k(`<div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">#!/bin/bash</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">PID</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">jps</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -l</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> grep</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;xxxx-1.0&#39;</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> |</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> awk</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &#39;{print $1}&#39;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> &quot; kill </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$PID</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ...&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">kill</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> $PID</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">/home/xxx/xxx-1.0-SNAPSHOT/startup.sh</span></span></code></pre></div>`,1)),t(e)])}const v=l(d,[["render",o]]);export{_ as __pageData,v as default};
