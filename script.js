/* ==========================================================================
   1. CONFIGURACIÓN Y ESTADO GLOBAL
   ========================================================================== */

let userGlobalPoints = 1250;

// DATOS DE LAS METAS (Persistencia del Saver Dashboard)
let goalsData = [
    { 
        id: 1, 
        title: "Saver Personal", 
        current: 60, 
        target: 120, 
        variant: 1, 
        type: 'personal', 
        members: [] 
    },
    { 
        id: 2, 
        title: "Team Saver", 
        current: 150, 
        target: 500, 
        variant: 2, 
        type: 'team', 
        members: [
            { name: 'Ana (Tú)', contribution: 60 },
            { name: 'Carlos', contribution: 50 },
            { name: 'María', contribution: 40 }
        ] 
    }
];

// Variable para saber qué meta se está editando en el modal
let activeGoalId = null;

/* ==========================================================================
   2. INICIALIZACIÓN DE LA APP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando App...');
    initApp();
});

function initApp() {
    // 1. Configurar Navegación
    setupNavigation();
    
    // 2. Cargar Datos Visuales
    updateUserPointsUI(); 
    loadAchievements();
    loadBenefits();
    loadFriends();
    loadChallenges('todos');
    
    // 3. Funcionalidades Principales
    setupProfileSave();
    
    // --- Dashboard de Metas ---
    setupSaverDashboard(); 
    
    // 4. Sistema de Avatares
    setupAvatarSystem();      
    
    // 5. Gamificación y Modales
    setupModals();
    setupChallengeFilters();
    setupChestTimer();
    updateChestProgress();
    setupRedemptionEvents();
    setupThemeToggle();
    
    // 6. Botón del cofre
    const openChestBtn = document.getElementById('openChestBtn');
    if (openChestBtn) openChestBtn.addEventListener('click', openChest);
    
    console.log('✅ Aplicación inicializada');
}

/* ==========================================================================
   3. SISTEMA DE PUNTOS Y REDENCIÓN (CUPONES)
   ========================================================================== */

function updateUserPointsUI() {
    const formatted = userGlobalPoints.toLocaleString();

    const header = document.getElementById('headerPoints');
    if(header) header.textContent = `${formatted} puntos`;

    const sidebar = document.getElementById('sidebarPoints');
    if(sidebar) sidebar.textContent = formatted;

    const mobile = document.getElementById('mobilePoints');
    if(mobile) mobile.textContent = formatted;

    const main = document.getElementById('mainPoints');
    if(main) main.textContent = formatted;

    loadBenefits();
}

function generateCouponCode(prefix = 'DINERS') {
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timestamp = new Date().getSeconds();
    return `${prefix}-${randomString}-${timestamp}`;
}

function processRedemption(benefitId) {
    const benefit = benefitsData.find(b => b.id === benefitId);
    if (!benefit) return;

    if (userGlobalPoints >= benefit.puntos) {
        userGlobalPoints -= benefit.puntos;
        updateUserPointsUI();

        const modal = document.getElementById('redemptionModal');
        const itemName = document.getElementById('redeemedItemName');
        const codeDisplay = document.getElementById('couponCode');
        const newBalance = document.getElementById('modalNewBalance');

        if (modal && itemName && codeDisplay) {
            itemName.textContent = benefit.titulo;
            codeDisplay.textContent = generateCouponCode();
            if(newBalance) newBalance.textContent = `${userGlobalPoints.toLocaleString()} pts`;
            
            const detailModal = document.getElementById('benefitModal');
            if(detailModal) detailModal.style.display = 'none';
            
            modal.style.display = 'block';
        }
    } else {
        showNotification('Saldo insuficiente', 'error');
    }
}

function setupRedemptionEvents() {
    const copyBtn = document.getElementById('copyCouponBtn');
    const modal = document.getElementById('redemptionModal');
    const closers = document.querySelectorAll('#finishRedemptionBtn, #closeRedemptionModal');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('couponCode').textContent;
            navigator.clipboard.writeText(code).then(() => {
                showNotification('¡Código copiado!');
                const original = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
            });
        });
    }

    closers.forEach(btn => {
        if(btn) btn.addEventListener('click', () => modal.style.display = 'none');
    });
}

/* ==========================================================================
   4. SISTEMA DE AVATAR
   ========================================================================== */

function setupAvatarSystem() {
    const changeBtn = document.getElementById('changeAvatarBtn');
    const modal = document.getElementById('avatarModal');
    const confirmBtn = document.getElementById('confirmAvatarSelect');
    const grid = document.getElementById('avatarGrid');
    
    if (grid) {
        grid.innerHTML = '';
        for (let i = 1; i <= 6; i++) {
            const option = document.createElement('div');
            option.className = 'avatar-option-modal';
            const src = `assets/avatar-0${i}.png`;
            option.setAttribute('data-avatar', src);
            
            const img = document.createElement('img');
            img.src = src;
            img.onerror = function() { this.src = `https://ui-avatars.com/api/?name=Av+${i}&background=random&color=fff`; };
            
            option.appendChild(img);
            option.addEventListener('click', function() {
                document.querySelectorAll('.avatar-option-modal').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
            });
            grid.appendChild(option);
        }
    }
    
    if (changeBtn && modal) changeBtn.addEventListener('click', () => modal.style.display = 'block');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const selected = document.querySelector('.avatar-option-modal.selected');
            if (selected) {
                updateProfileAvatar(selected.getAttribute('data-avatar'));
                showNotification('Avatar actualizado');
                if(modal) modal.style.display = 'none';
            } else {
                showNotification('Selecciona una imagen', 'error');
            }
        });
    }
    
    const saved = localStorage.getItem('selectedAvatar') || 'assets/avatar-01.png';
    updateProfileAvatar(saved);
    
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        updateProfileName(savedName);
        const userNameInput = document.getElementById('userNameInput');
        if (userNameInput) userNameInput.value = savedName;
    }
}

function updateProfileAvatar(src) {
    const targets = ['sidebarAvatarImg', 'mobileProfileAvatar', 'currentAvatarImg'];
    targets.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.src = src;
            el.onerror = function() { this.src = 'https://ui-avatars.com/api/?name=User&background=4e54c8&color=fff'; };
        }
    });
    localStorage.setItem('selectedAvatar', src);
}

/* ==========================================================================
   5. SAVER DASHBOARD (GRID + SUPER MODAL)
   ========================================================================== */

function setupSaverDashboard() {
    renderGoalsGrid();
    setupUniversalModalLogic();
    setupCreateGoalLogic();
}

// A. Renderizar Grid
function renderGoalsGrid() {
    const container = document.getElementById('goalsContainer');
    if (!container) return;
    
    container.innerHTML = ''; 

    goalsData.forEach(goal => {
        const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
        
        const card = document.createElement('div');
        card.className = `goal-summary-card variant-${goal.variant}`;
        card.innerHTML = `
            <div class="goal-header">
                <div class="goal-icon"><i class="fas fa-piggy-bank"></i></div>
                <div class="goal-title">${goal.title}</div>
            </div>
            <div class="goal-progress-text">
                <span>$${goal.current}</span>
                <span>${percent}% de $${goal.target}</span>
            </div>
            <div class="goal-bar-track">
                <div class="goal-bar-fill" style="width: ${percent}%"></div>
            </div>
        `;
        
        card.addEventListener('click', () => openRoadmapModal(goal.id));
        container.appendChild(card);
    });

    const addCard = document.createElement('div');
    addCard.className = 'goal-summary-card add-goal-card';
    addCard.innerHTML = `
        <div class="add-icon"><i class="fas fa-plus-circle"></i></div>
        <span>Crear Nueva Meta</span>
    `;
    addCard.addEventListener('click', () => {
        document.getElementById('createGoalModal').style.display = 'block';
    });
    container.appendChild(addCard);
}

// B. Abrir Modal Universal
function openRoadmapModal(id) {
    const goal = goalsData.find(g => g.id === id);
    if (!goal) return;

    activeGoalId = id;

    // Textos Iniciales
    document.getElementById('modalGoalTitle').textContent = goal.title;
    document.getElementById('modalGoalTarget').textContent = goal.target;
    document.getElementById('modalGoalCurrent').textContent = goal.current;
    document.getElementById('modalEditTargetInput').value = goal.target;
    
    // Lógica TEAM (Mostrar/Ocultar sección)
    const teamSection = document.getElementById('modalTeamSection');
    const typeBadge = document.getElementById('modalGoalTypeBadge');
    const membersList = document.getElementById('modalMembersList');

    if (goal.type === 'team') {
        if(teamSection) teamSection.style.display = 'block';
        if(typeBadge) typeBadge.style.display = 'inline-block';
        
        if(membersList) {
            membersList.innerHTML = '';
            if(goal.members) {
                goal.members.forEach(m => {
                    const div = document.createElement('div');
                    div.className = 'member-item'; 
                    div.innerHTML = `
                        <div class="member-avatar"><i class="fas fa-user"></i></div>
                        <span class="member-name">${m.name}</span>
                        <span class="member-contribution">$${m.contribution}</span>
                    `;
                    membersList.appendChild(div);
                });
            }
        }
    } else {
        if(teamSection) teamSection.style.display = 'none';
        if(typeBadge) typeBadge.style.display = 'none';
    }

    drawRoadmapInModal(goal);
    document.getElementById('universalRoadmapModal').style.display = 'block';
}

// C. Dibujar SVG
function drawRoadmapInModal(goal) {
    const variants = {
        1: { color: '#f59e0b', bg: '#fde68a', d: `M40 360 C100 320, 160 340, 200 360 C240 380, 280 350, 300 320 C320 280, 280 250, 240 220 C200 190, 150 170, 100 130 C70 110, 80 70, 120 60` },
        2: { color: '#22c55e', bg: '#bbf7d0', d: `M30 360 C90 340, 150 380, 210 360 C260 340, 300 300, 280 260 C250 200, 180 210, 130 180 C80 150, 100 110, 160 90 C220 70, 260 80, 310 60` },
        3: { color: '#7c3aed', bg: '#ddd6fe', d: `M40 360 C80 320, 120 340, 150 300 C180 260, 210 300, 240 260 C270 220, 230 200, 200 170 C170 140, 140 170, 110 140 C80 110, 70 90, 110 60 C150 30, 200 50, 260 40` }
    };

    const v = variants[goal.variant];
    const bgPath = document.getElementById('modalBgPath');
    const progPath = document.getElementById('modalProgPath');
    
    if(!bgPath || !progPath) return;

    bgPath.setAttribute('d', v.d);
    progPath.setAttribute('d', v.d);
    bgPath.setAttribute('stroke', v.bg);
    progPath.setAttribute('stroke', v.color);
    progPath.style.strokeLinecap = 'round';

    const totalLen = bgPath.getTotalLength();
    const pct = Math.min(goal.current / goal.target, 1);
    const progressLen = (pct * 0.98) * totalLen;

    progPath.style.strokeDasharray = `${totalLen} ${totalLen}`;
    progPath.style.strokeDashoffset = `${totalLen - progressLen}`;

    // Bandera (Corregida)
    const endPt = bgPath.getPointAtLength(totalLen);
    const pole = document.getElementById('modalPole');
    const flag = document.getElementById('modalFlagPoly');
    
    if(pole && flag) {
        const poleX = endPt.x + 6;
        const poleY = endPt.y - 32;
        
        pole.setAttribute('x', poleX); 
        pole.setAttribute('y', poleY);
        
        const px = poleX + 3; 
        const py = poleY; 
        
        flag.setAttribute('points', `${px},${py} ${px+20},${py+8} ${px},${py+16}`);
        flag.setAttribute('fill', v.color);
    }

    // Checkpoints
    const group = document.getElementById('modalCheckpointsGroup');
    if(group) {
        group.innerHTML = '';
        [0.25, 0.5, 0.75, 1].forEach(f => {
            const pt = bgPath.getPointAtLength(f * totalLen);
            const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
            c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
            c.setAttribute('r', '9');
            if (pct >= f - 0.01) {
                c.setAttribute('fill', v.color);
                c.setAttribute('stroke', 'white');
            } else {
                c.setAttribute('fill', 'white');
                c.setAttribute('stroke', v.color);
            }
            c.setAttribute('stroke-width', '2');
            group.appendChild(c);
        });
    }
}

// D. Lógica DENTRO del Modal (CORREGIDA PARA ACTUALIZAR UI)
function setupUniversalModalLogic() {
    // Cerrar modal
    document.getElementById('closeUniversalModal').addEventListener('click', () => {
        document.getElementById('universalRoadmapModal').style.display = 'none';
        renderGoalsGrid(); // Importante: Refresca el grid al cerrar
    });

    // AGREGAR DINERO (CORREGIDO)
    document.getElementById('modalAddDepositBtn').addEventListener('click', () => {
        const input = document.getElementById('modalDepositInput');
        const amount = parseInt(input.value) || 0;
        
        if (amount > 0 && activeGoalId) {
            const goal = goalsData.find(g => g.id === activeGoalId);
            goal.current += amount;
            input.value = '';
            
            // 1. Actualizar texto dentro del modal
            document.getElementById('modalGoalCurrent').textContent = goal.current;
            
            // 2. Redibujar el SVG del modal
            drawRoadmapInModal(goal);
            
            // 3. Actualizar las tarjetas de fondo inmediatamente
            renderGoalsGrid();
            
            showNotification(`¡Agregados $${amount}!`);
        }
    });

    // GUARDAR CONFIGURACIÓN (CORREGIDO)
    document.getElementById('modalSaveChangesBtn').addEventListener('click', () => {
        const newTarget = parseInt(document.getElementById('modalEditTargetInput').value) || 0;
        const goal = goalsData.find(g => g.id === activeGoalId);
        
        if (newTarget > 0) {
            goal.target = newTarget;
            
            // 1. Actualizar texto modal
            document.getElementById('modalGoalTarget').textContent = goal.target;
            
            // 2. Redibujar SVG
            drawRoadmapInModal(goal);
            
            // 3. Actualizar tarjetas de fondo
            renderGoalsGrid();
            
            showNotification('Configuración guardada');
        }
    });

    // Eliminar meta
    document.getElementById('modalDeleteGoalBtn').addEventListener('click', () => {
        if(confirm('¿Estás seguro de eliminar esta meta?')) {
            goalsData = goalsData.filter(g => g.id !== activeGoalId);
            document.getElementById('universalRoadmapModal').style.display = 'none';
            renderGoalsGrid();
            showNotification('Meta eliminada');
        }
    });
}

window.changeModalVariant = function(v) {
    const goal = goalsData.find(g => g.id === activeGoalId);
    if (goal) {
        goal.variant = v;
        drawRoadmapInModal(goal);
        renderGoalsGrid(); // Actualizar color en el grid también
    }
};

// E. Crear Nueva Meta
function setupCreateGoalLogic() {
    const modal = document.getElementById('createGoalModal');
    const close = document.getElementById('closeCreateGoalModal');
    const confirm = document.getElementById('confirmCreateGoal');

    if(close) close.addEventListener('click', () => modal.style.display = 'none');

    if(confirm) {
        confirm.addEventListener('click', () => {
            const name = document.getElementById('newGoalName').value;
            const target = parseInt(document.getElementById('newGoalTarget').value);
            const variant = parseInt(document.getElementById('newGoalVariant').value);
            const isTeam = document.getElementById('newGoalIsTeam') ? document.getElementById('newGoalIsTeam').checked : false;

            if (name && target > 0) {
                const newGoal = {
                    id: Date.now(),
                    title: name,
                    current: 0,
                    target: target,
                    variant: variant,
                    type: isTeam ? 'team' : 'personal',
                    members: isTeam ? [{name: 'Ana (Tú)', contribution: 0}] : []
                };
                
                goalsData.push(newGoal);
                renderGoalsGrid();
                
                document.getElementById('newGoalName').value = '';
                document.getElementById('newGoalTarget').value = '';
                if(document.getElementById('newGoalIsTeam')) document.getElementById('newGoalIsTeam').checked = false;
                
                modal.style.display = 'none';
                showNotification(isTeam ? '¡Meta grupal creada!' : '¡Meta personal creada!');
            } else {
                showNotification('Completa los datos', 'error');
            }
        });
    }
}

/* ==========================================================================
   6. GESTIÓN DE MODALES
   ========================================================================== */

function setupModals() {
    const triggerMap = [
        { trigger: 'socialToggle', modal: 'friendsModal', action: loadFriends },
        { trigger: 'profileFriendsCard', modal: 'friendsModal', action: loadFriends },
        { trigger: 'openAddFriendFromList', modal: 'addFriendModal' }
    ];

    triggerMap.forEach(tm => {
        const btn = document.getElementById(tm.trigger);
        const modal = document.getElementById(tm.modal);
        if (btn && modal) {
            btn.addEventListener('click', () => {
                if(tm.trigger === 'openAddFriendFromList') {
                    document.getElementById('friendsModal').style.display = 'none';
                }
                modal.style.display = 'block';
                if(tm.action) tm.action();
            });
        }
    });

    const closeMap = ['closeFriendsModal', 'closeAddFriendModal', 'closeAchievementModal', 'closeBenefitModal', 'closeAvatarModal', 'closeRedemptionModal'];

    closeMap.forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if(modal) modal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    });
    
    const confirmAddFriend = document.getElementById('confirmAddFriend');
    if (confirmAddFriend) {
        confirmAddFriend.addEventListener('click', () => {
            const name = document.getElementById('friendNameInput').value;
            if (name) {
                friendsData.push({ id: Date.now(), nombre: name, meta: 500, progreso: 0 });
                loadFriends();
                document.getElementById('addFriendModal').style.display = 'none';
                showNotification(`Amigo ${name} agregado`);
            }
        });
    }
}

/* ==========================================================================
   7. CARGA DE CONTENIDOS
   ========================================================================== */

function loadAchievements() {
    const grid = document.getElementById('achievementsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    achievementsData.forEach(a => {
        const current = a.progreso_actual !== undefined ? a.progreso_actual : Math.floor(Math.random() * 10);
        const total = a.progreso_total !== undefined ? a.progreso_total : 10;
        let pct = Math.round((current/total)*100);
        if(a.estado === 'Desbloqueado') pct = 100;
        
        const div = document.createElement('div');
        div.className = 'achievement-card';
        div.innerHTML = `
            <div class="achievement-icon"><i class="${a.icono}"></i></div>
            <h3 class="achievement-title">${a.titulo}</h3>
            <p class="achievement-description">${a.descripcion}</p>
            <div class="achievement-progress-wrapper">
                <div class="achievement-track">
                    <div class="achievement-fill ${pct===100?'completed':''}" style="width: ${pct}%"></div>
                </div>
                <div class="achievement-meta">
                    <span>${pct === 100 ? '¡Completado!' : pct + '%'}</span>
                    <span>${current}/${total}</span>
                </div>
            </div>
            <span class="achievement-badge ${a.estado.toLowerCase().replace(' ', '-')}">${a.estado}</span>
        `;
        div.addEventListener('click', () => showAchievementModal(a.id));
        grid.appendChild(div);
    });
}

function loadBenefits() {
    const grid = document.getElementById('rewardsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    benefitsData.forEach(b => {
        const canAfford = userGlobalPoints >= b.puntos;
        const div = document.createElement('div');
        div.className = 'reward-card';
        div.innerHTML = `
            <div class="reward-image"><i class="${b.icono}"></i></div>
            <div class="reward-content">
                <h3 class="reward-title">${b.titulo}</h3>
                <p class="reward-description">${b.descripcion}</p>
                <div class="reward-footer">
                    <span class="reward-cost">${b.puntos} pts</span>
                    <button class="redeem-btn action-redeem" ${!canAfford ? 'disabled style="background:var(--gray)"' : ''}>Canjear</button>
                </div>
            </div>`;
        div.addEventListener('click', (e) => { if(!e.target.classList.contains('redeem-btn')) showBenefitModal(b.id); });
        const btn = div.querySelector('.action-redeem');
        if(btn && canAfford) btn.addEventListener('click', (e) => { e.stopPropagation(); processRedemption(b.id); });
        grid.appendChild(div);
    });
}

function loadFriends() {
    const list = document.getElementById('friendsList');
    if (!list) return;
    list.innerHTML = '';
    friendsData.forEach(f => {
        const pct = Math.min(Math.round((f.progreso/f.meta)*100), 100);
        const div = document.createElement('div');
        div.className = 'friend-item';
        div.innerHTML = `
            <div class="friend-avatar"><i class="fas fa-user"></i></div>
            <div class="friend-info"><span class="friend-name">${f.nombre}</span><span class="friend-percentage">${pct}%</span></div>
            <div class="friend-progress-bar"><div class="friend-progress-fill" style="width:${pct}%"></div></div>`;
        list.appendChild(div);
    });
}

/* ==========================================================================
   8. MODALES DETALLE
   ========================================================================== */

function showAchievementModal(id) {
    const item = achievementsData.find(i => i.id === id);
    const body = document.getElementById('achievementModalBody');
    if (item && body) {
        body.innerHTML = `
            <div class="modal-achievement">
                <div class="modal-achievement-icon"><i class="${item.icono}"></i></div>
                <h3>${item.titulo}</h3>
                <p>${item.descripcion}</p>
                <p>Estado: <strong>${item.estado}</strong></p>
            </div>`;
        document.getElementById('achievementModal').style.display = 'block';
    }
}

function showBenefitModal(id) {
    const item = benefitsData.find(i => i.id === id);
    const body = document.getElementById('benefitModalBody');
    if (item && body) {
        const canAfford = userGlobalPoints >= item.puntos;
        body.innerHTML = `
            <div class="modal-benefit">
                <div class="modal-benefit-icon"><i class="${item.icono}"></i></div>
                <h3>${item.titulo}</h3>
                <p>${item.descripcion}</p>
                <p>Costo: <strong>${item.puntos} pts</strong></p>
                <button class="redeem-btn modal-redeem-action" ${!canAfford ? 'disabled style="background:var(--gray)"' : ''}>
                    ${canAfford ? 'Confirmar Canje' : 'Insuficiente'}
                </button>
            </div>`;
        const btn = body.querySelector('.modal-redeem-action');
        if (btn && canAfford) btn.addEventListener('click', () => processRedemption(item.id));
        document.getElementById('benefitModal').style.display = 'block';
    }
}

function showChallengeModal(id) {
    const c = challengesData.find(c => c.id === id);
    const body = document.getElementById('achievementModalBody');
    if (!c || !body) return;
    body.innerHTML = `
        <div class="modal-challenge">
            <div class="modal-challenge-icon"><i class="${c.icono}"></i></div>
            <h3 class="modal-challenge-title">${c.titulo}</h3>
            <p>${c.descripcion}</p>
            ${c.estado === 'activo' ? `<button onclick="completeChallenge(${c.id})">Completar</button>` : ''}
            ${c.estado === 'disponible' ? `<button onclick="startChallenge(${c.id})">Comenzar</button>` : ''}
        </div>`;
    document.getElementById('achievementModal').style.display = 'block';
}

/* ==========================================================================
   9. RETOS Y COFRE
   ========================================================================== */

function loadChallenges(filter = 'todos') {
    const grid = document.getElementById('challengesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = challengesData.filter(c => {
        if (filter === 'todos') return true;
        const map = { 'diarios':'diario', 'semanales':'semanal', 'mensuales':'mensual' };
        return c.tipo === map[filter];
    });

    if(filtered.length === 0) {
        grid.innerHTML = '<div class="no-challenges"><i class="fas fa-inbox"></i><p>No hay retos</p></div>';
        return;
    }

    filtered.forEach(c => {
        const div = document.createElement('div');
        div.className = 'challenge-card';
        const pct = Math.round((c.progreso/c.total)*100);
        const isDone = c.estado === 'completado';
        
        div.innerHTML = `
            <span class="challenge-badge ${c.tipo}">${c.tipo}</span>
            <div class="challenge-icon-large"><i class="${c.icono}"></i></div>
            <div class="challenge-content">
                <h3>${c.titulo}</h3>
                <p>${c.descripcion}</p>
                <div class="challenge-progress"><div class="challenge-progress-fill" style="width:${pct}%"></div></div>
                <div class="challenge-actions">
                    ${isDone ? '<button disabled class="action-btn complete-btn">Completado</button>' : 
                      c.estado === 'activo' ? `<button class="action-btn complete-btn" onclick="completeChallenge(${c.id})">Completar</button>` :
                      `<button class="action-btn start-btn" onclick="startChallenge(${c.id})">Comenzar</button>`}
                </div>
            </div>`;
        div.addEventListener('click', (e) => { if(!e.target.classList.contains('action-btn')) showChallengeModal(c.id); });
        grid.appendChild(div);
    });
}

function startChallenge(id) {
    const c = challengesData.find(x => x.id === id);
    if(c) { 
        c.estado = 'activo'; 
        loadChallenges(); 
        showNotification('Reto iniciado'); 
        const modal = document.getElementById('achievementModal');
        if(modal) modal.style.display='none'; 
    }
}

function completeChallenge(id) {
    const c = challengesData.find(x => x.id === id);
    if(c && c.estado !== 'completado') { 
        c.estado = 'completado'; 
        c.progreso = c.total; 
        userGlobalPoints += c.puntos;
        updateUserPointsUI();
        updateChestProgress(); 
        loadChallenges(); 
        showNotification(`¡Felicidades! Has ganado +${c.puntos} pts`);
        const modal = document.getElementById('achievementModal');
        if(modal) modal.style.display='none';
    }
}

function setupChallengeFilters() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(b => b.addEventListener('click', function() {
        btns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        loadChallenges(this.getAttribute('data-filter'));
    }));
}

function updateChestProgress() {
    const done = challengesData.filter(c => c.estado === 'completado').length;
    const bar = document.getElementById('chestProgress');
    const txt = document.querySelector('.chest-progress span');
    const btn = document.getElementById('openChestBtn');
    const icon = document.getElementById('chestIcon');
    
    if (bar) bar.style.width = `${Math.min((done/3)*100, 100)}%`;
    if (txt) txt.textContent = `${done}/3 completados`;
    
    if (done >= 3 && btn) {
        btn.disabled = false;
        if(icon) { icon.classList.remove('locked'); icon.innerHTML = '<i class="fas fa-lock-open"></i>'; }
    }
}

function openChest() {
    const reward = 150;
    const icon = document.getElementById('chestIcon');
    const btn = document.getElementById('openChestBtn');
    if(icon) {
        icon.innerHTML = '<i class="fas fa-gem"></i>';
        icon.style.background = 'linear-gradient(to right, #FFD700, #FFA500)';
    }
    userGlobalPoints += reward;
    updateUserPointsUI();
    if(btn) btn.disabled = true;
    showNotification(`¡Ganaste ${reward} puntos!`);
}

function setupChestTimer() {
    const t = document.getElementById('chestTimer');
    if(t) t.textContent = '3d 12h restantes';
}

/* ==========================================================================
   10. UTILIDADES
   ========================================================================== */

function setupNavigation() {
    const items = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const title = document.getElementById('current-section');
    
    items.forEach(item => {
        item.addEventListener('click', () => {
            items.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            const target = item.getAttribute('data-target');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            if(title) title.textContent = target.charAt(0).toUpperCase() + target.slice(1);
        });
    });
}

function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
        toggle.addEventListener('change', function() {
            const theme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        });
    }
}

function setupProfileSave() {
    const btn = document.getElementById('saveProfileBtn');
    const input = document.getElementById('userNameInput');
    if (btn && input) {
        btn.addEventListener('click', () => {
            const name = input.value;
            updateProfileName(name);
            showNotification('Perfil guardado');
        });
    }
}

function updateProfileName(name) {
    const sidebar = document.getElementById('user-name');
    const mobile = document.getElementById('mobileProfileName');
    if(sidebar) sidebar.textContent = name;
    if(mobile) mobile.textContent = name;
    localStorage.setItem('userName', name);
}

function showNotification(msg, type = 'success') {
    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.textContent = msg;
    div.style.cssText = `position:fixed; top:20px; right:20px; background:${type==='success'?'var(--success)':'var(--accent)'}; color:white; padding:12px 20px; border-radius:8px; z-index:2000; animation:slideInRight 0.3s ease; box-shadow:0 4px 6px rgba(0,0,0,0.1);`;
    document.body.appendChild(div);
    setTimeout(() => {
        div.style.opacity = '0';
        setTimeout(() => div.remove(), 300);
    }, 3000);
}

// Exponer funciones globales
window.completeChallenge = completeChallenge;
window.startChallenge = startChallenge;
window.openChest = openChest;
window.showAchievementModal = showAchievementModal;
window.showBenefitModal = showBenefitModal;