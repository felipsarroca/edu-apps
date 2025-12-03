
export enum MovementType {
    MRU = 'MRU',
    MRUA = 'MRUA',
    MovimentVertical = 'Moviment vertical',
    TirParabolic = 'Tir parabòlic'
}

export interface MovementPhase {
    tipus: MovementType;
    
    // Core kinematic variables (Y-axis for Parabolic)
    t_i?: number;
    t_f?: number;
    t?: number; // Duration
    s_i?: number; // Initial position (or height)
    s_f?: number; // Final position (or height)
    delta_s?: number; // Displacement (or vertical displacement)
    v_i?: number; // Initial velocity (or v_y_i)
    v_f?: number; // Final velocity (or v_y_f)
    a?: number; // Acceleration (or a_y)

    // X-axis variables for Parabolic motion
    s_i_x?: number;
    s_f_x?: number;
    delta_s_x?: number;
    v_x?: number; // Constant horizontal velocity

    // Parabolic launch parameters (only for the first phase)
    v_total_i?: number;
    angle_i?: number; // Launch angle in degrees

    // Internal state for multi-phase continuity
    inheritedInitialState?: {
        t: number;
        x: number;
        y: number;
        vx: number;
        vy: number;
    };

    // Flags to track user input vs. calculated values
    [key: string]: any; // Allow for dynamic _explicit flags

    // Solver status
    isSolved: boolean;
    error?: string;
    errorFields?: string[];
}

export interface Mobile {
    nom: string;
    phases: MovementPhase[];
    stopTime?: number; // Time when the mobile stops
}

export interface ChartDataPoint {
    time: number;
    [key: string]: number | null;
}

export interface ChartData {
    positionData: ChartDataPoint[];
    velocityData: ChartDataPoint[];
}

export interface Problem {
    statement: string;
    numMobiles: number;
    tags: MovementType[];
    mobiles: Mobile[];
    recommendedTime: number;
    solution: string;
}

export interface Session {
    name: string;
    problemStatement: string;
    mobiles: Mobile[];
    simulationTime?: number;
    solutionExplanation: string | null;
    isExampleData?: boolean;
    timestamp: string;
}

export interface KeyEvent {
    time: number;
    value: number;
    description: string;
    mobileKey: string;
}