import{d as x,f as S,r as d,z as U,o as i,c,a as t,w as u,v as k,g as s,i as w,x as B,J as h,F as I,D as M,Q as D,h as L,p as N,e as V}from"./index-DQb3qgME.js";import{M as b}from"./MyCard-D9OjYwNM.js";import{_ as z}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./perm-B5m12WYu.js";import"./laboratory-CLtynE2K.js";const v=l=>(N("data-v-1066bf1c"),l=l(),V(),l),C={class:"container-list"},F={class:"list-header"},Q=v(()=>t("span",null,"Usuarios do sistema",-1)),A={key:0,class:"info"},E={key:1,class:"list"},J={class:"info"},R=v(()=>t("h3",null,"Nenhum usuário encontrado!",-1)),T=[R],j=x({__name:"ListUsuarios",setup(l){const y=S();let a=d(),r=d(),n=d(!1);U(async()=>{await g()});async function g(){n.value=!0;const o=await y.getAllUsuarios();o.length!==0?(n.value=!1,a.value=o):(n.value=!1,a.value=o.list,alert(o.message))}return(o,p)=>{var _,m;return i(),c("div",C,[t("div",F,[Q,u(t("input",{type:"text",placeholder:"Buscar usuários...","onUpdate:modelValue":p[0]||(p[0]=e=>w(r)?r.value=e:r=e)},null,512),[[k,s(r)]])]),s(n)?(i(),c("div",A,[B(s(D),{size:"20px",color:"primary"})])):(i(),c("div",E,[u(t("div",null,[(i(!0),c(I,null,M(s(a),e=>{var f;return i(),L(b,{key:e.id,type:3,"id-user":e.id,title:e.primeiro_nome+" "+e.segundo_nome,"date-create":e.data_inicial,summary:(f=e.permissao)==null?void 0:f.title},null,8,["id-user","title","date-create","summary"])}),128))],512),[[h,((_=s(a))==null?void 0:_.length)!==0]]),u(t("div",J,T,512),[[h,((m=s(a))==null?void 0:m.length)===0]])]))])}}}),P=z(j,[["__scopeId","data-v-1066bf1c"]]);export{P as default};
