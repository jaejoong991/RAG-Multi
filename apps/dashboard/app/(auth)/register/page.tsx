"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Building2, Hexagon, Loader2 } from "lucide-react";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    workspaceName: "",
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Register via API Gateway
      await axios.post("http://localhost:4000/api/v1/auth/register", formData);

      // 2. Automatically sign in with NextAuth after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created, but login failed. Please sign in manually.");
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-deep text-on-surface">
      {/* Left Half: Branding (60%) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[60%] bg-linear-to-br from-[#0A0F1E] to-[#1E1B4B] p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 primary-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-container/40 rotate-12">
              <Hexagon size={40} className="text-white fill-white/20" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            Join RAG Platform
          </h1>
          <p className="text-xl text-on-surface-variant mb-10">
            Start your 14-day free trial. No credit card required.
          </p>
          
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              "Multi-Tenant Isolation",
              "Unlimited Documents",
              "Multi-LLM Support",
              "Production Ready API"
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-4 glass-panel rounded-xl border-white/5">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs font-medium text-on-surface-variant">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Half: Form (40%) */}
      <div className="flex-1 flex flex-col justify-center items-center bg-surface p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Create your workspace</h2>
            <p className="text-on-surface-variant">Build your custom AI knowledge base</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Workspace Name
              </label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.workspaceName}
                  onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                  placeholder="Acme Corp"
                  className="w-full bg-background-deep border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Your Name
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-background-deep border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Work Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full bg-background-deep border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-background-deep border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-container transition-all"
                />
              </div>
              {/* Strength Meter */}
              <div className="flex gap-1 pt-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= (formData.password.length > 6 ? 4 : formData.password.length > 0 ? 2 : 0) ? "bg-primary" : "bg-white/5"}`} />
                ))}
              </div>
              <p className="text-[10px] text-on-surface-variant">Password strength: {formData.password.length > 6 ? "Strong" : formData.password.length > 0 ? "Weak" : "Empty"}</p>
            </div>

            <div className="py-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 rounded border-white/10 bg-background-deep text-primary focus:ring-primary focus:ring-offset-background-deep w-4 h-4" />
                <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors leading-relaxed">
                  I agree to the <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>.
                </span>
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full primary-gradient text-white font-bold py-4 rounded-lg shadow-xl shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>


          <p className="text-center text-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
