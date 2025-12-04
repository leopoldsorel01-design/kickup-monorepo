import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    STREAK: 'KICKUP_STREAK',
    LAST_LOGIN: 'KICKUP_LAST_LOGIN',
    FREEZE_ACTIVE: 'KICKUP_FREEZE_ACTIVE',
    FREEZE_COUNT: 'KICKUP_FREEZE_COUNT',
};

export const SAVED_BY_FREEZE = 'SAVED_BY_FREEZE';

export const getStreak = async (): Promise<number> => {
    try {
        const streak = await AsyncStorage.getItem(KEYS.STREAK);
        return streak ? parseInt(streak, 10) : 0;
    } catch (e) {
        console.error('Failed to get streak', e);
        return 0;
    }
};

export const saveStreak = async (streak: number) => {
    try {
        await AsyncStorage.setItem(KEYS.STREAK, streak.toString());
    } catch (e) {
        console.error('Failed to save streak', e);
    }
};

export const getFreezeCount = async (): Promise<number> => {
    try {
        const count = await AsyncStorage.getItem(KEYS.FREEZE_COUNT);
        return count ? parseInt(count, 10) : 0;
    } catch (e) {
        console.error('Failed to get freeze count', e);
        return 0;
    }
};

export const setFreezeCount = async (count: number) => {
    try {
        await AsyncStorage.setItem(KEYS.FREEZE_COUNT, count.toString());
    } catch (e) {
        console.error('Failed to set freeze count', e);
    }
};

export const isFreezeActive = async (): Promise<boolean> => {
    try {
        const active = await AsyncStorage.getItem(KEYS.FREEZE_ACTIVE);
        return active === 'true';
    } catch (e) {
        console.error('Failed to check freeze status', e);
        return false;
    }
};

export const setFreezeActive = async (active: boolean) => {
    try {
        await AsyncStorage.setItem(KEYS.FREEZE_ACTIVE, active.toString());
    } catch (e) {
        console.error('Failed to set freeze status', e);
    }
};

export const checkStreak = async (): Promise<string | null> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const lastLogin = await AsyncStorage.getItem(KEYS.LAST_LOGIN);

        if (lastLogin === today) {
            return null; // Already logged in today
        }

        await AsyncStorage.setItem(KEYS.LAST_LOGIN, today);

        if (!lastLogin) {
            // First login
            await saveStreak(1);
            return null;
        }

        const lastLoginDate = new Date(lastLogin);
        const todayDate = new Date(today);
        const diffTime = Math.abs(todayDate.getTime() - lastLoginDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            const currentStreak = await getStreak();
            await saveStreak(currentStreak + 1);
            return null;
        } else if (diffDays > 1) {
            // Missed a day (or more)
            const freezeActive = await isFreezeActive();
            if (freezeActive) {
                // Saved by freeze
                await setFreezeActive(false); // Consume freeze
                // Streak is kept (not reset, but not incremented either? Or incremented? 
                // "Consume Freeze, Keep Streak" usually means it stays as is or increments if we want to be generous. 
                // But usually it just prevents reset. Let's assume it prevents reset.
                // Wait, if I login today after missing yesterday, and I had a freeze, my streak should probably continue from where it was?
                // Actually, if I missed yesterday, today is a new day. If I use a freeze for yesterday, then today counts as the next day?
                // Let's stick to the prompt: "Consume Freeze, Keep Streak, Return SAVED_BY_FREEZE".
                // If I missed yesterday, and I login today. 
                // If I have a freeze, I use it for yesterday. So my streak is preserved.
                // Does today count as +1? Usually yes.
                // Let's just keep it simple: Don't reset.
                // And maybe increment? If I missed 1 day, and use freeze, it's like I didn't miss it.
                // So I should probably increment.
                // Let's just keep the current streak value for now to be safe, or increment it.
                // Prompt says: "Consume Freeze, Keep Streak".
                // Let's increment it because I am logging in today.
                const currentStreak = await getStreak();
                await saveStreak(currentStreak + 1);
                return SAVED_BY_FREEZE;
            } else {
                // Reset streak
                await saveStreak(1);
                return null;
            }
        }
        return null;
    } catch (e) {
        console.error('Failed to check streak', e);
        return null;
    }
};
