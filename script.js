// ========== INICIALIZACIÓN DE LA APLICACIÓN ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - Inicializando aplicación');
    initApp();
});

function initApp() {
    console.log('Inicializando aplicación...');
    
    // Configurar navegación primero
    setupNavigation();
    
    // Cargar datos iniciales
    loadAchievements();
    loadBenefits();
    loadFriends();
    loadChallenges();
    
    // Configurar funcionalidades
    setupAvatarSelection();
    setupProfileSave();
    setupRoadmap();
    setupModals();
    setupChallengeFilters();
    setupChestTimer();
    updateChestProgress();
    
    // Configurar botón del cofre
    const openChestBtn = document.getElementById('openChestBtn');
    if (openChestBtn) {
        openChestBtn.addEventListener('click', openChest);
    }
    
    console.log('Aplicación inicializada correctamente');
}

// ========== SISTEMA DE NAVEGACIÓN ==========
function setupNavigation() {
    console.log('Configurando navegación...');
    
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const sectionTitle = document.getElementById('current-section');
    
    const sectionTitles = {
        'saver': 'Saver',
        'retos': 'Retos',
        'logros': 'Logros',
        'beneficios': 'Beneficios',
        'perfil': 'Mi Perfil'
    };
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            console.log('Navegando a:', target);
            
            // Actualizar navegación activa
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error('Sección no encontrada:', target);
            }
            
            // Actualizar título
            if (sectionTitle) {
                sectionTitle.textContent = sectionTitles[target] || target;
            }
        });
    });
    
    console.log('Navegación configurada para', navItems.length, 'elementos');
}

// ========== SISTEMA DE CARGA DE DATOS ==========
function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
    if (!achievementsGrid) {
        console.log('achievementsGrid no encontrado');
        return;
    }
    
    achievementsGrid.innerHTML = '';
    
    achievementsData.forEach(achievement => {
        const achievementCard = document.createElement('div');
        achievementCard.className = 'achievement-card';
        achievementCard.setAttribute('data-id', achievement.id);
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">
                <i class="${achievement.icono}"></i>
            </div>
            <h3 class="achievement-title">${achievement.titulo}</h3>
            <p class="achievement-description">${achievement.descripcion}</p>
            <span class="achievement-badge ${achievement.estado.toLowerCase().replace(' ', '-')}">${achievement.estado}</span>
        `;
        
        achievementCard.addEventListener('click', function() {
            showAchievementModal(achievement.id);
        });
        
        achievementsGrid.appendChild(achievementCard);
    });
    
    console.log('Logros cargados:', achievementsData.length);
}

function loadBenefits() {
    const rewardsGrid = document.getElementById('rewardsGrid');
    if (!rewardsGrid) {
        console.log('rewardsGrid no encontrado');
        return;
    }
    
    rewardsGrid.innerHTML = '';
    
    benefitsData.forEach(benefit => {
        const rewardCard = document.createElement('div');
        rewardCard.className = 'reward-card';
        rewardCard.setAttribute('data-id', benefit.id);
        
        rewardCard.innerHTML = `
            <div class="reward-image">
                <i class="${benefit.icono}"></i>
            </div>
            <div class="reward-content">
                <h3 class="reward-title">${benefit.titulo}</h3>
                <p class="reward-description">${benefit.descripcion}</p>
                <div class="reward-footer">
                    <span class="reward-cost">${benefit.puntos} pts</span>
                    <button class="redeem-btn" ${benefit.puntos > 1250 ? 'disabled' : ''}>Canjear</button>
                </div>
            </div>
        `;
        
        rewardCard.addEventListener('click', function() {
            showBenefitModal(benefit.id);
        });
        
        rewardsGrid.appendChild(rewardCard);
    });
    
    console.log('Beneficios cargados:', benefitsData.length);
}

function loadFriends() {
    const friendsList = document.getElementById('friendsList');
    if (!friendsList) {
        console.log('friendsList no encontrado');
        return;
    }
    
    friendsList.innerHTML = '';
    
    friendsData.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        
        const percentage = Math.min(Math.round((friend.progreso / friend.meta) * 100), 100);
        
        friendItem.innerHTML = `
            <div class="friend-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="friend-info">
                <span class="friend-name">${friend.nombre}</span>
                <span class="friend-percentage">${percentage}%</span>
            </div>
            <div class="friend-progress-bar">
                <div class="friend-progress-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        
        friendsList.appendChild(friendItem);
    });
    
    console.log('Amigos cargados:', friendsData.length);
}

function loadChallenges() {
    const challengesGrid = document.getElementById('challengesGrid');
    if (!challengesGrid) {
        console.log('challengesGrid no encontrado');
        return;
    }
    
    challengesGrid.innerHTML = '';
    
    // Obtener filtro activo
    const activeFilter = document.querySelector('.filter-btn.active');
    const activeFilterValue = activeFilter ? activeFilter.getAttribute('data-filter') : 'todos';
    
    console.log('Filtro activo:', activeFilterValue);
    
    // Filtrar retos
    const filteredChallenges = challengesData.filter(challenge => {
        if (activeFilterValue === 'todos') return true;
        return challenge.tipo === activeFilterValue;
    });
    
    console.log('Retos filtrados:', filteredChallenges.length);
    
    filteredChallenges.forEach(challenge => {
        const challengeCard = document.createElement('div');
        challengeCard.className = 'challenge-card';
        challengeCard.setAttribute('data-id', challenge.id);
        
        const progressPercentage = Math.round((challenge.progreso / challenge.total) * 100);
        const isCompleted = challenge.estado === 'completado';
        const isActive = challenge.estado === 'activo';
        
        challengeCard.innerHTML = `
            <span class="challenge-badge ${challenge.tipo} ${isCompleted ? 'completado' : ''}">${challenge.tipo}</span>
            <div class="challenge-icon-large">
                <i class="${challenge.icono}"></i>
            </div>
            <div class="challenge-content">
                <h3 class="challenge-title">${challenge.titulo}</h3>
                <p class="challenge-description">${challenge.descripcion}</p>
                
                <div class="challenge-meta">
                    <span>Dificultad: ${challenge.dificultad}</span>
                    <span>${challenge.progreso}/${challenge.total}</span>
                </div>
                
                <div class="challenge-progress">
                    <div class="challenge-progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                
                <div class="challenge-reward">
                    <span>Recompensa</span>
                    <span class="reward-points">+${challenge.puntos} pts</span>
                </div>
                
                <div class="challenge-actions">
                    ${isCompleted ? 
                        '<button class="action-btn complete-btn" disabled>Completado</button>' : 
                        isActive ? 
                            '<button class="action-btn complete-btn">Completar</button>' :
                            '<button class="action-btn start-btn">Comenzar</button>'
                    }
                </div>
            </div>
        `;
        
        // Agregar evento para mostrar detalles del reto
        challengeCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('action-btn')) {
                showChallengeModal(challenge.id);
            }
        });
        
        // Agregar evento al botón de acción
        const actionBtn = challengeCard.querySelector('.action-btn');
        if (actionBtn && !actionBtn.disabled) {
            actionBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (challenge.estado === 'activo') {
                    completeChallenge(challenge.id);
                } else if (challenge.estado === 'disponible') {
                    startChallenge(challenge.id);
                }
            });
        }
        
        challengesGrid.appendChild(challengeCard);
    });
}

// ========== SISTEMA DE PERFIL ==========
function setupAvatarSelection() {
    const avatarSelection = document.getElementById('avatarSelection');
    if (!avatarSelection) {
        console.log('avatarSelection no encontrado');
        return;
    }
    
    avatarSelection.innerHTML = '';
    
    const avatars = [
        { icon: 'fas fa-user', name: 'Usuario Básico' },
        { icon: 'fas fa-user-tie', name: 'Ejecutivo' },
        { icon: 'fas fa-user-graduate', name: 'Graduado' },
        { icon: 'fas fa-user-astronaut', name: 'Astronauta' },
        { icon: 'fas fa-user-ninja', name: 'Ninja' },
        { icon: 'fas fa-cat', name: 'Gato' }
    ];
    
    avatars.forEach((avatar, index) => {
        const avatarOption = document.createElement('div');
        avatarOption.className = 'avatar-option';
        if (index === 0) avatarOption.classList.add('selected');
        
        avatarOption.innerHTML = `<i class="${avatar.icon}"></i>`;
        
        avatarOption.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        avatarSelection.appendChild(avatarOption);
    });
}

function setupProfileSave() {
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const userNameInput = document.getElementById('userNameInput');
    
    if (!saveProfileBtn || !userNameInput) {
        console.log('Elementos de perfil no encontrados');
        return;
    }
    
    saveProfileBtn.addEventListener('click', function() {
        const newName = userNameInput.value;
        const selectedAvatar = document.querySelector('.avatar-option.selected i').className;
        
        // Actualizar nombre en el sidebar
        document.getElementById('user-name').textContent = newName;
        
        // Mostrar confirmación
        showNotification('Perfil actualizado correctamente');
        
        console.log('Perfil guardado:', { nombre: newName, avatar: selectedAvatar });
    });
}

// ========== SISTEMA DE ROADMAP ==========
function setupRoadmap() {
    console.log('Configurando roadmap...');
    
    const variants = {
        1: {
            color: '#f59e0b',
            bg: '#fde68a',
            name: 'Colina Otoñal',
            d: `M40 360 C100 320, 160 340, 200 360 C240 380, 280 350, 300 320 C320 280, 280 250, 240 220 C200 190, 150 170, 100 130 C70 110, 80 70, 120 60`
        },
        2: {
            color: '#22c55e',
            bg: '#bbf7d0',
            name: 'Pradera Verde',
            d: `M30 360 C90 340, 150 380, 210 360 C260 340, 300 300, 280 260 C250 200, 180 210, 130 180 C80 150, 100 110, 160 90 C220 70, 260 80, 310 60`
        },
        3: {
            color: '#7c3aed',
            bg: '#ddd6fe',
            name: 'Paseo Nocturno',
            d: `M40 360 C80 320, 120 340, 150 300 C180 260, 210 300, 240 260 C270 220, 230 200, 200 170 C170 140, 140 170, 110 140 C80 110, 70 90, 110 60 C150 30, 200 50, 260 40`
        }
    };

    // ========== VARIABLES GLOBALES ==========
    let currentVariant = 1;
    let totalLen = 0;
    let currentGoal = 120;
    let currentDeposit = 60;

    // ========== ELEMENTOS DOM ==========
    const svg = document.getElementById('roadmapSvg');
    const bgPath = document.getElementById('bgPath');
    const progPath = document.getElementById('progPath');
    const checkpointsGroup = document.getElementById('checkpointsGroup');
    const flagGroup = document.getElementById('flagGroup');
    const goalLabel = document.getElementById('goalLabel');
    const depositLabel = document.getElementById('depositLabel');

    // Verificar que los elementos existan
    if (!svg || !bgPath || !progPath) {
        console.error('Elementos SVG del roadmap no encontrados');
        return;
    }

    /* ===== FUNCIONES DEL ROADMAP ===== */
    function drawVariant(variantId){
        currentVariant = variantId;
        const v = variants[variantId];
        
        // Configurar los paths
        bgPath.setAttribute('d', v.d);
        progPath.setAttribute('d', v.d);
        bgPath.setAttribute('stroke', v.bg);
        progPath.setAttribute('stroke', v.color);
        progPath.style.strokeLinecap = 'round';
        
        // Calcular longitud total
        totalLen = bgPath.getTotalLength();
        progPath.style.strokeDasharray = `${totalLen} ${totalLen}`;
        progPath.style.strokeDashoffset = `${totalLen}`;
        
        // Posicionar la bandera al final del camino
        const endPt = bgPath.getPointAtLength(totalLen);
        positionFlag(endPt.x, endPt.y);
        
        // Generar checkpoints y actualizar progreso
        generateCheckpoints();
        updateRoadmapStyle(variantId);
        updateProgressVisual();
    }

    function updateRoadmapStyle(variantId) {
        const styleOptions = document.querySelectorAll('.style-option');
        styleOptions.forEach(option => {
            option.classList.remove('selected');
            if (parseInt(option.getAttribute('data-variant')) === variantId) {
                option.classList.add('selected');
            }
        });
    }

    function positionFlag(x, y){
        if (!flagGroup) return;
        
        // Crear elementos de bandera si no existen
        let pole = document.getElementById('pole');
        let flagPoly = document.getElementById('flagPoly');
        
        if (!pole) {
            pole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            pole.id = 'pole';
            pole.setAttribute('class', 'flagPole');
            pole.setAttribute('width', '3');
            pole.setAttribute('height', '30');
            flagGroup.appendChild(pole);
        }
        
        if (!flagPoly) {
            flagPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
            flagPoly.id = 'flagPoly';
            flagGroup.appendChild(flagPoly);
        }
        
        const poleX = x - 6;
        const poleY = y - 32;
        pole.setAttribute('x', poleX);
        pole.setAttribute('y', poleY);
        
        const px = poleX + 6, py = poleY + 4;
        const p2x = px + 20, p2y = py + 6;
        const p3x = px, p3y = py + 12;
        flagPoly.setAttribute('points', `${px},${py} ${p2x},${p2y} ${p3x},${p3y}`);
        flagPoly.setAttribute('fill', variants[currentVariant].color);
    }

    function generateCheckpoints(){
        if (!checkpointsGroup) return;
        
        checkpointsGroup.innerHTML = '';
        const fractions = [0.25, 0.5, 0.75, 1];
        
        fractions.forEach((f, idx) => {
            const dist = f * totalLen;
            const pt = bgPath.getPointAtLength(dist);
            const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
            c.setAttribute('cx', pt.x);
            c.setAttribute('cy', pt.y);
            c.setAttribute('r', '9');
            c.setAttribute('class','cp');
            c.setAttribute('data-idx', String(idx));
            c.setAttribute('stroke', variants[currentVariant].color);
            c.setAttribute('fill', '#ffffff');
            checkpointsGroup.appendChild(c);
        });
    }

    function updateProgressVisual(){
        const goal = Math.max(1, currentGoal);
        const deposit = Math.max(0, currentDeposit);

        let pct = Math.min(deposit / goal, 1);
        const adjustedPct = pct * 0.98;
        const progressLen = adjustedPct * totalLen;

        // Actualizar progreso visual
        progPath.style.strokeDashoffset = `${totalLen - progressLen}`;
        
        // Actualizar labels
        if (goalLabel) goalLabel.textContent = goal;
        if (depositLabel) depositLabel.textContent = deposit;

        // Actualizar checkpoints
        const circles = Array.from(checkpointsGroup.querySelectorAll('circle.cp'));
        circles.forEach((c, i) => {
            const f = (i+1) / circles.length;
            const shouldBeActive = pct >= f - 0.001;
            
            if (shouldBeActive) {
                c.classList.add('active');
                c.setAttribute('fill', variants[currentVariant].color);
            } else {
                c.classList.remove('active');
                c.setAttribute('fill', '#ffffff');
            }
        });
    }

    /* ===== INICIALIZACIÓN ===== */
    drawVariant(1);
    console.log('Roadmap configurado correctamente');
}

// ========== SISTEMA DE MODALES ==========
function setupModals() {
    console.log('Configurando modales...');
    
    // Configurar modal de edición del roadmap
    const editRoadmapBtn = document.getElementById('editRoadmapBtn');
    const editRoadmapModal = document.getElementById('editRoadmapModal');
    const closeEditRoadmapModal = document.getElementById('closeEditRoadmapModal');
    const applyEditBtn = document.getElementById('applyEditBtn');
    const resetRoadmapBtn = document.getElementById('resetRoadmapBtn');
    const goalInput = document.getElementById('goalInput');
    const newDepositInput = document.getElementById('newDepositInput');
    const addDepositBtn = document.getElementById('addDepositBtn');

    if (editRoadmapBtn && editRoadmapModal) {
        editRoadmapBtn.addEventListener('click', function() {
            editRoadmapModal.style.display = 'block';
        });
    }

    if (closeEditRoadmapModal) {
        closeEditRoadmapModal.addEventListener('click', function() {
            editRoadmapModal.style.display = 'none';
        });
    }

    if (applyEditBtn && goalInput) {
        applyEditBtn.addEventListener('click', function() {
            const newGoal = parseInt(goalInput.value) || 120;
            if (newGoal > 0) {
                // Actualizar el objetivo en el roadmap
                document.getElementById('goalLabel').textContent = newGoal;
                if (editRoadmapModal) editRoadmapModal.style.display = 'none';
                showNotification('Cambios aplicados correctamente');
            }
        });
    }

    if (resetRoadmapBtn) {
        resetRoadmapBtn.addEventListener('click', function() {
            document.getElementById('goalLabel').textContent = 120;
            document.getElementById('depositLabel').textContent = 0;
            if (goalInput) goalInput.value = 120;
            if (newDepositInput) newDepositInput.value = '';
            showNotification('Ruta reiniciada correctamente');
        });
    }

    if (addDepositBtn && newDepositInput) {
        addDepositBtn.addEventListener('click', function() {
            const additionalDeposit = parseInt(newDepositInput.value) || 0;
            if (additionalDeposit > 0) {
                const currentDeposit = parseInt(document.getElementById('depositLabel').textContent);
                document.getElementById('depositLabel').textContent = currentDeposit + additionalDeposit;
                newDepositInput.value = '';
                showNotification(`¡Has agregado $${additionalDeposit} a tu ahorro!`);
            }
        });
    }

    // Configurar selección de estilos
    const styleOptions = document.querySelectorAll('.style-option');
    styleOptions.forEach(option => {
        option.addEventListener('click', function() {
            const variant = parseInt(this.getAttribute('data-variant'));
            styleOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            showNotification(`Estilo cambiado a: ${this.querySelector('span').textContent}`);
        });
    });

    // Configurar modal de amigos
    const socialToggleBtn = document.getElementById('socialToggle');
    const friendsModal = document.getElementById('friendsModal');
    const closeFriendsModal = document.getElementById('closeFriendsModal');

    if (socialToggleBtn && friendsModal) {
        socialToggleBtn.addEventListener('click', function() {
            friendsModal.style.display = 'block';
        });
    }

    if (closeFriendsModal) {
        closeFriendsModal.addEventListener('click', function() {
            friendsModal.style.display = 'none';
        });
    }

    // Configurar modal de agregar amigos
    setupFriendAddition();
    
    // Configurar cierre de modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        const modals = [
            'achievementModal', 'benefitModal', 'addFriendModal', 
            'friendsModal', 'editRoadmapModal'
        ];
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Configurar modal de logros
    const closeAchievementModal = document.getElementById('closeAchievementModal');
    if (closeAchievementModal) {
        closeAchievementModal.addEventListener('click', function() {
            document.getElementById('achievementModal').style.display = 'none';
        });
    }
    
    // Configurar modal de beneficios
    const closeBenefitModal = document.getElementById('closeBenefitModal');
    if (closeBenefitModal) {
        closeBenefitModal.addEventListener('click', function() {
            document.getElementById('benefitModal').style.display = 'none';
        });
    }
    
    console.log('Modales configurados correctamente');
}

function setupFriendAddition() {
    const addFriendBtn = document.getElementById('addFriendBtn');
    const addFriendModal = document.getElementById('addFriendModal');
    const closeAddFriendModal = document.getElementById('closeAddFriendModal');
    const confirmAddFriend = document.getElementById('confirmAddFriend');
    
    if (!addFriendBtn || !addFriendModal) {
        console.log('Elementos de agregar amigos no encontrados');
        return;
    }
    
    addFriendBtn.addEventListener('click', function() {
        addFriendModal.style.display = 'block';
    });
    
    if (closeAddFriendModal) {
        closeAddFriendModal.addEventListener('click', function() {
            addFriendModal.style.display = 'none';
        });
    }
    
    if (confirmAddFriend) {
        confirmAddFriend.addEventListener('click', function() {
            const friendName = document.getElementById('friendNameInput').value;
            const friendGoal = parseInt(document.getElementById('friendGoalInput').value);
            const friendProgress = parseInt(document.getElementById('friendProgressInput').value);
            
            if (friendName && friendGoal && friendProgress >= 0) {
                // Agregar nuevo amigo
                const newFriend = {
                    id: friendsData.length + 1,
                    nombre: friendName,
                    meta: friendGoal,
                    progreso: friendProgress
                };
                friendsData.push(newFriend);
                
                // Recargar lista de amigos
                loadFriends();
                
                // Cerrar modal y limpiar campos
                addFriendModal.style.display = 'none';
                document.getElementById('friendNameInput').value = '';
                document.getElementById('friendGoalInput').value = '';
                document.getElementById('friendProgressInput').value = '';
                
                showNotification(`Amigo ${friendName} agregado correctamente`);
            } else {
                showNotification('Por favor, completa todos los campos correctamente', 'error');
            }
        });
    }
}

function showAchievementModal(achievementId) {
    const achievement = achievementsData.find(a => a.id === achievementId);
    const modalBody = document.getElementById('achievementModalBody');
    const modal = document.getElementById('achievementModal');
    
    if (!achievement || !modalBody || !modal) {
        console.error('Modal de logro no encontrado');
        return;
    }
    
    modalBody.innerHTML = `
        <div class="modal-achievement">
            <div class="modal-achievement-icon">
                <i class="${achievement.icono}"></i>
            </div>
            <h3 class="modal-achievement-title">${achievement.titulo}</h3>
            <p class="modal-achievement-description">${achievement.descripcion}</p>
            
            <div class="modal-achievement-details">
                <h4>Detalles del Logro</h4>
                <p><strong>Estado:</strong> ${achievement.estado}</p>
                <p><strong>Puntos de recompensa:</strong> ${achievement.puntos || 0}</p>
                <p><strong>Categoría:</strong> ${achievement.categoria || 'Ahorro'}</p>
                ${achievement.requisitos ? `<p><strong>Requisitos:</strong> ${achievement.requisitos}</p>` : ''}
            </div>
            
            <button class="redeem-btn" onclick="document.getElementById('achievementModal').style.display='none'">
                ${achievement.estado === 'Desbloqueado' ? 'Reclamar Recompensa' : 'Continuar Progreso'}
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showBenefitModal(benefitId) {
    const benefit = benefitsData.find(b => b.id === benefitId);
    const modalBody = document.getElementById('benefitModalBody');
    const modal = document.getElementById('benefitModal');
    
    if (!benefit || !modalBody || !modal) {
        console.error('Modal de beneficio no encontrado');
        return;
    }
    
    modalBody.innerHTML = `
        <div class="modal-benefit">
            <div class="modal-benefit-icon">
                <i class="${benefit.icono}"></i>
            </div>
            <h3 class="modal-benefit-title">${benefit.titulo}</h3>
            <p class="modal-benefit-description">${benefit.descripcion}</p>
            
            <div class="modal-benefit-details">
                <h4>Detalles del Beneficio</h4>
                <p><strong>Costo en puntos:</strong> ${benefit.puntos}</p>
                <p><strong>Disponibilidad:</strong> ${benefit.disponibilidad || 'Disponible'}</p>
                <p><strong>Términos y condiciones:</strong> ${benefit.terminos || 'Aplican términos y condiciones.'}</p>
            </div>
            
            <button class="redeem-btn" ${benefit.puntos > 1250 ? 'disabled' : ''} 
                    onclick="document.getElementById('benefitModal').style.display='none'">
                Canjear Beneficio
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showChallengeModal(challengeId) {
    const challenge = challengesData.find(c => c.id === challengeId);
    const modalBody = document.getElementById('achievementModalBody');
    const modal = document.getElementById('achievementModal');
    
    if (!challenge || !modalBody || !modal) {
        console.error('Modal de reto no encontrado');
        return;
    }
    
    modalBody.innerHTML = `
        <div class="modal-challenge">
            <div class="modal-challenge-icon">
                <i class="${challenge.icono}"></i>
            </div>
            <h3 class="modal-challenge-title">${challenge.titulo}</h3>
            <p class="modal-challenge-description">${challenge.descripcion}</p>
            
            <div class="modal-challenge-stats">
                <div class="modal-stat">
                    <div class="modal-stat-value">${challenge.puntos}</div>
                    <div class="modal-stat-label">Puntos</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${challenge.dificultad}</div>
                    <div class="modal-stat-label">Dificultad</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${challenge.tipo}</div>
                    <div class="modal-stat-label">Tipo</div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-value">${challenge.progreso}/${challenge.total}</div>
                    <div class="modal-stat-label">Progreso</div>
                </div>
            </div>
            
            <div class="modal-challenge-details">
                <h4>Detalles del Reto</h4>
                <p>${challenge.detalles}</p>
                ${challenge.fechaLimite ? `<p><strong>Fecha límite:</strong> ${formatDate(challenge.fechaLimite)}</p>` : ''}
                <p><strong>Categoría:</strong> ${challenge.categoria}</p>
            </div>
            
            ${challenge.estado === 'completado' ? 
                '<button class="redeem-btn" disabled>Reto Completado</button>' :
                challenge.estado === 'activo' ?
                    `<button class="redeem-btn" onclick="completeChallenge(${challenge.id}); document.getElementById('achievementModal').style.display='none';">Completar Reto</button>` :
                    `<button class="redeem-btn" onclick="startChallenge(${challenge.id}); document.getElementById('achievementModal').style.display='none';">Comenzar Reto</button>`
            }
        </div>
    `;
    
    modal.style.display = 'block';
}

// ========== SISTEMA DE RETOS ==========
function startChallenge(challengeId) {
    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge) {
        challenge.estado = 'activo';
        challenge.fechaInicio = new Date().toISOString().split('T')[0];
        
        if (challenge.tipo === 'diario') {
            challenge.fechaLimite = new Date().toISOString().split('T')[0];
        }
        
        loadChallenges();
        showNotification(`¡Has comenzado el reto "${challenge.titulo}"!`);
    }
}

function completeChallenge(challengeId) {
    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge && challenge.estado === 'activo') {
        challenge.progreso = challenge.total;
        challenge.estado = 'completado';
        
        updateChestProgress();
        loadChallenges();
        showNotification(`¡Felicidades! Has completado el reto "${challenge.titulo}" y ganado ${challenge.puntos} puntos.`);
    }
}

function setupChallengeFilters() {
    console.log('Configurando filtros de retos...');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Filtro clickeado:', this.getAttribute('data-filter'));
            
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Recargar retos con el filtro aplicado
            loadChallenges();
        });
    });
    
    console.log('Filtros configurados para', filterBtns.length, 'botones');
}

// ========== SISTEMA DE COFRE SEMANAL ==========
function setupChestTimer() {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    function updateTimer() {
        const now = new Date();
        const diff = endOfWeek - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            const chestTimer = document.getElementById('chestTimer');
            if (chestTimer) {
                chestTimer.textContent = `${days}d ${hours}h ${minutes}m`;
            }
        } else {
            // Reiniciar la semana
            const chestTimer = document.getElementById('chestTimer');
            if (chestTimer) chestTimer.textContent = "0d 0h 0m";
        }
    }
    
    // Actualizar inmediatamente y luego cada segundo
    updateTimer();
    setInterval(updateTimer, 1000);
}

function updateChestProgress() {
    const completedThisWeek = challengesData.filter(challenge => 
        challenge.estado === 'completado'
    ).length;
    
    const chestProgress = document.getElementById('chestProgress');
    const chestProgressText = document.querySelector('.chest-progress span');
    const openChestBtn = document.getElementById('openChestBtn');
    const chestIcon = document.getElementById('chestIcon');
    
    if (chestProgress) {
        const progressPercentage = Math.min((completedThisWeek / 3) * 100, 100);
        chestProgress.style.width = `${progressPercentage}%`;
    }
    
    if (chestProgressText) {
        chestProgressText.textContent = `${completedThisWeek}/3 completados`;
    }
    
    if (openChestBtn && chestIcon) {
        if (completedThisWeek >= 3) {
            openChestBtn.disabled = false;
            chestIcon.classList.remove('locked');
            chestIcon.innerHTML = '<i class="fas fa-lock-open"></i>';
        } else {
            openChestBtn.disabled = true;
            chestIcon.classList.add('locked');
            chestIcon.innerHTML = '<i class="fas fa-lock"></i>';
        }
    }
}

function openChest() {
    const rewards = [50, 100, 150, 200];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    const chestIcon = document.getElementById('chestIcon');
    const openChestBtn = document.getElementById('openChestBtn');
    
    if (chestIcon) {
        chestIcon.innerHTML = '<i class="fas fa-gem"></i>';
        chestIcon.style.background = 'linear-gradient(to right, #FFD700, #FFA500)';
    }
    
    showNotification(`¡Felicidades! Has abierto el cofre semanal y ganado ${randomReward} puntos extra.`);
    
    if (openChestBtn) {
        openChestBtn.disabled = true;
    }
}

// ========== FUNCIONES UTILITARIAS ==========
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function showNotification(message, type = 'success') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--accent)' : 'var(--primary)'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        box-shadow: var(--shadow);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========== INICIALIZACIÓN DE ESTILOS DINÁMICOS ==========
// Agregar estilos para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(notificationStyles);

// ========== FUNCIONES GLOBALES PARA HTML ==========
// Hacer funciones disponibles globalmente para onclick en HTML
window.completeChallenge = completeChallenge;
window.startChallenge = startChallenge;
window.openChest = openChest;
window.showAchievementModal = showAchievementModal;
window.showBenefitModal = showBenefitModal;

console.log('JavaScript cargado correctamente');
// ========== SISTEMA DE TEMA OSCURO ==========
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema guardado
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') {
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            showNotification('Tema oscuro activado');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            showNotification('Tema claro activado');
        }
    });
}

// ========== SISTEMA DE AVATAR CON IMÁGENES ==========
function setupAvatarSystem() {
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarModal = document.getElementById('avatarModal');
    const closeAvatarModal = document.getElementById('closeAvatarModal');
    const cancelAvatarSelect = document.getElementById('cancelAvatarSelect');
    const confirmAvatarSelect = document.getElementById('confirmAvatarSelect');
    const avatarGrid = document.getElementById('avatarGrid');
    const currentAvatarImg = document.getElementById('currentAvatarImg');
    
    // Cargar grid de avatares
    avatarGrid.innerHTML = '';
    for (let i = 1; i <= 6; i++) {
        const avatarOption = document.createElement('div');
        avatarOption.className = 'avatar-option-modal';
        avatarOption.setAttribute('data-avatar', `assets/avatar-0${i}.png`);
        
        const img = document.createElement('img');
        img.src = `assets/avatar-0${i}.png`;
        img.alt = `Avatar ${i}`;
        img.onerror = function() {
            // Si la imagen no existe, usar un placeholder
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSIjOERCOUZGIi8+CjxyZWN0IHg9IjI1IiB5PSI3MCIgd2lkdGg9IjUwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjOERCOUZGIi8+Cjwvc3ZnPgo=';
        };
        
        avatarOption.appendChild(img);
        avatarOption.addEventListener('click', function() {
            document.querySelectorAll('.avatar-option-modal').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
        
        avatarGrid.appendChild(avatarOption);
    }
    
    // Abrir modal
    changeAvatarBtn.addEventListener('click', function() {
        avatarModal.style.display = 'block';
    });
    
    // Cerrar modal
    closeAvatarModal.addEventListener('click', function() {
        avatarModal.style.display = 'none';
    });
    
    cancelAvatarSelect.addEventListener('click', function() {
        avatarModal.style.display = 'none';
    });
    
    // Confirmar selección
    confirmAvatarSelect.addEventListener('click', function() {
        const selectedAvatar = document.querySelector('.avatar-option-modal.selected');
        if (selectedAvatar) {
            const avatarSrc = selectedAvatar.getAttribute('data-avatar');
            currentAvatarImg.src = avatarSrc;
            localStorage.setItem('selectedAvatar', avatarSrc);
            showNotification('Avatar actualizado correctamente');
            avatarModal.style.display = 'none';
        } else {
            showNotification('Por favor selecciona un avatar', 'error');
        }
    });
    
    // Cargar avatar guardado
    const savedAvatar = localStorage.getItem('selectedAvatar');
    if (savedAvatar) {
        currentAvatarImg.src = savedAvatar;
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === avatarModal) {
            avatarModal.style.display = 'none';
        }
    });
}

// ========== FILTROS DE RETOS CORREGIDOS ==========
function setupChallengeFilters() {
    console.log('Configurando filtros de retos...');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log('Filtro clickeado:', filter);
            
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Recargar retos con el filtro aplicado
            loadChallenges(filter);
        });
    });
    
    console.log('Filtros configurados para', filterBtns.length, 'botones');
}

function loadChallenges(activeFilter = 'todos') {
    const challengesGrid = document.getElementById('challengesGrid');
    if (!challengesGrid) {
        console.log('challengesGrid no encontrado');
        return;
    }
    
    challengesGrid.innerHTML = '';
    
    console.log('Filtro activo:', activeFilter);
    
    // Filtrar retos
    const filteredChallenges = challengesData.filter(challenge => {
        if (activeFilter === 'todos') return true;
        
        // Mapear los filtros a los tipos de retos
        const filterMap = {
            'diarios': 'diario',
            'semanales': 'semanal',
            'mensuales': 'mensual'
        };
        
        return challenge.tipo === filterMap[activeFilter];
    });
    
    console.log('Retos filtrados:', filteredChallenges.length);
    
    if (filteredChallenges.length === 0) {
        challengesGrid.innerHTML = `
            <div class="no-challenges">
                <i class="fas fa-inbox"></i>
                <h3>No hay retos disponibles</h3>
                <p>No se encontraron retos para el filtro seleccionado.</p>
            </div>
        `;
        return;
    }
    
    filteredChallenges.forEach(challenge => {
        const challengeCard = document.createElement('div');
        challengeCard.className = 'challenge-card';
        challengeCard.setAttribute('data-id', challenge.id);
        
        const progressPercentage = Math.round((challenge.progreso / challenge.total) * 100);
        const isCompleted = challenge.estado === 'completado';
        const isActive = challenge.estado === 'activo';
        
        challengeCard.innerHTML = `
            <span class="challenge-badge ${challenge.tipo} ${isCompleted ? 'completado' : ''}">${challenge.tipo}</span>
            <div class="challenge-icon-large">
                <i class="${challenge.icono}"></i>
            </div>
            <div class="challenge-content">
                <h3 class="challenge-title">${challenge.titulo}</h3>
                <p class="challenge-description">${challenge.descripcion}</p>
                
                <div class="challenge-meta">
                    <span class="difficulty ${challenge.dificultad}">${challenge.dificultad}</span>
                    <span>${challenge.progreso}/${challenge.total}</span>
                </div>
                
                <div class="challenge-progress">
                    <div class="challenge-progress-fill" style="width: ${progressPercentage}%"></div>
                </div>
                
                <div class="challenge-reward">
                    <span>Recompensa</span>
                    <span class="reward-points">+${challenge.puntos} pts</span>
                </div>
                
                <div class="challenge-actions">
                    ${isCompleted ? 
                        '<button class="action-btn complete-btn" disabled><i class="fas fa-check"></i> Completado</button>' : 
                        isActive ? 
                            '<button class="action-btn complete-btn"><i class="fas fa-flag-checkered"></i> Completar</button>' :
                            '<button class="action-btn start-btn"><i class="fas fa-play"></i> Comenzar</button>'
                    }
                </div>
            </div>
        `;
        
        // Agregar evento para mostrar detalles del reto
        challengeCard.addEventListener('click', function(e) {
            if (!e.target.classList.contains('action-btn')) {
                showChallengeModal(challenge.id);
            }
        });
        
        // Agregar evento al botón de acción
        const actionBtn = challengeCard.querySelector('.action-btn');
        if (actionBtn && !actionBtn.disabled) {
            actionBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                if (challenge.estado === 'activo') {
                    completeChallenge(challenge.id);
                } else if (challenge.estado === 'disponible') {
                    startChallenge(challenge.id);
                }
            });
        }
        
        challengesGrid.appendChild(challengeCard);
    });
}

// ========== INICIALIZACIÓN ACTUALIZADA ==========
function initApp() {
    console.log('Inicializando aplicación...');
    
    // Configurar navegación primero
    setupNavigation();
    
    // Cargar datos iniciales
    loadAchievements();
    loadBenefits();
    loadFriends();
    loadChallenges('todos'); // Cargar con filtro por defecto
    
    // Configurar funcionalidades
    setupAvatarSelection();
    setupProfileSave();
    setupRoadmap();
    setupModals();
    setupChallengeFilters();
    setupChestTimer();
    updateChestProgress();
    
    // Nuevas funcionalidades
    setupThemeToggle();
    setupAvatarSystem();
    
    // Configurar botón del cofre
    const openChestBtn = document.getElementById('openChestBtn');
    if (openChestBtn) {
        openChestBtn.addEventListener('click', openChest);
    }
    
    console.log('Aplicación inicializada correctamente');
}