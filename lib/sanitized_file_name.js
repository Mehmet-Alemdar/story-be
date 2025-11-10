const sanitizedFileName = (file) => {
  return (
    file.originalname
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
  );
};

module.exports = { sanitizedFileName };
