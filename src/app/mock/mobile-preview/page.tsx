"use client";

import { useState } from "react";
import { Check, MapPin, Meh, Phone, Star, Users, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const mockRestaurants = [
  {
    id: "1",
    name: "Mira Pasta Club",
    cuisine: "Italian",
    rating: 4.8,
    eta: "12 min",
    match: "4 yes · 1 meh · 0 no",
  },
  {
    id: "2",
    name: "Sizzle Social",
    cuisine: "Korean BBQ",
    rating: 4.7,
    eta: "15 min",
    match: "3 yes · 2 meh",
  },
  {
    id: "3",
    name: "Golden Fold Tacos",
    cuisine: "Mexican",
    rating: 4.6,
    eta: "9 min",
    match: "2 yes · 2 meh · 1 no",
  },
];

type VoteChoice = "no" | "meh" | "yes";
type LeanChoice = "lean-no" | "meh" | "lean-yes";

const leanLabels: Record<LeanChoice, string> = {
  "lean-no": "leaning no",
  meh: "plain meh",
  "lean-yes": "leaning yes",
};

export default function MockMobilePreviewPage() {
  const featured = mockRestaurants[0];
  const [voteChoice, setVoteChoice] = useState<VoteChoice>("meh");
  const [mehLean, setMehLean] = useState<LeanChoice>("meh");

  function chooseVote(choice: VoteChoice) {
    setVoteChoice(choice);
  }

  return (
    <main className="bg-shell">
      <section className="safe-px safe-pt safe-pb mx-auto min-h-screen max-w-md py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Voting preview
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                A cleaner mobile vote deck
              </h1>
            </div>
            <div className="rounded-[1.15rem] border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
              Round 2
            </div>
          </div>

          <div className="flex justify-end">
            <ButtonLink href="/mock/hells-kitchen" variant="secondary" className="min-h-10 px-3 text-xs">
              Try Hell&apos;s Kitchen
            </ButtonLink>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-[1.2rem] border border-border bg-card p-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Users className="h-4 w-4" />
                5 people
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">4 votes submitted</p>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-card p-3">
              <p className="text-sm font-semibold text-foreground">Strict veto</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Enabled tonight</p>
            </div>
            <div className="rounded-[1.2rem] border border-border bg-soft-accent p-3">
              <p className="text-sm font-semibold text-foreground">7 left</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">Tight shortlist</p>
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="border-b border-border bg-muted px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Now voting</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">{featured.name}</h2>
                </div>
                <span className="rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold text-foreground">
                  {featured.eta}
                </span>
              </div>
            </div>

            <CardContent className="space-y-4 p-5">
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground">
                  <Star className="h-3.5 w-3.5 fill-current text-warning" />
                  {featured.rating}
                </span>
                <span className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground">
                  {featured.cuisine}
                </span>
                <span className="inline-flex rounded-full border border-[hsl(var(--highlight))/0.25] bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                  Best current match
                </span>
              </div>

              <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">Live room pulse</p>
                  <p className="text-sm font-medium text-muted-foreground">{featured.match}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-card">
                  <div className="h-full w-4/5 rounded-full bg-[hsl(var(--highlight))]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => chooseVote("no")}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border text-foreground ${
                    voteChoice === "no" ? "border-danger bg-danger/10" : "border-border bg-card"
                  }`}
                >
                  <X className="h-5 w-5" />
                  <span className="mt-1 text-xs font-semibold">No</span>
                </button>
                <button
                  onClick={() => chooseVote("meh")}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border ${
                    voteChoice === "meh"
                      ? "border-border bg-muted text-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  <Meh className="h-5 w-5" />
                  <span className="mt-1 text-xs font-semibold">Meh</span>
                </button>
                <button
                  onClick={() => chooseVote("yes")}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] ${
                    voteChoice === "yes" ? "bg-foreground text-background" : "border border-border bg-card text-foreground"
                  }`}
                >
                  <Check className="h-5 w-5" />
                  <span className="mt-1 text-xs font-semibold">Yes</span>
                </button>
              </div>

              <div className="rounded-[1.25rem] border border-border bg-card p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-foreground">Meh bias</p>
                  <p className="text-sm font-medium text-muted-foreground">{leanLabels[mehLean]}</p>
                </div>
                <input
                  type="range"
                  min={-1}
                  max={1}
                  step={1}
                  value={mehLean === "lean-no" ? -1 : mehLean === "lean-yes" ? 1 : 0}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setMehLean(next < 0 ? "lean-no" : next > 0 ? "lean-yes" : "meh");
                  }}
                  className="mt-3 h-8 w-full accent-foreground"
                  aria-label="Meh bias"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Lean no</span>
                  <span>Meh</span>
                  <span>Lean yes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                Backups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              {mockRestaurants.slice(1).map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className={`rounded-[1.2rem] border p-4 ${
                    index === 0 ? "border-[hsl(var(--highlight))/0.25] bg-accent" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{restaurant.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {restaurant.cuisine} · {restaurant.match}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{restaurant.eta}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="sticky bottom-0 safe-pb pt-2">
            <div className="space-y-3 rounded-[1.5rem] border border-border bg-background/96 p-3 backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://maps.apple.com"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] bg-foreground px-4 text-sm font-semibold text-background"
                >
                  <MapPin className="h-4 w-4" />
                  Open maps
                </a>
                <a
                  href="tel:+1234567890"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] border border-border bg-card px-4 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  Call
                </a>
              </div>
              <ButtonLink href="/" variant="ghost" className="w-full">
                Back home
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
