'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  UserCircle,
  KeyRound
} from 'lucide-react';
import { UserRole } from '@/types/interfaces';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  onLogin: (user: any) => void;
}

// frontend/src/components/LoginForm.tsx
import { auth } from '../services/api';

const LoginForm = ({ onLogin }: LoginFormProps) => {
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await auth.login({
                username: formData.username,
                password: formData.password
            });
            onLogin(response.user);
        } catch (error) {
            setError('Invalid credentials');
        }
    };

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });

  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    username: '',
    password: ''
  });

  // Role options with icons and descriptions
  const roleOptions = [
    { value: 'student', label: 'Student', icon: UserCircle, description: 'Access your exeat requests and permissions' },
    { value: 'admin', label: 'Admin', icon: ShieldCheck, description: 'Manage student requests and parent approvals' },
    { value: 'dean', label: 'Dean', icon: User, description: 'Review and approve student exeat requests' },
    { value: 'security', label: 'Security', icon: KeyRound, description: 'Manage gate access and verify permits' }
  ];

  // Validation functions
  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'username':
        if (!value) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name as keyof typeof touched]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setValidationErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validate all fields
    const errors = {
      username: validateField('username', formData.username),
      password: validateField('password', formData.password)
    };

    setValidationErrors(errors);

    // Check if there are any errors
    if (Object.values(errors).some(error => error)) {
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock users for different roles
      const mockUsers = {
        student: {
          id: 'STU123',
          name: 'John Student',
          email: 'john@student.edu',
          role: 'student' as const,
          matricNumber: 'MAT123',
          department: 'Computer Science',
          level: '300'
        },
        admin: {
          id: 'ADM123',
          name: 'Jane Admin',
          email: 'jane@admin.edu',
          role: 'admin' as const,
          department: 'Student Affairs',
          position: 'Student Affairs Officer'
        },
        dean: {
          id: 'DEAN123',
          name: 'Dr. Dean',
          email: 'dean@admin.edu',
          role: 'dean' as const,
          department: 'Student Affairs',
          position: 'Dean of Students'
        },
        security: {
          id: 'SEC123',
          name: 'Bob Security',
          email: 'bob@security.edu',
          role: 'security' as const,
          shift: 'morning' as const,
          post: 'Main Gate'
        }
      };

      const user = mockUsers[formData.role as keyof typeof mockUsers];
      
      if (formData.username && formData.password) {
        onLogin(user);
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-3">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome to UniPass</CardTitle>
        <CardDescription className="text-center">
          Login to manage your exeat requests and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="role">Select Role</Label>
            <select 
              id="role"
              name="role"
              className="w-full p-2 border rounded"
              value={formData.role}
              onChange={handleChange}
            >
              {roleOptions.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            <p className="text-sm text-muted-foreground">
              {roleOptions.find(r => r.value === formData.role)?.description}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username/ID</Label>
            <div className="relative">
              <Input 
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={formData.role === 'student' ? "Enter your matric number" : "Enter your staff ID"}
                className={cn(
                  "pl-10",
                  validationErrors.username && touched.username && "border-red-500"
                )}
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            {validationErrors.username && touched.username && (
              <p className="text-sm text-red-500">{validationErrors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input 
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className={cn(
                  "pl-10",
                  validationErrors.password && touched.password && "border-red-500"
                )}
              />
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {validationErrors.password && touched.password && (
              <p className="text-sm text-red-500">{validationErrors.password}</p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>Sign in</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;