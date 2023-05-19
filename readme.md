# Calyaan Backend-V2 

## Tabla de contenidos

- [Herramientas Utilizadas](#herramientas-utilizadas)
- [Prerrequisitos](#prerrequisitos)
- [Iniciar](#iniciar)
- [Estructura De Carpetas](#estructura-de-carpetas)
- [Consideraciones](#consideraciones)

### Herramientas Utilizadas

El stack manejado para el proyecto fue:

* [Node.js](https://nodejs.org/) 
* [Express](https://express.com/) 
* [Mongodb](https://mongodb.com/) 

### Prerrequisitos

* Node.js v-16.17.0
* Express v-4.18.2


## Iniciar

Para poder ejecutar el proyecto de manera local dejaré los siguientes pasos para su ejecución correctamente, se deberá tener presente la rama, la cual se quiere clonar, dado que existen 2 ramas principales main (producción) y development (desarrollo).

### Correr aplicación de manera local 

1. Clonar el repositorio
   ```
   git clone --branch <Nombre de la rama> https://github.com/Calyaan/CalyaanBackend-V2.git
   ```
   ```
   git clone --branch development https://github.com/Calyaan/CalyaanBackend-V2.git
   ```
   
2. Instalar NPM packages 
   ```
   npm install
   ```
   ```
   npm i
   ```
   
3. Asignar las variables de entorno, creando el archvio `.env` en base al archivo `.env.example`.

   ```
   FRONTEND_URL = Ejemplo "http://127.0.0.1:5173"
   ```
   
### Estructura De Carpetas
  ```
                             
  backend_calyaan:  
  
     --config                configuracion coneccion a base de datos
     
     --controllers           componentes que permiten la intercomunicacion de datos

     --helpers               Funciones de ayuda

     --middlewares           Validadores de datos

     --models                informacion de las propiedades necesarias para el proyecto

     --routes                conexiones url 

        
  ```

### Consideraciones
