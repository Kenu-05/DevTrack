import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All routes below require a valid access token
router.use(requireAuth);

// POST /projects — create a new project under a team
router.post("/", async (req, res) => {
  const { name, description, teamId } = req.body;
  const userId = req.user!.userId;

  if (!name || !teamId) {
    return res.status(400).json({ error: "name and teamId are required" });
  }

  // Make sure the requester is actually a member of this team
  const membership = await prisma.teamMember.findUnique({
    where: { userId_teamId: { userId, teamId } },
  });

  if (!membership) {
    return res.status(403).json({ error: "You are not a member of this team" });
  }

  const project = await prisma.project.create({
    data: { name, description, teamId },
  });

  res.status(201).json(project);
});

// GET /projects?teamId=xxx — list projects for a team
router.get("/", async (req, res) => {
  const { teamId } = req.query;

  if (!teamId) {
    return res
      .status(400)
      .json({ error: "teamId query parameter is required" });
  }

  const projects = await prisma.project.findMany({
    where: { teamId: String(teamId) },
    include: { tasks: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(projects);
});

// GET /projects/:id — get a single project with its tasks
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true, team: true },
  });

  if (!project) {
    return res.status(404).json({ error: "Project not found" });
  }

  res.json(project);
});

export default router;
