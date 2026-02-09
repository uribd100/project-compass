import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjectData } from '@/contexts/ProjectDataContext';
import { BudgetItem } from '@/types/project';

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  budgetItem?: BudgetItem | null;
}

const categories = [
  { value: 'planning', label: 'תכנון ופיקוח' },
  { value: 'construction', label: 'בנייה וקונסטרוקציה' },
  { value: 'electrical', label: 'מערכות חשמל' },
  { value: 'plumbing', label: 'אינסטלציה' },
  { value: 'finishing', label: 'גמר ופיתוח' },
  { value: 'materials', label: 'חומרים' },
  { value: 'equipment', label: 'ציוד' },
  { value: 'labor', label: 'עבודה' },
  { value: 'other', label: 'אחר' },
];

export function BudgetModal({ open, onOpenChange, projectId, budgetItem }: BudgetModalProps) {
  const { createBudgetItem, updateBudgetItem } = useProjectData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!budgetItem;
  
  const [formData, setFormData] = useState({
    name: budgetItem?.name || '',
    description: budgetItem?.description || '',
    category: budgetItem?.category || 'other',
    planned: budgetItem?.planned?.toString() || '',
    actual: budgetItem?.actual?.toString() || '0',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.planned) return;
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && budgetItem) {
        updateBudgetItem(budgetItem.id, {
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category,
          planned: Number(formData.planned),
          actual: Number(formData.actual) || 0,
        });
      } else {
        createBudgetItem({
          projectId,
          name: formData.name,
          description: formData.description || undefined,
          category: formData.category,
          planned: Number(formData.planned),
          actual: Number(formData.actual) || 0,
          status: 'planned',
        });
      }
      
      onOpenChange(false);
      setFormData({
        name: '',
        description: '',
        category: 'other',
        planned: '',
        actual: '0',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'עריכת סעיף תקציב' : 'הוצאה חדשה'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'ערוך את פרטי סעיף התקציב' : 'הוסף סעיף תקציב חדש לפרויקט'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם הסעיף *</Label>
            <Input
              id="name"
              placeholder="לדוגמה: עבודות חשמל קומה 3"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              placeholder="פרטים נוספים..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">קטגוריה</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planned">סכום מתוכנן (₪) *</Label>
              <Input
                id="planned"
                type="number"
                placeholder="0"
                value={formData.planned}
                onChange={(e) => setFormData(prev => ({ ...prev, planned: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actual">הוצאה בפועל (₪)</Label>
              <Input
                id="actual"
                type="number"
                placeholder="0"
                value={formData.actual}
                onChange={(e) => setFormData(prev => ({ ...prev, actual: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim() || !formData.planned}>
              {isSubmitting ? 'שומר...' : isEditing ? 'שמור שינויים' : 'הוסף סעיף'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
