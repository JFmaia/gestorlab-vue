import{d as g,r as c,z as L,o as r,c as d,a,w as _,v as x,g as t,i as b,x as S,J as f,F as k,D as w,p as B,e as I,Q as M,h as D}from"./index-CS_LqtFy.js";import{l as N}from"./laboratory-BdmdquDP.js";import{M as V}from"./MyCard-BZ2yIT6q.js";import{_ as z}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./perm-CFx_5xxQ.js";const h=i=>(B("data-v-408c7efe"),i=i(),I(),i),C={class:"container-list"},F={class:"list-header"},Q=h(()=>a("span",null,"Laboratórios do sistema",-1)),A={key:0,class:"info"},E={key:1,class:"list"},J={class:"info"},R=h(()=>a("h3",null,"Nenhum laboratório encontrado!",-1)),T=[R],U=g({__name:"ListLaboratorios",setup(i){const v=N();let o=c(),l=c(),n=c(!1);L(async()=>{await y()});async function y(){n.value=!0;const s=await v.getAllLaboratorys();s.length!==0?(n.value=!1,o.value=s):(n.value=!1,o.value=s.list,alert(s.message))}return(s,p)=>{var u,m;return r(),d("div",C,[a("div",F,[Q,_(a("input",{type:"text",placeholder:"Buscar laboratório","onUpdate:modelValue":p[0]||(p[0]=e=>b(l)?l.value=e:l=e)},null,512),[[x,t(l)]])]),t(n)?(r(),d("div",A,[S(t(M),{size:"20px",color:"primary"})])):(r(),d("div",E,[_(a("div",null,[(r(!0),d(k,null,w(t(o),e=>(r(),D(V,{key:e.id,type:5,"id-lab":e.id,title:e.nome,"date-create":e.data_inicial,summary:e.coordenador.primeiro_nome+" "+e.coordenador.segundo_nome},null,8,["id-lab","title","date-create","summary"]))),128))],512),[[f,((u=t(o))==null?void 0:u.length)!==0]]),_(a("div",J,T,512),[[f,((m=t(o))==null?void 0:m.length)===0]])]))])}}}),O=z(U,[["__scopeId","data-v-408c7efe"]]);export{O as default};