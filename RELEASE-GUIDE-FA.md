# انتشار مستقیم و به‌روزرسانی ترکیبی میراث ایرانیان

## پیش‌نیازها
- حساب Expo و یک EAS Project ID واقعی؛ تا پیش از تنظیم آن، OTA غیرفعال است.
- مالکیت و دسترسی مدیریتی به HTTPS دامنه `mirasiranian.com` و امکان بارگذاری فایل.
- یک **کلید امضای release ثابت** که نزد شرکت با نسخه پشتیبان امن نگهداری شود. هیچ کلیدی در این بسته وجود ندارد.

## ساخت نخستین APK
1. `npm install`
2. `npx eas-cli login` (ورود توسط مالک حساب، بدون ارسال رمز به دیگران)
3. `npx eas-cli project:init` و دریافت Project ID
4. متغیر `EXPO_PROJECT_ID` را در محیط build تنظیم کنید؛ برای EAS Build آن را در EAS Environment Variables تعریف کنید یا از فایل محلی .env غیرمنتشرشده استفاده کنید.
5. `npx eas-cli build --platform android --profile production-apk` و هنگام پرسش، مدیریت امن credentials را انجام دهید.
6. APK واقعی را تست کنید؛ سپس در `https://mirasiranian.com/app/android/miras-iranian-v1.0.0.apk` منتشر کنید.
7. فایل `release/latest.json` را در `/app/android/latest.json` و `release/download.html` را در صفحه دانلود سایت منتشر کنید. فایل JSON را **فقط بعد از** بارگذاری و آزمایش APK منتشر کنید.

## انتشار نسخه جدید APK
- شماره `android.versionCode` را از 1 به 2، 3 و ... افزایش دهید؛ `version` را نیز افزایش دهید.
- **همان Android package** (`com.mirasiranian.app`) و **همان کلید امضا** را حفظ کنید؛ در غیر این صورت نصب روی نسخه قبل امکان‌پذیر نیست.
- `npx eas-cli build --platform android --profile production-apk` را اجرا و خروجی را تست کنید.
- APK را روی سایت بگذارید؛ سپس `latest.json` را با versionCode بالاتر و URL جدید به‌روزرسانی کنید.
- نصب نسخه جدید به تأیید کاربر نیاز دارد؛ برنامه مجوز نصب بی‌صدا ندارد.

## انتشار OTA برای تغییرات سازگار
- فقط برای JS/assets سازگار با همان runtime و کد native.
- با نسخه `1.0.0` و `runtimeVersion: appVersion` می‌توان از دستور `npx eas-cli update --channel production --message "..."` استفاده کرد، پس از اتصال project ID و ساخت APK با کانال production.
- با تغییر کتابخانه‌های native، تنظیمات Android یا runtime باید APK جدید بسازید.
- قبل از انتشار عمومی روی کانال preview آزمایش کنید.
- Expo Go رفتار واقعی EAS Update را شبیه‌سازی نمی‌کند.

## نکات امنیتی و انتشار
- دانلود فقط از HTTPS دامنه رسمی؛ لینک manifest به دامنه رسمی محدود شده است.
- Play Protect ممکن است هشدار نصب خارج از فروشگاه نشان دهد؛ هیچ تضمینی برای حذف هشدار وجود ندارد.
- برای کاربران زیاد از CDN، کش مناسب APK و `Cache-Control: no-store` برای latest.json استفاده کنید.
- اطلاعات ورود، سفارش، کیف پول و بازاریابی باید در سرور ذخیره شوند؛ این نمونه نمایشی است.
- `com.mirasiranian.app` با شناسه نمونه قبلی `com.mirasiranian.demo` متفاوت است؛ **اگر نسخه demo نصب باشد، این نسخه جایگزین آن نمی‌شود**. شناسه نهایی را قبل از نخستین انتشار تثبیت کنید.
- نسخه‌های قبلی را نگه دارید و برای خطاها برنامه بازگشت داشته باشید؛ OTA ممکن است نیازمند rollback باشد.
