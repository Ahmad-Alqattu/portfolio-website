import React from 'react';

// Stroke-based 24px icons drawn inline so they inherit the theme color and
// need no uploads or extra network requests.
const icons = {
  app: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 21h8M12 18v3" />
      <path d="M7 9l2 2-2 2M12 13h4" />
    </>
  ),
  api: (
    <>
      <path d="M5 12h3M16 12h3" />
      <rect x="8" y="8" width="8" height="8" rx="2" />
      <path d="M12 3v3M12 18v3" />
      <circle cx="4" cy="12" r="1.6" />
      <circle cx="20" cy="12" r="1.6" />
    </>
  ),
  mobile: (
    <>
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10.5 5.5h3M11 18.5h2" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
      <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  frontend: (
    <>
      <rect x="2.5" y="4" width="19" height="14" rx="2" />
      <path d="M2.5 8h19" />
      <path d="M9 12.5l-1.5 1.5L9 15.5M15 12.5l1.5 1.5-1.5 1.5" />
    </>
  ),
  devops: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M6 8.5v7M8.5 6H14a2 2 0 0 1 2 2v1.8M8.5 18H14a2 2 0 0 0 2-2v-1.8" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3l2.2 5.3L19.5 10l-5.3 1.7L12 17l-2.2-5.3L4.5 10l5.3-1.7z" />
    </>
  ),
};

// Matched against the TITLE first, so a card is categorised by what it is
// called rather than by an incidental word in its description ("data
// extraction" inside an applications card must not make it a database card).
const rules = [
  [/\b(database|databases|sql|cloud|firebase|storage)\b/i, 'database'],
  [/\b(mobile|android|ios|flutter|react native)\b/i, 'mobile'],
  [/\b(api|apis|web service|web services|rest|soap|endpoint|backend|back-end)\b/i, 'api'],
  [/\b(front-end|frontend|ui|interface|css|html)\b/i, 'frontend'],
  [/\b(git|devops|deploy|deployment|docker|pipeline|hosting|optimi[sz]e)\b/i, 'devops'],
  [/\b(application|applications|app|apps|desktop|software|build)\b/i, 'app'],
];

function matchRules(text) {
  for (const [pattern, key] of rules) {
    if (pattern.test(text)) return key;
  }
  return null;
}

function pickIcon(title = '', description = '') {
  return matchRules(title) || matchRules(description) || 'spark';
}

function CapabilityIcon({ title, description, size = 28 }) {
  const paths = icons[pickIcon(title, description)];

  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="fill-none stroke-current stroke-[1.7] text-brand [stroke-linecap:round] [stroke-linejoin:round]"
    >
      {paths}
    </svg>
  );
}

export default CapabilityIcon;
