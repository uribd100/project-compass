import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BlueprintLoop } from '@/components/BlueprintLoop';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function Demo() {
  const [showOverlays, setShowOverlays] = useState(true);
  const [dimmed, setDimmed] = useState(false);

  return (
    <div className="fixed inset-0 bg-black">
      <BlueprintLoop dimmed={dimmed} hideOverlays={!showOverlays} />

      {/* Top bar with controls */}
      <div className="absolute top-0 inset-x-0 z-10 p-4 flex items-center justify-between">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-4 py-2">
          <div className="text-white/60 text-xs">Project Compass</div>
          <div className="text-white text-sm font-semibold">סרטון רקע למערכת</div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            onClick={() => setDimmed((d) => !d)}
          >
            {dimmed ? 'מלא' : 'עמום'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
            onClick={() => setShowOverlays((s) => !s)}
          >
            {showOverlays ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showOverlays ? 'הסתר ווידג׳טים' : 'הצג ווידג׳טים'}
          </Button>
          <Link to="/dashboard">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2"
            >
              חזרה לדשבורד
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-4 inset-x-0 z-10 flex justify-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 text-white/70 text-xs">
          לופ אינסופי · משך מחזור 24 שניות · SVG + CSS, ללא קובץ וידאו
        </div>
      </div>
    </div>
  );
}
