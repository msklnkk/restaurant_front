import React, { useState, useEffect } from 'react';
import { staffService } from '../../services/staffService.ts';
import { Staff } from '../../types/reference.types.ts';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Alert
} from '@mui/material';
import { BaseTable } from './BaseTable.tsx';

export const StaffTable: React.FC = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Partial<Staff>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { field: 'staffid' as keyof Staff, label: 'ID' },
    { field: 'name' as keyof Staff, label: 'ФИО' },
    { field: 'job_title' as keyof Staff, label: 'Должность' },
    { field: 'date_of_hire' as keyof Staff, label: 'Дата найма' },
    { 
      field: 'salary' as keyof Staff, 
      label: 'Зарплата',
      format: (value: any) => {
        // Преобразуем научную нотацию в обычное число
        const num = Number(value);
        if (isNaN(num)) return '';
        return new Intl.NumberFormat('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          maximumFractionDigits: 0
        }).format(num);
      }
    },
    { 
      field: 'contact_info' as keyof Staff, 
      label: 'Контактная информация',
      format: (value: any) => {
        if (!value) return '';
        // Форматируем телефон
        const cleaned = String(value).replace(/\D/g, '');
        if (cleaned.length === 10) {
          return `+7 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,8)}-${cleaned.slice(8)}`;
        }
        if (cleaned.length === 11) {
          return `+${cleaned[0]} (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7,9)}-${cleaned.slice(9)}`;
        }
        return value;
      }
    }
  ];

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err: any) {
      console.error('Error fetching staff:', err);
      setError('Ошибка при загрузке данных персонала');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = () => {
    setCurrentStaff({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (employee: Staff) => {
    setCurrentStaff(employee);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (employee: Staff) => {
    if (window.confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      try {
        setError(null);
        await staffService.delete(employee.staffid);
        setStaff(staff.filter(s => s.staffid !== employee.staffid));
      } catch (err: any) {
        console.error('Error deleting staff:', err);
        setError('Ошибка при удалении сотрудника');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (isEditing && currentStaff.staffid) {
        await staffService.update(currentStaff.staffid, currentStaff);
      } else {
        await staffService.create(currentStaff as Omit<Staff, 'staffid'>);
      }
      setOpenDialog(false);
      await fetchStaff();
    } catch (err: any) {
      console.error('Error saving staff:', err);
      setError('Ошибка при сохранении данных сотрудника');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentStaff(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <BaseTable<Staff>
        data={staff}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="ФИО"
              name="name"
              value={currentStaff.name || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Должность"
              name="job_title"
              value={currentStaff.job_title || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Дата найма"
              name="date_of_hire"
              type="date"
              value={currentStaff.date_of_hire || ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              fullWidth
              label="Зарплата"
              name="salary"
              type="number"
              value={currentStaff.salary || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Контактная информация"
              name="contact_info"
              value={currentStaff.contact_info || ''}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={2}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
            <Button type="submit" variant="contained">
              {isEditing ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};