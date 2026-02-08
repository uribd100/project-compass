import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Project } from '@/types/project';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BudgetModal } from '@/components/modals/BudgetModal';
import { ConfirmDialog } from '@/components/modals/ConfirmDialog';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { Plus, Download, TrendingUp, TrendingDown, Trash2, Edit2 } from 'lucide-react';

export default function ProjectBudget() {
  const { project } = useOutletContext<{ project: Project }>();
  const { getProjectBudget, deleteBudgetItem } = useProjectData();
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const budgetCategories = getProjectBudget(project.id);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalPlanned = budgetCategories.reduce((sum, c) => sum + c.planned, 0);
  const totalActual = budgetCategories.reduce((sum, c) => sum + c.actual, 0);

  const handleDeleteConfirm = () => {
    if (deletingItemId) {
      deleteBudgetItem(deletingItemId);
      setDeletingItemId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">ניהול תקציב</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            ייצוא דו״ח
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => {
              setEditingItem(null);
              setShowBudgetModal(true);
            }}
          >
            <Plus className="h-4 w-4" />
            הוצאה חדשה
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">תקציב מתוכנן</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPlanned)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">הוצאות בפועל</p>
          <p className="text-2xl font-bold text-foreground">{formatCurrency(totalActual)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">יתרה</p>
          <p className="text-2xl font-bold text-success">{formatCurrency(totalPlanned - totalActual)}</p>
        </Card>
      </div>

      {/* Budget Breakdown */}
      {budgetCategories.length > 0 ? (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">פירוט לפי קטגוריות</h3>
          <div className="space-y-4">
            {budgetCategories.map((category) => {
              const percent = category.planned > 0 ? (category.actual / category.planned) * 100 : 0;
              const isOver = percent > 100;
              return (
                <div key={category.id} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(category.actual)} / {formatCurrency(category.planned)}
                      </span>
                      {isOver ? (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-success" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setEditingItem(category);
                          setShowBudgetModal(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                        onClick={() => setDeletingItemId(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={Math.min(percent, 100)} className="h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">אין סעיפי תקציב עדיין</p>
          <Button onClick={() => setShowBudgetModal(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            הוסף סעיף ראשון
          </Button>
        </Card>
      )}

      <BudgetModal
        open={showBudgetModal}
        onOpenChange={setShowBudgetModal}
        projectId={project.id}
        budgetItem={editingItem}
      />

      <ConfirmDialog
        open={!!deletingItemId}
        onOpenChange={() => setDeletingItemId(null)}
        title="מחיקת סעיף תקציב"
        description="האם אתה בטוח שברצונך למחוק סעיף זה? פעולה זו אינה ניתנת לביטול."
        confirmLabel="מחק"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
