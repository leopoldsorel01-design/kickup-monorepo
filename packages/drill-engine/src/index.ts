import { createMachine, assign } from 'xstate';

export const jugglingDrillMachine = createMachine({
    id: 'juggling_drill',
    initial: 'calibration',
    context: {
        juggles: 0,
        duration: 0,
        targetJuggles: 100 // Example target
    },
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
            on: {
                TICK: {
                    actions: assign({ duration: (context: any) => context.duration + 1 })
                },
                DETECT_BALL: {
                    actions: assign({ juggles: (context: any) => context.juggles + 1 })
                },
                STOP: 'summary'
            }
        },
        summary: {
            type: 'final'
        }
    }
});

export interface ActionableTip {
    id: string;
    text: string;
    joint: 'left_knee' | 'right_knee' | 'hips' | 'head';
    correction: string; // e.g., "Raise higher", "Keep steady"
    priority: 'high' | 'medium' | 'low';
}

export interface FeedbackContext {
    detectedJoints: string[];
    tips: ActionableTip[];
    currentDrill: string;
}

export const feedbackSessionMachine = createMachine({
    id: 'feedback_session',
    initial: 'idle',
    context: {
        detectedJoints: [],
        tips: [],
        currentDrill: 'juggling_basic'
    } as FeedbackContext,
    states: {
        idle: {
            on: { START_SESSION: 'scanning_body' }
        },
        scanning_body: {
            // Source 25: "Scanning User"
            on: {
                BODY_DETECTED: 'detecting_joints',
                TIMEOUT: 'idle'
            }
        },
        detecting_joints: {
            // Source 26: "Detecting Joints"
            on: {
                JOINTS_LOCKED: 'analyzing_form',
                LOST_TRACKING: 'scanning_body'
            }
        },
        analyzing_form: {
            // Source 26: "Analyzing Motion"
            on: {
                DRILL_COMPLETE: 'generating_feedback',
                FORM_ERROR: {
                    actions: 'logFormError'
                }
            }
        },
        generating_feedback: {
            // Source 26: "Feedback Generation"
            entry: 'generateActionableTips',
            on: {
                DISMISS: 'idle',
                RESTART: 'scanning_body'
            }
        }
    }
}, {
    actions: {
        generateActionableTips: (context) => {
            // Mock AI Logic: In reality, this would process the motion data
            context.tips = [
                {
                    id: 'tip_1',
                    text: 'Keep your hips square to the ball.',
                    joint: 'hips',
                    correction: 'Rotate 15 degrees left',
                    priority: 'high'
                },
                {
                    id: 'tip_2',
                    text: 'Knees slightly bent for better balance.',
                    joint: 'left_knee',
                    correction: 'Bend more',
                    priority: 'medium'
                }
            ];
        },
        logFormError: (context, event) => {
            console.log('Form error detected:', event);
        }
    }
});
