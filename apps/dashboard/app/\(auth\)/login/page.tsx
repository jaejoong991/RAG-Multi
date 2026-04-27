import Link from "next/link";
import { Mail, Lock, Eye, Hexagon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-background-deep text-on-surface">
      {/* Left Half: Branding (60%) */}
      <div className="hidden lg:flex flex-col justify-center items-center w-[60%] bg-linear-to-br from-[#0A0F1E] to-[#1E1B4B] p-12 relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary-container/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 primary-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-container/40 rotate-12">
              <Hexagon size={40} className="text-white fill-white/20" />
            </div>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white mb-6">
            RAG Platform
          </h1>
          <p className="text-xl text-on-surface-variant mb-10">
            AI-Powered Knowledge Base for Your Business
          </p>
          
          <div className="flex justify-center gap-3">
            {["Multi-Tenant", "Multi-LLM", "Enterprise Ready"].map((pill) => (
              <span key={pill} className="px-4 py-2 rounded-full glass-panel text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20">
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Half: Form (40%) */}
      <div className="flex-1 flex flex-col justify-center items-center bg-surface p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
            <p className="text-on-surface-variant">Sign in to your account</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="email" 
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
                  placeholder="••••••••"
                  className="w-full bg-background-deep border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white focus:outline-none focus:border-primary-container transition-all"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors">
                  <Eye size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-white/10 bg-background-deep text-primary focus:ring-primary focus:ring-offset-background-deep w-4 h-4" />
                <span className="text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
              </label>
              <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="w-full primary-gradient text-white font-bold py-4 rounded-lg shadow-xl shadow-primary-container/20 hover:opacity-90 active:scale-[0.98] transition-all">
              Sign In
            </button>
          </form>

          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5" />
            </div>
            <span className="relative bg-surface px-4 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              or
            </span>
          </div>

          <button className="w-full border border-white/10 hover:bg-white/5 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-3 transition-all">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 1.2-4.53z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>

          <p className="text-center text-sm text-on-surface-variant">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Get Started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
