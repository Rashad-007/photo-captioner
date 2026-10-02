import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Image as ImageIcon, RefreshCw, Grid, Flashlight, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';

const SAMPLES = [
  {
    id: 'sunset',
    title: 'Golden Sunset',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=800&q=80',
    tag: 'sunset'
  },
  {
    id: 'puppy',
    title: 'Happy Puppy',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    tag: 'puppy'
  },
  {
    id: 'pizza',
    title: 'Gourmet Pizza',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    tag: 'pizza'
  },
  {
    id: 'cyberpunk',
    title: 'Neon City Night',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80',
    tag: 'cyberpunk'
  },
  {
    id: 'coffee',
    title: 'Cozy Coffee & Book',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    tag: 'coffee'
  },
  {
    id: 'mountain',
    title: 'Snowy Peak',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'mountain'
  }
];

export default function PhotoInput({ onSelectPhoto, selectedPhoto, onClearPhoto }) {
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'upload', 'samples'
  
  // Camera States
  const videoRef = useRef(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [countdown, setCountdown] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [showGrid, setShowGrid] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  // Initialize camera when camera tab selected
  useEffect(() => {
    if (activeTab === 'camera' && !selectedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab, facingMode, selectedPhoto]);

  // Paste from clipboard listener
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            readAndSelectFile(file);
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const startCamera = async () => {
    setIsCameraStarting(true);
    setCameraError('');
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access webcam. Please check browser permissions or switch to File Upload / Samples.');
      setIsCameraActive(false);
    } finally {
      setIsCameraStarting(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const takeSnapshot = () => {
    setCountdown(3);
    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      if (current > 0) {
        setCountdown(current);
      } else {
        clearInterval(interval);
        setCountdown(null);
        captureNow();
      }
    }, 800);
  };

  const captureNow = () => {
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 350);

    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext('2d');

      if (facingMode === 'user') {
        // Mirror horizontally for front camera
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onSelectPhoto(dataUrl, 'camera_capture');
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) readAndSelectFile(file);
  };

  const readAndSelectFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      onSelectPhoto(event.target.result, 'upload');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      readAndSelectFile(file);
    }
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px', position: 'relative' }}>
      {/* Flash overlay */}
      <div className={`flash-effect ${flashActive ? 'flash-active' : ''}`} />

      {/* Tabs Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '14px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('camera')}
            className="btn-secondary"
            style={{
              background: activeTab === 'camera' ? 'rgba(0, 242, 254, 0.15)' : undefined,
              borderColor: activeTab === 'camera' ? '#00f2fe' : undefined,
              color: activeTab === 'camera' ? '#ffffff' : '#94a3b8'
            }}
          >
            <Camera size={18} />
            <span>Webcam</span>
          </button>
          
          <button
            onClick={() => setActiveTab('upload')}
            className="btn-secondary"
            style={{
              background: activeTab === 'upload' ? 'rgba(0, 242, 254, 0.15)' : undefined,
              borderColor: activeTab === 'upload' ? '#00f2fe' : undefined,
              color: activeTab === 'upload' ? '#ffffff' : '#94a3b8'
            }}
          >
            <Upload size={18} />
            <span>Upload Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('samples')}
            className="btn-secondary"
            style={{
              background: activeTab === 'samples' ? 'rgba(0, 242, 254, 0.15)' : undefined,
              borderColor: activeTab === 'samples' ? '#00f2fe' : undefined,
              color: activeTab === 'samples' ? '#ffffff' : '#94a3b8'
            }}
          >
            <ImageIcon size={18} />
            <span>Sample Gallery</span>
          </button>
        </div>

        {selectedPhoto && (
          <button
            onClick={onClearPhoto}
            className="btn-secondary"
            style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
          >
            <RefreshCw size={16} />
            <span>New Photo</span>
          </button>
        )}
      </div>

      {/* Selected Photo Preview Mode */}
      {selectedPhoto ? (
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', textAlign: 'center' }}>
          <img
            src={selectedPhoto}
            alt="Selected capture"
            style={{
              maxHeight: '420px',
              width: '100%',
              objectFit: 'contain',
              borderRadius: '16px',
              background: '#040711',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: '#38bdf8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <CheckCircle2 size={16} color="#38bdf8" />
            Photo Loaded & Ready
          </div>
        </div>
      ) : (
        /* Tab Contents */
        <div>
          {/* TAB 1: WEBCAM */}
          {activeTab === 'camera' && (
            <div style={{ position: 'relative', width: '100%', minHeight: '380px', borderRadius: '16px', background: '#040711', overflow: 'hidden' }}>
              {cameraError ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                  <Camera size={48} color="#f43f5e" style={{ marginBottom: '16px' }} />
                  <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>Webcam Unavailable</h3>
                  <p style={{ maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.9rem' }}>{cameraError}</p>
                  <button onClick={() => setActiveTab('upload')} className="btn-primary">
                    Switch to Upload File
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    style={{
                      width: '100%',
                      height: '380px',
                      objectFit: 'cover',
                      transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                    }}
                  />

                  {/* Grid Lines Overlay */}
                  {showGrid && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gridTemplateRows: '1fr 1fr 1fr',
                      border: '1px solid rgba(255, 255, 255, 0.15)'
                    }}>
                      {[...Array(9)].map((_, i) => (
                        <div key={i} style={{ border: '1px dashed rgba(255, 255, 255, 0.15)' }} />
                      ))}
                    </div>
                  )}

                  {/* Countdown Overlay */}
                  {countdown !== null && (
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.65)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '6rem',
                      fontWeight: 800,
                      color: '#00f2fe',
                      animation: 'pulseAnim 0.8s infinite'
                    }}>
                      {countdown}
                    </div>
                  )}

                  {/* Camera Controls Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    background: 'rgba(7, 9, 14, 0.75)',
                    backdropFilter: 'blur(12px)',
                    padding: '10px 24px',
                    borderRadius: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <button
                      onClick={() => setShowGrid(!showGrid)}
                      style={{ background: 'none', border: 'none', color: showGrid ? '#00f2fe' : '#94a3b8', cursor: 'pointer' }}
                      title="Toggle Grid Lines"
                    >
                      <Grid size={22} />
                    </button>

                    <button
                      onClick={takeSnapshot}
                      className="btn-primary"
                      disabled={countdown !== null || !isCameraActive}
                      style={{ padding: '12px 28px', borderRadius: '30px' }}
                    >
                      <Camera size={20} />
                      <span>Take Snap</span>
                    </button>

                    <button
                      onClick={() => setFacingMode(facingMode === 'user' ? 'environment' : 'user')}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      title="Switch Camera"
                    >
                      <RefreshCw size={22} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: UPLOAD & DRAG DROP */}
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                border: isDragging ? '2px dashed #00f2fe' : '2px dashed rgba(255, 255, 255, 0.15)',
                background: isDragging ? 'rgba(0, 242, 254, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                padding: '60px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
              onClick={() => document.getElementById('photo-file-input')?.click()}
            >
              <input
                id="photo-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
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
                <Upload size={32} color="#38bdf8" />
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem', marginBottom: '8px' }}>
                Drag & Drop your photo here
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '16px' }}>
                Supports JPG, PNG, WEBP, GIF (or press <kbd style={{ background: '#1e293b', padding: '2px 6px', borderRadius: '4px', border: '1px solid #334155' }}>Ctrl+V</kbd> to paste)
              </p>
              <button className="btn-secondary" style={{ pointerEvents: 'none' }}>
                Browse Files
              </button>
            </div>
          )}

          {/* TAB 3: SAMPLE GALLERY */}
          {activeTab === 'samples' && (
            <div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '14px' }}>
                Select any high-resolution sample image for instant demonstration:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
              }}>
                {SAMPLES.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => onSelectPhoto(sample.url, sample.tag)}
                    style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      height: '110px',
                      cursor: 'pointer',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'transform 0.2s ease, border-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.borderColor = '#00f2fe';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <img
                      src={sample.url}
                      alt={sample.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.85) 100%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '8px 10px',
                      color: '#ffffff',
                      fontSize: '0.8rem',
                      fontWeight: 600
                    }}>
                      {sample.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
