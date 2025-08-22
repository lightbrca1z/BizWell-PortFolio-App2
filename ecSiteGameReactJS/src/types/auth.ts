export interface User {
  email: string;
  password: string;
  name: string;
  joinDate: string;
  isVIP: boolean;
  avatar: string;
}

export interface AuthState {
  currentUser: User | null;
  users: Record<string, User>;
}

export interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string; user?: User };
  register: (email: string, password: string, name: string) => { success: boolean; message: string; user?: User };
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => boolean;
  showMessage: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}
