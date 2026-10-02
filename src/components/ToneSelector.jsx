import React from 'react';
import { Share2, Smile, Feather, Zap, Cpu, BookOpen, FileText } from 'lucide-react';

const TONES = [
  { id: 'instagram', label: 'Instagram & TikTok', icon: Share2, color: '#e1306c', desc: 'Trendy vibes & hashtags' },
  { id: 'funny', label: 'Funny & Witty', icon: Smile, color: '#f59e0b', desc: 'Sarcastic & humorous' },
  { id: 'poetic', label: 'Poetic & Aesthetic', icon: Feather, color: '#a855f7', desc: 'Deep & artistic quotes' },
  { id: 'punchy', label: 'Short & Punchy', icon: Zap, color: '#00f2fe', desc: '1-3 bold impact words' },
  { id: 'cyberpunk', label: 'Cyberpunk AI', icon: Cpu, color: '#10b981', desc: 'Matrix vision analysis' },
  { id: 'story', label: 'Storyteller', icon: BookOpen, color: '#ec4899', desc: 'Narrative background' },
  { id: 'standard', label: 'Standard AI', icon: FileText, color: '#64748b', desc: 'Clean photo summary' },
];

export default function ToneSelector({ selectedTone, onSelectTone }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <label style={{
        display: 'block',
        fontSize: '0.88rem',
        fontWeight: 600,
        color: '#94a3b8',
        marginBottom: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        Choose Caption Vibe & Tone
      </label>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '10px'
      }}>
        {TONES.map((t) => {
          const IconComponent = t.icon;
          const isSelected = selectedTone === t.id;
          
          return (
            <button
              key={t.id}
              onClick={() => onSelectTone(t.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 10px',
                borderRadius: '14px',
                background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                border: isSelected ? `2px solid ${t.color}` : '1px solid rgba(255, 255, 255, 0.07)',
                color: isSelected ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isSelected ? `0 0 16px ${t.color}33` : 'none',
                transform: isSelected ? 'translateY(-2px)' : 'none'
              }}
            >
              <IconComponent size={20} color={t.color} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t.label}</span>
              <span style={{ fontSize: '0.7rem', opacity: 0.75, textAlign: 'center' }}>{t.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
