import React, { useState, useEffect } from 'react';
import { productsService } from '../../services/productsService.ts';
import { Product } from '../../types/reference.types.ts';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Alert
} from '@mui/material';
import { BaseTable } from './BaseTable.tsx';

export const ProductsTable: React.FC = () => {  
  const [products, setProducts] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columns = [
    { field: 'productid' as keyof Product, label: 'ID' },
    { field: 'name' as keyof Product, label: 'Название' }
  ];

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productsService.getAll();
      setProducts(data);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError('Ошибка при загрузке продуктов');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setCurrentProduct({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (product: Product) => {
    if (window.confirm('Вы уверены, что хотите удалить этот продукт?')) {
      try {
        setError(null);
        await productsService.delete(product.productid);
        setProducts(products.filter(p => p.productid !== product.productid));
      } catch (err: any) {
        console.error('Error deleting product:', err);
        setError('Ошибка при удалении продукта');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      if (isEditing && currentProduct.productid) {
        await productsService.update(currentProduct.productid, currentProduct);
      } else {
        await productsService.create(currentProduct as Omit<Product, 'productid'>);
      }
      setOpenDialog(false);
      await fetchProducts();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setError('Ошибка при сохранении продукта');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => ({ ...prev, [name]: value }));
  };

return (
  <>
    {error && (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    )}

    <BaseTable<Product>
      data={products}
      columns={columns}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />

    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEditing ? 'Редактировать продукт' : 'Добавить продукт'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Название"
            name="name"
            value={currentProduct.name || ''}
            onChange={handleChange}
            margin="normal"
            required
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