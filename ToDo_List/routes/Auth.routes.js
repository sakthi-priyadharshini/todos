const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const createError = require("http-errors");
const prisma = new PrismaClient();
const { signupSchema } = require("../validation_schema");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../Utilities/jwt");

router.post("/Signup", async (req, res, next) => {
  try {
    //const { email, password } = req.body;
    //console.log(Email, Password);
    //if (!email || !password) throw createError.BadRequest();
    const result = await signupSchema.validateAsync(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(result.password, salt);
    result.password = hashPass;
    const doesExist = await prisma.user.findUnique({
      where: {
        email: result.email,
      },
    });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already been registered`);
    const user = await prisma.user.create({
      data: result,
    });
    const accessToken = await generateAccessToken(result.email);
    const refreshToken = await generateRefreshToken(result.email);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await signupSchema.validateAsync(req.body);
    const checkuser = await prisma.user.findUnique({
      where: {
        email: result.email,
      },
    });
    if (!checkuser) throw createError.NotFound("User not registered");
    const checkPass = await bcrypt.compare(result.password, checkuser.password);
    if (!checkPass)
      throw createError.Unauthorized("Username/Password not valid");
    const AccessToken = await generateAccessToken(checkuser.email);
    const RefreshToken = await generateRefreshToken(checkuser.email);
    res.send({ AccessToken, RefreshToken });
  } catch (error) {
    if (error.isJoi == true)
      return next(createError.BadRequest("Invalid Username/Password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest;
    const username = await verifyRefreshToken(refreshToken); //return username
    const AccessToken = await generateAccessToken(username);
    const RefreshToken = await generateRefreshToken(username);
    res.send({ AccessToken, RefreshToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", async (req, res, next) => {
  res.send("Logout Route");
});

module.exports = router;
