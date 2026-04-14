import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Zap, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { API_BASE } from '../../constants/constant';

function Login() {
    const loggedInData = useContext(UserContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/api/Auth/login`, {
                method: 'POST',
                body: JSON.stringify(form),
                headers: { "Content-Type": "application/json" }
            });
            const data = await res.json();
            if (data === "user not found" || data.message === "user not found" || !data.token) {
                setError('Invalid email or password. Please try again.');
            } else {
                localStorage.setItem("nutrify-app", JSON.stringify(data));
                loggedInData.setLoggedUser(data);
                navigate("/home");
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
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
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
                    <p className="text-zinc-400 text-sm mb-7">Log in to continue your journey</p>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="nutrify-label">Email address</label>
                            <input
                                onChange={handleInput}
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className="nutrify-input"
                                required
                            />
                        </div>
                        <div>
                            <label className="nutrify-label">Password</label>
                            <div className="relative">
                                <input
                                    onChange={handleInput}
                                    name="password"
                                    type={showPassword ? "text" : "password"}
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-all text-sm mt-2"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-zinc-500 mt-6">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
