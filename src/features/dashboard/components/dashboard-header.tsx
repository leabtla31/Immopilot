import { SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

import type { DashboardModel } from "../lib/build-dashboard";

function subtitle({ target }: DashboardModel): string {
  if (target.reachedYear === null) {
    return "Votre trajectoire actuelle n'atteint pas encore votre objectif de patrimoine : voyons comment l'accélérer.";
  }
  if (target.onTrack) {
    return `Votre trajectoire vous mène au premier million en ${target.reachedYear}. Voici où vous en êtes.`;
  }
  return `Au rythme actuel, votre objectif de patrimoine est atteint en ${target.reachedYear}, après l'échéance visée.`;
}

export function DashboardHeader({ model }: { model: DashboardModel }) {
  return (
    <PageHeader
      title={
        <>
          Bonjour {model.firstName}{" "}
          <span
            role="img"
            aria-label="salut"
            className="inline-block origin-[70%_70%] animate-wave"
          >
            👋
          </span>
        </>
      }
      description={subtitle(model)}
      actions={
        <>
          <Button variant="secondary" asChild>
            <Link href="/simulation">
              <SlidersHorizontal /> Simuler
            </Link>
          </Button>
          <Button variant="accent" asChild>
            <Link href="/conseiller">
              <Sparkles /> Demander à l&apos;IA
            </Link>
          </Button>
        </>
      }
    />
  );
}
