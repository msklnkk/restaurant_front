import React, { useState, useEffect } from 'react';
import { BaseTable } from './BaseTable.tsx';
import { Supplier } from '../../types/reference.types.ts';
import { supplierService } from '../../services/supplierService.ts';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export const SuppliersTable: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Partial<Supplier>>({});
  const [isEditing, setIsEditing] = useState(false);

  const columns = [
    { field: 'supplierid' as keyof Supplier, label: 'ID' },
    { field: 'name' as keyof Supplier, label: 'Название' },
    { 
      field: 'contact_info' as keyof Supplier, 
      label: 'Контактная информация',
      format: (value: string) => {
        if (!value) return '';
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 10) {
          return `+7 (${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,8)}-${cleaned.slice(8)}`;
        }
        if (cleaned.length === 11) {
          return `+${cleaned[0]} (${cleaned.slice(1,4)}) ${cleaned.slice(4,7)}-${cleaned.slice(7,9)}-${cleaned.slice(9)}`;
        }
        return value;
      }
    },
    { field: 'address' as keyof Supplier, label: 'Адрес' }
  ];

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await supplierService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Ошибка при загрузке поставщиков:', error);
    }
  };

  const handleAdd = () => {
    setCurrentSupplier({});
    setIsEditing(false);
    setOpenDialog(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsEditing(true);
    setOpenDialog(true);
  };

  const handleDelete = async (supplier: Supplier) => {
    if (window.confirm('Вы уверены, что хотите удалить этого поставщика?')) {
      try {
        await supplierService.delete(supplier.supplierid);
        await fetchSuppliers();
      } catch (error) {
        console.error('Ошибка при удалении поставщика:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentSupplier.supplierid) {
        await supplierService.update(currentSupplier.supplierid, currentSupplier);
      } else {
        await supplierService.create(currentSupplier as Omit<Supplier, 'supplierid'>);
      }
      setOpenDialog(false);
      await fetchSuppliers();
    } catch (error) {
      console.error('Ошибка при сохранении поставщика:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentSupplier(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <BaseTable<Supplier>
        data={suppliers}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {isEditing ? 'Редактировать поставщика' : 'Добавить поставщика'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Название"
              name="name"
              value={currentSupplier.name || ''}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Контактная информация"
              name="contact_info"
              value={currentSupplier.contact_info || ''}
              onChange={handleChange}
              margin="normal"
              placeholder="+7 (XXX) XXX-XX-XX"
            />
            <TextField
              fullWidth
              label="Адрес"
              name="address"
              value={currentSupplier.address || ''}
              onChange={handleChange}
              margin="normal"
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