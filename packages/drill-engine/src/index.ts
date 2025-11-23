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
