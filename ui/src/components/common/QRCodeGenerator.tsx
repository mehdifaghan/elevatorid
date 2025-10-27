import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { QrCode, Download, Copy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface QRCodeGeneratorProps {
  data?: string;
  value?: string; // Support both data and value props for backward compatibility
  title?: string;
  size?: number;
  showData?: boolean;
  className?: string;
  downloadButton?: boolean;
  filename?: string;
}

function QRCodeGenerator({ 
  data, 
  value, 
  title = 'کد QR', 
  size = 200,
  showData = true,
  className = '',
  downloadButton = false,
  filename
}: QRCodeGeneratorProps) {
  // Use value as fallback if data is not provided
  const qrData = data || value || '';
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = size;
    canvas.height = size;
    
    // White background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);
    
    // Generate a more realistic QR-like pattern
    const modules = 25; // QR code modules
    const moduleSize = (size - 20) / modules;
    const padding = 10;
    
    // Create deterministic pattern based on data
    const hash = qrData.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    ctx.fillStyle = 'black';
    
    // Generate QR-like pattern
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Create position detection patterns (corners)
        const isCornerPattern = 
          (row < 7 && col < 7) || 
          (row < 7 && col >= modules - 7) || 
          (row >= modules - 7 && col < 7);
        
        if (isCornerPattern) {
          if ((row === 0 || row === 6 || col === 0 || col === 6) && 
              !(row >= 2 && row <= 4 && col >= 2 && col <= 4)) {
            ctx.fillRect(
              padding + col * moduleSize, 
              padding + row * moduleSize, 
              moduleSize - 1, 
              moduleSize - 1
            );
          }
          if (row >= 2 && row <= 4 && col >= 2 && col <= 4) {
            ctx.fillRect(
              padding + col * moduleSize, 
              padding + row * moduleSize, 
              moduleSize - 1, 
              moduleSize - 1
            );
          }
        } else {
          // Generate data pattern based on hash
          const cellHash = (hash + row * modules + col) % 3;
          if (cellHash === 0) {
            ctx.fillRect(
              padding + col * moduleSize, 
              padding + row * moduleSize, 
              moduleSize - 1, 
              moduleSize - 1
            );
          }
        }
      }
    }
    
    return canvas.toDataURL();
  };

  useEffect(() => {
    generateQRCode();
  }, [qrData, size]);

  const handleDownload = () => {
    const dataUrl = generateQRCode();
    if (!dataUrl) return;
    
    const link = document.createElement('a');
    const defaultFilename = `qr-code-${qrData.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}.png`;
    link.download = filename || defaultFilename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('کد QR دانلود شد');
  };

  const handleCopyData = async () => {
    try {
      await navigator.clipboard.writeText(qrData);
      toast.success('داده کپی شد');
    } catch (err) {
      toast.error('خطا در کپی کردن');
    }
  };

  // If downloadButton prop is true, render only the download button
  if (downloadButton) {
    return (
      <Button 
        onClick={handleDownload}
        size="sm"
        variant="outline"
        className={`gap-2 ${className}`}
      >
        <Download className="h-4 w-4" />
        دانلود QR کد
      </Button>
    );
  }

  return (
    <Card className={`w-fit mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef}
            className="border border-gray-200 rounded shadow-sm"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        {showData && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-3 break-all">
              داده‌ها: {qrData}
            </div>
            <div className="flex justify-center gap-2">
              <Button 
                onClick={handleDownload}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                دانلود
              </Button>
              <Button 
                onClick={handleCopyData}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                کپی
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default QRCodeGenerator;
export { QRCodeGenerator };