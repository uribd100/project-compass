import { toast } from "sonner";
import { Pill, Calendar, Cloud, Bell, HeartPulse, Check } from "lucide-react";
import { useApp } from "@/app/providers/AppData";
import { PageHeader } from "@/app/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { SafetyDisclaimer } from "@/components/safety/SafetyDisclaimer";
import { supabaseEnabled } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export default function Profile() {
  const app = useApp();
  const { profile, settings } = app;
  if (!profile) return null;

  const upcoming = [...app.appointments].filter((a) => !a.done).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6">
      <PageHeader tag="פרופיל" title="הפרופיל שלך" />

      {/* identity */}
      <section className="px-5">
        <Card className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="שם"><Input value={profile.display_name} onChange={(e) => app.saveProfile({ ...profile, display_name: e.target.value })} /></Field>
            <Field label="משקל (ק״ג)"><Input type="number" value={profile.weight_kg} onChange={(e) => app.saveProfile({ ...profile, weight_kg: +e.target.value })} /></Field>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.post_mi && <Badge tone="cyan"><HeartPulse className="h-3 w-3" /> אירוע לב{profile.mi_date ? ` ${profile.mi_date}` : ""}{profile.lvef ? ` · EF ${profile.lvef}%` : ""}</Badge>}
            {profile.cardiologist_clearance && <Badge tone="heal">אישור קרדיולוג ✓</Badge>}
            {profile.conditions.includes("gout") && <Badge tone="warn">גאוט</Badge>}
            {profile.ldl != null && <Badge tone="coral">LDL {profile.ldl} → {profile.ldl_target}</Badge>}
          </div>
        </Card>
      </section>

      {/* medications */}
      <section className="px-5">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-bold"><Pill className="h-4 w-4 text-cyan" /> תרופות קבועות</h3>
          <ul className="space-y-2">
            {profile.medications.map((m, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg bg-secondary/30 p-2.5 text-sm">
                <span className="font-semibold">{m.name}</span>
                <span className="text-muted-foreground">{m.dose} · {m.schedule}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* appointments */}
      <section className="px-5">
        <Card>
          <h3 className="mb-3 flex items-center gap-2 font-bold"><Calendar className="h-4 w-4 text-indigo" /> תורים ותזכורות</h3>
          {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">אין תורים פתוחים.</p> : (
            <ul className="space-y-2">
              {upcoming.map((a) => (
                <li key={a.id} className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2.5 text-sm">
                  <button onClick={() => app.toggleAppointment(a.id)} className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted">
                    {a.done && <Check className="h-3.5 w-3.5 text-heal" />}
                  </button>
                  <div className="flex-1"><div className="font-semibold">{a.title}</div><div className="text-xs text-muted-foreground">{format(parseISO(a.date), "dd/MM/yyyy")}</div></div>
                  {a.kind === "medication" && <Badge tone="cyan">תרופה</Badge>}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      {/* settings */}
      <section className="px-5">
        <Card className="space-y-3">
          <h3 className="font-bold">הגדרות</h3>
          <Row icon={<Bell className="h-4 w-4 text-warn" />} label="תזכורות והתראות"
            on={settings.reminders_enabled}
            onChange={async (v) => {
              if (v && "Notification" in window) { try { await Notification.requestPermission(); } catch {} }
              app.saveSettings({ ...settings, reminders_enabled: v });
            }} />
          <Row icon={<Cloud className="h-4 w-4 text-cyan" />} label={`סנכרון לענן ${supabaseEnabled ? "" : "(לא מוגדר)"}`}
            on={settings.cloud_sync && supabaseEnabled}
            disabled={!supabaseEnabled}
            onChange={(v) => app.saveSettings({ ...settings, cloud_sync: v })} />
          {!supabaseEnabled && (
            <p className="rounded-lg bg-secondary/30 p-2.5 text-xs text-muted-foreground">
              כדי להפעיל סנכרון בין הטלפון למחשב: צור פרויקט Supabase חינמי והזן את המפתחות בקובץ .env (ראה הוראות ב-supabase/README.md). עד אז — כל הנתונים נשמרים מקומית במכשיר.
            </p>
          )}
        </Card>
      </section>

      <div className="px-5"><SafetyDisclaimer /></div>
      <div className="px-5 pb-4 text-center text-xs text-muted-foreground">מצפן בריאות · נבנה אישית לאורי · v0.1</div>
    </div>
  );
}

function Row({ icon, label, on, onChange, disabled }: { icon: React.ReactNode; label: string; on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-sm font-semibold">{icon}{label}</span>
      <Switch checked={on} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
