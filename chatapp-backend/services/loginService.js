exports.checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401);
  res.json({ message: "You don't have the permission to do this" });
};

exports.checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.status(401);
    res.json({ message: "You are logged in" });
    return;
  }
  return next();
};
