const storageKey = 'workspace_state';

const app = document.getElementById('app');

const state = {
  user: null,
  workspace: null,
  activeProjectIndex: 0,
  activeView: 'table',
};

function saveState() {
  const payload = {
    user: state.user,
    workspace: state.workspace,
    activeProjectIndex: state.activeProjectIndex,
    activeView: state.activeView,
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

function loadState() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : null;
}

function createDefaultProject(name) {
  return {
    id: crypto.randomUUID(),
    name,
    rows: [
      { item: 'Exemplo', description: 'Primeira tarefa', status: 'Em progresso', responsible: 'owner' },
    ],
    topics: [
      { title: 'Objetivo', description: 'Definir a visão do projeto.' },
    ],
    planner: [
      { title: 'Reunião', description: 'Planejar o próximo passo', date: '2026-10-01' },
    ],
    sharedWith: [],
  };
}

function createUser(email) {
  return {
    email,
    desktopName: `Desktop ${email}`,
  };
}

function getWorkspaceFromUser(user) {
  const saved = loadState();
  if (saved && saved.user && saved.user.email === user.email) {
    return saved.workspace || { projects: [] };
  }

  return {
    projects: [createDefaultProject('Projeto inicial')],
  };
}

function login(email) {
  const cleanEmail = email.trim();
  if (!cleanEmail) return;

  state.user = createUser(cleanEmail);
  state.workspace = getWorkspaceFromUser(state.user);
  state.activeProjectIndex = 0;
  state.activeView = 'table';
  saveState();
  renderWorkspace();
}

function logout() {
  state.user = null;
  state.workspace = null;
  localStorage.removeItem(storageKey);
  renderLogin();
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-screen">
      <div class="card">
        <h1>Área de Trabalho</h1>
        <p>Entre com seu e-mail para criar seu desktop pessoal.</p>
        <form id="login-form">
          <label for="email">E-mail</label>
          <input id="email" type="email" placeholder="nome@empresa.com" required />
          <button class="btn-primary" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = document.getElementById('email');
    login(emailInput.value);
  });
}

function renderWorkspace() {
  const user = state.user;
  const workspace = state.workspace || { projects: [] };
  const project = workspace.projects[state.activeProjectIndex] || workspace.projects[0];

  app.innerHTML = `
    <div class="workspace-shell">
      <aside class="sidebar">
        <div class="desktop-name">${user.desktopName}</div>
        <div class="email-text">${user.email}</div>

        <ul class="project-list">
          ${(workspace.projects || []).map((p, index) => `
            <li class="project-item ${index === state.activeProjectIndex ? 'active' : ''}" data-index="${index}">
              ${p.name}
            </li>
          `).join('')}
        </ul>

        <div style="margin-top:20px;">
          <button class="btn-primary" id="create-project-btn">+ Novo Projeto</button>
        </div>

        <div style="margin-top:20px;">
          <button class="btn-secondary" id="logout-btn" style="width:100%;">Sair</button>
        </div>
      </aside>

      <main class="main-panel">
        <div class="topbar">
          <h2>${project ? project.name : 'Sem projeto'}</h2>
          <div class="view-switch">
            <button class="view-btn ${state.activeView === 'table' ? 'active' : ''}" data-view="table">Tabela</button>
            <button class="view-btn ${state.activeView === 'topics' ? 'active' : ''}" data-view="topics">Tópicos</button>
            <button class="view-btn ${state.activeView === 'planner' ? 'active' : ''}" data-view="planner">Planner</button>
            <button class="view-btn" id="share-btn">Compartilhar</button>
          </div>
        </div>

        <section class="sheet">
          ${renderProjectView(project)}
        </section>
      </main>
    </div>
  `;

  document.querySelectorAll('.project-item').forEach((item) => {
    item.addEventListener('click', () => {
      const index = Number(item.dataset.index);
      state.activeProjectIndex = index;
      saveState();
      renderWorkspace();
    });
  });

  document.getElementById('create-project-btn').addEventListener('click', () => {
    const name = prompt('Nome do projeto:');
    if (!name || !name.trim()) return;

    const newProject = createDefaultProject(name.trim());
    state.workspace.projects.push(newProject);
    state.activeProjectIndex = state.workspace.projects.length - 1;
    saveState();
    renderWorkspace();
  });

  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('share-btn').addEventListener('click', () => {
    const email = prompt('E-mail para compartilhar este desktop/projeto:');
    if (!email || !email.trim()) return;

    const project = state.workspace.projects[state.activeProjectIndex];
    if (!project.sharedWith.includes(email.trim())) {
      project.sharedWith.push(email.trim());
      saveState();
      renderWorkspace();
    }
  });

  document.querySelectorAll('.view-btn[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeView = btn.dataset.view;
      saveState();
      renderWorkspace();
    });
  });
}

function renderProjectView(project) {
  if (!project) {
    return '<div class="empty-state">Nenhum projeto selecionado.</div>';
  }

  if (state.activeView === 'table') {
    return `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Responsável</th>
            </tr>
          </thead>
          <tbody>
            ${(project.rows || []).map((row) => `
              <tr>
                <td>${row.item || ''}</td>
                <td>${row.description || ''}</td>
                <td>${row.status || ''}</td>
                <td>${row.responsible || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="margin-top:20px;">
        <button class="btn-primary" id="add-row-btn">+ Adicionar item</button>
      </div>
      <div class="share-box">
        <h3>Compartilhado com</h3>
        <div class="share-list">
          ${(project.sharedWith || []).length ? project.sharedWith.map((email) => `<span class="share-tag">${email}</span>`).join('') : '<span class="empty-state">Nenhum compartilhamento.</span>'}
        </div>
      </div>
    `;
  }

  if (state.activeView === 'topics') {
    return `
      <div class="topic-list">
        ${(project.topics || []).map((topic) => `
          <div class="topic-card">
            <h3>${topic.title}</h3>
            <p>${topic.description}</p>
          </div>
        `).join('') || '<div class="empty-state">Nenhum tópico cadastrado.</div>'}
      </div>
      <div style="margin-top:20px;">
        <button class="btn-primary" id="add-topic-btn">+ Adicionar tópico</button>
      </div>
    `;
  }

  return `
    <div class="planner-list">
      ${(project.planner || []).map((event) => `
        <div class="planner-card">
          <h3>${event.title}</h3>
          <p>${event.description}</p>
          <small>${event.date}</small>
        </div>
      `).join('') || '<div class="empty-state">Nenhum evento programado.</div>'}
    </div>
    <div style="margin-top:20px;">
      <button class="btn-primary" id="add-event-btn">+ Adicionar evento</button>
    </div>
  `;
}

function attachActionButtons() {
  const addRowBtn = document.getElementById('add-row-btn');
  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => {
      const project = state.workspace.projects[state.activeProjectIndex];
      const item = prompt('Nome do item:');
      if (!item || !item.trim()) return;
      const description = prompt('Descrição do item:') || '';
      const status = prompt('Status do item (Pendente / Em progresso / Concluído):') || 'Pendente';
      project.rows.push({
        item: item.trim(),
        description: description.trim(),
        status: status.trim(),
        responsible: state.user.email,
      });
      saveState();
      renderWorkspace();
    });
  }

  const addTopicBtn = document.getElementById('add-topic-btn');
  if (addTopicBtn) {
    addTopicBtn.addEventListener('click', () => {
      const project = state.workspace.projects[state.activeProjectIndex];
      const title = prompt('Título do tópico:');
      if (!title || !title.trim()) return;
      const description = prompt('Descrição do tópico:') || '';
      project.topics.push({ title: title.trim(), description: description.trim() });
      saveState();
      renderWorkspace();
    });
  }

  const addEventBtn = document.getElementById('add-event-btn');
  if (addEventBtn) {
    addEventBtn.addEventListener('click', () => {
      const project = state.workspace.projects[state.activeProjectIndex];
      const title = prompt('Título do evento:');
      if (!title || !title.trim()) return;
      const description = prompt('Descrição do evento:') || '';
      const date = prompt('Data do evento (AAAA-MM-DD):') || new Date().toISOString().slice(0, 10);
      project.planner.push({ title: title.trim(), description: description.trim(), date });
      saveState();
      renderWorkspace();
    });
  }
}

function bootstrap() {
  const saved = loadState();
  if (saved && saved.user) {
    state.user = saved.user;
    state.workspace = saved.workspace || { projects: [] };
    state.activeProjectIndex = Number(saved.activeProjectIndex || 0);
    state.activeView = saved.activeView || 'table';
    renderWorkspace();
    return;
  }

  renderLogin();
}

bootstrap();
