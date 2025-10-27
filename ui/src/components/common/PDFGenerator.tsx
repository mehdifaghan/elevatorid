import React from 'react';
import { Button } from '../ui/button';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PDFGeneratorProps {
  data: any;
  filename: string;
  title: string;
  type?: 'part' | 'elevator';
}

export default function PDFGenerator({ 
  data, 
  filename, 
  title, 
  type = 'elevator'
}: PDFGeneratorProps) {
  const generatePDF = () => {
    // Create a comprehensive HTML content for PDF
    const currentDate = new Date().toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html dir="rtl" lang="fa">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
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
          <h2>📋 ${title}</h2>
          <p class="date">📅 تاریخ تولید: ${currentDate}</p>
        </div>
        
        <div class="info-section">
          <div class="section-title">
            📊 اطلاعات اصلی ${type === 'part' ? 'قطعه' : 'آسانسور'}
          </div>
          <div class="info-grid">
            ${type === 'part' ? `
              <div class="info-item">
                <div class="label">🆔 شناسه قطعه:</div>
                <div class="value">${data.partUid || data.id || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📦 نام قطعه:</div>
                <div class="value">${data.title || data.name || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🏷️ مدل:</div>
                <div class="value">${data.model || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🔢 شماره سریال:</div>
                <div class="value">${data.serialNumber || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📊 بارکد:</div>
                <div class="value">${data.barcode || 'ندارد'}</div>
              </div>
              <div class="info-item">
                <div class="label">🏭 سازنده:</div>
                <div class="value">${data.manufacturer || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🌍 کشور تولیدکننده:</div>
                <div class="value">${data.manufacturerCountry || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📍 کشور مبدا:</div>
                <div class="value">${data.originCountry || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">👤 مالک فعلی:</div>
                <div class="value">${data.ownerName || (data.currentOwner?.type === 'company' ? 'شرکت' : 'آسانسور') || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📊 وضعیت:</div>
                <div class="value">${data.status === 'available' ? '✅ موجود' : 
                                   data.status === 'sold' ? '💰 فروخته شده' :
                                   data.status === 'installed' ? '🔧 نصب شده' :
                                   data.status === 'maintenance' ? '⚠️ در تعمیر' : 'نامشخص'}</div>
              </div>
            ` : `
              <div class="info-item">
                <div class="label">🆔 شناسه آسانسور:</div>
                <div class="value">${data.elevatorUid || data.id || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🏛️ منطقه شهرداری:</div>
                <div class="value">${data.municipalityZone || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📜 شماره پروانه ساخت:</div>
                <div class="value">${data.buildPermitNo || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🏷️ پلاک ثبتی:</div>
                <div class="value">${data.registryPlate || 'ندارد'}</div>
              </div>
              <div class="info-item">
                <div class="label">📍 استان:</div>
                <div class="value">${data.province || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🏙️ شهر:</div>
                <div class="value">${data.city || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">🏠 آدرس:</div>
                <div class="value">${data.address || 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📮 کد پستی:</div>
                <div class="value">${data.postalCode || 'ندارد'}</div>
              </div>
              <div class="info-item">
                <div class="label">📊 وضعیت:</div>
                <div class="value">${data.status === 'active' ? '✅ فعال' : 
                                   data.status === 'inactive' ? '❌ غیرفعال' :
                                   data.status === 'maintenance' ? '🔧 در تعمیر' : 'نامشخص'}</div>
              </div>
              <div class="info-item">
                <div class="label">📈 طبقات:</div>
                <div class="value">${data.floors || 'نامشخص'} طبقه</div>
              </div>
            `}
          </div>
        </div>
        
        <div class="qr-section">
          <h3>📱 کد QR شناسایی</h3>
          <p>جهت دسترسی سریع به اطلاعات این ${type === 'part' ? 'قطعه' : 'آسانسور'} از کد QR زیر استفاده کنید</p>
          <div class="qr-placeholder">
            📊 QR Code<br>
            <small style="font-size: 12px;">کد دسترسی سریع</small>
          </div>
          <div class="qr-id">
            🔗 ${type === 'part' ? (data.partUid || data.id) : (data.elevatorUid || data.id)}
          </div>
        </div>
        
        <div class="footer">
          <p>📧 سامانه ردیابی قطعات و شناسنامه آسانسور | تولید شده در ${currentDate}</p>
          <p>🌐 https://elevatorid.ieeu.ir</p>
        </div>
      </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename.replace(/[^a-zA-Z0-9-_]/g, '')}-${Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('📄 شناسنامه تولید و دانلود شد');
  };

  return (
    <Button 
      onClick={generatePDF}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      <FileText className="h-4 w-4" />
      تولید PDF
    </Button>
  );
}