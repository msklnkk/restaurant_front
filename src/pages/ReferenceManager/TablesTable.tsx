import React, { useState, useEffect } from 'react';
import { BaseTable } from './BaseTable.tsx';
import { RestTable } from '../../types/reference.types.ts';
import { tableService } from '../../services/tableService.ts';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export const TablesTable: React.FC = () => {
  const [tables, setTables] = useState<RestTable[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTable, setCurrentTable] = useState<Partial<RestTable>>({});
  const [isEditing, setIsEditing] = useState(false);

  const columns = [
    { field: 'tableid' as keyof RestTable, label: 'ID' },
    { 
      field: 'capacity' as keyof RestTable, 
      label: 'Вместимость',
      format: (value: number) => `${value} мест`
    },
    { field: 'location' as keyof RestTable, label: 'Расположение' }
  ];

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await tableService.getAll();
      setTables(data);
    } catch (error) {
      console.error('Ошибка при загрузке столов:', error);
    }
  };

  const handleAdd = () => {
    setCurrentTable({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (table: RestTable) => {
    setCurrentTable(table);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (table: RestTable) => {
    if (window.confirm('Вы уверены, что хотите удалить этот стол?')) {
      try {
        await tableService.delete(table.tableid);
        await fetchTables();
      } catch (error) {
        console.error('Ошибка при удалении стола:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Преобразуем capacity в число перед отправкой
      const tableData = {
        ...currentTable,
        capacity: currentTable.capacity ? Number(currentTable.capacity) : undefined
      };

      if (isEditing && currentTable.tableid) {
        await tableService.update(currentTable.tableid, tableData);
      } else {
        await tableService.create(tableData as Omit<RestTable, 'tableid'>);
      }
      setOpenDialog(false);
      await fetchTables();
    } catch (error) {
      console.error('Ошибка при сохранении стола:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentTable(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? (value === '' ? '' : Number(value)) : value 
    }));
  };

  return (
    <>
      <BaseTable<RestTable>
        data={tables}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
        <DialogTitle>
            {isEditing ? 'Редактировать стол' : 'Добавить стол'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Вместимость"
              name="capacity"
              type="number"
              value={currentTable.capacity || ''}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Расположение"
              name="location"
              value={currentTable.location || ''}
              onChange={handleChange}
              margin="normal"
              required
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