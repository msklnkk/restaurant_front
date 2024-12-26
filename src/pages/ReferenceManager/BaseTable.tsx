import { 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell,
    IconButton,
    Button,
    Box,
    Collapse,
    Paper,
    Typography
  } from '@mui/material';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
import React, { useState } from 'react';


interface Column<T> {
    field: keyof T;
    label: string;
    format?: (value: any) => string; // добавляем опциональную функцию форматирования
  }
  
  interface BaseTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onAdd: () => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
  }
  
  export function BaseTable<T>({ data, columns, onAdd, onEdit, onDelete }: BaseTableProps<T>) {


    return (
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(224, 224, 224, 1)'
          }}>
          </Box>
    
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              onClick={onAdd}
              sx={{ mb: 2 }}
            >
              Добавить
            </Button>
    
            <Box sx={{ height: '400px', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell 
                        key={String(column.field)}
                        sx={{ backgroundColor: 'background.paper' }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                    <TableCell 
                      sx={{ backgroundColor: 'background.paper' }}
                    >
                      Действия
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={index}>
                      {columns.map((column) => (
                        <TableCell key={String(column.field)}>
                        {column.format && item[column.field] !== null && item[column.field] !== undefined
                          ? column.format(item[column.field])
                          : item[column.field] !== null && item[column.field] !== undefined
                            ? String(item[column.field])
                            : ''}
                      </TableCell>
                      ))}
                      <TableCell>
                        <IconButton onClick={() => onEdit(item)} size="small">
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => onDelete(item)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Paper>
      );
    }