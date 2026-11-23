import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Sparkles, ArrowRight, Heart, ShieldCheck, Check } from 'lucide-react';

const selectOptions = [
  { value: 'bridal', label: 'Bridal Makeup' },
  { value: 'haldi', label: 'Haldi Makeup' },
  { value: 'engagement', label: 'Engagement Makeup' },
  { value: 'party', label: 'Party Makeup' },
];

export function StyleguideView() {
  const [activeTab, setActiveTab] = useState<'all' | 'colors' | 'typography' | 'primitives' | 'forms'>('all');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      
      {/* Top Header */}
      <header className="border-b border-[#DFC8C2] pb-6 sm:pb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#B99561] font-semibold">Phase 1 Foundation</span>
            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-[#2A1420] mt-1 break-words tracking-tight leading-tight">
              Amrapali Makeover — Design System
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="gold" size="md">Astro 7 + Tailwind 4</Badge>
            <Badge variant="burgundy" size="md">Tokens v1.0</Badge>
          </div>
        </div>
        <p className="text-[#74686A] text-sm sm:text-base max-w-3xl leading-relaxed">
          Visual identity, typography hierarchy (English, Hindi, Marathi), centralized color tokens, and accessible UI primitives for the luxury bridal and editorial beauty aesthetic.
        </p>

        {/* Quick filter tabs */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button
            size="sm"
            variant={activeTab === 'all' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('all')}
          >
            All Tokens
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'colors' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('colors')}
          >
            1. Colors & Contrast
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'typography' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('typography')}
          >
            2. Typography Scale
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'primitives' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('primitives')}
          >
            3. Buttons & Cards
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'forms' ? 'primary' : 'outline'}
            onClick={() => setActiveTab('forms')}
          >
            4. Form Controls
          </Button>
        </div>
      </header>

      {/* 1. Color Palette Tokens */}
      {(activeTab === 'all' || activeTab === 'colors') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 border-b border-[#DFC8C2]/60 pb-3">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#2A1420]">
              1. Color Palette & Contrast Tokens
            </h2>
            <span className="text-xs uppercase tracking-wider text-[#74686A]">WCAG AA / AAA Compliant</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Burgundy */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#4B1728] flex items-end p-2.5 sm:p-3 text-white">
                <span className="text-xs font-mono">#4B1728</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Burgundy (Primary)</p>
                <p className="text-[#74686A]">Brand anchor, primary buttons, headers</p>
                <p className="text-[10px] text-[#B99561] font-medium">Contrast on Ivory: 13.66:1 (AAA)</p>
              </div>
            </div>

            {/* Plum */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#2A1420] flex items-end p-2.5 sm:p-3 text-white">
                <span className="text-xs font-mono">#2A1420</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Dark Plum (Deep)</p>
                <p className="text-[#74686A]">Dark contrast surfaces, deep text</p>
                <p className="text-[10px] text-[#B99561] font-medium">Contrast on Ivory: 16.27:1 (AAA)</p>
              </div>
            </div>

            {/* Warm Ivory */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#FBF8F4] flex items-end p-2.5 sm:p-3 text-[#24191B] border-b border-[#DFC8C2]/50">
                <span className="text-xs font-mono">#FBF8F4</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Warm Ivory (Canvas)</p>
                <p className="text-[#74686A]">Main page background, tactile calm</p>
                <p className="text-[10px] text-[#74686A]">Primary canvas surface</p>
              </div>
            </div>

            {/* Soft Blush */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#F2E5E2] flex items-end p-2.5 sm:p-3 text-[#24191B] border-b border-[#DFC8C2]/50">
                <span className="text-xs font-mono">#F2E5E2</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Soft Blush (Subtle)</p>
                <p className="text-[#524245]">Section alternating, card fills, hovers</p>
                <p className="text-[10px] text-[#524245] font-semibold">Uses #524245 on Blush: 6.20:1 (AAA)</p>
              </div>
            </div>

            {/* Muted Rose */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#C58F91] flex items-end p-2.5 sm:p-3 text-[#2A1420]">
                <span className="text-xs font-mono">#C58F91</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Muted Rose (Accent)</p>
                <p className="text-[#74686A]">Dividers, icons, subtle highlights</p>
                <p className="text-[10px] text-[#74686A]">Decorative accent: 2.57:1 on Ivory</p>
              </div>
            </div>

            {/* Champagne Gold */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#B99561] flex items-end p-2.5 sm:p-3 text-[#1E0D16]">
                <span className="text-xs font-mono">#B99561</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Champagne Gold (Accent)</p>
                <p className="text-[#74686A]">Focus rings, badges, subtle trim</p>
                <p className="text-[10px] text-[#977643] font-medium">Decorative & accent only (2.63:1 text fails)</p>
              </div>
            </div>

            {/* Ink */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#24191B] flex items-end p-2.5 sm:p-3 text-white">
                <span className="text-xs font-mono">#24191B</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Ink (Primary Text)</p>
                <p className="text-[#74686A]">Body and title text color</p>
                <p className="text-[10px] text-[#B99561] font-medium">Contrast on Ivory: 16.13:1 (AAA)</p>
              </div>
            </div>

            {/* Muted Text */}
            <div className="rounded-[4px] border border-[#DFC8C2] overflow-hidden bg-white shadow-sm">
              <div className="h-20 sm:h-24 bg-[#74686A] flex items-end p-2.5 sm:p-3 text-white">
                <span className="text-xs font-mono">#74686A</span>
              </div>
              <div className="p-2.5 sm:p-3 text-xs space-y-1">
                <p className="font-semibold text-[#24191B]">Muted Text (Ivory Only)</p>
                <p className="text-[#74686A]">Captions, labels on Ivory (#FBF8F4)</p>
                <p className="text-[10px] text-[#B99561] font-medium">Contrast on Ivory: 5.05:1 (AA)</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 2. Typography Hierarchy */}
      {(activeTab === 'all' || activeTab === 'typography') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 border-b border-[#DFC8C2]/60 pb-3">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#2A1420]">
              2. Typography Scale (Latin + Devanagari)
            </h2>
            <span className="text-xs uppercase tracking-wider text-[#74686A]">English / हिंदी / मराठी</span>
          </div>

          <div className="space-y-8 bg-white p-6 sm:p-8 rounded-[6px] border border-[#EADBD7] shadow-sm">
            {/* Display Headings (English) */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">Display Serif — Cormorant Garamond</span>
              <div className="space-y-4 border-b border-[#EADBD7] pb-6">
                <div>
                  <p className="text-xs text-[#74686A] mb-1 font-mono">H1 / Display (48px / 3rem)</p>
                  <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#2A1420] tracking-tight">
                    Timeless Artistry for Your Most Sacred Celebrations
                  </h1>
                </div>
                <div>
                  <p className="text-xs text-[#74686A] mb-1 font-mono">H2 / Section Title (32px / 2rem)</p>
                  <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#2A1420]">
                    Bridal, Haldi & Celebration Makeup
                  </h2>
                </div>
                <div>
                  <p className="text-xs text-[#74686A] mb-1 font-mono">H3 / Subheading (24px / 1.5rem)</p>
                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#4B1728]">
                    Bespoke On-Location Beauty Services Across Maharashtra
                  </h3>
                </div>
              </div>
            </div>

            {/* Devanagari Display (Hindi / Marathi) */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">Devanagari Display — Rozha One & Noto Serif Devanagari</span>
              <div className="space-y-4 border-b border-[#EADBD7] pb-6">
                <div>
                  <p className="text-xs text-[#74686A] mb-1 font-mono">हिंदी शीर्षक (Hindi Headline)</p>
                  <h2 className="font-serif text-2xl sm:text-4xl text-[#2A1420] font-normal leading-snug">
                    आपके खास दिनों के लिए प्रामाणिक व विशिष्ट मेकअप
                  </h2>
                </div>
                <div>
                  <p className="text-xs text-[#74686A] mb-1 font-mono">मराठी शीर्षक (Marathi Headline)</p>
                  <h2 className="font-serif text-2xl sm:text-4xl text-[#2A1420] font-normal leading-snug">
                    तुमच्या शुभ प्रसंगांसाठी अस्सल व देखणा मेकओव्हर
                  </h2>
                </div>
              </div>
            </div>

            {/* Body & Sans Copy */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">Body Sans — Plus Jakarta Sans & Noto Sans Devanagari</span>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs text-[#74686A] font-mono">English Body (16px / leading-relaxed)</p>
                  <p className="text-[#24191B] text-base leading-relaxed">
                    Every face carries its own unique grace. Our approach emphasizes natural skin textures, balanced elegance, and enduring luxury tailored for your auspicious celebrations.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[#74686A] font-mono">Devanagari Body (हिंदी / मराठी 15px)</p>
                  <p className="text-[#24191B] text-base leading-relaxed">
                    प्रत्येक चेहऱ्याची स्वतःची अशी एक वेगळी सुंदरता असते. नैसर्गिक सौंदर्य आणि पारंपरिक भव्यता यांचा सुरेख संगम घडवून आणणे हेच आमचे ध्येय आहे.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. UI Primitives: Buttons & Badges */}
      {(activeTab === 'all' || activeTab === 'primitives') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 border-b border-[#DFC8C2]/60 pb-3">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#2A1420]">
              3. Button & Card Primitives
            </h2>
            <span className="text-xs uppercase tracking-wider text-[#74686A]">Accessible States & Sizes</span>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[6px] border border-[#EADBD7] space-y-8 shadow-sm">
            {/* Variant rows */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">Variants (Medium Size)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary (Burgundy)</Button>
                <Button variant="secondary">Secondary (Outline Burgundy)</Button>
                <Button variant="gold">Gold Accent</Button>
                <Button variant="outline">Neutral Outline</Button>
                <Button variant="ghost">Ghost Button</Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">Scale (Small, Medium, Large)</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="sm">Small Action</Button>
                <Button variant="primary" size="md">Medium Action</Button>
                <Button variant="primary" size="lg">Large Hero CTA</Button>
              </div>
            </div>

            {/* Interactive & States */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">States & Icons</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
                  With Left Icon
                </Button>
                <Button variant="gold" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  With Right Icon
                </Button>
                <Button variant="primary" isLoading>
                  Loading State
                </Button>
                <Button variant="primary" disabled>
                  Disabled State
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3 border-t border-[#EADBD7] pt-6">
              <p className="text-xs uppercase tracking-widest text-[#B99561] font-semibold">Badges & Tags</p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="gold">Gold Badge</Badge>
                <Badge variant="burgundy">Burgundy Badge</Badge>
                <Badge variant="blush">Blush Badge</Badge>
                <Badge variant="outline">Outline Badge</Badge>
              </div>
            </div>
          </div>

          {/* Cards Showcase */}
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Default Card */}
            <Card variant="default">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="blush" size="sm">Standard</Badge>
                  <Heart className="w-4 h-4 text-[#C58F91]" />
                </div>
                <CardTitle className="mt-2">Bridal Artistry</CardTitle>
                <CardDescription>Clean white surface with subtle borders.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#74686A] leading-relaxed">
                  Engineered with restrained borders and soft shadows for clear separation without noisy visual clutter.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Explore</Button>
              </CardFooter>
            </Card>

            {/* Subtle Blush Card */}
            <Card variant="subtle">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">Subtle Fill</Badge>
                  <ShieldCheck className="w-4 h-4 text-[#B99561]" />
                </div>
                <CardTitle className="mt-2">Haldi Glow</CardTitle>
                <CardDescription className="text-[#524245]">Soft blush surface for warm rhythm.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#524245] leading-relaxed">
                  Provides gentle contrast when placed adjacent to canvas ivory backgrounds. Uses verified high-contrast text (#524245, 6.20:1 AAA).
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">View Details</Button>
              </CardFooter>
            </Card>

            {/* Deep Burgundy Card */}
            <Card variant="burgundy">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">Luxury Deep</Badge>
                  <Sparkles className="w-4 h-4 text-[#D4B98E]" />
                </div>
                <CardTitle className="mt-2 text-[#FBF8F4]">Celebration Glam</CardTitle>
                <CardDescription className="text-[#DFC8C2]">High-contrast focal card container.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[#FBF8F4]/90 leading-relaxed">
                  Rich jewel-tone background reserved for highlight cards and VIP announcements.
                </p>
              </CardContent>
              <CardFooter className="border-[#642037]">
                <Button variant="gold" size="sm">Contact Artist</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      )}

      {/* 4. Form Controls */}
      {(activeTab === 'all' || activeTab === 'forms') && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 border-b border-[#DFC8C2]/60 pb-3">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#2A1420]">
              4. Form Input Primitives
            </h2>
            <span className="text-xs uppercase tracking-wider text-[#74686A]">Accessible Labels & Errors</span>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[6px] border border-[#EADBD7] space-y-6 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="e.g. Priya Sharma"
                required
                helperText="Your contact name for WhatsApp communication"
              />
              <Input
                label="Event Date"
                type="date"
                required
                helperText="Target date for makeup services"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <Select
                label="Occasion / Service Type"
                options={selectOptions}
                placeholder="Select a makeup service"
                required
                helperText="The type of service you are enquiring about"
              />
              <Input
                label="Event Location / City"
                placeholder="e.g. Bhiwandi, Thane, Mumbai"
                required
                error="Please specify the event city or locality"
              />
            </div>

            <Textarea
              label="Optional Notes"
              placeholder="Share venue details, ready-by time, or specific preferences..."
              rows={3}
              helperText="Any additional context you would like to include in your enquiry"
            />
          </div>
        </section>
      )}

      {/* 5. Motion & Accessibility Tokens */}
      {activeTab === 'all' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 border-b border-[#DFC8C2]/60 pb-3">
            <h2 className="font-serif text-xl sm:text-3xl font-medium text-[#2A1420]">
              5. Motion, Elevation & Accessibility Specifications
            </h2>
            <span className="text-xs uppercase tracking-wider text-[#74686A]">Core Principles</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-[6px] border border-[#EADBD7] space-y-2">
              <div className="flex items-center gap-2 text-[#4B1728]">
                <Check className="w-4 h-4 text-[#B99561]" />
                <h4 className="font-medium text-sm text-[#24191B]">prefers-reduced-motion</h4>
              </div>
              <p className="text-xs text-[#74686A] leading-relaxed">
                All transitions and animations automatically collapse to instant state updates when the user's OS has reduced motion enabled.
              </p>
            </div>

            <div className="p-5 bg-white rounded-[6px] border border-[#EADBD7] space-y-2">
              <div className="flex items-center gap-2 text-[#4B1728]">
                <Check className="w-4 h-4 text-[#B99561]" />
                <h4 className="font-medium text-sm text-[#24191B]">Visible Focus Rings</h4>
              </div>
              <p className="text-xs text-[#74686A] leading-relaxed">
                2px Champagne Gold (<span className="font-mono text-[11px]">#B99561</span>) focus ring with 2px offset on all keyboard interactive targets.
              </p>
            </div>

            <div className="p-5 bg-white rounded-[6px] border border-[#EADBD7] space-y-2">
              <div className="flex items-center gap-2 text-[#4B1728]">
                <Check className="w-4 h-4 text-[#B99561]" />
                <h4 className="font-medium text-sm text-[#24191B]">No Scroll Hijacking</h4>
              </div>
              <p className="text-xs text-[#74686A] leading-relaxed">
                Browser native smooth scrolling without forced snapping or intercepting the user's wheel / touch gestures.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer Note */}
      <footer className="pt-8 border-t border-[#DFC8C2] text-center text-xs text-[#74686A]">
        <p>Amrapali Makeover — Design System v1.0 &bull; Built with Astro, React, TypeScript & Tailwind CSS</p>
      </footer>

    </div>
  );
}
