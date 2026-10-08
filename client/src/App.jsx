import { useState } from 'react';
import HealthBadge from './components/HealthBadge';
import MenuPage from './components/MenuPage';
import OrdersPage from './components/OrdersPage';
import ReservationsPage from './components/ReservationsPage';
import './App.css';

const TABS = [
  { id: 'menu', label: 'Menu', Component: MenuPage },
  { id: 'orders', label: 'Orders', Component: OrdersPage },
  { id: 'reservations', label: 'Reservations', Component: ReservationsPage },
];

function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const Active = TABS.find((tab) => tab.id === activeTab).Component;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Restaurant Orders</h1>
        <HealthBadge />
      </header>

      <nav className="tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeTab ? 'tab tab--active' : 'tab'}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-content">
        <Active />
      </main>
    </div>
  );
}

export default App;
