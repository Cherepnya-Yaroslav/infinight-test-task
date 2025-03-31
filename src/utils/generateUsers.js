/**
 * Generate a large dataset of user records
 * @param {number} count - Number of users to generate
 * @returns {Array} Array of user objects
 */
export const generateUsers = (count = 1000000) => {
  console.time('Generating users');
  const users = [];
  
  // Предварительно создаем массивы для случайного выбора
  // это улучшит производительность
  const departments = [];
  for (let i = 1; i <= 20; i++) {
    departments.push(`Department ${i}`);
  }
  
  const companies = [];
  for (let i = 1; i <= 100; i++) {
    companies.push(`Company ${i}`);
  }
  
  const jobTitles = [];
  for (let i = 1; i <= 50; i++) {
    jobTitles.push(`Job Title ${i}`);
  }
  
  // Предварительно создаем цвета
  const predefinedColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', 
    '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', 
    '#795548', '#607D8B'
  ];
  
  for (let i = 0; i < count; i++) {
    // Задаем имя пользователя
    const userName = `User ${i + 1}`;
    
    // Получаем первую букву имени пользователя
    const firstLetter = userName.charAt(0);
    
    // Используем предварительно созданные массивы для случайного выбора
    const department = departments[Math.floor(Math.random() * departments.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    
    // Генерируем случайный цвет для аватара
    const randomColor = predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
    
    users.push({
      id: i + 1,
      name: userName,
      department,
      company,
      jobTitle,
      avatar: {
        color: randomColor,
        letter: firstLetter
      }
    });
  }
  
  console.timeEnd('Generating users');
  return users;
};

/**
 * Генерирует случайный цвет в формате HEX
 * @returns {string} Цвет в формате #RRGGBB
 */
const getRandomColor = () => {
  // Вариант 1: Выбор из предопределенных цветов (оставляем для разнообразия)
  const predefinedColors = [
    '#F44336', // Красный
    '#E91E63', // Розовый
    '#9C27B0', // Пурпурный
    '#673AB7', // Тёмно-фиолетовый
    '#3F51B5', // Индиго
    '#2196F3', // Синий
    '#03A9F4', // Голубой
    '#00BCD4', // Бирюзовый
    '#009688', // Сине-зелёный
    '#4CAF50', // Зелёный
    '#8BC34A', // Светло-зелёный
    '#CDDC39', // Лаймовый
    '#FFC107', // Янтарный
    '#FF9800', // Оранжевый
    '#FF5722', // Глубокий оранжевый
    '#795548', // Коричневый
    '#607D8B'  // Сине-серый
  ];
  
  // Вариант 2: Генерация действительно случайного цвета
  const generateRandomHexColor = () => {
    // Генерируем случайное число от 0 до 16777215 (FFFFFF в шестнадцатеричной системе)
    const randomColor = Math.floor(Math.random() * 16777215);
    
    // Преобразуем в шестнадцатеричную строку и добавляем ведущие нули если нужно
    let hexColor = randomColor.toString(16);
    while (hexColor.length < 6) {
      hexColor = '0' + hexColor;
    }
    
    return `#${hexColor}`;
  };
  
  // Используем оба варианта с равной вероятностью для хорошего баланса между 
  // согласованными цветами и случайными
  const useRandomGenerator = Math.random() > 0.5;
  
  if (useRandomGenerator) {
    return generateRandomHexColor();
  } else {
    return predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
  }
}; 