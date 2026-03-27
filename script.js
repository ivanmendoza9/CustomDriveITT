<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configurador Automotriz</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="bienvenida">
    <div class="welcome-card">
      <div class="welcome-copy">
        <span class="kicker">Configurador automotriz</span>
        <h1>Diseña tu vehículo con una interfaz clara y profesional</h1>
        <p>
          Personaliza marca, versión, motor, rines y equipamiento extra en una experiencia
          visual más limpia, moderna y fácil de presentar.
        </p>

      </div>

      <div class="welcome-form">
        <div class="form-badge">Inicio</div>
        <h2>Bienvenido</h2>
        <p>Ingresa tu nombre para comenzar.</p>
        <input type="text" id="nombre" placeholder="Escribe tu nombre" autocomplete="off">
        <button id="btnIniciar">Entrar al configurador</button>
      </div>
    </div>
  </div>

  <div id="app">
    <header class="topbar">
      <div>
        <span class="kicker">Panel de configuración</span>
        <h1 id="saludo"></h1>
        <p class="topbar-text">Selecciona las opciones y visualiza el resultado en tiempo real.</p>
      </div>
      <div class="topbar-badge">Demo de producto</div>
    </header>

    <main class="layout">
      <section class="panel config-panel">
        <div class="panel-head">
          <div>
            <span class="section-label">Opciones</span>
            <h2>Personalización</h2>
          </div>
        </div>

        <div class="form-grid">
          <div class="field field-full">
            <label for="marca">Marca</label>
            <select id="marca" onchange="actualizar()">
              <option value="toyota">Toyota</option>
              <option value="bmw">BMW</option>
              <option value="audi">Audi</option>
              <option value="mercedes">Mercedes</option>
              <option value="ford">Ford</option>
              <option value="tesla">Tesla</option>
            </select>
          </div>

          <div class="field">
            <label for="modelo">Modelo</label>
            <select id="modelo" onchange="actualizar()">
              <option value="base">Base - Confort y eficiencia</option>
              <option value="sport">Sport - Potencia y deportividad</option>
              <option value="luxury">Luxury - Lujo y tecnología</option>
            </select>
          </div>

          <div class="field">
            <label for="color">Color</label>
            <div class="color-box">
              <input type="color" id="color" value="#c0392b" onchange="actualizar()">
              <span>Color exterior</span>
            </div>
          </div>

          <div class="field">
            <label for="rines">Rines</label>
            <select id="rines" onchange="actualizar()">
              <option value="1000">Estándar (+$1,000)</option>
              <option value="3000">Deportivos (+$3,000)</option>
              <option value="5000">Premium (+$5,000)</option>
            </select>
          </div>

          <div class="field">
            <label for="motor">Tipo de motor</label>
            <select id="motor" onchange="actualizar()">
              <option value="0">Gasolina (Incluido)</option>
              <option value="3000">Híbrido (+$3,000)</option>
              <option value="8000">Eléctrico (+$8,000)</option>
            </select>
          </div>

          <div class="field field-full">
            <label for="toggleExtrasBtn">Extras</label>
            <button id="toggleExtrasBtn" class="btn-small" type="button" onclick="toggleExtras()">Mostrar extras</button>
            <div id="extrasContainer" class="extras collapsed">
              <button data-extra="gps" onclick="toggleExtra(this)">GPS <span>+$1,500</span></button>
              <button data-extra="sonido" onclick="toggleExtra(this)">Sonido premium <span>+$2,000</span></button>
              <button data-extra="piel" onclick="toggleExtra(this)">Asientos de piel <span>+$2,500</span></button>
              <button data-extra="turbo" onclick="toggleExtra(this)">Turbo <span>+$4,000</span></button>
              <button data-extra="neon" onclick="toggleExtra(this)">Luces neón <span>+$1,200</span></button>
              <button data-extra="blindaje" onclick="toggleExtra(this)">Blindaje <span>+$10,000</span></button>
              <button data-extra="camara" onclick="toggleExtra(this)">Cámara 360 <span>+$1,800</span></button>
              <button data-extra="piloto" onclick="toggleExtra(this)">Piloto automático <span>+$5,000</span></button>
            </div>
          </div>
        </div>

        <div class="info-adicional"></div>
      </section>

      <section class="panel preview-panel">
        <div class="panel-head">
          <div>
            <span class="section-label">Vista previa</span>
            <h2>Resumen del vehículo</h2>
          </div>
        </div>

        <div class="vehicle-card">
          <div class="vehicle-stage">
            <div class="vehicle-stage-top">
              <span class="mini-label">Visualización</span>
            </div>
            <img id="carro" src="Audi.png" alt="Auto configurado">
          </div>

          <div class="price-box">
            <div>
              <span class="muted">Precio estimado</span>
              <h2 id="precio">$20,000 USD</h2>
            </div>
            <span class="price-tag">Total</span>
          </div>

          <div class="description-box">
            <p id="descripcion">Selecciona las opciones para ver los detalles.</p>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- Modal para entrega -->
  <div id="modal" class="modal">
    <div class="modal-backdrop" onclick="cerrarModal()"></div>
    <div class="modal-content">
      <div class="modal-header">
        <span class="section-label">Entrega</span>
        <h2>Confirmación de entrega</h2>
        <button class="modal-close" onclick="cerrarModal()">&times;</button>
      </div>
      <div class="modal-body">
        <div class="delivery-info">
          <div class="info-item">
            <strong>Precio total:</strong>
            <span id="modal-precio"></span>
          </div>
          <div class="info-item">
            <strong>Descripción del vehículo:</strong>
            <p id="modal-descripcion"></p>
          </div>
          <div class="info-item">
            <strong>Selecciona agencia:</strong>
            <select id="agencia-select">
              <option value="toyota">Agencia Toyota Centro - Calle Principal 123, Ciudad de México</option>
              <option value="bmw">Agencia BMW Premium - Avenida Reforma 456, Ciudad de México</option>
              <option value="audi">Agencia Audi Elite - Boulevard Insurgentes 789, Ciudad de México</option>
              <option value="mercedes">Agencia Mercedes Benz - Paseo de la Reforma 101, Ciudad de México</option>
              <option value="ford">Agencia Ford Motors - Calle Juárez 202, Ciudad de México</option>
              <option value="tesla">Agencia Tesla Future - Avenida Tecnológico 303, Ciudad de México</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button id="btnConfirmar" class="btn-primary" onclick="confirmarEntrega()">Confirmar entrega</button>
        <button id="btnCancelar" onclick="cerrarModal()">Cancelar</button>
      </div>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
