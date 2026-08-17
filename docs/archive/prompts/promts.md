Quiero que desarrolles una \*\*plataforma web completa para un colegio\*\*, moderna, interactiva, accesible y visualmente atractiva.



\## TECNOLOGÍAS



El proyecto debe realizarse principalmente con:



\* HTML5

\* CSS3

\* JavaScript

\* Sin frameworks como React, Angular o Vue.

\* El código debe estar organizado como mínimo en:



&#x20; \* `index.html`

&#x20; \* `styles.css`

&#x20; \* `app.js`



Si el proyecto requiere diferentes vistas, se pueden crear varios archivos HTML y JavaScript.



La interfaz debe ser \*\*responsive\*\*, funcionando correctamente en computadora, tablet y teléfono.



Quiero una apariencia moderna similar a un sistema educativo profesional, utilizando tarjetas, dashboard, sidebar, iconos, gráficos, animaciones suaves y una navegación sencilla.



\---



\# 1. LOGIN MODERNO



Crear una pantalla de inicio de sesión con:



\* Correo o identificación.

\* Contraseña.

\* Mostrar/ocultar contraseña.

\* Recuperar contraseña.

\* Recordar usuario.

\* Botón de iniciar sesión.

\* Animaciones al escribir.

\* Animación al iniciar sesión correctamente.

\* Transición entre Login y Dashboard.

\* Mensajes visuales de error.

\* Loader durante el inicio de sesión.



Agregar diferentes tipos de usuario:



\* Estudiante

\* Profesor

\* Administrador

\* Personal administrativo



\---



\# 2. DASHBOARD



Después de iniciar sesión mostrar un dashboard con:



\* Bienvenida personalizada.

\* Foto/avatar.

\* Nombre del estudiante.

\* Nivel o grado.

\* Horario del día.

\* Próximas actividades.

\* Avisos importantes.

\* Notificaciones.

\* Logros.

\* Estado del transporte.

\* Acceso rápido a las principales funciones.



La entrada al perfil debe tener una \*\*animación moderna y fluida\*\*.



\---



\# 3. PERFILES



Cada estudiante puede tener un perfil con:



\* Avatar.

\* Nombre.

\* Grado.

\* Sección.

\* Intereses.

\* Logros obtenidos.

\* Actividades.

\* Clubes.

\* Información académica permitida.



Cuando se visualice el perfil de otro estudiante debe existir una pequeña animación de apertura.



Agregar buscador de estudiantes.



No mostrar información privada o sensible públicamente.



\---



\# 4. AVATARES



Crear un sistema donde el estudiante pueda:



\* Elegir avatar.

\* Cambiar cabello.

\* Cambiar ropa.

\* Cambiar accesorios.

\* Cambiar fondo.

\* Guardar avatar.



Si no se pueden crear avatares complejos, implementar inicialmente diferentes avatares predefinidos seleccionables.



\---



\# 5. ASISTENTE DE INTELIGENCIA ARTIFICIAL



Agregar un asistente virtual dentro de la plataforma.



Debe aparecer como un botón flotante.



Al abrirlo mostrar un chat donde el estudiante pueda preguntar cosas como:



\* ¿Cuál es mi próxima clase?

\* ¿A qué hora sale mi bus?

\* ¿Qué actividades hay mañana?

\* ¿Qué vende la soda?

\* ¿Cuáles son los avisos importantes?

\* ¿Dónde queda la biblioteca?

\* ¿Qué tareas tengo pendientes?



Preparar el código para poder conectar posteriormente una API real de inteligencia artificial.



Separar la lógica del asistente de la interfaz para facilitar la integración de una API.



Si todavía no existe una API configurada, crear respuestas inteligentes de demostración utilizando JavaScript y los datos del sistema.



\---



\# 6. ACCESIBILIDAD PARA PERSONAS CIEGAS



La página debe ser altamente accesible.



Implementar:



\* HTML semántico.

\* Compatibilidad con lectores de pantalla.

\* Etiquetas ARIA cuando sean necesarias.

\* Texto alternativo en imágenes.

\* Navegación completamente mediante teclado.

\* Indicador visible del elemento seleccionado con TAB.

\* Botón para aumentar texto.

\* Botón para disminuir texto.

\* Alto contraste.

\* Lectura de contenidos importantes mediante Speech Synthesis cuando el navegador lo permita.

\* Botón "Leer página".

\* Botón "Detener lectura".

\* Skip navigation.

\* Formularios correctamente etiquetados.



Tomar como referencia buenas prácticas de accesibilidad WCAG.



\---



\# 7. MODO SEGURO PARA PERSONAS CON EPILEPSIA O SENSIBILIDAD AL MOVIMIENTO



Agregar en accesibilidad un botón:



\*\*Reducir animaciones\*\*



Cuando esté activo:



\* Desactivar animaciones fuertes.

\* Desactivar parpadeos.

\* Eliminar flashes.

\* Eliminar transiciones rápidas.

\* Reducir movimientos.

\* Evitar elementos que cambien de color rápidamente.



También respetar:



`prefers-reduced-motion`



del navegador.



No utilizar contenido que parpadee repetidamente.



\---



\# 8. ESTADÍSTICAS



Crear una sección de estadísticas para administradores.



Agregar gráficos de:



\### Nuevos registros



Mostrar cuántos estudiantes se registraron:



\* Hoy.

\* Esta semana.

\* Este mes.

\* Este año.



\### Abandono



Mostrar estudiantes que dejaron la institución por:



\* Mes.

\* Año.

\* Nivel educativo.



Agregar filtros.



Los gráficos deben tener:



\* Tooltips.

\* Leyendas.

\* Animación opcional.

\* Datos de demostración.



Se puede utilizar Chart.js mediante CDN si es necesario.



\---



\# 9. LÍNEA DE TIEMPO



Crear una línea de tiempo interactiva donde aparezcan:



\* Exámenes.

\* Vacaciones.

\* Ferias.

\* Actividades.

\* Eventos deportivos.

\* Entregas.

\* Reuniones.

\* Días especiales.

\* Simulacros.

\* Matrículas.



Permitir filtrar por:



\* Hoy.

\* Semana.

\* Mes.

\* Año.



Los eventos próximos deben destacar visualmente.



\---



\# 10. SISTEMA DE LOGROS



Crear logros para motivar a los estudiantes.



Ejemplos:



\* Primera semana completada.

\* Asistencia perfecta.

\* Participación deportiva.

\* Participación cultural.

\* Buen rendimiento.

\* Participación en actividades.

\* Ayudar a la comunidad.

\* Completar actividades escolares.



Mostrar:



\* Logros desbloqueados.

\* Logros bloqueados.

\* Progreso.

\* Insignias.

\* Porcentaje completado.



Agregar una pequeña animación cuando se desbloquee un logro, excepto cuando esté activo el modo de reducción de movimiento.



\---



\# 11. FORO DEL COLEGIO



Crear un foro donde los usuarios puedan:



\* Crear publicaciones.

\* Comentar.

\* Responder.

\* Dar reacciones.

\* Reportar contenido.

\* Buscar publicaciones.



Crear categorías:



\* General.

\* Académico.

\* Deportes.

\* Tecnología.

\* Actividades.

\* Clubes.

\* Ayuda.



Los administradores deben poder moderar publicaciones.



\---



\# 12. SISTEMA DE INCIDENCIAS



Crear una sección donde estudiantes puedan reportar problemas.



Por ejemplo:



\* Problema tecnológico.

\* Infraestructura.

\* Bullying.

\* Transporte.

\* Aula.

\* Limpieza.

\* Seguridad.

\* Otro.



El formulario debe solicitar:



\* Tipo.

\* Descripción.

\* Lugar.

\* Fecha.

\* Prioridad.

\* Archivo o evidencia opcional.



Cada incidencia debe tener estados:



\* Recibida.

\* En revisión.

\* En proceso.

\* Resuelta.

\* Cerrada.



El usuario debe poder revisar el progreso de su incidencia.



\---



\# 13. CENTRO DIGITAL DE AVISOS



Crear un centro de comunicaciones del colegio.



Los administradores pueden publicar:



\* Avisos.

\* Noticias.

\* Suspensión de clases.

\* Cambios de horario.

\* Actividades.

\* Comunicados.

\* Alertas.



Clasificarlos por:



\* Normal.

\* Importante.

\* Urgente.



Los avisos urgentes deben aparecer destacados en el dashboard.



\---



\# 14. MAPA VIRTUAL DEL COLEGIO



Crear un mapa interactivo del campus.



Debe mostrar lugares como:



\* Aulas.

\* Dirección.

\* Biblioteca.

\* Laboratorios.

\* Gimnasio.

\* Cancha.

\* Soda.

\* Enfermería.

\* Baños.

\* Parqueo.

\* Entradas.

\* Salidas.

\* Punto de reunión de emergencias.



Al seleccionar una ubicación mostrar información.



Agregar buscador:



"¿Dónde queda...?"



Preparar el sistema para que posteriormente puedan sustituirse los datos de demostración por el mapa real del colegio.



\---



\# 15. CENTRO DE EMERGENCIAS



Crear un apartado llamado:



\*\*Centro de Emergencias\*\*



Debe servir para información institucional y protocolos previamente definidos por el colegio.



Mostrar:



\* Simulacros programados.

\* Simulacros anteriores.

\* Evacuaciones.

\* Terremotos.

\* Incendios.

\* Emergencias médicas.

\* Incidentes críticos de seguridad.

\* Comunicados oficiales.



Agregar un botón claramente visible:



\*\*Ver protocolo de emergencia\*\*



También mostrar:



\* Estado actual del colegio.

\* NORMAL

\* PRECAUCIÓN

\* EMERGENCIA



Durante una emergencia debe aparecer únicamente información oficial proporcionada por la institución.



No diseñar funcionalidades tácticas ofensivas ni indicar cómo enfrentarse físicamente a una amenaza.



\---



\# 16. BUSES EN TIEMPO REAL



Crear una sección de transporte.



Mostrar:



\* Número de bus.

\* Ruta.

\* Conductor.

\* Próxima parada.

\* Hora estimada.

\* Estado.



Estados:



\* En ruta.

\* Próximo.

\* Retrasado.

\* Finalizado.



Crear una visualización de mapa para representar la posición del bus.



Como HTML/CSS/JS por sí solos no proporcionan GPS en tiempo real, crear una simulación funcional con datos de demostración y organizar el código para que posteriormente se pueda conectar a una API real de geolocalización de los buses.



Actualizar automáticamente los datos de demostración.



\---



\# 17. HORARIOS DE BUSES



Mostrar:



\* Ruta.

\* Hora de salida.

\* Paradas.

\* Hora aproximada por parada.

\* Hora de llegada al colegio.

\* Hora de salida del colegio.



Permitir buscar una ruta.



Permitir seleccionar:



\* Mañana.

\* Tarde.



\---



\# 18. SODA / CAFETERÍA



Crear una sección para ver los productos disponibles en la soda.



Mostrar tarjetas con:



\* Imagen.

\* Nombre.

\* Precio.

\* Categoría.

\* Disponibilidad.



Categorías:



\* Comidas.

\* Bebidas.

\* Snacks.

\* Postres.

\* Saludable.



Estados:



\* Disponible.

\* Pocas unidades.

\* Agotado.



Agregar buscador y filtros.



Opcionalmente permitir agregar productos a favoritos.



\---



\# 19. HORARIOS



Crear un horario escolar interactivo.



Mostrar:



\* Lunes.

\* Martes.

\* Miércoles.

\* Jueves.

\* Viernes.



Cada clase debe mostrar:



\* Materia.

\* Profesor.

\* Aula.

\* Hora inicial.

\* Hora final.



Destacar automáticamente cuál clase corresponde actualmente.



Agregar vista:



\* Día.

\* Semana.



También incluir horarios de:



\* Biblioteca.

\* Soda.

\* Laboratorios.

\* Actividades.

\* Clubes.

\* Transporte.



\---



\# 20. NOTIFICACIONES



Agregar un centro de notificaciones.



Notificar sobre:



\* Nueva actividad.

\* Cambio de horario.

\* Aviso.

\* Logro desbloqueado.

\* Incidencia actualizada.

\* Bus próximo.

\* Emergencia.

\* Comentario en foro.



Mostrar contador de notificaciones no leídas.



\---



\# 21. BÚSQUEDA GLOBAL



Agregar un buscador en la parte superior.



Debe permitir buscar:



\* Personas.

\* Lugares.

\* Eventos.

\* Horarios.

\* Avisos.

\* Productos.

\* Rutas.

\* Publicaciones del foro.



\---



\# 22. MODO OSCURO



Agregar:



\* Modo claro.

\* Modo oscuro.

\* Alto contraste.



Guardar la configuración seleccionada utilizando `localStorage`.



\---



\# 23. CONFIGURACIÓN DE ACCESIBILIDAD



Crear un panel donde puedan activarse individualmente:



\* Alto contraste.

\* Texto grande.

\* Reducir animaciones.

\* Lectura de página.

\* Fuente más legible.

\* Subrayar enlaces.

\* Aumentar espacio entre letras.



Guardar las preferencias.



\---



\# 24. DISEÑO



Quiero un diseño moderno de plataforma educativa.



Debe utilizar:



\* Sidebar.

\* Header.

\* Dashboard.

\* Cards.

\* Iconos profesionales.

\* Modales.

\* Tooltips.

\* Toast notifications.

\* Barras de progreso.

\* Gráficos.

\* Menús desplegables.

\* Animaciones suaves.

\* Diseño responsive.



Evitar utilizar emojis como iconos principales. Preferir Font Awesome o iconos SVG.



\---



\# 25. NAVEGACIÓN



Crear en el menú lateral:



\* Inicio

\* Mi perfil

\* Estudiantes

\* Horario

\* Línea de tiempo

\* Transporte

\* Soda

\* Mapa

\* Foro

\* Logros

\* Incidencias

\* Avisos

\* Emergencias

\* Estadísticas

\* Asistente IA

\* Configuración

\* Cerrar sesión



Las opciones administrativas solamente deben aparecer para administradores.



\---



\# 26. DATOS COMPARTIDOS



No quiero que cada sección funcione de manera completamente independiente.



Centralizar los datos en JavaScript.



Por ejemplo:



Si se crea un aviso, debe aparecer en:



\* Centro de avisos.

\* Dashboard.

\* Notificaciones.



Si cambia el estado de una incidencia:



\* Actualizar la incidencia.

\* Generar una notificación.



Si cambia un horario:



\* Actualizar horario.

\* Línea de tiempo.

\* Dashboard.



Utilizar `localStorage` para conservar información cuando se recargue la página.



\---



\# 27. DATOS DE DEMOSTRACIÓN



Agregar suficientes datos ficticios para poder probar todas las funciones.



Por ejemplo:



\* 15 estudiantes.

\* 5 profesores.

\* 10 avisos.

\* 10 eventos.

\* 8 logros.

\* 15 productos de soda.

\* 4 buses.

\* 10 incidencias.

\* Publicaciones del foro.

\* Horarios completos.



No dejar las pantallas vacías.



\---



\# 28. FUNCIONALIDAD



No quiero solamente una maqueta visual.



Los botones deben funcionar.



Los modales deben funcionar.



Los filtros deben funcionar.



El buscador debe funcionar.



El login debe funcionar.



Las notificaciones deben funcionar.



El modo oscuro debe funcionar.



Las opciones de accesibilidad deben funcionar.



El foro debe permitir publicar y comentar.



Las incidencias deben poder crearse.



Los avatares deben poder cambiarse.



Los gráficos deben mostrar información.



Los buses deben tener una simulación visual.



La línea de tiempo debe ser interactiva.



\---



\# 29. CALIDAD DEL CÓDIGO



Organizar JavaScript utilizando funciones claras.



Evitar código duplicado.



Utilizar nombres de variables comprensibles.



Separar:



\* Datos.

\* Interfaz.

\* Eventos.

\* Accesibilidad.

\* Navegación.

\* Lógica del sistema.



No eliminar funcionalidades existentes al agregar nuevas características.



\---



\# 30. RESULTADO FINAL



Entrégame un proyecto completamente ejecutable.



Primero muestra la estructura de archivos.



Después proporciona el código completo de cada archivo.



No escribas solamente ejemplos pequeños o fragmentos.



No omitas código usando frases como:



"el resto sería similar"



o



"agrega aquí tu código".



Necesito el código necesario para ejecutar el proyecto.



El proyecto debe poder abrirse inicialmente desde `index.html`.



Prioriza primero que todas las funciones trabajen correctamente y posteriormente las animaciones y detalles visuales.



Cuando una función requiera obligatoriamente un servidor, base de datos, GPS o API externa, crea una versión demostrativa funcional en JavaScript y deja claramente preparada la función que posteriormente recibirá los datos reales.

* 

