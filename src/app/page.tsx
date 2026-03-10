import Link from "next/link";
import { ArrowRight, ListFilter, Map, ShieldCheck, Users, Vote } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent } from "@/components/ui/card";
import { appConfig } from "@/lib/config/app-config";

const roomMoments = [
  {
    step: "01",
    title: "Start a room",
    note: "Set a neighborhood, keep the list tight, send the code.",
  },
  {
    step: "02",
    title: "Everyone votes",
    note: "Yes, ehh, and no stay visible on every card.",
  },
  {
    step: "03",
    title: "Reveal the winner",
    note: "A result with backups and a clear reason it won.",
  },
];

const productNotes = [
  {
    icon: Vote,
    title: "Explainable scoring",
    note: "Yes = 1, ehh = 0.5, no = veto when strict mode is on.",
  },
  {
    icon: Users,
    title: "Built for small groups",
    note: "Tuned for 2 to 6 people deciding on phones, not dashboards.",
  },
  {
    icon: ListFilter,
    title: "Taste-aware structure",
    note: "Room, ranking, and restaurant models are already typed and isolated.",
  },
  {
    icon: ShieldCheck,
    title: "Server-side boundaries",
    note: "Provider secrets stay off the client and room writes stay validated.",
  },
];

export default function Home() {
  return (
    <main className="bg-shell">
      <section className="safe-px safe-pt safe-pb mx-auto flex min-h-screen max-w-md flex-col gap-4 py-4 sm:max-w-xl lg:max-w-6xl lg:gap-6 lg:px-10 lg:py-8">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--highlight))]" />
          Restaurant rooms for real life
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
              <div className="bg-grid border-b border-border p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Cleaner group picks
                    </p>
                    <h1 className="mt-3 max-w-xl text-balance font-display text-4xl font-semibold tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
                      Pick where to eat without the group-chat spiral.
                    </h1>
                  </div>
                  <div className="hidden rounded-[1.25rem] border border-border bg-muted px-3 py-2 text-sm font-semibold text-foreground sm:block">
                    {appConfig.room.minMembers} to {appConfig.room.maxMembers} people
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  {appConfig.name} should feel fast, opinionated, and trustworthy. The right tone is less
                  restaurant mood board, more sharp consumer product with strong taste.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <ButtonLink href="/rooms/new" className="w-full">
                    Start a room
                  </ButtonLink>
                  <ButtonLink href="/join/demo-room" variant="secondary" className="w-full">
                    Join a room
                  </ButtonLink>
                </div>

                <div className="grid gap-3 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.5rem] border border-border bg-[hsl(var(--surface-strong))] p-4 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">
                          Tonight
                        </p>
                        <p className="mt-2 text-lg font-semibold">Lower friction. Better taste signal.</p>
                      </div>
                      <Map className="h-5 w-5 text-white/70" />
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-white/72">
                      <span className="rounded-full bg-white/10 px-3 py-1">West Village</span>
                      <span className="rounded-full bg-white/10 px-3 py-1">Open now</span>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-soft-accent p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      Average decision
                    </p>
                    <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground">under 2 min</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      The UI should let a distracted group move before momentum dies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {productNotes.map((item) => (
                <Card key={item.title}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-[1rem] border border-border bg-muted p-2.5 text-foreground">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-foreground">{item.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="border-b border-border bg-muted px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Flow preview
                </p>
              </div>
              <CardContent className="space-y-3 p-5">
                {roomMoments.map((moment) => (
                  <div key={moment.step} className="rounded-[1.25rem] border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        {moment.step}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{moment.title}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{moment.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b border-border px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Taste direction
                </p>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="rounded-[1.35rem] bg-muted p-4">
                  <p className="font-semibold text-foreground">Less themed, more editorial.</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Neutral surfaces, darker type, tighter cards, and one restrained green accent go further
                    than orange gradients and brown panels.
                  </p>
                </div>
                <Link
                  href="/mock/mobile-preview"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground"
                >
                  Preview the mock voting screen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
