import{d as B,l as C,u as F,f as q,r as f,o as r,c as w,a as s,w as y,n as b,g as e,m as k,i as p,h as i,t as g,F as Q,j,k as E,q as u,Q as M,p as N,e as U}from"./index-DQBdR0Ge.js";import{u as O,c as T,a as P,b as G}from"./vee-validate.esm-DweLrArM.js";import{_ as H}from"./_plugin-vue_export-helper-DlAUqK2U.js";const v=l=>(N("data-v-81b1584d"),l=l(),U(),l),J={class:"container-recovery"},K=v(()=>s("p",null,"Digite uma nova senha para sua conta.",-1)),L={class:"box-password"},W={class:"content"},X=v(()=>s("label",null,"Senha:",-1)),Y={class:"password-input"},Z=["type"],ee={class:"error"},se={class:"content"},ae=v(()=>s("label",null,"Confirme a senha:",-1)),oe={class:"password-input"},te=["type"],ne={type:"submit"},re=B({__name:"PasswordRecovery",setup(l){const S=C(),A=F(),x=q(),{errors:_,validate:V,defineField:h}=O({validationSchema:T({password:P().min(4,"A senha deve ter no mínimo 4 caracteres").required("A senha é obrigatória"),confPassword:P().required("A confirmação da senha é obrigatória").min(4,"A confirmação da senha deve ter no mínimo 4 caracteres").oneOf([G("password")],"As senhas devem ser iguais")})}),[d,R]=h("password"),[m,$]=h("confPassword"),z=S.params.id;let o=f(!0),t=f(!0),c=f(!1);async function D(){if((await V()).valid){c.value=!0;const a={id_user:z,senha:d.value};await x.recoveryPassword(a)===!0?(c.value=!1,A.push("/pageAcess"),alert("Senha alterada com sucesso!")):(c.value=!1,alert("Erro ao alterar senha, tem novamente em alguns minutos!"))}}return(I,a)=>(r(),w("div",J,[s("form",{onSubmit:a[4]||(a[4]=E(n=>D(),["prevent"]))},[K,s("div",L,[s("section",W,[X,s("div",Y,[y(s("input",k({"onUpdate:modelValue":a[0]||(a[0]=n=>p(d)?d.value=n:null)},e(R),{class:"password",type:e(t)?"password":"text",placeholder:"senha",id:"senha",name:"senha"}),null,16,Z),[[b,e(d)]]),s("span",{class:"eye",onClick:a[1]||(a[1]=n=>p(t)?t.value=!e(t):t=!e(t))},[e(t)?(r(),i(e(u),{key:0,name:"visibility_off",size:"1rem"})):(r(),i(e(u),{key:1,name:"visibility",size:"1rem"}))])]),s("pre",ee,g(e(_).password),1)]),s("section",se,[ae,s("div",oe,[y(s("input",k({"onUpdate:modelValue":a[2]||(a[2]=n=>p(m)?m.value=n:null)},e($),{class:"password",type:e(o)?"password":"text",placeholder:"confirme sua senha",id:"confirm-senha",name:"confirm-senha"}),null,16,te),[[b,e(m)]]),s("span",{class:"eye",onClick:a[3]||(a[3]=n=>p(o)?o.value=!e(o):o=!e(o))},[e(o)?(r(),i(e(u),{key:0,name:"visibility_off",size:"1rem"})):(r(),i(e(u),{key:1,name:"visibility",size:"1rem"}))])]),s("pre",null,g(e(_).confPassword),1)])]),s("button",ne,[e(c)?(r(),i(e(M),{key:0,size:"20px",color:"dark"})):(r(),w(Q,{key:1},[j(" Alterar ")],64))])],32)]))}}),ce=H(re,[["__scopeId","data-v-81b1584d"]]);export{ce as default};
