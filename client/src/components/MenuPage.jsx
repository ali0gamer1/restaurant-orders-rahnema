import { useEffect, useState } from 'react';
import { api } from '../api';
import MenuForm from './MenuForm';
import MenuHeader from './UnnecessaryMenuHeader';
import MenuRow from './MenuRow';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    api
      .getMenu()
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Handlers re-throw so the form knows whether to reset/close.
  function handleCreate(data) {
    setError('');
    return api
      .createMenuItem(data)
      .then((item) => setItems((prev) => [...prev, item]))
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  }

  function handleUpdate(id, data) {
    setError('');
    return api
      .updateMenuItem(id, data)
      .then((updated) => {
        setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
        setEditingId(null);
      })
      .catch((err) => {
        setError(err.message);
        throw err;
      });
  }

  function handleDelete(id) {
    setError('');
    api
      .deleteMenuItem(id)
      .then(() => setItems((prev) => prev.filter((it) => it.id !== id)))
      .catch((err) => setError(err.message));
  }

  return (
    <section>
      <h2>Menu</h2>
      {error && <p className="error">{error}</p>}

      <MenuForm submitLabel="Add item" onSubmit={handleCreate} resetOnSuccess />

      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <table>
          <MenuHeader />
          
          <tbody>
            {items.map((item) => (
              <MenuRow
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onEdit={() => setEditingId(item.id)}
                onCancel={() => setEditingId(null)}
                onSave={(data) => handleUpdate(item.id, data)}
                onDelete={() => handleDelete(item.id)}
              />
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4}>No menu items yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}
