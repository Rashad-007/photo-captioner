import React from 'react';
import { Camera, Sparkles, History, Key, Zap } from 'lucide-react';

export default function Header({ historyCount = 0, onOpenHistory, onOpenApiKey, hasCustomKey }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 32px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(7, 9, 14, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
        }}>
          <Camera size={24} color="#040914" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Snap<span style={{ color: '#38bdf8' }}>Caption</span>
            </h1>
            <span className="badge-pulse">
              <span className="pulse-dot"></span>
              AI Vision v2.5
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
            Transform photos into intelligent, creative captions in seconds
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenHistory}
          className="btn-secondary"
          title="View saved history"
          style={{ position: 'relative' }}
        >
          <History size={18} />
          <span>History</span>
          {historyCount > 0 && (
            <span style={{
              background: '#38bdf8',
              color: '#040914',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {historyCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenApiKey}
          className="btn-secondary"
          style={{
            borderColor: hasCustomKey ? 'rgba(0, 242, 254, 0.4)' : undefined,
            background: hasCustomKey ? 'rgba(0, 242, 254, 0.1)' : undefined
          }}
          title="Configure API Keys"
        >
          <Key size={18} color={hasCustomKey ? '#00f2fe' : 'currentColor'} />
          <span>{hasCustomKey ? 'API Active' : 'API Key'}</span>
        </button>
      </div>
    </header>
  );
}
