import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message || 'An unknown error occurred' };
        }
    },

    register: async (email: string, password: string) => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message || 'An unknown error occurred' };
        }
    },

    logout: async () => {
        try {
            await auth().signOut();
            return { error: null };
        } catch (error: any) {
            return { error: error.message || 'An unknown error occurred' };
        }
    },

    getCurrentUser: (): FirebaseAuthTypes.User | null => {
        return auth().currentUser;
    }
};
