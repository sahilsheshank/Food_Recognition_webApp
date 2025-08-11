import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Eye, Heart, MessageCircle } from 'lucide-react';
import Layout from '../../components/Layout/Layout';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const data = await response.json();

            // Enhance the data with additional mock properties for better design
            const enhancedBlogs = data.slice(0, 12).map((blog, index) => ({
                ...blog,
                author: `Author ${(index % 5) + 1}`,
                date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                readTime: `${Math.floor(Math.random() * 10) + 2} min read`,
                views: Math.floor(Math.random() * 1000) + 100,
                likes: Math.floor(Math.random() * 50) + 5,
                comments: Math.floor(Math.random() * 20) + 1,
                category: ['Technology', 'Design', 'Development', 'Business', 'Lifestyle'][index % 5],
                image: `https://picsum.photos/800/400?random=${index + 1}`
            }));

            setBlogs(enhancedBlogs);
        } catch (err) {
            setError('Failed to fetch blogs');
        } finally {
            setLoading(false);
        }
    };

    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
    };

    const handleBackClick = () => {
        setSelectedBlog(null);
    };

    if (loading) {
        return (
            <Layout>

                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
                        <p className="text-lg text-gray-600 font-medium">Loading amazing content...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>

                <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-2xl">⚠</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={fetchBlogs}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (selectedBlog) {
        return (
            <Layout>

                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-8 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <ArrowLeft size={20} />
                            Back to all posts
                        </button>

                        <article className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="relative h-96 overflow-hidden">
                                <img
                                    src={selectedBlog.image}
                                    alt={selectedBlog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <div className="absolute bottom-6 left-6 text-white">
                                    <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                                        {selectedBlog.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 lg:p-12">
                                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                    {selectedBlog.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <User size={18} />
                                        <span className="font-medium">{selectedBlog.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} />
                                        <span>{selectedBlog.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye size={18} />
                                        <span>{selectedBlog.views} views</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1">
                                            <Heart size={18} className="text-red-500" />
                                            <span>{selectedBlog.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle size={18} className="text-blue-500" />
                                            <span>{selectedBlog.comments}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="prose prose-lg max-w-none">
                                    <p className="text-xl text-gray-700 leading-relaxed mb-6 font-light">
                                        {selectedBlog.body}
                                    </p>

                                    {/* Extended content for demonstration */}
                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    </p>

                                    <p className="text-gray-700 leading-relaxed mb-6">
                                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                                    </p>

                                    <blockquote className="border-l-4 border-blue-600 pl-6 italic text-gray-700 my-8 text-lg">
                                        "The best way to predict the future is to create it. Innovation comes from those who dare to think differently."
                                    </blockquote>

                                    <p className="text-gray-700 leading-relaxed">
                                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>

            <div className="min-h-screen">
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                            Fitness Blogs
                        </h1>
                        <p className="text-xl text-white max-w-2xl mx-auto leading-relaxed">
                            Discover amazing stories, insights, and ideas from our community of writers
                        </p>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog) => (
                            <article
                                key={blog.id}
                                onClick={() => handleBlogClick(blog)}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-2 hover:scale-[1.02]"
                            >
                                <div className="relative overflow-hidden h-48">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                                            {blog.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {blog.title}
                                    </h2>

                                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                        {blog.body}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{blog.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>{blog.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Heart size={14} className="text-red-400" />
                                                <span>{blog.likes}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye size={14} />
                                                <span>{blog.views}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <span className="text-blue-600 text-sm font-medium group-hover:text-purple-700 transition-colors">
                                            {blog.readTime} →
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>



                </div>
            </div>
        </Layout>
    );
}