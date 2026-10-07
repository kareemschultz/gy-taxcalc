(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89056,88653,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(31178),n=e.i(47414),i=e.i(21476),o=r,l=e.i(37806);class s extends o.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=this.props.sizeRef.current;e.height=t.offsetHeight||0,e.width=t.offsetWidth||0,e.top=t.offsetTop,e.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function d({children:e,isPresent:r}){let a=(0,o.useId)(),n=(0,o.useRef)(null),i=(0,o.useRef)({width:0,height:0,top:0,left:0}),{nonce:c}=(0,o.useContext)(l.MotionConfigContext);return(0,o.useInsertionEffect)(()=>{let{width:e,height:t,top:o,left:l}=i.current;if(r||!n.current||!e||!t)return;n.current.dataset.motionPopId=a;let s=document.createElement("style");return c&&(s.nonce=c),document.head.appendChild(s),s.sheet&&s.sheet.insertRule(`
          [data-motion-pop-id="${a}"] {
            position: absolute !important;
            width: ${e}px !important;
            height: ${t}px !important;
            top: ${o}px !important;
            left: ${l}px !important;
          }
        `),()=>{document.head.removeChild(s)}},[r]),(0,t.jsx)(s,{isPresent:r,childRef:n,sizeRef:i,children:o.cloneElement(e,{ref:n})})}let c=({children:e,initial:a,isPresent:o,onExitComplete:l,custom:s,presenceAffectsLayout:c,mode:p})=>{let m=(0,n.useConstant)(u),f=(0,r.useId)(),h=(0,r.useCallback)(e=>{for(let t of(m.set(e,!0),m.values()))if(!t)return;l&&l()},[m,l]),g=(0,r.useMemo)(()=>({id:f,initial:a,isPresent:o,custom:s,onExitComplete:h,register:e=>(m.set(e,!1),()=>m.delete(e))}),c?[Math.random(),h]:[o,h]);return(0,r.useMemo)(()=>{m.forEach((e,t)=>m.set(t,!1))},[o]),r.useEffect(()=>{o||m.size||!l||l()},[o]),"popLayout"===p&&(e=(0,t.jsx)(d,{isPresent:o,children:e})),(0,t.jsx)(i.PresenceContext.Provider,{value:g,children:e})};function u(){return new Map}var p=e.i(64978);let m=e=>e.key||"";function f(e){let t=[];return r.Children.forEach(e,e=>{(0,r.isValidElement)(e)&&t.push(e)}),t}var h=e.i(74008);let g=({children:e,custom:i,initial:o=!0,onExitComplete:l,presenceAffectsLayout:s=!0,mode:d="sync",propagate:u=!1})=>{let[g,x]=(0,p.usePresence)(u),v=(0,r.useMemo)(()=>f(e),[e]),y=u&&!g?[]:v.map(m),b=(0,r.useRef)(!0),w=(0,r.useRef)(v),k=(0,n.useConstant)(()=>new Map),[j,C]=(0,r.useState)(v),[S,R]=(0,r.useState)(v);(0,h.useIsomorphicLayoutEffect)(()=>{b.current=!1,w.current=v;for(let e=0;e<S.length;e++){let t=m(S[e]);y.includes(t)?k.delete(t):!0!==k.get(t)&&k.set(t,!1)}},[S,y.length,y.join("-")]);let E=[];if(v!==j){let e=[...v];for(let t=0;t<S.length;t++){let r=S[t],a=m(r);y.includes(a)||(e.splice(t,0,r),E.push(r))}"wait"===d&&E.length&&(e=E),R(f(e)),C(v);return}let{forceRender:N}=(0,r.useContext)(a.LayoutGroupContext);return(0,t.jsx)(t.Fragment,{children:S.map(e=>{let r=m(e),a=(!u||!!g)&&(v===S||y.includes(r));return(0,t.jsx)(c,{isPresent:a,initial:(!b.current||!!o)&&void 0,custom:a?void 0:i,presenceAffectsLayout:s,mode:d,onExitComplete:a?void 0:()=>{if(!k.has(r))return;k.set(r,!0);let e=!0;k.forEach(t=>{t||(e=!1)}),e&&(null==N||N(),R(w.current),u&&(null==x||x()),l&&l())},children:e},r)})})};e.s(["AnimatePresence",0,g],88653);var x=e.i(46932),v=e.i(64659),y=e.i(69035),b=e.i(47163);e.s(["Section",0,function({title:e,icon:a,description:n,defaultOpen:i=!0,children:o,className:l}){let[s,d]=r.useState(i);return(0,t.jsxs)(x.motion.div,{className:(0,b.cn)("overflow-hidden rounded-xl border bg-card",l),initial:{opacity:0,y:12,scale:.985},whileInView:{opacity:1,y:0,scale:1},viewport:{once:!0,amount:.25},transition:{duration:.28,ease:"easeOut"},children:[(0,t.jsxs)("button",{type:"button",onClick:()=>d(e=>!e),className:"flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted/40 motion-safe:active:scale-[0.995]",children:[(0,t.jsxs)("span",{className:"flex min-w-0 flex-col gap-1",children:[(0,t.jsxs)("span",{className:"flex items-center gap-2",children:[a,(0,t.jsx)("span",{className:"truncate",children:e})]}),n?(0,t.jsx)("span",{className:"text-xs font-normal leading-snug text-muted-foreground",children:n}):null]}),(0,t.jsx)(v.ChevronDown,{className:(0,b.cn)("mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200",s&&"rotate-180")})]}),(0,t.jsx)(g,{initial:!1,children:s&&(0,t.jsxs)(x.motion.div,{initial:{height:0,opacity:0,y:-8},animate:{height:"auto",opacity:1,y:0},exit:{height:0,opacity:0},transition:{duration:.26,ease:"easeInOut"},className:"overflow-hidden",children:[(0,t.jsx)(y.Separator,{}),(0,t.jsx)(x.motion.div,{className:"space-y-4 px-4 py-4",initial:"hidden",animate:"visible",variants:{hidden:{},visible:{transition:{staggerChildren:.06,delayChildren:.02}}},children:o})]},"content")})]})}],89056)},67729,e=>{"use strict";var t=e.i(43476),r=e.i(46932);let a=(0,e.i(75254).default)("arrow-down",[["path",{d:"M12 5v14",key:"s699le"}],["path",{d:"m19 12-7 7-7-7",key:"1idqje"}]]);var n=e.i(67881),i=e.i(47163);e.s(["StickyResultsBar",0,function({items:e,buttonLabel:o="Details",onDetails:l,className:s}){return(0,t.jsx)(r.motion.div,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},transition:{duration:.22},className:(0,i.cn)("fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-3 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur-sm md:hidden",s),children:(0,t.jsxs)("div",{className:"mx-auto flex max-w-7xl items-center gap-2",children:[(0,t.jsx)("div",{className:"grid flex-1 grid-cols-3 gap-2 text-center text-xs",children:e.map(e=>(0,t.jsxs)("div",{className:"rounded-lg bg-muted px-2 py-2",children:[(0,t.jsx)("p",{className:"text-[10px] uppercase text-muted-foreground",children:e.label}),(0,t.jsx)("p",{className:"font-semibold tabular-nums",children:e.value})]},e.label))}),(0,t.jsxs)(n.Button,{type:"button",size:"sm",variant:"secondary",onClick:l,children:[(0,t.jsx)(a,{className:"size-4"}),o]})]})})}],67729)},75664,e=>{"use strict";var t=e.i(43476),r=e.i(47163);e.s(["DotPattern",0,function({className:e}){return(0,t.jsx)("div",{className:(0,r.cn)("pointer-events-none absolute inset-0","bg-[radial-gradient(circle,hsl(152_56%_26%/0.18)_1px,transparent_1px)]","[background-size:20px_20px]","dark:bg-[radial-gradient(circle,hsl(152_50%_42%/0.13)_1px,transparent_1px)]","[mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_60%,transparent_100%)]",e)})}])},79342,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(75254);let n=(0,a.default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]),i=(0,a.default)("share-2",[["circle",{cx:"18",cy:"5",r:"3",key:"gq8acd"}],["circle",{cx:"6",cy:"12",r:"3",key:"w7nqdw"}],["circle",{cx:"18",cy:"19",r:"3",key:"1xt0gg"}],["line",{x1:"8.59",x2:"15.42",y1:"13.51",y2:"17.49",key:"47mynk"}],["line",{x1:"15.41",x2:"8.59",y1:"6.51",y2:"10.49",key:"1n3mei"}]]),o=(0,a.default)("printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);var l=e.i(67881),s=e.i(1583);function d(e){"u">typeof navigator&&navigator.clipboard?.writeText&&navigator.clipboard.writeText(e)}function c(e){return e.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function u(e,t,r,a){return`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${c(`${e} — ${s.PRODUCT.name}`)}</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f3f7fb;
        --panel: #ffffff;
        --panel-soft: #f8fafc;
        --text: #0f172a;
        --muted: #64748b;
        --border: rgba(15, 23, 42, 0.1);
        --shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
        --emerald: #16a34a;
        --sky: #0284c7;
        --lime: #65a30d;
        --amber: #d97706;
        --accent-soft: rgba(22, 163, 74, 0.12);
      }
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: var(--text);
        background:
          radial-gradient(circle at top left, rgba(22, 163, 74, 0.14), transparent 28%),
          radial-gradient(circle at top right, rgba(2, 132, 199, 0.12), transparent 28%),
          linear-gradient(180deg, #f8fafc 0%, #eef4f9 100%);
      }
      @page {
        size: A4 portrait;
        margin: 12mm;
      }
      .page {
        max-width: 1120px;
        margin: 0 auto;
        padding: 24px;
      }
      .hero {
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border);
        border-radius: 28px;
        color: white;
        padding: 28px;
        background:
          radial-gradient(circle at top left, rgba(34, 197, 94, 0.25), transparent 30%),
          radial-gradient(circle at top right, rgba(14, 165, 233, 0.22), transparent 30%),
          linear-gradient(135deg, #0f172a 0%, #111827 48%, #0f172a 100%);
        box-shadow: 0 24px 64px rgba(15, 23, 42, 0.22);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .hero::after {
        content: "";
        position: absolute;
        right: -6rem;
        bottom: -7rem;
        width: 18rem;
        height: 18rem;
        border-radius: 999px;
        background: radial-gradient(circle, rgba(132, 204, 22, 0.26), transparent 68%);
        filter: blur(18px);
        pointer-events: none;
      }
      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border-radius: 999px;
        padding: 6px 12px;
        background: rgba(255, 255, 255, 0.12);
        color: rgba(255, 255, 255, 0.9);
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .eyebrow::before {
        content: "";
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: var(--emerald);
        box-shadow: 0 0 0 6px rgba(22, 163, 74, 0.14);
      }
      h1 {
        margin: 16px 0 8px;
        font-size: 34px;
        line-height: 1.05;
        letter-spacing: -0.03em;
      }
      .subtitle {
        margin: 0;
        max-width: 70ch;
        color: rgba(255, 255, 255, 0.8);
        line-height: 1.55;
        font-size: 15px;
      }
      .summary {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 20px;
        position: relative;
        z-index: 1;
      }
      .summary-card,
      .section-card {
        border: 1px solid var(--border);
        border-radius: 20px;
        background: var(--panel);
        padding: 16px;
      }
      .summary-card {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.05)),
          rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.16);
        color: white;
        box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
      }
      .summary-card:nth-child(1) { border-top: 3px solid var(--emerald); }
      .summary-card:nth-child(2) { border-top: 3px solid var(--sky); }
      .summary-card:nth-child(3) { border-top: 3px solid var(--lime); }
      .summary-card:nth-child(4) { border-top: 3px solid var(--amber); }
      .summary-label,
      .section-title {
        font-size: 11px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--muted);
      }
      .summary-card .summary-label { color: rgba(255, 255, 255, 0.72); }
      .summary-value {
        margin-top: 8px;
        font-size: 21px;
        font-weight: 800;
        line-height: 1.12;
        word-break: break-word;
      }
      .sections {
        display: grid;
        gap: 14px;
        margin-top: 18px;
      }
      .section-card {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98)),
          var(--panel);
        box-shadow: var(--shadow);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .section-grid {
        display: grid;
        gap: 10px;
        margin-top: 10px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid var(--border);
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .row:last-child {
        border-bottom: 0;
        padding-bottom: 0;
      }
      .row-label {
        color: var(--muted);
        font-size: 14px;
        line-height: 1.45;
      }
      .row-value {
        font-weight: 600;
        text-align: right;
        line-height: 1.45;
        word-break: break-word;
      }
      .note {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--accent-soft);
        color: #166534;
        font-size: 13px;
      }
      .footer {
        margin-top: 20px;
        color: var(--muted);
        font-size: 12px;
        text-align: center;
      }
      .page-break {
        break-before: page;
        page-break-before: always;
      }
      @media print {
        body {
          background: white;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .page { padding: 0; }
        .hero { box-shadow: none; }
        .summary-card,
        .section-card {
          break-inside: avoid;
          page-break-inside: avoid;
        }
      }
      @media (max-width: 900px) {
        .summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 640px) {
        .page { padding: 0; }
        .hero { padding: 22px; border-radius: 22px; }
        h1 { font-size: 28px; }
        .summary { grid-template-columns: 1fr; }
        .row { flex-direction: column; gap: 6px; }
        .row-value { text-align: left; }
      }
    </style>
  </head>
  <body>
    <div class="page">
      <section class="hero">
        <span class="eyebrow">${s.PRODUCT.name} Report</span>
        <h1>${c(e)}</h1>
        ${t?`<p class="subtitle">${c(t)}</p>`:""}
        <div class="summary">
          ${r.map(e=>`
                <div class="summary-card">
                  <div class="summary-label">${e.label}</div>
                  <div class="summary-value">${e.value}</div>
                </div>`).join("")}
        </div>
      </section>

      <section class="sections page-break">
        ${a.map(e=>`
              <div class="section-card">
                <div class="section-title">${e.title}</div>
                <div class="section-grid">
                  ${e.rows.map(e=>`
                        <div class="row">
                          <div class="row-label">${e.label}</div>
                          <div class="row-value">${e.value}</div>
                        </div>`).join("")}
                </div>
                ${e.note?`<div class="note">${e.note}</div>`:""}
              </div>`).join("")}
      </section>

      <div class="footer">Generated by ${s.PRODUCT.name} — ${s.PRODUCT.tagline} Save this page as PDF from the print dialog.</div>
    </div>
  </body>
</html>`}e.s(["ResultActions",0,function({fileName:e,title:a,lines:p,subtitle:m,summary:f,sections:h}){let g=r.useMemo(()=>{let e=[`${s.PRODUCT.name} — ${a}`,""];return m&&e.push(m,""),f?.length&&(e.push("Summary"),f.forEach(t=>e.push(`${t.label}: ${t.value}`)),e.push("")),h?.length&&h.forEach(t=>{e.push(t.title),t.rows.forEach(t=>e.push(`${t.label}: ${t.value}`)),t.note&&e.push(t.note),e.push("")}),e.push(...p),e.push("",`Generated by ${s.PRODUCT.name} — ${s.PRODUCT.tagline}`),e.join("\n")},[a,m,f,h,p]),x=r.useMemo(()=>(f??p.slice(0,4).map(e=>{let[t,...r]=e.split(":");return{label:t||"Item",value:r.join(":").trim()||e}})).map(e=>({label:c(e.label),value:c(e.value)})),[f,p]),v=r.useMemo(()=>(h??[{title:"Details",rows:p.map(e=>{let[t,...r]=e.split(":");return{label:t||"Item",value:r.join(":").trim()||e}})}]).map(e=>({title:c(e.title),note:e.note?c(e.note):void 0,rows:e.rows.map(e=>({label:c(e.label),value:c(e.value)}))})),[h,p]),y=async()=>{if("u"<typeof navigator)return;let t=u(a,m,x,v),r=e.replace(/\.[^.]+$/,".html");try{if(navigator.share&&"u">typeof File){let e=new File([t],r,{type:"text/html"});if("function"!=typeof navigator.canShare||navigator.canShare({files:[e]}))return void await navigator.share({title:a,text:g,files:[e]});await navigator.share({title:a,text:g});return}d(g)}catch{d(g)}};return(0,t.jsxs)("div",{className:"flex flex-wrap gap-2 print:hidden",children:[(0,t.jsxs)(l.Button,{type:"button",size:"sm",variant:"outline",onClick:()=>{let t=new Blob([g],{type:"text/plain;charset=utf-8"}),r=URL.createObjectURL(t),a=document.createElement("a");a.href=r,a.download=e,a.click(),URL.revokeObjectURL(r)},children:[(0,t.jsx)(n,{className:"size-3.5"}),"Save"]}),(0,t.jsxs)(l.Button,{type:"button",size:"sm",variant:"outline",onClick:y,children:[(0,t.jsx)(i,{className:"size-3.5"}),"Share"]}),(0,t.jsxs)(l.Button,{type:"button",size:"sm",variant:"outline",onClick:()=>{let e=u(a,m,x,v),t=document.createElement("iframe");t.setAttribute("aria-hidden","true"),t.style.position="fixed",t.style.right="0",t.style.bottom="0",t.style.width="0",t.style.height="0",t.style.border="0",t.style.visibility="hidden",t.srcdoc=e,document.body.appendChild(t);let r=()=>{window.setTimeout(()=>{t.remove()},250)};t.addEventListener("load",()=>{let e=t.contentWindow;e?(e.addEventListener("afterprint",r,{once:!0}),e.focus(),window.setTimeout(()=>{e.print()},300)):r()})},children:[(0,t.jsx)(o,{className:"size-3.5"}),"Print"]})]})}],79342)},19036,e=>{"use strict";var t=e.i(43476),r=e.i(71645),a=e.i(81140),n=e.i(20783),i=e.i(30030),o=e.i(69340),l=e.i(99682),s=e.i(35804),d=e.i(48425),c="Switch",[u,p]=(0,i.createContextScope)(c),[m,f]=u(c),h=r.forwardRef((e,i)=>{let{__scopeSwitch:l,name:s,checked:u,defaultChecked:p,required:f,disabled:h,value:g="on",onCheckedChange:x,form:b,...w}=e,[k,j]=r.useState(null),C=(0,n.useComposedRefs)(i,e=>j(e)),S=r.useRef(!1),R=!k||b||!!k.closest("form"),[E,N]=(0,o.useControllableState)({prop:u,defaultProp:p??!1,onChange:x,caller:c});return(0,t.jsxs)(m,{scope:l,checked:E,disabled:h,children:[(0,t.jsx)(d.Primitive.button,{type:"button",role:"switch","aria-checked":E,"aria-required":f,"data-state":y(E),"data-disabled":h?"":void 0,disabled:h,value:g,...w,ref:C,onClick:(0,a.composeEventHandlers)(e.onClick,e=>{N(e=>!e),R&&(S.current=e.isPropagationStopped(),S.current||e.stopPropagation())})}),R&&(0,t.jsx)(v,{control:k,bubbles:!S.current,name:s,value:g,checked:E,required:f,disabled:h,form:b,style:{transform:"translateX(-100%)"}})]})});h.displayName=c;var g="SwitchThumb",x=r.forwardRef((e,r)=>{let{__scopeSwitch:a,...n}=e,i=f(g,a);return(0,t.jsx)(d.Primitive.span,{"data-state":y(i.checked),"data-disabled":i.disabled?"":void 0,...n,ref:r})});x.displayName=g;var v=r.forwardRef(({__scopeSwitch:e,control:a,checked:i,bubbles:o=!0,...d},c)=>{let u=r.useRef(null),p=(0,n.useComposedRefs)(u,c),m=(0,l.usePrevious)(i),f=(0,s.useSize)(a);return r.useEffect(()=>{let e=u.current;if(!e)return;let t=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,"checked").set;if(m!==i&&t){let r=new Event("click",{bubbles:o});t.call(e,i),e.dispatchEvent(r)}},[m,i,o]),(0,t.jsx)("input",{type:"checkbox","aria-hidden":!0,defaultChecked:i,...d,tabIndex:-1,ref:p,style:{...d.style,...f,position:"absolute",pointerEvents:"none",opacity:0,margin:0}})});function y(e){return e?"checked":"unchecked"}v.displayName="SwitchBubbleInput";var b=e.i(47163);e.s(["Switch",0,function({className:e,...r}){return(0,t.jsx)(h,{"data-slot":"switch",className:(0,b.cn)("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",e),...r,children:(0,t.jsx)(x,{"data-slot":"switch-thumb",className:(0,b.cn)("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")})})}],19036)},53734,e=>{"use strict";let t=(0,e.i(75254).default)("badge-dollar-sign",[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 18V6",key:"zqpxq5"}]]);e.s(["BadgeDollarSign",0,t],53734)},67240,23737,8985,99682,64659,62870,e=>{"use strict";let t,r,a;var n=e.i(75254);let i=(0,n.default)("rotate-ccw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);e.s(["RotateCcw",0,i],67240);var o=e.i(43476);let l=(0,n.default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);e.s(["default",0,l],23737);var s=e.i(28231),d=e.i(47163);e.s(["Hint",0,function({label:e,tip:t,className:r}){return(0,o.jsx)(s.TooltipProvider,{delayDuration:120,children:(0,o.jsxs)(s.Tooltip,{children:[(0,o.jsxs)(s.TooltipTrigger,{type:"button",className:(0,d.cn)("inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",r),children:[e?(0,o.jsx)("span",{children:e}):null,(0,o.jsx)(l,{className:"size-3.5 text-muted-foreground/70"})]}),(0,o.jsx)(s.TooltipContent,{side:"top",align:"start",className:"max-w-64 text-xs leading-relaxed",children:t})]})})}],8985);var c=e.i(71645),u=e.i(74080);function p(e,[t,r]){return Math.min(r,Math.max(t,e))}var m=e.i(81140),f=e.i(75830),h=e.i(20783),g=e.i(30030),x=e.i(86318),v=e.i(26330),y=e.i(3536),b=e.i(65491),w=e.i(10772),k=e.i(53660),j=e.i(74606),C=e.i(48425),S=Symbol("radix.slottable");function R(e){return c.isValidElement(e)&&"function"==typeof e.type&&"__radixId"in e.type&&e.type.__radixId===S}var E=e.i(30207),N=e.i(69340),P=e.i(34620);function T(e){let t=c.useRef({value:e,previous:e});return c.useMemo(()=>(t.current.value!==e&&(t.current.previous=t.current.value,t.current.value=e),t.current.previous),[e])}e.s(["usePrevious",0,T],99682);var I=e.i(59411),D=e.i(86312),M=e.i(85369),L=[" ","Enter","ArrowUp","ArrowDown"],H=[" ","Enter"],z="Select",[_,A,$]=(0,f.createCollection)(z),[O,B]=(0,g.createContextScope)(z,[$,k.createPopperScope]),V=(0,k.createPopperScope)(),[U,F]=O(z),[K,W]=O(z),q=e=>{let{__scopeSelect:t,children:r,open:a,defaultOpen:n,onOpenChange:i,value:l,defaultValue:s,onValueChange:d,dir:u,name:p,autoComplete:m,disabled:f,required:h,form:g}=e,v=V(t),[y,b]=c.useState(null),[j,C]=c.useState(null),[S,R]=c.useState(!1),E=(0,x.useDirection)(u),[P,T]=(0,N.useControllableState)({prop:a,defaultProp:n??!1,onChange:i,caller:z}),[I,D]=(0,N.useControllableState)({prop:l,defaultProp:s,onChange:d,caller:z}),M=c.useRef(null),L=!y||g||!!y.closest("form"),[H,A]=c.useState(new Set),$=Array.from(H).map(e=>e.props.value).join(";");return(0,o.jsx)(k.Root,{...v,children:(0,o.jsxs)(U,{required:h,scope:t,trigger:y,onTriggerChange:b,valueNode:j,onValueNodeChange:C,valueNodeHasChildren:S,onValueNodeHasChildrenChange:R,contentId:(0,w.useId)(),value:I,onValueChange:D,open:P,onOpenChange:T,dir:E,triggerPointerDownPosRef:M,disabled:f,children:[(0,o.jsx)(_.Provider,{scope:t,children:(0,o.jsx)(K,{scope:e.__scopeSelect,onNativeOptionAdd:c.useCallback(e=>{A(t=>new Set(t).add(e))},[]),onNativeOptionRemove:c.useCallback(e=>{A(t=>{let r=new Set(t);return r.delete(e),r})},[]),children:r})}),L?(0,o.jsxs)(eD,{"aria-hidden":!0,required:h,tabIndex:-1,name:p,autoComplete:m,value:I,onChange:e=>D(e.target.value),disabled:f,form:g,children:[void 0===I?(0,o.jsx)("option",{value:""}):null,Array.from(H)]},$):null]})})};q.displayName=z;var G="SelectTrigger",Y=c.forwardRef((e,t)=>{let{__scopeSelect:r,disabled:a=!1,...n}=e,i=V(r),l=F(G,r),s=l.disabled||a,d=(0,h.useComposedRefs)(t,l.onTriggerChange),u=A(r),p=c.useRef("touch"),[f,g,x]=eL(e=>{let t=u().filter(e=>!e.disabled),r=t.find(e=>e.value===l.value),a=eH(t,e,r);void 0!==a&&l.onValueChange(a.value)}),v=e=>{s||(l.onOpenChange(!0),x()),e&&(l.triggerPointerDownPosRef.current={x:Math.round(e.pageX),y:Math.round(e.pageY)})};return(0,o.jsx)(k.Anchor,{asChild:!0,...i,children:(0,o.jsx)(C.Primitive.button,{type:"button",role:"combobox","aria-controls":l.contentId,"aria-expanded":l.open,"aria-required":l.required,"aria-autocomplete":"none",dir:l.dir,"data-state":l.open?"open":"closed",disabled:s,"data-disabled":s?"":void 0,"data-placeholder":eM(l.value)?"":void 0,...n,ref:d,onClick:(0,m.composeEventHandlers)(n.onClick,e=>{e.currentTarget.focus(),"mouse"!==p.current&&v(e)}),onPointerDown:(0,m.composeEventHandlers)(n.onPointerDown,e=>{p.current=e.pointerType;let t=e.target;t.hasPointerCapture(e.pointerId)&&t.releasePointerCapture(e.pointerId),0===e.button&&!1===e.ctrlKey&&"mouse"===e.pointerType&&(v(e),e.preventDefault())}),onKeyDown:(0,m.composeEventHandlers)(n.onKeyDown,e=>{let t=""!==f.current;e.ctrlKey||e.altKey||e.metaKey||1!==e.key.length||g(e.key),(!t||" "!==e.key)&&L.includes(e.key)&&(v(),e.preventDefault())})})})});Y.displayName=G;var X="SelectValue",Z=c.forwardRef((e,t)=>{let{__scopeSelect:r,className:a,style:n,children:i,placeholder:l="",...s}=e,d=F(X,r),{onValueNodeHasChildrenChange:c}=d,u=void 0!==i,p=(0,h.useComposedRefs)(t,d.onValueNodeChange);return(0,P.useLayoutEffect)(()=>{c(u)},[c,u]),(0,o.jsx)(C.Primitive.span,{...s,ref:p,style:{pointerEvents:"none"},children:eM(d.value)?(0,o.jsx)(o.Fragment,{children:l}):i})});Z.displayName=X;var J=c.forwardRef((e,t)=>{let{__scopeSelect:r,children:a,...n}=e;return(0,o.jsx)(C.Primitive.span,{"aria-hidden":!0,...n,ref:t,children:a||"▼"})});J.displayName="SelectIcon";var Q=e=>(0,o.jsx)(j.Portal,{asChild:!0,...e});Q.displayName="SelectPortal";var ee="SelectContent",et=c.forwardRef((e,t)=>{let r=F(ee,e.__scopeSelect),[a,n]=c.useState();return((0,P.useLayoutEffect)(()=>{n(new DocumentFragment)},[]),r.open)?(0,o.jsx)(ei,{...e,ref:t}):a?u.createPortal((0,o.jsx)(er,{scope:e.__scopeSelect,children:(0,o.jsx)(_.Slot,{scope:e.__scopeSelect,children:(0,o.jsx)("div",{children:e.children})})}),a):null});et.displayName=ee;var[er,ea]=O(ee),en=((a=c.forwardRef((e,t)=>{let{children:r,...a}=e;if(c.isValidElement(r)){var n;let e,i,o=(n=r,(i=(e=Object.getOwnPropertyDescriptor(n.props,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?n.ref:(i=(e=Object.getOwnPropertyDescriptor(n,"ref")?.get)&&"isReactWarning"in e&&e.isReactWarning)?n.props.ref:n.props.ref||n.ref),l=function(e,t){let r={...t};for(let a in t){let n=e[a],i=t[a];/^on[A-Z]/.test(a)?n&&i?r[a]=(...e)=>{let t=i(...e);return n(...e),t}:n&&(r[a]=n):"style"===a?r[a]={...n,...i}:"className"===a&&(r[a]=[n,i].filter(Boolean).join(" "))}return{...e,...r}}(a,r.props);return r.type!==c.Fragment&&(l.ref=t?(0,h.composeRefs)(t,o):o),c.cloneElement(r,l)}return c.Children.count(r)>1?c.Children.only(null):null})).displayName="SelectContent.RemoveScroll.SlotClone",t=a,(r=c.forwardRef((e,r)=>{let{children:a,...n}=e,i=c.Children.toArray(a),l=i.find(R);if(l){let e=l.props.children,a=i.map(t=>t!==l?t:c.Children.count(e)>1?c.Children.only(null):c.isValidElement(e)?e.props.children:null);return(0,o.jsx)(t,{...n,ref:r,children:c.isValidElement(e)?c.cloneElement(e,void 0,a):null})}return(0,o.jsx)(t,{...n,ref:r,children:a})})).displayName="SelectContent.RemoveScroll.Slot",r),ei=c.forwardRef((e,t)=>{let{__scopeSelect:r,position:a="item-aligned",onCloseAutoFocus:n,onEscapeKeyDown:i,onPointerDownOutside:l,side:s,sideOffset:d,align:u,alignOffset:p,arrowPadding:f,collisionBoundary:g,collisionPadding:x,sticky:w,hideWhenDetached:k,avoidCollisions:j,...C}=e,S=F(ee,r),[R,E]=c.useState(null),[N,P]=c.useState(null),T=(0,h.useComposedRefs)(t,e=>E(e)),[I,L]=c.useState(null),[H,z]=c.useState(null),_=A(r),[$,O]=c.useState(!1),B=c.useRef(!1);c.useEffect(()=>{if(R)return(0,D.hideOthers)(R)},[R]),(0,y.useFocusGuards)();let V=c.useCallback(e=>{let[t,...r]=_().map(e=>e.ref.current),[a]=r.slice(-1),n=document.activeElement;for(let r of e)if(r===n||(r?.scrollIntoView({block:"nearest"}),r===t&&N&&(N.scrollTop=0),r===a&&N&&(N.scrollTop=N.scrollHeight),r?.focus(),document.activeElement!==n))return},[_,N]),U=c.useCallback(()=>V([I,R]),[V,I,R]);c.useEffect(()=>{$&&U()},[$,U]);let{onOpenChange:K,triggerPointerDownPosRef:W}=S;c.useEffect(()=>{if(R){let e={x:0,y:0},t=t=>{e={x:Math.abs(Math.round(t.pageX)-(W.current?.x??0)),y:Math.abs(Math.round(t.pageY)-(W.current?.y??0))}},r=r=>{e.x<=10&&e.y<=10?r.preventDefault():R.contains(r.target)||K(!1),document.removeEventListener("pointermove",t),W.current=null};return null!==W.current&&(document.addEventListener("pointermove",t),document.addEventListener("pointerup",r,{capture:!0,once:!0})),()=>{document.removeEventListener("pointermove",t),document.removeEventListener("pointerup",r,{capture:!0})}}},[R,K,W]),c.useEffect(()=>{let e=()=>K(!1);return window.addEventListener("blur",e),window.addEventListener("resize",e),()=>{window.removeEventListener("blur",e),window.removeEventListener("resize",e)}},[K]);let[q,G]=eL(e=>{let t=_().filter(e=>!e.disabled),r=t.find(e=>e.ref.current===document.activeElement),a=eH(t,e,r);a&&setTimeout(()=>a.ref.current.focus())}),Y=c.useCallback((e,t,r)=>{let a=!B.current&&!r;(void 0!==S.value&&S.value===t||a)&&(L(e),a&&(B.current=!0))},[S.value]),X=c.useCallback(()=>R?.focus(),[R]),Z=c.useCallback((e,t,r)=>{let a=!B.current&&!r;(void 0!==S.value&&S.value===t||a)&&z(e)},[S.value]),J="popper"===a?el:eo,Q=J===el?{side:s,sideOffset:d,align:u,alignOffset:p,arrowPadding:f,collisionBoundary:g,collisionPadding:x,sticky:w,hideWhenDetached:k,avoidCollisions:j}:{};return(0,o.jsx)(er,{scope:r,content:R,viewport:N,onViewportChange:P,itemRefCallback:Y,selectedItem:I,onItemLeave:X,itemTextRefCallback:Z,focusSelectedItem:U,selectedItemText:H,position:a,isPositioned:$,searchRef:q,children:(0,o.jsx)(M.RemoveScroll,{as:en,allowPinchZoom:!0,children:(0,o.jsx)(b.FocusScope,{asChild:!0,trapped:S.open,onMountAutoFocus:e=>{e.preventDefault()},onUnmountAutoFocus:(0,m.composeEventHandlers)(n,e=>{S.trigger?.focus({preventScroll:!0}),e.preventDefault()}),children:(0,o.jsx)(v.DismissableLayer,{asChild:!0,disableOutsidePointerEvents:!0,onEscapeKeyDown:i,onPointerDownOutside:l,onFocusOutside:e=>e.preventDefault(),onDismiss:()=>S.onOpenChange(!1),children:(0,o.jsx)(J,{role:"listbox",id:S.contentId,"data-state":S.open?"open":"closed",dir:S.dir,onContextMenu:e=>e.preventDefault(),...C,...Q,onPlaced:()=>O(!0),ref:T,style:{display:"flex",flexDirection:"column",outline:"none",...C.style},onKeyDown:(0,m.composeEventHandlers)(C.onKeyDown,e=>{let t=e.ctrlKey||e.altKey||e.metaKey;if("Tab"===e.key&&e.preventDefault(),t||1!==e.key.length||G(e.key),["ArrowUp","ArrowDown","Home","End"].includes(e.key)){let t=_().filter(e=>!e.disabled).map(e=>e.ref.current);if(["ArrowUp","End"].includes(e.key)&&(t=t.slice().reverse()),["ArrowUp","ArrowDown"].includes(e.key)){let r=e.target,a=t.indexOf(r);t=t.slice(a+1)}setTimeout(()=>V(t)),e.preventDefault()}})})})})})})});ei.displayName="SelectContentImpl";var eo=c.forwardRef((e,t)=>{let{__scopeSelect:r,onPlaced:a,...n}=e,i=F(ee,r),l=ea(ee,r),[s,d]=c.useState(null),[u,m]=c.useState(null),f=(0,h.useComposedRefs)(t,e=>m(e)),g=A(r),x=c.useRef(!1),v=c.useRef(!0),{viewport:y,selectedItem:b,selectedItemText:w,focusSelectedItem:k}=l,j=c.useCallback(()=>{if(i.trigger&&i.valueNode&&s&&u&&y&&b&&w){let e=i.trigger.getBoundingClientRect(),t=u.getBoundingClientRect(),r=i.valueNode.getBoundingClientRect(),n=w.getBoundingClientRect();if("rtl"!==i.dir){let a=n.left-t.left,i=r.left-a,o=e.left-i,l=e.width+o,d=Math.max(l,t.width),c=p(i,[10,Math.max(10,window.innerWidth-10-d)]);s.style.minWidth=l+"px",s.style.left=c+"px"}else{let a=t.right-n.right,i=window.innerWidth-r.right-a,o=window.innerWidth-e.right-i,l=e.width+o,d=Math.max(l,t.width),c=p(i,[10,Math.max(10,window.innerWidth-10-d)]);s.style.minWidth=l+"px",s.style.right=c+"px"}let o=g(),l=window.innerHeight-20,d=y.scrollHeight,c=window.getComputedStyle(u),m=parseInt(c.borderTopWidth,10),f=parseInt(c.paddingTop,10),h=parseInt(c.borderBottomWidth,10),v=m+f+d+parseInt(c.paddingBottom,10)+h,k=Math.min(5*b.offsetHeight,v),j=window.getComputedStyle(y),C=parseInt(j.paddingTop,10),S=parseInt(j.paddingBottom,10),R=e.top+e.height/2-10,E=b.offsetHeight/2,N=m+f+(b.offsetTop+E);if(N<=R){let e=o.length>0&&b===o[o.length-1].ref.current;s.style.bottom="0px";let t=Math.max(l-R,E+(e?S:0)+(u.clientHeight-y.offsetTop-y.offsetHeight)+h);s.style.height=N+t+"px"}else{let e=o.length>0&&b===o[0].ref.current;s.style.top="0px";let t=Math.max(R,m+y.offsetTop+(e?C:0)+E);s.style.height=t+(v-N)+"px",y.scrollTop=N-R+y.offsetTop}s.style.margin="10px 0",s.style.minHeight=k+"px",s.style.maxHeight=l+"px",a?.(),requestAnimationFrame(()=>x.current=!0)}},[g,i.trigger,i.valueNode,s,u,y,b,w,i.dir,a]);(0,P.useLayoutEffect)(()=>j(),[j]);let[S,R]=c.useState();(0,P.useLayoutEffect)(()=>{u&&R(window.getComputedStyle(u).zIndex)},[u]);let E=c.useCallback(e=>{e&&!0===v.current&&(j(),k?.(),v.current=!1)},[j,k]);return(0,o.jsx)(es,{scope:r,contentWrapper:s,shouldExpandOnScrollRef:x,onScrollButtonChange:E,children:(0,o.jsx)("div",{ref:d,style:{display:"flex",flexDirection:"column",position:"fixed",zIndex:S},children:(0,o.jsx)(C.Primitive.div,{...n,ref:f,style:{boxSizing:"border-box",maxHeight:"100%",...n.style}})})})});eo.displayName="SelectItemAlignedPosition";var el=c.forwardRef((e,t)=>{let{__scopeSelect:r,align:a="start",collisionPadding:n=10,...i}=e,l=V(r);return(0,o.jsx)(k.Content,{...l,...i,ref:t,align:a,collisionPadding:n,style:{boxSizing:"border-box",...i.style,"--radix-select-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-select-content-available-width":"var(--radix-popper-available-width)","--radix-select-content-available-height":"var(--radix-popper-available-height)","--radix-select-trigger-width":"var(--radix-popper-anchor-width)","--radix-select-trigger-height":"var(--radix-popper-anchor-height)"}})});el.displayName="SelectPopperPosition";var[es,ed]=O(ee,{}),ec="SelectViewport",eu=c.forwardRef((e,t)=>{let{__scopeSelect:r,nonce:a,...n}=e,i=ea(ec,r),l=ed(ec,r),s=(0,h.useComposedRefs)(t,i.onViewportChange),d=c.useRef(0);return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("style",{dangerouslySetInnerHTML:{__html:"[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"},nonce:a}),(0,o.jsx)(_.Slot,{scope:r,children:(0,o.jsx)(C.Primitive.div,{"data-radix-select-viewport":"",role:"presentation",...n,ref:s,style:{position:"relative",flex:1,overflow:"hidden auto",...n.style},onScroll:(0,m.composeEventHandlers)(n.onScroll,e=>{let t=e.currentTarget,{contentWrapper:r,shouldExpandOnScrollRef:a}=l;if(a?.current&&r){let e=Math.abs(d.current-t.scrollTop);if(e>0){let a=window.innerHeight-20,n=Math.max(parseFloat(r.style.minHeight),parseFloat(r.style.height));if(n<a){let i=n+e,o=Math.min(a,i),l=i-o;r.style.height=o+"px","0px"===r.style.bottom&&(t.scrollTop=l>0?l:0,r.style.justifyContent="flex-end")}}}d.current=t.scrollTop})})})]})});eu.displayName=ec;var ep="SelectGroup",[em,ef]=O(ep);c.forwardRef((e,t)=>{let{__scopeSelect:r,...a}=e,n=(0,w.useId)();return(0,o.jsx)(em,{scope:r,id:n,children:(0,o.jsx)(C.Primitive.div,{role:"group","aria-labelledby":n,...a,ref:t})})}).displayName=ep;var eh="SelectLabel",eg=c.forwardRef((e,t)=>{let{__scopeSelect:r,...a}=e,n=ef(eh,r);return(0,o.jsx)(C.Primitive.div,{id:n.id,...a,ref:t})});eg.displayName=eh;var ex="SelectItem",[ev,ey]=O(ex),eb=c.forwardRef((e,t)=>{let{__scopeSelect:r,value:a,disabled:n=!1,textValue:i,...l}=e,s=F(ex,r),d=ea(ex,r),u=s.value===a,[p,f]=c.useState(i??""),[g,x]=c.useState(!1),v=(0,h.useComposedRefs)(t,e=>d.itemRefCallback?.(e,a,n)),y=(0,w.useId)(),b=c.useRef("touch"),k=()=>{n||(s.onValueChange(a),s.onOpenChange(!1))};if(""===a)throw Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");return(0,o.jsx)(ev,{scope:r,value:a,disabled:n,textId:y,isSelected:u,onItemTextChange:c.useCallback(e=>{f(t=>t||(e?.textContent??"").trim())},[]),children:(0,o.jsx)(_.ItemSlot,{scope:r,value:a,disabled:n,textValue:p,children:(0,o.jsx)(C.Primitive.div,{role:"option","aria-labelledby":y,"data-highlighted":g?"":void 0,"aria-selected":u&&g,"data-state":u?"checked":"unchecked","aria-disabled":n||void 0,"data-disabled":n?"":void 0,tabIndex:n?void 0:-1,...l,ref:v,onFocus:(0,m.composeEventHandlers)(l.onFocus,()=>x(!0)),onBlur:(0,m.composeEventHandlers)(l.onBlur,()=>x(!1)),onClick:(0,m.composeEventHandlers)(l.onClick,()=>{"mouse"!==b.current&&k()}),onPointerUp:(0,m.composeEventHandlers)(l.onPointerUp,()=>{"mouse"===b.current&&k()}),onPointerDown:(0,m.composeEventHandlers)(l.onPointerDown,e=>{b.current=e.pointerType}),onPointerMove:(0,m.composeEventHandlers)(l.onPointerMove,e=>{b.current=e.pointerType,n?d.onItemLeave?.():"mouse"===b.current&&e.currentTarget.focus({preventScroll:!0})}),onPointerLeave:(0,m.composeEventHandlers)(l.onPointerLeave,e=>{e.currentTarget===document.activeElement&&d.onItemLeave?.()}),onKeyDown:(0,m.composeEventHandlers)(l.onKeyDown,e=>{(d.searchRef?.current===""||" "!==e.key)&&(H.includes(e.key)&&k()," "===e.key&&e.preventDefault())})})})})});eb.displayName=ex;var ew="SelectItemText",ek=c.forwardRef((e,t)=>{let{__scopeSelect:r,className:a,style:n,...i}=e,l=F(ew,r),s=ea(ew,r),d=ey(ew,r),p=W(ew,r),[m,f]=c.useState(null),g=(0,h.useComposedRefs)(t,e=>f(e),d.onItemTextChange,e=>s.itemTextRefCallback?.(e,d.value,d.disabled)),x=m?.textContent,v=c.useMemo(()=>(0,o.jsx)("option",{value:d.value,disabled:d.disabled,children:x},d.value),[d.disabled,d.value,x]),{onNativeOptionAdd:y,onNativeOptionRemove:b}=p;return(0,P.useLayoutEffect)(()=>(y(v),()=>b(v)),[y,b,v]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(C.Primitive.span,{id:d.textId,...i,ref:g}),d.isSelected&&l.valueNode&&!l.valueNodeHasChildren?u.createPortal(i.children,l.valueNode):null]})});ek.displayName=ew;var ej="SelectItemIndicator",eC=c.forwardRef((e,t)=>{let{__scopeSelect:r,...a}=e;return ey(ej,r).isSelected?(0,o.jsx)(C.Primitive.span,{"aria-hidden":!0,...a,ref:t}):null});eC.displayName=ej;var eS="SelectScrollUpButton",eR=c.forwardRef((e,t)=>{let r=ea(eS,e.__scopeSelect),a=ed(eS,e.__scopeSelect),[n,i]=c.useState(!1),l=(0,h.useComposedRefs)(t,a.onScrollButtonChange);return(0,P.useLayoutEffect)(()=>{if(r.viewport&&r.isPositioned){let e=function(){i(t.scrollTop>0)},t=r.viewport;return e(),t.addEventListener("scroll",e),()=>t.removeEventListener("scroll",e)}},[r.viewport,r.isPositioned]),n?(0,o.jsx)(eP,{...e,ref:l,onAutoScroll:()=>{let{viewport:e,selectedItem:t}=r;e&&t&&(e.scrollTop=e.scrollTop-t.offsetHeight)}}):null});eR.displayName=eS;var eE="SelectScrollDownButton",eN=c.forwardRef((e,t)=>{let r=ea(eE,e.__scopeSelect),a=ed(eE,e.__scopeSelect),[n,i]=c.useState(!1),l=(0,h.useComposedRefs)(t,a.onScrollButtonChange);return(0,P.useLayoutEffect)(()=>{if(r.viewport&&r.isPositioned){let e=function(){let e=t.scrollHeight-t.clientHeight;i(Math.ceil(t.scrollTop)<e)},t=r.viewport;return e(),t.addEventListener("scroll",e),()=>t.removeEventListener("scroll",e)}},[r.viewport,r.isPositioned]),n?(0,o.jsx)(eP,{...e,ref:l,onAutoScroll:()=>{let{viewport:e,selectedItem:t}=r;e&&t&&(e.scrollTop=e.scrollTop+t.offsetHeight)}}):null});eN.displayName=eE;var eP=c.forwardRef((e,t)=>{let{__scopeSelect:r,onAutoScroll:a,...n}=e,i=ea("SelectScrollButton",r),l=c.useRef(null),s=A(r),d=c.useCallback(()=>{null!==l.current&&(window.clearInterval(l.current),l.current=null)},[]);return c.useEffect(()=>()=>d(),[d]),(0,P.useLayoutEffect)(()=>{let e=s().find(e=>e.ref.current===document.activeElement);e?.ref.current?.scrollIntoView({block:"nearest"})},[s]),(0,o.jsx)(C.Primitive.div,{"aria-hidden":!0,...n,ref:t,style:{flexShrink:0,...n.style},onPointerDown:(0,m.composeEventHandlers)(n.onPointerDown,()=>{null===l.current&&(l.current=window.setInterval(a,50))}),onPointerMove:(0,m.composeEventHandlers)(n.onPointerMove,()=>{i.onItemLeave?.(),null===l.current&&(l.current=window.setInterval(a,50))}),onPointerLeave:(0,m.composeEventHandlers)(n.onPointerLeave,()=>{d()})})}),eT=c.forwardRef((e,t)=>{let{__scopeSelect:r,...a}=e;return(0,o.jsx)(C.Primitive.div,{"aria-hidden":!0,...a,ref:t})});eT.displayName="SelectSeparator";var eI="SelectArrow";c.forwardRef((e,t)=>{let{__scopeSelect:r,...a}=e,n=V(r),i=F(eI,r),l=ea(eI,r);return i.open&&"popper"===l.position?(0,o.jsx)(k.Arrow,{...n,...a,ref:t}):null}).displayName=eI;var eD=c.forwardRef(({__scopeSelect:e,value:t,...r},a)=>{let n=c.useRef(null),i=(0,h.useComposedRefs)(a,n),l=T(t);return c.useEffect(()=>{let e=n.current;if(!e)return;let r=Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype,"value").set;if(l!==t&&r){let a=new Event("change",{bubbles:!0});r.call(e,t),e.dispatchEvent(a)}},[l,t]),(0,o.jsx)(C.Primitive.select,{...r,style:{...I.VISUALLY_HIDDEN_STYLES,...r.style},ref:i,defaultValue:t})});function eM(e){return""===e||void 0===e}function eL(e){let t=(0,E.useCallbackRef)(e),r=c.useRef(""),a=c.useRef(0),n=c.useCallback(e=>{let n=r.current+e;t(n),function e(t){r.current=t,window.clearTimeout(a.current),""!==t&&(a.current=window.setTimeout(()=>e(""),1e3))}(n)},[t]),i=c.useCallback(()=>{r.current="",window.clearTimeout(a.current)},[]);return c.useEffect(()=>()=>window.clearTimeout(a.current),[]),[r,n,i]}function eH(e,t,r){var a,n;let i=t.length>1&&Array.from(t).every(e=>e===t[0])?t[0]:t,o=r?e.indexOf(r):-1,l=(a=e,n=Math.max(o,0),a.map((e,t)=>a[(n+t)%a.length]));1===i.length&&(l=l.filter(e=>e!==r));let s=l.find(e=>e.textValue.toLowerCase().startsWith(i.toLowerCase()));return s!==r?s:void 0}eD.displayName="SelectBubbleInput";let ez=(0,n.default)("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);var e_=e.i(31171);e.s(["ChevronDown",()=>e_.default],64659);var e_=e_;let eA=(0,n.default)("chevron-up",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]),e$=c.forwardRef(({className:e,children:t,...r},a)=>(0,o.jsxs)(Y,{ref:a,className:(0,d.cn)("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-colors",e),...r,children:[t,(0,o.jsx)(J,{asChild:!0,children:(0,o.jsx)(e_.default,{className:"h-4 w-4 opacity-50"})})]}));e$.displayName=Y.displayName;let eO=c.forwardRef(({className:e,...t},r)=>(0,o.jsx)(eR,{ref:r,className:(0,d.cn)("flex cursor-default items-center justify-center py-1",e),...t,children:(0,o.jsx)(eA,{className:"h-4 w-4"})}));eO.displayName=eR.displayName;let eB=c.forwardRef(({className:e,...t},r)=>(0,o.jsx)(eN,{ref:r,className:(0,d.cn)("flex cursor-default items-center justify-center py-1",e),...t,children:(0,o.jsx)(e_.default,{className:"h-4 w-4"})}));eB.displayName=eN.displayName;let eV=c.forwardRef(({className:e,children:t,position:r="popper",...a},n)=>(0,o.jsx)(Q,{children:(0,o.jsxs)(et,{ref:n,className:(0,d.cn)("relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2","popper"===r&&"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",e),position:r,...a,children:[(0,o.jsx)(eO,{}),(0,o.jsx)(eu,{className:(0,d.cn)("p-1","popper"===r&&"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),children:t}),(0,o.jsx)(eB,{})]})}));eV.displayName=et.displayName,c.forwardRef(({className:e,...t},r)=>(0,o.jsx)(eg,{ref:r,className:(0,d.cn)("px-2 py-1.5 text-xs font-semibold text-muted-foreground",e),...t})).displayName=eg.displayName;let eU=c.forwardRef(({className:e,children:t,...r},a)=>(0,o.jsxs)(eb,{ref:a,className:(0,d.cn)("relative flex w-full cursor-default select-none items-center rounded-lg py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",e),...r,children:[(0,o.jsx)("span",{className:"absolute right-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,o.jsx)(eC,{children:(0,o.jsx)(ez,{className:"h-4 w-4 text-primary"})})}),(0,o.jsx)(ek,{children:t})]}));eU.displayName=eb.displayName,c.forwardRef(({className:e,...t},r)=>(0,o.jsx)(eT,{ref:r,className:(0,d.cn)("-mx-1 my-1 h-px bg-muted",e),...t})).displayName=eT.displayName,e.s(["Select",0,q,"SelectContent",0,eV,"SelectItem",0,eU,"SelectTrigger",0,e$,"SelectValue",0,Z],62870)}]);