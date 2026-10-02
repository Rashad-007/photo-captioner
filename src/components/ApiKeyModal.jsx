import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, apiProvider, onSaveSettings }) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [providerInput, setProviderInput] = useState(apiProvider || 'huggingface');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveSettings(keyInput.trim(), providerInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={22} color="#00f2fe" />
            <h2 style={{ fontSize: '1.2rem', color: '#ffffff', margin: 0 }}>API Key Configuration</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
              Select AI Vision Provider
            </label>
            <select
              value={providerInput}
              onChange={(e) => setProviderInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#040711',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            >
              <option value="huggingface">HuggingFace Inference API (Free / Token)</option>
              <option value="openai">OpenAI GPT-4 Vision API (sk-...)</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
              API Key (Stored locally in your browser only)
            </label>
            <input
              type="password"
              placeholder={providerInput === 'openai' ? 'sk-proj-...' : 'hf_...'}
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: '#040711',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            fontSize: '0.82rem',
            color: '#94a3b8'
          }}>
            <ShieldCheck size={20} color="#00f2fe" style={{ flexShrink: 0 }} />
            <span>
              Optional: If left blank, SnapCaption automatically uses its built-in in-browser ML vision model & smart visual engine. No setup required!
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {savedSuccess ? <Check size={18} /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
