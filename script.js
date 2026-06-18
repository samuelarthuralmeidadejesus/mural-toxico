// =============================================================
// MURAL_TÓXICO — demo educacional de Stored XSS
// Tudo roda 100% no navegador (localStorage), sem backend.
// =============================================================

const STORAGE_KEY_RECADOS = 'muralToxico_recados';
const STORAGE_KEY_MODO = 'muralToxico_modo';

const recadoInput = document.getElementById('recadoInput');
const publishBtn = document.getElementById('publishBtn');
const clearBtn = document.getElementById('clearBtn');
const toggleModeBtn = document.getElementById('toggleModeBtn');
const modeBadge = document.getElementById('modeBadge');
const mural = document.getElementById('mural');

// ---- estado -----------------------------------------------

function getRecados() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_RECADOS)) || [];
  } catch {
    return [];
  }
}

function saveRecados(lista) {
  localStorage.setItem(STORAGE_KEY_RECADOS, JSON.stringify(lista));
}

function getModo() {
  // 'seguro' é o padrão por responsabilidade; o usuário escolhe ver o modo vulnerável
  return localStorage.getItem(STORAGE_KEY_MODO) || 'seguro';
}

function setModo(modo) {
  localStorage.setItem(STORAGE_KEY_MODO, modo);
}

// ---- renderização -------------------------------------------

function atualizarBadgeModo() {
  const modo = getModo();
  if (modo === 'vulneravel') {
    modeBadge.textContent = 'VULNERÁVEL :: innerHTML';
    modeBadge.className = 'mode-badge vulneravel';
  } else {
    modeBadge.textContent = 'SEGURO :: textContent';
    modeBadge.className = 'mode-badge seguro';
  }
}

function renderizarMural() {
  const recados = getRecados();
  const modo = getModo();

  mural.innerHTML = ''; // limpa apenas o container (não vem de input do usuário)

  if (recados.length === 0) {
    const vazio = document.createElement('div');
    vazio.className = 'mural-empty';
    vazio.textContent = 'Nenhum recado publicado ainda. Seja o primeiro.';
    mural.appendChild(vazio);
    return;
  }

  // mais recentes primeiro
  recados.slice().reverse().forEach((recado) => {
    const card = document.createElement('article');
    card.className = 'recado-card';

    const header = document.createElement('div');
    header.className = 'recado-card-header';

    const idSpan = document.createElement('span');
    idSpan.className = 'recado-card-id';
    idSpan.textContent = `#${recado.id}`;

    const dataSpan = document.createElement('span');
    dataSpan.textContent = recado.data;

    header.appendChild(idSpan);
    header.appendChild(dataSpan);

    const body = document.createElement('div');
    body.className = 'recado-card-body';

    // >>> ponto central da demonstração <<<
    if (modo === 'vulneravel') {
      // MODO VULNERÁVEL: o conteúdo do usuário é interpretado como HTML/JS.
      body.innerHTML = recado.texto;
    } else {
      // MODO SEGURO: o conteúdo do usuário é tratado como texto puro.
      body.textContent = recado.texto;
    }

    card.appendChild(header);
    card.appendChild(body);
    mural.appendChild(card);
  });
}

// ---- ações ----------------------------------------------------

function publicarRecado() {
  const texto = recadoInput.value.trim();
  if (!texto) return;

  const recados = getRecados();
  recados.push({
    id: Date.now(),
    texto: texto,
    data: new Date().toLocaleString('pt-BR'),
  });

  saveRecados(recados);
  recadoInput.value = '';
  renderizarMural();
}

function limparRecados() {
  const confirmado = confirm('Tem certeza que deseja apagar todos os recados? Esta ação não pode ser desfeita.');
  if (!confirmado) return;

  localStorage.removeItem(STORAGE_KEY_RECADOS);
  renderizarMural();
}

function alternarModo() {
  const novoModo = getModo() === 'vulneravel' ? 'seguro' : 'vulneravel';
  setModo(novoModo);
  atualizarBadgeModo();
  renderizarMural(); // re-renderiza os MESMOS recados sob a nova regra de exibição
}

// ---- eventos ----------------------------------------------------

publishBtn.addEventListener('click', publicarRecado);
clearBtn.addEventListener('click', limparRecados);
toggleModeBtn.addEventListener('click', alternarModo);

recadoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
    publicarRecado();
  }
});

// ---- inicialização ----------------------------------------------------

atualizarBadgeModo();
renderizarMural();
