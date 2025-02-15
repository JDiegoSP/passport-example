const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User.model");

passport.serializeUser((user, next) => {
  next(null, user.id);
});

passport.deserializeUser((id, next) => {
  User.findById(id)
    .then((user) => {
      next(null, user);
    })
    .catch((err) => next(err));
});

passport.use(
  "local-auth",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, next) => {
      // Comprobar si ya existe un usuario -> comparar la contraseña -> GO
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            next(null, false, { error: "Email or password are incorrect" });
          } else {
            return user.checkPassword(password).then((match) => {
              if (!match) {
                next(null, false, { error: "Email or password are incorrect" });
              } else {
                next(null, user);
              }
            });
          }
        })
        .catch((err) => next(err));
    }
  )
);
