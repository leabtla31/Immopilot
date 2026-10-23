/**
 * Seeds the database with the ImmoPilot demo workspace (Léa, Toulouse).
 * Idempotent: running it twice yields the same state.
 */
import { PrismaClient } from "@prisma/client";

import {
  demoAssumptions,
  demoGoals,
  demoHousehold,
  demoListings,
  demoMilestones,
  demoNeighborhoods,
  demoProfile,
  demoUser,
} from "../src/fixtures";

const prisma = new PrismaClient();

async function seedNeighborhoods() {
  for (const { id, ...data } of demoNeighborhoods) {
    await prisma.neighborhood.upsert({
      where: { slug: data.slug },
      create: { id, ...data },
      update: data,
    });
  }
}

async function seedUser() {
  const { id, ...user } = demoUser;
  const { netMonthlyIncome: _derived, ...profileData } = demoProfile;

  await prisma.user.deleteMany({ where: { email: user.email } });

  await prisma.user.create({
    data: {
      id,
      ...user,
      household: { create: demoHousehold.map(({ id: _id, ...member }) => member) },
      // Household income is derived from the members, not stored on the profile.
      profile: { create: profileData },
      assumptions: { create: demoAssumptions },
      goals: { create: demoGoals.map(({ id: _id, ...goal }) => goal) },
      milestones: { create: demoMilestones.map(({ id: _id, ...milestone }) => milestone) },
      listings: {
        create: demoListings.map(({ id: _id, ...listing }) => listing),
      },
      conversations: {
        create: {
          title: "Premier investissement",
          messages: {
            create: [
              {
                role: "USER",
                content: "Puis-je investir dans un studio à Rangueil dès 2027 ?",
              },
              {
                role: "ASSISTANT",
                content:
                  "Oui. Avec 45 000 € d'apport et aucun crédit en cours, un bien à 140 000 € porte votre taux d'endettement à 10 %, bien sous le plafond de 35 %. La demande étudiante à Rangueil sécurise la location.",
              },
            ],
          },
        },
      },
    },
  });
}

async function main() {
  await seedNeighborhoods();
  await seedUser();

  const counts = await Promise.all([
    prisma.neighborhood.count(),
    prisma.listing.count(),
    prisma.milestone.count(),
  ]);
  console.warn(
    `✓ Seed terminé — ${counts[0]} quartiers, ${counts[1]} annonces, ${counts[2]} jalons.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
