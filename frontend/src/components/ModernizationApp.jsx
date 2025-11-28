
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernizationDashboard from './modernization/ModernizationDashboard';
import { sampleModernizationData, featureHighlights } from '../data/modernizationData';

const ModernizationApp = () => {
  const [modernizationResults, setModernizationResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [appMode, setAppMode] = useState('landing'); // 'landing' | 'dashboard'

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const slideIn = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  // Handle file upload
  const handleFileUpload = (file) => {
    setCurrentFile(file);
    setIsProcessing(true);
    setModernizationResults(null);
  };

  // Handle processing results
  const handleProcessResults = (results) => {
    setModernizationResults(results);
    setIsProcessing(false);
    setProcessingStatus(null);
  };

  // Demo function to load sample data
  const loadSampleData = () => {
    setModernizationResults(sampleModernizationData);
    setAppMode('dashboard');
  };

  const startModernization = () => {
    setAppMode('dashboard');
  };

  return (
    <>
      <style jsx>{`
        .modernization-app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #374151 50%, #1e293b 75%, #0f172a 100%);
          color: white;
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
        }

        .bg-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 15% 50%, rgba(59, 130, 246, 0.08), transparent 25%),
            radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.08), transparent 25%);
          pointer-events: none;
          z-index: 0;
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .glass-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .glass-card-light {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .glass-card-light:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .gradient-text {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
          filter: brightness(1.1);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .hero-section {
          min-height: 90vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 4rem 0;
        }

        .floating-icon {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div className="modernization-app-container">
        <div className="bg-overlay"></div>

        <AnimatePresence mode="wait">
          {appMode === 'landing' ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="content-wrapper"
            >
              {/* Hero Section */}
              <section className="hero-section">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="mb-8 floating-icon"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-5xl shadow-2xl">
                    🚀
                  </div>
                </motion.div>

                <motion.h1
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2 }}
                  className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
                >
                  <span className="gradient-text">AI Modernization</span>
                  <br />
                  <span className="text-white">Assistant</span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-12 leading-relaxed"
                >
                  Transform legacy COBOL systems into modern, scalable microservices architecture using advanced AI agents.
                </motion.p>

                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6"
                >
                  <button onClick={startModernization} className="btn-primary">
                    <span>Start Modernizing</span>
                    <span>→</span>
                  </button>
                  <button onClick={loadSampleData} className="btn-secondary">
                    <span>✨ Load Sample Data</span>
                  </button>
                </motion.div>
              </section>

              {/* Features Grid */}
              <motion.section
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="pb-24"
              >
                <h2 className="text-3xl font-bold text-center mb-12">Powerful Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featureHighlights.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="glass-card-light p-8"
                      whileHover={{ y: -10 }}
                    >
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: feature.color }}>{feature.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Footer */}
              <footer className="text-center pb-8 text-gray-500 text-sm">
                <p>© 2025 AI Modernization Assistant. Powered by Advanced LLMs.</p>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="fixed inset-0 z-50"
            >
              <ModernizationDashboard
                modernizationResults={modernizationResults}
                onFileUpload={handleFileUpload}
                onProcessFile={handleProcessResults}
                isProcessing={isProcessing}
                processingStatus={processingStatus}
              />

              {/* Back to Home Button (Optional, floating) */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setAppMode('landing')}
                className="fixed bottom-4 left-4 z-[1001] bg-white/10 hover:bg-white/20 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium transition-colors border border-white/10"
              >
                ← Back to Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default ModernizationApp;

