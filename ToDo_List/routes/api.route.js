const { PrismaClient } = require("@prisma/client");
const router = require("express").Router();
const prisma = new PrismaClient();
router.get("/", async (req, res, next) => {
  try {
    const items = await prisma.todoList.findMany({ orderBy: { id: "asc" } });
    res.json(items);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.todoList.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const postitem = await prisma.todoList.create({
      data: req.body,
    });
    res.json(postitem);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const delitem = await prisma.todoList.delete({
      where: {
        id: Number(id),
      },
    });
    res.json(delitem);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.todoList.update({
      where: {
        id: Number(id),
      },
      data: req.body,
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/complete", async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await prisma.todoList.update({
      where: {
        id: Number(id),
      },
      data: {
        status: "Completed",
      },
    });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
