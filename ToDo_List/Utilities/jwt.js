const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const { compareSync } = require("bcrypt");

/*generateAccessToken = (username) => {
  return JWT.sign({username: username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
}; //sign(payload,secret key,options) //payload needs to be an object

verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized()); // if the authorization is not present in header we throw an arror
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" "); // we split the bearer keyword and the token //split will return an array
  const token = bearerToken[1]; // contains the actual token
  console.log(token);
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      return next(createError.Unauthorized());
    } else {
      req.payload = payload;
      next()
    }
  });
};*/

module.exports = {
  generateAccessToken: (username) => {
    payload1 = { username: username };
    return JWT.sign(payload1, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30s",
    });
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized()); // if the authorization is not present in header we throw an arror
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" "); // we split the bearer keyword and the token //split will return an array
    const token = bearerToken[1]; // contains the actual token
    console.log(token);
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload1) => {
      if (err) {
        if (err.name === "JsonWebTokenError") {
          //refer npm jsonwebToken documentation for error names
          return next(createError.Unauthorized());
        } else {
          return next(createError.Unauthorized(err.message));
        }
      } else {
        req.payload = payload1;
        next();
      }
    });
  },

  generateRefreshToken: (username) => {
    payload = { username: username };
    return JWT.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "1y",
    });
  },

  verifyRefreshToken: (refreshToken) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) {
          return next(createError.Unauthorized());
        } else {
          const username = payload.username;
          return username;
        }
      }
    );
  },
};
