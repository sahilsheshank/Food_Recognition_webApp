import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ setQuery }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            setQuery(value.trim());
            setValue('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Search recipes (e.g. chicken, pasta, salad...)"
                    className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder-zinc-600 text-sm"
                />
            </div>
            <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-6 py-3 rounded-2xl transition-all text-sm whitespace-nowrap"
            >
                Search
            </button>
        </form>
    );
}

export default SearchBar;
