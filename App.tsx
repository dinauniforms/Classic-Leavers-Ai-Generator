
import React, { useState, useCallback, useMemo } from 'react';
import { Step, UserDesign } from './types';
import { DESIGNS, COLORS } from './constants';
import Layout from './components/Layout';
import QuoteModal from './components/QuoteModal';
import { generateAiMockup } from './utils/aiHelper';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.LANDING);
  const [isGenerating, setIsGenerating] = useState<'mens' | 'womens' | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [designState, setDesignState] = useState<UserDesign>({
    designId: null,
    colorHexes: [],
    logoUrl: null,
    generatedImageUrl: null,
  });

  const selectedDesign = useMemo(() => 
    DESIGNS.find(d => d.id === designState.designId), 
    [designState.designId]
  );

  const selectedColors = useMemo(() => 
    designState.colorHexes.map(hex => COLORS.find(c => c.hex === hex)).filter(Boolean),
    [designState.colorHexes]
  );

  const nextStep = useCallback(() => {
    switch (currentStep) {
      case Step.LANDING: setCurrentStep(Step.DESIGN); break;
      case Step.DESIGN: setCurrentStep(Step.COLOR); break;
      case Step.COLOR: setCurrentStep(Step.LOGO); break;
      case Step.LOGO: setCurrentStep(Step.PREVIEW); break;
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    switch (currentStep) {
      case Step.DESIGN: setCurrentStep(Step.LANDING); break;
      case Step.COLOR: setCurrentStep(Step.DESIGN); break;
      case Step.LOGO: setCurrentStep(Step.COLOR); break;
      case Step.PREVIEW: setCurrentStep(Step.LOGO); break;
    }
  }, [currentStep]);

  const handleDesignSelect = (id: string) => {
    const newDesign = DESIGNS.find(d => d.id === id);
    setDesignState(prev => ({ 
      ...prev, 
      designId: id,
      colorHexes: prev.colorHexes.slice(0, newDesign?.maxColors || 3)
    }));
    nextStep();
  };

  const handleColorSelect = (hex: string) => {
    const maxColors = selectedDesign?.maxColors || 3;
    setDesignState(prev => {
      const isSelected = prev.colorHexes.includes(hex);
      if (isSelected) {
        return { ...prev, colorHexes: prev.colorHexes.filter(h => h !== hex) };
      } else {
        if (prev.colorHexes.length < maxColors) {
          return { ...prev, colorHexes: [...prev.colorHexes, hex] };
        }
      }
      return prev;
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDesignState(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async (gender: 'mens' | 'womens') => {
    if (!designState.designId || designState.colorHexes.length === 0) return;
    
    setIsGenerating(gender);
    const design = DESIGNS.find(d => d.id === designState.designId);
    if (design) {
      try {
        const colorNames = selectedColors.map(c => c?.name || '');
        const finalImage = await generateAiMockup(
          design.image, 
          designState.logoUrl,
          design.name,
          colorNames,
          gender
        );
        setDesignState(prev => ({ ...prev, generatedImageUrl: finalImage }));
        nextStep();
      } catch (error) {
        console.error("Failed to generate AI mockup:", error);
        alert("We encountered an issue crafting your AI mockup. Please try again.");
      } finally {
        setIsGenerating(null);
      }
    }
  };

  const resetApp = () => {
    setDesignState({
      designId: null,
      colorHexes: [],
      logoUrl: null,
      generatedImageUrl: null,
    });
    setCurrentStep(Step.LANDING);
  };

  return (
    <Layout 
      title={currentStep === Step.LANDING ? undefined : ""} 
      onBack={prevStep}
      onLogoClick={resetApp}
      showBack={currentStep !== Step.LANDING}
    >
      {/* LANDING SCREEN */}
      {currentStep === Step.LANDING && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-4xl mx-auto pt-16">
          <div className="flex flex-col items-center w-full mb-12">
            <h1 className="flex flex-col text-7xl md:text-[9.5rem] font-black tracking-[0.005em] leading-[0.85] text-[#141B21] pb-8">
              <span>School</span>
              <span>Leavers</span>
            </h1>
            <p className="text-3xl md:text-5xl text-[#141B21] font-medium">
              <span className="font-bold">Make it</span> <span className="italic font-serif">Classic.</span>
            </p>
          </div>
          <button 
            onClick={nextStep}
            className="px-14 py-5 bg-[#0071e3] text-white rounded-full text-xl font-semibold hover:bg-[#0077ed] transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
          >
            Start Designing
          </button>
        </div>
      )}

      {/* STEP 1: SELECT DESIGN */}
      {currentStep === Step.DESIGN && (
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4 text-[#141B21]">Choose your Style</h2>
            <p className="text-gray-500 text-lg">Select from one of our top three best sellers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {DESIGNS.map(design => (
              <div 
                key={design.id}
                onClick={() => handleDesignSelect(design.id)}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div 
                  className={`relative w-full aspect-[4/5] overflow-hidden rounded-[40px] bg-white apple-shadow transition-all duration-500 border-2 flex items-center justify-center p-6 ${
                    designState.designId === design.id ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={design.image} 
                    alt={design.name}
                    className={`w-auto object-contain group-hover:scale-105 transition-transform duration-700 ease-out ${
                      design.id === 'classic-hoop' ? 'h-[100%]' : 'h-[92%]'
                    }`}
                    crossOrigin="anonymous"
                  />
                  
                  {designState.designId === design.id && (
                    <div className="absolute top-6 right-6 bg-blue-500 text-white p-1.5 rounded-full shadow-lg z-10 animate-in zoom-in duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 text-center">
                  <h3 className="text-2xl font-bold tracking-tight text-[#141B21]">{design.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT COLOURS */}
      {currentStep === Step.COLOR && (
        <div className="w-full max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4 text-[#141B21]">Select your Colours</h2>
            <p className="text-gray-500 text-lg">The {selectedDesign?.name} allows up to {selectedDesign?.maxColors} colours.</p>
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: selectedDesign?.maxColors || 3 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`w-12 h-2 rounded-full transition-all duration-500 ${
                    i < designState.colorHexes.length ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-y-12 gap-x-4">
            {COLORS.map(color => {
              const index = designState.colorHexes.indexOf(color.hex);
              const isSelected = index !== -1;
              const isDisabled = !isSelected && designState.colorHexes.length >= (selectedDesign?.maxColors || 3);
              
              return (
                <button
                  key={color.hex}
                  onClick={() => handleColorSelect(color.hex)}
                  disabled={isDisabled}
                  className={`group flex flex-col items-center gap-4 focus:outline-none transition-opacity ${isDisabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                >
                  <div className="relative">
                    <div 
                      className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-lg transition-all transform ${
                        isSelected 
                          ? 'ring-4 ring-blue-500 ring-offset-4 scale-105' 
                          : 'border border-gray-100 group-hover:scale-110'
                      }`}
                      style={{ 
                        backgroundColor: color.hex,
                        boxShadow: color.hex.toLowerCase() === '#ffffff' ? 'inset 0 0 0 1px rgba(0,0,0,0.1)' : 'none'
                      }}
                    ></div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-xs font-bold">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-500 group-hover:text-black transition-colors uppercase tracking-[0.2em] text-center">
                    {color.name}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-20 flex justify-center">
             <button 
                onClick={nextStep}
                disabled={designState.colorHexes.length === 0}
                className={`px-16 py-5 rounded-full text-xl font-bold transition-all transform active:scale-95 shadow-2xl ${
                  designState.colorHexes.length > 0 
                  ? 'bg-[#0071e3] text-white hover:bg-[#0077ed] shadow-blue-500/20' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit
              </button>
          </div>
        </div>
      )}

      {/* STEP 3: UPLOAD LOGO */}
      {currentStep === Step.LOGO && (
        <div className="w-full max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4 text-[#141B21]">Add Your Logo</h2>
            <p className="text-gray-500 text-lg">Upload your school logo to be placed on the chest.</p>
          </div>
          <div className="bg-white p-12 rounded-[48px] apple-shadow border-2 border-dashed border-gray-200 hover:border-blue-400 transition-colors flex flex-col items-center">
            {designState.logoUrl ? (
              <div className="relative group mb-8">
                <img 
                  src={designState.logoUrl} 
                  alt="Uploaded Logo" 
                  className="w-40 h-40 object-contain rounded-2xl p-4 bg-gray-50 border border-gray-100"
                />
                <button 
                  onClick={() => setDesignState(prev => ({ ...prev, logoUrl: null }))}
                  className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-xl text-gray-500 text-center font-medium">Drag and drop your school logo</p>
                <p className="text-gray-400 text-sm mt-2">Supports PNG, JPG (transparent recommended)</p>
              </div>
            )}
            
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={handleLogoUpload}
              />
              <span className="px-10 py-4 bg-[#F5F5F7] text-black rounded-full font-bold hover:bg-gray-200 transition-colors shadow-sm">
                {designState.logoUrl ? 'Change Image' : 'Choose File'}
              </span>
            </label>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row justify-center gap-6">
            <button 
              onClick={() => handleGenerate('mens')}
              disabled={isGenerating !== null}
              className={`px-10 py-6 bg-[#0071e3] text-white rounded-full text-xl font-bold shadow-2xl shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-4 flex-1 ${isGenerating !== null ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0077ed]'}`}
            >
              {isGenerating === 'mens' ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rendering Mens...
                </>
              ) : 'Generate Mens'}
            </button>
            <button 
              onClick={() => handleGenerate('womens')}
              disabled={isGenerating !== null}
              className={`px-10 py-6 bg-[#0071e3] text-white rounded-full text-xl font-bold shadow-2xl shadow-blue-500/30 transition-all transform active:scale-95 flex items-center justify-center gap-4 flex-1 ${isGenerating !== null ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#0077ed]'}`}
            >
              {isGenerating === 'womens' ? (
                <>
                  <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rendering Womens...
                </>
              ) : 'Generate Womens'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PREVIEW */}
      {currentStep === Step.PREVIEW && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative group">
            <div className="w-full aspect-[3/4] relative overflow-hidden rounded-[48px] bg-[#F5F5F7] apple-shadow min-h-[500px] flex items-center justify-center">
              {designState.generatedImageUrl ? (
                <img 
                  src={designState.generatedImageUrl} 
                  alt="Your Generated Jersey" 
                  className="w-full h-full object-cover animate-in fade-in zoom-in-95 duration-1000"
                />
              ) : (
                <span className="text-gray-400 font-medium">Rendering Mockup...</span>
              )}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href={designState.generatedImageUrl || "#"} 
                download="classic-leavers-jersey-ai.png"
                className="text-sm text-blue-600 font-bold hover:underline tracking-tight"
              >
                Download Now
              </a>
            </div>
          </div>

          <div className="space-y-10 animate-in slide-in-from-right-12 duration-700">
            <div className="space-y-4">
              <span className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm">Visualisation Complete</span>
              <h2 className="text-6xl font-extrabold tracking-tight leading-none text-[#141B21]">Your legacy,<br/>made real.</h2>
              <p className="text-2xl text-gray-500 leading-relaxed font-medium">
                <span className="text-black">Your design is ready for review.</span>
              </p>
            </div>

            <div className="bg-white p-8 rounded-[40px] apple-shadow space-y-6 border border-gray-100">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-400 font-medium">Model Style</span>
                <span className="font-bold text-lg text-[#141B21]">{selectedDesign?.name}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-400 font-medium">Colours</span>
                <div className="flex gap-3">
                  {selectedColors.map((color, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#F5F5F7] px-3 py-1 rounded-full">
                       <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: color?.hex }}></div>
                       <span className="text-xs font-bold text-gray-700">{color?.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => setIsQuoteModalOpen(true)}
                className="flex-[2] py-6 bg-[#0071e3] text-white rounded-full text-2xl font-bold shadow-2xl shadow-blue-500/30 hover:bg-[#0077ed] transition-all transform active:scale-95"
              >
                Get a Free Quote
              </button>
              <button 
                onClick={resetApp}
                className="flex-1 py-6 bg-white text-black border-2 border-gray-200 rounded-full text-2xl font-bold hover:bg-gray-50 transition-all transform active:scale-95"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL */}
      <QuoteModal 
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        generatedImage={designState.generatedImageUrl}
        designName={selectedDesign?.name || "Jersey"}
        colorNames={selectedColors.map(c => c?.name || "Custom")}
      />
    </Layout>
  );
};

export default App;
