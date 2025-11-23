import storage from '@react-native-firebase/storage';
import { AuthService } from './auth';

export const StorageService = {
    uploadFile: async (uri: string, fileName: string) => {
        try {
            const user = AuthService.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const reference = storage().ref(`users/${user.uid}/${fileName}`);
            const task = reference.putFile(uri);

            // You can listen to state changes here if you want to show progress
            // task.on('state_changed', taskSnapshot => {
            //    console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
            // });

            await task;
            const url = await reference.getDownloadURL();
            return { url, error: null };
        } catch (error: any) {
            return { url: null, error: error.message || 'Upload failed' };
        }
    },

    getUserFiles: async () => {
        try {
            const user = AuthService.getCurrentUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            const reference = storage().ref(`users/${user.uid}`);
            const result = await reference.listAll();

            const files = await Promise.all(result.items.map(async (ref) => {
                const url = await ref.getDownloadURL();
                return {
                    name: ref.name,
                    fullPath: ref.fullPath,
                    url,
                };
            }));

            return { files, error: null };
        } catch (error: any) {
            return { files: [], error: error.message || 'Failed to list files' };
        }
    }
};
