// لاحظ إننا شيلنا كل إعدادات جوجل من هنا
// الملف ده مبقاش يعرف أي حاجة عن المفتاح السري

export const generateProductImage = async (
  productImage: File,
  prompt: string,
  swapImage: File | null
): Promise<string> => {
  
  // 1. بنحضر الداتا عشان نبعتها للـ Function بتاعتنا
  const formData = new FormData();
  formData.append('productImage', productImage);
  formData.append('prompt', prompt);
  if (swapImage) {
    formData.append('swapImage', swapImage);
  }

  // 2. بنكلم الـ Function الآمنة اللي عملناها على Netlify
  // (ده مجرد رابط داخلي في الموقع)
  const response = await fetch('/.netlify/functions/generate', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    // لو الـ Function رجعت خطأ، بنظهره في الواجهة
    throw new Error(result.error || "للأسف حصل خطأ. حاول تاني.");
  }

  // 3. بنرجع الصورة الجاهزة للواجهة
  return result.base64Data;
};
