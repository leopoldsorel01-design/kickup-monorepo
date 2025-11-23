import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

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

    signInWithGoogle: async () => {
        try {
            // Check if your device supports Google Play
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Get the users ID token
            const signInResult = await GoogleSignin.signIn();

            // Try the new style of google-sign in result, if not fallback to old style
            let idToken = signInResult.data?.idToken;
            if (!idToken) {
                // Fallback for older versions or different response structure if needed, 
                // though the new library version usually returns it in data.
                // For now we assume it's in data.idToken as per v10+
                idToken = (signInResult as any).idToken;
            }

            if (!idToken) {
                throw new Error('No ID token found');
            }

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);

            // Sign-in the user with the credential
            const userCredential = await auth().signInWithCredential(googleCredential);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message || 'Google Sign-In failed' };
        }
    },

    signInWithApple: async () => {
        try {
            // Start the sign-in request
            const appleAuthRequestResponse = await appleAuth.performRequest({
                requestedOperation: appleAuth.Operation.LOGIN,
                // Note: User name is only returned on first sign in.
                requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
            });

            // Ensure Apple returned a user identityToken
            if (!appleAuthRequestResponse.identityToken) {
                throw new Error('Apple Sign-In failed - no identify token returned');
            }

            // Create a Firebase credential from the response
            const { identityToken, nonce } = appleAuthRequestResponse;
            const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);

            // Sign the user in with the credential
            const userCredential = await auth().signInWithCredential(appleCredential);
            return { user: userCredential.user, error: null };
        } catch (error: any) {
            return { user: null, error: error.message || 'Apple Sign-In failed' };
        }
    },

    logout: async () => {
        try {
            await auth().signOut();
            try {
                await GoogleSignin.signOut();
            } catch (e) {
                // Ignore google signout error if not signed in
            }
            return { error: null };
        } catch (error: any) {
            return { error: error.message || 'An unknown error occurred' };
        }
    },

    getCurrentUser: (): FirebaseAuthTypes.User | null => {
        return auth().currentUser;
    }
};
