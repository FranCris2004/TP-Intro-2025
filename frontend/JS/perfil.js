document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) {
        window.location.href = "validacion.html?form=login";
        return;
    }

    const fechaInput = usuario.fecha_de_nacimiento.split("T")[0];
    document.getElementById("nombre-valor").textContent = usuario.nombre;
    document.getElementById("email-valor").textContent = usuario.email;
    document.getElementById("fecha-valor").textContent = fechaInput;
    document.getElementById("nombre").value = usuario.nombre;
    document.getElementById("email").value = usuario.email;
    document.getElementById("fecha").value = fechaInput;

    const datosPerfil = document.getElementById("datos-perfil");
    const formEdicion = document.getElementById("form-edicion");
    const formCambiarCont = document.getElementById("form-cambiar-cont");

    const btnEditar = document.getElementById("btn-editar");
    const btnCambiarCont = document.getElementById("btn-cambiar-cont");
    const btnBorrar = document.getElementById("btn-borrar");

    btnEditar.addEventListener("click", () => {
        datosPerfil.style.display = "none";
        formEdicion.style.display = "block";
        formCambiarCont.style.display = "none";
    });

    formEdicion.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nuevoNombre = document.getElementById("nombre").value.trim();
        const nuevoEmail = document.getElementById("email").value.trim();
        const nuevaFecha = document.getElementById("fecha").value;

        try {
            const res = await fetch(`http://localhost:3000/v1/usuario/${usuario.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: nuevoNombre || null,
                    email: nuevoEmail || null,
                    fecha_de_nacimiento: nuevaFecha || null
                })
            });

            if (!res.ok) throw new Error(await res.text());

            const usuarioActualizado = await res.json();
            localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

            alert("Perfil actualizado correctamente");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Error al actualizar el perfil", "error");
        }
    });
    btnCambiarCont.addEventListener("click", () => {
        datosPerfil.style.display = "none";
        formEdicion.style.display = "none";
        formCambiarCont.style.display = "block";
    });

    formCambiarCont.addEventListener("submit", async (e) => {
        e.preventDefault();

        const actual = document.getElementById("cont-actual").value.trim();
        const nueva = document.getElementById("cont-nueva").value.trim();
        const confirmar = document.getElementById("cont-confirmar").value.trim();

        if (nueva !== confirmar) {
            alert("Las contraseñas no coinciden", "error");
            return;
        }

        try {
            const res = await fetch(`http://localhost:3000/v1/usuario/${usuario.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: { id: usuario.id, contrasenia: actual },
                    nueva_contrasenia: nueva
                })
            });

            if (!res.ok) throw new Error(await res.text());

            alert("Contraseña cambiada correctamente");
            formCambiarCont.reset();
            datosPerfil.style.display = "block";
            formCambiarCont.style.display = "none";

        } catch (err) {
            console.error(err);
            alert("Error al cambiar la contraseña", "error");
        }
    });

    btnBorrar.addEventListener("click", async () => {
        if (!confirm("¿Seguro que quieres borrar tu cuenta? Esta acción no se puede deshacer y se eliminaran todas tus historias.")) return;

        try {
            const res = await fetch(`http://localhost:3000/v1/usuario/${usuario.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    auth: {
                        id: usuario.id,
                        contrasenia: prompt("Escribe tu contraseña para confirmar:")
                    }
                })
            });

            if (!res.ok) throw new Error(await res.text());

            localStorage.removeItem("usuario");
            alert("Cuenta eliminada correctamente");
            setTimeout(() => window.location.href = "validacion.html?form=registro", 1500);

        } catch (err) {
            console.error(err);
            alert("Error al eliminar la cuenta", "error");
        }
    });
});