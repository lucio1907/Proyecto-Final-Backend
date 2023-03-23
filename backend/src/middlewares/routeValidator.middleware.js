const routeValidator = (req, res, next) => {
  if (req.session.passport === undefined) {
    res.redirect("/api/users/login");
  } else {
    next();
  }
};

export default routeValidator;
