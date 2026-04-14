import React, { useState } from 'react';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

const BLOGS = [
    {
        id: 1,
        category: 'Nutrition',
        title: 'Why Protein is the Most Important Macro for Fat Loss',
        excerpt: 'High protein intake boosts metabolism, reduces appetite, and preserves lean muscle during a calorie deficit — making it the most powerful tool in your fat-loss arsenal.',
        body: `Protein is the building block of muscle, and when you're in a calorie deficit, your body needs adequate protein to preserve the muscle you already have.

When you eat fewer calories than you burn, your body needs energy from somewhere. Without enough protein, it turns to muscle tissue — exactly what you want to keep. Studies consistently show that high-protein diets (1.6–2.2g per kg of body weight) preserve lean mass during weight loss.

Beyond muscle preservation, protein has a high thermic effect: your body burns about 20–30% of the calories from protein just to digest it. Carbs and fats have much lower thermic effects (5–10% and 0–3% respectively).

Protein is also the most satiating macronutrient. High-protein meals reduce levels of the hunger hormone ghrelin more effectively than carb or fat-heavy meals. This means you naturally eat less throughout the day.

**Practical tip:** Aim for 30g of protein per meal. Good sources include chicken breast, Greek yogurt, eggs, lentils, and tofu.`,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
        readTime: '5 min read',
        date: 'April 10, 2026',
        author: 'Dr. Sarah Mitchell',
    },
    {
        id: 2,
        category: 'Weight Loss',
        title: 'The Only Rule for Fat Loss: Calorie Deficit Explained',
        excerpt: 'No matter which diet you follow — keto, paleo, intermittent fasting — fat loss comes down to one fundamental principle: burning more calories than you consume.',
        body: `Fat loss is remarkably simple at its core: you need to consume fewer calories than your body burns. This is called a calorie deficit. Despite the noise around different diets and protocols, every diet that works does so by creating a calorie deficit.

A 500-calorie daily deficit leads to roughly 0.5kg of fat loss per week. A 1000-calorie deficit doubles that. But extreme deficits come with costs: muscle loss, hormonal disruption, and fatigue.

The sweet spot for most people is a 300–500 calorie deficit. This creates meaningful fat loss while preserving muscle, energy, and sanity.

Tracking your intake is the most reliable way to maintain a deficit. Studies show people who consistently log their food lose significantly more weight than those who don't — simply because awareness prevents overeating.

**Your action step:** Use Nutrify's calorie calculator to find your maintenance calories, then eat 300–500 less per day.`,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
        readTime: '4 min read',
        date: 'April 8, 2026',
        author: 'James Carver',
    },
    {
        id: 3,
        category: 'Habit',
        title: 'Food Tracking Works — Here\'s the Science Behind It',
        excerpt: 'Research shows that people who track their meals consistently lose twice as much weight. Awareness is your most powerful habit.',
        body: `A landmark study by Kaiser Permanente followed nearly 1,700 participants over six months. Those who kept daily food diaries lost twice as much weight as those who kept no records.

Why? Tracking creates a "food-consciousness" feedback loop. When you know you'll be logging that handful of chips, you pause and reconsider. The simple act of writing it down makes unconscious eating conscious.

Tracking also removes the distortion of memory. Most people underestimate their daily intake by 20–40%. By logging meals in real time, you get an accurate picture of what you're actually eating.

Beyond calories, tracking macros reveals patterns: Are you consistently under on protein? Over on fat? These insights let you make targeted adjustments rather than guessing.

**Getting started:** You don't need to track forever. Most nutrition coaches recommend 4–8 weeks of consistent tracking to build an intuitive sense of portion sizes and macro composition.`,
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
        readTime: '3 min read',
        date: 'April 5, 2026',
        author: 'Emma Watts',
    },
    {
        id: 4,
        category: 'Performance',
        title: 'Carbohydrates Are Not the Enemy — Here\'s What the Research Says',
        excerpt: 'Despite their bad reputation, carbohydrates are the body\'s preferred fuel source for exercise and brain function. Learn how to use them strategically.',
        body: `Carbohydrates have been vilified by the diet industry for decades. But the science tells a more nuanced story.

Carbohydrates are the body's preferred energy source, especially for high-intensity exercise. Your brain runs almost exclusively on glucose — a carbohydrate. Cutting carbs too aggressively can impair focus, mood, and workout performance.

The type of carbohydrate matters enormously. Whole food sources — oats, sweet potatoes, rice, fruit, legumes — come packaged with fiber, vitamins, and minerals. Ultra-processed carbs like white bread and sugary drinks offer little beyond calories.

For most active individuals, 40–50% of calories from carbohydrates is a solid baseline. Athletes or those doing high-volume training may need significantly more.

**Strategic timing:** Eating carbohydrates around your workouts (30–60 minutes before, or within 2 hours after) maximises performance and recovery while minimising fat storage.`,
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
        readTime: '6 min read',
        date: 'April 2, 2026',
        author: 'Dr. Sarah Mitchell',
    },
    {
        id: 5,
        category: 'Mindset',
        title: 'How to Build a Sustainable Healthy Diet (Not Just a 4-Week Fix)',
        excerpt: 'Most diets fail because they\'re built for short-term results. Real, lasting change requires a different approach — one built around consistency, not perfection.',
        body: `The diet industry sells you the promise of transformation in 30 days. But sustainable health is built over years, not weeks.

The most successful long-term diet changes share common traits: they're flexible, enjoyable, and built around habits rather than rules. Rigid restriction leads to rebound eating. Gentle consistency leads to lasting change.

The 80/20 principle works beautifully for nutrition: eat nutrient-dense whole foods 80% of the time, and allow yourself freedom the other 20%. This removes the guilt that sabotages so many diets.

Progress, not perfection, is the mantra that actually works. One bad meal doesn't derail your week. One missed workout doesn't end your fitness journey. What matters is what you do consistently over months and years.

**Start small:** Pick one habit to build this week. Log your meals for 5 days. Add one serving of vegetables to each dinner. Walk for 20 minutes daily. Small wins compound into transformations.`,
        image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?auto=format&fit=crop&w=1200&q=80',
        readTime: '7 min read',
        date: 'March 28, 2026',
        author: 'Emma Watts',
    },
    {
        id: 6,
        category: 'Nutrition',
        title: 'Understanding Micronutrients: The Vitamins & Minerals You Actually Need',
        excerpt: 'Calories and macros get all the attention, but micronutrients are the unsung heroes of health, energy, and body composition.',
        body: `While tracking calories and macros is valuable, the micronutrient quality of your diet determines how you actually feel day to day.

Iron deficiency — the most common nutritional deficiency globally — causes fatigue, brain fog, and reduced exercise capacity. Vitamin D deficiency is linked to depression, weakened immunity, and poor bone health. Magnesium, often overlooked, plays a role in over 300 enzymatic reactions in the body.

The good news: you don't need supplements if you eat a varied whole-food diet. Dark leafy greens provide iron, calcium, and folate. Fatty fish delivers vitamin D and omega-3s. Nuts and seeds are rich in magnesium and zinc.

A practical heuristic: eat foods of many colours. Different pigments in plants correspond to different phytonutrients. A colourful plate is a nutrient-dense plate.

**Key micronutrients to prioritise:** Iron (red meat, lentils, spinach), Vitamin D (fatty fish, sunlight), Magnesium (nuts, dark chocolate, leafy greens), B12 (animal products or supplements if vegan), Zinc (oysters, pumpkin seeds, beef).`,
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
        readTime: '5 min read',
        date: 'March 25, 2026',
        author: 'James Carver',
    },
];

const CATEGORY_COLORS = {
    'Nutrition': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    'Weight Loss': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    'Habit': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
    'Performance': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    'Mindset': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
};

export default function Blogs() {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', ...new Set(BLOGS.map(b => b.category))];
    const filtered = activeCategory === 'All' ? BLOGS : BLOGS.filter(b => b.category === activeCategory);

    if (selectedBlog) {
        const colorClass = CATEGORY_COLORS[selectedBlog.category] || 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <button
                        onClick={() => setSelectedBlog(null)}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to articles
                    </button>

                    <article>
                        {/* Hero image */}
                        <div className="h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
                            <img
                                src={selectedBlog.image}
                                alt={selectedBlog.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}>
                                {selectedBlog.category}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-zinc-500">
                                <Clock className="w-3 h-3" />
                                {selectedBlog.readTime}
                            </span>
                            <span className="text-xs text-zinc-600">{selectedBlog.date}</span>
                            <span className="text-xs text-zinc-500 ml-auto">By {selectedBlog.author}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8">
                            {selectedBlog.title}
                        </h1>

                        {/* Body */}
                        <div className="prose prose-invert prose-zinc max-w-none">
                            {selectedBlog.body.split('\n\n').map((para, i) => {
                                if (para.startsWith('**') && para.endsWith('**')) {
                                    return (
                                        <p key={i} className="text-emerald-400 font-semibold text-base mt-6 mb-2">
                                            {para.replace(/\*\*/g, '')}
                                        </p>
                                    );
                                }
                                if (para.includes('**')) {
                                    const parts = para.split('**');
                                    return (
                                        <p key={i} className="text-zinc-300 leading-relaxed mb-4 text-base">
                                            {parts.map((part, j) =>
                                                j % 2 === 1
                                                    ? <strong key={j} className="text-white font-semibold">{part}</strong>
                                                    : part
                                            )}
                                        </p>
                                    );
                                }
                                return (
                                    <p key={i} className="text-zinc-300 leading-relaxed mb-4 text-base">
                                        {para}
                                    </p>
                                );
                            })}
                        </div>
                    </article>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Nutrition Insights</h1>
                    <p className="text-zinc-400">Evidence-based articles to help you eat smarter and live better</p>
                </div>

                {/* Category filter */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                activeCategory === cat
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured article (first one) */}
                {activeCategory === 'All' && (
                    <div
                        onClick={() => setSelectedBlog(filtered[0])}
                        className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all mb-6 sm:flex"
                    >
                        <div className="sm:w-80 h-48 sm:h-auto flex-shrink-0 overflow-hidden">
                            <img
                                src={filtered[0].image}
                                alt={filtered[0].title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[filtered[0].category] || ''}`}>
                                    {filtered[0].category}
                                </span>
                                <span className="text-xs text-zinc-600 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {filtered[0].readTime}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-3">
                                {filtered[0].title}
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-4">
                                {filtered[0].excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-zinc-600">
                                <span>{filtered[0].author}</span>
                                <span>·</span>
                                <span>{filtered[0].date}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {(activeCategory === 'All' ? filtered.slice(1) : filtered).map((blog) => {
                        const colorClass = CATEGORY_COLORS[blog.category] || 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
                        return (
                            <article
                                key={blog.id}
                                onClick={() => setSelectedBlog(blog)}
                                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer hover:border-zinc-700 transition-all"
                            >
                                <div className="h-44 overflow-hidden">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colorClass}`}>
                                            {blog.category}
                                        </span>
                                        <span className="text-xs text-zinc-600 flex items-center gap-1 ml-auto">
                                            <Clock className="w-3 h-3" />
                                            {blog.readTime}
                                        </span>
                                    </div>
                                    <h2 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-2 line-clamp-2">
                                        {blog.title}
                                    </h2>
                                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 mb-4">
                                        {blog.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-zinc-600">
                                        <span>{blog.author}</span>
                                        <span>·</span>
                                        <span>{blog.date}</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}
