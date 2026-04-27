import { redirect } from 'next/navigation';

export default function RootPage() {
  // For now, redirect to login by default
  // In a real app, you would check the session here
  redirect('/login');
}
