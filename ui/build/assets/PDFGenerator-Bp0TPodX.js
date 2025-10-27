import{j as o,B as c,t as p}from"./index-tH8kGzNV.js";import{F as m}from"./file-text-DbNNqFYp.js";function x({data:i,filename:t,title:l,type:s="elevator"}){const r=()=>{const d=new Date().toLocaleDateString("fa-IR",{year:"numeric",month:"long",day:"numeric"}),n=`
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${l}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Vazirmatn', 'Tahoma', Arial, sans-serif;
            direction: rtl;
            text-align: right;
            padding: 30px;
            line-height: 1.8;
            color: #333;
            background: #fff;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 25px;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            padding: 30px;
            border-radius: 8px;
            margin: -10px -10px 40px -10px;
          }
          
          .header h1 {
            color: #1e40af;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          
          .header h2 {
            color: #374151;
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 15px;
          }
          
          .header .date {
            color: #6b7280;
            font-size: 14px;
            font-weight: 400;
          }
          
          .info-section {
            margin-bottom: 35px;
          }
          
          .section-title {
            background: #2563eb;
            color: white;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 6px 6px 0 0;
            margin-bottom: 0;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
            padding: 25px;
            border-radius: 0 0 6px 6px;
          }
          
          .info-item {
            background: #f9fafb;
            padding: 15px;
            border-radius: 6px;
            border-left: 4px solid #2563eb;
          }
          
          .label {
            font-weight: 600;
            color: #1f2937;
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .value {
            color: #374151;
            font-size: 14px;
            word-break: break-all;
          }
          
          .qr-section {
            text-align: center;
            margin-top: 50px;
            border-top: 2px solid #e5e7eb;
            padding-top: 30px;
            background: #f8fafc;
            padding: 30px;
            border-radius: 8px;
            margin-left: -10px;
            margin-right: -10px;
          }
          
          .qr-section h3 {
            color: #1e40af;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          
          .qr-section p {
            color: #6b7280;
            margin-bottom: 20px;
          }
          
          .qr-placeholder {
            width: 180px;
            height: 180px;
            border: 2px solid #2563eb;
            margin: 20px auto;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            font-size: 16px;
            color: #6b7280;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          
          .qr-id {
            font-size: 13px;
            color: #374151;
            font-weight: 500;
            background: #e5e7eb;
            padding: 8px 16px;
            border-radius: 20px;
            display: inline-block;
            margin-top: 10px;
          }
          
          .footer {
            margin-top: 50px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            color: #6b7280;
            font-size: 12px;
          }
          
          @media print {
            body { font-size: 12px; }
            .header { background: #f8fafc !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🏢 سامانه ردیابی قطعات و شناسنامه آسانسور</h1>
          <h2>📋 ${l}</h2>
          <p class="date">📅 تاریخ تولید: ${d}</p>
        </div>
        
        <div class="info-section">
          <div class="section-title">
            📊 اطلاعات اصلی ${s==="part"?"قطعه":"آسانسور"}
          </div>
          <div class="info-grid">
            ${s==="part"?`
              <div class="info-item">
                <div class="label">🆔 شناسه قطعه:</div>
                <div class="value">${i.partUid||i.id||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">📦 نام قطعه:</div>
                <div class="value">${i.title||i.name||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🏷️ مدل:</div>
                <div class="value">${i.model||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🔢 شماره سریال:</div>
                <div class="value">${i.serialNumber||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">📊 بارکد:</div>
                <div class="value">${i.barcode||"ندارد"}</div>
              </div>
              <div class="info-item">
                <div class="label">🏭 سازنده:</div>
                <div class="value">${i.manufacturer||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🌍 کشور تولیدکننده:</div>
                <div class="value">${i.manufacturerCountry||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">📍 کشور مبدا:</div>
                <div class="value">${i.originCountry||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">👤 مالک فعلی:</div>
                <div class="value">${i.ownerName||(i.currentOwner?.type==="company"?"شرکت":"آسانسور")}</div>
              </div>
              <div class="info-item">
                <div class="label">📊 وضعیت:</div>
                <div class="value">${i.status==="available"?"✅ موجود":i.status==="sold"?"💰 فروخته شده":i.status==="installed"?"🔧 نصب شده":i.status==="maintenance"?"⚠️ در تعمیر":"نامشخص"}</div>
              </div>
            `:`
              <div class="info-item">
                <div class="label">🆔 شناسه آسانسور:</div>
                <div class="value">${i.elevatorUid||i.id||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🏛️ منطقه شهرداری:</div>
                <div class="value">${i.municipalityZone||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">📜 شماره پروانه ساخت:</div>
                <div class="value">${i.buildPermitNo||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🏷️ پلاک ثبتی:</div>
                <div class="value">${i.registryPlate||"ندارد"}</div>
              </div>
              <div class="info-item">
                <div class="label">📍 استان:</div>
                <div class="value">${i.province||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🏙️ شهر:</div>
                <div class="value">${i.city||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">🏠 آدرس:</div>
                <div class="value">${i.address||"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">📮 کد پستی:</div>
                <div class="value">${i.postalCode||"ندارد"}</div>
              </div>
              <div class="info-item">
                <div class="label">📊 وضعیت:</div>
                <div class="value">${i.status==="active"?"✅ فعال":i.status==="inactive"?"❌ غیرفعال":i.status==="maintenance"?"🔧 در تعمیر":"نامشخص"}</div>
              </div>
              <div class="info-item">
                <div class="label">📈 طبقات:</div>
                <div class="value">${i.floors||"نامشخص"} طبقه</div>
              </div>
            `}
          </div>
        </div>
        
        <div class="qr-section">
          <h3>📱 کد QR شناسایی</h3>
          <p>جهت دسترسی سریع به اطلاعات این ${s==="part"?"قطعه":"آسانسور"} از کد QR زیر استفاده کنید</p>
          <div class="qr-placeholder">
            📊 QR Code<br>
            <small style="font-size: 12px;">کد دسترسی سریع</small>
          </div>
          <div class="qr-id">
            🔗 ${s==="part"?i.partUid||i.id:i.elevatorUid||i.id}
          </div>
        </div>
        
        <div class="footer">
          <p>📧 سامانه ردیابی قطعات و شناسنامه آسانسور | تولید شده در ${d}</p>
          <p>🌐 https://elevatorid.ieeu.ir</p>
        </div>
      </body>
      </html>
    `,v=new Blob([n],{type:"text/html;charset=utf-8"}),a=URL.createObjectURL(v),e=document.createElement("a");e.href=a,e.download=`${t.replace(/[^a-zA-Z0-9-_]/g,"")}-${Date.now()}.html`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(a),p.success("📄 شناسنامه تولید و دانلود شد")};return o.jsxs(c,{onClick:r,variant:"outline",size:"sm",className:"gap-2",children:[o.jsx(m,{className:"h-4 w-4"}),"تولید PDF"]})}export{x as P};
