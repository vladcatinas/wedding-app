(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=s(a);fetch(a.href,o)}})();let ze;const yt=new Uint8Array(16);function Et(){if(!ze&&(ze=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!ze))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return ze(yt)}const Y=[];for(let e=0;e<256;++e)Y.push((e+256).toString(16).slice(1));function $t(e,t=0){return Y[e[t+0]]+Y[e[t+1]]+Y[e[t+2]]+Y[e[t+3]]+"-"+Y[e[t+4]]+Y[e[t+5]]+"-"+Y[e[t+6]]+Y[e[t+7]]+"-"+Y[e[t+8]]+Y[e[t+9]]+"-"+Y[e[t+10]]+Y[e[t+11]]+Y[e[t+12]]+Y[e[t+13]]+Y[e[t+14]]+Y[e[t+15]]}const _t=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),st={randomUUID:_t};function It(e,t,s){if(st.randomUUID&&!e)return st.randomUUID();e=e||{};const n=e.random||(e.rng||Et)();return n[6]=n[6]&15|64,n[8]=n[8]&63|128,$t(n)}const he=()=>It(),N=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"),kt=e=>e?e[0].toUpperCase()+e.slice(1):"";function P(e,t=""){const s=document.getElementById("toasts");if(!s)return;const n=document.createElement("div");n.className=`toast ${t}`,n.textContent=e,s.appendChild(n),setTimeout(()=>n.remove(),3500)}function Ye(e){var t;(t=document.getElementById(e))==null||t.classList.add("open")}function qe(e){var t;(t=document.getElementById(e))==null||t.classList.remove("open")}function Rt(e){return e?new Date(e+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"}):""}function St(e){return e?Math.ceil((new Date(e)-new Date)/864e5):null}function wt(e){const t=["Alice Johnson","Bob Smith","Carol Williams","David Brown","Eva Martinez","Frank Davis","Grace Wilson","Henry Taylor","Isabella Anderson","James Thomas","Karen Jackson","Liam White","Mia Harris","Noah Martin","Olivia Thompson","Peter Garcia","Quinn Robinson","Rachel Clark","Samuel Lewis","Tara Walker","Uma Hall","Victor Allen","Wendy Young","Xavier King","Yara Scott","Zach Green","Amy Adams","Brian Baker","Christine Carter","Derek Collins"],s=["confirmed","confirmed","confirmed","pending","declined","maybe"],n=["","vegetarian","vegan","gluten-free","","nut allergy"],a=["bride","groom"],o=t.map((v,E)=>({id:he(),name:v,email:`${v.toLowerCase().replace(" ",".")}${E}@example.com`,phone:`+1-555-${String(1e3+E).slice(-4)}`,side:a[E%2],rsvpStatus:s[E%6],partySize:E%5===0?2:1,dietaryRestrictions:n[E%6],notes:""})),c=["Magnolia","Jasmine","Rose","Lavender","Peony"],l=o.map(v=>v.id),g=c.map((v,E)=>({id:he(),name:`${v} Table`,capacity:8,guests:l.slice(E*5,E*5+5)})),d=new Set(g.flatMap(v=>v.guests)),u=l.filter(v=>!d.has(v));return{id:e,couple:{partner1:"Alex",partner2:"Jordan"},date:"2027-06-15",location:"Paris, France",createdAt:new Date().toISOString().slice(0,10),guests:o,seating:{tables:g,unassigned:u}}}const ot="weddingPlanner_v1",dt=()=>({weddings:[],activeWeddingId:null});let T=dt(),at=null;const xt=new Set;function Lt(){try{const e=localStorage.getItem(ot);e&&(T=JSON.parse(e))}catch{T=dt()}Array.isArray(T.weddings)||(T.weddings=[])}function Se(){clearTimeout(at),at=setTimeout(()=>{try{const e=JSON.stringify(T);e.length>45e5&&console.warn("localStorage nearing limit"),localStorage.setItem(ot,e)}catch(e){console.error("Save failed",e)}xt.forEach(e=>e())},300)}function Ge(){return T}function ae(){return T.weddings.find(e=>e.id===T.activeWeddingId)??null}function Bt(e){T.activeWeddingId=e,Se()}function Pt(e){T.weddings.push(e),T.activeWeddingId=e.id,Se()}function j(e,t){const s=T.weddings.findIndex(n=>n.id===e);s>=0&&(t(T.weddings[s]),Se())}function Ct(e){var t;T.weddings=T.weddings.filter(s=>s.id!==e),T.activeWeddingId===e&&(T.activeWeddingId=((t=T.weddings[0])==null?void 0:t.id)??null),Se()}function At(e){j(e,t=>{t.guests=[],ie(t),t.seating.tables.forEach(s=>{s.guests=[]}),t.seating.unassigned=[]})}const Tt=["Restaurant","Formație","Monoporții","Candy Bar","Mărturii","Video","Foto","MC","DJ","Verighete","Decorațiuni","Invitații","Costum","Rochie"],it={Restaurant:"meniu",Invitații:"invitatie",Monoporții:"monoportie","Candy Bar":"candyBar",Mărturii:"marturii"},lt=[{key:"meniu",label:"Preț meniu / persoană",short:"Meniu"},{key:"invitatie",label:"Preț invitație / persoană",short:"Invitație"},{key:"monoportie",label:"Preț monoporție / persoană",short:"Monoporție"},{key:"candyBar",label:"Preț candy bar / persoană",short:"Candy Bar"},{key:"marturii",label:"Preț mărturii / persoană",short:"Mărturii"}];function Ee(e){var t,s,n,a,o,c,l,g,d;e.budget&&(e.budget.categories||"total"in e.budget)&&(e.budget=null),e.budget||(e.budget={exchangeRate:5,guestCount:null,giftPerPerson:{ron:0,eur:0},perPerson:{},vendors:[]}),(t=e.budget).exchangeRate??(t.exchangeRate=5),typeof e.budget.guestCount>"u"&&(e.budget.guestCount=null),(s=e.budget).giftPerPerson??(s.giftPerPerson={ron:0,eur:0}),(n=e.budget.giftPerPerson).ron??(n.ron=0),(a=e.budget.giftPerPerson).eur??(a.eur=0),(o=e.budget).perPerson??(o.perPerson={});for(const{key:u}of lt)(c=e.budget.perPerson)[u]??(c[u]={ron:0,eur:0}),(l=e.budget.perPerson[u]).ron??(l.ron=0),(g=e.budget.perPerson[u]).eur??(g.eur=0);(d=e.budget).vendors??(d.vendors=[]),e.budget.vendors.length===0&&(e.budget.vendors=Tt.map(u=>({id:he(),label:u,perPersonKey:it[u]??null,avansRon:0,avansEur:0,restRon:0,restEur:0,avansPaid:!0,restPaid:!1,notes:""}))),e.budget.vendors.forEach(u=>{u.id??(u.id=he()),"perPersonKey"in u||(u.perPersonKey=it[u.label]??null),u.avansRon??(u.avansRon=0),u.avansEur??(u.avansEur=0),u.restRon??(u.restRon=0),u.restEur??(u.restEur=0),u.avansPaid??(u.avansPaid=!0),u.restPaid??(u.restPaid=!1),u.notes??(u.notes="")})}function Ze(){return lt}function ie(e){var t,s;e.seating??(e.seating={tables:[],unassigned:[]}),(t=e.seating).tables??(t.tables=[]),(s=e.seating).unassigned??(s.unassigned=[])}function Dt(e){ie(e);const t=new Set(e.seating.tables.flatMap(s=>s.guests));e.seating.unassigned=e.seating.unassigned.filter(s=>!t.has(s)),(e.guests??[]).forEach(s=>{!t.has(s.id)&&!e.seating.unassigned.includes(s.id)&&e.seating.unassigned.push(s.id)})}function Ot(e){T=e,Array.isArray(T.weddings)||(T.weddings=[]),!T.activeWeddingId&&T.weddings.length&&(T.activeWeddingId=T.weddings[0].id),Se()}const Ne={};function Xe(e,t){return(Ne[e]??(Ne[e]=new Set)).add(t),()=>{var s;return(s=Ne[e])==null?void 0:s.delete(t)}}function H(e,t){var s;(s=Ne[e])==null||s.forEach(n=>n(t))}function je(e=null){var o,c;const t=ae();if(!t){P("No active wedding","error");return}const s=!!e;document.getElementById("gm-title").textContent=s?"Edit Guest":"Add Guest";const n=document.getElementById("gm-delete");n.style.display=s?"block":"none",n.onclick=()=>Nt(e),document.getElementById("err-name").textContent="",document.getElementById("err-email").textContent="";const a=document.getElementById("gm-table");if(a.innerHTML='<option value="">— Unassigned —</option>'+(((o=t.seating)==null?void 0:o.tables)??[]).map(l=>`<option value="${l.id}">${N(l.name)}</option>`).join(""),s){const l=(t.guests??[]).find(d=>d.id===e);if(!l)return;document.getElementById("gm-id").value=l.id,document.getElementById("gm-name").value=l.name??"",document.getElementById("gm-email").value=l.email??"",document.getElementById("gm-phone").value=l.phone??"",document.getElementById("gm-side").value=l.side??"bride",document.getElementById("gm-rsvp").value=l.rsvpStatus??"pending",document.getElementById("gm-party").value=l.partySize??1,document.getElementById("gm-dietary").value=l.dietaryRestrictions??"",document.getElementById("gm-attended").value=l.attended??"pending",document.getElementById("gm-gift").value=l.giftAmount??"",document.getElementById("gm-notes").value=l.notes??"";const g=(((c=t.seating)==null?void 0:c.tables)??[]).find(d=>d.guests.includes(l.id));a.value=(g==null?void 0:g.id)??""}else document.getElementById("gm-id").value="",["gm-name","gm-email","gm-phone","gm-dietary","gm-gift","gm-notes"].forEach(l=>{document.getElementById(l).value=""}),document.getElementById("gm-side").value="bride",document.getElementById("gm-rsvp").value="pending",document.getElementById("gm-party").value=1,document.getElementById("gm-attended").value="pending",a.value="";document.getElementById("gm-save").onclick=Mt,Ye("guest-modal"),document.getElementById("gm-name").focus()}function Mt(){const e=ae();if(!e)return;const t=document.getElementById("gm-name").value.trim(),s=document.getElementById("gm-email").value.trim();let n=!0;if(t?document.getElementById("err-name").textContent="":(document.getElementById("err-name").textContent="Name is required",n=!1),s&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)?(document.getElementById("err-email").textContent="Invalid email format",n=!1):document.getElementById("err-email").textContent="",!n)return;const a=document.getElementById("gm-id").value,o=a||he(),c=!a,l=document.getElementById("gm-table").value,g={id:o,name:t,email:s,phone:document.getElementById("gm-phone").value.trim(),side:document.getElementById("gm-side").value,rsvpStatus:document.getElementById("gm-rsvp").value,partySize:Math.max(1,parseInt(document.getElementById("gm-party").value)||1),dietaryRestrictions:document.getElementById("gm-dietary").value.trim(),attended:document.getElementById("gm-attended").value,giftAmount:document.getElementById("gm-gift").value.trim(),notes:document.getElementById("gm-notes").value.trim()};j(e.id,d=>{if(d.guests||(d.guests=[]),c)d.guests.push(g);else{const u=d.guests.findIndex(v=>v.id===o);u>=0&&(d.guests[u]=g)}if(ie(d),d.seating.tables.forEach(u=>{u.guests=u.guests.filter(v=>v!==o)}),d.seating.unassigned=d.seating.unassigned.filter(u=>u!==o),l){const u=d.seating.tables.find(v=>v.id===l);u&&(u.guests.length+g.partySize>u.capacity&&P(`⚠ "${u.name}" is now over capacity`,"warning"),u.guests.push(o))}else d.seating.unassigned.push(o)}),qe("guest-modal"),P(c?"Guest added!":"Guest updated!","success"),H("render")}function Nt(e){if(!e||!confirm("Delete this guest? This cannot be undone."))return;const t=ae();t&&(j(t.id,s=>{s.guests=(s.guests??[]).filter(n=>n.id!==e),ie(s),s.seating.tables.forEach(n=>{n.guests=n.guests.filter(a=>a!==e)}),s.seating.unassigned=s.seating.unassigned.filter(n=>n!==e)}),qe("guest-modal"),P("Guest deleted","success"),H("render"))}var Ft=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function zt(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var ut={exports:{}};/* @license
Papa Parse
v5.5.3
https://github.com/mholt/PapaParse
License: MIT
*/(function(e,t){((s,n)=>{e.exports=n()})(Ft,function s(){var n=typeof self<"u"?self:typeof window<"u"?window:n!==void 0?n:{},a,o=!n.document&&!!n.postMessage,c=n.IS_PAPA_WORKER||!1,l={},g=0,d={};function u(i){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},(function(r){var p=we(r);p.chunkSize=parseInt(p.chunkSize),r.step||r.chunk||(p.chunkSize=null),this._handle=new Z(p),(this._handle.streamer=this)._config=p}).call(this,i),this.parseChunk=function(r,p){var f=parseInt(this._config.skipFirstNLines)||0;if(this.isFirstChunk&&0<f){let I=this._config.newline;I||(m=this._config.quoteChar||'"',I=this._handle.guessLineEndings(r,m)),r=[...r.split(I).slice(f)].join(I)}this.isFirstChunk&&y(this._config.beforeFirstChunk)&&(m=this._config.beforeFirstChunk(r))!==void 0&&(r=m),this.isFirstChunk=!1,this._halted=!1;var f=this._partialLine+r,m=(this._partialLine="",this._handle.parse(f,this._baseIndex,!this._finished));if(!this._handle.paused()&&!this._handle.aborted()){if(r=m.meta.cursor,f=(this._finished||(this._partialLine=f.substring(r-this._baseIndex),this._baseIndex=r),m&&m.data&&(this._rowCount+=m.data.length),this._finished||this._config.preview&&this._rowCount>=this._config.preview),c)n.postMessage({results:m,workerId:d.WORKER_ID,finished:f});else if(y(this._config.chunk)&&!p){if(this._config.chunk(m,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);this._completeResults=m=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(m.data),this._completeResults.errors=this._completeResults.errors.concat(m.errors),this._completeResults.meta=m.meta),this._completed||!f||!y(this._config.complete)||m&&m.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),f||m&&m.meta.paused||this._nextChunk(),m}this._halted=!0},this._sendError=function(r){y(this._config.error)?this._config.error(r):c&&this._config.error&&n.postMessage({workerId:d.WORKER_ID,error:r,finished:!1})}}function v(i){var r;(i=i||{}).chunkSize||(i.chunkSize=d.RemoteChunkSize),u.call(this,i),this._nextChunk=o?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(p){this._input=p,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(r=new XMLHttpRequest,this._config.withCredentials&&(r.withCredentials=this._config.withCredentials),o||(r.onload=ce(this._chunkLoaded,this),r.onerror=ce(this._chunkError,this)),r.open(this._config.downloadRequestBody?"POST":"GET",this._input,!o),this._config.downloadRequestHeaders){var p,f=this._config.downloadRequestHeaders;for(p in f)r.setRequestHeader(p,f[p])}var m;this._config.chunkSize&&(m=this._start+this._config.chunkSize-1,r.setRequestHeader("Range","bytes="+this._start+"-"+m));try{r.send(this._config.downloadRequestBody)}catch(I){this._chunkError(I.message)}o&&r.status===0&&this._chunkError()}},this._chunkLoaded=function(){r.readyState===4&&(r.status<200||400<=r.status?this._chunkError():(this._start+=this._config.chunkSize||r.responseText.length,this._finished=!this._config.chunkSize||this._start>=(p=>(p=p.getResponseHeader("Content-Range"))!==null?parseInt(p.substring(p.lastIndexOf("/")+1)):-1)(r),this.parseChunk(r.responseText)))},this._chunkError=function(p){p=r.statusText||p,this._sendError(new Error(p))}}function E(i){(i=i||{}).chunkSize||(i.chunkSize=d.LocalChunkSize),u.call(this,i);var r,p,f=typeof FileReader<"u";this.stream=function(m){this._input=m,p=m.slice||m.webkitSlice||m.mozSlice,f?((r=new FileReader).onload=ce(this._chunkLoaded,this),r.onerror=ce(this._chunkError,this)):r=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var m=this._input,I=(this._config.chunkSize&&(I=Math.min(this._start+this._config.chunkSize,this._input.size),m=p.call(m,this._start,I)),r.readAsText(m,this._config.encoding));f||this._chunkLoaded({target:{result:I}})},this._chunkLoaded=function(m){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(m.target.result)},this._chunkError=function(){this._sendError(r.error)}}function A(i){var r;u.call(this,i=i||{}),this.stream=function(p){return r=p,this._nextChunk()},this._nextChunk=function(){var p,f;if(!this._finished)return p=this._config.chunkSize,r=p?(f=r.substring(0,p),r.substring(p)):(f=r,""),this._finished=!r,this.parseChunk(f)}}function _(i){u.call(this,i=i||{});var r=[],p=!0,f=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(m){this._input=m,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){f&&r.length===1&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),r.length?this.parseChunk(r.shift()):p=!0},this._streamData=ce(function(m){try{r.push(typeof m=="string"?m:m.toString(this._config.encoding)),p&&(p=!1,this._checkIsFinished(),this.parseChunk(r.shift()))}catch(I){this._streamError(I)}},this),this._streamError=ce(function(m){this._streamCleanUp(),this._sendError(m)},this),this._streamEnd=ce(function(){this._streamCleanUp(),f=!0,this._streamData("")},this),this._streamCleanUp=ce(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function Z(i){var r,p,f,m,I=Math.pow(2,53),q=-I,re=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,oe=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,S=this,F=0,b=0,X=!1,$=!1,w=[],h={data:[],errors:[],meta:{}};function G(x){return i.skipEmptyLines==="greedy"?x.join("").trim()==="":x.length===1&&x[0].length===0}function U(){if(h&&f&&(de("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+d.DefaultDelimiter+"'"),f=!1),i.skipEmptyLines&&(h.data=h.data.filter(function(D){return!G(D)})),Q()){let D=function(V,O){y(i.transformHeader)&&(V=i.transformHeader(V,O)),w.push(V)};var k=D;if(h)if(Array.isArray(h.data[0])){for(var x=0;Q()&&x<h.data.length;x++)h.data[x].forEach(D);h.data.splice(0,1)}else h.data.forEach(D)}function L(D,V){for(var O=i.header?{}:[],C=0;C<D.length;C++){var R=C,ee=D[C],ee=((B,M)=>(K=>(i.dynamicTypingFunction&&i.dynamicTyping[K]===void 0&&(i.dynamicTyping[K]=i.dynamicTypingFunction(K)),(i.dynamicTyping[K]||i.dynamicTyping)===!0))(B)?M==="true"||M==="TRUE"||M!=="false"&&M!=="FALSE"&&((K=>{if(re.test(K)&&(K=parseFloat(K),q<K&&K<I))return 1})(M)?parseFloat(M):oe.test(M)?new Date(M):M===""?null:M):M)(R=i.header?C>=w.length?"__parsed_extra":w[C]:R,ee=i.transform?i.transform(ee,R):ee);R==="__parsed_extra"?(O[R]=O[R]||[],O[R].push(ee)):O[R]=ee}return i.header&&(C>w.length?de("FieldMismatch","TooManyFields","Too many fields: expected "+w.length+" fields but parsed "+C,b+V):C<w.length&&de("FieldMismatch","TooFewFields","Too few fields: expected "+w.length+" fields but parsed "+C,b+V)),O}var z;h&&(i.header||i.dynamicTyping||i.transform)&&(z=1,!h.data.length||Array.isArray(h.data[0])?(h.data=h.data.map(L),z=h.data.length):h.data=L(h.data,0),i.header&&h.meta&&(h.meta.fields=w),b+=z)}function Q(){return i.header&&w.length===0}function de(x,L,z,k){x={type:x,code:L,message:z},k!==void 0&&(x.row=k),h.errors.push(x)}y(i.step)&&(m=i.step,i.step=function(x){h=x,Q()?U():(U(),h.data.length!==0&&(F+=x.data.length,i.preview&&F>i.preview?p.abort():(h.data=h.data[0],m(h,S))))}),this.parse=function(x,L,z){var k=i.quoteChar||'"',k=(i.newline||(i.newline=this.guessLineEndings(x,k)),f=!1,i.delimiter?y(i.delimiter)&&(i.delimiter=i.delimiter(x),h.meta.delimiter=i.delimiter):((k=((D,V,O,C,R)=>{var ee,B,M,K;R=R||[",","	","|",";",d.RECORD_SEP,d.UNIT_SEP];for(var xe=0;xe<R.length;xe++){for(var ge,De=R[xe],te=0,me=0,J=0,ne=(M=void 0,new ue({comments:C,delimiter:De,newline:V,preview:10}).parse(D)),ve=0;ve<ne.data.length;ve++)O&&G(ne.data[ve])?J++:(ge=ne.data[ve].length,me+=ge,M===void 0?M=ge:0<ge&&(te+=Math.abs(ge-M),M=ge));0<ne.data.length&&(me/=ne.data.length-J),(B===void 0||te<=B)&&(K===void 0||K<me)&&1.99<me&&(B=te,ee=De,K=me)}return{successful:!!(i.delimiter=ee),bestDelimiter:ee}})(x,i.newline,i.skipEmptyLines,i.comments,i.delimitersToGuess)).successful?i.delimiter=k.bestDelimiter:(f=!0,i.delimiter=d.DefaultDelimiter),h.meta.delimiter=i.delimiter),we(i));return i.preview&&i.header&&k.preview++,r=x,p=new ue(k),h=p.parse(r,L,z),U(),X?{meta:{paused:!0}}:h||{meta:{paused:!1}}},this.paused=function(){return X},this.pause=function(){X=!0,p.abort(),r=y(i.chunk)?"":r.substring(p.getCharIndex())},this.resume=function(){S.streamer._halted?(X=!1,S.streamer.parseChunk(r,!0)):setTimeout(S.resume,3)},this.aborted=function(){return $},this.abort=function(){$=!0,p.abort(),h.meta.aborted=!0,y(i.complete)&&i.complete(h),r=""},this.guessLineEndings=function(D,k){D=D.substring(0,1048576);var k=new RegExp(W(k)+"([^]*?)"+W(k),"gm"),z=(D=D.replace(k,"")).split("\r"),k=D.split(`
`),D=1<k.length&&k[0].length<z[0].length;if(z.length===1||D)return`
`;for(var V=0,O=0;O<z.length;O++)z[O][0]===`
`&&V++;return V>=z.length/2?`\r
`:"\r"}}function W(i){return i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function ue(i){var r=(i=i||{}).delimiter,p=i.newline,f=i.comments,m=i.step,I=i.preview,q=i.fastMode,re=null,oe=!1,S=i.quoteChar==null?'"':i.quoteChar,F=S;if(i.escapeChar!==void 0&&(F=i.escapeChar),(typeof r!="string"||-1<d.BAD_DELIMITERS.indexOf(r))&&(r=","),f===r)throw new Error("Comment character same as delimiter");f===!0?f="#":(typeof f!="string"||-1<d.BAD_DELIMITERS.indexOf(f))&&(f=!1),p!==`
`&&p!=="\r"&&p!==`\r
`&&(p=`
`);var b=0,X=!1;this.parse=function($,w,h){if(typeof $!="string")throw new Error("Input must be a string");var G=$.length,U=r.length,Q=p.length,de=f.length,x=y(m),L=[],z=[],k=[],D=b=0;if(!$)return te();if(q||q!==!1&&$.indexOf(S)===-1){for(var V=$.split(p),O=0;O<V.length;O++){if(k=V[O],b+=k.length,O!==V.length-1)b+=p.length;else if(h)return te();if(!f||k.substring(0,de)!==f){if(x){if(L=[],K(k.split(r)),me(),X)return te()}else K(k.split(r));if(I&&I<=O)return L=L.slice(0,I),te(!0)}}return te()}for(var C=$.indexOf(r,b),R=$.indexOf(p,b),ee=new RegExp(W(F)+W(S),"g"),B=$.indexOf(S,b);;)if($[b]===S)for(B=b,b++;;){if((B=$.indexOf(S,B+1))===-1)return h||z.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:L.length,index:b}),ge();if(B===G-1)return ge($.substring(b,B).replace(ee,S));if(S===F&&$[B+1]===F)B++;else if(S===F||B===0||$[B-1]!==F){C!==-1&&C<B+1&&(C=$.indexOf(r,B+1));var M=xe((R=R!==-1&&R<B+1?$.indexOf(p,B+1):R)===-1?C:Math.min(C,R));if($.substr(B+1+M,U)===r){k.push($.substring(b,B).replace(ee,S)),$[b=B+1+M+U]!==S&&(B=$.indexOf(S,b)),C=$.indexOf(r,b),R=$.indexOf(p,b);break}if(M=xe(R),$.substring(B+1+M,B+1+M+Q)===p){if(k.push($.substring(b,B).replace(ee,S)),De(B+1+M+Q),C=$.indexOf(r,b),B=$.indexOf(S,b),x&&(me(),X))return te();if(I&&L.length>=I)return te(!0);break}z.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:L.length,index:b}),B++}}else if(f&&k.length===0&&$.substring(b,b+de)===f){if(R===-1)return te();b=R+Q,R=$.indexOf(p,b),C=$.indexOf(r,b)}else if(C!==-1&&(C<R||R===-1))k.push($.substring(b,C)),b=C+U,C=$.indexOf(r,b);else{if(R===-1)break;if(k.push($.substring(b,R)),De(R+Q),x&&(me(),X))return te();if(I&&L.length>=I)return te(!0)}return ge();function K(J){L.push(J),D=b}function xe(J){var ne=0;return ne=J!==-1&&(J=$.substring(B+1,J))&&J.trim()===""?J.length:ne}function ge(J){return h||(J===void 0&&(J=$.substring(b)),k.push(J),b=G,K(k),x&&me()),te()}function De(J){b=J,K(k),k=[],R=$.indexOf(p,b)}function te(J){if(i.header&&!w&&L.length&&!oe){var ne=L[0],ve=Object.create(null),He=new Set(ne);let tt=!1;for(let Le=0;Le<ne.length;Le++){let fe=ne[Le];if(ve[fe=y(i.transformHeader)?i.transformHeader(fe,Le):fe]){let Oe,nt=ve[fe];for(;Oe=fe+"_"+nt,nt++,He.has(Oe););He.add(Oe),ne[Le]=Oe,ve[fe]++,tt=!0,(re=re===null?{}:re)[Oe]=fe}else ve[fe]=1,ne[Le]=fe;He.add(fe)}tt&&console.warn("Duplicate headers found and renamed."),oe=!0}return{data:L,errors:z,meta:{delimiter:r,linebreak:p,aborted:X,truncated:!!J,cursor:D+(w||0),renamedHeaders:re}}}function me(){m(te()),L=[],z=[]}},this.abort=function(){X=!0},this.getCharIndex=function(){return b}}function Fe(i){var r=i.data,p=l[r.workerId],f=!1;if(r.error)p.userError(r.error,r.file);else if(r.results&&r.results.data){var m={abort:function(){f=!0,Ae(r.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:Te,resume:Te};if(y(p.userStep)){for(var I=0;I<r.results.data.length&&(p.userStep({data:r.results.data[I],errors:r.results.errors,meta:r.results.meta},m),!f);I++);delete r.results}else y(p.userChunk)&&(p.userChunk(r.results,m,r.file),delete r.results)}r.finished&&!f&&Ae(r.workerId,r.results)}function Ae(i,r){var p=l[i];y(p.userComplete)&&p.userComplete(r),p.terminate(),delete l[i]}function Te(){throw new Error("Not implemented.")}function we(i){if(typeof i!="object"||i===null)return i;var r,p=Array.isArray(i)?[]:{};for(r in i)p[r]=we(i[r]);return p}function ce(i,r){return function(){i.apply(r,arguments)}}function y(i){return typeof i=="function"}return d.parse=function(i,r){var p=(r=r||{}).dynamicTyping||!1;if(y(p)&&(r.dynamicTypingFunction=p,p={}),r.dynamicTyping=p,r.transform=!!y(r.transform)&&r.transform,!r.worker||!d.WORKERS_SUPPORTED)return p=null,d.NODE_STREAM_INPUT,typeof i=="string"?(i=(f=>f.charCodeAt(0)!==65279?f:f.slice(1))(i),p=new(r.download?v:A)(r)):i.readable===!0&&y(i.read)&&y(i.on)?p=new _(r):(n.File&&i instanceof File||i instanceof Object)&&(p=new E(r)),p.stream(i);(p=(()=>{var f;return!!d.WORKERS_SUPPORTED&&(f=(()=>{var m=n.URL||n.webkitURL||null,I=s.toString();return d.BLOB_URL||(d.BLOB_URL=m.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",I,")();"],{type:"text/javascript"})))})(),(f=new n.Worker(f)).onmessage=Fe,f.id=g++,l[f.id]=f)})()).userStep=r.step,p.userChunk=r.chunk,p.userComplete=r.complete,p.userError=r.error,r.step=y(r.step),r.chunk=y(r.chunk),r.complete=y(r.complete),r.error=y(r.error),delete r.worker,p.postMessage({input:i,config:r,workerId:p.id})},d.unparse=function(i,r){var p=!1,f=!0,m=",",I=`\r
`,q='"',re=q+q,oe=!1,S=null,F=!1,b=((()=>{if(typeof r=="object"){if(typeof r.delimiter!="string"||d.BAD_DELIMITERS.filter(function(w){return r.delimiter.indexOf(w)!==-1}).length||(m=r.delimiter),typeof r.quotes!="boolean"&&typeof r.quotes!="function"&&!Array.isArray(r.quotes)||(p=r.quotes),typeof r.skipEmptyLines!="boolean"&&typeof r.skipEmptyLines!="string"||(oe=r.skipEmptyLines),typeof r.newline=="string"&&(I=r.newline),typeof r.quoteChar=="string"&&(q=r.quoteChar),typeof r.header=="boolean"&&(f=r.header),Array.isArray(r.columns)){if(r.columns.length===0)throw new Error("Option columns is empty");S=r.columns}r.escapeChar!==void 0&&(re=r.escapeChar+q),r.escapeFormulae instanceof RegExp?F=r.escapeFormulae:typeof r.escapeFormulae=="boolean"&&r.escapeFormulae&&(F=/^[=+\-@\t\r].*$/)}})(),new RegExp(W(q),"g"));if(typeof i=="string"&&(i=JSON.parse(i)),Array.isArray(i)){if(!i.length||Array.isArray(i[0]))return X(null,i,oe);if(typeof i[0]=="object")return X(S||Object.keys(i[0]),i,oe)}else if(typeof i=="object")return typeof i.data=="string"&&(i.data=JSON.parse(i.data)),Array.isArray(i.data)&&(i.fields||(i.fields=i.meta&&i.meta.fields||S),i.fields||(i.fields=Array.isArray(i.data[0])?i.fields:typeof i.data[0]=="object"?Object.keys(i.data[0]):[]),Array.isArray(i.data[0])||typeof i.data[0]=="object"||(i.data=[i.data])),X(i.fields||[],i.data||[],oe);throw new Error("Unable to serialize unrecognized input");function X(w,h,G){var U="",Q=(typeof w=="string"&&(w=JSON.parse(w)),typeof h=="string"&&(h=JSON.parse(h)),Array.isArray(w)&&0<w.length),de=!Array.isArray(h[0]);if(Q&&f){for(var x=0;x<w.length;x++)0<x&&(U+=m),U+=$(w[x],x);0<h.length&&(U+=I)}for(var L=0;L<h.length;L++){var z=(Q?w:h[L]).length,k=!1,D=Q?Object.keys(h[L]).length===0:h[L].length===0;if(G&&!Q&&(k=G==="greedy"?h[L].join("").trim()==="":h[L].length===1&&h[L][0].length===0),G==="greedy"&&Q){for(var V=[],O=0;O<z;O++){var C=de?w[O]:O;V.push(h[L][C])}k=V.join("").trim()===""}if(!k){for(var R=0;R<z;R++){0<R&&!D&&(U+=m);var ee=Q&&de?w[R]:R;U+=$(h[L][ee],R)}L<h.length-1&&(!G||0<z&&!D)&&(U+=I)}}return U}function $(w,h){var G,U;return w==null?"":w.constructor===Date?JSON.stringify(w).slice(1,25):(U=!1,F&&typeof w=="string"&&F.test(w)&&(w="'"+w,U=!0),G=w.toString().replace(b,re),(U=U||p===!0||typeof p=="function"&&p(w,h)||Array.isArray(p)&&p[h]||((Q,de)=>{for(var x=0;x<de.length;x++)if(-1<Q.indexOf(de[x]))return!0;return!1})(G,d.BAD_DELIMITERS)||-1<G.indexOf(m)||G.charAt(0)===" "||G.charAt(G.length-1)===" ")?q+G+q:G)}},d.RECORD_SEP="",d.UNIT_SEP="",d.BYTE_ORDER_MARK="\uFEFF",d.BAD_DELIMITERS=["\r",`
`,'"',d.BYTE_ORDER_MARK],d.WORKERS_SUPPORTED=!o&&!!n.Worker,d.NODE_STREAM_INPUT=1,d.LocalChunkSize=10485760,d.RemoteChunkSize=5242880,d.DefaultDelimiter=",",d.Parser=ue,d.ParserHandle=Z,d.NetworkStreamer=v,d.FileStreamer=E,d.StringStreamer=A,d.ReadableStreamStreamer=_,n.jQuery&&((a=n.jQuery).fn.parse=function(i){var r=i.config||{},p=[];return this.each(function(I){if(!(a(this).prop("tagName").toUpperCase()==="INPUT"&&a(this).attr("type").toLowerCase()==="file"&&n.FileReader)||!this.files||this.files.length===0)return!0;for(var q=0;q<this.files.length;q++)p.push({file:this.files[q],inputElem:this,instanceConfig:a.extend({},r)})}),f(),this;function f(){if(p.length===0)y(i.complete)&&i.complete();else{var I,q,re,oe,S=p[0];if(y(i.before)){var F=i.before(S.file,S.inputElem);if(typeof F=="object"){if(F.action==="abort")return I="AbortError",q=S.file,re=S.inputElem,oe=F.reason,void(y(i.error)&&i.error({name:I},q,re,oe));if(F.action==="skip")return void m();typeof F.config=="object"&&(S.instanceConfig=a.extend(S.instanceConfig,F.config))}else if(F==="skip")return void m()}var b=S.instanceConfig.complete;S.instanceConfig.complete=function(X){y(b)&&b(X,S.file,S.inputElem),m()},d.parse(S.file,S.instanceConfig)}}function m(){p.splice(0,1),f()}}),c&&(n.onmessage=function(i){i=i.data,d.WORKER_ID===void 0&&i&&(d.WORKER_ID=i.workerId),typeof i.input=="string"?n.postMessage({workerId:d.WORKER_ID,results:d.parse(i.input,i.config),finished:!0}):(n.File&&i.input instanceof File||i.input instanceof Object)&&(i=d.parse(i.input,i.config))&&n.postMessage({workerId:d.WORKER_ID,results:i,finished:!0})}),(v.prototype=Object.create(u.prototype)).constructor=v,(E.prototype=Object.create(u.prototype)).constructor=E,(A.prototype=Object.create(A.prototype)).constructor=A,(_.prototype=Object.create(u.prototype)).constructor=_,d})})(ut);var jt=ut.exports;const Ut=zt(jt),ct=[{key:"name",label:"Nume",required:!0},{key:"side",label:"Side (bride / groom / common)"},{key:"rsvpStatus",label:"RSVP Status"},{key:"dietaryRestrictions",label:"Dieta"},{key:"attended",label:"Am fost la nuntă?"},{key:"giftAmount",label:"Sumă cadou"},{key:"notes",label:"Notes"}];let ye=[],Ce=[],_e={},be=1;const Wt=`Nume,Side,RSVP Status,Dieta,Am fost la nuntă?,Sumă cadou,Notes
`,qt=`Maria Popescu,bride,confirmed,vegetarian,yes,500 RON,Alergie la nuci
Andrei Ionescu,groom,pending,,pending,,
Familia Georgescu,common,confirmed,gluten-free,yes,800 RON,Masa lângă fereastră
`;function pt(){Gt(),Ue(1),Ye("import-modal")}function Gt(){ye=[],Ce=[],_e={},be=1,document.getElementById("import-step-1").style.display="",document.getElementById("import-step-2").style.display="none",document.getElementById("import-step-3").style.display="none";const e=document.getElementById("csv-file-input");e&&(e.value=""),gt()}function Ue(e){be=e,[1,2,3].forEach(t=>{const s=document.getElementById(`import-step-${t}`);s&&(s.style.display=t===e?"":"none")}),gt()}function gt(){const e=document.getElementById("btn-import-back"),t=document.getElementById("btn-import-next");!e||!t||(e.style.display=be>1?"inline-flex":"none",t.textContent=be===3?"✓ Import Guests":"Next →")}function Kt(){var t,s,n,a;(t=document.getElementById("csv-file-input"))==null||t.addEventListener("change",o=>{var l;const c=(l=o.target.files)==null?void 0:l[0];c&&rt(c)});const e=document.getElementById("csv-drop-zone");e&&(e.addEventListener("dragover",o=>{o.preventDefault(),e.classList.add("drag-active")}),e.addEventListener("dragleave",()=>e.classList.remove("drag-active")),e.addEventListener("drop",o=>{var l;o.preventDefault(),e.classList.remove("drag-active");const c=(l=o.dataTransfer.files)==null?void 0:l[0];c&&rt(c)})),(s=document.getElementById("btn-download-template"))==null||s.addEventListener("click",tn),(n=document.getElementById("btn-import-back"))==null||n.addEventListener("click",()=>{be>1&&Ue(be-1)}),(a=document.getElementById("btn-import-next"))==null||a.addEventListener("click",()=>{if(be!==1)if(be===2){if(Qt(),!Yt())return;Zt(),Ue(3)}else be===3&&Xt()})}function rt(e){const t=["text/csv","text/tab-separated-values","application/vnd.ms-excel",""],s=e.name.split(".").pop().toLowerCase();if(!["csv","tsv","txt"].includes(s)&&!t.includes(e.type)){P("Please upload a .csv or .tsv file","error");return}Ut.parse(e,{header:!0,skipEmptyLines:!0,transformHeader:n=>n.trim(),complete:n=>{if(n.errors.length&&n.data.length===0){P("Could not parse file: "+n.errors[0].message,"error");return}if(ye=n.data,Ce=n.meta.fields??[],ye.length===0){P("The file appears to be empty","error");return}P(`Parsed ${ye.length} rows`,"success"),Ht(),Ue(2)},error:n=>P("Parse error: "+n.message,"error")})}function Ht(){const e=document.getElementById("mapping-grid");if(!e)return;const t=Vt(Ce);e.innerHTML=ct.map(s=>{const n=t[s.key]??"";return`
      <div class="mapping-row">
        <label>${s.label}${s.required?" *":""}</label>
        <select data-field="${s.key}">
          <option value="">— Skip —</option>
          ${Ce.map(a=>`<option value="${N(a)}" ${a===n?"selected":""}>${N(a)}</option>`).join("")}
        </select>
      </div>`}).join(""),Jt()}function Vt(e){const t={name:["nume","name","full name","guest name","guest","nume complet","invitat"],side:["side","guest side","party side","parte","tabara"],rsvpStatus:["rsvp","rsvp status","status","response","raspuns"],dietaryRestrictions:["dieta","dietary","dietary restrictions","diet","food restrictions","restrictii alimentare"],attended:["am fost la nuntă?","am fost la nunta?","am fost","attended","came","a venit","prezent","attendance"],giftAmount:["sumă cadou","suma cadou","cadou","gift","gift amount","gift value","sumă","suma"],notes:["notes","note","notițe","notite","observatii","observații","comments","special requests"]},s={},n=e.map(a=>a.toLowerCase());return Object.entries(t).forEach(([a,o])=>{for(const c of o){const l=n.indexOf(c);if(l>=0){s[a]=e[l];break}}}),s}function Jt(){const e=document.getElementById("preview-table");if(!e)return;const t=ye.slice(0,5);e.querySelector("thead").innerHTML=`<tr>${Ce.map(n=>`<th>${N(n)}</th>`).join("")}</tr>`,e.querySelector("tbody").innerHTML=t.map(n=>`<tr>${Ce.map(a=>`<td>${N(n[a]??"")}</td>`).join("")}</tr>`).join("");const s=document.getElementById("preview-count");s&&(s.textContent=`(first 5 of ${ye.length} rows)`)}function Qt(){_e={},document.querySelectorAll("#mapping-grid [data-field]").forEach(e=>{e.value&&(_e[e.dataset.field]=e.value)})}function Yt(){return _e.name?!0:(P('"Name" column must be mapped',"error"),!1)}function Zt(){const e=document.getElementById("import-summary");if(!e)return;const t=Object.keys(_e).length,s=ye.length,n=ye.filter(o=>{var c;return(c=o[_e.name])==null?void 0:c.trim()}).length,a=s-n;e.innerHTML=`
    <div class="summary-row">
      <span>Total rows in file</span>
      <span class="summary-val">${s}</span>
    </div>
    <div class="summary-row">
      <span>Rows with a name (will import)</span>
      <span class="summary-val">${n}</span>
    </div>
    ${a?`<div class="summary-row" style="color:var(--yellow)">
      <span>Rows skipped (empty name)</span>
      <span class="summary-val">${a}</span>
    </div>`:""}
    <div class="summary-row">
      <span>Columns mapped</span>
      <span class="summary-val">${t} / ${ct.length}</span>
    </div>`}function Xt(){var c,l;const e=ae();if(!e){P("No active wedding selected","error");return}const t=((c=document.getElementById("import-mode"))==null?void 0:c.value)??"merge",s=_e.name,n=[];let a=0;for(const g of ye){const d=(l=g[s])==null?void 0:l.trim();if(!d){a++;continue}n.push(en(g,d))}if(n.length===0){P("No valid guests found in file","error");return}j(e.id,g=>{if(g.guests||(g.guests=[]),ie(g),t==="replace"){const u=new Set(g.guests.map(v=>v.id));g.seating.tables.forEach(v=>{v.guests=v.guests.filter(E=>!u.has(E))}),g.seating.unassigned=g.seating.unassigned.filter(v=>!u.has(v)),g.guests=n}else if(t==="merge"){const u=new Set(g.guests.map(A=>A.name.toLowerCase())),v=n.filter(A=>!u.has(A.name.toLowerCase()));g.guests.push(...v);const E=n.length-v.length;E&&P(`Skipped ${E} duplicate name(s)`,"warning")}else g.guests.push(...n);const d=new Set(g.seating.tables.flatMap(u=>u.guests));g.guests.forEach(u=>{!d.has(u.id)&&!g.seating.unassigned.includes(u.id)&&g.seating.unassigned.push(u.id)})}),qe("import-modal");const o=`Imported ${n.length} guests${a?` (${a} skipped)`:""}!`;P(o,"success"),H("render")}function en(e,t){const s=d=>{const u=_e[d];return u?(e[u]??"").toString().trim():""},n=s("side").toLowerCase(),a=s("rsvpStatus").toLowerCase(),o=s("attended").toLowerCase(),c=["common","bride","groom"],l=["confirmed","declined","pending","maybe"];let g="pending";return/^(yes|y|da|true|1|came|prezent)/.test(o)?g="yes":/^(no|n|nu|false|0|absent|missed)/.test(o)&&(g="no"),{id:he(),name:t,side:c.find(d=>n.includes(d))??"common",rsvpStatus:l.find(d=>a.includes(d))??"pending",partySize:1,dietaryRestrictions:s("dietaryRestrictions"),attended:g,giftAmount:s("giftAmount"),notes:s("notes")}}function tn(){const e=Wt+qt,t=new Blob(["\uFEFF"+e],{type:"text/csv;charset=utf-8"}),s=document.createElement("a");s.href=URL.createObjectURL(t),s.download="wedding-guest-template.csv",s.click(),URL.revokeObjectURL(s.href),P("Template downloaded!","success")}function nn(e){var ue,Fe,Ae,Te,we,ce;const t=e.guests??[],s=t.filter(y=>y.rsvpStatus==="confirmed").length,n=t.filter(y=>y.rsvpStatus==="declined").length,a=t.filter(y=>y.rsvpStatus==="pending").length,o=t.filter(y=>y.rsvpStatus==="maybe").length,c=t.length,l=((ue=e.seating)==null?void 0:ue.tables)??[],g=t.filter(y=>l.some(i=>i.guests.includes(y.id))).length,d=St(e.date),u=d===null?"":d<=30?"red":d<=90?"yellow":"green",v=c?Math.round(s/c*100):0,E=c?Math.round(g/c*100):0;Ee(e);let A=0,_=0;for(const y of e.budget.vendors||[])A+=(y.avansRon||0)+(y.restRon||0),y.avansPaid&&(_+=y.avansRon||0),y.restPaid&&(_+=y.restRon||0);const Z=Math.max(0,A-_),W=A?Math.min(100,Math.round(_/A*100)):0;document.getElementById("content").innerHTML=`
    <div class="countdown ${u}">
      <div class="days">${d!==null?d:"—"}</div>
      <div class="sub">days until ${N(e.couple.partner1)} &amp; ${N(e.couple.partner2)}'s wedding</div>
      <div class="meta">${Rt(e.date)}${e.location?" · "+N(e.location):""}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card"><div class="lbl">Total Guests</div><div class="val">${c}</div></div>
      <div class="stat-card"><div class="lbl">Confirmed</div><div class="val c-confirmed">${s}</div></div>
      <div class="stat-card"><div class="lbl">Declined</div><div class="val c-declined">${n}</div></div>
      <div class="stat-card"><div class="lbl">Pending</div><div class="val c-pending">${a}</div></div>
      <div class="stat-card"><div class="lbl">Maybe</div><div class="val c-maybe">${o}</div></div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="prog-lbl"><span>RSVP Progress</span><span>${s} / ${c} confirmed (${v}%)</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${v}%"></div></div>
    </div>

    <div class="card" style="margin-bottom:14px">
      <div class="prog-lbl"><span>Seating Progress</span><span>${g} / ${c} assigned (${E}%)</span></div>
      <div class="prog-bar"><div class="prog-fill" style="width:${E}%;background:var(--primary)"></div></div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="prog-lbl">
        <span>Buget — Plătit / Total</span>
        <span>${Ve(_)} / ${Ve(A)} ${A?`(${W}%)`:""}</span>
      </div>
      <div class="prog-bar"><div class="prog-fill" style="width:${W}%;background:var(--gold)"></div></div>
      ${Z>0?`<div style="font-size:12px;color:var(--muted);margin-top:6px">De plătit: <strong>${Ve(Z)}</strong></div>`:""}
    </div>

    <div class="card">
      <strong style="display:block;margin-bottom:12px">Quick Actions</strong>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-primary"   id="dash-add-guest">+ Add Guest</button>
        <button class="btn btn-secondary" id="dash-guests">View Guests</button>
        <button class="btn btn-secondary" id="dash-seating">Manage Seating</button>
        <button class="btn btn-secondary" id="dash-budget">💰 Bugetul Nunții</button>
        <button class="btn btn-sage"      id="dash-import">⬆ Import Guest List</button>
      </div>
    </div>`,(Fe=document.getElementById("dash-add-guest"))==null||Fe.addEventListener("click",()=>je()),(Ae=document.getElementById("dash-guests"))==null||Ae.addEventListener("click",()=>H("navigate","guests")),(Te=document.getElementById("dash-seating"))==null||Te.addEventListener("click",()=>H("navigate","seating")),(we=document.getElementById("dash-budget"))==null||we.addEventListener("click",()=>H("navigate","budget")),(ce=document.getElementById("dash-import"))==null||ce.addEventListener("click",()=>pt())}function Ve(e){return`${(Number(e)||0).toLocaleString("ro-RO",{maximumFractionDigits:0})} lei`}const Je=25;let Qe="",ke="",Be="",le=1;function Pe(e){var o,c,l,g,d,u,v,E,A;const t=e.guests??[],s=t.filter(_=>{const Z=Qe.toLowerCase();return(!Z||_.name.toLowerCase().includes(Z)||(_.email??"").toLowerCase().includes(Z)||(_.phone??"").includes(Z))&&(!ke||_.rsvpStatus===ke)&&(!Be||_.side===Be)}),n=Math.max(1,Math.ceil(s.length/Je));le>n&&(le=1);const a=s.slice((le-1)*Je,le*Je);document.getElementById("content").innerHTML=`
    <div class="section-hdr">
      <span class="section-title">
        Guest List <span class="count">(${t.length})</span>
      </span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-sage btn-sm" id="btn-import-guests">⬆ Import CSV</button>
        <button class="btn btn-primary" id="btn-add-guest-list">+ Add Guest</button>
        ${t.length?'<button class="btn btn-danger btn-sm" id="btn-delete-all-guests">🗑 Delete All Guests</button>':""}
      </div>
    </div>

    <div class="toolbar">
      <input class="search-input" type="search" placeholder="Search by name, email, phone…"
             value="${N(Qe)}" id="guest-search" />
      <select class="filter-sel" id="guest-rsvp-filter">
        <option value="">All RSVP</option>
        <option value="confirmed" ${ke==="confirmed"?"selected":""}>Confirmed</option>
        <option value="declined"  ${ke==="declined"?"selected":""}>Declined</option>
        <option value="pending"   ${ke==="pending"?"selected":""}>Pending</option>
        <option value="maybe"     ${ke==="maybe"?"selected":""}>Maybe</option>
      </select>
      <select class="filter-sel" id="guest-side-filter">
        <option value="">All Sides</option>
        <option value="bride"  ${Be==="bride"?"selected":""}>Bride's</option>
        <option value="groom"  ${Be==="groom"?"selected":""}>Groom's</option>
        <option value="common" ${Be==="common"?"selected":""}>Common</option>
      </select>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Side</th><th>RSVP</th>
            <th>Party</th><th>Dietary</th><th>Table</th>
            <th>Came?</th><th>Gift</th><th></th>
          </tr>
        </thead>
        <tbody>
          ${a.length?a.map(_=>rn(_,e)).join(""):'<tr><td colspan="9" style="text-align:center;padding:32px;color:var(--muted)">No guests found</td></tr>'}
        </tbody>
      </table>
    </div>

    ${n>1?`
      <div class="pagination">
        <button class="pg-btn" id="pg-prev" ${le<=1?"disabled":""}>← Prev</button>
        <span class="pg-info">Page ${le} of ${n} · ${s.length} guests</span>
        <button class="pg-btn" id="pg-next" ${le>=n?"disabled":""}>Next →</button>
      </div>`:""}`,(o=document.getElementById("guest-search"))==null||o.addEventListener("input",_=>{Qe=_.target.value,le=1,Pe(e)}),(c=document.getElementById("guest-rsvp-filter"))==null||c.addEventListener("change",_=>{ke=_.target.value,le=1,Pe(e)}),(l=document.getElementById("guest-side-filter"))==null||l.addEventListener("change",_=>{Be=_.target.value,le=1,Pe(e)}),(g=document.getElementById("pg-prev"))==null||g.addEventListener("click",()=>{le--,Pe(e)}),(d=document.getElementById("pg-next"))==null||d.addEventListener("click",()=>{le++,Pe(e)}),(u=document.getElementById("btn-add-guest-list"))==null||u.addEventListener("click",()=>je()),(v=document.getElementById("btn-import-guests"))==null||v.addEventListener("click",()=>pt()),(E=document.getElementById("btn-delete-all-guests"))==null||E.addEventListener("click",()=>{const _=t.length;confirm(`⚠ Delete ALL ${_} guests from this wedding?

This will also clear seating assignments. Cannot be undone.`)&&confirm("Are you absolutely sure? Type-OK by clicking OK once more.")&&(At(e.id),P(`Deleted ${_} guests`,"success"),H("render"))}),(A=document.querySelector("tbody"))==null||A.addEventListener("click",_=>{const Z=_.target.closest("[data-edit-guest]");Z&&je(Z.dataset.editGuest)})}function sn(e){return e==="groom"?"Groom's":e==="common"?"Common":"Bride's"}function an(e){return e==="yes"?'<span class="badge b-confirmed">✓ Yes</span>':e==="no"?'<span class="badge b-declined">✗ No</span>':'<span style="color:var(--muted);font-size:12px">—</span>'}function rn(e,t){var n;const s=(((n=t.seating)==null?void 0:n.tables)??[]).find(a=>a.guests.includes(e.id));return`
    <tr>
      <td>
        <strong>${N(e.name)}</strong>
        ${e.email?`<br><span style="font-size:11px;color:var(--muted)">${N(e.email)}</span>`:""}
      </td>
      <td><span class="badge b-${e.side??"bride"}">${sn(e.side)}</span></td>
      <td><span class="badge b-${e.rsvpStatus??"pending"}">${kt(e.rsvpStatus??"pending")}</span></td>
      <td style="text-align:center">${e.partySize??1}</td>
      <td style="font-size:12px;color:var(--muted)">${N(e.dietaryRestrictions)||"—"}</td>
      <td style="font-size:13px">${s?N(s.name):'<span style="color:var(--muted)">Unassigned</span>'}</td>
      <td>${an(e.attended)}</td>
      <td style="font-size:13px;font-weight:600">${N(e.giftAmount)||'<span style="color:var(--muted);font-weight:400">—</span>'}</td>
      <td><button class="btn btn-ghost btn-sm" data-edit-guest="${e.id}">Edit</button></td>
    </tr>`}let Me=null,$e=null;function Ie(e){ie(e),Dt(e);const t=e.guests??[],s=e.seating.unassigned.map(n=>t.find(a=>a.id===n)).filter(Boolean);document.getElementById("content").innerHTML=`
    <div class="section-hdr">
      <span class="section-title">Seating Chart</span>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-secondary" id="btn-add-table">+ Add Table</button>
        <button class="btn btn-ghost btn-sm" id="btn-auto-assign">⚡ Auto-Assign</button>
      </div>
    </div>

    <div class="seating-layout">
      <div class="tables-grid" id="tables-grid">
        ${e.seating.tables.map(n=>on(n,t)).join("")}
        ${e.seating.tables.length?"":`<div class="card" style="text-align:center;padding:40px;color:var(--muted);grid-column:1/-1">
               No tables yet — click "+ Add Table" to start.
             </div>`}
      </div>

      <div class="unassigned-panel" id="unassigned-panel">
        <h3>Unassigned <span style="color:var(--muted);font-weight:400">(${s.length})</span></h3>
        <input class="search-input" type="search" placeholder="Search…"
               style="width:100%;margin-bottom:8px" id="ua-search" />
        <div class="unassigned-list" id="ua-list">
          ${s.map(mt).join("")}
          ${s.length?"":'<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">All guests assigned 🎉</div>'}
        </div>
      </div>
    </div>`,dn(e)}function on(e,t){const s=e.guests.map(a=>t.find(o=>o.id===a)).filter(Boolean),n=s.length>e.capacity;return`
    <div class="tbl-card" id="tc-${e.id}"
         data-table-id="${e.id}">
      <div class="tbl-hdr">
        <span class="tbl-name">${N(e.name)}</span>
        <div style="display:flex;align-items:center;gap:6px">
          <span class="tbl-count ${n?"over":""}">${s.length}/${e.capacity}</span>
          <button class="btn btn-ghost btn-icon" data-edit-table="${e.id}" title="Edit">✏️</button>
          <button class="btn btn-danger btn-icon" data-delete-table="${e.id}" title="Delete">🗑</button>
        </div>
      </div>
      <div class="tbl-guests" id="tg-${e.id}">
        ${s.map(a=>`
          <div class="seat-guest" draggable="true" data-guest-id="${a.id}" data-from-table="${e.id}">
            <span>
              <span class="side-dot dot-${a.side??"bride"}"></span>
              ${N(a.name)}
              ${a.partySize>1?`<small style="color:var(--muted)"> +${a.partySize-1}</small>`:""}
            </span>
            <button class="seat-rmv" data-rmv-guest="${a.id}" data-rmv-table="${e.id}">✕</button>
          </div>`).join("")}
        ${s.length?"":'<div class="seat-drop-hint">Drop guests here</div>'}
      </div>
    </div>`}function mt(e){return`
    <div class="ua-guest" draggable="true" data-guest-id="${e.id}" data-from-table="">
      <span>
        <span class="side-dot dot-${e.side??"bride"}"></span>
        ${N(e.name)}
        ${e.partySize>1?`<small style="color:var(--muted)"> +${e.partySize-1}</small>`:""}
      </span>
      ${e.dietaryRestrictions?'<span title="Dietary restrictions" style="font-size:11px">⚠️</span>':""}
    </div>`}function dn(e){var s,n,a,o;(s=document.getElementById("btn-add-table"))==null||s.addEventListener("click",()=>pn(e)),(n=document.getElementById("btn-auto-assign"))==null||n.addEventListener("click",()=>fn(e)),(a=document.getElementById("ua-search"))==null||a.addEventListener("input",c=>{vn(e,c.target.value)});const t=document.getElementById("tables-grid");t==null||t.addEventListener("click",c=>{const l=c.target.closest("[data-edit-table]"),g=c.target.closest("[data-delete-table]"),d=c.target.closest("[data-rmv-guest]");l&&gn(e,l.dataset.editTable),g&&mn(e,g.dataset.deleteTable),d&&cn(e,d.dataset.rmvGuest,d.dataset.rmvTable)}),(o=document.getElementById("ua-list"))==null||o.addEventListener("click",c=>{const l=c.target.closest("[data-guest-id]");l&&!c.target.closest("button")&&hn(e,l.dataset.guestId)}),ln(e)}function ln(e){const t=document.getElementById("content");t&&(t.addEventListener("dragstart",s=>{const n=s.target.closest("[data-guest-id]");n&&(Me=n.dataset.guestId,$e=n.dataset.fromTable||null,s.dataTransfer.effectAllowed="move",s.dataTransfer.setData("text/plain",Me),requestAnimationFrame(()=>n.classList.add("dragging")))}),t.addEventListener("dragend",s=>{var n;(n=s.target.closest("[data-guest-id]"))==null||n.classList.remove("dragging")}),t.addEventListener("dragover",s=>{const n=s.target.closest(".tbl-card");n&&(s.preventDefault(),n.classList.add("drag-over")),s.target.closest("#unassigned-panel")&&s.preventDefault()}),t.addEventListener("dragleave",s=>{var n;(n=s.target.closest(".tbl-card"))==null||n.classList.remove("drag-over")}),t.addEventListener("drop",s=>{const n=s.target.closest(".tbl-card"),a=s.target.closest("#unassigned-panel");n?(n.classList.remove("drag-over"),s.preventDefault(),ft(e,n.dataset.tableId,Me??s.dataTransfer.getData("text/plain"))):a&&(s.preventDefault(),un(e,Me??s.dataTransfer.getData("text/plain"))),Me=null,$e=null}))}function ft(e,t,s){s&&(j(e.id,n=>{ie(n);const a=n.seating.tables.find(l=>l.id===t);if(!a||a.guests.includes(s))return;const o=(n.guests??[]).find(l=>l.id===s),c=(o==null?void 0:o.partySize)??1;if(!(a.guests.length+c>a.capacity&&!confirm(`"${a.name}" will exceed capacity (${a.capacity}). Continue?`))){if($e){const l=n.seating.tables.find(g=>g.id===$e);l&&(l.guests=l.guests.filter(g=>g!==s))}else n.seating.unassigned=n.seating.unassigned.filter(l=>l!==s);a.guests.push(s)}}),Ie(ae()))}function un(e,t){!t||!$e||(j(e.id,s=>{if(ie(s),$e){const n=s.seating.tables.find(a=>a.id===$e);n&&(n.guests=n.guests.filter(a=>a!==t))}s.seating.unassigned.includes(t)||s.seating.unassigned.push(t)}),Ie(ae()))}function cn(e,t,s){j(e.id,n=>{ie(n);const a=n.seating.tables.find(o=>o.id===s);a&&(a.guests=a.guests.filter(o=>o!==t)),n.seating.unassigned.includes(t)||n.seating.unassigned.push(t)}),Ie(ae())}function pn(e){var n,a;const t=prompt("Table name:",`Table ${(((a=(n=e.seating)==null?void 0:n.tables)==null?void 0:a.length)??0)+1}`);if(!t)return;const s=parseInt(prompt("Capacity:","8"));if(isNaN(s)||s<1){P("Invalid capacity","error");return}j(e.id,o=>{ie(o),o.seating.tables.push({id:he(),name:t.trim(),capacity:s,guests:[]})}),Ie(ae())}function gn(e,t){var o,c;const s=(c=(o=e.seating)==null?void 0:o.tables)==null?void 0:c.find(l=>l.id===t);if(!s)return;const n=prompt("Table name:",s.name);if(n===null)return;const a=parseInt(prompt("Capacity:",s.capacity));if(isNaN(a)||a<1){P("Invalid capacity","error");return}j(e.id,l=>{const g=l.seating.tables.find(d=>d.id===t);g&&(g.name=n.trim()||g.name,g.capacity=a)}),Ie(ae())}function mn(e,t){var n,a;const s=(a=(n=e.seating)==null?void 0:n.tables)==null?void 0:a.find(o=>o.id===t);s&&confirm(`Delete "${s.name}"? Guests will return to Unassigned.`)&&(j(e.id,o=>{ie(o);const c=o.seating.tables.find(l=>l.id===t);c&&(c.guests.forEach(l=>{o.seating.unassigned.includes(l)||o.seating.unassigned.push(l)}),o.seating.tables=o.seating.tables.filter(l=>l.id!==t))}),Ie(ae()))}function fn(e){let t=0;j(e.id,s=>{ie(s),[...s.seating.unassigned].forEach(n=>{const a=s.seating.tables.find(o=>o.guests.length<o.capacity);a&&(a.guests.push(n),s.seating.unassigned=s.seating.unassigned.filter(o=>o!==n),t++)})}),Ie(ae()),P(t?`Auto-assigned ${t} guests!`:"No space available in tables.",t?"success":"error")}function hn(e,t){var o;const s=((o=e.seating)==null?void 0:o.tables)??[];if(!s.length){P("Add a table first","error");return}const n=prompt(`Assign to table:
`+s.map((c,l)=>`${l+1}. ${c.name} (${c.guests.length}/${c.capacity})`).join(`
`)+`

Enter number:`);if(!n)return;const a=parseInt(n)-1;if(isNaN(a)||a<0||a>=s.length){P("Invalid selection","error");return}$e=null,ft(e,s[a].id,t)}function vn(e,t){ie(e);const s=e.guests??[],n=e.seating.unassigned.map(o=>s.find(c=>c.id===o)).filter(Boolean).filter(o=>!t||o.name.toLowerCase().includes(t.toLowerCase())),a=document.getElementById("ua-list");a&&(a.innerHTML=n.map(mt).join("")||'<div style="text-align:center;padding:20px;color:var(--muted);font-size:13px">No matches</div>')}function bn(e){var g;Ee(e),j(e.id,()=>{});const t=e.budget,s=Number(t.exchangeRate)||5,n=t.guestCount!=null?t.guestCount:((g=e.guests)==null?void 0:g.length)??0,a=In(t,n),o=Ze(),c=n>0?a.totalRon/n:0,l=n>0?a.totalEur/n:0;document.getElementById("content").innerHTML=`
    <div class="section-hdr">
      <span class="section-title">💰 Bugetul Nunții</span>
      <div class="bud-globals">
        <label>Curs: 1 EUR =
          <input type="number" id="bud-rate" value="${s}" step="0.01" min="0.01" style="width:80px" />
          RON
        </label>
        <label>Invitați:
          <input type="number" id="bud-guests" value="${n}" min="0" style="width:90px"
                 placeholder="auto" title="Lasă gol pentru a folosi numărul real din lista de invitați" />
        </label>
      </div>
    </div>

    <!-- Summary cards (now with Cost/Invitat) -->
    <div class="bud-summary">
      <div class="bud-card bud-card-total">
        <div class="bud-card-lbl">Cost Total Nuntă</div>
        <div class="bud-card-val">${pe(a.totalRon)}</div>
        <div class="bud-card-sub">≈ ${Re(a.totalEur)}</div>
      </div>
      <div class="bud-card bud-card-perguest">
        <div class="bud-card-lbl">💵 Cost / Invitat (mediu)</div>
        <div class="bud-card-val">${pe(c)}</div>
        <div class="bud-card-sub">≈ ${Re(l)} · ${n} invitați</div>
      </div>
      <div class="bud-card">
        <div class="bud-card-lbl">Avans (până la nuntă)</div>
        <div class="bud-card-val">${pe(a.avansRon)}</div>
        <div class="bud-card-sub">${Re(a.avansEur)}</div>
      </div>
      <div class="bud-card">
        <div class="bud-card-lbl">Rest de Plată (după nuntă)</div>
        <div class="bud-card-val">${pe(a.restRon)}</div>
        <div class="bud-card-sub">${Re(a.restEur)}</div>
      </div>
      <div class="bud-card">
        <div class="bud-card-lbl">Plătit Total</div>
        <div class="bud-card-val c-confirmed">${pe(a.paidRon)}</div>
        <div class="bud-card-sub">${Re(a.paidEur)}</div>
      </div>
      <div class="bud-card">
        <div class="bud-card-lbl">De Plătit</div>
        <div class="bud-card-val ${a.unpaidRon>0?"c-pending":""}">${pe(a.unpaidRon)}</div>
        <div class="bud-card-sub">${Re(a.unpaidEur)}</div>
      </div>
    </div>

    ${n===0?`
      <div class="card" style="background:var(--yellow);background:#fef3e2;border-color:var(--yellow);padding:10px 14px;font-size:13px;color:#a07030;margin-bottom:14px">
        ⚠ <strong>Setează numărul de invitați</strong> (sus dreapta) pentru ca furnizorii legați (Restaurant, Invitații, Monoporții, Candy Bar, Mărturii) să își calculeze automat Rest plată.
      </div>
    `:""}

    <!-- Vendors table -->
    <div class="card" style="padding:0;margin-bottom:20px;overflow:hidden">
      <div style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border);background:var(--sage-lt)">
        <strong style="font-size:15px">Furnizori &amp; Costuri <span style="color:var(--muted);font-weight:400">(${t.vendors.length})</span></strong>
        <button class="btn btn-primary btn-sm" id="bud-add-vendor">+ Adaugă Furnizor Personalizat</button>
      </div>
      <div style="overflow-x:auto">
        <table class="bud-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Furnizor</th>
              <th colspan="2" class="bud-th-grp avans">Avans (până la nuntă)</th>
              <th colspan="2" class="bud-th-grp rest">Rest plată (după nuntă)</th>
              <th colspan="2" class="bud-th-grp total">Total</th>
              <th>Plătit</th>
              <th></th>
            </tr>
            <tr>
              <th></th><th></th>
              <th class="bud-sub avans">RON</th><th class="bud-sub avans">EUR</th>
              <th class="bud-sub rest">RON</th><th class="bud-sub rest">EUR</th>
              <th class="bud-sub total">RON</th><th class="bud-sub total">EUR</th>
              <th></th><th></th>
            </tr>
          </thead>
          <tbody>
            ${t.vendors.map((d,u)=>$n(d,u,t,n,o)).join("")}
            <tr class="bud-totals-row">
              <td></td>
              <td><strong>TOTAL</strong></td>
              <td class="bud-cell avans"><strong>${se(a.avansRon)}</strong></td>
              <td class="bud-cell avans"><strong>${se(a.avansEur)}</strong></td>
              <td class="bud-cell rest"><strong>${se(a.restRon)}</strong></td>
              <td class="bud-cell rest"><strong>${se(a.restEur)}</strong></td>
              <td class="bud-cell total"><strong>${se(a.totalRon)}</strong></td>
              <td class="bud-cell total"><strong>${se(a.totalEur)}</strong></td>
              <td></td><td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Per-person + Gift -->
    <div class="bud-bottom-grid">
      <!-- Per-person prices -->
      <div class="card">
        <strong style="display:block;margin-bottom:14px;font-size:15px">📊 Prețuri / Persoană</strong>
        <table class="bud-pp-table">
          <thead><tr><th></th><th>RON</th><th>EUR</th><th>× ${n} pers.</th></tr></thead>
          <tbody>
            ${o.map(({key:d,label:u})=>_n(t,d,u,n)).join("")}
            <tr class="bud-totals-row">
              <td><strong>Total / persoană</strong></td>
              <td class="bud-cell"><strong>${se(a.perPersonRon)}</strong></td>
              <td class="bud-cell"><strong>${se(a.perPersonEur)}</strong></td>
              <td class="bud-cell"><strong>${pe(a.perPersonRon*n)}</strong></td>
            </tr>
          </tbody>
        </table>
        <p style="font-size:11px;color:var(--muted);margin-top:8px">🔗 Modificările se propagă automat la furnizorii legați (Restaurant, Invitații, Monoporții, Candy Bar, Mărturii) — Rest plată al lor se recalculează: <code>preț × ${n} invitați</code>.</p>
      </div>

      <!-- Gift income -->
      <div class="card">
        <strong style="display:block;margin-bottom:14px;font-size:15px">🎁 "Dar" (cadou) per persoană</strong>
        <table class="bud-pp-table">
          <thead><tr><th></th><th>RON</th><th>EUR</th></tr></thead>
          <tbody>
            <tr>
              <td>Dar așteptat / persoană</td>
              <td class="bud-cell"><input type="number" data-gift-cur="ron" value="${t.giftPerPerson.ron||""}" step="10" min="0" placeholder="0" /></td>
              <td class="bud-cell"><input type="number" data-gift-cur="eur" value="${t.giftPerPerson.eur||""}" step="10" min="0" placeholder="0" /></td>
            </tr>
            <tr class="bud-totals-row">
              <td><strong>Total dar (× ${n})</strong></td>
              <td class="bud-cell"><strong>${pe((t.giftPerPerson.ron||0)*n)}</strong></td>
              <td class="bud-cell"><strong>${Re((t.giftPerPerson.eur||0)*n)}</strong></td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:14px;padding:12px;background:${a.totalRon-(t.giftPerPerson.ron||0)*n>0?"var(--red-lt)":"var(--green-lt)"};border-radius:8px;font-size:13px">
          <strong>Bilanț:</strong>
          ${(()=>{const d=(t.giftPerPerson.ron||0)*n,u=a.totalRon-d;return u>0?`<span class="c-declined">Rămân de acoperit ${pe(u)}</span> din buzunar`:u<0?`<span class="c-confirmed">Surplus estimat ${pe(Math.abs(u))}</span>`:"Echilibrat"})()}
        </div>
      </div>
    </div>
  `,yn(e,t)}function yn(e,t){var s,n,a;(s=document.getElementById("bud-rate"))==null||s.addEventListener("change",o=>{const c=Math.max(.01,parseFloat(o.target.value)||5);j(e.id,l=>{Ee(l),l.budget.exchangeRate=c}),H("render")}),(n=document.getElementById("bud-guests"))==null||n.addEventListener("change",o=>{const c=o.target.value.trim(),l=c===""?null:Math.max(0,parseInt(c)||0);j(e.id,g=>{Ee(g),g.budget.guestCount=l}),H("render")}),(a=document.getElementById("bud-add-vendor"))==null||a.addEventListener("click",()=>En(e)),document.querySelectorAll("[data-vendor-cell]").forEach(o=>{o.addEventListener("change",c=>{const{vendorCell:l,vendorId:g,vendorField:d}=c.target.dataset,u=Math.max(0,parseFloat(c.target.value)||0);j(e.id,v=>{Ee(v);const E=v.budget.vendors.find(_=>_.id===g);if(!E)return;const A=v.budget.exchangeRate||5;if(E[d]=u,l==="ron"){const _=d.replace("Ron","Eur");E[_]=+(u/A).toFixed(2)}else{const _=d.replace("Eur","Ron");E[_]=+(u*A).toFixed(2)}}),H("render")})}),document.querySelectorAll("[data-vendor-label]").forEach(o=>{o.addEventListener("change",c=>{const l=c.target.dataset.vendorLabel;j(e.id,g=>{const d=g.budget.vendors.find(u=>u.id===l);d&&(d.label=c.target.value.trim()||d.label)})})}),document.querySelectorAll("[data-vendor-pp-link]").forEach(o=>{o.addEventListener("change",c=>{const l=c.target.dataset.vendorPpLink,g=c.target.value||null;j(e.id,d=>{const u=d.budget.vendors.find(v=>v.id===l);u&&(u.perPersonKey=g)}),H("render")})}),document.querySelectorAll("[data-paid-toggle]").forEach(o=>{o.addEventListener("click",()=>{const{paidToggle:c,vendorId:l}=o.dataset;j(e.id,g=>{const d=g.budget.vendors.find(u=>u.id===l);d&&(c==="avans"?d.avansPaid=!d.avansPaid:c==="rest"&&(d.restPaid=!d.restPaid))}),H("render")})}),document.querySelectorAll("[data-vendor-delete]").forEach(o=>{o.addEventListener("click",()=>{const c=o.dataset.vendorDelete,l=t.vendors.find(g=>g.id===c);l&&confirm(`Ștergi furnizorul "${l.label}"?`)&&(j(e.id,g=>{g.budget.vendors=g.budget.vendors.filter(d=>d.id!==c)}),P("Furnizor șters","success"),H("render"))})}),document.querySelectorAll("[data-pp-cell]").forEach(o=>{o.addEventListener("change",c=>{const{ppCell:l,ppKey:g}=c.target.dataset,d=Math.max(0,parseFloat(c.target.value)||0);j(e.id,u=>{Ee(u);const v=u.budget.exchangeRate||5;u.budget.perPerson[g][l]=d;const E=l==="ron"?"eur":"ron";u.budget.perPerson[g][E]=l==="ron"?+(d/v).toFixed(2):+(d*v).toFixed(2)}),H("render")})}),document.querySelectorAll("[data-gift-cur]").forEach(o=>{o.addEventListener("change",c=>{const l=c.target.dataset.giftCur,g=Math.max(0,parseFloat(c.target.value)||0);j(e.id,d=>{Ee(d);const u=d.budget.exchangeRate||5;d.budget.giftPerPerson[l]=g;const v=l==="ron"?"eur":"ron";d.budget.giftPerPerson[v]=l==="ron"?+(g/u).toFixed(2):+(g*u).toFixed(2)}),H("render")})})}function En(e){const t=prompt("Nume furnizor (ex: Foc Artificii, Transport, Cofetărie):");if(!(t!=null&&t.trim()))return;const s=Ze(),n=prompt(`Vrei să legi acest furnizor de un preț per persoană? Rest plată se va calcula automat.

0. Nu, fără legătură
`+s.map((o,c)=>`${c+1}. ${o.short}`).join(`
`)+`

Introdu numărul (sau Enter pentru "Nu"):`);let a=null;n&&/^[1-5]$/.test(n.trim())&&(a=s[parseInt(n)-1].key),j(e.id,o=>{Ee(o),o.budget.vendors.push({id:he(),label:t.trim(),perPersonKey:a,avansRon:0,avansEur:0,restRon:0,restEur:0,avansPaid:!0,restPaid:!1,notes:""})}),P(`Furnizor "${t.trim()}" adăugat${a?` (legat de ${s.find(o=>o.key===a).short})`:""}`,"success"),H("render")}function ht(e,t,s){if(e.perPersonKey&&t.perPerson[e.perPersonKey]){const n=t.perPerson[e.perPersonKey];return{ron:(n.ron||0)*s,eur:(n.eur||0)*s,linked:!0}}return{ron:e.restRon||0,eur:e.restEur||0,linked:!1}}function $n(e,t,s,n,a){var v;const o=ht(e,s,n),c=(e.avansRon||0)+o.ron,l=(e.avansEur||0)+o.eur,g=`
    <select class="bud-pp-link" data-vendor-pp-link="${e.id}" title="Leagă Rest plată de un preț per persoană">
      <option value="">— Fără —</option>
      ${a.map(E=>`<option value="${E.key}" ${e.perPersonKey===E.key?"selected":""}>🔗 ${N(E.short)}/pers</option>`).join("")}
    </select>`,d=o.linked?`<span class="bud-cell-calc" title="Calculat: ${N(((v=a.find(E=>E.key===e.perPersonKey))==null?void 0:v.short)??"")} × ${n}">${se(o.ron)}</span>`:`<input type="number" data-vendor-cell="ron" data-vendor-id="${e.id}" data-vendor-field="restRon" value="${e.restRon||""}" step="10" min="0" placeholder="0" />`,u=o.linked?`<span class="bud-cell-calc">${se(o.eur)}</span>`:`<input type="number" data-vendor-cell="eur" data-vendor-id="${e.id}" data-vendor-field="restEur" value="${e.restEur||""}" step="10" min="0" placeholder="0" />`;return`
    <tr>
      <td style="color:var(--muted);text-align:center;width:32px">${t+1}</td>
      <td>
        <input type="text" class="bud-label-inp" data-vendor-label="${e.id}" value="${N(e.label)}" />
        ${g}
      </td>
      <td class="bud-cell avans"><input type="number" data-vendor-cell="ron" data-vendor-id="${e.id}" data-vendor-field="avansRon" value="${e.avansRon||""}" step="10" min="0" placeholder="0" /></td>
      <td class="bud-cell avans"><input type="number" data-vendor-cell="eur" data-vendor-id="${e.id}" data-vendor-field="avansEur" value="${e.avansEur||""}" step="10" min="0" placeholder="0" /></td>
      <td class="bud-cell rest ${o.linked?"is-linked":""}">${d}</td>
      <td class="bud-cell rest ${o.linked?"is-linked":""}">${u}</td>
      <td class="bud-cell total"><strong>${se(c)}</strong></td>
      <td class="bud-cell total"><strong>${se(l)}</strong></td>
      <td style="white-space:nowrap;text-align:center">
        <button class="paid-toggle ${e.avansPaid?"is-paid":""}" data-paid-toggle="avans" data-vendor-id="${e.id}" title="Avans plătit?">A</button>
        <button class="paid-toggle ${e.restPaid?"is-paid":""}"  data-paid-toggle="rest"  data-vendor-id="${e.id}" title="Rest plătit?">R</button>
      </td>
      <td><button class="btn btn-danger btn-sm" data-vendor-delete="${e.id}" title="Șterge furnizor">🗑</button></td>
    </tr>`}function _n(e,t,s,n){const a=e.perPerson[t],o=(a.ron||0)*n;return`
    <tr>
      <td>${N(s)}</td>
      <td class="bud-cell"><input type="number" data-pp-cell="ron" data-pp-key="${t}" value="${a.ron||""}" step="1" min="0" placeholder="0" /></td>
      <td class="bud-cell"><input type="number" data-pp-cell="eur" data-pp-key="${t}" value="${a.eur||""}" step="1" min="0" placeholder="0" /></td>
      <td class="bud-cell" style="color:var(--muted)">${pe(o)}</td>
    </tr>`}function In(e,t){var _,Z;let s=0,n=0,a=0,o=0,c=0,l=0;for(const W of e.vendors){const ue=ht(W,e,t);s+=W.avansRon||0,n+=W.avansEur||0,a+=ue.ron,o+=ue.eur,W.avansPaid&&(c+=W.avansRon||0,l+=W.avansEur||0),W.restPaid&&(c+=ue.ron,l+=ue.eur)}const g=s+a,d=n+o,u=g-c,v=d-l;let E=0,A=0;for(const{key:W}of Ze())E+=((_=e.perPerson[W])==null?void 0:_.ron)||0,A+=((Z=e.perPerson[W])==null?void 0:Z.eur)||0;return{avansRon:s,avansEur:n,restRon:a,restEur:o,totalRon:g,totalEur:d,paidRon:c,paidEur:l,unpaidRon:u,unpaidEur:v,perPersonRon:E,perPersonEur:A}}function pe(e){return`${se(e)} lei`}function Re(e){return`€${se(e)}`}function se(e){return(Number(e)||0).toLocaleString("ro-RO",{maximumFractionDigits:2})}function vt(){["wm-p1","wm-p2","wm-date","wm-location"].forEach(e=>{document.getElementById(e).value=""}),document.getElementById("wm-save").onclick=kn,Ye("wedding-modal"),document.getElementById("wm-p1").focus()}function kn(){const e=document.getElementById("wm-p1").value.trim(),t=document.getElementById("wm-p2").value.trim();if(!e||!t){P("Both partner names are required","error");return}Pt({id:he(),couple:{partner1:e,partner2:t},date:document.getElementById("wm-date").value||"",location:document.getElementById("wm-location").value.trim(),createdAt:new Date().toISOString().slice(0,10),guests:[],seating:{tables:[],unassigned:[]}}),qe("wedding-modal"),P("Wedding created! 🎉","success"),H("wedding-created"),H("render")}const Rn={dashboard:"Dashboard",guests:"Guest List",seating:"Seating Chart",budget:"Bugetul Nunții"};let bt="dashboard";Xe("navigate",e=>et(e));Xe("render",()=>Ke());function et(e){bt=e,document.querySelectorAll("[data-tab]").forEach(s=>{s.classList.toggle("active",s.dataset.tab===e)});const t=document.getElementById("header-title");t&&(t.textContent=Rn[e]??""),Ke()}function Ke(){var s;const e=ae(),t=document.getElementById("content");if(t){if(!e){t.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon">💍</div>
        <h2>No weddings yet</h2>
        <p>Create your first wedding to get started.</p>
        <button class="btn btn-primary" id="empty-new-wedding">+ Create Wedding</button>
      </div>`,(s=document.getElementById("empty-new-wedding"))==null||s.addEventListener("click",()=>vt());return}switch(bt){case"dashboard":nn(e);break;case"guests":Pe(e);break;case"seating":Ie(e);break;case"budget":bn(e);break}}}function We(){const e=document.getElementById("wedding-select");if(!e)return;const{weddings:t,activeWeddingId:s}=Ge();e.innerHTML=t.length?t.map(a=>`<option value="${a.id}" ${a.id===s?"selected":""}>
          ${N(a.couple.partner1)} &amp; ${N(a.couple.partner2)}
        </option>`).join(""):'<option value="">— No weddings —</option>';const n=document.getElementById("btn-delete-wedding");n&&(n.style.display=t.length?"":"none")}function Sn(){var e,t;We(),(e=document.getElementById("wedding-select"))==null||e.addEventListener("change",s=>{Bt(s.target.value),Ke()}),(t=document.getElementById("btn-delete-wedding"))==null||t.addEventListener("click",()=>{const s=ae();if(!s)return;const n=`${s.couple.partner1} & ${s.couple.partner2}`;confirm(`⚠ Delete the wedding "${n}"?

This will permanently delete all guests, seating, and budget data for this wedding.

Cannot be undone.`)&&confirm("Are you absolutely sure? Click OK to confirm deletion.")&&(Ct(s.id),We(),P(`Deleted "${n}"`,"success"),H("navigate","dashboard"))})}function wn(){try{localStorage.setItem("_wp_test","1"),localStorage.removeItem("_wp_test")}catch{alert("localStorage is disabled. The app cannot save data in this browser.")}Lt();const e=Ge();if(!e.weddings.length){const t=he();e.weddings.push(wt(t)),e.activeWeddingId=t,Se()}!e.activeWeddingId&&e.weddings.length&&(e.activeWeddingId=e.weddings[0].id),Sn(),Kt(),xn(),Xe("wedding-created",()=>We()),et("dashboard")}function xn(){var e,t,s,n;document.querySelectorAll("[data-tab]").forEach(a=>{a.addEventListener("click",()=>et(a.dataset.tab))}),(e=document.getElementById("btn-add-guest"))==null||e.addEventListener("click",()=>je()),(t=document.getElementById("btn-new-wedding"))==null||t.addEventListener("click",()=>vt()),(s=document.getElementById("btn-export"))==null||s.addEventListener("click",Ln),(n=document.getElementById("import-json-input"))==null||n.addEventListener("change",Bn),document.querySelectorAll("[data-close]").forEach(a=>{a.addEventListener("click",()=>{var o;(o=document.getElementById(a.dataset.close))==null||o.classList.remove("open")})}),document.querySelectorAll(".modal-overlay").forEach(a=>{a.addEventListener("click",o=>{o.target===a&&a.classList.remove("open")})}),document.addEventListener("keydown",a=>{a.key==="Escape"&&document.querySelectorAll(".modal-overlay.open").forEach(o=>o.classList.remove("open"))})}function Ln(){const e=Ge();if(!e.weddings.length){P("Nothing to export","error");return}const t=e.weddings.find(o=>o.id===e.activeWeddingId),s=t?`${t.couple.partner1}-${t.couple.partner2}`:"all",n=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(n),a.download=`wedding-planner-${s}-${Date.now()}.json`,a.click(),URL.revokeObjectURL(a.href),P("Exported successfully!","success")}function Bn(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const s=new FileReader;s.onload=a=>{try{const o=JSON.parse(a.target.result);if(!Array.isArray(o.weddings))throw new Error('Invalid format: missing "weddings" array');if(confirm(`Import found ${o.weddings.length} wedding(s).

OK = Merge with existing data
Cancel = Replace all data`)){const l=Ge();o.weddings.forEach(g=>{l.weddings.find(d=>d.id===g.id)||l.weddings.push(g)}),Se()}else Ot(o);We(),Ke(),P("Imported successfully!","success")}catch(o){P("Import failed: "+o.message,"error")}e.target.value=""},s.readAsText(t)}wn();
