import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import PhotoInput from './components/PhotoInput';
import ToneSelector from './components/ToneSelector';
import CaptionResult from './components/CaptionResult';
import VisualInsights from './components/VisualInsights';
import HistoryModal from './components/HistoryModal';
import ApiKeyModal from './components/ApiKeyModal';

import { analyzeImage } from './utils/imageAnalyzer';
import { generatePhotoCaption } from './utils/aiVisionService';
import { Sparkles, Image as ImageIcon, Wand2, Info } from 'lucide-react';
import './styles/main.css';

export default function App() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [sampleTag, setSampleTag] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedTone, setSelectedTone] = useState('instagram');
  const [captionResult, setCaptionResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Settings & History
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('snap_api_key') || '');
  const [apiProvider, setApiProvider] = useState(() => localStorage.getItem('snap_api_provider') || 'huggingface');
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('snap_history') || '[]');
    } catch {
      return [];
    }
  });

  // Modal Toggles
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('snap_history', JSON.stringify(history));
  }, [history]);

  // Handle Photo Selection
  const handleSelectPhoto = async (photoUrl, tag = '') => {
    setSelectedPhoto(photoUrl);
    setSampleTag(tag);
    setIsLoading(true);
    setCaptionResult(null);

    try {
      // Step 1: Perform visual color & brightness analysis
      const analysis = await analyzeImage(photoUrl);
      setAnalysisData(analysis);

      // Step 2: Generate AI photo caption
      const result = await generatePhotoCaption({
        imageSource: photoUrl,
        analysisData: analysis,
        tone: selectedTone,
        apiKey,
        apiProvider,
        sampleTag: tag
      });

      setCaptionResult(result);

      // Step 3: Add to history
      const newHistoryItem = {
        id: Date.now().toString(),
        photoUrl,
        caption: result.caption,
        hashtags: result.hashtags,
        toneName: selectedTone,
        timestamp: Date.now()
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 24)]); // Keep last 25 items
    } catch (err) {
      console.error('Caption pipeline error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Tone Change
  const handleToneChange = async (newTone) => {
    setSelectedTone(newTone);
    if (!selectedPhoto || !analysisData) return;

    setIsLoading(true);
    try {
      const result = await generatePhotoCaption({
        imageSource: selectedPhoto,
        analysisData,
        tone: newTone,
        apiKey,
        apiProvider,
        sampleTag
      });
      setCaptionResult(result);
    } catch (err) {
      console.error('Tone update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-generate variation
  const handleRegenerate = () => {
    if (selectedPhoto) {
      handleToneChange(selectedTone);
    }
  };

  // Clear photo
  const handleClearPhoto = () => {
    setSelectedPhoto(null);
    setSampleTag('');
    setAnalysisData(null);
    setCaptionResult(null);
  };

  // Save API Settings
  const handleSaveApiSettings = (key, provider) => {
    setApiKey(key);
    setApiProvider(provider);
    localStorage.setItem('snap_api_key', key);
    localStorage.setItem('snap_api_provider', provider);
  };

  // Clear History
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('snap_history');
  };

  // Restore history item
  const handleRestoreItem = (item) => {
    handleSelectPhoto(item.photoUrl, '');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        hasCustomKey={!!apiKey}
      />

      {/* Main Container */}
      <main style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '32px 20px',
        flex: 1
      }}>
        {/* Intro Hero Banner */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 242, 254, 0.08)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            color: '#38bdf8',
            fontWeight: 600,
            marginBottom: '12px'
          }}>
            <Wand2 size={16} /> Instant AI Photo Captioner & Visual Analytics
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '12px',
            lineHeight: 1.2
          }}>
            Snap a Photo. <span style={{
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Get Perfect Captions.</span>
          </h2>
          <p style={{
            fontSize: '1.05rem',
            color: '#94a3b8',
            maxWidth: '620px',
            margin: '0 auto'
          }}>
            Use your webcam, drop an image, or test sample photos. Choose your vibe and let AI generate Instagram captions, funny quotes, or aesthetic descriptions instantly.
          </p>
        </div>

        {/* Two Column Workspace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedPhoto ? '1fr 1fr' : '1fr',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column: Photo Input Hub & Tone Selection */}
          <div>
            <PhotoInput
              onSelectPhoto={handleSelectPhoto}
              selectedPhoto={selectedPhoto}
              onClearPhoto={handleClearPhoto}
            />

            <ToneSelector
              selectedTone={selectedTone}
              onSelectTone={handleToneChange}
            />
          </div>

          {/* Right Column: AI Caption Results & Visual Insights */}
          <div>
            {selectedPhoto ? (
              <>
                <CaptionResult
                  resultData={captionResult}
                  analysisData={analysisData}
                  photoUrl={selectedPhoto}
                  isLoading={isLoading}
                  onRegenerate={handleRegenerate}
                  currentTone={selectedTone}
                />

                <VisualInsights analysisData={analysisData} />
              </>
            ) : (
              <div className="glass-card" style={{
                padding: '48px 32px',
                textAlign: 'center',
                border: '2px dashed rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <ImageIcon size={32} color="#38bdf8" />
                </div>
                <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '8px' }}>
                  No Photo Selected Yet
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto' }}>
                  Take a live snap with your camera or pick a sample photo from the left panel to see AI magic in action!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        historyList={history}
        onClearHistory={handleClearHistory}
        onRestoreItem={handleRestoreItem}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        apiKey={apiKey}
        apiProvider={apiProvider}
        onSaveSettings={handleSaveApiSettings}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#64748b',
        fontSize: '0.85rem'
      }}>
        SnapCaption AI • Built with React & Vision Transformers • {new Date().getFullYear()}
      </footer>
    </div>
  );
}
