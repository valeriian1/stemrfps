import React, { useState } from 'react';
import { useForm } from 'react-form'; // Wait, it should be react-hook-form
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../schemas';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ErrorMessage } from '../components/UIHelpers';

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useHookForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      setError(null);
      const user = await authService.login(data);
      setUser(user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Помилка входу');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">Вхід в систему</h2>
        </div>
        
        {error && <ErrorMessage message={error} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email адреса</label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Пароль</label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-400"
            >
              {isSubmitting ? 'Вхід...' : 'Увійти'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/register" className="font-medium text-green-600 hover:text-green-500 text-sm">
            Немає акаунта? Зареєструватися
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
