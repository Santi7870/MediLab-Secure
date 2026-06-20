export interface AuthSession {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  accessToken: string | null;
  roles: string[];
}
