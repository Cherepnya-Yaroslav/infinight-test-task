import { Provider } from 'react-redux';
import { store } from './store';
import UserList from './components/UserList';
import UserEdit from './components/UserEdit';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app-container">
        <UserList />
        <UserEdit />
      </div>
    </Provider>
  );
}

export default App;
