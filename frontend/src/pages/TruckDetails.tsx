import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Instagram, 
  Twitter, 
  Heart, 
  Share2,
  Calendar,
  DollarSign,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock food truck data map with different trucks
const mockTruckDataMap = {
  // Delhi Delights (from nearby trucks)
  'delhi-delights': {
    id: 'delhi-delights',
    name: 'Delhi Delights',
    description: 'Authentic North Indian street food with a modern twist. Our chef uses traditional family recipes with locally-sourced ingredients to create unforgettable curries, tikkas, and naan breads.',
    images: [
      'https://images.unsplash.com/photo-1585937421612-70a008356c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2036&q=80',
      'https://images.unsplash.com/photo-1542367592-8849eb950fd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    ],
    cuisine: 'North Indian',
    rating: 4.8,
    reviewCount: 132,
    phone: '(555) 123-4567',
    website: 'www.delhidelights.com',
    socials: {
      instagram: '@delhidelights',
      twitter: '@delhidelights',
    },
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Park' },
      { day: 'Wednesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Lake' },
      { day: 'Thursday', hours: '11:00 AM - 8:00 PM', location: 'Near the Campus' },
      { day: 'Friday', hours: '11:00 AM - 10:00 PM', location: 'Near the Arts Area' },
      { day: 'Saturday', hours: '12:00 PM - 10:00 PM', location: 'Near the Market' },
      { day: 'Sunday', hours: '12:00 PM - 6:00 PM', location: 'Near the River' },
    ],
    menu: [
      {
        category: 'Main Dishes',
        items: [
          { name: 'Butter Chicken', description: 'Tender chicken in creamy tomato sauce with butter and spices', price: 350 },
          { name: 'Paneer Tikka Masala', description: 'Grilled cottage cheese in spiced tomato gravy', price: 300 },
          { name: 'Chole Bhature', description: 'Spicy chickpea curry with fried bread', price: 270 },
          { name: 'Dal Makhani', description: 'Black lentils cooked with butter and cream', price: 280 },
        ]
      },
      {
        category: 'Breads',
        items: [
          { name: 'Butter Naan', description: 'Leavened bread brushed with butter', price: 50 },
          { name: 'Garlic Naan', description: 'Leavened bread with garlic and herbs', price: 70 },
        ]
      },
      {
        category: 'Sides',
        items: [
          { name: 'Raita', description: 'Yogurt with cucumber and mint', price: 100 },
          { name: 'Mixed Pickle', description: 'Assorted vegetables pickled in oil and spices', price: 80 },
          { name: 'Papadum', description: 'Crispy lentil wafers', price: 60 },
        ]
      },
      {
        category: 'Drinks',
        items: [
          { name: 'Mango Lassi', description: 'Sweet yogurt drink with mango pulp', price: 120 },
          { name: 'Masala Chai', description: 'Spiced Indian tea with milk', price: 80 },
          { name: 'Sweet Lime Soda', description: 'Refreshing lime drink with soda', price: 100 },
        ]
      },
    ],
  },
  
  // Wok Wonder (from nearby trucks)
  'wok-wonder': {
    id: 'wok-wonder',
    name: 'Wok Wonder',
    description: 'Authentic Chinese stir-fry dishes and dumplings prepared in traditional woks. We bring the vibrant flavors of China with fresh ingredients and traditional cooking techniques.',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80',
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    ],
    cuisine: 'Chinese',
    rating: 4.5,
    reviewCount: 89,
    phone: '(555) 234-5678',
    website: 'www.wokwonder.com',
    socials: {
      instagram: '@wokwonderfoods',
      twitter: '@wokwonderfoods',
    },
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '11:00 AM - 7:00 PM', location: 'Near the Business Area' },
      { day: 'Wednesday', hours: '11:00 AM - 7:00 PM', location: 'Near the Park' },
      { day: 'Thursday', hours: '11:00 AM - 7:00 PM', location: 'Near the University' },
      { day: 'Friday', hours: '11:00 AM - 9:00 PM', location: 'Near the Truck Area' },
      { day: 'Saturday', hours: '12:00 PM - 9:00 PM', location: 'Near the Weekend Market' },
      { day: 'Sunday', hours: '12:00 PM - 6:00 PM', location: 'Near the City Park' },
    ],
    menu: [
      {
        category: 'Starters',
        items: [
          { name: 'Spring Rolls', description: 'Crispy rolls filled with vegetables and served with sweet chili sauce', price: 180 },
          { name: 'Dim Sum Platter', description: 'Assorted steamed dumplings with dipping sauces', price: 350 },
          { name: 'Crispy Wontons', description: 'Fried wontons filled with spiced vegetables', price: 200 },
        ]
      },
      {
        category: 'Main Dishes',
        items: [
          { name: 'Kung Pao Chicken', description: 'Spicy stir-fried chicken with peanuts and vegetables', price: 320 },
          { name: 'Vegetable Hakka Noodles', description: 'Stir-fried noodles with mixed vegetables', price: 280 },
          { name: 'Schezwan Fried Rice', description: 'Spicy fried rice with vegetables and Schezwan sauce', price: 250 },
        ]
      },
      {
        category: 'Specialty Dishes',
        items: [
          { name: 'Mapo Tofu', description: 'Spicy tofu in a flavorful sauce', price: 280 },
          { name: 'Honey Chili Potato', description: 'Crispy potatoes tossed in sweet and spicy sauce', price: 220 },
          { name: 'Chili Paneer', description: 'Cottage cheese in spicy soy-based sauce', price: 290 },
        ]
      },
      {
        category: 'Drinks',
        items: [
          { name: 'Jasmine Tea', description: 'Traditional Chinese tea', price: 120 },
          { name: 'Lychee Bubble Tea', description: 'Sweet lychee tea with tapioca pearls', price: 180 },
          { name: 'Cucumber Lemonade', description: 'Refreshing lemonade with cucumber', price: 150 },
        ]
      },
    ],
  },
  
  // Spice Route (from nearby trucks)
  'spice-route': {
    id: 'spice-route',
    name: 'Spice Route',
    description: 'Experience the rich flavors of South India with our authentic dosas, idlis, and vadas. Our chef brings generations of family recipes to create a taste of South Indian cuisine that combines tradition with modern flair.',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80',
      'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1610192244261-3f33de3f447e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2073&q=80',
    ],
    cuisine: 'South Indian',
    rating: 4.7,
    reviewCount: 76,
    phone: '(555) 345-6789',
    website: 'www.spiceroute.com',
    socials: {
      instagram: '@spiceroute',
      twitter: '@spiceroute',
    },
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '11:30 AM - 8:00 PM', location: 'Near the Central Area' },
      { day: 'Wednesday', hours: '11:30 AM - 8:00 PM', location: 'Near the Innovation Hub' },
      { day: 'Thursday', hours: '11:30 AM - 8:00 PM', location: 'Near the Office Park' },
      { day: 'Friday', hours: '11:30 AM - 9:00 PM', location: 'Near the Waterfront' },
      { day: 'Saturday', hours: '12:00 PM - 9:00 PM', location: 'Near the Community Market' },
      { day: 'Sunday', hours: '12:00 PM - 7:00 PM', location: 'Near the Cultural Festival Grounds' },
    ],
    menu: [
      {
        category: 'Dosas',
        items: [
          { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potatoes', price: 180 },
          { name: 'Mysore Masala Dosa', description: 'Dosa with spicy chutney and potato filling', price: 200 },
          { name: 'Ghee Roast Dosa', description: 'Crispy dosa roasted with ghee', price: 220 },
          { name: 'Cheese Dosa', description: 'Dosa filled with cheese and spiced potatoes', price: 250 },
        ]
      },
      {
        category: 'Idli & Vada',
        items: [
          { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup and chutney', price: 140 },
          { name: 'Vada Sambar', description: 'Fried lentil donuts with sambar and chutney', price: 150 },
          { name: 'Mini Idli Sambar', description: 'Tiny steamed rice cakes in spiced sambar', price: 160 },
        ]
      },
      {
        category: 'Rice Dishes',
        items: [
          { name: 'Curd Rice', description: 'Rice mixed with yogurt and tempering', price: 170 },
          { name: 'Lemon Rice', description: 'Rice with lemon juice and tempering', price: 160 },
          { name: 'Tomato Rice', description: 'Rice cooked with tomatoes and spices', price: 180 },
        ]
      },
      {
        category: 'Drinks',
        items: [
          { name: 'Filter Coffee', description: 'Traditional South Indian coffee', price: 80 },
          { name: 'Buttermilk', description: 'Spiced yogurt drink', price: 70 },
          { name: 'Tender Coconut Water', description: 'Fresh coconut water', price: 90 },
        ]
      },
    ],
  },

  // Dragon Express (from nearby trucks)
  'dragon-express': {
    id: 'dragon-express',
    name: 'Dragon Express',
    description: 'Fast and flavorful Chinese cuisine featuring wok-fired stir-fries and hand-pulled noodles. We create authentic Chinese dishes with a modern twist using fresh, locally-sourced ingredients.',
    images: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2080&q=80',
      'https://images.unsplash.com/photo-1541696490-8744a5dc0228?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    ],
    cuisine: 'Chinese',
    rating: 4.3,
    reviewCount: 45,
    phone: '(555) 456-7890',
    website: 'www.dragonexpress.com',
    socials: {
      instagram: '@dragonexpress',
      twitter: '@dragonexpress',
    },
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Financial District' },
      { day: 'Wednesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Technology Park' },
      { day: 'Thursday', hours: '11:00 AM - 8:00 PM', location: 'Near the Business Center' },
      { day: 'Friday', hours: '11:00 AM - 10:00 PM', location: 'Near the Nightlife District' },
      { day: 'Saturday', hours: '12:00 PM - 10:00 PM', location: 'Near the Weekend Bazaar' },
      { day: 'Sunday', hours: '12:00 PM - 7:00 PM', location: 'Near the Family Park' },
    ],
    menu: [
      {
        category: 'Noodles',
        items: [
          { name: 'Chow Mein', description: 'Stir-fried noodles with vegetables and choice of protein', price: 240 },
          { name: 'Dan Dan Noodles', description: 'Spicy Sichuan noodles with minced vegetables', price: 260 },
          { name: 'Singapore Noodles', description: 'Thin rice noodles with curry flavor and vegetables', price: 280 },
        ]
      },
      {
        category: 'Rice Dishes',
        items: [
          { name: 'Veg Fried Rice', description: 'Stir-fried rice with mixed vegetables', price: 220 },
          { name: 'Chicken Fried Rice', description: 'Stir-fried rice with chicken and vegetables', price: 250 },
          { name: 'Egg Fried Rice', description: 'Stir-fried rice with scrambled eggs', price: 230 },
        ]
      },
      {
        category: 'Main Dishes',
        items: [
          { name: 'Manchurian', description: 'Fried vegetable balls in a tangy sauce', price: 280 },
          { name: 'Chili Paneer', description: 'Cottage cheese with bell peppers in spicy sauce', price: 300 },
          { name: 'Sweet and Sour Vegetables', description: 'Mixed vegetables in sweet and sour sauce', price: 260 },
        ]
      },
      {
        category: 'Drinks',
        items: [
          { name: 'Green Tea', description: 'Traditional Chinese green tea', price: 90 },
          { name: 'Lychee Ice Tea', description: 'Sweet iced tea with lychee flavor', price: 150 },
          { name: 'Mango Smoothie', description: 'Fresh mango blended with ice', price: 180 },
        ]
      },
    ],
  },

  // Masala Magic (from trending trucks)
  'masala-magic': {
    id: 'masala-magic',
    name: 'Masala Magic',
    description: 'A culinary journey through North India with authentic spices and traditional recipes. Our chef brings generations of family secrets to create a magical experience of flavors and aromas.',
    images: [
      'https://media.istockphoto.com/id/465015726/photo/dabba-masala.jpg?s=612x612&w=0&k=20&c=QbZ2KHUJpVTo4eLkzELdyE9YrLU1X0eDDoAs290g7_k=',
      'https://c8.alamy.com/comp/M99N7D/many-spices-on-display-in-bowls-trays-filled-with-herbs-signs-garam-masala-paprika-turmeric-mixes-M99N7D.jpg',
    ],
    cuisine: 'North Indian',
    rating: 4.9,
    reviewCount: 213,
    phone: '9567008901',
    website: 'www.masalamagic.com',
    socials: {
      instagram: '@masalamagictruck',
      twitter: '@masalamagictruck',
    },
    schedule: [
      { day: 'Monday', hours: '11:00 AM - 8:00 PM', location: 'Near the City Center' },
      { day: 'Tuesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Tech Hub' },
      { day: 'Wednesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Business Park' },
      { day: 'Thursday', hours: '11:00 AM - 8:00 PM', location: 'Near the University Area' },
      { day: 'Friday', hours: '11:00 AM - 9:00 PM', location: 'Near the Downtown' },
      { day: 'Saturday', hours: '12:00 PM - 9:00 PM', location: 'Near the Art District' },
      { day: 'Sunday', hours: '12:00 PM - 7:00 PM', location: 'Near the Family Park' },
    ],
    menu: [
      {
        category: 'Curries',
        items: [
          { name: 'Butter Chicken', description: 'Tender chicken in a creamy tomato-based sauce', price: 320 },
          { name: 'Palak Paneer', description: 'Cottage cheese in a spinach gravy', price: 280 },
          { name: 'Lamb Curry', description: 'Tender lamb in a rich onion and tomato gravy', price: 380 },
          { name: 'Dal Makhani', description: 'Black lentils simmered with cream and spices', price: 250 },
        ]
      },
      {
        category: 'Breads & Rice',
        items: [
          { name: 'Garlic Naan', description: 'Leavened bread with garlic and butter', price: 70 },
          { name: 'Butter Naan', description: 'Leavened bread with butter', price: 60 },
          { name: 'Jeera Rice', description: 'Basmati rice with cumin seeds', price: 150 },
          { name: 'Chicken Biryani', description: 'Fragrant rice with chicken and spices', price: 320 },
        ]
      },
      {
        category: 'Appetizers',
        items: [
          { name: 'Vegetable Samosas', description: 'Crispy pastry with spiced potato filling', price: 120 },
          { name: 'Chicken Tikka', description: 'Grilled marinated chicken pieces', price: 250 },
          { name: 'Onion Bhaji', description: 'Crispy onion fritters', price: 150 },
        ]
      },
      {
        category: 'Drinks',
        items: [
          { name: 'Mango Lassi', description: 'Yogurt drink with mango pulp', price: 130 },
          { name: 'Masala Chai', description: 'Spiced Indian tea', price: 80 },
          { name: 'Rose Sherbet', description: 'Refreshing rose-flavored drink', price: 100 },
        ]
      },
    ],
  },

  // Dim Sum Dynasty (updated from Chaat Chowk)
  'dim-sum-dynasty': {
    id: 'dim-sum-dynasty',
    name: 'Dim Sum Dynasty',
    description: 'Experience the authentic flavors of Chinese dim sum with our handcrafted dumplings, buns, and small plates. Each dish is carefully prepared using traditional techniques and the freshest ingredients.',
    images: [
      'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80',
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
    ],
    cuisine: 'Chinese',
    rating: 4.7,
    reviewCount: 156,
    phone: '6780009012',
    website: 'www.dimsumdynasty.com',
    socials: {
      instagram: '@dimsumdynasty',
      twitter: '@dimsumdynasty',
    },
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '12:00 PM - 8:00 PM', location: 'Near the Business District' },
      { day: 'Wednesday', hours: '12:00 PM - 8:00 PM', location: 'Near the Tech Campus' },
      { day: 'Thursday', hours: '12:00 PM - 8:00 PM', location: 'Near the University Quarter' },
      { day: 'Friday', hours: '12:00 PM - 9:00 PM', location: 'Near the Food Truck Park' },
      { day: 'Saturday', hours: '11:00 AM - 9:00 PM', location: 'Near the Weekend Market' },
      { day: 'Sunday', hours: '11:00 AM - 7:00 PM', location: 'Near the Cultural Festival' },
    ],
    menu: [
      {
        category: 'Dumplings',
        items: [
          { name: 'Har Gow', description: 'Steamed shrimp dumplings with translucent skin', price: 220 },
          { name: 'Siu Mai', description: 'Open-faced dumplings with minced vegetables', price: 200 },
          { name: 'Potstickers', description: 'Pan-fried dumplings with vegetable filling', price: 180 },
          { name: 'Xiao Long Bao', description: 'Soup dumplings with vegetable filling', price: 250 },
        ]
      },
      {
        category: 'Buns & Rolls',
        items: [
          { name: 'Char Siu Bao', description: 'Steamed buns with BBQ filling', price: 150 },
          { name: 'Vegetable Spring Rolls', description: 'Crispy rolls with mixed vegetables', price: 180 },
          { name: 'Scallion Pancakes', description: 'Flaky pancakes with scallions', price: 160 },
        ]
      },
      {
        category: 'Rice & Noodles',
        items: [
          { name: 'Cheung Fun', description: 'Rice noodle rolls with various fillings', price: 220 },
          { name: 'Lo Mai Gai', description: 'Sticky rice wrapped in lotus leaf', price: 240 },
          { name: 'Vegetable Fried Rice', description: 'Wok-tossed rice with mixed vegetables', price: 200 },
        ]
      },
      {
        category: 'Drinks',
        items: [
          { name: 'Jasmine Tea', description: 'Traditional Chinese tea', price: 100 },
          { name: 'Chrysanthemum Tea', description: 'Herbal tea with honey', price: 120 },
          { name: 'Almond Milk', description: 'Sweet almond-flavored milk', price: 150 },
        ]
      },
    ],
  },
  
  // Keep other existing truck data with similar updates
  'mithai-junction': {
    id: 'mithai-junction',
    name: 'Mithai Junction',
    description: 'A sweet paradise featuring traditional Indian desserts made with authentic recipes. Our sweets are prepared daily with fresh ingredients and just the right amount of sweetness.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Street_shop_for_sweets%2C_mithai_Rajasthan_India.jpg/2560px-Street_shop_for_sweets%2C_mithai_Rajasthan_India.jpg',
      'https://thumbs.dreamstime.com/b/sweet-shop-traditional-prague-czech-republic-84550413.jpg',
      
    ],
    cuisine: 'Dessert',
    rating: 4.8,
    reviewCount: 178,
    phone: '7890000123',
    website: 'www.mithaijunction.com',
    socials: {
      instagram: '@mithaijunction',
      twitter: '@mithaijunction',
    },
    menu: [
      {
        category: 'Traditional Sweets',
        items: [
          { name: 'Gulab Jamun', description: 'Soft milk solids balls soaked in sugar syrup', price: 120 },
          { name: 'Jalebi', description: 'Crispy swirls soaked in saffron sugar syrup', price: 100 },
          { name: 'Rasgulla', description: 'Soft cottage cheese balls in sugar syrup', price: 120 },
          { name: 'Kaju Katli', description: 'Diamond-shaped cashew fudge', price: 180 },
        ]
      },
      {
        category: 'Milk Specialties',
        items: [
          { name: 'Kulfi', description: 'Traditional Indian ice cream in various flavors', price: 150 },
          { name: 'Rasmalai', description: 'Cottage cheese patties in sweetened milk', price: 190 },
          { name: 'Rabri', description: 'Sweetened thickened milk with nuts', price: 160 },
        ]
      },
      {
        category: 'Snack Sweets',
        items: [
          { name: 'Besan Ladoo', description: 'Chickpea flour and ghee balls', price: 130 },
          { name: 'Mysore Pak', description: 'Ghee-based gram flour sweet', price: 140 },
          { name: 'Chum Chum', description: 'Cottage cheese sweet with coconut', price: 120 },
        ]
      },
      {
        category: 'Beverages',
        items: [
          { name: 'Masala Chai', description: 'Spiced Indian tea', price: 90 },
          { name: 'Badam Milk', description: 'Almond-flavored milk', price: 120 },
          { name: 'Thandai', description: 'Spiced milk drink with nuts', price: 130 },
        ]
      },
    ],
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '12:00 PM - 8:00 PM', location: 'Near the Commercial Avenue' },
      { day: 'Wednesday', hours: '12:00 PM - 8:00 PM', location: 'Near the Innovation Center' },
      { day: 'Thursday', hours: '12:00 PM - 8:00 PM', location: 'Near the College Campus' },
      { day: 'Friday', hours: '12:00 PM - 9:00 PM', location: 'Near the Shopping District' },
      { day: 'Saturday', hours: '11:00 AM - 9:00 PM', location: 'Near the Cultural Fair' },
      { day: 'Sunday', hours: '11:00 AM - 7:00 PM', location: 'Near the Festival Grounds' },
    ],
  },
  
  'dosa-darbar': {
    id: 'dosa-darbar',
    name: 'Dosa Darbar',
    description: 'Authentic South Indian cuisine featuring a variety of dosas, uttapams, and idlis. We bring the flavors of South India with traditional recipes and fresh ingredients.',
    images: [
      'https://b.zmtcdn.com/data/pictures/4/2900204/b8c7e1aa94cb74bb45a7b23a22b022e5_o2_featured_v2.jpg',
      'https://b.zmtcdn.com/data/pictures/0/18788770/af8be39506fa794bb200cf840188cd38_o2_featured_v2.jpg',
      'https://media.istockphoto.com/id/1156896083/photo/cheese-masala-dosa-recipe-with-sambar-and-chutney-selective-focus.jpg?s=612x612&w=0&k=20&c=Wyy0uUGXfQn7JstC8w0DsxWJVGnqWUJUCG53a42UH9s=',
    ],
    cuisine: 'South Indian',
    rating: 4.6,
    reviewCount: 124,
    phone: '8900001234',
    website: 'www.dosadarbar.com',
    socials: {
      instagram: '@dosadarbar',
      twitter: '@dosadarbar',
    },
    menu: [
      {
        category: 'Dosas',
        items: [
          { name: 'Masala Dosa', description: 'Crispy rice crepe filled with spiced potatoes', price: 180 },
          { name: 'Mysore Masala Dosa', description: 'Spicy crepe with red chutney and potato filling', price: 200 },
          { name: 'Plain Dosa', description: 'Classic crispy rice crepe', price: 150 },
          { name: 'Ghee Roast Dosa', description: 'Extra crispy dosa roasted with ghee', price: 220 },
        ]
      },
      {
        category: 'Uttapams',
        items: [
          { name: 'Onion Uttapam', description: 'Thick rice pancake with onions', price: 160 },
          { name: 'Mixed Vegetable Uttapam', description: 'Thick rice pancake with mixed vegetables', price: 180 },
          { name: 'Tomato Uttapam', description: 'Thick rice pancake with tomatoes', price: 160 },
        ]
      },
      {
        category: 'Idlis & Vadas',
        items: [
          { name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 140 },
          { name: 'Medu Vada', description: 'Savory fried lentil donuts', price: 120 },
          { name: 'Rava Idli', description: 'Semolina steamed cakes', price: 150 },
        ]
      },
      {
        category: 'Beverages',
        items: [
          { name: 'Filter Coffee', description: 'Traditional South Indian coffee', price: 90 },
          { name: 'Buttermilk', description: 'Spiced yogurt drink', price: 70 },
          { name: 'Badam Milk', description: 'Almond-flavored milk', price: 100 },
        ]
      },
    ],
    schedule: [
      { day: 'Monday', hours: '8:00 AM - 3:00 PM', location: 'Near the Business Park' },
      { day: 'Tuesday', hours: '8:00 AM - 3:00 PM', location: 'Near the Tech Campus' },
      { day: 'Wednesday', hours: '8:00 AM - 3:00 PM', location: 'Near the Office Complex' },
      { day: 'Thursday', hours: '8:00 AM - 3:00 PM', location: 'Near the University Area' },
      { day: 'Friday', hours: '8:00 AM - 3:00 PM', location: 'Near the Commercial Center' },
      { day: 'Saturday', hours: '8:00 AM - 5:00 PM', location: 'Near the Weekend Market' },
      { day: 'Sunday', hours: '8:00 AM - 2:00 PM', location: 'Near the Farmers Market' },
    ],
  },

  'Chinese-bites': {
    id: 'Chinese-bites',
    name: 'Chinese-bites',
    description: 'A taste of authentic Northern Chinese cuisine with a variety of noodles, dumplings, and flavorful dishes. Our recipes are inspired by traditional Beijing cooking methods and flavors.',
    images: [
      'https://media.istockphoto.com/id/1329630778/photo/asian-cuisine.jpg?s=612x612&w=0&k=20&c=tbRAbvZvmw87LWS0BgET6-7shMMHpZ9DeKg3SQI7CHQ=',
      'https://media.istockphoto.com/id/1334115358/photo/cabbage-manchurian.jpg?s=612x612&w=0&k=20&c=lZvW1lWr03mQszDbx4v59IAnxWacQ_Ti275hjj18hcE=',
      'https://media.istockphoto.com/id/843820560/photo/cooked-curries-on-display-at-camden-market-in-london.jpg?s=612x612&w=0&k=20&c=DRxjHULXQyHoh-0ETKy7EPsnsUhcjp5z1ta_Hy2B2p8=',
    ],
    cuisine: 'Chinese',
    rating: 4.5,
    reviewCount: 97,
    menu: [
      {
        category: 'Noodles & Dumplings',
        items: [
          { name: 'Hand-Pulled Noodles', description: 'Fresh noodles served with choice of sauce', price: 220 },
          { name: 'Jiaozi Dumplings', description: 'Steamed or pan-fried dumplings with vegetable filling', price: 200 },
          { name: 'Zhajiang Noodles', description: 'Noodles with bean sauce and vegetables', price: 240 },
          { name: 'Wonton Soup', description: 'Clear broth with vegetable wontons', price: 180 },
        ]
      },
      {
        category: 'Main Dishes',
        items: [
          { name: 'Kung Pao Tofu', description: 'Tofu with peanuts and vegetables in spicy sauce', price: 260 },
          { name: 'Hot and Sour Vegetables', description: 'Mixed vegetables in tangy spicy sauce', price: 240 },
          { name: 'Mapo Tofu', description: 'Soft tofu in spicy sauce', price: 250 },
        ]
      },
      {
        category: 'Rice Dishes',
        items: [
          { name: 'Beijing Fried Rice', description: 'Wok-fried rice with egg and vegetables', price: 210 },
          { name: 'Mushroom Rice', description: 'Steamed rice with mixed mushrooms', price: 230 },
          { name: 'Vegetable Clay Pot Rice', description: 'Rice cooked with vegetables in clay pot', price: 250 },
        ]
      },
      {
        category: 'Beverages',
        items: [
          { name: 'Oolong Tea', description: 'Traditional Chinese oolong tea', price: 100 },
          { name: 'Plum Juice', description: 'Sweet and sour plum-flavored drink', price: 120 },
          { name: 'Soybean Milk', description: 'Traditional Chinese soybean drink', price: 110 },
        ]
      },
    ],
    schedule: [
      { day: 'Monday', hours: 'Closed' },
      { day: 'Tuesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Downtown' },
      { day: 'Wednesday', hours: '11:00 AM - 8:00 PM', location: 'Near the Corporate Park' },
      { day: 'Thursday', hours: '11:00 AM - 8:00 PM', location: 'Near the Tech Hub' },
      { day: 'Friday', hours: '11:00 AM - 9:00 PM', location: 'Near the Food Court' },
      { day: 'Saturday', hours: '12:00 PM - 9:00 PM', location: 'Near the Market Plaza' },
      { day: 'Sunday', hours: '12:00 PM - 7:00 PM', location: 'Near the Community Park' },
    ],
    phone: '(555) 901-2345',
    website: 'www.beijingbites.com',
    socials: {
      instagram: '@beijingbites',
      twitter: '@beijingbites',
    },
  },

  'lassi-lovers': {
    id: 'lassi-lovers',
    name: 'Lassi Lovers',
    description: 'Refreshing traditional Indian yogurt drinks in various flavors along with light snacks. Our lassis are made with fresh yogurt and natural ingredients for a perfect refreshment.',
    images: [
      'https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
      'https://c8.alamy.com/comp/E9F81N/three-cups-of-lassi-at-the-blue-lassi-shop-varanasi-uttar-pradesh-E9F81N.jpg',
      
    ],
    cuisine: 'Beverages',
    rating: 4.4,
    reviewCount: 85,
    menu: [
      {
        category: 'Sweet Lassis',
        items: [
          { name: 'Mango Lassi', description: 'Yogurt blended with mango pulp and sugar', price: 120 },
          { name: 'Rose Lassi', description: 'Yogurt blended with rose syrup and sugar', price: 110 },
          { name: 'Malai Lassi', description: 'Creamy yogurt blended with sugar and topped with cream', price: 130 },
          { name: 'Strawberry Lassi', description: 'Yogurt blended with strawberry and sugar', price: 130 },
        ]
      },
      {
        category: 'Savory Lassis',
        items: [
          { name: 'Salted Lassi', description: 'Yogurt blended with salt and cumin', price: 100 },
          { name: 'Mint Lassi', description: 'Yogurt blended with fresh mint, salt, and spices', price: 110 },
          { name: 'Masala Lassi', description: 'Yogurt blended with traditional Indian spices', price: 120 },
        ]
      },
      {
        category: 'Snacks',
        items: [
          { name: 'Samosa', description: 'Crispy pastry filled with spiced potatoes', price: 90 },
          { name: 'Kachori', description: 'Crispy pastry filled with spiced lentils', price: 100 },
          { name: 'Dhokla', description: 'Steamed savory cake made from fermented rice', price: 90 },
        ]
      },
      {
        category: 'Other Beverages',
        items: [
          { name: 'Masala Chai', description: 'Spiced Indian tea', price: 80 },
          { name: 'Shikanji', description: 'Indian-style lemonade with spices', price: 90 },
          { name: 'Aam Panna', description: 'Raw mango drink with spices', price: 100 },
        ]
      },
    ],
    schedule: [
      { day: 'Monday', hours: '10:00 AM - 7:00 PM', location: 'Near the City Park' },
      { day: 'Tuesday', hours: '10:00 AM - 7:00 PM', location: 'Near the Business District' },
      { day: 'Wednesday', hours: '10:00 AM - 7:00 PM', location: 'Near the Corporate Campus' },
      { day: 'Thursday', hours: '10:00 AM - 7:00 PM', location: 'Near the College Area' },
      { day: 'Friday', hours: '10:00 AM - 8:00 PM', location: 'Near the Arts District' },
      { day: 'Saturday', hours: '11:00 AM - 8:00 PM', location: 'Near the Weekend Market' },
      { day: 'Sunday', hours: '11:00 AM - 6:00 PM', location: 'Near the Community Festival' },
    ],
    phone: '8901203456',
    website: 'www.lassilovers.com',
    socials: {
      instagram: '@lassilovers',
      twitter: '@lassilovers',
    },
  },
};

const TruckDetails = () => {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState('menu');
  
  // Get the truck data based on ID or default to the first one if not found
  const truckData = mockTruckDataMap[id || 'delhi-delights'] || mockTruckDataMap['delhi-delights'];
  
  return (
    <div className="min-h-screen flex flex-col bg-yellow-50"> {/* Add bg-yellow-50 for light yellow background */}
      <Navbar />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden h-[400px] shadow-lg">
              <img 
                src={truckData.images[activeImageIndex]} 
                alt={truckData.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {truckData.cuisine}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{truckData.rating}</span>
                    <span className="text-white/70 ml-1">({truckData.reviewCount} reviews)</span>
                  </div>
                </div>
                
                <h1 className="font-serif text-3xl md:text-4xl font-bold">{truckData.name}</h1>
              </div>
              
              <div className="absolute top-4 right-4 flex space-x-2">
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="h-5 w-5 text-foodtruck-slate hover:text-red-500" />
                </button>
                <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Share2 className="h-5 w-5 text-foodtruck-slate" />
                </button>
              </div>
            </div>
            
            <div className="flex mt-4 space-x-3 overflow-x-auto pb-2">
              {truckData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={cn(
                    "w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all",
                    activeImageIndex === index ? "ring-2 ring-foodtruck-teal" : "opacity-70 hover:opacity-100"
                  )}
                >
                  <img 
                    src={image} 
                    alt={`${truckData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <div className="lg:w-2/3">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['menu', 'schedule', 'reviews', 'about'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "py-4 px-1 font-medium text-sm border-b-2 transition-colors whitespace-nowrap",
                        activeTab === tab
                          ? "border-foodtruck-teal text-foodtruck-teal"
                          : "border-transparent text-foodtruck-slate/70 hover:text-foodtruck-slate hover:border-foodtruck-slate/30"
                      )}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="py-6">
                {activeTab === 'menu' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">Menu</h2>
                    
                    <div className="space-y-10">
                      {truckData.menu.map((category) => (
                        <div key={category.category}>
                          <h3 className="font-medium text-xl text-foodtruck-slate mb-4 pb-2 border-b border-gray-200">
                            {category.category}
                          </h3>
                          <div className="space-y-4">
                            {category.items.map((item) => (
                              <div key={item.name} className="flex justify-between">
                                <div className="pr-4">
                                  <h4 className="font-medium text-foodtruck-slate">{item.name}</h4>
                                  <p className="text-sm text-foodtruck-slate/70 mt-1">{item.description}</p>
                                </div>
                                <div className="flex-shrink-0 font-medium text-foodtruck-slate">
                                  ₹{item.price}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'schedule' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">Weekly Schedule</h2>
                    
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                      {truckData.schedule.map((day, index) => (
                        <div 
                          key={day.day}
                          className={cn(
                            "flex flex-col sm:flex-row sm:items-center p-4",
                            index < truckData.schedule.length - 1 && "border-b border-gray-200"
                          )}
                        >
                          <div className="sm:w-1/3 mb-2 sm:mb-0">
                            <div className="font-medium text-foodtruck-slate">{day.day}</div>
                          </div>
                          <div className="sm:w-1/3 mb-2 sm:mb-0">
                            <div className={cn(
                              "flex items-center",
                              day.hours === 'Closed' ? "text-red-500" : "text-green-600"
                            )}>
                              <Clock className="h-4 w-4 mr-2" />
                              {day.hours}
                            </div>
                          </div>
                          <div className="sm:w-1/3">
                            {day.location && (
                              <div className="flex items-center text-foodtruck-slate/80">
                                <MapPin className="h-4 w-4 mr-2" />
                                {day.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">Reviews</h2>
                    <p className="text-foodtruck-slate/80">
                      This would contain user reviews and ratings in a real implementation.
                    </p>
                  </div>
                )}
                
                {activeTab === 'about' && (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foodtruck-slate mb-6">About</h2>
                    <p className="text-foodtruck-slate/80 mb-6">
                      {truckData.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm"> {/* Updated background to white */}
                        <h3 className="font-medium text-foodtruck-slate mb-3">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">{truckData.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <a
                              href={`https://${truckData.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foodtruck-teal/80 hover:text-foodtruck-teal"
                            >
                              {truckData.website}
                            </a>
                          </div>
                          <div className="flex items-center">
                            <Instagram className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">{truckData.socials.instagram}</span>
                          </div>
                          <div className="flex items-center">
                            <Twitter className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">{truckData.socials.twitter}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm"> {/* Updated background to white */}
                        <h3 className="font-medium text-foodtruck-slate mb-3">Quick Info</h3>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">Price: ₹₹ (Average)</span>
                          </div>
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">Founded: 2018</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">Average wait time: 5-10 minutes</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-foodtruck-teal mr-3" />
                            <span className="text-foodtruck-slate/80">Usually serves: Downtown area</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="bg-yellow-100 rounded-xl shadow-md p-6 sticky top-24">
                <h3 className="font-medium text-lg text-foodtruck-slate mb-4">Current Location</h3>
                
                <div className="bg-foodtruck-lightgray rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-foodtruck-teal mt-0.5 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="font-medium text-foodtruck-slate">
                        {truckData.schedule.find(day => day.day === 'Friday')?.location || 'Downtown'}
                      </p>
                      <p className="text-sm text-foodtruck-slate/70">123 Main Street</p>
                      <p className="text-sm text-foodtruck-slate/70">
                        Open until {truckData.schedule.find(day => day.day === 'Friday')?.hours.split(' - ')[1] || '10:00 PM'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg overflow-hidden h-40 mb-6">
                  {/* This would be a Google Maps embed in a real implementation */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-foodtruck-slate/70">
                    <a href="https://www.google.com/maps/place/KIIT+Campus/@20.3538431,85.8169059,17z/">
                      <img src="/map.jpg" alt="Map placeholder" />
                    </a>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 rounded-lg bg-foodtruck-teal text-white font-medium hover:bg-foodtruck-slate transition-colors">
                    Pre-Order for Pickup
                  </button>
                  <button className="w-full px-4 py-3 rounded-lg border border-foodtruck-teal text-foodtruck-teal font-medium hover:bg-foodtruck-teal hover:text-white transition-colors">
                    Get Directions
                  </button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-foodtruck-slate mb-3">Next Scheduled At</h3>
                  
                  <div className="space-y-3">
                    {truckData.schedule.slice(1, 3).map((day, index) => (
                      day.hours !== 'Closed' && (
                        <div key={index} className="flex items-center">
                          <Calendar className="h-4 w-4 text-foodtruck-teal mr-2" />
                          <span className="text-sm font-medium text-foodtruck-slate">{day.day}</span>
                          <span className="mx-2 text-foodtruck-slate/30">•</span>
                          <span className="text-sm text-foodtruck-slate/80">{day.location}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TruckDetails;