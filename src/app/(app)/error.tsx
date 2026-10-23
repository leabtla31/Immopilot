"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="mt-10">
      <EmptyState
        icon={TriangleAlert}
        title="Un imprévu est survenu"
        description="Nous n'avons pas pu charger cette page. Vos données sont intactes — réessayez dans un instant."
        action={
          <Button variant="secondary" onClick={reset}>
            <RotateCcw /> Réessayer
          </Button>
        }
      />
    </Card>
  );
}
