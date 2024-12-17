
import { Dish } from '../types/database.types';

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface CartState {
  cartItems: Dish[];
  cartTotal: number;
}

const Cart: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartTotal } = (location.state as CartState) || { cartItems: [], cartTotal: 0 };

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

        {cartItems.length === 0 ? (
          <Typography variant="h6" textAlign="center">
            Корзина пуста
          </Typography>
        ) : (
          <>
            <List>
              {cartItems.map((item: Dish) => (
                <React.Fragment key={item.dishid}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={item.type}
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
              >
                Оформить заказ
              </Button>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default Cart;
