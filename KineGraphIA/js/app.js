import { inicialitzaUI, ompleSelectorExemples } from './ui.js';
import './physics.js';
import './draw.js';
import './storage.js';
import './export.js';
import './api.js';
import { SAMPLE_PROBLEMS } from '../data/sampleProblems.js';

function arrencaAplicacio() {
  inicialitzaUI();
  ompleSelectorExemples(SAMPLE_PROBLEMS);
  console.log('[app.js] aplicació inicialitzada');
}

document.addEventListener('DOMContentLoaded', arrencaAplicacio);
