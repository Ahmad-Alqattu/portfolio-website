// Reads a Firestore text field that may be a plain string (legacy/English-only)
// or a bilingual object like { en: '...', ar: '...' }.
export function localize(field, language) {
  if (field == null) return field;
  if (typeof field === 'string') return field;
  if (typeof field === 'object') {
    return field[language] || field.en || '';
  }
  return field;
}
