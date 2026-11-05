var yx=Object.defineProperty;var Mx=(s,t,e)=>t in s?yx(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var on=(s,t,e)=>()=>{if(e)throw e[0];try{return s&&(t=s(s=0)),t}catch(n){throw e=[n],n}};var Sx=(s,t)=>()=>{try{return t||s((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}};var Ft=(s,t,e)=>Mx(s,typeof t!="symbol"?t+"":t,e);function bx(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function Tx(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Do(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Qm(){let s=Do("canvas");return s.style.display="block",s}function qf(...s){let t="THREE."+s.shift();No?No("log",t,...s):console.log(t,...s)}function jm(s){let t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Ht(...s){s=jm(s);let t="THREE."+s.shift();if(No)No("warn",t,...s);else{let e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function Vt(...s){s=jm(s);let t="THREE."+s.shift();if(No)No("error",t,...s);else{let e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Rr(...s){let t=s.join(" ");t in Xp||(Xp[t]=!0,Ht(...s))}function tg(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}function hl(){let s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ln[s&255]+Ln[s>>8&255]+Ln[s>>16&255]+Ln[s>>24&255]+"-"+Ln[t&255]+Ln[t>>8&255]+"-"+Ln[t>>16&15|64]+Ln[t>>24&255]+"-"+Ln[e&63|128]+Ln[e>>8&255]+"-"+Ln[e>>16&255]+Ln[e>>24&255]+Ln[n&255]+Ln[n>>8&255]+Ln[n>>16&255]+Ln[n>>24&255]).toLowerCase()}function jt(s,t,e){return Math.max(t,Math.min(e,s))}function wx(s,t){return(s%t+t)%t}function Ku(s,t,e){return(1-e)*s+e*t}function ng(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Zf(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Ex(s,t){if(t.constructor===Float32Array)return s;let e=Zf(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/e,-1)}function Ax(s,t){if(t.constructor===Float32Array)return s;let e=Zf(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*e)}function Rx(){let s={enabled:!0,workingColorSpace:Cr,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===me&&(i.r=Ms(i.r),i.g=Ms(i.g),i.b=Ms(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===me&&(i.r=Ro(i.r),i.g=Ro(i.g),i.b=Ro(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Es?Pa:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[o].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Cr]:{primaries:t,whitePoint:n,transfer:Pa,toXYZ:qp,fromXYZ:Zp,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Tn},outputColorSpaceConfig:{drawingBufferColorSpace:Tn}},[Tn]:{primaries:t,whitePoint:n,transfer:me,toXYZ:qp,fromXYZ:Zp,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Tn}}}),s}function Ms(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ro(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}function tf(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Dc.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Ht("Texture: Unable to serialize Texture."),{})}function sf(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}function ff(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){wr.fromArray(s,r);let a=i.x*Math.abs(wr.x)+i.y*Math.abs(wr.y)+i.z*Math.abs(wr.z),l=t.dot(wr),c=e.dot(wr),h=n.dot(wr);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}function Bx(){let s=new ArrayBuffer(4),t=new Float32Array(s),e=new Uint32Array(s),n=new Uint32Array(512),i=new Uint32Array(512);for(let l=0;l<256;++l){let c=l-127;c<-27?(n[l]=0,n[l|256]=32768,i[l]=24,i[l|256]=24):c<-14?(n[l]=1024>>-c-14,n[l|256]=1024>>-c-14|32768,i[l]=-c-1,i[l|256]=-c-1):c<=15?(n[l]=c+15<<10,n[l|256]=c+15<<10|32768,i[l]=13,i[l|256]=13):c<128?(n[l]=31744,n[l|256]=64512,i[l]=24,i[l|256]=24):(n[l]=31744,n[l|256]=64512,i[l]=13,i[l|256]=13)}let r=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let l=1;l<1024;++l){let c=l<<13,h=0;for(;(c&8388608)===0;)c<<=1,h-=8388608;c&=-8388609,h+=947912704,r[l]=c|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)o[l]=l<<23;o[31]=1199570944,o[32]=2147483648;for(let l=33;l<63;++l)o[l]=2147483648+(l-32<<23);o[63]=3347054592;for(let l=1;l<64;++l)l!==32&&(a[l]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:r,exponentTable:o,offsetTable:a}}function zx(s){Math.abs(s)>65504&&Ht("DataUtils.toHalfFloat(): Value out of range."),s=jt(s,-65504,65504),ys.floatView[0]=s;let t=ys.uint32View[0],e=t>>23&511;return ys.baseTable[e]+((t&8388607)>>ys.shiftTable[e])}function kx(s){let t=s>>10;return ys.uint32View[0]=ys.mantissaTable[ys.offsetTable[t]+(s&1023)]+ys.exponentTable[t],ys.floatView[0]}function qx(s,t,e,n,i,r,o,a){let l;if(t.side===wn?l=n.intersectTriangle(o,r,i,!0,a):l=n.intersectTriangle(i,r,o,t.side===nr,a),l===null)return null;pc.copy(a),pc.applyMatrix4(s.matrixWorld);let c=e.ray.origin.distanceTo(pc);return c<e.near||c>e.far?null:{distance:c,point:pc.clone(),object:s}}function mc(s,t,e,n,i,r,o,a,l,c){s.getVertexPosition(a,hc),s.getVertexPosition(l,uc),s.getVertexPosition(c,fc);let h=qx(s,t,e,n,hc,uc,fc,rm);if(h){let d=new H;Ys.getBarycoord(rm,hc,uc,fc,d),i&&(h.uv=Ys.getInterpolatedAttribute(i,a,l,c,d,new kt)),r&&(h.uv1=Ys.getInterpolatedAttribute(r,a,l,c,d,new kt)),o&&(h.normal=Ys.getInterpolatedAttribute(o,a,l,c,d,new H),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new H,materialIndex:0};Ys.getNormal(hc,uc,fc,u.normal),h.face=u,h.barycoord=d}return h}function Jf(){let s=0,t=0,e=0,n=0;function i(r,o,a,l){s=r,t=a,e=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){i(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,h,d){let u=(o-r)/c-(a-r)/(c+h)+(a-o)/h,f=(a-o)/h-(l-o)/(h+d)+(l-a)/d;u*=h,f*=h,i(o,a,u,f)},calc:function(r){let o=r*r,a=o*r;return s+t*r+e*o+n*a}}}function kr(s){let t={};for(let e in s){t[e]={};for(let n in s[e]){let i=s[e][n];if(um(i))i.isRenderTargetTexture?(Ht("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(um(i[0])){let r=[];for(let o=0,a=i.length;o<a;o++)r[o]=i[o].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Fn(s){let t={};for(let e=0;e<s.length;e++){let n=kr(s[e]);for(let i in n)t[i]=n[i]}return t}function um(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function $x(s){let t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function $f(s){let t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ne.workingColorSpace}function To(s,t){return!s||s.constructor===t?s:typeof t.BYTES_PER_ELEMENT=="number"?new t(s):Array.prototype.slice.call(s)}function xc(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function sg(s,t,e,n,i){let r=1-s;return r*r*r*t+3*r*r*s*e+3*r*s*s*n+s*s*s*i}function jx(s,t,e,n,i){let r=1-s;return 3*r*r*(e-t)+6*r*s*(n-e)+3*s*s*(i-n)}function tv(s,t,e,n,i){let r=(s-t)/(i-t);for(let o=0;o<8;o++){let a=sg(r,t,e,n,i)-s;if(Math.abs(a)<1e-10)break;let l=jx(r,t,e,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}function fm(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]+=t}function dm(s,t){for(let e=0,n=s.length;e!==n;e+=2)s[e]*=t}function pm(s){try{let t=s.slice(s.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}function ev(){this._document.hidden===!1&&this.reset()}function jf(s,t,e,n){let i=hv(n);switch(e){case Hf:return s*t;case lh:return s*t/i.components*i.byteLength;case ch:return s*t/i.components*i.byteLength;case ir:return s*t*2/i.components*i.byteLength;case hh:return s*t*2/i.components*i.byteLength;case Gf:return s*t*3/i.components*i.byteLength;case Zi:return s*t*4/i.components*i.byteLength;case uh:return s*t*4/i.components*i.byteLength;case sl:case rl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ol:case al:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case dh:case mh:return Math.max(s,16)*Math.max(t,8)/4;case fh:case ph:return Math.max(s,8)*Math.max(t,8)/2;case gh:case _h:case vh:case yh:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case xh:case ll:case Mh:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Sh:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case bh:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Th:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case wh:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case Eh:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Ah:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case Rh:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case Ch:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case Ph:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case Ih:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case Lh:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case Dh:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case Nh:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case Uh:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case Fh:case Oh:case Bh:return Math.ceil(s/4)*Math.ceil(t/4)*16;case zh:case kh:return Math.ceil(s/4)*Math.ceil(t/4)*8;case cl:case Hh:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function hv(s){switch(s){case ai:case Of:return{byteLength:1,components:1};case Wo:case Bf:case He:return{byteLength:2,components:1};case oh:case ah:return{byteLength:2,components:4};case qi:case rh:case $n:return{byteLength:4,components:1};case zf:case kf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}var vm,Pf,ym,Nr,Mm,Ho,nr,wn,es,Ts,Go,Ur,If,Lf,Sm,Fr,bm,Tm,wm,Em,Am,Rm,Cm,Pm,Df,Nf,Im,Lm,Dm,Nm,Um,Fm,Om,Bm,zm,bc,Tc,wc,Po,Ec,Ac,Rc,Cc,Uf,km,Hm,ns,Ka,Qa,ja,Or,tl,el,nl,Ff,Br,Vo,nh,ih,Io,Li,Pc,yn,Gm,il,Qe,sh,is,ai,Of,Bf,Wo,rh,qi,$n,He,oh,ah,zr,zf,kf,Hf,Gf,Zi,Ss,ws,lh,ch,ir,hh,uh,sl,rl,ol,al,fh,dh,ph,mh,gh,_h,xh,vh,yh,ll,Mh,Sh,bh,Th,wh,Eh,Ah,Rh,Ch,Ph,Ih,Lh,Dh,Nh,Uh,Fh,Oh,Bh,zh,kh,cl,Hh,Ca,Ic,Mc,Sf,bf,Tf,wf,Vm,Gh,Wm,Es,Tn,Cr,Pa,me,Sc,Xm,Ym,qm,Zm,Vf,Jm,$m,Wf,Xf,Km,Yf,Di,Lo,Xp,No,eg,Qi,Ln,$u,Lc,td,kt,ri,ed,H,Qu,Yp,nd,Xt,ju,qp,Zp,ne,fo,Dc,Cx,Uo,Px,ef,Nn,id,Be,Nc,je,Ia,Uc,eh,ie,po,Hi,Ix,Lx,Hs,tc,gi,Jp,$p,oi,La,Dx,Kp,mo,ps,ec,ba,Nx,Ux,Qp,jp,tm,em,Fx,go,nf,Un,Xi,Ox,Fo,ig,Gs,nc,Ot,Dn,Da,Na,Gi,ms,rf,gs,_o,xo,nm,of,af,lf,cf,hf,uf,Ys,ji,_s,Vi,ic,vo,yo,Mo,Vs,Ws,Tr,Ta,sc,rc,wr,ys,qs,an,oc,Hx,Yi,Ua,Fa,Pe,Gx,wa,df,Zs,Vx,Ii,pf,So,_i,Ea,vn,xi,mf,Wx,Xx,Wi,Yx,Js,xs,gf,ac,lc,Fc,ts,im,Er,cc,sm,hc,uc,fc,_f,dc,rm,pc,Jt,Pr,Oa,bo,om,gc,am,Zx,Aa,Ra,Zn,Ar,Jx,_c,$s,lm,Oc,Ba,za,bs,ka,Ha,Ie,Ks,Oo,Bc,zc,cm,hm,xf,vf,yf,Bo,Ga,Jn,Ir,As,Kx,Qx,ln,zo,Ue,Lr,kc,Hc,Qs,Gc,Vc,Wc,Xc,vi,js,Yc,qc,Zc,Va,tr,Jc,Co,$c,rg,er,vs,Ef,Kc,wo,Qc,Wa,Xa,Ya,qa,Mf,mm,gm,jc,vc,yc,Ki,Za,Xs,_m,xm,qn,Dr,Af,Ja,Eo,Ao,ko,th,$a,Kf,nv,Qf,iv,sv,rv,ov,av,lv,cv,Rf,Ne,zE,sd,Cf,rd=on(()=>{vm=0,Pf=1,ym=2,Nr=1,Mm=2,Ho=3,nr=0,wn=1,es=2,Ts=0,Go=1,Ur=2,If=3,Lf=4,Sm=5,Fr=100,bm=101,Tm=102,wm=103,Em=104,Am=200,Rm=201,Cm=202,Pm=203,Df=204,Nf=205,Im=206,Lm=207,Dm=208,Nm=209,Um=210,Fm=211,Om=212,Bm=213,zm=214,bc=0,Tc=1,wc=2,Po=3,Ec=4,Ac=5,Rc=6,Cc=7,Uf=0,km=1,Hm=2,ns=0,Ka=1,Qa=2,ja=3,Or=4,tl=5,el=6,nl=7,Ff=300,Br=301,Vo=302,nh=303,ih=304,Io=1e3,Li=1001,Pc=1002,yn=1003,Gm=1004,il=1005,Qe=1006,sh=1007,is=1008,ai=1009,Of=1010,Bf=1011,Wo=1012,rh=1013,qi=1014,$n=1015,He=1016,oh=1017,ah=1018,zr=1020,zf=35902,kf=35899,Hf=1021,Gf=1022,Zi=1023,Ss=1026,ws=1027,lh=1028,ch=1029,ir=1030,hh=1031,uh=1033,sl=33776,rl=33777,ol=33778,al=33779,fh=35840,dh=35841,ph=35842,mh=35843,gh=36196,_h=37492,xh=37496,vh=37488,yh=37489,ll=37490,Mh=37491,Sh=37808,bh=37809,Th=37810,wh=37811,Eh=37812,Ah=37813,Rh=37814,Ch=37815,Ph=37816,Ih=37817,Lh=37818,Dh=37819,Nh=37820,Uh=37821,Fh=36492,Oh=36494,Bh=36495,zh=36283,kh=36284,cl=36285,Hh=36286,Ca=2300,Ic=2301,Mc=2302,Sf=2303,bf=2400,Tf=2401,wf=2402,Vm=3200,Gh=0,Wm=1,Es="",Tn="srgb",Cr="srgb-linear",Pa="linear",me="srgb",Sc=7680,Xm=519,Ym=512,qm=513,Zm=514,Vf=515,Jm=516,$m=517,Wf=518,Xf=519,Km=35044,Yf="300 es",Di=2e3,Lo=2001;Xp={},No=null;eg={[bc]:bc,[wc]:Rc,[Ec]:Ec,[Po]:Ac,[Tc]:Tc,[Rc]:wc,[Cc]:Cc,[Ac]:Po},Qi=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let i=n[t];if(i!==void 0){let r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}},Ln=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],$u=Math.PI/180,Lc=180/Math.PI;td=class td{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};td.prototype.isVector2=!0;kt=td,ri=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let l=n[i+0],c=n[i+1],h=n[i+2],d=n[i+3],u=r[o+0],f=r[o+1],m=r[o+2],x=r[o+3];if(d!==x||l!==u||c!==f||h!==m){let p=l*u+c*f+h*m+d*x;p<0&&(u=-u,f=-f,m=-m,x=-x,p=-p);let g=1-a;if(p<.9995){let v=Math.acos(p),S=Math.sin(v);g=Math.sin(g*v)/S,a=Math.sin(a*v)/S,l=l*g+u*a,c=c*g+f*a,h=h*g+m*a,d=d*g+x*a}else{l=l*g+u*a,c=c*g+f*a,h=h*g+m*a,d=d*g+x*a;let v=1/Math.sqrt(l*l+c*c+h*h+d*d);l*=v,c*=v,h*=v,d*=v}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=d}static multiplyQuaternionsFlat(t,e,n,i,r,o){let a=n[i],l=n[i+1],c=n[i+2],h=n[i+3],d=r[o],u=r[o+1],f=r[o+2],m=r[o+3];return t[e]=a*m+h*d+l*f-c*u,t[e+1]=l*m+h*u+c*d-a*f,t[e+2]=c*m+h*f+a*u-l*d,t[e+3]=h*m-a*d-l*u-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(i/2),d=a(r/2),u=l(n/2),f=l(i/2),m=l(r/2);switch(o){case"XYZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"YXZ":this._x=u*h*d+c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"ZXY":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d-u*f*m;break;case"ZYX":this._x=u*h*d-c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d+u*f*m;break;case"YZX":this._x=u*h*d+c*f*m,this._y=c*f*d+u*h*m,this._z=c*h*m-u*f*d,this._w=c*h*d-u*f*m;break;case"XZY":this._x=u*h*d-c*f*m,this._y=c*f*d-u*h*m,this._z=c*h*m+u*f*d,this._w=c*h*d+u*f*m;break;default:Ht("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],d=e[10],u=n+a+d;if(u>0){let f=.5/Math.sqrt(u+1);this._w=.25/f,this._x=(h-l)*f,this._y=(r-c)*f,this._z=(o-i)*f}else if(n>a&&n>d){let f=2*Math.sqrt(1+n-a-d);this._w=(h-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-n-d);this._w=(r-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+d-n-a);this._w=(o-i)/f,this._x=(r+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(jt(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+i*c-r*l,this._y=i*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-i*a,this._w=o*h-n*a-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},ed=class ed{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Yp.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Yp.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),h=2*(a*e-r*i),d=2*(r*n-o*e);return this.x=e+l*c+o*d-a*h,this.y=n+l*h+a*c-r*d,this.z=i+l*d+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-r*a,this.y=r*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Qu.copy(this).projectOnVector(t),this.sub(Qu)}reflect(t){return this.sub(Qu.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ed.prototype.isVector3=!0;H=ed,Qu=new H,Yp=new ri,nd=class nd{constructor(t,e,n,i,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c)}set(t,e,n,i,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],d=n[7],u=n[2],f=n[5],m=n[8],x=i[0],p=i[3],g=i[6],v=i[1],S=i[4],y=i[7],b=i[2],T=i[5],_=i[8];return r[0]=o*x+a*v+l*b,r[3]=o*p+a*S+l*T,r[6]=o*g+a*y+l*_,r[1]=c*x+h*v+d*b,r[4]=c*p+h*S+d*T,r[7]=c*g+h*y+d*_,r[2]=u*x+f*v+m*b,r[5]=u*p+f*S+m*T,r[8]=u*g+f*y+m*_,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+i*r*c-i*o*l}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=h*o-a*c,u=a*l-h*r,f=c*r-o*l,m=e*d+n*u+i*f;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/m;return t[0]=d*x,t[1]=(i*c-h*n)*x,t[2]=(a*n-i*o)*x,t[3]=u*x,t[4]=(h*e-i*l)*x,t[5]=(i*r-a*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(o*e-n*r)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Rr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(ju.makeScale(t,e)),this}rotate(t){return Rr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(ju.makeRotation(-t)),this}translate(t,e){return Rr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(ju.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};nd.prototype.isMatrix3=!0;Xt=nd,ju=new Xt,qp=new Xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Zp=new Xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);ne=Rx();Dc=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{fo===void 0&&(fo=Do("canvas")),fo.width=t.width,fo.height=t.height;let i=fo.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=fo}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Do("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ms(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ms(e[n]/255)*255):e[n]=Ms(e[n]);return{data:e,width:t.width,height:t.height}}else return Ht("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Cx=0,Uo=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Cx++}),this.uuid=hl(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(tf(i[o].image)):r.push(tf(i[o]))}else r=tf(i);n.url=r}return e||(t.images[this.uuid]=n),n}};Px=0,ef=new H,Nn=class s extends Qi{constructor(t=s.DEFAULT_IMAGE,e=s.DEFAULT_MAPPING,n=Li,i=Li,r=Qe,o=is,a=Zi,l=ai,c=s.DEFAULT_ANISOTROPY,h=Es){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Px++}),this.uuid=hl(),this.name="",this.source=new Uo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new kt(0,0),this.repeat=new kt(1,1),this.center=new kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(ef).x}get height(){return this.source.getSize(ef).y}get depth(){return this.source.getSize(ef).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Ht(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Ht(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Ff)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Io:t.x=t.x-Math.floor(t.x);break;case Li:t.x=t.x<0?0:1;break;case Pc:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Io:t.y=t.y-Math.floor(t.y);break;case Li:t.y=t.y<0?0:1;break;case Pc:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Nn.DEFAULT_IMAGE=null;Nn.DEFAULT_MAPPING=Ff;Nn.DEFAULT_ANISOTROPY=1;id=class id{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r,l=t.elements,c=l[0],h=l[4],d=l[8],u=l[1],f=l[5],m=l[9],x=l[2],p=l[6],g=l[10];if(Math.abs(h-u)<.01&&Math.abs(d-x)<.01&&Math.abs(m-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+x)<.1&&Math.abs(m+p)<.1&&Math.abs(c+f+g-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let S=(c+1)/2,y=(f+1)/2,b=(g+1)/2,T=(h+u)/4,_=(d+x)/4,M=(m+p)/4;return S>y&&S>b?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=T/n,r=_/n):y>b?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=T/i,r=M/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=_/r,i=M/r),this.set(n,i,r,e),this}let v=Math.sqrt((p-m)*(p-m)+(d-x)*(d-x)+(u-h)*(u-h));return Math.abs(v)<.001&&(v=1),this.x=(p-m)/v,this.y=(d-x)/v,this.z=(u-h)/v,this.w=Math.acos((c+f+g-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this.w=jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this.w=jt(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};id.prototype.isVector4=!0;Be=id,Nc=class extends Qi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Be(0,0,t,e),this.scissorTest=!1,this.viewport=new Be(0,0,t,e),this.textures=[];let i=n.count;for(let r=0;r<i;r++)this.textures[r]=new Nn({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let i=Object.assign({},t.textures[e].image);this.textures[e].source=new Uo(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},je=class extends Nc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ia=class extends Nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=yn,this.minFilter=yn,this.wrapR=Li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}},Uc=class extends Nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=yn,this.minFilter=yn,this.wrapR=Li,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}},eh=class eh{constructor(t,e,n,i,r,o,a,l,c,h,d,u,f,m,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,l,c,h,d,u,f,m,x,p)}set(t,e,n,i,r,o,a,l,c,h,d,u,f,m,x,p){let g=this.elements;return g[0]=t,g[4]=e,g[8]=n,g[12]=i,g[1]=r,g[5]=o,g[9]=a,g[13]=l,g[2]=c,g[6]=h,g[10]=d,g[14]=u,g[3]=f,g[7]=m,g[11]=x,g[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new eh().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,i=1/po.setFromMatrixColumn(t,0).length(),r=1/po.setFromMatrixColumn(t,1).length(),o=1/po.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),d=Math.sin(r);if(t.order==="XYZ"){let u=o*h,f=o*d,m=a*h,x=a*d;e[0]=l*h,e[4]=-l*d,e[8]=c,e[1]=f+m*c,e[5]=u-x*c,e[9]=-a*l,e[2]=x-u*c,e[6]=m+f*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,f=l*d,m=c*h,x=c*d;e[0]=u+x*a,e[4]=m*a-f,e[8]=o*c,e[1]=o*d,e[5]=o*h,e[9]=-a,e[2]=f*a-m,e[6]=x+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,f=l*d,m=c*h,x=c*d;e[0]=u-x*a,e[4]=-o*d,e[8]=m+f*a,e[1]=f+m*a,e[5]=o*h,e[9]=x-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,f=o*d,m=a*h,x=a*d;e[0]=l*h,e[4]=m*c-f,e[8]=u*c+x,e[1]=l*d,e[5]=x*c+u,e[9]=f*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,f=o*c,m=a*l,x=a*c;e[0]=l*h,e[4]=x-u*d,e[8]=m*d+f,e[1]=d,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=f*d+m,e[10]=u-x*d}else if(t.order==="XZY"){let u=o*l,f=o*c,m=a*l,x=a*c;e[0]=l*h,e[4]=-d,e[8]=c*h,e[1]=u*d+x,e[5]=o*h,e[9]=f*d-m,e[2]=m*d-f,e[6]=a*h,e[10]=x*d+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ix,t,Lx)}lookAt(t,e,n){let i=this.elements;return gi.subVectors(t,e),gi.lengthSq()===0&&(gi.z=1),gi.normalize(),Hs.crossVectors(n,gi),Hs.lengthSq()===0&&(Math.abs(n.z)===1?gi.x+=1e-4:gi.z+=1e-4,gi.normalize(),Hs.crossVectors(n,gi)),Hs.normalize(),tc.crossVectors(gi,Hs),i[0]=Hs.x,i[4]=tc.x,i[8]=gi.x,i[1]=Hs.y,i[5]=tc.y,i[9]=gi.y,i[2]=Hs.z,i[6]=tc.z,i[10]=gi.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],d=n[5],u=n[9],f=n[13],m=n[2],x=n[6],p=n[10],g=n[14],v=n[3],S=n[7],y=n[11],b=n[15],T=i[0],_=i[4],M=i[8],R=i[12],A=i[1],D=i[5],L=i[9],F=i[13],P=i[2],B=i[6],k=i[10],O=i[14],Q=i[3],W=i[7],I=i[11],nt=i[15];return r[0]=o*T+a*A+l*P+c*Q,r[4]=o*_+a*D+l*B+c*W,r[8]=o*M+a*L+l*k+c*I,r[12]=o*R+a*F+l*O+c*nt,r[1]=h*T+d*A+u*P+f*Q,r[5]=h*_+d*D+u*B+f*W,r[9]=h*M+d*L+u*k+f*I,r[13]=h*R+d*F+u*O+f*nt,r[2]=m*T+x*A+p*P+g*Q,r[6]=m*_+x*D+p*B+g*W,r[10]=m*M+x*L+p*k+g*I,r[14]=m*R+x*F+p*O+g*nt,r[3]=v*T+S*A+y*P+b*Q,r[7]=v*_+S*D+y*B+b*W,r[11]=v*M+S*L+y*k+b*I,r[15]=v*R+S*F+y*O+b*nt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],d=t[6],u=t[10],f=t[14],m=t[3],x=t[7],p=t[11],g=t[15],v=l*f-c*u,S=a*f-c*d,y=a*u-l*d,b=o*f-c*h,T=o*u-l*h,_=o*d-a*h;return e*(x*v-p*S+g*y)-n*(m*v-p*b+g*T)+i*(m*S-x*b+g*_)-r*(m*y-x*T+p*_)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+i*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],d=t[9],u=t[10],f=t[11],m=t[12],x=t[13],p=t[14],g=t[15],v=e*a-n*o,S=e*l-i*o,y=e*c-r*o,b=n*l-i*a,T=n*c-r*a,_=i*c-r*l,M=h*x-d*m,R=h*p-u*m,A=h*g-f*m,D=d*p-u*x,L=d*g-f*x,F=u*g-f*p,P=v*F-S*L+y*D+b*A-T*R+_*M;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let B=1/P;return t[0]=(a*F-l*L+c*D)*B,t[1]=(i*L-n*F-r*D)*B,t[2]=(x*_-p*T+g*b)*B,t[3]=(u*T-d*_-f*b)*B,t[4]=(l*A-o*F-c*R)*B,t[5]=(e*F-i*A+r*R)*B,t[6]=(p*y-m*_-g*S)*B,t[7]=(h*_-u*y+f*S)*B,t[8]=(o*L-a*A+c*M)*B,t[9]=(n*A-e*L-r*M)*B,t[10]=(m*T-x*y+g*v)*B,t[11]=(d*y-h*T-f*v)*B,t[12]=(a*R-o*D-l*M)*B,t[13]=(e*D-n*R+i*M)*B,t[14]=(x*S-m*b-p*v)*B,t[15]=(h*b-d*S+u*v)*B,this}scale(t){let e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,h*a+n,h*l-i*o,0,c*l-i*a,h*l+i*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,d=a+a,u=r*c,f=r*h,m=r*d,x=o*h,p=o*d,g=a*d,v=l*c,S=l*h,y=l*d,b=n.x,T=n.y,_=n.z;return i[0]=(1-(x+g))*b,i[1]=(f+y)*b,i[2]=(m-S)*b,i[3]=0,i[4]=(f-y)*T,i[5]=(1-(u+g))*T,i[6]=(p+v)*T,i[7]=0,i[8]=(m+S)*_,i[9]=(p-v)*_,i[10]=(1-(u+x))*_,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=po.set(i[0],i[1],i[2]).length(),a=po.set(i[4],i[5],i[6]).length(),l=po.set(i[8],i[9],i[10]).length();r<0&&(o=-o),Hi.copy(this);let c=1/o,h=1/a,d=1/l;return Hi.elements[0]*=c,Hi.elements[1]*=c,Hi.elements[2]*=c,Hi.elements[4]*=h,Hi.elements[5]*=h,Hi.elements[6]*=h,Hi.elements[8]*=d,Hi.elements[9]*=d,Hi.elements[10]*=d,e.setFromRotationMatrix(Hi),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,r,o,a=Di,l=!1){let c=this.elements,h=2*r/(e-t),d=2*r/(n-i),u=(e+t)/(e-t),f=(n+i)/(n-i),m,x;if(l)m=r/(o-r),x=o*r/(o-r);else if(a===Di)m=-(o+r)/(o-r),x=-2*o*r/(o-r);else if(a===Lo)m=-o/(o-r),x=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=Di,l=!1){let c=this.elements,h=2/(e-t),d=2/(n-i),u=-(e+t)/(e-t),f=-(n+i)/(n-i),m,x;if(l)m=1/(o-r),x=o/(o-r);else if(a===Di)m=-2/(o-r),x=-(o+r)/(o-r);else if(a===Lo)m=-1/(o-r),x=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=m,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};eh.prototype.isMatrix4=!0;ie=eh,po=new H,Hi=new ie,Ix=new H(0,0,0),Lx=new H(1,1,1),Hs=new H,tc=new H,gi=new H,Jp=new ie,$p=new ri,oi=class s{constructor(t=0,e=0,n=0,i=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,r=i[0],o=i[4],a=i[8],l=i[1],c=i[5],h=i[9],d=i[2],u=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(jt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-jt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,f),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,f),this._y=0);break;default:Ht("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jp.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jp,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return $p.setFromEuler(this),this.setFromQuaternion($p,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};oi.DEFAULT_ORDER="XYZ";La=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Dx=0,Kp=new H,mo=new ri,ps=new ie,ec=new H,ba=new H,Nx=new H,Ux=new ri,Qp=new H(1,0,0),jp=new H(0,1,0),tm=new H(0,0,1),em={type:"added"},Fx={type:"removed"},go={type:"childadded",child:null},nf={type:"childremoved",child:null},Un=class s extends Qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dx++}),this.uuid=hl(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new H,e=new oi,n=new ri,i=new H(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ie},normalMatrix:{value:new Xt}}),this.matrix=new ie,this.matrixWorld=new ie,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new La,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return mo.setFromAxisAngle(t,e),this.quaternion.multiply(mo),this}rotateOnWorldAxis(t,e){return mo.setFromAxisAngle(t,e),this.quaternion.premultiply(mo),this}rotateX(t){return this.rotateOnAxis(Qp,t)}rotateY(t){return this.rotateOnAxis(jp,t)}rotateZ(t){return this.rotateOnAxis(tm,t)}translateOnAxis(t,e){return Kp.copy(t).applyQuaternion(this.quaternion),this.position.add(Kp.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qp,t)}translateY(t){return this.translateOnAxis(jp,t)}translateZ(t){return this.translateOnAxis(tm,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ps.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ec.copy(t):ec.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),ba.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ps.lookAt(ba,ec,this.up):ps.lookAt(ec,ba,this.up),this.quaternion.setFromRotationMatrix(ps),i&&(ps.extractRotation(i.matrixWorld),mo.setFromRotationMatrix(ps),this.quaternion.premultiply(mo.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Vt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(em),go.child=t,this.dispatchEvent(go),go.child=null):Vt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Fx),nf.child=t,this.dispatchEvent(nf),nf.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ps.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ps.multiply(t.parent.matrixWorld)),t.applyMatrix4(ps),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(em),go.child=t,this.dispatchEvent(go),go.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ba,t,Nx),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ba,Ux,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let d=l[c];r(t.shapes,d)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];i.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),d=o(t.shapes),u=o(t.skeletons),f=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),f.length>0&&(n.animations=f),m.length>0&&(n.nodes=m)}return n.object=i,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Un.DEFAULT_UP=new H(0,1,0);Un.DEFAULT_MATRIX_AUTO_UPDATE=!0;Un.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;Xi=class extends Un{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ox={type:"move"},Fo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new H,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new H),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new H,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new H,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let x of t.hand.values()){let p=e.getJointPose(x,n),g=this._getHandJoint(c,x);p!==null&&(g.matrix.fromArray(p.transform.matrix),g.matrix.decompose(g.position,g.quaternion,g.scale),g.matrixWorldNeedsUpdate=!0,g.jointRadius=p.radius),g.visible=p!==null}let h=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],u=h.position.distanceTo(d.position),f=.02,m=.005;c.inputState.pinching&&u>f+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=f-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Ox)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Xi;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},ig={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gs={h:0,s:0,l:0},nc={h:0,s:0,l:0};Ot=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Tn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ne.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=ne.workingColorSpace){return this.r=t,this.g=e,this.b=n,ne.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=ne.workingColorSpace){if(t=wx(t,1),e=jt(e,0,1),n=jt(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=sf(o,r,t+1/3),this.g=sf(o,r,t),this.b=sf(o,r,t-1/3)}return ne.colorSpaceToWorking(this,i),this}setStyle(t,e=Tn){function n(r){r!==void 0&&parseFloat(r)<1&&Ht("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Ht("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Ht("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Tn){let n=ig[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Ht("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ms(t.r),this.g=Ms(t.g),this.b=Ms(t.b),this}copyLinearToSRGB(t){return this.r=Ro(t.r),this.g=Ro(t.g),this.b=Ro(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Tn){return ne.workingToColorSpace(Dn.copy(this),t),Math.round(jt(Dn.r*255,0,255))*65536+Math.round(jt(Dn.g*255,0,255))*256+Math.round(jt(Dn.b*255,0,255))}getHexString(t=Tn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ne.workingColorSpace){ne.workingToColorSpace(Dn.copy(this),e);let n=Dn.r,i=Dn.g,r=Dn.b,o=Math.max(n,i,r),a=Math.min(n,i,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=h<=.5?d/(o+a):d/(2-o-a),o){case n:l=(i-r)/d+(i<r?6:0);break;case i:l=(r-n)/d+2;break;case r:l=(n-i)/d+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ne.workingColorSpace){return ne.workingToColorSpace(Dn.copy(this),e),t.r=Dn.r,t.g=Dn.g,t.b=Dn.b,t}getStyle(t=Tn){ne.workingToColorSpace(Dn.copy(this),t);let e=Dn.r,n=Dn.g,i=Dn.b;return t!==Tn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Gs),this.setHSL(Gs.h+t,Gs.s+e,Gs.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Gs),t.getHSL(nc);let n=Ku(Gs.h,nc.h,e),i=Ku(Gs.s,nc.s,e),r=Ku(Gs.l,nc.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Dn=new Ot;Ot.NAMES=ig;Da=class s{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Ot(t),this.density=e}clone(){return new s(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},Na=class extends Un{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Gi=new H,ms=new H,rf=new H,gs=new H,_o=new H,xo=new H,nm=new H,of=new H,af=new H,lf=new H,cf=new Be,hf=new Be,uf=new Be,Ys=class s{constructor(t=new H,e=new H,n=new H){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Gi.subVectors(t,e),i.cross(Gi);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Gi.subVectors(i,e),ms.subVectors(n,e),rf.subVectors(t,e);let o=Gi.dot(Gi),a=Gi.dot(ms),l=Gi.dot(rf),c=ms.dot(ms),h=ms.dot(rf),d=o*c-a*a;if(d===0)return r.set(0,0,0),null;let u=1/d,f=(c*l-a*h)*u,m=(o*h-a*l)*u;return r.set(1-f-m,m,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,gs)===null?!1:gs.x>=0&&gs.y>=0&&gs.x+gs.y<=1}static getInterpolation(t,e,n,i,r,o,a,l){return this.getBarycoord(t,e,n,i,gs)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,gs.x),l.addScaledVector(o,gs.y),l.addScaledVector(a,gs.z),l)}static getInterpolatedAttribute(t,e,n,i,r,o){return cf.setScalar(0),hf.setScalar(0),uf.setScalar(0),cf.fromBufferAttribute(t,e),hf.fromBufferAttribute(t,n),uf.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(cf,r.x),o.addScaledVector(hf,r.y),o.addScaledVector(uf,r.z),o}static isFrontFacing(t,e,n,i){return Gi.subVectors(n,e),ms.subVectors(t,e),Gi.cross(ms).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gi.subVectors(this.c,this.b),ms.subVectors(this.a,this.b),Gi.cross(ms).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return s.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return s.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return s.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return s.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return s.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,r=this.c,o,a;_o.subVectors(i,n),xo.subVectors(r,n),of.subVectors(t,n);let l=_o.dot(of),c=xo.dot(of);if(l<=0&&c<=0)return e.copy(n);af.subVectors(t,i);let h=_o.dot(af),d=xo.dot(af);if(h>=0&&d<=h)return e.copy(i);let u=l*d-h*c;if(u<=0&&l>=0&&h<=0&&l-h>0)return o=l/(l-h),e.copy(n).addScaledVector(_o,o);lf.subVectors(t,r);let f=_o.dot(lf),m=xo.dot(lf);if(m>=0&&f<=m)return e.copy(r);let x=f*c-l*m;if(x<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(xo,a);let p=h*m-f*d;if(p<=0&&d-h>=0&&f-m>=0)return nm.subVectors(r,i),a=(d-h)/(d-h+(f-m)),e.copy(i).addScaledVector(nm,a);let g=1/(p+x+u);return o=x*g,a=u*g,e.copy(n).addScaledVector(_o,o).addScaledVector(xo,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ji=class{constructor(t=new H(1/0,1/0,1/0),e=new H(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Vi.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Vi.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Vi.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Vi):Vi.fromBufferAttribute(r,o),Vi.applyMatrix4(t.matrixWorld),this.expandByPoint(Vi);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ic.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ic.copy(n.boundingBox)),ic.applyMatrix4(t.matrixWorld),this.union(ic)}let i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Vi),Vi.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ta),sc.subVectors(this.max,Ta),vo.subVectors(t.a,Ta),yo.subVectors(t.b,Ta),Mo.subVectors(t.c,Ta),Vs.subVectors(yo,vo),Ws.subVectors(Mo,yo),Tr.subVectors(vo,Mo);let e=[0,-Vs.z,Vs.y,0,-Ws.z,Ws.y,0,-Tr.z,Tr.y,Vs.z,0,-Vs.x,Ws.z,0,-Ws.x,Tr.z,0,-Tr.x,-Vs.y,Vs.x,0,-Ws.y,Ws.x,0,-Tr.y,Tr.x,0];return!ff(e,vo,yo,Mo,sc)||(e=[1,0,0,0,1,0,0,0,1],!ff(e,vo,yo,Mo,sc))?!1:(rc.crossVectors(Vs,Ws),e=[rc.x,rc.y,rc.z],ff(e,vo,yo,Mo,sc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Vi).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Vi).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(_s[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),_s[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),_s[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),_s[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),_s[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),_s[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),_s[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),_s[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(_s),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},_s=[new H,new H,new H,new H,new H,new H,new H,new H],Vi=new H,ic=new ji,vo=new H,yo=new H,Mo=new H,Vs=new H,Ws=new H,Tr=new H,Ta=new H,sc=new H,rc=new H,wr=new H;ys=Bx();qs=class{static toHalfFloat(t){return zx(t)}static fromHalfFloat(t){return kx(t)}},an=new H,oc=new kt,Hx=0,Yi=class extends Qi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Hx++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Km,this.updateRanges=[],this.gpuType=$n,this.version=0,this._normalizationScale=t!==void 0?Zf(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)oc.fromBufferAttribute(this,e),oc.applyMatrix3(t),this.setXY(e,oc.x,oc.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyMatrix3(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyMatrix4(t),this.setXYZ(e,an.x,an.y,an.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.applyNormalMatrix(t),this.setXYZ(e,an.x,an.y,an.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)an.fromBufferAttribute(this,e),an.transformDirection(t),this.setXYZ(e,an.x,an.y,an.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Ex(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Ax(t,this.array)}},Ua=class extends Yi{constructor(t,e,n){super(new Uint16Array(t),e,n)}},Fa=class extends Yi{constructor(t,e,n){super(new Uint32Array(t),e,n)}},Pe=class extends Yi{constructor(t,e,n){super(new Float32Array(t),e,n)}},Gx=new ji,wa=new H,df=new H,Zs=class{constructor(t=new H,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Gx.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;wa.subVectors(t,this.center);let e=wa.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(wa,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(df.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(wa.copy(t.center).add(df)),this.expandByPoint(wa.copy(t.center).sub(df))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Vx=0,Ii=new ie,pf=new Un,So=new H,_i=new ji,Ea=new ji,vn=new H,xi=class s extends Qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Vx++}),this.uuid=hl(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(bx(t)?Fa:Ua)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Xt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Ii.makeRotationFromQuaternion(t),this.applyMatrix4(Ii),this}rotateX(t){return Ii.makeRotationX(t),this.applyMatrix4(Ii),this}rotateY(t){return Ii.makeRotationY(t),this.applyMatrix4(Ii),this}rotateZ(t){return Ii.makeRotationZ(t),this.applyMatrix4(Ii),this}translate(t,e,n){return Ii.makeTranslation(t,e,n),this.applyMatrix4(Ii),this}scale(t,e,n){return Ii.makeScale(t,e,n),this.applyMatrix4(Ii),this}lookAt(t){return pf.lookAt(t),pf.updateMatrix(),this.applyMatrix4(pf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(So).negate(),this.translate(So.x,So.y,So.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let i=0,r=t.length;i<r;i++){let o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pe(n,3))}else{let n=Math.min(t.length,e.count);for(let i=0;i<n;i++){let r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Ht("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ji);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Vt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new H(-1/0,-1/0,-1/0),new H(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let r=e[n];_i.setFromBufferAttribute(r),this.morphTargetsRelative?(vn.addVectors(this.boundingBox.min,_i.min),this.boundingBox.expandByPoint(vn),vn.addVectors(this.boundingBox.max,_i.max),this.boundingBox.expandByPoint(vn)):(this.boundingBox.expandByPoint(_i.min),this.boundingBox.expandByPoint(_i.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Vt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Zs);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Vt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new H,1/0);return}if(t){let n=this.boundingSphere.center;if(_i.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Ea.setFromBufferAttribute(a),this.morphTargetsRelative?(vn.addVectors(_i.min,Ea.min),_i.expandByPoint(vn),vn.addVectors(_i.max,Ea.max),_i.expandByPoint(vn)):(_i.expandByPoint(Ea.min),_i.expandByPoint(Ea.max))}_i.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)vn.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(vn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)vn.fromBufferAttribute(a,c),l&&(So.fromBufferAttribute(t,c),vn.add(So)),i=Math.max(i,n.distanceToSquared(vn))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&Vt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Vt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new Yi(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[],c=new Uint8Array(n.count);for(let R=0;R<n.count;R++)a[R]=new H,l[R]=new H;let h=new H,d=new H,u=new H,f=new kt,m=new kt,x=new kt,p=new H,g=new H;function v(R,A,D){c[R]=c[A]=c[D]=1,h.fromBufferAttribute(n,R),d.fromBufferAttribute(n,A),u.fromBufferAttribute(n,D),f.fromBufferAttribute(r,R),m.fromBufferAttribute(r,A),x.fromBufferAttribute(r,D),d.sub(h),u.sub(h),m.sub(f),x.sub(f);let L=1/(m.x*x.y-x.x*m.y);isFinite(L)&&(p.copy(d).multiplyScalar(x.y).addScaledVector(u,-m.y).multiplyScalar(L),g.copy(u).multiplyScalar(m.x).addScaledVector(d,-x.x).multiplyScalar(L),a[R].add(p),a[A].add(p),a[D].add(p),l[R].add(g),l[A].add(g),l[D].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let R=0,A=S.length;R<A;++R){let D=S[R],L=D.start,F=D.count;for(let P=L,B=L+F;P<B;P+=3)v(t.getX(P+0),t.getX(P+1),t.getX(P+2))}let y=new H,b=new H,T=new H,_=new H;function M(R){T.fromBufferAttribute(i,R),_.copy(T);let A=a[R];y.copy(A),y.sub(T.multiplyScalar(T.dot(A))).normalize(),b.crossVectors(_,A);let L=b.dot(l[R])<0?-1:1;o.setXYZW(R,y.x,y.y,y.z,L)}for(let R=0,A=n.count;R<A;++R)c[R]&&M(R);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Yi(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,f=n.count;u<f;u++)n.setXYZ(u,0,0,0);let i=new H,r=new H,o=new H,a=new H,l=new H,c=new H,h=new H,d=new H;if(t)for(let u=0,f=t.count;u<f;u+=3){let m=t.getX(u+0),x=t.getX(u+1),p=t.getX(u+2);i.fromBufferAttribute(e,m),r.fromBufferAttribute(e,x),o.fromBufferAttribute(e,p),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,p),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,f=e.count;u<f;u+=3)i.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),d.subVectors(i,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)vn.fromBufferAttribute(t,e),vn.normalize(),t.setXYZ(e,vn.x,vn.y,vn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,d=a.normalized,u=new c.constructor(l.length*h),f=0,m=0;for(let x=0,p=l.length;x<p;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*h;for(let g=0;g<h;g++)u[m++]=c[f++]}return new Yi(u,h,d)}if(this.index===null)return Ht("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new s,n=this.index.array,i=this.attributes;for(let a in i){let l=i[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,d=c.length;h<d;h++){let u=c[h],f=t(u,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let i={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let d=0,u=c.length;d<u;d++){let f=c[d];h.push(f.toJSON(t.data))}h.length>0&&(i[l]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let i=t.attributes;for(let c in i){let h=i[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],d=r[c];for(let u=0,f=d.length;u<f;u++)h.push(d[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},mf=new H,Wx=new H,Xx=new Xt,Wi=class{constructor(t=new H(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=mf.subVectors(n,e).cross(Wx.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let i=t.delta(mf),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Xx.getNormalMatrix(t),i=this.coplanarPoint(mf).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Yx=0,Js=class extends Qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Yx++}),this.uuid=hl(),this.name="",this.type="Material",this.blending=Go,this.side=nr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Df,this.blendDst=Nf,this.blendEquation=Fr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ot(0,0,0),this.blendAlpha=0,this.depthFunc=Po,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Xm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Sc,this.stencilZFail=Sc,this.stencilZPass=Sc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Ht(`Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){Ht(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Ot().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new Wi().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new kt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new kt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},xs=new H,gf=new H,ac=new H,lc=new H,Fc=class{constructor(t=new H,e=new H(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xs)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=xs.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xs.copy(this.origin).addScaledVector(this.direction,e),xs.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){gf.copy(t).add(e).multiplyScalar(.5),ac.copy(e).sub(t).normalize(),lc.copy(this.origin).sub(gf);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ac),a=lc.dot(this.direction),l=-lc.dot(ac),c=lc.lengthSq(),h=Math.abs(1-o*o),d,u,f,m;if(h>0)if(d=o*l-a,u=o*a-l,m=r*h,d>=0)if(u>=-m)if(u<=m){let x=1/h;d*=x,u*=x,f=d*(d+o*u+2*a)+u*(o*d+u+2*l)+c}else u=r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u=-r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;else u<=-m?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c):u<=m?(d=0,u=Math.min(Math.max(-r,-l),r),f=u*(u+2*l)+c):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-l),r),f=-d*d+u*(u+2*l)+c);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),f=-d*d+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,d),i&&i.copy(gf).addScaledVector(ac,u),f}intersectSphere(t,e){if(t.radius<0)return null;xs.subVectors(t.center,this.origin);let n=xs.dot(this.direction),i=xs.dot(xs)-n*n,r=t.radius*t.radius;if(i>r)return null;let o=Math.sqrt(r-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,i=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,i=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),d>=0?(a=(t.min.z-u.z)*d,l=(t.max.z-u.z)*d):(a=(t.max.z-u.z)*d,l=(t.min.z-u.z)*d),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,xs)!==null}intersectTriangle(t,e,n,i,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,d=t.x-o.x,u=t.y-o.y,f=t.z-o.z,m=e.x-o.x,x=e.y-o.y,p=e.z-o.z,g=n.x-o.x,v=n.y-o.y,S=n.z-o.z,y=Math.abs(l),b=Math.abs(c),T=Math.abs(h),_,M,R,A,D,L,F,P,B,k,O,Q;if(y>=b&&y>=T?(R=l,L=d,B=m,Q=g,l>=0?(_=c,M=h,A=u,D=f,F=x,P=p,k=v,O=S):(_=h,M=c,A=f,D=u,F=p,P=x,k=S,O=v)):b>=T?(R=c,L=u,B=x,Q=v,c>=0?(_=h,M=l,A=f,D=d,F=p,P=m,k=S,O=g):(_=l,M=h,A=d,D=f,F=m,P=p,k=g,O=S)):(R=h,L=f,B=p,Q=S,h>=0?(_=l,M=c,A=d,D=u,F=m,P=x,k=g,O=v):(_=c,M=l,A=u,D=d,F=x,P=m,k=v,O=g)),R===0)return null;let W=_/R,I=M/R,nt=1/R,_t=A-W*L,Et=D-I*L,Z=F-W*B,ht=P-I*B,Mt=k-W*Q,bt=O-I*Q,mt=Mt*ht-bt*Z,Nt=_t*bt-Et*Mt,Me=Z*Et-ht*_t;if(i){if(mt<0||Nt<0||Me<0)return null}else if((mt<0||Nt<0||Me<0)&&(mt>0||Nt>0||Me>0))return null;let At=mt+Nt+Me;if(At===0)return null;let Yt=nt*(mt*L+Nt*B+Me*Q);return(At>0?Yt<0:Yt>0)?null:this.at(Yt/At,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ts=class extends Js{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=Uf,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},im=new ie,Er=new Fc,cc=new Zs,sm=new H,hc=new H,uc=new H,fc=new H,_f=new H,dc=new H,rm=new H,pc=new H,Jt=class extends Un{constructor(t=new xi,e=new ts){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(r&&a){dc.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],d=r[l];h!==0&&(_f.fromBufferAttribute(d,t),o?dc.addScaledVector(_f,h):dc.addScaledVector(_f.sub(e),h))}e.add(dc)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),cc.copy(n.boundingSphere),cc.applyMatrix4(r),Er.copy(t.ray).recast(t.near),!(cc.containsPoint(Er.origin)===!1&&(Er.intersectSphere(cc,sm)===null||Er.origin.distanceToSquared(sm)>(t.far-t.near)**2))&&(im.copy(r).invert(),Er.copy(t.ray).applyMatrix4(im),!(n.boundingBox!==null&&Er.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Er)))}_computeIntersections(t,e,n){let i,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,f=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,x=u.length;m<x;m++){let p=u[m],g=o[p.materialIndex],v=Math.max(p.start,f.start),S=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,b=S;y<b;y+=3){let T=a.getX(y),_=a.getX(y+1),M=a.getX(y+2);i=mc(this,g,t,n,c,h,d,T,_,M),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){let v=a.getX(p),S=a.getX(p+1),y=a.getX(p+2);i=mc(this,o,t,n,c,h,d,v,S,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,x=u.length;m<x;m++){let p=u[m],g=o[p.materialIndex],v=Math.max(p.start,f.start),S=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let y=v,b=S;y<b;y+=3){let T=y,_=y+1,M=y+2;i=mc(this,g,t,n,c,h,d,T,_,M),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let m=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=m,g=x;p<g;p+=3){let v=p,S=p+1,y=p+2;i=mc(this,o,t,n,c,h,d,v,S,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}};Pr=class extends Nn{constructor(t=null,e=1,n=1,i,r,o,a,l,c=yn,h=yn,d,u){super(null,o,a,l,c,h,i,r,d,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},Oa=class extends Yi{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},bo=new ie,om=new ie,gc=[],am=new ji,Zx=new ie,Aa=new Jt,Ra=new Zs,Zn=class extends Jt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Oa(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Zx)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ji),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bo),am.copy(t.boundingBox).applyMatrix4(bo),this.boundingBox.union(am)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Zs),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,bo),Ra.copy(t.boundingSphere).applyMatrix4(bo),this.boundingSphere.union(Ra)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=t*r+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(Aa.geometry=this.geometry,Aa.material=this.material,Aa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ra.copy(this.boundingSphere),Ra.applyMatrix4(n),t.ray.intersectsSphere(Ra)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,bo),om.multiplyMatrices(n,bo),Aa.matrixWorld=om,Aa.raycast(t,gc);for(let o=0,a=gc.length;o<a;o++){let l=gc[o];l.instanceId=r,l.object=this,e.push(l)}gc.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Oa(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Pr(new Float32Array(i*this.count),i,this.count,lh,$n));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<n.length;c++)o+=n[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return r[l]=a,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ar=new Zs,Jx=new kt(.5,.5),_c=new H,$s=class{constructor(t=new Wi,e=new Wi,n=new Wi,i=new Wi,r=new Wi,o=new Wi){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Di,n=!1){let i=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],d=r[5],u=r[6],f=r[7],m=r[8],x=r[9],p=r[10],g=r[11],v=r[12],S=r[13],y=r[14],b=r[15];if(i[0].setComponents(c-o,f-h,g-m,b-v).normalize(),i[1].setComponents(c+o,f+h,g+m,b+v).normalize(),i[2].setComponents(c+a,f+d,g+x,b+S).normalize(),i[3].setComponents(c-a,f-d,g-x,b-S).normalize(),n)i[4].setComponents(l,u,p,y).normalize(),i[5].setComponents(c-l,f-u,g-p,b-y).normalize();else if(i[4].setComponents(c-l,f-u,g-p,b-y).normalize(),e===Di)i[5].setComponents(c+l,f+u,g+p,b+y).normalize();else if(e===Lo)i[5].setComponents(l,u,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ar.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ar.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ar)}intersectsSprite(t){Ar.center.set(0,0,0);let e=Jx.distanceTo(t.center);return Ar.radius=.7071067811865476+e,Ar.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ar)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if(_c.x=i.normal.x>0?t.max.x:t.min.x,_c.y=i.normal.y>0?t.max.y:t.min.y,_c.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(_c)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},lm=new ie,Oc=class s{constructor(){this.coordinateSystem=Di,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,n=this._frustums;for(let i=0;i<e.length;i++){let r=e[i];lm.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new $s),n[i].setFromProjectionMatrix(lm,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,n=t._frustums;for(let i=0;i<t._count;i++)e[i]===void 0&&(e[i]=new $s),e[i].copy(n[i]);return this._count=t._count,this}clone(){return new s().copy(this)}},Ba=class extends Nn{constructor(t=[],e=Br,n,i,r,o,a,l,c,h){super(t,e,n,i,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},za=class extends Nn{constructor(t,e,n,i,r,o,a,l,c){super(t,e,n,i,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}},bs=class extends Nn{constructor(t,e,n=qi,i,r,o,a=yn,l=yn,c,h=Ss,d=1){if(h!==Ss&&h!==ws)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:d};super(u,i,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Uo(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},ka=class extends bs{constructor(t,e=qi,n=Br,i,r,o=yn,a=yn,l,c=Ss){let h={width:t,height:t,depth:1},d=[h,h,h,h,h,h];super(t,t,e,n,i,r,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},Ha=class extends Nn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},Ie=class s extends xi{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],d=[],u=0,f=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,i,o,2),m("x","z","y",1,-1,t,n,-e,i,o,3),m("x","y","z",1,-1,t,e,n,i,r,4),m("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Pe(c,3)),this.setAttribute("normal",new Pe(h,3)),this.setAttribute("uv",new Pe(d,2));function m(x,p,g,v,S,y,b,T,_,M,R){let A=y/_,D=b/M,L=y/2,F=b/2,P=T/2,B=_+1,k=M+1,O=0,Q=0,W=new H;for(let I=0;I<k;I++){let nt=I*D-F;for(let _t=0;_t<B;_t++){let Et=_t*A-L;W[x]=Et*v,W[p]=nt*S,W[g]=P,c.push(W.x,W.y,W.z),W[x]=0,W[p]=0,W[g]=T>0?1:-1,h.push(W.x,W.y,W.z),d.push(_t/_),d.push(1-I/M),O+=1}}for(let I=0;I<M;I++)for(let nt=0;nt<_;nt++){let _t=u+nt+B*I,Et=u+nt+B*(I+1),Z=u+(nt+1)+B*(I+1),ht=u+(nt+1)+B*I;l.push(_t,Et,ht),l.push(Et,Z,ht),Q+=6}a.addGroup(f,Q,R),f+=Q,u+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}},Ks=class s extends xi{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};let c=this;i=Math.floor(i),r=Math.floor(r);let h=[],d=[],u=[],f=[],m=0,x=[],p=n/2,g=0;v(),o===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(h),this.setAttribute("position",new Pe(d,3)),this.setAttribute("normal",new Pe(u,3)),this.setAttribute("uv",new Pe(f,2));function v(){let y=new H,b=new H,T=0,_=(e-t)/n;for(let M=0;M<=r;M++){let R=[],A=M/r,D=A*(e-t)+t;for(let L=0;L<=i;L++){let F=L/i,P=F*l+a,B=Math.sin(P),k=Math.cos(P);b.x=D*B,b.y=-A*n+p,b.z=D*k,d.push(b.x,b.y,b.z),y.set(B,_,k).normalize(),u.push(y.x,y.y,y.z),f.push(F,1-A),R.push(m++)}x.push(R)}for(let M=0;M<i;M++)for(let R=0;R<r;R++){let A=x[R][M],D=x[R+1][M],L=x[R+1][M+1],F=x[R][M+1];(t>0||R!==0)&&(h.push(A,D,F),T+=3),(e>0||R!==r-1)&&(h.push(D,L,F),T+=3)}c.addGroup(g,T,0),g+=T}function S(y){let b=m,T=new kt,_=new H,M=0,R=y===!0?t:e,A=y===!0?1:-1;for(let L=1;L<=i;L++)d.push(0,p*A,0),u.push(0,A,0),f.push(.5,.5),m++;let D=m;for(let L=0;L<=i;L++){let P=L/i*l+a,B=Math.cos(P),k=Math.sin(P);_.x=R*k,_.y=p*A,_.z=R*B,d.push(_.x,_.y,_.z),u.push(0,A,0),T.x=B*.5+.5,T.y=k*.5*A+.5,f.push(T.x,T.y),m++}for(let L=0;L<i;L++){let F=b+L,P=D+L;y===!0?h.push(P,P+1,F):h.push(P+1,P,F),M+=3}c.addGroup(g,M,y===!0?1:2),g+=M}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Oo=class s extends Ks{constructor(t=1,e=1,n=32,i=1,r=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,r,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(t){return new s(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Bc=class s extends xi{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let r=[],o=[];a(i),c(n),h(),this.setAttribute("position",new Pe(r,3)),this.setAttribute("normal",new Pe(r.slice(),3)),this.setAttribute("uv",new Pe(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(v){let S=new H,y=new H,b=new H;for(let T=0;T<e.length;T+=3)f(e[T+0],S),f(e[T+1],y),f(e[T+2],b),l(S,y,b,v)}function l(v,S,y,b){let T=b+1,_=[];for(let M=0;M<=T;M++){_[M]=[];let R=v.clone().lerp(y,M/T),A=S.clone().lerp(y,M/T),D=T-M;for(let L=0;L<=D;L++)L===0&&M===T?_[M][L]=R:_[M][L]=R.clone().lerp(A,L/D)}for(let M=0;M<T;M++)for(let R=0;R<2*(T-M)-1;R++){let A=Math.floor(R/2);R%2===0?(u(_[M][A+1]),u(_[M+1][A]),u(_[M][A])):(u(_[M][A+1]),u(_[M+1][A+1]),u(_[M+1][A]))}}function c(v){let S=new H;for(let y=0;y<r.length;y+=3)S.x=r[y+0],S.y=r[y+1],S.z=r[y+2],S.normalize().multiplyScalar(v),r[y+0]=S.x,r[y+1]=S.y,r[y+2]=S.z}function h(){let v=new H;for(let S=0;S<r.length;S+=3){v.x=r[S+0],v.y=r[S+1],v.z=r[S+2];let y=p(v)/2/Math.PI+.5,b=g(v)/Math.PI+.5;o.push(y,1-b)}m(),d()}function d(){for(let v=0;v<o.length;v+=6){let S=o[v+0],y=o[v+2],b=o[v+4],T=Math.max(S,y,b),_=Math.min(S,y,b);T>.9&&_<.1&&(S<.2&&(o[v+0]+=1),y<.2&&(o[v+2]+=1),b<.2&&(o[v+4]+=1))}}function u(v){r.push(v.x,v.y,v.z)}function f(v,S){let y=v*3;S.x=t[y+0],S.y=t[y+1],S.z=t[y+2]}function m(){let v=new H,S=new H,y=new H,b=new H,T=new kt,_=new kt,M=new kt;for(let R=0,A=0;R<r.length;R+=9,A+=6){v.set(r[R+0],r[R+1],r[R+2]),S.set(r[R+3],r[R+4],r[R+5]),y.set(r[R+6],r[R+7],r[R+8]),T.set(o[A+0],o[A+1]),_.set(o[A+2],o[A+3]),M.set(o[A+4],o[A+5]),b.copy(v).add(S).add(y).divideScalar(3);let D=p(b);x(T,A+0,v,D),x(_,A+2,S,D),x(M,A+4,y,D)}}function x(v,S,y,b){b<0&&v.x===1&&(o[S]=v.x-1),y.x===0&&y.z===0&&(o[S]=b/2/Math.PI+.5)}function p(v){return Math.atan2(v.z,-v.x)}function g(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.vertices,t.indices,t.radius,t.detail)}},zc=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ht("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),i=0,r=n.length,o;e?o=e:o=t*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(r-1);let h=n[i],u=n[i+1]-h,f=(o-h)/u;return(i+f)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);let o=this.getPoint(i),a=this.getPoint(r),l=e||(o.isVector2?new kt:new H);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new H,i=[],r=[],o=[],a=new H,l=new ie;for(let f=0;f<=t;f++){let m=f/t;i[f]=this.getTangentAt(m,new H)}r[0]=new H,o[0]=new H;let c=Number.MAX_VALUE,h=Math.abs(i[0].x),d=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),d<=c&&(c=d,n.set(0,1,0)),u<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let f=1;f<=t;f++){if(r[f]=r[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();let m=Math.acos(jt(i[f-1].dot(i[f]),-1,1));r[f].applyMatrix4(l.makeRotationAxis(a,m))}o[f].crossVectors(i[f],r[f])}if(e===!0){let f=Math.acos(jt(r[0].dot(r[t]),-1,1));f/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(f=-f);for(let m=1;m<=t;m++)r[m].applyMatrix4(l.makeRotationAxis(i[m],f*m)),o[m].crossVectors(i[m],r[m])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}};cm=new H,hm=new H,xf=new Jf,vf=new Jf,yf=new Jf,Bo=class extends zc{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new H){let n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,h;this.closed||a>0?c=i[(a-1)%r]:(hm.subVectors(i[0],i[1]).add(i[0]),c=hm);let d=i[a%r],u=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(cm.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=cm),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,m=Math.pow(c.distanceToSquared(d),f),x=Math.pow(d.distanceToSquared(u),f),p=Math.pow(u.distanceToSquared(h),f);x<1e-4&&(x=1),m<1e-4&&(m=x),p<1e-4&&(p=x),xf.initNonuniformCatmullRom(c.x,d.x,u.x,h.x,m,x,p),vf.initNonuniformCatmullRom(c.y,d.y,u.y,h.y,m,x,p),yf.initNonuniformCatmullRom(c.z,d.z,u.z,h.z,m,x,p)}else this.curveType==="catmullrom"&&(xf.initCatmullRom(c.x,d.x,u.x,h.x,this.tension),vf.initCatmullRom(c.y,d.y,u.y,h.y,this.tension),yf.initCatmullRom(c.z,d.z,u.z,h.z,this.tension));return n.set(xf.calc(l),vf.calc(l),yf.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new H().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}},Ga=class s extends Bc{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new s(t.radius,t.detail)}},Jn=class s extends xi{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,h=l+1,d=t/a,u=e/l,f=[],m=[],x=[],p=[];for(let g=0;g<h;g++){let v=g*u-o;for(let S=0;S<c;S++){let y=S*d-r;m.push(y,-v,0),x.push(0,0,1),p.push(S/a),p.push(1-g/l)}}for(let g=0;g<l;g++)for(let v=0;v<a;v++){let S=v+c*g,y=v+c*(g+1),b=v+1+c*(g+1),T=v+1+c*g;f.push(S,y,T),f.push(y,b,T)}this.setIndex(f),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.width,t.height,t.widthSegments,t.heightSegments)}},Ir=class s extends xi{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(o+a,Math.PI),c=0,h=[],d=new H,u=new H,f=[],m=[],x=[],p=[];for(let g=0;g<=n;g++){let v=[],S=g/n,y=o+S*a,b=t*Math.cos(y),T=Math.sqrt(t*t-b*b),_=0;g===0&&o===0?_=.5/e:g===n&&l===Math.PI&&(_=-.5/e);for(let M=0;M<=e;M++){let R=M/e,A=i+R*r;d.x=-T*Math.cos(A),d.y=b,d.z=T*Math.sin(A),m.push(d.x,d.y,d.z),u.copy(d).normalize(),x.push(u.x,u.y,u.z),p.push(R+_,1-S),v.push(c++)}h.push(v)}for(let g=0;g<n;g++)for(let v=0;v<e;v++){let S=h[g][v+1],y=h[g][v],b=h[g+1][v],T=h[g+1][v+1];(g!==0||o>0)&&f.push(S,y,T),(g!==n-1||l<Math.PI)&&f.push(y,b,T)}this.setIndex(f),this.setAttribute("position",new Pe(m,3)),this.setAttribute("normal",new Pe(x,3)),this.setAttribute("uv",new Pe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new s(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};As={clone:kr,merge:Fn},Kx=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Qx=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,ln=class extends Js{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Kx,this.fragmentShader=Qx,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=kr(t.uniforms),this.uniformsGroups=$x(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Ot().setHex(i.value);break;case"v2":this.uniforms[n].value=new kt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new H().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Be().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Xt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ie().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},zo=class extends ln{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Ue=class extends Js{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gh,this.normalScale=new kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Lr=class extends Ue{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new kt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return jt(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ot(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ot(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ot(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return Rr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){Rr('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}},kc=class extends Js{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Vm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Hc=class extends Js{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};Qs=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=i,i=e[++n],t<i)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=t*i;for(let o=0;o!==i;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Gc=class extends Qs{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:bf,endingEnd:bf}}intervalChanged_(t,e,n){let i=this.parameterPositions,r=t-2,o=t+1,a=i[r],l=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case Tf:r=t,a=2*e-n;break;case wf:r=i.length-2,a=e+i[r]-i[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Tf:o=t,l=2*n-e;break;case wf:o=1,l=n+i[1]-i[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,d=this._offsetNext,u=this._weightPrev,f=this._weightNext,m=(n-e)/(i-e),x=m*m,p=x*m,g=-u*p+2*u*x-u*m,v=(1+u)*p+(-1.5-2*u)*x+(-.5+u)*m+1,S=(-1-f)*p+(1.5+f)*x+.5*m,y=f*p-f*x;for(let b=0;b!==a;++b)r[b]=g*o[h+b]+v*o[c+b]+S*o[l+b]+y*o[d+b];return r}},Vc=class extends Qs{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(i-e),d=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*d+o[l+u]*h;return r}},Wc=class extends Qs{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},Xc=class extends Qs{interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,d=this.outTangents;if(!h||!d){let m=(n-e)/(i-e),x=1-m;for(let p=0;p!==a;++p)r[p]=o[c+p]*x+o[l+p]*m;return r}let u=a*2,f=t-1;for(let m=0;m!==a;++m){let x=o[c+m],p=o[l+m],g=f*u+m*2,v=d[g],S=d[g+1],y=t*u+m*2,b=h[y],T=h[y+1],_=tv(n,e,v,b,i);r[m]=sg(_,x,S,T,p)}return r}};vi=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=To(e,this.TimeBufferType),this.values=To(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:To(t.times,Array),values:To(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i),xc(t.settings)&&(n.settings={inTangents:To(t.settings.inTangents,Array),outTangents:To(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Wc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Vc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Gc(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Xc(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Ca:e=this.InterpolantFactoryMethodDiscrete;break;case Ic:e=this.InterpolantFactoryMethodLinear;break;case Mc:e=this.InterpolantFactoryMethodSmooth;break;case Sf:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Ht("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ca;case this.InterpolantFactoryMethodLinear:return Ic;case this.InterpolantFactoryMethodSmooth:return Mc;case this.InterpolantFactoryMethodBezier:return Sf}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t;xc(this.settings)&&(fm(this.settings.inTangents,t),fm(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t;xc(this.settings)&&(dm(this.settings.inTangents,t),dm(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Vt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,r=n.length;r===0&&(Vt("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){Vt("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){Vt("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(i!==void 0&&Tx(i))for(let a=0,l=i.length;a!==l;++a){let c=i[a];if(isNaN(c)){Vt("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Mc,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(i)l=!0;else{let d=a*n,u=d-n,f=d+n;for(let m=0;m!==n;++m){let x=e[d+m];if(x!==e[u+m]||x!==e[f+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let d=a*n,u=o*n;for(let f=0;f!==n;++f)e[u+f]=e[d+f]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,xc(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}};vi.prototype.ValueTypeName="";vi.prototype.TimeBufferType=Float32Array;vi.prototype.ValueBufferType=Float32Array;vi.prototype.DefaultInterpolation=Ic;js=class extends vi{constructor(t,e,n){super(t,e,n)}};js.prototype.ValueTypeName="bool";js.prototype.ValueBufferType=Array;js.prototype.DefaultInterpolation=Ca;js.prototype.InterpolantFactoryMethodLinear=void 0;js.prototype.InterpolantFactoryMethodSmooth=void 0;Yc=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}};Yc.prototype.ValueTypeName="color";qc=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}};qc.prototype.ValueTypeName="number";Zc=class extends Qs{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(i-e),c=t*a;for(let h=c+a;c!==h;c+=4)ri.slerpFlat(r,0,o,c-a,o,c,l);return r}},Va=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}InterpolantFactoryMethodLinear(t){return new Zc(this.times,this.values,this.getValueSize(),t)}};Va.prototype.ValueTypeName="quaternion";Va.prototype.InterpolantFactoryMethodSmooth=void 0;tr=class extends vi{constructor(t,e,n){super(t,e,n)}};tr.prototype.ValueTypeName="string";tr.prototype.ValueBufferType=Array;tr.prototype.DefaultInterpolation=Ca;tr.prototype.InterpolantFactoryMethodLinear=void 0;tr.prototype.InterpolantFactoryMethodSmooth=void 0;Jc=class extends vi{constructor(t,e,n,i){super(t,e,n,i)}};Jc.prototype.ValueTypeName="vector";Co={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(pm(s)||(this.files[s]=t))},get:function(s){if(this.enabled!==!1&&!pm(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};$c=class{constructor(t,e,n){let i=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,d){return c.push(h,d),this},this.removeHandler=function(h){let d=c.indexOf(h);return d!==-1&&c.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=c.length;d<u;d+=2){let f=c[d],m=c[d+1];if(f.global&&(f.lastIndex=0),f.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},rg=new $c,er=class{constructor(t){this.manager=t!==void 0?t:rg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};er.DEFAULT_MATERIAL_NAME="__DEFAULT";vs={},Ef=class extends Error{constructor(t,e){super(t),this.response=e}},Kc=class extends er{constructor(t){super(t),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=Co.get(`file:${t}`);if(r!==void 0){this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0);return}if(vs[t]!==void 0){vs[t].push({onLoad:e,onProgress:n,onError:i});return}vs[t]=[],vs[t].push({onLoad:e,onProgress:n,onError:i});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,l=this.responseType;fetch(o).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&Ht("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;let h=vs[t],d=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),f=u?parseInt(u):0,m=f!==0,x=0,p=new ReadableStream({start(g){v();function v(){d.read().then(({done:S,value:y})=>{if(S)g.close();else{x+=y.byteLength;let b=new ProgressEvent("progress",{lengthComputable:m,loaded:x,total:f});for(let T=0,_=h.length;T<_;T++){let M=h[T];M.onProgress&&M.onProgress(b)}g.enqueue(y),v()}},S=>{g.error(S)})}}});return new Response(p)}else throw new Ef(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return c.json();default:if(a==="")return c.text();{let d=/charset="?([^;"\s]*)"?/i.exec(a),u=d&&d[1]?d[1].toLowerCase():void 0,f=new TextDecoder(u);return c.arrayBuffer().then(m=>f.decode(m))}}}).then(c=>{Co.add(`file:${t}`,c);let h=vs[t];delete vs[t];for(let d=0,u=h.length;d<u;d++){let f=h[d];f.onLoad&&f.onLoad(c)}}).catch(c=>{let h=vs[t];if(h===void 0)throw this.manager.itemError(t),c;delete vs[t];for(let d=0,u=h.length;d<u;d++){let f=h[d];f.onError&&f.onError(c)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}},wo=new WeakMap,Qc=class extends er{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Co.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let d=wo.get(o);d===void 0&&(d=[],wo.set(o,d)),d.push({onLoad:e,onError:i})}return o}let a=Do("img");function l(){h(),e&&e(this);let d=wo.get(this)||[];for(let u=0;u<d.length;u++){let f=d[u];f.onLoad&&f.onLoad(this)}wo.delete(this),r.manager.itemEnd(t)}function c(d){h(),i&&i(d),Co.remove(`image:${t}`);let u=wo.get(this)||[];for(let f=0;f<u.length;f++){let m=u[f];m.onError&&m.onError(d)}wo.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Co.add(`image:${t}`,a),r.manager.itemStart(t),a.fetchPriority=this.priority,a.src=t,a}},Wa=class extends er{constructor(t){super(t)}load(t,e,n,i){let r=this,o=new Pr,a=new Kc(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(r.withCredentials),a.load(t,function(l){let c;try{c=r.parse(l)}catch(h){i!==void 0?i(h):Vt(h);return}r._applyTexData(o,c),e&&e(o,c)},n,i),o}createDataTexture(t){let e=new Pr;return this._applyTexData(e,this.parse(t)),e}_applyTexData(t,e){e.image!==void 0?t.image=e.image:e.data!==void 0&&(t.image.width=e.width,t.image.height=e.height,t.image.data=e.data),t.wrapS=e.wrapS!==void 0?e.wrapS:Li,t.wrapT=e.wrapT!==void 0?e.wrapT:Li,t.magFilter=e.magFilter!==void 0?e.magFilter:Qe,t.minFilter=e.minFilter!==void 0?e.minFilter:Qe,t.anisotropy=e.anisotropy!==void 0?e.anisotropy:1,e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.mipmaps!==void 0&&(t.mipmaps=e.mipmaps,t.minFilter=is),e.mipmapCount===1&&(t.minFilter=Qe),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),t.needsUpdate=!0}},Xa=class extends er{constructor(t){super(t)}load(t,e,n,i){let r=new Nn,o=new Qc(this.manager);return o.setPriority(this.priority),o.setCache(this.cache),o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}},Ya=class extends Un{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Ot(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},qa=class extends Ya{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Un.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ot(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},Mf=new ie,mm=new H,gm=new H,jc=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new kt(512,512),this.mapType=ai,this.map=null,this.mapPass=null,this.matrix=new ie,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new $s,this._frameExtents=new kt(1,1),this._viewportCount=1,this._viewports=[new Be(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;mm.setFromMatrixPosition(t.matrixWorld),e.position.copy(mm),gm.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(gm),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){Mf.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(Mf,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=i?i.z/r.x:1,a=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===Lo||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Mf)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},vc=new H,yc=new ri,Ki=new H,Za=class extends Un{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ie,this.projectionMatrix=new ie,this.projectionMatrixInverse=new ie,this.coordinateSystem=Di,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(vc,yc,Ki),Ki.x===1&&Ki.y===1&&Ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vc,yc,Ki.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(vc,yc,Ki),Ki.x===1&&Ki.y===1&&Ki.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vc,yc,Ki.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Xs=new H,_m=new kt,xm=new kt,qn=class extends Za{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Lc*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan($u*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Lc*2*Math.atan(Math.tan($u*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Xs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Xs.x,Xs.y).multiplyScalar(-t/Xs.z),Xs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Xs.x,Xs.y).multiplyScalar(-t/Xs.z)}getViewSize(t,e){return this.getViewBounds(t,_m,xm),e.subVectors(xm,_m)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan($u*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Dr=class extends Za{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Af=class extends jc{constructor(){super(new Dr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ja=class extends Ya{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Un.DEFAULT_UP),this.updateMatrix(),this.target=new Un,this.shadow=new Af}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}},Eo=-90,Ao=1,ko=class extends Un{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new qn(Eo,Ao,t,e);i.layers=this.layers,this.add(i);let r=new qn(Eo,Ao,t,e);r.layers=this.layers,this.add(r);let o=new qn(Eo,Ao,t,e);o.layers=this.layers,this.add(o);let a=new qn(Eo,Ao,t,e);a.layers=this.layers,this.add(a);let l=new qn(Eo,Ao,t,e);l.layers=this.layers,this.add(l);let c=new qn(Eo,Ao,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Di)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Lo)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,d=t.getRenderTarget(),u=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=x,t.setRenderTarget(n,5,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(d,u,f),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},th=class extends qn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}},$a=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=ev.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};Kf="\\[\\]\\.:\\/",nv=new RegExp("["+Kf+"]","g"),Qf="[^"+Kf+"]",iv="[^"+Kf.replace("\\.","")+"]",sv=/((?:WC+[\/:])*)/.source.replace("WC",Qf),rv=/(WCOD+)?/.source.replace("WCOD",iv),ov=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Qf),av=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Qf),lv=new RegExp("^"+sv+rv+ov+av+"$"),cv=["material","materials","bones","map"],Rf=class{constructor(t,e,n){let i=n||Ne.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Ne=class s{constructor(t,e,n){this.path=e,this.parsedPath=n||s.parseTrackName(e),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new s.Composite(t,e,n):new s(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(nv,"")}static parseTrackName(t){let e=lv.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let r=n.nodeName.substring(i+1);cv.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,r=e.propertyIndex;if(t||(t=s.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Ht("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Vt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Vt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Vt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Vt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Vt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Vt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Vt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[i];if(o===void 0){let c=e.nodeName;Vt("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){Vt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Vt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Ne.Composite=Rf;Ne.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Ne.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Ne.prototype.GetterByBindingType=[Ne.prototype._getValue_direct,Ne.prototype._getValue_array,Ne.prototype._getValue_arrayElement,Ne.prototype._getValue_toArray];Ne.prototype.SetterByBindingTypeAndVersioning=[[Ne.prototype._setValue_direct,Ne.prototype._setValue_direct_setNeedsUpdate,Ne.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_array,Ne.prototype._setValue_array_setNeedsUpdate,Ne.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_arrayElement,Ne.prototype._setValue_arrayElement_setNeedsUpdate,Ne.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Ne.prototype._setValue_fromArray,Ne.prototype._setValue_fromArray_setNeedsUpdate,Ne.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];zE=new Float32Array(1),sd=class sd{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=i,this}};sd.prototype.isMatrix2=!0;Cf=sd;typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?Ht("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187")});function Ag(){let s=null,t=!1,e=null,n=null;function i(r,o){n=s.requestAnimationFrame(i),e(r,o)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function fv(s){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,d=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),a.onUploadCallback();let f;if(c instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=s.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=s.SHORT;else if(c instanceof Uint32Array)f=s.UNSIGNED_INT;else if(c instanceof Int32Array)f=s.INT;else if(c instanceof Int8Array)f=s.BYTE;else if(c instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,l,c){let h=l.array,d=l.updateRanges;if(s.bindBuffer(c,a),d.length===0)s.bufferSubData(c,0,h);else{d.sort((f,m)=>f.start-m.start);let u=0;for(let f=1;f<d.length;f++){let m=d[u],x=d[f];x.start<=m.start+m.count+1?m.count=Math.max(m.count,x.start+x.count-m.start):(++u,d[u]=x)}d.length=u+1;for(let f=0,m=d.length;f<m;f++){let x=d[f];s.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(s.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:r,update:o}}function qM(s,t,e,n,i,r){let o=new Ot(0),a=i===!0?0:1,l,c,h=null,d=0,u=null;function f(v){let S=v.isScene===!0?v.background:null;if(S&&S.isTexture){let y=v.backgroundBlurriness>0;S=t.get(S,y)}return S}function m(v){let S=!1,y=f(v);y===null?p(o,a):y&&y.isColor&&(p(y,1),S=!0);let b=s.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function x(v,S){let y=f(S);y&&y.isCubeTexture?(c===void 0&&(c=new Jt(new Ie(1,1,1),new ln({name:"BackgroundCubeMaterial",uniforms:kr(rs.backgroundCube.uniforms),vertexShader:rs.backgroundCube.vertexShader,fragmentShader:rs.backgroundCube.fragmentShader,side:wn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,_){this.matrixWorld.copyPosition(_.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(YM.makeRotationFromEuler(S.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Rg),c.material.toneMapped=ne.getTransfer(y.colorSpace)!==me,(h!==y||d!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Jt(new Jn(2,2),new ln({name:"BackgroundMaterial",uniforms:kr(rs.background.uniforms),vertexShader:rs.background.vertexShader,fragmentShader:rs.background.fragmentShader,side:nr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=ne.getTransfer(y.colorSpace)!==me,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||d!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,d=y.version,u=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function p(v,S){v.getRGB(Vh,$f(s)),e.buffers.color.setClear(Vh.r,Vh.g,Vh.b,S,r)}function g(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,S=1){o.set(v),a=S,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(v){a=v,p(o,a)},render:m,addToRenderList:x,dispose:g}}function ZM(s,t){let e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null),r=i,o=!1;function a(D,L,F,P,B){let k=!1,O=d(D,P,F,L);r!==O&&(r=O,c(r.object)),k=f(D,P,F,B),k&&m(D,P,F,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,y(D,L,F,P),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return s.createVertexArray()}function c(D){return s.bindVertexArray(D)}function h(D){return s.deleteVertexArray(D)}function d(D,L,F,P){let B=P.wireframe===!0,k=n[L.id];k===void 0&&(k={},n[L.id]=k);let O=D.isInstancedMesh===!0?D.id:0,Q=k[O];Q===void 0&&(Q={},k[O]=Q);let W=Q[F.id];W===void 0&&(W={},Q[F.id]=W);let I=W[B];return I===void 0&&(I=u(l()),W[B]=I),I}function u(D){let L=[],F=[],P=[];for(let B=0;B<e;B++)L[B]=0,F[B]=0,P[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:F,attributeDivisors:P,object:D,attributes:{},index:null}}function f(D,L,F,P){let B=r.attributes,k=L.attributes,O=0,Q=F.getAttributes();for(let W in Q)if(Q[W].location>=0){let nt=B[W],_t=k[W];if(_t===void 0&&(W==="instanceMatrix"&&D.instanceMatrix&&(_t=D.instanceMatrix),W==="instanceColor"&&D.instanceColor&&(_t=D.instanceColor)),nt===void 0||nt.attribute!==_t||_t&&nt.data!==_t.data)return!0;O++}return r.attributesNum!==O||r.index!==P}function m(D,L,F,P){let B={},k=L.attributes,O=0,Q=F.getAttributes();for(let W in Q)if(Q[W].location>=0){let nt=k[W];nt===void 0&&(W==="instanceMatrix"&&D.instanceMatrix&&(nt=D.instanceMatrix),W==="instanceColor"&&D.instanceColor&&(nt=D.instanceColor));let _t={};_t.attribute=nt,nt&&nt.data&&(_t.data=nt.data),B[W]=_t,O++}r.attributes=B,r.attributesNum=O,r.index=P}function x(){let D=r.newAttributes;for(let L=0,F=D.length;L<F;L++)D[L]=0}function p(D){g(D,0)}function g(D,L){let F=r.newAttributes,P=r.enabledAttributes,B=r.attributeDivisors;F[D]=1,P[D]===0&&(s.enableVertexAttribArray(D),P[D]=1),B[D]!==L&&(s.vertexAttribDivisor(D,L),B[D]=L)}function v(){let D=r.newAttributes,L=r.enabledAttributes;for(let F=0,P=L.length;F<P;F++)L[F]!==D[F]&&(s.disableVertexAttribArray(F),L[F]=0)}function S(D,L,F,P,B,k,O){O===!0?s.vertexAttribIPointer(D,L,F,B,k):s.vertexAttribPointer(D,L,F,P,B,k)}function y(D,L,F,P){x();let B=P.attributes,k=F.getAttributes(),O=L.defaultAttributeValues;for(let Q in k){let W=k[Q];if(W.location>=0){let I=B[Q];if(I===void 0&&(Q==="instanceMatrix"&&D.instanceMatrix&&(I=D.instanceMatrix),Q==="instanceColor"&&D.instanceColor&&(I=D.instanceColor)),I!==void 0){let nt=I.normalized,_t=I.itemSize,Et=t.get(I);if(Et===void 0)continue;let Z=Et.buffer,ht=Et.type,Mt=Et.bytesPerElement,bt=ht===s.INT||ht===s.UNSIGNED_INT||I.gpuType===rh;if(I.isInterleavedBufferAttribute){let mt=I.data,Nt=mt.isInterleavedBuffer===!0?mt.stride:mt.itemSize,Me=I.offset;if(mt.isInstancedInterleavedBuffer||mt.isInstancedBufferAttribute){for(let At=0;At<W.locationSize;At++)g(W.location+At,mt.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=mt.meshPerAttribute*mt.count)}else for(let At=0;At<W.locationSize;At++)p(W.location+At);s.bindBuffer(s.ARRAY_BUFFER,Z);for(let At=0;At<W.locationSize;At++)S(W.location+At,_t/W.locationSize,ht,nt,Nt*Mt,(Me+_t/W.locationSize*At)*Mt,bt)}else{if(I.isInstancedBufferAttribute){for(let mt=0;mt<W.locationSize;mt++)g(W.location+mt,I.meshPerAttribute);D.isInstancedMesh!==!0&&P._maxInstanceCount===void 0&&(P._maxInstanceCount=I.meshPerAttribute*I.count)}else for(let mt=0;mt<W.locationSize;mt++)p(W.location+mt);s.bindBuffer(s.ARRAY_BUFFER,Z);for(let mt=0;mt<W.locationSize;mt++)S(W.location+mt,_t/W.locationSize,ht,nt,_t*Mt,_t/W.locationSize*mt*Mt,bt)}}else if(O!==void 0){let nt=O[Q];if(nt!==void 0)switch(nt.length){case 2:s.vertexAttrib2fv(W.location,nt);break;case 3:s.vertexAttrib3fv(W.location,nt);break;case 4:s.vertexAttrib4fv(W.location,nt);break;default:s.vertexAttrib1fv(W.location,nt)}}}}v()}function b(){R();for(let D in n){let L=n[D];for(let F in L){let P=L[F];for(let B in P){let k=P[B];for(let O in k)h(k[O].object),delete k[O];delete P[B]}}delete n[D]}}function T(D){if(n[D.id]===void 0)return;let L=n[D.id];for(let F in L){let P=L[F];for(let B in P){let k=P[B];for(let O in k)h(k[O].object),delete k[O];delete P[B]}}delete n[D.id]}function _(D){for(let L in n){let F=n[L];for(let P in F){let B=F[P];if(B[D.id]===void 0)continue;let k=B[D.id];for(let O in k)h(k[O].object),delete k[O];delete B[D.id]}}}function M(D){for(let L in n){let F=n[L],P=D.isInstancedMesh===!0?D.id:0,B=F[P];if(B!==void 0){for(let k in B){let O=B[k];for(let Q in O)h(O[Q].object),delete O[Q];delete B[k]}delete F[P],Object.keys(F).length===0&&delete n[L]}}}function R(){A(),o=!0,r!==i&&(r=i,c(r.object))}function A(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:R,resetDefaultState:A,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:M,releaseStatesOfProgram:_,initAttributes:x,enableAttribute:p,disableUnusedAttributes:v}}function JM(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let f=0;f<h;f++)u+=c[f];e.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function $M(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let _=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(_.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(_){return!(_!==Zi&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(_){let M=_===He&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(_!==ai&&_!==$n&&!M&&n.convert(_)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(_){if(_==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";_="mediump"}return _==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Ht("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let d=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),u=e.logarithmicDepthBuffer===!0&&d===!1;e.reversedDepthBuffer===!0&&d===!1&&Ht("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&d===!0&&Ht("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),g=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:y,maxSamples:b,samples:T}}function KM(s){let t=this,e=null,n=0,i=!1,r=!1,o=new Wi,a=new Xt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){let f=d.length!==0||u||n!==0||i;return i=u,n=d.length,f},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){e=h(d,u,0)},this.setState=function(d,u,f){let m=d.clippingPlanes,x=d.clipIntersection,p=d.clipShadows,g=s.get(d);if(!i||m===null||m.length===0||r&&!p)r?h(null):c();else{let v=r?0:n,S=v*4,y=g.clippingState||null;l.value=y,y=h(m,u,S,f);for(let b=0;b!==S;++b)y[b]=e[b];g.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(d,u,f,m){let x=d!==null?d.length:0,p=null;if(x!==0){if(p=l.value,m!==!0||p===null){let g=f+x*4,v=u.matrixWorldInverse;a.getNormalMatrix(v),(p===null||p.length<g)&&(p=new Float32Array(g));for(let S=0,y=f;S!==x;++S,y+=4)o.copy(d[S]).applyMatrix4(v,a),o.normal.toArray(p,y),p[y+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function ag(s,t,e){return new dl(s,{minFilter:is,generateMipmaps:t,type:He,colorSpace:Cr,depthBuffer:e})}function pl(s,t,e){return new ln({name:s,uniforms:t,vertexShader:Kt.cube_vert,fragmentShader:e,side:wn,blending:Ts,depthTest:!1,depthWrite:!1})}function iS(){return pl("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Cg}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function sS(){return pl("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Pg}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function rS(){return pl("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${jM}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function lg(){return pl("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function cg(){return pl("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function oS(s){let t=new WeakMap,e=new WeakMap,n=null;function i(u,f=!1){return u==null?null:f?o(u):r(u)}function r(u){if(u&&u.isTexture){let f=u.mapping;if(f===nh||f===ih)if(t.has(u)){let m=t.get(u).texture;return a(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let x=new dl(m.height);return x.fromEquirectangularTexture(s,u),t.set(u,x),u.addEventListener("dispose",c),a(x.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture&&u.isPMREMTexture!==!0){let f=u.mapping,m=f===nh||f===ih,x=f===Br||f===Vo;if(m||x){let p=e.get(u),g=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==g)return n===null&&(n=new Yo(s)),p=m?n.fromEquirectangular(u,p):n.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),p.texture;if(p!==void 0)return p.texture;{let v=u.image;return m&&v&&v.height>0||x&&v&&l(v)?(n===null&&(n=new Yo(s)),p=m?n.fromEquirectangular(u):n.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function a(u,f){return f===nh?u.mapping=Br:f===ih&&(u.mapping=Vo),u}function l(u){let f=0,m=6;for(let x=0;x<m;x++)u[x]!==void 0&&f++;return f===m}function c(u){let f=u.target;f.removeEventListener("dispose",c);let m=t.get(f);m!==void 0&&(t.delete(f),m.dispose())}function h(u){let f=u.target;f.removeEventListener("dispose",h);let m=e.get(f);m!==void 0&&(e.delete(f),m.dispose())}function d(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:d}}function aS(s){let t={};function e(n){if(t[n]!==void 0)return t[n];let i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Rr("WebGLRenderer: "+n+" extension not supported."),i}}}function lS(s,t,e,n){let i={},r=new WeakMap,o=new FinalizationRegistry(m=>delete i[m]);function a(m){l(m.target)}function l(m){m.index!==null&&t.remove(m.index);for(let p in m.attributes)t.remove(m.attributes[p]);m.removeEventListener("dispose",a),delete i[m.id],o.unregister(m);let x=r.get(m);x&&(t.remove(x),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function c(m,x){return i[x.id]!==void 0||(x.addEventListener("dispose",a),i[x.id]=new WeakRef(x),o.register(x,x.id,x),e.memory.geometries++),x}function h(m){let x=m.attributes;for(let p in x)t.update(x[p],s.ARRAY_BUFFER)}function d(m){let x=m.index,p=m.attributes.position,g=0;if(p===void 0)return;let v=x!==null?x.array.length:p.array.length/3-1,S=p.count>=65535?Fa:Ua,y=new S(Math.ceil(v/3)*6,1),b=y.array;if(x!==null){let _=x.array;g=x.version;for(let M=0,R=0;M<v;M+=3){let A=_[M+0],D=_[M+1],L=_[M+2];b[R++]=A,b[R++]=D,b[R++]=D,b[R++]=L,b[R++]=L,b[R++]=A}}else{g=p.version;for(let _=0,M=0;_<v;_+=3){let R=_+0,A=_+1,D=_+2;b[M++]=R,b[M++]=A,b[M++]=A,b[M++]=D,b[M++]=D,b[M++]=R}}y.version=g;let T=r.get(m);T&&t.remove(T),r.set(m,y)}function u(m){let x=r.get(m);if(x){let p=m.index;p!==null&&x.version<p.version&&d(m)}else d(m);return r.get(m)}function f(){for(let m in i){let x=i[m].deref();x!==void 0&&l(x)}}return{get:c,update:h,getWireframeAttribute:u,dispose:f}}function cS(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,u){s.drawElements(n,u,r,d*o),e.update(u,n,1)}function c(d,u,f){f!==0&&(s.drawElementsInstanced(n,u,r,d*o,f),e.update(u,n,f))}function h(d,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,d,0,f);let x=0;for(let p=0;p<f;p++)x+=u[p];e.update(x,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function hS(s){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:Vt("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function uS(s,t,e){let n=new WeakMap,i=new Be;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==d){let R=function(){_.dispose(),n.delete(a),a.removeEventListener("dispose",R)};u!==void 0&&u.texture.dispose();let f=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],g=a.morphAttributes.normal||[],v=a.morphAttributes.color||[],S=0;f===!0&&(S=1),m===!0&&(S=2),x===!0&&(S=3);let y=a.attributes.position.count*S,b=1;y>t.maxTextureSize&&(b=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let T=new Float32Array(y*b*4*d),_=new Ia(T,y,b,d);_.type=$n,_.needsUpdate=!0;let M=S*4;for(let A=0;A<d;A++){let D=p[A],L=g[A],F=v[A],P=y*b*4*A;for(let B=0;B<D.count;B++){let k=B*M;f===!0&&(i.fromBufferAttribute(D,B),T[P+k+0]=i.x,T[P+k+1]=i.y,T[P+k+2]=i.z,T[P+k+3]=0),m===!0&&(i.fromBufferAttribute(L,B),T[P+k+4]=i.x,T[P+k+5]=i.y,T[P+k+6]=i.z,T[P+k+7]=0),x===!0&&(i.fromBufferAttribute(F,B),T[P+k+8]=i.x,T[P+k+9]=i.y,T[P+k+10]=i.z,T[P+k+11]=F.itemSize===4?i.w:1)}}u={count:d,texture:_,size:new kt(y,b)},n.set(a,u),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let m=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(s,"morphTargetBaseInfluence",m),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function fS(s,t,e,n,i){let r=new WeakMap;function o(c){let h=i.render.frame,d=c.geometry,u=t.get(c,d);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;r.get(f)!==h&&(f.update(),r.set(f,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}function pS(s,t,e,n,i,r){let o=new je(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=null,h=new xi;h.setAttribute("position",new Pe([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Pe([0,2,0,0,2,0],2));let d=new zo({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),u=new Jt(h,d),f=new Dr(-1,1,1,-1,0,1),m=null,x=null,p=!1,g,v=null,S=[],y=!1;this.setSize=function(b,T){o.setSize(b,T),a!==null&&a.setSize(b,T),l!==null&&l.setSize(b,T);for(let _=0;_<S.length;_++){let M=S[_];M.setSize&&M.setSize(b,T)}},this.setEffects=function(b){S=b,y=S.length>0&&S[0].isRenderPass===!0;let T=o.width,_=o.height;S.length>0&&a===null&&(a=new je(T,_,{type:He,depthBuffer:!1,stencilBuffer:!1}),l=new je(T,_,{type:He,depthBuffer:!1,stencilBuffer:!1}));let M=i===!0&&S.some(R=>R.needsDepthTexture===!0);M!==(o.depthTexture!==null)&&(M===!0&&c===null&&(c=new bs(T,_),r===!0&&(c.format=ws,c.type=zr)),o.dispose(),o.depthTexture=M?c:null,o.resolveDepthBuffer=M,o.storeMultisampledDepthBuffer=M);for(let R=0;R<S.length;R++){let A=S[R];A.setSize&&A.setSize(T,_),M&&A.needsDepthTexture===!0&&A.setDepthTexture&&A.setDepthTexture(c)}},this.begin=function(b,T){if(p||b.toneMapping===ns&&S.length===0)return!1;if(v=T,T!==null){let _=T.width,M=T.height;(o.width!==_||o.height!==M)&&this.setSize(_,M)}return y===!1&&b.setRenderTarget(o),g=b.toneMapping,b.toneMapping=ns,!0},this.hasRenderPass=function(){return y},this.end=function(b,T){b.toneMapping=g,p=!0;let _=o,M=a;for(let R=0;R<S.length;R++){let A=S[R];A.enabled!==!1&&(A.render(b,M,_,T),A.needsSwap!==!1&&(_=M,M=M===a?l:a))}if(m!==b.outputColorSpace||x!==b.toneMapping){m=b.outputColorSpace,x=b.toneMapping,d.defines={},ne.getTransfer(m)===me&&(d.defines.SRGB_TRANSFER="");let R=dS[x];R&&(d.defines[R]=""),d.needsUpdate=!0}d.uniforms.tDiffuse.value=_.texture,b.setRenderTarget(v),b.render(u,f),v=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),h.dispose(),d.dispose()}}function qo(s,t,e){let n=s[0];if(n<=0||n>0)return s;let i=t*e,r=hg[i];if(r===void 0&&(r=new Float32Array(i),hg[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function pn(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function mn(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Yh(s,t){let e=ug[t];e===void 0&&(e=new Int32Array(t),ug[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function mS(s,t){let e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function gS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;s.uniform2fv(this.addr,t),mn(e,t)}}function _S(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pn(e,t))return;s.uniform3fv(this.addr,t),mn(e,t)}}function xS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;s.uniform4fv(this.addr,t),mn(e,t)}}function vS(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(pn(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,n))return;pg.set(n),s.uniformMatrix2fv(this.addr,!1,pg),mn(e,n)}}function yS(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(pn(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,n))return;dg.set(n),s.uniformMatrix3fv(this.addr,!1,dg),mn(e,n)}}function MS(s,t){let e=this.cache,n=t.elements;if(n===void 0){if(pn(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),mn(e,t)}else{if(pn(e,n))return;fg.set(n),s.uniformMatrix4fv(this.addr,!1,fg),mn(e,n)}}function SS(s,t){let e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function bS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;s.uniform2iv(this.addr,t),mn(e,t)}}function TS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pn(e,t))return;s.uniform3iv(this.addr,t),mn(e,t)}}function wS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;s.uniform4iv(this.addr,t),mn(e,t)}}function ES(s,t){let e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function AS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pn(e,t))return;s.uniform2uiv(this.addr,t),mn(e,t)}}function RS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pn(e,t))return;s.uniform3uiv(this.addr,t),mn(e,t)}}function CS(s,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pn(e,t))return;s.uniform4uiv(this.addr,t),mn(e,t)}}function qh(s){return s.version===0&&(s.compareFunction=Xf,s.needsUpdate=!0),s}function PS(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?r=qh(Lg):r=Ig,e.setTexture2D(t||r,i)}function IS(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Ug,i)}function LS(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=qh(Dg):r=Fg,e.setTextureCube(t||r,i)}function DS(s,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Ng,i)}function NS(s){switch(s){case 5126:return mS;case 35664:return gS;case 35665:return _S;case 35666:return xS;case 35674:return vS;case 35675:return yS;case 35676:return MS;case 5124:case 35670:return SS;case 35667:case 35671:return bS;case 35668:case 35672:return TS;case 35669:case 35673:return wS;case 5125:return ES;case 36294:return AS;case 36295:return RS;case 36296:return CS;case 35678:case 36198:case 36298:case 36306:case 35682:return PS;case 35679:case 36299:case 36307:return IS;case 35680:case 36300:case 36308:case 36293:return LS;case 36289:case 36303:case 36311:case 36292:return DS}}function US(s,t){s.uniform1fv(this.addr,t)}function FS(s,t){let e=qo(t,this.size,2);s.uniform2fv(this.addr,e)}function OS(s,t){let e=qo(t,this.size,3);s.uniform3fv(this.addr,e)}function BS(s,t){let e=qo(t,this.size,4);s.uniform4fv(this.addr,e)}function zS(s,t){let e=qo(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function kS(s,t){let e=qo(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function HS(s,t){let e=qo(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function GS(s,t){s.uniform1iv(this.addr,t)}function VS(s,t){s.uniform2iv(this.addr,t)}function WS(s,t){s.uniform3iv(this.addr,t)}function XS(s,t){s.uniform4iv(this.addr,t)}function YS(s,t){s.uniform1uiv(this.addr,t)}function qS(s,t){s.uniform2uiv(this.addr,t)}function ZS(s,t){s.uniform3uiv(this.addr,t)}function JS(s,t){s.uniform4uiv(this.addr,t)}function $S(s,t,e){let n=this.cache,i=t.length,r=Yh(e,i);pn(n,r)||(s.uniform1iv(this.addr,r),mn(n,r));let o;this.type===s.SAMPLER_2D_SHADOW?o=qh(Lg):o=Ig;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,r[a])}function KS(s,t,e){let n=this.cache,i=t.length,r=Yh(e,i);pn(n,r)||(s.uniform1iv(this.addr,r),mn(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Ug,r[o])}function QS(s,t,e){let n=this.cache,i=t.length,r=Yh(e,i);pn(n,r)||(s.uniform1iv(this.addr,r),mn(n,r));let o;this.type===s.SAMPLER_CUBE_SHADOW?o=qh(Dg):o=Fg;for(let a=0;a!==i;++a)e.setTextureCube(t[a]||o,r[a])}function jS(s,t,e){let n=this.cache,i=t.length,r=Yh(e,i);pn(n,r)||(s.uniform1iv(this.addr,r),mn(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Ng,r[o])}function tb(s){switch(s){case 5126:return US;case 35664:return FS;case 35665:return OS;case 35666:return BS;case 35674:return zS;case 35675:return kS;case 35676:return HS;case 5124:case 35670:return GS;case 35667:case 35671:return VS;case 35668:case 35672:return WS;case 35669:case 35673:return XS;case 5125:return YS;case 36294:return qS;case 36295:return ZS;case 36296:return JS;case 35678:case 36198:case 36298:case 36306:case 35682:return $S;case 35679:case 36299:case 36307:return KS;case 35680:case 36300:case 36308:case 36293:return QS;case 36289:case 36303:case 36311:case 36292:return jS}}function mg(s,t){s.seq.push(t),s.map[t.id]=t}function eb(s,t,e){let n=s.name,i=n.length;for(od.lastIndex=0;;){let r=od.exec(n),o=od.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){mg(e,c===void 0?new ld(a,s,t):new cd(a,s,t));break}else{let d=e.map[a];d===void 0&&(d=new hd(a),mg(e,d)),e=d}}}function gg(s,t,e){let n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}function sb(s,t){let e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function rb(s){ne._getMatrix(_g,ne.workingColorSpace,s);let t=`mat3( ${_g.elements.map(e=>e.toFixed(4))} )`;switch(ne.getTransfer(s)){case Pa:return[t,"LinearTransferOETF"];case me:return[t,"sRGBTransferOETF"];default:return Ht("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function xg(s,t,e){let n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+sb(s.getShaderSource(t),a)}else return r}function ob(s,t){let e=rb(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}function lb(s,t){let e=ab[t];return e===void 0?(Ht("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function cb(){ne.getLuminanceCoefficients(Wh);let s=Wh.x.toFixed(4),t=Wh.y.toFixed(4),e=Wh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function hb(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fl).join(`
`)}function ub(s){let t=[];for(let e in s){let n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function fb(s,t){let e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(t,i),o=r.name,a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function fl(s){return s!==""}function vg(s,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function yg(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}function ud(s){return s.replace(db,pb)}function pb(s,t){let e=Kt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return ud(e)}function Mg(s){return s.replace(mb,gb)}function gb(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Sg(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function xb(s){return _b[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}function yb(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":vb[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}function Sb(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Mb[s.combine]||"ENVMAP_BLENDING_NONE"}function bb(s,t,e,n){let i=s.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=xb(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=yb(e),d=Sb(e),u=hb(e),f=ub(r),m=i.createProgram(),x,p,g=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(fl).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(fl).join(`
`),p.length>0&&(p+=`
`)):(x=[Sg(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fl).join(`
`),p=[Sg(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+d:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ns?"#define TONE_MAPPING":"",e.toneMapping!==ns?Kt.tonemapping_pars_fragment:"",e.toneMapping!==ns?lb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Kt.colorspace_pars_fragment,ob("linearToOutputTexel",e.outputColorSpace),cb(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(fl).join(`
`)),o=ud(o),o=vg(o,e),o=yg(o,e),a=ud(a),a=vg(a,e),a=yg(a,e),o=Mg(o),a=Mg(a),e.isRawShaderMaterial!==!0&&(g=`#version 300 es
`,x=[u,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",e.glslVersion===Yf?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Yf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let v=g+x+o,S=g+p+a,y=gg(i,i.VERTEX_SHADER,v),b=gg(i,i.FRAGMENT_SHADER,S);i.attachShader(m,y),i.attachShader(m,b),e.index0AttributeName!==void 0?i.bindAttribLocation(m,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(m,0,"position"),i.linkProgram(m);function T(A){if(s.debug.checkShaderErrors){let D=i.getProgramInfoLog(m)||"",L=i.getShaderInfoLog(y)||"",F=i.getShaderInfoLog(b)||"",P=D.trim(),B=L.trim(),k=F.trim(),O=!0,Q=!0;if(i.getProgramParameter(m,i.LINK_STATUS)===!1)if(O=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,m,y,b);else{let W=xg(i,y,"vertex"),I=xg(i,b,"fragment");Vt("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(m,i.VALIDATE_STATUS)+`

Material Name: `+A.name+`
Material Type: `+A.type+`

Program Info Log: `+P+`
`+W+`
`+I)}else P!==""?Ht("WebGLProgram: Program Info Log:",P):(B===""||k==="")&&(Q=!1);Q&&(A.diagnostics={runnable:O,programLog:P,vertexShader:{log:B,prefix:x},fragmentShader:{log:k,prefix:p}})}i.deleteShader(y),i.deleteShader(b),_=new Xo(i,m),M=fb(i,m)}let _;this.getUniforms=function(){return _===void 0&&T(this),_};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let R=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=i.getProgramParameter(m,nb)),R},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(m),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=ib++,this.cacheKey=t,this.usedTimes=1,this.program=m,this.vertexShader=y,this.fragmentShader=b,this}function wb(s){return s===ir||s===ll||s===cl}function Eb(s,t,e,n,i,r){let o=new La,a=new fd,l=new Set,c=[],h=new Map,d=n.logarithmicDepthBuffer,u={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(_){return l.add(_),_===0?"uv":`uv${_}`}function m(_,M,R,A,D,L){let F=A.fog,P=D.geometry,B=_.isMeshStandardMaterial||_.isMeshLambertMaterial||_.isMeshPhongMaterial?A.environment:null,k=_.isMeshStandardMaterial||_.isMeshLambertMaterial&&!_.envMap||_.isMeshPhongMaterial&&!_.envMap,O=t.get(_.envMap||B,k),Q=u[_.type],W=n.precision;_.precision!==null&&(W=n.getMaxPrecision(_.precision),W!==_.precision&&Ht("WebGLProgram.getParameters:",_.precision,"not supported, using",W,"instead."));let I=P.morphAttributes.position||P.morphAttributes.normal||P.morphAttributes.color,nt=I!==void 0?I.length:0,_t=0;P.morphAttributes.position!==void 0&&(_t=1),P.morphAttributes.normal!==void 0&&(_t=2),P.morphAttributes.color!==void 0&&(_t=3);let Et,Z,ht,Mt;if(Q){let et=rs[Q];Et=et.vertexShader,Z=et.fragmentShader}else{Et=_.vertexShader,Z=_.fragmentShader;let et=a.getVertexShaderStage(_),Tt=a.getFragmentShaderStage(_);a.update(_,et,Tt),ht=et.id,Mt=Tt.id}let bt=s.getRenderTarget(),mt=s.state.buffers.depth.getReversed(),Nt=D.isInstancedMesh===!0,Me=D.isBatchedMesh===!0,At=!!_.map,Yt=!!_.matcap,Lt=!!O,Bt=Lt&&O.isPMREMTexture===!0,de=!!_.aoMap,he=!!_.lightMap,J=!!_.bumpMap&&_.wireframe===!1,se=!!_.normalMap,en=!!_.displacementMap,Ee=!!_.emissiveMap,le=!!_.metalnessMap,Xe=!!_.roughnessMap,Ke=_.anisotropy>0,z=_.clearcoat>0,ge=_.diffuseRoughness>0,ue=_.dispersion>0,Wt=_.retroreflectivity>0,ut=_.iridescence>0,pe=_.sheen>0,Dt=_.transmission>0,Gt=Ke&&!!_.anisotropyMap,C=z&&!!_.clearcoatMap,w=z&&!!_.clearcoatNormalMap,V=z&&!!_.clearcoatRoughnessMap,rt=ge&&!!_.diffuseRoughnessMap,it=ut&&!!_.iridescenceMap,ct=ut&&!!_.iridescenceThicknessMap,gt=pe&&!!_.sheenColorMap,X=pe&&!!_.sheenRoughnessMap,j=!!_.specularMap,lt=!!_.specularColorMap,N=!!_.specularIntensityMap,K=Dt&&!!_.transmissionMap,$=Dt&&!!_.thicknessMap,ft=!!_.gradientMap,at=!!_.alphaMap,dt=_.alphaTest>0,ot=!!_.alphaHash,pt=!!_.extensions,st=ns;_.toneMapped&&(bt===null||bt.isXRRenderTarget===!0)&&(st=s.toneMapping);let tt=Bt?O.isCompressedCubeTexture?O.image[0].mipmaps:O.mipmaps:null,xt={shaderID:Q,shaderType:_.type,shaderName:_.name,vertexShader:Et,fragmentShader:Z,defines:_.defines,customVertexShaderID:ht,customFragmentShaderID:Mt,isRawShaderMaterial:_.isRawShaderMaterial===!0,glslVersion:_.glslVersion,precision:W,batching:Me,batchingColor:Me&&D._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&D.instanceColor!==null,instancingMorph:Nt&&D.morphTexture!==null,outputColorSpace:bt===null?s.outputColorSpace:bt.isXRRenderTarget===!0?bt.texture.colorSpace:ne.workingColorSpace,alphaToCoverage:!!_.alphaToCoverage,map:At,matcap:Yt,envMap:Lt,envMapMode:Lt&&O.mapping,envMapPMREM:Bt,envMapMaxLod:Bt?tt.length-1:null,envMapSize:Bt?tt[0].width:null,aoMap:de,lightMap:he,bumpMap:J,normalMap:se,displacementMap:en,emissiveMap:Ee,normalMapObjectSpace:se&&_.normalMapType===Wm,normalMapTangentSpace:se&&_.normalMapType===Gh,packedNormalMap:se&&_.normalMapType===Gh&&wb(_.normalMap.format),metalnessMap:le,roughnessMap:Xe,anisotropy:Ke,anisotropyMap:Gt,clearcoat:z,clearcoatMap:C,clearcoatNormalMap:w,clearcoatRoughnessMap:V,diffuseRoughness:ge,diffuseRoughnessMap:rt,dispersion:ue,retroreflection:Wt,iridescence:ut,iridescenceMap:it,iridescenceThicknessMap:ct,sheen:pe,sheenColorMap:gt,sheenRoughnessMap:X,specularMap:j,specularColorMap:lt,specularIntensityMap:N,transmission:Dt,transmissionMap:K,thicknessMap:$,gradientMap:ft,opaque:_.transparent===!1&&_.blending===Go&&_.alphaToCoverage===!1,alphaMap:at,alphaTest:dt,alphaHash:ot,combine:_.combine,mapUv:At&&f(_.map.channel),aoMapUv:de&&f(_.aoMap.channel),lightMapUv:he&&f(_.lightMap.channel),bumpMapUv:J&&f(_.bumpMap.channel),normalMapUv:se&&f(_.normalMap.channel),displacementMapUv:en&&f(_.displacementMap.channel),emissiveMapUv:Ee&&f(_.emissiveMap.channel),metalnessMapUv:le&&f(_.metalnessMap.channel),roughnessMapUv:Xe&&f(_.roughnessMap.channel),anisotropyMapUv:Gt&&f(_.anisotropyMap.channel),clearcoatMapUv:C&&f(_.clearcoatMap.channel),clearcoatNormalMapUv:w&&f(_.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:V&&f(_.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:rt&&f(_.diffuseRoughnessMap.channel),iridescenceMapUv:it&&f(_.iridescenceMap.channel),iridescenceThicknessMapUv:ct&&f(_.iridescenceThicknessMap.channel),sheenColorMapUv:gt&&f(_.sheenColorMap.channel),sheenRoughnessMapUv:X&&f(_.sheenRoughnessMap.channel),specularMapUv:j&&f(_.specularMap.channel),specularColorMapUv:lt&&f(_.specularColorMap.channel),specularIntensityMapUv:N&&f(_.specularIntensityMap.channel),transmissionMapUv:K&&f(_.transmissionMap.channel),thicknessMapUv:$&&f(_.thicknessMap.channel),alphaMapUv:at&&f(_.alphaMap.channel),vertexTangents:!!P.attributes.tangent&&(se||Ke),vertexNormals:!!P.attributes.normal,vertexColors:_.vertexColors,vertexAlphas:_.vertexColors===!0&&!!P.attributes.color&&P.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!P.attributes.uv&&(At||at),fog:!!F,useFog:_.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:_.wireframe===!1&&(_.flatShading===!0||P.attributes.normal===void 0&&se===!1&&(_.isMeshLambertMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isMeshPhysicalMaterial)),sizeAttenuation:_.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:mt,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:P.attributes.position!==void 0,morphTargets:P.morphAttributes.position!==void 0,morphNormals:P.morphAttributes.normal!==void 0,morphColors:P.morphAttributes.color!==void 0,morphTargetsCount:nt,morphTextureStride:_t,numSunLights:M.sun.length,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numSunLightShadows:M.sunShadowMap.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numLightProbeGrids:L.filter(et=>et.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:_.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:st,decodeVideoTexture:At&&_.map.isVideoTexture===!0&&ne.getTransfer(_.map.colorSpace)===me,decodeVideoTextureEmissive:Ee&&_.emissiveMap.isVideoTexture===!0&&ne.getTransfer(_.emissiveMap.colorSpace)===me,premultipliedAlpha:_.premultipliedAlpha,doubleSided:_.side===es,flipSided:_.side===wn,useDepthPacking:_.depthPacking>=0,depthPacking:_.depthPacking||0,index0AttributeName:_.index0AttributeName,extensionClipCullDistance:pt&&_.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pt&&_.extensions.multiDraw===!0||Me)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:_.customProgramCacheKey()};return xt.vertexUv1s=l.has(1),xt.vertexUv2s=l.has(2),xt.vertexUv3s=l.has(3),l.clear(),xt}function x(_){let M=[];if(_.shaderID?M.push(_.shaderID):(M.push(_.customVertexShaderID),M.push(_.customFragmentShaderID)),_.defines!==void 0)for(let R in _.defines)M.push(R),M.push(_.defines[R]);return _.isRawShaderMaterial===!1&&(p(M,_),g(M,_),M.push(s.outputColorSpace)),M.push(_.customProgramCacheKey),M.join()}function p(_,M){_.push(M.precision),_.push(M.outputColorSpace),_.push(M.envMapMode),_.push(M.envMapPMREM),_.push(M.envMapMaxLod),_.push(M.envMapSize),_.push(M.mapUv),_.push(M.alphaMapUv),_.push(M.lightMapUv),_.push(M.aoMapUv),_.push(M.bumpMapUv),_.push(M.normalMapUv),_.push(M.displacementMapUv),_.push(M.emissiveMapUv),_.push(M.metalnessMapUv),_.push(M.roughnessMapUv),_.push(M.anisotropyMapUv),_.push(M.clearcoatMapUv),_.push(M.clearcoatNormalMapUv),_.push(M.clearcoatRoughnessMapUv),_.push(M.diffuseRoughnessMapUv),_.push(M.iridescenceMapUv),_.push(M.iridescenceThicknessMapUv),_.push(M.sheenColorMapUv),_.push(M.sheenRoughnessMapUv),_.push(M.specularMapUv),_.push(M.specularColorMapUv),_.push(M.specularIntensityMapUv),_.push(M.transmissionMapUv),_.push(M.thicknessMapUv),_.push(M.combine),_.push(M.fogExp2),_.push(M.sizeAttenuation),_.push(M.morphTargetsCount),_.push(M.numSunLights),_.push(M.numDirLights),_.push(M.numPointLights),_.push(M.numSpotLights),_.push(M.numSpotLightMaps),_.push(M.numHemiLights),_.push(M.numRectAreaLights),_.push(M.numSunLightShadows),_.push(M.numDirLightShadows),_.push(M.numPointLightShadows),_.push(M.numSpotLightShadows),_.push(M.numSpotLightShadowsWithMaps),_.push(M.numLightProbes),_.push(M.numLightProbeGrids),_.push(M.shadowMapType),_.push(M.toneMapping),_.push(M.numClippingPlanes),_.push(M.numClipIntersection),_.push(M.depthPacking)}function g(_,M){o.disableAll(),M.instancing&&o.enable(0),M.instancingColor&&o.enable(1),M.instancingMorph&&o.enable(2),M.matcap&&o.enable(3),M.envMap&&o.enable(4),M.normalMapObjectSpace&&o.enable(5),M.normalMapTangentSpace&&o.enable(6),M.clearcoat&&o.enable(7),M.iridescence&&o.enable(8),M.alphaTest&&o.enable(9),M.vertexColors&&o.enable(10),M.vertexAlphas&&o.enable(11),M.vertexUv1s&&o.enable(12),M.vertexUv2s&&o.enable(13),M.vertexUv3s&&o.enable(14),M.vertexTangents&&o.enable(15),M.anisotropy&&o.enable(16),M.alphaHash&&o.enable(17),M.batching&&o.enable(18),M.dispersion&&o.enable(19),M.retroreflection&&o.enable(24),M.diffuseRoughness&&o.enable(25),M.batchingColor&&o.enable(20),M.gradientMap&&o.enable(21),M.packedNormalMap&&o.enable(22),M.vertexNormals&&o.enable(23),_.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reversedDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.decodeVideoTextureEmissive&&o.enable(20),M.alphaToCoverage&&o.enable(21),M.numLightProbeGrids>0&&o.enable(22),M.hasPositionAttribute&&o.enable(23),_.push(o.mask)}function v(_){let M=u[_.type],R;if(M){let A=rs[M];R=As.clone(A.uniforms)}else R=_.uniforms;return R}function S(_,M){let R=h.get(M);return R!==void 0?++R.usedTimes:(R=new bb(s,M,_,i),c.push(R),h.set(M,R)),R}function y(_){if(--_.usedTimes===0){let M=c.indexOf(_);c[M]=c[c.length-1],c.pop(),h.delete(_.cacheKey),_.destroy()}}function b(_){a.remove(_)}function T(){a.dispose()}return{getParameters:m,getProgramCacheKey:x,getUniforms:v,acquireProgram:S,releaseProgram:y,releaseShaderCache:b,programs:c,dispose:T}}function Ab(){let s=new WeakMap;function t(o){return s.has(o)}function e(o){let a=s.get(o);return a===void 0&&(a={},s.set(o,a)),a}function n(o){s.delete(o)}function i(o,a,l){s.get(o)[a]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function Rb(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function bg(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Tg(){let s=[],t=0,e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u){let f=0;return u.isInstancedMesh&&(f+=2),u.isSkinnedMesh&&(f+=1),f}function a(u,f,m,x,p,g){let v=s[t];return v===void 0?(v={id:u.id,object:u,geometry:f,material:m,materialVariant:o(u),groupOrder:x,renderOrder:u.renderOrder,z:p,group:g},s[t]=v):(v.id=u.id,v.object=u,v.geometry=f,v.material=m,v.materialVariant=o(u),v.groupOrder=x,v.renderOrder=u.renderOrder,v.z=p,v.group=g),t++,v}function l(u,f,m,x,p,g,v){v.reversedDepth===!0&&(p=-p);let S=a(u,f,m,x,p,g);m.transmission>0?n.push(S):m.transparent===!0?i.push(S):e.push(S)}function c(u,f,m,x,p,g){let v=a(u,f,m,x,p,g);m.transmission>0?n.unshift(v):m.transparent===!0?i.unshift(v):e.unshift(v)}function h(u,f){e.length>1&&e.sort(u||Rb),n.length>1&&n.sort(f||bg),i.length>1&&i.sort(f||bg)}function d(){for(let u=t,f=s.length;u<f;u++){let m=s[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:d,sort:h}}function Cb(){let s=new WeakMap;function t(n,i){let r=s.get(n),o;return r===void 0?(o=new Tg,s.set(n,[o])):i>=r.length?(o=new Tg,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Pb(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new H,color:new Ot};break;case"SpotLight":e={position:new H,direction:new H,color:new Ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new H,color:new Ot,distance:0,decay:0};break;case"HemisphereLight":e={direction:new H,skyColor:new Ot,groundColor:new Ot};break;case"RectAreaLight":e={color:new Ot,position:new H,halfWidth:new H,halfHeight:new H};break}return s[t.id]=e,e}}}function Ib(){let s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}function Db(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Nb(s){let t=new Pb,e=Ib(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new H);let i=new H,r=new ie,o=new ie;function a(c){let h=0,d=0,u=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let f=0,m=0,x=0,p=0,g=0,v=0,S=0,y=0,b=0,T=0,_=0,M=0,R=0,A=0;c.sort(Db);for(let L=0,F=c.length;L<F;L++){let P=c[L],B=P.color,k=P.intensity,O=P.distance,Q=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===ir?Q=P.shadow.map.texture:Q=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)h+=B.r*k,d+=B.g*k,u+=B.b*k;else if(P.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(P.sh.coefficients[W],k);A++}else if(P.isSunLight){let W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let I=P.shadow,nt=e.get(P);nt.shadowIntensity=I.intensity,nt.shadowBias=I.bias,nt.shadowNormalBias=I.normalBias,nt.shadowRadius=I.radius,nt.shadowMapSize.copy(I.mapSize).multiply(I.getFrameExtents()),n.sunShadow[m]=nt,n.sunShadowMap[m]=Q;let _t=I.getViewportCount();for(let Et=0;Et<_t;Et++)n.sunShadowMatrix[x+Et]=I.getMatrix(Et),n.sunShadowCascade[x+Et]=I._cascadeData[Et];x+=_t,m++}n.sun[f]=W,f++}else if(P.isDirectionalLight){let W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){let I=P.shadow,nt=e.get(P);nt.shadowIntensity=I.intensity,nt.shadowBias=I.bias,nt.shadowNormalBias=I.normalBias,nt.shadowRadius=I.radius,nt.shadowMapSize=I.mapSize,n.directionalShadow[p]=nt,n.directionalShadowMap[p]=Q,n.directionalShadowMatrix[p]=P.shadow.matrix,b++}n.directional[p]=W,p++}else if(P.isSpotLight){let W=t.get(P);W.position.setFromMatrixPosition(P.matrixWorld),W.color.copy(B).multiplyScalar(k),W.distance=O,W.coneCos=Math.cos(P.angle),W.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),W.decay=P.decay,n.spot[v]=W;let I=P.shadow;if(P.map&&(n.spotLightMap[M]=P.map,M++,I.updateMatrices(P),P.castShadow&&R++),n.spotLightMatrix[v]=I.matrix,P.castShadow){let nt=e.get(P);nt.shadowIntensity=I.intensity,nt.shadowBias=I.bias,nt.shadowNormalBias=I.normalBias,nt.shadowRadius=I.radius,nt.shadowMapSize=I.mapSize,n.spotShadow[v]=nt,n.spotShadowMap[v]=Q,_++}v++}else if(P.isRectAreaLight){let W=t.get(P);W.color.copy(B).multiplyScalar(k),W.halfWidth.set(P.width*.5,0,0),W.halfHeight.set(0,P.height*.5,0),n.rectArea[S]=W,S++}else if(P.isPointLight){let W=t.get(P);if(W.color.copy(P.color).multiplyScalar(P.intensity),W.distance=P.distance,W.decay=P.decay,P.castShadow){let I=P.shadow,nt=e.get(P);nt.shadowIntensity=I.intensity,nt.shadowBias=I.bias,nt.shadowNormalBias=I.normalBias,nt.shadowRadius=I.radius,nt.shadowMapSize=I.mapSize,nt.shadowCameraNear=I.camera.near,nt.shadowCameraFar=I.camera.far,n.pointShadow[g]=nt,n.pointShadowMap[g]=Q,n.pointShadowMatrix[g]=P.shadow.matrix,T++}n.point[g]=W,g++}else if(P.isHemisphereLight){let W=t.get(P);W.skyColor.copy(P.color).multiplyScalar(k),W.groundColor.copy(P.groundColor).multiplyScalar(k),n.hemi[y]=W,y++}}S>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=St.LTC_FLOAT_1,n.rectAreaLTC2=St.LTC_FLOAT_2):(n.rectAreaLTC1=St.LTC_HALF_1,n.rectAreaLTC2=St.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;let D=n.hash;(D.sunLength!==f||D.directionalLength!==p||D.pointLength!==g||D.spotLength!==v||D.rectAreaLength!==S||D.hemiLength!==y||D.numSunShadows!==m||D.numDirectionalShadows!==b||D.numPointShadows!==T||D.numSpotShadows!==_||D.numSpotMaps!==M||D.numLightProbes!==A)&&(n.sun.length=f,n.directional.length=p,n.spot.length=v,n.rectArea.length=S,n.point.length=g,n.hemi.length=y,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=_,n.spotShadowMap.length=_,n.spotLightMatrix.length=_+M-R,n.spotLightMap.length=M,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=A,D.sunLength=f,D.directionalLength=p,D.pointLength=g,D.spotLength=v,D.rectAreaLength=S,D.hemiLength=y,D.numSunShadows=m,D.numDirectionalShadows=b,D.numPointShadows=T,D.numSpotShadows=_,D.numSpotMaps=M,D.numLightProbes=A,n.version=Lb++)}function l(c,h){let d=0,u=0,f=0,m=0,x=0,p=0,g=h.matrixWorldInverse;for(let v=0,S=c.length;v<S;v++){let y=c[v];if(y.isSunLight){let b=n.sun[d];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),d++}else if(y.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(g),u++}else if(y.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(g),m++}else if(y.isRectAreaLight){let b=n.rectArea[x];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),o.identity(),r.copy(y.matrixWorld),r.premultiply(g),o.extractRotation(r),b.halfWidth.set(y.width*.5,0,0),b.halfHeight.set(0,y.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),x++}else if(y.isPointLight){let b=n.point[f];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),f++}else if(y.isHemisphereLight){let b=n.hemi[p];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),p++}}}return{setup:a,setupView:l,state:n}}function wg(s){let t=new Nb(s),e=[],n=[],i=[];function r(d){h.camera=d,e.length=0,n.length=0,i.length=0}function o(d){d.isLightProbeGrid?i.push(d):e.push(d)}function a(d){n.push(d)}function l(){t.setup(e),i.sort((d,u)=>d.priority-u.priority||d.id-u.id)}function c(d){t.setupView(e,d)}let h={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:c,pushLight:o,pushShadow:a}}function Ub(s){let t=new WeakMap;function e(i,r=0){let o=t.get(i),a;return o===void 0?(a=new wg(s),t.set(i,[a])):r>=o.length?(a=new wg(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function kb(s,t,e){let n=new $s,i=new kt,r=new kt,o=new Be,a=new kc,l=new Hc,c={},h=e.maxTextureSize,d={[nr]:wn,[wn]:nr,[es]:es},u=new ln({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new kt},radius:{value:4}},vertexShader:Fb,fragmentShader:Ob}),f=u.clone();f.defines.HORIZONTAL_PASS=1;let m=new xi;m.setAttribute("position",new Yi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Jt(m,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Nr;let g=this.type;this.render=function(T,_,M){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;this.type===Mm&&(Ht("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Nr);let R=s.getRenderTarget(),A=s.getActiveCubeFace(),D=s.getActiveMipmapLevel(),L=s.state;L.setBlending(Ts),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);let F=g!==this.type;F&&_.traverse(function(P){P.material&&(Array.isArray(P.material)?P.material.forEach(B=>B.needsUpdate=!0):P.material.needsUpdate=!0)});for(let P=0,B=T.length;P<B;P++){let k=T[P],O=k.shadow;if(O===void 0){Ht("WebGLShadowMap:",k,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);let Q=O.getFrameExtents();i.multiply(Q),r.copy(O.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/Q.x),i.x=r.x*Q.x,O.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/Q.y),i.y=r.y*Q.y,O.mapSize.y=r.y));let W=s.state.buffers.depth.getReversed();if(O.camera._reversedDepth=W,O.map===null||F===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Ho){if(k.isPointLight){Ht("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new je(i.x,i.y,{format:ir,type:He,minFilter:Qe,magFilter:Qe,generateMipmaps:!1}),O.map.texture.name=k.name+".shadowMap",O.map.depthTexture=new bs(i.x,i.y,$n),O.map.depthTexture.name=k.name+".shadowMapDepth",O.map.depthTexture.format=Ss,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=yn,O.map.depthTexture.magFilter=yn}else k.isPointLight?(O.map=new dl(i.x),O.map.depthTexture=new ka(i.x,qi)):(O.map=new je(i.x,i.y),O.map.depthTexture=new bs(i.x,i.y,qi)),O.map.depthTexture.name=k.name+".shadowMap",O.map.depthTexture.format=Ss,this.type===Nr?(O.map.depthTexture.compareFunction=W?Wf:Vf,O.map.depthTexture.minFilter=Qe,O.map.depthTexture.magFilter=Qe):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=yn,O.map.depthTexture.magFilter=yn);O.camera.updateProjectionMatrix()}O.map.isWebGLCubeRenderTarget!==!0&&(O.map.width!==i.x||O.map.height!==i.y)&&O.map.setSize(i.x,i.y);let I=O.map.isWebGLCubeRenderTarget?6:O.getViewportCount();k.isPointLight!==!0&&O.updateMatrices(k,M);let nt=(O.camera.layers.mask&4294967294)!==0?O.camera.layers:M.layers;for(let _t=0;_t<I;_t++){let Et=O.getCamera(_t);if(k.isPointLight){let Z=O.camera,ht=O.matrix,Mt=k.distance||Z.far;Mt!==Z.far&&(Z.far=Mt,Z.updateProjectionMatrix()),ul.setFromMatrixPosition(k.matrixWorld),Z.position.copy(ul),ad.copy(Z.position),ad.add(Bb[_t]),Z.up.copy(zb[_t]),Z.lookAt(ad),Z.updateMatrixWorld(),ht.makeTranslation(-ul.x,-ul.y,-ul.z),Eg.multiplyMatrices(Z.projectionMatrix,Z.matrixWorldInverse),O._frustum.setFromProjectionMatrix(Eg,Z.coordinateSystem,Z.reversedDepth)}if(O.map.isWebGLCubeRenderTarget)s.setRenderTarget(O.map,_t),s.clear();else{_t===0&&(s.setRenderTarget(O.map),s.clear());let Z=O.getViewport(_t);o.set(r.x*Z.x,r.y*Z.y,r.x*Z.z,r.y*Z.w),L.viewport(o)}n=O.getFrustum(_t),y(_,M,Et,k,nt,this.type)}O.isPointLightShadow!==!0&&this.type===Ho&&v(O,M),O.needsUpdate=!1}g=this.type,p.needsUpdate=!1,s.setRenderTarget(R,A,D)};function v(T,_){let M=t.update(x);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new je(i.x,i.y,{format:ir,type:He}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(_,null,M,u,x,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(_,null,M,f,x,null)}function S(T,_,M,R){let A=null,D=M.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)A=D;else if(A=M.isPointLight===!0?l:a,s.localClippingEnabled&&_.clipShadows===!0&&Array.isArray(_.clippingPlanes)&&_.clippingPlanes.length!==0||_.displacementMap&&_.displacementScale!==0||_.alphaMap&&_.alphaTest>0||_.map&&_.alphaTest>0||_.alphaToCoverage===!0){let L=A.uuid,F=_.uuid,P=c[L];P===void 0&&(P={},c[L]=P);let B=P[F];B===void 0&&(B=A.clone(),P[F]=B,_.addEventListener("dispose",b)),A=B}if(A.visible=_.visible,A.wireframe=_.wireframe,R===Ho?A.side=_.shadowSide!==null?_.shadowSide:_.side:A.side=_.shadowSide!==null?_.shadowSide:d[_.side],A.alphaMap=_.alphaMap,A.alphaTest=_.alphaToCoverage===!0?.5:_.alphaTest,A.map=_.map,A.clipShadows=_.clipShadows,A.clippingPlanes=_.clippingPlanes,A.clipIntersection=_.clipIntersection,A.displacementMap=_.displacementMap,A.displacementScale=_.displacementScale,A.displacementBias=_.displacementBias,A.wireframeLinewidth=_.wireframeLinewidth,A.linewidth=_.linewidth,M.isPointLight===!0&&A.isMeshDistanceMaterial===!0){let L=s.properties.get(A);L.light=M}return A}function y(T,_,M,R,A,D){if(T.visible===!1)return;if(T.layers.test(A)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===Ho)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(M.matrixWorldInverse,T.matrixWorld);let P=t.update(T),B=T.material;if(Array.isArray(B)){let k=P.groups;for(let O=0,Q=k.length;O<Q;O++){let W=k[O],I=B[W.materialIndex];if(I&&I.visible){let nt=S(T,I,R,D);T.onBeforeShadow(s,T,_,M,P,nt,W),s.renderBufferDirect(M,null,P,nt,T,W),T.onAfterShadow(s,T,_,M,P,nt,W)}}}else if(B.visible){let k=S(T,B,R,D);T.onBeforeShadow(s,T,_,M,P,k,null),s.renderBufferDirect(M,null,P,k,T,null),T.onAfterShadow(s,T,_,M,P,k,null)}}let F=T.children;for(let P=0,B=F.length;P<B;P++)y(F[P],_,M,R,A,D)}function b(T){T.target.removeEventListener("dispose",b);for(let M in c){let R=c[M],A=T.target.uuid;A in R&&(R[A].dispose(),delete R[A])}}}function Hb(s,t){function e(){let N=!1,K=new Be,$=null,ft=new Be(0,0,0,0);return{setMask:function(at){$!==at&&!N&&(s.colorMask(at,at,at,at),$=at)},setLocked:function(at){N=at},setClear:function(at,dt,ot,pt,st){st===!0&&(at*=pt,dt*=pt,ot*=pt),K.set(at,dt,ot,pt),ft.equals(K)===!1&&(s.clearColor(at,dt,ot,pt),ft.copy(K))},reset:function(){N=!1,$=null,ft.set(-1,0,0,0)}}}function n(){let N=!1,K=!1,$=null,ft=null,at=null;return{setReversed:function(dt){if(K!==dt){let ot=t.get("EXT_clip_control");dt?ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.ZERO_TO_ONE_EXT):ot.clipControlEXT(ot.LOWER_LEFT_EXT,ot.NEGATIVE_ONE_TO_ONE_EXT),K=dt;let pt=at;at=null,this.setClear(pt)}},getReversed:function(){return K},setTest:function(dt){dt?mt(s.DEPTH_TEST):Nt(s.DEPTH_TEST)},setMask:function(dt){$!==dt&&!N&&(s.depthMask(dt),$=dt)},setFunc:function(dt){if(K&&(dt=eg[dt]),ft!==dt){switch(dt){case bc:s.depthFunc(s.NEVER);break;case Tc:s.depthFunc(s.ALWAYS);break;case wc:s.depthFunc(s.LESS);break;case Po:s.depthFunc(s.LEQUAL);break;case Ec:s.depthFunc(s.EQUAL);break;case Ac:s.depthFunc(s.GEQUAL);break;case Rc:s.depthFunc(s.GREATER);break;case Cc:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}ft=dt}},setLocked:function(dt){N=dt},setClear:function(dt){at!==dt&&(at=dt,K&&(dt=1-dt),s.clearDepth(dt))},reset:function(){N=!1,$=null,ft=null,at=null,K=!1}}}function i(){let N=!1,K=null,$=null,ft=null,at=null,dt=null,ot=null,pt=null,st=null;return{setTest:function(tt){N||(tt?mt(s.STENCIL_TEST):Nt(s.STENCIL_TEST))},setMask:function(tt){K!==tt&&!N&&(s.stencilMask(tt),K=tt)},setFunc:function(tt,xt,et){($!==tt||ft!==xt||at!==et)&&(s.stencilFunc(tt,xt,et),$=tt,ft=xt,at=et)},setOp:function(tt,xt,et){(dt!==tt||ot!==xt||pt!==et)&&(s.stencilOp(tt,xt,et),dt=tt,ot=xt,pt=et)},setLocked:function(tt){N=tt},setClear:function(tt){st!==tt&&(s.clearStencil(tt),st=tt)},reset:function(){N=!1,K=null,$=null,ft=null,at=null,dt=null,ot=null,pt=null,st=null}}}let r=new e,o=new n,a=new i,l={},c=new WeakMap,h={},d={},u={},f=new WeakMap,m=[],x=null,p=!1,g=null,v=null,S=null,y=null,b=null,T=null,_=null,M=new Ot(0,0,0),R=0,A=!1,D=null,L=null,F=null,P=null,B=null,k=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),O=!1,Q=0,W=s.getParameter(s.VERSION);W.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(W)[1]),O=Q>=1):W.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),O=Q>=2);let I=null,nt={},_t=s.getParameter(s.SCISSOR_BOX),Et=s.getParameter(s.VIEWPORT),Z=new Be().fromArray(_t),ht=new Be().fromArray(Et);function Mt(N,K,$,ft){let at=new Uint8Array(4),dt=s.createTexture();s.bindTexture(N,dt),s.texParameteri(N,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(N,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ot=0;ot<$;ot++)N===s.TEXTURE_3D||N===s.TEXTURE_2D_ARRAY?s.texImage3D(K,0,s.RGBA,1,1,ft,0,s.RGBA,s.UNSIGNED_BYTE,at):s.texImage2D(K+ot,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,at);return dt}let bt={};bt[s.TEXTURE_2D]=Mt(s.TEXTURE_2D,s.TEXTURE_2D,1),bt[s.TEXTURE_CUBE_MAP]=Mt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),bt[s.TEXTURE_2D_ARRAY]=Mt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),bt[s.TEXTURE_3D]=Mt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),mt(s.DEPTH_TEST),o.setFunc(Po),J(!1),se(Pf),mt(s.CULL_FACE),de(Ts);function mt(N){h[N]!==!0&&(s.enable(N),h[N]=!0)}function Nt(N){h[N]!==!1&&(s.disable(N),h[N]=!1)}function Me(N,K){return u[N]!==K?(s.bindFramebuffer(N,K),u[N]=K,N===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=K),N===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=K),!0):!1}function At(N,K){let $=m,ft=!1;if(N){$=f.get(K),$===void 0&&($=[],f.set(K,$));let at=N.textures;if($.length!==at.length||$[0]!==s.COLOR_ATTACHMENT0){for(let dt=0,ot=at.length;dt<ot;dt++)$[dt]=s.COLOR_ATTACHMENT0+dt;$.length=at.length,ft=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,ft=!0);ft&&s.drawBuffers($)}function Yt(N){return x!==N?(s.useProgram(N),x=N,!0):!1}let Lt={[Fr]:s.FUNC_ADD,[bm]:s.FUNC_SUBTRACT,[Tm]:s.FUNC_REVERSE_SUBTRACT};Lt[wm]=s.MIN,Lt[Em]=s.MAX;let Bt={[Am]:s.ZERO,[Rm]:s.ONE,[Cm]:s.SRC_COLOR,[Df]:s.SRC_ALPHA,[Um]:s.SRC_ALPHA_SATURATE,[Dm]:s.DST_COLOR,[Im]:s.DST_ALPHA,[Pm]:s.ONE_MINUS_SRC_COLOR,[Nf]:s.ONE_MINUS_SRC_ALPHA,[Nm]:s.ONE_MINUS_DST_COLOR,[Lm]:s.ONE_MINUS_DST_ALPHA,[Fm]:s.CONSTANT_COLOR,[Om]:s.ONE_MINUS_CONSTANT_COLOR,[Bm]:s.CONSTANT_ALPHA,[zm]:s.ONE_MINUS_CONSTANT_ALPHA};function de(N,K,$,ft,at,dt,ot,pt,st,tt){if(N===Ts){p===!0&&(Nt(s.BLEND),p=!1);return}if(p===!1&&(mt(s.BLEND),p=!0),N!==Sm){if(N!==g||tt!==A){if((v!==Fr||b!==Fr)&&(s.blendEquation(s.FUNC_ADD),v=Fr,b=Fr),tt)switch(N){case Go:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ur:s.blendFunc(s.ONE,s.ONE);break;case If:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Lf:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:Vt("WebGLState: Invalid blending: ",N);break}else switch(N){case Go:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Ur:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case If:Vt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Lf:Vt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Vt("WebGLState: Invalid blending: ",N);break}S=null,y=null,T=null,_=null,M.set(0,0,0),R=0,g=N,A=tt}return}at=at||K,dt=dt||$,ot=ot||ft,(K!==v||at!==b)&&(s.blendEquationSeparate(Lt[K],Lt[at]),v=K,b=at),($!==S||ft!==y||dt!==T||ot!==_)&&(s.blendFuncSeparate(Bt[$],Bt[ft],Bt[dt],Bt[ot]),S=$,y=ft,T=dt,_=ot),(pt.equals(M)===!1||st!==R)&&(s.blendColor(pt.r,pt.g,pt.b,st),M.copy(pt),R=st),g=N,A=!1}function he(N,K){N.side===es?Nt(s.CULL_FACE):mt(s.CULL_FACE);let $=N.side===wn;K&&($=!$),J($),N.blending===Go&&N.transparent===!1?de(Ts):de(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),r.setMask(N.colorWrite);let ft=N.stencilWrite;a.setTest(ft),ft&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Ee(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?mt(s.SAMPLE_ALPHA_TO_COVERAGE):Nt(s.SAMPLE_ALPHA_TO_COVERAGE)}function J(N){D!==N&&(N?s.frontFace(s.CW):s.frontFace(s.CCW),D=N)}function se(N){N!==vm?(mt(s.CULL_FACE),N!==L&&(N===Pf?s.cullFace(s.BACK):N===ym?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Nt(s.CULL_FACE),L=N}function en(N){N!==F&&(O&&s.lineWidth(N),F=N)}function Ee(N,K,$){N?(mt(s.POLYGON_OFFSET_FILL),(P!==K||B!==$)&&(P=K,B=$,o.getReversed()&&(K=-K,$=-$),s.polygonOffset(K,$))):Nt(s.POLYGON_OFFSET_FILL)}function le(N){N?mt(s.SCISSOR_TEST):Nt(s.SCISSOR_TEST)}function Xe(N){N===void 0&&(N=s.TEXTURE0+k-1),I!==N&&(s.activeTexture(N),I=N)}function Ke(N,K,$){$===void 0&&(I===null?$=s.TEXTURE0+k-1:$=I);let ft=nt[$];ft===void 0&&(ft={type:void 0,texture:void 0},nt[$]=ft),(ft.type!==N||ft.texture!==K)&&(I!==$&&(s.activeTexture($),I=$),s.bindTexture(N,K||bt[N]),ft.type=N,ft.texture=K)}function z(){let N=nt[I];N!==void 0&&N.type!==void 0&&(s.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function ge(){try{s.compressedTexImage2D(...arguments)}catch(N){Vt("WebGLState:",N)}}function ue(){try{s.compressedTexImage3D(...arguments)}catch(N){Vt("WebGLState:",N)}}function Wt(){try{s.texSubImage2D(...arguments)}catch(N){Vt("WebGLState:",N)}}function ut(){try{s.texSubImage3D(...arguments)}catch(N){Vt("WebGLState:",N)}}function pe(){try{s.compressedTexSubImage2D(...arguments)}catch(N){Vt("WebGLState:",N)}}function Dt(){try{s.compressedTexSubImage3D(...arguments)}catch(N){Vt("WebGLState:",N)}}function Gt(){try{s.texStorage2D(...arguments)}catch(N){Vt("WebGLState:",N)}}function C(){try{s.texStorage3D(...arguments)}catch(N){Vt("WebGLState:",N)}}function w(){try{s.texImage2D(...arguments)}catch(N){Vt("WebGLState:",N)}}function V(){try{s.texImage3D(...arguments)}catch(N){Vt("WebGLState:",N)}}function rt(N){return d[N]!==void 0?d[N]:s.getParameter(N)}function it(N,K){d[N]!==K&&(s.pixelStorei(N,K),d[N]=K)}function ct(N){Z.equals(N)===!1&&(s.scissor(N.x,N.y,N.z,N.w),Z.copy(N))}function gt(N){ht.equals(N)===!1&&(s.viewport(N.x,N.y,N.z,N.w),ht.copy(N))}function X(N,K){let $=c.get(K);$===void 0&&($=new WeakMap,c.set(K,$));let ft=$.get(N);ft===void 0&&(ft=s.getUniformBlockIndex(K,N.name),s.uniformBlockBinding(K,ft,ft),$.set(N,ft))}function j(N,K,$){let at=c.get(K).get(N);l[at]!==$&&(s.bindBufferBase(s.UNIFORM_BUFFER,at,$),l[at]=$)}function lt(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},d={},I=null,nt={},u={},l={},f=new WeakMap,m=[],x=null,p=!1,g=null,v=null,S=null,y=null,b=null,T=null,_=null,M=new Ot(0,0,0),R=0,A=!1,D=null,L=null,F=null,P=null,B=null,Z.set(0,0,s.canvas.width,s.canvas.height),ht.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:mt,disable:Nt,bindFramebuffer:Me,drawBuffers:At,useProgram:Yt,setBlending:de,setMaterial:he,setFlipSided:J,setCullFace:se,setLineWidth:en,setPolygonOffset:Ee,setScissorTest:le,activeTexture:Xe,bindTexture:Ke,unbindTexture:z,compressedTexImage2D:ge,compressedTexImage3D:ue,texImage2D:w,texImage3D:V,pixelStorei:it,getParameter:rt,updateUBOMapping:X,uniformBlockBinding:j,texStorage2D:Gt,texStorage3D:C,texSubImage2D:Wt,texSubImage3D:ut,compressedTexSubImage2D:pe,compressedTexSubImage3D:Dt,scissor:ct,viewport:gt,reset:lt}}function Gb(s,t,e,n,i,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new kt,h=new WeakMap,d=new Set,u,f=new WeakMap,m=new Set,x=new FinalizationRegistry(C=>m.delete(C)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,w){return p?new OffscreenCanvas(C,w):Do("canvas")}function v(C,w,V){let rt=1,it=Gt(C);if((it.width>V||it.height>V)&&(rt=V/Math.max(it.width,it.height)),rt<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let ct=Math.floor(rt*it.width),gt=Math.floor(rt*it.height);u===void 0&&(u=g(ct,gt));let X=w?g(ct,gt):u;return X.width=ct,X.height=gt,X.getContext("2d").drawImage(C,0,0,ct,gt),Ht("WebGLRenderer: Texture has been resized from ("+it.width+"x"+it.height+") to ("+ct+"x"+gt+")."),X}else return"data"in C&&Ht("WebGLRenderer: Image in DataTexture is too big ("+it.width+"x"+it.height+")."),C;return C}function S(C){return C.generateMipmaps}function y(C){s.generateMipmap(C)}function b(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function T(C,w,V,rt,it,ct=!1){if(C!==null){if(s[C]!==void 0)return s[C];Ht("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let gt;rt&&(gt=t.get("EXT_texture_norm16"),gt||Ht("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=w;if(w===s.RED&&(V===s.FLOAT&&(X=s.R32F),V===s.HALF_FLOAT&&(X=s.R16F),V===s.UNSIGNED_BYTE&&(X=s.R8),V===s.UNSIGNED_SHORT&&gt&&(X=gt.R16_EXT),V===s.SHORT&&gt&&(X=gt.R16_SNORM_EXT)),w===s.RED_INTEGER&&(V===s.UNSIGNED_BYTE&&(X=s.R8UI),V===s.UNSIGNED_SHORT&&(X=s.R16UI),V===s.UNSIGNED_INT&&(X=s.R32UI),V===s.BYTE&&(X=s.R8I),V===s.SHORT&&(X=s.R16I),V===s.INT&&(X=s.R32I)),w===s.RG&&(V===s.FLOAT&&(X=s.RG32F),V===s.HALF_FLOAT&&(X=s.RG16F),V===s.UNSIGNED_BYTE&&(X=s.RG8),V===s.UNSIGNED_SHORT&&gt&&(X=gt.RG16_EXT),V===s.SHORT&&gt&&(X=gt.RG16_SNORM_EXT)),w===s.RG_INTEGER&&(V===s.UNSIGNED_BYTE&&(X=s.RG8UI),V===s.UNSIGNED_SHORT&&(X=s.RG16UI),V===s.UNSIGNED_INT&&(X=s.RG32UI),V===s.BYTE&&(X=s.RG8I),V===s.SHORT&&(X=s.RG16I),V===s.INT&&(X=s.RG32I)),w===s.RGB_INTEGER&&(V===s.UNSIGNED_BYTE&&(X=s.RGB8UI),V===s.UNSIGNED_SHORT&&(X=s.RGB16UI),V===s.UNSIGNED_INT&&(X=s.RGB32UI),V===s.BYTE&&(X=s.RGB8I),V===s.SHORT&&(X=s.RGB16I),V===s.INT&&(X=s.RGB32I)),w===s.RGBA_INTEGER&&(V===s.UNSIGNED_BYTE&&(X=s.RGBA8UI),V===s.UNSIGNED_SHORT&&(X=s.RGBA16UI),V===s.UNSIGNED_INT&&(X=s.RGBA32UI),V===s.BYTE&&(X=s.RGBA8I),V===s.SHORT&&(X=s.RGBA16I),V===s.INT&&(X=s.RGBA32I)),w===s.RGB&&(V===s.UNSIGNED_SHORT&&gt&&(X=gt.RGB16_EXT),V===s.SHORT&&gt&&(X=gt.RGB16_SNORM_EXT),V===s.UNSIGNED_INT_5_9_9_9_REV&&(X=s.RGB9_E5),V===s.UNSIGNED_INT_10F_11F_11F_REV&&(X=s.R11F_G11F_B10F)),w===s.RGBA){let j=ct?Pa:ne.getTransfer(it);V===s.FLOAT&&(X=s.RGBA32F),V===s.HALF_FLOAT&&(X=s.RGBA16F),V===s.UNSIGNED_BYTE&&(X=j===me?s.SRGB8_ALPHA8:s.RGBA8),V===s.UNSIGNED_SHORT&&gt&&(X=gt.RGBA16_EXT),V===s.SHORT&&gt&&(X=gt.RGBA16_SNORM_EXT),V===s.UNSIGNED_SHORT_4_4_4_4&&(X=s.RGBA4),V===s.UNSIGNED_SHORT_5_5_5_1&&(X=s.RGB5_A1)}return(X===s.R16F||X===s.R32F||X===s.RG16F||X===s.RG32F||X===s.RGBA16F||X===s.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function _(C,w){let V;return C?w===null||w===qi||w===zr?V=s.DEPTH24_STENCIL8:w===$n?V=s.DEPTH32F_STENCIL8:w===Wo&&(V=s.DEPTH24_STENCIL8,Ht("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===qi||w===zr?V=s.DEPTH_COMPONENT24:w===$n?V=s.DEPTH_COMPONENT32F:w===Wo&&(V=s.DEPTH_COMPONENT16),V}function M(C,w){return S(C)===!0||C.isFramebufferTexture&&C.minFilter!==yn&&C.minFilter!==Qe?Math.log2(Math.max(w.width,w.height))+1:C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?w.mipmaps.length:1}function R(C){let w=new WeakRef(C);n.get(C).__ref=w,m.add(w),x.register(C,w,w)}function A(C){let w=n.get(C).__ref;w!==void 0&&(m.delete(w),x.unregister(w))}function D(C){F(C.target)}function L(C){P(C.target)}function F(C){C.removeEventListener("dispose",D),A(C),k(C),C.isVideoTexture&&h.delete(C),C.isHTMLTexture&&d.delete(C)}function P(C){C.removeEventListener("dispose",L),A(C),Q(C)}function B(){for(let C of m){let w=C.deref();w!==void 0&&(w.isRenderTarget===!0?P(w):F(w))}m.clear(),d.clear()}function k(C){let w=n.get(C);if(w.__webglInit===void 0)return;let V=C.source,rt=f.get(V);if(rt){let it=rt[w.__cacheKey];it.usedTimes--,it.usedTimes===0&&O(C),Object.keys(rt).length===0&&f.delete(V)}n.remove(C)}function O(C){let w=n.get(C);s.deleteTexture(w.__webglTexture);let V=C.source,rt=f.get(V);delete rt[w.__cacheKey],o.memory.textures--}function Q(C){let w=n.get(C);w.__depthDisposeCallback&&w.__depthDisposeCallback();let V=C.depthTexture;if(V&&V.renderTarget===C&&F(V),C.isWebGLCubeRenderTarget)for(let it=0;it<6;it++){if(Array.isArray(w.__webglFramebuffer[it]))for(let ct=0;ct<w.__webglFramebuffer[it].length;ct++)s.deleteFramebuffer(w.__webglFramebuffer[it][ct]);else s.deleteFramebuffer(w.__webglFramebuffer[it]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[it])}else{if(Array.isArray(w.__webglFramebuffer))for(let it=0;it<w.__webglFramebuffer.length;it++)s.deleteFramebuffer(w.__webglFramebuffer[it]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let it=0;it<w.__webglColorRenderbuffer.length;it++)w.__webglColorRenderbuffer[it]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[it]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let rt=C.textures;for(let it=0,ct=rt.length;it<ct;it++){let gt=n.get(rt[it]);gt.__webglTexture&&(s.deleteTexture(gt.__webglTexture),o.memory.textures--),n.remove(rt[it])}n.remove(C)}let W=0;function I(){W=0}function nt(){return W}function _t(C){W=C}function Et(){let C=W;return C>=i.maxTextures&&Ht("WebGLTextures: Trying to use "+(C+1)+" texture units while this GPU supports only "+i.maxTextures),W+=1,C}function Z(C){let w=[];return w.push(C.wrapS),w.push(C.wrapT),w.push(C.wrapR||0),w.push(C.magFilter),w.push(C.minFilter),w.push(C.anisotropy),w.push(C.internalFormat),w.push(C.format),w.push(C.type),w.push(C.generateMipmaps),w.push(C.mipmapsAutoUpdate),w.push(C.premultiplyAlpha),w.push(C.flipY),w.push(C.unpackAlignment),w.push(C.colorSpace),w.join()}function ht(C,w){let V=n.get(C);if(C.isVideoTexture&&pe(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&V.__version!==C.version){let rt=C.image;if(rt===null)Ht("WebGLRenderer: Texture marked for update but no image data found.");else if(rt.complete===!1)Ht("WebGLRenderer: Texture marked for update but image is incomplete");else{he(V,C,w);return}}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,V.__webglTexture,s.TEXTURE0+w)}function Mt(C,w){let V=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){he(V,C,w);return}else C.isExternalTexture&&(V.__webglTexture=C.sourceTexture?C.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,V.__webglTexture,s.TEXTURE0+w)}function bt(C,w){let V=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&V.__version!==C.version){he(V,C,w);return}e.bindTexture(s.TEXTURE_3D,V.__webglTexture,s.TEXTURE0+w)}function mt(C,w){let V=n.get(C);if(C.version>0&&V.__version!==C.version){J(V,C,w);return}e.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture,s.TEXTURE0+w)}let Nt={[Io]:s.REPEAT,[Li]:s.CLAMP_TO_EDGE,[Pc]:s.MIRRORED_REPEAT},Me={[yn]:s.NEAREST,[Gm]:s.NEAREST_MIPMAP_NEAREST,[il]:s.NEAREST_MIPMAP_LINEAR,[Qe]:s.LINEAR,[sh]:s.LINEAR_MIPMAP_NEAREST,[is]:s.LINEAR_MIPMAP_LINEAR},At={[Ym]:s.NEVER,[Xf]:s.ALWAYS,[qm]:s.LESS,[Vf]:s.LEQUAL,[Zm]:s.EQUAL,[Wf]:s.GEQUAL,[Jm]:s.GREATER,[$m]:s.NOTEQUAL};function Yt(C,w){if(w.type===$n&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===Qe||w.magFilter===sh||w.magFilter===il||w.magFilter===is||w.minFilter===Qe||w.minFilter===sh||w.minFilter===il||w.minFilter===is)&&Ht("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,Nt[w.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,Nt[w.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,Nt[w.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,Me[w.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,Me[w.minFilter]),w.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,At[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===yn||w.minFilter!==il&&w.minFilter!==is||w.type===$n&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){let V=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function Lt(C,w){let V=!1;C.__webglInit===void 0&&(C.__webglInit=!0,w.addEventListener("dispose",D),R(w));let rt=w.source,it=f.get(rt);it===void 0&&(it={},f.set(rt,it));let ct=Z(w);if(ct!==C.__cacheKey){it[ct]===void 0&&(it[ct]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,V=!0),it[ct].usedTimes++;let gt=it[C.__cacheKey];gt!==void 0&&(it[C.__cacheKey].usedTimes--,gt.usedTimes===0&&O(w)),C.__cacheKey=ct,C.__webglTexture=it[ct].texture}return V}function Bt(C,w,V){return Math.floor(Math.floor(C/V)/w)}function de(C,w,V,rt){let ct=C.updateRanges;if(ct.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,w.width,w.height,V,rt,w.data);else{ct.sort((N,K)=>N.start-K.start);let gt=0;for(let N=1;N<ct.length;N++){let K=ct[gt],$=ct[N],ft=K.start+K.count,at=Bt($.start,w.width,4),dt=Bt(K.start,w.width,4);$.start<=ft+1&&at===dt&&Bt($.start+$.count-1,w.width,4)===at?K.count=Math.max(K.count,$.start+$.count-K.start):(++gt,ct[gt]=$)}ct.length=gt+1;let X=e.getParameter(s.UNPACK_ROW_LENGTH),j=e.getParameter(s.UNPACK_SKIP_PIXELS),lt=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,w.width);for(let N=0,K=ct.length;N<K;N++){let $=ct[N],ft=Math.floor($.start/4),at=Math.ceil($.count/4),dt=ft%w.width,ot=Math.floor(ft/w.width),pt=at,st=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,dt),e.pixelStorei(s.UNPACK_SKIP_ROWS,ot),e.texSubImage2D(s.TEXTURE_2D,0,dt,ot,pt,st,V,rt,w.data)}C.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,X),e.pixelStorei(s.UNPACK_SKIP_PIXELS,j),e.pixelStorei(s.UNPACK_SKIP_ROWS,lt)}}function he(C,w,V){let rt=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(rt=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(rt=s.TEXTURE_3D);let it=Lt(C,w),ct=w.source;e.bindTexture(rt,C.__webglTexture,s.TEXTURE0+V);let gt=n.get(ct);if(ct.version!==gt.__version||it===!0){if(e.activeTexture(s.TEXTURE0+V),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){let st=ne.getPrimaries(ne.workingColorSpace),tt=w.colorSpace===Es?null:ne.getPrimaries(w.colorSpace),xt=w.colorSpace===Es||st===tt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xt)}e.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment);let j=v(w.image,!1,i.maxTextureSize);j=Dt(w,j);let lt=r.convert(w.format,w.colorSpace),N=r.convert(w.type),K=T(w.internalFormat,lt,N,w.normalized,w.colorSpace,w.isVideoTexture);Yt(rt,w);let $,ft=w.mipmaps,at=w.isVideoTexture!==!0,dt=gt.__version===void 0||it===!0,ot=ct.dataReady,pt=M(w,j);if(w.isDepthTexture)K=_(w.format===ws,w.type),dt&&(at?e.texStorage2D(s.TEXTURE_2D,1,K,j.width,j.height):e.texImage2D(s.TEXTURE_2D,0,K,j.width,j.height,0,lt,N,null));else if(w.isDataTexture)if(ft.length>0){at&&dt&&e.texStorage2D(s.TEXTURE_2D,pt,K,ft[0].width,ft[0].height);for(let st=0,tt=ft.length;st<tt;st++)$=ft[st],at?ot&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,$.width,$.height,lt,N,$.data):e.texImage2D(s.TEXTURE_2D,st,K,$.width,$.height,0,lt,N,$.data);w.generateMipmaps=!1}else at?(dt&&e.texStorage2D(s.TEXTURE_2D,pt,K,j.width,j.height),ot&&de(w,j,lt,N)):e.texImage2D(s.TEXTURE_2D,0,K,j.width,j.height,0,lt,N,j.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){at&&dt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,pt,K,ft[0].width,ft[0].height,j.depth);for(let st=0,tt=ft.length;st<tt;st++)if($=ft[st],w.format!==Zi)if(lt!==null)if(at){if(ot)if(w.layerUpdates.size>0){let xt=jf($.width,$.height,w.format,w.type);for(let et of w.layerUpdates){let Tt=$.data.subarray(et*xt/$.data.BYTES_PER_ELEMENT,(et+1)*xt/$.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,et,$.width,$.height,1,lt,Tt)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,0,$.width,$.height,j.depth,lt,$.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,st,K,$.width,$.height,j.depth,0,$.data,0,0);else Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else at?ot&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,st,0,0,0,$.width,$.height,j.depth,lt,N,$.data):e.texImage3D(s.TEXTURE_2D_ARRAY,st,K,$.width,$.height,j.depth,0,lt,N,$.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{at&&dt&&e.texStorage2D(s.TEXTURE_2D,pt,K,ft[0].width,ft[0].height);for(let st=0,tt=ft.length;st<tt;st++)$=ft[st],w.format!==Zi?lt!==null?at?ot&&e.compressedTexSubImage2D(s.TEXTURE_2D,st,0,0,$.width,$.height,lt,$.data):e.compressedTexImage2D(s.TEXTURE_2D,st,K,$.width,$.height,0,$.data):Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):at?ot&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,$.width,$.height,lt,N,$.data):e.texImage2D(s.TEXTURE_2D,st,K,$.width,$.height,0,lt,N,$.data)}else if(w.isDataArrayTexture)if(at){if(dt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,pt,K,j.width,j.height,j.depth),ot)if(w.layerUpdates.size>0){let st=jf(j.width,j.height,w.format,w.type);for(let tt of w.layerUpdates){let xt=j.data.subarray(tt*st/j.data.BYTES_PER_ELEMENT,(tt+1)*st/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,tt,j.width,j.height,1,lt,N,xt)}w.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,lt,N,j.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,K,j.width,j.height,j.depth,0,lt,N,j.data);else if(w.isData3DTexture)at?(dt&&e.texStorage3D(s.TEXTURE_3D,pt,K,j.width,j.height,j.depth),ot&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,lt,N,j.data)):e.texImage3D(s.TEXTURE_3D,0,K,j.width,j.height,j.depth,0,lt,N,j.data);else if(w.isFramebufferTexture){if(dt)if(at)e.texStorage2D(s.TEXTURE_2D,pt,K,j.width,j.height);else{let st=j.width,tt=j.height;for(let xt=0;xt<pt;xt++)e.texImage2D(s.TEXTURE_2D,xt,K,st,tt,0,lt,N,null),st>>=1,tt>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in s){let st=s.canvas;if(st.hasAttribute("layoutsubtree")||st.setAttribute("layoutsubtree","true"),j.parentNode!==st){st.appendChild(j),d.add(w),st.onpaint=tt=>{let xt=tt.changedElements;for(let et of d)xt.includes(et.image)&&(et.needsUpdate=!0)},st.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,j);else{let xt=s.RGBA,et=s.RGBA,Tt=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,xt,et,Tt,j)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(ft.length>0){if(at&&dt){let st=Gt(ft[0]);e.texStorage2D(s.TEXTURE_2D,pt,K,st.width,st.height)}for(let st=0,tt=ft.length;st<tt;st++)$=ft[st],at?ot&&e.texSubImage2D(s.TEXTURE_2D,st,0,0,lt,N,$):e.texImage2D(s.TEXTURE_2D,st,K,lt,N,$);w.generateMipmaps=!1}else if(at){if(dt){let st=Gt(j);e.texStorage2D(s.TEXTURE_2D,pt,K,st.width,st.height)}ot&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,lt,N,j)}else e.texImage2D(s.TEXTURE_2D,0,K,lt,N,j);S(w)&&w.mipmapsAutoUpdate===!0&&y(rt),gt.__version=ct.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function J(C,w,V){if(w.image.length!==6)return;let rt=Lt(C,w),it=w.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+V);let ct=n.get(it);if(it.version!==ct.__version||rt===!0){e.activeTexture(s.TEXTURE0+V);let gt=ne.getPrimaries(ne.workingColorSpace),X=w.colorSpace===Es?null:ne.getPrimaries(w.colorSpace),j=w.colorSpace===Es||gt===X?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let lt=w.isCompressedTexture||w.image[0].isCompressedTexture,N=w.image[0]&&w.image[0].isDataTexture,K=[];for(let et=0;et<6;et++)!lt&&!N?K[et]=v(w.image[et],!0,i.maxCubemapSize):K[et]=N?w.image[et].image:w.image[et],K[et]=Dt(w,K[et]);let $=K[0],ft=r.convert(w.format,w.colorSpace),at=r.convert(w.type),dt=T(w.internalFormat,ft,at,w.normalized,w.colorSpace),ot=w.isVideoTexture!==!0,pt=ct.__version===void 0||rt===!0,st=it.dataReady,tt=M(w,$);Yt(s.TEXTURE_CUBE_MAP,w);let xt;if(w.isDepthTexture){if(dt=_(w.format===ws,w.type),pt)if(ot)e.texStorage2D(s.TEXTURE_CUBE_MAP,1,dt,$.width,$.height);else for(let et=0;et<6;et++)e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,dt,$.width,$.height,0,ft,at,null)}else if(lt){ot&&pt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,tt,dt,$.width,$.height);for(let et=0;et<6;et++){xt=K[et].mipmaps;for(let Tt=0;Tt<xt.length;Tt++){let re=xt[Tt];w.format!==Zi?ft!==null?ot?st&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt,0,0,re.width,re.height,ft,re.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt,dt,re.width,re.height,0,re.data):Ht("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ot?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt,0,0,re.width,re.height,ft,at,re.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt,dt,re.width,re.height,0,ft,at,re.data)}}}else{if(xt=w.mipmaps,ot&&pt){xt.length>0&&tt++;let et=Gt(K[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,tt,dt,et.width,et.height)}for(let et=0;et<6;et++)if(N){ot?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,K[et].width,K[et].height,ft,at,K[et].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,dt,K[et].width,K[et].height,0,ft,at,K[et].data);for(let Tt=0;Tt<xt.length;Tt++){let qt=xt[Tt].image[et].image;ot?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt+1,0,0,qt.width,qt.height,ft,at,qt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt+1,dt,qt.width,qt.height,0,ft,at,qt.data)}}else{ot?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,0,0,ft,at,K[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,0,dt,ft,at,K[et]);for(let Tt=0;Tt<xt.length;Tt++){let re=xt[Tt];ot?st&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt+1,0,0,ft,at,re.image[et]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+et,Tt+1,dt,ft,at,re.image[et])}}}S(w)&&w.mipmapsAutoUpdate===!0&&y(s.TEXTURE_CUBE_MAP),ct.__version=it.version,w.onUpdate&&w.onUpdate(w)}C.__version=w.version}function se(C,w,V,rt,it,ct){let gt=r.convert(V.format,V.colorSpace),X=r.convert(V.type),j=T(V.internalFormat,gt,X,V.normalized,V.colorSpace),lt=n.get(w),N=n.get(V);if(N.__renderTarget=w,!lt.__hasExternalTextures){let K=Math.max(1,w.width>>ct),$=Math.max(1,w.height>>ct);it===s.TEXTURE_3D||it===s.TEXTURE_2D_ARRAY?e.texImage3D(it,ct,j,K,$,w.depth,0,gt,X,null):e.texImage2D(it,ct,j,K,$,0,gt,X,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),ut(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,rt,it,N.__webglTexture,0,Wt(w)):(it===s.TEXTURE_2D||it>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&it<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,rt,it,N.__webglTexture,ct),e.bindFramebuffer(s.FRAMEBUFFER,null)}function en(C,w,V){if(s.bindRenderbuffer(s.RENDERBUFFER,C),w.depthBuffer){let rt=w.depthTexture,it=rt&&rt.isDepthTexture?rt.type:null,ct=_(w.stencilBuffer,it),gt=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;ut(w)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Wt(w),ct,w.width,w.height):V?s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt(w),ct,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,ct,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,gt,s.RENDERBUFFER,C)}else{let rt=w.textures;for(let it=0;it<rt.length;it++){let ct=rt[it],gt=r.convert(ct.format,ct.colorSpace),X=r.convert(ct.type),j=T(ct.internalFormat,gt,X,ct.normalized,ct.colorSpace);ut(w)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Wt(w),j,w.width,w.height):V?s.renderbufferStorageMultisample(s.RENDERBUFFER,Wt(w),j,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,j,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Ee(C,w,V){let rt=w.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let it=n.get(w.depthTexture);it.__renderTarget=w;let ct=rt?w.depthTexture.image[0]:w.depthTexture.image;(!it.__webglTexture||ct.width!==w.width||ct.height!==w.height)&&(ct.width=w.width,ct.height=w.height,w.depthTexture.needsUpdate=!0),rt?mt(w.depthTexture,0):ht(w.depthTexture,0);let gt=it.__webglTexture,X=Wt(w),j=rt?s.TEXTURE_CUBE_MAP_POSITIVE_X+V:s.TEXTURE_2D,lt=w.depthTexture.format===ws?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(w.depthTexture.format===Ss)ut(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,lt,j,gt,0,X):s.framebufferTexture2D(s.FRAMEBUFFER,lt,j,gt,0);else if(w.depthTexture.format===ws)ut(w)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,lt,j,gt,0,X):s.framebufferTexture2D(s.FRAMEBUFFER,lt,j,gt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function le(C){let w=n.get(C),V=C.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==C.depthTexture){let rt=C.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),rt){let it=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,rt.removeEventListener("dispose",it)};rt.addEventListener("dispose",it),w.__depthDisposeCallback=it}w.__boundDepthTexture=rt}if(C.depthTexture&&!w.__autoAllocateDepthBuffer)if(V)for(let rt=0;rt<6;rt++)Ee(w.__webglFramebuffer[rt],C,rt);else C.texture.mipmaps.length>0?Ee(w.__webglFramebuffer[0],C,0):Ee(w.__webglFramebuffer,C,0);else if(V){w.__webglDepthbuffer=[];for(let rt=0;rt<6;rt++)if(e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[rt]),w.__webglDepthbuffer[rt]===void 0)w.__webglDepthbuffer[rt]=s.createRenderbuffer(),en(w.__webglDepthbuffer[rt],C,!1);else{let it=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=w.__webglDepthbuffer[rt];s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,it,s.RENDERBUFFER,ct)}}else if(C.texture.mipmaps.length>0?e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),en(w.__webglDepthbuffer,C,!1);else{let it=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ct=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,ct),s.framebufferRenderbuffer(s.FRAMEBUFFER,it,s.RENDERBUFFER,ct)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Xe(C,w,V){let rt=n.get(C);w!==void 0&&se(rt.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),V!==void 0&&le(C)}function Ke(C){let w=C.texture,V=n.get(C),rt=n.get(w);C.addEventListener("dispose",L),R(C);let it=C.textures,ct=C.isWebGLCubeRenderTarget===!0,gt=it.length>1;if(gt||(rt.__webglTexture===void 0&&(rt.__webglTexture=s.createTexture()),rt.__version=w.version,o.memory.textures++),ct){V.__webglFramebuffer=[];for(let X=0;X<6;X++)if(w.mipmaps.length>0){V.__webglFramebuffer[X]=[];for(let j=0;j<w.mipmaps.length;j++)V.__webglFramebuffer[X][j]=s.createFramebuffer()}else V.__webglFramebuffer[X]=s.createFramebuffer()}else{if(w.mipmaps.length>0){V.__webglFramebuffer=[];for(let X=0;X<w.mipmaps.length;X++)V.__webglFramebuffer[X]=s.createFramebuffer()}else V.__webglFramebuffer=s.createFramebuffer();if(gt)for(let X=0,j=it.length;X<j;X++){let lt=n.get(it[X]);lt.__webglTexture===void 0&&(lt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&ut(C)===!1){V.__webglMultisampledFramebuffer=s.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let X=0;X<it.length;X++){let j=it[X];V.__webglColorRenderbuffer[X]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,V.__webglColorRenderbuffer[X]);let lt=r.convert(j.format,j.colorSpace),N=r.convert(j.type),K=T(j.internalFormat,lt,N,j.normalized,j.colorSpace,C.isXRRenderTarget===!0),$=Wt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,$,K,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+X,s.RENDERBUFFER,V.__webglColorRenderbuffer[X])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(V.__webglDepthRenderbuffer=s.createRenderbuffer(),en(V.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(ct){e.bindTexture(s.TEXTURE_CUBE_MAP,rt.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,w);for(let X=0;X<6;X++)if(w.mipmaps.length>0)for(let j=0;j<w.mipmaps.length;j++)se(V.__webglFramebuffer[X][j],C,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+X,j);else se(V.__webglFramebuffer[X],C,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);S(w)?y(s.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),e.unbindTexture()}else if(gt){for(let X=0,j=it.length;X<j;X++){let lt=it[X],N=n.get(lt),K=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(K=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(K,N.__webglTexture),Yt(K,lt),se(V.__webglFramebuffer,C,lt,s.COLOR_ATTACHMENT0+X,K,0),S(lt)&&y(K)}e.unbindTexture()}else{let X=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(X=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(X,rt.__webglTexture),Yt(X,w),w.mipmaps.length>0)for(let j=0;j<w.mipmaps.length;j++)se(V.__webglFramebuffer[j],C,w,s.COLOR_ATTACHMENT0,X,j);else se(V.__webglFramebuffer,C,w,s.COLOR_ATTACHMENT0,X,0);S(w)?y(X):w.mipmaps.length>0&&s.texParameteri(X,s.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),e.unbindTexture()}C.depthBuffer&&le(C)}function z(C){let w=C.textures;for(let V=0,rt=w.length;V<rt;V++){let it=w[V];if(S(it)&&it.mipmapsAutoUpdate===!0){let ct=b(C),gt=n.get(it).__webglTexture;e.bindTexture(ct,gt),y(ct),e.unbindTexture()}}}let ge=[];function ue(C){if(C.samples>0){if(ut(C)===!1){let w=C.textures,V=C.width,rt=C.height,it=s.COLOR_BUFFER_BIT,ct=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,gt=n.get(C),X=w.length>1;if(X)for(let lt=0;lt<w.length;lt++)e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,gt.__webglMultisampledFramebuffer),C.texture.mipmaps.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglFramebuffer);for(let lt=0;lt<w.length;lt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(it|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(it|=s.STENCIL_BUFFER_BIT)),X){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,gt.__webglColorRenderbuffer[lt]);let N=n.get(w[lt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,N,0)}s.blitFramebuffer(0,0,V,rt,0,0,V,rt,it,s.NEAREST),l===!0&&(ge.length=0,ge.push(s.COLOR_ATTACHMENT0+lt),C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&ge.push(ct),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ge))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),X)for(let lt=0;lt<w.length;lt++){e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.RENDERBUFFER,gt.__webglColorRenderbuffer[lt]);let N=n.get(w[lt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,gt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+lt,s.TEXTURE_2D,N,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,gt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.storeMultisampledDepthBuffer===!1&&l){let w=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function Wt(C){return Math.min(i.maxSamples,C.samples)}function ut(C){let w=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function pe(C){let w=o.render.frame;h.get(C)!==w&&(h.set(C,w),C.update())}function Dt(C,w){let V=C.colorSpace,rt=C.format,it=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||V!==Cr&&V!==Es&&(ne.getTransfer(V)===me?(rt!==Zi||it!==ai)&&Ht("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Vt("WebGLTextures: Unsupported texture color space:",V)),w}function Gt(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=Et,this.resetTextureUnits=I,this.getTextureUnits=nt,this.setTextureUnits=_t,this.setTexture2D=ht,this.setTexture2DArray=Mt,this.setTexture3D=bt,this.setTextureCube=mt,this.rebindTextures=Xe,this.setupRenderTarget=Ke,this.updateRenderTargetMipmap=z,this.updateMultisampleRenderTarget=ue,this.setupDepthRenderbuffer=le,this.setupFrameBufferTexture=se,this.useMultisampledRTT=ut,this.dispose=B}function Vb(s,t){function e(n,i=Es){let r,o=ne.getTransfer(i);if(n===ai)return s.UNSIGNED_BYTE;if(n===oh)return s.UNSIGNED_SHORT_4_4_4_4;if(n===ah)return s.UNSIGNED_SHORT_5_5_5_1;if(n===zf)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===kf)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===Of)return s.BYTE;if(n===Bf)return s.SHORT;if(n===Wo)return s.UNSIGNED_SHORT;if(n===rh)return s.INT;if(n===qi)return s.UNSIGNED_INT;if(n===$n)return s.FLOAT;if(n===He)return s.HALF_FLOAT;if(n===Hf)return s.ALPHA;if(n===Gf)return s.RGB;if(n===Zi)return s.RGBA;if(n===Ss)return s.DEPTH_COMPONENT;if(n===ws)return s.DEPTH_STENCIL;if(n===lh)return s.RED;if(n===ch)return s.RED_INTEGER;if(n===ir)return s.RG;if(n===hh)return s.RG_INTEGER;if(n===uh)return s.RGBA_INTEGER;if(n===sl||n===rl||n===ol||n===al)if(o===me)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===sl)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===rl)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===ol)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===al)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===sl)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===rl)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===ol)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===al)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===fh||n===dh||n===ph||n===mh)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===fh)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===dh)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ph)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===mh)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===gh||n===_h||n===xh||n===vh||n===yh||n===ll||n===Mh)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===gh||n===_h)return o===me?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===xh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===vh)return r.COMPRESSED_R11_EAC;if(n===yh)return r.COMPRESSED_SIGNED_R11_EAC;if(n===ll)return r.COMPRESSED_RG11_EAC;if(n===Mh)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Sh||n===bh||n===Th||n===wh||n===Eh||n===Ah||n===Rh||n===Ch||n===Ph||n===Ih||n===Lh||n===Dh||n===Nh||n===Uh)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Sh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===bh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Th)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===wh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Eh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ah)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Rh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ch)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ph)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ih)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Lh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Dh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Nh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Uh)return o===me?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Fh||n===Oh||n===Bh)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Fh)return o===me?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Oh)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Bh)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===zh||n===kh||n===cl||n===Hh)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===zh)return r.COMPRESSED_RED_RGTC1_EXT;if(n===kh)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===cl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Hh)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}function qb(s,t){function e(p,g){p.matrixAutoUpdate===!0&&p.updateMatrix(),g.value.copy(p.matrix)}function n(p,g){g.color.getRGB(p.fogColor.value,$f(s)),g.isFog?(p.fogNear.value=g.near,p.fogFar.value=g.far):g.isFogExp2&&(p.fogDensity.value=g.density)}function i(p,g,v,S,y){g.isNodeMaterial?g.uniformsNeedUpdate=!1:g.isMeshBasicMaterial?r(p,g):g.isMeshLambertMaterial?(r(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshToonMaterial?(r(p,g),d(p,g)):g.isMeshPhongMaterial?(r(p,g),h(p,g),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)):g.isMeshStandardMaterial?(r(p,g),u(p,g),g.isMeshPhysicalMaterial&&f(p,g,y)):g.isMeshMatcapMaterial?(r(p,g),m(p,g)):g.isMeshDepthMaterial?r(p,g):g.isMeshDistanceMaterial?(r(p,g),x(p,g)):g.isMeshNormalMaterial?r(p,g):g.isLineBasicMaterial?(o(p,g),g.isLineDashedMaterial&&a(p,g)):g.isPointsMaterial?l(p,g,v,S):g.isSpriteMaterial?c(p,g):g.isShadowMaterial?(p.color.value.copy(g.color),p.opacity.value=g.opacity):g.isShaderMaterial&&(g.uniformsNeedUpdate=!1)}function r(p,g){p.opacity.value=g.opacity,g.color&&p.diffuse.value.copy(g.color),g.emissive&&p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity),g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.bumpMap&&(p.bumpMap.value=g.bumpMap,e(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===wn&&(p.bumpScale.value*=-1)),g.normalMap&&(p.normalMap.value=g.normalMap,e(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===wn&&p.normalScale.value.negate()),g.displacementMap&&(p.displacementMap.value=g.displacementMap,e(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias),g.emissiveMap&&(p.emissiveMap.value=g.emissiveMap,e(g.emissiveMap,p.emissiveMapTransform)),g.specularMap&&(p.specularMap.value=g.specularMap,e(g.specularMap,p.specularMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest);let v=t.get(g),S=v.envMap,y=v.envMapRotation;S&&(p.envMap.value=S,p.envMapRotation.value.setFromMatrix4(Yb.makeRotationFromEuler(y)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Og),p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio),g.lightMap&&(p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,e(g.lightMap,p.lightMapTransform)),g.aoMap&&(p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,e(g.aoMap,p.aoMapTransform))}function o(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform))}function a(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,v,S){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*v,p.scale.value=S*.5,g.map&&(p.map.value=g.map,e(g.map,p.uvTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function c(p,g){p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map&&(p.map.value=g.map,e(g.map,p.mapTransform)),g.alphaMap&&(p.alphaMap.value=g.alphaMap,e(g.alphaMap,p.alphaMapTransform)),g.alphaTest>0&&(p.alphaTest.value=g.alphaTest)}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,1e-4)}function d(p,g){g.gradientMap&&(p.gradientMap.value=g.gradientMap)}function u(p,g){p.metalness.value=g.metalness,g.metalnessMap&&(p.metalnessMap.value=g.metalnessMap,e(g.metalnessMap,p.metalnessMapTransform)),p.roughness.value=g.roughness,g.roughnessMap&&(p.roughnessMap.value=g.roughnessMap,e(g.roughnessMap,p.roughnessMapTransform)),g.envMap&&(p.envMapIntensity.value=g.envMapIntensity)}function f(p,g,v){p.ior.value=g.ior,g.diffuseRoughness>0&&(p.diffuseRoughness.value=g.diffuseRoughness,g.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=g.diffuseRoughnessMap,e(g.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),g.sheen>0&&(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap&&(p.sheenColorMap.value=g.sheenColorMap,e(g.sheenColorMap,p.sheenColorMapTransform)),g.sheenRoughnessMap&&(p.sheenRoughnessMap.value=g.sheenRoughnessMap,e(g.sheenRoughnessMap,p.sheenRoughnessMapTransform))),g.clearcoat>0&&(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap&&(p.clearcoatMap.value=g.clearcoatMap,e(g.clearcoatMap,p.clearcoatMapTransform)),g.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,e(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),g.clearcoatNormalMap&&(p.clearcoatNormalMap.value=g.clearcoatNormalMap,e(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===wn&&p.clearcoatNormalScale.value.negate())),g.dispersion>0&&(p.dispersion.value=g.dispersion),g.retroreflectivity>0&&(p.retroreflectivity.value=g.retroreflectivity),g.iridescence>0&&(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=g.iridescenceThicknessMaximum,g.iridescenceMap&&(p.iridescenceMap.value=g.iridescenceMap,e(g.iridescenceMap,p.iridescenceMapTransform)),g.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,e(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),g.transmission>0&&(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap&&(p.transmissionMap.value=g.transmissionMap,e(g.transmissionMap,p.transmissionMapTransform)),p.thickness.value=g.thickness,g.thicknessMap&&(p.thicknessMap.value=g.thicknessMap,e(g.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)),g.anisotropy>0&&(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap&&(p.anisotropyMap.value=g.anisotropyMap,e(g.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap&&(p.specularColorMap.value=g.specularColorMap,e(g.specularColorMap,p.specularColorMapTransform)),g.specularIntensityMap&&(p.specularIntensityMap.value=g.specularIntensityMap,e(g.specularIntensityMap,p.specularIntensityMapTransform))}function m(p,g){g.matcap&&(p.matcap.value=g.matcap)}function x(p,g){let v=t.get(g).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Zb(s,t,e,n){let i={},r={};function o(v,S){let y=S.program;n.uniformBlockBinding(v,y,i[v.id])}function a(v,S){let y=i[v.id];y===void 0&&(m(v),y=l(v),i[v.id]=y,v.addEventListener("dispose",p));let b=S.program;n.updateUBOMapping(v,b);let T=t.render.frame;r[v.id]!==T&&(c(v),r[v.id]=T)}function l(v){let S=s.createBuffer(),y=v.__size,b=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,S),s.bufferData(s.UNIFORM_BUFFER,y,b),s.bindBuffer(s.UNIFORM_BUFFER,null),S}function c(v){let S=i[v.id],y=v.uniforms,b=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let T=0,_=y.length;T<_;T++){let M=y[T];if(Array.isArray(M))for(let R=0,A=M.length;R<A;R++)h(M[R],T,R,b);else h(M,T,0,b)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function h(v,S,y,b){if(u(v,S,y,b)===!0){let T=v.__offset,_=v.value;if(Array.isArray(_)){let M=0;for(let R=0;R<_.length;R++){let A=_[R],D=x(A,!0);d(A,v.__data,M),M+=D.storage/Float32Array.BYTES_PER_ELEMENT}}else d(_,v.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,T,v.__data)}}function d(v,S,y){typeof v=="number"||typeof v=="boolean"?S[y]=v:v.isMatrix3?(S[y]=v.elements[0],S[y+1]=v.elements[1],S[y+2]=v.elements[2],S[y+3]=0,S[y+4]=v.elements[3],S[y+5]=v.elements[4],S[y+6]=v.elements[5],S[y+7]=0,S[y+8]=v.elements[6],S[y+9]=v.elements[7],S[y+10]=v.elements[8],S[y+11]=0):ArrayBuffer.isView(v)?S.set(v.subarray(0,S.length-y),y):v.toArray(S,y)}function u(v,S,y,b){let T=v.value,_=S+"_"+y;if(Array.isArray(T)){b[_]===void 0&&(b[_]=[]);let M=b[_],R=!1;for(let A=0;A<T.length;A++)f(T[A],M,A)===!0&&(R=!0);return R}return f(T,b,_)}function f(v,S,y){if(S[y]===void 0)return typeof v=="number"||typeof v=="boolean"?S[y]=v:ArrayBuffer.isView(v)?S[y]=v.slice():S[y]=v.clone(),!0;{let b=S[y];if(typeof v=="number"||typeof v=="boolean"){if(b!==v)return S[y]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(b.equals(v)===!1)return b.copy(v),!0}}return!1}function m(v){let S=v.uniforms,y=0,b=16;for(let _=0,M=S.length;_<M;_++){let R=Array.isArray(S[_])?S[_]:[S[_]];for(let A=0,D=R.length;A<D;A++){let L=R[A],F=Array.isArray(L.value)?L.value:[L.value],P=Array.isArray(S[_])||Array.isArray(L.value),B=y;for(let O=0,Q=F.length;O<Q;O++){let W=F[O],I=x(W,P),nt=y%b,_t=nt%I.boundary,Et=nt+_t;y+=_t,Et!==0&&b-Et<I.storage&&(y+=b-Et),O===0&&(B=y),y+=I.storage}let k=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new k((y-B)/Float32Array.BYTES_PER_ELEMENT),L.__offset=B}}let T=y%b;return T>0&&(y+=b-T),v.__size=y,v.__cache={},this}function x(v,S){let y={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(y.boundary=4,y.storage=4):v.isVector2?(y.boundary=8,y.storage=8):v.isVector3||v.isColor?(y.boundary=16,y.storage=12):v.isVector4?(y.boundary=16,y.storage=16):v.isMatrix3?(y.boundary=16,y.storage=48):v.isMatrix4?(y.boundary=16,y.storage=64):v.isTexture?Ht("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(y.boundary=16,y.storage=v.byteLength):Ht("WebGLRenderer: Unsupported uniform value type.",v),S===!0&&(y.boundary=16,y.storage=Math.ceil(y.storage/16)*16),y}function p(v){let S=v.target;S.removeEventListener("dispose",p),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function g(){for(let v in i)s.deleteBuffer(i[v]);i={},r={}}return{bind:o,update:a,dispose:g}}function $b(){return ss===null&&(ss=new Pr(Jb,16,16,ir,He),ss.name="DFG_LUT",ss.minFilter=Qe,ss.magFilter=Qe,ss.wrapS=Li,ss.wrapT=Li,ss.generateMipmaps=!1,ss.needsUpdate=!0),ss}var dv,pv,mv,gv,_v,xv,vv,yv,Mv,Sv,bv,Tv,wv,Ev,Av,Rv,Cv,Pv,Iv,Lv,Dv,Nv,Uv,Fv,Ov,Bv,zv,kv,Hv,Gv,Vv,Wv,Xv,Yv,qv,Zv,Jv,$v,Kv,Qv,jv,ty,ey,ny,iy,sy,ry,oy,ay,ly,cy,hy,uy,fy,dy,py,my,gy,_y,xy,vy,yy,My,Sy,by,Ty,wy,Ey,Ay,Ry,Cy,Py,Iy,Ly,Dy,Ny,Uy,Fy,Oy,By,zy,ky,Hy,Gy,Vy,Wy,Xy,Yy,qy,Zy,Jy,$y,Ky,Qy,jy,tM,eM,nM,iM,sM,rM,oM,aM,lM,cM,hM,uM,fM,dM,pM,mM,gM,_M,xM,vM,yM,MM,SM,bM,TM,wM,EM,AM,RM,CM,PM,IM,LM,DM,NM,UM,FM,OM,BM,zM,kM,HM,GM,VM,WM,XM,Kt,St,rs,Vh,YM,Rg,dl,og,QM,jM,Cg,Pg,tS,eS,nS,Yo,dS,Ig,Lg,Dg,Ng,Ug,Fg,hg,ug,fg,dg,pg,ld,cd,hd,od,Xo,nb,ib,_g,ab,Wh,db,mb,_b,vb,Mb,Tb,fd,dd,Lb,Fb,Ob,Bb,zb,Eg,ul,ad,Wb,Xb,pd,md,Yb,Og,Jb,ss,Xh,os=on(()=>{rd();rd();dv=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pv=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,mv=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,gv=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_v=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,xv=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vv=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,yv=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Mv=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Sv=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bv=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tv=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wv=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ev=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Av=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Rv=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Cv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Pv=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Iv=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Dv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Nv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Uv=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Fv=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Ov=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Bv=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zv=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kv=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hv=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gv="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vv=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Wv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Xv=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Yv=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,qv=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zv=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Jv=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$v=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Kv=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Qv=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,jv=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,ty=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ey=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,ny=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,iy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,sy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,ry=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,oy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ay=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ly=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,cy=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,hy=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,uy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,fy=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,dy=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,py=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,my=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gy=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_y=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,xy=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,vy=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,yy=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,My=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Sy=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,by=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ty=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,wy=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ey=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Ay=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ry=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Cy=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Py=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Iy=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ly=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dy=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ny=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Uy=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Fy=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Oy=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,By=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zy=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,ky=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hy=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Gy=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vy=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wy=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xy=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yy=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,qy=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Zy=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Jy=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,$y=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ky=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Qy=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,jy=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,tM=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,eM=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,nM=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,iM=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,oM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,aM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,lM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,cM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,hM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,uM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,fM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,dM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mM=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_M=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,vM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,yM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,MM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,SM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,wM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,EM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,AM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,PM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,IM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,LM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,DM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,NM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,UM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,FM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,OM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,BM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,kM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,HM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,GM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,VM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,WM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,XM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Kt={alphahash_fragment:dv,alphahash_pars_fragment:pv,alphamap_fragment:mv,alphamap_pars_fragment:gv,alphatest_fragment:_v,alphatest_pars_fragment:xv,aomap_fragment:vv,aomap_pars_fragment:yv,batching_pars_vertex:Mv,batching_vertex:Sv,begin_vertex:bv,beginnormal_vertex:Tv,bsdfs:wv,iridescence_fragment:Ev,bumpmap_pars_fragment:Av,clipping_planes_fragment:Rv,clipping_planes_pars_fragment:Cv,clipping_planes_pars_vertex:Pv,clipping_planes_vertex:Iv,color_fragment:Lv,color_pars_fragment:Dv,color_pars_vertex:Nv,color_vertex:Uv,common:Fv,defaultnormal_vertex:Ov,displacementmap_pars_vertex:Bv,displacementmap_vertex:zv,emissivemap_fragment:kv,emissivemap_pars_fragment:Hv,colorspace_fragment:Gv,colorspace_pars_fragment:Vv,envmap_fragment:Wv,envmap_common_pars_fragment:Xv,envmap_pars_fragment:Yv,envmap_pars_vertex:qv,envmap_physical_pars_fragment:sy,envmap_vertex:Zv,fog_vertex:Jv,fog_pars_vertex:$v,fog_fragment:Kv,fog_pars_fragment:Qv,gradientmap_pars_fragment:jv,lightmap_pars_fragment:ty,lights_lambert_fragment:ey,lights_lambert_pars_fragment:ny,lights_pars_begin:iy,lights_toon_fragment:ry,lights_toon_pars_fragment:oy,lights_phong_fragment:ay,lights_phong_pars_fragment:ly,lights_physical_fragment:cy,lights_physical_pars_fragment:hy,lights_fragment_begin:uy,lights_fragment_maps:fy,lights_fragment_end:dy,lightprobes_pars_fragment:py,logdepthbuf_fragment:my,logdepthbuf_pars_fragment:gy,logdepthbuf_pars_vertex:_y,logdepthbuf_vertex:xy,map_fragment:vy,map_pars_fragment:yy,map_particle_fragment:My,map_particle_pars_fragment:Sy,metalnessmap_fragment:by,metalnessmap_pars_fragment:Ty,morphinstance_vertex:wy,morphcolor_vertex:Ey,morphnormal_vertex:Ay,morphtarget_pars_vertex:Ry,morphtarget_vertex:Cy,normal_fragment_begin:Py,normal_fragment_maps:Iy,normal_pars_fragment:Ly,normal_pars_vertex:Dy,normal_vertex:Ny,normalmap_pars_fragment:Uy,clearcoat_normal_fragment_begin:Fy,clearcoat_normal_fragment_maps:Oy,clearcoat_pars_fragment:By,iridescence_pars_fragment:zy,opaque_fragment:ky,packing:Hy,premultiplied_alpha_fragment:Gy,project_vertex:Vy,dithering_fragment:Wy,dithering_pars_fragment:Xy,roughnessmap_fragment:Yy,roughnessmap_pars_fragment:qy,shadowmap_pars_fragment:Zy,shadowmap_pars_vertex:Jy,shadowmap_vertex:$y,shadowmask_pars_fragment:Ky,skinbase_vertex:Qy,skinning_pars_vertex:jy,skinning_vertex:tM,skinnormal_vertex:eM,specularmap_fragment:nM,specularmap_pars_fragment:iM,tonemapping_fragment:sM,tonemapping_pars_fragment:rM,transmission_fragment:oM,transmission_pars_fragment:aM,uv_pars_fragment:lM,uv_pars_vertex:cM,uv_vertex:hM,worldpos_vertex:uM,background_vert:fM,background_frag:dM,backgroundCube_vert:pM,backgroundCube_frag:mM,cube_vert:gM,cube_frag:_M,depth_vert:xM,depth_frag:vM,distance_vert:yM,distance_frag:MM,equirect_vert:SM,equirect_frag:bM,linedashed_vert:TM,linedashed_frag:wM,meshbasic_vert:EM,meshbasic_frag:AM,meshlambert_vert:RM,meshlambert_frag:CM,meshmatcap_vert:PM,meshmatcap_frag:IM,meshnormal_vert:LM,meshnormal_frag:DM,meshphong_vert:NM,meshphong_frag:UM,meshphysical_vert:FM,meshphysical_frag:OM,meshtoon_vert:BM,meshtoon_frag:zM,points_vert:kM,points_frag:HM,shadow_vert:GM,shadow_frag:VM,sprite_vert:WM,sprite_frag:XM},St={common:{diffuse:{value:new Ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new Ot(16777215)},opacity:{value:1},center:{value:new kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},rs={basic:{uniforms:Fn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.fog]),vertexShader:Kt.meshbasic_vert,fragmentShader:Kt.meshbasic_frag},lambert:{uniforms:Fn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ot(0)},envMapIntensity:{value:1}}]),vertexShader:Kt.meshlambert_vert,fragmentShader:Kt.meshlambert_frag},phong:{uniforms:Fn([St.common,St.specularmap,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.fog,St.lights,{emissive:{value:new Ot(0)},specular:{value:new Ot(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphong_vert,fragmentShader:Kt.meshphong_frag},standard:{uniforms:Fn([St.common,St.envmap,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.roughnessmap,St.metalnessmap,St.fog,St.lights,{emissive:{value:new Ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag},toon:{uniforms:Fn([St.common,St.aomap,St.lightmap,St.emissivemap,St.bumpmap,St.normalmap,St.displacementmap,St.gradientmap,St.fog,St.lights,{emissive:{value:new Ot(0)}}]),vertexShader:Kt.meshtoon_vert,fragmentShader:Kt.meshtoon_frag},matcap:{uniforms:Fn([St.common,St.bumpmap,St.normalmap,St.displacementmap,St.fog,{matcap:{value:null}}]),vertexShader:Kt.meshmatcap_vert,fragmentShader:Kt.meshmatcap_frag},points:{uniforms:Fn([St.points,St.fog]),vertexShader:Kt.points_vert,fragmentShader:Kt.points_frag},dashed:{uniforms:Fn([St.common,St.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Kt.linedashed_vert,fragmentShader:Kt.linedashed_frag},depth:{uniforms:Fn([St.common,St.displacementmap]),vertexShader:Kt.depth_vert,fragmentShader:Kt.depth_frag},normal:{uniforms:Fn([St.common,St.bumpmap,St.normalmap,St.displacementmap,{opacity:{value:1}}]),vertexShader:Kt.meshnormal_vert,fragmentShader:Kt.meshnormal_frag},sprite:{uniforms:Fn([St.sprite,St.fog]),vertexShader:Kt.sprite_vert,fragmentShader:Kt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Kt.background_vert,fragmentShader:Kt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Kt.backgroundCube_vert,fragmentShader:Kt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Kt.cube_vert,fragmentShader:Kt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Kt.equirect_vert,fragmentShader:Kt.equirect_frag},distance:{uniforms:Fn([St.common,St.displacementmap,{referencePosition:{value:new H},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Kt.distance_vert,fragmentShader:Kt.distance_frag},shadow:{uniforms:Fn([St.lights,St.fog,{color:{value:new Ot(0)},opacity:{value:1}}]),vertexShader:Kt.shadow_vert,fragmentShader:Kt.shadow_frag}};rs.physical={uniforms:Fn([rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Xt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new Ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new Ot(0)},specularColor:{value:new Ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Kt.meshphysical_vert,fragmentShader:Kt.meshphysical_frag};Vh={r:0,b:0,g:0},YM=new ie,Rg=new Xt;Rg.set(-1,0,0,0,1,0,0,0,1);dl=class extends je{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Ba(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Ie(5,5,5),r=new ln({name:"CubemapFromEquirect",uniforms:kr(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:wn,blending:Ts});r.uniforms.tEquirect.value=e;let o=new Jt(i,r),a=e.minFilter;return e.minFilter===is&&(e.minFilter=Qe),new ko(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}},og=256,QM=3,jM=20,Cg=256,Pg=16,tS=3,eS=new H,nS=new Ot,Yo=class s{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ko(1,10,null),this._boxMesh=new Jt(new Ie(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){let{size:o=256,position:a=eS}=r,l=this._renderer;this._setSize(o);let c=this._allocateTarget(),h=this._getSourceTarget(!0);e>0&&(h.texture.mipmapsAutoUpdate=!1);let d=l.autoClear,u=l.autoClearColor,f=l.autoClearDepth,m=l.autoClearStencil,x=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(t.background=l.getClearColor(nS));let p=new ko(n,i,h);return p.position.copy(a),p.update(l,t),l.autoClear=d,l.autoClearColor=u,l.autoClearDepth=f,l.autoClearStencil=m,t.background=x,e>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=lg(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(og,ng(t))}_fromTexture(t,e){t.mapping===Br||t.mapping===Vo?this._setSize(t.image.length===0?og:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){let t=this._cubeSize,e=ag(t,!1,!1),n=Math.log2(t)-QM;for(let i=0;i<=n;i++)e.texture.mipmaps.push({width:t>>i,height:t>>i});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=ag(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){let i=this._boxMesh,r=this._cubeCamera;i.material=n,r.renderTarget=t,r.activeMipmapLevel=e;let o=t.width>>e;t.viewport.set(0,0,o,o),r.update(this._renderer,i),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===Br||t.mapping===Vo?(this._cubemapMaterial===null&&(this._cubemapMaterial=cg()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=lg()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=iS(),this._integrationMaterial=sS());let e=this._cubeSize,n=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/Pg);for(let o=0;o<=n;o++){let a=s.lodToRoughness(o,n);if(o>n-tS)r.roughness.value=a,this._renderCube(t,o,this._integrationMaterial);else{let l=a>0?Math.log2(e)+.5*Math.log2(6/(Cg*Math.pow(a,4)))+.5:0;i.roughness.value=a,i.lodBias.value=l,this._renderCube(t,o,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=rS());let n=this._blurMaterial,i=n.uniforms,r=this._sourceTarget;i.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,i.envMap.value=r.texture,this._renderCube(t,0,n),i.envMap.value=t.texture,this._renderCube(r,0,n)}};dS={[Ka]:"LINEAR_TONE_MAPPING",[Qa]:"REINHARD_TONE_MAPPING",[ja]:"CINEON_TONE_MAPPING",[Or]:"ACES_FILMIC_TONE_MAPPING",[el]:"AGX_TONE_MAPPING",[nl]:"NEUTRAL_TONE_MAPPING",[tl]:"CUSTOM_TONE_MAPPING"};Ig=new Nn,Lg=new bs(1,1),Dg=new ka(1),Ng=new Ia,Ug=new Uc,Fg=new Ba,hg=[],ug=[],fg=new Float32Array(16),dg=new Float32Array(9),pg=new Float32Array(4);ld=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=NS(e.type)}},cd=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=tb(e.type)}},hd=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let a=i[r];a.setValue(t,e[a.id],n)}}},od=/(\w+)(\])?(\[|\.)?/g;Xo=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);eb(a,l,this)}let i=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):r.push(o);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){let r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,r=t.length;i!==r;++i){let o=t[i];o.id in e&&n.push(o)}return n}};nb=37297,ib=0;_g=new Xt;ab={[Ka]:"Linear",[Qa]:"Reinhard",[ja]:"Cineon",[Or]:"ACESFilmic",[el]:"AgX",[nl]:"Neutral",[tl]:"Custom"};Wh=new H;db=/^[ \t]*#include +<([\w\d./]+)>/gm;mb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;_b={[Nr]:"SHADOWMAP_TYPE_PCF",[Ho]:"SHADOWMAP_TYPE_VSM"};vb={[Vo]:"ENVMAP_MODE_REFRACTION"};Mb={[Uf]:"ENVMAP_BLENDING_MULTIPLY",[km]:"ENVMAP_BLENDING_MIX",[Hm]:"ENVMAP_BLENDING_ADD"};Tb=0,fd=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new dd(t),e.set(t,n)),n}},dd=class{constructor(t){this.id=Tb++,this.code=t,this.usedTimes=0}};Lb=0;Fb=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Ob=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Bb=[new H(1,0,0),new H(-1,0,0),new H(0,1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1)],zb=[new H(0,-1,0),new H(0,-1,0),new H(0,0,1),new H(0,0,-1),new H(0,-1,0),new H(0,-1,0)],Eg=new ie,ul=new H,ad=new H;Wb=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Xb=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,pd=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new Ha(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new ln({vertexShader:Wb,fragmentShader:Xb,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Jt(new Jn(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},md=class extends Qi{constructor(t,e){super();let n=this,i=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,d=null,u=null,f=null,m=null,x=typeof XRWebGLBinding<"u",p=new pd,g={},v=e.getContextAttributes(),S=null,y=null,b=[],T=[],_=new kt,M=null,R=null,A=new qn;A.viewport=new Be;let D=new qn;D.viewport=new Be;let L=[A,D],F=new th,P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ht=b[Z];return ht===void 0&&(ht=new Fo,b[Z]=ht),ht.getTargetRaySpace()},this.getControllerGrip=function(Z){let ht=b[Z];return ht===void 0&&(ht=new Fo,b[Z]=ht),ht.getGripSpace()},this.getHand=function(Z){let ht=b[Z];return ht===void 0&&(ht=new Fo,b[Z]=ht),ht.getHandSpace()};function k(Z){let ht=T.indexOf(Z.inputSource);if(ht===-1)return;let Mt=b[ht];Mt!==void 0&&(Mt.update(Z.inputSource,Z.frame,c||o),Mt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function O(){i.removeEventListener("select",k),i.removeEventListener("selectstart",k),i.removeEventListener("selectend",k),i.removeEventListener("squeeze",k),i.removeEventListener("squeezestart",k),i.removeEventListener("squeezeend",k),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",Q);for(let Z=0;Z<b.length;Z++){let ht=T[Z];ht!==null&&(T[Z]=null,b[Z].disconnect(ht))}P=null,B=null,p.reset();for(let Z in g)delete g[Z];if(t.setRenderTarget(S),f=null,u=null,d=null,i=null,y=null,Et.stop(),n.isPresenting=!1,t.setPixelRatio(M),t.setSize(_.width,_.height,!1),R!==null){let Z=R.camera;Z.fov=R.fov,Z.zoom=R.zoom,Z.updateProjectionMatrix(),R=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&Ht("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&Ht("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:f},this.getBinding=function(){return d===null&&x&&(d=new XRWebGLBinding(i,e)),d},this.getFrame=function(){return m},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(S=t.getRenderTarget(),i.addEventListener("select",k),i.addEventListener("selectstart",k),i.addEventListener("selectend",k),i.addEventListener("squeeze",k),i.addEventListener("squeezestart",k),i.addEventListener("squeezeend",k),i.addEventListener("end",O),i.addEventListener("inputsourceschange",Q),v.xrCompatible!==!0&&await e.makeXRCompatible(),M=t.getPixelRatio(),t.getSize(_),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,bt=null,mt=null;v.depth&&(mt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Mt=v.stencil?ws:Ss,bt=v.stencil?zr:qi);let Nt={colorFormat:e.RGBA8,depthFormat:mt,scaleFactor:r};d=this.getBinding(),u=d.createProjectionLayer(Nt),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new je(u.textureWidth,u.textureHeight,{format:Zi,type:ai,depthTexture:new bs(u.textureWidth,u.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let Mt={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,e,Mt),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new je(f.framebufferWidth,f.framebufferHeight,{format:Zi,type:ai,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Et.setContext(i),Et.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Q(Z){for(let ht=0;ht<Z.removed.length;ht++){let Mt=Z.removed[ht],bt=T.indexOf(Mt);bt>=0&&(T[bt]=null,b[bt].disconnect(Mt))}for(let ht=0;ht<Z.added.length;ht++){let Mt=Z.added[ht],bt=T.indexOf(Mt);if(bt===-1){for(let Nt=0;Nt<b.length;Nt++)if(Nt>=T.length){T.push(Mt),bt=Nt;break}else if(T[Nt]===null){T[Nt]=Mt,bt=Nt;break}if(bt===-1)break}let mt=b[bt];mt&&mt.connect(Mt)}}function W(Z,ht){ht===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(ht.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let ht=Z.near,Mt=Z.far;p.texture!==null&&(p.depthNear>0&&(ht=p.depthNear),p.depthFar>0&&(Mt=p.depthFar)),F.near=D.near=A.near=ht,F.far=D.far=A.far=Mt,(P!==F.near||B!==F.far)&&(i.updateRenderState({depthNear:F.near,depthFar:F.far}),P=F.near,B=F.far),F.layers.mask=Z.layers.mask|6,A.layers.mask=F.layers.mask&-5,D.layers.mask=F.layers.mask&-3;let bt=Z.parent,mt=F.cameras;W(F,bt);for(let Nt=0;Nt<mt.length;Nt++)W(mt[Nt],bt);F.projectionMatrix.copy(A.projectionMatrix),F.projectionMatrixInverse.copy(A.projectionMatrixInverse),R===null&&Z.isPerspectiveCamera&&(R={camera:Z,fov:Z.fov,zoom:Z.zoom}),I(Z,F,bt)};function I(Z,ht,Mt){Mt===null?Z.matrix.copy(ht.matrixWorld):(Z.matrix.copy(Mt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ht.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ht.projectionMatrix),Z.projectionMatrixInverse.copy(ht.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Lc*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(u===null&&f===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(F)},this.getCameraTexture=function(Z){return g[Z]};let nt=null;function _t(Z,ht){if(h=ht.getViewerPose(c||o),m=ht,h!==null){let Mt=h.views;f!==null&&(t.setRenderTargetFramebuffer(y,f.framebuffer),t.setRenderTarget(y));let bt=!1;Mt.length!==F.cameras.length&&(F.cameras.length=0,bt=!0);for(let At=0;At<Mt.length;At++){let Yt=Mt[At],Lt=null;if(f!==null)Lt=f.getViewport(Yt);else{let de=d.getViewSubImage(u,Yt);Lt=de.viewport,At===0&&(t.setRenderTargetTextures(y,de.colorTexture,de.depthStencilTexture),t.setRenderTarget(y))}let Bt=L[At];Bt===void 0&&(Bt=new qn,Bt.layers.enable(At),Bt.viewport=new Be,L[At]=Bt),Bt.matrix.fromArray(Yt.transform.matrix),Bt.matrix.decompose(Bt.position,Bt.quaternion,Bt.scale),Bt.projectionMatrix.fromArray(Yt.projectionMatrix),Bt.projectionMatrixInverse.copy(Bt.projectionMatrix).invert(),Bt.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),At===0&&(F.matrix.copy(Bt.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),bt===!0&&F.cameras.push(Bt)}let mt=i.enabledFeatures;if(mt&&mt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&x){d=n.getBinding();let At=d.getDepthInformation(Mt[0]);At&&At.isValid&&At.texture&&p.init(At,i.renderState)}if(mt&&mt.includes("camera-access")&&x){t.state.unbindTexture(),d=n.getBinding();for(let At=0;At<Mt.length;At++){let Yt=Mt[At].camera;if(Yt){let Lt=g[Yt];Lt||(Lt=new Ha,g[Yt]=Lt);let Bt=d.getCameraImage(Yt);Lt.sourceTexture=Bt}}}}for(let Mt=0;Mt<b.length;Mt++){let bt=T[Mt],mt=b[Mt];bt!==null&&mt!==void 0&&mt.update(bt,ht,c||o)}nt&&nt(Z,ht),ht.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ht}),m=null}let Et=new Ag;Et.setAnimationLoop(_t),this.setAnimationLoop=function(Z){nt=Z},this.dispose=function(){}}},Yb=new ie,Og=new Xt;Og.set(-1,0,0,0,1,0,0,0,1);Jb=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),ss=null;Xh=class{constructor(t={}){let{canvas:e=Qm(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:u=!1,outputBufferType:f=ai}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let x=f,p=new Set([uh,hh,ch]),g=new Set([ai,qi,Wo,zr,oh,ah]),v=new Uint32Array(4),S=new Int32Array(4),y={textures:[],min:[],max:[],resolution:[]},b=null,T=null,_=[],M=[],R=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ns,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,D=!1,L=null,F=null,P=null,B=null;this._outputColorSpace=Tn;let k=0,O=0,Q=null,W=-1,I=null,nt=new Be,_t=new Be,Et=null,Z=new Ot(0),ht=0,Mt=e.width,bt=e.height,mt=1,Nt=null,Me=null,At=new Be(0,0,Mt,bt),Yt=new Be(0,0,Mt,bt),Lt=!1,Bt=new $s,de=new Oc,he=!1,J=!1,se=new ie,en=new H,Ee=new Be,le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Xe=!1;function Ke(){return Q===null?mt:1}let z=n;function ge(E,U){return e.getContext(E,U)}let ue,Wt,ut,pe,Dt,Gt,C,w,V,rt,it,ct,gt,X,j,lt,N,K,$,ft,at,dt,ot;try{let E={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",xt,!1),e.addEventListener("webglcontextcreationerror",et,!1),z===null){let U="webgl2";if(z=ge(U,E),z===null)throw ge(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}pt()}catch(E){throw e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",xt,!1),e.removeEventListener("webglcontextcreationerror",et,!1),Vt("WebGLRenderer: "+E.message),E}function pt(){ue=new aS(z),ue.init(),at=new Vb(z,ue),Wt=new $M(z,ue,t,at),ut=new Hb(z,ue),Wt.reversedDepthBuffer&&u&&ut.buffers.depth.setReversed(!0),F=z.createFramebuffer(),P=z.createFramebuffer(),B=z.createFramebuffer(),pe=new hS(z),Dt=new Ab,Gt=new Gb(z,ue,ut,Dt,Wt,at,pe),C=new oS(A),w=new fv(z),dt=new ZM(z,w),V=new lS(z,w,pe,dt),rt=new fS(z,V,w,dt,pe),K=new uS(z,Wt,Gt),j=new KM(Dt),it=new Eb(A,C,ue,Wt,dt,j),ct=new qb(A,Dt),gt=new Cb,X=new Ub(ue),N=new qM(A,C,ut,rt,m,l),lt=new kb(A,rt,Wt),ot=new Zb(z,pe,Wt,ut),$=new JM(z,ue,pe),ft=new cS(z,ue,pe),pe.programs=it.programs,A.capabilities=Wt,A.extensions=ue,A.properties=Dt,A.renderLists=gt,A.shadowMap=lt,A.state=ut,A.info=pe}x!==ai&&(R=new pS(x,e.width,e.height,a,i,r));let st=new md(A,z);this.xr=st,this.getContext=function(){return z},this.getContextAttributes=function(){return z.getContextAttributes()},this.forceContextLoss=function(){let E=ue.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=ue.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return mt},this.setPixelRatio=function(E){E!==void 0&&(mt=E,this.setSize(Mt,bt,!1))},this.getSize=function(E){return E.set(Mt,bt)},this.setSize=function(E,U,q=!0){if(st.isPresenting){Ht("WebGLRenderer: Can't change size while VR device is presenting.");return}Mt=E,bt=U,e.width=Math.floor(E*mt),e.height=Math.floor(U*mt),q===!0&&(e.style.width=E+"px",e.style.height=U+"px"),R!==null&&R.setSize(e.width,e.height),this.setViewport(0,0,E,U)},this.getDrawingBufferSize=function(E){return E.set(Mt*mt,bt*mt).floor()},this.setDrawingBufferSize=function(E,U,q){Mt=E,bt=U,mt=q,e.width=Math.floor(E*q),e.height=Math.floor(U*q),this.setViewport(0,0,E,U)},this.setEffects=function(E){if(x===ai){Vt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(E){for(let U=0;U<E.length;U++)if(E[U].isOutputPass===!0){Ht("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(E||[])},this.getCurrentViewport=function(E){return E.copy(nt)},this.getViewport=function(E){return E.copy(At)},this.setViewport=function(E,U,q,G){E.isVector4?At.set(E.x,E.y,E.z,E.w):At.set(E,U,q,G),ut.viewport(nt.copy(At).multiplyScalar(Ke()).round())},this.getScissor=function(E){return E.copy(Yt)},this.setScissor=function(E,U,q,G){E.isVector4?Yt.set(E.x,E.y,E.z,E.w):Yt.set(E,U,q,G),ut.scissor(_t.copy(Yt).multiplyScalar(Ke()).round())},this.getScissorTest=function(){return Lt},this.setScissorTest=function(E){ut.setScissorTest(Lt=E)},this.setOpaqueSort=function(E){Nt=E},this.setTransparentSort=function(E){Me=E},this.getClearColor=function(E){return E.copy(N.getClearColor())},this.setClearColor=function(){N.setClearColor(...arguments)},this.getClearAlpha=function(){return N.getClearAlpha()},this.setClearAlpha=function(){N.setClearAlpha(...arguments)},this.clear=function(E=!0,U=!0,q=!0){let G=0;if(E){let Y=!1;if(Q!==null){let yt=Q.texture.format;Y=p.has(yt)}if(Y){let yt=Q.texture.type,Ct=g.has(yt),vt=N.getClearColor(),wt=N.getClearAlpha(),Ut=vt.r,Zt=vt.g,oe=vt.b;Ct?(v[0]=Ut,v[1]=Zt,v[2]=oe,v[3]=wt,z.clearBufferuiv(z.COLOR,0,v)):(S[0]=Ut,S[1]=Zt,S[2]=oe,S[3]=wt,z.clearBufferiv(z.COLOR,0,S))}else G|=z.COLOR_BUFFER_BIT}U&&(G|=z.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(G|=z.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&z.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(E){E.setRenderer(this),L=E},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",xt,!1),e.removeEventListener("webglcontextcreationerror",et,!1),N.dispose(),gt.dispose(),X.dispose(),Gt.dispose(),Dt.dispose(),C.dispose(),rt.dispose(),V.dispose(),dt.dispose(),ot.dispose(),it.dispose(),st.dispose(),st.removeEventListener("sessionstart",Ae),st.removeEventListener("sessionend",ve),un.stop()};function tt(E){E.preventDefault(),qf("WebGLRenderer: Context Lost."),D=!0}function xt(){qf("WebGLRenderer: Context Restored."),D=!1;let E=pe.autoReset,U=lt.enabled,q=lt.autoUpdate,G=lt.needsUpdate,Y=lt.type;pt(),pe.autoReset=E,lt.enabled=U,lt.autoUpdate=q,lt.needsUpdate=G,lt.type=Y}function et(E){Vt("WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function Tt(E){let U=E.target;U.removeEventListener("dispose",Tt),re(U)}function re(E){qt(E),Dt.remove(E)}function qt(E){let U=Dt.get(E).programs;U!==void 0&&(U.forEach(function(q){it.releaseProgram(q)}),E.isShaderMaterial&&it.releaseShaderCache(E))}this.renderBufferDirect=function(E,U,q,G,Y,yt){U===null&&(U=le);let Ct=Y.isMesh&&Y.matrixWorld.determinantAffine()<0,vt=Pi(E,U,q,G,Y);ut.setMaterial(G,Ct);let wt=q.index,Ut=1;if(G.wireframe===!0){if(wt=V.getWireframeAttribute(q),wt===void 0)return;Ut=2}let Zt=q.drawRange,oe=q.attributes.position,Pt=Zt.start*Ut,ae=(Zt.start+Zt.count)*Ut;yt!==null&&(Pt=Math.max(Pt,yt.start*Ut),ae=Math.min(ae,(yt.start+yt.count)*Ut)),wt!==null?(Pt=Math.max(Pt,0),ae=Math.min(ae,wt.count)):oe!=null&&(Pt=Math.max(Pt,0),ae=Math.min(ae,oe.count));let rn=ae-Pt;if(rn<0||rn===1/0)return;dt.setup(Y,G,vt,q,wt);let De,Ce=$;if(wt!==null&&(De=w.get(wt),Ce=ft,Ce.setIndex(De)),Y.isMesh)G.wireframe===!0?(ut.setLineWidth(G.wireframeLinewidth*Ke()),Ce.setMode(z.LINES)):Ce.setMode(z.TRIANGLES);else if(Y.isLine){let Pn=G.linewidth;Pn===void 0&&(Pn=1),ut.setLineWidth(Pn*Ke()),Y.isLineSegments?Ce.setMode(z.LINES):Y.isLineLoop?Ce.setMode(z.LINE_LOOP):Ce.setMode(z.LINE_STRIP)}else Y.isPoints?Ce.setMode(z.POINTS):Y.isSprite&&Ce.setMode(z.TRIANGLES);if(Y.isBatchedMesh)if(ue.get("WEBGL_multi_draw"))Ce.renderMultiDraw(Y._multiDrawStarts,Y._multiDrawCounts,Y._multiDrawCount);else{let Pn=Y._multiDrawStarts,It=Y._multiDrawCounts,Yn=Y._multiDrawCount,_e=wt?w.get(wt).bytesPerElement:1,Sr=Dt.get(G).currentProgram.getUniforms();for(let In=0;In<Yn;In++)Sr.setValue(z,"_gl_DrawID",In),Ce.render(Pn[In]/_e,It[In])}else if(Y.isInstancedMesh)Ce.renderInstances(Pt,rn,Y.count);else if(q.isInstancedBufferGeometry){let Pn=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,It=Math.min(q.instanceCount,Pn);Ce.renderInstances(Pt,rn,It)}else Ce.render(Pt,rn)};function Fe(E,U,q,G){L!==null&&E.isNodeMaterial&&L.setObject(G,E),he===!0&&j.setState(E,q,!1),E.transparent===!0&&E.side===es&&E.forceSinglePass===!1?(E.side=wn,E.needsUpdate=!0,mi(E,U,G),E.side=nr,E.needsUpdate=!0,mi(E,U,G),E.side=es):mi(E,U,G)}this.compile=function(E,U,q=null){q===null&&(q=E),L!==null&&L.renderStart(E,U,q),T=X.get(q),T.init(U),M.push(T),q.traverseVisible(function(Y){Y.isLight&&Y.layers.test(U.layers)&&(T.pushLight(Y),Y.castShadow&&T.pushShadow(Y))}),E!==q&&E.traverseVisible(function(Y){Y.isLight&&Y.layers.test(U.layers)&&(T.pushLight(Y),Y.castShadow&&T.pushShadow(Y))}),T.setupLights(),L!==null&&L.updateLights(T.state.lightsArray),J=this.localClippingEnabled,he=j.init(this.clippingPlanes,J),he===!0&&j.setGlobalState(this.clippingPlanes,U),L!==null&&lt.render(T.state.shadowsArray,q,U);let G=new Set;return E.traverse(function(Y){if(!(Y.isMesh||Y.isPoints||Y.isLine||Y.isSprite))return;let yt=Y.material;if(yt)if(Array.isArray(yt))for(let Ct=0;Ct<yt.length;Ct++){let vt=yt[Ct];Fe(vt,q,U,Y),G.add(vt)}else Fe(yt,q,U,Y),G.add(yt)}),T=M.pop(),L!==null&&L.renderEnd(),G},this.compileAsync=function(E,U,q=null){let G=this.compile(E,U,q);return new Promise(Y=>{function yt(){if(G.forEach(function(Ct){let wt=Dt.get(Ct).currentProgram;(wt===void 0||wt.isReady())&&G.delete(Ct)}),G.size===0){Y(E);return}setTimeout(yt,10)}ue.get("KHR_parallel_shader_compile")!==null?yt():setTimeout(yt,10)})};let nn=null;function Oe(E){nn&&nn(E)}function Ae(){un.stop()}function ve(){un.start()}let un=new Ag;un.setAnimationLoop(Oe),typeof self<"u"&&un.setContext(self),this.setAnimationLoop=function(E){nn=E,st.setAnimationLoop(E),E===null?un.stop():un.start()},st.addEventListener("sessionstart",Ae),st.addEventListener("sessionend",ve),this.render=function(E,U){if(U!==void 0&&U.isCamera!==!0){Vt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;L!==null&&L.renderStart(E,U);let q=st.enabled===!0&&st.isPresenting===!0,G=R!==null&&(Q===null||q)&&R.begin(A,Q);if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),st.enabled===!0&&st.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(st.cameraAutoUpdate===!0&&st.updateCamera(U),U=st.getCamera()),E.isScene===!0&&E.onBeforeRender(A,E,U,Q),T=X.get(E,M.length),T.init(U),T.state.textureUnits=Gt.getTextureUnits(),M.push(T),se.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera?de.setFromArrayCamera(U):Bt.setFromProjectionMatrix(se,Di,U.reversedDepth),J=this.localClippingEnabled,he=j.init(this.clippingPlanes,J),b=gt.get(E,_.length),b.init(),_.push(b),this.info.render.frame++,st.enabled===!0&&st.isPresenting===!0){let Ct=A.xr.getDepthSensingMesh();Ct!==null&&Re(Ct,U,-1/0,A.sortObjects)}Re(E,U,0,A.sortObjects),b.finish(),L!==null&&L.updateLights(T.state.lightsArray),A.sortObjects===!0&&b.sort(Nt,Me),Xe=st.enabled===!1||st.isPresenting===!1||st.hasDepthSensing()===!1,Xe&&N.addToRenderList(b,E),this.info.autoReset===!0&&this.info.reset(),he===!0&&j.beginShadows();let Y=T.state.shadowsArray;if(lt.render(Y,E,U),he===!0&&j.endShadows(),(G&&R.hasRenderPass())===!1){let Ct=b.opaque,vt=b.transmissive;if(T.setupLights(),U.isArrayCamera){let wt=U.cameras;if(vt.length>0)for(let Ut=0,Zt=wt.length;Ut<Zt;Ut++){let oe=wt[Ut];pi(Ct,vt,E,oe)}Xe&&N.render(E);for(let Ut=0,Zt=wt.length;Ut<Zt;Ut++){let oe=wt[Ut];Cn(b,E,oe,oe.viewport)}}else vt.length>0&&pi(Ct,vt,E,U),Xe&&N.render(E),Cn(b,E,U)}Q!==null&&O===0&&(Gt.updateMultisampleRenderTarget(Q),Gt.updateRenderTargetMipmap(Q)),G&&R.end(A),E.isScene===!0&&E.onAfterRender(A,E,U),dt.resetDefaultState(),W=-1,I=null,M.pop(),M.length>0?(T=M[M.length-1],Gt.setTextureUnits(T.state.textureUnits),he===!0&&j.setGlobalState(A.clippingPlanes,T.state.camera)):T=null,_.pop(),_.length>0?b=_[_.length-1]:b=null,L!==null&&L.renderEnd()};function Re(E,U,q,G){if(E.visible===!1)return;if(E.layers.test(U.layers)){if(E.isGroup)q=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(U);else if(E.isLight)T.pushLight(E),E.castShadow&&T.pushShadow(E);else if(E.isSprite){let Ct=U.isArrayCamera?de:Bt;if(!E.frustumCulled||E.intersectsFrustum(Ct)){G&&Ee.setFromMatrixPosition(E.matrixWorld).applyMatrix4(se);let vt=rt.update(E),wt=E.material;wt.visible&&b.push(E,vt,wt,q,Ee.z,null,U)}}else if(E.isMesh||E.isLine||E.isPoints){let Ct=U.isArrayCamera?de:Bt;if(!E.frustumCulled||E.intersectsFrustum(Ct)){let vt=rt.update(E),wt=E.material;if(G&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),Ee.copy(E.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),Ee.copy(vt.boundingSphere.center)),Ee.applyMatrix4(E.matrixWorld).applyMatrix4(se)),Array.isArray(wt)){let Ut=vt.groups;for(let Zt=0,oe=Ut.length;Zt<oe;Zt++){let Pt=Ut[Zt],ae=wt[Pt.materialIndex];ae&&ae.visible&&b.push(E,vt,ae,q,Ee.z,Pt,U)}}else wt.visible&&b.push(E,vt,wt,q,Ee.z,null,U)}}}let yt=E.children;for(let Ct=0,vt=yt.length;Ct<vt;Ct++)Re(yt[Ct],U,q,G)}function Cn(E,U,q,G){let{opaque:Y,transmissive:yt,transparent:Ct}=E;T.setupLightsView(q),he===!0&&j.setGlobalState(A.clippingPlanes,q),G&&ut.viewport(nt.copy(G)),Y.length>0&&Ye(Y,U,q),yt.length>0&&Ye(yt,U,q),Ct.length>0&&Ye(Ct,U,q),ut.buffers.depth.setTest(!0),ut.buffers.depth.setMask(!0),ut.buffers.color.setMask(!0),ut.setPolygonOffset(!1)}function pi(E,U,q,G){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[G.id]===void 0){let Pt=ue.has("EXT_color_buffer_half_float")||ue.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[G.id]=new je(1,1,{generateMipmaps:!0,type:Pt?He:ai,minFilter:is,samples:Math.max(4,Wt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ne.workingColorSpace})}let yt=T.state.transmissionRenderTarget[G.id],Ct=G.viewport||nt;yt.setSize(Ct.z*A.transmissionResolutionScale,Ct.w*A.transmissionResolutionScale);let vt=A.getRenderTarget(),wt=A.getActiveCubeFace(),Ut=A.getActiveMipmapLevel();A.setRenderTarget(yt),A.getClearColor(Z),ht=A.getClearAlpha(),ht<1&&A.setClearColor(16777215,.5),A.clear(),Xe&&N.render(q);let Zt=A.toneMapping;A.toneMapping=ns;let oe=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),T.setupLightsView(G),he===!0&&j.setGlobalState(A.clippingPlanes,G),Ye(E,q,G),Gt.updateMultisampleRenderTarget(yt),Gt.updateRenderTargetMipmap(yt),ue.has("WEBGL_multisampled_render_to_texture")===!1){let Pt=!1;for(let ae=0,rn=U.length;ae<rn;ae++){let De=U[ae],{object:Ce,geometry:Pn,material:It,group:Yn}=De;if(It.side===es&&Ce.layers.test(G.layers)){let _e=It.side;It.side=wn,It.needsUpdate=!0,sn(Ce,q,G,Pn,It,Yn),It.side=_e,It.needsUpdate=!0,Pt=!0}}Pt===!0&&(Gt.updateMultisampleRenderTarget(yt),Gt.updateRenderTargetMipmap(yt))}A.setRenderTarget(vt,wt,Ut),A.setClearColor(Z,ht),oe!==void 0&&(G.viewport=oe),A.toneMapping=Zt}function Ye(E,U,q){let G=U.isScene===!0?U.overrideMaterial:null;for(let Y=0,yt=E.length;Y<yt;Y++){let Ct=E[Y],{object:vt,geometry:wt,group:Ut}=Ct,Zt=Ct.material;Zt.allowOverride===!0&&G!==null&&(Zt=G),vt.layers.test(q.layers)&&sn(vt,U,q,wt,Zt,Ut)}}function sn(E,U,q,G,Y,yt){L!==null&&Y.isNodeMaterial&&L.setObject(E,Y),E.onBeforeRender(A,U,q,G,Y,yt),E.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),Y.onBeforeRender(A,U,q,G,E,yt),Y.transparent===!0&&Y.side===es&&Y.forceSinglePass===!1?(Y.side=wn,Y.needsUpdate=!0,A.renderBufferDirect(q,U,G,Y,E,yt),Y.side=nr,Y.needsUpdate=!0,A.renderBufferDirect(q,U,G,Y,E,yt),Y.side=es):A.renderBufferDirect(q,U,G,Y,E,yt),E.onAfterRender(A,U,q,G,Y,yt)}function fn(E){let U=0;for(let q of E)q.texture!==null&&U++;return U}function mi(E,U,q){U.isScene!==!0&&(U=le);let G=Dt.get(E),Y=T.state.lights,yt=T.state.shadowsArray,Ct=Y.state.version,vt=it.getParameters(E,Y.state,yt,U,q,T.state.lightProbeGridArray),wt=it.getProgramCacheKey(vt),Ut=G.programs;G.environment=E.isMeshStandardMaterial||E.isMeshLambertMaterial||E.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let Zt=E.isMeshStandardMaterial||E.isMeshLambertMaterial&&!E.envMap||E.isMeshPhongMaterial&&!E.envMap;G.envMap=C.get(E.envMap||G.environment,Zt),G.envMapRotation=G.environment!==null&&E.envMap===null?U.environmentRotation:E.envMapRotation,Ut===void 0&&(E.addEventListener("dispose",Tt),Ut=new Map,G.programs=Ut,G.programVariants=new Map);let oe=Ut.get(wt);if(oe!==void 0){if(G.currentProgram===oe&&G.lightsStateVersion===Ct)return qe(E,vt),oe}else vt.uniforms=it.getUniforms(E),L!==null&&E.isNodeMaterial&&L.build(E,q,vt),E.onBeforeCompile(vt,A),oe=it.acquireProgram(vt,wt),Ut.set(wt,oe),G.uniforms=vt.uniforms;let Pt=G.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(Pt.clippingPlanes=j.uniform),qe(E,vt),G.needsLights=Ql(E),G.lightsStateVersion=Ct,G.needsLights&&(Pt.ambientLightColor.value=Y.state.ambient,Pt.lightProbe.value=Y.state.probe,Pt.sunLights.value=Y.state.sun,Pt.sunLightShadows.value=Y.state.sunShadow,Pt.directionalLights.value=Y.state.directional,Pt.directionalLightShadows.value=Y.state.directionalShadow,Pt.spotLights.value=Y.state.spot,Pt.spotLightShadows.value=Y.state.spotShadow,Pt.rectAreaLights.value=Y.state.rectArea,Pt.ltc_1.value=Y.state.rectAreaLTC1,Pt.ltc_2.value=Y.state.rectAreaLTC2,Pt.pointLights.value=Y.state.point,Pt.pointLightShadows.value=Y.state.pointShadow,Pt.hemisphereLights.value=Y.state.hemi,Pt.sunShadowMatrix.value=Y.state.sunShadowMatrix,Pt.sunShadowCascade.value=Y.state.sunShadowCascade,Pt.directionalShadowMatrix.value=Y.state.directionalShadowMatrix,Pt.spotLightMatrix.value=Y.state.spotLightMatrix,Pt.spotLightMap.value=Y.state.spotLightMap,Pt.pointShadowMatrix.value=Y.state.pointShadowMatrix),G.numLightProbeGrids=fn(T.state.lightProbeGridArray),G.currentProgram=oe,G.uniformsList=null,oe}function uo(E,U,q,G,Y){let yt=Dt.get(E),Ct=yt.currentProgram.id+","+G+","+Y,vt=yt.programVariants.get(Ct);return vt===void 0?(vt=mi(E,U,q),yt.programVariants.set(Ct,vt)):(yt.currentProgram=vt,yt.uniformsList=null,yt.outputColorSpace=G,yt.toneMapping=Y),vt}function dn(E){if(E.uniformsList===null){let U=E.currentProgram.getUniforms();E.uniformsList=Xo.seqWithValue(U.seq,E.uniforms)}return E.uniformsList}function qe(E,U){let q=Dt.get(E);q.outputColorSpace=U.outputColorSpace,q.batching=U.batching,q.batchingColor=U.batchingColor,q.instancing=U.instancing,q.instancingColor=U.instancingColor,q.instancingMorph=U.instancingMorph,q.skinning=U.skinning,q.morphTargets=U.morphTargets,q.morphNormals=U.morphNormals,q.morphColors=U.morphColors,q.morphTargetsCount=U.morphTargetsCount,q.numClippingPlanes=U.numClippingPlanes,q.numIntersection=U.numClipIntersection,q.vertexAlphas=U.vertexAlphas,q.vertexTangents=U.vertexTangents,q.toneMapping=U.toneMapping}function Pi(E,U,q,G,Y){U.isScene!==!0&&(U=le),Gt.resetTextureUnits();let yt=U.fog,Ct=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,vt=Q===null?A.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:ne.workingColorSpace,wt=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ut=C.get(G.envMap||Ct,wt),Zt=G.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,oe=!!q.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Pt=!!q.morphAttributes.position,ae=!!q.morphAttributes.normal,rn=!!q.morphAttributes.color,De=ns;G.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(De=A.toneMapping);let Ce=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Pn=Ce!==void 0?Ce.length:0,It=Dt.get(G),Yn=T.state.lights;if(he===!0&&(J===!0||E!==I)){let ke=E===I&&G.id===W;j.setState(G,E,ke)}let _e=!1,Sr=!1;G.version===It.__version?It.needsLights&&It.lightsStateVersion!==Yn.state.version||Y.isBatchedMesh&&It.batching===!1||!Y.isBatchedMesh&&It.batching===!0||Y.isBatchedMesh&&It.batchingColor===!0&&Y._colorsTexture===null||Y.isBatchedMesh&&It.batchingColor===!1&&Y._colorsTexture!==null||Y.isInstancedMesh&&It.instancing===!1||!Y.isInstancedMesh&&It.instancing===!0||Y.isSkinnedMesh&&It.skinning===!1||!Y.isSkinnedMesh&&It.skinning===!0||Y.isInstancedMesh&&It.instancingColor===!0&&Y.instanceColor===null||Y.isInstancedMesh&&It.instancingColor===!1&&Y.instanceColor!==null||Y.isInstancedMesh&&It.instancingMorph===!0&&Y.morphTexture===null||Y.isInstancedMesh&&It.instancingMorph===!1&&Y.morphTexture!==null||It.envMap!==Ut||G.fog===!0&&It.fog!==yt||It.numClippingPlanes!==void 0&&(It.numClippingPlanes!==j.numPlanes||It.numIntersection!==j.numIntersection)||It.vertexAlphas!==Zt||It.vertexTangents!==oe||It.morphTargets!==Pt||It.morphNormals!==ae||It.morphColors!==rn||It.morphTargetsCount!==Pn||It.numLightProbeGrids!==fn(T.state.lightProbeGridArray)?_e=!0:(It.outputColorSpace!==vt||It.toneMapping!==De)&&(Sr=!0):(_e=!0,It.__version=G.version);let In=It.currentProgram;(_e===!0||Sr===!0)&&(In=Sr===!0?uo(G,U,Y,vt,De):mi(G,U,Y),L&&G.isNodeMaterial&&L.onUpdateProgram(G,In,It));let jl=!1,ks=!1,br=!1,fe=In.getUniforms(),bn=It.uniforms;if(ut.useProgram(In.program)&&(jl=!0,ks=!0,br=!0),G.id!==W&&(W=G.id,ks=!0),jl||I!==E){ut.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),fe.setValue(z,"projectionMatrix",E.projectionMatrix),fe.setValue(z,"viewMatrix",E.matrixWorldInverse);let xn=fe.map.cameraPosition;xn!==void 0&&xn.setValue(z,en.setFromMatrixPosition(E.matrixWorld)),Wt.logarithmicDepthBuffer&&fe.setValue(z,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&fe.setValue(z,"isOrthographic",E.isOrthographicCamera===!0),I!==E&&(I=E,ks=!0,br=!0)}if(It.needsLights&&(Yn.state.sunShadowMap.length>0&&fe.setValue(z,"sunShadowMap",Yn.state.sunShadowMap,Gt),Yn.state.directionalShadowMap.length>0&&fe.setValue(z,"directionalShadowMap",Yn.state.directionalShadowMap,Gt),Yn.state.spotShadowMap.length>0&&fe.setValue(z,"spotShadowMap",Yn.state.spotShadowMap,Gt),Yn.state.pointShadowMap.length>0&&fe.setValue(z,"pointShadowMap",Yn.state.pointShadowMap,Gt)),Y.isSkinnedMesh){fe.setOptional(z,Y,"bindMatrix"),fe.setOptional(z,Y,"bindMatrixInverse");let ke=Y.skeleton;ke&&(ke.boneTexture===null&&ke.computeBoneTexture(),fe.setValue(z,"boneTexture",ke.boneTexture,Gt))}Y.isBatchedMesh&&(fe.setOptional(z,Y,"batchingTexture"),fe.setValue(z,"batchingTexture",Y._matricesTexture,Gt),fe.setOptional(z,Y,"batchingIdTexture"),fe.setValue(z,"batchingIdTexture",Y._indirectTexture,Gt),fe.setOptional(z,Y,"batchingColorTexture"),Y._colorsTexture!==null&&fe.setValue(z,"batchingColorTexture",Y._colorsTexture,Gt));let ki=q.morphAttributes;if((ki.position!==void 0||ki.normal!==void 0||ki.color!==void 0)&&K.update(Y,q,In),(ks||It.receiveShadow!==Y.receiveShadow)&&(It.receiveShadow=Y.receiveShadow,fe.setValue(z,"receiveShadow",Y.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(bn.envMapIntensity.value=U.environmentIntensity),bn.dfgLUT!==void 0&&(bn.dfgLUT.value=$b()),ks){if(fe.setValue(z,"toneMappingExposure",A.toneMappingExposure),It.needsLights&&Sa(bn,br),yt&&G.fog===!0&&ct.refreshFogUniforms(bn,yt),ct.refreshMaterialUniforms(bn,G,mt,bt,T.state.transmissionRenderTarget[E.id]),It.needsLights&&It.numLightProbeGrids>0){let ke=y,xn=0;for(let ds of T.state.lightProbeGridArray)ds.texture!==null&&(ke.textures[xn]=ds.texture,ke.min[xn]=ds.boundingBox.min,ke.max[xn]=ds.boundingBox.max,ke.resolution[xn]=ds.resolution,xn++);for(let ds in ke)ke[ds].length=xn;bn.probesSH.value=ke.textures,bn.probesMin.value=ke.min,bn.probesMax.value=ke.max,bn.probesResolution.value=ke.resolution}Xo.upload(z,dn(It),bn,Gt)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Xo.upload(z,dn(It),bn,Gt),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&fe.setValue(z,"center",Y.center),fe.setValue(z,"modelViewMatrix",Y.modelViewMatrix),fe.setValue(z,"normalMatrix",Y.normalMatrix),fe.setValue(z,"modelMatrix",Y.matrixWorld),G.uniformsGroups!==void 0){let ke=G.uniformsGroups;for(let xn=0,ds=ke.length;xn<ds;xn++){let Wp=ke[xn];ot.update(Wp,In),ot.bind(Wp,In)}}return In}function Sa(E,U){E.ambientLightColor.needsUpdate=U,E.lightProbe.needsUpdate=U,E.sunLights.needsUpdate=U,E.sunLightShadows.needsUpdate=U,E.directionalLights.needsUpdate=U,E.directionalLightShadows.needsUpdate=U,E.pointLights.needsUpdate=U,E.pointLightShadows.needsUpdate=U,E.spotLights.needsUpdate=U,E.spotLightShadows.needsUpdate=U,E.rectAreaLights.needsUpdate=U,E.hemisphereLights.needsUpdate=U}function Ql(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return k},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return Q},this.setRenderTargetTextures=function(E,U,q){let G=Dt.get(E);G.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),Dt.get(E.texture).__webglTexture=U,Dt.get(E.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:q,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,U){let q=Dt.get(E);q.__webglFramebuffer=U,q.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(E,U=0,q=0){Q=E,k=U,O=q;let G=null,Y=!1,yt=!1;if(E){let vt=Dt.get(E);if(vt.__useDefaultFramebuffer!==void 0){ut.bindFramebuffer(z.FRAMEBUFFER,vt.__webglFramebuffer),nt.copy(E.viewport),_t.copy(E.scissor),Et=E.scissorTest,ut.viewport(nt),ut.scissor(_t),ut.setScissorTest(Et),W=-1;return}else if(vt.__webglFramebuffer===void 0)Gt.setupRenderTarget(E);else if(vt.__hasExternalTextures)Gt.rebindTextures(E,Dt.get(E.texture).__webglTexture,Dt.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let Zt=E.depthTexture;if(vt.__boundDepthTexture!==Zt){if(Zt!==null&&Dt.has(Zt)&&(E.width!==Zt.image.width||E.height!==Zt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Gt.setupDepthRenderbuffer(E)}}let wt=E.texture;(wt.isData3DTexture||wt.isDataArrayTexture||wt.isCompressedArrayTexture)&&(yt=!0);let Ut=Dt.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(Ut[U])?G=Ut[U][q]:G=Ut[U],Y=!0):E.samples>0&&Gt.useMultisampledRTT(E)===!1?G=Dt.get(E).__webglMultisampledFramebuffer:Array.isArray(Ut)?G=Ut[q]:G=Ut,nt.copy(E.viewport),_t.copy(E.scissor),Et=E.scissorTest}else nt.copy(At).multiplyScalar(mt).floor(),_t.copy(Yt).multiplyScalar(mt).floor(),Et=Lt;if(q!==0&&(G=F),ut.bindFramebuffer(z.FRAMEBUFFER,G)&&ut.drawBuffers(E,G),ut.viewport(nt),ut.scissor(_t),ut.setScissorTest(Et),Y){let vt=Dt.get(E.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_CUBE_MAP_POSITIVE_X+U,vt.__webglTexture,q)}else if(yt){let vt=U;for(let wt=0;wt<E.textures.length;wt++){let Ut=Dt.get(E.textures[wt]);z.framebufferTextureLayer(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0+wt,Ut.__webglTexture,q,vt)}}else if(E!==null&&q!==0){let vt=Dt.get(E.texture);z.framebufferTexture2D(z.FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,vt.__webglTexture,q)}W=-1};function zs(E){let U=Dt.get(E);return(U.__readFormat!==E.format||U.__readType!==E.type)&&(U.__readFormat=E.format,U.__readType=E.type,U.__formatReadable=Wt.textureFormatReadable(E.format),U.__typeReadable=Wt.textureTypeReadable(E.type)),U}this.readRenderTargetPixels=function(E,U,q,G,Y,yt,Ct,vt=0){if(!(E&&E.isWebGLRenderTarget)){Vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=Dt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(wt=wt[Ct],Array.isArray(wt)&&(wt=wt[0])),wt){ut.bindFramebuffer(z.FRAMEBUFFER,wt);try{let Ut=E.textures[vt],Zt=Ut.format,oe=Ut.type;E.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+vt);let Pt=zs(Ut);if(Pt.__formatReadable===!1){Vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Pt.__typeReadable===!1){Vt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=E.width-G&&q>=0&&q<=E.height-Y&&z.readPixels(U,q,G,Y,at.convert(Zt),at.convert(oe),yt)}finally{let Ut=Q!==null?Dt.get(Q).__webglFramebuffer:null;ut.bindFramebuffer(z.FRAMEBUFFER,Ut)}}},this.readRenderTargetPixelsAsync=async function(E,U,q,G,Y,yt,Ct,vt=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let wt=Dt.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&Ct!==void 0&&(wt=wt[Ct],Array.isArray(wt)&&(wt=wt[0])),wt)if(U>=0&&U<=E.width-G&&q>=0&&q<=E.height-Y){ut.bindFramebuffer(z.FRAMEBUFFER,wt);let Ut=E.textures[vt],Zt=Ut.format,oe=Ut.type;E.textures.length>1&&z.readBuffer(z.COLOR_ATTACHMENT0+vt);let Pt=zs(Ut);if(Pt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Pt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ae=z.createBuffer();z.bindBuffer(z.PIXEL_PACK_BUFFER,ae),z.bufferData(z.PIXEL_PACK_BUFFER,yt.byteLength,z.STREAM_READ),z.readPixels(U,q,G,Y,at.convert(Zt),at.convert(oe),0),z.bindBuffer(z.PIXEL_PACK_BUFFER,null);let rn=Q!==null?Dt.get(Q).__webglFramebuffer:null;ut.bindFramebuffer(z.FRAMEBUFFER,rn);let De=z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE,0);return z.flush(),await tg(z,De,4),z.bindBuffer(z.PIXEL_PACK_BUFFER,ae),z.getBufferSubData(z.PIXEL_PACK_BUFFER,0,yt),z.bindBuffer(z.PIXEL_PACK_BUFFER,null),z.deleteBuffer(ae),z.deleteSync(De),yt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,U=null,q=0){let G=Math.pow(2,-q),Y=Math.floor(E.image.width*G),yt=Math.floor(E.image.height*G),Ct=U!==null?U.x:0,vt=U!==null?U.y:0;Gt.setTexture2D(E,0),z.copyTexSubImage2D(z.TEXTURE_2D,q,0,0,Ct,vt,Y,yt),ut.unbindTexture()},this.copyTextureToTexture=function(E,U,q=null,G=null,Y=0,yt=0){let Ct,vt,wt,Ut,Zt,oe,Pt,ae,rn,De=E.isCompressedTexture?E.mipmaps[yt]:E.image;if(q!==null)Ct=q.max.x-q.min.x,vt=q.max.y-q.min.y,wt=q.isBox3?q.max.z-q.min.z:1,Ut=q.min.x,Zt=q.min.y,oe=q.isBox3?q.min.z:0;else{let fe=Math.pow(2,-Y);Ct=Math.floor(De.width*fe),vt=Math.floor(De.height*fe),E.isDataArrayTexture?wt=De.depth:E.isData3DTexture?wt=Math.floor(De.depth*fe):wt=1,Ut=0,Zt=0,oe=0}G!==null?(Pt=G.x,ae=G.y,rn=G.z):(Pt=0,ae=0,rn=0);let Ce=at.convert(U.format),Pn=at.convert(U.type),It;U.isData3DTexture?(Gt.setTexture3D(U,0),It=z.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(Gt.setTexture2DArray(U,0),It=z.TEXTURE_2D_ARRAY):(Gt.setTexture2D(U,0),It=z.TEXTURE_2D),ut.activeTexture(z.TEXTURE0),ut.pixelStorei(z.UNPACK_FLIP_Y_WEBGL,U.flipY),ut.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),ut.pixelStorei(z.UNPACK_ALIGNMENT,U.unpackAlignment);let Yn=ut.getParameter(z.UNPACK_ROW_LENGTH),_e=ut.getParameter(z.UNPACK_IMAGE_HEIGHT),Sr=ut.getParameter(z.UNPACK_SKIP_PIXELS),In=ut.getParameter(z.UNPACK_SKIP_ROWS),jl=ut.getParameter(z.UNPACK_SKIP_IMAGES);ut.pixelStorei(z.UNPACK_ROW_LENGTH,De.width),ut.pixelStorei(z.UNPACK_IMAGE_HEIGHT,De.height),ut.pixelStorei(z.UNPACK_SKIP_PIXELS,Ut),ut.pixelStorei(z.UNPACK_SKIP_ROWS,Zt),ut.pixelStorei(z.UNPACK_SKIP_IMAGES,oe);let ks=E.isDataArrayTexture||E.isData3DTexture,br=U.isDataArrayTexture||U.isData3DTexture;if(E.isDepthTexture){let fe=Dt.get(E),bn=Dt.get(U),ki=Dt.get(fe.__renderTarget),ke=Dt.get(bn.__renderTarget);ut.bindFramebuffer(z.READ_FRAMEBUFFER,ki.__webglFramebuffer),ut.bindFramebuffer(z.DRAW_FRAMEBUFFER,ke.__webglFramebuffer);for(let xn=0;xn<wt;xn++)ks&&(z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Dt.get(E).__webglTexture,Y,oe+xn),z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,Dt.get(U).__webglTexture,yt,rn+xn)),z.blitFramebuffer(Ut,Zt,Ut+Ct,Zt+vt,Pt,ae,Pt+Ct,ae+vt,z.DEPTH_BUFFER_BIT,z.NEAREST);ut.bindFramebuffer(z.READ_FRAMEBUFFER,null),ut.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else if(Y!==0||E.isRenderTargetTexture||Dt.has(E)){let fe=Dt.get(E),bn=Dt.get(U);ut.bindFramebuffer(z.READ_FRAMEBUFFER,P),ut.bindFramebuffer(z.DRAW_FRAMEBUFFER,B);for(let ki=0;ki<wt;ki++)ks?z.framebufferTextureLayer(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,fe.__webglTexture,Y,oe+ki):z.framebufferTexture2D(z.READ_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,fe.__webglTexture,Y),br?z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,bn.__webglTexture,yt,rn+ki):z.framebufferTexture2D(z.DRAW_FRAMEBUFFER,z.COLOR_ATTACHMENT0,z.TEXTURE_2D,bn.__webglTexture,yt),Y!==0?z.blitFramebuffer(Ut,Zt,Ut+Ct,Zt+vt,Pt,ae,Pt+Ct,ae+vt,z.COLOR_BUFFER_BIT,z.NEAREST):br?z.copyTexSubImage3D(It,yt,Pt,ae,rn+ki,Ut,Zt,Ct,vt):z.copyTexSubImage2D(It,yt,Pt,ae,Ut,Zt,Ct,vt);ut.bindFramebuffer(z.READ_FRAMEBUFFER,null),ut.bindFramebuffer(z.DRAW_FRAMEBUFFER,null)}else br?E.isDataTexture||E.isData3DTexture?z.texSubImage3D(It,yt,Pt,ae,rn,Ct,vt,wt,Ce,Pn,De.data):U.isCompressedArrayTexture?z.compressedTexSubImage3D(It,yt,Pt,ae,rn,Ct,vt,wt,Ce,De.data):z.texSubImage3D(It,yt,Pt,ae,rn,Ct,vt,wt,Ce,Pn,De):E.isDataTexture?z.texSubImage2D(z.TEXTURE_2D,yt,Pt,ae,Ct,vt,Ce,Pn,De.data):E.isCompressedTexture?z.compressedTexSubImage2D(z.TEXTURE_2D,yt,Pt,ae,De.width,De.height,Ce,De.data):z.texSubImage2D(z.TEXTURE_2D,yt,Pt,ae,Ct,vt,Ce,Pn,De);ut.pixelStorei(z.UNPACK_ROW_LENGTH,Yn),ut.pixelStorei(z.UNPACK_IMAGE_HEIGHT,_e),ut.pixelStorei(z.UNPACK_SKIP_PIXELS,Sr),ut.pixelStorei(z.UNPACK_SKIP_ROWS,In),ut.pixelStorei(z.UNPACK_SKIP_IMAGES,jl),yt===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0&&z.generateMipmap(It),ut.unbindTexture()},this.initRenderTarget=function(E){Dt.get(E).__webglFramebuffer===void 0&&Gt.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?Gt.setTextureCube(E,0):E.isData3DTexture?Gt.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?Gt.setTexture2DArray(E,0):Gt.setTexture2D(E,0),ut.unbindTexture()},this.resetState=function(){k=0,O=0,Q=null,ut.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Di}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ne._getDrawingBufferColorSpace(t),e.unpackColorSpace=ne._getUnpackColorSpace()}}});var Zh,Bg=on(()=>{os();Zh=class extends Wa{constructor(t){super(t),this.type=He}parse(t){let o=function(M,R){switch(M){case 1:throw new Error("THREE.HDRLoader: Read Error: "+(R||""));case 2:throw new Error("THREE.HDRLoader: Write Error: "+(R||""));case 3:throw new Error("THREE.HDRLoader: Bad File Format: "+(R||""));default:case 4:throw new Error("THREE.HDRLoader: Memory Error: "+(R||""))}},d=function(M,R,A){R=R||1024;let L=M.pos,F=-1,P=0,B="",k=String.fromCharCode.apply(null,new Uint16Array(M.subarray(L,L+128)));for(;0>(F=k.indexOf(`
`))&&P<R&&L<M.byteLength;)B+=k,P+=k.length,L+=128,k=String.fromCharCode.apply(null,new Uint16Array(M.subarray(L,L+128)));return-1<F?(A!==!1&&(M.pos+=P+F+1),B+k.slice(0,F)):!1},u=function(M){let R=/^#\?(\S+)/,A=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,D=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,L=/^\s*FORMAT=(\S+)\s*$/,F=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,P={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},B,k;for((M.pos>=M.byteLength||!(B=d(M)))&&o(1,"no header found"),(k=B.match(R))||o(3,"bad initial token"),P.valid|=1,P.programtype=k[1],P.string+=B+`
`;B=d(M),B!==!1;){if(P.string+=B+`
`,B.charAt(0)==="#"){P.comments+=B+`
`;continue}if((k=B.match(A))&&(P.gamma=parseFloat(k[1])),(k=B.match(D))&&(P.exposure=parseFloat(k[1])),(k=B.match(L))&&(P.valid|=2,P.format=k[1]),(k=B.match(F))&&(P.valid|=4,P.height=parseInt(k[1],10),P.width=parseInt(k[2],10)),P.valid&2&&P.valid&4)break}return P.valid&2||o(3,"missing format specifier"),P.valid&4||o(3,"missing image size specifier"),P},f=function(M,R,A){let D=R;if(D<8||D>32767||M[0]!==2||M[1]!==2||M[2]&128)return new Uint8Array(M);D!==(M[2]<<8|M[3])&&o(3,"wrong scanline width");let L=new Uint8Array(4*R*A);L.length||o(4,"unable to allocate buffer space");let F=0,P=0,B=4*D,k=new Uint8Array(4),O=new Uint8Array(B),Q=A;for(;Q>0&&P<M.byteLength;){P+4>M.byteLength&&o(1),k[0]=M[P++],k[1]=M[P++],k[2]=M[P++],k[3]=M[P++],(k[0]!=2||k[1]!=2||(k[2]<<8|k[3])!=D)&&o(3,"bad rgbe scanline format");let W=0,I;for(;W<B&&P<M.byteLength;){I=M[P++];let _t=I>128;if(_t&&(I-=128),(I===0||W+I>B)&&o(3,"bad scanline data"),_t){let Et=M[P++];for(let Z=0;Z<I;Z++)O[W++]=Et}else O.set(M.subarray(P,P+I),W),W+=I,P+=I}let nt=D;for(let _t=0;_t<nt;_t++){let Et=0;L[F]=O[_t+Et],Et+=D,L[F+1]=O[_t+Et],Et+=D,L[F+2]=O[_t+Et],Et+=D,L[F+3]=O[_t+Et],F+=4}Q--}return L},m=function(M,R,A,D){let L=M[R+3],F=Math.pow(2,L-128)/255;A[D+0]=M[R+0]*F,A[D+1]=M[R+1]*F,A[D+2]=M[R+2]*F,A[D+3]=1},x=function(M,R,A,D){let L=M[R+3],F=Math.pow(2,L-128)/255;A[D+0]=qs.toHalfFloat(Math.min(M[R+0]*F,65504)),A[D+1]=qs.toHalfFloat(Math.min(M[R+1]*F,65504)),A[D+2]=qs.toHalfFloat(Math.min(M[R+2]*F,65504)),A[D+3]=qs.toHalfFloat(1)},p=new Uint8Array(t);p.pos=0;let g=u(p),v=g.width,S=g.height,y=f(p.subarray(p.pos),v,S),b,T,_;switch(this.type){case $n:_=y.length/4;let M=new Float32Array(_*4);for(let A=0;A<_;A++)m(y,A*4,M,A*4);b=M,T=$n;break;case He:_=y.length/4;let R=new Uint16Array(_*4);for(let A=0;A<_;A++)x(y,A*4,R,A*4);b=R,T=He;break;default:throw new Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:v,height:S,data:b,header:g.string,gamma:g.gamma,exposure:g.exposure,type:T,colorSpace:Cr,minFilter:Qe,magFilter:Qe,generateMipmaps:!1,flipY:!0}}setDataType(t){return this.type=t,this}}});var Zo,gd=on(()=>{Zo={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`}});var yi,Qb,_d,jb,sr,Jo=on(()=>{os();yi=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Qb=new Dr(-1,1,1,-1,0,1),_d=class extends xi{constructor(){super(),this.setAttribute("position",new Pe([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Pe([0,2,0,0,2,0],2))}},jb=new _d,sr=class{constructor(t){this._mesh=new Jt(jb,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Qb)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}});var $o,xd=on(()=>{os();Jo();$o=class extends yi{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof ln?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=As.clone(t.uniforms),this.material=new ln({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new sr(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}});var ml,Jh,zg=on(()=>{Jo();ml=class extends yi{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}},Jh=class extends yi{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}});var $h,kg=on(()=>{os();gd();xd();zg();$h=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new kt);this._width=n.width,this._height=n.height,e=new je(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:He}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new $o(Zo),this.copyPass.material.blending=Ts,this.timer=new $a}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let i=0,r=this.passes.length;i<r;i++){let o=this.passes[i];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}ml!==void 0&&(o instanceof ml?n=!0:o instanceof Jh&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new kt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}});var Kh,Hg=on(()=>{os();Jo();Kh=class extends yi{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Ot}render(t,e,n){let i=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=i}}});var Gg,Vg=on(()=>{os();Gg={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Ot(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`}});var Ko,Wg=on(()=>{os();Jo();gd();Vg();Ko=class s extends yi{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new kt(t.x,t.y):new kt(256,256),this.clearColor=new Ot(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new je(r,o,{type:He,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let d=new je(r,o,{type:He,depthBuffer:!1});d.texture.name="UnrealBloomPass.h"+h,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);let u=new je(r,o,{type:He,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=Gg;this.highPassUniforms=As.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ln({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new kt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1),new H(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=As.clone(Zo.uniforms),this.blendMaterial=new ln({uniforms:this.copyUniforms,vertexShader:Zo.vertexShader,fragmentShader:Zo.fragmentShader,premultipliedAlpha:!0,blending:Ur,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Ot,this._oldClearAlpha=1,this._basic=new ts,this._fsQuad=new sr(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new kt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=s.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let o=0;o<t;o++)e.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let i=[],r=[];for(let o=1;o<t;o+=2){let a=e[o],l=o+1<t?e[o+1]:0,c=a+l;i.push((o*a+(o+1)*l)/c),r.push(c)}return new ln({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new kt(.5,.5)},direction:{value:new kt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new ln({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Ko.BlurDirectionX=new kt(1,0);Ko.BlurDirectionY=new kt(0,1)});var gl,Xg=on(()=>{gl={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`}});var Qh,Yg=on(()=>{os();Jo();Xg();Qh=class extends yi{constructor(){super(),this.isOutputPass=!0,this.uniforms=As.clone(gl.uniforms),this.material=new zo({name:gl.name,uniforms:this.uniforms,vertexShader:gl.vertexShader,fragmentShader:gl.fragmentShader}),this._fsQuad=new sr(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ne.getTransfer(this._outputColorSpace)===me&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Ka?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Qa?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ja?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Or?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===el?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===nl?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===tl&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}});function Zg(s,t=1e-4){t=Math.max(t,Number.EPSILON);let e={},n=s.getIndex(),i=s.getAttribute("position"),r=n?n.count:i.count,o=0,a=Object.keys(s.attributes),l=[],c=new Map,h=[],d=["getX","getY","getZ","getW"],u=t*.5,f=Math.log10(1/t),m=Math.pow(10,f),x=u*m;for(let g=0;g<r;g++){let v=n?n.getX(g):g,S="";for(let y=0,b=a.length;y<b;y++){let T=a[y],_=s.getAttribute(T),M=_.itemSize;for(let R=0;R<M;R++)S+=`${Math.trunc(_[d[R]](v)*m+x)},`}S in e?h.push(e[S]):(l.push(v),e[S]=o,h.push(o),o++)}let p=s.clone();for(let g in s.attributes)p.setAttribute(g,qg(s.attributes[g],l,c));for(let g in s.morphAttributes)p.morphAttributes[g]=s.morphAttributes[g].map(v=>qg(v,l,c));return p.setIndex(h),p}function qg(s,t,e=new Map){let n=s.isInterleavedBufferAttribute,i=n?s.data:s,r=n?i.stride:s.itemSize,o=n?e.get(i):void 0;if(o===void 0){let l=new i.array.constructor(t.length*r);for(let c=0;c<t.length;c++)for(let h=0;h<r;h++)l[c*r+h]=i.array[t[c]*r+h];o=n?new i.constructor(l,r,i.meshPerAttribute):new s.constructor(l,s.itemSize,s.normalized,s.meshPerAttribute),o.setUsage(i.usage),n&&e.set(i,o)}let a=n?new s.constructor(o,s.itemSize,s.offset,s.normalized):o;return a.name=s.name,n||(a.gpuType=s.gpuType),a}var Jg=on(()=>{});function Rs(s){if(s===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return s}function s_(s,t){s.prototype=Object.create(t.prototype),s.prototype.constructor=s,s.__proto__=t}var ui,Sl,Nd,En,ze,Ui,be,Ed,tT,eT,r_,nT,iT,gn,Ze,Ps,hu,cs,hi,Ud,jh,o_,Bn,sT,rT,$g,Fd,Wr,vd,Od,oT,aT,Ve,as,Ad,Bd,Si,iu,a_,l_,uu,bl,c_,Tl,lT,tu,cT,zd,or,Rd,h_,li,yd,Kg,eu,kd,Hd,ar,Gd,Kn,Je,Ge,Xr,hT,su,Vd,u_,f_,d_,bi,uT,jo,Qg,ru,vl,fT,p_,fu,lr,Hr,dT,Cd,pT,jg,ta,ou,du,pu,m_,ls,g_,__,mT,au,gT,_T,ea,t_,xT,Ni,yl,cr,Rl,An,vT,Pd,x_,yT,Fi,Id,v_,y_,Ld,M_,S_,MT,ST,bT,b_,TT,wT,ia,T_,ET,e_,Mi,_l,Qo,w_,E_,Le,xl,Md,A_,R_,n_,Cs,AT,Wd,wl,ci,na,ce,RT,CT,PT,IT,LT,DT,Gr,Yr,C_,Sd,bd,Xd,El,On,NT,Yd,UT,qd,rr,Dd,Zd,FT,OT,BT,Ml,lu,P_,tn,Jd,I_,zT,kT,mu,L_,HT,$d,Kd,GT,VT,WT,Qd,Qn,Vr,nu,XT,i_,YT,Td,Al,D_,qT,cu,ZT,JT,wd,zn,$T,KT,QT,jT,tw,ew,nw,iw,sw,rw,ow,aw,lw,cw,hw,uw,fw,dw,jd=on(()=>{ui={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Sl={duration:.5,overwrite:!1,delay:0},Ui=1e8,be=1/Ui,Ed=Math.PI*2,tT=Ed/4,eT=0,r_=Math.sqrt,nT=Math.cos,iT=Math.sin,gn=function(t){return typeof t=="string"},Ze=function(t){return typeof t=="function"},Ps=function(t){return typeof t=="number"},hu=function(t){return typeof t>"u"},cs=function(t){return typeof t=="object"},hi=function(t){return t!==!1},Ud=function(){return typeof window<"u"},jh=function(t){return Ze(t)||gn(t)},o_=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},Bn=Array.isArray,sT=/random\([^)]+\)/g,rT=/,\s*/g,$g=/(?:-?\.?\d|\.)+/gi,Fd=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Wr=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,vd=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Od=/[+-]=-?[.\d]+/,oT=/[^,'"\[\]\s]+/gi,aT=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Si={},iu={},l_=function(t){return(iu=jo(t,Si))&&zn},uu=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},bl=function(t,e){return!e&&console.warn(t)},c_=function(t,e){return t&&(Si[t]=e)&&iu&&(iu[t]=e)||Si},Tl=function(){return 0},lT={suppressEvents:!0,isStart:!0,kill:!1},tu={suppressEvents:!0,kill:!1},cT={suppressEvents:!0},zd={},or=[],Rd={},li={},yd={},Kg=30,eu=[],kd="",Hd=function(t){var e=t[0],n,i;if(cs(e)||Ze(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=eu.length;i--&&!eu[i].targetTest(e););n=eu[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new Xd(t[i],n)))||t.splice(i,1);return t},ar=function(t){return t._gsap||Hd(Fi(t))[0]._gsap},Gd=function(t,e,n){return(n=t[e])&&Ze(n)?t[e]():hu(n)&&t.getAttribute&&t.getAttribute(e)||n},Kn=function(t,e){return(t=t.split(",")).forEach(e)||t},Je=function(t){return Math.round(t*1e5)/1e5||0},Ge=function(t){return Math.round(t*1e7)/1e7||0},Xr=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},hT=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},su=function(){var t=or.length,e=or.slice(0),n,i;for(Rd={},or.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},Vd=function(t){return!!(t._initted||t._startAt||t.add)},u_=function(t,e,n,i){or.length&&!En&&su(),t.render(e,n,i||!!(En&&e<0&&Vd(t))),or.length&&!En&&su()},f_=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(oT).length<2?e:gn(t)?t.trim():t},d_=function(t){return t},bi=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},uT=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},jo=function(t,e){for(var n in e)t[n]=e[n];return t},Qg=function s(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=cs(e[n])?s(t[n]||(t[n]={}),e[n]):e[n]);return t},ru=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},vl=function(t){var e=t.parent||Ve,n=t.keyframes?uT(Bn(t.keyframes)):bi;if(hi(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},fT=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},p_=function(t,e,n,i,r){n===void 0&&(n="_first"),i===void 0&&(i="_last");var o=t[i],a;if(r)for(a=e[r];o&&o[r]>a;)o=o._prev;return o?(e._next=o._next,o._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=o,e.parent=e._dp=t,e},fu=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var r=e._prev,o=e._next;r?r._next=o:t[n]===e&&(t[n]=o),o?o._prev=r:t[i]===e&&(t[i]=r),e._next=e._prev=e.parent=null},lr=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},Hr=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},dT=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},Cd=function(t,e,n,i){return t._startAt&&(En?t._startAt.revert(tu):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},pT=function s(t){return!t||t._ts&&s(t.parent)},jg=function(t){return t._repeat?ta(t._tTime,t=t.duration()+t._rDelay)*t:0},ta=function(t,e){var n=Math.floor(t=Ge(t/e));return t&&n===t?n-1:n},ou=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},du=function(t){return t._end=Ge(t._start+(t._tDur/Math.abs(t._ts||t._rts||be)||0))},pu=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=Ge(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),du(t),n._dirty||Hr(n,t)),t},m_=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=ou(t.rawTime(),e),(!e._dur||Rl(0,e.totalDuration(),n)-e._tTime>be)&&e.render(n,!0)),Hr(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-be}},ls=function(t,e,n,i){return e.parent&&lr(e),e._start=Ge((Ps(n)?n:!n&&au(e)&&(!t._last||t._last._start>=t._time)?t._last?t._last._start:t._time:n||t!==Ve?Ni(t,n,e):t._time)+e._delay),e._end=Ge(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),p_(t,e,"_first","_last",t._sort?"_start":0),au(e)||(t._recent=e),i||m_(t,e),t._ts<0&&pu(t,t._tTime),t},g_=function(t,e){return(Si.ScrollTrigger||uu("scrollTrigger",e))&&Si.ScrollTrigger.create(e,t)},__=function(t,e,n,i,r){if(Zd(t,e,r),!t._initted)return 1;if(!n&&t._pt&&!En&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&h_!==ci.frame)return or.push(t),t._lazy=[r,i],1},mT=function s(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||s(e))},au=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},gT=function(t,e,n,i){var r=t.ratio,o=e<0||!e&&(!t._start&&mT(t)&&!(!t._initted&&au(t))||(t._ts<0||t._dp._ts<0)&&!au(t))?0:1,a=t._rDelay,l=0,c,h,d;if(a&&t._repeat&&(l=Rl(0,t._tDur,e),h=ta(l,a),t._yoyo&&h&1&&(o=1-o),h!==ta(t._tTime,a)&&(r=1-o,t.vars.repeatRefresh&&t._initted&&t.invalidate())),o!==r||En||i||t._zTime===be||!e&&t._zTime){if(!t._initted&&__(t,e,i,n,l))return;for(d=t._zTime,t._zTime=e||(n?be:0),n||(n=e&&!d),t.ratio=o,t._from&&(o=1-o),t._time=0,t._tTime=l,c=t._pt;c;)c.r(o,c.d),c=c._next;e<0&&Cd(t,e,n,!0),t._onUpdate&&!n&&Mi(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&Mi(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===o&&(o&&lr(t,1),!n&&!En&&(Mi(t,o?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},_T=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},ea=function(t,e,n,i){var r=t._repeat,o=Ge(e)||0,a=t._tTime/t._tDur;return a&&!i&&(t._time*=o/t._dur),t._dur=o,t._tDur=r?r<0?1e10:Ge(o*(r+1)+t._rDelay*r):o,a>0&&!i&&pu(t,t._tTime=t._tDur*a),t.parent&&du(t),n||Hr(t.parent,t),t},t_=function(t){return t instanceof On?Hr(t):ea(t,t._dur)},xT={_start:0,endTime:Tl,totalDuration:Tl},Ni=function s(t,e,n){var i=t.labels,r=t._recent||xT,o=t.duration()>=Ui?r.endTime(!1):t._dur,a,l,c;return gn(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",a=e.indexOf("="),l==="<"||l===">"?(a>=0&&(e=e.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(a<0?r:n).totalDuration()/100:1)):a<0?(e in i||(i[e]=o),i[e]):(l=parseFloat(e.charAt(a-1)+e.substr(a+1)),c&&n&&(l=l/100*(Bn(n)?n[0]:n).totalDuration()),a>1?s(t,e.substr(0,a-1),n)+l:o+l)):e==null?o:+e},yl=function(t,e,n){var i=Ps(e[1]),r=(i?2:1)+(t<2?0:1),o=e[r],a,l;if(i&&(o.duration=e[1]),o.parent=n,t){for(a=o,l=n;l&&!("immediateRender"in a);)a=l.vars.defaults||{},l=hi(l.vars.inherit)&&l.parent;o.immediateRender=hi(a.immediateRender),t<2?o.runBackwards=1:o.startAt=e[r-1]}return new tn(e[0],o,e[r+1])},cr=function(t,e){return t||t===0?e(t):e},Rl=function(t,e,n){return n<t?t:n>e?e:n},An=function(t,e){return!gn(t)||!(e=aT.exec(t))?"":e[1]},vT=function(t,e,n){return cr(n,function(i){return Rl(t,e,i)})},Pd=[].slice,x_=function(t,e){return t&&cs(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&cs(t[0]))&&!t.nodeType&&t!==as},yT=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var r;return gn(i)&&!e||x_(i,1)?(r=n).push.apply(r,Fi(i)):n.push(i)})||n},Fi=function(t,e,n){return ze&&!e&&ze.selector?ze.selector(t):gn(t)&&!n&&(Ad||!na())?Pd.call((e||Bd).querySelectorAll(t),0):Bn(t)?yT(t,n):x_(t)?Pd.call(t,0):t?[t]:[]},Id=function(t){return t=Fi(t)[0]||bl("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return Fi(e,n.querySelectorAll?n:n===t?bl("Invalid scope")||Bd.createElement("div"):t)}},v_=function(t){return t.sort(function(){return .5-Math.random()})},y_=function(t){if(Ze(t))return t;var e=cs(t)?t:{each:t},n=Gr(e.ease),i=e.from||0,r=parseFloat(e.base)||0,o={},a=i>0&&i<1,l=isNaN(i)||a,c=e.axis,h=i,d=i;return gn(i)?h=d={center:.5,edges:.5,end:1}[i]||0:!a&&l&&(h=i[0],d=i[1]),function(u,f,m){var x=(m||e).length,p=o[x],g,v,S,y,b,T,_,M,R;if(!p){if(R=e.grid==="auto"?0:(e.grid||[1,Ui])[1],!R){for(_=-Ui;_<(_=m[R++].getBoundingClientRect().left)&&R<x;);R<x&&R--}for(p=o[x]=[],g=l?Math.min(R,x)*h-.5:i%R,v=R===Ui?0:l?x*d/R-.5:i/R|0,_=0,M=Ui,T=0;T<x;T++)S=T%R-g,y=v-(T/R|0),p[T]=b=c?Math.abs(c==="y"?y:S):r_(S*S+y*y),b>_&&(_=b),b<M&&(M=b);i==="random"&&v_(p),p.max=_-M,p.min=M,p.v=x=(parseFloat(e.amount)||parseFloat(e.each)*(R>x?x-1:c?c==="y"?x/R:R:Math.max(R,x/R))||0)*(i==="edges"?-1:1),p.b=x<0?r-x:r,p.u=An(e.amount||e.each)||0,n=n&&x<0?DT(n):n}return x=(p[u]-p.min)/p.max||0,Ge(p.b+(n?n(x):x)*p.v)+p.u}},Ld=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=Ge(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(Ps(n)?0:An(n))}},M_=function(t,e){var n=Bn(t),i,r;return!n&&cs(t)&&(i=n=t.radius||Ui,t.values?(t=Fi(t.values),(r=!Ps(t[0]))&&(i*=i)):t=Ld(t.increment)),cr(e,n?Ze(t)?function(o){return r=t(o),Math.abs(r-o)<=i?r:o}:function(o){for(var a=parseFloat(r?o.x:o),l=parseFloat(r?o.y:0),c=Ui,h=0,d=t.length,u,f;d--;)r?(u=t[d].x-a,f=t[d].y-l,u=u*u+f*f):u=Math.abs(t[d]-a),u<c&&(c=u,h=d);return h=!i||c<=i?t[h]:o,r||h===o||Ps(o)?h:h+An(o)}:Ld(t))},S_=function(t,e,n,i){return cr(Bn(t)?!e:n===!0?!!(n=0):!i,function(){return Bn(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},MT=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(r,o){return o(r)},i)}},ST=function(t,e){return function(n){return t(parseFloat(n))+(e||An(n))}},bT=function(t,e,n){return T_(t,e,0,1,n)},b_=function(t,e,n){return cr(n,function(i){return t[~~e(i)]})},TT=function s(t,e,n){var i=e-t;return Bn(t)?b_(t,s(0,t.length),e):cr(n,function(r){return(i+(r-t)%i)%i+t})},wT=function s(t,e,n){var i=e-t,r=i*2;return Bn(t)?b_(t,s(0,t.length-1),e):cr(n,function(o){return o=(r+(o-t)%r)%r||0,t+(o>i?r-o:o)})},ia=function(t){return t.replace(sT,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(rT);return S_(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},T_=function(t,e,n,i,r){var o=e-t,a=i-n;return cr(r,function(l){return n+((l-t)/o*a||0)})},ET=function s(t,e,n,i){var r=isNaN(t+e)?0:function(f){return(1-f)*t+f*e};if(!r){var o=gn(t),a={},l,c,h,d,u;if(n===!0&&(i=1)&&(n=null),o)t={p:t},e={p:e};else if(Bn(t)&&!Bn(e)){for(h=[],d=t.length,u=d-2,c=1;c<d;c++)h.push(s(t[c-1],t[c]));d--,r=function(m){m*=d;var x=Math.min(u,~~m);return h[x](m-x)},n=e}else i||(t=jo(Bn(t)?[]:{},t));if(!h){for(l in e)Yd.call(a,t,l,"get",e[l]);r=function(m){return Kd(m,a)||(o?t.p:t)}}}return cr(n,r)},e_=function(t,e,n){var i=t.labels,r=Ui,o,a,l;for(o in i)a=i[o]-e,a<0==!!n&&a&&r>(a=Math.abs(a))&&(l=o,r=a);return l},Mi=function(t,e,n){var i=t.vars,r=i[e],o=ze,a=t._ctx,l,c,h;if(r)return l=i[e+"Params"],c=i.callbackScope||t,n&&or.length&&su(),a&&(ze=a),h=l?r.apply(c,l):r.call(c),ze=o,h},_l=function(t){return lr(t),t.scrollTrigger&&t.scrollTrigger.kill(!!En),t.progress()<1&&Mi(t,"onInterrupt"),t},w_=[],E_=function(t){if(t)if(t=!t.name&&t.default||t,Ud()||t.headless){var e=t.name,n=Ze(t),i=e&&!n&&t.init?function(){this._props=[]}:t,r={init:Tl,render:Kd,add:Yd,kill:VT,modifier:GT,rawVars:0},o={targetTest:0,get:0,getSetter:mu,aliases:{},register:0};if(na(),t!==i){if(li[e])return;bi(i,bi(ru(t,r),o)),jo(i.prototype,jo(r,ru(t,o))),li[i.prop=e]=i,t.targetTest&&(eu.push(i),zd[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}c_(e,i),t.register&&t.register(zn,i,Qn)}else w_.push(t)},Le=255,xl={aqua:[0,Le,Le],lime:[0,Le,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Le],navy:[0,0,128],white:[Le,Le,Le],olive:[128,128,0],yellow:[Le,Le,0],orange:[Le,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Le,0,0],pink:[Le,192,203],cyan:[0,Le,Le],transparent:[Le,Le,Le,0]},Md=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*Le+.5|0},A_=function(t,e,n){var i=t?Ps(t)?[t>>16,t>>8&Le,t&Le]:0:xl.black,r,o,a,l,c,h,d,u,f,m;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),xl[t])i=xl[t];else if(t.charAt(0)==="#"){if(t.length<6&&(r=t.charAt(1),o=t.charAt(2),a=t.charAt(3),t="#"+r+r+o+o+a+a+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&Le,i&Le,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&Le,t&Le]}else if(t.substr(0,3)==="hsl"){if(i=m=t.match($g),!e)l=+i[0]%360/360,c=+i[1]/100,h=+i[2]/100,o=h<=.5?h*(c+1):h+c-h*c,r=h*2-o,i.length>3&&(i[3]*=1),i[0]=Md(l+1/3,r,o),i[1]=Md(l,r,o),i[2]=Md(l-1/3,r,o);else if(~t.indexOf("="))return i=t.match(Fd),n&&i.length<4&&(i[3]=1),i}else i=t.match($g)||xl.transparent;i=i.map(Number)}return e&&!m&&(r=i[0]/Le,o=i[1]/Le,a=i[2]/Le,d=Math.max(r,o,a),u=Math.min(r,o,a),h=(d+u)/2,d===u?l=c=0:(f=d-u,c=h>.5?f/(2-d-u):f/(d+u),l=d===r?(o-a)/f+(o<a?6:0):d===o?(a-r)/f+2:(r-o)/f+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(h*100+.5)),n&&i.length<4&&(i[3]=1),i},R_=function(t){var e=[],n=[],i=-1;return t.split(Cs).forEach(function(r){var o=r.match(Wr)||[];e.push.apply(e,o),n.push(i+=o.length+1)}),e.c=n,e},n_=function(t,e,n){var i="",r=(t+i).match(Cs),o=e?"hsla(":"rgba(",a=0,l,c,h,d;if(!r)return t;if(r=r.map(function(u){return(u=A_(u,e,1))&&o+(e?u[0]+","+u[1]+"%,"+u[2]+"%,"+u[3]:u.join(","))+")"}),n&&(h=R_(t),l=n.c,l.join(i)!==h.c.join(i)))for(c=t.replace(Cs,"1").split(Wr),d=c.length-1;a<d;a++)i+=c[a]+(~l.indexOf(a)?r.shift()||o+"0,0,0,0)":(h.length?h:r.length?r:n).shift());if(!c)for(c=t.split(Cs),d=c.length-1;a<d;a++)i+=c[a]+r[a];return i+c[d]},Cs=(function(){var s="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in xl)s+="|"+t+"\\b";return new RegExp(s+")","gi")})(),AT=/hsl[a]?\(/,Wd=function(t){var e=t.join(" "),n;if(Cs.lastIndex=0,Cs.test(e))return n=AT.test(e),t[1]=n_(t[1],n),t[0]=n_(t[0],n,R_(t[1])),!0},ci=(function(){var s=Date.now,t=500,e=33,n=s(),i=n,r=1e3/240,o=r,a=[],l,c,h,d,u,f,m=function x(p){var g=s()-i,v=p===!0,S,y,b,T;if((g>t||g<0)&&(n+=g-e),i+=g,b=i-n,S=b-o,(S>0||v)&&(T=++d.frame,u=b-d.time*1e3,d.time=b=b/1e3,o+=S+(S>=r?0:r-S),y=1),v||(l=c(x)),y)for(f=0;f<a.length;f++)a[f](b,u,T,p)};return d={time:0,frame:0,tick:function(){m(!0)},deltaRatio:function(p){return u/(1e3/(p||60))},wake:function(){a_&&(!Ad&&Ud()&&(as=Ad=window,Bd=as.document||{},Si.gsap=zn,(as.gsapVersions||(as.gsapVersions=[])).push(zn.version),l_(iu||as.GreenSockGlobals||!as.gsap&&as||{}),w_.forEach(E_)),h=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&d.sleep(),c=h||function(p){return setTimeout(p,o-d.time*1e3+1|0)},wl=1,m(2))},sleep:function(){(h?cancelAnimationFrame:clearTimeout)(l),wl=0,c=Tl},lagSmoothing:function(p,g){t=p||1/0,e=Math.min(g||33,t)},fps:function(p){r=1e3/(p||240),o=d.time*1e3+r},add:function(p,g,v){var S=g?function(y,b,T,_){p(y,b,T,_),d.remove(S)}:p;return d.remove(p),a[v?"unshift":"push"](S),na(),S},remove:function(p,g){~(g=a.indexOf(p))&&a.splice(g,1)&&f>=g&&f--},_listeners:a},d})(),na=function(){return!wl&&ci.wake()},ce={},RT=/^[\d.\-M][\d.\-,\s]/,CT=/["']/g,PT=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],r=1,o=n.length,a,l,c;r<o;r++)l=n[r],a=r!==o-1?l.lastIndexOf(","):l.length,c=l.substr(0,a),e[i]=isNaN(c)?c.replace(CT,"").trim():+c,i=l.substr(a+1).trim();return e},IT=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},LT=function(t){var e=(t+"").split("("),n=ce[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[PT(e[1])]:IT(t).split(",").map(f_)):ce._CE&&RT.test(t)?ce._CE("",t):n},DT=function(t){return function(e){return 1-t(1-e)}},Gr=function(t,e){return t&&(Ze(t)?t:ce[t]||LT(t))||e},Yr=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var r={easeIn:e,easeOut:n,easeInOut:i},o;return Kn(t,function(a){ce[a]=Si[a]=r,ce[o=a.toLowerCase()]=n;for(var l in r)ce[o+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ce[a+"."+l]=r[l]}),r},C_=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},Sd=function s(t,e,n){var i=e>=1?e:1,r=(n||(t?.3:.45))/(e<1?e:1),o=r/Ed*(Math.asin(1/i)||0),a=function(h){return h===1?1:i*Math.pow(2,-10*h)*iT((h-o)*r)+1},l=t==="out"?a:t==="in"?function(c){return 1-a(1-c)}:C_(a);return r=Ed/r,l.config=function(c,h){return s(t,c,h)},l},bd=function s(t,e){e===void 0&&(e=1.70158);var n=function(o){return o?--o*o*((e+1)*o+e)+1:0},i=t==="out"?n:t==="in"?function(r){return 1-n(1-r)}:C_(n);return i.config=function(r){return s(t,r)},i};Kn("Linear,Quad,Cubic,Quart,Quint,Strong",function(s,t){var e=t<5?t+1:t;Yr(s+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});ce.Linear.easeNone=ce.none=ce.Linear.easeIn;Yr("Elastic",Sd("in"),Sd("out"),Sd());(function(s,t){var e=1/t,n=2*e,i=2.5*e,r=function(a){return a<e?s*a*a:a<n?s*Math.pow(a-1.5/t,2)+.75:a<i?s*(a-=2.25/t)*a+.9375:s*Math.pow(a-2.625/t,2)+.984375};Yr("Bounce",function(o){return 1-r(1-o)},r)})(7.5625,2.75);Yr("Expo",function(s){return Math.pow(2,10*(s-1))*s+s*s*s*s*s*s*(1-s)});Yr("Circ",function(s){return-(r_(1-s*s)-1)});Yr("Sine",function(s){return s===1?1:-nT(s*tT)+1});Yr("Back",bd("in"),bd("out"),bd());ce.SteppedEase=ce.steps=Si.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),r=e?1:0,o=1-be;return function(a){return((i*Rl(0,o,a)|0)+r)*n}}};Sl.ease=ce["quad.out"];Kn("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(s){return kd+=s+","+s+"Params,"});Xd=function(t,e){this.id=eT++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:Gd,this.set=e?e.getSetter:mu},El=(function(){function s(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,ea(this,+e.duration,1,1),this.data=e.data,ze&&(this._ctx=ze,ze.data.push(this)),wl||ci.wake()}var t=s.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,ea(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(na(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(pu(this,n),!r._dp||r.parent||m_(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&ls(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===be||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),u_(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+jg(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+jg(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*r,i):this._repeat?ta(this._tTime,r)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-be?0:this._rts;if(this._rts===n)return this;var r=this.parent&&this._ts?ou(this.parent._time,this):this._tTime,o=this._rts<0;this._rts=+n||0,this._ts=this._ps||n===-be?0:this._rts;var a=this.totalDuration();return(o!==this._rts<0||r>0&&r<a)&&this.totalTime(Rl(-Math.abs(this._delay),a,r),i!==!1),du(this),dT(this)},t.paused=function(n){if(!arguments.length)return this._ps;if(this._ps!==n)if(this._ps=n,n)this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0;else{na(),this._ts=this._rts;var i=this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,r=this.progress()===1&&Math.abs(this._zTime)!==be,o;if(r)for(this._tTime-=be,o=this._first;o;){if(!o._dur&&o._zTime<0&&o._ts&&o._start<=i+be){r=!1;break}o=o._next}this.totalTime(i,r)}return this},t.startTime=function(n){if(arguments.length){this._start=Ge(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&ls(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(hi(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?ou(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=cT);var i=En;return En=n,Vd(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),En=i,this},t.globalTime=function(n){for(var i=this,r=arguments.length?n:i.rawTime();i;)r=i._start+r/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):r},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,t_(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,t_(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(Ni(this,n),hi(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,hi(i)),this._dur||(this._zTime=-be),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-be:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-be,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,r;return!!(!n||this._ts&&this._initted&&n.isActive()&&(r=n.rawTime(!0))>=i&&r<this.endTime(!0)-be)},t.eventCallback=function(n,i,r){var o=this.vars;return arguments.length>1?(i?(o[n]=i,r&&(o[n+"Params"]=r),n==="onUpdate"&&(this._onUpdate=i)):delete o[n],this):o[n]},t.then=function(n){var i=this,r=i._prom;return new Promise(function(o){var a=Ze(n)?n:d_,l=function(){var h=i.then;i.then=null,r&&r(),Ze(a)&&(a=a(i))&&(a.then||a===i)&&(i.then=h),o(a),i.then=h};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){_l(this)},s})();bi(El.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-be,_prom:0,_ps:!1,_rts:1});On=(function(s){s_(t,s);function t(n,i){var r;return n===void 0&&(n={}),r=s.call(this,n)||this,r.labels={},r.smoothChildTiming=!!n.smoothChildTiming,r.autoRemoveChildren=!!n.autoRemoveChildren,r._sort=hi(n.sortChildren),Ve&&ls(n.parent||Ve,Rs(r),i),n.reversed&&r.reverse(),n.paused&&r.paused(!0),n.scrollTrigger&&g_(Rs(r),n.scrollTrigger),r}var e=t.prototype;return e.to=function(i,r,o){return yl(0,arguments,this),this},e.from=function(i,r,o){return yl(1,arguments,this),this},e.fromTo=function(i,r,o,a){return yl(2,arguments,this),this},e.set=function(i,r,o){return r.duration=0,r.parent=this,vl(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new tn(i,r,Ni(this,o),1),this},e.call=function(i,r,o){return ls(this,tn.delayedCall(0,i,r),o)},e.staggerTo=function(i,r,o,a,l,c,h){return o.duration=r,o.stagger=o.stagger||a,o.onComplete=c,o.onCompleteParams=h,o.parent=this,new tn(i,o,Ni(this,l)),this},e.staggerFrom=function(i,r,o,a,l,c,h){return o.runBackwards=1,vl(o).immediateRender=hi(o.immediateRender),this.staggerTo(i,r,o,a,l,c,h)},e.staggerFromTo=function(i,r,o,a,l,c,h,d){return a.startAt=o,vl(a).immediateRender=hi(a.immediateRender),this.staggerTo(i,r,a,l,c,h,d)},e.render=function(i,r,o){var a=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,h=i<=0?0:Ge(i),d=this._zTime<0!=i<0&&(this._initted||!c),u,f,m,x,p,g,v,S,y,b,T,_;if(this!==Ve&&h>l&&i>=0&&(h=l),h!==this._tTime||o||d){if(a!==this._time&&c&&(h+=this._time-a,i+=this._time-a),u=h,y=this._start,S=this._ts,g=!S,d&&(c||(a=this._zTime),(i||!r)&&(this._zTime=i)),this._repeat){if(T=this._yoyo,p=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(p*100+i,r,o);if(u=Ge(h%p),h===l?(x=this._repeat,u=c):(b=Ge(h/p),x=~~b,x&&x===b&&(u=c,x--),u>c&&(u=c)),b=ta(this._tTime,p),!a&&this._tTime&&b!==x&&this._tTime-b*p-this._dur<=0&&(b=x),T&&x&1&&(u=c-u,_=1),x!==b&&!this._lock){var M=T&&b&1,R=M===(T&&x&1);if(x<b&&(M=!M),a=M?0:h%c?c:h,this._lock=1,this.render(a||(_?0:Ge(x*p)),r,!c)._lock=0,this._tTime=h,!r&&this.parent&&Mi(this,"onRepeat"),this.vars.repeatRefresh&&!_&&(this.invalidate()._lock=1,b=x),a&&a!==this._time||g!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,R&&(this._lock=2,a=M?c:-1e-4,this.render(a,!0),this.vars.repeatRefresh&&!_&&this.invalidate()),this._lock=0,!this._ts&&!g)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(v=_T(this,Ge(a),Ge(u)),v&&(h-=u-(u=v._start))),this._tTime=h,this._time=u,this._act=!!S,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,a=0),!a&&h&&c&&!r&&!b&&(Mi(this,"onStart"),this._tTime!==h))return this;if(u>=a&&i>=0)for(f=this._first;f;){if(m=f._next,(f._act||u>=f._start)&&f._ts&&v!==f){if(f.parent!==this)return this.render(i,r,o);if(f.render(f._ts>0?(u-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(u-f._start)*f._ts,r,o),u!==this._time||!this._ts&&!g){v=0,m&&(h+=this._zTime=-be);break}}f=m}else{f=this._last;for(var A=i<0?i:u;f;){if(m=f._prev,(f._act||A<=f._end)&&f._ts&&v!==f){if(f.parent!==this)return this.render(i,r,o);if(f.render(f._ts>0?(A-f._start)*f._ts:(f._dirty?f.totalDuration():f._tDur)+(A-f._start)*f._ts,r,o||En&&Vd(f)),u!==this._time||!this._ts&&!g){v=0,m&&(h+=this._zTime=A?-be:be);break}}f=m}}if(v&&!r&&(this.pause(),v.render(u>=a?0:-be)._zTime=u>=a?1:-1,this._ts))return this._start=y,du(this),this.render(i,r,o);this._onUpdate&&!r&&Mi(this,"onUpdate",!0),(h===l&&this._tTime>=this.totalDuration()||!h&&a)&&(y===this._start||Math.abs(S)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(h===l&&this._ts>0||!h&&this._ts<0)&&lr(this,1),!r&&!(i<0&&!a)&&(h||a||!l)&&(Mi(this,h===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(h<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,r){var o=this;if(Ps(r)||(r=Ni(this,r,i)),!(i instanceof El)){if(Bn(i))return i.forEach(function(a){return o.add(a,r)}),this;if(gn(i))return this.addLabel(i,r);if(Ze(i))i=tn.delayedCall(0,i);else return this}return this!==i?ls(this,i,r):this},e.getChildren=function(i,r,o,a){i===void 0&&(i=!0),r===void 0&&(r=!0),o===void 0&&(o=!0),a===void 0&&(a=-Ui);for(var l=[],c=this._first;c;)c._start>=a&&(c instanceof tn?r&&l.push(c):(o&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,r,o)))),c=c._next;return l},e.getById=function(i){for(var r=this.getChildren(1,1,1),o=r.length;o--;)if(r[o].vars.id===i)return r[o]},e.remove=function(i){return gn(i)?this.removeLabel(i):Ze(i)?this.killTweensOf(i):(i.parent===this&&fu(this,i),i===this._recent&&(this._recent=this._last),Hr(this))},e.totalTime=function(i,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Ge(ci.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),s.prototype.totalTime.call(this,i,r),this._forcing=0,this):this._tTime},e.addLabel=function(i,r){return this.labels[i]=Ni(this,r),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,r,o){var a=tn.delayedCall(0,r||Tl,o);return a.data="isPause",this._hasPause=1,ls(this,a,Ni(this,i))},e.removePause=function(i){var r=this._first;for(i=Ni(this,i);r;)r._start===i&&r.data==="isPause"&&lr(r),r=r._next},e.killTweensOf=function(i,r,o){for(var a=this.getTweensOf(i,o),l=a.length;l--;)rr!==a[l]&&a[l].kill(i,r);return this},e.getTweensOf=function(i,r){for(var o=[],a=Fi(i),l=this._first,c=Ps(r),h;l;)l instanceof tn?hT(l._targets,a)&&(c?(!rr||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&o.push(l):(h=l.getTweensOf(a,r)).length&&o.push.apply(o,h),l=l._next;return o},e.tweenTo=function(i,r){r=r||{};var o=this,a=Ni(o,i),l=r,c=l.startAt,h=l.onStart,d=l.onStartParams,u=l.immediateRender,f,m=tn.to(o,bi({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:a,overwrite:"auto",duration:r.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale())||be,onStart:function(){if(o.pause(),!f){var p=r.duration||Math.abs((a-(c&&"time"in c?c.time:o._time))/o.timeScale());m._dur!==p&&ea(m,p,0,1).render(m._time,!0,!0),f=1}h&&h.apply(m,d||[])}},r));return u?m.render(0):m},e.tweenFromTo=function(i,r,o){return this.tweenTo(r,bi({startAt:{time:Ni(this,i)}},o))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),e_(this,Ni(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),e_(this,Ni(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+be)},e.shiftChildren=function(i,r,o){o===void 0&&(o=0);var a=this._first,l=this.labels,c;for(i=Ge(i);a;)a._start>=o&&(a._start+=i,a._end+=i),a=a._next;if(r)for(c in l)l[c]>=o&&(l[c]+=i);return Hr(this)},e.invalidate=function(i){var r=this._first;for(this._lock=0;r;)r.invalidate(i),r=r._next;return s.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var r=this._first,o;r;)o=r._next,this.remove(r),r=o;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),Hr(this)},e.totalDuration=function(i){var r=0,o=this,a=o._last,l=Ui,c,h,d;if(arguments.length)return o.timeScale((o._repeat<0?o.duration():o.totalDuration())/(o.reversed()?-i:i));if(o._dirty){for(d=o.parent;a;)c=a._prev,a._dirty&&a.totalDuration(),h=a._start,h>l&&o._sort&&a._ts&&!o._lock?(o._lock=1,ls(o,a,h-a._delay,1)._lock=0):l=h,h<0&&a._ts&&(r-=h,(!d&&!o._dp||d&&d.smoothChildTiming)&&(o._start+=Ge(h/o._ts),o._time-=h,o._tTime-=h),o.shiftChildren(-h,!1,-1/0),l=0),a._end>r&&a._ts&&(r=a._end),a=c;ea(o,o===Ve&&o._time>r?o._time:r,1,1),o._dirty=0}return o._tDur},t.updateRoot=function(i){if(Ve._ts&&(u_(Ve,ou(i,Ve)),h_=ci.frame),ci.frame>=Kg){Kg+=ui.autoSleep||120;var r=Ve._first;if((!r||!r._ts)&&ui.autoSleep&&ci._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||ci.sleep()}}},t})(El);bi(On.prototype,{_lock:0,_hasPause:0,_forcing:0});NT=function(t,e,n,i,r,o,a){var l=new Qn(this._pt,t,e,0,1,$d,null,r),c=0,h=0,d,u,f,m,x,p,g,v;for(l.b=n,l.e=i,n+="",i+="",(g=~i.indexOf("random("))&&(i=ia(i)),o&&(v=[n,i],o(v,t,e),n=v[0],i=v[1]),u=n.match(vd)||[];d=vd.exec(i);)m=d[0],x=i.substring(c,d.index),f?f=(f+1)%5:x.substr(-5)==="rgba("&&(f=1),m!==u[h++]&&(p=parseFloat(u[h-1])||0,l._pt={_next:l._pt,p:x||h===1?x:",",s:p,c:m.charAt(1)==="="?Xr(p,m)-p:parseFloat(m)-p,m:f&&f<4?Math.round:0},c=vd.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=a,(Od.test(i)||g)&&(l.e=0),this._pt=l,l},Yd=function(t,e,n,i,r,o,a,l,c,h){Ze(i)&&(i=i(r||0,t,o));var d=t[e],u=n!=="get"?n:Ze(d)?c?t[e.indexOf("set")||!Ze(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():d,f=Ze(d)?c?zT:I_:Jd,m;if(gn(i)&&(~i.indexOf("random(")&&(i=ia(i)),i.charAt(1)==="="&&(m=Xr(u,i)+(An(u)||0),(m||m===0)&&(i=m))),!h||u!==i||Dd)return!isNaN(u*i)&&i!==""?(m=new Qn(this._pt,t,e,+u||0,i-(u||0),typeof d=="boolean"?HT:L_,0,f),c&&(m.fp=c),a&&m.modifier(a,this,t),this._pt=m):(!d&&!(e in t)&&uu(e,i),NT.call(this,t,e,u,i,f,l||ui.stringFilter,c))},UT=function(t,e,n,i,r){if(Ze(t)&&(t=Ml(t,r,e,n,i)),!cs(t)||t.style&&t.nodeType||Bn(t)||o_(t))return gn(t)?Ml(t,r,e,n,i):t;var o={},a;for(a in t)o[a]=Ml(t[a],r,e,n,i);return o},qd=function(t,e,n,i,r,o){var a,l,c,h;if(li[t]&&(a=new li[t]).init(r,a.rawVars?e[t]:UT(e[t],i,r,o,n),n,i,o)!==!1&&(n._pt=l=new Qn(n._pt,r,t,0,1,a.render,a,0,a.priority),n!==Qo))for(c=n._ptLookup[n._targets.indexOf(r)],h=a._props.length;h--;)c[a._props[h]]=l;return a},Zd=function s(t,e,n){var i=t.vars,r=i.ease,o=i.startAt,a=i.immediateRender,l=i.lazy,c=i.onUpdate,h=i.runBackwards,d=i.yoyoEase,u=i.keyframes,f=i.autoRevert,m=t._dur,x=t._startAt,p=t._targets,g=t.parent,v=g&&g.data==="nested"?g.vars.targets:p,S=t._overwrite==="auto"&&!Nd,y=t.timeline,b=i.easeReverse||d,T,_,M,R,A,D,L,F,P,B,k,O,Q;if(y&&(!u||!r)&&(r="none"),t._ease=Gr(r,Sl.ease),t._rEase=b&&(Gr(b)||t._ease),t._from=!y&&!!i.runBackwards,t._from&&(t.ratio=1),!y||u&&!i.stagger){if(F=p[0]?ar(p[0]).harness:0,O=F&&i[F.prop],T=ru(i,zd),x&&(x._zTime<0&&x.progress(1),e<0&&h&&a&&!f?x.render(-1,!0):x.revert(h&&m?tu:lT),x._lazy=0),o){if(lr(t._startAt=tn.set(p,bi({data:"isStart",overwrite:!1,parent:g,immediateRender:!0,lazy:!x&&hi(l),startAt:null,delay:0,onUpdate:c&&function(){return Mi(t,"onUpdate")},stagger:0},o))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(En||!a&&!f)&&t._startAt.revert(tu),a&&m&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(h&&m&&!x){if(e&&(a=!1),M=bi({overwrite:!1,data:"isFromStart",lazy:a&&!x&&hi(l),immediateRender:a,stagger:0,parent:g},T),O&&(M[F.prop]=O),lr(t._startAt=tn.set(p,M)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(En?t._startAt.revert(tu):t._startAt.render(-1,!0)),t._zTime=e,!a)s(t._startAt,be,be);else if(!e)return}for(t._pt=t._ptCache=0,l=m&&hi(l)||l&&!m,_=0;_<p.length;_++){if(A=p[_],L=A._gsap||Hd(p)[_]._gsap,t._ptLookup[_]=B={},Rd[L.id]&&or.length&&su(),k=v===p?_:v.indexOf(A),F&&(P=new F).init(A,O||T,t,k,v)!==!1&&(t._pt=R=new Qn(t._pt,A,P.name,0,1,P.render,P,0,P.priority),P._props.forEach(function(W){B[W]=R}),P.priority&&(D=1)),!F||O)for(M in T)li[M]&&(P=qd(M,T,t,k,A,v))?P.priority&&(D=1):B[M]=R=Yd.call(t,A,M,"get",T[M],k,v,0,i.stringFilter);t._op&&t._op[_]&&t.kill(A,t._op[_]),S&&t._pt&&(rr=t,Ve.killTweensOf(A,B,t.globalTime(e)),Q=!t.parent,rr=0),t._pt&&l&&(Rd[L.id]=1)}D&&Qd(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!Q,u&&e<=0&&y.render(Ui,!0,!0)},FT=function(t,e,n,i,r,o,a,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],h,d,u,f;if(!c)for(c=t._ptCache[e]=[],u=t._ptLookup,f=t._targets.length;f--;){if(h=u[f][e],h&&h.d&&h.d._pt)for(h=h.d._pt;h&&h.p!==e&&h.fp!==e;)h=h._next;if(!h)return Dd=1,t.vars[e]="+=0",Zd(t,a),Dd=0,l?bl(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(h)}for(f=c.length;f--;)d=c[f],h=d._pt||d,h.s=(i||i===0)&&!r?i:h.s+(i||0)+o*h.c,h.c=n-h.s,d.e&&(d.e=Je(n)+An(d.e)),d.b&&(d.b=h.s+An(d.b))},OT=function(t,e){var n=t[0]?ar(t[0]).harness:0,i=n&&n.aliases,r,o,a,l;if(!i)return e;r=jo({},e);for(o in i)if(o in r)for(l=i[o].split(","),a=l.length;a--;)r[l[a]]=r[o];return r},BT=function(t,e,n,i){var r=e.ease||i||"power1.inOut",o,a;if(Bn(e))a=n[t]||(n[t]=[]),e.forEach(function(l,c){return a.push({t:c/(e.length-1)*100,v:l,e:r})});else for(o in e)a=n[o]||(n[o]=[]),o==="ease"||a.push({t:parseFloat(t),v:e[o],e:r})},Ml=function(t,e,n,i,r){return Ze(t)?t.call(e,n,i,r):gn(t)&&~t.indexOf("random(")?ia(t):t},lu=kd+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",P_={};Kn(lu+",id,stagger,delay,duration,paused,scrollTrigger",function(s){return P_[s]=1});lu=lu.split(",");tn=(function(s){s_(t,s);function t(n,i,r,o){var a;typeof i=="number"&&(r.duration=i,i=r,r=null),a=s.call(this,o?i:vl(i))||this;var l=a.vars,c=l.duration,h=l.delay,d=l.immediateRender,u=l.stagger,f=l.overwrite,m=l.keyframes,x=l.defaults,p=l.scrollTrigger,g=i.parent||Ve,v=(Bn(n)||o_(n)?Ps(n[0]):"length"in i)?[n]:Fi(n),S,y,b,T,_,M,R,A;if(a._targets=v.length?Hd(v):bl("GSAP target "+n+" not found. https://gsap.com",!ui.nullTargetWarn)||[],a._ptLookup=[],a._overwrite=f,m||u||jh(c)||jh(h)){i=a.vars;var D=i.easeReverse||i.yoyoEase;if(S=a.timeline=new On({data:"nested",defaults:x||{},targets:g&&g.data==="nested"?g.vars.targets:v}),S.kill(),S.parent=S._dp=Rs(a),S._start=0,u||jh(c)||jh(h)){if(T=v.length,R=u&&y_(u),cs(u))for(_ in u)~lu.indexOf(_)&&(A||(A={}),A[_]=u[_]);for(y=0;y<T;y++)b=ru(i,P_),b.stagger=0,D&&(b.easeReverse=D),A&&jo(b,A),M=v[y],b.duration=+Ml(c,Rs(a),y,M,v),b.delay=(+Ml(h,Rs(a),y,M,v)||0)-a._delay,!u&&T===1&&b.delay&&(a._delay=h=b.delay,a._start+=h,b.delay=0),S.to(M,b,R?R(y,M,v):0),S._ease=ce.none;S.duration()?c=h=0:a.timeline=0}else if(m){vl(bi(S.vars.defaults,{ease:"none"})),S._ease=Gr(m.ease||i.ease||"none");var L=0,F,P,B;if(Bn(m))m.forEach(function(k){return S.to(v,k,">")}),S.duration();else{b={};for(_ in m)_==="ease"||_==="easeEach"||BT(_,m[_],b,m.easeEach);for(_ in b)for(F=b[_].sort(function(k,O){return k.t-O.t}),L=0,y=0;y<F.length;y++)P=F[y],B={ease:P.e,duration:(P.t-(y?F[y-1].t:0))/100*c},B[_]=P.v,S.to(v,B,L),L+=B.duration;S.duration()<c&&S.to({},{duration:c-S.duration()})}}c||a.duration(c=S.duration())}else a.timeline=0;return f===!0&&!Nd&&(rr=Rs(a),Ve.killTweensOf(v),rr=0),ls(g,Rs(a),r),i.reversed&&a.reverse(),i.paused&&a.paused(!0),(d||!c&&!m&&a._start===Ge(g._time)&&hi(d)&&pT(Rs(a))&&g.data!=="nested")&&(a._tTime=-be,a.render(Math.max(0,-h)||0)),p&&g_(Rs(a),p),a}var e=t.prototype;return e.render=function(i,r,o){var a=this._time,l=this._tDur,c=this._dur,h=i<0,d=i>l-be&&!h?l:i<be?0:i,u,f,m,x,p,g,v,S;if(!c)gT(this,i,r,o);else if(d!==this._tTime||!i||o||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==h||this._lazy){if(u=d,S=this.timeline,this._repeat){if(x=c+this._rDelay,this._repeat<-1&&h)return this.totalTime(x*100+i,r,o);if(u=Ge(d%x),d===l?(m=this._repeat,u=c):(p=Ge(d/x),m=~~p,m&&m===p?(u=c,m--):u>c&&(u=c)),g=this._yoyo&&m&1,g&&(u=c-u),p=ta(this._tTime,x),u===a&&!o&&this._initted&&m===p)return this._tTime=d,this;m!==p&&this.vars.repeatRefresh&&!g&&!this._lock&&u!==x&&this._initted&&(this._lock=o=1,this.render(Ge(x*m),!0).invalidate()._lock=0)}if(!this._initted){if(__(this,h?i:u,o,r,d))return this._tTime=0,this;if(a!==this._time&&!(o&&this.vars.repeatRefresh&&m!==p))return this;if(c!==this._dur)return this.render(i,r,o)}if(this._rEase){var y=u<a;if(y!==this._inv){var b=y?a:c-a;this._inv=y,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=a,this._invRecip=b?(y?-1:1)/b:0,this._invScale=y?-this.ratio:1-this.ratio,this._invEase=y?this._rEase:this._ease}this.ratio=v=this._invRatio+this._invScale*this._invEase((u-this._invTime)*this._invRecip)}else this.ratio=v=this._ease(u/c);if(this._from&&(this.ratio=v=1-v),this._tTime=d,this._time=u,!this._act&&this._ts&&(this._act=1,this._lazy=0),!a&&d&&!r&&!p&&(Mi(this,"onStart"),this._tTime!==d))return this;for(f=this._pt;f;)f.r(v,f.d),f=f._next;S&&S.render(i<0?i:S._dur*S._ease(u/this._dur),r,o)||this._startAt&&(this._zTime=i),this._onUpdate&&!r&&(h&&Cd(this,i,r,o),Mi(this,"onUpdate")),this._repeat&&m!==p&&this.vars.onRepeat&&!r&&this.parent&&Mi(this,"onRepeat"),(d===this._tDur||!d)&&this._tTime===d&&(h&&!this._onUpdate&&Cd(this,i,!0,!0),(i||!c)&&(d===this._tDur&&this._ts>0||!d&&this._ts<0)&&lr(this,1),!r&&!(h&&!a)&&(d||a||g)&&(Mi(this,d===l?"onComplete":"onReverseComplete",!0),this._prom&&!(d<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),s.prototype.invalidate.call(this,i)},e.resetTo=function(i,r,o,a,l){wl||ci.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),h;return this._initted||Zd(this,c),h=this._ease(c/this._dur),FT(this,i,r,o,a,h,c,l)?this.resetTo(i,r,o,a,1):(pu(this,0),this.parent||p_(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,r){if(r===void 0&&(r="all"),!i&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?_l(this):this.scrollTrigger&&this.scrollTrigger.kill(!!En),this;if(this.timeline){var o=this.timeline.totalDuration();return this.timeline.killTweensOf(i,r,rr&&rr.vars.overwrite!==!0)._first||_l(this),this.parent&&o!==this.timeline.totalDuration()&&ea(this,this._dur*this.timeline._tDur/o,0,1),this}var a=this._targets,l=i?Fi(i):a,c=this._ptLookup,h=this._pt,d,u,f,m,x,p,g;if((!r||r==="all")&&fT(a,l))return r==="all"&&(this._pt=0),_l(this);for(d=this._op=this._op||[],r!=="all"&&(gn(r)&&(x={},Kn(r,function(v){return x[v]=1}),r=x),r=OT(a,r)),g=a.length;g--;)if(~l.indexOf(a[g])){u=c[g],r==="all"?(d[g]=r,m=u,f={}):(f=d[g]=d[g]||{},m=r);for(x in m)p=u&&u[x],p&&((!("kill"in p.d)||p.d.kill(x)===!0)&&fu(this,p,"_pt"),delete u[x]),f!=="all"&&(f[x]=1)}return this._initted&&!this._pt&&h&&_l(this),this},t.to=function(i,r){return new t(i,r,arguments[2])},t.from=function(i,r){return yl(1,arguments)},t.delayedCall=function(i,r,o,a){return new t(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:r,onReverseComplete:r,onCompleteParams:o,onReverseCompleteParams:o,callbackScope:a})},t.fromTo=function(i,r,o){return yl(2,arguments)},t.set=function(i,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new t(i,r)},t.killTweensOf=function(i,r,o){return Ve.killTweensOf(i,r,o)},t})(El);bi(tn.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});Kn("staggerTo,staggerFrom,staggerFromTo",function(s){tn[s]=function(){var t=new On,e=Pd.call(arguments,0);return e.splice(s==="staggerFromTo"?5:4,0,0),t[s].apply(t,e)}});Jd=function(t,e,n){return t[e]=n},I_=function(t,e,n){return t[e](n)},zT=function(t,e,n,i){return t[e](i.fp,n)},kT=function(t,e,n){return t.setAttribute(e,n)},mu=function(t,e){return Ze(t[e])?I_:hu(t[e])&&t.setAttribute?kT:Jd},L_=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},HT=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},$d=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Kd=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},GT=function(t,e,n,i){for(var r=this._pt,o;r;)o=r._next,r.p===i&&r.modifier(t,e,n),r=o},VT=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?fu(this,e,"_pt"):e.dep||(n=1),e=i;return!n},WT=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},Qd=function(t){for(var e=t._pt,n,i,r,o;e;){for(n=e._next,i=r;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:o)?e._prev._next=e:r=e,(e._next=i)?i._prev=e:o=e,e=n}t._pt=r},Qn=(function(){function s(e,n,i,r,o,a,l,c,h){this.t=n,this.s=r,this.c=o,this.p=i,this.r=a||L_,this.d=l||this,this.set=c||Jd,this.pr=h||0,this._next=e,e&&(e._prev=this)}var t=s.prototype;return t.modifier=function(n,i,r){this.mSet=this.mSet||this.set,this.set=WT,this.m=n,this.mt=r,this.tween=i},s})();Kn(kd+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(s){return zd[s]=1});Si.TweenMax=Si.TweenLite=tn;Si.TimelineLite=Si.TimelineMax=On;Ve=new On({sortChildren:!1,defaults:Sl,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});ui.stringFilter=Wd;Vr=[],nu={},XT=[],i_=0,YT=0,Td=function(t){return(nu[t]||XT).map(function(e){return e()})},Al=function(){var t=Date.now(),e=[];t-i_>2&&(Td("matchMediaInit"),Vr.forEach(function(n){var i=n.queries,r=n.conditions,o,a,l,c;for(a in i)o=as.matchMedia(i[a]).matches,o&&(l=1),o!==r[a]&&(r[a]=o,c=1);c&&(n.revert(),l&&e.push(n))}),Td("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),i_=t,Td("matchMedia"))},D_=(function(){function s(e,n){this.selector=n&&Id(n),this.data=[],this._r=[],this.isReverted=!1,this.id=YT++,e&&this.add(e)}var t=s.prototype;return t.add=function(n,i,r){Ze(n)&&(r=i,i=n,n=Ze);var o=this,a=function(){var c=ze,h=o.selector,d;return c&&c!==o&&c.data.push(o),r&&(o.selector=Id(r)),ze=o,d=i.apply(o,arguments),Ze(d)&&o._r.push(d),ze=c,o.selector=h,o.isReverted=!1,d};return o.last=a,n===Ze?a(o,function(l){return o.add(null,l)}):n?o[n]=a:a},t.ignore=function(n){var i=ze;ze=null,n(this),ze=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof s?n.push.apply(n,i.getTweens()):i instanceof tn&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var r=this;if(n?(function(){for(var a=r.getTweens(),l=r.data.length,c;l--;)c=r.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(h){return a.splice(a.indexOf(h),1)}));for(a.map(function(h){return{g:h._dur||h._delay||h._sat&&!h._sat.vars.immediateRender?h.globalTime(0):-1/0,t:h}}).sort(function(h,d){return d.g-h.g||-1/0}).forEach(function(h){return h.t.revert(n)}),l=r.data.length;l--;)c=r.data[l],c instanceof On?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof tn)&&c.revert&&c.revert(n);r._r.forEach(function(h){return h(n,r)}),r.isReverted=!0})():this.data.forEach(function(a){return a.kill&&a.kill()}),this.clear(),i){for(var o=Vr.length;o--;)Vr[o].id===this.id&&Vr.splice(o,1);this._mqs&&this._mqs.forEach(function(a){return a.removeListener?a.removeListener(Al):a.removeEventListener("change",Al)}),this._mqs=null}},t.revert=function(n){this.kill(n||{})},s})(),qT=(function(){function s(e){this.contexts=[],this.scope=e,ze&&ze.data.push(this)}var t=s.prototype;return t.add=function(n,i,r){cs(n)||(n={matches:n});var o=new D_(0,r||this.scope),a=o.conditions={},l,c,h;ze&&!o.selector&&(o.selector=ze.selector),this.contexts.push(o),i=o.add("onMatch",i),o.queries=n;for(c in n)c==="all"?h=1:(l=as.matchMedia(n[c]),l&&(Vr.indexOf(o)<0&&Vr.push(o),(a[c]=l.matches)&&(h=1),l.addListener?l.addListener(Al):l.addEventListener("change",Al),(o._mqs||(o._mqs=[])).push(l)));return h&&i(o,function(d){return o.add(null,d)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},s})(),cu={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return E_(i)})},timeline:function(t){return new On(t)},getTweensOf:function(t,e){return Ve.getTweensOf(t,e)},getProperty:function(t,e,n,i){gn(t)&&(t=Fi(t)[0]);var r=ar(t||{}).get,o=n?d_:f_;return n==="native"&&(n=""),t&&(e?o((li[e]&&li[e].get||r)(t,e,n,i)):function(a,l,c){return o((li[a]&&li[a].get||r)(t,a,l,c))})},quickSetter:function(t,e,n){if(t=Fi(t),t.length>1){var i=t.map(function(h){return zn.quickSetter(h,e,n)}),r=i.length;return function(h){for(var d=r;d--;)i[d](h)}}t=t[0]||{};var o=li[e],a=ar(t),l=a.harness&&(a.harness.aliases||{})[e]||e,c=o?function(h){var d=new o;Qo._pt=0,d.init(t,n?h+n:h,Qo,0,[t]),d.render(1,d),Qo._pt&&Kd(1,Qo)}:a.set(t,l);return o?c:function(h){return c(t,l,n?h+n:h,a,1)}},quickTo:function(t,e,n){var i,r=zn.to(t,bi((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),o=function(l,c,h){return r.resetTo(e,l,c,h)};return o.tween=r,o},isTweening:function(t){return Ve.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=Gr(t.ease,Sl.ease)),Qg(Sl,t||{})},config:function(t){return Qg(ui,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,r=t.defaults,o=t.extendTimeline;(i||"").split(",").forEach(function(a){return a&&!li[a]&&!Si[a]&&bl(e+" effect requires "+a+" plugin.")}),yd[e]=function(a,l,c){return n(Fi(a),bi(l||{},r),c)},o&&(On.prototype[e]=function(a,l,c){return this.add(yd[e](a,cs(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){ce[t]=Gr(e)},parseEase:function(t,e){return arguments.length?Gr(t,e):ce},getById:function(t){return Ve.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new On(t),i,r;for(n.smoothChildTiming=hi(t.smoothChildTiming),Ve.remove(n),n._dp=0,n._time=n._tTime=Ve._time,i=Ve._first;i;)r=i._next,(e||!(!i._dur&&i instanceof tn&&i.vars.onComplete===i._targets[0]))&&ls(n,i,i._start-i._delay),i=r;return ls(Ve,n,0),n},context:function(t,e){return t?new D_(t,e):ze},matchMedia:function(t){return new qT(t)},matchMediaRefresh:function(){return Vr.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||Al()},addEventListener:function(t,e){var n=nu[t]||(nu[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=nu[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:TT,wrapYoyo:wT,distribute:y_,random:S_,snap:M_,normalize:bT,getUnit:An,clamp:vT,splitColor:A_,toArray:Fi,selector:Id,mapRange:T_,pipe:MT,unitize:ST,interpolate:ET,shuffle:v_},install:l_,effects:yd,ticker:ci,updateRoot:On.updateRoot,plugins:li,globalTimeline:Ve,core:{PropTween:Qn,globals:c_,Tween:tn,Timeline:On,Animation:El,getCache:ar,_removeLinkedListItem:fu,reverting:function(){return En},context:function(t){return t&&ze&&(ze.data.push(t),t._ctx=ze),ze},suppressOverwrites:function(t){return Nd=t}}};Kn("to,from,fromTo,delayedCall,set,killTweensOf",function(s){return cu[s]=tn[s]});ci.add(On.updateRoot);Qo=cu.to({},{duration:0});ZT=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},JT=function(t,e){var n=t._targets,i,r,o;for(i in e)for(r=n.length;r--;)o=t._ptLookup[r][i],o&&(o=o.d)&&(o._pt&&(o=ZT(o,i)),o&&o.modifier&&o.modifier(e[i],t,n[r],i))},wd=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,r,o){o._onInit=function(a){var l,c;if(gn(r)&&(l={},Kn(r,function(h){return l[h]=1}),r=l),e){l={};for(c in r)l[c]=e(r[c]);r=l}JT(a,r)}}}},zn=cu.registerPlugin({name:"attr",init:function(t,e,n,i,r){var o,a,l;this.tween=n;for(o in e)l=t.getAttribute(o)||"",a=this.add(t,"setAttribute",(l||0)+"",e[o],i,r,0,0,o),a.op=o,a.b=l,this._props.push(o)},render:function(t,e){for(var n=e._pt;n;)En?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},wd("roundProps",Ld),wd("modifiers"),wd("snap",M_))||cu;tn.version=On.version=zn.version="3.15.1";a_=1;Ud()&&na();$T=ce.Power0,KT=ce.Power1,QT=ce.Power2,jT=ce.Power3,tw=ce.Power4,ew=ce.Linear,nw=ce.Quad,iw=ce.Cubic,sw=ce.Quart,rw=ce.Quint,ow=ce.Strong,aw=ce.Elastic,lw=ce.Back,cw=ce.SteppedEase,hw=ce.Bounce,uw=ce.Sine,fw=ce.Expo,dw=ce.Circ});var N_,hr,ra,rp,$r,pw,U_,op,mw,Ls,Jr,oa,sa,F_,ap,gw,_w,hs,ep,xw,vw,yw,Mw,W_,X_,Sw,bw,Tw,ww,Ew,Aw,We,fi,Rw,Y_,Cw,q_,Z_,np,Ti,O_,aa,ip,B_,z_,J_,$_,fr,ur,k_,Pw,dr,Is,Iw,H_,Lw,Dw,gu,Pl,K_,Q_,G_,lp,sp,Il,_u,tp,Nw,qr,Cl,Zr,j_,Uw,Fw,V_,Ow,cp,t0=on(()=>{jd();mw=function(){return typeof window<"u"},Ls={},Jr=180/Math.PI,oa=Math.PI/180,sa=Math.atan2,F_=1e8,ap=/([A-Z])/g,gw=/(left|right|width|margin|padding|x)/i,_w=/[\s,\(]\S/,hs={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},ep=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},xw=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},vw=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},yw=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Mw=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},W_=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},X_=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Sw=function(t,e,n){return t.style[e]=n},bw=function(t,e,n){return t.style.setProperty(e,n)},Tw=function(t,e,n){return t._gsap[e]=n},ww=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},Ew=function(t,e,n,i,r){var o=t._gsap;o.scaleX=o.scaleY=n,o.renderTransform(r,o)},Aw=function(t,e,n,i,r){var o=t._gsap;o[e]=n,o.renderTransform(r,o)},We="transform",fi=We+"Origin",Rw=function s(t,e){var n=this,i=this.target,r=i.style,o=i._gsap;if(t in Ls&&r){if(this.tfm=this.tfm||{},t!=="transform")t=hs[t]||t,~t.indexOf(",")?t.split(",").forEach(function(a){return n.tfm[a]=Is(i,a)}):this.tfm[t]=o.x?o[t]:Is(i,t),t===fi&&(this.tfm.zOrigin=o.zOrigin);else return hs.transform.split(",").forEach(function(a){return s.call(n,a,e)});if(this.props.indexOf(We)>=0)return;o.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(fi,e,"")),t=We}(r||e)&&this.props.push(t,e,r[t])},Y_=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},Cw=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,r,o;for(r=0;r<t.length;r+=3)t[r+1]?t[r+1]===2?e[t[r]](t[r+2]):e[t[r]]=t[r+2]:t[r+2]?n[t[r]]=t[r+2]:n.removeProperty(t[r].substr(0,2)==="--"?t[r]:t[r].replace(ap,"-$1").toLowerCase());if(this.tfm){for(o in this.tfm)i[o]=this.tfm[o];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),r=op(),(!r||!r.isStart)&&!n[We]&&(Y_(n),i.zOrigin&&n[fi]&&(n[fi]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},q_=function(t,e){var n={target:t,props:[],revert:Cw,save:Rw};return t._gsap||zn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},np=function(t,e){var n=hr.createElementNS?hr.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):hr.createElement(t);return n&&n.style?n:hr.createElement(t)},Ti=function s(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(ap,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&s(t,aa(e)||e,1)||""},O_="O,Moz,ms,Ms,Webkit".split(","),aa=function(t,e,n){var i=e||$r,r=i.style,o=5;if(t in r&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);o--&&!(O_[o]+t in r););return o<0?null:(o===3?"ms":o>=0?O_[o]:"")+t},ip=function(){mw()&&window.document&&(N_=window,hr=N_.document,ra=hr.documentElement,$r=np("div")||{style:{}},pw=np("div"),We=aa(We),fi=We+"Origin",$r.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Z_=!!aa("perspective"),op=zn.core.reverting,rp=1)},B_=function(t){var e=t.ownerSVGElement,n=np("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),r;i.style.display="block",n.appendChild(i),ra.appendChild(n);try{r=i.getBBox()}catch{}return n.removeChild(i),ra.removeChild(n),r},z_=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},J_=function(t){var e,n;try{e=t.getBBox()}catch{e=B_(t),n=1}return e&&(e.width||e.height)||n||(e=B_(t)),e&&!e.width&&!e.x&&!e.y?{x:+z_(t,["x","cx","x1"])||0,y:+z_(t,["y","cy","y1"])||0,width:0,height:0}:e},$_=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&J_(t))},fr=function(t,e){if(e){var n=t.style,i;e in Ls&&e!==fi&&(e=We),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(ap,"-$1").toLowerCase())):n.removeAttribute(e)}},ur=function(t,e,n,i,r,o){var a=new Qn(t._pt,e,n,0,1,o?X_:W_);return t._pt=a,a.b=i,a.e=r,t._props.push(n),a},k_={deg:1,rad:1,turn:1},Pw={grid:1,flex:1},dr=function s(t,e,n,i){var r=parseFloat(n)||0,o=(n+"").trim().substr((r+"").length)||"px",a=$r.style,l=gw.test(e),c=t.tagName.toLowerCase()==="svg",h=(c?"client":"offset")+(l?"Width":"Height"),d=100,u=i==="px",f=i==="%",m,x,p,g;if(i===o||!r||k_[i]||k_[o])return r;if(o!=="px"&&!u&&(r=s(t,e,n,"px")),g=t.getCTM&&$_(t),(f||o==="%")&&(Ls[e]||~e.indexOf("adius")))return m=g?t.getBBox()[l?"width":"height"]:t[h],Je(f?r/m*d:r/100*m);if(a[l?"width":"height"]=d+(u?o:i),x=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,g&&(x=(t.ownerSVGElement||{}).parentNode),(!x||x===hr||!x.appendChild)&&(x=hr.body),p=x._gsap,p&&f&&p.width&&l&&p.time===ci.time&&!p.uncache)return Je(r/p.width*d);if(f&&(e==="height"||e==="width")){var v=t.style[e];t.style[e]=d+i,m=t[h],v?t.style[e]=v:fr(t,e)}else(f||o==="%")&&!Pw[Ti(x,"display")]&&(a.position=Ti(t,"position")),x===t&&(a.position="static"),x.appendChild($r),m=$r[h],x.removeChild($r),a.position="absolute";return l&&f&&(p=ar(x),p.time=ci.time,p.width=x[h]),Je(u?m*r/d:m&&r?d/m*r:0)},Is=function(t,e,n,i){var r;return rp||ip(),e in hs&&e!=="transform"&&(e=hs[e],~e.indexOf(",")&&(e=e.split(",")[0])),Ls[e]&&e!=="transform"?(r=Il(t,i),r=e!=="transformOrigin"?r[e]:r.svg?r.origin:_u(Ti(t,fi))+" "+r.zOrigin+"px"):(r=t.style[e],(!r||r==="auto"||i||~(r+"").indexOf("calc("))&&(r=gu[e]&&gu[e](t,e,n)||Ti(t,e)||Gd(t,e)||(e==="opacity"?1:0))),n&&!~(r+"").trim().indexOf(" ")?dr(t,e,r,n)+n:r},Iw=function(t,e,n,i){if(!n||n==="none"){var r=aa(e,t,1),o=r&&Ti(t,r,1);o&&o!==n?(e=r,n=o):e==="borderColor"&&(n=Ti(t,"borderTopColor"))}var a=new Qn(this._pt,t.style,e,0,1,$d),l=0,c=0,h,d,u,f,m,x,p,g,v,S,y,b;if(a.b=n,a.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=Ti(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(x=t.style[e],t.style[e]=i,i=Ti(t,e)||i,x?t.style[e]=x:fr(t,e)),h=[n,i],Wd(h),n=h[0],i=h[1],u=n.match(Wr)||[],b=i.match(Wr)||[],b.length){for(;d=Wr.exec(i);)p=d[0],v=i.substring(l,d.index),m?m=(m+1)%5:(v.substr(-5)==="rgba("||v.substr(-5)==="hsla(")&&(m=1),p!==(x=u[c++]||"")&&(f=parseFloat(x)||0,y=x.substr((f+"").length),p.charAt(1)==="="&&(p=Xr(f,p)+y),g=parseFloat(p),S=p.substr((g+"").length),l=Wr.lastIndex-S.length,S||(S=S||ui.units[e]||y,l===i.length&&(i+=S,a.e+=S)),y!==S&&(f=dr(t,e,x,S)||0),a._pt={_next:a._pt,p:v||c===1?v:",",s:f,c:g-f,m:m&&m<4||e==="zIndex"?Math.round:0});a.c=l<i.length?i.substring(l,i.length):""}else a.r=e==="display"&&i==="none"?X_:W_;return Od.test(i)&&(a.e=0),this._pt=a,a},H_={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Lw=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=H_[n]||n,e[1]=H_[i]||i,e.join(" ")},Dw=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,r=e.u,o=n._gsap,a,l,c;if(r==="all"||r===!0)i.cssText="",l=1;else for(r=r.split(","),c=r.length;--c>-1;)a=r[c],Ls[a]&&(l=1,a=a==="transformOrigin"?fi:We),fr(n,a);l&&(fr(n,We),o&&(o.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",Il(n,1),o.uncache=1,Y_(i)))}},gu={clearProps:function(t,e,n,i,r){if(r.data!=="isFromStart"){var o=t._pt=new Qn(t._pt,e,n,0,0,Dw);return o.u=i,o.pr=-10,o.tween=r,t._props.push(n),1}}},Pl=[1,0,0,1,0,0],K_={},Q_=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},G_=function(t){var e=Ti(t,We);return Q_(e)?Pl:e.substr(7).match(Fd).map(Je)},lp=function(t,e){var n=t._gsap||ar(t),i=t.style,r=G_(t),o,a,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?Pl:r):(r===Pl&&!t.offsetParent&&t!==ra&&!n.svg&&(l=i.display,i.display="block",o=t.parentNode,(!o||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,a=t.nextElementSibling,ra.appendChild(t)),r=G_(t),l?i.display=l:fr(t,"display"),c&&(a?o.insertBefore(t,a):o?o.appendChild(t):ra.removeChild(t))),e&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},sp=function(t,e,n,i,r,o){var a=t._gsap,l=r||lp(t,!0),c=a.xOrigin||0,h=a.yOrigin||0,d=a.xOffset||0,u=a.yOffset||0,f=l[0],m=l[1],x=l[2],p=l[3],g=l[4],v=l[5],S=e.split(" "),y=parseFloat(S[0])||0,b=parseFloat(S[1])||0,T,_,M,R;n?l!==Pl&&(_=f*p-m*x)&&(M=y*(p/_)+b*(-x/_)+(x*v-p*g)/_,R=y*(-m/_)+b*(f/_)-(f*v-m*g)/_,y=M,b=R):(T=J_(t),y=T.x+(~S[0].indexOf("%")?y/100*T.width:y),b=T.y+(~(S[1]||S[0]).indexOf("%")?b/100*T.height:b)),i||i!==!1&&a.smooth?(g=y-c,v=b-h,a.xOffset=d+(g*f+v*x)-g,a.yOffset=u+(g*m+v*p)-v):a.xOffset=a.yOffset=0,a.xOrigin=y,a.yOrigin=b,a.smooth=!!i,a.origin=e,a.originIsAbsolute=!!n,t.style[fi]="0px 0px",o&&(ur(o,a,"xOrigin",c,y),ur(o,a,"yOrigin",h,b),ur(o,a,"xOffset",d,a.xOffset),ur(o,a,"yOffset",u,a.yOffset)),t.setAttribute("data-svg-origin",y+" "+b)},Il=function(t,e){var n=t._gsap||new Xd(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,r=n.scaleX<0,o="px",a="deg",l=getComputedStyle(t),c=Ti(t,fi)||"0",h,d,u,f,m,x,p,g,v,S,y,b,T,_,M,R,A,D,L,F,P,B,k,O,Q,W,I,nt,_t,Et,Z,ht;return h=d=u=x=p=g=v=S=y=0,f=m=1,n.svg=!!(t.getCTM&&$_(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[We]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[We]!=="none"?l[We]:"")),i.scale=i.rotate=i.translate="none"),_=lp(t,n.svg),n.svg&&(n.uncache?(Q=t.getBBox(),c=n.xOrigin-Q.x+"px "+(n.yOrigin-Q.y)+"px",O=""):O=!e&&t.getAttribute("data-svg-origin"),sp(t,O||c,!!O||n.originIsAbsolute,n.smooth!==!1,_)),b=n.xOrigin||0,T=n.yOrigin||0,_!==Pl&&(D=_[0],L=_[1],F=_[2],P=_[3],h=B=_[4],d=k=_[5],_.length===6?(f=Math.sqrt(D*D+L*L),m=Math.sqrt(P*P+F*F),x=D||L?sa(L,D)*Jr:0,v=F||P?sa(F,P)*Jr+x:0,v&&(m*=Math.abs(Math.cos(v*oa))),n.svg&&(h-=b-(b*D+T*F),d-=T-(b*L+T*P))):(ht=_[6],Et=_[7],I=_[8],nt=_[9],_t=_[10],Z=_[11],h=_[12],d=_[13],u=_[14],M=sa(ht,_t),p=M*Jr,M&&(R=Math.cos(-M),A=Math.sin(-M),O=B*R+I*A,Q=k*R+nt*A,W=ht*R+_t*A,I=B*-A+I*R,nt=k*-A+nt*R,_t=ht*-A+_t*R,Z=Et*-A+Z*R,B=O,k=Q,ht=W),M=sa(-F,_t),g=M*Jr,M&&(R=Math.cos(-M),A=Math.sin(-M),O=D*R-I*A,Q=L*R-nt*A,W=F*R-_t*A,Z=P*A+Z*R,D=O,L=Q,F=W),M=sa(L,D),x=M*Jr,M&&(R=Math.cos(M),A=Math.sin(M),O=D*R+L*A,Q=B*R+k*A,L=L*R-D*A,k=k*R-B*A,D=O,B=Q),p&&Math.abs(p)+Math.abs(x)>359.9&&(p=x=0,g=180-g),f=Je(Math.sqrt(D*D+L*L+F*F)),m=Je(Math.sqrt(k*k+ht*ht)),M=sa(B,k),v=Math.abs(M)>2e-4?M*Jr:0,y=Z?1/(Z<0?-Z:Z):0),n.svg&&(O=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!Q_(Ti(t,We)),O&&t.setAttribute("transform",O))),Math.abs(v)>90&&Math.abs(v)<270&&(r?(f*=-1,v+=x<=0?180:-180,x+=x<=0?180:-180):(m*=-1,v+=v<=0?180:-180)),e=e||n.uncache,n.x=h-((n.xPercent=h&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-h)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+o,n.y=d-((n.yPercent=d&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-d)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+o,n.z=u+o,n.scaleX=Je(f),n.scaleY=Je(m),n.rotation=Je(x)+a,n.rotationX=Je(p)+a,n.rotationY=Je(g)+a,n.skewX=v+a,n.skewY=S+a,n.transformPerspective=y+o,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[fi]=_u(c)),n.xOffset=n.yOffset=0,n.force3D=ui.force3D,n.renderTransform=n.svg?Uw:Z_?j_:Nw,n.uncache=0,n},_u=function(t){return(t=t.split(" "))[0]+" "+t[1]},tp=function(t,e,n){var i=An(e);return Je(parseFloat(e)+parseFloat(dr(t,"x",n+"px",i)))+i},Nw=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,j_(t,e)},qr="0deg",Cl="0px",Zr=") ",j_=function(t,e){var n=e||this,i=n.xPercent,r=n.yPercent,o=n.x,a=n.y,l=n.z,c=n.rotation,h=n.rotationY,d=n.rotationX,u=n.skewX,f=n.skewY,m=n.scaleX,x=n.scaleY,p=n.transformPerspective,g=n.force3D,v=n.target,S=n.zOrigin,y="",b=g==="auto"&&t&&t!==1||g===!0;if(S&&(d!==qr||h!==qr)){var T=parseFloat(h)*oa,_=Math.sin(T),M=Math.cos(T),R;T=parseFloat(d)*oa,R=Math.cos(T),o=tp(v,o,_*R*-S),a=tp(v,a,-Math.sin(T)*-S),l=tp(v,l,M*R*-S+S)}p!==Cl&&(y+="perspective("+p+Zr),(i||r)&&(y+="translate("+i+"%, "+r+"%) "),(b||o!==Cl||a!==Cl||l!==Cl)&&(y+=l!==Cl||b?"translate3d("+o+", "+a+", "+l+") ":"translate("+o+", "+a+Zr),c!==qr&&(y+="rotate("+c+Zr),h!==qr&&(y+="rotateY("+h+Zr),d!==qr&&(y+="rotateX("+d+Zr),(u!==qr||f!==qr)&&(y+="skew("+u+", "+f+Zr),(m!==1||x!==1)&&(y+="scale("+m+", "+x+Zr),v.style[We]=y||"translate(0, 0)"},Uw=function(t,e){var n=e||this,i=n.xPercent,r=n.yPercent,o=n.x,a=n.y,l=n.rotation,c=n.skewX,h=n.skewY,d=n.scaleX,u=n.scaleY,f=n.target,m=n.xOrigin,x=n.yOrigin,p=n.xOffset,g=n.yOffset,v=n.forceCSS,S=parseFloat(o),y=parseFloat(a),b,T,_,M,R;l=parseFloat(l),c=parseFloat(c),h=parseFloat(h),h&&(h=parseFloat(h),c+=h,l+=h),l||c?(l*=oa,c*=oa,b=Math.cos(l)*d,T=Math.sin(l)*d,_=Math.sin(l-c)*-u,M=Math.cos(l-c)*u,c&&(h*=oa,R=Math.tan(c-h),R=Math.sqrt(1+R*R),_*=R,M*=R,h&&(R=Math.tan(h),R=Math.sqrt(1+R*R),b*=R,T*=R)),b=Je(b),T=Je(T),_=Je(_),M=Je(M)):(b=d,M=u,T=_=0),(S&&!~(o+"").indexOf("px")||y&&!~(a+"").indexOf("px"))&&(S=dr(f,"x",o,"px"),y=dr(f,"y",a,"px")),(m||x||p||g)&&(S=Je(S+m-(m*b+x*_)+p),y=Je(y+x-(m*T+x*M)+g)),(i||r)&&(R=f.getBBox(),S=Je(S+i/100*R.width),y=Je(y+r/100*R.height)),R="matrix("+b+","+T+","+_+","+M+","+S+","+y+")",f.setAttribute("transform",R),v&&(f.style[We]=R)},Fw=function(t,e,n,i,r){var o=360,a=gn(r),l=parseFloat(r)*(a&&~r.indexOf("rad")?Jr:1),c=l-i,h=i+c+"deg",d,u;return a&&(d=r.split("_")[1],d==="short"&&(c%=o,c!==c%(o/2)&&(c+=c<0?o:-o)),d==="cw"&&c<0?c=(c+o*F_)%o-~~(c/o)*o:d==="ccw"&&c>0&&(c=(c-o*F_)%o-~~(c/o)*o)),t._pt=u=new Qn(t._pt,e,n,i,c,xw),u.e=h,u.u="deg",t._props.push(n),u},V_=function(t,e){for(var n in e)t[n]=e[n];return t},Ow=function(t,e,n){var i=V_({},n._gsap),r="perspective,force3D,transformOrigin,svgOrigin",o=n.style,a,l,c,h,d,u,f,m;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),o[We]=e,a=Il(n,1),fr(n,We),n.setAttribute("transform",c)):(c=getComputedStyle(n)[We],o[We]=e,a=Il(n,1),o[We]=c);for(l in Ls)c=i[l],h=a[l],c!==h&&r.indexOf(l)<0&&(f=An(c),m=An(h),d=f!==m?dr(n,l,c,m):parseFloat(c),u=parseFloat(h),t._pt=new Qn(t._pt,a,l,d,u-d,ep),t._pt.u=m||0,t._props.push(l));V_(a,i)};Kn("padding,margin,Width,Radius",function(s,t){var e="Top",n="Right",i="Bottom",r="Left",o=(t<3?[e,n,i,r]:[e+r,e+n,i+n,i+r]).map(function(a){return t<2?s+a:"border"+a+s});gu[t>1?"border"+s:s]=function(a,l,c,h,d){var u,f;if(arguments.length<4)return u=o.map(function(m){return Is(a,m,c)}),f=u.join(" "),f.split(u[0]).length===5?u[0]:f;u=(h+"").split(" "),f={},o.forEach(function(m,x){return f[m]=u[x]=u[x]||u[(x-1)/2|0]}),a.init(l,f,d)}});cp={name:"css",register:ip,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,r){var o=this._props,a=t.style,l=n.vars.startAt,c,h,d,u,f,m,x,p,g,v,S,y,b,T,_,M,R;rp||ip(),this.styles=this.styles||q_(t),M=this.styles.props,this.tween=n;for(x in e)if(x!=="autoRound"&&(h=e[x],!(li[x]&&qd(x,e,n,i,t,r)))){if(f=typeof h,m=gu[x],f==="function"&&(h=h.call(n,i,t,r),f=typeof h),f==="string"&&~h.indexOf("random(")&&(h=ia(h)),m)m(this,t,x,h,n)&&(_=1);else if(x.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(x)+"").trim(),h+="",Cs.lastIndex=0,Cs.test(c)||(p=An(c),g=An(h),g?p!==g&&(c=dr(t,x,c,g)+g):p&&(h+=p)),this.add(a,"setProperty",c,h,i,r,0,0,x),o.push(x),M.push(x,0,a[x]);else if(f!=="undefined"){if(l&&x in l?(c=typeof l[x]=="function"?l[x].call(n,i,t,r):l[x],gn(c)&&~c.indexOf("random(")&&(c=ia(c)),An(c+"")||c==="auto"||(c+=ui.units[x]||An(Is(t,x))||""),(c+"").charAt(1)==="="&&(c=Is(t,x))):c=Is(t,x),u=parseFloat(c),v=f==="string"&&h.charAt(1)==="="&&h.substr(0,2),v&&(h=h.substr(2)),d=parseFloat(h),x in hs&&(x==="autoAlpha"&&(u===1&&Is(t,"visibility")==="hidden"&&d&&(u=0),M.push("visibility",0,a.visibility),ur(this,a,"visibility",u?"inherit":"hidden",d?"inherit":"hidden",!d)),x!=="scale"&&x!=="transform"&&(x=hs[x],~x.indexOf(",")&&(x=x.split(",")[0]))),S=x in Ls,S){if(this.styles.save(x),R=h,f==="string"&&h.substring(0,6)==="var(--"){if(h=Ti(t,h.substring(4,h.indexOf(")"))),h.substring(0,5)==="calc("){var A=t.style.perspective;t.style.perspective=h,h=Ti(t,"perspective"),A?t.style.perspective=A:fr(t,"perspective")}d=parseFloat(h)}if(y||(b=t._gsap,b.renderTransform&&!e.parseTransform||Il(t,e.parseTransform),T=e.smoothOrigin!==!1&&b.smooth,y=this._pt=new Qn(this._pt,a,We,0,1,b.renderTransform,b,0,-1),y.dep=1),x==="scale")this._pt=new Qn(this._pt,b,"scaleY",b.scaleY,(v?Xr(b.scaleY,v+d):d)-b.scaleY||0,ep),this._pt.u=0,o.push("scaleY",x),x+="X";else if(x==="transformOrigin"){M.push(fi,0,a[fi]),h=Lw(h),b.svg?sp(t,h,0,T,0,this):(g=parseFloat(h.split(" ")[2])||0,g!==b.zOrigin&&ur(this,b,"zOrigin",b.zOrigin,g),ur(this,a,x,_u(c),_u(h)));continue}else if(x==="svgOrigin"){sp(t,h,1,T,0,this);continue}else if(x in K_){Fw(this,b,x,u,v?Xr(u,v+h):h);continue}else if(x==="smoothOrigin"){ur(this,b,"smooth",b.smooth,h);continue}else if(x==="force3D"){b[x]=h;continue}else if(x==="transform"){Ow(this,h,t);continue}}else x in a||(x=aa(x)||x);if(S||(d||d===0)&&(u||u===0)&&!_w.test(h)&&x in a)p=(c+"").substr((u+"").length),d||(d=0),g=An(h)||(x in ui.units?ui.units[x]:p),p!==g&&(u=dr(t,x,c,g)),this._pt=new Qn(this._pt,S?b:a,x,u,(v?Xr(u,v+d):d)-u,!S&&(g==="px"||x==="zIndex")&&e.autoRound!==!1?Mw:ep),this._pt.u=g||0,S&&R!==h?(this._pt.b=c,this._pt.e=R,this._pt.r=yw):p!==g&&g!=="%"&&(this._pt.b=c,this._pt.r=vw);else if(x in a)Iw.call(this,t,x,c,v?v+h:h);else if(x in t)this.add(t,x,c||t[x],v?v+h:h,i,r);else if(x!=="parseTransform"){uu(x,h);continue}S||(x in a?M.push(x,0,a[x]):typeof t[x]=="function"?M.push(x,2,t[x]()):M.push(x,1,c||t[x])),o.push(x)}}_&&Qd(this)},render:function(t,e){if(e.tween._time||!op())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:Is,aliases:hs,getSetter:function(t,e,n){var i=hs[e];return i&&i.indexOf(",")<0&&(e=i),e in Ls&&e!==fi&&(t._gsap.x||Is(t,"x"))?n&&U_===n?e==="scale"?ww:Tw:(U_=n||{})&&(e==="scale"?Ew:Aw):t.style&&!hu(t.style[e])?Sw:~e.indexOf("-")?bw:mu(t,e)},core:{_removeProperty:fr,_getMatrix:lp}};zn.utils.checkPrefix=aa;zn.core.getStyleSaver=q_;(function(s,t,e,n){var i=Kn(s+","+t+","+e,function(r){Ls[r]=1});Kn(t,function(r){ui.units[r]="deg",K_[r]=1}),hs[i[13]]=s+","+t,Kn(n,function(r){var o=r.split(":");hs[o[1]]=i[o[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");Kn("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(s){ui.units[s]="px"});zn.registerPlugin(cp)});var la,VC,e0=on(()=>{jd();t0();la=zn.registerPlugin(cp)||zn,VC=la.core.Tween});function n0(s,t){for(var e=0;e<t.length;e++){var n=t[e];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(s,n.key,n)}}function Bw(s,t,e){return t&&n0(s.prototype,t),e&&n0(s,e),s}var Rn,yu,zw,di,pr,mr,ha,s0,Kr,ua,r0,Ds,Ji,o0,a0,l0,ca,Qt,$i,Dl,hp,kw,Us,Nl,ti,jn,xu,vu,up,Mu,kn,cn,ei,Hw,Ns,Su,Ll,i0,c0,h0,$e,u0=on(()=>{a0=function(){return Rn||typeof window<"u"&&(Rn=window.gsap)&&Rn.registerPlugin&&Rn},l0=1,ca=[],Qt=[],$i=[],Dl=Date.now,hp=function(t,e){return e},kw=function(){var t=ua.core,e=t.bridge||{},n=t._scrollers,i=t._proxies;n.push.apply(n,Qt),i.push.apply(i,$i),Qt=n,$i=i,hp=function(o,a){return e[o](a)}},Us=function(t,e){return~$i.indexOf(t)&&$i[$i.indexOf(t)+1][e]},Nl=function(t){return!!~r0.indexOf(t)},ti=function(t,e,n,i,r){return t.addEventListener(e,n,{passive:i!==!1,capture:!!r})},jn=function(t,e,n,i){return t.removeEventListener(e,n,!!i)},xu="scrollLeft",vu="scrollTop",up=function(){return Ds&&Ds.isPressed||Qt.cache++},Mu=function(t,e){var n=function i(r){if(r||r===0){l0&&di.history.scrollRestoration!=="manual"&&(di.history.scrollRestoration="manual");var o=Ds&&Ds.isPressed;r=i.v=Math.round(r)||(Ds&&Ds.iOS?1:0),t(r),i.cacheID=Qt.cache,o&&hp("ss",r)}else(e||Qt.cache!==i.cacheID||hp("ref"))&&(i.cacheID=Qt.cache,i.v=t());return i.v+i.offset};return n.offset=0,t&&n},kn={s:xu,p:"left",p2:"Left",os:"right",os2:"Right",d:"width",d2:"Width",a:"x",sc:Mu(function(s){return arguments.length?di.scrollTo(s,cn.sc()):di.pageXOffset||pr[xu]||mr[xu]||ha[xu]||0})},cn={s:vu,p:"top",p2:"Top",os:"bottom",os2:"Bottom",d:"height",d2:"Height",a:"y",op:kn,sc:Mu(function(s){return arguments.length?di.scrollTo(kn.sc(),s):di.pageYOffset||pr[vu]||mr[vu]||ha[vu]||0})},ei=function(t,e){return(e&&e._ctx&&e._ctx.selector||Rn.utils.toArray)(t)[0]||(typeof t=="string"&&Rn.config().nullTargetWarn!==!1?console.warn("Element not found:",t):null)},Hw=function(t,e){for(var n=e.length;n--;)if(e[n]===t||e[n].contains(t))return!0;return!1},Ns=function(t,e){var n=e.s,i=e.sc;Nl(t)&&(t=pr.scrollingElement||mr);var r=Qt.indexOf(t),o=i===cn.sc?1:2;!~r&&(r=Qt.push(t)-1),Qt[r+o]||ti(t,"scroll",up);var a=Qt[r+o],l=a||(Qt[r+o]=Mu(Us(t,n),!0)||(Nl(t)?i:Mu(function(c){return arguments.length?t[n]=c:t[n]})));return l.target=t,a||(l.smooth=Rn.getProperty(t,"scrollBehavior")==="smooth"),l},Su=function(t,e,n){var i=t,r=t,o=Dl(),a=o,l=e||50,c=Math.max(500,l*3),h=function(m,x){var p=Dl();x||p-o>l?(r=i,i=m,a=o,o=p):n?i+=m:i=r+(m-r)/(p-a)*(o-a)},d=function(){r=i=n?0:i,a=o=0},u=function(m){var x=a,p=r,g=Dl();return(m||m===0)&&m!==i&&h(m),o===a||g-a>c?0:(i+(n?p:-p))/((n?g:o)-x)*1e3};return{update:h,reset:d,getVelocity:u}},Ll=function(t,e){return e&&!t._gsapAllow&&t.cancelable!==!1&&t.preventDefault(),t.changedTouches?t.changedTouches[0]:t},i0=function(t){var e=Math.max.apply(Math,t),n=Math.min.apply(Math,t);return Math.abs(e)>=Math.abs(n)?e:n},c0=function(){ua=Rn.core.globals().ScrollTrigger,ua&&ua.core&&kw()},h0=function(t){return Rn=t||a0(),!yu&&Rn&&typeof document<"u"&&document.body&&(di=window,pr=document,mr=pr.documentElement,ha=pr.body,r0=[di,pr,mr,ha],zw=Rn.utils.clamp,o0=Rn.core.context||function(){},Kr="onpointerenter"in ha?"pointer":"mouse",s0=$e.isTouch=di.matchMedia&&di.matchMedia("(hover: none), (pointer: coarse)").matches?1:"ontouchstart"in di||navigator.maxTouchPoints>0||navigator.msMaxTouchPoints>0?2:0,Ji=$e.eventTypes=("ontouchstart"in mr?"touchstart,touchmove,touchcancel,touchend":"onpointerdown"in mr?"pointerdown,pointermove,pointercancel,pointerup":"mousedown,mousemove,mouseup,mouseup").split(","),setTimeout(function(){return l0=0},500),yu=1),ua||c0(),yu};kn.op=cn;Qt.cache=0;$e=(function(){function s(e){this.init(e)}var t=s.prototype;return t.init=function(n){yu||h0(Rn)||console.warn("Please gsap.registerPlugin(Observer)"),ua||c0();var i=n.tolerance,r=n.dragMinimum,o=n.type,a=n.target,l=n.lineHeight,c=n.debounce,h=n.preventDefault,d=n.onStop,u=n.onStopDelay,f=n.ignore,m=n.wheelSpeed,x=n.event,p=n.onDragStart,g=n.onDragEnd,v=n.onDrag,S=n.onPress,y=n.onRelease,b=n.onRight,T=n.onLeft,_=n.onUp,M=n.onDown,R=n.onChangeX,A=n.onChangeY,D=n.onChange,L=n.onToggleX,F=n.onToggleY,P=n.onHover,B=n.onHoverEnd,k=n.onMove,O=n.ignoreCheck,Q=n.isNormalizer,W=n.onGestureStart,I=n.onGestureEnd,nt=n.onWheel,_t=n.onEnable,Et=n.onDisable,Z=n.onClick,ht=n.scrollSpeed,Mt=n.capture,bt=n.allowClicks,mt=n.lockAxis,Nt=n.onLockAxis;this.target=a=ei(a)||mr,this.vars=n,f&&(f=Rn.utils.toArray(f)),i=i||1e-9,r=r||0,m=m||1,ht=ht||1,o=o||"wheel,touch,pointer",c=c!==!1,l||(l=parseFloat(di.getComputedStyle(ha).lineHeight)||22);var Me,At,Yt,Lt,Bt,de,he,J=this,se=0,en=0,Ee=n.passive||!h&&n.passive!==!1,le=Ns(a,kn),Xe=Ns(a,cn),Ke=le(),z=Xe(),ge=~o.indexOf("touch")&&!~o.indexOf("pointer")&&Ji[0]==="pointerdown",ue=Nl(a),Wt=a.ownerDocument||pr,ut=[0,0,0],pe=[0,0,0],Dt=0,Gt=function(){return Dt=Dl()},C=function(pt,st){return(J.event=pt)&&f&&Hw(pt.target,f)||st&&ge&&pt.pointerType!=="touch"||O&&O(pt,st)},w=function(){J._vx.reset(),J._vy.reset(),At.pause(),d&&d(J)},V=function(){var pt=J.deltaX=i0(ut),st=J.deltaY=i0(pe),tt=Math.abs(pt)>=i,xt=Math.abs(st)>=i;D&&(tt||xt)&&D(J,pt,st,ut,pe),tt&&(b&&J.deltaX>0&&b(J),T&&J.deltaX<0&&T(J),R&&R(J),L&&J.deltaX<0!=se<0&&L(J),se=J.deltaX,ut[0]=ut[1]=ut[2]=0),xt&&(M&&J.deltaY>0&&M(J),_&&J.deltaY<0&&_(J),A&&A(J),F&&J.deltaY<0!=en<0&&F(J),en=J.deltaY,pe[0]=pe[1]=pe[2]=0),(Lt||Yt)&&(k&&k(J),Yt&&(p&&Yt===1&&p(J),v&&v(J),Yt=0),Lt=!1),de&&!(de=!1)&&Nt&&Nt(J),Bt&&(nt(J),Bt=!1),Me=0},rt=function(pt,st,tt){ut[tt]+=pt,pe[tt]+=st,J._vx.update(pt),J._vy.update(st),c?Me||(Me=requestAnimationFrame(V)):V()},it=function(pt,st){mt&&!he&&(J.axis=he=Math.abs(pt)>Math.abs(st)?"x":"y",de=!0),he!=="y"&&(ut[2]+=pt,J._vx.update(pt,!0)),he!=="x"&&(pe[2]+=st,J._vy.update(st,!0)),c?Me||(Me=requestAnimationFrame(V)):V()},ct=function(pt){if(!C(pt,1)){pt=Ll(pt,h);var st=pt.clientX,tt=pt.clientY,xt=st-J.x,et=tt-J.y,Tt=J.isDragging;J.x=st,J.y=tt,(Tt||(xt||et)&&(Math.abs(J.startX-st)>=r||Math.abs(J.startY-tt)>=r))&&(Yt||(Yt=Tt?2:1),Tt||(J.isDragging=!0),it(xt,et))}},gt=J.onPress=function(ot){C(ot,1)||ot&&ot.button||(J.axis=he=null,At.pause(),J.isPressed=!0,ot=Ll(ot),se=en=0,J.startX=J.x=ot.clientX,J.startY=J.y=ot.clientY,J._vx.reset(),J._vy.reset(),ti(Q?a:Wt,Ji[1],ct,Ee,!0),J.deltaX=J.deltaY=0,S&&S(J))},X=J.onRelease=function(ot){if(!C(ot,1)){jn(Q?a:Wt,Ji[1],ct,!0);var pt=!isNaN(J.y-J.startY),st=J.isDragging,tt=st&&(Math.abs(J.x-J.startX)>3||Math.abs(J.y-J.startY)>3),xt=Ll(ot);!tt&&pt&&(J._vx.reset(),J._vy.reset(),h&&bt&&Rn.delayedCall(.08,function(){if(Dl()-Dt>300&&!ot.defaultPrevented){if(ot.target.click)ot.target.click();else if(Wt.createEvent){var et=Wt.createEvent("MouseEvents");et.initMouseEvent("click",!0,!0,di,1,xt.screenX,xt.screenY,xt.clientX,xt.clientY,!1,!1,!1,!1,0,null),ot.target.dispatchEvent(et)}}})),J.isDragging=J.isGesturing=J.isPressed=!1,d&&st&&!Q&&At.restart(!0),Yt&&V(),g&&st&&g(J),y&&y(J,tt)}},j=function(pt){return pt.touches&&pt.touches.length>1&&(J.isGesturing=!0)&&W(pt,J.isDragging)},lt=function(){return(J.isGesturing=!1)||I(J)},N=function(pt){if(!C(pt)){var st=le(),tt=Xe();rt((st-Ke)*ht,(tt-z)*ht,1),Ke=st,z=tt,d&&At.restart(!0)}},K=function(pt){if(!C(pt)){pt=Ll(pt,h),nt&&(Bt=!0);var st=(pt.deltaMode===1?l:pt.deltaMode===2?di.innerHeight:1)*m;rt(pt.deltaX*st,pt.deltaY*st,0),d&&!Q&&At.restart(!0)}},$=function(pt){if(!C(pt)){var st=pt.clientX,tt=pt.clientY,xt=st-J.x,et=tt-J.y;J.x=st,J.y=tt,Lt=!0,d&&At.restart(!0),(xt||et)&&it(xt,et)}},ft=function(pt){J.event=pt,P(J)},at=function(pt){J.event=pt,B(J)},dt=function(pt){return C(pt)||Ll(pt,h)&&Z(J)};At=J._dc=Rn.delayedCall(u||.25,w).pause(),J.deltaX=J.deltaY=0,J._vx=Su(0,50,!0),J._vy=Su(0,50,!0),J.scrollX=le,J.scrollY=Xe,J.isDragging=J.isGesturing=J.isPressed=!1,o0(this),J.enable=function(ot){return J.isEnabled||(ti(ue?Wt:a,"scroll",up),o.indexOf("scroll")>=0&&ti(ue?Wt:a,"scroll",N,Ee,Mt),o.indexOf("wheel")>=0&&ti(a,"wheel",K,Ee,Mt),(o.indexOf("touch")>=0&&s0||o.indexOf("pointer")>=0)&&(ti(a,Ji[0],gt,Ee,Mt),ti(Wt,Ji[2],X),ti(Wt,Ji[3],X),bt&&ti(a,"click",Gt,!0,!0),Z&&ti(a,"click",dt),W&&ti(Wt,"gesturestart",j),I&&ti(Wt,"gestureend",lt),P&&ti(a,Kr+"enter",ft),B&&ti(a,Kr+"leave",at),k&&ti(a,Kr+"move",$)),J.isEnabled=!0,J.isDragging=J.isGesturing=J.isPressed=Lt=Yt=!1,J._vx.reset(),J._vy.reset(),Ke=le(),z=Xe(),ot&&ot.type&&gt(ot),_t&&_t(J)),J},J.disable=function(){J.isEnabled&&(ca.filter(function(ot){return ot!==J&&Nl(ot.target)}).length||jn(ue?Wt:a,"scroll",up),J.isPressed&&(J._vx.reset(),J._vy.reset(),jn(Q?a:Wt,Ji[1],ct,!0)),jn(ue?Wt:a,"scroll",N,Mt),jn(a,"wheel",K,Mt),jn(a,Ji[0],gt,Mt),jn(Wt,Ji[2],X),jn(Wt,Ji[3],X),jn(a,"click",Gt,!0),jn(a,"click",dt),jn(Wt,"gesturestart",j),jn(Wt,"gestureend",lt),jn(a,Kr+"enter",ft),jn(a,Kr+"leave",at),jn(a,Kr+"move",$),J.isEnabled=J.isPressed=J.isDragging=!1,Et&&Et(J))},J.kill=J.revert=function(){J.disable();var ot=ca.indexOf(J);ot>=0&&ca.splice(ot,1),Ds===J&&(Ds=0)},ca.push(J),Q&&Nl(a)&&(Ds=J),J.enable(x)},Bw(s,[{key:"velocityX",get:function(){return this._vx.getVelocity()}},{key:"velocityY",get:function(){return this._vy.getVelocity()}}]),s})();$e.version="3.15.1";$e.create=function(s){return new $e(s)};$e.register=h0;$e.getAll=function(){return ca.slice()};$e.getById=function(s){return ca.filter(function(t){return t.vars.id===s})[0]};a0()&&Rn.registerPlugin($e)});var Rt,ma,ee,Se,Ai,ye,wp,Bu,ql,Hl,Fl,bu,Hn,Hu,xp,ii,f0,d0,ga,C0,fp,P0,ni,vp,I0,L0,gr,yp,Ep,_a,Ap,_r,Mp,dp,Tu,Gn,pp,zi,Ol,p0,m0,Gw,g0,_0,us,Bl,D0,N0,io,U0,F0,Vw,Ww,fs,wu,Ei,Vn,zl,Qr,Ul,fa,da,O0,B0,Rp,Cp,to,eo,Gl,Vl,Wl,Xl,hn,Oi,va,Pp,_n,Bi,Xw,x0,Fs,zu,z0,Yw,Ip,qw,Eu,Sn,Mn,Au,v0,Ru,ku,Du,Cu,Nu,te,Sp,Zl,y0,pa,mp,kl,so,Zw,k0,ro,wi,H0,G0,Lp,V0,si,no,M0,Jw,W0,S0,jr,bp,Uu,Yl,Os,Tp,Fu,$w,gp,Kw,xa,Pu,Qw,Ou,b0,jw,T0,X0,Iu,w0,$t,E0,_p,Lu,tE,Y0,eE,A0,R0,nE,q0=on(()=>{u0();Tu=1,Gn=Date.now,pp=Gn(),zi=0,Ol=0,p0=function(t,e,n){var i=Ei(t)&&(t.substr(0,6)==="clamp("||t.indexOf("max")>-1);return n["_"+e+"Clamp"]=i,i?t.substr(6,t.length-7):t},m0=function(t,e){return e&&(!Ei(t)||t.substr(0,6)!=="clamp(")?"clamp("+t+")":t},Gw=function s(){return Ol&&requestAnimationFrame(s)},g0=function(){return Hu=1},_0=function(){return Hu=0},us=function(t){return t},Bl=function(t){return Math.round(t*1e5)/1e5||0},D0=function(){return typeof window<"u"},N0=function(){return Rt||D0()&&(Rt=window.gsap)&&Rt.registerPlugin&&Rt},io=function(t){return!!~wp.indexOf(t)},U0=function(t){return(t==="Height"?Ap:ee["inner"+t])||Ai["client"+t]||ye["client"+t]},F0=function(t){return Us(t,"getBoundingClientRect")||(io(t)?function(){return Ou.width=ee.innerWidth,Ou.height=Ap,Ou}:function(){return Fs(t)})},Vw=function(t,e,n){var i=n.d,r=n.d2,o=n.a;return(o=Us(t,"getBoundingClientRect"))?function(){return o()[i]}:function(){return(e?U0(r):t["client"+r])||0}},Ww=function(t,e){return!e||~$i.indexOf(t)?F0(t):function(){return Ou}},fs=function(t,e){var n=e.s,i=e.d2,r=e.d,o=e.a;return Math.max(0,(n="scroll"+i)&&(o=Us(t,n))?o()-F0(t)()[r]:io(t)?(Ai[n]||ye[n])-U0(i):t[n]-t["offset"+i])},wu=function(t,e){for(var n=0;n<ga.length;n+=3)(!e||~e.indexOf(ga[n+1]))&&t(ga[n],ga[n+1],ga[n+2])},Ei=function(t){return typeof t=="string"},Vn=function(t){return typeof t=="function"},zl=function(t){return typeof t=="number"},Qr=function(t){return typeof t=="object"},Ul=function(t,e,n){return t&&t.progress(e?0:1)&&n&&t.pause()},fa=function(t,e,n){if(t.enabled){var i=t._ctx?t._ctx.add(function(){return e(t,n)}):e(t,n);i&&i.totalTime&&(t.callbackAnimation=i)}},da=Math.abs,O0="left",B0="top",Rp="right",Cp="bottom",to="width",eo="height",Gl="Right",Vl="Left",Wl="Top",Xl="Bottom",hn="padding",Oi="margin",va="Width",Pp="Height",_n="px",Bi=function(t){return ee.getComputedStyle(t.nodeType===Node.DOCUMENT_NODE?t.scrollingElement:t)},Xw=function(t){var e=Bi(t).position;t.style.position=e==="absolute"||e==="fixed"?e:"relative"},x0=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},Fs=function(t,e){var n=e&&Bi(t)[xp]!=="matrix(1, 0, 0, 1, 0, 0)"&&Rt.to(t,{x:0,y:0,xPercent:0,yPercent:0,rotation:0,rotationX:0,rotationY:0,scale:1,skewX:0,skewY:0}).progress(1),i=t.getBoundingClientRect?t.getBoundingClientRect():t.scrollingElement.getBoundingClientRect();return n&&n.progress(0).kill(),i},zu=function(t,e){var n=e.d2;return t["offset"+n]||t["client"+n]||0},z0=function(t){var e=[],n=t.labels,i=t.duration(),r;for(r in n)e.push(n[r]/i);return e},Yw=function(t){return function(e){return Rt.utils.snap(z0(t),e)}},Ip=function(t){var e=Rt.utils.snap(t),n=Array.isArray(t)&&t.slice(0).sort(function(i,r){return i-r});return n?function(i,r,o){o===void 0&&(o=.001);var a;if(!r)return e(i);if(r>0){for(i-=o,a=0;a<n.length;a++)if(n[a]>=i)return n[a];return n[a-1]}else for(a=n.length,i+=o;a--;)if(n[a]<=i)return n[a];return n[0]}:function(i,r,o){o===void 0&&(o=.001);var a=e(i);return!r||Math.abs(a-i)<o||a-i<0==r<0?a:e(r<0?i-t:i+t)}},qw=function(t){return function(e,n){return Ip(z0(t))(e,n.direction)}},Eu=function(t,e,n,i){return n.split(",").forEach(function(r){return t(e,r,i)})},Sn=function(t,e,n,i,r){return t.addEventListener(e,n,{passive:!i,capture:!!r})},Mn=function(t,e,n,i){return t.removeEventListener(e,n,!!i)},Au=function(t,e,n){n=n&&n.wheelHandler,n&&(t(e,"wheel",n),t(e,"touchmove",n))},v0={startColor:"green",endColor:"red",indent:0,fontSize:"16px",fontWeight:"normal"},Ru={toggleActions:"play",anticipatePin:0},ku={top:0,left:0,center:.5,bottom:1,right:1},Du=function(t,e){if(Ei(t)){var n=t.indexOf("="),i=~n?+(t.charAt(n-1)+1)*parseFloat(t.substr(n+1)):0;~n&&(t.indexOf("%")>n&&(i*=e/100),t=t.substr(0,n-1)),t=i+(t in ku?ku[t]*e:~t.indexOf("%")?parseFloat(t)*e/100:parseFloat(t)||0)}return t},Cu=function(t,e,n,i,r,o,a,l){var c=r.startColor,h=r.endColor,d=r.fontSize,u=r.indent,f=r.fontWeight,m=Se.createElement("div"),x=io(n)||Us(n,"pinType")==="fixed",p=t.indexOf("scroller")!==-1,g=x?ye:n.tagName==="IFRAME"?n.contentDocument.body:n,v=t.indexOf("start")!==-1,S=v?c:h,y="border-color:"+S+";font-size:"+d+";color:"+S+";font-weight:"+f+";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";return y+="position:"+((p||l)&&x?"fixed;":"absolute;"),(p||l||!x)&&(y+=(i===cn?Rp:Cp)+":"+(o+parseFloat(u))+"px;"),a&&(y+="box-sizing:border-box;text-align:left;width:"+a.offsetWidth+"px;"),m._isStart=v,m.setAttribute("class","gsap-marker-"+t+(e?" marker-"+e:"")),m.style.cssText=y,m.innerText=e||e===0?t+"-"+e:t,g.children[0]?g.insertBefore(m,g.children[0]):g.appendChild(m),m._offset=m["offset"+i.op.d2],Nu(m,0,i,v),m},Nu=function(t,e,n,i){var r={display:"block"},o=n[i?"os2":"p2"],a=n[i?"p2":"os2"];t._isFlipped=i,r[n.a+"Percent"]=i?-100:0,r[n.a]=i?"1px":0,r["border"+o+va]=1,r["border"+a+va]=0,r[n.p]=e+"px",Rt.set(t,r)},te=[],Sp={},y0=function(){return Gn()-zi>34&&(Zl||(Zl=requestAnimationFrame(Os)))},pa=function(){(!ni||!ni.isPressed||ni.startX>ye.clientWidth)&&(Qt.cache++,ni?Zl||(Zl=requestAnimationFrame(Os)):Os(),zi||ro("scrollStart"),zi=Gn())},mp=function(){L0=ee.innerWidth,I0=ee.innerHeight},kl=function(t){Qt.cache++,(t===!0||!Hn&&!P0&&!Se.fullscreenElement&&!Se.webkitFullscreenElement&&(!vp||L0!==ee.innerWidth||Math.abs(ee.innerHeight-I0)>ee.innerHeight*.25))&&Bu.restart(!0)},so={},Zw=[],k0=function s(){return Mn($t,"scrollEnd",s)||jr(!0)},ro=function(t){return so[t]&&so[t].map(function(e){return e()})||Zw},wi=[],H0=function(t){for(var e=0;e<wi.length;e+=5)(!t||wi[e+4]&&wi[e+4].query===t)&&(wi[e].style.cssText=wi[e+1],wi[e].getBBox&&wi[e].setAttribute("transform",wi[e+2]||""),wi[e+3].uncache=1)},G0=function(){Qt.cache++,Qt.forEach(function(t){return Vn(t)&&(t.rec=t())})},Lp=function(t,e){var n;for(ii=0;ii<te.length;ii++)n=te[ii],n&&(!e||n._ctx===e)&&(t?n.kill(1):n.revert(!0,!0));_r=!0,e&&H0(e),e||ro("revert")},V0=function(t,e){Qt.cache++,(e||!si)&&Qt.forEach(function(n){return Vn(n)&&n.cacheID++&&(n.rec=0)}),Ei(t)&&(Ep=t,ee.history.scrollRestoration!==t&&(ee.history.scrollRestoration=t))},no=0,Jw=function(){if(M0!==no){var t=M0=no;requestAnimationFrame(function(){return t===no&&jr(!0)})}},W0=function(){ye.appendChild(_a),Ap=!ni&&_a.offsetHeight||ee.innerHeight,ye.removeChild(_a)},S0=function(t){return ql(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(e){return e.style.display=t?"none":"block"})},jr=function(t,e){if(Ai=Se.documentElement,ye=Se.body,wp=[ee,Se,Ai,ye],zi&&!t&&!_r){Sn($t,"scrollEnd",k0);return}W0(),si=$t.isRefreshing=!0,_r||G0();var n=ro("refreshInit");C0&&$t.sort(),e||Lp(),Qt.forEach(function(i){Vn(i)&&(i.smooth&&(i.target.style.scrollBehavior="auto"),i(0))}),te.slice(0).forEach(function(i){return i.refresh()}),_r=!1,te.forEach(function(i){if(i._subPinOffset&&i.pin){var r=i.vars.horizontal?"offsetWidth":"offsetHeight",o=i.pin[r];i.revert(!0,1),i.adjustPinSpacing(i.pin[r]-o),i.refresh()}}),Mp=1,S0(!0),te.forEach(function(i){var r=fs(i.scroller,i._dir),o=i.vars.end==="max"||i._endClamp&&i.end>r,a=i._startClamp&&i.start>=r;(o||a)&&i.setPositions(a?r-1:i.start,o?Math.max(a?r:i.start+1,r):i.end,!0)}),S0(!1),Mp=0,n.forEach(function(i){return i&&i.render&&i.render(-1)}),Qt.forEach(function(i){Vn(i)&&(i.smooth&&requestAnimationFrame(function(){return i.target.style.scrollBehavior="smooth"}),i.rec&&i(i.rec))}),V0(Ep,1),Bu.pause(),no++,si=2,Os(2),te.forEach(function(i){return Vn(i.vars.onRefresh)&&i.vars.onRefresh(i)}),si=$t.isRefreshing=!1,ro("refresh")},bp=0,Uu=1,Os=function(t){if(t===2||!si&&!_r){$t.isUpdating=!0,Yl&&Yl.update(0);var e=te.length,n=Gn(),i=n-pp>=50,r=e&&te[0].scroll();if(Uu=bp>r?-1:1,si||(bp=r),i&&(zi&&!Hu&&n-zi>200&&(zi=0,ro("scrollEnd")),Fl=pp,pp=n),Uu<0){for(ii=e;ii-- >0;)te[ii]&&te[ii].update(0,i);Uu=1}else for(ii=0;ii<e;ii++)te[ii]&&te[ii].update(0,i);$t.isUpdating=!1}Zl=0},Tp=[O0,B0,Cp,Rp,Oi+Xl,Oi+Gl,Oi+Wl,Oi+Vl,"display","flexShrink","float","zIndex","gridColumnStart","gridColumnEnd","gridRowStart","gridRowEnd","gridArea","justifySelf","alignSelf","placeSelf","order"],Fu=Tp.concat([to,eo,"boxSizing","max"+va,"max"+Pp,"position",Oi,hn,hn+Wl,hn+Gl,hn+Xl,hn+Vl]),$w=function(t,e,n){xa(n);var i=t._gsap;if(i.spacerIsNative)xa(i.spacerState);else if(t._gsap.swappedIn){var r=e.parentNode;r&&(r.insertBefore(t,e),r.removeChild(e))}t._gsap.swappedIn=!1},gp=function(t,e,n,i){if(!t._gsap.swappedIn){for(var r=Tp.length,o=e.style,a=t.style,l;r--;)l=Tp[r],o[l]=n[l];o.position=n.position==="absolute"?"absolute":"relative",n.display==="inline"&&(o.display="inline-block"),a[Cp]=a[Rp]="auto",o.flexBasis=n.flexBasis||"auto",o.overflow="visible",o.boxSizing="border-box",o[to]=zu(t,kn)+_n,o[eo]=zu(t,cn)+_n,o[hn]=a[Oi]=a[B0]=a[O0]="0",xa(i),a[to]=a["max"+va]=n[to],a[eo]=a["max"+Pp]=n[eo],a[hn]=n[hn],t.parentNode!==e&&(t.parentNode.insertBefore(e,t),e.appendChild(t)),t._gsap.swappedIn=!0}},Kw=/([A-Z])/g,xa=function(t){if(t){var e=t.t.style,n=t.length,i=0,r,o;for((t.t._gsap||Rt.core.getCache(t.t)).uncache=1;i<n;i+=2)o=t[i+1],r=t[i],o?e[r]=o:e[r]&&e.removeProperty(r.replace(Kw,"-$1").toLowerCase())}},Pu=function(t){for(var e=Fu.length,n=t.style,i=[],r=0;r<e;r++)i.push(Fu[r],n[Fu[r]]);return i.t=t,i},Qw=function(t,e,n){for(var i=[],r=t.length,o=n?8:0,a;o<r;o+=2)a=t[o],i.push(a,a in e?e[a]:t[o+1]);return i.t=t.t,i},Ou={left:0,top:0},b0=function(t,e,n,i,r,o,a,l,c,h,d,u,f,m){Vn(t)&&(t=t(l)),Ei(t)&&t.substr(0,3)==="max"&&(t=u+(t.charAt(4)==="="?Du("0"+t.substr(3),n):0));var x=f?f.time():0,p,g,v;if(f&&f.seek(0),isNaN(t)||(t=+t),zl(t))f&&(t=Rt.utils.mapRange(f.scrollTrigger.start,f.scrollTrigger.end,0,u,t)),a&&Nu(a,n,i,!0);else{Vn(e)&&(e=e(l));var S=(t||"0").split(" "),y,b,T,_;v=ei(e,l)||ye,y=Fs(v)||{},(!y||!y.left&&!y.top)&&Bi(v).display==="none"&&(_=v.style.display,v.style.display="block",y=Fs(v),_?v.style.display=_:v.style.removeProperty("display")),b=Du(S[0],y[i.d]),T=Du(S[1]||"0",n),t=y[i.p]-c[i.p]-h+b+r-T,a&&Nu(a,T,i,n-T<20||a._isStart&&T>20),n-=n-T}if(m&&(l[m]=t||-.001,t<0&&(t=0)),o){var M=t+n,R=o._isStart;p="scroll"+i.d2,Nu(o,M,i,R&&M>20||!R&&(d?Math.max(ye[p],Ai[p]):o.parentNode[p])<=M+1),d&&(c=Fs(a),d&&(o.style[i.op.p]=c[i.op.p]-i.op.m-o._offset+_n))}return f&&v&&(p=Fs(v),f.seek(u),g=Fs(v),f._caScrollDist=p[i.p]-g[i.p],t=t/f._caScrollDist*u),f&&f.seek(x),f?t:Math.round(t)},jw=/(webkit|moz|length|cssText|inset)/i,T0=function(t,e,n,i){if(t.parentNode!==e){var r=t.style,o,a;if(e===ye){t._stOrig=r.cssText,a=Bi(t);for(o in a)!+o&&!jw.test(o)&&a[o]&&typeof r[o]=="string"&&o!=="0"&&(r[o]=a[o]);r.top=n,r.left=i}else r.cssText=t._stOrig;Rt.core.getCache(t).uncache=1,e.appendChild(t)}},X0=function(t,e,n){var i=e,r=i;return function(o){var a=Math.round(t());return a!==i&&a!==r&&Math.abs(a-i)>3&&Math.abs(a-r)>3&&(o=a,n&&n()),r=i,i=Math.round(o),i}},Iu=function(t,e,n){var i={};i[e.p]="+="+n,Rt.set(t,i)},w0=function(t,e){var n=Ns(t,e),i="_scroll"+e.p2,r=function o(a,l,c,h,d){var u=o.tween,f=l.onComplete,m={};c=c||n();var x=X0(n,c,function(){u.kill(),o.tween=0});return d=h&&d||0,h=h||a-c,u&&u.kill(),l[i]=a,l.inherit=!1,l.modifiers=m,m[i]=function(){return x(c+h*u.ratio+d*u.ratio*u.ratio)},l.onUpdate=function(){Qt.cache++,o.tween&&Os()},l.onComplete=function(){o.tween=0,f&&f.call(u)},u=o.tween=Rt.to(t,l),u};return t[i]=n,n.wheelHandler=function(){return r.tween&&r.tween.kill()&&(r.tween=0)},Sn(t,"wheel",n.wheelHandler),$t.isTouch&&Sn(t,"touchmove",n.wheelHandler),r},$t=(function(){function s(e,n){ma||s.register(Rt)||console.warn("Please gsap.registerPlugin(ScrollTrigger)"),yp(this),this.init(e,n)}var t=s.prototype;return t.init=function(n,i){if(this.progress=this.start=0,this.vars&&this.kill(!0,!0),!Ol){this.update=this.refresh=this.kill=us;return}n=x0(Ei(n)||zl(n)||n.nodeType?{trigger:n}:n,Ru);var r=n,o=r.onUpdate,a=r.toggleClass,l=r.id,c=r.onToggle,h=r.onRefresh,d=r.scrub,u=r.trigger,f=r.pin,m=r.pinSpacing,x=r.invalidateOnRefresh,p=r.anticipatePin,g=r.onScrubComplete,v=r.onSnapComplete,S=r.once,y=r.snap,b=r.pinReparent,T=r.pinSpacer,_=r.containerAnimation,M=r.fastScrollEnd,R=r.preventOverlaps,A=n.horizontal||n.containerAnimation&&n.horizontal!==!1?kn:cn,D=!d&&d!==0,L=ei(n.scroller||ee),F=Rt.core.getCache(L),P=io(L),B=("pinType"in n?n.pinType:Us(L,"pinType")||P&&"fixed")==="fixed",k=[n.onEnter,n.onLeave,n.onEnterBack,n.onLeaveBack],O=D&&n.toggleActions.split(" "),Q="markers"in n?n.markers:Ru.markers,W=P?0:parseFloat(Bi(L)["border"+A.p2+va])||0,I=this,nt=n.onRefreshInit&&function(){return n.onRefreshInit(I)},_t=Vw(L,P,A),Et=Ww(L,P),Z=0,ht=0,Mt=0,bt=Ns(L,A),mt,Nt,Me,At,Yt,Lt,Bt,de,he,J,se,en,Ee,le,Xe,Ke,z,ge,ue,Wt,ut,pe,Dt,Gt,C,w,V,rt,it,ct,gt,X,j,lt,N,K,$,ft,at;if(I._startClamp=I._endClamp=!1,I._dir=A,p*=45,I.scroller=L,I.scroll=_?_.time.bind(_):bt,At=bt(),_r&&bt.rec==null&&(bt.rec=At),I.vars=n,i=i||n.animation,"refreshPriority"in n&&(C0=1,n.refreshPriority===-9999&&(Yl=I)),F.tweenScroll=F.tweenScroll||{top:w0(L,cn),left:w0(L,kn)},I.tweenTo=mt=F.tweenScroll[A.p],I.scrubDuration=function(tt){j=zl(tt)&&tt,j?X?X.duration(tt):X=Rt.to(i,{ease:"expo",totalProgress:"+=0",inherit:!1,duration:j,paused:!0,onComplete:function(){return g&&g(I)}}):(X&&X.progress(1).kill(),X=0)},i&&(i.vars.lazy=!1,i._initted&&!I.isReverted||i.vars.immediateRender!==!1&&n.immediateRender!==!1&&i.duration()&&i.render(0,!0,!0),I.animation=i.pause(),i.scrollTrigger=I,I.scrubDuration(d),ct=0,l||(l=i.vars.id)),y&&((!Qr(y)||y.push)&&(y={snapTo:y}),"scrollBehavior"in ye.style&&Rt.set(P?[ye,Ai]:L,{scrollBehavior:"auto"}),Qt.forEach(function(tt){return Vn(tt)&&tt.target===(P?Se.scrollingElement||Ai:L)&&(tt.smooth=!1)}),Me=Vn(y.snapTo)?y.snapTo:y.snapTo==="labels"?Yw(i):y.snapTo==="labelsDirectional"?qw(i):y.directional!==!1?function(tt,xt){return Ip(y.snapTo)(tt,Gn()-ht<500?0:xt.direction)}:Rt.utils.snap(y.snapTo),lt=y.duration||{min:.1,max:2},lt=Qr(lt)?Hl(lt.min,lt.max):Hl(lt,lt),N=Rt.delayedCall(y.delay||j/2||.1,function(){var tt=bt(),xt=Gn()-ht<500,et=mt.tween;if((xt||Math.abs(I.getVelocity())<10)&&!et&&!Hu&&Z!==tt){var Tt=(tt-Lt)/le,re=i&&!D?i.totalProgress():Tt,qt=xt?0:(re-gt)/(Gn()-Fl)*1e3||0,Fe=Rt.utils.clamp(-Tt,1-Tt,da(qt/2)*qt/.185),nn=Tt+(y.inertia===!1?0:Fe),Oe,Ae,ve=y,un=ve.onStart,Re=ve.onInterrupt,Cn=ve.onComplete;if(Oe=Me(nn,I),zl(Oe)||(Oe=nn),Ae=Math.max(0,Math.round(Lt+Oe*le)),tt<=Bt&&tt>=Lt&&Ae!==tt){if(et&&!et._initted&&et.data<=da(Ae-tt))return;y.inertia===!1&&(Fe=Oe-Tt),mt(Ae,{duration:lt(da(Math.max(da(nn-re),da(Oe-re))*.185/qt/.05||0)),ease:y.ease||"power3",data:da(Ae-tt),onInterrupt:function(){return N.restart(!0)&&Re&&fa(I,Re)},onComplete:function(){I.update(),Z=bt(),i&&!D&&(X?X.resetTo("totalProgress",Oe,i._tTime/i._tDur):i.progress(Oe)),ct=gt=i&&!D?i.totalProgress():I.progress,v&&v(I),Cn&&fa(I,Cn)}},tt,Fe*le,Ae-tt-Fe*le),un&&fa(I,un,mt.tween)}}else I.isActive&&Z!==tt&&N.restart(!0)}).pause()),l&&(Sp[l]=I),u=I.trigger=ei(u||f!==!0&&f),at=u&&u._gsap&&u._gsap.stRevert,at&&(at=at(I)),f=f===!0?u:ei(f),Ei(a)&&(a={targets:u,className:a}),f&&(m===!1||m===Oi||(m=!m&&f.parentNode&&f.parentNode.style&&Bi(f.parentNode).display==="flex"?!1:hn),I.pin=f,Nt=Rt.core.getCache(f),Nt.spacer?Xe=Nt.pinState:(T&&(T=ei(T),T&&!T.nodeType&&(T=T.current||T.nativeElement),Nt.spacerIsNative=!!T,T&&(Nt.spacerState=Pu(T))),Nt.spacer=ge=T||Se.createElement("div"),ge.classList.add("pin-spacer"),l&&ge.classList.add("pin-spacer-"+l),Nt.pinState=Xe=Pu(f)),n.force3D!==!1&&Rt.set(f,{force3D:!0}),I.spacer=ge=Nt.spacer,it=Bi(f),Gt=it[m+A.os2],Wt=Rt.getProperty(f),ut=Rt.quickSetter(f,A.a,_n),gp(f,ge,it),z=Pu(f)),Q){en=Qr(Q)?x0(Q,v0):v0,J=Cu("scroller-start",l,L,A,en,0),se=Cu("scroller-end",l,L,A,en,0,J),ue=J["offset"+A.op.d2];var dt=ei(Us(L,"content")||L);de=this.markerStart=Cu("start",l,dt,A,en,ue,0,_),he=this.markerEnd=Cu("end",l,dt,A,en,ue,0,_),_&&(ft=Rt.quickSetter([de,he],A.a,_n)),!B&&!($i.length&&Us(L,"fixedMarkers")===!0)&&(Xw(P?ye:L),Rt.set([J,se],{force3D:!0}),w=Rt.quickSetter(J,A.a,_n),rt=Rt.quickSetter(se,A.a,_n))}if(_){var ot=_.vars.onUpdate,pt=_.vars.onUpdateParams;_.eventCallback("onUpdate",function(){I.update(0,0,1),ot&&ot.apply(_,pt||[])})}if(I.previous=function(){return te[te.indexOf(I)-1]},I.next=function(){return te[te.indexOf(I)+1]},I.revert=function(tt,xt){if(!xt)return I.kill(!0);var et=tt!==!1||!I.enabled,Tt=Hn;et!==I.isReverted&&(et&&(K=Math.max(bt(),I.scroll.rec||0),Mt=I.progress,$=i&&i.progress()),de&&[de,he,J,se].forEach(function(re){return re.style.display=et?"none":"block"}),et&&(Hn=I,I.update(et)),f&&(!b||!I.isActive)&&(et?$w(f,ge,Xe):gp(f,ge,Bi(f),C)),et||I.update(et),Hn=Tt,I.isReverted=et)},I.refresh=function(tt,xt,et,Tt){if(!((Hn||!I.enabled)&&!xt)){if(f&&tt&&zi){Sn(s,"scrollEnd",k0);return}!si&&nt&&nt(I),Hn=I,mt.tween&&!et&&(mt.tween.kill(),mt.tween=0),X&&X.pause(),x&&i&&(i.revert({kill:!1}).invalidate(),i.getChildren?i.getChildren(!0,!0,!1).forEach(function(G){return G.vars.immediateRender&&G.render(0,!0,!0)}):i.vars.immediateRender&&i.render(0,!0,!0)),I.isReverted||I.revert(!0,!0),I._subPinOffset=!1;var re=_t(),qt=Et(),Fe=_?_.duration():fs(L,A),nn=le<=.01||!le,Oe=0,Ae=Tt||0,ve=Qr(et)?et.end:n.end,un=n.endTrigger||u,Re=Qr(et)?et.start:n.start||(n.start===0||!u?0:f?"0 0":"0 100%"),Cn=I.pinnedContainer=n.pinnedContainer&&ei(n.pinnedContainer,I),pi=u&&Math.max(0,te.indexOf(I))||0,Ye=pi,sn,fn,mi,uo,dn,qe,Pi,Sa,Ql,zs,E,U,q;for(Q&&Qr(et)&&(U=Rt.getProperty(J,A.p),q=Rt.getProperty(se,A.p));Ye-- >0;)qe=te[Ye],qe.end||qe.refresh(0,1)||(Hn=I),Pi=qe.pin,Pi&&(Pi===u||Pi===f||Pi===Cn)&&!qe.isReverted&&(zs||(zs=[]),zs.unshift(qe),qe.revert(!0,!0)),qe!==te[Ye]&&(pi--,Ye--);for(Vn(Re)&&(Re=Re(I)),Re=p0(Re,"start",I),Lt=b0(Re,u,re,A,bt(),de,J,I,qt,W,B,Fe,_,I._startClamp&&"_startClamp")||(f?-.001:0),Vn(ve)&&(ve=ve(I)),Ei(ve)&&!ve.indexOf("+=")&&(~ve.indexOf(" ")?ve=(Ei(Re)?Re.split(" ")[0]:"")+ve:(Oe=Du(ve.substr(2),re),ve=Ei(Re)?Re:(_?Rt.utils.mapRange(0,_.duration(),_.scrollTrigger.start,_.scrollTrigger.end,Lt):Lt)+Oe,un=u)),ve=p0(ve,"end",I),Bt=Math.max(Lt,b0(ve||(un?"100% 0":Fe),un,re,A,bt()+Oe,he,se,I,qt,W,B,Fe,_,I._endClamp&&"_endClamp"))||-.001,Oe=0,Ye=pi;Ye--;)qe=te[Ye]||{},Pi=qe.pin,Pi&&qe.start-qe._pinPush<=Lt&&!_&&qe.end>0&&(sn=qe.end-(I._startClamp?Math.max(0,qe.start):qe.start),(Pi===u&&qe.start-qe._pinPush<Lt||Pi===Cn)&&isNaN(Re)&&(Oe+=sn*(1-qe.progress)),Pi===f&&(Ae+=sn));if(Lt+=Oe,Bt+=Oe,I._startClamp&&(I._startClamp+=Oe),I._endClamp&&!si&&(I._endClamp=Bt||-.001,Bt=Math.min(Bt,fs(L,A))),le=Bt-Lt||(Lt-=.01)&&.001,nn&&(Mt=Rt.utils.clamp(0,1,Rt.utils.normalize(Lt,Bt,K))),I._pinPush=Ae,de&&Oe&&(sn={},sn[A.a]="+="+Oe,Cn&&(sn[A.p]="-="+bt()),Rt.set([de,he],sn)),f&&!(Mp&&I.end>=fs(L,A)))sn=Bi(f),uo=A===cn,mi=bt(),pe=parseFloat(Wt(A.a))+Ae,!Fe&&Bt>1&&(E=(P?Se.scrollingElement||Ai:L).style,E={style:E,value:E["overflow"+A.a.toUpperCase()]},P&&Bi(ye)["overflow"+A.a.toUpperCase()]!=="scroll"&&(E.style["overflow"+A.a.toUpperCase()]="scroll")),gp(f,ge,sn),z=Pu(f),fn=Fs(f,!0),Sa=B&&Ns(L,uo?kn:cn)(),m?(C=[m+A.os2,le+Ae+_n],C.t=ge,Ye=m===hn?zu(f,A)+le+Ae:0,Ye&&(C.push(A.d,Ye+_n),ge.style.flexBasis!=="auto"&&(ge.style.flexBasis=Ye+_n)),xa(C),Cn&&te.forEach(function(G){G.pin===Cn&&G.vars.pinSpacing!==!1&&(G._subPinOffset=!0)}),B&&bt(K)):(Ye=zu(f,A),Ye&&ge.style.flexBasis!=="auto"&&(ge.style.flexBasis=Ye+_n)),B&&(dn={top:fn.top+(uo?mi-Lt:Sa)+_n,left:fn.left+(uo?Sa:mi-Lt)+_n,boxSizing:"border-box",position:"fixed"},dn[to]=dn["max"+va]=Math.ceil(fn.width)+_n,dn[eo]=dn["max"+Pp]=Math.ceil(fn.height)+_n,dn[Oi]=dn[Oi+Wl]=dn[Oi+Gl]=dn[Oi+Xl]=dn[Oi+Vl]="0",dn[hn]=sn[hn],dn[hn+Wl]=sn[hn+Wl],dn[hn+Gl]=sn[hn+Gl],dn[hn+Xl]=sn[hn+Xl],dn[hn+Vl]=sn[hn+Vl],Ke=Qw(Xe,dn,b),si&&bt(0)),i?(Ql=i._initted,fp(1),i.render(i.duration(),!0,!0),Dt=Wt(A.a)-pe+le+Ae,V=Math.abs(le-Dt)>1,B&&V&&Ke.splice(Ke.length-2,2),i.render(0,!0,!0),Ql||i.invalidate(!0),i.parent||i.totalTime(i.totalTime()),fp(0)):Dt=le,E&&(E.value?E.style["overflow"+A.a.toUpperCase()]=E.value:E.style.removeProperty("overflow-"+A.a));else if(u&&bt()&&!_)for(fn=u.parentNode;fn&&fn!==ye;)fn._pinOffset&&(Lt-=fn._pinOffset,Bt-=fn._pinOffset),fn=fn.parentNode;zs&&zs.forEach(function(G){return G.revert(!1,!0)}),I.start=Lt,I.end=Bt,At=Yt=si?K:bt(),!_&&!si&&!_r&&(At<K&&bt(K),I.scroll.rec=0),I.revert(!1,!0),ht=Gn(),N&&(Z=-1,N.restart(!0)),Hn=0,i&&D&&(i._initted||$)&&i.progress()!==$&&i.progress($||0,!0).render(i.time(),!0,!0),(nn||Mt!==I.progress||_||x||i&&!i._initted)&&(i&&!D&&(i._initted||Mt||i.vars.immediateRender!==!1)&&i.totalProgress(_&&Lt<-.001&&!Mt?Rt.utils.normalize(Lt,Bt,0):Mt,!0),I.progress=nn||(At-Lt)/le===Mt?0:Mt),f&&m&&(ge._pinOffset=Math.round(I.progress*Dt)),X&&X.invalidate(),isNaN(U)||(U-=Rt.getProperty(J,A.p),q-=Rt.getProperty(se,A.p),Iu(J,A,U),Iu(de,A,U-(Tt||0)),Iu(se,A,q),Iu(he,A,q-(Tt||0))),nn&&!si&&I.update(),h&&!si&&!Ee&&(Ee=!0,h(I),Ee=!1)}},I.getVelocity=function(){return(bt()-Yt)/(Gn()-Fl)*1e3||0},I.endAnimation=function(){Ul(I.callbackAnimation),i&&(X?X.progress(1):i.paused()?D||Ul(i,I.direction<0,1):Ul(i,i.reversed()))},I.labelToScroll=function(tt){return i&&i.labels&&(Lt||I.refresh()||Lt)+i.labels[tt]/i.duration()*le||0},I.getTrailing=function(tt){var xt=te.indexOf(I),et=I.direction>0?te.slice(0,xt).reverse():te.slice(xt+1);return(Ei(tt)?et.filter(function(Tt){return Tt.vars.preventOverlaps===tt}):et).filter(function(Tt){return I.direction>0?Tt.end<=Lt:Tt.start>=Bt})},I.update=function(tt,xt,et){if(!(_&&!et&&!tt)){var Tt=si===!0?K:I.scroll(),re=tt?0:(Tt-Lt)/le,qt=re<0?0:re>1?1:re||0,Fe=I.progress,nn,Oe,Ae,ve,un,Re,Cn,pi;if(xt&&(Yt=At,At=_?bt():Tt,y&&(gt=ct,ct=i&&!D?i.totalProgress():qt)),p&&f&&!Hn&&!Tu&&zi&&(!qt&&Lt<Tt+(Tt-Yt)/(Gn()-Fl)*p?qt=1e-4:qt===1&&Bt>Tt+(Tt-Yt)/(Gn()-Fl)*p&&(qt=.9999)),qt!==Fe&&I.enabled){if(nn=I.isActive=!!qt&&qt<1,Oe=!!Fe&&Fe<1,Re=nn!==Oe,un=Re||!!qt!=!!Fe,I.direction=qt>Fe?1:-1,I.progress=qt,un&&!Hn&&(Ae=qt&&!Fe?0:qt===1?1:Fe===1?2:3,D&&(ve=!Re&&O[Ae+1]!=="none"&&O[Ae+1]||O[Ae],pi=i&&(ve==="complete"||ve==="reset"||ve in i))),R&&(Re||pi)&&(pi||d||!i)&&(Vn(R)?R(I):I.getTrailing(R).forEach(function(mi){return mi.endAnimation()})),D||(X&&!Hn&&!Tu?(X._dp._time-X._start!==X._time&&X.render(X._dp._time-X._start),X.resetTo?X.resetTo("totalProgress",qt,i._tTime/i._tDur):(X.vars.totalProgress=qt,X.invalidate().restart())):i&&i.totalProgress(qt,!!(Hn&&(ht||tt)))),f){if(tt&&m&&(ge.style[m+A.os2]=Gt),!B)ut(Bl(pe+Dt*qt));else if(un){if(Cn=!tt&&qt>Fe&&Bt+1>Tt&&Tt+1>=fs(L,A),b)if(!tt&&(nn||Cn)){var Ye=Fs(f,!0),sn=Tt-Lt;T0(f,ye,Ye.top+(A===cn?sn:0)+_n,Ye.left+(A===cn?0:sn)+_n)}else T0(f,ge);xa(nn||Cn?Ke:z),V&&qt<1&&nn||ut(pe+(qt===1&&!Cn?Dt:0))}}y&&!mt.tween&&!Hn&&!Tu&&N.restart(!0),a&&(Re||S&&qt&&(qt<1||!dp))&&ql(a.targets).forEach(function(mi){return mi.classList[nn||S?"add":"remove"](a.className)}),o&&!D&&!tt&&o(I),un&&!Hn?(D&&(pi&&(ve==="complete"?i.pause().totalProgress(1):ve==="reset"?i.restart(!0).pause():ve==="restart"?i.restart(!0):i[ve]()),o&&o(I)),(Re||!dp)&&(c&&Re&&fa(I,c),k[Ae]&&fa(I,k[Ae]),S&&(qt===1?I.kill(!1,1):k[Ae]=0),Re||(Ae=qt===1?1:3,k[Ae]&&fa(I,k[Ae]))),M&&!nn&&Math.abs(I.getVelocity())>(zl(M)?M:2500)&&(Ul(I.callbackAnimation),X?X.progress(1):Ul(i,ve==="reverse"?1:!qt,1))):D&&o&&!Hn&&o(I)}if(rt){var fn=_?Tt/_.duration()*(_._caScrollDist||0):Tt;w(fn+(J._isFlipped?1:0)),rt(fn)}ft&&ft(-Tt/_.duration()*(_._caScrollDist||0))}},I.enable=function(tt,xt){I.enabled||(I.enabled=!0,Sn(L,"resize",kl),P||Sn(L,"scroll",pa),nt&&Sn(s,"refreshInit",nt),tt!==!1&&(I.progress=Mt=0,At=Yt=Z=bt()),xt!==!1&&I.refresh())},I.getTween=function(tt){return tt&&mt?mt.tween:X},I.setPositions=function(tt,xt,et,Tt){if(_){var re=_.scrollTrigger,qt=_.duration(),Fe=re.end-re.start;tt=re.start+Fe*tt/qt,xt=re.start+Fe*xt/qt}I.refresh(!1,!1,{start:m0(tt,et&&!!I._startClamp),end:m0(xt,et&&!!I._endClamp)},Tt),I.update()},I.adjustPinSpacing=function(tt){if(C&&tt){var xt=C.indexOf(A.d)+1;C[xt]=parseFloat(C[xt])+tt+_n,C[1]=parseFloat(C[1])+tt+_n,xa(C)}},I.disable=function(tt,xt){if(tt!==!1&&I.revert(!0,!0),I.enabled&&(I.enabled=I.isActive=!1,xt||X&&X.pause(),K=0,Nt&&(Nt.uncache=1),nt&&Mn(s,"refreshInit",nt),N&&(N.pause(),mt.tween&&mt.tween.kill()&&(mt.tween=0)),!P)){for(var et=te.length;et--;)if(te[et].scroller===L&&te[et]!==I)return;Mn(L,"resize",kl),P||Mn(L,"scroll",pa)}},I.kill=function(tt,xt){I.disable(tt,xt),X&&!xt&&X.kill(),l&&delete Sp[l];var et=te.indexOf(I);et>=0&&te.splice(et,1),et===ii&&Uu>0&&ii--,et=0,te.forEach(function(Tt){return Tt.scroller===I.scroller&&(et=1)}),et||si||_r||(I.scroll.rec=0),i&&(i.scrollTrigger=null,tt&&i.revert({kill:!1}),xt||i.kill()),de&&[de,he,J,se].forEach(function(Tt){return Tt.parentNode&&Tt.parentNode.removeChild(Tt)}),Yl===I&&(Yl=0),f&&(Nt&&(Nt.uncache=1),et=0,te.forEach(function(Tt){return Tt.pin===f&&et++}),et||(Nt.spacer=0)),n.onKill&&n.onKill(I)},te.push(I),I.enable(!1,!1),at&&at(I),i&&i.add&&!le){var st=I.update;I.update=function(){I.update=st,Qt.cache++,Lt||Bt||I.refresh()},Rt.delayedCall(.01,I.update),le=.01,Lt=Bt=0}else I.refresh();f&&Jw()},s.register=function(n){return ma||(Rt=n||N0(),D0()&&window.document&&s.enable(),ma=Ol),ma},s.defaults=function(n){if(n)for(var i in n)Ru[i]=n[i];return Ru},s.disable=function(n,i){Ol=0,te.forEach(function(o){return o[i?"kill":"disable"](n)}),Mn(ee,"wheel",pa),Mn(Se,"scroll",pa),clearInterval(bu),Mn(Se,"touchcancel",us),Mn(ye,"touchstart",us),Eu(Mn,Se,"pointerdown,touchstart,mousedown",g0),Eu(Mn,Se,"pointerup,touchend,mouseup",_0),Bu.kill(),wu(Mn);for(var r=0;r<Qt.length;r+=3)Au(Mn,Qt[r],Qt[r+1]),Au(Mn,Qt[r],Qt[r+2])},s.enable=function(){if(ee=window,Se=document,Ai=Se.documentElement,ye=Se.body,Rt){if(ql=Rt.utils.toArray,Hl=Rt.utils.clamp,yp=Rt.core.context||us,fp=Rt.core.suppressOverwrites||us,Ep=ee.history.scrollRestoration||"auto",bp=ee.pageYOffset||0,Rt.core.globals("ScrollTrigger",s),ye){Ol=1,_a=document.createElement("div"),_a.style.height="100vh",_a.style.position="absolute",W0(),Gw(),$e.register(Rt),s.isTouch=$e.isTouch,gr=$e.isTouch&&/(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent),vp=$e.isTouch===1,Sn(ee,"wheel",pa),wp=[ee,Se,Ai,ye],Rt.matchMedia?(s.matchMedia=function(h){var d=Rt.matchMedia(),u;for(u in h)d.add(u,h[u]);return d},Rt.addEventListener("matchMediaInit",function(){G0(),Lp()}),Rt.addEventListener("matchMediaRevert",function(){return H0()}),Rt.addEventListener("matchMedia",function(){jr(0,1),ro("matchMedia")}),Rt.matchMedia().add("(orientation: portrait)",function(){return mp(),mp})):console.warn("Requires GSAP 3.11.0 or later"),mp(),Sn(Se,"scroll",pa);var n=ye.hasAttribute("style"),i=ye.style,r=i.borderTopStyle,o=Rt.core.Animation.prototype,a,l;for(o.revert||Object.defineProperty(o,"revert",{value:function(){return this.time(-.01,!0)}}),i.borderTopStyle="solid",a=Fs(ye),cn.m=Math.round(a.top+cn.sc())||0,kn.m=Math.round(a.left+kn.sc())||0,r?i.borderTopStyle=r:i.removeProperty("border-top-style"),n||(ye.setAttribute("style",""),ye.removeAttribute("style")),bu=setInterval(y0,250),Rt.delayedCall(.5,function(){return Tu=0}),Sn(Se,"touchcancel",us),Sn(ye,"touchstart",us),Eu(Sn,Se,"pointerdown,touchstart,mousedown",g0),Eu(Sn,Se,"pointerup,touchend,mouseup",_0),xp=Rt.utils.checkPrefix("transform"),Fu.push(xp),ma=Gn(),Bu=Rt.delayedCall(.2,jr).pause(),ga=[Se,"visibilitychange",function(){var h=ee.innerWidth,d=ee.innerHeight;Se.hidden?(f0=h,d0=d):(f0!==h||d0!==d)&&kl()},Se,"DOMContentLoaded",jr,ee,"load",jr,ee,"resize",kl],wu(Sn),te.forEach(function(h){return h.enable(0,1)}),l=0;l<Qt.length;l+=3)Au(Mn,Qt[l],Qt[l+1]),Au(Mn,Qt[l],Qt[l+2])}else if(Se){var c=function h(){s.enable(),Se.removeEventListener("DOMContentLoaded",h)};Se.addEventListener("DOMContentLoaded",c)}}},s.config=function(n){"limitCallbacks"in n&&(dp=!!n.limitCallbacks);var i=n.syncInterval;i&&clearInterval(bu)||(bu=i)&&setInterval(y0,i),"ignoreMobileResize"in n&&(vp=s.isTouch===1&&n.ignoreMobileResize),"autoRefreshEvents"in n&&(wu(Mn)||wu(Sn,n.autoRefreshEvents||"none"),P0=(n.autoRefreshEvents+"").indexOf("resize")===-1)},s.scrollerProxy=function(n,i){var r=ei(n),o=Qt.indexOf(r),a=io(r);~o&&Qt.splice(o,a?6:2),i&&(a?$i.unshift(ee,i,ye,i,Ai,i):$i.unshift(r,i))},s.clearMatchMedia=function(n){te.forEach(function(i){return i._ctx&&i._ctx.query===n&&i._ctx.kill(!0,!0)})},s.isInViewport=function(n,i,r){var o=(Ei(n)?ei(n):n).getBoundingClientRect(),a=o[r?to:eo]*i||0;return r?o.right-a>0&&o.left+a<ee.innerWidth:o.bottom-a>0&&o.top+a<ee.innerHeight},s.positionInViewport=function(n,i,r){Ei(n)&&(n=ei(n));var o=n.getBoundingClientRect(),a=o[r?to:eo],l=i==null?a/2:i in ku?ku[i]*a:~i.indexOf("%")?parseFloat(i)*a/100:parseFloat(i)||0;return r?(o.left+l)/ee.innerWidth:(o.top+l)/ee.innerHeight},s.killAll=function(n){if(te.slice(0).forEach(function(r){return r.vars.id!=="ScrollSmoother"&&r.kill()}),n!==!0){var i=so.killAll||[];so={},i.forEach(function(r){return r()})}},s})();$t.version="3.15.1";$t.saveStyles=function(s){return s?ql(s).forEach(function(t){if(t&&t.style){var e=wi.indexOf(t);e>=0&&wi.splice(e,5),wi.push(t,t.style.cssText,t.getBBox&&t.getAttribute("transform"),Rt.core.getCache(t),yp())}}):wi};$t.revert=function(s,t){return Lp(!s,t)};$t.create=function(s,t){return new $t(s,t)};$t.refresh=function(s){return s?kl(!0):(ma||$t.register())&&jr(!0)};$t.update=function(s){return++Qt.cache&&Os(s===!0?2:0)};$t.clearScrollMemory=V0;$t.maxScroll=function(s,t){return fs(s,t?kn:cn)};$t.getScrollFunc=function(s,t){return Ns(ei(s),t?kn:cn)};$t.getById=function(s){return Sp[s]};$t.getAll=function(){return te.filter(function(s){return s.vars.id!=="ScrollSmoother"})};$t.isScrolling=function(){return!!zi};$t.snapDirectional=Ip;$t.addEventListener=function(s,t){var e=so[s]||(so[s]=[]);~e.indexOf(t)||e.push(t)};$t.removeEventListener=function(s,t){var e=so[s],n=e&&e.indexOf(t);n>=0&&e.splice(n,1)};$t.batch=function(s,t){var e=[],n={},i=t.interval||.016,r=t.batchMax||1e9,o=function(c,h){var d=[],u=[],f=Rt.delayedCall(i,function(){h(d,u),d=[],u=[]}).pause();return function(m){d.length||f.restart(!0),d.push(m.trigger),u.push(m),r<=d.length&&f.progress(1)}},a;for(a in t)n[a]=a.substr(0,2)==="on"&&Vn(t[a])&&a!=="onRefreshInit"?o(a,t[a]):t[a];return Vn(r)&&(r=r(),Sn($t,"refresh",function(){return r=t.batchMax()})),ql(s).forEach(function(l){var c={};for(a in n)c[a]=n[a];c.trigger=l,e.push($t.create(c))}),e};E0=function(t,e,n,i){return e>i?t(i):e<0&&t(0),n>i?(i-e)/(n-e):n<0?e/(e-n):1},_p=function s(t,e){e===!0?t.style.removeProperty("touch-action"):t.style.touchAction=e===!0?"auto":e?"pan-"+e+($e.isTouch?" pinch-zoom":""):"none",t===Ai&&s(ye,e)},Lu={auto:1,scroll:1},tE=function(t){var e=t.event,n=t.target,i=t.axis,r=(e.changedTouches?e.changedTouches[0]:e).target,o=r._gsap||Rt.core.getCache(r),a=Gn(),l;if(!o._isScrollT||a-o._isScrollT>2e3){for(;r&&r!==ye&&(r.scrollHeight<=r.clientHeight&&r.scrollWidth<=r.clientWidth||!(Lu[(l=Bi(r)).overflowY]||Lu[l.overflowX]));)r=r.parentNode;o._isScroll=r&&r!==n&&!io(r)&&(Lu[(l=Bi(r)).overflowY]||Lu[l.overflowX]),o._isScrollT=a}(o._isScroll||i==="x")&&(e.stopPropagation(),e._gsapAllow=!0)},Y0=function(t,e,n,i){return $e.create({target:t,capture:!0,debounce:!1,lockAxis:!0,type:e,onWheel:i=i&&tE,onPress:i,onDrag:i,onScroll:i,onEnable:function(){return n&&Sn(Se,$e.eventTypes[0],R0,!1,!0)},onDisable:function(){return Mn(Se,$e.eventTypes[0],R0,!0)}})},eE=/(input|label|select|textarea)/i,R0=function(t){var e=eE.test(t.target.tagName);(e||A0)&&(t._gsapAllow=!0,A0=e)},nE=function(t){Qr(t)||(t={}),t.preventDefault=t.isNormalizer=t.allowClicks=!0,t.type||(t.type="wheel,touch"),t.debounce=!!t.debounce,t.id=t.id||"normalizer";var e=t,n=e.normalizeScrollX,i=e.momentum,r=e.allowNestedScroll,o=e.onRelease,a,l,c=ei(t.target)||Ai,h=Rt.core.globals().ScrollSmoother,d=h&&h.get(),u=gr&&(t.content&&ei(t.content)||d&&t.content!==!1&&!d.smooth()&&d.content()),f=Ns(c,cn),m=Ns(c,kn),x=1,p=($e.isTouch&&ee.visualViewport?ee.visualViewport.scale*ee.visualViewport.width:ee.outerWidth)/ee.innerWidth,g=0,v=Vn(i)?function(){return i(a)}:function(){return i||2.8},S,y,b=Y0(c,t.type,!0,r),T=function(){return y=!1},_=us,M=us,R=function(){l=fs(c,cn),M=Hl(gr?1:0,l),n&&(_=Hl(0,fs(c,kn))),S=no},A=function(){u._gsap.y=Bl(parseFloat(u._gsap.y)+f.offset)+"px",u.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+parseFloat(u._gsap.y)+", 0, 1)",f.offset=f.cacheID=0},D=function(){if(y){requestAnimationFrame(T);var Q=Bl(a.deltaY/2),W=M(f.v-Q);if(u&&W!==f.v+f.offset){f.offset=W-f.v;var I=Bl((parseFloat(u&&u._gsap.y)||0)-f.offset);u.style.transform="matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, "+I+", 0, 1)",u._gsap.y=I+"px",f.cacheID=Qt.cache,Os()}return!0}f.offset&&A(),y=!0},L,F,P,B,k=function(){R(),L.isActive()&&L.vars.scrollY>l&&(f()>l?L.progress(1)&&f(l):L.resetTo("scrollY",l))};return u&&Rt.set(u,{y:"+=0"}),t.ignoreCheck=function(O){return gr&&O.type==="touchmove"&&D(O)||x>1.05&&O.type!=="touchstart"||a.isGesturing||O.touches&&O.touches.length>1},t.onPress=function(){y=!1;var O=x;x=Bl((ee.visualViewport&&ee.visualViewport.scale||1)/p),L.pause(),O!==x&&_p(c,x>1.01?!0:n?!1:"x"),F=m(),P=f(),R(),S=no},t.onRelease=t.onGestureStart=function(O,Q){if(f.offset&&A(),!Q)B.restart(!0);else{Qt.cache++;var W=v(),I,nt;n&&(I=m(),nt=I+W*.05*-O.velocityX/.227,W*=E0(m,I,nt,fs(c,kn)),L.vars.scrollX=_(nt)),I=f(),nt=I+W*.05*-O.velocityY/.227,W*=E0(f,I,nt,fs(c,cn)),L.vars.scrollY=M(nt),L.invalidate().duration(W).play(.01),(gr&&L.vars.scrollY>=l||I>=l-1)&&Rt.to({},{onUpdate:k,duration:W})}o&&o(O)},t.onWheel=function(){L._ts&&L.pause(),Gn()-g>1e3&&(S=0,g=Gn())},t.onChange=function(O,Q,W,I,nt){if(no!==S&&R(),Q&&n&&m(_(I[2]===Q?F+(O.startX-O.x):m()+Q-I[1])),W){f.offset&&A();var _t=nt[2]===W,Et=_t?P+O.startY-O.y:f()+W-nt[1],Z=M(Et);_t&&Et!==Z&&(P+=Z-Et),f(Z)}(W||Q)&&Os()},t.onEnable=function(){_p(c,n?!1:"x"),$t.addEventListener("refresh",k),Sn(ee,"resize",k),f.smooth&&(f.target.style.scrollBehavior="auto",f.smooth=m.smooth=!1),b.enable()},t.onDisable=function(){_p(c,!0),Mn(ee,"resize",k),$t.removeEventListener("refresh",k),b.kill()},t.lockAxis=t.lockAxis!==!1,a=new $e(t),a.iOS=gr,gr&&!f()&&f(1),gr&&Rt.ticker.add(us),B=a._dc,L=Rt.to(a,{ease:"power4",paused:!0,inherit:!1,scrollX:n?"+=0.1":"+=0",scrollY:"+=0.1",modifiers:{scrollY:X0(f,f(),function(){return L.pause()})},onUpdate:Os,onComplete:B.vars.onComplete}),a};$t.sort=function(s){if(Vn(s))return te.sort(s);var t=ee.pageYOffset||0;return $t.getAll().forEach(function(e){return e._sortY=e.trigger?t+e.trigger.getBoundingClientRect().top:e.start+ee.innerHeight}),te.sort(s||function(e,n){return(e.vars.refreshPriority||0)*-1e6+(e.vars.containerAnimation?1e6:e._sortY)-((n.vars.containerAnimation?1e6:n._sortY)+(n.vars.refreshPriority||0)*-1e6)})};$t.observe=function(s){return new $e(s)};$t.normalizeScroll=function(s){if(typeof s>"u")return ni;if(s===!0&&ni)return ni.enable();if(s===!1){ni&&ni.kill(),ni=s;return}var t=s instanceof $e?s:nE(s);return ni&&ni.target===t.target&&ni.kill(),io(t.target)&&(ni=t),t};$t.core={_getVelocityProp:Su,_inputObserver:Y0,_scrollers:Qt,_proxies:$i,bridge:{ss:function(){zi||ro("scrollStart"),zi=Gn()},ref:function(){return Hn}}};N0()&&Rt.registerPlugin($t)});function K0(s,t,e){return Math.max(s,Math.min(t,e))}function iE(s,t,e){return(1-e)*s+e*t}function sE(s,t,e,n){return iE(s,t,1-Math.exp(-e*n))}function rE(s,t){return(s%t+t)%t}function aE(s,t){let e;return function(...n){clearTimeout(e),e=setTimeout(()=>{e=void 0,s.apply(this,n)},t)}}function J0(s,t){return s===1?cE:s===2?t:1}var Z0,oE,lE,Q0,cE,xr,hE,$0,j0,tx=on(()=>{Z0="1.3.27";oE=class{constructor(){Ft(this,"isRunning",!1);Ft(this,"value",0);Ft(this,"from",0);Ft(this,"to",0);Ft(this,"currentTime",0);Ft(this,"lerp");Ft(this,"duration");Ft(this,"easing");Ft(this,"onUpdate")}advance(s){if(!this.isRunning)return;let t=!1;if(this.duration&&this.easing){this.currentTime+=s;let e=K0(0,this.currentTime/this.duration,1);t=e>=1;let n=t?1:this.easing(e);this.value=this.from+(this.to-this.from)*n}else this.lerp?(this.value=sE(this.value,this.to,this.lerp*60,s),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,t=!0)):(this.value=this.to,t=!0);t&&this.stop(),this.onUpdate?.(this.value,t)}stop(){this.isRunning=!1}fromTo(s,t,{lerp:e,duration:n,easing:i,onStart:r,onUpdate:o}){this.from=this.value=s,this.to=t,this.lerp=e,this.duration=n,this.easing=i,this.currentTime=0,this.isRunning=!0,r?.(),this.onUpdate=o}};lE=class{constructor(s,t,{autoResize:e=!0,debounce:n=250}={}){Ft(this,"width",0);Ft(this,"height",0);Ft(this,"scrollHeight",0);Ft(this,"scrollWidth",0);Ft(this,"debouncedResize");Ft(this,"wrapperResizeObserver");Ft(this,"contentResizeObserver");Ft(this,"resize",()=>{this.onWrapperResize(),this.onContentResize()});Ft(this,"onWrapperResize",()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)});Ft(this,"onContentResize",()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)});this.wrapper=s,this.content=t,e&&(this.debouncedResize=aE(this.resize,n),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){this.wrapperResizeObserver?.disconnect(),this.contentResizeObserver?.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},Q0=class{constructor(){Ft(this,"events",{})}emit(s,...t){let e=this.events[s]||[];for(let n=0,i=e.length;n<i;n++)e[n]?.(...t)}on(s,t){return this.events[s]?this.events[s].push(t):this.events[s]=[t],()=>{this.events[s]=this.events[s]?.filter(e=>t!==e)}}off(s,t){this.events[s]=this.events[s]?.filter(e=>t!==e)}destroy(){this.events={}}},cE=100/6,xr={passive:!1};hE=class{constructor(s,t={wheelMultiplier:1,touchMultiplier:1}){Ft(this,"touchStart",{x:0,y:0});Ft(this,"lastDelta",{x:0,y:0});Ft(this,"window",{width:0,height:0});Ft(this,"emitter",new Q0);Ft(this,"onTouchStart",s=>{let{clientX:t,clientY:e}=s.targetTouches?s.targetTouches[0]:s;this.touchStart.x=t,this.touchStart.y=e,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:s})});Ft(this,"onTouchMove",s=>{let{clientX:t,clientY:e}=s.targetTouches?s.targetTouches[0]:s,n=-(t-this.touchStart.x)*this.options.touchMultiplier,i=-(e-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=t,this.touchStart.y=e,this.lastDelta={x:n,y:i},this.emitter.emit("scroll",{deltaX:n,deltaY:i,event:s})});Ft(this,"onTouchEnd",s=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:s})});Ft(this,"onWheel",s=>{let{deltaX:t,deltaY:e,deltaMode:n}=s,i=J0(n,this.window.width),r=J0(n,this.window.height);t*=i,e*=r,t*=this.options.wheelMultiplier,e*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:t,deltaY:e,event:s})});Ft(this,"onWindowResize",()=>{this.window={width:window.innerWidth,height:window.innerHeight}});this.element=s,this.options=t,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,xr),this.element.addEventListener("touchstart",this.onTouchStart,xr),this.element.addEventListener("touchmove",this.onTouchMove,xr),this.element.addEventListener("touchend",this.onTouchEnd,xr)}on(s,t){return this.emitter.on(s,t)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,xr),this.element.removeEventListener("touchstart",this.onTouchStart,xr),this.element.removeEventListener("touchmove",this.onTouchMove,xr),this.element.removeEventListener("touchend",this.onTouchEnd,xr)}},$0=s=>Math.min(1,1.001-2**(-10*s)),j0=class{constructor({wrapper:s=window,content:t=document.documentElement,eventsTarget:e=s,smoothWheel:n=!0,syncTouch:i=!1,syncTouchLerp:r=.075,touchInertiaExponent:o=1.7,duration:a,easing:l,lerp:c=.1,infinite:h=!1,orientation:d="vertical",gestureOrientation:u=d==="horizontal"?"both":"vertical",touchMultiplier:f=1,wheelMultiplier:m=1,autoResize:x=!0,prevent:p,virtualScroll:g,overscroll:v=!0,autoRaf:S=!1,anchors:y=!1,autoToggle:b=!1,allowNestedScroll:T=!1,__experimental__naiveDimensions:_=!1,naiveDimensions:M=_,stopInertiaOnNavigate:R=!1,respectReducedMotion:A=!0}={}){Ft(this,"_isScrolling",!1);Ft(this,"_isStopped",!1);Ft(this,"_isLocked",!1);Ft(this,"_preventNextNativeScrollEvent",!1);Ft(this,"_resetVelocityTimeout",null);Ft(this,"_rafId",null);Ft(this,"_isDraggingSelection",!1);Ft(this,"reducedMotionMediaQuery",window.matchMedia("(prefers-reduced-motion: reduce)"));Ft(this,"isTouching");Ft(this,"isIos");Ft(this,"time",0);Ft(this,"userData",{});Ft(this,"lastVelocity",0);Ft(this,"velocity",0);Ft(this,"direction",0);Ft(this,"options");Ft(this,"targetScroll");Ft(this,"animatedScroll");Ft(this,"animate",new oE);Ft(this,"emitter",new Q0);Ft(this,"dimensions");Ft(this,"virtualScroll");Ft(this,"onScrollEnd",s=>{s instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&s.stopPropagation()});Ft(this,"dispatchScrollendEvent",()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))});Ft(this,"onTransitionEnd",s=>{s.propertyName?.includes("overflow")&&s.target===this.rootElement&&this.checkOverflow()});Ft(this,"onClick",s=>{let t=s.composedPath().filter(n=>n instanceof HTMLAnchorElement&&n.href).map(n=>new URL(n.href)),e=new URL(window.location.href);if(this.options.anchors){let n=t.find(i=>e.host===i.host&&e.pathname===i.pathname&&i.hash);if(n){let i=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,r=decodeURIComponent(n.hash);this.scrollTo(r,i);return}}if(this.options.stopInertiaOnNavigate&&t.some(n=>e.host===n.host&&e.pathname!==n.pathname)){this.reset();return}});Ft(this,"onPointerDown",s=>{s.button===1&&this.reset()});Ft(this,"onVirtualScroll",s=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(s)===!1)return;let{deltaX:t,deltaY:e,event:n}=s;if(this.emitter.emit("virtual-scroll",{deltaX:t,deltaY:e,event:n}),n.ctrlKey||n.lenisStopPropagation)return;let i=n.type.includes("touch"),r=n.type.includes("wheel");if(i&&this.isIos&&(n.type==="touchstart"&&(this._isDraggingSelection=this.isTouchOnSelectionHandle(n)),this._isDraggingSelection)){n.type==="touchend"&&(this._isDraggingSelection=!1);return}this.isTouching=n.type==="touchstart"||n.type==="touchmove";let o=t===0&&e===0;if(this.options.syncTouch&&i&&n.type==="touchstart"&&o&&!this.isStopped&&!this.isLocked){this.reset();return}let a=this.options.gestureOrientation==="vertical"&&e===0||this.options.gestureOrientation==="horizontal"&&t===0;if(o||a)return;let l=n.composedPath();l=l.slice(0,l.indexOf(this.rootElement));let c=this.options.prevent,h=Math.abs(t)>=Math.abs(e)?"horizontal":"vertical";if(l.find(m=>m instanceof HTMLElement&&(typeof c=="function"&&c?.(m)||m.hasAttribute?.("data-lenis-prevent")||h==="vertical"&&m.hasAttribute?.("data-lenis-prevent-vertical")||h==="horizontal"&&m.hasAttribute?.("data-lenis-prevent-horizontal")||i&&m.hasAttribute?.("data-lenis-prevent-touch")||r&&m.hasAttribute?.("data-lenis-prevent-wheel")||this.options.allowNestedScroll&&this.hasNestedScroll(m,{deltaX:t,deltaY:e}))))return;if(this.isStopped||this.isLocked){n.cancelable&&n.preventDefault();return}if(!(this.options.syncTouch&&i||this.options.smoothWheel&&r)){this.isScrolling="native",this.animate.stop(),n.lenisStopPropagation=!0;return}let d=e;this.options.gestureOrientation==="both"?d=Math.abs(e)>Math.abs(t)?e:t:this.options.gestureOrientation==="horizontal"&&(d=t),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&e>0||this.animatedScroll===this.limit&&e<0))&&(n.lenisStopPropagation=!0),n.cancelable&&n.preventDefault();let u=i&&this.options.syncTouch,f=i&&n.type==="touchend";f&&(d=Math.sign(d)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+d,{programmatic:!1,...u?{lerp:f?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})});Ft(this,"onNativeScroll",()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){let s=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-s,this.direction=Math.sign(this.animatedScroll-s),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}});Ft(this,"raf",s=>{let t=s-(this.time||s);this.time=s,this.animate.advance(t*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))});window.lenisVersion=Z0,window.lenis||(window.lenis={}),window.lenis.version=Z0,d==="horizontal"&&(window.lenis.horizontal=!0),i===!0&&(window.lenis.touch=!0),this.isIos=/(iPad|iPhone|iPod)/g.test(navigator.userAgent),(!s||s===document.documentElement)&&(s=window),typeof a=="number"&&typeof l!="function"?l=$0:typeof l=="function"&&typeof a!="number"&&(a=1),this.options={wrapper:s,content:t,eventsTarget:e,smoothWheel:n,syncTouch:i,syncTouchLerp:r,touchInertiaExponent:o,duration:a,easing:l,lerp:c,infinite:h,gestureOrientation:u,orientation:d,touchMultiplier:f,wheelMultiplier:m,autoResize:x,prevent:p,virtualScroll:g,overscroll:v,autoRaf:S,anchors:y,autoToggle:b,allowNestedScroll:T,naiveDimensions:M,stopInertiaOnNavigate:R,respectReducedMotion:A},this.dimensions=new lE(s,t,{autoResize:x}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new hE(e,{touchMultiplier:f,wheelMultiplier:m}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(s,t){return this.emitter.on(s,t)}off(s,t){return this.emitter.off(s,t)}get overflow(){let s=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[s]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}setScroll(s){this.isHorizontal?this.options.wrapper.scrollTo({left:s,behavior:"instant"}):this.options.wrapper.scrollTo({top:s,behavior:"instant"})}isTouchOnSelectionHandle(s){let t=window.getSelection();if(!t||t.isCollapsed||t.rangeCount===0)return!1;let e=s.targetTouches[0]??s.changedTouches[0];if(!e)return!1;let n=t.getRangeAt(0).getClientRects();if(n.length===0)return!1;let i=n[0],r=n[n.length-1],o=40,a=Math.hypot(e.clientX-i.left,e.clientY-i.top)<=o,l=Math.hypot(e.clientX-r.right,e.clientY-r.bottom)<=o;return a||l}resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}scrollTo(s,{offset:t=0,immediate:e=!1,lock:n=!1,programmatic:i=!0,lerp:r=i?this.options.lerp:void 0,duration:o=i?this.options.duration:void 0,easing:a=i?this.options.easing:void 0,onStart:l,onComplete:c,force:h=!1,userData:d}={}){if(this.prefersReducedMotion&&(i?e=!0:(r=1,o=void 0,a=void 0)),(this.isStopped||this.isLocked)&&!h)return;let u=s,f=t;if(typeof u=="string"&&["top","left","start","#"].includes(u))u=0;else if(typeof u=="string"&&["bottom","right","end"].includes(u))u=this.limit;else{let m=null;if(typeof u=="string"?(m=u.startsWith("#")?document.getElementById(u.slice(1)):document.querySelector(u),m||(u==="#top"?u=0:console.warn("Lenis: Target not found",u))):u instanceof Element&&(m=u),m){if(this.options.wrapper!==window){let y=this.rootElement.getBoundingClientRect();f-=this.isHorizontal?y.left:y.top}let x=m.getBoundingClientRect(),p=getComputedStyle(m),g=this.isHorizontal?Number.parseFloat(p.scrollMarginLeft):Number.parseFloat(p.scrollMarginTop),v=getComputedStyle(this.rootElement),S=this.isHorizontal?Number.parseFloat(v.scrollPaddingLeft):Number.parseFloat(v.scrollPaddingTop);u=(this.isHorizontal?x.left:x.top)+this.animatedScroll-(Number.isNaN(g)?0:g)-(Number.isNaN(S)?0:S)}}if(typeof u=="number"){if(u+=f,this.options.infinite){if(i){this.targetScroll=this.animatedScroll=this.scroll;let m=u-this.animatedScroll;m>this.limit/2?u-=this.limit:m<-this.limit/2&&(u+=this.limit)}}else u=K0(0,u,this.limit);if(u===this.targetScroll){l?.(this),c?.(this);return}if(this.userData=d??{},e){this.animatedScroll=this.targetScroll=u,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}i||(this.targetScroll=u),typeof o=="number"&&typeof a!="function"?a=$0:typeof a=="function"&&typeof o!="number"&&(o=1),this.animate.fromTo(this.animatedScroll,u,{duration:o,easing:a,lerp:r,onStart:()=>{n&&(this.isLocked=!0),this.isScrolling="smooth",l?.(this)},onUpdate:(m,x)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=m-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=m,this.setScroll(this.scroll),i&&(this.targetScroll=m),x||this.emit(),x&&(this.reset(),this.emit(),c?.(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(s,{deltaX:t,deltaY:e}){let n=Date.now();s._lenis||(s._lenis={});let i=s._lenis,r,o,a,l,c,h,d,u,f,m;if(n-(i.time??0)>2e3){i.time=Date.now();let T=window.getComputedStyle(s);if(i.computedStyle=T,r=["auto","overlay","scroll"].includes(T.overflowX),o=["auto","overlay","scroll"].includes(T.overflowY),c=["auto"].includes(T.overscrollBehaviorX),h=["auto"].includes(T.overscrollBehaviorY),i.hasOverflowX=r,i.hasOverflowY=o,!(r||o))return!1;d=s.scrollWidth,u=s.scrollHeight,f=s.clientWidth,m=s.clientHeight,a=d>f,l=u>m,i.isScrollableX=a,i.isScrollableY=l,i.scrollWidth=d,i.scrollHeight=u,i.clientWidth=f,i.clientHeight=m,i.hasOverscrollBehaviorX=c,i.hasOverscrollBehaviorY=h}else a=i.isScrollableX,l=i.isScrollableY,r=i.hasOverflowX,o=i.hasOverflowY,d=i.scrollWidth,u=i.scrollHeight,f=i.clientWidth,m=i.clientHeight,c=i.hasOverscrollBehaviorX,h=i.hasOverscrollBehaviorY;if(!(r&&a||o&&l))return!1;let x=Math.abs(t)>=Math.abs(e)?"horizontal":"vertical",p,g,v,S,y,b;if(x==="horizontal")p=Math.round(s.scrollLeft),g=d-f,v=t,S=r,y=a,b=c;else if(x==="vertical")p=Math.round(s.scrollTop),g=u-m,v=e,S=o,y=l,b=h;else return!1;return!b&&(p>=g||p<=0)?!0:(v>0?p<g:p>0)&&S&&y}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){let s=this.options.wrapper;return this.isHorizontal?s.scrollX??s.scrollLeft:s.scrollY??s.scrollTop}get scroll(){return this.options.infinite?rE(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(s){this._isScrolling!==s&&(this._isScrolling=s,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(s){this._isStopped!==s&&(this._isStopped=s,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(s){this._isLocked!==s&&(this._isLocked=s,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get prefersReducedMotion(){return this.options.respectReducedMotion&&this.reducedMotionMediaQuery.matches}get className(){let s="lenis";return this.options.autoToggle&&(s+=" lenis-autoToggle"),this.isStopped&&(s+=" lenis-stopped"),this.isLocked&&(s+=" lenis-locked"),this.isScrolling&&(s+=" lenis-scrolling"),this.isScrolling==="smooth"&&(s+=" lenis-smooth"),s}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(s=>{this.rootElement.classList.add(s)})}cleanUpClassName(){for(let s of Array.from(this.rootElement.classList))(s==="lenis"||s.startsWith("lenis-"))&&this.rootElement.classList.remove(s)}}});var OE=Sx(()=>{os();Bg();kg();Hg();Wg();xd();Yg();Jg();e0();q0();tx();la.registerPlugin($t);var Vu=matchMedia("(prefers-reduced-motion: reduce)").matches,Ma=matchMedia("(max-width: 760px)").matches||matchMedia("(pointer: coarse)").matches,Wu=(s,t=document)=>t.querySelector(s),ao=(s,t=document)=>[...t.querySelectorAll(s)],Xu=(s,t=0,e=1)=>Math.min(e,Math.max(t,s)),yr=(s,t,e)=>s+(t-s)*e,rx=s=>s*s*(3-2*s),Ri=(s,t,e)=>Xu((s-t)/(e-t)),uE=Wu("#world"),Xn=new Xh({canvas:uE,antialias:!1,powerPreference:"high-performance"}),Up=Math.min(devicePixelRatio,Ma?1.5:1.75);Xn.setPixelRatio(Up);Xn.setSize(innerWidth,innerHeight,!1);Xn.shadowMap.enabled=!0;Xn.shadowMap.type=Nr;Xn.toneMapping=Or;Xn.toneMappingExposure=1;Xn.outputColorSpace=Tn;var Bs=new Na,Wn=new qn(38,innerWidth/innerHeight,.3,3e3);Bs.fog=new Da(13216138,.0011);function ho(s,t,e,n=!0,i=[1,1]){let r=document.createElement("canvas");r.width=s,r.height=t;let o=r.getContext("2d");e(o,s,t);let a=new za(r);return a.wrapS=a.wrapT=Io,a.repeat.set(i[0],i[1]),a.anisotropy=Xn.capabilities.getMaxAnisotropy(),n&&(a.colorSpace=Tn),a}function Hp(s,t,e,n,i,r=9e3,o=2){s.fillStyle=i,s.fillRect(0,0,t,e);for(let a=0;a<r;a++){let l=Math.random();s.fillStyle=`rgba(${l>.5?255:0},${l>.5?255:0},${l>.5?255:0},${Math.random()*n})`,s.fillRect(Math.random()*t,Math.random()*e,o*Math.random()+.5,o*Math.random()+.5)}}var ex=ho(256,1024,(s,t,e)=>{s.fillStyle="#9a6a42",s.fillRect(0,0,t,e);for(let n=0;n<t;n+=1){let i=Math.sin(n*.21)*.5+Math.sin(n*.047+1)*.5;s.fillStyle=`rgba(${i>0?"60,34,16":"214,160,110"},${Math.abs(i)*.22})`,s.fillRect(n,0,1,e)}for(let n=0;n<260;n++)s.fillStyle=`rgba(50,28,12,${Math.random()*.18})`,s.fillRect(Math.random()*t,Math.random()*e,1+Math.random()*2,30+Math.random()*200)}),fE=ho(512,512,(s,t,e)=>Hp(s,t,e,.06,"#ddd5c8",26e3,2),!0,[3,3]),dE=ho(512,512,(s,t,e)=>Hp(s,t,e,.25,"#c8c8c8",2e4,3),!1,[3,3]),pE=ho(1024,1024,(s,t,e)=>{Hp(s,t,e,.07,"#8d8579",4e4,2),s.strokeStyle="rgba(40,36,30,.35)",s.lineWidth=2;for(let n=0;n<e;n+=32){s.beginPath(),s.moveTo(0,n),s.lineTo(t,n),s.stroke();let i=n/32%2?0:32;for(let r=i;r<t;r+=64)s.beginPath(),s.moveTo(r,n),s.lineTo(r,n+32),s.stroke()}},!0,[60,60]),mE=ho(512,512,(s,t,e)=>{s.fillStyle="#4b5a33",s.fillRect(0,0,t,e);for(let n=0;n<4e4;n++){let i=Math.random();s.fillStyle=`hsla(${70+i*30},${30+i*25}%,${18+i*26}%,.55)`,s.fillRect(Math.random()*t,Math.random()*e,1.2,2+Math.random()*3)}},!0,[14,14]),gE=ho(256,512,(s,t,e)=>{s.fillStyle="#000",s.fillRect(0,0,t,e);for(let n=10;n<e;n+=34)for(let i=8;i<t;i+=26)Math.random()<.42&&(s.fillStyle=`hsl(${30+Math.random()*12},${70+Math.random()*25}%,${45+Math.random()*25}%)`,s.fillRect(i,n,16,20))}),Te={stone:new Ue({color:15130579,map:fE,roughnessMap:dE,roughness:.85,metalness:0}),wood:new Ue({color:16777215,map:ex,roughness:.62,metalness:0}),glass:new Lr({color:1844784,roughness:.04,metalness:.1,transparent:!0,opacity:.38,envMapIntensity:1.6,clearcoat:1,clearcoatRoughness:.02,depthWrite:!1}),rail:new Lr({color:11059912,roughness:.05,transparent:!0,opacity:.18,envMapIntensity:1.4,depthWrite:!1}),metal:new Ue({color:2829615,roughness:.35,metalness:.9}),brass:new Ue({color:13211483,roughness:.3,metalness:1}),paving:new Ue({map:pE,roughness:.92,metalness:0}),grass:new Ue({map:mE,roughness:1}),deck:new Ue({map:ex,color:12094047,roughness:.7}),water:new Lr({color:993838,roughness:.03,metalness:.2,envMapIntensity:2.2,clearcoat:1}),city:new Ue({color:12432294,roughness:.9,emissive:16777215,emissiveMap:gE,emissiveIntensity:0}),road:new Ue({color:3092788,roughness:.7,metalness:.05}),bark:new Ue({color:4864556,roughness:1}),planter:new Ue({color:5987676,roughness:.8}),lamp:new ts({color:new Ot(4,2.6,1.4)})},Yu=[],lo={value:0},_E=new Xa,Fp=["img/wohnen-1080.webp","img/kueche-1080.webp","img/bad-1080.webp","img/loggia-1080.webp","img/lobby-1600.webp"].map(s=>{let t=_E.load(s);return t.colorSpace=Tn,t}),ox=Fp.slice(0,4).map(s=>new Ue({color:0,map:s,emissive:16777215,emissiveMap:s,emissiveIntensity:.55,roughness:1})),Kl=3.25,xE=new Ie(.12,1,.32),Gp=[],ax=[],vE=[];function yE(s,t,e,n,i,r,o={}){let a=Kl,l=o.over??1.3,c=new Jt(new Ie(n+l*2,.38,i+l*2),Te.stone);c.position.set(t,r+a-.19,e),c.castShadow=c.receiveShadow=!0,s.add(c);let h=.9,d=[[0,0,i/2-h,0,n-.6],[0,0,-i/2+h,Math.PI,n-.6],[n/2-h,0,0,Math.PI/2,i-.6],[-n/2+h,0,0,-Math.PI/2,i-.6]];for(let[S,,y,b,T]of d){let _=Math.max(1,Math.round(T/5.2)),M=T/_;for(let R=0;R<_;R++){let A=Math.random()<(o.lit??.7),D=A?ox[Math.random()*4|0]:new Ue({color:1316892,roughness:.9}),L=new Jt(new Jn(M-.05,a-.5),D),F=-T/2+M*(R+.5);L.position.set(t+S+Math.cos(b)*F,r+(a-.4)/2,e+y-Math.sin(b)*F),L.rotation.y=b,s.add(L),A&&vE.push(L)}}let u=new Jt(new Ie(n-h*2-.1,a-.4,i-h*2-.1),new Ue({color:2761243,roughness:1}));u.position.set(t,r+(a-.4)/2,e),s.add(u);let f=new Jt(new Ie(n,a-.4,i),Te.glass);if(f.position.set(t,r+(a-.4)/2,e),f.renderOrder=2,s.add(f),!o.noRail){let S=n+l*2-.1,y=i+l*2-.1;for(let[b,T,_,M]of[[0,y/2,0,S],[0,-y/2,0,S],[S/2,0,Math.PI/2,y],[-S/2,0,Math.PI/2,y]]){let R=new Jt(new Jn(M,1.05),Te.rail);R.position.set(t+b,r+a+.33,e+T),R.rotation.y=_,R.renderOrder=3,s.add(R);let A=new Jt(new Ie(M,.05,.06),Te.metal);A.position.set(t+b,r+a+.88,e+T),A.rotation.y=_,s.add(A)}}let m=o.step??1.05,x=n+l*2-.4,p=i+l*2-.4,g=new ie,v=(S,y,b)=>{g.makeRotationY(b),g.scale(new H(1,a-.38,1)),g.setPosition(S,r+(a-.38)/2,y),Gp.push(g.clone())};if(!o.noLouver){for(let S=-x/2;S<=x/2;S+=m)Math.random()<.82&&(v(t+S,e+p/2,0),v(t+S,e-p/2,0));for(let S=-p/2+m;S<p/2;S+=m)Math.random()<.82&&(v(t+x/2,e+S,Math.PI/2),v(t-x/2,e+S,Math.PI/2))}return c}var we=new Xi;Bs.add(we);function Vp(s,t,e,n,i,r={}){let o=new Xi,a=new Jt(new Ie(e+2.6,.4,n+2.6),Te.stone);a.position.set(s,.2,t),a.receiveShadow=!0,o.add(a);let l=[];for(let c=0;c<i;c++){let h=r.setback&&c>=i-r.setback?r.setbackSize:0;l.push(yE(o,s+(h&&r.sx||0),t,e-h,n-h*.6,.4+c*Kl,{lit:r.lit,noRail:c===0}))}return we.add(o),{g:o,slabs:l,top:.4+i*Kl}}var lx=Vp(0,0,24,16,6,{setback:1,setbackSize:6,sx:-3,lit:.75}),uP=Vp(36,-6,28,14,4,{lit:.6}),fP=Vp(-30,-10,18,14,5,{lit:.65}),qu=new Zn(xE,Te.wood,Gp.length);Gp.forEach((s,t)=>qu.setMatrixAt(t,s));qu.castShadow=!0;qu.receiveShadow=!0;we.add(qu);lx.slabs.forEach((s,t)=>{let e=new Jt(new Ie(s.geometry.parameters.width+.3,Kl-.2,s.geometry.parameters.depth+.3),new ts({color:new Ot(2.2,1.25,.55),transparent:!0,opacity:0,depthWrite:!1,blending:Ur}));e.position.set(s.position.x,s.position.y-Kl/2+.2,s.position.z),we.add(e),ax.push(e)});{let s=new Jt(new Jn(9,5.1),new Ue({color:0,map:Fp[4],emissive:16777215,emissiveMap:Fp[4],emissiveIntensity:.9}));s.position.set(-2,.4+2.6,8-.95),we.add(s);let t=new Jt(new Ie(10,.25,3.2),Te.wood);t.position.set(-2,4.1,9.6),t.castShadow=!0,we.add(t);for(let n of[-6.8,2.8]){let i=new Jt(new Ie(.18,3.7,.18),Te.metal);i.position.set(n,2.25,11),we.add(i)}let e=new Jt(new Ie(3.2,.12,.04),Te.brass);e.position.set(-2,4.36,11.22),we.add(e)}var $l=lx.top;{let s=new Jt(new Ie(23,.12,17),Te.deck);s.position.set(3,$l+.06,0),s.receiveShadow=!0,we.add(s);for(let r=0;r<7;r++){let o=new Jt(new Ie(2.4,.7,.9),Te.planter);o.position.set(-8+r*3.3,$l+.45,7.4),o.castShadow=!0,we.add(o)}let t=[];for(let r=0;r<40;r++){let o=r/39;t.push(new H(yr(-6,13,o),$l+3-Math.sin(o*Math.PI*4)**2*.4,5.5))}let e=new Ir(.07,8,6),n=new Zn(e,Te.lamp,t.length);t.forEach((r,o)=>n.setMatrixAt(o,new ie().setPosition(r))),we.add(n);let i=new Jt(new Ie(5,.08,1.1),Te.wood);i.position.set(4,$l+.85,2.5),i.castShadow=!0,we.add(i)}var cx=[];function Zu(s,t,e=1){cx.push([s,t,e])}var hx=(s,t)=>s>-14&&s<72&&t>8&&t<80||s>-90&&s<-40&&t>60&&t<170;for(let s=-150;s<=150;s+=11)hx(s,19)||Zu(s+Math.random()*2,19.5+Math.random(),.75+Math.random()*.2);for(let s=0;s<140;s++){let t=-150+Math.random()*300,e=36+Math.random()*125;(!hx(t,e)||Math.random()<.25)&&Zu(t,e,.9+Math.random()*.7)}for(let s=0;s<6;s++)Zu(14+Math.random()*10,-2+Math.random()*10,.7+Math.random()*.3);for(let[s,t]of[[-3,6.5],[4,6.5],[9,6.5]])Zu(s,t-0,.32);{let s=[],t=[],e=new Ga(1,4);e.deleteAttribute("normal"),e.deleteAttribute("uv"),e=Zg(e);let n=e.attributes.position,i=new H,r=[];for(let x=0;x<n.count;x++){i.fromBufferAttribute(n,x);let p=1+Math.sin(i.x*4.1)*Math.cos(i.y*3.3)*Math.sin(i.z*5.2)*.14;i.multiplyScalar(p),n.setXYZ(x,i.x,i.y,i.z);let g=.45+.55*Xu(i.y*.5+.5);r.push(g,g,g)}e.setAttribute("color",new Pe(r,3)),e.computeVertexNormals();let o=ho(256,256,(x,p,g)=>{x.fillStyle="#808080",x.fillRect(0,0,p,g);for(let v=0;v<2600;v++){let S=Math.random()*255|0;x.fillStyle=`rgb(${S},${S},${S})`,x.beginPath(),x.ellipse(Math.random()*p,Math.random()*g,2+Math.random()*3,1+Math.random()*2,Math.random()*3,0,7),x.fill()}},!1,[1,1]),a=[];for(let x=0;x<n.count;x++)i.fromBufferAttribute(n,x),a.push(Math.atan2(i.z,i.x)*1.6,i.y*2.2);e.setAttribute("uv",new Pe(a,2));let l=new Ue({color:16777215,vertexColors:!0,roughness:.8,metalness:0,bumpMap:o,bumpScale:3.5});l.onBeforeCompile=x=>{x.uniforms.uTime=lo,x.vertexShader=`uniform float uTime;
`+x.vertexShader.replace("#include <begin_vertex>",`#include <begin_vertex>
      vec4 wp = instanceMatrix * vec4(0.,0.,0.,1.);
      float sw = sin(uTime*1.3 + wp.x*.21 + wp.z*.17) * .18 + sin(uTime*2.7 + wp.z*.4)*.06;
      transformed.x += sw * (position.y + 1.) * .5; transformed.z += sw*.4 * (position.y+1.)*.5;`)};let c=new ie,h=new ri,d=new Ot,u=[];for(let[x,p,g]of cx){let v=g<.4,S=v?$l+.8:0,y=v?1.1:g,b=(v?2.6:5+Math.random()*3)*y;t.push(new ie().compose(new H(x,S+b/2,v?-5:p),h,new H(y,b,y)));let T=5+(Math.random()*4|0);for(let _=0;_<T;_++){let M=(1+Math.random()*1)*y*(v?.55:1);c.compose(new H(x+(Math.random()-.5)*2.4*y,S+b+(Math.random()-.2)*1.8*y,(v?-5:p)+(Math.random()-.5)*2.4*y),h.setFromEuler(new oi(Math.random()*3,Math.random()*3,0)),new H(M,M*(.85+Math.random()*.3),M)),s.push(c.clone()),d.setHSL(.19+Math.random()*.08,.3+Math.random()*.2,.2+Math.random()*.1),u.push(d.clone())}}let f=new Zn(e,l,s.length);s.forEach((x,p)=>{f.setMatrixAt(p,x),f.setColorAt(p,u[p])}),f.castShadow=!0,f.receiveShadow=!0,we.add(f);let m=new Zn(new Ks(.09,.16,1,6),Te.bark,t.length);t.forEach((x,p)=>m.setMatrixAt(p,x)),m.castShadow=!0,we.add(m)}{let s=new Jt(new Jn(2400,2400),Te.paving);s.rotation.x=-Math.PI/2,s.receiveShadow=!0,we.add(s);let t=new Jt(new Jn(320,130),Te.grass);t.rotation.x=-Math.PI/2,t.position.set(0,.03,95),t.receiveShadow=!0,we.add(t);let e=new Jt(new Jn(14,10),Te.grass);e.rotation.x=-Math.PI/2,e.position.set(19,.05,4),e.receiveShadow=!0,we.add(e);let n=new Jt(new Jn(12,3.2),Te.water);n.rotation.x=-Math.PI/2,n.position.set(-12,.07,14),we.add(n);let i=new Jt(new Jn(2400,12),Te.road);i.rotation.x=-Math.PI/2,i.position.set(0,.04,26),i.receiveShadow=!0,we.add(i);let r=new Jt(new Jn(10,2400),Te.road);r.rotation.x=-Math.PI/2,r.position.set(62,.045,0),r.receiveShadow=!0,we.add(r);for(let v of[24.2,27.8]){let S=new Jt(new Ie(2400,.04,.08),Te.metal);S.position.set(0,.07,v),we.add(S)}let o=[];for(let v=-200;v<=200;v+=18)o.push(v);let a=new Zn(new Ks(.06,.08,6,6),Te.metal,o.length),l=new Zn(new Ir(.22,10,8),Te.lamp,o.length);o.forEach((v,S)=>{a.setMatrixAt(S,new ie().setPosition(v,3,19.5)),l.setMatrixAt(S,new ie().setPosition(v,6,19.5))}),we.add(a,l);let c=[],h=[15326404,14205856,13220006,14866118,12559754,14077892,12881772];for(let v=-6;v<=6;v++)for(let S=-6;S<=6;S++){let y=v*92,b=S*92-20;if(y>-110&&y<110&&b>-70&&b<175)continue;let T=74,_=13,M=15+Math.random()*7,R=h[Math.random()*h.length|0];for(let[A,D,L,F]of[[y,b-T/2+_/2,T,_],[y,b+T/2-_/2,T,_],[y-T/2+_/2,b,_,T-_*2],[y+T/2-_/2,b,_,T-_*2]]){if(Math.random()<.08)continue;let P=Math.random()<.5?2:1;for(let B=0;B<P;B++){let k=L>F?L/P:L,O=L>F?F:F/P,Q=L>F?(B-(P-1)/2)*k:0,W=L>F?0:(B-(P-1)/2)*O;c.push([A+Q,D+W,k-.4,O-.4,M+(Math.random()-.5)*3,R])}}}let d=new Zn(new Ie(1,1,1),Te.city,c.length),u=new Zn(new Ks(.5,.5,1,3,1),new Ue({color:6967368,roughness:.7}),c.length),f=new ie,m=new ri,x=new Ot;c.forEach(([v,S,y,b,T,_],M)=>{d.setMatrixAt(M,f.compose(new H(v,T/2,S),m.identity(),new H(y,T,b))),d.setColorAt(M,x.set(_).offsetHSL(0,0,(Math.random()-.5)*.06));let R=y>b;m.setFromEuler(new oi(R?0:Math.PI/2,R?Math.PI/2:0,R?Math.PI/2:0,"YXZ"));let A=new oi(0,0,0),D=new ri().setFromEuler(new oi(0,R?0:Math.PI/2,Math.PI/2));u.setMatrixAt(M,f.compose(new H(v,T+2.2,S),D,new H(4.4,R?y:b,(R?b:y)*1))),m.identity()}),d.castShadow=d.receiveShadow=!0,u.castShadow=!0,we.add(d,u);let p=new Jt(new Oo(5,40,8),Te.stone);p.position.set(-260,50,-380),we.add(p);let g=new Jt(new Ie(10,32,10),Te.stone);g.position.set(-260,16,-380),we.add(g)}var Jl=new Xi;{let s=new Jt(new Ie(30,3.2,2.6),new Ue({color:14275785,roughness:.4,metalness:.2}));s.position.y=1.9,s.castShadow=!0,Jl.add(s);let t=new Jt(new Ie(30.05,1.1,2.65),new Ue({color:273,emissive:new Ot(1,.75,.45),emissiveIntensity:1.6,roughness:.2}));t.position.y=2.3,Jl.add(t),Jl.position.set(-300,0,26),we.add(Jl),Yu.push(e=>{Jl.position.x=e*9%700-350})}{let s=new Zn(new Ie(1.8,1.3,4.3),new Ue({color:3817285,roughness:.3,metalness:.6}),8),t=new Zn(new Ie(1.4,.15,.05),Te.lamp,8);we.add(s,t);let e=new ie;Yu.push(n=>{for(let i=0;i<8;i++){let r=i%2?1:-1,o=((n*11*r+i*97)%600+600)%600-300,a=62+r*2.4;e.makeRotationY(r>0?0:Math.PI),e.setPosition(a,.8,o),s.setMatrixAt(i,e),e.setPosition(a,.85,o+r*2.18),t.setMatrixAt(i,e)}s.instanceMatrix.needsUpdate=t.instanceMatrix.needsUpdate=!0})}{let s=new Zn(new Oo(.25,.9,3),new ts({color:1776153}),9);we.add(s);let t=new ie;Yu.push(e=>{for(let n=0;n<9;n++){let i=e*.05+n*.013;t.makeRotationZ(Math.PI/2),t.setPosition(-200+i*4e3%400+n%3*3,60+Math.sin(e+n)*1.5+(n/3|0)*2,-40+n*2.2),s.setMatrixAt(n,t)}s.instanceMatrix.needsUpdate=!0})}var vr={top:{value:new Ot},mid:{value:new Ot},hor:{value:new Ot},sunDir:{value:new H},sunCol:{value:new Ot}},ME=new Jt(new Ir(1500,32,16),new ln({side:wn,depthWrite:!1,fog:!1,uniforms:vr,vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`uniform vec3 top,mid,hor,sunDir,sunCol; varying vec3 vP;
  void main(){ float h = clamp(vP.y,0.,1.); vec3 c = mix(hor, mid, smoothstep(0.,.18,h)); c = mix(c, top, smoothstep(.15,.7,h));
  float s = max(dot(normalize(vP), normalize(sunDir)), 0.); c += sunCol * (pow(s, 900.)*6. + pow(s, 12.)*.35 + pow(s,3.)*.12);
  if(vP.y<0.) c = hor*.75; gl_FragColor = vec4(c,1.); }`}));Bs.add(ME);var Ci=new Ja(16761994,3);Ci.castShadow=!0;Ci.shadow.mapSize.set(Ma?1024:2048,Ma?1024:2048);Object.assign(Ci.shadow.camera,{left:-70,right:70,top:70,bottom:-70,near:10,far:400});Ci.shadow.radius=4;Ci.shadow.blurSamples=12;Ci.shadow.bias=-4e-4;Ci.shadow.normalBias=.04;Bs.add(Ci,Ci.target);var SE=new qa(12110048,3812898,.25);Bs.add(SE);var bE=new Yo(Xn);new Zh().load("tex/sky-1k.hdr",s=>{Bs.environment=bE.fromEquirectangular(s).texture,s.dispose(),document.documentElement.classList.add("ready")});var Gu=[{top:4156830,mid:10467017,hor:15975823,sun:16762767,si:3.2,el:.2,env:.75,win:.35,fog:14201998,exp:1},{top:2902648,mid:10128032,hor:16753249,sun:16751189,si:2.4,el:.09,env:.55,win:.7,fog:13210736,exp:1.05},{top:1583178,mid:5000560,hor:14251594,sun:16742970,si:1.1,el:.03,env:.35,win:1.25,fog:7035486,exp:1.12},{top:726056,mid:1977420,hor:5917282,sun:9412863,si:.25,el:0,env:.22,win:1.7,fog:2764866,exp:1.18}],TE=new Ot,wE=new Ot;function ux(s){s=Xu(s,0,Gu.length-1);let t=Math.min(Gu.length-2,Math.floor(s)),e=rx(s-t),n=Gu[t],i=Gu[t+1],r=(c,h)=>h.copy(TE.set(n[c])).lerp(wE.set(i[c]),e);r("top",vr.top.value),r("mid",vr.mid.value),r("hor",vr.hor.value),r("sun",vr.sunCol.value),r("fog",Bs.fog.color),Ci.color.copy(vr.sunCol.value),Ci.intensity=yr(n.si,i.si,e);let o=yr(n.el,i.el,e),a=-2.35+s*.12;vr.sunDir.value.set(Math.cos(a)*Math.cos(o),Math.sin(o)+.02,Math.sin(a)*Math.cos(o)).normalize(),Ci.position.copy(vr.sunDir.value).multiplyScalar(180).add(new H(0,30,0)),Ci.target.position.set(0,0,0),Bs.environmentIntensity=yr(n.env,i.env,e);let l=yr(n.win,i.win,e);ox.forEach(c=>c.emissiveIntensity=l),Te.city.emissiveIntensity=l*.45,Xn.toneMappingExposure=yr(n.exp,i.exp,e)}var EE=new je(innerWidth*Up,innerHeight*Up,{type:He,samples:Ma?2:4}),co=new $h(Xn,EE);co.addPass(new Kh(Bs,Wn));var fx=new Ko(new kt(innerWidth,innerHeight),.45,.55,.92);co.addPass(fx);var AE=new $o({uniforms:{tDiffuse:{value:null},uT:lo,uV:{value:.9}},vertexShader:"varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",fragmentShader:`uniform sampler2D tDiffuse; uniform float uT, uV; varying vec2 vUv;
   float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
   void main(){ vec2 d = vUv-.5; float r = dot(d,d);
     vec3 c; c.r = texture2D(tDiffuse, vUv + d*r*.006).r; c.g = texture2D(tDiffuse, vUv).g; c.b = texture2D(tDiffuse, vUv - d*r*.006).b;
     c *= mix(1., 1.-r*1.35, uV); c += (h(vUv*1000.+uT)-.5)*.022; gl_FragColor = vec4(c,1.); }`});co.addPass(AE);co.addPass(new Qh);var zt=(s,t,e)=>new H(s,t,e),Op={hero:{poses:[[zt(-74,40,118),zt(4,10,0),34],[zt(-60,32,92),zt(0,11,0),36]],tod:[0,.1]},aussen:{poses:[[zt(-60,32,92),zt(0,11,0),36],[zt(-75,18,10),zt(0,10,0),38],[zt(-46,22,-62),zt(4,10,0),38],[zt(48,26,-58),zt(4,9,0),38],[zt(62,14,40),zt(0,8,0),38],[zt(16,4.5,46),zt(-2,3,8),40]],tod:[.1,.45]},lobby:{poses:[[zt(16,4.5,46),zt(-2,3,8),40],[zt(2,2.6,26),zt(-2,2.7,8),42],[zt(-2,2.6,14),zt(-2,2.7,6),46],[zt(-2,2.7,9.5),zt(-2,2.7,6),52]],tod:[.45,.55]},wohnen:{poses:[[zt(-2,2.7,9.5),zt(-2,2.7,6),52],[zt(20,9,34),zt(4,12,8),42],[zt(9,11.6,21),zt(7,11.8,7),40],[zt(7,11.8,10.2),zt(7,11.8,6),48],[zt(52,22,70),zt(0,10,0),34],[zt(56,24,66),zt(0,11,0),33]],tod:[.55,1.2]},dach:{poses:[[zt(56,24,66),zt(0,11,0),33],[zt(34,34,40),zt(3,21,2),38],[zt(16,23.6,18),zt(4,21,4),44],[zt(8,22.2,10),zt(-2,22,-2),52]],tod:[1.2,2]},lage:{poses:[[zt(30,140,220),zt(0,0,40),40],[zt(-80,240,260),zt(0,0,30),42],[zt(-150,300,120),zt(0,0,0),42]],tod:[2,2.5]},final:{poses:[[zt(-150,300,120),zt(0,0,0),42],[zt(-40,14,70),zt(0,13,0),34],[zt(-28,5,52),zt(0,15,0),36]],tod:[2.5,3]}};for(let s in Op){let t=Op[s];t.curve=new Bo(t.poses.map(e=>e[0]),!1,"centripetal"),t.tcurve=new Bo(t.poses.map(e=>e[1]),!1,"centripetal")}var xe={ch:"hero",p:0,mx:0,my:0,mxs:0,mys:0},nx=new H;function RE(){let s=Op[xe.ch],t=s.poses.length-1,e=xe.p,n=Math.min(t-1,Math.floor(e*t)),i=e*t-n,r=(n+(i<0?0:(1-Math.cos(i*Math.PI))/2))/t;s.curve.getPoint(r,Wn.position),s.tcurve.getPoint(r,nx);let o=yr(s.poses[n][2],s.poses[Math.min(t,n+1)][2],(1-Math.cos(Xu(i)*Math.PI))/2);Math.abs(Wn.fov-o)>.01&&(Wn.fov=o,Wn.updateProjectionMatrix());let a=lo.value;Wn.position.x+=Math.sin(a*.31)*.12+xe.mxs*1.2,Wn.position.y+=Math.sin(a*.23)*.08+xe.mys*.6,Wn.lookAt(nx),ux(yr(s.tod[0],s.tod[1],e)),Wn.position.y<1.2&&(Wn.position.y=1.2)}var Mr=Wu("#film"),CE=Mr.getContext("2d"),Dp={};function Bp(s,t=73){if(Dp[s])return Dp[s];let e=Ma?"m":"d",n=[];for(let i=1;i<=t;i++){let r=new Image;r.decoding="async",r.src=`film/${s}/${e}/${String(i).padStart(3,"0")}.webp`,n.push(r)}return Dp[s]=n}function dx(){Mr.width=Math.round(innerWidth*Math.min(devicePixelRatio,1.5)),Mr.height=Math.round(innerHeight*Math.min(devicePixelRatio,1.5))}dx();var zp="";function ix(s,t,e,n){if(Mr.style.opacity=e.toFixed(3),e<=.001)return;let i=Bp(s),r=Math.round(t*(i.length-1)),o=i[r];for(let d=r;d>=0&&!(o&&o.complete&&o.naturalWidth);d--)o=i[d];if(!o||!o.naturalWidth)return;let a=s+r+n.toFixed(3);if(a===zp)return;zp=a;let l=Mr.width,c=Mr.height,h=Math.max(l/o.naturalWidth,c/o.naturalHeight)*n;CE.drawImage(o,(l-o.naturalWidth*h)/2,(c-o.naturalHeight*h)/2,o.naturalWidth*h,o.naturalHeight*h)}var kp={lobby:[.5,.62,5],wohnen:[.46,.56,.78],dach:[.55,.66,5]},PE={wohnen:"lobby",lage:"dach"},Ju=new j0({duration:Vu?0:1.15,smoothWheel:!Vu,easing:s=>1-Math.pow(1-s,3)});Ju.on("scroll",$t.update);la.ticker.add(s=>Ju.raf(s*1e3));la.ticker.lagSmoothing(0);ao('a[href^="#"]').forEach(s=>s.addEventListener("click",t=>{let e=Wu(s.getAttribute("href"));e&&(t.preventDefault(),Ju.scrollTo(e,{offset:0}))}));var IE=Wu("#progress i"),LE=ao(".chapters a");ao("[data-ch]").forEach(s=>{let t=s.dataset.ch;$t.create({trigger:s,start:"top top",end:"bottom bottom",onUpdate:n=>{xe.ch=t,xe.p=n.progress},onToggle:n=>{n.isActive&&(xe.ch=t,xe.p=n.progress,LE.forEach(i=>i.classList.toggle("on",i.dataset.to===t)),document.body.dataset.ch=t)},onEnter:()=>{let n=s.nextElementSibling?.dataset?.ch;kp[t]&&Bp(t),n&&kp[n]&&Bp(n)}});let e=ao("[data-in]",s);$t.create({trigger:s,start:"top top",end:"bottom bottom",onUpdate:n=>sx(e,n.progress),onRefresh:n=>sx(e,n.progress)})});function sx(s,t){for(let e of s){let n=+e.dataset.in,i=+(e.dataset.out??2),r=Ri(t,n,n+.06)*(1-Ri(t,i-.06,i));e.style.opacity=r.toFixed(3),e.style.transform=`translate3d(0, ${((1-Ri(t,n,n+.08))*28-Ri(t,i-.06,i)*18).toFixed(1)}px, 0)`,e.style.visibility=r<.01?"hidden":"visible",e.classList.toggle("live",r>.5)}}$t.create({start:0,end:"max",onUpdate:s=>{IE.style.transform=`scaleY(${s.progress.toFixed(4)})`}});var px=ao(".unit"),ya=-1;px.forEach(s=>{s.addEventListener("pointerenter",()=>ya=+s.dataset.floor),s.addEventListener("pointerleave",()=>ya=-1),s.addEventListener("focusin",()=>ya=+s.dataset.floor),s.addEventListener("focusout",()=>ya=-1)});function DE(){let s=-1;xe.ch==="wohnen"&&xe.p>.8&&(s=Math.min(5,Math.floor(Ri(xe.p,.8,1)*4)+1)),ya>=0&&(s=ya),ax.forEach((t,e)=>{t.material.opacity+=((e===s?.42:0)-t.material.opacity)*.12}),px.forEach(t=>t.classList.toggle("on",+t.dataset.floor===s))}var NE=ao(".pin").map(s=>({el:s,v:new H(...s.dataset.xyz.split(",").map(Number))})),Np=new H;function UE(){let s=xe.ch==="lage"?Ri(xe.p,.12,.3)*(1-Ri(xe.p,.9,1)):0;NE.forEach(({el:t,v:e},n)=>{Np.copy(e).project(Wn);let i=s*Ri(xe.p,.15+n*.05,.25+n*.05);t.style.opacity=i.toFixed(3),t.style.transform=`translate3d(${((Np.x*.5+.5)*innerWidth).toFixed(1)}px, ${((-Np.y*.5+.5)*innerHeight).toFixed(1)}px, 0)`})}!Ma&&!Vu&&addEventListener("pointermove",s=>{xe.mx=s.clientX/innerWidth-.5,xe.my=s.clientY/innerHeight-.5});var mx={l:performance.now(),getDelta(){let s=performance.now(),t=(s-this.l)/1e3;return this.l=s,t}},gx=!0;document.addEventListener("visibilitychange",()=>{gx=!document.hidden});var oo={n:0,t:0,low:0};function _x(){let s=Math.min(mx.getDelta(),.05);if(!gx)return;lo.value+=Vu?0:s,xe.mxs+=(xe.mx-xe.mxs)*.04,xe.mys+=(xe.my-xe.mys)*.04,Yu.forEach(n=>n(lo.value)),RE(),DE(),UE();let t=kp[xe.ch],e=PE[xe.ch];if(e&&xe.p<.12&&(!t||xe.p<t[0])){let n=1-rx(Ri(xe.p,.02,.11));ix(e,1,n,1),document.body.classList.toggle("in-film",n>.5)}else if(t){let n=xe.p,i=Ri(n,t[0],t[1])*(t[2]>=1?1:1-Ri(n,t[2],t[2]+.06)),r=Math.min(t[2],1);ix(xe.ch,Ri(n,t[0],r),i,1.08-Ri(n,t[0],r)*.08),document.body.classList.toggle("in-film",i>.5)}else Mr.style.opacity=0,document.body.classList.remove("in-film");+Mr.style.opacity<.999&&co.render(s),oo.n++,oo.t+=s,oo.t>2&&(oo.n/oo.t<32&&Xn.getPixelRatio()>1&&(Xn.setPixelRatio(Math.max(1,Xn.getPixelRatio()-.25)),vx()),oo.n=oo.t=0)}var FE=/[?&]capture/.test(location.search);FE||la.ticker.add(_x);function xx(){let s=innerWidth,t=innerHeight;s<761?Wn.setViewOffset(s,t,0,t*.17,s,t):Wn.setViewOffset(s,t,-s*.1,0,s,t)}function vx(){Wn.aspect=innerWidth/innerHeight,xx(),Wn.updateProjectionMatrix(),Xn.setSize(innerWidth,innerHeight,!1),co.setPixelRatio(Xn.getPixelRatio()),co.setSize(innerWidth,innerHeight),fx.setSize(innerWidth,innerHeight),dx(),zp=""}addEventListener("resize",vx);xx();Wn.updateProjectionMatrix();ux(0);window.__q={state:xe,lenis:Ju,frame:(s=1,t=1/30)=>{for(let e=0;e<s;e++)mx.getDelta(),lo.value+=t,_x()},setT:s=>{lo.value=s}};ao("[data-split]").forEach(s=>{s.innerHTML=s.innerHTML.split(/(<br>)/).map(t=>t==="<br>"?t:t.split(" ").map(e=>`<span class="w"><span>${e}</span></span>`).join(" ")).join("")});requestAnimationFrame(()=>document.body.classList.add("go"))});export default OE();
