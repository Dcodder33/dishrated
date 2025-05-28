// Script to create admin account via API
// Run this in browser console or as a Node.js script

const createAdminAccount = async () => {
  const API_URL = 'https://your-backend-url.onrender.com/api'; // Replace with your actual backend URL
  
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Admin User',
        email: 'admin@dishrated.com',
        password: 'admin123',
        role: 'admin',
        phone: '+1234567893'
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin account created successfully!');
      console.log('📧 Email: admin@dishrated.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('❌ Error creating admin account:', data.message);
      if (data.message.includes('already exists')) {
        console.log('ℹ️  Admin account already exists. Try logging in.');
      }
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Run the function
createAdminAccount();
