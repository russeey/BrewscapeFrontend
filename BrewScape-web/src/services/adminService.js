import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs, 
    updateDoc, 
    deleteDoc, 
    doc,
    getDoc
  } from 'firebase/firestore';
  import { db } from '@/firebaseConfig';
  import errorService from './errorService';
  
  const adminService = {
    // Fetch all admin users
    async getAllAdmins() {
      try {
        const adminsRef = collection(db, 'admin', 'admin');
        const snapshot = await getDocs(adminsRef);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        errorService.logError(error, 'Failed to fetch admins');
        throw error;
      }
    },
  
    // Fetch all regular users
    async getAllUsers() {
      try {
        const usersRef = collection(db, 'users', 'regular');
        const snapshot = await getDocs(usersRef);
        
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        errorService.logError(error, 'Failed to fetch users');
        throw error;
      }
    },
  
    // Search users
    async searchUsers(searchTerm, isAdmin = false) {
      try {
        const usersRef = collection(db, isAdmin ? 'admin' : 'users', isAdmin ? 'admin' : 'regular');
        
        // Perform case-insensitive search
        const searchResults = [];
        const snapshot = await getDocs(usersRef);
        
        snapshot.docs.forEach(doc => {
          const userData = doc.data();
          const searchableFields = [
            userData.email?.toLowerCase(),
            userData.firstName?.toLowerCase(),
            userData.lastName?.toLowerCase()
          ];
  
          if (searchableFields.some(field => 
            field && field.includes(searchTerm.toLowerCase())
          )) {
            searchResults.push({
              id: doc.id,
              ...userData
            });
          }
        });
  
        return searchResults;
      } catch (error) {
        errorService.logError(error, 'Failed to search users');
        throw error;
      }
    },
  
    // Update user status
    async updateUserStatus(userId, status, isAdmin = false) {
      try {
        const userRef = doc(db, isAdmin ? 'admin' : 'users', isAdmin ? 'admin' : 'regular', userId);
        
        await updateDoc(userRef, {
          status: status
        });
  
        return { id: userId, status };
      } catch (error) {
        errorService.logError(error, 'Failed to update user status');
        throw error;
      }
    },
  
    // Delete user
    async deleteUser(userId, isAdmin = false) {
      try {
        const userRef = doc(db, isAdmin ? 'admin' : 'users', isAdmin ? 'admin' : 'regular', userId);
        
        await deleteDoc(userRef);
  
        return { id: userId, deleted: true };
      } catch (error) {
        errorService.logError(error, 'Failed to delete user');
        throw error;
      }
    },
  
    // Get user statistics
    async getUserStatistics() {
      try {
        // Regular users statistics
        const regularUsersRef = collection(db, 'users', 'regular');
        const regularUsersSnapshot = await getDocs(regularUsersRef);
        
        // Admin users statistics
        const adminUsersRef = collection(db, 'admin', 'admin');
        const adminUsersSnapshot = await getDocs(adminUsersRef);
  
        // Prepare statistics
        const statistics = {
          totalUsers: regularUsersSnapshot.docs.length,
          totalAdmins: adminUsersSnapshot.docs.length,
          activeUsers: 0,
          inactiveUsers: 0
        };
  
        // Count active and inactive users
        regularUsersSnapshot.docs.forEach(doc => {
          const userData = doc.data();
          if (userData.status === 'active') {
            statistics.activeUsers++;
          } else {
            statistics.inactiveUsers++;
          }
        });
  
        return statistics;
      } catch (error) {
        errorService.logError(error, 'Failed to fetch user statistics');
        throw error;
      }
    }
  };
  
  export default adminService;