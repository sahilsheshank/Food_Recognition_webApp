import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { API_BASE } from '../../constants/constant';

function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", age: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleForm = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/Auth/register`, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data === "user already exists") {
                setError('This email is already registered. Please log in.');
            } else {
                navigate('/login');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 py-12">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-emerald-500/6 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 text-black fill-black" />
                    </div>
                    <span className="text-xl font-bold text-white">Nutrify</span>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
                    <p className="text-zinc-400 text-sm mb-7">Start tracking your nutrition for free</p>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="nutrify-label">Full name</label>
                            <input
                                value={form.name}
                                onChange={handleForm}
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className="nutrify-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="nutrify-label">Email address</label>
                            <input
                                value={form.email}
                                onChange={handleForm}
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                className="nutrify-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="nutrify-label">Password</label>
                            <div className="relative">
                                <input
                                    value={form.password}
                                    onChange={handleForm}
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className="nutrify-input pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="nutrify-label">Age</label>
                            <input
                                onChange={handleForm}
                                type="number"
                                name="age"
                                placeholder="25"
                                min="12"
                                max="120"
                                className="nutrify-input"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-all text-sm mt-2"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-5 pt-5 border-t border-zinc-800">
                        <div className="flex items-center gap-2 text-xs text-zinc-600 justify-center mb-1">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            Free forever — no credit card needed
                        </div>
                    </div>

                    <p className="text-center text-sm text-zinc-500 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup;
