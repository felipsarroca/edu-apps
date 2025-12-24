## Disseny backend (esborrany)

Objectiu: desar i recuperar perfils d’usuari i el seu progrés.

### Dades a guardar

Perfil
- id (string)
- name (string)
- createdAt (ISO)
- updatedAt (ISO)
- unlockedLevel (number)
- points (number)
- streak (number)
- badges (array<string>)
- stats:
  - correct (number)
  - wrong (number)
  - bestStreak (number)

Partida
- id (string)
- profileId (string)
- levelId (string)
- poolSeed (string)
- correctCount (number)
- maxStreak (number)
- updatedAt (ISO)

### Endpoints (REST)

GET /profiles
POST /profiles
GET /profiles/:id
PATCH /profiles/:id

GET /profiles/:id/progress
PATCH /profiles/:id/progress

GET /profiles/:id/session
POST /profiles/:id/session
PATCH /profiles/:id/session

### Emmagatzematge

Opcions:
1) Google Sheets (senzill, sense servidor propi).
2) SQLite + API lleugera (Node/Express).

### Nota

Per començar es pot seguir amb localStorage i afegir el backend quan l’estructura sigui estable.
