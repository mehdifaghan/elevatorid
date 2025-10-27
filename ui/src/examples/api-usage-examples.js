// 🚀 نمونه‌های کاربردی استفاده از API سامانه ردیابی آسانسور

const API_BASE_URL = 'https://elevatorid.ieeu.ir/v1';

// ====================================
// 🔐 1. Authentication Examples
// ====================================

// ✅ ارسال کد OTP
async function sendOTP(mobile) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: mobile // مثال: "09123456789"
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('کد OTP ارسال شد:', data.message);
      return data.otpToken; // برای مرحله بعد نگه دارید
    } else {
      console.error('خطا در ارسال OTP:', data.error);
    }
  } catch (error) {
    console.error('خطای شبکه:', error);
  }
}

// ✅ تایید کد OTP و ورود
async function verifyOTP(otpToken, otp) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otpToken: otpToken,
        otp: otp // کد 6 رقمی: "123456"
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // ذخیره توکن‌ها در localStorage
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      console.log('ورود موفق:', data.user);
      return data;
    } else {
      console.error('کد OTP نامعتبر:', data.error);
    }
  } catch (error) {
    console.error('خطای شبکه:', error);
  }
}

// ✅ نمونه کامل ورود
async function loginExample() {
  const mobile = "09123456789";
  
  // مرحله 1: ارسال OTP
  const otpToken = await sendOTP(mobile);
  
  if (otpToken) {
    // مرحله 2: کاربر کد را وارد می‌کند (در UI واقعی)
    const userEnteredOTP = "123456"; // این از کاربر دریافت می‌شود
    
    // مرحله 3: تایید OTP
    const loginResult = await verifyOTP(otpToken, userEnteredOTP);
    
    if (loginResult) {
      console.log('کاربر وارد شد:', loginResult.user);
    }
  }
}

// ====================================
// 🔧 2. Parts Management Examples
// ====================================

// ✅ دریافت لیست قطعات
async function getPartsList(page = 1, limit = 20, search = '') {
  const token = localStorage.getItem('accessToken');
  
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });

    const response = await fetch(`${API_BASE_URL}/parts?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('لیست قطعات:', data.data.parts);
      console.log('اطلاعات صفحه‌بندی:', data.data.pagination);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در دریافت قطعات:', error);
  }
}

// ✅ ایجاد قطعه جدید
async function createNewPart() {
  const token = localStorage.getItem('accessToken');
  
  const partData = {
    name: "موتور آسانسور شیندلر",
    partNumber: "MTR-SHD-2024-001",
    category: "motor",
    description: "موتور 10 کیلووات برای آسانسور 10 نفره",
    specifications: {
      power: "10KW",
      voltage: "380V",
      brand: "شیندلر",
      model: "VT30",
      weight: "150kg",
      warranty: "2 سال"
    },
    images: [
      // Base64 encoded images (در واقعیت از file input می‌آید)
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
    ]
  };

  try {
    const response = await fetch(`${API_BASE_URL}/parts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('قطعه جدید ایجاد شد:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در ایجاد قطعه:', error);
  }
}

// ✅ انتقال قطعه
async function transferPart(partId, recipientId) {
  const token = localStorage.getItem('accessToken');
  
  const transferData = {
    recipientId: recipientId,
    transferType: "sale",
    price: 15000000, // 15 میلیون تومان
    notes: "فروش فوری - قطعه نو"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/parts/${partId}/transfer`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transferData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('درخواست انتقال ثبت شد:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در انتقال قطعه:', error);
  }
}

// ====================================
// 🏢 3. Elevator Management Examples
// ====================================

// ✅ ثبت آسانسور جدید
async function createElevator() {
  const token = localStorage.getItem('accessToken');
  
  const elevatorData = {
    serialNumber: "ELV-2024-001",
    building: {
      name: "برج میلاد",
      address: "تهران، میدان آزادی، خیابان آزادی",
      province: "تهران",
      city: "تهران"
    },
    specifications: {
      capacity: "10 نفر",
      floors: 15,
      brand: "شیندلر",
      model: "5500AP",
      installationDate: "2024-01-15"
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}/elevators`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(elevatorData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('آسانسور جدید ثبت شد:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در ثبت آسانسور:', error);
  }
}

// ✅ افزودن قطعه به آسانسور
async function addPartToElevator(elevatorId, partId) {
  const token = localStorage.getItem('accessToken');
  
  const installData = {
    partId: partId,
    installationNotes: "نصب در طبقه اول - موتورخانه"
  };

  try {
    const response = await fetch(`${API_BASE_URL}/elevators/${elevatorId}/parts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(installData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('قطعه به آسانسور اضافه شد:', data.message);
      return data;
    }
  } catch (error) {
    console.error('خطا در افزودن قطعه:', error);
  }
}

// ====================================
// 📝 4. Request Management Examples
// ====================================

// ✅ ثبت درخواست پشتیبانی
async function createSupportRequest() {
  const token = localStorage.getItem('accessToken');
  
  const requestData = {
    title: "مشکل در سیستم ردیابی",
    description: "سیستم در هنگام جستجوی قطعات با خطا مواجه می‌شود. لطفا بررسی فرمایید.",
    type: "support",
    priority: "medium",
    attachments: [
      // Base64 encoded files
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    ]
  };

  try {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('درخواست ثبت شد:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در ثبت درخواست:', error);
  }
}

// ====================================
// 👤 5. Profile Management Examples
// ====================================

// ✅ دریافت اطلاعات پروفایل
async function getUserProfile() {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('اطلاعات پروفایل:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در دریافت پروفایل:', error);
  }
}

// ✅ ویرایش پروفایل
async function updateProfile(newName, avatarFile = null) {
  const token = localStorage.getItem('accessToken');
  
  let avatarBase64 = null;
  if (avatarFile) {
    // تبدیل فایل به Base64
    avatarBase64 = await fileToBase64(avatarFile);
  }
  
  const updateData = {
    name: newName,
    ...(avatarBase64 && { avatar: avatarBase64 })
  };

  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('پروفایل بروزرسانی شد:', data.data);
      return data.data;
    }
  } catch (error) {
    console.error('خطا در بروزرسانی پروفایل:', error);
  }
}

// ====================================
// 📊 6. Reports Examples
// ====================================

// ✅ دریافت گزارش قطعات
async function getPartsReport(startDate, endDate, format = 'json') {
  const token = localStorage.getItem('accessToken');
  
  const params = new URLSearchParams({
    startDate: startDate, // "2024-01-01"
    endDate: endDate,     // "2024-01-31"
    format: format        // "json", "csv", "pdf"
  });

  try {
    const response = await fetch(`${API_BASE_URL}/reports/parts?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (format === 'json') {
      const data = await response.json();
      
      if (data.success) {
        console.log('گزارش قطعات:', data.data);
        return data.data;
      }
    } else {
      // برای PDF یا CSV، فایل دانلود می‌شود
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parts-report-${startDate}-${endDate}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('خطا در دریافت گزارش:', error);
  }
}

// ====================================
// 📁 7. File Upload Examples
// ====================================

// ✅ آپلود تصویر
async function uploadImage(imageFile) {
  const token = localStorage.getItem('accessToken');
  
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // 'Content-Type': 'multipart/form-data' - خودکار تنظیم می‌شود
      },
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('تصویر آپلود شد:', data.data);
      return data.data; // شامل URL تصویر
    }
  } catch (error) {
    console.error('خطا در آپلود تصویر:', error);
  }
}

// ====================================
// 🛠️ 8. Utility Functions
// ====================================

// تبدیل فایل به Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// بررسی اعتبار توکن
async function validateToken() {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('توکن یافت نشد - ورود مجدد نیاز است');
    return false;
  }

  // تست با درخواست ساده
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 401) {
      console.log('توکن منقضی شده - تلاش برای تمدید');
      return await refreshTokenIfNeeded();
    }

    return response.ok;
  } catch (error) {
    console.error('خطا در بررسی توکن:', error);
    return false;
  }
}

// تمدید توکن
async function refreshTokenIfNeeded() {
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!refreshToken) {
    console.log('Refresh token یافت نشد');
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      console.log('توکن تمدید شد');
      return true;
    } else {
      console.log('تمدید توکن ناموفق - ورود مجدد نیاز است');
      localStorage.clear();
      return false;
    }
  } catch (error) {
    console.error('خطا در تمدید توکن:', error);
    return false;
  }
}

// خروج از سیستم
async function logout() {
  const token = localStorage.getItem('accessToken');

  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('خطا در خروج:', error);
  } finally {
    // پاک کردن داده‌های محلی
    localStorage.clear();
    console.log('از سیستم خارج شدید');
  }
}

// ====================================
// 🎯 9. Complete Usage Examples
// ====================================

// نمونه کامل: مدیریت قطعات
async function completePartsManagementExample() {
  console.log('=== شروع مثال مدیریت قطعات ===');
  
  // 1. ورود به سیستم
  await loginExample();
  
  // 2. دریافت لیست قطعات
  const partsList = await getPartsList(1, 10, 'موتور');
  
  // 3. ایجاد قطعه جدید
  const newPart = await createNewPart();
  
  if (newPart) {
    // 4. انتقال قطعه
    await transferPart(newPart.id, 'user_456');
  }
  
  // 5. خروج از سیستم
  await logout();
  
  console.log('=== پایان مثال مدیریت قطعات ===');
}

// نمونه کامل: مدیریت آسانسور
async function completeElevatorManagementExample() {
  console.log('=== شروع مثال مدیریت آسانسور ===');
  
  // 1. ثبت آسانسور جدید
  const newElevator = await createElevator();
  
  if (newElevator) {
    // 2. افزودن قطعه به آسانسور
    await addPartToElevator(newElevator.id, 'part_123');
  }
  
  console.log('=== پایان مثال مدیریت آسانسور ===');
}

// ====================================
// 🚀 Export Functions (for use in modules)
// ====================================

// اگر از ES6 modules استفاده می‌کنید:
/*
export {
  sendOTP,
  verifyOTP,
  getPartsList,
  createNewPart,
  transferPart,
  createElevator,
  addPartToElevator,
  createSupportRequest,
  getUserProfile,
  updateProfile,
  getPartsReport,
  uploadImage,
  validateToken,
  refreshTokenIfNeeded,
  logout
};
*/

// برای تست سریع در Console:
console.log('✅ نمونه‌های API آماده‌اند. برای شروع تست completePartsManagementExample() را اجرا کنید.');

// ====================================
// 📱 10. React Hooks Examples
// ====================================

// نمونه Custom Hook برای React
/*
import { useState, useEffect } from 'react';

export function usePartsList(page = 1, limit = 20, search = '') {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    async function fetchParts() {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getPartsList(page, limit, search);
        setParts(data.parts);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchParts();
  }, [page, limit, search]);

  return { parts, loading, error, pagination };
}

// استفاده در کامپوننت:
function PartsListComponent() {
  const { parts, loading, error, pagination } = usePartsList(1, 20, '');

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا: {error}</div>;

  return (
    <div>
      {parts.map(part => (
        <div key={part.id}>{part.name}</div>
      ))}
    </div>
  );
}
*/