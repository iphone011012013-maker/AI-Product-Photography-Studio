import React, { useState } from 'react';
import { GenerationMode } from './types';
import { generateProductImage } from './services/geminiService';
import { RefreshIcon, SparklesIcon } from './components/Icons';
import ImageUploader from './components/ImageUploader';
import ImageComparator from './components/ImageComparator';
import HistoryTray from './components/HistoryTray';

const App: React.FC = () => {
  const [mode, setMode] = useState<GenerationMode>(GenerationMode.Mockup);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [swapImage, setSwapImage] = useState<File | null>(null);
  const [selectedMockup, setSelectedMockup] = useState<string>('on a studio white background with soft shadows');
  
  const [currentGeneratedImageUrl, setCurrentGeneratedImageUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mockups: { [key: string]: string } = {
    // Standard & Clean
    "خلفية ستوديو بيضا": "on a studio white background with soft shadows",
    "سطح رخام": "on a clean marble surface",
    "على مكتب خشب": "on a wooden desk with soft daylight",
    "على رخامة المطبخ": "on a modern kitchen countertop with natural light",
    "على ترابيزة كافيه": "on an outdoor cafe table with a blurred background",
    
    // Natural & Organic
    "على منصة وسط أحجار وأوراق شجر": "on a podium surrounded by smooth stones and green leaves, with soft, clean lighting",
    "على طبق خشب مع ورد و دخان خفيف": "on a wooden plate with chamomile flowers and soft smoke, placed on a gentle linen cloth",
    "في غابة وسط الضباب والزرع": "on a mossy log in a misty forest, surrounded by small wildflowers and water droplets",
    "بإضاءة شباك درامية وظل حاد": "with dramatic, sharp shadows from a window, creating a high-contrast, artistic look",
    "على قاعدة أسمنتية بإضاءة فخمة": "on a concrete pedestal with dramatic, focused lighting and a minimalist, luxurious feel",
    "المنتج في إيد وسط زرع ومود لونه وردي": "product held by a hand with a background of lush greenery and a pink, bubbly aesthetic",
    
    // Creative Lighting
    "بإضاءة الشمس وقت الغروب (Golden Hour)": "bathed in the warm, golden light of a sunset, creating long, soft shadows",
    "على سطح غامق ومتسلط عليه ضوء سبوت": "on a dark surface with a single, dramatic spotlight shining down from above",
    "على سطح مبلول وعاكس أضواء نيون": "on a wet surface reflecting vibrant neon lights, creating a futuristic, dreamy mood",
    "مع خلفية فيها أضواء بوكيه سايحة": "with a blurred background of twinkling bokeh lights, giving a magical and festive feel",
    "صورة أبيض وأسود بتبرز ملامح المنتج": "in a high-contrast black and white style, focusing on texture and form",
    "المنتج طاير في الهوا مع عناصر تانية": "floating in the air, surrounded by elements like wood fragments and botanicals, against a warm gradient background",
  };

  const handleModeChange = (newMode: GenerationMode) => {
    setMode(newMode);
    setError(null);
    setSwapImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productImage) {
      setError("لو سمحت، ارفع صورة المنتج الأول.");
      return;
    }

    let finalPrompt = '';
    let finalSwapImage: File | null = null;

    switch (mode) {
      case GenerationMode.Mockup:
        finalPrompt = selectedMockup;
        break;
      case GenerationMode.Swap:
        if (!swapImage) {
            setError("لو سمحت، ارفع صورة المشهد اللي عايز تدمج فيه المنتج.");
            return;
        }
        finalPrompt = "Take the main product from the first image and place it realistically in the second image, matching the lighting, shadows, and overall style of the scene.";
        finalSwapImage = swapImage;
        break;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const base64Data = await generateProductImage(productImage, finalPrompt, finalSwapImage);
      const newImageUrl = `data:image/png;base64,${base64Data}`;
      setCurrentGeneratedImageUrl(newImageUrl);
      setHistory(prevHistory => [newImageUrl, ...prevHistory]);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "للأسف حصل خطأ واحنا بنعمل الصورة. حاول تاني.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentGeneratedImageUrl(null);
    setError(null);
  };

  const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  }

  const handleReuseImage = async (imageUrl: string) => {
    const file = await dataURLtoFile(imageUrl, 'reused-product.png');
    setProductImage(file);
    setProductImageUrl(imageUrl);
    setCurrentGeneratedImageUrl(null);
    setHistory([]);
    setError(null);
  };
  
  if (currentGeneratedImageUrl && productImageUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-4">صورتك الجديدة جاهزة!</h1>
          <p className="text-gray-400 mb-8">حرك السلايدر عشان تقارن بين الصورة الأصلية والصورة اللي عملها الذكاء الاصطناعي.</p>
          
          <ImageComparator beforeImageUrl={productImageUrl} afterImageUrl={currentGeneratedImageUrl} />

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={currentGeneratedImageUrl}
              download="generated-product-image.png"
              className="w-full sm:w-auto bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-lg"
            >
              نزّل الصورة
            </a>
            <button
              onClick={handleCreateNew}
              className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RefreshIcon />
              اعمل صورة جديدة
            </button>
          </div>
          
          {history.length > 0 && (
            <HistoryTray
              history={history}
              currentImageUrl={currentGeneratedImageUrl}
              onSelect={(imageUrl) => setCurrentGeneratedImageUrl(imageUrl)}
              onReuse={handleReuseImage}
            />
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block p-4 bg-gray-800 rounded-full mb-4 ring-2 ring-fuchsia-500/50">
            <SparklesIcon />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">استوديو تصوير المنتجات بالذكاء الاصطناعي</h1>
          <p className="mt-4 text-lg text-gray-400">ارفع صورة منتجك، واختار من الموكابس الجاهزة أو ادمجه في أي مشهد تاني عشان تطلع صور احترافية في ثواني ✨</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800/50 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700">
          <ImageUploader 
            id="product-image"
            label="📦 صورة المنتج الأساسي"
            onFileSelect={(file, url) => {
              setProductImage(file);
              setProductImageUrl(url);
              setHistory([]);
            }}
            previewUrl={productImageUrl}
            isRequired
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">عايز تعمل إيه؟</label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.values(GenerationMode)).map((value) => {
                const labels = {
                    [GenerationMode.Mockup]: 'موكابس جاهزة',
                    [GenerationMode.Swap]: 'دمج في مشهد',
                };
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleModeChange(value)}
                    className={`px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-fuchsia-500 ${
                      mode === value ? 'bg-fuchsia-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {labels[value]}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="min-h-[15rem] flex flex-col justify-center">
            {mode === GenerationMode.Mockup && (
              <div>
                <label htmlFor="mockup-select" className="block text-sm font-medium text-gray-300 mb-2">اختار الخلفية:</label>
                <select
                  id="mockup-select"
                  value={selectedMockup}
                  onChange={(e) => setSelectedMockup(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  {Object.entries(mockups).map(([name, promptValue]) => (
                    <option key={name} value={promptValue}>{name}</option>
                  ))}
                </select>
              </div>
            )}
            
            {mode === GenerationMode.Swap && (
                <div className="space-y-4">
                    <p className="text-sm text-center text-gray-400 bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        هناخد المنتج من <b>الصورة الأساسية</b> ونحطه في <b>صورة المشهد</b> اللي هترفعها.
                    </p>
                    <ImageUploader
                        id="swap-image"
                        label="📸 ارفع صورة المشهد"
                        onFileSelect={(file) => setSwapImage(file)}
                        isRequired
                    />
                </div>
            )}
          </div>
          
          {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}

          <button
            type="submit"
            disabled={isLoading || !productImage}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 shadow-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ثواني بنحضر الصورة...
              </>
            ) : (
              <>
                <SparklesIcon />
                يلا نعمل الصورة
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;