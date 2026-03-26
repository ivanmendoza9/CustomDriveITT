# 🚗 CustomDrive ITT : Agencia de Autos

---

Elaborado por:

- Mendoza Suarez Ivan Gustavo
- Ortega Ramos Yahir
- Sotelo Rubio Rodrigo
- Lopez Sandoval Felix Guadalupe

---

## 📘 Introducción

En el presente proyecto se desarrolla una aplicación web que simula el funcionamiento de una agencia automotriz, en la cual el usuario puede configurar un automóvil seleccionando una marca, modelo y diversas características adicionales.

El sistema permite personalizar el vehículo mediante la adición de extras como GPS, sistema de sonido, asientos de piel, turbo, entre otros, mostrando en tiempo real el costo total y la descripción del automóvil configurado.

Para lograr una arquitectura flexible y escalable, se implementan dos patrones de diseño: el **patrón Decorador**, utilizado para agregar funcionalidades al vehículo de forma dinámica, y el **patrón Bridge**, empleado para separar la lógica de entrega del automóvil de las agencias disponibles.

---

## 🎯 Objetivos

### ✅ Objetivo general
Desarrollar un sistema que permita la personalización de automóviles utilizando patrones de diseño para lograr flexibilidad y escalabilidad.

### ✅ Objetivos específicos
- Implementar un sistema de selección de autos por marca y modelo.
- Permitir la personalización mediante extras dinámicos.
- Aplicar el patrón Decorador para agregar funcionalidades sin modificar la clase base.
- Aplicar el patrón Bridge para separar la lógica de entrega de las agencias.
- Mostrar el costo total del vehículo configurado.

---

## 🚀 Tecnologías utilizadas
- JavaScript
- HTML
- CSS

---

## Diagrama UML

-

---

## ⚙️ Funcionamiento del programa 

El programa simula una agencia automotriz donde el usuario puede configurar su auto paso a paso.

Primero, el usuario selecciona la marca, modelo, rines, color y tipo de motor, con lo cual se genera un precio base.

Después, puede agregar diferentes extras como GPS, sonido, asientos de piel o turbo. Cada vez que selecciona uno, el sistema actualiza automáticamente el precio y la descripción del auto.

Finalmente, el usuario elige una agencia, y el sistema simula la entrega del vehículo mostrando el resumen completo del auto configurado.

---

## Capturas de Pantalla Ejecución

-

---

## 🧩 ¿Cómo influye el patrón Decorador?

El patrón Decorador influye en la personalización del automóvil.

Se aplica cuando el usuario agrega extras como:

- GPS
- Sonido
- Asientos de piel
- Turbo
etc.

Cada extra envuelve al objeto base (Car), agregando:

- Más costo
- Más descripción

Esto permite que el auto se construya dinámicamente sin modificar la clase original.

<img width="843" height="141" alt="image" src="https://github.com/user-attachments/assets/19bcaadd-5d53-45de-bd38-3de517a8dd69" />

---

## 🌉 ¿Cómo influye el patrón Bridge?

El patrón Bridge influye en la entrega del automóvil.

Permite separar:

- La lógica de entrega (Delivery)
- De las agencias (Agency)

Esto hace que puedas cambiar la agencia sin modificar cómo funciona la entrega.

<img width="494" height="165" alt="image" src="https://github.com/user-attachments/assets/608f90b4-21a8-4b6b-9aba-2ff920947168" />
<img width="510" height="119" alt="image" src="https://github.com/user-attachments/assets/7b7243e2-14b4-4ca5-b88a-472d6daecbce" />

---

## 🧾 Conclusión

Este programa muestra cómo se puede simular la personalización de un auto de forma dinámica y organizada. El patrón Decorador permite agregar características fácilmente sin modificar el auto base, mientras que el patrón Bridge ayuda a separar la lógica de entrega de las agencias.

En conjunto, ambos patrones hacen que el sistema sea más flexible, claro y fácil de ampliar.
