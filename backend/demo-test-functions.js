// backend/demo-test-functions.js
// Solo 2 funciones simples

function sumar(a, b) {
    return a + b;
}

function crearProducto(nombre, precio, stock) {
    if (precio < 0) throw new Error('Precio negativo');
    if (stock < 0) throw new Error('Stock negativo');
    
    return {
        id: 1,
        nombre: nombre,
        precio: precio,
        stock: stock
    };
}

module.exports = { sumar, crearProducto };