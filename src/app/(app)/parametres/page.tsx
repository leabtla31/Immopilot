import type { Metadata } from "next";

import { ModulePreview } from "@/components/layout/module-preview";
import { getNavItem } from "@/config/navigation";

const item = getNavItem("settings");

export const metadata: Metadata = { title: item.label };

export default function Page() {
  return (
    <ModulePreview
      item={item}
      sprint={3}
      capabilities={[
        "Mettre à jour votre profil financier",
        "Ajuster taux, durée, inflation et revalorisation",
        "Choisir thème et préférences d'affichage",
      ]}
    />
  );
}
