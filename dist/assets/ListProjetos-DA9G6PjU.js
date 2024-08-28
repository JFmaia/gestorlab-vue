import{d as nt,u as rt,f as dt,s as ct,r as u,z as ut,o as i,c as n,x as a,K as _,g as e,i as Q,a as t,w as b,v as _t,J as D,F as S,D as I,k as W,E as G,t as r,j as pt,p as ht,e as ft,a6 as vt,Q as gt,h as L,a3 as H,W as g,a4 as mt,q as yt,P as kt,S as O,R as jt,T as Ct}from"./index-CS_LqtFy.js";import{p as Pt,M as bt}from"./MyCard-BZ2yIT6q.js";import{l as St}from"./laboratory-BdmdquDP.js";import{M as wt}from"./ModalCreateProject-CrqZoMN5.js";import{_ as xt}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./perm-CFx_5xxQ.js";import"./vee-validate.esm-3qQCVtCt.js";const d=k=>(ht("data-v-a3387714"),k=k(),ft(),k),Qt={class:"container-list"},Dt={class:"list-header"},It=d(()=>t("span",null,"Projetos",-1)),Lt={key:0,class:"info"},Mt={key:1,class:"list"},Vt={class:"span-article"},Nt={class:"info"},Tt=d(()=>t("h3",null,"Nenhum laboratório encontrado!",-1)),$t=[Tt],Bt=d(()=>t("div",{class:"divider"},null,-1)),Et={class:"project-container"},Ut={class:"profile-project"},zt={class:"box-profile"},Ft=["src"],Rt={onClick:()=>{}},qt=d(()=>t("button",{onClick:()=>{}}," Editar o laboratório ",-1)),At={class:"body-lab"},Jt={style:{display:"flex","flex-direction":"row","align-items":"center",gap:"1rem","justify-content":"space-between"}},Kt={class:"button-bar"},Wt={key:0},Gt={key:1,style:{padding:"0.6rem"}},Ht={class:"menu-lab-projeto"},Ot=["src"],Xt={class:"nameUser"},Yt=d(()=>t("button",{style:{padding:"0.6rem"}}," Adicionar membro ",-1)),Zt=d(()=>t("h2",null,"Membros",-1)),te={key:0,class:"info-empty"},ee=d(()=>t("h3",null,"Não a nenhum membro no laboratório!",-1)),oe=[ee],se={key:1},ae=d(()=>t("h2",null,"Laboratório",-1)),le=d(()=>t("h2",null,"Descrição",-1)),ie=d(()=>t("h2",null,"Data de criação",-1)),ne=d(()=>t("h2",null,"Ultima atualização",-1)),re=nt({__name:"ListProjetos",setup(k){const X=rt(),M=Pt(),V=dt(),w=ct(),Y=St();let p=u(!1),s=u(),h=u(null),N=u(),Z=u(),m=u(),j=u(),tt=u(!1),x=u(!1),T=u();ut(async()=>{x.value=!0,N.value=V.getlaboratory,Z.value=V.getUser,await ot(),x.value=!1});function et(){p.value=!0}async function ot(){const c=await M.getListAllProjetos(w.getToken);c.listProject.length!==0?m.value=c.listProject:m.value=[]}async function st(c){p.value=c}async function at(){var l;const c=await M.deleteProjeto((l=s.value)==null?void 0:l.id,w.getToken);c?X.push("/projetos"):(tt.value=!1,alert(c))}async function lt(c){var y;s.value=c;const l=await Y.getLaboratory(s.value.laboratorio_id,w.getToken),f=l==null?void 0:l.membros,v=(y=s.value)==null?void 0:y.membros;T.value=f==null?void 0:f.filter(C=>!(v!=null&&v.some(P=>P.id===C.id)))}return(c,l)=>{var f,v,y,C,P,$,B,E,U,z,F,R,q,A,J,K;return i(),n(S,null,[a(e(vt),{modelValue:e(p),"onUpdate:modelValue":l[0]||(l[0]=o=>Q(p)?p.value=o:p=o)},{default:_(()=>{var o;return[a(wt,{"id-lab":((o=e(N))==null?void 0:o.id)??"",onEvent:st},null,8,["id-lab"])]}),_:1},8,["modelValue"]),t("div",Qt,[t("div",Dt,[It,b(t("input",{type:"text",placeholder:"Buscar projeto","onUpdate:modelValue":l[1]||(l[1]=o=>Q(j)?j.value=o:j=o)},null,512),[[_t,e(j)]])]),e(x)?(i(),n("div",Lt,[a(e(gt),{size:"20px",color:"primary"})])):(i(),n("div",Mt,[b(t("div",null,[(i(!0),n(S,null,I(e(m),o=>(i(),L(e(mt),{key:o.id,onClick:W(it=>lt(o),["prevent"]),dark:"",bordered:"",class:"card-project"},{default:_(()=>[a(e(H),null,{default:_(()=>[t("article",null,[t("h1",null,r(o.titulo),1),t("p",null,r(o.data_inicial),1)])]),_:2},1024),a(e(g),{dark:""}),a(e(H),null,{default:_(()=>[t("span",Vt,r(o.descricao),1)]),_:2},1024)]),_:2},1032,["onClick"]))),128))],512),[[D,((f=e(m))==null?void 0:f.length)!==0]]),b(t("div",Nt,$t,512),[[D,((v=e(m))==null?void 0:v.length)===0]])])),t("button",{onClick:l[2]||(l[2]=W(o=>et(),["prevent"]))}," Criar Projeto "),Bt,b(t("div",Et,[t("section",Ut,[t("div",zt,[e(s)&&e(s).image?(i(),n("img",{key:0,class:"img-avatar",src:`${(y=e(s))==null?void 0:y.image}`,alt:"Imagem do Laboratorio"},null,8,Ft)):G("",!0),t("div",null,[t("h1",null,r((C=e(s))==null?void 0:C.titulo),1),t("p",null,r((P=e(s))==null?void 0:P.descricao),1),t("span",Rt,[a(e(yt),{name:"groups",size:"1.2rem"}),pt(" "+r((B=($=e(s))==null?void 0:$.membros)==null?void 0:B.length),1)])]),qt])]),t("section",At,[t("div",Jt,[t("button",Kt,[e(h)!==null?(i(),n("span",Wt,r(((E=e(h))==null?void 0:E.primeiro_nome)+" "+((U=e(h))==null?void 0:U.segundo_nome)),1)):(i(),n("span",Gt)),a(e(Ct),{style:{width:"33%"}},{default:_(()=>[a(e(kt),{style:{width:"100%","background-color":"#1F2026",border:"1px solid #333335"}},{default:_(()=>[(i(!0),n(S,null,I(e(T),o=>(i(),L(e(jt),{class:"q-item",key:o.id,clickable:"",onClick:it=>Q(h)?h.value=o:h=o},{default:_(()=>[t("div",Ht,[a(e(O),{avatar:""},{default:_(()=>[o.image?(i(),n("img",{key:0,class:"img-menu",src:`${o==null?void 0:o.image}`,alt:"Imagem de usuario"},null,8,Ot)):G("",!0)]),_:2},1024),a(e(O),null,{default:_(()=>[t("p",Xt,r((o==null?void 0:o.primeiro_nome)+" "+(o==null?void 0:o.segundo_nome)),1)]),_:2},1024)])]),_:2},1032,["onClick"]))),128))]),_:1})]),_:1})]),Yt]),a(e(g),{class:"divider"}),t("div",null,[Zt,((F=(z=e(s))==null?void 0:z.membros)==null?void 0:F.length)===0?(i(),n("article",te,oe)):(i(),n("ul",se,[(i(!0),n(S,null,I((R=e(s))==null?void 0:R.membros,o=>(i(),L(bt,{key:o.id??"",type:3,summary:o.email,"id-user":o.id??"",title:`${o.primeiro_nome} ${o.segundo_nome}`,"date-create":o.data_inicial??""},null,8,["summary","id-user","title","date-create"]))),128))]))]),a(e(g),{class:"divider"}),t("div",null,[ae,t("p",null,r((q=e(s))==null?void 0:q.laboratorio.nome),1)]),a(e(g),{class:"divider"}),t("div",null,[le,t("p",null,r((A=e(s))==null?void 0:A.descricao),1)]),a(e(g),{class:"divider",dark:""}),t("div",null,[ie,t("p",null,r((J=e(s))==null?void 0:J.data_inicial),1)]),a(e(g),{class:"divider",dark:""}),t("div",null,[ne,t("p",null,r((K=e(s))==null?void 0:K.data_up),1)]),t("footer",null,[t("button",{onClick:l[3]||(l[3]=o=>at())}," Deletar projeto ")])])],512),[[D,e(s)]])])],64)}}}),ve=xt(re,[["__scopeId","data-v-a3387714"]]);export{ve as default};
