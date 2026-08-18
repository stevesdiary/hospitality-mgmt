import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Palette, Upload, Check, RefreshCw, Eye, Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService, apiService } from '@/services';
import { useBranding } from '@/contexts/BrandingContext';
import type { Company } from '@/services/company.service';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const PRESET_COLORS = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#8b5cf6' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Cyan', hex: '#06b6d4' },
  { name: 'Slate', hex: '#64748b' },
  { name: 'Gray', hex: '#6b7280' },
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  description?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange, description }) => {
  const [showPresets, setShowPresets] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer overflow-hidden"
            style={{ padding: 0 }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  onChange(val);
                }
              }}
              placeholder="#000000"
              className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Presets
            </button>
          </div>
        </div>
        
        <div
          className="w-20 h-12 rounded-lg border border-gray-200 shadow-inner"
          style={{ backgroundColor: value }}
        />
      </div>

      {showPresets && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 pt-2"
        >
          {PRESET_COLORS.map((color) => (
            <button
              key={color.hex}
              type="button"
              onClick={() => {
                onChange(color.hex);
                setShowPresets(false);
              }}
              className="group relative w-8 h-8 rounded-lg border-2 border-transparent hover:border-gray-300 transition-all"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {value.toLowerCase() === color.hex.toLowerCase() && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
              )}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const BrandingPage: React.FC = () => {
  const { setBranding, resetBranding } = useBranding();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [secondaryColor, setSecondaryColor] = useState('#64748b');
  const [accentColor, setAccentColor] = useState('#f97316');
  const [logoUrl, setLogoUrl] = useState<string | undefined>();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      setLoading(true);
      const data = await companyService.getMyCompany();
      setCompany(data);
      setPrimaryColor(data.primaryColor || '#3b82f6');
      setSecondaryColor(data.secondaryColor || '#64748b');
      setAccentColor(data.accentColor || '#f97316');
      setLogoUrl(data.logoUrl);
      
      // Apply to live preview
      setBranding({
        primaryColor: data.primaryColor || '#3b82f6',
        secondaryColor: data.secondaryColor || '#64748b',
        accentColor: data.accentColor || '#f97316',
        logoUrl: data.logoUrl,
        companyName: data.name,
      });
    } catch (err: any) {
      toast.error(err.message || 'Failed to load company');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      const result = await apiService.uploadImage(file);
      setLogoUrl(result.url);
      toast.success('Logo uploaded');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!company) return;

    try {
      setSaving(true);
      await companyService.updateBranding(company.id, {
        primaryColor,
        secondaryColor,
        accentColor,
        logoUrl,
      });
      
      setBranding({ primaryColor, secondaryColor, accentColor, logoUrl });
      toast.success('Branding saved successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save branding');
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setBranding({ primaryColor, secondaryColor, accentColor, logoUrl });
    toast.success('Preview applied — save to keep changes');
  };

  const handleReset = () => {
    setPrimaryColor('#3b82f6');
    setSecondaryColor('#64748b');
    setAccentColor('#f97316');
    resetBranding();
    toast.success('Reset to defaults');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-primary-100 rounded-xl">
                <Palette className="h-5 w-5 text-primary-600" />
              </div>
              <p className="text-sm text-primary-600 font-semibold">Admin Panel</p>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Brand Customisation</h1>
            <p className="text-gray-500 mt-2">Customise your hotel's look and feel for guests</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Logo</h2>
              
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt="Company logo"
                      className="w-24 h-24 object-contain rounded-xl border border-gray-200 bg-gray-50"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                      <Upload className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-3">
                    Upload your company logo. Recommended size: 200×200px. Max 2MB.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </span>
                    ) : (
                      'Upload Logo'
                    )}
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoUrl(undefined)}
                      className="ml-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Colors */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-6">
                <h2 className="font-display font-semibold text-gray-900">Brand Colours</h2>
                <div className="group relative">
                  <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    These colours will be applied across your booking pages, emails, and guest-facing interfaces.
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <ColorPicker
                  label="Primary Colour"
                  value={primaryColor}
                  onChange={setPrimaryColor}
                  description="Main brand colour — buttons, links, highlights"
                />
                
                <ColorPicker
                  label="Secondary Colour"
                  value={secondaryColor}
                  onChange={setSecondaryColor}
                  description="Supporting colour — text, borders, backgrounds"
                />
                
                <ColorPicker
                  label="Accent Colour"
                  value={accentColor}
                  onChange={setAccentColor}
                  description="Call-to-action colour — special offers, badges"
                />
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handlePreview}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Preview
              </button>
              
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </motion.div>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-1">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-8">
              <h2 className="font-display font-semibold text-gray-900 mb-4">Live Preview</h2>
              
              <div className="space-y-4">
                {/* Mini header preview */}
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <div className="p-3" style={{ backgroundColor: primaryColor }}>
                    <div className="flex items-center gap-2">
                      {logoUrl ? (
                        <img src={logoUrl} alt="Logo" className="w-6 h-6 object-contain rounded" />
                      ) : (
                        <div className="w-6 h-6 bg-white/20 rounded" />
                      )}
                      <span className="text-white text-sm font-medium">{company?.name || 'Your Hotel'}</span>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50">
                    <div className="text-xs text-gray-500 mb-2">Sample content</div>
                    <button
                      className="w-full py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Book Now
                    </button>
                  </div>
                </div>

                {/* Button samples */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Buttons</p>
                  <button
                    className="w-full py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="w-full py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: accentColor }}
                  >
                    Accent Button
                  </button>
                  <button
                    className="w-full py-2 rounded-lg text-sm font-medium border-2"
                    style={{ borderColor: secondaryColor, color: secondaryColor }}
                  >
                    Secondary Button
                  </button>
                </div>

                {/* Badge samples */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 font-medium">Badges</p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Available
                    </span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      20% Off
                    </span>
                    <span
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}
                    >
                      Luxury
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingPage;
