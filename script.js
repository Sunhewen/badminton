function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    const timeString = `${hours}:${minutes}:${seconds}`;
    
    const liveClock = document.getElementById('live-clock');
    if (liveClock) liveClock.textContent = timeString;

    
}
setInterval(updateTime, 1000);
updateTime();


async function handleRegister() {
    const user = document.getElementById('reg-username').value;
    const pass = document.getElementById('reg-password').value;

    if (!user || !pass) return alert("please enter account and password");

    const response = await fetch('https://script.google.com/macros/s/AKfycbwByeNycKdopnUAhY6FbWZpQhrgRJyuxMrj-2xD_qv89GDu2q_x0RrnUtZNRs84szxcuw/exec', {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            action: "register",
            username: user,
            password: pass
        })
    });

    alert("require sent！");
}

async function handleLogin() {
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;

    const response = await fetch('https://script.google.com/macros/s/AKfycbwByeNycKdopnUAhY6FbWZpQhrgRJyuxMrj-2xD_qv89GDu2q_x0RrnUtZNRs84szxcuw/exec', {
        method: "POST",
        body: JSON.stringify({
            action: "login",
            username: user,
            password: pass
        })
    });
    console.log(user);
    console.log(pass);
    const result = await response.text();
    console.log(result);
    if (result === "登入成功") {
        alert("login successfully！");
        window.location.href = "./admin.html"; 
    } else {
        alert("login failed：" + result);
    }
}

function changecolor(){
    document.getElementById("sign-up").style.backgroundColor="#c4c4b0";
}
function changebackcolor(){
    document.getElementById("sign-up").style.backgroundColor="beige";
}
function changecolor2(){
    document.getElementById("sign-in").style.backgroundColor="#c4c4b0";
}
function changebackcolor2(){
    document.getElementById("sign-in").style.backgroundColor="beige";
}

function turntosignup(){
    window.location.href="./signup.html";
}

function turntosignin(){
    window.location.href="./signin.html";
}

function changesignin(){
    document.getElementById("enter-button").style.backgroundColor="rgb(117, 117, 141)";
}
function changesignin2(){
    document.getElementById("enter-button").style.backgroundColor="rgb(187, 187, 223)";
}

function toggleMode() {
    const mode = document.getElementById('match-mode').value;
    const inputArea = document.getElementById('input-area');
    const nameInputs = document.getElementById('name-inputs');
    const hint = document.getElementById('mode-hint');

    if (!mode) return

    inputArea.style.display = 'block';

    nameInputs.innerHTML = '';

    const labelText = (mode === 'single') ? 'Contestant' : 'Group';
    hint.innerText = `Enter ${labelText}s:`;

    for (let i = 1; i <= 16; i++) {
        const div = document.createElement('div');
        div.innerHTML = `
            <label>${labelText} ${i}</label>
            <input type="text" class="contestant-name" placeholder="Class / Name">
        `;
        nameInputs.appendChild(div);
    }
}

function syncToList() {
    const inputs = document.querySelectorAll('.contestant-name');
    const names = [];
    
    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            names.push(input.value.trim());
        }
    });

    if (names.length === 0) {
        alert("Please enter at least one name!");
        return;
    }

    const allSelects = document.querySelectorAll('.p1-select, .p2-select');

    allSelects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Select --</option>';
        
        names.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
        
        select.value = currentValue;
    });

    alert("List updated to all courts!");
}

function updateCourt(courtLetter) {
    const p1 = document.getElementById(`p1-${courtLetter}`).value;
    const p2 = document.getElementById(`p2-${courtLetter}`).value;
    
    const hh = document.getElementById(`hrs-${courtLetter}`).value;
    const mm = document.getElementById(`mins-${courtLetter}`).value;

    if (!p1 || !p2 || hh === "" || mm === "") {
        alert(`Make sure Court ${courtLetter} fields are fully filled!`);
        return;
    }

    const formattedTime = `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;

    const updateData = {
        court: courtLetter,
        player1: p1,
        player2: p2,
        matchTime: formattedTime
    };

    fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
    })
    .then(() => alert(`Court ${courtLetter} updated to ${formattedTime}!`))
    .catch(error => alert("Update failed."));
}

const scriptURL = "https://script.google.com/macros/s/AKfycbwByeNycKdopnUAhY6FbWZpQhrgRJyuxMrj-2xD_qv89GDu2q_x0RrnUtZNRs84szxcuw/exec";
async function fetchMatches() {
    const response = await fetch(`${scriptURL}?t=${Date.now()}`);
    const data = await response.json();
    
}

async function refreshHomeData() {
    if (!document.getElementById("home-p1-A")) return;

    try {
        const response = await fetch(`${scriptURL}?t=${Date.now()}`); 
        const data = await response.json();
        
        data.forEach(match => {
            const letter = match.court;
            const p1El = document.getElementById(`home-p1-${letter}`);
            const p2El = document.getElementById(`home-p2-${letter}`);
            const timeEl = document.getElementById(`home-time-${letter}`);

            if (p1El) p1El.innerText = match.player1 || "Waiting..."; 
            if (p2El) p2El.innerText = match.player2 || "Waiting..."; 
            
            if (timeEl) {
                let displayTime = "--:--";
                
                if (match.matchTime) {
                    let rawTime = match.matchTime.toString();

                    if (rawTime.includes("GMT")) {
                        const timeMatch = rawTime.match(/\d{2}:\d{2}:\d{2}/);
                        displayTime = timeMatch ? timeMatch[0] : rawTime.substring(0, 5);
                    } 
                    else if (rawTime.includes("T")) {
                        displayTime = rawTime.split("T")[1].substring(0, 8);
                    }
                    else {
                        displayTime = rawTime;
                    }
                }
                
                timeEl.innerText = displayTime;
                
                checkTimeAlert(letter, displayTime);
            }
        });
    } catch (e) {
        console.error("fetch failed：", e);
    }
}

if (document.getElementById("home-p1-A")){
    setInterval(refreshHomeData, 10000);
    refreshHomeData();
}

function checkTimeAlert(courtLetter, matchTime) {
    const timeDisplay = document.getElementById(`home-time-${courtLetter}`);
    if (!timeDisplay || !matchTime || matchTime === "--:--") return;

    const now = new Date();
    const parts = matchTime.split(':');
    if (parts.length < 2) return;

    const matchDate = new Date();
    matchDate.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0);

    if (now >= matchDate) {
        timeDisplay.style.color = "#ff4d4d";
        timeDisplay.style.fontSize = "large";
        timeDisplay.style.fontWeight = "bold";
        timeDisplay.innerHTML = `⚠️ Started at : ${matchTime}`;
    } else {
        timeDisplay.style.color = "#ffeb3b";
        timeDisplay.style.fontSize = "medium";
        timeDisplay.style.fontWeight = "normal";
        timeDisplay.style.fontWeight = "bold";
        timeDisplay.innerHTML = `Next: ${matchTime}`;
    }

}
