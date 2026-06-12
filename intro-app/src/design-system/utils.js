import { spacing, colors, borderRadius, shadows, transitions } from './tokens.js';

export const getSpacing = (...values) => {
  return values.map(v => spacing[v] || v).join(' ');
};

export const getColor = (path) => {
  const keys = path.split('.');
  let value = colors;
  for (const key of keys) {
    value = value?.[key];
  }
  return value || path;
};

export const getBorderRadius = (size) => borderRadius[size] || size;
export const getShadow = (size) => shadows[size] || size;
export const getTransition = (speed) => transitions[speed] || speed;

export const focusRing = {
  outline: `2px solid ${colors.primary.main}`,
  outlineOffset: '2px'
};

export const visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0'
};
