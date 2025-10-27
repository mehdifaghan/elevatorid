import{a1 as b,r as o,t as m,j as e,q as w,B as p,z as A,D as I,E as a,F as r,C as n,b as i,c,d as l,e as t,ap as T,o as x,_ as S,Y as u}from"./index-tH8kGzNV.js";import{S as h}from"./scroll-area-VRfuIe_R.js";import{O}from"./OpenAPIViewer-1oERBMJc.js";import{A as C}from"./APIDocDownloader-Dkq4YQZj.js";import{D as k}from"./download-BGqk_jGh.js";import{E}from"./external-link-CZQZ0Gf9.js";import{K as f}from"./key-QVqY-mlN.js";import{F as v}from"./file-text-DbNNqFYp.js";import"./index-BdQq_4o_.js";import"./separator-DLBvRYDr.js";import"./check-DV_4N94Y.js";import"./copy-CIVXPvX_.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]],H=b("book",D);function X(){const[s,N]=o.useState(null),[g,j]=o.useState(!0),[L,R]=o.useState(null);o.useEffect(()=>{y()},[]);const y=async()=>{try{j(!0),N({openapi:"3.0.0",info:{title:"سامانه ردیابی قطعات آسانسور API",version:"1.0.0",description:"API جامع برای مدیریت قطعات، آسانسورها و انتقال‌ها"},servers:[{url:"https://elevatorid.ieeu.ir/v1",description:"سرور اصلی"},{url:"https://test.elevatorid.ieeu.ir/v1",description:"سرور تست"}],paths:{},components:{}})}catch(d){console.error("Error fetching API spec:",d),m.error("خطا در بارگذاری مستندات API")}finally{j(!1)}},P=async()=>{try{m.success("فایل OpenAPI دانلود شد")}catch(d){console.error("Error downloading API spec:",d),m.error("خطا در دانلود مستندات")}};return g?e.jsx("div",{className:"flex items-center justify-center min-h-[400px]",children:e.jsxs("div",{className:"text-center space-y-4",children:[e.jsx(w,{className:"h-8 w-8 animate-spin mx-auto"}),e.jsx("p",{className:"text-muted-foreground",children:"در حال بارگذاری مستندات API..."})]})}):e.jsxs("div",{className:"space-y-6",dir:"rtl",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{children:[e.jsx("h1",{children:"مستندات API"}),e.jsx("p",{children:"راهنمای کامل استفاده از API سامانه"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs(p,{variant:"outline",onClick:P,children:[e.jsx(k,{className:"w-4 h-4 ml-2"}),"دانلود OpenAPI"]}),e.jsx(p,{variant:"outline",asChild:!0,children:e.jsxs("a",{href:"https://elevatorid.ieeu.ir/docs",target:"_blank",rel:"noopener noreferrer",children:[e.jsx(E,{className:"w-4 h-4 ml-2"}),"Swagger UI"]})})]})]}),e.jsxs(A,{defaultValue:"overview",className:"w-full",children:[e.jsxs(I,{className:"grid w-full grid-cols-5",children:[e.jsx(a,{value:"overview",children:"کلیات"}),e.jsx(a,{value:"quickstart",children:"شروع سریع"}),e.jsx(a,{value:"authentication",children:"احراز هویت"}),e.jsx(a,{value:"endpoints",children:"اندپوینت‌ها"}),e.jsx(a,{value:"openapi",children:"OpenAPI"})]}),e.jsx(r,{value:"overview",className:"space-y-6",children:e.jsxs(n,{children:[e.jsxs(i,{children:[e.jsxs(c,{className:"flex items-center gap-2",children:[e.jsx(H,{className:"w-5 h-5"}),"نمای کلی API"]}),e.jsx(l,{children:"معرفی API سامانه ردیابی قطعات آسانسور"})]}),e.jsxs(t,{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold mb-2",children:"درباره API"}),e.jsx("p",{className:"text-muted-foreground",children:"API سامانه ردیابی قطعات آسانسور امکان دسترسی برنامه‌نویسی به تمامی عملکردهای سامانه را فراهم می‌کند. این API بر اساس معماری REST طراحی شده و از استانداردهای مدرن وب پیروی می‌کند."})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("h4",{className:"font-medium flex items-center gap-2",children:[e.jsx(T,{className:"w-4 h-4"}),"اطلاعات سرور"]}),e.jsxs("div",{className:"space-y-1 text-sm",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"URL پایه:"})," https://elevatorid.ieeu.ir/v1"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"نسخه:"})," ",s?.info.version]}),e.jsxs("p",{children:[e.jsx("strong",{children:"پروتکل:"})," HTTPS"]})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("h4",{className:"font-medium flex items-center gap-2",children:[e.jsx(f,{className:"w-4 h-4"}),"احراز هویت"]}),e.jsxs("div",{className:"space-y-1 text-sm",children:[e.jsxs("p",{children:[e.jsx("strong",{children:"نوع:"})," Bearer Token"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"مکان:"})," HTTP Header"]}),e.jsxs("p",{children:[e.jsx("strong",{children:"فرمت:"})," Authorization: Bearer TOKEN"]})]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"قابلیت‌های اصلی"}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-2",children:[e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(x,{variant:"outline",children:"قطعات"}),e.jsx("span",{children:"مدیریت قطعات و مشخصات فنی"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(x,{variant:"outline",children:"آسانسورها"}),e.jsx("span",{children:"ثبت و مدیریت آسانسورها"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(x,{variant:"outline",children:"انتقال‌ها"}),e.jsx("span",{children:"ردیابی انتقال قطعات"})]}),e.jsxs("div",{className:"flex items-center gap-2 text-sm",children:[e.jsx(x,{variant:"outline",children:"کاربران"}),e.jsx("span",{children:"مدیریت کاربران و دسترسی‌ها"})]})]})]})]})]})}),e.jsx(r,{value:"quickstart",className:"space-y-6",children:e.jsxs(n,{children:[e.jsxs(i,{children:[e.jsxs(c,{className:"flex items-center gap-2",children:[e.jsx(S,{className:"w-5 h-5"}),"شروع سریع"]}),e.jsx(l,{children:"نحوه استفاده از API در پروژه‌های خود"})]}),e.jsx(t,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"مثال کد JavaScript"}),e.jsx(h,{className:"h-96 rounded border bg-muted p-4",children:e.jsx("pre",{className:"text-sm",children:e.jsx("code",{children:`// نصب کتابخانه HTTP client
npm install axios

// پیکربندی اولیه
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://elevatorid.ieeu.ir/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// مثال درخواست GET
const getParts = async () => {
  try {
    const response = await apiClient.get('/parts');
    console.log(response.data);
  } catch (error) {
    console.error('خطا:', error.response?.data);
  }
};

// مثال درخواست POST
const createPart = async (partData) => {
  try {
    const response = await apiClient.post('/parts', partData);
    console.log('قطعه ایجاد شد:', response.data);
  } catch (error) {
    console.error('خطا در ایجاد قطعه:', error.response?.data);
  }
};`})})})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"کدهای پاسخ رایج"}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"200"}),e.jsx("span",{children:"درخواست موفق"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"201"}),e.jsx("span",{children:"ایجاد موفق"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"400"}),e.jsx("span",{children:"درخواست نامعتبر"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"401"}),e.jsx("span",{children:"عدم احراز هویت"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"403"}),e.jsx("span",{children:"عدم دسترسی"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"404"}),e.jsx("span",{children:"یافت نشد"})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx("span",{children:"500"}),e.jsx("span",{children:"خطای سرور"})]})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"فرمت پاسخ خطا"}),e.jsx(h,{className:"h-32 rounded border bg-muted p-3",children:e.jsx("pre",{className:"text-xs",children:e.jsx("code",{children:`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "داده‌های ارسالی نامعتبر است",
    "details": [
      {
        "field": "name",
        "message": "نام قطعه الزامی است"
      }
    ]
  }
}`})})})]})]})]})})]})}),e.jsx(r,{value:"authentication",className:"space-y-6",children:e.jsxs(n,{children:[e.jsxs(i,{children:[e.jsxs(c,{className:"flex items-center gap-2",children:[e.jsx(f,{className:"w-5 h-5"}),"احراز هویت"]}),e.jsx(l,{children:"نحوه احراز هویت و دریافت توکن دسترسی"})]}),e.jsx(t,{children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"فرآیند احراز هویت"}),e.jsxs("div",{className:"space-y-2 text-sm",children:[e.jsx("p",{children:"1. ارسال شماره تلفن به اندپوینت /auth/login"}),e.jsx("p",{children:"2. دریافت کد OTP از طریق پیامک"}),e.jsx("p",{children:"3. ارسال کد OTP به اندپوینت /auth/verify-otp"}),e.jsx("p",{children:"4. دریافت توکن دسترسی"}),e.jsx("p",{children:"5. استفاده از توکن در هدر Authorization"})]})]}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-medium mb-2",children:"مثال کد احراز هویت"}),e.jsx(h,{className:"h-72 rounded border bg-muted p-4",children:e.jsx("pre",{className:"text-sm",children:e.jsx("code",{children:`// احراز هویت با شماره تلفن
const login = async (phone) => {
  const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone })
  });
  
  const data = await response.json();
  console.log('کد OTP ارسال شد:', data.message);
};

// تایید کد OTP
const verifyOTP = async (phone, otp) => {
  const response = await fetch('https://elevatorid.ieeu.ir/v1/auth/verify-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ phone, otp })
  });
  
  const data = await response.json();
  if (data.token) {
    // ذخیره توکن برای درخواست‌های بعدی
    localStorage.setItem('access_token', data.token);
    console.log('ورود موفق');
  }
};`})})})]}),e.jsxs("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg p-4",children:[e.jsx("h4",{className:"font-medium text-yellow-800 mb-2",children:"نکات مهم امنیتی"}),e.jsxs("ul",{className:"text-sm text-yellow-700 space-y-1",children:[e.jsx("li",{children:"• هرگز توکن‌های دسترسی را در کد front-end ذخیره نکنید"}),e.jsx("li",{children:"• از HTTPS برای تمام درخواست‌ها استفاده کنید"}),e.jsx("li",{children:"• توکن‌ها دارای مدت انقضا هستند و باید تجدید شوند"}),e.jsx("li",{children:"• کدهای OTP تنها برای مدت محدودی معتبر هستند"})]})]})]})})]})}),e.jsx(r,{value:"endpoints",className:"space-y-6",children:e.jsxs(n,{children:[e.jsxs(i,{children:[e.jsxs(c,{className:"flex items-center gap-2",children:[e.jsx(u,{className:"w-5 h-5"}),"فهرست اندپوینت‌ها"]}),e.jsx(l,{children:"تمام اندپوینت‌های موجود در API"})]}),e.jsx(t,{children:e.jsxs("div",{className:"text-center py-8",children:[e.jsx(u,{className:"w-16 h-16 mx-auto text-muted-foreground mb-4"}),e.jsx("p",{className:"text-muted-foreground",children:"فهرست اندپوینت‌ها در نسخه آینده نمایش داده خواهد شد"}),e.jsx("p",{className:"text-sm text-muted-foreground mt-2",children:"برای مشاهده کامل اندپوینت‌ها از تب OpenAPI استفاده کنید"})]})})]})}),e.jsx(r,{value:"openapi",className:"space-y-6",children:e.jsxs(n,{children:[e.jsxs(i,{children:[e.jsxs(c,{className:"flex items-center gap-2",children:[e.jsx(v,{className:"w-5 h-5"}),"مشخصات OpenAPI"]}),e.jsx(l,{children:"مشاهده کامل مشخصات API در فرمت OpenAPI 3.0"})]}),e.jsx(t,{children:s?e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"font-semibold",children:s.info.title}),e.jsxs("p",{className:"text-sm text-muted-foreground",children:["نسخه ",s.info.version]})]}),e.jsx(C,{})]}),e.jsx(h,{className:"h-96 rounded border",children:e.jsx(O,{spec:s})})]}):e.jsxs("div",{className:"text-center py-8",children:[e.jsx(v,{className:"w-16 h-16 mx-auto text-muted-foreground mb-4"}),e.jsx("p",{className:"text-muted-foreground",children:"مشخصات OpenAPI بارگذاری نشد"})]})})]})})]})]})}export{X as default};
