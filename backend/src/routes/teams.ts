import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth } from "../middleware/auth";

const router = Router();

// All routes below require a valid access token
router.use(requireAuth);

// POST /teams — create a new team, the creator automatically becomes ADMIN
router.post("/", async (req, res) => {
  const { name } = req.body;
  const userId = req.user!.userId;

  if (!name) {
    return res.status(400).json({ error: "name is required" });
  }

  // Create the team and immediately add the creator as an ADMIN member,
  // wrapped so both succeed or both fail together.
  const team = await prisma.team.create({
    data: {
      name,
      members: {
        create: {
          userId,
          role: "ADMIN",
        },
      },
    },
    include: { members: true },
  });

  res.status(201).json(team);
});

// GET /teams — list all teams the logged-in user belongs to
router.get("/", async (req, res) => {
  const userId = req.user!.userId;

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: { members: true, projects: true },
  });

  res.json(teams);
});

// POST /teams/:id/members — add another user to a team (ADMIN only)
router.post("/:id/members", async (req, res) => {
  const { id: teamId } = req.params;
  const { email, role } = req.body;
  const requesterId = req.user!.userId;

  // Check the requester is an ADMIN of this team
  const requesterMembership = await prisma.teamMember.findUnique({
    where: { userId_teamId: { userId: requesterId, teamId } },
  });

  if (!requesterMembership || requesterMembership.role !== "ADMIN") {
    return res.status(403).json({ error: "Only team admins can add members" });
  }

  const userToAdd = await prisma.user.findUnique({ where: { email } });
  if (!userToAdd) {
    return res.status(404).json({ error: "No user found with that email" });
  }

  const membership = await prisma.teamMember.create({
    data: {
      userId: userToAdd.id,
      teamId,
      role: role === "ADMIN" ? "ADMIN" : "MEMBER",
    },
  });

  res.status(201).json(membership);
});

export default router;
