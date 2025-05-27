import dotenv from 'dotenv';
import connectDB from '../config/database';
import { User, FoodTruck, Event, Review } from '../models';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await FoodTruck.deleteMany({});
    await Event.deleteMany({});
    await Review.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
        phone: '+1234567890',
        preferences: {
          cuisines: ['North Indian', 'Chinese'],
          maxDistance: 10,
          priceRange: 'mid'
        }
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'owner',
        phone: '+1234567891',
        preferences: {
          cuisines: ['South Indian', 'Continental'],
          maxDistance: 15,
          priceRange: 'premium'
        }
      },
      {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: 'password123',
        role: 'owner',
        phone: '+1234567892',
        preferences: {
          cuisines: ['Chinese', 'Thai'],
          maxDistance: 5,
          priceRange: 'budget'
        }
      },
      {
        name: 'Admin User',
        email: 'admin@dishrated.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567893'
      }
    ]);

    // Create food trucks
    console.log('🚚 Creating food trucks...');
    const foodTrucks = await FoodTruck.create([
      {
        name: 'Rollicious The Roll Company',
        description: 'Authentic North Indian rolls and wraps made with fresh ingredients and traditional spices.',
        image: '/eggtruck.jpg',
        cuisine: 'North Indian',
        rating: 4.8,
        reviewCount: 132,
        location: {
          address: 'University Campus Area, Food Court Zone',
          coordinates: {
            latitude: 40.7128,
            longitude: -74.0060
          }
        },
        status: 'open',
        waitTime: '5 min',
        featured: true,
        owner: users[1]._id,
        menu: [
          {
            name: 'Chicken Kathi Roll',
            description: 'Spicy chicken wrapped in fresh paratha with onions and mint chutney',
            price: 120,
            category: 'Rolls',
            isAvailable: true,
            allergens: ['gluten'],
            isVegetarian: false,
            isVegan: false
          },
          {
            name: 'Paneer Tikka Roll',
            description: 'Grilled paneer with vegetables wrapped in soft paratha',
            price: 100,
            category: 'Rolls',
            isAvailable: true,
            allergens: ['gluten', 'dairy'],
            isVegetarian: true,
            isVegan: false
          },
          {
            name: 'Egg Roll',
            description: 'Classic egg roll with onions and spices',
            price: 80,
            category: 'Rolls',
            isAvailable: true,
            allergens: ['gluten', 'eggs'],
            isVegetarian: true,
            isVegan: false
          }
        ],
        priceRange: 'budget',
        tags: ['rolls', 'indian', 'spicy', 'quick']
      },
      {
        name: 'Wok Wonder',
        description: 'Authentic Chinese cuisine with a modern twist. Fresh ingredients, bold flavors.',
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3',
        cuisine: 'Chinese',
        rating: 4.5,
        reviewCount: 89,
        location: {
          address: 'Downtown Business District, Food Plaza',
          coordinates: {
            latitude: 40.7589,
            longitude: -73.9851
          }
        },
        status: 'open',
        waitTime: '10 min',
        featured: false,
        owner: users[2]._id,
        menu: [
          {
            name: 'Chicken Fried Rice',
            description: 'Wok-tossed rice with chicken and vegetables',
            price: 150,
            category: 'Rice',
            isAvailable: true,
            allergens: ['soy'],
            isVegetarian: false,
            isVegan: false
          },
          {
            name: 'Veg Hakka Noodles',
            description: 'Stir-fried noodles with fresh vegetables',
            price: 130,
            category: 'Noodles',
            isAvailable: true,
            allergens: ['gluten', 'soy'],
            isVegetarian: true,
            isVegan: true
          },
          {
            name: 'Sweet and Sour Chicken',
            description: 'Crispy chicken in tangy sweet and sour sauce',
            price: 180,
            category: 'Main Course',
            isAvailable: true,
            allergens: ['soy'],
            isVegetarian: false,
            isVegan: false
          }
        ],
        priceRange: 'mid',
        tags: ['chinese', 'noodles', 'rice', 'stir-fry']
      },
      {
        name: 'Spice Route',
        description: 'Traditional South Indian delicacies served with authentic flavors and fresh ingredients.',
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3',
        cuisine: 'South Indian',
        rating: 4.7,
        reviewCount: 76,
        location: {
          address: 'Historic District, Cultural Quarter',
          coordinates: {
            latitude: 40.7505,
            longitude: -73.9934
          }
        },
        status: 'open',
        waitTime: '15 min',
        featured: true,
        owner: users[1]._id,
        menu: [
          {
            name: 'Masala Dosa',
            description: 'Crispy rice crepe filled with spiced potato curry',
            price: 90,
            category: 'Dosa',
            isAvailable: true,
            allergens: [],
            isVegetarian: true,
            isVegan: true
          },
          {
            name: 'Idli Sambar',
            description: 'Steamed rice cakes served with lentil curry and coconut chutney',
            price: 70,
            category: 'Breakfast',
            isAvailable: true,
            allergens: [],
            isVegetarian: true,
            isVegan: true
          },
          {
            name: 'Chicken Biryani',
            description: 'Fragrant basmati rice cooked with spiced chicken',
            price: 200,
            category: 'Biryani',
            isAvailable: true,
            allergens: ['dairy'],
            isVegetarian: false,
            isVegan: false
          }
        ],
        priceRange: 'mid',
        tags: ['south-indian', 'dosa', 'biryani', 'traditional']
      }
    ]);

    // Create events
    console.log('🎉 Creating events...');
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 30); // 30 days from now

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 60); // 60 days from now

    const deadline1 = new Date();
    deadline1.setDate(deadline1.getDate() + 25); // 25 days from now

    const deadline2 = new Date();
    deadline2.setDate(deadline2.getDate() + 55); // 55 days from now

    const events = await Event.create([
      {
        title: 'Food Festival 2025',
        description: 'A grand celebration of diverse cuisines featuring the best food trucks in the city.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        date: futureDate1,
        location: {
          address: 'Central Exhibition Center, Downtown',
          coordinates: {
            latitude: 40.7282,
            longitude: -73.9942
          }
        },
        eventType: 'city_event',
        organizer: users[3]._id,
        organizerType: 'admin',
        maxParticipants: 20,
        registrationDeadline: deadline1,
        featured: true,
        tags: ['food', 'festival', 'trucks', 'outdoor'],
        participatingTrucks: [
          { truck: foodTrucks[0]._id, status: 'confirmed' },
          { truck: foodTrucks[1]._id, status: 'confirmed' }
        ]
      },
      {
        title: 'Weekend Special Offers',
        description: 'Amazing weekend deals and special offers from your favorite food trucks.',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        date: futureDate2,
        location: {
          address: 'Sports Complex Area, Midtown',
          coordinates: {
            latitude: 40.7614,
            longitude: -73.9776
          }
        },
        eventType: 'offer',
        organizer: users[1]._id,
        organizerType: 'owner',
        maxParticipants: 10,
        registrationDeadline: deadline2,
        featured: false,
        tags: ['offers', 'weekend', 'deals'],
        participatingTrucks: [
          { truck: foodTrucks[0]._id, status: 'confirmed' },
          { truck: foodTrucks[2]._id, status: 'pending' }
        ]
      },
      {
        title: 'University Food Festival',
        description: 'Annual college festival with food trucks, music, and entertainment.',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        location: {
          address: 'University Campus, Student Center',
          coordinates: {
            latitude: 40.7831,
            longitude: -73.9712
          }
        },
        eventType: 'city_event',
        organizer: users[3]._id,
        organizerType: 'admin',
        maxParticipants: 15,
        registrationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
        featured: true,
        tags: ['festival', 'college', 'music', 'food'],
        participatingTrucks: [
          { truck: foodTrucks[1]._id, status: 'confirmed' },
          { truck: foodTrucks[2]._id, status: 'confirmed' }
        ]
      }
    ]);

    // Create reviews
    console.log('⭐ Creating reviews...');
    await Review.create([
      {
        user: users[0]._id,
        truck: foodTrucks[0]._id,
        rating: 5,
        comment: 'Amazing rolls! The chicken kathi roll was absolutely delicious. Fresh ingredients and perfect spices.',
        helpful: 12
      },
      {
        user: users[0]._id,
        truck: foodTrucks[1]._id,
        rating: 4,
        comment: 'Good Chinese food. The fried rice was tasty but could use a bit more seasoning.',
        helpful: 8
      },
      {
        user: users[2]._id,
        truck: foodTrucks[2]._id,
        rating: 5,
        comment: 'Authentic South Indian taste! The masala dosa reminded me of home. Highly recommended!',
        helpful: 15
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`
📊 Data Summary:
👥 Users: ${users.length}
🚚 Food Trucks: ${foodTrucks.length}
🎉 Events: ${events.length}
⭐ Reviews: 3

🔐 Test Accounts:
📧 User: john@example.com / password123
📧 Owner: jane@example.com / password123
📧 Admin: admin@dishrated.com / admin123
    `);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
