// Emit frame-0 particle data matching gen.mjs exactly (same seed/order) so the
// static Figma mark is pixel-identical to the Lottie's first frame.
const C=128,R=98,N=28,TILT=16*Math.PI/180,GA=Math.PI*(3-Math.sqrt(5));
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd=mulberry32(7);
const pts=[];
for(let i=0;i<N;i++){const yy=1-(i/(N-1))*2,rad=Math.sqrt(1-yy*yy),th=i*GA;let x=Math.cos(th)*rad*R,y=yy*R,z=Math.sin(th)*rad*R;const y2=y*Math.cos(TILT)-z*Math.sin(TILT),z2=y*Math.sin(TILT)+z*Math.cos(TILT);pts.push({x,y:y2,z:z2});}
const out=[];
for(let i=0;i<N;i++){const big=rnd()<0.4;const isSq=rnd()<0.34,isAcc=rnd()<0.42;const sz=big?(4.5+rnd()*3.5):(2.2+rnd()*2);const P=pts[i];const d=(P.z+R)/(2*R);const eff=+(sz*(0.5+0.7*d)).toFixed(2);const baseOp=isAcc?92:58;const op=+((baseOp*(0.3+0.7*d))/100).toFixed(3);out.push({x:+(C+P.x).toFixed(1),y:+(C-P.y).toFixed(1),s:eff,o:op,c:isAcc?1:0,q:isSq?1:0,g:(isAcc&&big)?1:0,z:+d.toFixed(3)});}
out.sort((a,b)=>a.z-b.z); // back-to-front paint order
console.log(JSON.stringify(out));
