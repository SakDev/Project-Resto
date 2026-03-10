import { ArrowLeft, MapPin, SlidersHorizontal, Users2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const quickPrefs = [
  "Open now",
  "Casual",
  "Vegetarian-friendly",
  "Cheap eats",
  "Reservations",
  "Drinks",
];

export default function NewRoomPage() {
  return (
    <main className="bg-shell">
      <section className="safe-px safe-pt safe-pb mx-auto min-h-screen max-w-md py-4 sm:max-w-xl lg:max-w-4xl lg:py-8">
        <div className="space-y-4">
          <ButtonLink href="/" variant="ghost" className="w-fit gap-2 pl-3 pr-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </ButtonLink>

          <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="border-b border-border bg-muted px-5 py-4 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Host setup
              </p>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">
                    Start the room without turning it into a form.
                  </h1>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                    The host should set context in a few taps: where, how far, and what kind of night this is.
                  </p>
                </div>
                <div className="hidden rounded-[1.1rem] border border-border bg-soft-accent px-3 py-2 text-sm font-semibold text-accent-foreground sm:block">
                  3 quick steps
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <MapPin className="h-4 w-4" />
                    Neighborhood
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">West Village</p>
                </div>
                <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <SlidersHorizontal className="h-4 w-4" />
                    Radius
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">1.5 miles</p>
                </div>
                <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Users2 className="h-4 w-4" />
                    Group
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">4 hungry people</p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                Step one preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 p-5">
              <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Room title
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">Friday dinner list</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">Budget</span>
                  <span className="text-muted-foreground">Any price</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {["$", "$$", "$$$", "Any"].map((option, index) => (
                    <button
                      key={option}
                      className={`min-h-12 rounded-[1rem] border text-sm font-semibold ${
                        index === 3
                          ? "border-foreground bg-foreground text-white"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">Filters</span>
                  <span className="text-muted-foreground">Tap to toggle</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPrefs.map((pref, index) => (
                    <button
                      key={pref}
                      className={`min-h-11 rounded-full border px-4 text-sm font-medium ${
                        index < 2
                          ? "border-[hsl(var(--highlight))] bg-accent text-accent-foreground"
                          : "border-border bg-card text-foreground"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-0 safe-pb pt-2">
            <div className="rounded-[1.5rem] border border-border bg-background/96 p-3 backdrop-blur">
              <div className="grid grid-cols-2 gap-3">
                <ButtonLink href="/" variant="secondary" className="w-full">
                  Save draft
                </ButtonLink>
                <ButtonLink href="/join/demo-room" className="w-full">
                  Create room
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
