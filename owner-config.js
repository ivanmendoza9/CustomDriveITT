// ========== PATRÓN MEMENTO PARA CONFIGURACIÓN DE PROPIETARIO ==========

// Memento: Captura el estado de la configuración del vehículo del propietario
class OwnerConfigurationMemento {
	constructor(seatPosition, steeringWheel, mirrors, lights, climate, sunroof, comfort, drivingMode, ambientTheme) {
		this.seatPosition = { ...seatPosition };
		this.steeringWheel = { ...steeringWheel };
		this.mirrors = { ...mirrors };
		this.lights = { ...lights };
		this.climate = { ...climate };
		this.sunroof = sunroof;
		this.comfort = { ...comfort };
		this.drivingMode = drivingMode;
		this.ambientTheme = ambientTheme;
		this.timestamp = new Date();
	}
}

// Caretaker: Gestiona el historial de configuraciones
class OwnerConfigurationHistory {
	constructor() {
		this.history = [];
		this.currentIndex = -1;
	}

	saveState(memento) {
		// Eliminar cualquier estado que haya después del índice actual
		if (this.currentIndex < this.history.length - 1) {
			this.history = this.history.slice(0, this.currentIndex + 1);
		}
		this.history.push(memento);
		this.currentIndex++;
		this.updateHistoryButtons();
	}

	undo() {
		if (this.currentIndex > 0) {
			this.currentIndex--;
			this.updateHistoryButtons();
			return this.history[this.currentIndex];
		}
		return null;
	}

	redo() {
		if (this.currentIndex < this.history.length - 1) {
			this.currentIndex++;
			this.updateHistoryButtons();
			return this.history[this.currentIndex];
		}
		return null;
	}

	canUndo() {
		return this.currentIndex > 0;
	}

	canRedo() {
		return this.currentIndex < this.history.length - 1;
	}

	updateHistoryButtons() {
		const btnUndo = document.getElementById('btnUndo');
		const btnRedo = document.getElementById('btnRedo');

		if (btnUndo) btnUndo.disabled = !this.canUndo();
		if (btnRedo) btnRedo.disabled = !this.canRedo();
	}
}

// Instancia global del historial
const ownerConfigHistory = new OwnerConfigurationHistory();

// ========== GESTOR DE PERFILES (Persistencia) ==========
class OwnerProfilesManager {
	constructor() {
		this.storageKey = 'ownerProfiles';
		this.currentProfile = null;
	}

	saveProfile(name, config) {
		const profiles = this.getAllProfiles();
		profiles[name] = {
			name: name,
			seatPosition: { ...config.seatPosition },
			steeringWheel: { ...config.steeringWheel },
			mirrors: { ...config.mirrors },
			lights: { ...config.lights },
			climate: { ...config.climate },
			sunroof: config.sunroof,
			savedAt: new Date().toLocaleString(),
		};
		localStorage.setItem(this.storageKey, JSON.stringify(profiles));
		this.currentProfile = name;
		this.updateProfilesUI();
		return true;
	}

	loadProfile(name) {
		const profiles = this.getAllProfiles();
		const profile = profiles[name];
		if (profile) {
			this.currentProfile = name;
			return profile;
		}
		return null;
	}

	deleteProfile(name) {
		const profiles = this.getAllProfiles();
		delete profiles[name];
		localStorage.setItem(this.storageKey, JSON.stringify(profiles));
		if (this.currentProfile === name) {
			this.currentProfile = null;
		}
		this.updateProfilesUI();
		return true;
	}

	getAllProfiles() {
		const saved = localStorage.getItem(this.storageKey);
		return saved ? JSON.parse(saved) : {};
	}

	getProfileNames() {
		return Object.keys(this.getAllProfiles()).sort();
	}

	profileExists(name) {
		return this.getAllProfiles().hasOwnProperty(name);
	}

	getCurrentProfile() {
		return this.currentProfile;
	}

	updateProfilesUI() {
		const profileSelect = document.getElementById('profileSelect');
		const deleteBtn = document.getElementById('btnDeleteProfile');
		const loadBtn = document.getElementById('btnLoadProfile');

		if (!profileSelect) return;

		const names = this.getProfileNames();
		const currentlySelected = profileSelect.value;

		// Actualizar select
		profileSelect.innerHTML = '<option value="">-- Selecciona un perfil --</option>';
		names.forEach((name) => {
			const option = document.createElement('option');
			option.value = name;
			option.textContent = name;
			profileSelect.appendChild(option);
		});

		profileSelect.value = currentlySelected;

		// Habilitar/deshabilitar botones
		if (deleteBtn) {
			deleteBtn.disabled = !currentlySelected || currentlySelected === '';
		}
		if (loadBtn) {
			loadBtn.disabled = !currentlySelected || currentlySelected === '';
		}

	}
}

// Instancia global del gestor de perfiles
const ownerProfileManager = new OwnerProfilesManager();

// Bandera para evitar guardar durante undo/redo
let isRestoringOwnerState = false;

// ========== ESTADO GLOBAL ==========
let currentOwnerConfig = {
	seatPosition: {
		vertical: 50,
		horizontal: 50,
		backrest: 25,
	},
	steeringWheel: {
		height: 50,
		distance: 50,
	},
	mirrors: {
		left: 50,
		right: 50,
		rearview: 50,
	},
	lights: {
		ambient: 30,
		dashboardBrightness: 70,
	},
	climate: {
		temperature: 22,
		leftSeat: 50,
		rightSeat: 50,
		fanSpeed: 50,
		recirculation: false,
	},
	comfort: {
		lumbarSupport: 50,
		firmness: 50,
	},
	drivingMode: 'Confort',
	ambientTheme: 'Neutro',
	sunroof: false,
};

// ========== FUNCIONES PRINCIPALES ==========

function saveOwnerState() {
	if (isRestoringOwnerState) return;

	const memento = new OwnerConfigurationMemento(
		currentOwnerConfig.seatPosition,
		currentOwnerConfig.steeringWheel,
		currentOwnerConfig.mirrors,
		currentOwnerConfig.lights,
		currentOwnerConfig.climate,
		currentOwnerConfig.sunroof,
		currentOwnerConfig.comfort,
		currentOwnerConfig.drivingMode,
		currentOwnerConfig.ambientTheme
	);
	ownerConfigHistory.saveState(memento);
}

function undoOwnerConfig() {
	const memento = ownerConfigHistory.undo();
	if (memento) {
		isRestoringOwnerState = true;
		restoreOwnerState(memento);
		isRestoringOwnerState = false;
	}
}

function redoOwnerConfig() {
	const memento = ownerConfigHistory.redo();
	if (memento) {
		isRestoringOwnerState = true;
		restoreOwnerState(memento);
		isRestoringOwnerState = false;
	}
}

function restoreOwnerState(memento) {
	currentOwnerConfig.seatPosition = { ...memento.seatPosition };
	currentOwnerConfig.steeringWheel = { ...memento.steeringWheel };
	currentOwnerConfig.mirrors = { ...memento.mirrors };
	currentOwnerConfig.lights = { ...memento.lights };
	currentOwnerConfig.climate = { ...memento.climate };
	currentOwnerConfig.sunroof = memento.sunroof;
	currentOwnerConfig.comfort = { ...memento.comfort };
	currentOwnerConfig.drivingMode = memento.drivingMode;
	currentOwnerConfig.ambientTheme = memento.ambientTheme;

	updateAllControls();
	updatePreview();
}

function updateAllControls() {
	// Asiento
	document.getElementById('seatVertical').value = currentOwnerConfig.seatPosition.vertical;
	document.getElementById('seatHorizontal').value = currentOwnerConfig.seatPosition.horizontal;
	document.getElementById('backrest').value = currentOwnerConfig.seatPosition.backrest;

	// Volante
	document.getElementById('steeringHeight').value = currentOwnerConfig.steeringWheel.height;
	document.getElementById('steeringDistance').value = currentOwnerConfig.steeringWheel.distance;

	// Confort
	document.getElementById('lumbarSupport').value = currentOwnerConfig.comfort.lumbarSupport;
	document.getElementById('seatFirmness').value = currentOwnerConfig.comfort.firmness;

	// Espejos
	document.getElementById('mirrorLeft').value = currentOwnerConfig.mirrors.left;
	document.getElementById('mirrorRight').value = currentOwnerConfig.mirrors.right;
	document.getElementById('rearview').value = currentOwnerConfig.mirrors.rearview;

	// Luces
	document.getElementById('ambientLight').value = currentOwnerConfig.lights.ambient;
	document.getElementById('dashboardBrightness').value = currentOwnerConfig.lights.dashboardBrightness;

	// Clima
	document.getElementById('temperature').value = currentOwnerConfig.climate.temperature;
	document.getElementById('leftSeatHeat').value = currentOwnerConfig.climate.leftSeat;
	document.getElementById('rightSeatHeat').value = currentOwnerConfig.climate.rightSeat;
	document.getElementById('fanSpeed').value = currentOwnerConfig.climate.fanSpeed;
	document.getElementById('recirculation').checked = currentOwnerConfig.climate.recirculation;

	// Modo y ambiente
	document.getElementById('drivingMode').value = currentOwnerConfig.drivingMode;
	document.getElementById('ambientTheme').value = currentOwnerConfig.ambientTheme;

	// Techo solar
	document.getElementById('sunroof').checked = currentOwnerConfig.sunroof;

	updateAllLabels();
}

function updateAllLabels() {
	document.getElementById('seatVerticalLabel').textContent = currentOwnerConfig.seatPosition.vertical + '%';
	document.getElementById('seatHorizontalLabel').textContent = currentOwnerConfig.seatPosition.horizontal + '%';
	document.getElementById('backrestLabel').textContent = currentOwnerConfig.seatPosition.backrest + '°';
	document.getElementById('steeringHeightLabel').textContent = currentOwnerConfig.steeringWheel.height + '%';
	document.getElementById('steeringDistanceLabel').textContent = currentOwnerConfig.steeringWheel.distance + '%';
	document.getElementById('lumbarSupportLabel').textContent = currentOwnerConfig.comfort.lumbarSupport + '%';
	document.getElementById('seatFirmnessLabel').textContent = currentOwnerConfig.comfort.firmness + '%';
	document.getElementById('mirrorLeftLabel').textContent = currentOwnerConfig.mirrors.left + '%';
	document.getElementById('mirrorRightLabel').textContent = currentOwnerConfig.mirrors.right + '%';
	document.getElementById('rearviewLabel').textContent = currentOwnerConfig.mirrors.rearview + '%';
	document.getElementById('ambientLightLabel').textContent = currentOwnerConfig.lights.ambient + '%';
	document.getElementById('dashboardBrightnessLabel').textContent = currentOwnerConfig.lights.dashboardBrightness + '%';
	document.getElementById('temperatureLabel').textContent = currentOwnerConfig.climate.temperature + '°C';
	document.getElementById('leftSeatHeatLabel').textContent = currentOwnerConfig.climate.leftSeat + '%';
	document.getElementById('rightSeatHeatLabel').textContent = currentOwnerConfig.climate.rightSeat + '%';
	document.getElementById('fanSpeedLabel').textContent = currentOwnerConfig.climate.fanSpeed + '%';
	document.getElementById('ambientThemeLabel').textContent = currentOwnerConfig.ambientTheme;
	document.getElementById('drivingModeLabel').textContent = currentOwnerConfig.drivingMode;
}

function handleSeatVertical(value) {
	currentOwnerConfig.seatPosition.vertical = parseInt(value);
	document.getElementById('seatVerticalLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleSeatHorizontal(value) {
	currentOwnerConfig.seatPosition.horizontal = parseInt(value);
	document.getElementById('seatHorizontalLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleBackrest(value) {
	currentOwnerConfig.seatPosition.backrest = parseInt(value);
	document.getElementById('backrestLabel').textContent = value + '°';
	updatePreview();
	saveOwnerState();
}

function handleSteeringHeight(value) {
	currentOwnerConfig.steeringWheel.height = parseInt(value);
	document.getElementById('steeringHeightLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleLumbarSupport(value) {
	currentOwnerConfig.comfort.lumbarSupport = parseInt(value);
	document.getElementById('lumbarSupportLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleSeatFirmness(value) {
	currentOwnerConfig.comfort.firmness = parseInt(value);
	document.getElementById('seatFirmnessLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleSteeringDistance(value) {
	currentOwnerConfig.steeringWheel.distance = parseInt(value);
	document.getElementById('steeringDistanceLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleMirrorLeft(value) {
	currentOwnerConfig.mirrors.left = parseInt(value);
	document.getElementById('mirrorLeftLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleMirrorRight(value) {
	currentOwnerConfig.mirrors.right = parseInt(value);
	document.getElementById('mirrorRightLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleRearview(value) {
	currentOwnerConfig.mirrors.rearview = parseInt(value);
	document.getElementById('rearviewLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleAmbientLight(value) {
	currentOwnerConfig.lights.ambient = parseInt(value);
	document.getElementById('ambientLightLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleDashboardBrightness(value) {
	currentOwnerConfig.lights.dashboardBrightness = parseInt(value);
	document.getElementById('dashboardBrightnessLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleTemperature(value) {
	currentOwnerConfig.climate.temperature = parseInt(value);
	document.getElementById('temperatureLabel').textContent = value + '°C';
	updatePreview();
	saveOwnerState();
}

function handleFanSpeed(value) {
	currentOwnerConfig.climate.fanSpeed = parseInt(value);
	document.getElementById('fanSpeedLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleRecirculation(checked) {
	currentOwnerConfig.climate.recirculation = checked;
	updatePreview();
	saveOwnerState();
}

function handleDrivingMode(value) {
	currentOwnerConfig.drivingMode = value;
	document.getElementById('drivingModeLabel').textContent = value;
	updatePreview();
	saveOwnerState();
}

function handleAmbientTheme(value) {
	currentOwnerConfig.ambientTheme = value;
	document.getElementById('ambientThemeLabel').textContent = value;
	updatePreview();
	saveOwnerState();
}

function handleLeftSeatHeat(value) {
	currentOwnerConfig.climate.leftSeat = parseInt(value);
	document.getElementById('leftSeatHeatLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleRightSeatHeat(value) {
	currentOwnerConfig.climate.rightSeat = parseInt(value);
	document.getElementById('rightSeatHeatLabel').textContent = value + '%';
	updatePreview();
	saveOwnerState();
}

function handleSunroof(checked) {
	currentOwnerConfig.sunroof = checked;
	updatePreview();
	saveOwnerState();
}

function updatePreview() {
	const seatVisual = document.getElementById('seatVisual');
	const steeringVisual = document.getElementById('steeringVisual');
	const previewText = document.getElementById('previewText');

	// Actualizar posición del asiento
	seatVisual.style.transform = `translate(${currentOwnerConfig.seatPosition.horizontal - 50}px, ${currentOwnerConfig.seatPosition.vertical - 50}px) rotateZ(${currentOwnerConfig.seatPosition.backrest - 25}deg)`;

	// Actualizar posición del volante
	steeringVisual.style.top = currentOwnerConfig.steeringWheel.height + '%';
	steeringVisual.style.left = currentOwnerConfig.steeringWheel.distance + '%';

	// Actualizar texto de preview
	let previewHTML = `
		<strong>Configuración Actual:</strong><br>
		🪑 Asiento: ${currentOwnerConfig.seatPosition.vertical}% vertical, ${currentOwnerConfig.seatPosition.horizontal}% horizontal, ${currentOwnerConfig.seatPosition.backrest}° respaldo<br>
		🎡 Volante: ${currentOwnerConfig.steeringWheel.height}% altura, ${currentOwnerConfig.steeringWheel.distance}% distancia<br>
		🪞 Espejos: ${currentOwnerConfig.mirrors.left}% izq, ${currentOwnerConfig.mirrors.right}% der, ${currentOwnerConfig.mirrors.rearview}% retrovisor<br>
		💡 Iluminación: ${currentOwnerConfig.lights.ambient}% ambiente, ${currentOwnerConfig.lights.dashboardBrightness}% tablero<br>
		❄️ Clima: ${currentOwnerConfig.climate.temperature}°C, ${currentOwnerConfig.climate.leftSeat}% izq, ${currentOwnerConfig.climate.rightSeat}% der<br>
		${currentOwnerConfig.sunroof ? '🌞 Techo solar: ABIERTO' : '🌞 Techo solar: CERRADO'}
	`;
	previewText.innerHTML = previewHTML;

	// Cambiar color de fondo basado en temperatura
	const tempColor = getColorByTemperature(currentOwnerConfig.climate.temperature);
	const previewElement = document.getElementById('preview');
	previewElement.style.backgroundColor = tempColor;

	// Cambiar borde según modo de conducción
	previewElement.style.borderColor = getModeColor(currentOwnerConfig.drivingMode);

	// Mostrar ambiente interior adicional
	previewElement.style.boxShadow = currentOwnerConfig.ambientTheme === 'Cálido'
		? '0 0 18px rgba(255, 140, 46, 0.5)'
		: currentOwnerConfig.ambientTheme === 'Frío'
		? '0 0 18px rgba(80, 180, 255, 0.6)'
		: '0 0 15px rgba(170, 170, 170, 0.35)';
}

function getModeColor(mode) {
	switch (mode) {
		case 'Deportivo':
			return '#ff6b6b';
		case 'Económico':
			return '#6bcf6b';
		default:
			return '#607d8b';
	}
}


function getColorByTemperature(temp) {
	if (temp < 16) return '#cce5ff'; // Azul frío
	if (temp < 20) return '#e0f0ff'; // Azul claro
	if (temp < 24) return '#fffbea'; // Neutro cálido
	if (temp < 28) return '#ffe8d8'; // Naranja claro
	return '#ffcccc'; // Rojo
}

document.addEventListener('DOMContentLoaded', function () {
	const nombreStored = localStorage.getItem('nombreUsuario');
	if (nombreStored) {
		document.getElementById('nombreUsuario').textContent = nombreStored;
	}

	ownerProfileManager.updateProfilesUI();

	// Inicializar con el primer estado guardado
	saveOwnerState();

	// Atajos de teclado
	document.addEventListener('keydown', function (event) {
		if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
			event.preventDefault();
			undoOwnerConfig();
		}
		if ((event.ctrlKey || event.metaKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
			event.preventDefault();
			redoOwnerConfig();
		}
	});

	// Actualizar preview inicial
	updatePreview();
});

// ========== SISTEMA DE TOAST NOTIFICATIONS ==========

function ensureToastContainer() {
	let container = document.querySelector('.toast-container');
	if (!container) {
		container = document.createElement('div');
		container.className = 'toast-container';
		document.body.appendChild(container);
	}
	return container;
}

function showToast(message, type = 'success', duration = 3000) {
	const container = ensureToastContainer();
	const icons = {
		success: '✅',
		error: '❌',
		warning: '⚠️',
		info: 'ℹ️',
	};

	const toast = document.createElement('div');
	toast.className = `toast toast--${type}`;
	toast.innerHTML = `
		<span class="toast-icon">${icons[type] || icons.info}</span>
		<span class="toast-message">${message}</span>
	`;
	container.appendChild(toast);

	setTimeout(() => {
		toast.classList.add('toast-exit');
		toast.addEventListener('animationend', () => toast.remove());
	}, duration);
}

// ========== SISTEMA DE MODALES CUSTOM ==========

function showCustomModal({ icon, title, subtitle, bodyHTML, confirmText, cancelText, confirmClass, onConfirm, onCancel }) {
	// Remover modal previo si existe
	const existing = document.getElementById('customModalOverlay');
	if (existing) existing.remove();

	const overlay = document.createElement('div');
	overlay.id = 'customModalOverlay';
	overlay.className = 'custom-modal-overlay';
	overlay.innerHTML = `
		<div class="custom-modal-backdrop"></div>
		<div class="custom-modal-box">
			<div class="custom-modal-header">
				<span class="custom-modal-header-icon">${icon || '💬'}</span>
				<div class="custom-modal-header-text">
					<h3>${title}</h3>
					${subtitle ? `<p>${subtitle}</p>` : ''}
				</div>
			</div>
			${bodyHTML ? `<div class="custom-modal-body">${bodyHTML}</div>` : ''}
			<div class="custom-modal-footer">
				${cancelText !== false ? `<button class="btn-modal-cancel" id="customModalCancel">${cancelText || 'Cancelar'}</button>` : ''}
				<button class="${confirmClass || 'btn-modal-confirm'}" id="customModalConfirm">${confirmText || 'Aceptar'}</button>
			</div>
		</div>
	`;

	document.body.appendChild(overlay);

	// Activar con un pequeño delay para que la animación CSS se vea
	requestAnimationFrame(() => {
		overlay.classList.add('active');
	});

	function closeModal() {
		overlay.classList.remove('active');
		setTimeout(() => overlay.remove(), 350);
	}

	// Eventos
	overlay.querySelector('.custom-modal-backdrop').addEventListener('click', () => {
		closeModal();
		if (onCancel) onCancel();
	});

	const cancelBtn = overlay.querySelector('#customModalCancel');
	if (cancelBtn) {
		cancelBtn.addEventListener('click', () => {
			closeModal();
			if (onCancel) onCancel();
		});
	}

	overlay.querySelector('#customModalConfirm').addEventListener('click', () => {
		if (onConfirm) onConfirm(overlay, closeModal);
		else closeModal();
	});

	// Focus en el input si existe
	const input = overlay.querySelector('input[type="text"]');
	if (input) {
		setTimeout(() => {
			input.focus();
			input.select();
		}, 100);

		// Enter para confirmar
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				overlay.querySelector('#customModalConfirm').click();
			}
		});
	}

	return { overlay, closeModal };
}

// ========== FUNCIONES DE PERFILES ==========

function saveProfile() {
	const defaultName = `Perfil_${new Date().toLocaleTimeString()}`;

	showCustomModal({
		icon: '💾',
		title: 'Guardar perfil',
		subtitle: 'Asigna un nombre para guardar tu configuración actual.',
		bodyHTML: `<input type="text" id="modalProfileNameInput" placeholder="Nombre del perfil" value="${defaultName}" />`,
		confirmText: 'Guardar',
		onConfirm: (overlay, closeModal) => {
			const input = overlay.querySelector('#modalProfileNameInput');
			const name = input.value.trim();

			if (!name) {
				showToast('El nombre del perfil no puede estar vacío', 'warning');
				return;
			}

			// Verificar si ya existe
			if (ownerProfileManager.profileExists(name)) {
				closeModal();
				showCustomModal({
					icon: '⚠️',
					title: '¿Sobrescribir perfil?',
					subtitle: `El perfil "${name}" ya existe. ¿Deseas reemplazarlo?`,
					confirmText: 'Sobrescribir',
					confirmClass: 'btn-modal-danger',
					onConfirm: (_, closeInner) => {
						ownerProfileManager.saveProfile(name, currentOwnerConfig);
						showToast(`Perfil "${name}" guardado correctamente`, 'success');
						closeInner();
					},
				});
				return;
			}

			ownerProfileManager.saveProfile(name, currentOwnerConfig);
			showToast(`Perfil "${name}" guardado correctamente`, 'success');
			closeModal();
		},
	});
}

function loadProfile() {
	const profileName = document.getElementById('profileSelect').value;

	if (!profileName) {
		showToast('Selecciona un perfil primero', 'warning');
		return;
	}

	const profiles = ownerProfileManager.getAllProfiles();
	const profileData = profiles[profileName];
	const savedAt = profileData ? profileData.savedAt : '';

	showCustomModal({
		icon: '📂',
		title: `Cargar perfil`,
		subtitle: `¿Deseas aplicar la configuración del perfil seleccionado?`,
		bodyHTML: `
			<div class="modal-profile-info">
				<strong>${profileName}</strong>
				${savedAt ? `Guardado: ${savedAt}` : ''}
			</div>
		`,
		confirmText: 'Cargar perfil',
		onConfirm: (_, closeModal) => {
			const profile = ownerProfileManager.loadProfile(profileName);

			if (profile) {
				isRestoringOwnerState = true;
				currentOwnerConfig.seatPosition = { ...profile.seatPosition };
				currentOwnerConfig.steeringWheel = { ...profile.steeringWheel };
				currentOwnerConfig.mirrors = { ...profile.mirrors };
				currentOwnerConfig.lights = { ...profile.lights };
				currentOwnerConfig.climate = { ...profile.climate };
				currentOwnerConfig.sunroof = profile.sunroof;

				updateAllControls();
				updatePreview();
				isRestoringOwnerState = false;

				saveOwnerState();
				

				showToast(`Perfil "${profileName}" cargado`, 'success');
			}

			closeModal();
		},
	});
}

function deleteProfile() {
	const profileName = document.getElementById('profileSelect').value;

	if (!profileName) {
		showToast('Selecciona un perfil para eliminar', 'warning');
		return;
	}

	showCustomModal({
		icon: '🗑️',
		title: '¿Eliminar perfil?',
		subtitle: `Se eliminará el perfil "${profileName}". Esta acción no se puede deshacer.`,
		confirmText: 'Eliminar',
		confirmClass: 'btn-modal-danger',
		onConfirm: (_, closeModal) => {
			ownerProfileManager.deleteProfile(profileName);
			showToast(`Perfil "${profileName}" eliminado`, 'success');
			document.getElementById('profileSelect').value = '';
			onProfileSelectChange();
			closeModal();
		},
	});
}

function onProfileSelectChange() {
	const deleteBtn = document.getElementById('btnDeleteProfile');
	const loadBtn = document.getElementById('btnLoadProfile');
	const profileSelect = document.getElementById('profileSelect');

	const hasSelection = profileSelect.value !== '';

	if (deleteBtn) deleteBtn.disabled = !hasSelection;
	if (loadBtn) loadBtn.disabled = !hasSelection;
}

function goToMenu() {
	window.location.href = 'menu.html';
}
