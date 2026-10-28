// Free, no-key machine translation via the MyMemory API, used to auto-fill
// the missing language for admin-edited section content. Best-effort: on any
// failure (rate limit, network) the original text is kept unchanged.
const translationCache = new Map();

async function translateText(text, sourceLang, targetLang) {
  const trimmed = (text || '').trim();
  if (!trimmed) return text;

  const cacheKey = `${sourceLang}|${targetLang}|${trimmed}`;
  if (translationCache.has(cacheKey)) return translationCache.get(cacheKey);

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=${sourceLang}|${targetLang}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    if (translated && data.responseStatus === 200) {
      translationCache.set(cacheKey, translated);
      return translated;
    }
    return text;
  } catch (err) {
    console.warn('Translation failed for text:', trimmed.slice(0, 40), err);
    return text;
  }
}

// Field names that should never be machine-translated (URLs, ids, media,
// dates, contact details, technical keys, etc.) - they're copied as-is.
const NON_TRANSLATABLE_KEYS = new Set([
  'id', 'link', 'url', 'href', 'image', 'images', 'video', 'videos', 'pdf',
  'cvLink', 'logo', 'github', 'linkedin', 'facebook', 'email', 'phone',
  'issueDate', 'date', 'order', 'active', 'type', 'color', 'icon',
  'enabled', 'githubEnabled', 'linkedinEnabled', 'facebookEnabled', 'emailEnabled',
  'duration', 'years', 'period', 'copyrightText',
]);

async function translateValue(value, key, sourceLang, targetLang) {
  if (value == null) return value;

  // Already-bilingual object: only fill the missing target language
  if (typeof value === 'object' && !Array.isArray(value) && ('en' in value || 'ar' in value)) {
    const sourceText = value[sourceLang];
    if (value[targetLang]) return value; // already translated, don't clobber
    if (!sourceText) return value;
    const translated = await translateText(sourceText, sourceLang, targetLang);
    return { ...value, [targetLang]: translated };
  }

  if (Array.isArray(value)) {
    const result = [];
    for (const item of value) {
      result.push(await translateValue(item, key, sourceLang, targetLang));
    }
    return result;
  }

  if (typeof value === 'object') {
    return translateObjectDeep(value, sourceLang, targetLang);
  }

  if (typeof value === 'string') {
    if (key && NON_TRANSLATABLE_KEYS.has(key)) return value;
    if (!value.trim()) return value;
    const translated = await translateText(value, sourceLang, targetLang);
    return { [sourceLang]: value, [targetLang]: translated };
  }

  return value;
}

// Recursively walks a section object, translating plain-string fields into
// { en, ar } pairs and filling in the missing side of already-bilingual
// fields. Existing translations are preserved, never overwritten.
export async function translateObjectDeep(obj, sourceLang, targetLang) {
  if (obj == null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    const result = [];
    for (const item of obj) {
      result.push(await translateValue(item, null, sourceLang, targetLang));
    }
    return result;
  }

  const result = {};
  for (const key of Object.keys(obj)) {
    result[key] = await translateValue(obj[key], key, sourceLang, targetLang);
  }
  return result;
}
