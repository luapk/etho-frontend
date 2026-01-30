import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, BarChart3, Activity, Upload } from 'lucide-react';
import Hero from './pages/Hero';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Biometrics from './pages/Biometrics';

function App() {
  const [currentPage, setCurrentPage] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleGetStarted = () => {
    setCurrentPage('landing');
  };

  const handleAnalysisComplete = (data, url) => {
    setAnalysisData(data);
    setVideoUrl(url);
    setCurrentPage('dashboard');
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  // Don't show menu on hero page
  const showMenu = currentPage !== 'hero';

  return (
    <div className="relative min-h-screen font-roboto">
      {/* Navigation Menu Button */}
      {showMenu && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="fixed top-4 right-4 z-50 p-3 glass-card rounded-full hover:bg-white/30 transition-colors"
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <Menu className="w-5 h-5 text-white" />
          )}
        </button>
      )}

      {/* Slide-out Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-72 z-50 p-6"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div className="mt-16 space-y-1">
                <button
                  onClick={() => navigateTo('hero')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    currentPage === 'hero' 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-roboto font-medium">Home</span>
                </button>

                <button
                  onClick={() => navigateTo('landing')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    currentPage === 'landing' 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span className="font-roboto font-medium">Upload Video</span>
                </button>
                
                <button
                  onClick={() => navigateTo('dashboard')}
                  disabled={!analysisData}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    currentPage === 'dashboard' 
                      ? 'bg-white/20 text-white' 
                      : analysisData 
                        ? 'hover:bg-white/10 text-white/70'
                        : 'text-white/30 cursor-not-allowed'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-roboto font-medium">Analysis</span>
                  {!analysisData && (
                    <span className="font-roboto text-xs text-white/30 ml-auto">No data</span>
                  )}
                </button>
                
                <button
                  onClick={() => navigateTo('about')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    currentPage === 'about' 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                >
                  <Info className="w-5 h-5" />
                  <span className="font-roboto font-medium">Research</span>
                </button>

                <button
                  onClick={() => navigateTo('biometrics')}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-colors ${
                    currentPage === 'biometrics' 
                      ? 'bg-white/20 text-white' 
                      : 'hover:bg-white/10 text-white/70'
                  }`}
                >
                  <Activity className="w-5 h-5" />
                  <span className="font-roboto font-medium">Biometrics</span>
                  <span className="ml-auto px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-medium">New</span>
                </button>
              </div>

              <div className="absolute bottom-6 left-6 right-6 text-center">
                <p className="font-roboto text-white/40 text-xs">Etho v3.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Page Content */}
      <AnimatePresence mode="wait">
        {currentPage === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onGetStarted={handleGetStarted} />
          </motion.div>
        )}

        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Landing onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
        )}
        
        {currentPage === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard analysisData={analysisData} videoUrl={videoUrl} />
          </motion.div>
        )}
        
        {currentPage === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <About />
          </motion.div>
        )}

        {currentPage === 'biometrics' && (
          <motion.div
            key="biometrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Biometrics />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
