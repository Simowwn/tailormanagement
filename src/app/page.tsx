"use client"

import { useState } from "react"
import { Scissors, Mail, Lock, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react"
import { login } from "./login-actions"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-slate-50 text-slate-900 relative overflow-hidden">
      
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/50 blur-[120px] rounded-full mix-blend-multiply" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[50%] bg-blue-200/50 blur-[120px] rounded-full mix-blend-multiply" />
      </div>

      <div className="flex flex-1 items-center justify-center p-8 z-10">
        <div className="w-full max-w-md">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-5">
              <Scissors className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-center font-medium">Sign in to TailorSwift to manage your shop</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <form className="space-y-6" action={handleSubmit}>
              
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="you@example.com" 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    required
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  )
}
