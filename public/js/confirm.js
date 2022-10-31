let table = document.querySelector("table");

table.addEventListener("click", (e) => {
  const t = e.target,
    d = t.dataset;
  if (d.userdelete) {
    if (
      confirm(
        `¿Está seguro de eliminar el registro con el ID: ${d.userdelete}?`
      )
    ) {
      window.location = `/delete/${d.userdelete}`;
    }
  }
});
