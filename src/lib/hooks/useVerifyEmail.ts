import { useMutation } from '@tanstack/react-query';

async function verifyEmail(token: string) {
  const res = await fetch('/api/verify-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Verification failed');
  }

  return data;
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: verifyEmail,
  });
}
