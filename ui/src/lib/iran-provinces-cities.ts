// لیست کامل استان‌ها و شهرهای ایران
export interface City {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
  cities: City[];
}

export const iranProvincesAndCities: Province[] = [
  {
    id: 1,
    name: "آذربایجان شرقی",
    cities: [
      { id: 1, name: "تبریز" },
      { id: 2, name: "مراغه" },
      { id: 3, name: "مرند" },
      { id: 4, name: "میانه" },
      { id: 5, name: "شبستر" },
      { id: 6, name: "هریس" },
      { id: 7, name: "جلفا" },
      { id: 8, name: "هشترود" },
      { id: 9, name: "بناب" },
      { id: 10, name: "کلیبر" },
      { id: 11, name: "اهر" },
      { id: 12, name: "ملکان" },
      { id: 13, name: "ورزقان" },
      { id: 14, name: "آذرشهر" },
      { id: 15, name: "سراب" },
      { id: 16, name: "چاراویماق" }
    ]
  },
  {
    id: 2,
    name: "آذربایجان غربی",
    cities: [
      { id: 17, name: "ارومیه" },
      { id: 18, name: "خوی" },
      { id: 19, name: "مهاباد" },
      { id: 20, name: "نقده" },
      { id: 21, name: "سلماس" },
      { id: 22, name: "بوکان" },
      { id: 23, name: "پیرانشهر" },
      { id: 24, name: "میاندوآب" },
      { id: 25, name: "چالدران" },
      { id: 26, name: "تکاب" },
      { id: 27, name: "شاهین‌دژ" },
      { id: 28, name: "سردشت" },
      { id: 29, name: "مکری" },
      { id: 30, name: "پلدشت" },
      { id: 31, name: "اشنویه" },
      { id: 32, name: "چایپاره" }
    ]
  },
  {
    id: 3,
    name: "اردبیل",
    cities: [
      { id: 33, name: "اردبیل" },
      { id: 34, name: "پارس‌آباد" },
      { id: 35, name: "خلخال" },
      { id: 36, name: "مشگین‌شهر" },
      { id: 37, name: "بیله‌سوار" },
      { id: 38, name: "گرمی" },
      { id: 39, name: "کوثر" },
      { id: 40, name: "نمین" },
      { id: 41, name: "نیر" },
      { id: 42, name: "سرعین" }
    ]
  },
  {
    id: 4,
    name: "اصفهان",
    cities: [
      { id: 43, name: "اصفهان" },
      { id: 44, name: "کاشان" },
      { id: 45, name: "نجف‌آباد" },
      { id: 46, name: "خمینی‌شهر" },
      { id: 47, name: "شاهین‌شهر" },
      { id: 48, name: "فولادشهر" },
      { id: 49, name: "مبارکه" },
      { id: 50, name: "لنجان" },
      { id: 51, name: "نطنز" },
      { id: 52, name: "اردستان" },
      { id: 53, name: "فریدن" },
      { id: 54, name: "فریدونشهر" },
      { id: 55, name: "فلاورجان" },
      { id: 56, name: "خوانسار" },
      { id: 57, name: "گلپایگان" },
      { id: 58, name: "دهاقان" },
      { id: 59, name: "تیران" },
      { id: 60, name: "کرون" },
      { id: 61, name: "سمیرم" },
      { id: 62, name: "بوئین‌میاندشت" },
      { id: 63, name: "نایین" },
      { id: 64, name: "آران و بیدگل" }
    ]
  },
  {
    id: 5,
    name: "البرز",
    cities: [
      { id: 65, name: "کرج" },
      { id: 66, name: "فردیس" },
      { id: 67, name: "نظرآباد" },
      { id: 68, name: "هشتگرد" },
      { id: 69, name: "طالقان" },
      { id: 70, name: "چهارباغ" },
      { id: 71, name: "کمال‌شهر" },
      { id: 72, name: "گلستان" },
      { id: 73, name: "ساوجبلاغ" },
      { id: 74, name: "اشتهارد" },
      { id: 75, name: "کوهسار" },
      { id: 76, name: "محمدشهر" }
    ]
  },
  {
    id: 6,
    name: "ایلام",
    cities: [
      { id: 77, name: "ایلام" },
      { id: 78, name: "مهران" },
      { id: 79, name: "دهلران" },
      { id: 80, name: "آبدانان" },
      { id: 81, name: "دره‌شهر" },
      { id: 82, name: "ایوان" },
      { id: 83, name: "شیروان و چرداول" },
      { id: 84, name: "ملکشاهی" },
      { id: 85, name: "سرابله" },
      { id: 86, name: "بدره" }
    ]
  },
  {
    id: 7,
    name: "بوشهر",
    cities: [
      { id: 87, name: "بوشهر" },
      { id: 88, name: "برازجان" },
      { id: 89, name: "خرمشهر" },
      { id: 90, name: "کنگان" },
      { id: 91, name: "گناوه" },
      { id: 92, name: "جم" },
      { id: 93, name: "دشتستان" },
      { id: 94, name: "دشتی" },
      { id: 95, name: "دیر" },
      { id: 96, name: "دیلم" },
      { id: 97, name: "تنگستان" }
    ]
  },
  {
    id: 8,
    name: "تهران",
    cities: [
      { id: 98, name: "تهران" },
      { id: 99, name: "اسلامشهر" },
      { id: 100, name: "کرج" },
      { id: 101, name: "ری" },
      { id: 102, name: "شهریار" },
      { id: 103, name: "ورامین" },
      { id: 104, name: "رباط‌کریم" },
      { id: 105, name: "دماوند" },
      { id: 106, name: "ملارد" },
      { id: 107, name: "پردیس" },
      { id: 108, name: "فیروزکوه" },
      { id: 109, name: "پاکدشت" },
      { id: 110, name: "قدس" },
      { id: 111, name: "شمیرانات" }
    ]
  },
  {
    id: 9,
    name: "چهارمحال و بختیاری",
    cities: [
      { id: 112, name: "شهرکرد" },
      { id: 113, name: "بروجن" },
      { id: 114, name: "فارسان" },
      { id: 115, name: "لردگان" },
      { id: 116, name: "اردل" },
      { id: 117, name: "کوهرنگ" },
      { id: 118, name: "کیار" },
      { id: 119, name: "سامان" },
      { id: 120, name: "بن" }
    ]
  },
  {
    id: 10,
    name: "خراسان جنوبی",
    cities: [
      { id: 121, name: "بیرجند" },
      { id: 122, name: "قائن" },
      { id: 123, name: "فردوس" },
      { id: 124, name: "طبس" },
      { id: 125, name: "نهبندان" },
      { id: 126, name: "درمیان" },
      { id: 127, name: "سرایان" },
      { id: 128, name: "بشرویه" },
      { id: 129, name: "زیرکوه" },
      { id: 130, name: "خوسف" },
      { id: 131, name: "سربیشه" }
    ]
  },
  {
    id: 11,
    name: "خراسان رضوی",
    cities: [
      { id: 132, name: "مشهد" },
      { id: 133, name: "نیشابور" },
      { id: 134, name: "سبزوار" },
      { id: 135, name: "تربت حیدریه" },
      { id: 136, name: "کاشمر" },
      { id: 137, name: "گناباد" },
      { id: 138, name: "قوچان" },
      { id: 139, name: "درگز" },
      { id: 140, name: "کلات" },
      { id: 141, name: "چناران" },
      { id: 142, name: "فریمان" },
      { id: 143, name: "بردسکن" },
      { id: 144, name: "طرقبه شاندیز" },
      { id: 145, name: "خواف" },
      { id: 146, name: "رشتخوار" },
      { id: 147, name: "تربت جام" },
      { id: 148, name: "تایباد" },
      { id: 149, name: "بجستان" },
      { id: 150, name: "مه‌ولات" },
      { id: 151, name: "جوین" },
      { id: 152, name: "زاوه" },
      { id: 153, name: "باخرز" },
      { id: 154, name: "فیروزه" },
      { id: 155, name: "داورزن" }
    ]
  },
  {
    id: 12,
    name: "خراسان شمالی",
    cities: [
      { id: 156, name: "بجنورد" },
      { id: 157, name: "اسفراین" },
      { id: 158, name: "شیروان" },
      { id: 159, name: "فاروج" },
      { id: 160, name: "آشخانه" },
      { id: 161, name: "گرمه" },
      { id: 162, name: "جاجرم" },
      { id: 163, name: "راز و جرگلان" },
      { id: 164, name: "مانه و سملقان" }
    ]
  },
  {
    id: 13,
    name: "خوزستان",
    cities: [
      { id: 165, name: "اهواز" },
      { id: 166, name: "آبادان" },
      { id: 167, name: "خرمشهر" },
      { id: 168, name: "دزفول" },
      { id: 169, name: "اندیمشک" },
      { id: 170, name: "شوشتر" },
      { id: 171, name: "مسجدسلیمان" },
      { id: 172, name: "بهبهان" },
      { id: 173, name: "ایذه" },
      { id: 174, name: "شوش" },
      { id: 175, name: "رامهرمز" },
      { id: 176, name: "هندیجان" },
      { id: 177, name: "امیدیه" },
      { id: 178, name: "باغ‌ملک" },
      { id: 179, name: "لالی" },
      { id: 180, name: "هویزه" },
      { id: 181, name: "کارون" },
      { id: 182, name: "گتوند" },
      { id: 183, name: "شادگان" },
      { id: 184, name: "حمیدیه" },
      { id: 185, name: "دارخوین" },
      { id: 186, name: "بندر ماهشهر" }
    ]
  },
  {
    id: 14,
    name: "زنجان",
    cities: [
      { id: 187, name: "زنجان" },
      { id: 188, name: "ابهر" },
      { id: 189, name: "خدابنده" },
      { id: 190, name: "طارم" },
      { id: 191, name: "ماهنشان" },
      { id: 192, name: "خرمدره" },
      { id: 193, name: "ایجرود" },
      { id: 194, name: "سلطانیه" }
    ]
  },
  {
    id: 15,
    name: "سمنان",
    cities: [
      { id: 195, name: "سمنان" },
      { id: 196, name: "شاهرود" },
      { id: 197, name: "دامغان" },
      { id: 198, name: "گرمسار" },
      { id: 199, name: "آرادان" },
      { id: 200, name: "مهدی‌شهر" },
      { id: 201, name: "میامی" },
      { id: 202, name: "سرخه" }
    ]
  },
  {
    id: 16,
    name: "سیستان و بلوچستان",
    cities: [
      { id: 203, name: "زاهدان" },
      { id: 204, name: "زابل" },
      { id: 205, name: "چابهار" },
      { id: 206, name: "خاش" },
      { id: 207, name: "سراوان" },
      { id: 208, name: "ایرانشهر" },
      { id: 209, name: "کنارک" },
      { id: 210, name: "نیکشهر" },
      { id: 211, name: "میرجاوه" },
      { id: 212, name: "دلگان" },
      { id: 213, name: "رئیسعلی‌دلواری" },
      { id: 214, name: "فنوج" },
      { id: 215, name: "قصرقند" },
      { id: 216, name: "بمپور" },
      { id: 217, name: "سیب و سوران" },
      { id: 218, name: "مهرستان" },
      { id: 219, name: "هیرمند" },
      { id: 220, name: "نیمروز" },
      { id: 221, name: "هامون" }
    ]
  },
  {
    id: 17,
    name: "فارس",
    cities: [
      { id: 222, name: "شیراز" },
      { id: 223, name: "کازرون" },
      { id: 224, name: "مرودشت" },
      { id: 225, name: "جهرم" },
      { id: 226, name: "فسا" },
      { id: 227, name: "داراب" },
      { id: 228, name: "لارستان" },
      { id: 229, name: "آباده" },
      { id: 230, name: "اقلید" },
      { id: 231, name: "فیروزآباد" },
      { id: 232, name: "ممسنی" },
      { id: 233, name: "لامرد" },
      { id: 234, name: "استهبان" },
      { id: 235, name: "سپیدان" },
      { id: 236, name: "نی‌ریز" },
      { id: 237, name: "ارسنجان" },
      { id: 238, name: "پاسارگاد" },
      { id: 239, name: "خرم‌بید" },
      { id: 240, name: "گراش" },
      { id: 241, name: "خنج" },
      { id: 242, name: "بوانات" },
      { id: 243, name: "رستم" },
      { id: 244, name: "کوار" },
      { id: 245, name: "بیضا" },
      { id: 246, name: "زرین‌دشت" },
      { id: 247, name: "خرامه" },
      { id: 248, name: "کارزین" },
      { id: 249, name: "فراشبند" }
    ]
  },
  {
    id: 18,
    name: "قزوین",
    cities: [
      { id: 250, name: "قزوین" },
      { id: 251, name: "البرز" },
      { id: 252, name: "تاکستان" },
      { id: 253, name: "بوئین‌زهرا" },
      { id: 254, name: "آبیک" },
      { id: 255, name: "آوج" }
    ]
  },
  {
    id: 19,
    name: "قم",
    cities: [
      { id: 256, name: "قم" }
    ]
  },
  {
    id: 20,
    name: "کردستان",
    cities: [
      { id: 257, name: "سنندج" },
      { id: 258, name: "سقز" },
      { id: 259, name: "مریوان" },
      { id: 260, name: "بانه" },
      { id: 261, name: "قروه" },
      { id: 262, name: "بیجار" },
      { id: 263, name: "کامیاران" },
      { id: 264, name: "دیواندره" },
      { id: 265, name: "دهگلان" },
      { id: 266, name: "سروآباد" }
    ]
  },
  {
    id: 21,
    name: "کرمان",
    cities: [
      { id: 267, name: "کرمان" },
      { id: 268, name: "رفسنجان" },
      { id: 269, name: "جیرفت" },
      { id: 270, name: "بردسیر" },
      { id: 271, name: "سیرجان" },
      { id: 272, name: "شهربابک" },
      { id: 273, name: "کهنوج" },
      { id: 274, name: "زرند" },
      { id: 275, name: "بم" },
      { id: 276, name: "راور" },
      { id: 277, name: "انار" },
      { id: 278, name: "رودبار" },
      { id: 279, name: "عنبرآباد" },
      { id: 280, name: "ریگان" },
      { id: 281, name: "بافت" },
      { id: 282, name: "کوهبنان" },
      { id: 283, name: "منوجان" },
      { id: 284, name: "قلعه‌گنج" },
      { id: 285, name: "بلوک" },
      { id: 286, name: "فهرج" },
      { id: 287, name: "نرماشیر" },
      { id: 288, name: "رابر" },
      { id: 289, name: "فاریاب" }
    ]
  },
  {
    id: 22,
    name: "کرمانشاه",
    cities: [
      { id: 290, name: "کرمانشاه" },
      { id: 291, name: "اسلام‌آباد غرب" },
      { id: 292, name: "کنگاور" },
      { id: 293, name: "سنقر" },
      { id: 294, name: "صحنه" },
      { id: 295, name: "قصر شیرین" },
      { id: 296, name: "گیلان غرب" },
      { id: 297, name: "هرسین" },
      { id: 298, name: "پاوه" },
      { id: 299, name: "جوانرود" },
      { id: 300, name: "روانسر" },
      { id: 301, name: "ثلاث‌باباجانی" },
      { id: 302, name: "دالاهو" },
      { id: 303, name: "سرپل ذهاب" }
    ]
  },
  {
    id: 23,
    name: "کهگیلویه و بویراحمد",
    cities: [
      { id: 304, name: "یاسوج" },
      { id: 305, name: "دوگنبدان" },
      { id: 306, name: "سی‌سخت" },
      { id: 307, name: "چرام" },
      { id: 308, name: "لیکک" },
      { id: 309, name: "مارگون" },
      { id: 310, name: "باشت" },
      { id: 311, name: "بهمئی" },
      { id: 312, name: "دنا" }
    ]
  },
  {
    id: 24,
    name: "گلستان",
    cities: [
      { id: 313, name: "گرگان" },
      { id: 314, name: "بندر گز" },
      { id: 315, name: "علی‌آباد کتول" },
      { id: 316, name: "مینودشت" },
      { id: 317, name: "کردکوی" },
      { id: 318, name: "بندر ترکمن" },
      { id: 319, name: "آق‌قلا" },
      { id: 320, name: "کلاله" },
      { id: 321, name: "مراوه‌تپه" },
      { id: 322, name: "آزادشهر" },
      { id: 323, name: "رامیان" },
      { id: 324, name: "گمیش‌تپه" },
      { id: 325, name: "گالیکش" },
      { id: 326, name: "گنبد کاووس" }
    ]
  },
  {
    id: 25,
    name: "گیلان",
    cities: [
      { id: 327, name: "رشت" },
      { id: 328, name: "انزلی" },
      { id: 329, name: "لاهیجان" },
      { id: 330, name: "لنگرود" },
      { id: 331, name: "رودسر" },
      { id: 332, name: "آستارا" },
      { id: 333, name: "تالش" },
      { id: 334, name: "صومعه‌سرا" },
      { id: 335, name: "فومن" },
      { id: 336, name: "شفت" },
      { id: 337, name: "ماسال" },
      { id: 338, name: "رضوانشهر" },
      { id: 339, name: "املش" },
      { id: 340, name: "سیاهکل" },
      { id: 341, name: "آستانه اشرفیه" },
      { id: 342, name: "رودبار" }
    ]
  },
  {
    id: 26,
    name: "لرستان",
    cities: [
      { id: 343, name: "خرم‌آباد" },
      { id: 344, name: "بروجرد" },
      { id: 345, name: "دلفان" },
      { id: 346, name: "دورود" },
      { id: 347, name: "کوهدشت" },
      { id: 348, name: "الیگودرز" },
      { id: 349, name: "ازنا" },
      { id: 350, name: "پل‌دختر" },
      { id: 351, name: "نورآباد" },
      { id: 352, name: "رومشکان" },
      { id: 353, name: "سلسله" }
    ]
  },
  {
    id: 27,
    name: "مازندران",
    cities: [
      { id: 354, name: "ساری" },
      { id: 355, name: "بابل" },
      { id: 356, name: "آمل" },
      { id: 357, name: "قائم‌شهر" },
      { id: 358, name: "بابلسر" },
      { id: 359, name: "نوشهر" },
      { id: 360, name: "چالوس" },
      { id: 361, name: "تنکابن" },
      { id: 362, name: "نکا" },
      { id: 363, name: "محمودآباد" },
      { id: 364, name: "فریدونکنار" },
      { id: 365, name: "جویبار" },
      { id: 366, name: "کلاردشت" },
      { id: 367, name: "سوادکوه" },
      { id: 368, name: "گلوگاه" },
      { id: 369, name: "مینودشت" },
      { id: 370, name: "عباس‌آباد" },
      { id: 371, name: "کیاسر" },
      { id: 372, name: "سیمرغ" },
      { id: 373, name: "میاندورود" },
      { id: 374, name: "بهشهر" },
      { id: 375, name: "رستمکلا" },
      { id: 376, name: "سرخرود" }
    ]
  },
  {
    id: 28,
    name: "مرکزی",
    cities: [
      { id: 377, name: "اراک" },
      { id: 378, name: "ساوه" },
      { id: 379, name: "خمین" },
      { id: 380, name: "محلات" },
      { id: 381, name: "دلیجان" },
      { id: 382, name: "تفرش" },
      { id: 383, name: "آشتیان" },
      { id: 384, name: "فراهان" },
      { id: 385, name: "کمیجان" },
      { id: 386, name: "شازند" },
      { id: 387, name: "زرندیه" }
    ]
  },
  {
    id: 29,
    name: "هرمزگان",
    cities: [
      { id: 388, name: "بندرعباس" },
      { id: 389, name: "کیش" },
      { id: 390, name: "قشم" },
      { id: 391, name: "بندر لنگه" },
      { id: 392, name: "میناب" },
      { id: 393, name: "جاسک" },
      { id: 394, name: "حاجی‌آباد" },
      { id: 395, name: "رودان" },
      { id: 396, name: "بستک" },
      { id: 397, name: "پارسیان" },
      { id: 398, name: "سیریک" },
      { id: 399, name: "خمیر" },
      { id: 400, name: "ابوموسی" }
    ]
  },
  {
    id: 30,
    name: "همدان",
    cities: [
      { id: 401, name: "همدان" },
      { id: 402, name: "ملایر" },
      { id: 403, name: "نهاوند" },
      { id: 404, name: "تویسرکان" },
      { id: 405, name: "اسدآباد" },
      { id: 406, name: "بهار" },
      { id: 407, name: "کبودراهنگ" },
      { id: 408, name: "رزن" },
      { id: 409, name: "فامنین" }
    ]
  },
  {
    id: 31,
    name: "یزد",
    cities: [
      { id: 410, name: "یزد" },
      { id: 411, name: "اردکان" },
      { id: 412, name: "میبد" },
      { id: 413, name: "مهریز" },
      { id: 414, name: "تفت" },
      { id: 415, name: "ابرکوه" },
      { id: 416, name: "بافق" },
      { id: 417, name: "بهاباد" },
      { id: 418, name: "خاتم" },
      { id: 419, name: "اشکذر" }
    ]
  }
];

// Helper functions
export const getProvinceById = (id: number): Province | undefined => {
  return iranProvincesAndCities.find(province => province.id === id);
};

export const getCityById = (cityId: number): { city: City; province: Province } | undefined => {
  for (const province of iranProvincesAndCities) {
    const city = province.cities.find(c => c.id === cityId);
    if (city) {
      return { city, province };
    }
  }
  return undefined;
};

export const getCitiesByProvinceId = (provinceId: number): City[] => {
  const province = getProvinceById(provinceId);
  return province ? province.cities : [];
};

export const searchProvinces = (query: string): Province[] => {
  const searchTerm = query.toLowerCase().trim();
  if (!searchTerm) return iranProvincesAndCities;
  
  return iranProvincesAndCities.filter(province =>
    province.name.toLowerCase().includes(searchTerm)
  );
};

export const searchCities = (query: string, provinceId?: number): City[] => {
  const searchTerm = query.toLowerCase().trim();
  
  const provinces = provinceId 
    ? [getProvinceById(provinceId)].filter(Boolean) as Province[]
    : iranProvincesAndCities;
    
  const allCities = provinces.flatMap(province => province.cities);
  
  if (!searchTerm) return allCities;
  
  return allCities.filter(city =>
    city.name.toLowerCase().includes(searchTerm)
  );
};