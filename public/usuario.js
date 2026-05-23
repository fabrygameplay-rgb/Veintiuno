const firstForm = document.querySelector("#f1");
const secondForm = document.querySelector("#f2");
const thirdForm = document.querySelector("#myUserFlex");

const advertisement7 = document.querySelector("#ad7");
const advertisement8 = document.querySelector("#ad8");
const advertisement9 = document.querySelector("#ad9");

const firstButton = document.querySelector("#buttonOne");
const secondButton = document.querySelector("#buttonTwo");
const thirdButton = document.querySelector("#buttonThree");
const fourthButton = document.querySelector("#buttonFour");

const buttonForLogOut = document.querySelector("#logOutButton");
const buttonForSubmitChanges = document.querySelector("#submitChangesButton");
const buttonForCancelChanges = document.querySelector("#cancelChangesButton");
const buttonForDeleteAccount = document.querySelector("#deleteButton");

const parameters = new URLSearchParams(window.location.search);
let prevalentViewAccount = parameters.get("view");

function transformViewAccount() {

    if(!firstForm || !secondForm || !thirdForm || !fourthButton) {
        return;
    }

    switch(prevalentViewAccount) {
        case "signIn":
            firstForm.style.display = "block";
            secondForm.style.display = "none";
            thirdForm.style.display = "none";
            advertisement7.style.display = "block";
            advertisement8.style.display = "none";
            advertisement9.style.display = "none";
        break;

        case "logIn":
            firstForm.style.display = "none";
            secondForm.style.display = "block";
            thirdForm.style.display = "none";
            advertisement7.style.display = "none";
            advertisement8.style.display = "block";
            advertisement9.style.display = "none";
        break;
        
        case "account":
            firstForm.style.display = "none";
            secondForm.style.display = "none";
            thirdForm.style.display = "block";
            advertisement7.style.display = "none";
            advertisement8.style.display = "none";
            advertisement9.style.display = "block";
        break;

        default:
            firstForm.style.display = "block";
            secondForm.style.display = "none";
            thirdForm.style.display = "none";
            advertisement7.style.display = "block";
            advertisement8.style.display = "none";
            advertisement9.style.display = "none";
    };

};

transformViewAccount();

function buttonSubmit() {

    if(firstButton) {
        firstButton.addEventListener("click", () => {
        localStorage.setItem("session", "logged");
        document.documentElement.classList.add("logged");
        window.location.href = "index.html";
        });
    }

    if(thirdButton) {
        thirdButton.addEventListener("click", () => {
        localStorage.setItem("session", "logged");
        document.documentElement.classList.add("logged");
        window.location.href = "index.html";
        })
    }

    if(fourthButton) {
        fourthButton.addEventListener("click", () => {
        window.location.href = "user.html?view=logins";
        });
    }

    if(buttonForDeleteAccount) {
        buttonForDeleteAccount.addEventListener("click", () => {
        localStorage.removeItem("session");
        document.documentElement.classList.add("logged");
        window.location.href = "index.html";
        });
    }
}

buttonSubmit();