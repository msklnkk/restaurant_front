
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Alert, 
  CircularProgress,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';
import axios from '../services/axios.config.ts';
import { IClientResponse } from '../types/auth.types.ts';
import { decodeToken } from '../utils/jwt.ts';
import OrderHistory from './OrderHistory.tsx';
import AdminProfile from './AdminProfile.tsx';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { getCurrentToken, isLoading: authLoading } = useAuth();
  
  const [userData, setUserData] = useState<IClientResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedData, setEditedData] = useState({
    name: '',
    phone_number: '',
  });

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
        setIsAdmin(userDataResponse.data.is_admin);
        setEditedData({
          name: userDataResponse.data.name || '',
          phone_number: userDataResponse.data.phone_number || '',
        });
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError('Ошибка при загрузке данных профиля');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [getCurrentToken, navigate]);

  if (isAdmin) {
    return <AdminProfile />;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = getCurrentToken();
      if (!token) {
        throw new Error('Нет доступа');
      }

      const decoded = decodeToken(token);
      const userEmail = decoded?.sub;

      if (!userEmail) {
        throw new Error('Не удалось определить email пользователя');
      }

      // Получаем ID пользователя
      const userResponse = await axios.get<IClientResponse>(`/user/by-mail/${userEmail}`);
      const userId = userResponse.data.clientid;

      // Обновляем данные пользователя
      const response = await axios.put<IClientResponse>(`/user/${userId}`, editedData);
      setUserData(response.data);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Ошибка при сохранении данных');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      {(isLoading || authLoading) ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Профиль пользователя
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
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
                value={isEditing ? editedData.name : (userData?.name || '')}
                disabled={!isEditing}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Телефон"
                value={isEditing ? editedData.phone_number : (userData?.phone_number || '')}
                disabled={!isEditing}
                onChange={(e) => setEditedData({ ...editedData, phone_number: e.target.value })}
                sx={{ mb: 2 }}
              />

              <Typography variant="body1" sx={{ mb: 2 }}>
                Ваша скидка: {userData?.discount_percentage || 0}%
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {!isEditing ? (
                  <Button variant="contained" onClick={handleEdit}>
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" onClick={handleSave}>
                      Сохранить
                    </Button>
                    <Button variant="outlined" onClick={() => setIsEditing(false)}>
                      Отмена
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Paper>

          {/* История заказов */}
          <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              История заказов
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {userData && <OrderHistory clientId={userData.clientid} />}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Profile;