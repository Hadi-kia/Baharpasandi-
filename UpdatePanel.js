import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, Linking, Platform, StyleSheet} from 'react-native';
import * as Updates from 'expo-updates';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

const manifestUrl = Constants.expoConfig?.extra?.releaseManifestUrl;
const currentVersion = Constants.expoConfig?.version || '0.0.0';
const currentCode = Number(Application.nativeBuildVersion || Constants.expoConfig?.android?.versionCode || 0);

export default function UpdatePanel() {
  const [apk, setApk] = useState(null);
  const [status, setStatus] = useState('');
  async function check() {
    if (Platform.OS !== 'android') return;
    setStatus('در حال بررسی نسخه جدید…');
    try {
      // OTA updates only work in a real EAS build configured with a project ID.
      if (Updates.isEnabled) {
        const result = await Updates.checkForUpdateAsync();
        if (result.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert('به‌روزرسانی آماده است', 'برای اعمال تغییرات جدید برنامه راه‌اندازی شود؟', [
            {text:'بعداً',style:'cancel'}, {text:'راه‌اندازی',onPress:()=>Updates.reloadAsync()}
          ]);
          setStatus('به‌روزرسانی محتوایی دریافت شد');
          return;
        }
      }
      if (!manifestUrl?.startsWith('https://')) throw new Error('نشانی نسخه‌ها تنظیم نشده');
      const response = await fetch(`${manifestUrl}?t=${Date.now()}`, {headers:{Accept:'application/json'}});
      if (!response.ok) throw new Error('دریافت اطلاعات نسخه ناموفق بود');
      const data = await response.json();
      if (!Number.isSafeInteger(data.versionCode) || typeof data.apkUrl !== 'string' ||
          !data.apkUrl.startsWith('https://mirasiranian.com/app/android/')) throw new Error('اطلاعات انتشار معتبر نیست');
      if (data.versionCode > currentCode) {
        setApk(data);
        setStatus(`نسخه ${data.version} برای نصب آماده است`);
      } else { setApk(null); setStatus('برنامه به‌روز است'); }
    } catch (e) {setStatus('بررسی به‌روزرسانی در دسترس نیست؛ بعداً تلاش کنید');}
  }
  useEffect(()=>{check();},[]);
  return <View style={s.panel}>
    <Text style={s.title}>به‌روزرسانی برنامه</Text>
    <Text style={s.note}>نسخه نصب‌شده: {currentVersion} (ساخت {currentCode})</Text>
    <Text style={s.note}>{status}</Text>
    {apk && <TouchableOpacity style={s.button} onPress={()=>Alert.alert('دانلود نسخه جدید', 'فایل APK از وب‌سایت رسمی باز می‌شود. نصب با تأیید شما انجام خواهد شد.',[
      {text:'انصراف',style:'cancel'}, {text:'دانلود',onPress:()=>Linking.openURL(apk.apkUrl)}
    ])}><Text style={s.buttonText}>دریافت نسخه {apk.version}</Text></TouchableOpacity>}
    <TouchableOpacity style={s.button} onPress={check}><Text style={s.buttonText}>بررسی مجدد</Text></TouchableOpacity>
  </View>;
}
const s=StyleSheet.create({panel:{backgroundColor:'#fff',padding:16,borderRadius:16,marginBottom:12},title:{fontSize:18,fontWeight:'800',textAlign:'right',color:'#174b3b'},note:{textAlign:'right',color:'#66766d',marginTop:8},button:{backgroundColor:'#174b3b',borderRadius:10,padding:12,marginTop:10},buttonText:{color:'#fff',textAlign:'center',fontWeight:'700'}});
