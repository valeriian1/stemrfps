import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Некоректний формат e-mail'),
  password: z.string().min(6, 'Пароль має містити щонайменше 6 символів'),
});

export const registerSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Ім\'я має містити щонайменше 2 символи'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Паролі не збігаються',
  path: ['passwordConfirm'],
});

export const fieldSchema = z.object({
  name: z.string().min(2, 'Мінімум 2 символи').max(50, 'Максимум 50 символів'),
  crop: z.enum(['пшениця', 'ячмінь', 'кукурудза'], { required_error: 'Оберіть культуру' }),
  areaHa: z.number({ invalid_type_error: 'Введіть число' }).positive('Площа має бути більше 0').lte(10000, 'Максимум 10000 га'),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const photoSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'Розмір файлу не може перевищувати 5 МБ')
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Підтримуються лише формати .jpg, .png, .webp'
    ),
});
