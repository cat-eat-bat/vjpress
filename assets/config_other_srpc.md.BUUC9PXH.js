import{_ as i,c as a,o as n,a4 as t}from"./chunks/framework.CPoHb7av.js";const E=JSON.parse('{"title":"srpc","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"config/other/srpc.md","filePath":"config/other/srpc.md","lastUpdated":1742879492000}'),e={name:"config/other/srpc.md"};function p(h,s,l,k,r,d){return n(),a("div",null,s[0]||(s[0]=[t(`<h1 id="srpc" tabindex="-1">srpc <a class="header-anchor" href="#srpc" aria-label="Permalink to &quot;srpc&quot;">​</a></h1><p>rpc 组件的配置主要分为 客户端 和 服务端 的配置：</p><h2 id="client" tabindex="-1">client <a class="header-anchor" href="#client" aria-label="Permalink to &quot;client&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">srpc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  providers</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># rpc 服务提供者 </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    - </span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">address</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">127.0.0.1:5555</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # rpc 服务地址</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      access-token</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">YNKM45sMDafV</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">    # 访问 token</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">      request-timeout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">600000</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">       # 请求超时时间</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  nacos-server-addr</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">127.0.0.1:8088</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> #  nacos 注册中心地址; 用于 rpc 服务的自动发现 若配置此参数，则 providers 配置失效</span></span></code></pre></div><h2 id="server" tabindex="-1">server <a class="header-anchor" href="#server" aria-label="Permalink to &quot;server&quot;">​</a></h2><div class="language-yaml vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">yaml</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">srpc</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">  server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">:</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    port</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5555</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">   # rpc 服务监听的 socket 端口</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    access-token</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">YNKM45sMDafV</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"> # 访问 token 客户端需配置一致</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    core-pool-size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">4</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D;">    max-pool-size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">16</span></span></code></pre></div>`,6)]))}const o=i(e,[["render",p]]);export{E as __pageData,o as default};
