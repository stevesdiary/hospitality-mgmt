import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface Branding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  companyName?: string;
}

const DEFAULT_BRANDING: Branding = {
  primaryColor: '#3b82f6',
  secondaryColor: '#64748b',
  accentColor: '#f97316',
};

interface BrandingContextValue {
  branding: Branding;
  setBranding: (branding: Partial<Branding>) => void;
  resetBranding: () => void;
}

const BrandingContext = createContext<BrandingContextValue | undefined>(undefined);

/** Generate lighter/darker shades from a hex color */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateShades(hex: string): Record<string, string> {
  const { h, s } = hexToHSL(hex);
  return {
    50: hslToHex(h, Math.max(s - 30, 10), 97),
    100: hslToHex(h, Math.max(s - 20, 15), 94),
    200: hslToHex(h, Math.max(s - 10, 20), 86),
    300: hslToHex(h, s, 76),
    400: hslToHex(h, s, 62),
    500: hex,
    600: hslToHex(h, s, 45),
    700: hslToHex(h, s, 37),
    800: hslToHex(h, s, 29),
    900: hslToHex(h, s, 21),
    950: hslToHex(h, s, 13),
  };
}

function applyBrandingToCSS(branding: Branding) {
  const root = document.documentElement;
  
  const primaryShades = generateShades(branding.primaryColor);
  const secondaryShades = generateShades(branding.secondaryColor);
  const accentShades = generateShades(branding.accentColor);

  Object.entries(primaryShades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-primary-${shade}`, color);
  });
  Object.entries(secondaryShades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-secondary-${shade}`, color);
  });
  Object.entries(accentShades).forEach(([shade, color]) => {
    root.style.setProperty(`--color-accent-${shade}`, color);
  });
}

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBrandingState] = useState<Branding>(DEFAULT_BRANDING);

  const setBranding = useCallback((newBranding: Partial<Branding>) => {
    setBrandingState(prev => {
      const updated = { ...prev, ...newBranding };
      applyBrandingToCSS(updated);
      return updated;
    });
  }, []);

  const resetBranding = useCallback(() => {
    setBrandingState(DEFAULT_BRANDING);
    applyBrandingToCSS(DEFAULT_BRANDING);
  }, []);

  useEffect(() => {
    applyBrandingToCSS(branding);
  }, []);

  return (
    <BrandingContext.Provider value={{ branding, setBranding, resetBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextValue => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export default BrandingContext;
