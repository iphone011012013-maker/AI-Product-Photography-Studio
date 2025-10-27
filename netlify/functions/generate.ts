import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}import { GoogleGenAI, Modality, Part } from "@google/genai";

// 1. قراءة المفتاح السري بأمان من إعدادات Netlify
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  return new Response(JSON.stringify({ error: "API key is not configured." }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' },
  });
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// 2. دي الـ Function اللي هتشتغل على السيرفر
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productImage = formData.get('productImage') as File;
    const swapImage = formData.get('swapImage') as File | null;
    const prompt = formData.get('prompt') as string;

    if (!productImage || !prompt) {
      return new Response(JSON.stringify({ error: "Missing required fields." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const model = 'gemini-2.5-flash-image';
    
    // 3. تحويل الصور زي الكود القديم
    const parts: Part[] = [await fileToGenerativePart(productImage)];

    if (swapImage) {
      parts.push(await fileToGenerativePart(swapImage));
    }
    
    parts.push({ text: prompt });

    // 4. استدعاء Gemini بأمان من السيرفر
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    // 5. إرجاع الصورة للواجهة
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return new Response(JSON.stringify({ base64Data: part.inlineData.data }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    throw new Error("No image was generated.");

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}


// --- دي دوال مساعدة ---
async function fileToGenerativePart(file: File): Promise<Part> {
  const arrayBuffer = await file.arrayBuffer();
  const base64EncodedData = Buffer.from(arrayBuffer).toString('base64');
  
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}
