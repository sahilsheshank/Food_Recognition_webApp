import React from 'react';
import RecipeListItem from './RecipeListItem';

function RecipeList({ recipes, query }) {
    if (!recipes || recipes.length === 0) {
        return (
            <div className="text-center py-16">
                <div className="text-4xl mb-4">🍳</div>
                <p className="text-zinc-500">No recipes found for "{query}"</p>
                <p className="text-zinc-700 text-sm mt-1">Try a different ingredient or dish name</p>
            </div>
        );
    }

    return (
        <div>
            <p className="text-zinc-500 text-sm mb-5">
                Found <span className="text-emerald-400 font-medium">{recipes.length}</span> recipes for "{query}"
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recipes.map((recipe) => (
                    <RecipeListItem key={recipe.recipe_id || recipe.id} recipe={recipe} />
                ))}
            </div>
        </div>
    );
}

export default RecipeList;
