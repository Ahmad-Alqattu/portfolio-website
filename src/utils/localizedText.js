import PropTypes from 'prop-types';

// A text field that may still be a plain string (legacy/English-only content)
// or the bilingual object shape that localize() resolves.
const localizedText = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    en: PropTypes.string,
    ar: PropTypes.string,
  }),
]);

export default localizedText;
