export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  description: string;
  badge?: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    code: 'hinglish',
    name: 'Natural Hinglish',
    nativeName: 'Hinglish (Chat Hindi)',
    description: "Everyday conversational Hindi in English letters (e.g. 'Ab light lines se outline banao...')",
    badge: 'Popular',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    description: 'Clear, encouraging beginner instructions in English',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी (Devanagari)',
    description: 'सरल और स्पष्ट हिंदी में स्टेप-बाय-स्टेप निर्देश',
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    description: 'સરળ અને સ્પષ્ટ ગુજરાતીમાં ડ્રોઈંગ સ્ટેપ્સ',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    description: 'सोप्या आणि स्पष्ट मराठीत स्टेप-बाय-स्टेप सूचना',
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    description: 'সহজ এবং পরিষ্কার বাংলায় আঁকার নির্দেশাবলী',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    description: 'எளிய தமிழில் வரைதல் பயிற்சி குறிப்புகள்',
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    description: 'Instrucciones claras y sencillas para principiantes',
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    description: 'Instructions de dessin simples et conviviales',
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    description: 'Einfache Schritt-für-Schritt-Zeichenanleitung',
  },
];
