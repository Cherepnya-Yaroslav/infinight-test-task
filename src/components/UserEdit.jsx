import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserAsync } from '../store/usersSlice';
import './UserEdit.css';

// Функция для генерации случайного цвета
const generateRandomColor = () => {
  // Вариант 1: Выбираем из предопределенных цветов
  const predefinedColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', 
    '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', 
    '#795548', '#607D8B'
  ];
  
  // Вариант 2: Генерируем полностью случайный цвет
  const generateRandomHexColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215);
    let hexColor = randomColor.toString(16);
    while (hexColor.length < 6) {
      hexColor = '0' + hexColor;
    }
    return `#${hexColor}`;
  };
  
  // С вероятностью 50% выбираем один из методов
  return Math.random() > 0.5 
    ? generateRandomHexColor() 
    : predefinedColors[Math.floor(Math.random() * predefinedColors.length)];
};

const UserEdit = () => {
  const dispatch = useDispatch();
  const { selectedUser, error } = useSelector(state => state.users);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    company: '',
    jobTitle: '',
    avatar: { color: '#ccc', letter: 'U' }
  });
  const [isDirty, setIsDirty] = useState(false);
  const [previewLetter, setPreviewLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (selectedUser) {
      // Обеспечиваем наличие аватара
      const userAvatar = selectedUser.avatar || { color: '#ccc', letter: selectedUser.name ? selectedUser.name.charAt(0) : '?' };
      
      setFormData({
        id: selectedUser.id,
        name: selectedUser.name || '',
        department: selectedUser.department || '',
        company: selectedUser.company || '',
        jobTitle: selectedUser.jobTitle || '',
        avatar: userAvatar
      });
      
      setPreviewLetter(userAvatar.letter);
      setIsDirty(false);
      setUpdateError(null);
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Если изменяется поле имени, обновляем букву для предпросмотра
    if (name === 'name') {
      if (value && value.length > 0) {
        setPreviewLetter(value.charAt(0));
      } else {
        setPreviewLetter('?'); // Если имя пустое, показываем знак вопроса
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleChangeColor = () => {
    const newColor = generateRandomColor();
    setFormData(prev => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        color: newColor
      }
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateError(null);
    
    // Определяем букву для аватара
    const firstLetter = formData.name && formData.name.length > 0 
      ? formData.name.charAt(0) 
      : '?';
    
    // Обновляем аватар перед отправкой
    const updatedFormData = {
      ...formData,
      avatar: {
        ...formData.avatar,
        letter: firstLetter
      }
    };
    
    try {
      setIsSubmitting(true);
      const result = await dispatch(updateUserAsync(updatedFormData)).unwrap();
      setIsDirty(false);
    } catch (err) {
      setUpdateError(err || 'Произошла ошибка при обновлении пользователя');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedUser) {
    return (
      <div className="user-edit-container empty">
        <p>Выберите пользователя для редактирования</p>
      </div>
    );
  }

  return (
    <div className="user-edit-container">
      <div className="user-edit-header">
        <div className="user-edit-avatar" style={{ backgroundColor: formData.avatar.color }}>
          {previewLetter}
        </div>
        <div className="avatar-controls">
          <h2>Редактирование пользователя</h2>
          <button type="button" className="color-button" onClick={handleChangeColor} title="Изменить цвет">
            <span className="color-icon">🎨</span> Изменить цвет
          </button>
        </div>
      </div>
      
      {updateError && (
        <div className="error-message">
          {updateError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="department">Отдел</label>
          <input
            type="text"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="company">Компания</label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="jobTitle">Должность</label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>
        
        <button 
          type="submit" 
          className="save-button"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

export default UserEdit; 