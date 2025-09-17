// Firebase SDK'larını içeri aktar
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onChildAdded, set } from "firebase/database";

// Firebase Konfigürasyonunu yap
const firebaseConfig = {
  apiKey: "AIzaSyAsJeUvmWmGDrNYfg9Eq7h-9cCk3IjHLLw",
  authDomain: "isotneder.firebaseapp.com",
  databaseURL: "https://isotneder-default-rtdb.firebaseio.com",
  projectId: "isotneder",
  storageBucket: "isotneder.firebasestorage.app",
  messagingSenderId: "536234322931",
  appId: "1:536234322931:web:61a1866b4521cc16e84086",
  measurementId: "G-Y4N97L71Z9"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");

// Kullanıcı adı kontrolü
const username = localStorage.getItem("chatUser");
if (!username) {
  window.location.href = "index.html";
}

// Admin kontrolü (giriş yapan kullanıcı adminse)
if (username === "admin123") {
  document.getElementById("clearBtn").style.display = "block";
}

// Mesaj gönderme fonksiyonu
function sendMessage() {
  const msgInput = document.getElementById("messageInput");
  const text = msgInput.value.trim();
  if (text === "") return;
  push(messagesRef, {
    user: username,
    text: text,
    time: Date.now()
  });
  msgInput.value = "";
}

// Mesajları ekrana yazdırma
function displayMessage(data) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.textContent = data.user + ": " + data.text;
  document.getElementById("messages").appendChild(msgDiv);
}

// Firebase'den gelen verileri dinleme
onChildAdded(messagesRef, (snapshot) => {
  displayMessage(snapshot.val());
});

// Admin'in sohbeti temizlemesi
function clearChat() {
  if (confirm("Tüm mesajları silmek istediğine emin misin?")) {
    set(messagesRef, {});
    document.getElementById("messages").innerHTML = "";
  }
}

window.sendMessage = sendMessage;
window.clearChat = clearChat;
