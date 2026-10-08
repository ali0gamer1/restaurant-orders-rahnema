import { useEffect, useState } from 'react';
import { api } from '../api';

const emptyForm = { name: '', price: '' };

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [error, setMessage] = useState('');
  const [errorFlag, setErrorFlag] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  function loadMenu() {
    setLoading(true);
    api
      .getMenu()
      .then(setItems)
      .catch((err) => {
        setMessage(err.message);
        setErrorFlag(true);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadMenu, []);

  function handleCreate(e) {
    e.preventDefault();
    setMessage('');
    setErrorFlag(false);
    api
      .createMenuItem({ name: form.name, price: Number(form.price) })
      .then((item) => {
        setItems((prev) => [...prev, item]);
        setForm(emptyForm);
      })
      .catch((err) => {
        setMessage(err.message);
        setErrorFlag(true);
      });
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditForm({ name: item.name, price: String(item.price) });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(emptyForm);
  }

  function handleUpdate(e, id) {
    e.preventDefault();
    setMessage('');
    setErrorFlag(false);
    api
      .updateMenuItem(id, { name: editForm.name, price: Number(editForm.price) })
      .then((updated) => {
        setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
        cancelEdit();
      })
      .catch((err) => {
        setMessage(err.message);
        setErrorFlag(true);
      });
  }

  function handleDelete(id) {
    setMessage('');
    setErrorFlag(false);
    api
      .deleteMenuItem(id)
      .then(() => setItems((prev) => prev.filter((it) => it.id !== id)))
      .catch((err) => {
        setMessage(err.message);
        setErrorFlag(true);
      });
  }

  return (
    <section>
      <h2>Menu</h2>
      {message && <p className={errorFlag ? "error" : "message"}>{message}</p>}
      
      

      <form className="inline-form" onSubmit={handleCreate}>
        <input
          placeholder="Dish name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">Add item</button>
      </form>

      {loading ? (
        <p>Loading menu...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) =>
              editingId === item.id ? (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td colSpan={2}>
                    <form className="inline-form" onSubmit={(e) => handleUpdate(e, item.id)}>
                      <input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        required
                      />
                      <button type="submit">Save</button>
                      <button type="button" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </form>
                  </td>
                  <td></td>
                </tr>
              ) : (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <button onClick={() => startEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                  </td>
                </tr>
              )
            )}
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
