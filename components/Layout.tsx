
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  onLogoClick?: () => void;
  showBack?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, onLogoClick, showBack }) => {
  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12 md:py-24 max-w-6xl mx-auto">
      <nav className="fixed top-0 left-0 w-full h-16 bg-[#1D1D1F] z-50 flex items-center justify-between px-8 apple-shadow">
        <div className="flex items-center gap-6">
           {showBack && (
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Back</span>
            </button>
          )}
          <button 
            onClick={onLogoClick}
            className="flex items-center transition-opacity hover:opacity-80 active:scale-95"
            aria-label="Go to home"
          >
            <img 
              src="https://classicsports.com.au/cdn/shop/files/Asset_1_300x_2fbde78b-8072-4a58-9da7-838f44e9b801.png?v=1699581951&width=400" 
              alt="Classic Sportswear" 
              className="h-6 w-auto brightness-0 invert"
            />
          </button>
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <a 
            href="https://classicsports.com.au/pages/schoolwear" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden md:inline"
          >
            Learn More
          </a>
          <a 
            href="https://heyzine.com/flip-book/41313f42ab.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors hidden sm:inline"
          >
            View Catalogue
          </a>
          <a 
            href="https://classicsports.com.au/pages/contact" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-all transform active:scale-95 shadow-sm"
          >
            Contact us
          </a>
        </div>
      </nav>

      <div className="w-full mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {title && (
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 tracking-tight">
            {title}
          </h1>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
