import { storageService } from './storageService';

export const authService = {
  login: (email, password) => {
    const users = storageService.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password && u.status === 'Active');
    
    if (user) {
      // Create a safe user object without password
      const authUser = { ...user };
      delete authUser.password;
      storageService.set('currentUser', authUser);
      return { success: true, user: authUser };
    }
    return { success: false, message: 'Invalid credentials or inactive account.' };
  },

  logout: () => {
    storageService.remove('currentUser');
  },

  getCurrentUser: () => {
    return storageService.get('currentUser');
  },

  isAuthenticated: () => {
    return !!storageService.get('currentUser');
  },

  hasRole: (roles) => {
    const user = storageService.get('currentUser');
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  }
};
