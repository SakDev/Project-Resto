"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, ExternalLink, MapPin, Meh, MoveHorizontal, Phone, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RESTAURANTS_10019 } from "@/features/mock/data/restaurants-10019";
import type { LeanChoice, VoteChoice } from "@/features/mock/types";
import { LEAN_LABELS } from "@/features/mock/types";

export function Zip10019RealPreviewScreen() {
  const featured = RESTAURANTS_10019[0];
  const backups = RESTAURANTS_10019.slice(1);

  const [voteChoice, setVoteChoice] = useState<VoteChoice>("ehh");
  const [leanChoice, setLeanChoice] = useState<LeanChoice>("ehh");

  function chooseVote(choice: VoteChoice) {
    setVoteChoice(choice);
    if (choice !== "ehh") {
      setLeanChoice("ehh");
    }
  }

  return (
    <main className="bg-shell">
      <section className="safe-px safe-pt safe-pb mx-auto min-h-screen max-w-md py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Real-data mock
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                Zip 10019 within 1 mile
              </h1>
            </div>
            <span className="rounded-[1rem] border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
              {RESTAURANTS_10019.length} places
            </span>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                Data source
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Names and cuisine tags are from OpenStreetMap queried around ZIP center
              <span className="font-semibold text-foreground"> 40.7634478, -73.9859740 </span>
              with a
              <span className="font-semibold text-foreground"> 1609m radius</span> (1 mile), fetched on
              <span className="font-semibold text-foreground"> 2026-03-08</span>.
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="border-b border-border bg-muted px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Now voting</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">{featured.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {featured.cuisine} · {featured.distanceM}m away
                  </p>
                </div>
                <MapPin className="h-5 w-5 text-foreground" />
              </div>
            </div>

            <CardContent className="space-y-4 p-5">
              <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-foreground">Live room pulse</p>
                  <p className="text-sm font-medium text-muted-foreground">{featured.pulse}</p>
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
                  onClick={() => chooseVote("ehh")}
                  className={`flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border ${
                    voteChoice === "ehh"
                      ? "border-[hsl(var(--highlight))/0.3] bg-accent text-accent-foreground"
                      : "border-border bg-card text-foreground"
                  }`}
                >
                  <Meh className="h-5 w-5" />
                  <span className="mt-1 text-xs font-semibold">Ehh</span>
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

              {voteChoice === "ehh" ? (
                <div className="rounded-[1.25rem] border border-[hsl(var(--highlight))/0.2] bg-soft-accent p-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MoveHorizontal className="h-4 w-4" />
                    Refine the middle
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {(["lean-no", "ehh", "lean-yes"] as const).map((lean) => (
                      <button
                        key={lean}
                        onClick={() => setLeanChoice(lean)}
                        className={`min-h-11 rounded-[0.95rem] border px-3 text-xs font-semibold ${
                          leanChoice === lean
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        {lean === "lean-no" ? "Lean no" : lean === "ehh" ? "Plain ehh" : "Lean yes"}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    Current: {LEAN_LABELS[leanChoice]}
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                Backup options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              {backups.map((restaurant, index) => (
                <div
                  key={restaurant.name}
                  className={`rounded-[1.2rem] border p-4 ${
                    index === 0 ? "border-[hsl(var(--highlight))/0.25] bg-accent" : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{restaurant.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {restaurant.cuisine} · {restaurant.distanceM}m · {restaurant.pulse}
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="sticky bottom-0 safe-pb pt-2">
            <div className="space-y-3 rounded-[1.5rem] border border-border bg-background/96 p-3 backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://maps.apple.com/?q=10019"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] bg-foreground px-4 text-sm font-semibold text-background"
                >
                  <MapPin className="h-4 w-4" />
                  Open maps
                </a>
                <a
                  href="tel:+12125551234"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.1rem] border border-border bg-card px-4 text-sm font-semibold text-foreground"
                >
                  <Phone className="h-4 w-4" />
                  Call pick
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/mock/mobile-preview" variant="secondary" className="w-full">
                  Previous mock
                </ButtonLink>
                <ButtonLink href="/" variant="ghost" className="w-full">
                  Back home
                </ButtonLink>
              </div>
            </div>
          </div>

          <div className="pb-2 text-center">
            <Link
              href="https://overpass-api.de/"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
            >
              Query source: Overpass API
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

