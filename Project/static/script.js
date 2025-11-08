document.addEventListener("DOMContentLoaded", async () => {
    await loadChampionData();
    await loadProgressFromServer();
    renderChampions();
    updateStats();
});

const champions = [
    'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar', 'Ambessa', 'Amumu', 'Anivia', 'Annie', 'Aphelios', 'Ashe',
    'Aurelion Sol', 'Aurora', 'Azir', 'Bard', 'Bel\'Veth', 'Blitzcrank', 'Brand', 'Braum', 'Briar', 'Caitlyn',
    'Camille', 'Cassiopeia', 'Cho\'Gath', 'Corki', 'Darius', 'Diana', 'Dr. Mundo', 'Draven', 'Ekko', 'Elise',
    'Evelynn', 'Ezreal', 'Fiddlesticks', 'Fiora', 'Fizz', 'Galio', 'Gangplank', 'Garen', 'Gnar', 'Gragas',
    'Graves', 'Gwen', 'Hecarim', 'Heimerdinger', 'Hwei', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV',
    'Jax', 'Jayce', 'Jhin', 'Jinx', 'K\'Sante', 'Kai\'Sa', 'Kalista', 'Karma', 'Karthus', 'Kassadin',
    'Katarina', 'Kayle', 'Kayn', 'Kennen', 'Kha\'Zix', 'Kindred', 'Kled', 'Kog\'Maw', 'LeBlanc', 'Lee Sin',
    'Leona', 'Lillia', 'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'Master Yi',
    'Mel', 'Milio', 'Miss Fortune', 'Mordekaiser', 'Morgana', 'Naafiri', 'Nami', 'Nasus', 'Nautilus', 'Neeko', 'Nidalee',
    'Nilah', 'Nocturne', 'Nunu & Willump', 'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke', 'Qiyana',
    'Quinn', 'Rakan', 'Rammus', 'Rek\'Sai', 'Rell', 'Renata Glasc', 'Renekton', 'Rengar', 'Riven', 'Rumble',
    'Ryze', 'Samira', 'Sejuani', 'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen', 'Shyvana', 'Singed',
    'Sion', 'Sivir', 'Skarner', 'Smolder', 'Sona', 'Soraka', 'Swain', 'Sylas', 'Syndra', 'Tahm Kench',
    'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'Twisted Fate', 'Twitch',
    'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Vel\'Koz', 'Vex', 'Vi', 'Viego', 'Viktor',
    'Vladimir', 'Volibear', 'Warwick', 'Wukong', 'Xayah', 'Xerath', 'Xin Zhao', 'Yasuo', 'Yone', 'Yorick',
    'Yuumi', 'Yunara', 'Zac', 'Zed', 'Zeri', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'
];

let ownedChampions = new Set();
let currentFilter = 'all';
let searchTerm = '';
let championData = {};

async function loadChampionData() {
    try {
        const response = await fetch("https://ddragon.leagueoflegends.com/cdn/15.21.1/data/en_US/champion.json");
        const data = await response.json();
        championData = data.data;
    } catch (err) {
        console.error("❌ Failed to load champion data:", err);
    }
}

function getChampionIcon(championName) {
    const nameMap = {
        'Bel\'Veth': 'Belveth', 'Cho\'Gath': 'Chogath', 'Dr. Mundo': 'DrMundo', 'Jarvan IV': 'JarvanIV',
        'K\'Sante': 'KSante', 'Kai\'Sa': 'Kaisa', 'Kha\'Zix': 'Khazix', 'Kog\'Maw': 'KogMaw',
        'LeBlanc': 'Leblanc', 'Lee Sin': 'LeeSin', 'Master Yi': 'MasterYi', 'Miss Fortune': 'MissFortune',
        'Nunu & Willump': 'Nunu', 'Rek\'Sai': 'RekSai', 'Renata Glasc': 'Renata', 'Tahm Kench': 'TahmKench',
        'Twisted Fate': 'TwistedFate', 'Vel\'Koz': 'Velkoz', 'Xin Zhao': 'XinZhao', 'Wukong': 'MonkeyKing'
    };
    const apiName = nameMap[championName] || championName.replace(/\s+/g, '').replace(/['.]/g, '');
    return `https://ddragon.leagueoflegends.com/cdn/15.21.1/img/champion/${apiName}.png`;
}

async function loadProgressFromServer() {
    try {
        const res = await fetch('/api/load_progress');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        ownedChampions = new Set(data.champions || []);
    } catch (err) {
        console.error('⚠️ Error loading progress:', err);
        ownedChampions = new Set();
    }
}

async function saveProgressToServer() {
    try {
        const champions = Array.from(ownedChampions);
        await fetch('/api/save_progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ champions })
        });
    } catch (err) {
        console.error('⚠️ Error saving progress:', err);
    }
}

function createChampionItem(champion) {
    const isOwned = ownedChampions.has(champion);
    const iconUrl = getChampionIcon(champion);
    return `
        <div class="champion-item ${isOwned ? 'owned' : ''}" data-champion="${champion}">
            <img src="${iconUrl}" alt="${champion}" class="champion-icon"
                 onerror="this.onerror=null; this.src='https://ddragon.leagueoflegends.com/cdn/15.21.1/img/profileicon/29.png'">
            <div class="champion-name">${champion}</div>
        </div>
    `;
}

function getFilteredChampions() {
    let filtered = champions.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    if (currentFilter === 'won') filtered = filtered.filter(c => ownedChampions.has(c));
    if (currentFilter === 'notyet') filtered = filtered.filter(c => !ownedChampions.has(c));
    return filtered;
}
function renderChampions() {
    const grid = document.getElementById('championsGrid');
    const noResults = document.getElementById('noResults');
    const filtered = getFilteredChampions();

    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.style.display = 'block';
        return;
    }

    if (noResults) noResults.style.display = 'none';
    grid.innerHTML = filtered.map(createChampionItem).join('');

    grid.querySelectorAll('.champion-item').forEach(item => {
        item.addEventListener('click', handleChampionClick);
    });

    updateStats();
}

function handleChampionClick(e) {
    const championItem = e.currentTarget;
    const champion = championItem.dataset.champion;

    if (ownedChampions.has(champion)) {
        ownedChampions.delete(champion);
        championItem.classList.remove('owned');
    } else {
        ownedChampions.add(champion);
        championItem.classList.add('owned');

        championItem.classList.add('just-selected');
        setTimeout(() => championItem.classList.remove('just-selected'), 1000);
    }

    saveProgressToServer();
    updateStats();
}

function updateStats() {
    const total = champions.length;
    const owned = ownedChampions.size;
    const missing = total - owned;
    const percent = Math.round((owned / total) * 100);

    document.getElementById('totalCount').textContent = total;
    document.getElementById('ownedCount').textContent = owned;
    document.getElementById('missingCount').textContent = missing;
    document.getElementById('progressText').textContent = `${percent}% Complete ✅`;
    document.getElementById('progressFill').style.width = `${percent}%`;
}

const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', e => {
        searchTerm = e.target.value;
        renderChampions();
    });
}

document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', e => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderChampions();
    });
});
const searchBoxes = document.querySelectorAll('#searchInput, #searchInputTop');

searchBoxes.forEach(input => {
    input.addEventListener('input', e => {
        searchTerm = e.target.value;
        renderChampions();

        searchBoxes.forEach(other => {
            if (other !== e.target) other.value = e.target.value;
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const resetBtn = document.getElementById("resetProgress");
    if (!resetBtn) return;

    resetBtn.addEventListener("click", async () => {
        if (confirm("Are you sure you want to reset all progress?")) {
            try {
                const res = await fetch("/api/reset_progress", { method: "POST" });
                const data = await res.json();

                if (data.status === "reset") {
                    ownedChampions.clear();
                    renderChampions();
                    updateStats();
                    alert("✅ Progress has been reset successfully!");
                } else {
                    alert("⚠️ Failed to reset progress. Please try again.");
                }
            } catch (err) {
                console.error("Error resetting progress:", err);
                alert("❌ Server error while resetting progress.");
            }
        }
    });
});
