***Descripción del proyecto***

El objetivo es ampliar el sistema de reservas de salas desarrollado en el TP 08, incorporando las operaciones de actualización completa, actualización parcial y eliminación física de reservas mediante una API REST.

La aplicación utiliza Node.js, Express y MongoDB Atlas, manteniendo una arquitectura organizada por capas y compartiendo la misma base de datos entre la API y las vistas HTML.

***Objetivos***

Mantener la creación y lectura de reservas implementadas en el TP 08.
Implementar la actualización completa mediante PUT.
Implementar la actualización parcial mediante PATCH.
Implementar la eliminación física de reservas mediante DELETE.
Validar los datos recibidos antes de modificar la base de datos.
Mantener la persistencia de los cambios en MongoDB Atlas.
Conservar el funcionamiento de las vistas HTML y del formulario de creación.
Manejar correctamente los errores HTTP y las respuestas JSON.
Mantener las herramientas de formato y análisis de código.
🛠️ Tecnologías utilizadas
Node.js: entorno de ejecución de JavaScript.
Express: framework para desarrollar el servidor y las rutas HTTP.
MongoDB Atlas: base de datos NoSQL en la nube.
Mongoose: modelado de documentos y validaciones.
Postman Desktop: pruebas de los endpoints de la API.
HTML y CSS: interfaz web para visualizar y registrar reservas.
CommonJS: sistema de módulos utilizado en el proyecto.

***Base de datos***
El proyecto utiliza MongoDB Atlas con la siguiente configuración:


Elemento	Valor
Servicio	MongoDB Atlas Free
Base de datos	reservas_salas_u9
Colección	reservas
La conexión se configura mediante variables de entorno para evitar publicar credenciales o información privada en el repositorio.

***Modelo de reserva***
Cada reserva contiene los siguientes campos:


Campo	Descripción
_id	Identificador único generado por MongoDB.
estudiante	Nombre del estudiante.
email	Correo electrónico del estudiante.
sala	Sala seleccionada.
fecha	Fecha de la reserva.
turno	Turno solicitado.
personas	Cantidad de personas, entre 1 y 6.
estado	Estado de la reserva: pendiente o confirmada.

Reglas de validación
estudiante: texto obligatorio, sin espacios innecesarios al inicio o al final.
email: texto obligatorio y debe contener @.
sala: debe ser Sala Norte, Sala Sur o Sala Multimedia.
fecha: texto obligatorio.
turno: debe ser Mañana, Tarde o Noche.
personas: número entero entre 1 y 6.
estado: pendiente o confirmada. Al crear una reserva se establece automáticamente como pendiente.
No se implementan validaciones de disponibilidad de salas, superposición de horarios ni unicidad de reservas.

***Instalación y ejecución***

1. Clonar el repositorio

bash
git clone URL_DEL_REPOSITORIO
Ingresar a la carpeta del proyecto:

bash
cd tp-09-salas-crud-mongodb

2. Instalar dependencias

bash
npm install

3. Configurar variables de entorno
Crear un archivo .env en la raíz del proyecto utilizando como referencia la plantilla .env.example.

Ejemplo:

.env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@TU_CLUSTER.mongodb.net/reservas_salas_9?retryWrites=true&w=majority

Reemplazar el valor de conexión por la cadena correspondiente a la base de datos propia.

Importante: el archivo .env contiene información privada y no debe subirse a GitHub.

4. Iniciar el servidor

bash
npm start
Una vez establecida la conexión con MongoDB Atlas, el servidor queda disponible en:

text
http://localhost:3000


***Arquitectura del proyecto***

La aplicación mantiene una arquitectura organizada por responsabilidades:

Routes: definen los endpoints y reciben las solicitudes HTTP.
Controllers: gestionan las solicitudes, respuestas y códigos de estado.
Services: contienen la lógica de negocio y las operaciones asíncronas sobre MongoDB.
Models: definen el esquema de reservas mediante Mongoose.
Views: contienen las vistas HTML de la aplicación.
Public: contiene los archivos estáticos, como CSS.
Scripts: contiene herramientas auxiliares del proyecto.
La API y las vistas HTML utilizan el mismo servicio de acceso a datos, evitando duplicar la lógica de persistencia.


***Endpoints de la API REST***
La API permite administrar las reservas mediante los siguientes endpoints:

Método	Endpoint	Descripción
POST	/api/reservas	Crear una reserva.
GET	/api/reservas	Obtener todas las reservas.
GET	/api/reservas/:id	Obtener una reserva por ID.
PUT	/api/reservas/:id	Reemplazar una reserva completa.
PATCH	/api/reservas/:id	Modificar parcialmente una reserva.
DELETE	/api/reservas/:id	Eliminar físicamente una reserva.
POST - Crear una reserva

http
POST /api/reservas
Permite registrar una nueva reserva.

El estado se asigna automáticamente como pendiente.

El cliente debe enviar los seis campos originales y no puede establecer el _id ni el estado.

Respuesta esperada: 201 Created.

GET - Listar reservas

http
GET /api/reservas
Devuelve un arreglo con todas las reservas almacenadas en MongoDB.

Respuesta esperada: 200 OK.

GET - Obtener una reserva

http
GET /api/reservas/:id
Permite consultar una reserva individual utilizando su identificador.

200 OK: reserva encontrada.
400 Bad Request: identificador inválido.
404 Not Found: reserva inexistente.
PUT - Actualización completa

http
PUT /api/reservas/:id
Permite reemplazar completamente los datos editables de una reserva.

Se deben enviar los siete campos:

estudiante
email
sala
fecha
turno
personas
estado
Si falta alguno de los campos obligatorios, la solicitud se rechaza con 400 Bad Request.

La actualización conserva el mismo identificador de la reserva.

PATCH - Actualización parcial

http
PATCH /api/reservas/:id
Permite modificar únicamente los siguientes campos:

personas
estado
Ejemplo de solicitud:


json
{
  "personas": 3
}
También se puede modificar el estado:


json
{
  "estado": "confirmada"
}
Se admite modificar ambos campos en una misma solicitud.

Los campos omitidos conservan sus valores originales. No se permiten cuerpos vacíos ni campos desconocidos.

DELETE - Eliminación física

http
DELETE /api/reservas/:id
Elimina definitivamente un documento de la colección reservas, utilizando su identificador.

Respuestas esperadas:

204 No Content: reserva eliminada correctamente, sin cuerpo de respuesta.
400 Bad Request: identificador inválido.
404 Not Found: reserva inexistente.
Una vez eliminada, la reserva deja de existir en MongoDB. Un segundo DELETE o una consulta GET posterior para el mismo ID devuelve 404 Not Found.

Diferencia entre eliminar y cambiar el estado:

Cambiar el estado a confirmada o pendiente mantiene el documento almacenado.
Utilizar DELETE elimina físicamente el documento de la base de datos.


***Manejo de errores***
La API contempla los siguientes códigos de respuesta:


Código	Significado
200	Solicitud procesada correctamente.
201	Recurso creado correctamente.
204	Recurso eliminado sin contenido de respuesta.
400	Datos inválidos o solicitud incorrecta.
404	Recurso inexistente.
500	Error interno del servidor.
Los errores se devuelven en formato JSON y no deben exponer información sensible, credenciales ni trazas internas.

***Pruebas con Postman***
Las pruebas de la API se realizan utilizando Postman Desktop.

Dirección base:

text
http://localhost:3000
Para las solicitudes POST, PUT y PATCH se utiliza:

Body
raw
JSON
Content-Type: application/json
Para GET y DELETE se utiliza Body en none.

Ejemplo de creación

json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-28",
  "turno": "Mañana",
  "personas": 2
}

Ejemplo de actualización completa

json
{
  "estudiante": "Ana Ejemplo",
  "email": "ana@example.com",
  "sala": "Sala Norte",
  "fecha": "2026-10-28",
  "turno": "Mañana",
  "personas": 2,
  "estado": "confirmada"
}

Ejemplo de actualización parcial

json
{
  "personas": 3
}

Ejemplo de eliminación

http
DELETE /api/reservas/ID_DE_LA_RESERVA
Se verifica que la respuesta sea 204 No Content, que el documento deje de existir y que el listado general contenga una reserva menos.


***Matriz de pruebas y resultados***
Completar esta sección con los resultados realmente observados durante las pruebas.


Prueba	Resultado esperado	Resultado obtenido
POST válido	201 Created	Pendiente
PUT completo	200 OK	Pendiente
PUT incompleto	400 Bad Request	Pendiente
PATCH personas	200 OK	Pendiente
PATCH estado	200 OK	Pendiente
PATCH vacío	400 Bad Request	Pendiente
PATCH con campo desconocido	400 Bad Request	Pendiente
Personas fuera de rango	400 Bad Request	Pendiente
ID mal formado	400 Bad Request	Pendiente
ID inexistente	404 Not Found	Pendiente
DELETE existente	204 No Content	Pendiente
DELETE repetido	404 Not Found	Pendiente
Consulta posterior al DELETE	404 Not Found	Pendiente
Persistencia después del reinicio	Datos conservados	Pendiente
Vistas HTML y formulario	Funcionamiento correcto	Pendiente
Endpoint /estado	Cantidad real de documentos	Pendiente


***Persistencia de datos***
Los datos se almacenan directamente en MongoDB Atlas.

Se comprueba la persistencia mediante el siguiente procedimiento:

Crear una reserva de prueba.
Guardar su identificador.
Modificar la reserva utilizando PUT o PATCH.
Reiniciar el servidor.
Consultar nuevamente la reserva mediante GET.
Comprobar que los cambios continúan almacenados.
Eliminar otra reserva de prueba.
Reiniciar nuevamente el servidor.
Verificar que el documento eliminado continúa ausente.
El servidor mantiene la conexión a la base de datos entre solicitudes y realiza un cierre ordenado de sus recursos.

***Interfaz web***
Se conserva la interfaz HTML desarrollada en el TP 08.

Continúan disponibles:

Página de inicio.
Estilos CSS y layout.
Listado de reservas.
Detalle individual.
Formulario de creación.
Ruta /estado, que informa la cantidad real de documentos almacenados en MongoDB.
El formulario conserva la creación válida con redirección 302 y devuelve 400 ante entradas inválidas.

Los cambios realizados mediante la API se reflejan en las consultas HTML existentes.

***Calidad del código***
Se mantienen las herramientas de formato y análisis del proyecto.

Los comandos disponibles son:


bash
npm run format

bash
npm run check
Estos comandos permiten aplicar el formato establecido y verificar la calidad del código en las carpetas src y scripts.

***Seguridad y buenas prácticas***
Las credenciales se administran mediante variables de entorno.
No se publican archivos .env ni secretos en GitHub.
No se incluye la carpeta node_modules.
Se validan los datos antes de realizar modificaciones.
No se permite que el cliente envíe operadores de MongoDB.
Las actualizaciones utilizan listas explícitas de campos permitidos.
No se realizan inserciones automáticas al iniciar el servidor o consultar la API.
Los errores internos no exponen información sensible.