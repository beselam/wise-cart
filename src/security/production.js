const production = (app, port) => {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    if (res.secure) {
      next();
    } else {
      res.redirect("https://" + req.headers.host + req.url);
    }
  });
  app.listen(8800);
};
export default production;
