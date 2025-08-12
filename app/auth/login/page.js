
// app/auth/login/page.js
"use client"
import LoginForm from '@/components/Auth/LoginForm';
import Footer from '@/components/Layout/Footer';

export default function LoginPage() {
  return (
    <main>
      <LoginForm />
      <Footer />
    </main>
  );
}
