import { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, selectUser, resetUsersAsync } from '../store/usersSlice';
import './UserList.css';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.users);
  const [displayCount, setDisplayCount] = useState(100);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const containerRef = useRef(null);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setDisplayCount(100); // Сбрасываем количество отображаемых пользователей при поиске
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const handleUserClick = (user) => {
    dispatch(selectUser(user));
  };
  
  const handleReset = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все изменения?')) {
      dispatch(resetUsersAsync());
      setDisplayCount(100);
      setSearchQuery('');
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const scrollPosition = scrollTop + clientHeight;
    
    // Если пользователь прокрутил до 80% высоты контейнера
    if (scrollPosition >= scrollHeight * 0.8) {
      setDisplayCount(prev => {
        const filtered = debouncedQuery
          ? users.filter(user => 
              user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              user.company.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              user.department.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
              user.jobTitle.toLowerCase().includes(debouncedQuery.toLowerCase())
            )
          : users;
        return Math.min(prev + 100, filtered.length);
      });
    }
  }, [users, debouncedQuery]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);
  
  if (loading && !users.length) {
    return <div className="loading">Loading users...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Фильтруем пользователей по поисковому запросу
  const filteredUsers = debouncedQuery
    ? users.filter(user => 
        user.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.company.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        user.jobTitle.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    : users;
  
  // Отображаем только определенное количество пользователей
  const displayedUsers = filteredUsers.slice(0, displayCount);
  
  return (
    <div className="user-list-container" ref={containerRef}>
      <div className="user-list-header">
        <h2>Список пользователей</h2>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск по имени, компании, отделу или должности..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={() => setSearchQuery('')}
              title="Очистить поиск"
            >
              ✕
            </button>
          )}
        </div>
        <div className="user-count">
          {debouncedQuery 
            ? `Найдено: ${filteredUsers.length} из ${users.length} пользователей`
            : `Показано: ${displayedUsers.length} из ${users.length} пользователей`
          }
        </div>
        <button className="reset-button" onClick={handleReset}>
          Сбросить изменения
        </button>
      </div>
      
      <div className="user-list-inner">
        {displayedUsers.length > 0 ? displayedUsers.map(user => (
          <div
            key={user.id}
            className="user-card"
            onClick={() => handleUserClick(user)}
          >
            <div 
              className="user-avatar" 
              style={{ 
                backgroundColor: user.avatar ? user.avatar.color : '#cccccc' 
              }}
            >
              {user.avatar ? user.avatar.letter : (user.name ? user.name.charAt(0) : '?')}
            </div>
            <div className="user-info">
              <h3>{user.name || 'Безымянный пользователь'}</h3>
              <p>{user.jobTitle || 'Без должности'} at {user.company || 'Без компании'}</p>
              <p>{user.department || 'Без отдела'}</p>
            </div>
          </div>
        )) : (
          <div className="no-users">
            {debouncedQuery 
              ? 'По вашему запросу ничего не найдено' 
              : 'Нет пользователей для отображения'
            }
          </div>
        )}
        
        {loading && displayedUsers.length > 0 && (
          <div className="loading-more">Загрузка дополнительных пользователей...</div>
        )}
      </div>
    </div>
  );
};

export default UserList; 