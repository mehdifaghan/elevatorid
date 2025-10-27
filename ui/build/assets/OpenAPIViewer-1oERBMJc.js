import{a1 as C,r as x,j as e,C as c,b as l,c as d,d as j,e as m,Y as A,_ as P,B as p,o as k,t as n}from"./index-tH8kGzNV.js";import{S as I}from"./separator-DLBvRYDr.js";import{S as L}from"./scroll-area-VRfuIe_R.js";import{F as R}from"./file-text-DbNNqFYp.js";import{D as U}from"./download-BGqk_jGh.js";import{C as S}from"./check-DV_4N94Y.js";import{C as E}from"./copy-CIVXPvX_.js";import{E as O}from"./external-link-CZQZ0Gf9.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]],g=C("terminal",T),$=({showFullSpec:u=!1})=>{const[f,h]=x.useState(!1),[o,y]=x.useState("");x.useEffect(()=>{y(`openapi: 3.0.3
info:
  title: سامانه جامع ردیابی قطعات و شناسنامه آسانسور
  description: |
    API مستندات برای سیستم جامع ردیابی قطعات و شناسنامه آسانسور
    شامل پنل ادمین و کاربر با قابلیت‌های احراز هویت، مدیریت قطعات، ردیابی انتقال‌ها و گزارش‌گیری
  version: 1.0.0
  contact:
    name: تیم توسعه
    url: https://elevatorid.ieeu.ir
servers:
  - url: https://elevatorid.ieeu.ir/v1
    description: سرور اصلی

security:
  - BearerAuth: []

tags:
  - name: Authentication
    description: احراز هویت و مدیریت نشست
  - name: Users
    description: مدیریت کاربران
  - name: Parts
    description: مدیریت قطعات
  - name: Transfers
    description: مدیریت انتقال‌ها
  - name: Elevators
    description: مدیریت آسانسورها
  - name: Requests
    description: درخواست‌ها و شکایات
  - name: Reports
    description: گزارش‌گیری

paths:
  /auth/login:
    post:
      tags: [Authentication]
      summary: ورود به سیستم
      description: ورود کاربر با شماره موبایل
      operationId: login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [mobile]
              properties:
                mobile:
                  type: string
                  pattern: '^09[0-9]{9}$'
                  example: "09123456789"
      responses:
        '200':
          description: کد OTP ارسال شد
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "کد تایید به شماره شما ارسال شد"

# ... بقیه مستندات در فایل کامل موجود است`)},[]);const b=async()=>{try{const a=await(await fetch("/docs/openapi-specification.yaml")).text(),i=new Blob([a],{type:"application/x-yaml"}),t=URL.createObjectURL(i),r=document.createElement("a");r.href=t,r.download="elevator-api-complete-specification.yaml",document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(t),n.success("فایل کامل مستندات API دانلود شد")}catch(s){console.error("خطا در دانلود:",s);const a=new Blob([o],{type:"application/x-yaml"}),i=URL.createObjectURL(a),t=document.createElement("a");t.href=i,t.download="elevator-api-specification.yaml",document.body.appendChild(t),t.click(),document.body.removeChild(t),URL.revokeObjectURL(i),n.success("فایل نمونه مستندات API دانلود شد")}},N=async()=>{try{await navigator.clipboard.writeText(o),h(!0),setTimeout(()=>h(!1),2e3),n.success("محتوای مستندات کپی شد")}catch(s){console.error("خطا در کپی:",s),n.error("خطا در کپی کردن محتوا")}},v=()=>{const a=`https://editor.swagger.io/#/?import=data:text/yaml;charset=utf-8,${encodeURIComponent(o)}`;window.open(a,"_blank")},w=()=>{n.info("برای import در Postman:",{description:"فایل YAML را دانلود کرده و در Postman import کنید",duration:4e3})};return e.jsxs("div",{className:"space-y-6",children:[e.jsxs(c,{children:[e.jsx(l,{children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"p-2 bg-blue-100 rounded-lg",children:e.jsx(R,{className:"h-6 w-6 text-blue-600"})}),e.jsxs("div",{children:[e.jsx(d,{children:"مستندات OpenAPI سامانه آسانسور"}),e.jsx(j,{children:"مستندات کامل API شامل تمام endpoint های احراز هویت، مدیریت کاربران، قطعات، انتقال‌ها، آسانسورها و گزارش‌گیری"})]})]})}),e.jsxs(m,{className:"space-y-4",children:[e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(A,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-sm",children:"نسخه: 1.0.0"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(g,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-sm",children:"Base URL: elevatorid.ieeu.ir/v1"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(P,{className:"h-4 w-4 text-muted-foreground"}),e.jsx("span",{className:"text-sm",children:"فرمت: OpenAPI 3.0.3"})]})]}),e.jsx(I,{}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsxs(p,{onClick:b,className:"flex items-center gap-2",children:[e.jsx(U,{className:"h-4 w-4"}),"دانلود YAML کامل"]}),e.jsx(p,{variant:"outline",onClick:N,className:"flex items-center gap-2",children:f?e.jsxs(e.Fragment,{children:[e.jsx(S,{className:"h-4 w-4 text-green-600"}),"کپی شد!"]}):e.jsxs(e.Fragment,{children:[e.jsx(E,{className:"h-4 w-4"}),"کپی محتوا"]})}),e.jsxs(p,{variant:"outline",onClick:v,className:"flex items-center gap-2",children:[e.jsx(O,{className:"h-4 w-4"}),"Swagger Editor"]}),e.jsxs(p,{variant:"outline",onClick:w,className:"flex items-center gap-2",children:[e.jsx(g,{className:"h-4 w-4"}),"Postman Import"]})]})]})]}),e.jsxs(c,{children:[e.jsx(l,{children:e.jsx(d,{children:"دسته‌بندی API ها"})}),e.jsx(m,{children:e.jsx("div",{className:"flex flex-wrap gap-2",children:[{name:"Authentication",color:"bg-blue-100 text-blue-800"},{name:"Users",color:"bg-green-100 text-green-800"},{name:"Parts",color:"bg-purple-100 text-purple-800"},{name:"Transfers",color:"bg-orange-100 text-orange-800"},{name:"Elevators",color:"bg-red-100 text-red-800"},{name:"Requests",color:"bg-yellow-100 text-yellow-800"},{name:"Reports",color:"bg-indigo-100 text-indigo-800"},{name:"Dashboard",color:"bg-pink-100 text-pink-800"},{name:"Profile",color:"bg-teal-100 text-teal-800"},{name:"Settings",color:"bg-gray-100 text-gray-800"}].map(s=>e.jsx(k,{className:s.color,children:s.name},s.name))})})]}),u&&e.jsxs(c,{children:[e.jsxs(l,{children:[e.jsx(d,{children:"پیش‌نمایش YAML"}),e.jsx(j,{children:"نمایش بخشی از محتوای فایل OpenAPI Specification"})]}),e.jsx(m,{children:e.jsx(L,{className:"h-96 w-full rounded-md border p-4",children:e.jsx("pre",{className:"text-sm text-left",dir:"ltr",children:e.jsx("code",{children:o})})})})]}),e.jsxs(c,{children:[e.jsx(l,{children:e.jsx(d,{children:"لینک‌های مفید"})}),e.jsx(m,{className:"space-y-3",children:e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"ابزارهای توسعه"}),e.jsxs("ul",{className:"space-y-1 text-sm text-muted-foreground",children:[e.jsx("li",{children:"• Swagger UI برای تست API ها"}),e.jsx("li",{children:"• Postman Collection برای تست"}),e.jsx("li",{children:"• OpenAPI Generator برای SDK"})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("h4",{className:"font-medium text-sm",children:"مستندات بیشتر"}),e.jsxs("ul",{className:"space-y-1 text-sm text-muted-foreground",children:[e.jsx("li",{children:"• راهنمای احراز هویت"}),e.jsx("li",{children:"• نمونه کدهای مختلف"}),e.jsx("li",{children:"• محدودیت‌ها و Rate Limiting"})]})]})]})})]})]})};export{$ as O};
