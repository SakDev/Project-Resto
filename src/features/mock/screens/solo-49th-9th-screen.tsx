"use client";

import { type ChangeEvent, type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from "react";
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
  const cuisineCommitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cuisineSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const restaurantCommitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restaurantSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const [step, setStep] = useState<Step>("prefs");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("dinner");
  const [maxDistanceM, setMaxDistanceM] = useState(1000);
  const [cuisinePrefs, setCuisinePrefs] = useState<Record<string, CuisinePreference>>({});
  const [cuisineIndex, setCuisineIndex] = useState(0);
  const [mustBeOpen, setMustBeOpen] = useState(true);
  const [cuisineSwipeOffset, setCuisineSwipeOffset] = useState(0);
  const [cuisineSwipeLift, setCuisineSwipeLift] = useState(0);
  const [cuisineCardOpacity, setCuisineCardOpacity] = useState(1);
  const [cuisineCardScale, setCuisineCardScale] = useState(1);
  const [isCuisineAnimating, setIsCuisineAnimating] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<Record<string, VoteRecord>>({});
  const [mehLean, setMehLean] = useState<LeanChoice>("meh");
  const [restaurantSwipeOffset, setRestaurantSwipeOffset] = useState(0);
  const [restaurantSwipeLift, setRestaurantSwipeLift] = useState(0);
  const [restaurantCardOpacity, setRestaurantCardOpacity] = useState(1);
  const [restaurantCardScale, setRestaurantCardScale] = useState(1);
  const [isRestaurantAnimating, setIsRestaurantAnimating] = useState(false);

  const cuisineCurrent = HOT_CUISINES[cuisineIndex];
  const cuisineNext = HOT_CUISINES[cuisineIndex + 1];
  const cuisineDoneCount = Object.keys(cuisinePrefs).length;
  const isCuisineDragging = cuisineSwipeStartRef.current !== null;
  const isRestaurantDragging = restaurantSwipeStartRef.current !== null;

  function getFilteredRestaurants(preferences: Record<string, CuisinePreference>) {
    const yesSelections = HOT_CUISINES.filter((cuisine) => preferences[cuisine] === "yes");

    return RESTAURANTS_49TH_9TH.filter((restaurant) => {
      if (restaurant.distanceM > maxDistanceM) return false;
      const pref = preferences[restaurant.cuisine] ?? "meh";
      if (pref === "no") return false;
      if (yesSelections.length > 0 && pref !== "yes") return false;
      if (mustBeOpen && !isOpenFor(restaurant.cuisine, timeSlot)) return false;
      return true;
    });
  }

  const filtered = getFilteredRestaurants(cuisinePrefs);

  const current = filtered[currentIndex];
  const total = filtered.length;
  const votedCount = Object.keys(votes).length;
  const mehLeanValue = mehLean === "lean-no" ? -1 : mehLean === "lean-yes" ? 1 : 0;

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

  useEffect(() => {
    return () => {
      if (cuisineCommitTimeoutRef.current) {
        clearTimeout(cuisineCommitTimeoutRef.current);
      }

      if (restaurantCommitTimeoutRef.current) {
        clearTimeout(restaurantCommitTimeoutRef.current);
      }
    };
  }, []);

  function resetCuisineMotion() {
    setCuisineSwipeOffset(0);
    setCuisineSwipeLift(0);
    setCuisineCardOpacity(1);
    setCuisineCardScale(1);
    setIsCuisineAnimating(false);
  }

  function resetRestaurantMotion() {
    setRestaurantSwipeOffset(0);
    setRestaurantSwipeLift(0);
    setRestaurantCardOpacity(1);
    setRestaurantCardScale(1);
    setIsRestaurantAnimating(false);
  }

  function beginRestaurantVoteStep() {
    setVotes({});
    setCurrentIndex(0);
    setMehLean("meh");
    resetRestaurantMotion();
    setStep("vote");
  }

  function completeCuisineVote(pref: CuisinePreference) {
    if (!cuisineCurrent) return;
    const nextPrefs = { ...cuisinePrefs, [cuisineCurrent]: pref };
    setCuisinePrefs(nextPrefs);

    if (cuisineIndex < HOT_CUISINES.length - 1) {
      setCuisineIndex((value) => value + 1);
    } else {
      setCuisineIndex(HOT_CUISINES.length);
      if (getFilteredRestaurants(nextPrefs).length > 0) {
        beginRestaurantVoteStep();
      }
    }

    resetCuisineMotion();
  }

  function queueCuisineVote(pref: CuisinePreference) {
    if (!cuisineCurrent || isCuisineAnimating) return;

    setIsCuisineAnimating(true);

    if (pref === "yes") {
      setCuisineSwipeOffset(220);
      setCuisineSwipeLift(-8);
      setCuisineCardScale(1.02);
      setCuisineCardOpacity(0);
    } else if (pref === "no") {
      setCuisineSwipeOffset(-220);
      setCuisineSwipeLift(-8);
      setCuisineCardScale(1.02);
      setCuisineCardOpacity(0);
    } else {
      setCuisineSwipeOffset(0);
      setCuisineSwipeLift(28);
      setCuisineCardScale(0.96);
      setCuisineCardOpacity(0);
    }

    if (cuisineCommitTimeoutRef.current) {
      clearTimeout(cuisineCommitTimeoutRef.current);
    }

    cuisineCommitTimeoutRef.current = setTimeout(() => {
      completeCuisineVote(pref);
    }, 180);
  }

  function resetCuisineDeck() {
    setCuisinePrefs({});
    setCuisineIndex(0);
    resetCuisineMotion();
  }

  function prevCuisine() {
    setCuisineIndex((value) => Math.max(0, value - 1));
  }

  function startFlow() {
    beginRestaurantVoteStep();
  }

  function completeRestaurantVote(vote: VoteChoice, lean: LeanChoice = "meh") {
    if (!current) return;
    setVotes((prev) => ({ ...prev, [current.id]: { vote, lean } }));
    setMehLean("meh");
    if (currentIndex >= filtered.length - 1) {
      resetRestaurantMotion();
      setStep("results");
      return;
    }
    setCurrentIndex((value) => value + 1);
    resetRestaurantMotion();
  }

  function queueRestaurantVote(vote: VoteChoice) {
    if (!current || isRestaurantAnimating) return;

    setIsRestaurantAnimating(true);

    if (vote === "yes") {
      setRestaurantSwipeOffset(220);
      setRestaurantSwipeLift(-8);
      setRestaurantCardScale(1.02);
      setRestaurantCardOpacity(0);
    } else if (vote === "no") {
      setRestaurantSwipeOffset(-220);
      setRestaurantSwipeLift(-8);
      setRestaurantCardScale(1.02);
      setRestaurantCardOpacity(0);
    } else {
      setRestaurantSwipeOffset(0);
      setRestaurantSwipeLift(34);
      setRestaurantCardScale(0.97);
      setRestaurantCardOpacity(0);
    }

    if (restaurantCommitTimeoutRef.current) {
      clearTimeout(restaurantCommitTimeoutRef.current);
    }

    restaurantCommitTimeoutRef.current = setTimeout(() => {
      completeRestaurantVote(vote, vote === "meh" ? mehLean : "meh");
    }, 180);
  }

  function restartAll() {
    setStep("prefs");
    setVotes({});
    setCurrentIndex(0);
    setMehLean("meh");
    resetCuisineDeck();
    resetRestaurantMotion();
  }

  function handleCuisinePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isCuisineAnimating) return;
    cuisineSwipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setCuisineSwipeOffset(0);
    setCuisineSwipeLift(0);
    setCuisineCardOpacity(1);
    setCuisineCardScale(1);
  }

  function handleCuisinePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!cuisineSwipeStartRef.current) return;
    const deltaX = event.clientX - cuisineSwipeStartRef.current.x;
    const deltaY = event.clientY - cuisineSwipeStartRef.current.y;

    if (deltaY > 0 && deltaY > Math.abs(deltaX)) {
      setCuisineSwipeOffset(0);
      setCuisineSwipeLift(Math.min(84, deltaY));
      return;
    }

    setCuisineSwipeOffset(Math.max(-72, Math.min(72, deltaX)));
    setCuisineSwipeLift(Math.abs(deltaX) > 24 ? -4 : 0);
  }

  function handleCuisinePointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!cuisineSwipeStartRef.current) return;

    const deltaX = event.clientX - cuisineSwipeStartRef.current.x;
    const deltaY = event.clientY - cuisineSwipeStartRef.current.y;

    cuisineSwipeStartRef.current = null;

    if (deltaY > 72 && deltaY > Math.abs(deltaX)) {
      queueCuisineVote("meh");
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
      queueCuisineVote(deltaX > 0 ? "yes" : "no");
      return;
    }

    resetCuisineMotion();
  }

  function handleCuisinePointerCancel() {
    cuisineSwipeStartRef.current = null;
    resetCuisineMotion();
  }

  function handleCuisineKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isCuisineAnimating) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      queueCuisineVote("no");
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      queueCuisineVote("yes");
      return;
    }

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      queueCuisineVote("meh");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      return;
    }
  }

  function handleRestaurantLeanChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value);
    if (value < 0) {
      setMehLean("lean-no");
      return;
    }

    if (value > 0) {
      setMehLean("lean-yes");
      return;
    }

    setMehLean("meh");
  }

  function handleRestaurantPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (isRestaurantAnimating) return;
    restaurantSwipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
    setRestaurantSwipeOffset(0);
    setRestaurantSwipeLift(0);
    setRestaurantCardOpacity(1);
    setRestaurantCardScale(1);
  }

  function handleRestaurantPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!restaurantSwipeStartRef.current) return;
    const deltaX = event.clientX - restaurantSwipeStartRef.current.x;
    const deltaY = event.clientY - restaurantSwipeStartRef.current.y;

    if (deltaY > 0 && deltaY > Math.abs(deltaX)) {
      setRestaurantSwipeOffset(0);
      setRestaurantSwipeLift(Math.min(84, deltaY));
      return;
    }

    setRestaurantSwipeOffset(Math.max(-72, Math.min(72, deltaX)));
    setRestaurantSwipeLift(Math.abs(deltaX) > 24 ? -4 : 0);
  }

  function handleRestaurantPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!restaurantSwipeStartRef.current) return;

    const deltaX = event.clientX - restaurantSwipeStartRef.current.x;
    const deltaY = event.clientY - restaurantSwipeStartRef.current.y;

    restaurantSwipeStartRef.current = null;

    if (deltaY > 72 && deltaY > Math.abs(deltaX)) {
      queueRestaurantVote("meh");
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
      queueRestaurantVote(deltaX > 0 ? "yes" : "no");
      return;
    }

    resetRestaurantMotion();
  }

  function handleRestaurantPointerCancel() {
    restaurantSwipeStartRef.current = null;
    resetRestaurantMotion();
  }

  function handleRestaurantKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (isRestaurantAnimating) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      queueRestaurantVote("no");
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      queueRestaurantVote("yes");
      return;
    }

    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " " || event.key.toLowerCase() === "m") {
      event.preventDefault();
      queueRestaurantVote("meh");
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
    }
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
                Hell&apos;s Kitchen
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">West 49th Street one-person flow for Hell&apos;s Kitchen dinner picks.</p>
            </div>
            <span className="rounded-[1rem] border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground">
              {RESTAURANTS_49TH_9TH.length} loaded
            </span>
          </div>

          <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
              Source: OpenStreetMap via Overpass around
              <span className="font-semibold text-foreground"> Hell&apos;s Kitchen, centered near West 49th St & 9th Ave </span>
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
                        <div
                          role="group"
                          aria-label={`Cuisine preference card for ${cuisineCurrent.replace("_", " ")}`}
                          tabIndex={0}
                          onPointerDown={handleCuisinePointerDown}
                          onPointerMove={handleCuisinePointerMove}
                          onPointerUp={handleCuisinePointerUp}
                          onPointerCancel={handleCuisinePointerCancel}
                          onKeyDown={handleCuisineKeyDown}
                          className="rounded-[1.2rem] border border-border bg-muted p-4 outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                          style={{
                            opacity: cuisineCardOpacity,
                            transform: `translate(${cuisineSwipeOffset}px, ${cuisineSwipeLift}px) rotate(${cuisineSwipeOffset / 16}deg) scale(${cuisineCardScale})`,
                            transition: isCuisineDragging ? "none" : "transform 180ms ease, opacity 180ms ease",
                            touchAction: "pan-y",
                          }}
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            <span className="rounded-full border border-border bg-card px-2.5 py-1">No</span>
                            <span>Swipe or use arrow keys</span>
                            <span className="rounded-full border border-[hsl(var(--highlight))/0.28] bg-accent px-2.5 py-1 text-accent-foreground">
                              Yes
                            </span>
                          </div>
                          <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Cuisine pass
                          </p>
                          <p className="mt-2 text-center text-2xl font-semibold text-foreground">
                            {cuisineCurrent.replace("_", " ")}
                          </p>
                          <p className="mt-2 text-center text-sm text-muted-foreground">
                            Left says no. Down or Enter marks meh. Right says yes.
                          </p>
                          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                            <div className="rounded-[0.95rem] border border-border bg-card px-3 py-2 text-center">
                              {cuisineNext ? `Up next: ${cuisineNext.replace("_", " ")}` : "Last cuisine"}
                            </div>
                            <div className="rounded-[0.95rem] border border-border bg-card px-3 py-2 text-center">
                              {cuisineDoneCount} of {HOT_CUISINES.length} marked
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          <button
                            onClick={() => queueCuisineVote("no")}
                            className="flex min-h-11 items-center justify-center gap-1 rounded-[0.85rem] border border-border bg-card text-xs font-semibold text-foreground"
                          >
                            <X className="h-4 w-4" />
                            No
                          </button>
                          <button
                            onClick={() => queueCuisineVote("meh")}
                            className="flex min-h-11 items-center justify-center gap-1 rounded-[0.85rem] border border-border bg-card text-xs font-semibold text-foreground"
                          >
                            <Meh className="h-4 w-4" />
                            Meh
                          </button>
                          <button
                            onClick={() => queueCuisineVote("yes")}
                            className="flex min-h-11 items-center justify-center gap-1 rounded-[0.85rem] border border-[hsl(var(--highlight))/0.35] bg-accent text-xs font-semibold text-accent-foreground"
                          >
                            <Check className="h-4 w-4" />
                            Yes
                          </button>
                        </div>
                      </>
                    ) : total > 0 ? (
                      <div className="rounded-[1rem] border border-border bg-muted p-4 text-sm text-muted-foreground">
                        Cuisine pass complete. Moving into restaurant voting keeps the flow tighter.
                      </div>
                    ) : (
                      <div className="rounded-[1rem] border border-border bg-muted p-4 text-sm text-muted-foreground">
                        Cuisine pass complete, but nothing is left in the restaurant pool. Reset or loosen filters.
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

                {cuisineDoneCount < HOT_CUISINES.length ? (
                  <div className="rounded-[1rem] border border-border bg-card p-3 text-sm text-muted-foreground">
                    Finish the cuisine pass and the restaurant deck will open automatically.
                  </div>
                ) : (
                  <button
                    onClick={startFlow}
                    className={`inline-flex min-h-12 w-full items-center justify-center rounded-[1rem] bg-foreground px-4 text-sm font-semibold text-background ${
                      filtered.length === 0 ? "pointer-events-none opacity-40" : ""
                    }`}
                  >
                    Jump into restaurant voting
                  </button>
                )}
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

                <div
                  role="group"
                  aria-label={`Restaurant vote card for ${current.name}`}
                  tabIndex={0}
                  onPointerDown={handleRestaurantPointerDown}
                  onPointerMove={handleRestaurantPointerMove}
                  onPointerUp={handleRestaurantPointerUp}
                  onPointerCancel={handleRestaurantPointerCancel}
                  onKeyDown={handleRestaurantKeyDown}
                  className="rounded-[1.2rem] border border-border bg-muted p-4 outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
                  style={{
                    opacity: restaurantCardOpacity,
                    transform: `translate(${restaurantSwipeOffset}px, ${restaurantSwipeLift}px) rotate(${restaurantSwipeOffset / 18}deg) scale(${restaurantCardScale})`,
                    transition: isRestaurantDragging ? "none" : "transform 180ms ease, opacity 180ms ease",
                    touchAction: "pan-y",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="rounded-full border border-danger/30 bg-danger/10 px-2.5 py-1 text-danger">No</span>
                    <span>Swipe card or use arrow keys</span>
                    <span className="rounded-full border border-[hsl(var(--highlight))/0.28] bg-accent px-2.5 py-1 text-accent-foreground">
                      Yes
                    </span>
                  </div>
                  <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Restaurant pass
                  </p>
                  <p className="mt-2 text-center text-2xl font-semibold text-foreground">{current.name}</p>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    Swipe down or hit `M` for meh. Up arrow is intentionally unused.
                  </p>
                </div>

                <div className="rounded-[1rem] border border-border bg-card p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">Meh bias</p>
                    <p className="text-sm font-medium text-muted-foreground">{mehLean === "lean-no" ? "Lean no" : mehLean === "lean-yes" ? "Lean yes" : "Plain meh"}</p>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={1}
                    value={mehLeanValue}
                    onChange={handleRestaurantLeanChange}
                    className="mt-3 h-8 w-full accent-foreground"
                    aria-label="Meh bias"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    <span>Lean no</span>
                    <span>Meh</span>
                    <span>Lean yes</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => queueRestaurantVote("no")}
                    className="flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border border-danger/30 bg-danger/10 text-foreground"
                  >
                    <X className="h-5 w-5" />
                    <span className="mt-1 text-xs font-semibold">No</span>
                  </button>
                  <button
                    onClick={() => queueRestaurantVote("meh")}
                    className="flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] border border-border bg-muted text-foreground"
                  >
                    <Meh className="h-5 w-5" />
                    <span className="mt-1 text-xs font-semibold">Meh</span>
                  </button>
                  <button
                    onClick={() => queueRestaurantVote("yes")}
                    className="flex min-h-14 flex-col items-center justify-center rounded-[1.1rem] bg-foreground text-background"
                  >
                    <Check className="h-5 w-5" />
                    <span className="mt-1 text-xs font-semibold">Yes</span>
                  </button>
                </div>

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
                        ? `https://maps.apple.com/?q=${encodeURIComponent(winner.name + " Hell's Kitchen NYC")}`
                        : "https://maps.apple.com/?q=Hell's+Kitchen+NYC+restaurants"
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

          <div className="grid grid-cols-1 gap-3">
            <ButtonLink href="/mock/mobile-preview" variant="ghost" className="w-full">
              Back to preview
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
