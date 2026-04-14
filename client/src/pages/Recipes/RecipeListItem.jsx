import React from 'react';
import { ExternalLink, User } from 'lucide-react';

function RecipeListItem({ recipe }) {
    return (
        <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-xl transition-all duration-300 flex flex-col">
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-zinc-800">
                {recipe.image_url ? (
                    <img
                        src={recipe.image_url}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🍽</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {recipe.title}
                </h3>

                {recipe.publisher && (
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs mb-3">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{recipe.publisher}</span>
                    </div>
                )}

                <div className="mt-auto">
                    <a
                        href={recipe.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full bg-zinc-800 hover:bg-emerald-500 hover:text-black text-zinc-300 font-medium text-xs py-2.5 rounded-xl transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Recipe
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RecipeListItem;
