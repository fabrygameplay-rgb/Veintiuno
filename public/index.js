let map = L.map("map").setView([-7.1617, -78.5128], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let searchMarkers = [];

function loadPlaces(lat, lng) {
    fetch(`/api/real-places?lat=${lat}&lng=${lng}`)
        .then(res => res.json())
        .then(data => {
            data.forEach(place => {
                L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`${place.name} (${place.type})`);
            });
        });
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const latitud = pos.coords.latitude;
            const longitud = pos.coords.longitude;

            map.setView([latitud, longitud], 14);

            userMarker = L.marker([latitud, longitud])
                .addTo(map)
                .bindPopup("We are here")
                .openPopup();
            loadPlaces(latitud, longitud);
        
        },

        () => {
            loadPlaces(-7.1617, -78.5128)
        }
    );
}

const searchInput = document.getElementById("searchButton");
console.log(searchInput);
searchInput.addEventListener("keyup", async (event) => {

    if (event.key !== "Enter") return;

    try {

        const response = await fetch(
            `/api/search?q=${encodeURIComponent(searchInput.value)}`
        );

        const data = await response.json();

        console.log(data);

        if (!data || data.length === 0) {
            alert("Place not found");
            return;
        }

        searchMarkers.forEach(marker => {
            map.removeLayer(marker);
        });

        searchMarkers = [];

        const first = data[0];

        const latitude = parseFloat(first.lat);
        const longitude = parseFloat(first.lon);

        map.flyTo([latitude, longitude], 15, {
            duration: 2
        });

        setTimeout(() => {

            map.invalidateSize();

            data.forEach(place => {

                const marker = L.marker([
                    parseFloat(place.lat),
                    parseFloat(place.lon)
                ])
                .addTo(map)
                .bindPopup(place.display_name);

                searchMarkers.push(marker);

            });

        }, 500);

    } catch(err) {

        console.error(err);
        alert("Search error");

    }

});

document.addEventListener("mouseover", (e) => {
    if (e.target.classList.contains("news")) {
        e.target.style.transform = "scale(1.1)";
    }
});

document.addEventListener("mouseout", (e) => {
    if (e.target.classList.contains("news")) {
        e.target.style.transform = "scale(1)";
    }
});

const track = document.getElementById("track");

let index = 0;
let autoSlide;

function getItemWidth() {
    return track.children[0].offsetWidth + 20;
}

function getMaxIndex() {
    return track.children.length - 3;
}

function updateCarousel() {
    track.style.transform =
    `translateX(-${index * getItemWidth()}px)`;
}

function nextSlide() {

    if (index < getMaxIndex()) {
        index++;
    } else {
        index = 0;
    }

    updateCarousel();
}

function prevSlide() {

    if (index > 0) {
        index--;
    } else {
        index = getMaxIndex();
    }

    updateCarousel();
}

document.querySelector(".next").addEventListener("click", () => {
    nextSlide();
});

document.querySelector(".prev").addEventListener("click", () => {
    prevSlide();
});

function startAuto() {

    autoSlide = setInterval(() => {
        nextSlide();
    }, 3000);

}

startAuto();

const track2 = document.getElementById("track2");
const columns = document.querySelectorAll(".column");

let index2 = 0;

function getColumnWidth() {
    return columns [0].offsetWidth + 20;
}

function uptade2() {
    track2.style.transform = 
    `translateX(-${index2 * getColumnWidth()}px)`;
}

document.querySelector(".next2").addEventListener("click", () => {
    if(index2 < columns.length -1) {
        index2++;
        uptade2();
    }
});

document.querySelector(".prev2").addEventListener("click", () => {
    if (index2 > 0) {
        index2--;
        uptade2();
    }
});

window.addEventListener("resize", uptade2);

const parameters = new URLSearchParams(window.location.search);
const prevalentViewAccount = parameters.get("view");

const firstButton = document.querySelector("#buttonOne");
const secondButton = document.querySelector("#buttonTwo");
const thirdButton = document.querySelector("#buttonThree");
const fourthbutton = document.querySelector("#buttonFour");

const buttonForLogOut = document.querySelector("#logOutButton");
const buttonForDeleteAccount = document.querySelector("#deleteButton");

function buttonSubmit() {

    if(firstButton) {
        firstButton.addEventListener("click", () => {
            localStorage.setItem("session", "logged");
            window.location.href = "index.html";
        });
    }

    if(thirdButton) {
        thirdButton.addEventListener("click", () => {
            localStorage.setItem("session", "logged");
            window.location.href="index.html";
        })
    }

    if(buttonForLogOut) {
        buttonForLogOut.addEventListener("click", () => {
            localStorage.removeItem("session");
            window.location.href="index.html";
        });
    }

    if(buttonForDeleteAccount) {
        buttonForDeleteAccount.addEventListener("click", () => {
            localStorage.removeItem("session");
            window.location.href = "index.html";
        });
    }
}

buttonSubmit();

let userMarker = null;

const buttonForCurrentLocation =
document.getElementById("locationButton");

buttonForCurrentLocation.addEventListener("click", () => {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const latitud = position.coords.latitude;
            const longitud = position.coords.longitude;

            console.log("My location:", latitud, longitud);

            // refresca el mapa
            map.invalidateSize();

            // mueve el mapa
            map.setView([latitud, longitud], 16);

            // elimina marcador viejo
            if (userMarker) {
                map.removeLayer(userMarker);
            }

            // nuevo marcador
            userMarker = L.marker([latitud, longitud])
                .addTo(map)
                .bindPopup("We are here")
                .openPopup();

            // cargar lugares cercanos
            loadPlaces(latitud, longitud);

        },

        (error) => {

            console.error(error);

            alert(
                "Location denied or unavailable"
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }

    );

});

const uploadArchivesButton = document.getElementById("uploadButton");

const gapForFiles = document.getElementById("fileInput");

    uploadArchivesButton.addEventListener("click", () => {
    
    gapForFiles.click();

});

gapForFiles.addEventListener("change", () => {
    const archive =  gapForFiles.files[0];

    if(!file)
    
        return;

    console.log(file);

    alert(`Selected file: ${file.name}`);

});

// ==========================
// SUPPORT CHAT (LEFT)
// ==========================

const chatWidget = document.createElement("div");

chatWidget.id = "chatWidget";

document.body.appendChild(chatWidget);

// FLOAT BUTTON
const chatToggle = document.createElement("button");

chatToggle.id = "chatToggle";
chatToggle.textContent = "🛟";

chatWidget.appendChild(chatToggle);

// CHAT BOX
const chatBox = document.createElement("div");

chatBox.id = "chatBox";

chatWidget.appendChild(chatBox);

// HEADER
const chatHeader = document.createElement("div");

chatHeader.id = "chatHeader";
chatHeader.textContent = "PetWatch Support";

chatBox.appendChild(chatHeader);

// MESSAGES
const chatMessages = document.createElement("div");

chatMessages.id = "chatMessages";

chatBox.appendChild(chatMessages);

// INPUT AREA
const chatInputArea = document.createElement("div");

chatInputArea.id = "chatInputArea";

chatBox.appendChild(chatInputArea);

// INPUT
const chatInput = document.createElement("input");

chatInput.type = "text";
chatInput.placeholder = "Write a message...";

chatInputArea.appendChild(chatInput);

// SEND BUTTON
const supportSendButton = document.createElement("button");

supportSendButton.textContent = "Send";

chatInputArea.appendChild(supportSendButton);

// FIRST MESSAGE
const firstMessage = document.createElement("p");

firstMessage.textContent = "Hello 👋";

chatMessages.appendChild(firstMessage);

// OPEN/CLOSE
chatToggle.addEventListener("click", () => {

    chatBox.classList.toggle("active");

});

// ==========================
// USER CHAT (RIGHT)
// ==========================

const userChatButton = document.createElement("button");

userChatButton.innerHTML = "💬 Messages";

document.body.appendChild(userChatButton);

// CHAT WINDOW
const userChatBox = document.createElement("div");

document.body.appendChild(userChatBox);

// HEADER
const userChatHeader = document.createElement("div");

userChatHeader.innerHTML = "PetWatch Chat";

userChatBox.appendChild(userChatHeader);

// ONLINE BAR
const onlineBar = document.createElement("div");

onlineBar.innerHTML = `
    <span style="color:lime;">●</span> 3 users online
`;

userChatBox.appendChild(onlineBar);

// MESSAGE AREA
const userMessages = document.createElement("div");

userChatBox.appendChild(userMessages);

// INPUT CONTAINER
const inputContainer = document.createElement("div");

userChatBox.appendChild(inputContainer);

// INPUT
const userInput = document.createElement("input");

userInput.type = "text";
userInput.placeholder = "Write a message...";

inputContainer.appendChild(userInput);

// SEND BUTTON
const sendButton = document.createElement("button");

sendButton.innerHTML = "➤";

inputContainer.appendChild(sendButton);

// OPEN/CLOSE
let userChatOpen = false;

userChatButton.addEventListener("click", () => {

    userChatOpen = !userChatOpen;

    if (userChatOpen) {

        userChatBox.style.display = "flex";

    } else {

        userChatBox.style.display = "none";

    }

});

// SEND MESSAGE
function sendMessage() {

    if (userInput.value.trim() === "") return;

    const message = document.createElement("div");

    message.innerHTML = userInput.value;

    message.style.alignSelf = "flex-end";
    message.style.background = "#0084ff";
    message.style.color = "white";
    message.style.padding = "10px";
    message.style.borderRadius = "10px";
    message.style.maxWidth = "70%";
    message.style.wordBreak = "break-word";

    userMessages.appendChild(message);

    userInput.value = "";

    userMessages.scrollTop = userMessages.scrollHeight;

    setTimeout(() => {

        const reply = document.createElement("div");

        reply.innerHTML = "Received 👍";

        reply.style.alignSelf = "flex-start";
        reply.style.background = "#e4e6eb";
        reply.style.padding = "10px";
        reply.style.borderRadius = "10px";
        reply.style.maxWidth = "70%";

        userMessages.appendChild(reply);

        userMessages.scrollTop = userMessages.scrollHeight;

    }, 1000);

}

sendButton.addEventListener("click", sendMessage);

userInput.addEventListener("keyup", (e) => {

    if (e.key === "Enter") {

        sendMessage();

    }

});

const style = document.createElement("style");

style.textContent = `

/* SUPPORT CHAT */

#chatWidget {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: 9999;
}

#chatToggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 24px;
    background: #00b894;
    color: white;
}

#chatBox {
    width: 320px;
    height: 420px;
    background: white;
    position: absolute;
    bottom: 80px;
    left: 0;
    border-radius: 15px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    opacity: 0;
    transform: translateY(20px);
    pointer-events: none;
    transition: 0.3s;
}

#chatBox.active {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
}

#chatHeader {
    padding: 15px;
    font-weight: bold;
    background: #00b894;
    color: white;
}

#chatMessages {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

#chatInputArea {
    display: flex;
    gap: 10px;
    padding: 10px;
}

#chatInput {
    flex: 1;
}

/* USER CHAT */

`;

document.head.appendChild(style);

// USER CHAT BUTTON
userChatButton.style.position = "fixed";
userChatButton.style.bottom = "20px";
userChatButton.style.right = "20px";
userChatButton.style.padding = "12px 18px";
userChatButton.style.border = "none";
userChatButton.style.borderRadius = "15px";
userChatButton.style.background = "#0084ff";
userChatButton.style.color = "white";
userChatButton.style.cursor = "pointer";
userChatButton.style.zIndex = "9999";
userChatButton.style.fontWeight = "bold";

// USER CHAT BOX
userChatBox.style.position = "fixed";
userChatBox.style.bottom = "80px";
userChatBox.style.right = "20px";
userChatBox.style.width = "320px";
userChatBox.style.height = "420px";
userChatBox.style.background = "white";
userChatBox.style.borderRadius = "15px";
userChatBox.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
userChatBox.style.display = "none";
userChatBox.style.flexDirection = "column";
userChatBox.style.overflow = "hidden";
userChatBox.style.zIndex = "9999";

// HEADER
userChatHeader.style.background = "#0084ff";
userChatHeader.style.color = "white";
userChatHeader.style.padding = "15px";
userChatHeader.style.fontWeight = "bold";

// ONLINE BAR
onlineBar.style.padding = "8px 15px";
onlineBar.style.fontSize = "14px";
onlineBar.style.borderBottom = "1px solid #ddd";

// MESSAGES
userMessages.style.flex = "1";
userMessages.style.padding = "10px";
userMessages.style.overflowY = "auto";
userMessages.style.display = "flex";
userMessages.style.flexDirection = "column";
userMessages.style.gap = "10px";

// INPUT CONTAINER
inputContainer.style.display = "flex";
inputContainer.style.padding = "10px";
inputContainer.style.borderTop = "1px solid #ccc";

// INPUT
userInput.style.flex = "1";
userInput.style.padding = "10px";
userInput.style.border = "1px solid #ccc";
userInput.style.borderRadius = "10px";

// SEND BUTTON
sendButton.style.marginLeft = "10px";
sendButton.style.border = "none";
sendButton.style.padding = "10px 14px";
sendButton.style.borderRadius = "10px";
sendButton.style.background = "#0084ff";
sendButton.style.color = "white";
sendButton.style.cursor = "pointer";