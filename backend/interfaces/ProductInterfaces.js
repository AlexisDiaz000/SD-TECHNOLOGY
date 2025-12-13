// backend/interfaces/ProductInterfaces.js
// SEGREGACIÓN DE INTERFACES (ISP) - SOLID Principle

// MAL: Interfaz gigante que viola ISP
class IProductGigante {
    crear() { }
    leer() { }
    actualizar() { }
    eliminar() { }
    buscar() { }
    validar() { }
    exportar() { }
    importar() { }
    // ¡8 métodos en una interfaz!
}

// BIEN: Interfaces segregadas (cumple ISP)
class IProductoCreador {
    crear(datos) { throw new Error("Implementar"); }
}

class IProductoLector {
    buscarTodos() { throw new Error("Implementar"); }
    buscarPorId(id) { throw new Error("Implementar"); }
}

class IProductoActualizador {
    actualizar(id, datos) { throw new Error("Implementar"); }
}

class IProductoEliminador {
    eliminar(id) { throw new Error("Implementar"); }
}

// Implementación que usa SOLO lo necesario
class ProductRepository {
    constructor() {
        Object.assign(this, new IProductoCreador());
        Object.assign(this, new IProductoLector());
    }
    
    crear(datos) { return { id: 1, ...datos }; }
    buscarTodos() { return [{id: 1, nombre: "Producto A"}]; }
    buscarPorId(id) { return {id, nombre: "Encontrado"}; }
}

// Cliente que solo necesita lectura
class ReporteService {
    constructor(lector) {  // ← Solo IProductoLector
        this.lector = lector;
    }
    
    generarReporte() {
        return `Productos: ${this.lector.buscarTodos().length}`;
    }
}

module.exports = { ProductRepository, ReporteService };
