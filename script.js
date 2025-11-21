/* ==========================================================================
   1. CONFIGURACIÓN Y ESTADO GLOBAL
   ========================================================================== */

// Puntos globales del usuario (Saldo actual)
let userGlobalPoints = 1250;

// Configuración inicial del "Team Saver"
const teamData = {
    name: "Dream Team",
    goal: 500,
    deposit: 150,
    variant: 2, // 1: Otoño, 2: Verde, 3: Nocturno
    members: [
        { name: "Ana (Tú)", contribution: 60, isCurrentUser: true },
        { name: "Carlos", contribution: 50, isCurrentUser: false },
        { name: "María", contribution: 40, isCurrentUser: false }
    ],
    inviteLink: "https://diners.com/team/invite/dream123"
};

/* ==========================================================================
   2. INICIALIZACIÓN DE LA APP (Entry Point)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Iniciando App...');
    initApp();
});

function initApp() {
    // 1. Configurar Navegación (Tabs)
    setupNavigation();
    
    // 2. Cargar Datos Visuales
    updateUserPointsUI(); 
    loadAchievements();
    loadBenefits();
    loadFriends();
    loadChallenges('todos');
    
    // 3. Funcionalidades Principales
    setupProfileSave();       // Guardar nombre/email
    setupDualRoadmaps();      // Mapas SVG (Personal y Team)
    
    // 4. Sistema de Avatares (Modal y lógica)
    setupAvatarSystem();      
    
    // 5. Gamificación y Recompensas
    setupModals();            // Configuración global de modales
    setupChallengeFilters();  // Filtros de retos (diario/semanal)
    setupChestTimer();        // Temporizador del cofre
    updateChestProgress();    // Barra de progreso del cofre
    setupRedemptionEvents();  // Eventos de cupones
    setupThemeToggle();       // Modo oscuro/claro
    
    // 6. Evento botón cofre
    const openChestBtn = document.getElementById('openChestBtn');
    if (openChestBtn) openChestBtn.addEventListener('click', openChest);
    
    console.log('✅ Aplicación inicializada');
}

/* ==========================================================================
   3. SISTEMA DE PUNTOS Y REDENCIÓN (CUPONES)
   ========================================================================== */

// Actualiza todos los contadores de puntos en la pantalla
function updateUserPointsUI() {
    const pointsDisplays = document.querySelectorAll('.points-display span, .stat-value, .mobile-stat-value');
    
    pointsDisplays.forEach(display => {
        // Detectar si el elemento es un contador de puntos
        if(display.textContent.includes('1,250') || display.textContent.includes(userGlobalPoints.toLocaleString())) {
            if (!display.closest('.roadmap-meta')) { 
                display.textContent = `${userGlobalPoints.toLocaleString()} puntos`;
            }
        }
        // Caso específico para perfil móvil
        if (display.classList.contains('mobile-stat-value') && display.nextElementSibling && display.nextElementSibling.textContent === 'Puntos') {
             display.textContent = userGlobalPoints.toLocaleString();
        }
    });

    // Actualizar beneficios (deshabilitar botones si no alcanza el saldo)
    loadBenefits();
}

// Genera un código de cupón aleatorio
function generateCouponCode(prefix = 'DINERS') {
    const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timestamp = new Date().getSeconds();
    return `${prefix}-${randomString}-${timestamp}`;
}

// Procesa el canje de un beneficio
function processRedemption(benefitId) {
    const benefit = benefitsData.find(b => b.id === benefitId);
    if (!benefit) return;

    if (userGlobalPoints >= benefit.puntos) {
        // A. Restar puntos
        userGlobalPoints -= benefit.puntos;
        updateUserPointsUI();

        // B. Preparar datos del modal
        const modal = document.getElementById('redemptionModal');
        const itemName = document.getElementById('redeemedItemName');
        const codeDisplay = document.getElementById('couponCode');
        const newBalance = document.getElementById('modalNewBalance');

        if (modal && itemName && codeDisplay) {
            itemName.textContent = benefit.titulo;
            codeDisplay.textContent = generateCouponCode();
            if(newBalance) newBalance.textContent = `${userGlobalPoints.toLocaleString()} pts`;
            
            // Cerrar modal de detalle y abrir el de éxito
            const detailModal = document.getElementById('benefitModal');
            if(detailModal) detailModal.style.display = 'none';
            
            modal.style.display = 'block';
        }
    } else {
        showNotification('Saldo insuficiente', 'error');
    }
}

// Configura botones de copiar y cerrar en el modal de canje
function setupRedemptionEvents() {
    const copyBtn = document.getElementById('copyCouponBtn');
    const modal = document.getElementById('redemptionModal');
    const closers = document.querySelectorAll('#finishRedemptionBtn, #closeRedemptionModal');

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const code = document.getElementById('couponCode').textContent;
            navigator.clipboard.writeText(code).then(() => {
                showNotification('¡Código copiado!');
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i>', 2000);
            });
        });
    }

    closers.forEach(btn => {
        if(btn) btn.addEventListener('click', () => modal.style.display = 'none');
    });
}

/* ==========================================================================
   4. SISTEMA DE AVATAR (SELECCIÓN Y ACTUALIZACIÓN)
   ========================================================================== */

function setupAvatarSystem() {
    const changeBtn = document.getElementById('changeAvatarBtn');
    const modal = document.getElementById('avatarModal');
    const confirmBtn = document.getElementById('confirmAvatarSelect');
    const grid = document.getElementById('avatarGrid');
    
    // A. Generar Grid de Avatares Dinámicamente
    if (grid) {
        grid.innerHTML = '';
        // Generamos 6 opciones
        for (let i = 1; i <= 6; i++) {
            const option = document.createElement('div');
            option.className = 'avatar-option-modal';
            const src = `assets/avatar-0${i}.png`;
            option.setAttribute('data-avatar', src);
            
            const img = document.createElement('img');
            img.src = src;
            // Si falla la imagen local, usa un generador online
            img.onerror = function() { this.src = `https://ui-avatars.com/api/?name=Av+${i}&background=random&color=fff`; };
            
            option.appendChild(img);
            
            // Selección visual
            option.addEventListener('click', function() {
                document.querySelectorAll('.avatar-option-modal').forEach(o => o.classList.remove('selected'));
                this.classList.add('selected');
            });
            grid.appendChild(option);
        }
    }
    
    // B. Eventos del Modal
    if (changeBtn && modal) changeBtn.addEventListener('click', () => modal.style.display = 'block');
    
    // C. Confirmar Cambio
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
    
    // D. Cargar Avatar Guardado
    const saved = localStorage.getItem('selectedAvatar') || 'assets/avatar-01.png';
    updateProfileAvatar(saved);
}

// Actualiza la imagen en Sidebar, Perfil Móvil y Configuración
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
   5. ROADMAPS (PERSONAL Y TEAM) - LÓGICA SVG
   ========================================================================== */

function setupDualRoadmaps() {
    setupRoadmap('personal', { goal: 120, deposit: 60, variant: 1 });
    setupRoadmap('team', { goal: teamData.goal, deposit: teamData.deposit, variant: teamData.variant });
    loadTeamInfo();
    setupTeamEvents();
}

function setupRoadmap(type, initialData) {
    // Variantes de diseño de curva (SVG Paths)
    const variants = {
        1: { color: '#f59e0b', bg: '#fde68a', d: `M40 360 C100 320, 160 340, 200 360 C240 380, 280 350, 300 320 C320 280, 280 250, 240 220 C200 190, 150 170, 100 130 C70 110, 80 70, 120 60` },
        2: { color: '#22c55e', bg: '#bbf7d0', d: `M30 360 C90 340, 150 380, 210 360 C260 340, 300 300, 280 260 C250 200, 180 210, 130 180 C80 150, 100 110, 160 90 C220 70, 260 80, 310 60` },
        3: { color: '#7c3aed', bg: '#ddd6fe', d: `M40 360 C80 320, 120 340, 150 300 C180 260, 210 300, 240 260 C270 220, 230 200, 200 170 C170 140, 140 170, 110 140 C80 110, 70 90, 110 60 C150 30, 200 50, 260 40` }
    };

    // Variables locales del roadmap
    let currentVariant = initialData.variant;
    let currentGoal = initialData.goal;
    let currentDeposit = initialData.deposit;
    let totalLen = 0;
    let lastActiveIndex = -1;

    // Elementos DOM
    const svg = document.getElementById(`${type}RoadmapSvg`);
    const bgPath = document.getElementById(`${type}BgPath`);
    const progPath = document.getElementById(`${type}ProgPath`);
    const checkpointsGroup = document.getElementById(`${type}CheckpointsGroup`);
    const flagGroup = document.getElementById(`${type}FlagGroup`);
    const roadmapCard = document.querySelector(`.${type}-roadmap`);

    if (!svg || !bgPath || !progPath) return;

    // A. Dibujar la curva según variante
    function drawVariant(variantId) {
        currentVariant = variantId;
        const v = variants[variantId];
        
        // Configurar paths SVG
        bgPath.setAttribute('d', v.d);
        progPath.setAttribute('d', v.d);
        bgPath.setAttribute('stroke', v.bg);
        progPath.setAttribute('stroke', v.color);
        progPath.style.strokeLinecap = 'round';
        
        // Calcular longitud para animación
        totalLen = bgPath.getTotalLength();
        progPath.style.strokeDasharray = `${totalLen} ${totalLen}`;
        progPath.style.strokeDashoffset = `${totalLen}`; // Empieza vacío
        
        // Posicionar bandera final
        const endPt = bgPath.getPointAtLength(totalLen);
        positionFlag(endPt.x, endPt.y);
        
        // Generar puntos intermedios (checkpoints)
        generateCheckpoints();
        updateRoadmapStyle(variantId);
        updateProgressVisual();
    }

    // B. Posicionar bandera (Flag)
    function positionFlag(x, y) {
        if (!flagGroup) return;
        // Crear elementos SVG si no existen
        if (!document.getElementById(`${type}Pole`)) {
            const pole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            pole.id = `${type}Pole`; pole.setAttribute('width', '3'); pole.setAttribute('height', '30');
            flagGroup.appendChild(pole);
            
            const flag = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            flag.id = `${type}FlagPoly`; flagGroup.appendChild(flag);
        }
        
        const pole = document.getElementById(`${type}Pole`);
        const flag = document.getElementById(`${type}FlagPoly`);
        
        const poleX = x - 6, poleY = y - 32;
        pole.setAttribute('x', poleX); pole.setAttribute('y', poleY);
        pole.setAttribute('class', 'flagPole');
        
        const px = poleX + 6, py = poleY + 4;
        flag.setAttribute('points', `${px},${py} ${px+20},${py+6} ${px},${py+12}`);
        flag.setAttribute('fill', variants[currentVariant].color);
    }

    // C. Generar Checkpoints
    function generateCheckpoints() {
        checkpointsGroup.innerHTML = '';
        [0.25, 0.5, 0.75, 1].forEach((f, idx) => {
            const pt = bgPath.getPointAtLength(f * totalLen);
            const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
            c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
            c.setAttribute('r', '9'); c.setAttribute('class','cp');
            c.setAttribute('stroke', variants[currentVariant].color);
            c.setAttribute('fill', '#ffffff');
            checkpointsGroup.appendChild(c);
        });
    }

    // D. Actualizar progreso visual (animación de línea)
    function updateProgressVisual() {
        const goal = Math.max(1, currentGoal);
        const deposit = Math.max(0, currentDeposit);
        let pct = Math.min(deposit / goal, 1);
        
        // Llenar la línea
        const progressLen = (pct * 0.98) * totalLen;
        progPath.style.strokeDashoffset = `${totalLen - progressLen}`;
        
        // Actualizar textos
        const goalLbl = document.getElementById(`${type}GoalLabel`);
        const depLbl = document.getElementById(`${type}DepositLabel`);
        if (goalLbl) goalLbl.textContent = goal;
        if (depLbl) depLbl.textContent = deposit;

        // Iluminar checkpoints alcanzados
        const circles = Array.from(checkpointsGroup.querySelectorAll('circle.cp'));
        circles.forEach((c, i) => {
            const f = (i+1) / circles.length;
            if (pct >= f - 0.001) {
                c.classList.add('active');
                c.setAttribute('fill', variants[currentVariant].color);
            } else {
                c.classList.remove('active');
                c.setAttribute('fill', '#ffffff');
            }
        });
        
        if (type === 'team') updateTeamProgress();
    }
    
    // E. Actualizar estilos CSS del contenedor
    function updateRoadmapStyle(variantId) {
        if (roadmapCard) roadmapCard.className = `${type}-roadmap variant-${variantId}`;
    }

    // F. Event Listeners (Edición y Depósitos)
    const editModal = document.getElementById(`edit${type.charAt(0).toUpperCase() + type.slice(1)}RoadmapModal`);
    const editBtn = document.getElementById(`edit${type.charAt(0).toUpperCase() + type.slice(1)}RoadmapBtn`);
    const addDepBtn = document.getElementById(`add${type.charAt(0).toUpperCase() + type.slice(1)}DepositBtn`);
    const depInput = document.getElementById(`new${type.charAt(0).toUpperCase() + type.slice(1)}DepositInput`);
    const applyBtn = document.getElementById(`apply${type.charAt(0).toUpperCase() + type.slice(1)}EditBtn`);
    const goalInput = document.getElementById(`${type}GoalInput`);

    // Abrir modal de edición
    if (editBtn && editModal) {
        editBtn.addEventListener('click', () => {
            editModal.style.display = 'block';
            if(goalInput) goalInput.value = currentGoal;
        });
    }

    // Agregar dinero
    if (addDepBtn && depInput) {
        addDepBtn.addEventListener('click', () => {
            const val = parseInt(depInput.value) || 0;
            if (val > 0) {
                currentDeposit += val;
                if (type === 'team') updateUserContribution(val);
                updateProgressVisual();
                depInput.value = '';
                showNotification(`Agregado $${val} a ${type}`);
            }
        });
    }

    // Aplicar cambios de edición
    if (applyBtn && goalInput) {
        applyBtn.addEventListener('click', () => {
            const val = parseInt(goalInput.value);
            if (val > 0) {
                currentGoal = val;
                updateProgressVisual();
                if(editModal) editModal.style.display = 'none';
                showNotification('Meta actualizada');
            }
        });
    }

    // Selección de estilos en el modal
    const styleOpts = document.querySelectorAll(`#edit${type.charAt(0).toUpperCase() + type.slice(1)}RoadmapModal .style-option`);
    styleOpts.forEach(opt => {
        opt.addEventListener('click', function() {
            const v = parseInt(this.getAttribute('data-variant'));
            styleOpts.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            drawVariant(v);
        });
    });

    // Inicializar
    drawVariant(currentVariant);
}

/* ==========================================================================
   6. FUNCIONES AUXILIARES DEL TEAM SAVER
   ========================================================================== */

function loadTeamInfo() {
    const list = document.getElementById('teamMembersList');
    if (!list) return;
    list.innerHTML = '';
    teamData.members.forEach(m => {
        const div = document.createElement('div');
        div.className = 'member-item';
        div.innerHTML = `
            <div class="member-avatar"><i class="fas fa-user"></i></div>
            <span class="member-name">${m.name}</span>
            <span class="member-contribution">$${m.contribution}</span>
        `;
        list.appendChild(div);
    });
    updateTeamProgress();
}

function updateTeamProgress() {
    const total = teamData.members.reduce((sum, m) => sum + m.contribution, 0);
    const pct = Math.min(Math.round((total / teamData.goal) * 100), 100);
    
    const lblDeposit = document.getElementById('teamDepositLabel');
    const lblCount = document.getElementById('teamMembersCount');
    const lblPct = document.getElementById('teamProgressPercent');
    
    if (lblDeposit) lblDeposit.textContent = total;
    if (lblCount) lblCount.textContent = teamData.members.length;
    if (lblPct) lblPct.textContent = `${pct}%`;
}

function updateUserContribution(amount) {
    const me = teamData.members.find(m => m.isCurrentUser);
    if (me) { me.contribution += amount; loadTeamInfo(); }
}

function setupTeamEvents() {
    const copyBtn = document.getElementById('copyInviteLink');
    const linkInput = document.getElementById('teamInviteLink');
    if (copyBtn && linkInput) {
        copyBtn.addEventListener('click', () => {
            linkInput.select();
            document.execCommand('copy');
            showNotification('Enlace copiado');
        });
    }
}

/* ==========================================================================
   7. GESTIÓN GLOBAL DE MODALES
   ========================================================================== */

function setupModals() {
    // Configurar disparadores de apertura
    const triggerMap = [
        { trigger: 'socialToggle', modal: 'friendsModal', action: loadFriends },
        { trigger: 'profileFriendsCard', modal: 'friendsModal', action: loadFriends },
        { trigger: 'openAddFriendFromList', modal: 'addFriendModal' } // Cierra amigos, abre add
    ];

    triggerMap.forEach(tm => {
        const btn = document.getElementById(tm.trigger);
        const modal = document.getElementById(tm.modal);
        if (btn && modal) {
            btn.addEventListener('click', () => {
                // Si abrimos "Agregar Amigo", cerrar la lista primero
                if(tm.trigger === 'openAddFriendFromList') {
                    document.getElementById('friendsModal').style.display = 'none';
                }
                modal.style.display = 'block';
                if(tm.action) tm.action();
            });
        }
    });

    // Configurar botones de cierre (X)
    const closeMap = [
        'closeFriendsModal', 'closeAddFriendModal', 'closeAchievementModal', 
        'closeBenefitModal', 'closeEditPersonalRoadmapModal', 
        'closeEditTeamRoadmapModal', 'closeAvatarModal', 'closeRedemptionModal'
    ];

    closeMap.forEach(id => {
        const btn = document.getElementById(id);
        if(btn) btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if(modal) modal.style.display = 'none';
        });
    });

    // Cierre al hacer clic fuera del contenido (Overlay)
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.style.display = 'none';
    });
    
    // Lógica para agregar amigos
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
   8. CARGA DE CONTENIDOS (Cards, Listas)
   ========================================================================== */

function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    achievementsData.forEach(achievement => {
        // 1. Lógica para calcular progreso (Si no existen datos reales, simulamos para el prototipo)
        // En tu data.js idealmente deberías tener: progreso_actual y progreso_total
        const current = achievement.progreso_actual !== undefined ? achievement.progreso_actual : Math.floor(Math.random() * 10); 
        const total = achievement.progreso_total !== undefined ? achievement.progreso_total : 10;
        
        // Calcular porcentaje
        let percentage = Math.round((current / total) * 100);
        if (percentage > 100) percentage = 100;
        if (achievement.estado === 'Desbloqueado') percentage = 100;

        const isCompleted = percentage === 100;

        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        achievementCard.setAttribute('data-id', achievement.id);
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icono}"></i>
            </div>
            <h3 class="achievement-title">${achievement.titulo}</h3>
            <p class="achievement-description">${achievement.descripcion}</p>
            
            <div class="achievement-progress-wrapper">
                <div class="achievement-track">
                    <div class="achievement-fill ${isCompleted ? 'completed' : ''}" style="width: ${percentage}%"></div>
                </div>
                <div class="achievement-meta">
                    <span>${isCompleted ? '¡Completado!' : percentage + '%'}</span>
                    <span>${isCompleted ? total + '/' + total : current + '/' + total}</span>
                </div>
            </div>

            <span class="achievement-badge ${achievement.estado.toLowerCase().replace(' ', '-')}">${achievement.estado}</span>
        `;
        
        achievementCard.addEventListener('click', function() {
            showAchievementModal(achievement.id);
        });
        
        achievementsGrid.appendChild(achievementCard);
    });
    
    console.log('Logros cargados con barras de progreso:', achievementsData.length);
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
                <div class="reward-footer">
                    <span class="reward-cost">${b.puntos} pts</span>
                    <button class="redeem-btn action-redeem" ${!canAfford ? 'disabled style="background:var(--gray)"' : ''}>Canjear</button>
                </div>
            </div>`;
        
        // Click en tarjeta abre detalle
        div.addEventListener('click', (e) => { if(!e.target.classList.contains('redeem-btn')) showBenefitModal(b.id); });
        // Click en botón canjea directo
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
   9. MODALES DE DETALLE (Logros, Beneficios)
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
                <button class="redeem-btn modal-redeem-action" ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'Confirmar Canje' : 'Insuficiente'}
                </button>
            </div>`;
        
        const btn = body.querySelector('.modal-redeem-action');
        if (btn && canAfford) btn.addEventListener('click', () => processRedemption(item.id));
        document.getElementById('benefitModal').style.display = 'block';
    }
}

/* ==========================================================================
   10. RETOS Y COFRE (GAMIFICACIÓN)
   ========================================================================== */

function loadChallenges(filter = 'todos') {
    const grid = document.getElementById('challengesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    // Filtrado
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
        grid.appendChild(div);
    });
}

function startChallenge(id) {
    const c = challengesData.find(x => x.id === id);
    if(c) { c.estado = 'activo'; loadChallenges(); showNotification('Reto iniciado'); }
}

function completeChallenge(id) {
    const c = challengesData.find(x => x.id === id);
    if(c) { 
        c.estado = 'completado'; c.progreso = c.total; 
        updateChestProgress(); loadChallenges(); 
        showNotification(`¡Reto completado! +${c.puntos} pts`);
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
    if(t) t.textContent = '3d 12h restantes'; // Simplificado para demo
}

/* ==========================================================================
   11. UTILIDADES GENERALES
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
            document.getElementById('user-name').textContent = name;
            document.getElementById('mobileProfileName').textContent = name;
            localStorage.setItem('userName', name);
            showNotification('Perfil guardado');
        });
    }
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

// Exponer funciones globales necesarias para onclick en HTML
window.completeChallenge = completeChallenge;
window.startChallenge = startChallenge;