# Bibloteca de código
Herramienta web en tiempo real para documentar funcionalidades genericas de diferentes lenguajes de programación, con el fin de que los desarrolladores documenten y encuentren de manera mas oprtuna las funcionalidades o códigos genericos que se han desarrollado en los diferentes proyetos.

De esta manera se evita volver a reescribir código. Solo basta con buscar la funcionalidad por parte del nombre o parte de la descripción
o el lenguaje. Por ejemplo: css, html, js, sql, php, ruby, node etc. 

Esta herramienta tambien le permite a los desarrolladores tener una comunicación grupal o global mediante un chat y en el caso de que se cree una nueva funcionalidad el sistema notifica en tiempo real a todos los usuarios que se encuentren conectados gracias a los websockets.

Los usuarios se definen como administradores o desarrolladores. El admin (administrador) tiene el control para administrar usuarios,  funcionalidades y tipo de funcionalidades.

Los desarrolladores pueden  ver todas las funcionalidades creadas, crear nuevas funcionalidades, editar una funcionalidad y ver el detalle de una funcionalidad especifica.

## Arquitectura definida
[![Arquitectura](http://funnyfrontend.com/wp-content/uploads/2015/07/stack-mean-esquema.jpg)]()


## Tecnologías utilizadas

* MongoDB
* Express
* AngularJS
* NodeJS
* Boostrap

## MongoDB
Base de datos no relacional que se utiliza para almacenar las siguientes colecciones

* Objetos
* Tipo objetos
* Usuarios

## Express
Web framework para node, se utilizó para contruir el backend.

## AngularJS
Framework para desarrollar aplicaciones SPA, se utilizó para construir el frontend.

## NodeJS 
Entorno en tiempo de ejecución multiplataforma, de código abierto, para la capa del servidor.

## Boostrap
Framework para construir el diseño de la herramienta.
