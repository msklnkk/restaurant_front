import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from '../services/axios.config.ts';
import { Order, OrderStatus, PaymentMethod } from '../types/order.types.ts';

interface OrderHistoryProps {
  clientId: number;
}

type StatusColor = "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";

const STATUS_COLORS: Record<string, StatusColor> = {
  'Новый': "info",
  'Подтвержден': "primary",
  'Готовится': "warning",
  'Готов к выдаче': "secondary",
  'Выполнен': "success",
  'Отменен': "error"
};

const getStatusColor = (status: string | null): StatusColor => {
  if (!status || !(status in STATUS_COLORS)) {
    return "default";
  }
  return STATUS_COLORS[status];
};

const formatDate = (date: Date | null | string): string => {
  if (!date) return 'Не указана';
  
  try {
    const dateObject = typeof date === 'string' ? new Date(date) : date;
    return dateObject.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'Некорректная дата';
  }
};

const formatPrice = (price: number | null | undefined): string => {
  const num = Number(price);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

const OrderHistory: React.FC<OrderHistoryProps> = ({ clientId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!clientId) {
        setError('ID клиента не указан');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<Order[]>(`/orders/client/${clientId}`);

        const sortedOrders = response.data.sort((a, b) => b.orderid - a.orderid);
        
        setOrders(sortedOrders);
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
        setError(err instanceof Error ? err.message : 'Не удалось загрузить историю заказов');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [clientId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
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
                    Дата: {formatDate(order.order_date)}
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
                    {formatPrice(order.total_sum)} ₽
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