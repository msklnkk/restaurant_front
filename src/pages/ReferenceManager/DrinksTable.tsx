import React, { useState, useEffect } from 'react';
import { BaseTable } from './BaseTable.tsx';
import { Drink } from '../../types/reference.types.ts';
import { drinksService } from '../../services/drinksService.ts';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export const DrinksTable: React.FC = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDrink, setCurrentDrink] = useState<Partial<Drink>>({});
  const [isEditing, setIsEditing] = useState(false);

  const columns = [
    { field: 'drinkid' as keyof Drink, label: 'ID' },
    { field: 'name' as keyof Drink, label: 'Название' }
  ];

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const data = await drinksService.getAll();
      setDrinks(data);
    } catch (error) {
      console.error('Ошибка при загрузке напитков:', error);
    }
  };

  const handleAdd = () => {
    setCurrentDrink({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (drink: Drink) => {
    setCurrentDrink(drink);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (drink: Drink) => {
    if (window.confirm('Вы уверены, что хотите удалить этот напиток?')) {
      try {
        await drinksService.delete(drink.drinkid);
        await fetchDrinks();
      } catch (error) {
        console.error('Ошибка при удалении напитка:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentDrink.drinkid) {
        await drinksService.update(currentDrink.drinkid, currentDrink);
      } else {
        await drinksService.create(currentDrink as Omit<Drink, 'drinkid'>);
      }
      setOpenDialog(false);
      await fetchDrinks();
    } catch (error) {
      console.error('Ошибка при сохранении напитка:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDrink(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <BaseTable<Drink>
        data={drinks}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Редактировать напиток' : 'Добавить напиток'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              name="name"
              value={currentDrink.name || ''}
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