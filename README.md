# Portafolio de Saaqkk

Landing page inmersiva con animaciones suaves y conexión en tiempo real al perfil de Discord de **Saaqkk** usando la API de Lanyard.

## Contenido

- `index.html`: estructura principal con héroe animado, métricas interactivas, stack estilo Astro, laboratorio, galería, newsletter, colaboraciones, setup y FAQ con acordeones.
- `styles.css`: tema negro/rojo/rosa con glassmorphism, ticker animado, tarjetas del laboratorio y componentes gradientes.
- `script.js`: animaciones de entrada, contadores, barras de progreso, fondo de partículas, acordeones del FAQ y cliente WebSocket para el estado en tiempo real.

## Uso

Abre `index.html` en tu navegador preferido o sirve la carpeta con tu servidor estático favorito.

### Personalización rápida

- Actualiza las cifras de telemetría cambiando los valores `data-target` en `.metric__value`.
- Modifica los porcentajes de las barras editando `data-progress` en cada `.progress-card`.
- Para mostrar otro usuario de Discord, reemplaza el valor de `DISCORD_USER_ID` en `script.js` por el ID del usuario deseado.
