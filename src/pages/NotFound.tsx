import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MainLayout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold text-foreground">404</h1>
          <p className="text-xl text-muted-foreground">הדף המבוקש לא נמצא</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            ייתכן שהקישור שגוי או שהדף הוסר מהמערכת.
          </p>
          <Link to="/dashboard">
            <Button className="mt-4 gap-2">
              <Home className="h-4 w-4" />
              חזרה ללוח הבקרה
            </Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
