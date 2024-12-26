import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  SelectChangeEvent,
} from '@mui/material';
import { Dish, Price } from '../../types/reference.types.ts';
import { dishesService } from '../../services/dishesService.ts';
import { priceService } from '../../services/priceService.ts';

export const DishWithPrices: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [pricesByDish, setPricesByDish] = useState<Record<number, Price[]>>({});
  const [filters, setFilters] = useState({
    dishName: '',
    dishType: '',
    minPrice: '',
    maxPrice: '',
    priceType: '',
  });
  const [dishTypes, setDishTypes] = useState<string[]>([]);
  const [priceTypes, setPriceTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dishesData = await dishesService.getAll();
      setDishes(dishesData);

      const pricesData = await priceService.getAll();
      const pricesByDishId = pricesData.reduce((acc, price) => {
        if (!acc[price.dishid]) {
          acc[price.dishid] = [];
        }
        acc[price.dishid].push(price);
        return acc;
      }, {} as Record<number, Price[]>);
      
      setPricesByDish(pricesByDishId);
      setDishTypes([...new Set(dishesData.map(dish => dish.type))]);
      setPriceTypes([...new Set(pricesData.map(price => price.price_type))]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatPrice = (price: number) => `${price.toFixed(2)} ₽`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ru-RU');

  const filterData = (dish: Dish, price: Price | null): boolean => {
    const matchName = !filters.dishName || 
      dish.name.toLowerCase().includes(filters.dishName.toLowerCase());
    
    const matchType = !filters.dishType || 
      dish.type === filters.dishType;
    
    if (!price) {
      return matchName && matchType;
    }

    const matchMinPrice = !filters.minPrice || 
      Number(price.price) >= Number(filters.minPrice);
    
    const matchMaxPrice = !filters.maxPrice || 
      Number(price.price) <= Number(filters.maxPrice);
    
    const matchPriceType = !filters.priceType || 
      price.price_type === filters.priceType;

    return matchName && matchType && matchMinPrice && matchMaxPrice && matchPriceType;
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1200, 
      margin: '0 auto',
      padding: 2,
      height: 'calc(100vh - 100px)',
      overflow: 'auto'
    }}>
      <Paper sx={{ 
        width: '100%',
        height: '100%',
        overflow: 'auto',
        padding: 2
      }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Блюда и цены</Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <TextField
            label="Название блюда"
            name="dishName"
            value={filters.dishName}
            onChange={handleInputChange}
            size="small"
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Тип блюда</InputLabel>
            <Select
              name="dishType"
              value={filters.dishType}
              onChange={handleSelectChange}
              label="Тип блюда"
            >
              <MenuItem value="">Все</MenuItem>
              {dishTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Мин. цена"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleInputChange}
            size="small"
          />

          <TextField
            label="Макс. цена"
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleInputChange}
            size="small"
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Тип цены</InputLabel>
            <Select
              name="priceType"
              value={filters.priceType}
              onChange={handleSelectChange}
              label="Тип цены"
            >
              <MenuItem value="">Все</MenuItem>
              {priceTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
        
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Название блюда</TableCell>
                <TableCell>Тип блюда</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Тип цены</TableCell>
                <TableCell>Действует с</TableCell>
                <TableCell>Действует по</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dishes.map((dish) => {
                const dishPrices = pricesByDish[dish.dishid] || [];
                
                if (dishPrices.length > 0) {
                  return dishPrices
                    .filter(price => filterData(dish, price))
                    .map((price) => (
                      <TableRow key={`${dish.dishid}-${price.priceid}`}>
                        <TableCell>{dish.name}</TableCell>
                        <TableCell>{dish.type}</TableCell>
                        <TableCell>{formatPrice(Number(price.price))}</TableCell>
                        <TableCell>{price.price_type}</TableCell>
                        <TableCell>{formatDate(price.valid_from)}</TableCell>
                        <TableCell>{formatDate(price.valid_to)}</TableCell>
                      </TableRow>
                    ));
                }

                return filterData(dish, null) ? (
                  <TableRow key={dish.dishid}>
                    <TableCell>{dish.name}</TableCell>
                    <TableCell>{dish.type}</TableCell>
                    <TableCell colSpan={4} align="center">Нет данных о ценах</TableCell>
                  </TableRow>
                ) : null;
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default DishWithPrices;