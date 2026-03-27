'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  Brain,
  ChevronLeft,
  AlertCircle,
  ShieldCheck
} from "lucide-react"

export default function AuthPage() {

  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validate = () => {

    if (!formData.email) return "Email required"
    if (!formData.password) return "Password required"

    if (!isLogin) {
      if (!formData.name) return "Name required"
      if (formData.password !== formData.confirmPassword)
        return "Passwords do not match"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    const validation = validate()
    if (validation) {
      setError(validation)
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {

      // ================= LOGIN =================
      if (isLogin) {

        const body = new URLSearchParams()
        body.append("username", formData.email) // 🔥 REQUIRED
        body.append("password", formData.password)

        const res = await fetch("https//localhost:8000/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body
        })

        const data = await res.json()

        if (!res.ok) {
          setError(data.detail || "Login failed")
          setLoading(false)
          return
        }

        // ✅ CORRECT KEY
        localStorage.setItem("access_token", data.access_token)

        setSuccess("Login successful")

        setTimeout(() => {
          router.push("/mint")
        }, 800)

      }

      // ================= SIGNUP =================
      else {

        const res = await fetch("https//localhost:8000/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          })
        })

        const data = await res.json()

        if (!res.ok) {
          const message =
            typeof data.detail === "string"
              ? data.detail
              : JSON.stringify(data.detail)

          setError(message || "Signup failed")
          setLoading(false)
          return
        }

        // 🔥 FIXED HERE (THIS WAS YOUR BUG)
        localStorage.setItem("access_token", data.access_token)

        setSuccess("Account created")

        setTimeout(() => {
          router.push("/mint")
        }, 800)
      }

    } catch (err) {
      setError("Server connection failed")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">

      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">

          <Link href="/mint" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>

            <div>
              <div className="text-blue-500 font-bold text-sm">MINT</div>
              <div className="text-[9px] text-zinc-500 tracking-widest">
                VISION INTELLIGENCE
              </div>
            </div>
          </Link>

          <Link href="/mint" className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
            <ChevronLeft size={16} />
            Back
          </Link>

        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8">

          <div className="flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-2 text-sm font-bold ${isLogin ? "text-white border-b-2 border-blue-500" : "text-zinc-500"}`}
            >
              SIGN IN
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-2 text-sm font-bold ${!isLogin ? "text-white border-b-2 border-purple-500" : "text-zinc-500"}`}
            >
              SIGN UP
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-400 mb-4">
              <ShieldCheck size={16} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-sm text-white"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-sm text-white"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-sm text-white"
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-white/10 rounded-lg text-sm text-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${isLogin ? "bg-blue-600" : "bg-purple-600"}`}
            >
              {loading
                ? <Loader2 className="animate-spin" size={16} />
                : <>
                  {isLogin ? "SIGN IN" : "SIGN UP"}
                  <ArrowRight size={16} />
                </>
              }
            </button>

          </form>

        </div>

      </main>
    </div>
  )
}