
import { Dish, Price } from '../types/database.types';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/cartSlice.ts';
import type { RootState } from '../store/store.ts';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Divider,
  ButtonGroup,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

interface CartItem {
  dish: Dish;
  price: Price;
  quantity: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Получаем данные из Redux store
  const { items: cartItems, total: cartTotal } = useSelector((state: RootState) => state.cart);

  const handleQuantityChange = (dishId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ dishId, quantity: newQuantity }));
  };

  const handleDeleteItem = (dishId: number) => {
    dispatch(removeFromCart(dishId));
    // После удаления последнего элемента можно перенаправить на страницу меню
    if (cartItems.length === 1) {
      navigate('/menu');
    }
  };

  // Если корзина пуста, показываем соответствующее сообщение
  if (!cartItems.length) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
        <Container>
          <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
            <IconButton 
              onClick={() => navigate('/menu')}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Typography variant="h3" component="h1" gutterBottom textAlign="center" color="primary">
            Корзина пуста
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/menu')}
            >
              Вернуться в меню
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 4 }}>
      <Container>
        <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <IconButton 
            onClick={() => navigate('/menu')}
            sx={{ 
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Box>

        <Typography variant="h3" component="h1" gutterBottom textAlign="center" color="primary">
          Корзина
        </Typography>

        <List>
          {cartItems.map((item: CartItem) => (
            <React.Fragment key={item.dish.dishid}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* Вариант 1: с кнопками +/- */}
                    <ButtonGroup size="small">
                      <IconButton 
                        onClick={() => handleQuantityChange(item.dish.dishid, item.quantity - 1)}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        type="number"
                        value={item.quantity}
                        size="small"
                        sx={{ width: '80px' }}
                        slotProps={{
                          input: {
                            style: { textAlign: 'center' },
                            inputProps: { min: 1 }
                          }
                        }}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value);
                          if (!isNaN(newQuantity) && newQuantity >= 1) {
                            handleQuantityChange(item.dish.dishid, newQuantity);
                          }
                        }}
                      />
                      <IconButton 
                        onClick={() => handleQuantityChange(item.dish.dishid, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </ButtonGroup>

                    {/* Кнопка удаления */}
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteItem(item.dish.dishid)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      {item.dish.name} - {item.price.price} ₽
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {item.dish.type}
                      </Typography>
                      {item.price.price && (
                        <Typography component="span" variant="body2" color="text.secondary">
                          {' '}| Сумма: {item.price.price * item.quantity} ₽
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 4, textAlign: 'right' }}>
          <Typography variant="h5" gutterBottom>
            Итого: {cartTotal} ₽
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 2 }}
            onClick={() => navigate('/checkout')}
          >
            Оформить заказ
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Cart;
