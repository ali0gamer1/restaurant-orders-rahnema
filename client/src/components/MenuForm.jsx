import { useState } from 'react';

// Used for both "add item" and "edit item". Owns its own input state.
export default function MenuForm({ initialValues = { name: '', price: '' }, submitLabel, onSubmit, onCancel, resetOnSuccess = false }) {
  const [values, setValues] = useState(initialValues);

  function handleSubmit(e) {
    e.preventDefault();
    // onSubmit returns a promise that rejects on failure, so we keep the input on error
    onSubmit({ name: values.name, price: Number(values.price) })
      .then(() => {
        if (resetOnSuccess) setValues(initialValues);
      })
      .catch(() => {});
  }

  return (
    <form className="inline-form" onSubmit={handleSubmit}>
      <input
        placeholder="Dish name"
        value={values.name}
        onChange={(e) => setValues({ ...values, name: e.target.value })}
        required
      />
      <input
        type="number"
        step="0.01"
        placeholder="Price"
        value={values.price}
        onChange={(e) => setValues({ ...values, price: e.target.value })}
        required
      />
      <button type="submit">{submitLabel}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}
