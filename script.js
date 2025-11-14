// ========== NAVEGACIÓN PRINCIPAL ==========
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar la aplicación
    initApp();
    
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const sectionTitle = document.getElementById('current-section');
    
    // Títulos de las secciones
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
            
            // Actualizar navegación activa
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(target).classList.add('active');
            
            // Actualizar título
            sectionTitle.textContent = sectionTitles[target];
            
            // Si estamos en móvil y vamos a perfil, mostrar información del perfil
            if (target === 'perfil' && window.innerWidth <= 992) {
                loadMobileProfileInfo();
            }
        });
    });
    
    // Cargar información del perfil en móvil si estamos en esa sección
    if (window.innerWidth <= 992 && document.getElementById('perfil').classList.contains('active')) {
        loadMobileProfileInfo();
    }
});

// ========== INICIALIZACIÓN DE LA APLICACIÓN ==========
function initApp() {
    // Cargar datos iniciales
    loadAchievements();
    loadBenefits();
    loadFriends();
    loadChallenges();
    setupAvatarSelection();
    setupProfileSave();
    setupRoadmap();
    setupModals();
    setupChallengeFilters();
    setupChestTimer();
    updateChestProgress();
    
    // Configurar el botón de mostrar/ocultar amigos
    const socialToggleBtn = document.getElementById('socialToggle');
    const friendsPanel = document.getElementById('friendsPanel');
    
    socialToggleBtn.addEventListener('click', function() {
        friendsPanel.classList.toggle('active');
    });
    
    // Configurar evento para abrir el cofre
    document.getElementById('openChestBtn').addEventListener('click', openChest);
}

// ========== CARGA DE DATOS ==========
function loadAchievements() {
    const achievementsGrid = document.getElementById('achievementsGrid');
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
}

function loadBenefits() {
    const rewardsGrid = document.getElementById('rewardsGrid');
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
}

function loadFriends() {
    const friendsList = document.getElementById('friendsList');
    friendsList.innerHTML = '';
    
    friendsData.forEach(friend => {
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        
        const percentage = Math.min(Math.round((friend.progreso / friend.meta) * 100), 100);
        
        friendItem.innerHTML = `
            <div class="friend-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="friend-progress-bar">
                <div class="friend-progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="friend-info">
                <span class="friend-name">${friend.nombre}</span>
                <span class="friend-percentage">${percentage}%</span>
            </div>
        `;
        
        friendsList.appendChild(friendItem);
    });
}

// ========== SELECCIÓN DE AVATAR ==========
function setupAvatarSelection() {
    const avatarSelection = document.getElementById('avatarSelection');
    avatarSelection.innerHTML = '';
    
    const avatars = [
        { icon: 'fas fa-user', name: 'Usuario Básico' },
        { icon: 'fas fa-user-tie', name: 'Ejecutivo' },
        { icon: 'fas fa-user-graduate', name: 'Graduado' },
        { icon: 'fas fa-user-astronaut', name: 'Astronauta' },
        { icon: 'fas fa-user-ninja', name: 'Ninja' },
        { icon: 'fas fa-user-secret', name: 'Secreto' },
        { icon: 'fas fa-robot', name: 'Robot' },
        { icon: 'fas fa-cat', name: 'Gato' },
        { icon: 'fas fa-dragon', name: 'Dragón' }
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
            
            // Actualizar avatar en el sidebar
            document.querySelector('.profile-avatar i').className = avatar.icon;
        });
        
        avatarSelection.appendChild(avatarOption);
    });
}

// ========== GUARDAR PERFIL ==========
function setupProfileSave() {
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const userNameInput = document.getElementById('userNameInput');
    
    saveProfileBtn.addEventListener('click', function() {
        const newName = userNameInput.value;
        const selectedAvatar = document.querySelector('.avatar-option.selected i').className;
        const selectedBank = document.getElementById('bankSelect').value;
        
        // Actualizar nombre en el sidebar
        document.getElementById('user-name').textContent = newName;
        
        // Actualizar avatar en el sidebar
        document.querySelector('.profile-avatar i').className = selectedAvatar;
        
        // Mostrar confirmación
        alert('Perfil actualizado correctamente');
        
        // En una aplicación real, aquí enviaríamos los datos al servidor
        console.log('Perfil guardado:', {
            nombre: newName,
            avatar: selectedAvatar,
            banco: selectedBank
        });
    });
}

// ========== PANEL DE AMIGOS ==========
function setupFriendAddition() {
    const addFriendBtn = document.getElementById('addFriendBtn');
    const addFriendModal = document.getElementById('addFriendModal');
    const closeAddFriendModal = document.getElementById('closeAddFriendModal');
    const confirmAddFriend = document.getElementById('confirmAddFriend');
    
    addFriendBtn.addEventListener('click', function() {
        addFriendModal.style.display = 'block';
    });
    
    closeAddFriendModal.addEventListener('click', function() {
        addFriendModal.style.display = 'none';
    });
    
    confirmAddFriend.addEventListener('click', function() {
        const friendName = document.getElementById('friendNameInput').value;
        const friendGoal = parseInt(document.getElementById('friendGoalInput').value);
        const friendProgress = parseInt(document.getElementById('friendProgressInput').value);
        
        if (friendName && friendGoal && friendProgress >= 0) {
            // Agregar amigo a la lista
            friendsData.push({
                id: friendsData.length + 1,
                nombre: friendName,
                meta: friendGoal,
                progreso: friendProgress
            });
            
            // Recargar lista de amigos
            loadFriends();
            
            // Cerrar modal y limpiar campos
            addFriendModal.style.display = 'none';
            document.getElementById('friendNameInput').value = '';
            document.getElementById('friendGoalInput').value = '';
            document.getElementById('friendProgressInput').value = '';
            
            // Mostrar confirmación
            alert(`Amigo ${friendName} agregado correctamente`);
        } else {
            alert('Por favor, completa todos los campos correctamente');
        }
    });
}

// ========== MODALES ==========
function setupModals() {
    // Configurar cierre de modales al hacer clic fuera
    window.addEventListener('click', function(event) {
        const achievementModal = document.getElementById('achievementModal');
        const benefitModal = document.getElementById('benefitModal');
        const addFriendModal = document.getElementById('addFriendModal');
        
        if (event.target === achievementModal) {
            achievementModal.style.display = 'none';
        }
        if (event.target === benefitModal) {
            benefitModal.style.display = 'none';
        }
        if (event.target === addFriendModal) {
            addFriendModal.style.display = 'none';
        }
    });
    
    // Configurar modal de logros
    const closeAchievementModal = document.getElementById('closeAchievementModal');
    closeAchievementModal.addEventListener('click', function() {
        document.getElementById('achievementModal').style.display = 'none';
    });
    
    // Configurar modal de beneficios
    const closeBenefitModal = document.getElementById('closeBenefitModal');
    closeBenefitModal.addEventListener('click', function() {
        document.getElementById('benefitModal').style.display = 'none';
    });
    
    // Configurar modal de agregar amigos
    setupFriendAddition();
}

function showAchievementModal(achievementId) {
    const achievement = achievementsData.find(a => a.id === achievementId);
    const modalBody = document.getElementById('achievementModalBody');
    
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
            
            <button class="redeem-btn">${achievement.estado === 'Desbloqueado' ? 'Reclamar Recompensa' : 'Continuar Progreso'}</button>
        </div>
    `;
    
    document.getElementById('achievementModal').style.display = 'block';
}

function showBenefitModal(benefitId) {
    const benefit = benefitsData.find(b => b.id === benefitId);
    const modalBody = document.getElementById('benefitModalBody');
    
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
            
            <button class="redeem-btn" ${benefit.puntos > 1250 ? 'disabled' : ''}>Canjear Beneficio</button>
        </div>
    `;
    
    document.getElementById('benefitModal').style.display = 'block';
}

// ========== INFORMACIÓN DE PERFIL EN MÓVIL ==========
function loadMobileProfileInfo() {
    const profileContent = document.querySelector('.profile-content');
    
    // Si ya tenemos la información móvil cargada, no hacer nada
    if (document.getElementById('mobileProfileInfo')) return;
    
    const mobileProfileInfo = document.createElement('div');
    mobileProfileInfo.id = 'mobileProfileInfo';
    mobileProfileInfo.className = 'card';
    mobileProfileInfo.innerHTML = `
        <div class="card-header">
            <h2 class="card-title">Mi Perfil</h2>
        </div>
        <div class="profile-stats">
            <div class="stat-item">
                <span>Puntos:</span>
                <span class="stat-value">1,250</span>
            </div>
            <div class="stat-item">
                <span>Ahorro total:</span>
                <span class="stat-value">$1,850</span>
            </div>
            <div class="stat-item">
                <span>Días consecutivos:</span>
                <span class="stat-value">24</span>
            </div>
            <div class="stat-item">
                <span>Logros:</span>
                <span class="stat-value">8/15</span>
            </div>
        </div>
        <div class="profile-challenges">
            <h3>Retos Activos</h3>
            <div class="challenge-item">
                <i class="fas fa-coins challenge-icon"></i>
                <span>Ahorra $50 esta semana</span>
            </div>
            <div class="challenge-item">
                <i class="fas fa-coffee challenge-icon"></i>
                <span>Evita gastos hormiga</span>
            </div>
            <div class="challenge-item">
                <i class="fas fa-piggy-bank challenge-icon"></i>
                <span>Completa tu meta mensual</span>
            </div>
        </div>
    `;
    
    // Insertar al principio del contenido del perfil
    profileContent.insertBefore(mobileProfileInfo, profileContent.firstChild);
}

// ========== RETOS ==========
function loadChallenges() {
    const challengesGrid = document.getElementById('challengesGrid');
    challengesGrid.innerHTML = '';
    
    // Aplicar filtro si existe
    const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    
    const filteredChallenges = challengesData.filter(challenge => {
        if (activeFilter === 'todos') return true;
        return challenge.tipo === activeFilter;
    });
    
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

function startChallenge(challengeId) {
    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge) {
        challenge.estado = 'activo';
        challenge.fechaInicio = new Date().toISOString().split('T')[0];
        
        // Si es un reto diario, establecer fecha límite para hoy
        if (challenge.tipo === 'diario') {
            challenge.fechaLimite = new Date().toISOString().split('T')[0];
        }
        
        // Recargar retos
        loadChallenges();
        
        // Mostrar mensaje de confirmación
        alert(`¡Has comenzado el reto "${challenge.titulo}"!`);
        
        // En una aplicación real, aquí guardaríamos el cambio en el servidor
        console.log('Reto iniciado:', challenge);
    }
}

function completeChallenge(challengeId) {
    const challenge = challengesData.find(c => c.id === challengeId);
    if (challenge && challenge.estado === 'activo') {
        challenge.progreso = challenge.total;
        challenge.estado = 'completado';
        
        // Actualizar progreso del cofre semanal
        updateChestProgress();
        
        // Recargar retos
        loadChallenges();
        
        // Mostrar mensaje de éxito
        alert(`¡Felicidades! Has completado el reto "${challenge.titulo}" y ganado ${challenge.puntos} puntos.`);
        
        // En una aplicación real, aquí guardaríamos el cambio en el servidor y actualizaríamos los puntos del usuario
        console.log('Reto completado:', challenge);
    }
}

function updateChestProgress() {
    // Contar retos completados esta semana
    const completedThisWeek = challengesData.filter(challenge => 
        challenge.estado === 'completado' && 
        isThisWeek(new Date(challenge.fechaInicio))
    ).length;
    
    // Actualizar la barra de progreso del cofre
    const chestProgress = document.getElementById('chestProgress');
    const progressPercentage = Math.min((completedThisWeek / 3) * 100, 100);
    chestProgress.style.width = `${progressPercentage}%`;
    
    // Actualizar el texto
    const chestProgressText = document.querySelector('.chest-progress span');
    chestProgressText.textContent = `${completedThisWeek}/3 completados`;
    
    // Habilitar o deshabilitar el botón de abrir cofre
    const openChestBtn = document.getElementById('openChestBtn');
    const chestIcon = document.getElementById('chestIcon');
    
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

function isThisWeek(date) {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return date >= startOfWeek && date <= endOfWeek;
}

function setupChestTimer() {
    // Establecer la fecha de finalización de la semana (domingo a las 23:59)
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Actualizar el temporizador cada segundo
    setInterval(() => {
        const now = new Date();
        const diff = endOfWeek - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            document.getElementById('chestTimer').textContent = `${days}d ${hours}h ${minutes}m`;
        } else {
            // Reiniciar la semana
            document.getElementById('chestTimer').textContent = "0d 0h 0m";
            // En una aplicación real, aquí reiniciaríamos los retos semanales
        }
    }, 1000);
}

function openChest() {
    // Generar recompensa aleatoria
    const rewards = [50, 100, 150, 200];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    // Mostrar animación de recompensa
    const chestIcon = document.getElementById('chestIcon');
    chestIcon.innerHTML = '<i class="fas fa-gem"></i>';
    chestIcon.style.background = 'linear-gradient(to right, #FFD700, #FFA500)';
    
    // Mostrar mensaje de recompensa
    alert(`¡Felicidades! Has abierto el cofre semanal y ganado ${randomReward} puntos extra.`);
    
    // Deshabilitar el botón hasta la próxima semana
    document.getElementById('openChestBtn').disabled = true;
    
    // En una aplicación real, aquí actualizaríamos los puntos del usuario en el servidor
    console.log('Cofre abierto, recompensa:', randomReward);
}

function showChallengeModal(challengeId) {
    const challenge = challengesData.find(c => c.id === challengeId);
    const modalBody = document.getElementById('achievementModalBody');
    
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
    
    document.getElementById('achievementModal').style.display = 'block';
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// ========== FILTROS DE RETOS ==========
function setupChallengeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Agregar clase active al botón clickeado
            this.classList.add('active');
            
            // Recargar retos con el filtro aplicado
            loadChallenges();
        });
    });
}

// ========== ROADMAP ==========
function setupRoadmap() {
    const variants = {
        1: {
            color: '#f59e0b',
            bg: '#fde68a',
            d: `M40 360 C100 320, 160 340, 200 360 C240 380, 280 350, 300 320 C320 280, 280 250, 240 220 C200 190, 150 170, 100 130 C70 110, 80 70, 120 60`
        },
        2: {
            color: '#22c55e',
            bg: '#bbf7d0',
            d: `M30 360 C90 340, 150 380, 210 360 C260 340, 300 300, 280 260 C250 200, 180 210, 130 180 C80 150, 100 110, 160 90 C220 70, 260 80, 310 60`
        },
        3: {
            color: '#7c3aed',
            bg: '#ddd6fe',
            d: `M40 360 C80 320, 120 340, 150 300 C180 260, 210 300, 240 260 C270 220, 230 200, 200 170 C170 140, 140 170, 110 140 C80 110, 70 90, 110 60 C150 30, 200 50, 260 40`
        }
    };

    // ========== DOM ==========
    const svg = document.getElementById('roadmapSvg');
    const bgPath = document.getElementById('bgPath');
    const progPath = document.getElementById('progPath');
    const checkpointsGroup = document.getElementById('checkpointsGroup');
    const flagPoly = document.getElementById('flagPoly');
    const pole = document.getElementById('pole');
    const card = document.getElementById('saver');

    const variantSelect = document.getElementById('variantSelect');
    const goalInput = document.getElementById('goalInput');
    const depositInput = document.getElementById('depositInput');
    const applyBtn = document.getElementById('applyBtn');
    const goalLabel = document.getElementById('goalLabel');
    const depositLabel = document.getElementById('depositLabel');

    let currentVariant = 1;
    let totalLen = 0;
    let lastActiveIndex = -1;

    /* ===== Util ===== */
    function svgPointToClient(x, y){
        const pt = svg.createSVGPoint();
        pt.x = x; pt.y = y;
        const ctm = svg.getScreenCTM();
        if (!ctm) return {x, y};
        const transformed = pt.matrixTransform(ctm);
        return {x: transformed.x, y: transformed.y};
    }

    /* ===== Dibuja variante ===== */
    function drawVariant(variantId){
        currentVariant = variantId;
        const v = variants[variantId];
        bgPath.setAttribute('d', v.d);
        progPath.setAttribute('d', v.d);
        bgPath.setAttribute('stroke', v.bg);
        progPath.setAttribute('stroke', v.color);
        progPath.style.strokeLinecap = 'butt';
        svg.style.color = v.color;
        totalLen = bgPath.getTotalLength();
        progPath.style.strokeDasharray = `${totalLen} ${totalLen}`;
        progPath.style.strokeDashoffset = `${totalLen}`;
        const endPt = bgPath.getPointAtLength(totalLen);
        positionFlag(endPt.x, endPt.y);
        generateCheckpoints();
    }

    /* ===== Bandera ===== */
    function positionFlag(x, y){
        const poleX = x - 6;
        const poleY = y - 32;
        pole.setAttribute('x', poleX);
        pole.setAttribute('y', poleY);
        pole.setAttribute('height', 28);
        const px = poleX + 6, py = poleY + 4;
        const p2x = px + 20, p2y = py + 6;
        const p3x = px, p3y = py + 12;
        flagPoly.setAttribute('points', `${px},${py} ${p2x},${p2y} ${p3x},${p3y}`);
    }

    /* ===== Checkpoints ===== */
    function generateCheckpoints(){
        checkpointsGroup.innerHTML = '';
        const fractions = [0.25, 0.5, 0.75, 1];
        fractions.forEach((f, idx) => {
            const dist = f * totalLen;
            const pt = bgPath.getPointAtLength(dist);
            const c = document.createElementNS('http://www.w3.org/2000/svg','circle');
            c.setAttribute('cx', pt.x);
            c.setAttribute('cy', pt.y);
            c.setAttribute('r', 9);
            c.setAttribute('class','cp');
            c.setAttribute('data-idx', String(idx));
            c.setAttribute('stroke', svg.style.color || variants[currentVariant].color);
            checkpointsGroup.appendChild(c);
        });
        updateProgressVisual();
    }

    /* ===== Actualiza progreso ===== */
    function updateProgressVisual(){
        const goal = Math.max(1, Number(goalInput.value) || 1);
        const deposit = Math.max(0, Number(depositInput.value) || 0);

        // ✅ Escala ajustada: la barra nunca pasa del último checkpoint visual
        let pct = Math.min(deposit / goal, 1);
        const adjustedPct = pct * 0.98; // evita que se sobrepase el último punto
        const progressLen = adjustedPct * totalLen;

        progPath.style.strokeDashoffset = `${totalLen - progressLen}`;
        goalLabel.textContent = goal;
        depositLabel.textContent = deposit;

        const circles = Array.from(checkpointsGroup.querySelectorAll('circle.cp'));
        circles.forEach((c, i) => {
            const f = (i+1) / circles.length;
            const shouldBeActive = pct >= f - 0.001;
            const alreadyActive = c.classList.contains('active');
            if (shouldBeActive && !alreadyActive) {
                c.classList.add('active');
                if (i > lastActiveIndex) {
                    lastActiveIndex = i;
                    triggerCelebrationAtCircle(c);
                }
            } else if (!shouldBeActive && alreadyActive) {
                c.classList.remove('active');
                if (i <= lastActiveIndex) lastActiveIndex = i - 1;
            }
        });
    }

    /* ===== Celebración ===== */
    function triggerCelebrationAtCircle(circle){
        const cx = parseFloat(circle.getAttribute('cx'));
        const cy = parseFloat(circle.getAttribute('cy'));
        const client = svgPointToClient(cx, cy);
        const cardRect = card.getBoundingClientRect();
        const baseLeft = client.x - cardRect.left;
        const baseTop = client.y - cardRect.top;

        const colors = ['#f87171','#fbbf24','#34d399','#60a5fa','#a78bfa','#fb7185'];
        const N = 16;
        for (let i=0;i<N;i++){
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.left = `${baseLeft + (Math.random()*30-15)}px`;
            p.style.top = `${baseTop + (Math.random()*20-10)}px`;
            p.style.background = colors[Math.floor(Math.random()*colors.length)];
            p.style.opacity = String(0.95 - Math.random()*0.2);
            p.style.width = p.style.height = `${8 + Math.random()*8}px`;
            p.style.borderRadius = (Math.random()>.6)? '2px' : '50%';
            card.appendChild(p);
            setTimeout(()=>{ if(p && p.parentNode) p.parentNode.removeChild(p); }, 1200);
        }
    }

    /* ===== Resize ===== */
    let resizeTimer = null;
    function handleResize(){
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(()=>{
            totalLen = bgPath.getTotalLength();
            progPath.style.strokeDasharray = `${totalLen} ${totalLen}`;
            const endPt = bgPath.getPointAtLength(totalLen);
            positionFlag(endPt.x, endPt.y);
            const circles = Array.from(checkpointsGroup.querySelectorAll('circle.cp'));
            circles.forEach((c, idx) => {
                const frac = (idx+1) / circles.length;
                const pt = bgPath.getPointAtLength(frac * totalLen);
                c.setAttribute('cx', pt.x);
                c.setAttribute('cy', pt.y);
            });
            updateProgressVisual();
        }, 120);
    }
    window.addEventListener('resize', handleResize);

    /* ===== Eventos ===== */
    variantSelect.addEventListener('change', e => {
        drawVariant(Number(e.target.value));
        lastActiveIndex = -1;
    });
    applyBtn.addEventListener('click', ()=>{
        totalLen = bgPath.getTotalLength();
        progPath.style.strokeDasharray = `${totalLen} ${totalLen}`;
        updateProgressVisual();
    });
    depositInput.addEventListener('input', updateProgressVisual);
    goalInput.addEventListener('input', updateProgressVisual);

    /* ===== Inicializa ===== */
    drawVariant(1);
}