import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  User, 
  LogOut
} from 'lucide-react';
import Button from "../ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';

import SwipeRecords from './swiperecords';
import AuthService from '../../services/authService';

const SwipeBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('SwipeRecords');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
        const result = await AuthService.logout();
  
        if (result.success) {
          setSuccess(true);
          console.log('User Logged Out', result.user);
          navigate('/login');
          // Navigate or notify the user to verify their email
        } else {
          setError(result.error.message);
        }
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
  };

  const renderView = () => {
    switch(activeView) {
      case 'SwipeRecords':
        return <SwipeRecords />;
      default:
        return <SwipeRecords />;
    }
  };

  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return navigate('/login');
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div 
        className={`bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className={`font-bold ${!isSidebarOpen ? 'hidden' : ''}`}>
            Hack SwipeBoard
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <LayoutDashboard />
          </Button>
        </div>

        <nav className="mt-10">
          {[
            { 
              name: 'Match Records', 
              icon: FileText, 
              view: 'matchRecords' 
            }
          ].map((item) => (
            <Button
              key={item.name}
              variant={activeView === item.view ? 'secondary' : 'ghost'}
              className="w-full justify-start px-4 mb-2"
              onClick={() => setActiveView(item.view)}
            >
              <item.icon className="mr-2" />
              {isSidebarOpen && item.name}
            </Button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex justify-end items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="flex items-center">
                <User className="mr-2" />
                {user.displayName || user.email}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onSelect={() => setActiveView('settings')}
                className="flex items-center"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={handleLogout}
                className="flex items-center text-red-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content View */}
        <div className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default SwipeBoard;