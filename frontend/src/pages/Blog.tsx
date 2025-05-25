import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';


// ---------------------- Blog Page ---------------------- //
export const Blog: React.FC = () => {
  // Expanded mock blog posts data
  const mockBlogPosts = [
    {
      id: '1',
      title: 'The Evolution of Street Food Culture',
      image: 'https://images.unsplash.com/photo-1440427810006-0e4109fd4abe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      excerpt:
        'An in-depth look at how street food has transformed urban dining, blending tradition with innovation to create dynamic culinary experiences.',
      content:
        'In the heart of every bustling city, street food has evolved from simple vendors to a vibrant culinary phenomenon. Discover the stories behind iconic food trucks, learn about the innovative techniques they use, and explore how cultural diversity influences the flavors of urban street cuisine. This journey highlights both tradition and modernity, offering insights into how food trucks continue to redefine local dining.',
    },
    {
      id: '2',
      title: '5 Must-Try Food Trucks in Your City',
      image: 'https://images.unsplash.com/photo-1509315703195-529879416a7d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      excerpt:
        'Discover a curated list of top food trucks serving mouth-watering dishes that are taking the culinary scene by storm.',
      content:
        'Our city is teeming with culinary treasures on wheels. In this article, we highlight five food trucks that have captured the attention of food enthusiasts with their unique menus and innovative approaches to street dining. From gourmet fusion to comfort classics, each truck offers a distinct flavor journey that promises to delight your taste buds.',
    },
    {
      id: '3',
      title: 'Sustainable Eating: A New Wave in Street Food',
      image: 'https://plus.unsplash.com/premium_photo-1705056543788-51f325b0a71f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      excerpt:
        'Explore how sustainable practices are reshaping the street food industry, driving a movement toward eco-conscious dining.',
      content:
        'Sustainable eating has become a cornerstone in the evolution of street food. With vendors embracing environmentally friendly practices—from compostable packaging to locally sourced ingredients—this shift is transforming how we think about our meals. In this post, we delve into the benefits of sustainable practices, examine case studies of successful green initiatives, and discuss the future of eco-friendly street food.',
    },
    {
      id: '4',
      title: 'Behind the Scenes: A Day in the Life of a Food Truck Owner',
      image: 'https://plus.unsplash.com/premium_photo-1683140415482-0e58f2bfde17?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D://source.unsplash.com/800x600/?food-truck,behind-scenes',
      excerpt:
        'Step inside the world of a food truck owner and uncover the challenges, triumphs, and passion that drive this unique business.',
      content:
        'Running a food truck is a blend of art, business, and relentless dedication. In this behind-the-scenes look, we follow a day in the life of a food truck owner—from early morning preparations and menu planning to engaging with customers and overcoming unexpected hurdles. This story not only celebrates the creativity behind every truck but also highlights the perseverance required to succeed in a competitive market.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="font-serif text-5xl font-bold text-foodtruck-teal mb-4">
              Blog
            </h1>
            <p className="max-w-2xl mx-auto text-foodtruck-slate text-lg">
              Welcome to our blog where we share in-depth insights, personal stories, and the latest trends from the world of street food.
            </p>
          </header>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {mockBlogPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                <img src={post.image} alt={post.title} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h2 className="font-bold text-2xl text-foodtruck-teal mb-3">{post.title}</h2>
                  <p className="text-foodtruck-slate text-base mb-4">{post.excerpt}</p>
                  <div className="border-t border-foodtruck-slate/20 pt-4">
                    <p className="text-foodtruck-slate text-sm">{post.content}</p>
                  </div>
                  <div className="mt-4 text-right">
                    <Link to={`/blog/${post.id}`} className="text-foodtruck-gold font-semibold hover:underline">
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;