
export enum MovementType {
    MRU = 'MRU',
    MRUA = 'MRUA',
    CaigudaLliure = 'Caiguda lliure',
    TirVertical = 'Tir vertical',
    TirParabolic = 'Tir parabòlic'
}

export interface Mobile {
    nom: string;
    tipus: MovementType;
    s0: number; // posició inicial (vertical per a parabòlic)
    v0: number; // velocitat inicial (vertical per a parabòlic)
    vx0?: number; // velocitat horitzontal inicial (per a parabòlic)
    a: number;  // acceleració
    t: number;  // temps
    angle?: number; // angle de llançament en graus (només per a Tir parabòlic)
    s0_explicit?: boolean;
    v0_explicit?: boolean;
    vx0_explicit?: boolean;
    a_explicit?: boolean;
    t_explicit?: boolean;
    angle_explicit?: boolean;
    stopTime?: number; // Temps en que el mòbil s'atura (col·lisió, terra)
}

export interface ChartDataPoint {
    time: number;
    [key: string]: number; // e.g., s_mobile1: 10, v_mobile2: 5
}

export interface ChartData {
    positionData: ChartDataPoint[];
    velocityData: ChartDataPoint[];
}

export interface Example {
    statement: string;
    mobiles: Mobile[];
    recommendedTime?: number;
    solution: string;
}

export interface Session {
    name: string;
    problemStatement: string;
    mobiles: Mobile[];
    simulationTime?: number;
    solution: string | null;
    timestamp: string;
}

export interface AnalysisResult {
    mobils: Mobile[];
    recommendedTime: number;
    solution: string;
}

export interface KeyEvent {
    time: number;
    value: number;
    description: string;
    mobileKey: string;
}

export interface KeyPoints {
    apexTime?: number;
    maxHeight?: number;
    impactTime?: number;
    impactVelocity?: number;
}
