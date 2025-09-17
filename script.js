// Firebase SDK'ları global olarak yüklendiği için import kullanmıyoruz.

// Firebase Konfigürasyonu (Bu kısımları değiştirme)
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

// Veritabanındaki 'messages' referansına bağlan
const messagesRef = ref(db, "messages");

// Kullanıcı adı kontrolü
const username = localStorage.getItem("chatUser");
if (!username) {
  window.location.href = "index.html"; // Kullanıcı adı girilmemişse giriş sayfasına yönlendir
}

// Admin kontrolü (giriş yapan kullanıcı adminse)
if (username === "admin123") {
  document.getElementById("clearBtn").style.display = "block"; // Admin'in mesajları temizleyebilmesi için butonu göster
}

// Mesaj gönderme fonksiyonu
function sendMessage() {
  const msgInput = document.getElementById("messageInput");
  const text = msgInput.value.trim(); // Mesajı al

  if (text === "") {
    console.log("Mesaj boş, gönderilemiyor.");
    return; // Eğer mesaj boşsa, gönderme işlemi yapılmaz
  }

  // Firebase'e mesajı gönderme
  push(messagesRef, {
    user: username,
    text: text,
    time: Date.now()
  })
  .then(() => {
    console.log("Mesaj başarıyla gönderildi!"); // Mesaj başarıyla gönderildiği zaman konsola yazdırılır
  })
  .catch((error) => {
    console.error("Mesaj gönderilirken bir hata oluştu:", error); // Eğer hata olursa konsola yazdırılır
  });

  msgInput.value = ""; // Mesaj kutusunu temizle
}

// Gelen mesajları ekranda göstermek için fonksiyon
function displayMessage(data) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message");
  msgDiv.textContent = `${data.user}: ${data.text}`;
  document.getElementById("messages").appendChild(msgDiv);
  console.log("Mesaj ekrana yazıldı:", data); // Mesaj ekrana yazıldığında konsola yazdırılır
}

// Firebase'den gelen verileri dinle
onChildAdded(messagesRef, (snapshot) => {
  const message = snapshot.val();
  console.log("Yeni mesaj alındı:", message); // Yeni mesaj geldiğinde konsola yazdırılır
  displayMessage(message); // Yeni mesajı ekranda göster
});

// Admin'in sohbeti temizlemesi
function clearChat() {
  if (confirm("Tüm mesajları silmek istediğine emin misin?")) {
    set(messagesRef, {}); // Veritabanındaki mesajları temizler
    document.getElementById("messages").innerHTML = ""; // Ekrandaki mesajları siler
    console.log("Tüm mesajlar silindi!"); // Konsola yazdırılır
  }
}

// Fonksiyonu global olarak tanımla
window.sendMessage = sendMessage;
window.clearChat = clearChat;
