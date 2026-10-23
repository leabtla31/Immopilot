import { Check } from "lucide-react";

import { Reveal, RevealItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IconTile } from "@/components/ui/icon-tile";
import type { NavItem } from "@/config/navigation";

import { PageHeader } from "./page-header";

export interface ModulePreviewProps {
  item: NavItem;
  sprint: number;
  capabilities: string[];
}

/** Placeholder shown for a module until its sprint ships — never a dead end. */
export function ModulePreview({ item, sprint, capabilities }: ModulePreviewProps) {
  return (
    <>
      <PageHeader
        eyebrow={
          <Badge tone="violet" dot>
            Sprint {sprint}
          </Badge>
        }
        title={item.label}
        description={item.description}
      />
      <Reveal className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <RevealItem>
          <Card className="h-full">
            <CardContent className="flex h-full flex-col justify-between gap-10 py-8">
              <IconTile icon={item.icon} tone="violet" size="lg" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold tracking-tight">En cours de conception</h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Ce module est planifié pour le sprint {sprint}. L&apos;architecture, les données
                  et le design system qui le portent sont déjà en place.
                </p>
              </div>
            </CardContent>
          </Card>
        </RevealItem>
        <RevealItem>
          <Card className="h-full">
            <CardContent className="py-8">
              <h2 className="mb-5 text-sm font-medium text-muted-foreground">
                Ce que vous pourrez faire
              </h2>
              <ul className="space-y-3.5">
                {capabilities.map((capability) => (
                  <li key={capability} className="flex items-start gap-3 text-[15px] leading-6">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-green-soft text-green">
                      <Check className="size-3" strokeWidth={2.5} />
                    </span>
                    {capability}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </RevealItem>
      </Reveal>
    </>
  );
}
