import { useEffect, useState } from 'react';
import { api } from '../api';

export default function OrdersPage() {
  const [token, setToken] = useState(() => localStorage.getItem('apiToken') || '');
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItemId, setMenuItemId] = useState('');
  const [size, setSize] = useState('medium');
  //const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getMenu().then(setMenu).catch(() => {});
  }, []);

  function saveToken(value) {
    setToken(value);
    localStorage.setItem('apiToken', value);
  }

  function loadOrders() {

    setOrders([]);
    if (!token) {
      setMessage('Enter the kitchen API token to view orders.');
      setErrorFlag(true);
      return;
    }
    setLoading(true);
    setMessage('');
    setErrorFlag(false);
    
    //if successfull, set a message

    api
      .getOrders(token)
      .then(setOrders).then(()=>{setMessage('Orders loaded successfully.'); setErrorFlag(false);})
      .catch((err) => {
        setMessage(err.message);
        setErrorFlag(true);
      })
      .finally(() => setLoading(false));
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!token) {
      setMessage('Enter the kitchen API token first.');
      setErrorFlag(true);
      return;
    }
    if (!menuItemId) {
      setMessage('Pick a menu item.');
      setErrorFlag(true);
      return;
    }
    setMessage('');
    setErrorFlag(false);
    api
      .createOrder(token, { menuItemId: Number(menuItemId), size })
      .then((order) => setOrders((prev) => [...prev, order]))
      .catch((err) => {
        setMessage(err.message);
        setErrorFlag(true);
      });
  }

  return (
    <section>
      <h2>Orders</h2>

      <div className="inline-form">
        <label>
          Kitchen token:{' '}
          <input
            type="password"
            placeholder="API token"
            value={token}
            onChange={(e) => saveToken(e.target.value)}
          />
        </label>
        <button onClick={loadOrders}>Load orders</button>
      </div>

      {message && <p className={errorFlag ? "error" : "message"}>{message}</p>}

      <form className="inline-form" onSubmit={handleCreate}>
        <select value={menuItemId} onChange={(e) => setMenuItemId(e.target.value)} required>
          <option value="">Select dish...</option>
          {menu.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} (${item.price.toFixed(2)})
            </option>
          ))}
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="small">small</option>
          <option value="medium">medium</option>
          <option value="large">large</option>
        </select>
        <button type="submit">Place order</button>
      </form>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Dish</th>
              <th>Size</th>
              <th>Price</th>
              <th>Served</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.dish}</td>
                <td>{order.size}</td>
                <td>${order.price.toFixed(2)}</td>
                <td>{order.served ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5}>No orders loaded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
