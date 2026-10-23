import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { DesignSystemShowcase } from "@/features/design-system";

export const metadata: Metadata = { title: "Design System" };

export default function DesignSystemPage() {
  return (
    <>
      <PageHeader
        eyebrow={<Badge tone="violet">Interne</Badge>}
        title="Design System"
        description="Les fondations visuelles d'ImmoPilot : tokens, composants et interactions, tous réutilisables dans l'ensemble du produit."
      />
      <DesignSystemShowcase />
    </>
  );
}
