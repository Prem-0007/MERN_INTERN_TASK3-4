import { Router } from "express";
import { Blog } from "../mongoose/schemas/blog.mjs";
import { authMiddleware } from "../middlewares/authMiddleware.mjs";

const router = Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user.id });
    return res.status(200).send(blogs);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const foundBlog = await Blog.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!foundBlog) return res.sendStatus(404);
    return res.status(200).send(foundBlog);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }
    const newBlog = new Blog({
      title,
      content,
      user: req.user.id,
    });
    const savedBlog = await newBlog.save();
    return res.status(201).send(savedBlog);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { returnDocument: "after", runValidators: true }
    );
    if (!updatedBlog) return res.sendStatus(404);
    return res.status(200).send(updatedBlog);
  } catch (err) {
    console.log(err);
    return res.sendStatus(400);
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedBlog = await Blog.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!deletedBlog) return res.sendStatus(404);
    return res.status(200).send({ message: "Blog deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export default router;
