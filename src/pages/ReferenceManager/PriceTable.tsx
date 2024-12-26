import React, { useState, useEffect } from 'react';
import { BaseTable } from './BaseTable.tsx';
import { Price, PRICE_TYPES } from '../../types/reference.types.ts';
import { priceService } from '../../services/priceService.ts';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel 
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

export const PricesTable: React.FC = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<Partial<Price>>({});
  const [isEditing, setIsEditing] = useState(false);

  const columns = [
    { field: 'priceid' as keyof Price, label: 'ID' },
    { field: 'dishid' as keyof Price, label: 'ID блюда' },
    { 
      field: 'price' as keyof Price, 
      label: 'Цена',
      format: (value: number | string) => {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return `${numValue.toFixed(2)} ₽`;
      }
    },
    { 
      field: 'valid_from' as keyof Price, 
      label: 'Действует с',
      format: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    { 
      field: 'valid_to' as keyof Price, 
      label: 'Действует по',
      format: (value: string) => {
        const date = new Date(value);
        return date.toLocaleDateString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
    },
    { 
      field: 'price_type' as keyof Price, 
      label: 'Тип цены',
      format: (value: string) => PRICE_TYPES.find(type => type.value === value)?.label || value
    }
];

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const data = await priceService.getAll();
      setPrices(data);
    } catch (error) {
      console.error('Ошибка при загрузке цен:', error);
    }
  };

  const handleAdd = () => {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // Получаем строку в формате YYYY-MM-DD
    
    setCurrentPrice({
      price_type: 'regular',
      valid_from: dateString,
      valid_to: dateString
    });
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (price: Price) => {
    setCurrentPrice(price);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (price: Price) => {
    if (window.confirm('Вы уверены, что хотите удалить эту цену?')) {
      try {
        await priceService.delete(price.priceid);
        await fetchPrices();
      } catch (error) {
        console.error('Ошибка при удалении цены:', error);
      }
    }
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      const priceData = {
        ...currentPrice,
        price: Number(currentPrice.price)
      };

      if (isEditing && currentPrice.priceid) {
        await priceService.update(currentPrice.priceid, priceData);
      } else {
        await priceService.create(priceData as Omit<Price, 'priceid'>);
      }
      setOpenDialog(false);
      await fetchPrices();
    } catch (error) {
      console.error('Ошибка при сохранении цены:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentPrice(prev => ({ ...prev, [name!]: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPrice(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setCurrentPrice(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <BaseTable<Price>
        data={prices}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Редактировать цену' : 'Добавить цену'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="ID блюда"
              name="dishid"
              type="number"
              value={currentPrice.dishid || ''}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              fullWidth
              label="Цена"
              name="price"
              type="number"
              value={currentPrice.price || ''}
              onChange={handleChange}
              margin="normal"
              required
              inputProps={{ step: "0.01", min: 0 }}
            />
            <TextField
              fullWidth
              label="Действует с"
              name="valid_from"
              type="date"
              value={currentPrice.valid_from || ''}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Действует по"
              name="valid_to"
              type="date"
              value={currentPrice.valid_to || ''}
              onChange={handleChange}
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
            <InputLabel>Тип цены</InputLabel>
            <Select
                name="price_type"
                value={currentPrice.price_type || ''}
                onChange={handleSelectChange}
                required
            >
                {PRICE_TYPES.map(type => (
                <MenuItem key={type.value} value={type.value}>
                    {type.label}
                </MenuItem>
                ))}
            </Select>
            </FormControl>
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