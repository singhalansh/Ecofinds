import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Package, ShoppingCart, User, Settings } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'My Products', icon: <Package className="h-4 w-4 mr-2" /> },
    { id: 'orders', label: 'My Orders', icon: <ShoppingCart className="h-4 w-4 mr-2" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4 mr-2" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
  ];

  const handleTabChange = (value) => {
    setActiveTab(value);
    navigate(`/dashboard/${value}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        {activeTab === 'products' && (
          <Button onClick={() => navigate('/dashboard/products/new')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        )}
      </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 h-16 rounded-none">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center justify-center gap-2 py-4"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
