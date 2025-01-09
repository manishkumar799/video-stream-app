// Simulating a database with a simple object
const db = {
    1: { id: 1, name: 'John Doe', email: 'john@example.com' },
    2: { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
  };
  
  // Simulated function to get user from DB
  async function getUserFromDB(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(db[userId] || null);
      }, 500); // Simulating a delay of 500ms
    });
  }
  
  // Simulated function to update user in DB
  async function updateUserInDB(userId, userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (db[userId]) {
          db[userId] = { ...db[userId], ...userData }; // Update user data
          resolve(db[userId]);
        } else {
          resolve(null); // User not found
        }
      }, 500); // Simulating a delay of 500ms
    });
  }
  
  module.exports = { getUserFromDB, updateUserInDB };
  