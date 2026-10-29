# Ionic Events con Firebase y OneSignal


Es una aplicación de pruebas, siguiendo el curso de https://www.udemy.com/course/aprende-ionic-con-proyectos-practicos, como estaba teniendo problemas con la API de Pokemons, he creado un sistema para que me devuelva datos falsos en el catch error de la petición.

Es una aplicación básica de Ionic 7 con Angular 19 y usando Karma/Jassmine, para aprender. Para ello lo que se ejecutó:

`npm install -g @ionic/cli`

`ionic start 06-ionic-events-firebas-onsignal` y se fue respondiendo: Angular, blank y standalone


Ejecutar `ionic serve` dentro del directorio de la aplicación para ver tu app en el navegador

Ejecutar `ionic capacitor build android` para crear la aplicación de android y se abra el android studio

Ejecutar `npm run generate-icons-android` para crear los iconos

Usa  `cordova-res --skip-config --copy` para generar el icono de tu app y pantallas de presentación


Ejecutar `ionic capacitor run android -l --external` para actualizar automáticamente en android, aunque hay que pulsar el reload en el Android Studio, la primera vez

## Añadir plugins de capacitor
Por ejemplo, para añadir el plugin de preferences, para guardar datos en el storage :
`npm install @capacitor/preferences`

O para generar los iconos:
`npm install @capacitor/assets --save-dev`

O para abrir una url:
`npm install @capacitor/browser@7.0.1`

O para obtener información del dispositivo:
`npm install @capacitor/devicer@7.0.1`

O para hacer push de notificaciones (contra servidor onesignal):
`npm install @capacitor/push-notifications@7.0.1`
`npm install onesignal-cordova-plugin`
Fuimos a https://console.firebase.google.com/project/ionic-events-f0aa8/settings/serviceaccounts/adminsdk pestaña de cuentas de servicio y pulsamos en Generar clave privada y nos descargará un archivo .json que será el que se use en onesignal.com (donde nos tenemos que crear una cuenta> crear una app > tipo push > Integrate the OneSignal SDK > Google Android > Subir archivo json > Continuar > Capacitor > Copiamos el App ID que nos da y lo ponemos en los environment.ts como oneSignalAppId. Luego, en la web de OneSignal, vamos al apartado de "Keys & IDs" y pulsamos en Add Key y copiamos el generado en los environment.ts como oneSignalRestApiKey)


Ir al listado de aplicaciones de firebase, entrar en la aplicación de ionic-events, y darle a agregar app, y seleccionar Android. Como nombre de paquete android ponemos el que se encuentra en capacitor.config.ts (que en nuestro caso es 'io.ionic.starter', sino lo cambiamos) y le damos a "Registrar app" y luego pulsamos en "Descargar google-services.json" y lo guardamos y luego siguiente, siguiente y finalmente "ir a consola"
Ejecutamos `ionic capacitor build android` y tras la generación, se pega el archivo google-services.json descargado, en la carpeta android/app (en la carpeta app)



## Generar páginas
`ionic g page pages/login`
`ionic g page pages/events`
`ionic g page pages/create-event`
`ionic g page pages/update-event`

# Generar componente
`ionic g c components/form-event`

# Generar servicio
`ionic g s services/Auth`
`ionic g s services/events`
`ionic g s notifications` 

# Generar pipe
`ionic g pipe pipes/mipipe`

## Generar iconos
Se añadieron los scripts correspondientes en el package.json, y las imagenes en la carpeta resources

`npm run generate-icons-android`
`npm run generate-icons-ios`
`npm run generate-icons-pwa`

Más info sobre el script y las dimensiones necesarias de las imágenes: [https://capacitorjs.com/docs/v7/guides/splash-screens-and-icons](https://capacitorjs.com/docs/v7/guides/splash-screens-and-icons)


`ionic capacitor build android` 

## Añadir angular-fire
`ng add @angular/fire@19.2`
Creamos el proyecto en firebase y vamos a la configuración general (https://console.firebase.google.com/project/ionic-events-f0aa8/settings/general).
Le damos al icono de app web y ponemos nombre ionic-events-web y registramos.
Copiamos la configuración (contenido del objeto de firebaseConfig) de Firebase y la pegamos en environment.ts

En las Reglas del firebase lo he modificado por 
    match /events/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
https://console.firebase.google.com/project/ionic-events-f0aa8/firestore/databases/-default-/security/rules

Hubo que indexar la base de datos, para poder hacer el filtrado, se mostraba un error en consola indicando la url a la que había ir, y como mucho pulsar un botón en esa página, para que empiece a indexar.


## Añadir librerías de npm 
`npm i moment-timezone`
`npm i moment`

## Más documentación
https://ionic-docs-lq0if04rc-ionic1.vercel.app/docs/v7/intro/cli
https://ionic-docs-lq0if04rc-ionic1.vercel.app/docs/v7/components
https://ionicframework.com/docs
