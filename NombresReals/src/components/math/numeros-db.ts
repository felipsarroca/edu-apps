/* Base de dades de nombres per a l'exercici "Classifica".
   Cada nombre té: valor per mostrar (v), conjunt més específic on viu (c),
   nivell de dificultat (n) i explicació breu (e).
   Convenció: ℕ = {1, 2, 3, …}; el zero no apareix a la base per evitar ambigüitat. */

export type Conjunt = 'N' | 'Z' | 'Q' | 'I'
export type Nivell = 1 | 2 | 3

export interface Numero {
  v: string
  c: Conjunt
  n: Nivell
  e: string
}

export const NOM_CONJUNT: Record<Conjunt, string> = {
  N: 'natural',
  Z: 'enter',
  Q: 'racional',
  I: 'irracional',
}

const db: Numero[] = []
const vistes = new Set<string>()

function afegeix(n: Nivell, c: Conjunt, v: string, e: string) {
  const clau = `${n}|${v}`
  if (vistes.has(clau)) return
  vistes.add(clau)
  db.push({ v, c, n, e })
}

/* ---------- Nivell 1 · Fàcil ---------- */

for (let k = 1; k <= 15; k++) afegeix(1, 'N', `${k}`, 'Natural: serveix per comptar.')
for (let k = 1; k <= 12; k++)
  afegeix(1, 'Z', `−${k}`, 'Oposat d\'un natural: enter, però no natural.')

afegeix(1, 'Q', '1/2', 'Fracció d\'enters → racional.')
afegeix(1, 'Q', '1/3', 'Fracció d\'enters → racional.')
afegeix(1, 'Q', '2/3', 'Fracció d\'enters → racional.')
afegeix(1, 'Q', '3/4', 'Fracció d\'enters → racional.')
afegeix(1, 'Q', '1/4', 'Fracció d\'enters → racional.')
afegeix(1, 'Q', '4/5', 'Fracció d\'enters → racional.')
afegeix(1, 'Q', '0,5', 'Decimal exacte (= 1/2) → racional.')
afegeix(1, 'Q', '0,75', 'Decimal exacte (= 3/4) → racional.')
afegeix(1, 'Q', '1,5', 'Decimal exacte (= 3/2) → racional.')
afegeix(1, 'Q', '2,25', 'Decimal exacte (= 9/4) → racional.')
afegeix(1, 'Q', '3,5', 'Decimal exacte (= 7/2) → racional.')
afegeix(1, 'Q', '0,2', 'Decimal exacte (= 1/5) → racional.')
afegeix(1, 'Q', '−0,5', 'Decimal exacte negatiu (= −1/2) → racional.')

afegeix(1, 'I', '√2', 'Diagonal del quadrat de costat 1: irracional.')
afegeix(1, 'I', '√3', '3 no és quadrat perfecte → irracional.')
afegeix(1, 'I', '√5', '5 no és quadrat perfecte → irracional.')
afegeix(1, 'I', '√7', '7 no és quadrat perfecte → irracional.')
afegeix(1, 'I', 'π', '3,141592… infinit i sense període: irracional.')

/* ---------- Nivell 2 · Mitjà ---------- */

for (let k = 16; k <= 24; k++) afegeix(2, 'N', `${k}`, 'Natural: serveix per comptar.')
for (let k = 16; k <= 24; k++) afegeix(2, 'Z', `−${k}`, 'Enter negatiu: no és natural.')

// naturals disfressats
afegeix(2, 'N', '4/2', '= 2. Fracció que val un natural!')
afegeix(2, 'N', '6/3', '= 2. Fracció que val un natural!')
afegeix(2, 'N', '8/4', '= 2. Fracció que val un natural!')
afegeix(2, 'N', '10/5', '= 2. Fracció que val un natural!')
afegeix(2, 'N', '12/4', '= 3. Fracció que val un natural!')
afegeix(2, 'N', '15/3', '= 5. Fracció que val un natural!')
afegeix(2, 'N', '18/6', '= 3. Fracció que val un natural!')
afegeix(2, 'N', '20/4', '= 5. Fracció que val un natural!')
afegeix(2, 'N', '√4', '= 2. Arrel exacta → natural.')
afegeix(2, 'N', '√16', '= 4. Arrel exacta → natural.')
afegeix(2, 'N', '√25', '= 5. Arrel exacta → natural.')
afegeix(2, 'N', '√36', '= 6. Arrel exacta → natural.')
afegeix(2, 'N', '√49', '= 7. Arrel exacta → natural.')
afegeix(2, 'N', '2³', '= 8. Potència sencera → natural.')
afegeix(2, 'N', '3²', '= 9. Potència sencera → natural.')
afegeix(2, 'N', '4²', '= 16. Potència sencera → natural.')
afegeix(2, 'N', '5²', '= 25. Potència sencera → natural.')
afegeix(2, 'N', '10²', '= 100. Potència sencera → natural.')

// enters disfressats
afegeix(2, 'Z', '−√4', '= −2. Arrel exacta amb signe → enter.')
afegeix(2, 'Z', '−√36', '= −6. Arrel exacta amb signe → enter.')
afegeix(2, 'Z', '−2³', '= −8. Potència d\'enter → enter.')
afegeix(2, 'Z', '−2⁵', '= −32. Potència d\'enter → enter.')
afegeix(2, 'Z', '−10²', '= −100. Potència d\'enter → enter.')
afegeix(2, 'Z', '−4/2', '= −2. El valor és enter.')
afegeix(2, 'Z', '−9/3', '= −3. El valor és enter.')

// racionals: fraccions
afegeix(2, 'Q', '3/2', 'Fracció d\'enters (= 1,5) → racional.')
afegeix(2, 'Q', '5/2', 'Fracció d\'enters (= 2,5) → racional.')
afegeix(2, 'Q', '4/3', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '5/3', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '8/3', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '5/4', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '7/4', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '9/4', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '12/5', 'Fracció d\'enters (= 2,4) → racional.')
afegeix(2, 'Q', '7/5', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '1/6', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '5/6', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '1/8', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '3/8', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '−3/2', 'Fracció d\'enters (= −1,5) → racional.')
afegeix(2, 'Q', '−5/2', 'Fracció d\'enters (= −2,5) → racional.')
afegeix(2, 'Q', '−4/3', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '−7/4', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '−9/2', 'Fracció d\'enters → racional.')
afegeix(2, 'Q', '−8/3', 'Fracció d\'enters → racional.')

// racionals: decimals exactes
afegeix(2, 'Q', '0,25', 'Decimal exacte (= 1/4) → racional.')
afegeix(2, 'Q', '0,125', 'Decimal exacte (= 1/8) → racional.')
afegeix(2, 'Q', '0,375', 'Decimal exacte (= 3/8) → racional.')
afegeix(2, 'Q', '4,25', 'Decimal exacte (= 17/4) → racional.')
afegeix(2, 'Q', '7,75', 'Decimal exacte (= 31/4) → racional.')
afegeix(2, 'Q', '12,5', 'Decimal exacte (= 25/2) → racional.')
afegeix(2, 'Q', '10,5', 'Decimal exacte (= 21/2) → racional.')
afegeix(2, 'Q', '6,4', 'Decimal exacte (= 32/5) → racional.')
afegeix(2, 'Q', '3,2', 'Decimal exacte (= 16/5) → racional.')
afegeix(2, 'Q', '−1,25', 'Decimal exacte (= −5/4) → racional.')
afegeix(2, 'Q', '−3,75', 'Decimal exacte (= −15/4) → racional.')

// racionals: periòdics
afegeix(2, 'Q', '0,333…', 'Periòdic (= 1/3) → racional.')
afegeix(2, 'Q', '0,666…', 'Periòdic (= 2/3) → racional.')
afegeix(2, 'Q', '0,111…', 'Periòdic (= 1/9) → racional.')
afegeix(2, 'Q', '1,333…', 'Periòdic (= 4/3) → racional.')
afegeix(2, 'Q', '2,666…', 'Periòdic (= 8/3) → racional.')
afegeix(2, 'Q', '−0,666…', 'Periòdic (= −2/3) → racional.')
afegeix(2, 'Q', '0,0909…', 'Periòdic (= 1/11) → racional.')
afegeix(2, 'Q', '0,8333…', 'Periòdic (= 5/6) → racional.')

// racionals: potències d'exponent negatiu
afegeix(2, 'Q', '2⁻¹', '= 1/2. Exponent negatiu → fracció: racional.')
afegeix(2, 'Q', '2⁻²', '= 1/4. Exponent negatiu → racional.')
afegeix(2, 'Q', '3⁻¹', '= 1/3. Exponent negatiu → racional.')
afegeix(2, 'Q', '5⁻¹', '= 1/5. Exponent negatiu → racional.')
afegeix(2, 'Q', '10⁻¹', '= 0,1. Exponent negatiu → racional.')
afegeix(2, 'Q', '10⁻²', '= 0,01. Exponent negatiu → racional.')

// irracionals
afegeix(2, 'I', '√6', '6 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '√8', '8 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '√10', '10 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '√12', '12 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '√15', '15 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '√18', '18 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '√20', '20 no és quadrat perfecte → irracional.')
afegeix(2, 'I', '−√2', 'L\'oposat d\'un irracional: irracional.')
afegeix(2, 'I', '−√5', 'L\'oposat d\'un irracional: irracional.')
afegeix(2, 'I', '2π', 'π per un enter: continua sent irracional.')
afegeix(2, 'I', 'π/2', 'π dividit per un enter: irracional.')
afegeix(2, 'I', '1+√2', 'L\'arrel hi continua essent → irracional.')
afegeix(2, 'I', '2√2', 'Enter per arrel → irracional.')
afegeix(2, 'I', '√2/2', 'Arrel dividida per enter → irracional.')
afegeix(2, 'I', 'e', '2,718281… base del logaritme natural: irracional.')

/* ---------- Nivell 3 · Difícil ---------- */

// les trampes clàssiques
afegeix(3, 'N', '√9', '= 3. Sembla irracional… però l\'arrel és exacta: natural!')
afegeix(3, 'N', '√121', '= 11. Arrel exacta → natural.')
afegeix(3, 'N', '√144', '= 12. Arrel exacta → natural.')
afegeix(3, 'N', '(−2)²', '= 4. El quadrat d\'un negatiu és positiu: natural.')
afegeix(3, 'N', '(−3)²', '= 9. El quadrat d\'un negatiu és positiu: natural.')
afegeix(3, 'N', '(−5)²', '= 25. El quadrat d\'un negatiu és positiu: natural.')
afegeix(3, 'N', '(−7)²', '= 49. El quadrat d\'un negatiu és positiu: natural.')
afegeix(3, 'N', '−(−6)', '= 6. Menys per menys → natural.')
afegeix(3, 'N', '−(−9)', '= 9. Menys per menys → natural.')
afegeix(3, 'N', '−(−15)', '= 15. Menys per menys → natural.')
afegeix(3, 'N', '|−8|', '= 8. El valor absolut és sempre positiu.')
afegeix(3, 'N', '|−13|', '= 13. El valor absolut és sempre positiu.')
afegeix(3, 'N', '√2·√2', '= (√2)² = 2. Sorpresa: natural!')
afegeix(3, 'N', '√3·√3', '= (√3)² = 3. Sorpresa: natural!')
afegeix(3, 'N', '√5·√5', '= (√5)² = 5. Sorpresa: natural!')
afegeix(3, 'N', '√8·√2', '= √16 = 4. Arrels que escancel·len: natural!')
afegeix(3, 'N', '0,999…', '= 1 exactament! Periòdic que val un natural.')
afegeix(3, 'N', '3³', '= 27. Potència sencera → natural.')
afegeix(3, 'N', '5³', '= 125. Potència sencera → natural.')
afegeix(3, 'N', '2⁶', '= 64. Potència sencera → natural.')
afegeix(3, 'N', '7²', '= 49. Potència sencera → natural.')
afegeix(3, 'N', '6²', '= 36. Potència sencera → natural.')
afegeix(3, 'N', '21/7', '= 3. Fracció que val un natural!')
afegeix(3, 'N', '24/8', '= 3. Fracció que val un natural!')
afegeix(3, 'N', '36/9', '= 4. Fracció que val un natural!')
afegeix(3, 'N', '45/9', '= 5. Fracció que val un natural!')
afegeix(3, 'N', '100/10', '= 10. Fracció que val un natural!')

afegeix(3, 'Z', '−√16', '= −4. Sembla irracional, però és l\'enter −4!')
afegeix(3, 'Z', '−√9', '= −3. Arrel exacta amb signe: enter.')
afegeix(3, 'Z', '−√81', '= −9. Arrel exacta amb signe: enter.')
afegeix(3, 'Z', '−√100', '= −10. Arrel exacta amb signe: enter.')
afegeix(3, 'Z', '−3²', '= −9. La potència es fa abans que el signe: enter.')
afegeix(3, 'Z', '−4²', '= −16. La potència es fa abans que el signe: enter.')
afegeix(3, 'Z', '−10/5', '= −2. El valor és enter.')
afegeix(3, 'Z', '−12/4', '= −3. El valor és enter.')

afegeix(3, 'Q', '22/7', '= 3,142857… racional. S\'assembla a π, però NO és π!')
afegeix(3, 'Q', '3,141414…', 'Periòdic (14) = 311/99. S\'assembla a π, però és racional!')
afegeix(3, 'Q', '(1/2)²', '= 1/4. Quadrat d\'una fracció → racional.')
afegeix(3, 'Q', '(1/3)²', '= 1/9. Quadrat d\'una fracció → racional.')
afegeix(3, 'Q', '(2/3)²', '= 4/9. Quadrat d\'una fracció → racional.')
afegeix(3, 'Q', '(3/4)²', '= 9/16. Quadrat d\'una fracció → racional.')
afegeix(3, 'Q', '(1/5)²', '= 1/25. Quadrat d\'una fracció → racional.')
afegeix(3, 'Q', '√(1/4)', '= 1/2. Arrel exacta de fracció → racional.')
afegeix(3, 'Q', '√(4/9)', '= 2/3. Arrel exacta de fracció → racional.')
afegeix(3, 'Q', '√(9/25)', '= 3/5. Arrel exacta de fracció → racional.')
afegeix(3, 'Q', '√(16/49)', '= 4/7. Arrel exacta de fracció → racional.')
afegeix(3, 'Q', '√(25/36)', '= 5/6. Arrel exacta de fracció → racional.')
afegeix(3, 'Q', '0,2727…', 'Periòdic (= 3/11) → racional.')
afegeix(3, 'Q', '0,555…', 'Periòdic (= 5/9) → racional.')
afegeix(3, 'Q', '1,777…', 'Periòdic (= 16/9) → racional.')
afegeix(3, 'Q', '5,333…', 'Periòdic (= 16/3) → racional.')
afegeix(3, 'Q', '7,888…', 'Periòdic (= 71/9) → racional.')
afegeix(3, 'Q', '−1,444…', 'Periòdic (= −13/9) → racional.')
afegeix(3, 'Q', '2⁻³', '= 1/8 (= 0,125) → racional.')
afegeix(3, 'Q', '5⁻²', '= 1/25 (= 0,04) → racional.')
afegeix(3, 'Q', '4⁻¹', '= 1/4 (= 0,25) → racional.')
afegeix(3, 'Q', '10⁻³', '= 0,001. Exponent negatiu → racional.')

afegeix(3, 'I', '√13', '13 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√14', '14 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√17', '17 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√19', '19 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√21', '21 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√22', '22 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√23', '23 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√24', '24 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√26', '26 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√28', '28 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√30', '30 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√32', '32 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√97', '97 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√99', '99 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '−√10', 'Oposat d\'un irracional → irracional.')
afegeix(3, 'I', '−√50', '50 no és quadrat perfecte → irracional.')
afegeix(3, 'I', '√2·√3', '= √6 → irracional.')
afegeix(3, 'I', '2+√3', 'L\'arrel hi continua essent → irracional.')
afegeix(3, 'I', '√2−1', 'L\'arrel hi continua essent → irracional.')
afegeix(3, 'I', '3√5', 'Enter per arrel → irracional.')
afegeix(3, 'I', '5√2', 'Enter per arrel → irracional.')
afegeix(3, 'I', '√3/2', 'Arrel dividida per enter → irracional.')
afegeix(3, 'I', '(1+√2)²', '= 3 + 2√2 → irracional.')
afegeix(3, 'I', 'π+1', 'Sumar un enter no treu la irracionalitat.')
afegeix(3, 'I', '3π', 'π per un enter → irracional.')
afegeix(3, 'I', 'π/4', 'π dividit per un enter → irracional.')
afegeix(3, 'I', 'π²', 'Quadrat de π → irracional.')
afegeix(3, 'I', 'e²', 'Quadrat de e → irracional.')
afegeix(3, 'I', 'e+1', 'L\'irracional hi continua essent → irracional.')
afegeix(3, 'I', '2e', 'e per un enter → irracional.')
afegeix(3, 'I', 'φ', 'Nombre àuri (1+√5)/2 = 1,618033…: irracional.')
afegeix(3, 'I', '0,101001000…', 'Infinit, sense període → irracional.')
afegeix(3, 'I', '0,010010001…', 'Infinit, sense període → irracional.')
afegeix(3, 'I', '3,050050005…', 'Infinit, sense període → irracional.')
afegeix(3, 'I', '12,343443444…', 'Infinit, sense període → irracional.')
afegeix(3, 'I', '0,123456789101112…', 'Escriptura dels enters: infinit i no periòdic → irracional.')

/* ---------- Exportació ----------
   Permutació determinista (mateixa llavor a servidor i client, sense hidratació
   diferent) per no agrupar els nombres per conjunts en el banc inicial. */

function permutaDeterminista<T>(arr: T[], llavor: number): T[] {
  const a = [...arr]
  let s = llavor
  const rnd = () => {
    s = (s * 1103515245 + 12345) % 2147483648
    return s / 2147483648
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const NUMEROS: Numero[] = permutaDeterminista(db, 20261011)
