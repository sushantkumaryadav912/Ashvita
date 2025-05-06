export async function signIn(email, password) {
    // Simulate Azure AD authentication
    if (email === 'test@example.com' && password === 'password') {
      return { success: true, token: 'mock-token' };
    }
    throw new Error('Invalid credentials');
  }