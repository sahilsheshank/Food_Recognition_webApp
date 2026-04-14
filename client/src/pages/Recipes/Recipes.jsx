import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import SearchBar from './search'
import { getRecipes } from './api'
import RecipeList from './RecipeList'
import { BookOpen } from 'lucide-react';

const POPULAR = ['chicken', 'salad', 'pasta', 'soup', 'smoothie', 'eggs'];

const Recipes = () => {
    const [query, setQuery] = useState('chicken');
    const [resultValue, setResultvalue] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getSearchedQuery();
    }, [query]);

    const getSearchedQuery = async () => {
        setLoading(true);
        try {
            const result = await getRecipes(query);
            if (result && result.recipes) {
                setResultvalue(result.recipes);
            } else {
                setResultvalue([]);
            }
        } catch {
            setResultvalue([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        <h1 className="text-2xl font-bold text-white">Recipe Discovery</h1>
                    </div>
                    <p className="text-zinc-500 text-sm">Find healthy recipes to fuel your goals</p>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <SearchBar setQuery={setQuery} />
                </div>

                {/* Popular tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="text-xs text-zinc-600 self-center mr-1">Popular:</span>
                    {POPULAR.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setQuery(tag)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize ${
                                query === tag
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 bg-zinc-900'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {/* Results */}
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-zinc-800" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-zinc-800 rounded" />
                                    <div className="h-3 bg-zinc-800 rounded w-1/2" />
                                    <div className="h-8 bg-zinc-800 rounded-xl mt-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <RecipeList recipes={resultValue} query={query} />
                )}
            </div>
        </Layout>
    );
}

export default Recipes;
