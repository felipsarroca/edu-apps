document.addEventListener('DOMContentLoaded', () => {
  // Constants
  const APP_TITLE = "Joc dels marcs d'integració de la IA";
  const AI_LEVELS = [
    "Nivell 0: Treball completament humà.",
    "Nivell 1: Assistència tècnica per IA.",
    "Nivell 2: Planificació i estructuració assistida per IA.",
    "Nivell 3: Assistència parcial de IA amb control humà.",
    "Nivell 4: Col·laboració avançada humà-IA.",
    "Nivell 5: Supervisió humana de la IA autònoma."
  ];

  const gameQuestionsData = [
    {
      id: 1,
      scenario: "Una alumna ha redactat un treball de socials en català, la seva llengua materna. Abans d'entregar-lo, utilitza una eina d'IA per revisar l'ortografia, la gramàtica i la puntuació, i accepta la majoria dels canvis suggerits per polir el text.",
      correctAnswerIndex: 1,
      correctLevelName: "Nivell 1: Assistència tècnica per IA.",
      feedback: "L'alumna utilitza la IA exclusivament per a tasques mecàniques, com la correcció ortogràfica i gramatical. La IA no genera contingut nou ni influeix en les idees originals de l'alumna, sinó que actua com una eina de suport per millorar la qualitat formal del text."
    },
    {
      id: 2,
      scenario: "Un estudiant ha de fer una presentació sobre el canvi climàtic, però no sap com començar. Demana a la IA: \"Dona'm una pluja d'idees i un possible índex per a una presentació de 10 minuts sobre el canvi climàtic per a alumnes de secundària\". L'estudiant utilitza aquest índex com a guia per investigar i redactar tot el contingut de la presentació per si mateix.",
      correctAnswerIndex: 2,
      correctLevelName: "Nivell 2: Planificació i estructuració assistida per IA.",
      feedback: "La IA s'utilitza en les etapes preparatòries per a la generació d'idees inicials i l'estructuració del treball. L'estudiant no incorpora contingut generat per la IA en el producte final, però les idees i l'estructura suggerides sí que influeixen en el seu desenvolupament. El contingut final és desenvolupat íntegrament per l'humà."
    },
    {
      id: 3,
      scenario: "Un alumne està creant una presentació sobre els volcans. Ja ha redactat la major part del contingut, però demana a la IA que li generi un paràgraf introductori i un paràgraf de conclusió. L'alumne copia aquests dos paràgrafs, els revisa, canvia algunes paraules i els integra a la seva presentació.",
      correctAnswerIndex: 3,
      correctLevelName: "Nivell 3: Assistència parcial de IA amb control humà.",
      feedback: "La IA genera una part del contingut final. L'alumne revisa, adapta i millora aquest contingut, mantenint un control significatiu sobre el resultat. La interacció és principalment unidireccional (la IA produeix, l'humà modifica) i l'extensió del contingut generat per la IA no supera la contribució de l'humà."
    },
    {
      id: 4,
      scenario: "Un estudiant de batxillerat ha de resoldre un problema complex de física. Utilitza la IA com un tutor: primer li demana que li expliqui el concepte teòric, després li demana el primer pas per resoldre el problema. L'estudiant fa el càlcul i li pregunta a la IA si és correcte abans de demanar-li la següent pista. Aquest diàleg continua fins que l'estudiant resol completament el problema.",
      correctAnswerIndex: 4,
      correctLevelName: "Nivell 4: Col·laboració avançada humà-IA.",
      feedback: "S'estableix un diàleg continu i bidireccional entre l'humà i la IA, amb iteracions freqüents per arribar a la solució. L'estudiant guia activament la IA durant tot el procés, refinant la seva comprensió a través de la conversa. El resultat és una fusió entre el raonament de l'alumne i la guia de la IA."
    },
    {
      id: 5,
      scenario: "Una professora de literatura demana als seus alumnes que analitzin els arquetips dels contes de fades. Per fer-ho, els indica que demanin a una IA que generi un conte breu amb el títol \"La Caputxeta Vermella a l'era de les xarxes socials\". La tasca de l'alumne consisteix a llegir el conte generat per la IA i escriure una anàlisi crítica identificant-ne els temes i els personatges, sense modificar el text original.",
      correctAnswerIndex: 5,
      correctLevelName: "Nivell 5: Supervisió humana de la IA autònoma.",
      feedback: "L'humà (en aquest cas, seguint les instruccions de la professora) estableix els paràmetres inicials (\"genera un conte sobre X tema\") i la IA desenvolupa el treball de manera autònoma. El contingut generat no es modifica, sinó que s'utilitza com a material de referència o punt de partida per a una altra tasca educativa diferent: l'anàlisi literària."
    },
    {
      id: 6,
      scenario: "Durant un examen de matemàtiques a l'aula, un estudiant resol tots els problemes utilitzant només llapis, paper i una calculadora científica no programable permesa pel professor.",
      correctAnswerIndex: 0,
      correctLevelName: "Nivell 0: Treball completament humà.",
      feedback: "No s'utilitza cap forma d'intel·ligència artificial en cap etapa de la tasca. L'estudiant depèn exclusivament dels seus propis coneixements i de recursos tradicionals permesos."
    },
    {
      id: 7,
      scenario: "Un alumne ha recollit una llista de 30 esdeveniments clau de la Segona Guerra Mundial amb les seves dates, però estan desordenats. Introdueix la llista a la IA i li demana que la reorganitzi en una taula cronològica.",
      correctAnswerIndex: 1,
      correctLevelName: "Nivell 1: Assistència tècnica per IA.",
      feedback: "La IA s'utilitza per a una tasca mecànica de reorganització d'informació existent. No es genera contingut nou ni s'alteren les idees; simplement es facilita la presentació de la informació."
    },
    {
      id: 8,
      scenario: "Un estudiant ha de redactar un assaig sobre l'energia nuclear. Per documentar-se, demana a la IA: \"Resumeix els principals arguments a favor i en contra de l'energia nuclear\". L'estudiant llegeix aquests arguments, busca més informació en altres fonts i després escriu l'assaig amb les seves pròpies paraules i estructura, utilitzant les idees inicials com a punt de partida.",
      correctAnswerIndex: 2,
      correctLevelName: "Nivell 2: Planificació i estructuració assistida per IA.",
      feedback: "La IA s'usa per a la generació inicial d'idees i per entendre les diferents postures sobre un tema. L'alumne utilitza aquests suggeriments com a punt de partida, però desenvolupa el treball per si mateix, aplicant el seu propi criteri i sense incloure text generat per la IA en el lliurament final."
    },
    {
      id: 9,
      scenario: "Un alumne de música està component una melodia. Crea la part principal, però s'encalla en la transició. Demana a la IA que generi \"un pont de 4 compassos en la mateixa tonalitat i estil\". Després, escolta la proposta, la modifica lleugerament i la incorpora a la seva composició.",
      correctAnswerIndex: 3,
      correctLevelName: "Nivell 3: Assistència parcial de IA amb control humà.",
      feedback: "La IA genera una part específica i delimitada del contingut. L'humà manté el control, ja que revisa, adapta i integra aquesta peça dins la seva creació més gran. La contribució de l'humà al total de l'obra segueix sent superior a la de la IA."
    },
    {
      id: 10,
      scenario: "Per a un treball de biologia, una alumna ha escrit un text explicant la mitosi. Per il·lustrar-ho, demana a una IA generadora d'imatges: \"Crea un diagrama de les fases de la mitosi en un estil de dibuix animat educatiu\". Utilitza la imatge generada a la portada del seu treball.",
      correctAnswerIndex: 3,
      correctLevelName: "Nivell 3: Assistència parcial de IA amb control humà.",
      feedback: "La IA genera una part del contingut del treball (en aquest cas, un recurs gràfic). L'alumna actua com a directora, donant la instrucció i integrant el resultat en el seu projecte, on la seva aportació escrita és la part principal."
    },
    {
      id: 11,
      scenario: "Un grup d'estudiants està creant un pòdcast sobre història. Comencen demanant a la IA un esquema general. Després, per a cada episodi, li demanen que redacti un esborrany de guió. Els estudiants llegeixen el guió, li demanen canvis (\"fes aquest tros més amè\", \"afegeix una anècdota sobre aquest personatge\"), la IA genera una nova versió i els estudiants la tornen a editar i refinar fins que estan satisfets.",
      correctAnswerIndex: 4,
      correctLevelName: "Nivell 4: Col·laboració avançada humà-IA.",
      feedback: "Es produeix un diàleg continu i bidireccional, amb iteracions freqüents per refinar el contingut. Els estudiants guien activament la IA durant tot el procés creatiu, i el resultat és una fusió estreta del treball d'ambdós. Aquest procés es detalla en exemples com la creació d'un pòdcast."
    },
    {
      id: 12,
      scenario: "Un alumne ha d'escriure una redacció i la fa completament sol. Un cop acabada, demana a la IA: \"Suggereix 5 títols diferents per a aquesta redacció\". L'alumne tria un dels títols suggerits i l'utilitza.",
      correctAnswerIndex: 1,
      correctLevelName: "Nivell 1: Assistència tècnica per IA.",
      feedback: "Tot i que la IA genera una petita part de text, la seva funció és de suport mecànic i no altera el contingut principal ni les idees de la redacció. Proposar títols es pot assimilar a suggerir sinònims o millorar la claredat, ja que no afegeix coneixement nou al cos del treball."
    },
    {
      id: 13,
      scenario: "Un professor demana als alumnes que facin un treball de recerca sobre un animal en perill d'extinció. Un alumne demana a la IA que generi un informe complet sobre el linx ibèric. La tasca de l'alumne, segons les instruccions del professor, és verificar tota la informació de l'informe generat, contrastar-la amb fonts fiables, corregir les possibles dades errònies i afegir les cites de les fonts reals que ha consultat per a la verificació.",
      correctAnswerIndex: 5,
      correctLevelName: "Nivell 5: Supervisió humana de la IA autònoma.",
      feedback: "La IA genera el contingut de forma autònoma. El treball de l'alumne no consisteix a modificar l'estil o el contingut bàsic de l'informe, sinó a realitzar una tasca posterior i diferent: l'anàlisi crítica, la verificació de dades i la curació de fonts, tractant el text de la IA com un document font a examinar."
    },
    {
      id: 14,
      scenario: "Un estudiant ha escrit un text, però considera que el seu llenguatge és massa simple. Enganxa el text a una IA i li demana: \"Millora aquest text utilitzant un vocabulari més ric i variat\". L'estudiant revisa la proposta de la IA i accepta els canvis.",
      correctAnswerIndex: 1,
      correctLevelName: "Nivell 1: Assistència tècnica per IA.",
      feedback: "Aquesta tasca es considera una assistència tècnica. La IA no genera idees noves, sinó que es limita a suggerir termes o sinònims per millorar la claredat o l'estil de l'escriptura. L'humà manté el control total sobre el contingut i les idees."
    },
    {
      id: 15,
      scenario: "Un alumne ha de fer un vídeo sobre la seva ciutat. Grava les imatges, però en lloc d'escriure un guió, li demana a la IA que generi una narració poètica per a les imatges que ha gravat. L'alumne llegeix la narració, la grava amb la seva veu i l'afegeix al vídeo sense fer-hi canvis.",
      correctAnswerIndex: 3,
      correctLevelName: "Nivell 3: Assistència parcial de IA amb control humà.",
      feedback: "La IA genera una part substancial del contingut creatiu (la narració). L'alumne ha creat una altra part (les imatges) i integra el text de la IA en un tot coherent. Encara que no modifiqui el text, l'humà manté el control en ser el creador de la part visual i el director del projecte final. La contribució de l'humà (gravació, edició) i la de la IA (guió) són parts diferenciades del treball."
    },
    {
      id: 16,
      scenario: "Un estudiant utilitza la IA per traduir un article científic de l'anglès al català per poder entendre'l millor. Després, utilitza la informació d'aquest article per al seu treball, però redactant les idees amb les seves pròpies paraules.",
      correctAnswerIndex: 1,
      correctLevelName: "Nivell 1: Assistència tècnica per IA.",
      feedback: "L'ús de la IA es limita a la traducció d'un text existent per facilitar la comprensió, una tasca considerada mecànica. La IA no genera contingut nou per al treball final de l'alumne; només fa accessible una font d'informació."
    },
    {
      id: 17,
      scenario: "Per a un projecte d'art, una alumna té una idea per a un quadre. Descriu la seva idea a una IA (\"un paisatge surrealista amb un rellotge fos i un elefant amb potes de flamenc\") i li demana que generi diverses versions. L'alumna les mira i li demana canvis: \"Fes que el cel sigui de color porpra\", \"afegeix una lluna trencada\". Després d'aquest procés iteratiu, tria una imatge, la imprimeix i la utilitza com a base per pintar-hi a sobre amb pintura a l'oli, afegint la seva pròpia textura i detalls.",
      correctAnswerIndex: 4,
      correctLevelName: "Nivell 4: Col·laboració avançada humà-IA.",
      feedback: "La creació de la imatge base és un procés de diàleg continu i bidireccional, amb iteracions freqüents on l'alumna guia la IA per refinar el resultat. El producte final (el quadre) és una fusió del treball generat per la IA i la intervenció artística directa i personal de l'alumna, on el judici crític de l'humà és clau."
    },
    {
      id: 18,
      scenario: "Un estudiant de filosofia ha de participar en un debat sobre l'ètica de la IA. Per preparar-se, demana a una IA que redacti un diàleg filosòfic entre dos personatges que defensen postures oposades. La tasca de l'estudiant és analitzar els arguments de cada personatge del text generat i preparar les seves pròpies rèpliques i contraarguments per al debat real.",
      correctAnswerIndex: 5,
      correctLevelName: "Nivell 5: Supervisió humana de la IA autònoma.",
      feedback: "La IA genera un text complet de manera autònoma basant-se en uns paràmetres inicials. Aquest diàleg no s'altera, sinó que s'utilitza com a punt de partida o material de referència per a una tasca posterior i diferent: la preparació per al debat."
    },
    {
      id: 19,
      scenario: "Un alumne entrega un treball escrit. El professor, en corregir-lo, sospita que s'ha utilitzat IA. L'alumne admet que, tot i que ell va escriure tot el text, va utilitzar una eina d'IA per resumir automàticament cada capítol d'un llibre de text per estalviar temps de lectura. Després va utilitzar aquests resums per escriure el seu treball.",
      correctAnswerIndex: 2,
      correctLevelName: "Nivell 2: Planificació i estructuració assistida per IA.",
      feedback: "Encara que l'ús de resums (Nivell 1) pugui semblar la resposta, la funció real de la IA aquí és ajudar a processar la informació prèvia a la redacció. La IA influeix en les idees i el coneixement que l'alumne adquireix abans d'escriure, actuant com un assistent en la fase de recerca i comprensió. Com que l'alumne redacta el contingut final ell mateix, però basant-se en una comprensió \"filtrada\" per la IA, encaixa millor en la planificació i preparació pròpia del Nivell 2."
    },
    {
      id: 20,
      scenario: "Un alumne ha de fer un informe sobre les energies renovables. Busca informació a Internet, redacta tot l'informe i, al final, demana a la IA: \"Crea una bibliografia en format APA a partir d'aquesta llista de links que he utilitzat\".",
      correctAnswerIndex: 1,
      correctLevelName: "Nivell 1: Assistència tècnica per IA.",
      feedback: "Aquesta és una tasca purament mecànica i de formatació. La IA no aporta contingut ni idees, sinó que organitza informació existent (la llista de links) en un format de citació específic. L'humà manté el control total sobre el contingut intel·lectual del treball."
    }
  ];

  const levelIcons = {
    0: "fas fa-user", 1: "fas fa-cogs", 2: "fas fa-lightbulb",
    3: "fas fa-puzzle-piece", 4: "fas fa-hands-helping", 5: "fas fa-robot"
  };
  const levelColors = {
    0: "bg-level_0 text-darkgray", 1: "bg-level_1 text-primary_dark",
    2: "bg-level_2 text-accent_dark", 3: "bg-level_3 text-orange-800",
    4: "bg-level_4 text-purple-800", 5: "bg-level_5 text-danger_dark"
  };

  // Game State
  let gameState = 'welcome'; // 'welcome', 'playing', 'ended', 'loading'
  let questions = [];
  let currentQuestionIndex = 0;
  let score = { correct: 0, incorrect: 0 };
  let selectedAnswer = null; // Index of the selected answer
  let isCorrectAnswer = null; // Boolean: true, false, or null
  let showNextButton = false;

  // DOM Elements
  const welcomeScreen = document.getElementById('welcome-screen');
  const gameScreen = document.getElementById('game-screen');
  const endScreen = document.getElementById('end-screen');
  const loadingScreen = document.getElementById('loading-screen');

  const appTitleWelcome = document.getElementById('app-title-welcome');
  const startGameButton = document.getElementById('start-game-button');

  const aiLevelsContainer = document.getElementById('ai-levels-container');
  const answeredQuestionsDisplay = document.getElementById('answered-questions-display');
  const correctAnswersDisplay = document.getElementById('correct-answers-display');
  const incorrectAnswersDisplay = document.getElementById('incorrect-answers-display');
  const questionCounterDisplay = document.getElementById('question-counter-display');
  const questionScenarioDisplay = document.getElementById('question-scenario-display');
  const answerOptionsContainer = document.getElementById('answer-options-container');
  const feedbackMessageContainer = document.getElementById('feedback-message-container');
  const nextQuestionButtonContainer = document.getElementById('next-question-button-container');
  const nextQuestionButton = document.getElementById('next-question-button');

  const endScreenIconContainer = document.getElementById('end-screen-icon-container');
  const finalCorrectDisplay = document.getElementById('final-correct-display');
  const finalIncorrectDisplay = document.getElementById('final-incorrect-display');
  const finalPercentageDisplay = document.getElementById('final-percentage-display');
  const finalMessageDisplay = document.getElementById('final-message-display');
  const restartGameButton = document.getElementById('restart-game-button');

  // Helper Functions
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const showCurrentScreen = () => {
    if (welcomeScreen) welcomeScreen.classList.add('hidden-screen');
    if (gameScreen) gameScreen.classList.add('hidden-screen');
    if (endScreen) endScreen.classList.add('hidden-screen');
    if (loadingScreen) loadingScreen.classList.add('hidden-screen');

    if (gameState === 'welcome' && welcomeScreen) welcomeScreen.classList.remove('hidden-screen');
    else if (gameState === 'playing' && gameScreen) gameScreen.classList.remove('hidden-screen');
    else if (gameState === 'ended' && endScreen) endScreen.classList.remove('hidden-screen');
    else if (loadingScreen) loadingScreen.classList.remove('hidden-screen');
  };

  // Render Functions
  const renderWelcomeScreen = () => {
    if (appTitleWelcome) appTitleWelcome.textContent = APP_TITLE;
  };

  const renderAILevelsSidebar = () => {
    if (!aiLevelsContainer) return;
    aiLevelsContainer.innerHTML = ''; // Clear previous levels
    AI_LEVELS.forEach((level, index) => {
      const [titlePart, ...descriptionParts] = level.split(':');
      const description = descriptionParts.join(':').trim();
      const levelDiv = document.createElement('div');
      const colorKey = levelColors[index] ? levelColors[index].split(' ')[0].replace('bg-', 'border-') : 'border-mediumgray';
      levelDiv.className = `p-4 rounded-lg shadow-subtle border-l-4 ${colorKey} transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-primary_dark hover:shadow-md`;
      
      const iconClass = levelIcons[index] || 'fas fa-question'; // Default icon
      const bgColorClass = levelColors[index] || 'bg-mediumgray text-darkgray';

      levelDiv.innerHTML = `
        <div class="flex items-center mb-2">
          <div class="ai-level-card-icon mr-3 ${bgColorClass}">
            <i class="${iconClass}"></i>
          </div>
          <h3 class="text-lg font-semibold text-white">${titlePart}</h3>
        </div>
        <p class="text-base text-blue-200 leading-relaxed">${description}</p>
      `;
      aiLevelsContainer.appendChild(levelDiv);
    });
  };
  
  const renderScoreboard = () => {
    if (answeredQuestionsDisplay) answeredQuestionsDisplay.innerHTML = `<i class="fas fa-list-ol mr-2"></i>${currentQuestionIndex} / ${questions.length}`;
    if (correctAnswersDisplay) correctAnswersDisplay.innerHTML = `<i class="fas fa-check-circle mr-2"></i>${score.correct}`;
    if (incorrectAnswersDisplay) incorrectAnswersDisplay.innerHTML = `<i class="fas fa-times-circle mr-2"></i>${score.incorrect}`;
  };

  const renderQuestion = () => {
    if (!questions || questions.length === 0 || !questions[currentQuestionIndex]) {
        if(questionScenarioDisplay) questionScenarioDisplay.textContent = "Error: No s'ha pogut carregar la pregunta.";
        if(answerOptionsContainer) answerOptionsContainer.innerHTML = '';
        return;
    }
    const currentQuestion = questions[currentQuestionIndex];

    if (questionCounterDisplay) questionCounterDisplay.innerHTML = `<i class="fas fa-question-circle mr-1"></i> Pregunta ${currentQuestionIndex + 1} <span class="text-gray-500">de ${questions.length}</span>`;
    if (questionScenarioDisplay) questionScenarioDisplay.textContent = currentQuestion.scenario;
    
    if (!answerOptionsContainer) return;
    answerOptionsContainer.innerHTML = ''; // Clear old options

    AI_LEVELS.forEach((_, index) => {
      const button = document.createElement('button');
      button.setAttribute('aria-label', `Seleccionar Nivell ${index}`);
      button.dataset.index = index;

      let buttonClass = `py-3.5 px-2 sm:px-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out border-2 flex flex-col items-center justify-center min-h-[64px] sm:min-h-[72px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary `;

      if (selectedAnswer === null) {
        buttonClass += 'bg-white text-primary border-primary hover:bg-primary_dark hover:text-white hover:border-primary_dark hover:scale-110 hover:shadow-lg';
        button.disabled = false;
      } else {
        const isButtonCorrect = index === currentQuestion.correctAnswerIndex;
        const isButtonSelected = selectedAnswer === index;
        if (isButtonCorrect) {
          buttonClass += 'bg-accent text-white border-green-700 shadow-xl scale-105 border-4';
        } else if (isButtonSelected) { // Incorrectly selected by user
          buttonClass += 'bg-danger text-white border-red-700 shadow-xl scale-105 border-4';
        } else { // Other buttons, not selected
          buttonClass += 'bg-gray-200 text-gray-500 border-gray-300 opacity-60 cursor-not-allowed';
        }
        button.disabled = true;
      }
      button.className = buttonClass;

      let iconHtml = '';
      if (selectedAnswer !== null) {
        if (index === currentQuestion.correctAnswerIndex) {
            iconHtml = `<i class="fas fa-check mb-1 text-lg"></i>`;
        } else if (selectedAnswer === index) {
            iconHtml = `<i class="fas fa-times mb-1 text-lg"></i>`;
        }
      }
      button.innerHTML = `${iconHtml}<span>Nivell ${index}</span>`;
      
      button.addEventListener('click', () => handleAnswer(index));
      answerOptionsContainer.appendChild(button);
    });
  };

  const renderFeedback = () => {
    if (!feedbackMessageContainer) return;
    if (selectedAnswer === null || !questions[currentQuestionIndex]) {
      feedbackMessageContainer.classList.add('hidden-screen');
      feedbackMessageContainer.innerHTML = '';
      return;
    }
    const currentQuestion = questions[currentQuestionIndex];
    feedbackMessageContainer.classList.remove('hidden-screen');
    feedbackMessageContainer.className = `p-4 mt-6 rounded-lg animate-fadeIn text-white shadow-medium border-l-4 ${isCorrectAnswer ? 'bg-accent border-green-700' : 'bg-danger border-red-700'}`;
    
    let feedbackHtml = `<h4 class="font-bold text-xl mb-1.5 flex items-center">`;
    if (isCorrectAnswer) {
      feedbackHtml += `<i class="fas fa-check-circle mr-2 text-2xl"></i>Resposta Correcta!</h4>`;
    } else {
      feedbackHtml += `<i class="fas fa-times-circle mr-2 text-2xl"></i>Resposta Incorrecta</h4>`;
      feedbackHtml += `<p class="mb-1 text-base font-semibold">La resposta correcta era: <strong>${AI_LEVELS[currentQuestion.correctAnswerIndex] ? AI_LEVELS[currentQuestion.correctAnswerIndex].split(':')[0] : 'Nivell Desconegut'}</strong></p>`;
    }
    feedbackHtml += `<p class="text-base leading-relaxed">${currentQuestion.feedback}</p>`;
    feedbackMessageContainer.innerHTML = feedbackHtml;
  };

  const renderGameScreen = () => {
    renderScoreboard();
    renderQuestion();
    renderFeedback(); 
    if (nextQuestionButtonContainer) {
        if (showNextButton) {
          nextQuestionButtonContainer.classList.remove('hidden-screen');
          if (nextQuestionButton) nextQuestionButton.textContent = (currentQuestionIndex + 1 === questions.length) ? 'Veure Resultats Finals' : 'Següent Pregunta';
        } else {
          nextQuestionButtonContainer.classList.add('hidden-screen');
        }
    }
  };

  const renderEndScreen = () => {
    if(!questions || questions.length === 0) return; // Prevent division by zero or errors if questions aren't loaded

    const allCorrect = score.correct === questions.length;
    const percentage = questions.length > 0 ? Math.round((score.correct / questions.length) * 100) : 0;

    if (endScreenIconContainer) endScreenIconContainer.innerHTML = allCorrect ? `<i class="fas fa-trophy text-secondary animate-pulseEmphasis"></i>` : `<i class="fas fa-flag-checkered text-blue-300"></i>`;
    if (finalCorrectDisplay) finalCorrectDisplay.textContent = `${score.correct} / ${questions.length}`;
    if (finalIncorrectDisplay) finalIncorrectDisplay.textContent = `${score.incorrect} / ${questions.length}`;
    if (finalPercentageDisplay) finalPercentageDisplay.textContent = `${percentage}%`;

    if (finalMessageDisplay) {
        if (allCorrect) {
          finalMessageDisplay.className = "text-lg text-accent font-semibold my-6 p-4 bg-green-100 rounded-lg border-l-4 border-accent";
          finalMessageDisplay.innerHTML = `<i class="fas fa-star mr-2"></i>Excel·lent! Has encertat totes les situacions! Mostra aquest resultat al teu professor/a.`;
        } else {
          finalMessageDisplay.className = "text-lg text-yellow-700 font-semibold my-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-secondary";
          finalMessageDisplay.innerHTML = `<i class="fas fa-lightbulb mr-2"></i>Molt bona feina! Encara pots millorar. Per què no ho tornes a intentar per aconseguir el 100%?`;
        }
    }
  };

  // Game Logic
  const initializeGame = () => {
    questions = shuffleArray(gameQuestionsData);
    currentQuestionIndex = 0;
    score = { correct: 0, incorrect: 0 };
    selectedAnswer = null;
    isCorrectAnswer = null;
    showNextButton = false;
  };

  const handleStartGame = () => {
    initializeGame();
    gameState = 'playing';
    renderGameScreen();
    showCurrentScreen();
  };

  const handleAnswer = (answerIndex) => {
    if (selectedAnswer !== null || !questions[currentQuestionIndex]) return; 

    const currentQuestion = questions[currentQuestionIndex];
    selectedAnswer = answerIndex;
    isCorrectAnswer = (answerIndex === currentQuestion.correctAnswerIndex);

    if (isCorrectAnswer) {
      score.correct++;
    } else {
      score.incorrect++;
    }
    showNextButton = true;
    renderGameScreen(); 
  };

  const handleNextQuestion = () => {
    selectedAnswer = null;
    isCorrectAnswer = null;
    showNextButton = false;
    if(feedbackMessageContainer) feedbackMessageContainer.classList.add('hidden-screen');


    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      renderGameScreen();
    } else {
      gameState = 'ended';
      renderEndScreen();
      showCurrentScreen();
    }
  };

  const handleRestartGame = () => {
    handleStartGame(); 
  };

  // Event Listeners
  if (startGameButton) startGameButton.addEventListener('click', handleStartGame);
  if (nextQuestionButton) nextQuestionButton.addEventListener('click', handleNextQuestion);
  if (restartGameButton) restartGameButton.addEventListener('click', handleRestartGame);
  
  // Initial Setup
  renderWelcomeScreen();
  renderAILevelsSidebar(); 
  showCurrentScreen(); 
});
