import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
    Container, 
    Typography, 
    Button, 
    RadioGroup, 
    FormControlLabel, 
    Radio,
    Box,
    IconButton,
    Alert,
    CircularProgress
} from '@mui/material';
import { useOrders } from '../hooks/useOrders.ts';
import { useAuth } from '../hooks/useAuth.ts';
import { clearCart } from '../store/cartSlice.ts';
import { PaymentMethod } from '../types/order.types.ts';
import { RootState, AppDispatch } from '../store/store.ts';
import { CartItem } from '../types/cart.types.ts';
import * as ReactDOM from 'react-dom/client';
import { AuthService } from '../services/auth.service.ts';
import { submitOrder } from '../store/orderSlice.ts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CARD);
    const { createOrder, isLoading, error } = useOrders();
    const { getCurrentUserId, isAuthenticated } = useAuth();
    const [orderSuccess, setOrderSuccess] = useState(false);


    useEffect(() => {
        const checkAuth = async () => {
            const userId = await AuthService.getCurrentUserId();
            if (!userId) {
                navigate('/login', { 
                    state: { 
                        from: '/checkout',
                        message: 'Оформить заказ могут только авторизованные пользователи'
                    } 
                });
            }
        };
        
        checkAuth();
    }, [navigate]);

    // Если не аутентифицирован, не рендерим компонент
    if (!isAuthenticated) {
        return null;
    }

    // Проверка пустой корзины
    if (cartItems.length === 0) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h5" sx={{ mt: 4 }}>Корзина пуста</Typography>
                <Button 
                    variant="contained" 
                    onClick={() => navigate('/menu')}
                    sx={{ mt: 2 }}
                >
                    Перейти к меню
                </Button>
            </Container>
        );
    }

    const calculateTotal = (items: CartItem[]): number => {
        return items.reduce((sum, item) => {
            const itemPrice = item.price?.price || 0;
            return sum + itemPrice * item.quantity;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const clientId = await AuthService.getCurrentUserId();
            if (!clientId) {
                navigate('/login', { 
                    state: { 
                        from: '/checkout',
                        message: 'Оформить заказ могут только авторизованные пользователи'
                    } 
                });
                return;
            }

            // Отправляем заказ через Redux
            await dispatch(submitOrder({
                cartItems,
                paymentMethod,
                clientId
            })).unwrap();

            setOrderSuccess(true);
            dispatch(clearCart());
            
            // Показываем уведомление об успехе
            const Snackbar = await import('@mui/material/Snackbar').then(module => module.default);
            const Alert = await import('@mui/material/Alert').then(module => module.default);
            
            const SuccessAlert = () => (
                <Snackbar 
                    open={true} 
                    autoHideDuration={1500}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity="success" elevation={6} variant="filled">
                        Заказ успешно создан!
                    </Alert>
                </Snackbar>
            );
    
            // Создаем временный div для рендера уведомления
            const container = document.createElement('div');
            document.body.appendChild(container);
            const root = ReactDOM.createRoot(container);
            root.render(<SuccessAlert />);
            
            // Перенаправляем после небольшой задержки
            setTimeout(() => {
                navigate('/profile');
                // Размонтируем компонент и удаляем контейнер
                root.unmount();
                document.body.removeChild(container);
            }, 1500);
            
        } catch (error) {
            console.error('Error creating order:', error);
            // Показываем сообщение об ошибке пользователю
            const Alert = await import('@mui/material/Alert').then(module => module.default);
            const Snackbar = await import('@mui/material/Snackbar').then(module => module.default);
            
            const ErrorAlert = () => (
                <Snackbar 
                    open={true} 
                    autoHideDuration={3000}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity="error" elevation={6} variant="filled">
                        Ошибка при создании заказа. Попробуйте позже.
                    </Alert>
                </Snackbar>
            );
    
            const container = document.createElement('div');
            document.body.appendChild(container);
            const root = ReactDOM.createRoot(container);
            root.render(<ErrorAlert />);
    
            setTimeout(() => {
                root.unmount();
                document.body.removeChild(container);
            }, 3000);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
          <IconButton 
            onClick={() => navigate('/cart')}
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
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Оформление заказа
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                    Способ оплаты
                </Typography>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                    <FormControlLabel 
                        value={PaymentMethod.CARD} 
                        control={<Radio />} 
                        label="Банковской картой" 
                    />
                    <FormControlLabel 
                        value={PaymentMethod.CASH} 
                        control={<Radio />} 
                        label="Наличными" 
                    />
                    <FormControlLabel 
                        value={PaymentMethod.ONLINE} 
                        control={<Radio />} 
                        label="Онлайн оплата" 
                    />
                </RadioGroup>

                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Итого: {calculateTotal(cartItems)} ₽
                    </Typography>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Подтвердить заказ'
                        )}
                    </Button>
                </Box>
            </form>
        </Container>
    );
};

export default Checkout;