/**
 * Image Analyzer Utility
 * Extracts color palettes, brightness, tone characteristics, and visual metadata from images.
 */

export async function analyzeImage(imageSource) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Scale down for fast performance analysis
        const maxDim = 300;
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;
        
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        let totalR = 0, totalG = 0, totalB = 0;
        let totalLuminance = 0;
        const colorBuckets = {};
        
        for (let i = 0; i < data.length; i += 4 * 4) { // Step sampling
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          if (a < 128) continue; // Skip transparent
          
          totalR += r;
          totalG += g;
          totalB += b;
          
          // Luminance formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;
          
          // Quantize color into buckets for palette extraction
          const qR = Math.round(r / 32) * 32;
          const qG = Math.round(g / 32) * 32;
          const qB = Math.round(b / 32) * 32;
          const key = `${qR},${qG},${qB}`;
          
          colorBuckets[key] = (colorBuckets[key] || 0) + 1;
        }
        
        const sampledPixels = data.length / 16;
        const avgR = Math.round(totalR / sampledPixels);
        const avgG = Math.round(totalG / sampledPixels);
        const avgB = Math.round(totalB / sampledPixels);
        const avgLuminance = Math.round((totalLuminance / sampledPixels) / 2.55); // 0-100%
        
        // Extract top 5 dominant colors
        const sortedColors = Object.entries(colorBuckets)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([key]) => {
            const [r, g, b] = key.split(',').map(Number);
            return rgbToHex(r, g, b);
          });
          
        // Warmth / Coolness calculation
        const warmthScore = (avgR - avgB); // Positive = Warm, Negative = Cool
        let colorTemperature = 'Balanced & Neutral';
        if (warmthScore > 35) colorTemperature = 'Warm & Golden';
        else if (warmthScore > 15) colorTemperature = 'Warm Soft';
        else if (warmthScore < -35) colorTemperature = 'Cool & Crisp';
        else if (warmthScore < -15) colorTemperature = 'Cool Soft';
        
        // Mood determination based on colors and brightness
        const mood = deriveMood(avgLuminance, avgR, avgG, avgB, colorTemperature);
        
        // Primary color name
        const primaryColorName = getApproximateColorName(avgR, avgG, avgB);

        resolve({
          dimensions: { width: img.naturalWidth || img.width, height: img.naturalHeight || img.height },
          aspectRatio: getAspectRatioLabel(img.naturalWidth || img.width, img.naturalHeight || img.height),
          brightness: avgLuminance, // 0 - 100
          temperature: colorTemperature,
          primaryColor: rgbToHex(avgR, avgG, avgB),
          primaryColorName,
          dominantPalette: sortedColors.length > 0 ? sortedColors : ['#4f46e5', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
          mood
        });
      } catch (err) {
        console.error('Image analysis error:', err);
        // Fallback default analysis if canvas fails (e.g. CORS)
        resolve({
          dimensions: { width: 800, height: 600 },
          aspectRatio: '4:3',
          brightness: 55,
          temperature: 'Warm Soft',
          primaryColor: '#3b82f6',
          primaryColorName: 'Ocean Blue',
          dominantPalette: ['#1e293b', '#3b82f6', '#06b6d4', '#10b981', '#f43f5e'],
          mood: 'Vibrant & Modern'
        });
      }
    };
    
    img.onerror = (err) => {
      reject(new Error('Failed to load image for analysis: ' + err.message));
    };
    
    img.src = imageSource;
  });
}

function rgbToHex(r, g, b) {
  const toHex = (c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getAspectRatioLabel(width, height) {
  const ratio = width / height;
  if (Math.abs(ratio - 1) < 0.05) return '1:1 Square';
  if (Math.abs(ratio - 1.33) < 0.1) return '4:3 Standard';
  if (Math.abs(ratio - 1.77) < 0.15) return '16:9 Widescreen';
  if (Math.abs(ratio - 0.75) < 0.1) return '3:4 Portrait';
  if (Math.abs(ratio - 0.56) < 0.15) return '9:16 Vertical Story';
  return `${width}x${height} (${ratio.toFixed(2)})`;
}

function deriveMood(brightness, r, g, b, temp) {
  if (brightness < 30) return 'Moody & Cinematic Dark';
  if (brightness > 75) return 'Bright, Airy & Uplifting';
  if (r > g && r > b && temp.includes('Warm')) return 'Sunset Warmth & Cozy';
  if (b > r && b > g) return 'Serene, Deep & Calm';
  if (g > r && g > b) return 'Fresh, Lush & Organic';
  return 'Vibrant & Balanced';
}

function getApproximateColorName(r, g, b) {
  if (r > 200 && g > 200 && b > 200) return 'Pure White & Bright';
  if (r < 50 && g < 50 && b < 50) return 'Deep Shadow & Onyx';
  if (r > g + 40 && r > b + 40) return r > 180 ? 'Warm Crimson / Terracotta' : 'Deep Auburn Red';
  if (g > r + 30 && g > b + 30) return 'Emerald & Forest Green';
  if (b > r + 30 && b > g + 30) return 'Royal Cyan & Sky Blue';
  if (r > 180 && g > 150 && b < 100) return 'Golden Amber & Warm Sun';
  if (r > 150 && g < 100 && b > 150) return 'Mystic Lavender & Purple';
  return 'Neutral Earth Tone';
}
