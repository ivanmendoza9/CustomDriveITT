let nombreUsuario = '';
let extrasSeleccionados = new Set();
let currentCar = null;

//aaaaa

// Precios base por marca y modelo
const precios = {
	toyota: { base: 20000, sport: 25000, luxury: 35000 },
	bmw: { base: 35000, sport: 45000, luxury: 60000 },
	audi: { base: 40000, sport: 50000, luxury: 70000 },
	mercedes: { base: 45000, sport: 55000, luxury: 75000 },
	ford: { base: 22000, sport: 30000, luxury: 40000 },
	tesla: { base: 50000, sport: 65000, luxury: 80000 },
};

// Extras
const preciosExtras = {
	gps: 1500,
	sonido: 2000,
	piel: 2500,
	turbo: 4000,
	neon: 1200,
	blindaje: 10000,
	camara: 1800,
	piloto: 5000,
};

const nombresExtras = {
	gps: 'GPS',
	sonido: 'Sistema de sonido premium',
	piel: 'Asientos de piel',
	turbo: 'Turbo deportivo',
	neon: 'Luces neón',
	blindaje: 'Blindaje nivel 3',
	camara: 'Cámara 360°',
	piloto: 'Piloto automático',
};

// Imágenes
const imagenes = {
	toyota: {
		base: './imagenes/Toyota.png',
		sport: './imagenes/Toyota_Sport.png',
		luxury: './imagenes/Toyota_Luxury.png',
	},
	bmw: { base: './imagenes/BMW.png', sport: './imagenes/BMW_Sport.png', luxury: './imagenes/BMW_Luxury.png' },
	audi: { base: './imagenes/Audi.png', sport: './imagenes/Audi_Sport.png', luxury: './imagenes/Audi_Luxury.png' },
	mercedes: {
		base: './imagenes/Mercedes.png',
		sport: './imagenes/Mercedes_Sport.png',
		luxury: './imagenes/Mercedes_Luxury.png',
	},
	ford: { base: './imagenes/Ford.png', sport: './imagenes/Ford_Sport.png', luxury: './imagenes/Ford_Luxury.png' },
	tesla: { base: './imagenes/Tesla.png', sport: './imagenes/Tesla_Sport.png', luxury: './imagenes/Tesla_Luxury.png' },
};

// Clases para el patrón Decorator
class Car {
	constructor(price, description) {
		this.price = price;
		this.description = description;
	}

	getPrice() {
		return this.price;
	}

	getDescription() {
		return this.description;
	}
}

class CarDecorator {
	constructor(car) {
		this.car = car;
	}

	getPrice() {
		return this.car.getPrice();
	}

	getDescription() {
		return this.car.getDescription();
	}
}

class ExtraDecorator extends CarDecorator {
	constructor(car, extraType) {
		super(car);
		this.extraType = extraType;
	}

	getPrice() {
		return super.getPrice() + preciosExtras[this.extraType];
	}

	getDescription() {
		return super.getDescription() + ` | ${nombresExtras[this.extraType]}`;
	}
}

// Patrón Bridge para entrega
class Agency {
	constructor(name, address) {
		this.name = name;
		this.address = address;
	}

	getDetails() {
		return `${this.name} - ${this.address}`;
	}
}

const agenciasData = {
	toyota: { name: 'Agencia Toyota Centro', address: 'Calle Principal 123, Ciudad de México' },
	bmw: { name: 'Agencia BMW Premium', address: 'Avenida Reforma 456, Ciudad de México' },
	audi: { name: 'Agencia Audi Elite', address: 'Boulevard Insurgentes 789, Ciudad de México' },
	mercedes: { name: 'Agencia Mercedes Benz', address: 'Paseo de la Reforma 101, Ciudad de México' },
	ford: { name: 'Agencia Ford Motors', address: 'Calle Juárez 202, Ciudad de México' },
	tesla: { name: 'Agencia Tesla Future', address: 'Avenida Tecnológico 303, Ciudad de México' },
};

class Delivery {
	constructor(agency) {
		this.agency = agency;
	}

	deliver(car) {
		throw new Error('Método deliver debe ser implementado');
	}
}

class CarDelivery extends Delivery {
	deliver(car) {
		showToast(`🚚 Auto entregado en ${this.agency.name} — $${car.getPrice().toLocaleString()} USD`, 'success', 4500);
	}
}

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

// Inicio
document.addEventListener('DOMContentLoaded', function () {
	const btnIniciar = document.getElementById('btnIniciar');
	const bienvenida = document.getElementById('bienvenida');
	const app = document.getElementById('app');
	const nombreInput = document.getElementById('nombre');

	// Si ya hay un nombre guardado (viene del menú), mostrar el configurador directamente
	const nombreGuardado = localStorage.getItem('nombreUsuario');
	if (nombreGuardado) {
		nombreUsuario = nombreGuardado;
		if (bienvenida) bienvenida.style.display = 'none';
		if (app) {
			app.style.display = 'block';
			document.getElementById('saludo').textContent = `Hola ${nombreUsuario}, configura tu auto ideal`;
			actualizar();
			updateConfigSelectUI();
		}
		return;
	}

	// Primera visita: mostrar formulario de bienvenida
	btnIniciar.addEventListener('click', function () {
		if (nombreInput.value.trim() === '') {
			showToast('Por favor ingresa tu nombre', 'warning');
			return;
		}

		nombreUsuario = nombreInput.value.trim();
		localStorage.setItem('nombreUsuario', nombreUsuario);
		window.location.href = 'menu.html';
	});
});

// FUNCIÓN PRINCIPAL
function actualizar() {
	const marca = document.getElementById('marca').value;
	const modelo = document.getElementById('modelo').value;
	const rines = document.getElementById('rines').value;
	const color = document.getElementById('color').value;
	const motor = document.getElementById('motor').value;

	let precioBase = precios[marca][modelo];
	let precioRines = parseInt(rines);
	let precioMotor = parseInt(motor);
	let basePrice = precioBase + precioRines + precioMotor;

	const nombreModelo = {
		base: 'Base',
		sport: 'Sport',
		luxury: 'Luxury',
	};

	let baseDesc = `🚗 ${marca.toUpperCase()} ${nombreModelo[modelo]} | 🛞 Rines: ${obtenerNombreRines(rines)} | ⚙️ Motor: ${obtenerNombreMotor(motor)}`;

	let car = new Car(basePrice, baseDesc);

	// Aplicar decoradores para extras
	extrasSeleccionados.forEach((extra) => {
		car = new ExtraDecorator(car, extra);
	});

	currentCar = car;
	// Precio
	document.getElementById('precio').textContent = `$${car.getPrice().toLocaleString()} USD`;

	// Imagen
	const imagenElement = document.getElementById('carro');
	if (imagenes[marca] && imagenes[marca][modelo]) {
		imagenElement.src = imagenes[marca][modelo];
	}

	// Color visual
	imagenElement.style.backgroundColor = color;

	// Descripción
	document.getElementById('descripcion').textContent = car.getDescription();

	// Botón de entrega usando patrón Bridge
	let btnEntregar = document.getElementById('btnEntregar');
	if (!btnEntregar) {
		btnEntregar = document.createElement('button');
		btnEntregar.id = 'btnEntregar';
		btnEntregar.className = 'btn-entregar';
		btnEntregar.textContent = 'Entregar Auto';
		document.getElementById('app').appendChild(btnEntregar);
	}
	btnEntregar.onclick = () => {
		const modal = document.getElementById('modal');
		document.getElementById('modal-precio').textContent = '$' + car.getPrice().toLocaleString() + ' USD';
		document.getElementById('modal-descripcion').textContent = car.getDescription();
		modal.style.display = 'flex';
	};
}

// Funciones auxiliares
function obtenerNombreRines(valor) {
	switch (valor) {
		case '1000':
			return 'Estándar';
		case '3000':
			return 'Deportivos';
		case '5000':
			return 'Premium';
		default:
			return 'Estándar';
	}
}

function obtenerNombreMotor(valor) {
	switch (valor) {
		case '3000':
			return 'Híbrido';
		case '8000':
			return 'Eléctrico';
		default:
			return 'Gasolina';
	}
}

function toggleExtra(button) {
	const extra = button.getAttribute('data-extra');

	if (extrasSeleccionados.has(extra)) {
		extrasSeleccionados.delete(extra);
		button.classList.remove('activo');
	} else {
		extrasSeleccionados.add(extra);
		button.classList.add('activo');
	}

	actualizar();
}

function toggleExtras() {
	const cont = document.getElementById('extrasContainer');
	const btn = document.getElementById('toggleExtrasBtn');
	if (cont.classList.contains('collapsed')) {
		cont.classList.remove('collapsed');
		btn.textContent = 'Ocultar extras';
	} else {
		cont.classList.add('collapsed');
		btn.textContent = 'Mostrar extras';
	}
}

function cerrarModal() {
	document.getElementById('modal').style.display = 'none';
}

function confirmarEntrega() {
	const selected = document.getElementById('agencia-select').value;
	const data = agenciasData[selected];
	const agency = new Agency(data.name, data.address);

	// Abre rápido la ventana de seguimiento antes que alertas o acciones bloqueantes
	window.open('delivery-status.html', '_blank');

	const msg = document.createElement('div');
	msg.className = 'delivery-alert';
	msg.textContent = '✅ Enviado: Ya puedes seguir la entrega.';
	document.body.appendChild(msg);

	cerrarModal();

	// Guardar y usar el auto en el proceso de entrega (que no depende del alert para abrir la ventana)
	const delivery = new CarDelivery(agency);
	if (currentCar) {
		delivery.deliver(currentCar);
	}

	setTimeout(() => {
		msg.remove();
	}, 2800);
}

// ========== GUARDAR / CARGAR CONFIGURACIONES DE AUTO ==========

const CAR_CONFIGS_KEY = 'carConfigurations';

function getCarConfigs() {
	const saved = localStorage.getItem(CAR_CONFIGS_KEY);
	return saved ? JSON.parse(saved) : {};
}

function saveCarConfigs(configs) {
	localStorage.setItem(CAR_CONFIGS_KEY, JSON.stringify(configs));
}

function updateConfigSelectUI() {
	const select = document.getElementById('configSelect');
	const btnCargar = document.getElementById('btnCargarConfig');
	const btnEliminar = document.getElementById('btnEliminarConfig');
	if (!select) return;

	const configs = getCarConfigs();
	const names = Object.keys(configs).sort();
	const currentVal = select.value;

	select.innerHTML = '<option value="">-- Selecciona una configuración --</option>';
	names.forEach((name) => {
		const opt = document.createElement('option');
		opt.value = name;
		opt.textContent = name;
		select.appendChild(opt);
	});

	// Restaurar selección si sigue existiendo
	if (names.includes(currentVal)) select.value = currentVal;

	const hasSelection = select.value !== '';
	if (btnCargar) btnCargar.disabled = !hasSelection;
	if (btnEliminar) btnEliminar.disabled = !hasSelection;
}

function onConfigSelectChange() {
	const select = document.getElementById('configSelect');
	const btnCargar = document.getElementById('btnCargarConfig');
	const btnEliminar = document.getElementById('btnEliminarConfig');
	const hasSelection = select && select.value !== '';
	if (btnCargar) btnCargar.disabled = !hasSelection;
	if (btnEliminar) btnEliminar.disabled = !hasSelection;
}

function getCurrentAutoConfig() {
	return {
		marca: document.getElementById('marca').value,
		modelo: document.getElementById('modelo').value,
		color: document.getElementById('color').value,
		rines: document.getElementById('rines').value,
		motor: document.getElementById('motor').value,
		extras: Array.from(extrasSeleccionados),
		savedAt: new Date().toLocaleString(),
	};
}

function applyAutoConfig(config) {
	document.getElementById('marca').value = config.marca;
	document.getElementById('modelo').value = config.modelo;
	document.getElementById('color').value = config.color;
	document.getElementById('rines').value = config.rines;
	document.getElementById('motor').value = config.motor;

	// Restaurar extras
	extrasSeleccionados.clear();
	document.querySelectorAll('[data-extra]').forEach((btn) => btn.classList.remove('activo'));
	if (config.extras) {
		config.extras.forEach((extra) => {
			extrasSeleccionados.add(extra);
			const btn = document.querySelector(`[data-extra="${extra}"]`);
			if (btn) btn.classList.add('activo');
		});
	}

	actualizar();
}

function guardarConfigAuto() {
	const defaultName = `Config_${new Date().toLocaleTimeString()}`;

	showCustomModal({
		icon: '💾',
		title: 'Guardar configuración',
		subtitle: 'Asigna un nombre para guardar la configuración actual del auto.',
		bodyHTML: `<input type="text" id="modalConfigNameInput" placeholder="Nombre de la configuración" value="${defaultName}" />`,
		confirmText: 'Guardar',
		onConfirm: (overlay, closeModal) => {
			const input = overlay.querySelector('#modalConfigNameInput');
			const name = input.value.trim();

			if (!name) {
				showToast('El nombre no puede estar vacío', 'warning');
				return;
			}

			const configs = getCarConfigs();

			if (configs[name]) {
				closeModal();
				showCustomModal({
					icon: '⚠️',
					title: '¿Sobrescribir configuración?',
					subtitle: `La configuración "${name}" ya existe. ¿Deseas reemplazarla?`,
					confirmText: 'Sobrescribir',
					confirmClass: 'btn-modal-danger',
					onConfirm: (_, closeInner) => {
						configs[name] = getCurrentAutoConfig();
						saveCarConfigs(configs);
						updateConfigSelectUI();
						showToast(`Configuración "${name}" guardada`, 'success');
						closeInner();
					},
				});
				return;
			}

			configs[name] = getCurrentAutoConfig();
			saveCarConfigs(configs);
			updateConfigSelectUI();
			showToast(`Configuración "${name}" guardada`, 'success');
			closeModal();
		},
	});
}

function cargarConfigAuto() {
	const select = document.getElementById('configSelect');
	const name = select ? select.value : '';

	if (!name) {
		showToast('Selecciona una configuración primero', 'warning');
		return;
	}

	const configs = getCarConfigs();
	const config = configs[name];

	showCustomModal({
		icon: '📂',
		title: 'Cargar configuración',
		subtitle: '¿Deseas aplicar esta configuración al configurador?',
		bodyHTML: `
			<div class="modal-profile-info">
				<strong>${name}</strong>
				${config && config.savedAt ? `Guardado: ${config.savedAt}` : ''}
			</div>
		`,
		confirmText: 'Cargar',
		onConfirm: (_, closeModal) => {
			if (config) {
				applyAutoConfig(config);
				const badge = document.getElementById('configBadge');
				if (badge) {
					badge.textContent = `📌 ${name}`;
					badge.style.display = 'inline-block';
				}
				showToast(`Configuración "${name}" cargada`, 'success');
			}
			closeModal();
		},
	});
}

function eliminarConfigAuto() {
	const select = document.getElementById('configSelect');
	const name = select ? select.value : '';

	if (!name) {
		showToast('Selecciona una configuración para eliminar', 'warning');
		return;
	}

	showCustomModal({
		icon: '🗑️',
		title: '¿Eliminar configuración?',
		subtitle: `Se eliminará "${name}". Esta acción no se puede deshacer.`,
		confirmText: 'Eliminar',
		confirmClass: 'btn-modal-danger',
		onConfirm: (_, closeModal) => {
			const configs = getCarConfigs();
			delete configs[name];
			saveCarConfigs(configs);
			updateConfigSelectUI();
			const badge = document.getElementById('configBadge');
			if (badge) badge.style.display = 'none';
			showToast(`Configuración "${name}" eliminada`, 'success');
			closeModal();
		},
	});
}

// ========== SISTEMA DE MODALES CUSTOM (index.html) ==========

function showCustomModal({
	icon,
	title,
	subtitle,
	bodyHTML,
	confirmText,
	cancelText,
	confirmClass,
	onConfirm,
	onCancel,
}) {
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
	requestAnimationFrame(() => overlay.classList.add('active'));

	function closeModal() {
		overlay.classList.remove('active');
		setTimeout(() => overlay.remove(), 350);
	}

	overlay.querySelector('.custom-modal-backdrop').addEventListener('click', () => {
		closeModal();
		if (onCancel) onCancel();
	});

	const cancelBtn = overlay.querySelector('#customModalCancel');
	if (cancelBtn)
		cancelBtn.addEventListener('click', () => {
			closeModal();
			if (onCancel) onCancel();
		});

	overlay.querySelector('#customModalConfirm').addEventListener('click', () => {
		if (onConfirm) onConfirm(overlay, closeModal);
		else closeModal();
	});

	const input = overlay.querySelector('input[type="text"]');
	if (input) {
		setTimeout(() => {
			input.focus();
			input.select();
		}, 100);
		input.addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				overlay.querySelector('#customModalConfirm').click();
			}
		});
	}

	return { overlay, closeModal };
}
