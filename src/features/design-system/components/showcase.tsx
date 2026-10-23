"use client";

import {
  ArrowUpRight,
  Bell,
  Building2,
  Ellipsis,
  Landmark,
  PiggyBank,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Reveal, RevealItem } from "@/components/motion/reveal";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Gauge } from "@/components/ui/gauge";
import { IconTile } from "@/components/ui/icon-tile";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Score } from "@/components/ui/score";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Trend } from "@/components/ui/trend";
import { formatCurrency, formatPercent } from "@/utils/format";

const palette = [
  { name: "Graphite", token: "--foreground" },
  { name: "Blanc cassé", token: "--background" },
  { name: "Violet", token: "--violet" },
  { name: "Bleu", token: "--blue" },
  { name: "Vert", token: "--green" },
  { name: "Ambre", token: "--amber" },
  { name: "Rose", token: "--rose" },
];

const typeScale = [
  { label: "Display", className: "text-5xl font-semibold tracking-[-0.035em]" },
  { label: "Titre 1", className: "text-4xl font-semibold tracking-[-0.03em]" },
  { label: "Titre 2", className: "text-2xl font-semibold tracking-tight" },
  { label: "Titre 3", className: "text-lg font-semibold tracking-tight" },
  { label: "Corps", className: "text-[15px] leading-7" },
  { label: "Légende", className: "text-[13px] text-muted-foreground" },
];

const rows = [
  { name: "T2 Montaudran", price: 172_000, yield: 0.048, score: 87 },
  { name: "Studio Rangueil", price: 98_000, yield: 0.064, score: 82 },
  { name: "T3 Borderouge", price: 214_000, yield: 0.057, score: 79 },
];

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <RevealItem>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </RevealItem>
  );
}

export function DesignSystemShowcase() {
  const [period, setPeriod] = useState<"1a" | "5a" | "10a" | "max">("10a");
  const [rate, setRate] = useState([3.35]);
  const [netWorth, setNetWorth] = useState(83_000);

  return (
    <Reveal className="grid gap-5 xl:grid-cols-2">
      <Section title="Palette" description="Couleurs désaturées, utilisées avec parcimonie.">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {palette.map((color) => (
            <div key={color.token} className="space-y-2">
              <div
                className="h-16 rounded-2xl border border-border shadow-sm"
                style={{ background: `var(${color.token})` }}
              />
              <div>
                <p className="text-[13px] font-medium">{color.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{color.token}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typographie" description="Inter variable, hiérarchie très marquée.">
        <div className="space-y-3">
          {typeScale.map((type) => (
            <div key={type.label} className="flex items-baseline justify-between gap-6">
              <span className={type.className}>Patrimoine</span>
              <span className="shrink-0 text-xs text-muted-foreground">{type.label}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Boutons" description="Très arrondis, feedback à chaque clic.">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() =>
              toast.success("Simulation enregistrée", {
                description: "Scénario « Locatif d'abord »",
              })
            }
          >
            Enregistrer
          </Button>
          <Button variant="secondary">
            <Plus /> Ajouter un bien
          </Button>
          <Button variant="accent">
            <Sparkles /> Demander à l&apos;IA
          </Button>
          <Button variant="soft">Comparer</Button>
          <Button variant="ghost">Annuler</Button>
          <Button variant="outline">Exporter</Button>
          <Button variant="danger">
            <Trash2 /> Supprimer
          </Button>
          <Button loading>Calcul…</Button>
          <SimpleTooltip label="Notifications">
            <Button variant="secondary" size="icon" aria-label="Notifications">
              <Bell />
            </Button>
          </SimpleTooltip>
        </div>
      </Section>

      <Section title="Badges & tendances" description="Statuts lisibles en un regard.">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge>Neutre</Badge>
          <Badge tone="violet" dot>
            IA
          </Badge>
          <Badge tone="blue">Ligne C</Badge>
          <Badge tone="green" dot>
            Cash-flow positif
          </Badge>
          <Badge tone="amber">DPE F</Badge>
          <Badge tone="rose">Vacance élevée</Badge>
          <Trend value={0.084} />
          <Trend value={-0.021} />
          <Trend value={-12_000} format="currency" invert />
          <Kbd>⌘K</Kbd>
        </div>
      </Section>

      <Section title="Champs" description="Formulaires généreux et accessibles.">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="ds-price">Prix du bien</Label>
            <Input id="ds-price" inputMode="numeric" defaultValue="172 000" endAdornment="€" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ds-district">Quartier</Label>
            <Select defaultValue="montaudran">
              <SelectTrigger id="ds-district">
                <SelectValue placeholder="Choisir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="montaudran">Montaudran</SelectItem>
                <SelectItem value="minimes">Minimes</SelectItem>
                <SelectItem value="saint-cyprien">Saint-Cyprien</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Label>Taux d&apos;emprunt</Label>
              <span className="text-sm font-semibold tabular">
                {formatPercent(rate[0]! / 100, { digits: 2 })}
              </span>
            </div>
            <Slider
              value={rate}
              onValueChange={setRate}
              min={1}
              max={6}
              step={0.05}
              aria-label="Taux d'emprunt"
            />
          </div>
          <div className="flex items-center justify-between rounded-2xl bg-surface-sunken px-4 py-3 sm:col-span-2">
            <Label htmlFor="ds-switch">Inclure la vacance locative</Label>
            <Switch id="ds-switch" defaultChecked />
          </div>
        </div>
      </Section>

      <Section title="Navigation" description="Contrôle segmenté et onglets animés.">
        <div className="space-y-6">
          <SegmentedControl
            label="Période"
            value={period}
            onValueChange={setPeriod}
            options={[
              { value: "1a", label: "1 an" },
              { value: "5a", label: "5 ans" },
              { value: "10a", label: "10 ans" },
              { value: "max", label: "Max" },
            ]}
          />
          <Tabs defaultValue="rp">
            <TabsList>
              <TabsTrigger value="rp">Résidence</TabsTrigger>
              <TabsTrigger value="loc">Locatif</TabsTrigger>
              <TabsTrigger value="mix">Les deux</TabsTrigger>
            </TabsList>
            <TabsContent value="rp" className="text-sm text-muted-foreground">
              Acheter sa résidence principale d&apos;abord.
            </TabsContent>
            <TabsContent value="loc" className="text-sm text-muted-foreground">
              Investir dans le locatif d&apos;abord.
            </TabsContent>
            <TabsContent value="mix" className="text-sm text-muted-foreground">
              Investissement puis résidence principale.
            </TabsContent>
          </Tabs>
        </div>
      </Section>

      <Section title="Données" description="Jauges, scores et chiffres animés.">
        <div className="flex flex-wrap items-center gap-8">
          <Gauge
            value={netWorth / 1_000_000}
            label="Progression vers le premier million"
            size={128}
          >
            <span className="text-xl font-semibold tabular">
              {formatPercent(netWorth / 1_000_000, { digits: 0 })}
            </span>
            <span className="text-xs text-muted-foreground">du million</span>
          </Gauge>
          <Score value={87} size="lg" label="Score IA" />
          <div className="flex items-center gap-3">
            <Score value={72} size="md" />
            <Score value={48} size="sm" />
          </div>
          <div className="min-w-48 flex-1 space-y-3">
            <AnimatedNumber
              value={netWorth}
              format="currency"
              className="block text-3xl font-semibold tracking-tight"
            />
            <Progress value={netWorth / 1_000_000} label="Progression patrimoine" />
            <Button variant="secondary" size="sm" onClick={() => setNetWorth((v) => v + 25_000)}>
              <Plus /> 25 000 €
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Surfaces" description="Dialog, drawer, popover, menu.">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Ouvrir un dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Archiver cette annonce ?</DialogTitle>
                <DialogDescription>
                  Elle disparaîtra de votre liste mais restera disponible dans l&apos;historique.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Annuler</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={() => toast("Annonce archivée")}>Archiver</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="secondary">Ouvrir un drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-md">
                <DrawerHeader>
                  <DrawerTitle>Hypothèses</DrawerTitle>
                  <DrawerDescription>Glissez vers le bas pour fermer.</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Appliquer</Button>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="space-y-1.5">
              <p className="text-sm font-semibold">Capacité d&apos;emprunt</p>
              <p className="text-[13px] leading-5 text-muted-foreground">
                Calculée avec un taux d&apos;endettement maximal de 35 %, assurance incluse.
              </p>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" aria-label="Plus d'actions">
                <Ellipsis />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <ArrowUpRight /> Ouvrir l&apos;annonce{" "}
                <DropdownMenuShortcut>↵</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles /> Analyser avec l&apos;IA
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="danger">
                <Trash2 /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Section>

      <Section title="Tableau" description="Espacé, sans grille lourde.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bien</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-right">Rendement</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell className="font-medium">
                  <span className="flex items-center gap-3">
                    <IconTile icon={Building2} size="sm" />
                    {row.name}
                  </span>
                </TableCell>
                <TableCell className="text-right">{formatCurrency(row.price)}</TableCell>
                <TableCell className="text-right">{formatPercent(row.yield)}</TableCell>
                <TableCell className="text-right">
                  <Badge tone={row.score >= 85 ? "green" : "violet"}>{row.score}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Chargement" description="Skeletons et loaders discrets.">
        <div className="flex items-center gap-6">
          <div className="flex-1 space-y-3" aria-busy="true">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          <Spinner label="Chargement" className="size-6 text-muted-foreground" />
        </div>
      </Section>

      <Section title="Icônes" description="Lucide, 1.75 de trait, toujours dans une tuile.">
        <div className="flex flex-wrap gap-3">
          <IconTile icon={Landmark} />
          <IconTile icon={PiggyBank} tone="green" />
          <IconTile icon={Sparkles} tone="violet" />
          <IconTile icon={Building2} tone="blue" />
          <IconTile icon={Bell} tone="amber" />
        </div>
      </Section>
    </Reveal>
  );
}
