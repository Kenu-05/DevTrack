# Learnings Log

Keep this updated as you build. For every feature, note: what doc you read, what confused you, how you solved it. This becomes your interview talking points and proves you didn't just copy-paste from a tutorial.

Format to follow for each entry:

## [Feature name] — [Date]

**Docs read:** (link to the official doc page)

**What I implemented:**

**What confused me / what I had to dig into:**

**How I solved it:**

---

## Example entry (delete once you start your own)

## Prisma relations — June 18

**Docs read:** https://www.prisma.io/docs/orm/prisma-schema/data-model/relations

**What I implemented:** TeamMember join table connecting User and Team with a role field, since a user can be in multiple teams with different roles in each.

**What confused me:** Initially tried a direct many-to-many relation between User and Team, but Prisma's implicit many-to-many doesn't let you store extra fields like `role` on the relationship itself.

**How I solved it:** Used an explicit join model (TeamMember) instead of Prisma's implicit many-to-many, which lets me attach a `role` enum to each membership record.
