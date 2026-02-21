const escapeRegex = (value) => {
  if (typeof value === 'string') {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  return value;
};

module.exports = escapeRegex;
