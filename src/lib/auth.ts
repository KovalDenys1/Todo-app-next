import bcrypt from 'bcryptjs';

// Default credentials (в продакшене должны быть в базе данных)
const USERS = [
  {
    username: 'admin',
    // password: 'admin123' (хешированный)
    passwordHash: '$2b$10$7FOWYfRZGPayPN28rBGhd..iOZ4pDLrMLdSUhqECLVa3hjTj3b242',
  },
  {
    username: 'demo',
    // password: 'demo123' (хешированный)
    passwordHash: '$2b$10$O2SyGxJqwBIeT.4ZxiZJmuz0JiUumJAoEPL28SsUNNmRI0g0L8.ti',
  },
];

const SESSION_KEY = 'denys-todo-app-session';

export interface AuthSession {
  username: string;
  loginTime: number;
}

// Проверка пароля
export async function verifyPassword(username: string, password: string): Promise<boolean> {
  const user = USERS.find(u => u.username === username);
  if (!user) return false;
  
  try {
    return await bcrypt.compare(password, user.passwordHash);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

// Создание хеша пароля (для генерации новых паролей)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Сохранение сессии
export function saveSession(username: string): void {
  const session: AuthSession = {
    username,
    loginTime: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// Загрузка сессии
export function loadSession(): AuthSession | null {
  try {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;
    
    const session: AuthSession = JSON.parse(sessionStr);
    
    // Проверка срока действия сессии (24 часа)
    const sessionAge = Date.now() - session.loginTime;
    const maxAge = 24 * 60 * 60 * 1000; // 24 часа
    
    if (sessionAge > maxAge) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Session load error:', error);
    return null;
  }
}

// Очистка сессии
export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// Получить список доступных пользователей (только для демо)
export function getAvailableUsers(): string[] {
  return USERS.map(u => u.username);
}
