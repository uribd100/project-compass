import { useState } from "react";
import { toast } from "sonner";
import { Droplets, Plus, Check, X, Apple } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { todayISO } from "@/lib/utils";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Slider } from "@/components/ui/slider";
import { ProgressRing } from "@/components/common/ProgressRing";
import { ResourceList } from "@/components/common/ResourceList";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { resourcesFor } from "@/lib/content";
import { GOUT_AVOID, GOUT_FAVOR, hydrationTargetMl } from "@/lib/health/gout";

export default function Nutrition() {
  const app = useApp();
  const { profile } = app;
  const today = todayISO();
  const hyd = app.hydration.filter((h) => h.date === today).reduce((s, h) => s + h.ml, 0);
  const target = hydrationTargetMl(profile?.weight_kg ?? 85);
  const mealsToday = app.meals.filter((m) => m.date === today);

  return (
    <div className="space-y-6">
      <PageHeader tag="03 · תזונה" title="אוכל שמרפא את הלב">
        ים-תיכוני להורדת LDL, מותאם לגאוט.
      </PageHeader>

      {/* hydration */}
      <section className="px-5">
        <Card className="flex items-center gap-4">
          <ProgressRing value={hyd} max={target} color="hsl(var(--cyan))" label={`${(hyd / 1000).toFixed(1)}`} sub={`/${(target / 1000).toFixed(1)} ל׳`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 font-bold"><Droplets className="h-4 w-4 text-cyan" /> מים היום</div>
            <p className="text-sm text-muted-foreground">יעד מוגבר לבריאות הלב והכליות.</p>
            <div className="mt-2 flex gap-2">
              {[250, 500, 750].map((ml) => (
                <button key={ml} onClick={() => app.addHydration(ml)} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold hover:bg-muted">+{ml}</button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* meals */}
      <section className="px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold">הארוחות של היום</h2>
          <MealSheet>
            <Button size="sm"><Plus className="h-4 w-4" /> תיעוד</Button>
          </MealSheet>
        </div>
        {mealsToday.length === 0 ? (
          <Card className="text-sm text-muted-foreground">עוד לא תיעדת ארוחה. יעד: לעבור בהדרגה מ-{profile?.meals_per_day ?? 2} ל-3 ארוחות מסודרות.</Card>
        ) : (
          <div className="space-y-2">
            {mealsToday.map((m) => (
              <Card key={m.id} className="flex items-center gap-3 py-3">
                <Apple className="h-5 w-5 text-warn" />
                <div className="flex-1"><div className="font-semibold">{m.description}</div><div className="text-xs text-muted-foreground">איכות {m.quality}/5 · {m.gout_safe ? "ידידותי לגאוט ✓" : "שים לב לגאוט"}</div></div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* gout guide */}
      <section className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2">
        <Card>
          <h3 className="mb-2 flex items-center gap-2 font-bold text-heal"><Check className="h-4 w-4" /> מומלץ (גאוט + לב)</h3>
          <ul className="space-y-1 text-sm text-foreground/80">{GOUT_FAVOR.map((g, i) => <li key={i}>• {g}</li>)}</ul>
        </Card>
        <Card>
          <h3 className="mb-2 flex items-center gap-2 font-bold text-coral"><X className="h-4 w-4" /> להימנע</h3>
          <ul className="space-y-1 text-sm text-foreground/80">{GOUT_AVOID.map((g, i) => <li key={i}>• {g}</li>)}</ul>
        </Card>
      </section>

      <section className="px-5"><ResourceList items={resourcesFor("nutrition")} /></section>
    </div>
  );
}

function MealSheet({ children }: { children: React.ReactNode }) {
  const { addMeal, setDayAction } = useApp();
  const [open, setOpen] = useState(false);
  const [desc, setDesc] = useState("");
  const [quality, setQuality] = useState(3);
  const [goutSafe, setGoutSafe] = useState(true);
  const [type, setType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("lunch");

  async function save() {
    if (!desc.trim()) return;
    await addMeal({ date: todayISO(), meal_type: type, description: desc, quality, gout_safe: goutSafe });
    await setDayAction(todayISO(), "nutrition", true);
    toast.success("הארוחה תועדה 🍽️");
    setOpen(false); setDesc(""); setQuality(3);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent title="תיעוד ארוחה">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {([["breakfast", "בוקר"], ["lunch", "צהריים"], ["dinner", "ערב"], ["snack", "נשנוש"]] as const).map(([v, l]) => (
              <button key={v} onClick={() => setType(v)} className={`pill border ${type === v ? "border-cyan bg-cyan/15 text-cyan" : "border-border bg-secondary/30"}`}>{l}</button>
            ))}
          </div>
          <Field label="מה אכלת?"><Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="למשל: סלט עם דג, קינואה ושמן זית" /></Field>
          <div>
            <h4 className="mb-2 font-bold">איכות: <span className="text-cyan">{quality}/5</span></h4>
            <Slider min={1} max={5} step={1} value={[quality]} onValueChange={(v) => setQuality(v[0])} />
          </div>
          <label className="flex items-center justify-between rounded-lg bg-secondary/30 p-3 text-sm">
            <span>ידידותי לגאוט? (ללא בשר אדום/אלכוהול/פרוקטוז)</span>
            <input type="checkbox" checked={goutSafe} onChange={(e) => setGoutSafe(e.target.checked)} className="h-5 w-5 accent-[hsl(var(--heal))]" />
          </label>
          <Button className="w-full" size="lg" onClick={save}>שמור</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
