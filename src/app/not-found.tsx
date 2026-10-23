import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <Card className="w-full max-w-md">
        <EmptyState
          icon={Compass}
          title="Page introuvable"
          description="Cette adresse ne mène nulle part. Revenez au tableau de bord pour reprendre votre trajectoire."
          action={
            <Button asChild>
              <Link href="/dashboard">Retour au dashboard</Link>
            </Button>
          }
        />
      </Card>
    </main>
  );
}
