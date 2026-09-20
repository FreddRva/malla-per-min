# Guía de Instalación y Configuración

Este documento detalla los pasos necesarios para configurar tanto el hardware (ESP32) como el software (Aplicación Web Angular) del **Panel de Control HMI - Malla de Perforación Minera**.

---

## 1. Configuración del ESP32 (Arduino IDE)

### 1.1 Instalar la tarjeta ESP32 en Arduino IDE

1. Abre **Arduino IDE**.
2. Ve a **Archivo** > **Preferencias**.
3. En el campo "Gestor de URLs Adicionales de Tarjetas", pega el siguiente enlace:
   `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
4. Haz clic en **Aceptar**.
5. Ve a **Herramientas** > **Placa** > **Gestor de tarjetas...**
6. Busca `esp32` e instala la opción oficial de **Espressif Systems**.

### 1.2 Cargar el código al ESP32

1. Conecta tu ESP32 al puerto USB de la computadora.
2. Ve a **Herramientas** > **Placa** > **ESP32 Arduino** y selecciona **ESP32 Dev Module** (o la placa exacta que estés usando).
3. Selecciona el puerto COM correcto en **Herramientas** > **Puerto**.
4. Abre el archivo `codigoarduinoide` en Arduino IDE.
5. **¡Importante!** Modifica las credenciales de tu red WiFi en las primeras líneas del código:
   ```cpp
   const char* WIFI_SSID = "Tu_Nombre_De_WiFi"; // Tu nombre de red WiFi
   const char* WIFI_PASSWORD = "Tu_Contraseña"; // Tu contraseña
   ```
6. Haz clic en el botón de **Subir** (flecha hacia la derecha).
   _Nota: Las librerías `<WiFi.h>` y `<WebServer.h>` ya vienen incluidas por defecto con el paquete del ESP32 que acabas de instalar, por lo que no necesitas descargar librerías externas._

### 1.3 Obtener la IP del ESP32

1. Una vez que el código termine de subir, abre el **Monitor Serie** (icono de lupa en la esquina superior derecha de Arduino IDE).
2. Configura la velocidad del Monitor Serie a **115200 baudios** (en el menú desplegable de abajo a la derecha de la ventana del monitor).
3. Presiona el botón físico "EN" (Reset) en la plaquita del ESP32.
4. En el Monitor Serie verás cómo se conecta a tu WiFi y, finalmente, mostrará:
   `IP del ESP32: 192.168.X.X`
5. **Guarda ese número de IP**, lo necesitarás para la aplicación web.

---

## 2. Configuración de la Aplicación Web (Angular)

### 2.1 Requisitos Previos

- Necesitas tener instalado [Node.js](https://nodejs.org/) (incluye `npm`).
- Tener instalado Git.

### 2.2 Clonación e Instalación

1. Abre una terminal (Símbolo del sistema, PowerShell o Git Bash).
2. Clona el repositorio desde GitHub:
   ```bash
   git clone https://github.com/FreddRva/malla-per-min.git
   ```
3. Entra a la carpeta del proyecto frontend:
   ```bash
   cd malla-per-min/luces
   ```
4. Instala todas las dependencias necesarias:
   ```bash
   npm install
   ```

### 2.3 Ejecutar el proyecto

1. Para levantar el servidor local de desarrollo, ejecuta:
   ```bash
   ng serve
   ```
2. La aplicación se abrirá automáticamente en tu navegador (por lo general en `http://localhost:4200`).
3. En la interfaz web (esquina inferior derecha), ingresa la **Dirección IP del ESP32** que obtuviste en el paso 1.3.
