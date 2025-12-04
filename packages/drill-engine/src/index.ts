import { createMachine } from 'xstate';

export const jugglingDrillMachine = createMachine({
    id: 'juggling_drill',
    initial: 'calibration',
    states: {
        calibration: {
            on: { PLANE_DETECTED: 'anchor_placement' }
        },
        anchor_placement: {
            on: { USER_CONFIRM: 'body_fit' }
        },
        body_fit: {
            on: { POSE_VALID: 'active' }
        },
        active: {
            type: 'final'
        }
    }
});

export const feedbackSessionMachine = createMachine({
    id: 'feedback_session',
    initial: 'idle',
    states: {
        idle: {
            on: { START_SESSION: 'scanning_user' }
        },
        scanning_user: {
            on: { USER_DETECTED: 'drill_active' }
        },
        drill_active: {
            on: { DRILL_COMPLETE: 'analyzing_motion' }
        },
        analyzing_motion: {
            on: { ANALYSIS_COMPLETE: 'feedback_generation' }
        },
        feedback_generation: {
            on: { DISMISS: 'idle', RESTART: 'scanning_user' }
        }
    }
});
