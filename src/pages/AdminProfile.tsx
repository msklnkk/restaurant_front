import React, { useState, useEffect } from 'react';
import { 
    Container,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableFooter
} from '@mui/material';
import { IClientResponse } from '../types/auth.types';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/jwt.ts';
import { useAuth } from '../hooks/useAuth.ts';
import axios from '../services/axios.config.ts';
import { RevenueResponse, DishPopularity, PopularDishesResponse, InventoryCheckResponse, ProductInventory, InventoryStatus, StaffPerformanceResponse, StaffPerformance, UpdatePricesResponse, UpdatePricesRequest } from '../types/reports.types.ts';
import { Dish } from '../types/database.types';
import { ReferenceManager } from '../pages/ReferenceManager/ReferenceManager.tsx';

const AdminProfile: React.FC = () => {
    const navigate = useNavigate();
    const { getCurrentToken, isLoading: authLoading } = useAuth();
      const [error, setError] = useState<string | null>(null);

    const [userData, setUserData] = useState<IClientResponse | null>(null);

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [isLoadingDishes, setIsLoadingDishes] = useState(true);
    const [dishesError, setDishesError] = useState<string | null>(null);
    const getUniqueDishTypes = (): string[] => {
        return [...new Set(dishes
            .map(dish => dish.type)
            .filter((type): type is string => type !== null && type !== '')
        )];
    };

    // Добавим состояние для типа отчета
    const [reportType, setReportType] = useState('orders');


    // Функция для сортировки данных в зависимости от типа отчета
    const getSortedData = (data: StaffPerformance[]) => {
        switch (reportType) {
        case 'orders':
            return [...data].sort((a, b) => b.orders_count - a.orders_count);
        case 'revenue':
            return [...data].sort((a, b) => b.total_revenue - a.total_revenue);
        case 'average':
            return [...data].sort((a, b) => b.avg_order_value - a.avg_order_value);
        default:
            return data;
        }
    };

    useEffect(() => {
        const token = getCurrentToken();

        if (token) {
            console.log('Token payload:', decodeToken(token));
        }

        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const decoded = decodeToken(token);
                const userEmail = decoded?.sub;

                if (!userEmail) {
                    throw new Error('Не удалось определить email пользователя');
                }

                // Получаем данные пользователя по email
                const userByEmailResponse = await axios.get<IClientResponse>(`/user/by-mail/${userEmail}`);
                const userId = userByEmailResponse.data.clientid;

                // Получаем полные данные пользователя по ID
                const userDataResponse = await axios.get<IClientResponse>(`/user/${userId}`);
                setUserData(userDataResponse.data);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Ошибка при загрузке данных профиля');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [getCurrentToken, navigate]);

  
    // Состояния для модальных окон
    const [revenueModal, setRevenueModal] = useState(false);
    const [popularDishesModal, setPopularDishesModal] = useState(false);
    const [updatePricesModal, setUpdatePricesModal] = useState(false);
    const [staffPerformanceModal, setStaffPerformanceModal] = useState(false);
    const [inventoryModal, setInventoryModal] = useState(false);
    const [popularDishesResultModal, setPopularDishesResultModal] = useState(false);
    const [revenueResultModal, setRevenueResultModal] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
    const [staffPerfModal, setStaffPerfModal] = useState(false);
    const [staffPerfResultModal, setStaffPerfResultModal] = useState(false);
    const [resultModal, setResultModal] = useState(false);
    const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
    const [updateResult, setUpdateResult] = useState<UpdatePricesResponse | null>(null);

  // Состояния для форм
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [limit, setLimit] = useState('1');
    const [dishType, setDishType] = useState('');
    const [percentage, setPercentage] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [popularDishes, setPopularDishes] = useState<DishPopularity[]>([]);
    const [inventoryItems, setInventoryItems] = useState<ProductInventory[]>([]);
    const [inventoryResultModal, setInventoryResultModal] = useState(false);
    const [performanceData, setPerformanceData] = useState<StaffPerformanceResponse | null>(null);

  // Состояния для обработки ошибок и загрузки
  const [isLoading, setIsLoading] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  const validateDates = () => {
    if (!startDate || !endDate) {
      throw new Error('Пожалуйста, выберите обе даты');
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      throw new Error('Дата окончания не может быть раньше даты начала');
    }
  };

  // Обработчики для процедур
  const handleCalculateRevenue = async () => {
    try {
      setIsLoading(true);
      setRequestError(null);
  
      if (!startDate || !endDate) {
        throw new Error('Необходимо указать обе даты');
      }
  
      if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Начальная дата должна быть раньше или равна конечной дате');
      }
  
      const response = await axios.post<RevenueResponse>('/calculate', null, {
        params: {
            start_date: startDate,
            end_date: endDate
          }
        });
  
      setTotalRevenue(response.data.total_revenue);
      setRevenueModal(false);
      setRevenueResultModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      } else {
        setRequestError('Произошла ошибка при расчете выручки');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePrices = async () => {
    try {
      setIsLoading(true);
      setRequestError(null);
  
      if (!dishType) {
        throw new Error('Необходимо выбрать тип блюда');
      }

      const request: UpdatePricesRequest = {
        dish_type: dishType,
        price_change_percent: Number(priceChangePercent)
      };
  
      const response = await axios.put<UpdatePricesResponse>('/prices', request, {
        params: {
            dish_type: dishType,
            price_change_percent: priceChangePercent
        }
      });
  
      setUpdateResult(response.data);
      setUpdatePricesModal(false);
      setResultModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      } else {
        setRequestError('Произошла ошибка при обновлении цен');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzePopularDishes = async () => {
    try {
      setIsLoading(true);
      setRequestError(null);

      validateDates();

      const response = await axios.post<PopularDishesResponse>('/popular', null, {
        params: {
            start_date: startDate,
            end_date: endDate,
            min_orders: parseInt(limit)
        }
      });
      setPopularDishes(response.data.dishes);
      setPopularDishesModal(false);
      setPopularDishesResultModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      } else {
        setRequestError('Произошла ошибка при анализе популярных блюд');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeStaffPerformance = async () => {
    try {
      setIsLoading(true);
      setRequestError(null);
  
      if (!startDate || !endDate) {
        throw new Error('Необходимо указать обе даты');
      }
  
      if (new Date(startDate) > new Date(endDate)) {
        throw new Error('Начальная дата должна быть раньше или равна конечной дате');
      }
  
      const response = await axios.get<StaffPerformanceResponse>('/performance', {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
  
      setPerformanceData(response.data);
      setStaffPerfModal(false);
      setStaffPerfResultModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      } else {
        setRequestError('Произошла ошибка при анализе эффективности персонала');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckInventory = async () => {
    try {
      setIsLoading(true);
      setRequestError(null);

      if (parseInt(minQuantity) < 0) {
        throw new Error('Минимальное количество не может быть отрицательным');
      }

      const response = await axios.get<InventoryCheckResponse>('/check', {
        params: {
          min_quantity: parseInt(minQuantity) || 30 // используем 30 как значение по умолчанию
        }
      });

      setInventoryItems(response.data.inventory);
      setInventoryModal(false);
      setInventoryResultModal(true);
    } catch (error) {
      if (error instanceof Error) {
        setRequestError(error.message);
      } else {
        setRequestError('Ошибка при проверке инвентаря');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: InventoryStatus): string => {
    switch (status) {
      case InventoryStatus.OUT_OF_STOCK:
        return 'error.main';
      case InventoryStatus.LOW_STOCK:
        return 'warning.main';
      case InventoryStatus.OK:
        return 'success.main';
      default:
        return 'text.primary';
    }
  };

  const getStatusText = (status: InventoryStatus): string => {
    switch (status) {
      case InventoryStatus.OUT_OF_STOCK:
        return 'Нет в наличии';
      case InventoryStatus.LOW_STOCK:
        return 'Низкий запас';
      case InventoryStatus.OK:
        return 'В наличии';
      default:
        return status;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Панель администратора
        </Typography>
        
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Информация о пользователе:
            </Typography>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Email"
              value={userData?.mail || ''}
              disabled
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              label="Имя"
              value={userData?.name || ''}
              disabled
            />
          </Box>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Управление справочниками:
          </Typography>
          
          <ReferenceManager />

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Аналитика и отчеты:
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap' 
          }}>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={() =>setRevenueModal(true)}
              >
                Рассчитать выручку
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => setPopularDishesModal(true)}
              >
                Популярные блюда
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => setUpdatePricesModal(true)}
              >
                Обновить цены
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => setStaffPerformanceModal(true)}
              >
                Анализ работы персонала
              </Button>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => setInventoryModal(true)}
              >
                Проверка инвентаря
              </Button>
            </Box>
          </Box>
  
          {/* Модальные окна */}
          {/* Модальное окно расчета выручки */}
          <Dialog open={revenueModal} onClose={() => setRevenueModal(false)}>
            <DialogTitle>Расчет выручки</DialogTitle>
            <DialogContent>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                mt: 2 
              }}>
                <TextField
                type="date"
                label="Начальная дата"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
            />
            <TextField
                type="date"
                label="Конечная дата"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
            />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setRevenueModal(false)}>Отмена</Button>
              <Button onClick={handleCalculateRevenue}>Рассчитать</Button>
            </DialogActions>
          </Dialog>

          {/* Модальное окно с результатами расчета выручки */}
            <Dialog 
            open={revenueResultModal} 
            onClose={() => setRevenueResultModal(false)}
            >
            <DialogTitle>Результаты расчета выручки</DialogTitle>
            <DialogContent>
                <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                mt: 2 
                }}>
                <Typography variant="body1">
                    Период: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="h6" color="black">
                    Общая выручка: {totalRevenue !== null ? new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    maximumFractionDigits: 2
                    }).format(totalRevenue) : '—'}
                </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setRevenueResultModal(false)}>Закрыть</Button>
                <Button 
                onClick={() => {
                    setRevenueResultModal(false);
                    setRevenueModal(true);
                }}
                >
                Новый расчет
                </Button>
            </DialogActions>
            </Dialog>

             {/* Модальное окно обновления цен */}
             <Dialog open={updatePricesModal} onClose={() => setUpdatePricesModal(false)}>
            <DialogTitle>Обновление цен</DialogTitle>
            <DialogContent>
                <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                mt: 2 
                }}>
                <FormControl fullWidth>
                    <InputLabel>Тип блюда</InputLabel>
                    <Select
                    value={dishType}
                    onChange={(e) => setDishType(e.target.value)}
                    >
                    {getUniqueDishTypes().map((type) => (
                        <MenuItem key={type} value={type}>
                        {type}
                        </MenuItem>
                    ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Процент изменения"
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    error={!!percentage && isNaN(Number(percentage))}
                    helperText={!!percentage && isNaN(Number(percentage)) ? 'Введите корректное число' : ''}
                />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUpdatePricesModal(false)}>Отмена</Button>
                <Button 
                onClick={handleUpdatePrices}
                disabled={!dishType || !percentage || isNaN(Number(percentage))}
                >
                Обновить
                </Button>
            </DialogActions>
            </Dialog>


            <Dialog open={resultModal} onClose={() => setResultModal(false)}>
            <DialogTitle>Результат обновления цен</DialogTitle>
            <DialogContent>
                <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                mt: 2 
                }}>
                {updateResult && (
                    <>
                    <Typography variant="body1">
                        Тип блюда: {dishType}
                    </Typography>
                    <Typography variant="body1">
                        Процент изменения: {Number(percentage) > 0 ? '+' : ''}{percentage}%
                    </Typography>
                    <Typography variant="body1">
                        Обновлено позиций: {updateResult.updated_count}
                    </Typography>
                    </>
                )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setResultModal(false)}>Закрыть</Button>
                <Button 
                onClick={() => {
                    setResultModal(false);
                    setUpdatePricesModal(true);
                }}
                >
                Новое обновление
                </Button>
            </DialogActions>
            </Dialog>  

              {/* Модальное окно анализа популярных блюд */}
          <Dialog 
            open={popularDishesModal} 
            onClose={() => setPopularDishesModal(false)}
            maxWidth="md"
            fullWidth
            >
            <DialogTitle>Анализ популярных блюд</DialogTitle>
            <DialogContent>
            {requestError && (
              <Alert severity="error" sx={{ mb: 2 }}>{requestError}</Alert>
            )}
                <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                mt: 2 
                }}>
                    <TextField
                    type="date"
                    label="Начальная дата"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    required
                    />
                    <TextField
                        type="date"
                        label="Конечная дата"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        fullWidth
                        required
                    />
                    <TextField
                        fullWidth
                        label="Минимальное количество заказов"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        helperText="Минимальное значение: 1"
                        InputProps={{ 
                        inputProps: { min: 1 } 
                        }}
                        required
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPopularDishesModal(false)}>Отмена</Button>
                <Button onClick={handleAnalyzePopularDishes}>Анализировать</Button>
            </DialogActions>
            </Dialog>

            {/* Модальное окно с результатами анализа популярных блюд */}
            <Dialog
            open={popularDishesResultModal}
            onClose={() => setPopularDishesResultModal(false)}
            maxWidth="md"
            fullWidth
            >
            <DialogTitle>Результаты анализа популярных блюд</DialogTitle>
            <DialogContent>
                {popularDishes.length === 0 ? (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Нет данных для выбранного периода
                </Alert>
                ) : (
                <Box sx={{ mt: 2 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                    Период анализа: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                    </Alert>
                    <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                        <TableRow>
                            <TableCell>Название блюда</TableCell>
                            <TableCell align="right">Количество заказов</TableCell>
                            <TableCell align="right">Общая выручка</TableCell>
                            <TableCell align="right">Средний чек</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {popularDishes.map((dish) => (
                            <TableRow key={dish.dish_id}>
                            <TableCell>{dish.dish_name}</TableCell>
                            <TableCell align="right">{dish.orders_count}</TableCell>
                            <TableCell align="right">
                                {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB'
                                }).format(dish.total_revenue)}
                            </TableCell>
                            <TableCell align="right">
                                {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB'
                                }).format(dish.total_revenue / dish.orders_count)}
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                        <TableFooter>
                        <TableRow sx={{ fontWeight: 'bold', '& td': { fontWeight: 'bold', fontSize: '1.1rem', color: '#000000'} }}>
                            <TableCell>Итого</TableCell>
                            <TableCell align="right">
                            {popularDishes.reduce((sum, dish) => sum + dish.orders_count, 0)}
                            </TableCell>
                            <TableCell align="right">
                            {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB'
                            }).format(
                                popularDishes.reduce((sum, dish) => sum + dish.total_revenue, 0)
                            )}
                            </TableCell>
                            <TableCell />
                        </TableRow>
                        </TableFooter>
                    </Table>
                    </TableContainer>
                </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setPopularDishesResultModal(false)}>Закрыть</Button>
                <Button 
                onClick={() => {
                    setPopularDishesResultModal(false);
                    setPopularDishesModal(true);
                }}
                >
                Новый анализ
                </Button>
            </DialogActions>
            </Dialog>

            {/* Модальное окно для анализа работы персонала */}
            <Dialog 
                open={staffPerformanceModal} 
                onClose={() => setStaffPerformanceModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Анализ работы персонала</DialogTitle>
                <DialogContent>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        mt: 2 
                    }}>
                        <TextField
                            type="date"
                            label="Начальная дата"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            type="date"
                            label="Конечная дата"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStaffPerformanceModal(false)}>Отмена</Button>
                    <Button onClick={handleAnalyzeStaffPerformance}>Анализировать</Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={staffPerfResultModal} 
                onClose={() => setStaffPerfResultModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Результаты анализа работы персонала</DialogTitle>
                <DialogContent>
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        mt: 2 
                    }}>
                        <Typography variant="body1">
                            Период: {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                        </Typography>
                        
                        {performanceData && performanceData.performance.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Сотрудник</TableCell>
                                            <TableCell align="right">Количество заказов</TableCell>
                                            <TableCell align="right">Общая выручка</TableCell>
                                            <TableCell align="right">Средний чек</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getSortedData(performanceData.performance).map((staff) => (
                                            <TableRow key={staff.staff_id}>
                                                <TableCell>{staff.staff_name}</TableCell>
                                                <TableCell align="right">{staff.orders_count}</TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('ru-RU', {
                                                        style: 'currency',
                                                        currency: 'RUB'
                                                    }).format(Number(staff.total_revenue))}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {new Intl.NumberFormat('ru-RU', {
                                                        style: 'currency',
                                                        currency: 'RUB'
                                                    }).format(Number(staff.avg_order_value))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="body1">
                                Нет данных за выбранный период
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStaffPerfResultModal(false)}>Закрыть</Button>
                    <Button 
                        onClick={() => {
                            setStaffPerfResultModal(false);
                            setStaffPerformanceModal(true);
                        }}
                    >
                        Новый анализ
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Модальное окно для проверки инвентаря */}
            <Dialog 
                open={inventoryModal} 
                onClose={() => setInventoryModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Проверка инвентаря</DialogTitle>
                <DialogContent>
                    {requestError && (
                        <Alert severity="error" sx={{ mb: 2 }}>{requestError}</Alert>
                    )}
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 2,
                        mt: 2 
                    }}>
                        <TextField
                            fullWidth
                            label="Минимальное количество"
                            type="number"
                            value={minQuantity}
                            onChange={(e) => setMinQuantity(e.target.value)}
                            helperText="Оставьте пустым для использования значения по умолчанию (30)"
                            InputProps={{ 
                                inputProps: { min: 0 } 
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInventoryModal(false)}>Отмена</Button>
                    <Button onClick={handleCheckInventory}>Проверить</Button>
                </DialogActions>
            </Dialog>
            {/* Модальное окно с результатами проверки инвентаря */}
            <Dialog
                open={inventoryResultModal}
                onClose={() => setInventoryResultModal(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Результаты проверки инвентаря</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Название продукта</TableCell>
                                    <TableCell align="right">Количество</TableCell>
                                    <TableCell align="center">Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inventoryItems.map((item) => (
                                    <TableRow key={item.product_id}>
                                        <TableCell>{item.product_name}</TableCell>
                                        <TableCell align="right">{item.quantity}</TableCell>
                                        <TableCell align="center">
                                            <Typography color={getStatusColor(item.status)}>
                                                {getStatusText(item.status)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setInventoryResultModal(false)}>Закрыть</Button>
                </DialogActions>
            </Dialog>       
        </Paper>
      </Container>
    );
  };
  
  export default AdminProfile;