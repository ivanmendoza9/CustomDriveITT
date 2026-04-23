# 🚗 CustomDrive ITT : Agencia de Autos

---

Elaborado por:

- Mendoza Suarez Ivan Gustavo
- Ortega Ramos Yahir
- Sotelo Rubio Rodrigo
- Lopez Sandoval Felix Guadalupe

---

## 📘 Introducción

En este proyecto se desarrolla una aplicación web que simula una agencia automotriz, donde el usuario puede configurar un automóvil seleccionando marca, modelo y diferentes características adicionales.

El sistema permite personalizar el vehículo en tiempo real, mostrando su precio y descripción conforme se agregan opciones.

Para lograr una arquitectura flexible y organizada, se implementan tres patrones de diseño:

- Decorador, para agregar características al auto dinámicamente
- Bridge, para separar la lógica de entrega de las agencias
- Memento, para guardar y restaurar configuraciones del auto

Esto permite que el sistema sea más realista, escalable y fácil de mantener.
---

## 🎯 Objetivos

### ✅ Objetivo general
Desarrollar un sistema de configuración de automóviles que implemente patrones de diseño para mejorar la flexibilidad y organización del código.

### ✅ Objetivos específicos
- Permitir la selección de autos por marca y modelo
- Implementar personalización mediante extras dinámicos
- Aplicar el patrón Decorador para extender funcionalidades
- Utilizar el patrón Bridge para desacoplar la entrega del auto
- Implementar el patrón Memento para guardar y restaurar configuraciones
- Mostrar el costo total del vehículo en tiempo real

---

## 🚀 Tecnologías utilizadas
- JavaScript
- HTML
- CSS

---

## Diagrama UML



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

Se utiliza para agregar extras al automóvil sin modificar la clase base.

- Permite personalizar el auto dinámicamente
- Evita crear muchas clases para cada combinación
- Hace el sistema flexible

---

## 🌉 ¿Cómo influye el patrón Bridge?

Se utiliza para separar la lógica de entrega de las agencias.

- Permite cambiar la agencia sin afectar la entrega
- Mejora la organización del código
- Facilita agregar nuevas agencias

---

💾 Patrón Memento

Se utiliza para guardar el estado del automóvil en diferentes momentos.

- Permite deshacer cambios
- Guarda configuraciones del usuario
- Mejora la experiencia del sistema
---

## 🧾 Conclusión

Este proyecto demuestra cómo los patrones de diseño pueden aplicarse en un caso real para mejorar la estructura y funcionalidad de un sistema.
En conjunto, ambos patrones hacen que el sistema sea más flexible, claro y fácil de ampliar.

En conjunto, estos patrones hacen que el programa sea más ordenado, escalable y cercano a soluciones utilizadas en la industria.
