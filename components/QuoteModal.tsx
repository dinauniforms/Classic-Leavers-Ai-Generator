
import React, { useState } from 'react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedImage: string | null;
  designName: string;
  colorNames: string[];
}

const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, generatedImage, designName, colorNames }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: 'image/png' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSharing(true);

    const subject = `Quote Request: ${designName} Leavers Jersey`;
    const bodyText = `Hi Classic Sportswear,\n\nI'm interested in a quote for the following jersey:\n\n` +
      `Design: ${designName}\n` +
      `Colours: ${colorNames.join(', ')}\n\n` +
      `My Details:\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Message: ${formData.message}\n\n` +
      `I've attached my generated design visualization to this email.`;

    try {
      // Try using Web Share API first (supports attachments on iOS, Android, and Safari macOS)
      if (navigator.share && generatedImage) {
        const file = await base64ToFile(generatedImage, `classic-${designName.toLowerCase().replace(/\s+/g, '-')}.png`);
        
        const shareData: ShareData = {
          title: subject,
          text: bodyText,
          files: [file]
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          await navigator.share(shareData);
          setIsSharing(false);
          return;
        }
      }
    } catch (error) {
      console.error("Error sharing via Web Share API:", error);
    }

    // Fallback to mailto: for desktop browsers or unsupported share targets
    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(bodyText);
    window.location.href = `mailto:info@classicsportswear.com.au?subject=${mailtoSubject}&body=${mailtoBody}`;
    setIsSharing(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-[32px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10 animate-in zoom-in-95 duration-300">
        <div className="md:w-1/2 bg-[#F5F5F7] p-8 flex items-center justify-center">
          {generatedImage ? (
            <img 
              src={generatedImage} 
              alt="Final Design" 
              className="rounded-2xl shadow-lg max-h-[400px] object-contain"
            />
          ) : (
            <div className="w-full aspect-[4/5] bg-gray-200 rounded-2xl animate-pulse"></div>
          )}
        </div>
        <div className="md:w-1/2 p-8 md:p-12">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 className="text-3xl font-bold mb-2 tracking-tight">Get a Free Quote</h2>
          <p className="text-gray-500 mb-8">Tell us about your school group and we'll get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-[#F5F5F7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input 
                required
                type="email" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@school.edu.au"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-[#F5F5F7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea 
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="We have 150 students. How long is the lead time?"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-[#F5F5F7] resize-none"
              ></textarea>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit"
                disabled={isSharing}
                className="w-full py-4 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all transform active:scale-95 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {isSharing ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Send Quote Request'}
              </button>
              
              <div className="mt-4 flex items-start gap-2 px-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-[11px] text-gray-400 leading-tight">
                  We'll open your email app. If your device doesn't support auto-attachments, please manually attach your downloaded jersey image before sending.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
