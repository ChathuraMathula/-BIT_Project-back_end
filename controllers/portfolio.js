exports.uploadPortfolioImages = (req, res, next) => {
  if (req.files) {
    res.json({ success: true });
  }
};
