import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../constants';

async function getProvider() {
  const res = await fetch(`${API_URL}/provider`);
  if (!res.ok) throw new Error('Failed to fetch provider');
  return res.json();
}
export default function useProvider() {
  return useQuery({
    queryKey: ['provider'],
    queryFn: getProvider,
  });
}
