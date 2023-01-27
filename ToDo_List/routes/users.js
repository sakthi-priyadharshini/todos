const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();

/*router.get("/", async (req, res, next) => {
  res.send({ message: "Good morning" });
});*/

router.post("/", async (req, res, next) => {
  try {
    const postItem = await prisma.Users.create({
      data: req.body,
    });
    res.json(postItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
