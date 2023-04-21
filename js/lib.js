/**
 * #### Selector basico por ID.
 * Acepta un argumento como parametro.
 *
 * -------------------
 * `e`: ID a seleccionar.
 *
 * -------------------
 * Es un getElementById resumido.
 */
export function g(e) {
  return document.getElementById(e);
}

/**
 * #### Selector compuesto por query's.
 * Acepta un argumento como parametro.
 *
 * -------------------
 * `q`: Query de seleccion.
 *
 * ---------------------------------
 * Es un selector al estilo jQuery.
 *
 * Es un querySelector resumido.
 */
export function $(q) {
  return document.querySelector(q);
}

/**
 * #### Selector compuesto por query's.
 * Acepta argumentos como parametros.
 *
 * -------------------
 * `q`: Query de seleccion.
 *
 * `c`: Callback o funcion a ejecutar en los resultados de dicho query.
 *
 * ---------------------------------
 * Es un selector al estilo jQuery.
 *
 * La funcion dentro del callback sera ejecutada en todos los elementos encontrados en el selector.
 */
export function q(q, c) {
  const foundQuery = document.querySelectorAll(q);

  foundQuery.forEach((value, k) => {
    c(value, k);
  });
}

/**
 * #### Selector de clases CSS por query's.
 * Acepta un argumento como parametro.
 *
 * -------------------
 * `e`: ID a seleccionar.
 *
 * -------------------
 * Retorna la lista de propiedades CSS adheridas al elemento. Incluye aquellas definidas por las clases.
 *
 * (El valor retornado es solo lectura).
 */
export function c(e) {
  return getComputedStyle(g(e));
}
