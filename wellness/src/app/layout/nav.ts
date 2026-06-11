import { Home, Dumbbell, Cigarette, Apple, Moon, Activity, BookOpen, BarChart3, User } from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  color: string;
  primary?: boolean; // shown in mobile bottom nav
}

export const NAV: NavItem[] = [
  { to: "/", label: "בית", icon: Home, color: "hsl(var(--cyan))", primary: true },
  { to: "/training", label: "אימון", icon: Dumbbell, color: "hsl(var(--primary))", primary: true },
  { to: "/cessation", label: "גמילה", icon: Cigarette, color: "hsl(var(--heal))", primary: true },
  { to: "/nutrition", label: "תזונה", icon: Apple, color: "hsl(var(--warn))", primary: true },
  { to: "/sleep", label: "שינה", icon: Moon, color: "hsl(var(--indigo))" },
  { to: "/mobility", label: "מוביליטי ויוגה", icon: Activity, color: "hsl(var(--cyan))" },
  { to: "/review", label: "סקירה שבועית", icon: BarChart3, color: "hsl(var(--primary))" },
  { to: "/library", label: "ספרייה", icon: BookOpen, color: "hsl(var(--indigo))" },
  { to: "/profile", label: "פרופיל", icon: User, color: "hsl(var(--muted-foreground))", primary: true },
];
