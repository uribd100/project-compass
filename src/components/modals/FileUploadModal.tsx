import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Upload, File, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

const folders = [
  { value: 'תוכניות', label: 'תוכניות' },
  { value: 'דוחות', label: 'דוחות' },
  { value: 'הדמיות', label: 'הדמיות' },
  { value: 'תחשיבים', label: 'תחשיבים' },
  { value: 'פרוטוקולים', label: 'פרוטוקולים' },
  { value: 'חוזים', label: 'חוזים' },
  { value: 'אחר', label: 'אחר' },
];

export function FileUploadModal({ open, onOpenChange, projectId }: FileUploadModalProps) {
  const { uploadFile } = useProjectData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folder, setFolder] = useState('אחר');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const getFileType = (file: File): string => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['xlsx', 'xls'].includes(ext || '')) return 'excel';
    if (['doc', 'docx'].includes(ext || '')) return 'word';
    if (['dwg', 'dxf'].includes(ext || '')) return 'cad';
    return 'file';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) return;
    
    setIsSubmitting(true);
    
    try {
      // Create a fake URL for demo purposes
      // In a real app, this would upload to storage
      const fakeUrl = URL.createObjectURL(selectedFile);
      
      uploadFile({
        name: selectedFile.name,
        type: getFileType(selectedFile),
        size: selectedFile.size,
        url: fakeUrl,
        folder,
        tags: [],
      });
      
      onOpenChange(false);
      setSelectedFile(null);
      setFolder('אחר');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>העלאת קובץ</DialogTitle>
          <DialogDescription>
            בחר קובץ להעלאה לפרויקט
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
              selectedFile && 'border-success bg-success/5'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            
            {selectedFile ? (
              <div className="flex items-center justify-center gap-3">
                <File className="h-8 w-8 text-success" />
                <div className="text-right">
                  <p className="font-medium text-foreground">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-foreground font-medium">גרור קובץ לכאן או לחץ לבחירה</p>
                <p className="text-sm text-muted-foreground mt-1">PDF, תמונות, Excel, CAD ועוד</p>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="folder">תיקייה</Label>
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {folders.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? 'מעלה...' : 'העלה קובץ'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
