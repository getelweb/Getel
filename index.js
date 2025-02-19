import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = window.supabase.createClient("https://uwtochhiydhfjliaqard.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dG9jaGhpeWRoZmpsaWFxYXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxNDQ3MDYsImV4cCI6MjA1NDcyMDcwNn0.udHCnVc3BWFbs0Qtqe-xiIdxIdLCT_HDN5PPdkf4lnk");



window.guardarCliente = async function () {
  const nombre = document.getElementById("nombre").value;
  const dni_rnc = document.getElementById("dniCliente").value;
  const telefono = document.getElementById("telefono").value;
  const correo = document.getElementById("email").value;
  const direccion = document.getElementById("direccion").value;

  if (!nombre || !dni_rnc || !telefono || !correo || !direccion) {
      alert("Por favor, complete todos los campos.");
      return;
  }

  const { data, error } = await supabase.from("clientes").insert([
      { nombre, dni_rnc, telefono, correo, direccion }
  ]);

  if (error) {
      console.error("Error al agregar cliente:", error);
      alert("Error al guardar el cliente.");
  } else {
      console.log("Cliente agregado:", data);
      alert("Cliente agregado correctamente.");

      // Cerrar el modal y limpiar formulario
      const modal = bootstrap.Modal.getInstance(document.getElementById("clie"));
      modal.hide();
      document.cliente.reset();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("guardarClienteBtn").addEventListener("click", guardarCliente);
});

//Aqui es donde esta la lista seleccionable


const obtenerClientes = async () => {
  const { data, error } = await supabase.from('clientes').select('*');

  if (error) {
      console.error('Error al obtener clientes:', error);
      return;
  }

  console.log("Clientes obtenidos:", data); // Verifica si hay datos en la consola
  mostrarClientesEnAcordeon(data);

  const accordion = document.getElementById('accordionClientes');
  accordion.innerHTML = ''; // Limpiar contenido previo

  data.forEach((cliente, index) => {
      const clienteHTML = `
          <div class="accordion-item">
              <h2 class="accordion-header" id="heading${index}">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                      ${cliente.nombre} (ID: ${cliente.id})
                  </button>
              </h2>
              <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#accordionClientes">
                  <div class="accordion-body">
                      <p><strong>Teléfono:</strong> ${cliente.telefono}</p>
                      <p><strong>Email:</strong> ${cliente.email}</p>
                      <button class="btn btn-primary" onclick="seleccionarCliente(${cliente.id}, '${cliente.nombre}')">Seleccionar</button>
                  </div>
              </div>
          </div>
      `;
      accordion.innerHTML += clienteHTML;
  });
};

window.seleccionarCliente = function (id, nombre) {
  const clienteIDInput = document.getElementById('clienteID');
  if (clienteIDInput) {
      clienteIDInput.value = id; // Asignar el ID del cliente al input
  } else {
      console.error("No se encuentra el campo 'clienteID'.");
  }

  // Si existe el modal de clientes, cerramos ese modal
  const modalClientes = bootstrap.Modal.getInstance(document.getElementById('modalClientes'));
  if (modalClientes) {
      modalClientes.hide();
  } else {
      console.error("No se encontró el modal 'modalClientes'.");
  }
};

const mostrarClientesEnAcordeon = async () => {
    const { data, error } = await supabase.from("clientes").select("*");

    if (error) {
        console.error("Error al obtener clientes:", error);
        return;
    }

    console.log("Clientes obtenidos:", data); // Verifica si hay datos

    const accordionContainer = document.getElementById("accordionExample");
    accordionContainer.innerHTML = ''; // Limpiar contenido previo

    data.forEach((cliente, index) => {
        const item = document.createElement('div');
        item.classList.add('accordion-item');
        item.innerHTML = `
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" 
    data-bs-target="#collapse${index}" aria-expanded="true" 
    aria-controls="collapse${index}">
    ${cliente.nombre ? cliente.nombre.trim() : "Nombre no disponible"} - 
    ${cliente.dni_rnc ? cliente.dni_rnc.trim() : "Sin DNI/RNC"}
</button>

            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" 
                aria-labelledby="heading${index}" data-bs-parent="#accordionExample">
                <div class="accordion-body">
                    <strong>Teléfono:</strong> ${cliente.telefono || "No registrado"} <br>
                    <strong>Email:</strong> ${cliente.correo || "No registrado"} <br>
                    <strong>Dirección:</strong> ${cliente.direccion || "No registrada"} <br>
                    <button class="btn btn-warning btn-sm mt-2" onclick="editarCliente(${cliente.id})">
                        Editar
                    </button>
                </div>
            </div>
        `;
        accordionContainer.appendChild(item);
    });
};

// Llamar a la función cuando cargue la página
document.addEventListener("DOMContentLoaded", mostrarClientesEnAcordeon);

// Función para abrir el modal de edición con los datos del cliente seleccionado


window.editarCliente = async (id) => {
    console.log("Editando cliente con ID:", id);

    // Obtener los datos del cliente desde Supabase
    const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error al obtener cliente:", error);
        return;
    }

    console.log("Cliente seleccionado:", data); // Verifica los datos en la consola

    // Asegurar que los elementos existen antes de asignar valores
    const nombreInput = document.getElementById("editNombreCliente");
    const dniInput = document.getElementById("editDniRncCliente");
    const telefonoInput = document.getElementById("editTelefonoCliente");
    const correoInput = document.getElementById("editCorreoCliente");
    const direccionInput = document.getElementById("editDireccionCliente");
    const idInput = document.getElementById("editClienteId");

    if (!nombreInput || !dniInput || !telefonoInput || !correoInput || !direccionInput || !idInput) {
        console.error("Uno o más elementos del formulario no existen en el DOM.");
        return;
    }

    // Asignar los valores obtenidos al formulario
    idInput.value = data.id;
    nombreInput.value = data.nombre;
    dniInput.value = data.dni_rnc;
    telefonoInput.value = data.telefono || "";
    correoInput.value = data.correo || "";
    direccionInput.value = data.direccion || "";

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
    modal.show();
};

window.guardarCambiosCliente = async () => {
    const id = document.getElementById("editClienteId").value;
    const nombre = document.getElementById("editNombreCliente").value.trim();
    const dniRnc = document.getElementById("editDniRncCliente").value.trim();
    const telefono = document.getElementById("editTelefonoCliente").value.trim();
    const correo = document.getElementById("editCorreoCliente").value.trim();
    const direccion = document.getElementById("editDireccionCliente").value.trim();

    if (!id || !nombre || !dniRnc) {
        console.error("El nombre y el DNI/RNC son obligatorios.");
        return;
    }

    const { error } = await supabase
        .from("clientes")
        .update({
            nombre,
            dni_rnc: dniRnc,
            telefono,
            correo,
            direccion,
        })
        .eq("id", id);

    if (error) {
        console.error("Error al actualizar cliente:", error);
        return;
    }

    console.log("Cliente actualizado correctamente.");

    // Cerrar el modal después de guardar
    const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarCliente"));
    modal.hide();

    // Recargar la lista de clientes
    mostrarClientesEnAcordeon();


};


window.eliminarCliente = async function(clienteId, button) {
  if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

  const { error } = await supabase.from('clientes').delete().eq('id', clienteId);

  if (error) {
      console.error('Error al eliminar cliente:', error);
      return;
  }

  // Eliminar el acordeón del DOM
  button.closest('.accordion-item').remove();
};


// Llamar a la función cuando el documento esté listo
document.addEventListener("DOMContentLoaded", obtenerClientes);

//Guardar servicio

window.guardarServicio = async function () {
  const clienteID = document.getElementById("clienteID").value; // Obtener el ID del cliente seleccionado
  const tipoServicio = document.getElementById("tiposervicio").value;
  const detalleServicio = document.getElementById("detalleservicio").value;
  const estado = document.getElementById("estado").value;
  const fechaCreacion = document.getElementById("fechaCreacion").value || new Date().toISOString();
  const fechaCierre = document.getElementById("fechaCierre").value || null;

  if (!clienteID || !tipoServicio || !detalleServicio) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
  }

  // Verificar si el cliente existe antes de guardar el servicio
  const { data: clienteData, error: clienteError } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', clienteID)
      .single(); // Aseguramos que obtenemos un solo resultado

  if (clienteError || !clienteData) {
      alert("El cliente no existe. Por favor, selecciona un cliente válido.");
      return;
  }

  // Si el cliente existe, proceder a insertar el servicio
  const { data, error } = await supabase.from("servicios").insert([
      {
          cliente_id: clienteID, // Guardar el ID del cliente, no el DNI
          tipo_servicio: tipoServicio,
          detalle: detalleServicio,
          estado: estado,
          fecha_creacion: fechaCreacion,
          fecha_cierre: fechaCierre
      }
  ]);

  if (error) {
      console.error("Error al guardar servicio:", error);
      alert("Hubo un error al guardar el servicio.");
  } else {
      console.log("Servicio guardado:", data);
      alert("Servicio guardado correctamente.");

      // Cerrar el modal y limpiar formulario
      const modalServicio = bootstrap.Modal.getInstance(document.getElementById("servicio"));
      if (modalServicio) modalServicio.hide();
      document.getElementById("formServicio").reset();
  }
};


//Informacion del servicio en el acordion de notificaciones

const mostrarServiciosEnAcordeon = async () => {
    const { data, error } = await supabase.from('servicios').select(`
        id, 
        tipo_servicio, 
        detalle, 
        estado, 
        fecha_creacion, 
        fecha_cierre, 
        clientes (nombre)
    `);

    if (error) {
        console.error('Error al obtener servicios:', error);
        return;
    }

    // Filtrar solo los servicios que no estén cancelados o completados
    const serviciosPendientes = data.filter(servicio => 
        servicio.estado !== "Cancelado" && servicio.estado !== "Completado"
    );

    const contenedor = document.getElementById("accordionServicios");
    contenedor.innerHTML = ""; // Limpiar contenido previo

    serviciosPendientes.forEach((servicio, index) => {
        const acordeonItem = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="false" aria-controls="collapse${index}">
                        ${servicio.tipo_servicio} - ${servicio.clientes ? servicio.clientes.nombre : "No asignado"}
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" aria-labelledby="heading${index}" data-bs-parent="#accordionServicios">
                    <div class="accordion-body">
                        <p><strong>Detalle:</strong> ${servicio.detalle}</p>
                        <p><strong>Estado:</strong> ${servicio.estado}</p>
                        <p><strong>Fecha Creación:</strong> ${new Date(servicio.fecha_creacion).toLocaleDateString()}</p>
                        <p><strong>Fecha Cierre:</strong> ${servicio.fecha_cierre ? new Date(servicio.fecha_cierre).toLocaleDateString() : "Pendiente"}</p>
                        <button class="btn btn-warning btn-sm" onclick="editarServicio(${servicio.id})">Editar</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += acordeonItem;
    });
};

// Cargar acordeón al iniciar
document.addEventListener("DOMContentLoaded", mostrarServiciosEnAcordeon);


//boton de notificacion

const actualizarContadorServicios = async () => {
    const { data, error } = await supabase.from('servicios').select('*').eq('estado', 'Pendiente'); // Filtrar solo los pendientes

    if (error) {
        console.error('Error al obtener servicios:', error);
        return;
    }

    // Obtener la cantidad de servicios y actualizar el número en la notificación
    const contador = document.getElementById("contadorServicios");
    contador.textContent = data.length; // Actualizar el contador
    contador.style.display = data.length > 0 ? "inline-block" : "none"; // Ocultar si no hay servicios
};

setInterval(actualizarContadorServicios, 10000); // Actualiza cada 10 segundos


// Llamar la función cada vez que se carguen los servicios
document.addEventListener("DOMContentLoaded", actualizarContadorServicios);


//Servicios.html

const obtenerServicios = async () => {
    const { data, error } = await supabase.from('servicios').select(`
        id, 
        tipo_servicio, 
        detalle, 
        estado, 
        fecha_creacion, 
        fecha_cierre, 
        clientes (id, nombre, dni_rnc, telefono, correo, direccion)
    `);

    if (error) {
        console.error('Error al obtener servicios:', error);
        return;
    }

    const tabla = document.getElementById("tablaServicios");
    tabla.innerHTML = "";

    data.forEach(servicio => {
        const fila = `
            <tr>
                <td>${servicio.id}</td>
                <td>${servicio.clientes ? servicio.clientes.nombre : "No asignado"}</td>
                <td>${servicio.tipo_servicio}</td>
                <td>${servicio.detalle}</td>
                <td>${servicio.estado}</td>
                <td>${new Date(servicio.fecha_creacion).toLocaleDateString()}</td>
                <td>${servicio.fecha_cierre ? new Date(servicio.fecha_cierre).toLocaleDateString() : "Pendiente"}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarServicio(${servicio.id})">Editar</button>
                    <button class="btn btn-secondary btn-sm" onclick="cargarFactura(${servicio.id})" data-bs-toggle="modal" data-bs-target="#modalFacturar">Facturar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
};


// Función para cargar los datos en el modal de facturación
window.cargarFactura = async (servicioId) => {
    console.log("Cargando factura para servicio ID:", servicioId);

    const { data: servicio, error } = await supabase
        .from('servicios')
        .select(`
            id, 
            tipo_servicio, 
            detalle, 
            estado, 
            fecha_creacion, 
            clientes (id, nombre, dni_rnc, telefono, correo, direccion)
        `)
        .eq('id', servicioId)
        .single();

    if (error || !servicio) {
        console.error('Error al obtener el servicio:', error);
        return;
    }

    // Asignar datos a los elementos del modal
    document.getElementById("facturaNumero").textContent = `#${servicio.id}`;
    document.getElementById("facturaFecha").textContent = new Date(servicio.fecha_creacion).toLocaleDateString();

    const clienteNombre = document.getElementById("clienteNombre");
    clienteNombre.textContent = servicio.clientes ? servicio.clientes.nombre : "No disponible";
    clienteNombre.dataset.id = servicio.clientes ? servicio.clientes.id : ""; // Guardar ID en dataset

    document.getElementById("clienteDNI").textContent = servicio.clientes ? servicio.clientes.dni_rnc : "No disponible";
    document.getElementById("clienteTelefono").textContent = servicio.clientes ? servicio.clientes.telefono : "No disponible";
    document.getElementById("clienteCorreo").textContent = servicio.clientes ? servicio.clientes.correo : "No disponible";
    document.getElementById("clienteDireccion").textContent = servicio.clientes ? servicio.clientes.direccion : "No disponible";

    const facturaTrabajo = document.getElementById("facturaTrabajo");
    facturaTrabajo.textContent = servicio.tipo_servicio;
    facturaTrabajo.dataset.id = servicio.id; // Guardar ID del servicio

    document.getElementById("facturaDetalle").textContent = servicio.detalle;

    console.log("Datos cargados en el modal correctamente.");
};


document.addEventListener("DOMContentLoaded", () => {
    // Verifica que los elementos existen antes de ejecutar cualquier acción
    const btnAgregarProducto = document.getElementById("agregarProducto");
    const tablaCuerpo = document.getElementById("cuerpoTabla");

    if (!btnAgregarProducto || !tablaCuerpo) {
        console.error("Error: No se encontraron elementos clave del formulario.");
        return;
    }

    btnAgregarProducto.addEventListener("click", () => {
        const cantidadInput = document.getElementById("inputCantidad");
        const descripcionInput = document.getElementById("inputDescripcion"); // Ahora el usuario ingresa la descripción manualmente
        const precioUnitarioInput = document.getElementById("inputPrecio");

        if (!cantidadInput || !descripcionInput || !precioUnitarioInput) {
            console.error("Error: Uno o más elementos del formulario no existen.");
            return;
        }

        const cantidad = cantidadInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        const precioUnitario = parseFloat(precioUnitarioInput.value);

        if (!cantidad || !descripcion || isNaN(precioUnitario) || precioUnitario <= 0) {
            alert("Por favor, ingresa una cantidad, descripción y precio unitario válidos.");
            return;
        }

        const precioTotal = cantidad * precioUnitario;

        // Crear nueva fila en la tabla
        const nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${cantidad}</td>
            <td>${descripcion}</td>
            <td>${precioUnitario.toFixed(2)}</td>
            <td>${precioTotal.toFixed(2)}</td>
            <td><button class="btn btn-danger btn-sm btnEliminar">Eliminar</button></td>
        `;

        // Agregar evento al botón de eliminar
        nuevaFila.querySelector(".btnEliminar").addEventListener("click", function() {
            nuevaFila.remove();
            actualizarTotales();
        });

        // Agregar la fila a la tabla
        tablaCuerpo.appendChild(nuevaFila);
        actualizarTotales();

        // Limpiar los campos después de agregar el producto
        cantidadInput.value = "";
        descripcionInput.value = "";
        precioUnitarioInput.value = "";
    });

    function actualizarTotales() {
        let subtotal = 0;
        document.querySelectorAll("#cuerpoTabla tr").forEach(row => {
            const total = parseFloat(row.children[3].textContent);
            subtotal += total;
        });

        const impuestos = subtotal * 0.18; // 18% de impuestos
        const totalFinal = subtotal + impuestos;

        document.getElementById("subtotalFactura").textContent = subtotal.toFixed(2);
        document.getElementById("impuestosFactura").textContent = impuestos.toFixed(2);
        document.getElementById("totalFactura").textContent = totalFinal.toFixed(2);
    }
});

document.getElementById("abrirInventario").addEventListener("click", async () => {
    const { data: inventario, error } = await supabase.from("inventario").select("id, nombre, precio_unitario");

    if (error) {
        console.error("Error al obtener el inventario:", error);
        alert("No se pudo cargar el inventario.");
        return;
    }

    let opciones = inventario.map(prod => `<option value="${prod.id}" data-precio="${prod.precio_unitario}">${prod.nombre}</option>`).join("");

    let selectHTML = `
        <label for="selectProductoInventario">Seleccione un producto:</label>
        <select id="selectProductoInventario" class="form-select">
            <option value="">-- Seleccionar --</option>
            ${opciones}
        </select>
    `;

    Swal.fire({
        title: "Seleccionar Producto",
        html: selectHTML,
        showCancelButton: true,
        confirmButtonText: "Agregar",
        preConfirm: () => {
            let selectElement = document.getElementById("selectProductoInventario");
            let selectedOption = selectElement.options[selectElement.selectedIndex];

            if (!selectedOption.value) {
                Swal.showValidationMessage("Debe seleccionar un producto.");
                return false;
            }

            return {
                id: selectedOption.value,
                nombre: selectedOption.text,
                precio: parseFloat(selectedOption.dataset.precio)
            };
        }
    }).then(result => {
        if (result.isConfirmed) {
            document.getElementById("inputDescripcion").value = result.value.nombre;
            document.getElementById("inputPrecio").value = result.value.precio;
            document.getElementById("inputCantidad").value = 1;
            document.getElementById("inputTotal").value = result.value.precio;
        }
    });
});



const filtrarServicios = () => {
    const filtro = document.getElementById("busqueda").value.toLowerCase();
    const filas = document.querySelectorAll("#tablaServicios tr");

    filas.forEach(fila => {
        const texto = fila.innerText.toLowerCase();
        fila.style.display = texto.includes(filtro) ? "" : "none";
    });
};

document.addEventListener("DOMContentLoaded", obtenerServicios);

//Editar Servicio

window.editarServicio = async (id) => {
    console.log("Intentando editar el servicio con ID:", id); // Verifica si la función se ejecuta

    const { data, error } = await supabase
        .from('servicios')
        .select(`
            id, 
            tipo_servicio, 
            detalle, 
            estado, 
            fecha_creacion, 
            fecha_cierre, 
            clientes (nombre)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error al obtener servicio:', error);
        return;
    }

    // Verificar si los elementos existen antes de asignar valores
    const editId = document.getElementById('editServicioId');
    const editCliente = document.getElementById('editNombreCliente');
    const editTipo = document.getElementById('editTipoServicio');
    const editDetalle = document.getElementById('editDetalleServicio');
    const editEstado = document.getElementById('editEstadoServicio');
    const editFechaCreacion = document.getElementById('editFechaCreacion');
    const editFechaCierre = document.getElementById('editFechaCierre');

    if (!editId || !editCliente || !editTipo || !editDetalle || !editEstado || !editFechaCreacion || !editFechaCierre) {
        console.error("Uno o más elementos del modal no fueron encontrados.");
        return;
    }

    // Llenar el modal con los datos obtenidos
    editId.value = data.id;
    editCliente.value = data.clientes ? data.clientes.nombre : "No asignado";
    editTipo.value = data.tipo_servicio;
    editDetalle.value = data.detalle;
    editEstado.value = data.estado;
    editFechaCreacion.value = data.fecha_creacion ? data.fecha_creacion.split('T')[0] : '';
    editFechaCierre.value = data.fecha_cierre ? data.fecha_cierre.split('T')[0] : '';

    // Mostrar el modal
    console.log("Mostrando modal de edición...");
    const modal = new bootstrap.Modal(document.getElementById('modalEditarServicio'));
    modal.show();
};

window.guardarCambiosServicio = async () => {
    console.log("Guardando cambios en el servicio...");

    // Obtener valores del formulario
    const id = document.getElementById('editServicioId').value;
    const tipo = document.getElementById('editTipoServicio').value;
    const detalle = document.getElementById('editDetalleServicio').value;
    const estado = document.getElementById('editEstadoServicio').value;
    const fechaCierre = document.getElementById('editFechaCierre').value;

    // Verificar si los elementos existen antes de actualizar
    if (!id || !tipo || !detalle || !estado) {
        console.error("Faltan datos para actualizar el servicio.");
        return;
    }

    // Enviar actualización a Supabase
    const { error } = await supabase
        .from('servicios')
        .update({
            tipo_servicio: tipo,
            detalle: detalle,
            estado: estado,
            fecha_cierre: fechaCierre || null,
        })
        .eq('id', id);

    if (error) {
        console.error("Error al actualizar servicio:", error);
        return;
    }

    console.log("Servicio actualizado correctamente.");

    // Cerrar el modal después de guardar
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarServicio'));
    modal.hide();

    // Opcional: Recargar la tabla para mostrar los cambios
    obtenerServicios();
};


//agregar producto nuevo 

document.addEventListener("DOMContentLoaded", () => {
    // Agregar evento al botón de guardar
    const btnGuardar = document.getElementById("guardarProductoBtn");
    if (btnGuardar) {
        btnGuardar.addEventListener("click", agregarProducto);
    } else {
        console.error("El botón de guardar no fue encontrado.");
    }

    // Cargar inventario al cargar la página
    obtenerInventario();
});

// Función para agregar un nuevo producto
const agregarProducto = async () => {
    console.log("Intentando agregar un producto...");

    // Obtener los valores del formulario
    const nombre = document.getElementById("nombreProducto")?.value.trim();
    const descripcion = document.getElementById("descripcionProducto")?.value.trim();
    const cantidad = parseInt(document.getElementById("cantidadProducto")?.value);
    const precio = parseFloat(document.getElementById("precioProducto")?.value);

    // Verificar que los elementos existen y los valores son válidos
    if (!nombre || isNaN(cantidad) || isNaN(precio)) {
        console.error("Uno o más campos no son válidos.");
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    // Enviar a la base de datos Supabase
    const { data, error } = await supabase.from("inventario").insert([
        {
            nombre,
            descripcion,
            cantidad,
            precio_unitario: precio,
        },
    ]);

    if (error) {
        console.error("Error al guardar en Supabase:", error);
        alert("Hubo un error al guardar el producto.");
    } else {
        console.log("Producto guardado correctamente:", data);
        alert("Producto agregado exitosamente.");
        obtenerInventario(); // Actualizar la tabla
        limpiarFormulario();
    }
};

// Función para obtener el inventario y mostrarlo en la tabla
window.obtenerInventario = async () => {
    const { data, error } = await supabase.from('inventario').select('*');

    if (error) {
        console.error('Error al obtener inventario:', error);
        return;
    }

    const tabla = document.getElementById("tablaInventario");
    tabla.innerHTML = ""; // Limpiar tabla antes de agregar los datos

    data.forEach(producto => {
        const fila = `
            <tr>
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>${producto.descripcion || "Sin descripción"}</td>
                <td>${producto.cantidad}</td>
                <td>${producto.precio_unitario.toFixed(2)}</td>
                <td>
                    <button class="btn btn-success btn-sm" onclick="ingresarProducto(${producto.id}, ${producto.cantidad}, ${producto.precio_unitario})">
                        Ingresar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </td>
            </tr>
        `;
        tabla.innerHTML += fila;
    });
};

// Función para ingresar cantidad y actualizar precio
window.ingresarProducto = async (id, cantidadActual, precioActual) => {
    // Preguntar cuánta cantidad desea ingresar
    let cantidadIngresada = prompt("Ingrese la cantidad a agregar:", "0");
    cantidadIngresada = parseInt(cantidadIngresada, 10);

    if (isNaN(cantidadIngresada) || cantidadIngresada < 0) {
        alert("Cantidad inválida.");
        return;
    }

    const nuevaCantidad = cantidadActual + cantidadIngresada;

    // Preguntar si desea actualizar el precio
    let actualizarPrecio = confirm("¿Desea cambiar el precio del producto?");
    let nuevoPrecio = precioActual;

    if (actualizarPrecio) {
        let precioIngresado = prompt("Ingrese el nuevo precio:", precioActual);
        nuevoPrecio = parseFloat(precioIngresado);

        if (isNaN(nuevoPrecio) || nuevoPrecio < 0) {
            alert("Precio inválido.");
            return;
        }
    }

    // Actualizar en la base de datos
    const { error } = await supabase
        .from('inventario')
        .update({ cantidad: nuevaCantidad, precio_unitario: nuevoPrecio })
        .eq('id', id);

    if (error) {
        console.error('Error al actualizar el producto:', error);
        alert("Hubo un error al actualizar el producto.");
        return;
    }

    alert("Producto actualizado correctamente.");
    obtenerInventario(); // Refrescar la tabla
};

// Llamar a la función cuando cargue la página
document.addEventListener("DOMContentLoaded", obtenerInventario);


document.getElementById("buscadorInventario").addEventListener("input", function () {
    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll("#tablaInventario tr");

    filas.forEach((fila) => {
      let nombre = fila.children[1]?.textContent.toLowerCase() || "";
      fila.style.display = nombre.includes(filtro) ? "" : "none";
    });
  });

// Función para limpiar el formulario después de guardar
const limpiarFormulario = () => {
    document.getElementById("nombreProducto").value = "";
    document.getElementById("descripcionProducto").value = "";
    document.getElementById("cantidadProducto").value = "";
    document.getElementById("precioProducto").value = "";
};



window.eliminarProducto = async (id) => {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (!confirmacion) return;

    const { error } = await supabase.from('inventario').delete().match({ id });

    if (error) {
        console.error("Error al eliminar producto:", error);
    } else {
        alert("Producto eliminado correctamente");
        obtenerInventario(); // Recargar la tabla
    }
};


//Guardar la factura

document.getElementById("guardarFactura").addEventListener("click", async () => {
    const clienteId = document.getElementById("clienteNombre").dataset.id; // Asegurar que tenga el ID correcto
    const servicioId = document.getElementById("facturaNumero").textContent.replace("#", ""); 
    const totalFactura = parseFloat(document.getElementById("totalFactura").textContent) || 0;
    const condicionesPago = document.getElementById("condicionesPago").value;

    if (!clienteId || !servicioId || totalFactura <= 0) {
        console.error("Faltan datos o el total no es válido.");
        return;
    }

    try {
        // **1️⃣ Insertar la factura en la tabla `facturas`**
        let { data: factura, error: facturaError } = await supabase
            .from("facturas")
            .insert([{ 
                cliente_id: clienteId,
                servicio_id: servicioId,
                total: totalFactura,
                condiciones_pago: condicionesPago
            }])
            .select()
            .single();

        if (facturaError) {
            console.error("Error al guardar la factura:", facturaError);
            return;
        }

        const facturaId = factura.id;
        console.log("Factura guardada con ID:", facturaId);

        // **2️⃣ Insertar los detalles de la factura en `detalle_factura`**
        const filasTabla = document.querySelectorAll("#cuerpoTabla tr");
        let detalles = [];

        filasTabla.forEach((fila) => {
            const cantidad = parseInt(fila.cells[0].textContent);
            const descripcion = fila.cells[1].textContent;
            const precioUnitario = parseFloat(fila.cells[2].textContent);
            const precioTotal = parseFloat(fila.cells[3].textContent);
            const subtotal = cantidad * precioUnitario; // 👈 **Calculando el subtotal**

            detalles.push({
                factura_id: facturaId,
                descripcion: descripcion,
                cantidad: cantidad,
                precio_unitario: precioUnitario,
                subtotal: subtotal,  // 👈 **Incluyendo el subtotal**
                precio_total: precioTotal
            });
        });

        if (detalles.length > 0) {
            let { error: detallesError } = await supabase
                .from("detalle_factura")
                .insert(detalles);

            if (detallesError) {
                console.error("Error al guardar los detalles:", detallesError);
                return;
            }
            console.log("Detalles de factura guardados correctamente.");
        }

        alert("Factura guardada con éxito.");
        location.reload(); // Recargar la página para limpiar el modal
    } catch (error) {
        console.error("Error inesperado:", error);
    }
});


// Mostrar facturas guardadas
document.getElementById("modalFactura").addEventListener("show.bs.modal", async () => {
    const tablaFacturas = document.getElementById("tablaFacturas");
    tablaFacturas.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

      // 1️⃣ Obtener todas las facturas con datos de clientes
      let { data: facturas, error } = await supabase
      .from("facturas")
      .select("id, total, fecha, clientes (nombre)"); 
  
      if (error) {
          console.error("Error al obtener facturas:", error);
          return;
      }
  
      // 2️⃣ Limpiar la tabla y agregar las facturas
      tablaFacturas.innerHTML = "";
      facturas.forEach((factura, index) => {
          // Formatear la fecha
          const fechaFormateada = formatearFecha(factura.fecha);
  
          let fila = `
              <tr>
                  <td>${factura.id}</td>
                  <td>${factura.clientes?.nombre || "Sin cliente"}</td>
                  <td>$${factura.total.toFixed(2)}</td>
                  <td>${fechaFormateada}</td>
                  <td>
                      <button class="btn btn-primary btn-sm" onclick="verFactura(${factura.id})">Ver</button>
                      <button class="btn btn-danger btn-sm" onclick="eliminarFactura(${factura.id})">Eliminar</button>
                  </td>
              </tr>
          `;
          tablaFacturas.innerHTML += fila;
      });
  });
  

// Función para formatear la fecha
function formatearFecha(fecha) {
    // Reemplazar el espacio por 'T' y eliminar la parte de los milisegundos
    const fechaValida = fecha.replace(" ", "T").split(".")[0] + "Z"; // Agregar 'Z' para indicar UTC
    const fechaObj = new Date(fechaValida);
    
    // Verificar si la fecha es válida
    if (isNaN(fechaObj.getTime())) {
        return "Fecha no válida";
    }

    const opciones = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return fechaObj.toLocaleDateString('es-ES', opciones);
}

// En tu función verFactura
window.verFactura = async function(facturaId) {
    console.log("Cargando factura ID:", facturaId);

    const { data: factura, error } = await supabase
        .from("facturas")
        .select(`
            id, fecha, total, condiciones_pago, 
            clientes (nombre, dni_rnc, telefono, correo, direccion), 
            detalle_factura (id, descripcion, cantidad, precio_unitario, precio_total)
        `)
        .eq("id", facturaId)
        .single();

    if (error || !factura) {
        console.error("Error al obtener la factura:", error);
        return;
    }

    // Llenar los datos en el modal
    document.getElementById("facturaNumero").textContent = `#${factura.id}`;
    
    // Manejo de la fecha
    if (factura.fecha) {
        document.getElementById("facturaFecha").textContent = formatearFecha(factura.fecha);
    } else {
        document.getElementById("facturaFecha").textContent = "Fecha no disponible";
    }

    document.getElementById("clienteNombre").textContent = factura.clientes.nombre;
    document.getElementById("clienteDNI").textContent = factura.clientes.dni_rnc;
    document.getElementById("clienteTelefono").textContent = factura.clientes.telefono;
    document.getElementById("clienteCorreo").textContent = factura.clientes.correo;
    document.getElementById("clienteDireccion").textContent = factura.clientes.direccion;
    document.getElementById("condicionesPago").value = factura.condiciones_pago;
    document.getElementById("totalFactura").textContent = factura.total;

    // Limpiar la tabla antes de agregar los nuevos detalles
    const cuerpoTabla = document.getElementById("cuerpoTabla");
    cuerpoTabla.innerHTML = "";

    // Verificar si hay detalles de factura
    if (!factura.detalle_factura || factura.detalle_factura.length === 0) {
        cuerpoTabla.innerHTML = "<tr><td colspan='4' class='text-center'>No hay productos en esta factura</td></tr>";
    } else {
        // Agregar los detalles de la factura a la tabla
        factura.detalle_factura.forEach(detalle => {
            let fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${detalle.cantidad}</td>
                <td>${detalle.descripcion}</td>
                <td>${detalle.precio_unitario.toFixed(2)}</td>
                <td>${detalle.precio_total.toFixed(2)}</td>
            `;
            cuerpoTabla.appendChild(fila);
        });
    }

    // Mostrar el modal
    let modal = new bootstrap.Modal(document.getElementById("modalFacturar"));
    modal.show();
};



// Función para eliminar una factura
window.eliminarFactura = async function(id) {
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta factura?");
    if (!confirmacion) return;

    // 3️⃣ Eliminar la factura
    const { error } = await supabase
    .from("facturas")
    .delete()
    .eq("id", id);

    if (error) {
        console.error("Error al eliminar la factura:", error);
        alert("Error al eliminar la factura. Inténtalo de nuevo.");
    } else {
        alert("Factura eliminada con éxito.");
        // Volver a cargar las facturas después de eliminar
        document.getElementById("modalFactura").dispatchEvent(new Event('show.bs.modal'));
    }
}



//obtenes factura para la impresion

document.getElementById('btnImprimir').addEventListener('click', function() {
    const { jsPDF } = window.jspdf; // Asegurar acceso a jsPDF
    const doc = new jsPDF();

    // Obtener los datos de la factura desde el DOM
    const facturaId = document.getElementById('facturaNumero').textContent.trim();
    const clienteNombre = document.getElementById('clienteNombre').textContent;
    const clienteDNI = document.getElementById('clienteDNI').textContent;
    const clienteTelefono = document.getElementById('clienteTelefono').textContent;
    const clienteCorreo = document.getElementById('clienteCorreo').textContent;
    const clienteDireccion = document.getElementById('clienteDireccion').textContent;
    const condicionesPago = document.getElementById('condicionesPago').value;
    const totalFactura = document.getElementById('totalFactura').textContent;

    // Obtener los detalles de la factura
    const detalles = [];
    const filas = document.getElementById("cuerpoTabla").getElementsByTagName("tr");
    for (let fila of filas) {
        const columnas = fila.getElementsByTagName("td");
        if (columnas.length > 0) {
            detalles.push([
                columnas[0].textContent, // Cantidad
                columnas[1].textContent, // Descripción
                columnas[2].textContent, // Precio Unitario
                columnas[3].textContent  // Precio Total
            ]);
        }
    }

    // Agregar el logo
    doc.addImage('img/Getel.PNG', 'PNG', 10, 10, 30, 30);

    // Título de la factura
    doc.setFontSize(20);
    doc.text('Factura', 100, 30);

    // Información de la empresa
    doc.setFontSize(12);
    doc.text('Getel', 10, 50);
    doc.text('Servicio Profesional', 10, 60);
    doc.text('Santo Domingo, Republica Dominicana.', 10, 70);
    doc.text('Tel. +1 (829) 925-3567', 10, 80);
    doc.text('Correo: Getel@gmail.com', 10, 90);

    // Información de la factura
    doc.text(`N° FACTURA: ${facturaId}`, 150, 50);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 60);
    doc.text(`Cliente: ${clienteNombre}`, 150, 70);
    doc.text(`DNI/RNC: ${clienteDNI}`, 150, 80);
    doc.text(`Teléfono: ${clienteTelefono}`, 150, 90);
    doc.text(`Correo: ${clienteCorreo}`, 150, 100);
    doc.text(`Dirección: ${clienteDireccion}`, 150, 110);

    // Tabla con detalles de la factura
    doc.autoTable({
        startY: 130,
        head: [['Cantidad', 'Descripción', 'P. Unit.', 'P. Total']],
        body: detalles
    });

    // Total y condiciones de pago
    let finalY = doc.lastAutoTable.finalY + 10; // Obtener la posición final de la tabla
    doc.text(`Condiciones de pago: ${condicionesPago}`, 10, finalY);
    doc.text(`Total: ${totalFactura}`, 150, finalY);

    // Guardar el PDF
    doc.save(`factura_${facturaId}.pdf`);
});
