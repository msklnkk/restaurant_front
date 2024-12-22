import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip,
  CircularProgress 
} from '@mui/material';
import axios from '../services/axios.config.ts';
import { Order, OrderStatus, PaymentMethod } from '../types/order.types.ts';

interface OrderHistoryProps {
  clientId: number;
}

// Функция для определения цвета статуса
const getStatusColor = (status: string | null): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  if (!status) return "default";
  
  const statusColors: { [key: string]: any } = {
    [OrderStatus.NEW]: "info",
    [OrderStatus.CONFIRMED]: "primary",
    [OrderStatus.COOKING]: "warning",
    [OrderStatus.READY]: "secondary",
    [OrderStatus.COMPLETED]: "success",
    [OrderStatus.CANCELLED]: "error"
  };
  
  return statusColors[status] || "default";
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ clientId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get<Order[]>(`/orders/client/${clientId}`);
        setOrders(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
        setError('Не удалось загрузить историю заказов');
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      fetchOrders();
    }
  }, [clientId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      {orders.length === 0 ? (
        <Typography color="textSecondary" align="center">
          У вас пока нет заказов
        </Typography>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {orders.map((order) => (
            <Paper 
              key={order.orderid}
              elevation={1} 
              sx={{ 
                p: 2,
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 3
                }
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Заказ #{order.orderid}
                </Typography>
                <Chip
                  label={order.status || 'Статус не указан'}
                  color={getStatusColor(order.status)}
                  size="small"
                />
              </Box>
              
              <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                <Box flex={1}>
                  <Typography variant="body2" color="textSecondary">
                    Дата: {order.order_date 
                      ? new Date(order.order_date).toLocaleString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Не указана'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Способ оплаты: {order.payment_method || 'Не указан'}
                  </Typography>
                </Box>
                
                <Box 
                  flex={1} 
                  display="flex" 
                  flexDirection="column" 
                  alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                >
                  <Typography variant="body2" color="textSecondary">
                    Стол #{order.tableid || 'Не указан'}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mt: 1,
                      alignSelf: { xs: 'flex-start', sm: 'flex-end' }
                    }}
                  >
                    {order.total_sum?.toFixed(2) || 0} ₽
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default OrderHistory;