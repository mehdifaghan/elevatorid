import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Plus, FolderTree } from 'lucide-react';

export default function PartsSample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1>مدیریت قطعات</h1>
          <p>لیست و مدیریت تمامی قطعات سیستم</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FolderTree className="w-4 h-4 ml-2" />
                مدیریت دسته‌بندی
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>مدیریت دسته‌بندی قطعات</DialogTitle>
                <DialogDescription>
                  ایجاد و مدیریت دسته‌بندی‌های قطعات
                </DialogDescription>
              </DialogHeader>
              <CategoryManagement onClose={() => setIsModalOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>لیست قطعات</CardTitle>
        </CardHeader>
        <CardContent>
          <p>جدول قطعات در اینجا نمایش داده می‌شود</p>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryManagement({ onClose }: { onClose: () => void }) {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between border-b pb-4">
        <h3>لیست دسته‌بندی‌ها</h3>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 ml-2" />
              افزودن دسته
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن دسته جدید</DialogTitle>
            </DialogHeader>
            <AddCategoryForm onClose={() => setIsAddOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="p-4">
        <p>دسته‌بندی‌ها در اینجا نمایش داده می‌شوند</p>
      </div>
      
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button onClick={onClose}>
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
}

function AddCategoryForm({ onClose }: { onClose: () => void }) {
  return (
    <form className="space-y-4" dir="rtl">
      <p>فرم افزودن دسته در اینجا قرار می‌گیرد</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">
          افزودن دسته
        </Button>
      </div>
    </form>
  );
}