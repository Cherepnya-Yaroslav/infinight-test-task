import { generateUsers } from './generateUsers';

// Имитация хранилища данных на стороне сервера
let usersDB = null;

// Инициализация базы данных
const initDB = () => {
  if (usersDB === null) {
    usersDB = generateUsers(1000000);
  }
  return usersDB;
};

// Имитация задержки сети
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API для работы с пользователями
export const api = {
  // Получение всех пользователей
  getAllUsers: async () => {
    // Имитация задержки сети
    await delay(500);
    
    // Инициализируем БД, если это первый запрос
    initDB();
    
    return {
      success: true,
      data: [...usersDB] // Возвращаем копию массива
    };
  },
  
  // Обновление пользователя
  updateUser: async (userData) => {
    // Имитация задержки сети
    await delay(300);
    
    // Инициализируем БД, если это первый запрос
    initDB();
    
    // Создаем копию базы данных
    usersDB = [...usersDB];
    
    // Найдём пользователя в БД
    const userIndex = usersDB.findIndex(user => user.id === userData.id);
    
    if (userIndex === -1) {
      return {
        success: false,
        error: 'Пользователь не найден'
      };
    }
    
    // Создаем обновленного пользователя
    const updatedUser = {
      ...usersDB[userIndex],
      name: userData.name || usersDB[userIndex].name,
      department: userData.department || usersDB[userIndex].department,
      company: userData.company || usersDB[userIndex].company,
      jobTitle: userData.jobTitle || usersDB[userIndex].jobTitle,
      avatar: {
        ...usersDB[userIndex].avatar,
        ...(userData.avatar || {}),
        // Если имя изменилось, обновляем букву аватара
        letter: userData.name ? userData.name.charAt(0) : usersDB[userIndex].avatar.letter
      }
    };
    
    // Обновляем пользователя в БД
    usersDB[userIndex] = updatedUser;
    
    return {
      success: true,
      data: updatedUser
    };
  },
  
  // Сброс базы данных
  resetUsers: async () => {
    // Имитация задержки сети
    await delay(800);
    
    // Пересоздаём базу данных
    usersDB = generateUsers(1000000);
    
    return {
      success: true,
      data: [...usersDB] // Возвращаем копию массива
    };
  }
}; 