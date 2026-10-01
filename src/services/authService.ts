import { api } from './api';
import { User } from '../types';
import { hashPassword } from '../utils/crypto';
import { z } from 'zod';
import { loginSchema, registerSchema } from '../schemas';

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

const SESSION_KEY = 'stem_session';

export const authService = {
  async login(data: LoginData): Promise<User> {
    const users = api.getItem<User & { passwordHash: string }>(api.KEYS.USERS);
    const hash = await hashPassword(data.password);
    
    const user = users.find(u => u.email === data.email && u.passwordHash === hash);
    if (!user) {
      throw new Error('Невірний email або пароль');
    }

    const sessionUser = { id: user.id, fullName: user.fullName, email: user.email, role: user.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  async register(data: RegisterData): Promise<User> {
    const users = api.getItem<User & { passwordHash: string }>(api.KEYS.USERS);
    
    if (users.some(u => u.email === data.email)) {
      throw new Error('Користувач з таким email вже існує');
    }

    const hash = await hashPassword(data.password);
    const newUser: User & { passwordHash: string } = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      role: 'farmer',
      passwordHash: hash
    };

    users.push(newUser);
    api.setItem(api.KEYS.USERS, users);

    const sessionUser = { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser(): User | null {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  }
};
