const production = (app, port) => {
  app.enable("trust proxy");
  app.use((req, res, next) => {
    if (res.secure) {
      next();
    } else {
      res.redirect("ws://" + req.headers.host + req.url);
    }
  });
  app.listen(7000);
};
export default production;
