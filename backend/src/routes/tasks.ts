import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All routes below require a valid access token
router.use(requireAuth);

// GET /tasks?projectId=xxx
router.get("/", async (req, res) => {
  const { projectId } = req.query;

  const tasks = await prisma.task.findMany({
    where: projectId ? { projectId: String(projectId) } : undefined,
    include: { assignee: true, creator: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(tasks);
});

// POST /tasks
router.post("/", async (req, res) => {
  const { title, description, projectId, assigneeId } = req.body;
  const creatorId = req.user!.userId;

  if (!title || !projectId) {
    return res.status(400).json({ error: "title and projectId are required" });
  }

  const task = await prisma.task.create({
    data: { title, description, projectId, assigneeId, creatorId },
  });

  // NOTE: emit a socket event here once sockets/index.ts is wired up, e.g.
  // io.to(`project:${projectId}`).emit("task:created", task);

  res.status(201).json(task);
});

// PATCH /tasks/:id/status
router.patch("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `status must be one of ${validStatuses.join(", ")}` });
  }

  const task = await prisma.task.update({
    where: { id },
    data: { status },
  });

  // NOTE: emit a socket event here, e.g.
  // io.to(`project:${task.projectId}`).emit("task:statusChanged", task);

  res.json(task);
});

export default router;
