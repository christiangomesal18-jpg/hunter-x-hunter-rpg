
from pathlib import Path

code = r'''require("dotenv").config();
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
  PermissionFlagsBits
} = require("discord.js");

/*
  HUNTER X HUNTER RPG - SINGLE FILE
  Requer:
    npm i discord.js dotenv
  .env:
    TOKEN=SEU_TOKEN
    CLIENT_ID=ID_DA_APLICACAO
    OWNER_ID=SEU_ID

  O banco é salvo em ./rpg-data.json.
  As imagens podem ser colocadas na seção IMAGENS abaixo.
  URLs vazias usam um fallback.
*/

// =========================
// CONFIGURAÇÃO
// =========================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const OWNER_ID = process.env.OWNER_ID;

if (!TOKEN || !CLIENT_ID || !OWNER_ID) {
  console.error("ERRO: coloque TOKEN, CLIENT_ID e OWNER_ID no arquivo .env");
  process.exit(1);
}

const DB_FILE = "./rpg-data.json";

const FALLBACK_IMAGE =
  "https://placehold.co/900x500/png?text=Hunter+x+Hunter+RPG";

// =========================
// IMAGENS
// Troque as URLs abaixo quando quiser.
// O bot não quebra se estiverem vazias.
// =========================

const IMAGENS = {
  personagens: {
    gon: "",
    killua: "",
    kurapika: "",
    leorio: "",
    hisoka: "",
    chrollo: "",
    netero: "",
    zeno: "",
    illumi: "",
    kalluto: "",
    biscuit: "",
    ging: "",
    feitan: "",
    phinks: "",
    machi: "",
    uvogin: "",
    nobunaga: "",
    franklin: "",
    bonolenov: "",
    shizuku: "",
    shalnark: "",
    pakunoda: "",
    meruem: "",
    neferpitou: "",
    shaiapouf: "",
    menthuthuyoupi: "",
    zushi: ""
  },
  bosses: {
    bandit: "",
    thief: "",
    basic_nen_user: "",
    renegade_hunter: "",
    kalluto: "",
    shizuku: "",
    shalnark: "",
    machi: "",
    nobunaga: "",
    phinks: "",
    feitan: "",
    franklin: "",
    bonolenov: "",
    pakunoda: "",
    uvogin: "",
    chrollo: "",
    chimera_soldier: "",
    rammot: "",
    cheetu: "",
    leol: "",
    zazan: "",
    neferpitou: "",
    shaiapouf: "",
    menthuthuyoupi: "",
    meruem: ""
  }
};

function imageOf(type, id) {
  const value = IMAGENS[type]?.[id];
  return value && /^https?:\/\//i.test(value) ? value : FALLBACK_IMAGE;
}

// =========================
// BANCO
// =========================

function loadDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify({ players: {} }, null, 2));
    }
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    if (!data.players) data.players = {};
    return data;
  } catch (err) {
    console.error("Erro lendo banco:", err);
    return { players: {} };
  }
}

let db = loadDB();

function saveDB() {
  try {
    const temp = DB_FILE + ".tmp";
    fs.writeFileSync(temp, JSON.stringify(db, null, 2));
    fs.renameSync(temp, DB_FILE);
  } catch (err) {
    console.error("Erro salvando banco:", err);
  }
}

function getPlayer(id) {
  return db.players[id] || null;
}

function savePlayer(player) {
  db.players[player.userId] = player;
  saveDB();
}

// =========================
// NEN
// =========================

const NEN_TYPES = [
  { id: "especializacao", name: "Especialização", chance: 5 },
  { id: "fortificacao", name: "Fortificação", chance: 20 },
  { id: "emissao", name: "Emissão", chance: 15 },
  { id: "transformacao", name: "Transformação", chance: 15 },
  { id: "conjuracao", name: "Conjuração", chance: 20 },
  { id: "manipulacao", name: "Manipulação", chance: 25 }
];

const NEN_SKILLS = {
  especializacao: [
    ["Técnica Especial", 40, 100],
    ["Habilidade Única", 65, 300],
    ["Poder Especial", 90, 600]
  ],
  fortificacao: [
    ["Reforço Básico", 25, 80],
    ["Aura Reforçada", 45, 250],
    ["Impacto de Aura", 70, 500]
  ],
  emissao: [
    ["Rajada de Aura", 30, 100],
    ["Disparo de Aura", 50, 300],
    ["Explosão Emissora", 75, 600]
  ],
  transformacao: [
    ["Aura Alterada", 30, 100],
    ["Aura Elétrica", 55, 300],
    ["Transformação Avançada", 80, 600]
  ],
  conjuracao: [
    ["Lâmina de Aura", 30, 100],
    ["Corrente de Aura", 55, 300],
    ["Prisão de Aura", 80, 600]
  ],
  manipulacao: [
    ["Controle", 35, 100],
    ["Agulhas de Aura", 55, 300],
    ["Dominação", 80, 600]
  ]
};

// =========================
// PERSONAGENS
// chance é peso de sorteio,
// não é porcentagem canônica.
// =========================

const CHARACTERS = [
  {
    id: "gon", name: "Gon", rarity: "Raro", chance: 12,
    hp: 120, strength: 18, defense: 12, intelligence: 10, speed: 14, nen: 16,
    skills: [["Pedra", 60, 150], ["Tesoura", 50, 300], ["Papel", 40, 450], ["Jajanken", 90, 800]]
  },
  {
    id: "killua", name: "Killua", rarity: "Épico", chance: 9,
    hp: 115, strength: 16, defense: 12, intelligence: 16, speed: 21, nen: 18,
    skills: [["Raio", 40, 120], ["Eletricidade", 55, 300], ["Godspeed", 90, 800]]
  },
  {
    id: "kurapika", name: "Kurapika", rarity: "Épico", chance: 8,
    hp: 120, strength: 15, defense: 14, intelligence: 20, speed: 14, nen: 20,
    skills: [["Dowsing Chain", 45, 150], ["Holy Chain", 60, 350], ["Emperor Time", 95, 900]]
  },
  {
    id: "leorio", name: "Leorio", rarity: "Comum", chance: 15,
    hp: 125, strength: 12, defense: 13, intelligence: 14, speed: 10, nen: 12,
    skills: [["Soco Remoto", 35, 100], ["Remote Punch", 55, 350]]
  },
  {
    id: "hisoka", name: "Hisoka", rarity: "Lendário", chance: 4,
    hp: 140, strength: 22, defense: 17, intelligence: 22, speed: 19, nen: 25,
    skills: [["Bungee Gum", 55, 150], ["Texture Surprise", 45, 300], ["Bungee Trap", 80, 650]]
  },
  {
    id: "chrollo", name: "Chrollo", rarity: "Lendário", chance: 3,
    hp: 150, strength: 24, defense: 18, intelligence: 25, speed: 18, nen: 28,
    skills: [["Skill Hunter", 75, 350], ["Bandit's Secret", 100, 1000]]
  },
  {
    id: "netero", name: "Netero", rarity: "Mítico", chance: 2,
    hp: 170, strength: 28, defense: 22, intelligence: 30, speed: 27, nen: 35,
    skills: [["100-Type Guanyin", 100, 1200]]
  },
  {
    id: "zeno", name: "Zeno", rarity: "Lendário", chance: 3,
    hp: 155, strength: 25, defense: 20, intelligence: 26, speed: 23, nen: 30,
    skills: [["Dragon Head", 60, 300], ["Dragon Dive", 80, 700]]
  },
  {
    id: "illumi", name: "Illumi", rarity: "Lendário", chance: 4,
    hp: 145, strength: 22, defense: 17, intelligence: 25, speed: 20, nen: 27,
    skills: [["Needle People", 55, 200], ["Needle Control", 80, 650]]
  },
  {
    id: "kalluto", name: "Kalluto", rarity: "Raro", chance: 10,
    hp: 110, strength: 14, defense: 12, intelligence: 17, speed: 18, nen: 18,
    skills: [["Paper Manipulation", 35, 100], ["Paper Storm", 60, 400]]
  },
  {
    id: "biscuit", name: "Biscuit", rarity: "Lendário", chance: 4,
    hp: 145, strength: 24, defense: 20, intelligence: 24, speed: 17, nen: 27,
    skills: [["Super Strength", 55, 250], ["True Form", 85, 750]]
  },
  {
    id: "ging", name: "Ging", rarity: "Mítico", chance: 2,
    hp: 165, strength: 28, defense: 21, intelligence: 32, speed: 24, nen: 34,
    skills: [["Nen Copy", 70, 400], ["Nen Mastery", 100, 1100]]
  },
  {
    id: "feitan", name: "Feitan", rarity: "Lendário", chance: 4,
    hp: 145, strength: 25, defense: 17, intelligence: 23, speed: 25, nen: 29,
    skills: [["Rising Sun", 85, 700], ["Pain Packer", 100, 1200]]
  },
  {
    id: "phinks", name: "Phinks", rarity: "Épico", chance: 6,
    hp: 155, strength: 29, defense: 20, intelligence: 16, speed: 18, nen: 23,
    skills: [["Ripper Cyclotron", 75, 500]]
  },
  {
    id: "machi", name: "Machi", rarity: "Épico", chance: 7,
    hp: 130, strength: 20, defense: 16, intelligence: 22, speed: 21, nen: 25,
    skills: [["Nen Threads", 45, 180], ["Thread Trap", 70, 550]]
  },
  {
    id: "uvogin", name: "Uvogin", rarity: "Lendário", chance: 4,
    hp: 190, strength: 35, defense: 27, intelligence: 10, speed: 14, nen: 24,
    skills: [["Big Bang Impact", 80, 650], ["Maximum Power", 100, 1200]]
  },
  {
    id: "nobunaga", name: "Nobunaga", rarity: "Épico", chance: 7,
    hp: 140, strength: 24, defense: 18, intelligence: 18, speed: 22, nen: 23,
    skills: [["Iaido", 55, 250], ["En Slash", 75, 650]]
  },
  {
    id: "franklin", name: "Franklin", rarity: "Épico", chance: 6,
    hp: 160, strength: 27, defense: 21, intelligence: 15, speed: 12, nen: 25,
    skills: [["Double Machine Gun", 65, 300], ["Full Barrage", 90, 750]]
  },
  {
    id: "bonolenov", name: "Bonolenov", rarity: "Épico", chance: 7,
    hp: 135, strength: 20, defense: 17, intelligence: 20, speed: 16, nen: 25,
    skills: [["Jupiter", 70, 450], ["Battle Cantabile", 90, 800]]
  },
  {
    id: "shizuku", name: "Shizuku", rarity: "Épico", chance: 7,
    hp: 125, strength: 17, defense: 15, intelligence: 20, speed: 15, nen: 24,
    skills: [["Blinky", 45, 150], ["Vacuum Drain", 70, 500]]
  },
  {
    id: "shalnark", name: "Shalnark", rarity: "Épico", chance: 7,
    hp: 125, strength: 18, defense: 15, intelligence: 23, speed: 17, nen: 25,
    skills: [["Autopilot", 65, 350], ["Black Voice", 75, 600]]
  },
  {
    id: "pakunoda", name: "Pakunoda", rarity: "Raro", chance: 9,
    hp: 120, strength: 16, defense: 14, intelligence: 21, speed: 14, nen: 21,
    skills: [["Memory Bomb", 55, 300], ["Memory Scan", 70, 550]]
  },
  {
    id: "meruem", name: "Meruem", rarity: "Mítico", chance: 1,
    hp: 240, strength: 42, defense: 35, intelligence: 40, speed: 32, nen: 45,
    skills: [["Rage Blast", 100, 1200], ["Aura Synthesis", 120, 1800]]
  },
  {
    id: "neferpitou", name: "Neferpitou", rarity: "Mítico", chance: 2,
    hp: 210, strength: 36, defense: 30, intelligence: 32, speed: 30, nen: 42,
    skills: [["Doctor Blythe", 70, 800], ["Terpsichora", 105, 1500]]
  },
  {
    id: "shaiapouf", name: "Shaiapouf", rarity: "Mítico", chance: 2,
    hp: 190, strength: 30, defense: 27, intelligence: 36, speed: 29, nen: 40,
    skills: [["Spiritual Message", 60, 500], ["Beelzebub", 100, 1400]]
  },
  {
    id: "menthuthuyoupi", name: "Menthuthuyoupi", rarity: "Mítico", chance: 2,
    hp: 230, strength: 40, defense: 34, intelligence: 22, speed: 24, nen: 39,
    skills: [["Rage Blast", 85, 700], ["Metamorphosis", 110, 1600]]
  },
  {
    id: "zushi", name: "Zushi", rarity: "Raro", chance: 8,
    hp: 110, strength: 13, defense: 12, intelligence: 17, speed: 13, nen: 15,
    skills: [["Ren", 25, 80], ["Aura Strike", 45, 250]]
  }
];

// =========================
// BOSSES
// =========================

const BOSSES = [
  { id:"bandit", name:"Bandido", min:1, max:25, hp:100, damage:12, defense:5, xp:80, money:50 },
  { id:"thief", name:"Ladrão", min:1, max:25, hp:125, damage:15, defense:7, xp:110, money:70 },
  { id:"basic_nen_user", name:"Usuário Básico de Nen", min:1, max:25, hp:150, damage:18, defense:10, xp:150, money:100 },
  { id:"renegade_hunter", name:"Hunter Renegado", min:1, max:25, hp:180, damage:22, defense:12, xp:200, money:150 },

  { id:"kalluto", name:"Kalluto", min:25, max:70, hp:420, damage:40, defense:22, xp:500, money:350 },
  { id:"shizuku", name:"Shizuku", min:25, max:70, hp:450, damage:43, defense:24, xp:550, money:380 },
  { id:"shalnark", name:"Shalnark", min:25, max:70, hp:470, damage:45, defense:25, xp:600, money:400 },
  { id:"machi", name:"Machi", min:25, max:70, hp:490, damage:48, defense:27, xp:650, money:430 },
  { id:"nobunaga", name:"Nobunaga", min:25, max:70, hp:520, damage:50, defense:28, xp:700, money:450 },
  { id:"phinks", name:"Phinks", min:25, max:70, hp:560, damage:55, defense:30, xp:750, money:500 },
  { id:"feitan", name:"Feitan", min:25, max:70, hp:580, damage:58, defense:31, xp:800, money:550 },
  { id:"franklin", name:"Franklin", min:25, max:70, hp:620, damage:60, defense:32, xp:850, money:600 },
  { id:"bonolenov", name:"Bonolenov", min:25, max:70, hp:600, damage:58, defense:31, xp:850, money:600 },
  { id:"pakunoda", name:"Pakunoda", min:25, max:70, hp:500, damage:48, defense:27, xp:700, money:500 },
  { id:"uvogin", name:"Uvogin", min:25, max:70, hp:750, damage:70, defense:40, xp:1000, money:750 },
  { id:"chrollo", name:"Chrollo", min:25, max:70, hp:800, damage:75, defense:42, xp:1200, money:900 },

  { id:"chimera_soldier", name:"Soldado Formiga Quimera", min:70, max:130, hp:1000, damage:90, defense:50, xp:1600, money:1100 },
  { id:"rammot", name:"Rammot", min:70, max:130, hp:1150, damage:100, defense:55, xp:1800, money:1300 },
  { id:"cheetu", name:"Cheetu", min:70, max:130, hp:1050, damage:105, defense:45, xp:1900, money:1400 },
  { id:"leol", name:"Leol", min:70, max:130, hp:1300, damage:115, defense:60, xp:2100, money:1600 },
  { id:"zazan", name:"Zazan", min:70, max:130, hp:1450, damage:125, defense:65, xp:2300, money:1800 },

  { id:"neferpitou", name:"Neferpitou", min:120, max:179, hp:3000, damage:220, defense:120, xp:5000, money:4000 },
  { id:"shaiapouf", name:"Shaiapouf", min:120, max:179, hp:2800, damage:205, defense:110, xp:4800, money:3800 },
  { id:"menthuthuyoupi", name:"Menthuthuyoupi", min:120, max:179, hp:3400, damage:240, defense:135, xp:5500, money:4500 },

  { id:"meruem", name:"Meruem", min:180, max:9999, hp:6500, damage:400, defense:200, xp:12000, money:10000 }
];

// =========================
// HELPERS
// =========================

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function weightedCharacter() {
  const total = CHARACTERS.reduce((sum, c) => sum + c.chance, 0);
  let roll = Math.random() * total;

  for (const c of CHARACTERS) {
    roll -= c.chance;
    if (roll <= 0) return c;
  }
  return CHARACTERS[0];
}

function randomNen() {
  const total = NEN_TYPES.reduce((sum, n) => sum + n.chance, 0);
  let roll = Math.random() * total;

  for (const n of NEN_TYPES) {
    roll -= n.chance;
    if (roll <= 0) return n;
  }
  return NEN_TYPES[0];
}

function levelFromXP(xp) {
  return Math.max(1, Math.floor(xp / 500) + 1);
}

function xpForNextLevel(level) {
  return level * 500;
}

function createPlayer(userId, username) {
  const character = weightedCharacter();
  const nen = randomNen();
  const potential = Math.floor(Math.random() * 51) + 50;

  const maxHp = character.hp;
  const maxStamina = 100;

  return {
    userId,
    username,
    characterId: character.id,
    nenId: nen.id,
    nenPotential: potential,
    xp: 0,
    level: 1,
    money: 0,

    maxHp,
    hp: maxHp,
    maxStamina,
    stamina: maxStamina,

    strength: character.strength,
    defense: character.defense,
    intelligence: character.intelligence,
    speed: character.speed,
    nenPower: character.nen,

    upgradePoints: 0,

    unlockedSkills: [],
    wins: 0,
    losses: 0,
    bossesDefeated: 0,

    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

function getCharacter(player) {
  return CHARACTERS.find(c => c.id === player.characterId) || CHARACTERS[0];
}

function getNen(player) {
  return NEN_TYPES.find(n => n.id === player.nenId) || NEN_TYPES[0];
}

function getCharacterSkills(player) {
  return getCharacter(player).skills.map((s, i) => ({
    id: `char_${player.characterId}_${i}`,
    name: s[0],
    damage: s[1],
    cost: s[2],
    type: "character"
  }));
}

function getNenSkills(player) {
  return (NEN_SKILLS[player.nenId] || []).map((s, i) => ({
    id: `nen_${player.nenId}_${i}`,
    name: s[0],
    damage: s[1],
    cost: s[2],
    type: "nen"
  }));
}

function getAllSkills(player) {
  return [...getCharacterSkills(player), ...getNenSkills(player)];
}

function ensureStartingSkills(player) {
  const skills = getAllSkills(player);
  if (!player.unlockedSkills) player.unlockedSkills = [];

  // A primeira habilidade do personagem começa liberada.
  // A primeira habilidade de Nen também começa liberada.
  for (const skill of skills.slice(0, 2)) {
    if (!player.unlockedSkills.includes(skill.id)) {
      player.unlockedSkills.push(skill.id);
    }
  }
}

function healPlayer(player) {
  player.hp = player.maxHp;
  player.stamina = player.maxStamina;
}

function addXP(player, amount) {
  const oldLevel = player.level;
  player.xp += Math.max(0, amount);

  while (player.xp >= xpForNextLevel(player.level)) {
    player.level++;
    player.upgradePoints += 3;
  }

  return player.level > oldLevel;
}

function addMoney(player, amount) {
  player.money += amount;
  if (player.money < 0) player.money = 0;
}

function eligibleBosses(level) {
  return BOSSES.filter(b => level >= b.min && level <= b.max);
}

function chooseBoss(level) {
  const list = eligibleBosses(level);
  if (list.length) return random(list);

  const fallback = BOSSES.filter(b => b.min <= level);
  return fallback.length ? fallback[fallback.length - 1] : BOSSES[0];
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function bar(current, max, size = 12) {
  const ratio = max <= 0 ? 0 : clamp(current / max, 0, 1);
  const filled = Math.round(ratio * size);
  return "█".repeat(filled) + "░".repeat(size - filled);
}

function safeUsername(user) {
  return user.globalName || user.username || "Jogador";
}

function baseEmbed(title, description = "") {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x5b5ce2)
    .setTimestamp();
}

function backButton() {
  return new ButtonBuilder()
    .setCustomId("rpg_back")
    .setLabel("Voltar")
    .setEmoji("⬅️")
    .setStyle(ButtonStyle.Secondary);
}

function mainButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("rpg_character").setLabel("Personagem").setEmoji("🎭").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("rpg_battle").setLabel("Batalhar").setEmoji("⚔️").setStyle(ButtonStyle.Danger),
    new ButtonBuilder().setCustomId("rpg_skills").setLabel("Habilidades").setEmoji("📖").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("rpg_attributes").setLabel("Atributos").setEmoji("📈").setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId("rpg_profile").setLabel("Perfil").setEmoji("👤").setStyle(ButtonStyle.Secondary)
  );
}

// =========================
// PÁGINA PRINCIPAL
// =========================

function mainPanel(player, user) {
  // Sempre lê o objeto atual do banco.
  const current = getPlayer(user.id) || player;
  const character = getCharacter(current);
  const nen = getNen(current);

  const embed = baseEmbed(
    `🎭 Hunter x Hunter RPG — ${character.name}`,
    `**${user.globalName || user.username}**, este é o seu painel.`
  )
    .addFields(
      { name: "🎭 Personagem", value: `**${character.name}**\n${character.rarity} • Chance: ${character.chance}`, inline: true },
      { name: "⚡ Nen", value: `**${nen.name}**\nPotencial: **${current.nenPotential}%**`, inline: true },
      { name: "⭐ Progresso", value: `Nível **${current.level}**\nXP: **${current.xp}**`, inline: true },
      { name: "💰 Dinheiro", value: `**R$ ${current.money.toFixed(2)}**`, inline: true },
      { name: "❤️ HP", value: `${bar(current.hp, current.maxHp)}\n${current.hp}/${current.maxHp}`, inline: true },
      { name: "🔋 Stamina", value: `${bar(current.stamina, current.maxStamina)}\n${current.stamina}/${current.maxStamina}`, inline: true }
    )
    .setImage(imageOf("personagens", character.id))
    .setFooter({ text: "Seu progresso é salvo globalmente pelo seu Discord User ID." });

  return { embeds: [embed], components: [mainButtons()] };
}

function characterPage(player) {
  const character = getCharacter(player);

  const embed = baseEmbed(`🎭 ${character.name}`)
    .addFields(
      { name: "Raridade", value: character.rarity, inline: true },
      { name: "Chance", value: String(character.chance), inline: true },
      { name: "❤️ HP", value: String(character.hp), inline: true },
      { name: "💪 Força", value: String(character.strength), inline: true },
      { name: "🛡️ Defesa", value: String(character.defense), inline: true },
      { name: "🧠 Inteligência", value: String(character.intelligence), inline: true },
      { name: "⚡ Velocidade", value: String(character.speed), inline: true },
      { name: "🔮 Poder Nen", value: String(character.nen), inline: true }
    )
    .setImage(imageOf("personagens", character.id));

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(backButton())]
  };
}

function profilePage(player) {
  // Reconsulta o banco para evitar dinheiro/XP/status antigo.
  const current = getPlayer(player.userId) || player;
  const character = getCharacter(current);
  const nen = getNen(current);
  const unlocked = getAllSkills(current).filter(s => current.unlockedSkills.includes(s.id));

  const embed = baseEmbed(`👤 Perfil de ${current.username}`)
    .addFields(
      { name: "🎭 Personagem", value: `${character.name}\n${character.rarity}`, inline: true },
      { name: "🎯 Chance", value: String(character.chance), inline: true },
      { name: "⚡ Nen", value: `${nen.name}\n${current.nenPotential}%`, inline: true },
      { name: "⭐ Nível", value: `${current.level}\nXP: ${current.xp}/${xpForNextLevel(current.level)}`, inline: true },
      { name: "💰 Dinheiro", value: `R$ ${current.money.toFixed(2)}`, inline: true },
      { name: "❤️ HP", value: `${current.hp}/${current.maxHp}`, inline: true },
      { name: "🔋 Stamina", value: `${current.stamina}/${current.maxStamina}`, inline: true },
      { name: "📊 Atributos", value:
        `💪 ${current.strength} • 🛡️ ${current.defense}\n` +
        `🧠 ${current.intelligence} • ⚡ ${current.speed}\n` +
        `🔮 ${current.nenPower}`, inline: true },
      { name: "🏆 Histórico", value:
        `Vitórias: ${current.wins}\nDerrotas: ${current.losses}\nBosses: ${current.bossesDefeated}`, inline: true },
      { name: "📖 Habilidades", value: unlocked.length ? unlocked.map(s => `• ${s.name}`).join("\n") : "Nenhuma", inline: false }
    )
    .setImage(imageOf("personagens", character.id));

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(backButton())]
  };
}

function attributesPage(player) {
  const p = getPlayer(player.userId) || player;

  const embed = baseEmbed(
    "📈 Atributos",
    `Pontos disponíveis: **${p.upgradePoints}**\nEscolha um atributo para aumentar.`
  ).addFields(
    { name: "❤️ HP", value: String(p.maxHp), inline: true },
    { name: "🔋 Stamina", value: String(p.maxStamina), inline: true },
    { name: "💪 Força", value: String(p.strength), inline: true },
    { name: "🛡️ Defesa", value: String(p.defense), inline: true },
    { name: "🧠 Inteligência", value: String(p.intelligence), inline: true },
    { name: "⚡ Velocidade", value: String(p.speed), inline: true },
    { name: "🔮 Nen", value: String(p.nenPower), inline: true }
  );

  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("up_hp").setLabel("HP").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("up_stamina").setLabel("Stamina").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("up_strength").setLabel("Força").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("up_defense").setLabel("Defesa").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("up_intelligence").setLabel("Inteligência").setStyle(ButtonStyle.Primary)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("up_speed").setLabel("Velocidade").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId("up_nen").setLabel("Nen").setStyle(ButtonStyle.Primary),
    backButton()
  );

  return { embeds: [embed], components: [row1, row2] };
}

function skillsPage(player) {
  const p = getPlayer(player.userId) || player;
  const characterSkills = getCharacterSkills(p);
  const nenSkills = getNenSkills(p);

  const format = list => list.map(s => {
    const unlocked = p.unlockedSkills.includes(s.id);
    return `${unlocked ? "✅" : "🔒"} **${s.name}** — ${s.damage} dano — ${s.cost} XP`;
  }).join("\n");

  const embed = baseEmbed(
    "📖 Habilidades",
    "Use os botões de desbloqueio para liberar habilidades usando XP."
  )
    .addFields(
      { name: `🎭 ${getCharacter(p).name}`, value: format(characterSkills) || "Nenhuma", inline: false },
      { name: `⚡ ${getNen(p).name}`, value: format(nenSkills) || "Nenhuma", inline: false }
    );

  const rows = [];

  for (const skill of [...characterSkills, ...nenSkills]) {
    if (!p.unlockedSkills.includes(skill.id)) {
      rows.push(
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`unlock_${skill.id}`)
            .setLabel(`Desbloquear ${skill.name}`)
            .setStyle(ButtonStyle.Success)
        )
      );
      if (rows.length >= 4) break;
    }
  }

  rows.push(new ActionRowBuilder().addComponents(backButton()));

  return { embeds: [embed], components: rows };
}

// =========================
// BATALHA
// =========================

const battles = new Map();

function battleView(player, battle, messageText = "") {
  const p = getPlayer(player.userId) || player;
  const boss = battle.boss;

  const available = getAllSkills(p).filter(s => p.unlockedSkills.includes(s.id));

  const embed = baseEmbed(
    `⚔️ Batalha — ${boss.name}`,
    messageText || `**${getCharacter(p).name}** enfrenta **${boss.name}**!`
  )
    .addFields(
      {
        name: `❤️ Seu HP`,
        value: `${bar(p.hp, p.maxHp)}\n${p.hp}/${p.maxHp}`,
        inline: true
      },
      {
        name: `🔋 Stamina`,
        value: `${bar(p.stamina, p.maxStamina)}\n${p.stamina}/${p.maxStamina}`,
        inline: true
      },
      {
        name: `👹 HP do Boss`,
        value: `${bar(battle.bossHp, boss.hp)}\n${battle.bossHp}/${boss.hp}`,
        inline: true
      },
      {
        name: "👹 Status",
        value: `Dano: ${boss.damage}\nDefesa: ${boss.defense}\nNível: ${Math.max(boss.min, p.level)}`,
        inline: true
      }
    )
    .setImage(imageOf("bosses", boss.id));

  if (!available.length) {
    return {
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("rpg_back").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
        )
      ]
    };
  }

  const options = available.slice(0, 25).map(skill => ({
    label: `${skill.name} — ${skill.damage} dano`,
    description: `Usar ${skill.name}`,
    value: skill.id
  }));

  const menu = new StringSelectMenuBuilder()
    .setCustomId("battle_skill")
    .setPlaceholder("Escolha uma habilidade...")
    .addOptions(options);

  return {
    embeds: [embed],
    components: [new ActionRowBuilder().addComponents(menu)]
  };
}

async function startBattle(interaction, player) {
  const boss = chooseBoss(player.level);

  healPlayer(player);
  savePlayer(player);

  const battle = {
    userId: player.userId,
    boss,
    bossHp: boss.hp,
    startedAt: Date.now()
  };

  battles.set(player.userId, battle);

  return interaction.update(battleView(player, battle));
}

async function attackBattle(interaction, player, skillId) {
  const battle = battles.get(player.userId);

  if (!battle) {
    return interaction.reply({
      content: "❌ Você não está em uma batalha.",
      ephemeral: true
    });
  }

  const current = getPlayer(player.userId);

  const skill = getAllSkills(current).find(
    s => s.id === skillId && current.unlockedSkills.includes(s.id)
  );

  if (!skill) {
    return interaction.reply({
      content: "❌ Essa habilidade não está desbloqueada.",
      ephemeral: true
    });
  }

  if (current.stamina <= 0) {
    return interaction.reply({
      content: "❌ Você está sem stamina.",
      ephemeral: true
    });
  }

  // Dano do jogador.
  const playerDamage = Math.max(
    1,
    Math.floor(skill.damage + current.strength * 0.7 + current.nenPower * (current.nenPotential / 100) - battle.boss.defense * 0.25)
  );

  battle.bossHp = Math.max(0, battle.bossHp - playerDamage);
  current.stamina = Math.max(0, current.stamina - Math.max(3, Math.floor(skill.damage / 15)));

  let log = `⚔️ Você usou **${skill.name}** e causou **${playerDamage}** de dano.`;

  // Vitória.
  if (battle.bossHp <= 0) {
    const oldLevel = current.level;

    addXP(current, battle.boss.xp);
    addMoney(current, battle.boss.money);
    current.wins++;
    current.bossesDefeated++;
    healPlayer(current);
    current.updatedAt = Date.now();

    savePlayer(current);
    battles.delete(player.userId);

    const leveled = current.level > oldLevel;

    const embed = baseEmbed(
      "🏆 Vitória!",
      `Você derrotou **${battle.boss.name}**!`
    )
      .addFields(
        { name: "⚔️ Dano final", value: String(playerDamage), inline: true },
        { name: "⭐ XP recebido", value: `+${battle.boss.xp}`, inline: true },
        { name: "💰 Dinheiro recebido", value: `+R$ ${battle.boss.money.toFixed(2)}`, inline: true },
        { name: "📈 Nível", value: leveled ? `**${oldLevel} → ${current.level}**` : String(current.level), inline: true },
        { name: "💰 Saldo atual", value: `R$ ${current.money.toFixed(2)}`, inline: true },
        { name: "📊 Pontos", value: String(current.upgradePoints), inline: true }
      )
      .setImage(imageOf("personagens", current.characterId));

    return interaction.update({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("rpg_back").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
        )
      ]
    });
  }

  // Contra-ataque do boss.
  const bossDamage = Math.max(
    1,
    Math.floor(
      battle.boss.damage -
      current.defense * 0.45 -
      current.speed * 0.08
    )
  );

  current.hp = Math.max(0, current.hp - bossDamage);

  log += `\n👹 **${battle.boss.name}** contra-atacou e causou **${bossDamage}** de dano.`;

  // Derrota.
  if (current.hp <= 0) {
    current.losses++;
    current.maxHp = Math.max(1, current.maxHp - 10);
    current.maxStamina = Math.max(1, current.maxStamina - 5);
    healPlayer(current);
    current.updatedAt = Date.now();

    savePlayer(current);
    battles.delete(player.userId);

    const embed = baseEmbed(
      "💀 Derrota",
      `Você foi derrotado por **${battle.boss.name}**.`
    )
      .addFields(
        { name: "❤️ Novo HP máximo", value: String(current.maxHp), inline: true },
        { name: "🔋 Nova stamina máxima", value: String(current.maxStamina), inline: true },
        { name: "📉 Derrotas", value: String(current.losses), inline: true }
      )
      .setImage(imageOf("bosses", battle.boss.id));

    return interaction.update({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("rpg_back").setLabel("Voltar").setStyle(ButtonStyle.Secondary)
        )
      ]
    });
  }

  current.updatedAt = Date.now();
  savePlayer(current);

  // Sempre buscar o valor salvo novamente para renderizar.
  const refreshed = getPlayer(player.userId);
  return interaction.update(battleView(refreshed, battle, log));
}

// =========================
// ADMIN
// =========================

function isAdmin(interaction) {
  return interaction.user.id === OWNER_ID ||
    interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);
}

async function adminXP(interaction, user, amount) {
  const player = getPlayer(user.id);
  if (!player) {
    return interaction.reply({ content: "❌ Esse usuário ainda não possui perfil.", ephemeral: true });
  }

  const oldLevel = player.level;
  addXP(player, amount);
  player.updatedAt = Date.now();
  savePlayer(player);

  return interaction.reply({
    content: `✅ Adicionado **${amount} XP** para ${user}.\nNível: **${oldLevel} → ${player.level}**`,
    ephemeral: true
  });
}

async function adminMoney(interaction, user, amount) {
  const player = getPlayer(user.id);
  if (!player) {
    return interaction.reply({ content: "❌ Esse usuário ainda não possui perfil.", ephemeral: true });
  }

  addMoney(player, amount);
  player.updatedAt = Date.now();
  savePlayer(player);

  // Busca novamente para garantir que o valor mostrado é o salvo.
  const refreshed = getPlayer(user.id);

  return interaction.reply({
    content: `✅ Dinheiro atualizado para ${user}.\nSaldo atual: **R$ ${refreshed.money.toFixed(2)}**`,
    ephemeral: true
  });
}

async function adminLevel(interaction, user, amount) {
  const player = getPlayer(user.id);
  if (!player) {
    return interaction.reply({ content: "❌ Esse usuário ainda não possui perfil.", ephemeral: true });
  }

  const old = player.level;
  player.level = Math.max(1, player.level + amount);

  if (amount > 0) player.upgradePoints += amount * 3;

  player.updatedAt = Date.now();
  savePlayer(player);

  return interaction.reply({
    content: `✅ Nível atualizado: **${old} → ${player.level}**`,
    ephemeral: true
  });
}

async function adminEvent(interaction, xp, money) {
  let count = 0;

  for (const player of Object.values(db.players)) {
    addXP(player, xp);
    addMoney(player, money);
    player.updatedAt = Date.now();
    count++;
  }

  saveDB();

  return interaction.reply({
    content: `🎉 Evento aplicado!\nJogadores: **${count}**\nXP: **+${xp}**\nDinheiro: **+R$ ${money.toFixed(2)}**`,
    ephemeral: true
  });
}

async function adminReset(interaction, user) {
  if (!db.players[user.id]) {
    return interaction.reply({ content: "❌ Esse usuário não possui perfil.", ephemeral: true });
  }

  delete db.players[user.id];
  saveDB();

  battles.delete(user.id);

  return interaction.reply({
    content: `♻️ Perfil de ${user} resetado. Na próxima vez que usar /rpg, receberá novo personagem e Nen.`,
    ephemeral: true
  });
}

// =========================
// CLIENT
// =========================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ],
  partials: [Partials.Channel]
});

// =========================
// COMANDOS
// =========================

const commands = [
  new SlashCommandBuilder()
    .setName("rpg")
    .setDescription("Abrir seu perfil de Hunter x Hunter RPG"),

  new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Comandos administrativos do RPG")
    .addSubcommand(sub =>
      sub.setName("xp")
        .setDescription("Adicionar XP")
        .addUserOption(o => o.setName("usuario").setDescription("Usuário").setRequired(true))
        .addIntegerOption(o => o.setName("quantidade").setDescription("Quantidade de XP").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("dinheiro")
        .setDescription("Adicionar/remover dinheiro")
        .addUserOption(o => o.setName("usuario").setDescription("Usuário").setRequired(true))
        .addNumberOption(o => o.setName("quantidade").setDescription("Valor, use negativo para remover").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("nivel")
        .setDescription("Alterar nível")
        .addUserOption(o => o.setName("usuario").setDescription("Usuário").setRequired(true))
        .addIntegerOption(o => o.setName("quantidade").setDescription("Quantidade de níveis").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("evento")
        .setDescription("Dar XP e dinheiro para todos")
        .addIntegerOption(o => o.setName("xp").setDescription("XP para todos").setRequired(true))
        .addNumberOption(o => o.setName("dinheiro").setDescription("Dinheiro para todos").setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName("reset")
        .setDescription("Resetar perfil")
        .addUserOption(o => o.setName("usuario").setDescription("Usuário").setRequired(true))
    )
].map(c => c.toJSON());

// =========================
// DEPLOY
// =========================

async function deployCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );

  console.log("✅ Comandos registrados.");
}

// =========================
// READY
// =========================

client.once("ready", () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
  console.log(`👥 Jogadores salvos: ${Object.keys(db.players).length}`);
  client.user.setActivity("Hunter x Hunter RPG");
});

// =========================
// INTERAÇÕES
// =========================

client.on("interactionCreate", async interaction => {
  try {
    // Slash /rpg
    if (interaction.isChatInputCommand() && interaction.commandName === "rpg") {
      let player = getPlayer(interaction.user.id);

      if (!player) {
        player = createPlayer(
          interaction.user.id,
          safeUsername(interaction.user)
        );

        ensureStartingSkills(player);
        savePlayer(player);

        const character = getCharacter(player);
        const nen = getNen(player);

        const embed = baseEmbed(
          "🎉 Seu personagem foi criado!",
          `Você recebeu **${character.name}** e o Nen **${nen.name}**.\n\n` +
          `🎯 Potencial do Nen: **${player.nenPotential}%**\n` +
          `⚠️ Personagem e Nen são permanentes e não podem ser rerrolados.`
        )
          .addFields(
            { name: "🎭 Personagem", value: `${character.name} — ${character.rarity}`, inline: true },
            { name: "⚡ Nen", value: nen.name, inline: true },
            { name: "🎯 Potencial", value: `${player.nenPotential}%`, inline: true }
          )
          .setImage(imageOf("personagens", character.id));

        return interaction.reply({
          embeds: [embed],
          components: [mainButtons()]
        });
      }

      player.username = safeUsername(interaction.user);
      player.updatedAt = Date.now();
      savePlayer(player);

      return interaction.reply(mainPanel(player, interaction.user));
    }

    // Slash /admin
    if (interaction.isChatInputCommand() && interaction.commandName === "admin") {
      if (!isAdmin(interaction)) {
        return interaction.reply({
          content: "❌ Você não tem permissão para usar este comando.",
          ephemeral: true
        });
      }

      const sub = interaction.options.getSubcommand();

      if (sub === "xp") {
        return adminXP(
          interaction,
          interaction.options.getUser("usuario"),
          interaction.options.getInteger("quantidade")
        );
      }

      if (sub === "dinheiro") {
        return adminMoney(
          interaction,
          interaction.options.getUser("usuario"),
          interaction.options.getNumber("quantidade")
        );
      }

      if (sub === "nivel") {
        return adminLevel(
          interaction,
          interaction.options.getUser("usuario"),
          interaction.options.getInteger("quantidade")
        );
      }

      if (sub === "evento") {
        return adminEvent(
          interaction,
          interaction.options.getInteger("xp"),
          interaction.options.getNumber("dinheiro")
        );
      }

      if (sub === "reset") {
        return adminReset(
          interaction,
          interaction.options.getUser("usuario")
        );
      }
    }

    // Botões
    if (interaction.isButton()) {
      let player = getPlayer(interaction.user.id);

      if (!player) {
        return interaction.reply({
          content: "❌ Use `/rpg` primeiro para criar seu perfil.",
          ephemeral: true
        });
      }

      player.username = safeUsername(interaction.user);
      savePlayer(player);

      if (interaction.customId === "rpg_back") {
        // Busca novamente antes de montar o painel.
        player = getPlayer(interaction.user.id);
        return interaction.update(mainPanel(player, interaction.user));
      }

      if (interaction.customId === "rpg_character") {
        return interaction.update(characterPage(player));
      }

      if (interaction.customId === "rpg_profile") {
        return interaction.update(profilePage(player));
      }

      if (interaction.customId === "rpg_attributes") {
        return interaction.update(attributesPage(player));
      }

      if (interaction.customId === "rpg_skills") {
        return interaction.update(skillsPage(player));
      }

      if (interaction.customId === "rpg_battle") {
        return startBattle(interaction, player);
      }

      // Upgrade de atributos
      if (interaction.customId.startsWith("up_")) {
        player = getPlayer(interaction.user.id);

        if (player.upgradePoints <= 0) {
          return interaction.reply({
            content: "❌ Você não possui pontos de atributo.",
            ephemeral: true
          });
        }

        const attr = interaction.customId.slice(3);

        if (attr === "hp") {
          player.maxHp += 10;
          player.hp += 10;
        } else if (attr === "stamina") {
          player.maxStamina += 5;
          player.stamina += 5;
        } else if (attr === "strength") {
          player.strength += 2;
        } else if (attr === "defense") {
          player.defense += 2;
        } else if (attr === "intelligence") {
          player.intelligence += 2;
        } else if (attr === "speed") {
          player.speed += 2;
        } else if (attr === "nen") {
          player.nenPower += 2;
        } else {
          return interaction.reply({ content: "❌ Atributo inválido.", ephemeral: true });
        }

        player.upgradePoints--;
        player.updatedAt = Date.now();
        savePlayer(player);

        return interaction.update(attributesPage(getPlayer(player.userId)));
      }

      // Desbloquear habilidade
      if (interaction.customId.startsWith("unlock_")) {
        player = getPlayer(interaction.user.id);

        const skillId = interaction.customId.replace("unlock_", "");
        const skill = getAllSkills(player).find(s => s.id === skillId);

        if (!skill) {
          return interaction.reply({
            content: "❌ Habilidade não encontrada.",
            ephemeral: true
          });
        }

        if (player.unlockedSkills.includes(skill.id)) {
          return interaction.reply({
            content: "❌ Essa habilidade já está desbloqueada.",
            ephemeral: true
          });
        }

        if (player.xp < skill.cost) {
          return interaction.reply({
            content: `❌ Você precisa de **${skill.cost} XP** para desbloquear **${skill.name}**.\nVocê possui **${player.xp} XP**.`,
            ephemeral: true
          });
        }

        player.xp -= skill.cost;
        player.unlockedSkills.push(skill.id);
        player.updatedAt = Date.now();
        savePlayer(player);

        return interaction.update(skillsPage(getPlayer(player.userId)));
      }
    }

    // Select de batalha
    if (interaction.isStringSelectMenu() && interaction.customId === "battle_skill") {
      const player = getPlayer(interaction.user.id);

      if (!player) {
        return interaction.reply({
          content: "❌ Perfil não encontrado.",
          ephemeral: true
        });
      }

      return attackBattle(
        interaction,
        player,
        interaction.values[0]
      );
    }

  } catch (err) {
    console.error("Erro na interação:", err);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ Ocorreu um erro ao executar essa ação.",
        ephemeral: true
      }).catch(() => {});
    } else {
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar essa ação.",
        ephemeral: true
      }).catch(() => {});
    }
  }
});

// =========================
// LOGIN
// =========================

(async () => {
  try {
    await deployCommands();
    await client.login(TOKEN);
  } catch (err) {
    console.error("❌ Falha ao iniciar o bot:");
    console.error(err);
    process.exit(1);
  }
})();
'''

path = Path("/mnt/data/index.js")
path.write_text(code, encoding="utf-8")
print(f"Arquivo criado: {path}")
print(f"Linhas: {len(code.splitlines())}")
print(f"Tamanho: {len(code)/1024:.1f} KB")
