import React, { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography,
  Paper 
} from '@mui/material';
import { DishesTable } from './DishesTable.tsx';
import { DrinksTable } from './DrinksTable.tsx';
import { ProductsTable } from './ProductsTable.tsx';
import { StaffTable } from './StaffTable.tsx';
import { SuppliersTable } from './SupplierTable.tsx';
import { TablesTable } from './TablesTable.tsx';
import { PricesTable } from './PriceTable.tsx';
import DishWithPrices from './DishWithPrices.tsx';

// Интерфейс для TabPanel
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reference-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

export const ReferenceManager: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <Paper sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Блюда" />
          <Tab label="Напитки" />
          <Tab label="Продукты" />
          <Tab label="Персонал" />
          <Tab label="Поставщики" />
          <Tab label="Столы" />
          <Tab label="Цены" />
          <Tab label="Блюда с ценами" />
        </Tabs>
      </Box>

      <TabPanel value={currentTab} index={0}>
        <DishesTable />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <DrinksTable />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <ProductsTable />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <StaffTable />
      </TabPanel>
      <TabPanel value={currentTab} index={4}>
        <SuppliersTable />
      </TabPanel>
      <TabPanel value={currentTab} index={5}>
        <TablesTable />
      </TabPanel>
      <TabPanel value={currentTab} index={6}>
        <PricesTable />
      </TabPanel>
      <TabPanel value={currentTab} index={7}>
        <DishWithPrices />
      </TabPanel>
    </Paper>
  );
};