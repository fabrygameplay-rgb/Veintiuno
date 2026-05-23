const session = localStorage.getItem("session");

if(session === "logged") {
    document.documentElement.classList.add("logged");
}