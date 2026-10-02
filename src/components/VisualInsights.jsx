import React, { useState } from 'react';
import { Palette, Sun, Thermometer, Layers, Check } from 'lucide-react';

export default function VisualInsights({ analysisData }) {
  const [copiedHex, setCopiedHex] = useState('');

  if (!analysisData) return null;

  const {
    brightness = 50,
    temperature = 'Balanced',
    primaryColorName = 'Neutral',
    dominantPalette = [],
    aspectRatio = 'Standard'
  } = analysisData;

  const handleCopyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 1500);
  };

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
      <h3 style={{
        fontSize: '1rem',
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Palette size={18} color="#00f2fe" />
        Visual Analytics & Color Palette
      </h3>

      {/* Dominant Color Swatches */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '8px' }}>
          Extracted Dominant Colors (click to copy hex code):
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {dominantPalette.map((hex, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyHex(hex)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '6px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title={`Copy ${hex}`}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '6px',
                backgroundColor: hex,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
              }} />
              <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', color: '#f8fafc', fontWeight: 600 }}>
                {copiedHex === hex ? 'Copied!' : hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Attributes Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {/* Brightness Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sun size={14} color="#f59e0b" /> Brightness
            </span>
            <span style={{ color: '#ffffff', fontWeight: 600 }}>{brightness}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${brightness}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #eab308)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Color Temperature */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Thermometer size={14} color="#38bdf8" /> Color Tone
          </span>
          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
            {temperature}
          </span>
        </div>

        {/* Aspect Ratio & Frame */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '12px 14px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
            <Layers size={14} color="#a855f7" /> Frame Ratio
          </span>
          <span style={{ fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
            {aspectRatio}
          </span>
        </div>
      </div>
    </div>
  );
}
