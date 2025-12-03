import { GoogleGenAI, Type } from '@google/genai';
import { Mobile, AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    // This is a placeholder. In a real environment, the key would be set.
    console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        solution: {
            type: Type.STRING,
            description: "Una conclusió final, breu i directa, que respongui a la pregunta principal del problema. Si no hi ha solució (ex: mai es troben), indica-ho. Envolta la part clau (resultat numèric o conclusió) amb dos asteriscs (**)."
        },
        recommendedTime: {
            type: Type.NUMBER,
            description: "Un temps de simulació global recomanat en segons, basat en el context del problema (ex: si es demana un punt de trobada, calcula'l)."
        },
        mobils: {
            type: Type.ARRAY,
            description: "Una llista de fins a tres objectes mòbils.",
            items: {
                type: Type.OBJECT,
                properties: {
                    nom: { type: Type.STRING, description: "Nom de l'objecte mòbil (ex: 'Cotxe A')." },
                    tipus: { 
                        type: Type.STRING, 
                        description: "Tipus de moviment: 'MRU', 'MRUA', 'Caiguda lliure', 'Tir vertical', or 'Tir parabòlic'."
                    },
                    s0: { type: Type.NUMBER, description: "Posició inicial en metres (eix Y per a tirs verticals/parabòlics). Per defecte 0." },
                    v0: { type: Type.NUMBER, description: "Velocitat inicial VERTICAL (v₀y) en m/s. Si surt del repòs, és 0." },
                    vx0: { type: Type.NUMBER, description: "Velocitat inicial HORITZONTAL (v₀x) en m/s (només per a Tir parabòlic, altrament 0)." },
                    a: { type: Type.NUMBER, description: "Acceleració en m/s². Per a MRU és 0. Per a caiguda lliure/tir vertical/parabòlic és -9.8." },
                    t: { type: Type.NUMBER, description: "Durada d'aquesta FASE del moviment en segons. Si no s'especifica, usa el temps de simulació global." },
                    angle: { type: Type.NUMBER, description: "Angle de llançament en graus (només per a Tir parabòlic, altrament 0)." },
                    s0_explicit: { type: Type.BOOLEAN, description: "True si s0 s'esmenta explícitament a l'enunciat." },
                    v0_explicit: { type: Type.BOOLEAN, description: "True si v0y s'esmenta explícitament a l'enunciat." },
                    vx0_explicit: { type: Type.BOOLEAN, description: "True si v0x s'esmenta explícitament a l'enunciat." },
                    a_explicit: { type: Type.BOOLEAN, description: "True si 'a' s'esmenta explícitament a l'enunciat." },
                    t_explicit: { type: Type.BOOLEAN, description: "True si 't' s'esmenta explícitament a l'enunciat." },
                    angle_explicit: { type: Type.BOOLEAN, description: "True si l'angle s'esmenta explícitament a l'enunciat." },
                },
                required: ["nom", "tipus", "s0", "v0", "vx0", "a", "t", "angle"]
            }
        }
    },
    required: ["solution", "mobils", "recommendedTime"],
};

const systemInstruction = `
Ets un expert assistent de física especialitzat en cinemàtica. La teva tasca és analitzar enunciats de problemes escrits en català.
Analitza el problema de forma GLOBAL. Extreu els paràmetres físics per a cada mòbil, determina un temps de simulació total recomanat i genera una solució breu.
Retorna les dades en un format JSON estructurat segons l'esquema proporcionat. Retorna només el JSON.

Regles CLAU per a l'anàlisi de dades:
1.  **Temps de Simulació Global (recommendedTime)**: Aquesta és la teva prioritat MÀXIMA. La precisió d'aquest valor és crítica per a la correcta visualització.
    - El valor de 'recommendedTime' HA DE SER el temps exacte en què ocorre l'esdeveniment clau que resol el problema (xoc, trobada, arribada a terra, final d'un recorregut especificat).
    - Si el problema pregunta per un punt de trobada, calcula el temps exacte i fes que 'recommendedTime' sigui exactament aquest valor.
    - Si el problema implica una caiguda o llançament, 'recommendedTime' ha de ser el temps de vol total fins que l'objecte arriba a y=0 (o al seu destí final).
    - Si els mòbils mai es troben, tria un 'recommendedTime' raonable (ex: 20s) que demostri que les seves trajectòries divergeixen.
    - Si el problema defineix una durada (ex: "durant 8 segons"), usa aquest temps com a 'recommendedTime'.

2.  **Paràmetres Explícits**:
    - Posa 's0_explicit', 'v0_explicit', 'vx0_explicit', 'a_explicit', 't_explicit', 'angle_explicit' a true NOMÉS si l'enunciat dona un valor numèric explícit per a aquest paràmetre.
    - 'Surt del repòs' NO compta com a explícit per a v0.
    - Si un valor s'infereix, el seu camp explícit ha de ser false.

3.  **Moviments en Fases**:
    - Si un mòbil té múltiples fases (ex: accelera durant 8s i després manté la velocitat), defineix només la **primera fase** (MRUA, t=8). El motor de física de l'aplicació calcularà la resta.

4.  **Regles de Física**:
    - 'Surt del repòs': v0 és 0.
    - 'Velocitat constant': tipus és 'MRU' i 'a' és 0.
    - 'Caiguda lliure', 'Tir vertical', 'Tir parabòlic': 'a' és -9.8.
    - El temps 't' dins de cada mòbil es refereix a la durada d'una fase específica del moviment.

5.  **Tir Parabòlic**: Aquest és un cas especial.
    - Si l'enunciat proporciona una velocitat inicial total (V) i un angle de llançament (θ) en graus:
      - Calcula les components: v0 = V * sin(θ * PI / 180) i vx0 = V * cos(θ * PI / 180). Arrodoneix a dos decimals.
      - Emmagatzema l'angle a 'angle'.
      - Posa 'angle_explicit' a true.
      - Posa 'v0_explicit' i 'vx0_explicit' a false (són calculats).
    - Si l'enunciat proporciona les components v0y (la teva 'v0') i v0x (la teva 'vx0'):
      - Calcula l'angle: angle = atan2(v0, vx0) * 180 / PI. Arrodoneix a dos decimals.
      - Posa 'angle_explicit' a false (és calculat).
    - Per a moviments no parabòlics, 'vx0' i 'angle' han de ser 0.

Regles CLAU per a la generació de la solució ('solution'):
1.  Identifica la pregunta principal del problema (ex: "quan es troben?", "quina alçada assoleix?").
2.  **IMPORTANT**: Si el problema NO TÉ SOLUCIÓ (ex: els mòbils mai es troben), indica-ho clarament i explica breument per què. No inventis una resposta.
    - Exemple de no-solució: "Els dos trens **no es trobaran mai**, ja que el segon tren sempre és més ràpid i surten del mateix punt."
3.  Si hi ha una solució, formula una única frase que respongui a la pregunta.
4.  **SEMPRE**: Envolta la part clau de la teva resposta (el resultat numèric o la conclusió principal) amb dos asteriscs (**).

Exemples de 'solution':
- "Els dos mòbils es trobaran a l'instant **t = 10 s**."
- "L'objecte trigarà **4.52 segons** a arribar a terra."
- "L'objecte assolirà una alçada màxima de **20.4 metres**."
`;

const handleGeminiError = (error: any, defaultMessage: string): Error => {
    console.error("Error calling Gemini API:", error);
    const errorString = String(error);

    if (errorString.includes('429') || errorString.includes('RESOURCE_EXHAUSTED')) {
        return new Error("S'ha superat el límit de peticions a la IA. Si us plau, espera un moment i torna-ho a provar.");
    }
    if (error instanceof SyntaxError) {
         return new Error("L'IA ha retornat una resposta amb format invàlid. Revisa l'enunciat i intenta-ho de nou.");
    }
    
    return new Error(defaultMessage);
};

export const analyzeProblem = async (problemStatement: string): Promise<AnalysisResult> => {
    if (!API_KEY) {
        throw new Error("La clau API de Gemini no està configurada.");
    }
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: problemStatement,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedJson = JSON.parse(jsonText);

        if (!parsedJson.mobils || !Array.isArray(parsedJson.mobils) || typeof parsedJson.recommendedTime !== 'number' || typeof parsedJson.solution !== 'string') {
            throw new Error("La resposta de l'IA no té el format esperat (mobils, recommendedTime i solution).");
        }

        return parsedJson as AnalysisResult;

    } catch (error) {
        throw handleGeminiError(error, "No s'ha pogut obtenir una resposta vàlida de l'IA.");
    }
};