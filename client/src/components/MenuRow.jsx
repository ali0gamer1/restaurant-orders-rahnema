import MenuForm from './MenuForm';

export default function MenuRow({ item, isEditing, onEdit, onCancel, onSave, onDelete }) {
  if (isEditing) {
    return (
      <tr>
        <td>{item.id}</td>
        <td colSpan={3}>
          <MenuForm
            initialValues={{ name: item.name, price: String(item.price) }}
            submitLabel="Save"
            onSubmit={onSave}
            onCancel={onCancel}
          />
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td>${item.price.toFixed(2)}</td>
      <td>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </td>
    </tr>
  );
}
