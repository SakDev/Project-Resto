"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MapPin, Meh, Phone, RotateCcw, X } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HOT_CUISINES, RESTAURANTS_49TH_9TH, TIME_SLOTS } from "@/features/mock/data/restaurants-49th-9th";
import { estimatePrice, isOpenFor, scoreVote } from "@/features/mock/solo-flow";
import type {
  CuisinePreference,
  LeanChoice,
  Step,
  TimeSlot,
  VoteChoice,
  VoteRecord,
} from "@/features/mock/types";

export function Solo49th9thScreen() {
  const [step, setStep] = useState<Step>("prefs");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("dinner");
  const [maxDistanceM, setMaxDistanceM] = useState(1000);
  const [cuisinePrefs, setCuisinePrefs] = useState<Record<string, CuisinePreference>>({});
  const [cuisineIndex, setCuisineIndex] = useState(0);
  const [mustBeOpen, setMustBeOpen] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, VoteRecord>>({});
  const [pendingLean, setPendingLean] = useState<LeanChoice>("ehh");
  const [pendingChoice, setPendingChoice] = useState<VoteChoice | null>(null);

  const yesCuisines = HOT_CUISINES.filter((cuisine) => cuisinePrefs[cuisine] === "yes");
  const cuisineCurrent = HOT_CUISINES[cuisineIndex];
  const cuisineDoneCount = Object.keys(cuisinePrefs).length;

  const filtered = RESTAURANTS_49TH_9TH.filter((restaurant) => {
    if (restaurant.distanceM > maxDistanceM) return false;
    const pref = cuisinePrefs[restaurant.cuisine] ?? "maybe";
    if (pref === "no") return false;
    if (yesCuisines.length > 0 && pref !== "yes") return false;
    if (mustBeOpen && !isOpenFor(restaurant.cuisine, timeSlot)) return false;
    return true;
  });

  const current = filtered[currentIndex];
  const total = filtered.length;
  const votedCount = Object.keys(votes).length;

  const ranked = filtered
    .map((restaurant) => {
      const vote = votes[restaurant.id];
      const score = vote ? scoreVote(vote) : Number.NEGATIVE_INFINITY;
      return { ...restaurant, vote, score };
    })
    .filter((restaurant) => restaurant.score !== Number.NEGATIVE_INFINITY)
    .sort((a, b) => (b.score !== a.score ? b.score - a.score : a.distanceM - b.distanceM));

  const winner = ranked[0];
  const backups = ranked.slice(1, 6);

  function voteCuisine(pref: CuisinePreference) {
    if (!cuisineCurrent) return;
    setCuisinePrefs((prev) => ({ ...prev, [cuisineCurrent]: pref }));
    if (cuisineIndex < HOT_CUISINES.length - 1) {
      setCuisineIndex((value) => value + 1);
    }
  }

  function resetCuisineDeck() {
    setCuisinePrefs({});
    setCuisineIndex(0);
  }

  function prevCuisine() {
    setCuisineIndex((value) => Math.max(0, value - 1));
  }

  function startFlow() {
    setVotes({});
    setCurrentIndex(0);
    setPendingChoice(null);
    setPendingLean("ehh");
    setStep("vote");
  }

  function castAndNext(vote: VoteChoice, lean: LeanChoice = "ehh") {
    if (!current) return;
    setVotes((prev) => ({ ...prev, [current.id]: { vote, lean } }));
    setPendingChoice(null);
    setPendingLean("ehh");
    if (currentIndex >= filtered.length - 1) {
      setStep("results");
      return;
    }
    setCurrentIndex((value) => value + 1);
  }

  function restartAll() {
    setStep("prefs");
    setVotes({});
    setCurrentIndex(0);
    setPendingChoice(null);
    setPendingLean("ehh");
    resetCuisineDeck();
  }

  return (
    <main className="bg-shell">
      <section className="safe-px safe-pt safe-pb mx-auto min-h-screen max-w-md py-4">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Solo real-data mock
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.04em] text-foreground">
                9th Ave & 49th St
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">50+ nearby restaurants, one-person end-to-end flow.</p>
            </div>
            <span className="rounded-[1rem] border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
              {RESTAURANTS_49TH_9TH.length} loaded
            </span>
          </div>

          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Source: OpenStreetMap via Overpass around
              <span className="font-semibold text-foreground"> West 49th St & 9th Ave </span>
              (<span className="font-semibold text-foreground">40.7630378, -73.9896819</span>) within
              <span className="font-semibold text-foreground"> 1609m </span>(1 mile), fetched on
              <span className="font-semibold text-foreground"> 2026-03-08</span>.
            </CardContent>
          </Card>

          {step === "prefs" ? (
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                  1. Set preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">Dining time</p>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.value}
                        onClick={() => setTimeSlot(slot.value)}
                        className={`min-h-11 rounded-[0.95rem] border text-sm font-semibold ${
                          timeSlot === slot.value
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-card text-foreground"
                        }`}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Max distance</p>
                    <p className="text-sm font-medium text-muted-foreground">{maxDistanceM}m</p>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1609}
                    step={50}
                    value={maxDistanceM}
                    onChange={(event) => setMaxDistanceM(Number(event.target.value))}
                    className="h-8 w-full accent-foreground"
                  />
                </div>

                <div>
                  <p className="mb-2 text-sm font-semibold text-foreground">Cuisine preferences</p>
                  <div className="rounded-[1rem] border border-border bg-card p-3">
                    <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      <span>Swipe-style cuisine deck</span>
                      <span>
                        {Math.min(cuisineIndex + 1, HOT_CUISINES.length)} / {HOT_CUISINES.length}
                      </span>
                    </div>

                    {cuisineCurrent ? (
                      <>
                        <div className="rounded-[1rem] border border-border bg-muted p-4 text-center">
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                            Current cuisine
                          </p>
                          <p className="mt-2 text-xl font-semibold text-foreground">{cuisineCurrent.replace("_", " ")}</p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Vote exactly like restaurants: no, maybe, or yes.
                          </p>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => voteCuisine("no")}
                            className="flex min-h-11 items-center justify-center gap-1 rounded-[0.85rem] border border-border bg-card text-xs font-semibold text-foreground"
                          >
                            <X className="h-4 w-4" />
                            No
                          </button>
                          <button
                            onClick={() => voteCuisine("maybe")}
                            className="flex min-h-11 items-center justify-center gap-1 rounded-[0.85rem] border border-border bg-card text-xs font-semibold text-foreground"
                          >
                            <Meh className="h-4 w-4" />
                            Maybe
                          </button>
                          <button
                            onClick={() => voteCuisine("yes")}
                            className="flex min-h-11 items-center justify-center gap-1 rounded-[0.85rem] border border-[hsl(var(--highlight))/0.35] bg-accent text-xs font-semibold text-accent-foreground"
                          >
                            <Check className="h-4 w-4" />
                            Yes
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="rounded-[1rem] border border-border bg-muted p-4 text-sm text-muted-foreground">
                        Cuisine deck complete. You can start voting restaurants or go back and adjust.
                      </div>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={prevCuisine}
                        className="min-h-9 rounded-[0.8rem] border border-border bg-card px-3 text-xs font-semibold text-foreground"
                      >
                        Previous
                      </button>
                      <span className="text-xs font-medium text-muted-foreground">{cuisineDoneCount} marked</span>
                      <button
                        onClick={resetCuisineDeck}
                        className="min-h-9 rounded-[0.8rem] border border-border bg-card px-3 text-xs font-semibold text-foreground"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-muted px-3 py-3">
                  <input
                    type="checkbox"
                    checked={mustBeOpen}
                    onChange={(event) => setMustBeOpen(event.target.checked)}
                    className="h-4 w-4 accent-foreground"
                  />
                  <span className="text-sm font-medium text-foreground">Only show places likely open for this time</span>
                </label>

                <div className="rounded-[1rem] border border-border bg-card p-3 text-sm text-muted-foreground">
                  <p>
                    Candidate pool:
                    <span className="font-semibold text-foreground"> {filtered.length} </span>
                    restaurants
                  </p>
                </div>

                <ButtonLink
                  href="#"
                  className={`w-full ${filtered.length === 0 ? "pointer-events-none opacity-40" : ""}`}
                  variant="primary"
                >
                  <span onClick={startFlow}>Start voting</span>
                </ButtonLink>
              </CardContent>
            </Card>
          ) : null}

          {step === "vote" && current ? (
            <Card className="overflow-hidden">
              <div className="border-b border-border bg-muted px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      2. Vote
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-foreground">{current.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {current.cuisine.replace("_", " ")} · {current.distanceM}m ·{" "}
                      {estimatePrice(current.cuisine, current.distanceM)}
                    </p>
                  </div>
                  <MapPin className="h-5 w-5 text-foreground" />
                </div>
              </div>

              <CardContent className="space-y-4 p-5">
                <div className="rounded-[1rem] border border-border bg-card p-3 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-medium text-foreground">Progress</span>
                    <span className="text-muted-foreground">
                      {currentIndex + 1} / {total} · {votedCount} voted
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => castAndNext("no")}
                    className="flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border border-border bg-card text-foreground"
                  >
                    <X className="h-5 w-5" />
                    <span className="mt-1 text-xs font-semibold">No</span>
                  </button>
                  <button
                    onClick={() => setPendingChoice("ehh")}
                    className={`flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border ${
                      pendingChoice === "ehh"
                        ? "border-[hsl(var(--highlight))/0.3] bg-accent text-accent-foreground"
                        : "border-border bg-card text-foreground"
                    }`}
                  >
                    <Meh className="h-5 w-5" />
                    <span className="mt-1 text-xs font-semibold">Ehh</span>
                  </button>
                  <button
                    onClick={() => castAndNext("yes")}
                    className="flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] bg-foreground text-background"
                  >
                    <Check className="h-5 w-5" />
                    <span className="mt-1 text-xs font-semibold">Yes</span>
                  </button>
                </div>

                {pendingChoice === "ehh" ? (
                  <div className="rounded-[1.2rem] border border-[hsl(var(--highlight))/0.2] bg-soft-accent p-3">
                    <p className="text-sm font-semibold text-foreground">Refine `Ehh`</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {(["lean-no", "ehh", "lean-yes"] as const).map((lean) => (
                        <button
                          key={lean}
                          onClick={() => setPendingLean(lean)}
                          className={`min-h-10 rounded-[0.9rem] border px-2 text-xs font-semibold ${
                            pendingLean === lean
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-card text-foreground"
                          }`}
                        >
                          {lean === "lean-no" ? "Lean no" : lean === "ehh" ? "Plain ehh" : "Lean yes"}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => castAndNext("ehh", pendingLean)}
                      className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-[0.95rem] bg-foreground px-3 text-sm font-semibold text-background"
                    >
                      Save Ehh & Next
                    </button>
                  </div>
                ) : null}

                <button
                  onClick={() => setStep("results")}
                  className="inline-flex min-h-10 w-full items-center justify-center rounded-[0.95rem] border border-border bg-card px-3 text-sm font-semibold text-foreground"
                >
                  Finish now
                </button>
              </CardContent>
            </Card>
          ) : null}

          {step === "results" ? (
            <Card className="overflow-hidden">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                  3. Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-5">
                {winner ? (
                  <div className="rounded-[1.25rem] border border-[hsl(var(--highlight))/0.3] bg-accent p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">Winner</p>
                    <p className="mt-1 text-xl font-semibold text-foreground">{winner.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {winner.cuisine.replace("_", " ")} · {winner.distanceM}m · score {winner.score.toFixed(2)}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-[1rem] border border-border bg-card p-4 text-sm text-muted-foreground">
                    No positive picks yet. Adjust preferences or vote flow and retry.
                  </div>
                )}

                {backups.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Backups</p>
                    {backups.map((backup) => (
                      <div key={backup.id} className="rounded-[1rem] border border-border bg-card p-3 text-sm">
                        <p className="font-semibold text-foreground">{backup.name}</p>
                        <p className="text-muted-foreground">
                          {backup.cuisine.replace("_", " ")} · {backup.distanceM}m · score {backup.score.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={
                      winner
                        ? `https://maps.apple.com/?q=${encodeURIComponent(winner.name + " near 9th Ave 49th St NYC")}`
                        : "https://maps.apple.com/?q=9th+Ave+49th+St+NYC+restaurants"
                    }
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.95rem] bg-foreground px-3 text-sm font-semibold text-background"
                  >
                    <MapPin className="h-4 w-4" />
                    Open maps
                  </a>
                  <a
                    href="tel:+12125551234"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[0.95rem] border border-border bg-card px-3 text-sm font-semibold text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>

                <button
                  onClick={restartAll}
                  className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[0.95rem] border border-border bg-card px-3 text-sm font-semibold text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                  Start over
                </button>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <ButtonLink href="/mock/10019-real-preview" variant="secondary" className="w-full">
              10019 mock
            </ButtonLink>
            <ButtonLink href="/mock/mobile-preview" variant="ghost" className="w-full">
              Previous mock
            </ButtonLink>
          </div>

          <div className="text-center">
            <Link
              href="https://overpass-api.de/"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
            >
              Data query source: Overpass API
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
