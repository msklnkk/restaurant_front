import React, { useState, useEffect } from 'react';
import { BaseTable } from './BaseTable.tsx';
import { Dish } from '../../types/reference.types.ts';
import { dishesService } from '../../services/dishesService.ts';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField } from '@mui/material';

export const DishesTable: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDish, setCurrentDish] = useState<Partial<Dish>>({});
  const [isEditing, setIsEditing] = useState(false);

  const columns = [
    { field: 'dishid' as keyof Dish, label: 'ID' },
    { field: 'name' as keyof Dish, label: 'Название' },
    { field: 'type' as keyof Dish, label: 'Тип' },
    { field: 'recipe' as keyof Dish, label: 'Рецепт' }
  ];

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      const data = await dishesService.getAll();
      setDishes(data);
    } catch (error) {
      console.error('Ошибка при загрузке блюд:', error);
    }
  };

  const handleAdd = () => {
    setCurrentDish({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (dish: Dish) => {
    setCurrentDish(dish);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (dish: Dish) => {
    if (window.confirm('Вы уверены, что хотите удалить это блюдо?')) {
      try {
        await dishesService.delete(dish.dishid);
        await fetchDishes();
      } catch (error) {
        console.error('Ошибка при удалении блюда:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentDish.dishid) {
        await dishesService.update(currentDish.dishid, currentDish);
      } else {
        await dishesService.create(currentDish as Omit<Dish, 'dishid'>);
      }
      setOpenDialog(false);
      await fetchDishes();
    } catch (error) {
      console.error('Ошибка при сохранении блюда:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentDish(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <BaseTable<Dish>
        data={dishes}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Редактировать блюдо' : 'Добавить блюдо'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              name="name"
              value={currentDish.name || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Тип"
              name="type"
              value={currentDish.type || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Рецепт"
              name="recipe"
              value={currentDish.recipe || ''}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
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