import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project, FileAttachment } from '@/types/project';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileUploadModal } from '@/components/modals/FileUploadModal';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Upload, FolderPlus, FileText, Image, FileSpreadsheet, File, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  image: Image,
  excel: FileSpreadsheet,
  cad: File,
  word: FileText,
  file: File,
};

export default function ProjectFiles() {
  const { project } = useOutletContext<{ project: Project }>();
  const { files, deleteFile } = useProjectData();
  
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDeleteConfirm = () => {
    if (deletingFileId) {
      deleteFile(deletingFileId);
      setDeletingFileId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">קבצים ומסמכים</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FolderPlus className="h-4 w-4" />
            תיקיה חדשה
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-4 w-4" />
            העלאת קובץ
          </Button>
        </div>
      </div>

      {files.length > 0 ? (
        <Card className="divide-y divide-border">
          {files.map((file) => {
            const Icon = fileIcons[file.type] || File;
            return (
              <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {file.folder} • {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('he-IL')}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => setDeletingFileId(file.id)}
                    >
                      <Trash2 className="h-4 w-4 ml-2" />
                      מחק
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          })}
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">אין קבצים עדיין</p>
          <Button onClick={() => setShowUploadModal(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            העלה קובץ ראשון
          </Button>
        </Card>
      )}

      <FileUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        projectId={project.id}
      />

      <ConfirmDialog
        open={!!deletingFileId}
        onOpenChange={() => setDeletingFileId(null)}
        title="מחיקת קובץ"
        description="האם אתה בטוח שברצונך למחוק קובץ זה? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
