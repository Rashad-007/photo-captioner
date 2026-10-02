import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Copy, Check, Download, RefreshCw, Sparkles, Hash, Quote, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCaptionPosterCard } from '../utils/posterGenerator';

export default function CaptionResult({
  resultData,
  analysisData,
  photoUrl,
  isLoading,
  onRegenerate,
  currentTone
}) {
  const [copied, setCopied] = useState(false);
  const [copiedTag, setCopiedTag] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExportingPoster, setIsExportingPoster] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typewriter animation effect when caption changes
  useEffect(() => {
    if (!resultData?.caption) return;

    // Trigger celebration confetti on new caption!
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });

    setIsTyping(true);
    setDisplayedText('');
    let i = 0;
    const fullText = resultData.caption;
    
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText((prev) => prev + fullText.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [resultData?.caption]);

  // Copy caption text
  const handleCopyCaption = () => {
    if (!resultData?.caption) return;
    const fullTextToCopy = `${resultData.caption}\n\n${(resultData.hashtags || []).join(' ')}`;
    navigator.clipboard.writeText(fullTextToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy single hashtag
  const handleCopyHashtag = (tag) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(''), 1500);
  };

  // Text To Speech (TTS) Readout
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const textToRead = resultData?.caption || '';
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Export Poster Graphic Card
  const handleExportPoster = async () => {
    if (!photoUrl || !resultData?.caption) return;
    setIsExportingPoster(true);
    try {
      const posterDataUrl = await generateCaptionPosterCard({
        photoUrl,
        caption: resultData.caption,
        hashtags: resultData.hashtags || [],
        palette: analysisData?.dominantPalette || []
      });

      const a = document.createElement('a');
      a.href = posterDataUrl;
      a.download = `snapcaption-${Date.now()}.png`;
      a.click();
    } catch (err) {
      console.error('Poster export error:', err);
      alert('Failed to export poster card. Check console for details.');
    } finally {
      setIsExportingPoster(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card skeleton-shimmer" style={{ padding: '36px', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'rgba(0, 242, 254, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          animation: 'spin 1.5s linear infinite'
        }}>
          <Sparkles size={28} color="#00f2fe" />
        </div>
        <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '6px' }}>
          AI Analyzing Visual Tones...
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Extracting color palettes, atmospheric mood, and composing your {currentTone} caption
        </p>
      </div>
    );
  }

  if (!resultData) return null;

  return (
    <div className="glass-card glow-box" style={{ padding: '30px', marginBottom: '24px', position: 'relative' }}>
      {/* Source Tag Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#00f2fe" />
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00f2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {resultData.source || 'SnapAI Engine'}
          </span>
        </div>

        {/* Audio Speech Readout Button */}
        <button
          onClick={handleToggleAudio}
          className="btn-secondary"
          style={{
            padding: '6px 12px',
            fontSize: '0.8rem',
            background: isPlayingAudio ? 'rgba(0, 242, 254, 0.2)' : undefined,
            borderColor: isPlayingAudio ? '#00f2fe' : undefined
          }}
          title="Read caption aloud"
        >
          {isPlayingAudio ? <VolumeX size={16} color="#00f2fe" /> : <Volume2 size={16} />}
          <span>{isPlayingAudio ? 'Stop Reading' : 'Listen Caption'}</span>
        </button>
      </div>

      {/* Primary Caption Text Display */}
      <div style={{
        background: 'rgba(7, 9, 14, 0.6)',
        padding: '24px',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '20px',
        position: 'relative'
      }}>
        <Quote size={28} color="rgba(255, 255, 255, 0.15)" style={{ position: 'absolute', top: '16px', left: '16px' }} />
        <p style={{
          fontSize: '1.25rem',
          lineHeight: '1.6',
          color: '#ffffff',
          fontWeight: 500,
          whiteSpace: 'pre-wrap',
          paddingLeft: '32px',
          minHeight: '60px'
        }}>
          {displayedText}
          {isTyping && <span style={{ color: '#00f2fe', animation: 'pulseAnim 0.5s infinite' }}>|</span>}
        </p>
      </div>

      {/* Quote / Aesthetic note if available */}
      {resultData.quote && (
        <p style={{
          fontSize: '0.88rem',
          fontStyle: 'italic',
          color: '#94a3b8',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>💡 Note:</span> "{resultData.quote}"
        </p>
      )}

      {/* Hashtags section */}
      {resultData.hashtags && resultData.hashtags.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontSize: '0.82rem', color: '#64748b' }}>
            <Hash size={14} />
            <span>Recommended Hashtags (click to copy):</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {resultData.hashtags.map((tag, idx) => (
              <span
                key={idx}
                onClick={() => handleCopyHashtag(tag)}
                style={{
                  background: copiedTag === tag ? 'rgba(0, 242, 254, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${copiedTag === tag ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: copiedTag === tag ? '#ffffff' : '#38bdf8',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {copiedTag === tag ? '✓ Copied' : tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '20px'
      }}>
        <button
          onClick={handleCopyCaption}
          className="btn-primary"
          style={{ background: copied ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : undefined }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Caption & Tags'}</span>
        </button>

        <button
          onClick={onRegenerate}
          className="btn-secondary"
          title="Re-word or get another variation"
        >
          <RefreshCw size={18} />
          <span>Re-phrase</span>
        </button>

        <button
          onClick={handleExportPoster}
          className="btn-secondary"
          disabled={isExportingPoster}
          title="Export image + caption poster"
        >
          <Download size={18} />
          <span>{isExportingPoster ? 'Generating Card...' : 'Export Graphic Card'}</span>
        </button>
      </div>
    </div>
  );
}
