import{d as w,u as L,f as x,r as c,z as I,o as u,c as f,w as i,J as l,g as t,a as e,k as B,j as C,x as M,F as N,D,p as F,e as T,q as V,h as z}from"./index-CS_LqtFy.js";import{M as j}from"./MyCard-BZ2yIT6q.js";import{l as q}from"./laboratory-BdmdquDP.js";import{_ as A}from"./_plugin-vue_export-helper-DlAUqK2U.js";import"./perm-CFx_5xxQ.js";const v=r=>(F("data-v-c03ecae1"),r=r(),T(),r),E={class:"timeline"},J=["disabled"],P=v(()=>e("div",null,[e("h2",null,"Faça parte de um laboratório!!")],-1)),Q={class:"info"},R=v(()=>e("h3",null,"Nenhum laboratório disponivel!",-1)),U=[R],$={class:"divider"},G=w({__name:"TimeLine",setup(r){const g=L(),y=q(),p=x();let o=c([]),n=c(),d=c();I(async()=>{S()});async function S(){var a;n.value=p.getUser,o.value=await y.getLaboratorys((a=n.value)==null?void 0:a.id),d.value=p.getlaboratory}function k(){var a;g.push({name:"landingpage",params:{id:(a=d.value)==null?void 0:a.id}})}return(a,m)=>{var _,b;return u(),f("div",E,[i(e("section",null,[e("button",{onClick:m[0]||(m[0]=B(s=>k(),["prevent"])),disabled:t(d)===null,class:"button-acess-site-lab"},[C(" Site do laboratório "),M(t(V),{name:"start",size:"1.4rem"})],8,J)],512),[[l,((b=(_=t(n))==null?void 0:_.permissao)==null?void 0:b.title)!=="Admin"]]),e("section",null,[P,i(e("ul",null,[(u(!0),f(N,null,D(t(o),s=>{var h;return u(),z(j,{key:s,type:0,"id-user":(h=t(n))==null?void 0:h.id,"id-lab":s.id,title:s.nome,"sub-title":s.coordenador.primeiro_nome,summary:s.sobre},null,8,["id-user","id-lab","title","sub-title","summary"])}),128))],512),[[l,t(o).length!==0]]),i(e("div",Q,U,512),[[l,t(o).length===0]])]),i(e("div",$,null,512),[[l,t(o).length!==0]])])}}}),Y=A(G,[["__scopeId","data-v-c03ecae1"]]);export{Y as default};
