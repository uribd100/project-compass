import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AppDataProvider, useApp } from "@/app/providers/AppData";
import { AppShell } from "@/app/layout/AppShell";
import Onboarding from "@/pages/Onboarding";
import Home from "@/pages/Home";
import Training from "@/pages/Training";
import Cessation from "@/pages/Cessation";
import Nutrition from "@/pages/Nutrition";
import Sleep from "@/pages/Sleep";
import Mobility from "@/pages/Mobility";
import Review from "@/pages/Review";
import Library from "@/pages/Library";
import Profile from "@/pages/Profile";

function Gate() {
  const { ready, profile } = useApp();
  if (!ready) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan border-t-transparent" />
      </div>
    );
  }
  const onboarded = profile?.onboarding_complete;

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      {!onboarded ? (
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      ) : (
        <Route
          path="*"
          element={
            <AppShell>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/training" element={<Training />} />
                <Route path="/cessation" element={<Cessation />} />
                <Route path="/nutrition" element={<Nutrition />} />
                <Route path="/sleep" element={<Sleep />} />
                <Route path="/mobility" element={<Mobility />} />
                <Route path="/review" element={<Review />} />
                <Route path="/library" element={<Library />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          }
        />
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <HashRouter>
        <Gate />
        <Toaster position="top-center" theme="dark" richColors toastOptions={{ style: { fontFamily: "Rubik" } }} />
      </HashRouter>
    </AppDataProvider>
  );
}
