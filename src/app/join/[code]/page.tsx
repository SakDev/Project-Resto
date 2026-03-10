import { ArrowLeft, Check, Clock3, Users } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type JoinPageProps = {
  params: Promise<{ code: string }>;
};

export default async function JoinRoomPage({ params }: JoinPageProps) {
  const { code } = await params;

  return (
    <main className="bg-shell">
      <section className="safe-px safe-pt safe-pb mx-auto flex min-h-screen max-w-md flex-col justify-between py-4 sm:max-w-xl">
        <div className="space-y-4">
          <ButtonLink href="/" variant="ghost" className="w-fit gap-2 pl-3 pr-4">
            <ArrowLeft className="h-4 w-4" />
            Back
          </ButtonLink>

          <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="border-b border-border bg-muted px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Invite link
              </p>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-foreground">
                  Join room {code.toUpperCase()}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                  This step should feel closer to joining a shared list than entering a lobby. Confirm the room, add a
                  name, and move straight into voting.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-border bg-[hsl(var(--surface-strong))] p-4 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/65">Room details</p>
                    <p className="mt-2 text-lg font-semibold">Casual dinner, low debate.</p>
                  </div>
                  <Users className="h-5 w-5 text-white/75" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-[1.1rem] bg-white/10 p-3">
                    <p className="text-white/60">Players</p>
                    <p className="mt-1 font-semibold text-white">4 active</p>
                  </div>
                  <div className="rounded-[1.1rem] bg-white/10 p-3">
                    <p className="text-white/60">Mode</p>
                    <p className="mt-1 font-semibold text-white">Strict veto</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="text-base uppercase tracking-[0.18em] text-muted-foreground">
                Join preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="rounded-[1.35rem] border border-border bg-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Display name
                </p>
                <p className="mt-2 text-lg font-semibold text-foreground">Saketh</p>
              </div>

              <div className="rounded-[1.35rem] border border-[hsl(var(--highlight))/0.28] bg-accent p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-white p-2 text-[hsl(var(--highlight))]">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Room code recognized</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      Joining should survive shaky cellular connections and duplicate taps without dead ends.
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4 text-foreground" />
                  Typical join time: under 10 seconds
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="sticky bottom-0 safe-pb pt-2">
          <div className="rounded-[1.5rem] border border-border bg-background/96 p-3 backdrop-blur">
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/" variant="secondary" className="w-full">
                Change link
              </ButtonLink>
              <ButtonLink href="/mock/mobile-preview" className="w-full">
                Join room
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
