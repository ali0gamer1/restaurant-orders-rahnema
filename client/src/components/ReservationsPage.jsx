import { useEffect, useState } from 'react';
import { api } from '../api';

export default function ReservationsPage() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    api
      .getReservations()
      .then((data) => setMessage(JSON.stringify(data)))
      .catch((err) => setMessage(err.message));
  }, []);

  return (
    <section>
      <h2>Reservations</h2>
      <p className="note">This feature is not implemented on the backend yet.</p>
      <pre>{message}</pre>
    </section>
  );
}
