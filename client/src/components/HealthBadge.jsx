import { useEffect, useState } from 'react';
import { api } from '../api';

export default function HealthBadge() {
  const [status, setStatus] = useState('checking...');

  useEffect(() => {
    let cancelled = false;

    api
      .getHealth()
      .then((data) => {
        if (!cancelled) setStatus(data.status ?? 'unknown');
      })
      .catch(() => {
        if (!cancelled) setStatus('offline');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <span className={`health-badge health-badge--${status}`}>
      API: {status}
    </span>
  );
}
