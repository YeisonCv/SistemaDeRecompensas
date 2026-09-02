# Tipos de prueba y casos de prueba

## Por qué se usan estos tipos

### Pruebas de lógica de negocio
Justificación: las reglas de puntos y redención son el núcleo del sistema. Si fallan, el cliente recibe o pierde puntos de forma incorrecta.

Archivo: `test/utils/points.test.ts`

- Compra menor a $1.000 → 0 puntos, sin error
- Compra de $1.000 o más → 1 punto por cada $1.000
- Redimir 0 puntos → error
- Redimir más que el saldo → error
- Redimir decimales → error
- Redimir un entero válido → 1 punto = $100

### Pruebas de validación de datos
Justificación: el backend no debe confiar solo en el frontend. Hay que rechazar campos vacíos, texto donde va un número y valores fuera de rango.

Archivo: `test/utils/validation.test.ts`

- Documento vacío
- Producto vacío
- Valor vacío
- Valor no numérico (`abc`, `mil`)
- Valor fuera de rango (`0`, `-100`)
- Valor menor a $1.000: se acepta y asigna 0 puntos

### Pruebas de error y escenarios negativos
Justificación: el sistema debe fallar de forma controlada y con un mensaje claro, no con un error interno.

Archivos: `test/utils/validation.test.ts`, `test/service/rewardService.test.ts`

- Cliente con documento inexistente → `Cliente no encontrado`
- Datos inválidos → el mensaje indica qué campo falló

### Pruebas funcionales
Justificación: con datos válidos la operación principal debe completarse bien (validar entrada + calcular puntos).

Archivo: `test/utils/validation.test.ts`

- Producto `Teclado` y valor `1500` → datos aceptados y 1 punto

## Escenarios cubiertos

| Tipo | Escenario | Resultado esperado |
|------|-----------|--------------------|
| Exitoso | Compra de $1.500 | 1 punto |
| Exitoso | Compra de $500 | 0 puntos, sin error |
| Fallido | Documento que no existe | Error: cliente no encontrado |
| Fallido | Redimir 0 puntos o más del saldo | Error |
| Datos inválidos | Campos vacíos | Error de campo obligatorio |
| Datos inválidos | Valor `abc` | Error: no es un número válido |
| Datos inválidos | Valor `0` o negativo | Error: debe ser mayor a 0 |
| Punto de fallo | Compra menor a $1.000 | 0 puntos, sin error |
| Punto de fallo | Redención decimal (`10.5`) | Error: debe ser entero |

Ejecutar todas las pruebas:

```bash
npm test
```
