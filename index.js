const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// Coloque os IDs dos administradores separados por vírgula.
// Exemplo: ADMIN_IDS=123456789,987654321
const ADMIN_IDS = (process.env.ADMIN_IDS || "")
  .split(",")
  .map(x => x.trim())
  .filter(Boolean);

if (!TOKEN || !CLIENT_ID) {
  console.log("ERRO: Configure TOKEN e CLIENT_ID nas variáveis.");
  process.exit(1);
}

const DATA_FILE = path.join(__dirname, "players.json");

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "{}");
}

function loadPlayers() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function savePlayers() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
}

const players = loadPlayers();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ======================================================
// PERSONAGENS
// ======================================================

const characters = [
  {
    id: "leorio",
    name: "Leorio",
    rarity: "Comum",
    chance: 10,
    value: 5000,
    hp: 900,
    strength: 45,
    defense: 40,
    stamina: 60,
    intelligence: 70,
    speed: 45,
    skills: [
      ["Soco Médico", 25, 1500, 1],
      ["Punch Remoto", 40, 3500, 5],
      ["Remote Punch Avançado", 65, 7000, 15]
    ]
  },
  {
    id: "kalluto",
    name: "Kalluto Zoldyck",
    rarity: "Comum",
    chance: 8,
    value: 7000,
    hp: 850,
    strength: 40,
    defense: 45,
    stamina: 65,
    intelligence: 70,
    speed: 75,
    skills: [
      ["Manipulação de Papel", 30, 2000, 1],
      ["Rastreador de Papel", 45, 4000, 8],
      ["Tempestade de Papéis", 70, 9000, 18]
    ]
  },
  {
    id: "zushi",
    name: "Zushi",
    rarity: "Comum",
    chance: 7,
    value: 6000,
    hp: 850,
    strength: 45,
    defense: 50,
    stamina: 60,
    intelligence: 65,
    speed: 50,
    skills: [
      ["Shu", 25, 1500, 1],
      ["Ren Básico", 40, 3500, 7],
      ["Kō Avançado", 60, 7000, 15]
    ]
  },
  {
    id: "hanzo",
    name: "Hanzo",
    rarity: "Comum",
    chance: 6,
    value: 9000,
    hp: 1000,
    strength: 60,
    defense: 55,
    stamina: 75,
    intelligence: 70,
    speed: 90,
    skills: [
      ["Ninjutsu", 35, 2500, 1],
      ["Clone Ninja", 55, 5500, 10],
      ["Técnica Ninja Suprema", 80, 12000, 22]
    ]
  },
  {
    id: "ponzu",
    name: "Ponzu",
    rarity: "Comum",
    chance: 5,
    value: 4500,
    hp: 750,
    strength: 35,
    defense: 35,
    stamina: 55,
    intelligence: 65,
    speed: 50,
    skills: [
      ["Abelhas", 20, 1200, 1],
      ["Ataque de Abelhas", 35, 3000, 6],
      ["Enxame", 55, 6500, 14]
    ]
  },
  {
    id: "shizuku",
    name: "Shizuku",
    rarity: "Incomum",
    chance: 5,
    value: 12000,
    hp: 1050,
    strength: 60,
    defense: 60,
    stamina: 70,
    intelligence: 75,
    speed: 55,
    skills: [
      ["Blinky", 35, 3000, 1],
      ["Limpeza Total", 55, 6500, 10],
      ["Sucção Brutal", 80, 13000, 22]
    ]
  },
  {
    id: "shalnark",
    name: "Shalnark",
    rarity: "Incomum",
    chance: 4.5,
    value: 14000,
    hp: 1000,
    strength: 55,
    defense: 55,
    stamina: 70,
    intelligence: 90,
    speed: 65,
    skills: [
      ["Antena", 30, 2500, 1],
      ["Autopilot", 65, 8000, 12],
      ["Autopilot Supremo", 90, 16000, 25]
    ]
  },
  {
    id: "machi",
    name: "Machi",
    rarity: "Incomum",
    chance: 4,
    value: 16000,
    hp: 1100,
    strength: 65,
    defense: 70,
    stamina: 80,
    intelligence: 80,
    speed: 75,
    skills: [
      ["Fios de Nen", 35, 3000, 1],
      ["Costura de Nen", 60, 7000, 10],
      ["Fios Mortais", 90, 15000, 24]
    ]
  },
  {
    id: "phinks",
    name: "Phinks",
    rarity: "Incomum",
    chance: 3.8,
    value: 18000,
    hp: 1200,
    strength: 90,
    defense: 75,
    stamina: 80,
    intelligence: 55,
    speed: 65,
    skills: [
      ["Soco Reforçado", 40, 3500, 1],
      ["Ripper Cyclotron", 75, 9000, 12],
      ["Ripper Cyclotron Máximo", 110, 18000, 28]
    ]
  },
  {
    id: "franklin",
    name: "Franklin",
    rarity: "Incomum",
    chance: 3.5,
    value: 19000,
    hp: 1250,
    strength: 80,
    defense: 75,
    stamina: 85,
    intelligence: 55,
    speed: 50,
    skills: [
      ["Double Machine Gun", 40, 3500, 1],
      ["Rajada de Nen", 65, 7000, 10],
      ["Metralhadora Suprema", 100, 16000, 25]
    ]
  },
  {
    id: "nobunaga",
    name: "Nobunaga",
    rarity: "Incomum",
    chance: 3.5,
    value: 19000,
    hp: 1150,
    strength: 80,
    defense: 70,
    stamina: 75,
    intelligence: 65,
    speed: 80,
    skills: [
      ["Iai", 45, 4000, 1],
      ["Corte de Nen", 70, 8000, 12],
      ["Iai Supremo", 105, 17000, 28]
    ]
  },
  {
    id: "bonolenov",
    name: "Bonolenov",
    rarity: "Incomum",
    chance: 3,
    value: 20000,
    hp: 1150,
    strength: 75,
    defense: 70,
    stamina: 80,
    intelligence: 70,
    speed: 65,
    skills: [
      ["Battle Cantabile", 40, 3500, 1],
      ["Jupiter", 70, 8500, 12],
      ["Dance Suprema", 105, 18000, 30]
    ]
  },
  {
    id: "pakunoda",
    name: "Pakunoda",
    rarity: "Incomum",
    chance: 3,
    value: 15000,
    hp: 950,
    strength: 50,
    defense: 50,
    stamina: 65,
    intelligence: 90,
    speed: 55,
    skills: [
      ["Memory Bomb", 35, 3000, 1],
      ["Memory Scan", 50, 5500, 8],
      ["Memory Bullet", 75, 11000, 20]
    ]
  },
  {
    id: "kortopi",
    name: "Kortopi",
    rarity: "Incomum",
    chance: 2.5,
    value: 17000,
    hp: 850,
    strength: 35,
    defense: 45,
    stamina: 60,
    intelligence: 95,
    speed: 45,
    skills: [
      ["Gallery Fake", 30, 3000, 1],
      ["Cópia Perfeita", 50, 6000, 10],
      ["Cópia em Massa", 75, 12000, 22]
    ]
  },
  {
    id: "gon",
    name: "Gon Freecss",
    rarity: "Raro",
    chance: 4,
    value: 25000,
    hp: 1300,
    strength: 95,
    defense: 80,
    stamina: 90,
    intelligence: 55,
    speed: 75,
    skills: [
      ["Pedra", 60, 8000, 10],
      ["Tesoura", 50, 6000, 8],
      ["Papel", 40, 5000, 6],
      ["Jajanken Supremo", 110, 25000, 30]
    ]
  },
  {
    id: "killua",
    name: "Killua Zoldyck",
    rarity: "Raro",
    chance: 4,
    value: 28000,
    hp: 1200,
    strength: 80,
    defense: 70,
    stamina: 100,
    intelligence: 85,
    speed: 110,
    skills: [
      ["Palma Elétrica", 30, 3000, 5],
      ["Eletricidade", 45, 6000, 10],
      ["Thunderbolt", 60, 10000, 18],
      ["Godspeed", 90, 18000, 30],
      ["Godspeed Supremo", 125, 35000, 50]
    ]
  },
  {
    id: "kurapika",
    name: "Kurapika",
    rarity: "Raro",
    chance: 3.5,
    value: 30000,
    hp: 1150,
    strength: 70,
    defense: 75,
    stamina: 80,
    intelligence: 100,
    speed: 70,
    skills: [
      ["Dowsing Chain", 40, 5000, 5],
      ["Holy Chain", 55, 8000, 12],
      ["Chain Jail", 75, 15000, 22],
      ["Judgment Chain", 90, 22000, 32],
      ["Emperor Time", 120, 40000, 50]
    ]
  },
  {
    id: "uvogin",
    name: "Uvogin",
    rarity: "Raro",
    chance: 3,
    value: 32000,
    hp: 1600,
    strength: 125,
    defense: 100,
    stamina: 100,
    intelligence: 45,
    speed: 55,
    skills: [
      ["Soco Brutal", 45, 4000, 1],
      ["Rugido", 55, 6000, 8],
      ["Big Bang Impact", 90, 14000, 20],
      ["Big Bang Impact Supremo", 140, 35000, 45]
    ]
  },
  {
    id: "feitan",
    name: "Feitan",
    rarity: "Raro",
    chance: 2.8,
    value: 35000,
    hp: 1100,
    strength: 85,
    defense: 70,
    stamina: 90,
    intelligence: 80,
    speed: 115,
    skills: [
      ["Sword Slash", 40, 4000, 1],
      ["Ko", 65, 8000, 10],
      ["Pain Packer", 100, 18000, 25],
      ["Rising Sun", 150, 45000, 50]
    ]
  },
  {
    id: "knuckle",
    name: "Knuckle Bine",
    rarity: "Raro",
    chance: 2.7,
    value: 33000,
    hp: 1250,
    strength: 80,
    defense: 80,
    stamina: 90,
    intelligence: 85,
    speed: 65,
    skills: [
      ["Hakoware", 40, 5000, 5],
      ["Juros", 65, 9000, 15],
      ["APR", 85, 16000, 28]
    ]
  },
  {
    id: "shoot",
    name: "Shoot McMahon",
    rarity: "Raro",
    chance: 2.5,
    value: 30000,
    hp: 1100,
    strength: 65,
    defense: 75,
    stamina: 85,
    intelligence: 90,
    speed: 75,
    skills: [
      ["Hotel Rafflesia", 40, 5000, 5],
      ["Mãos Flutuantes", 60, 8000, 12],
      ["Captura Total", 90, 17000, 28]
    ]
  },
  {
    id: "morel",
    name: "Morel",
    rarity: "Raro",
    chance: 2.3,
    value: 38000,
    hp: 1300,
    strength: 70,
    defense: 80,
    stamina: 110,
    intelligence: 100,
    speed: 55,
    skills: [
      ["Deep Purple", 40, 5000, 5],
      ["Smoke Soldier", 60, 9000, 12],
      ["Smoky Jail", 85, 16000, 25],
      ["Deep Purple Supremo", 120, 30000, 45]
    ]
  },
  {
    id: "palm",
    name: "Palm Siberia",
    rarity: "Raro",
    chance: 2,
    value: 32000,
    hp: 1050,
    strength: 60,
    defense: 65,
    stamina: 75,
    intelligence: 90,
    speed: 60,
    skills: [
      ["Wink Blue", 35, 4000, 1],
      ["Black Widow", 60, 8000, 12],
      ["Enforcers", 90, 17000, 28]
    ]
  },
  {
    id: "kite",
    name: "Kite",
    rarity: "Épico",
    chance: 1.8,
    value: 50000,
    hp: 1350,
    strength: 90,
    defense: 85,
    stamina: 95,
    intelligence: 90,
    speed: 80,
    skills: [
      ["Crazy Slots", 45, 6000, 5],
      ["Foice", 70, 10000, 15],
      ["Arma Aleatória", 90, 16000, 25],
      ["Crazy Slots Supremo", 125, 35000, 45]
    ]
  },
  {
    id: "hisoka",
    name: "Hisoka",
    rarity: "Épico",
    chance: 2,
    value: 60000,
    hp: 1400,
    strength: 100,
    defense: 90,
    stamina: 95,
    intelligence: 100,
    speed: 90,
    skills: [
      ["Bungee Gum", 35, 4000, 1],
      ["Texture Surprise", 25, 3000, 5],
      ["Armadilha de Bungee Gum", 60, 10000, 15],
      ["Bungee Gum Avançado", 95, 22000, 30],
      ["Bungee Gum Supremo", 130, 40000, 50]
    ]
  },
  {
    id: "illumi",
    name: "Illumi Zoldyck",
    rarity: "Épico",
    chance: 1.8,
    value: 65000,
    hp: 1250,
    strength: 80,
    defense: 75,
    stamina: 90,
    intelligence: 105,
    speed: 85,
    skills: [
      ["Agulhas", 40, 5000, 1],
      ["Controle Humano", 65, 10000, 12],
      ["Corpo Transformado", 80, 15000, 22],
      ["Exército de Agulhas", 115, 30000, 40]
    ]
  },
  {
    id: "biscuit",
    name: "Biscuit Krueger",
    rarity: "Épico",
    chance: 1.5,
    value: 70000,
    hp: 1500,
    strength: 110,
    defense: 100,
    stamina: 105,
    intelligence: 110,
    speed: 80,
    skills: [
      ["Forma Verdadeira", 50, 7000, 5],
      ["Golpe Reforçado", 75, 12000, 15],
      ["Força Monstruosa", 110, 25000, 30],
      ["Biscuit Suprema", 145, 45000, 50]
    ]
  },
  {
    id: "silva",
    name: "Silva Zoldyck",
    rarity: "Épico",
    chance: 1.3,
    value: 75000,
    hp: 1550,
    strength: 120,
    defense: 105,
    stamina: 100,
    intelligence: 95,
    speed: 90,
    skills: [
      ["Esfera de Nen", 55, 7000, 5],
      ["Orbe de Aura", 80, 12000, 15],
      ["Impacto Explosivo", 110, 23000, 30],
      ["Esfera Suprema", 150, 45000, 50]
    ]
  },
  {
    id: "zeno",
    name: "Zeno Zoldyck",
    rarity: "Épico",
    chance: 1.2,
    value: 80000,
    hp: 1500,
    strength: 105,
    defense: 100,
    stamina: 105,
    intelligence: 110,
    speed: 100,
    skills: [
      ["Dragon Head", 45, 6000, 5],
      ["Dragon Lance", 65, 10000, 15],
      ["Dragon Dive", 90, 20000, 28],
      ["Dragon Supremo", 135, 40000, 50]
    ]
  },
  {
    id: "razor",
    name: "Razor",
    rarity: "Lendário",
    chance: 0.9,
    value: 100000,
    hp: 1800,
    strength: 135,
    defense: 115,
    stamina: 120,
    intelligence: 90,
    speed: 80,
    skills: [
      ["Nen Ball", 60, 8000, 5],
      ["14 Devils", 85, 15000, 18],
      ["Throw Nen", 120, 30000, 35],
      ["Nen Ball Supremo", 160, 55000, 55]
    ]
  },
  {
    id: "chrollo",
    name: "Chrollo Lucilfer",
    rarity: "Lendário",
    chance: 1,
    value: 120000,
    hp: 1500,
    strength: 100,
    defense: 95,
    stamina: 105,
    intelligence: 125,
    speed: 95,
    skills: [
      ["Skill Hunter", 35, 8000, 5],
      ["Double Face", 50, 12000, 12],
      ["Sun & Moon", 80, 22000, 25],
      ["Black Voice", 95, 28000, 35],
      ["Skill Hunter Supremo", 150, 55000, 60]
    ]
  },
  {
    id: "netero",
    name: "Isaac Netero",
    rarity: "Lendário",
    chance: 0.7,
    value: 150000,
    hp: 1900,
    strength: 140,
    defense: 130,
    stamina: 125,
    intelligence: 130,
    speed: 135,
    skills: [
      ["Zero Hand", 70, 10000, 10],
      ["Guanyin", 100, 20000, 25],
      ["100-Type Guanyin", 140, 35000, 40],
      ["Zero Hand Supremo", 190, 70000, 65]
    ]
  },
  {
    id: "ging",
    name: "Ging Freecss",
    rarity: "Lendário",
    chance: 0.5,
    value: 180000,
    hp: 1750,
    strength: 125,
    defense: 115,
    stamina: 125,
    intelligence: 145,
    speed: 110,
    skills: [
      ["Cópia de Técnica", 55, 10000, 5],
      ["Ataque Copiado", 80, 18000, 15],
      ["Nen Adaptativo", 120, 30000, 30],
      ["Técnica Suprema", 170, 60000, 55]
    ]
  },
  {
    id: "meruem",
    name: "Meruem",
    rarity: "Mítico",
    chance: 0.2,
    value: 250000,
    hp: 3000,
    strength: 200,
    defense: 180,
    stamina: 170,
    intelligence: 180,
    speed: 150,
    skills: [
      ["Aura Dominante", 80, 15000, 10],
      ["En", 90, 18000, 15],
      ["Poder da Quimera", 120, 28000, 25],
      ["Evolução", 160, 45000, 40],
      ["Rage Blast", 220, 80000, 70]
    ]
  },
  {
    id: "pitou",
    name: "Neferpitou",
    rarity: "Mítico",
    chance: 0.15,
    value: 220000,
    hp: 2600,
    strength: 175,
    defense: 170,
    stamina: 165,
    intelligence: 160,
    speed: 145,
    skills: [
      ["Doctor Blythe", 60, 12000, 10],
      ["Terpsichora", 100, 22000, 25],
      ["En Supremo", 130, 35000, 40],
      ["Terpsichora Máximo", 190, 65000, 65]
    ]
  },
  {
    id: "pouf",
    name: "Shaiapouf",
    rarity: "Mítico",
    chance: 0.15,
    value: 210000,
    hp: 2500,
    strength: 150,
    defense: 160,
    stamina: 180,
    intelligence: 170,
    speed: 140,
    skills: [
      ["Beelzebub", 60, 12000, 10],
      ["Spiritual Message", 80, 18000, 20],
      ["Cocoon", 110, 30000, 35],
      ["Divisão Suprema", 175, 60000, 60]
    ]
  },
  {
    id: "youpi",
    name: "Menthuthuyoupi",
    rarity: "Mítico",
    chance: 0.15,
    value: 215000,
    hp: 2800,
    strength: 190,
    defense: 190,
    stamina: 180,
    intelligence: 130,
    speed: 120,
    skills: [
      ["Metamorfose", 70, 12000, 10],
      ["Tentáculos", 100, 20000, 20],
      ["Explosão de Raiva", 150, 35000, 35],
      ["Rage Blast Supremo", 210, 70000, 60]
    ]
  }
];

// ======================================================
// NEN
// ======================================================

const nenTypes = [
  { name: "Fortificação", chance: 25 },
  { name: "Emissão", chance: 20 },
  { name: "Transformação", chance: 20 },
  { name: "Conjuração", chance: 15 },
  { name: "Manipulação", chance: 15 },
  { name: "Especialização", chance: 5 }
];

function randomNen() {
  const roll = Math.random() * 100;
  let total = 0;

  for (const nen of nenTypes) {
    total += nen.chance;
    if (roll <= total) return nen.name;
  }

  return "Fortificação";
}

// ======================================================
// BOSSES
// ======================================================

const bosses = [
  {
    id: "bandit",
    name: "Bandido",
    group: "Iniciais",
    minLevel: 1,
    maxLevel: 5,
    hp: 180,
    damage: 20,
    defense: 10,
    xp: 100,
    money: 50
  },
  {
    id: "thief",
    name: "Ladrão",
    group: "Iniciais",
    minLevel: 5,
    maxLevel: 10,
    hp: 280,
    damage: 30,
    defense: 15,
    xp: 180,
    money: 80
  },
  {
    id: "nen_user",
    name: "Usuário de Nen",
    group: "Iniciais",
    minLevel: 10,
    maxLevel: 20,
    hp: 450,
    damage: 45,
    defense: 25,
    xp: 300,
    money: 150
  },
  {
    id: "hunter",
    name: "Hunter Renegado",
    group: "Iniciais",
    minLevel: 20,
    maxLevel: 30,
    hp: 650,
    damage: 60,
    defense: 35,
    xp: 500,
    money: 250
  },

  // TRUPE FANTASMA
  {
    id: "kalluto_boss",
    name: "Kalluto",
    group: "Trupe Fantasma",
    minLevel: 25,
    maxLevel: 35,
    hp: 800,
    damage: 70,
    defense: 45,
    xp: 700,
    money: 350
  },
  {
    id: "shizuku_boss",
    name: "Shizuku",
    group: "Trupe Fantasma",
    minLevel: 30,
    maxLevel: 40,
    hp: 900,
    damage: 80,
    defense: 50,
    xp: 850,
    money: 400
  },
  {
    id: "shalnark_boss",
    name: "Shalnark",
    group: "Trupe Fantasma",
    minLevel: 35,
    maxLevel: 45,
    hp: 1000,
    damage: 90,
    defense: 55,
    xp: 1000,
    money: 500
  },
  {
    id: "machi_boss",
    name: "Machi",
    group: "Trupe Fantasma",
    minLevel: 40,
    maxLevel: 50,
    hp: 1100,
    damage: 100,
    defense: 65,
    xp: 1200,
    money: 600
  },
  {
    id: "nobunaga_boss",
    name: "Nobunaga",
    group: "Trupe Fantasma",
    minLevel: 45,
    maxLevel: 55,
    hp: 1200,
    damage: 110,
    defense: 70,
    xp: 1400,
    money: 700
  },
  {
    id: "phinks_boss",
    name: "Phinks",
    group: "Trupe Fantasma",
    minLevel: 50,
    maxLevel: 60,
    hp: 1350,
    damage: 125,
    defense: 75,
    xp: 1600,
    money: 800
  },
  {
    id: "feitan_boss",
    name: "Feitan",
    group: "Trupe Fantasma",
    minLevel: 55,
    maxLevel: 65,
    hp: 1450,
    damage: 140,
    defense: 80,
    xp: 1800,
    money: 900
  },
  {
    id: "franklin_boss",
    name: "Franklin",
    group: "Trupe Fantasma",
    minLevel: 60,
    maxLevel: 70,
    hp: 1550,
    damage: 145,
    defense: 85,
    xp: 2000,
    money: 1000
  },
  {
    id: "bonolenov_boss",
    name: "Bonolenov",
    group: "Trupe Fantasma",
    minLevel: 60,
    maxLevel: 75,
    hp: 1600,
    damage: 150,
    defense: 90,
    xp: 2200,
    money: 1100
  },
  {
    id: "pakunoda_boss",
    name: "Pakunoda",
    group: "Trupe Fantasma",
    minLevel: 55,
    maxLevel: 70,
    hp: 1300,
    damage: 120,
    defense: 75,
    xp: 1700,
    money: 850
  },
  {
    id: "kortopi_boss",
    name: "Kortopi",
    group: "Trupe Fantasma",
    minLevel: 50,
    maxLevel: 65,
    hp: 1250,
    damage: 115,
    defense: 70,
    xp: 1600,
    money: 800
  },
  {
    id: "uvogin_boss",
    name: "Uvogin",
    group: "Trupe Fantasma",
    minLevel: 65,
    maxLevel: 80,
    hp: 2000,
    damage: 180,
    defense: 110,
    xp: 3000,
    money: 1500
  },
  {
    id: "chrollo_boss",
    name: "Chrollo Lucilfer",
    group: "Trupe Fantasma",
    minLevel: 70,
    maxLevel: 100,
    hp: 2300,
    damage: 200,
    defense: 120,
    xp: 4000,
    money: 2000
  },

  // FORMIGAS QUIMERA
  {
    id: "soldier_ant",
    name: "Soldado Formiga Quimera",
    group: "Formigas Quimera",
    minLevel: 70,
    maxLevel: 85,
    hp: 1800,
    damage: 160,
    defense: 100,
    xp: 2500,
    money: 1200
  },
  {
    id: "rammot",
    name: "Rammot",
    group: "Formigas Quimera",
    minLevel: 75,
    maxLevel: 95,
    hp: 2100,
    damage: 190,
    defense: 115,
    xp: 3200,
    money: 1600
  },
  {
    id: "cheetu",
    name: "Cheetu",
    group: "Formigas Quimera",
    minLevel: 85,
    maxLevel: 105,
    hp: 2200,
    damage: 210,
    defense: 110,
    xp: 3500,
    money: 1800
  },
  {
    id: "leol",
    name: "Leol",
    group: "Formigas Quimera",
    minLevel: 95,
    maxLevel: 115,
    hp: 2500,
    damage: 230,
    defense: 130,
    xp: 4000,
    money: 2000
  },
  {
    id: "zazan",
    name: "Zazan",
    group: "Formigas Quimera",
    minLevel: 105,
    maxLevel: 125,
    hp: 2800,
    damage: 250,
    defense: 145,
    xp: 5000,
    money: 2500
  },

  // GUARDAS REAIS
  {
    id: "pitou_boss",
    name: "Neferpitou",
    group: "Guardas Reais",
    minLevel: 120,
    maxLevel: 150,
    hp: 5000,
    damage: 400,
    defense: 250,
    xp: 9000,
    money: 5000
  },
  {
    id: "pouf_boss",
    name: "Shaiapouf",
    group: "Guardas Reais",
    minLevel: 130,
    maxLevel: 160,
    hp: 5200,
    damage: 420,
    defense: 260,
    xp: 9500,
    money: 5500
  },
  {
    id: "youpi_boss",
    name: "Menthuthuyoupi",
    group: "Guardas Reais",
    minLevel: 140,
    maxLevel: 175,
    hp: 6000,
    damage: 450,
    defense: 300,
    xp: 11000,
    money: 6500
  },

  // MERUEM
  {
    id: "meruem_boss",
    name: "Meruem",
    group: "Rei das Formigas",
    minLevel: 180,
    maxLevel: 9999,
    hp: 10000,
    damage: 700,
    defense: 450,
    xp: 25000,
    money: 15000
  }
];

// ======================================================
// UTILIDADES
// ======================================================

function weightedCharacter() {
  const total = characters.reduce((sum, c) => sum + c.chance, 0);
  let roll = Math.random() * total;

  for (const character of characters) {
    roll -= character.chance;

    if (roll <= 0) {
      return character;
    }
  }

  return characters[0];
}

function getCharacter(id) {
  return characters.find(c => c.id === id);
}

function getBoss(id) {
  return bosses.find(b => b.id === id);
}

function createPlayer(userId) {
  const character = weightedCharacter();
  const nen = randomNen();

  const maxHp = character.hp;
  const maxStamina = character.stamina;

  players[userId] = {
    userId,

    characterId: character.id,
    characterName: character.name,
    rarity: character.rarity,
    characterChance: character.chance,
    characterValue: character.value,

    nen,

    level: 1,
    xp: 0,
    totalXp: 0,
    money: 0,

    hp: maxHp,
    maxHp,

    stamina: maxStamina,
    maxStamina,

    strength: character.strength,
    defense: character.defense,
    intelligence: character.intelligence,
    speed: character.speed,

    upgradePoints: 5,

    unlockedSkills: [],

    wins: 0,
    losses: 0,

    currentBossId: null,
    currentBossHp: 0,

    createdAt: Date.now()
  };

  savePlayers();

  return players[userId];
}

function getPlayer(userId) {
  if (!players[userId]) {
    return createPlayer(userId);
  }

  return players[userId];
}

function xpNeeded(level) {
  return Math.floor(100 * Math.pow(level, 1.35));
}

function addXp(player, amount) {
  player.xp += amount;
  player.totalXp += amount;

  let levels = 0;

  while (player.xp >= xpNeeded(player.level)) {
    player.xp -= xpNeeded(player.level);
    player.level++;
    player.upgradePoints += 3;
    levels++;
  }

  return levels;
}

function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

function randomBossForLevel(level) {
  const available = bosses.filter(
    boss => level >= boss.minLevel
  );

  if (!available.length) {
    return bosses[0];
  }

  return available[Math.floor(Math.random() * available.length)];
}

function calculatePlayerDamage(player) {
  const character = getCharacter(player.characterId);

  let damage =
    Math.floor(
      player.strength * 0.7 +
      player.speed * 0.2 +
      player.intelligence * 0.1
    );

  if (player.nen === "Fortificação") damage += 15;
  if (player.nen === "Emissão") damage += 10;
  if (player.nen === "Transformação") damage += 12;
  if (player.nen === "Conjuração") damage += 8;
  if (player.nen === "Manipulação") damage += 8;
  if (player.nen === "Especialização") damage += 20;

  if (character) {
    damage += Math.floor(character.strength * 0.15);
  }

  return Math.max(5, damage);
}

function calculateBossDamage(player, boss, defending = false) {
  let damage = boss.damage - Math.floor(player.defense * 0.35);

  if (defending) {
    damage = Math.floor(damage * 0.45);
  }

  return Math.max(1, damage);
}

function embedColor(rarity) {
  const colors = {
    "Comum": 0x95a5a6,
    "Incomum": 0x2ecc71,
    "Raro": 0x3498db,
    "Épico": 0x9b59b6,
    "Lendário": 0xf1c40f,
    "Mítico": 0xe74c3c
  };

  return colors[rarity] || 0x5865F2;
}

// ======================================================
// EMBEDS
// ======================================================

function panelEmbed(player) {
  const character = getCharacter(player.characterId);

  return new EmbedBuilder()
    .setColor(embedColor(player.rarity))
    .setTitle("🎮 Hunter x Hunter RPG")
    .setDescription(
      `**${player.characterName}** • ${player.rarity}\n` +
      `🔮 Nen: **${player.nen}**\n\n` +
      `📊 **Nível:** ${player.level}\n` +
      `✨ **XP:** ${player.xp}/${xpNeeded(player.level)}\n` +
      `💰 **Dinheiro:** ${player.money}\n\n` +
      `❤️ **Vida:** ${player.hp}/${player.maxHp}\n` +
      `⚡ **Stamina:** ${player.stamina}/${player.maxStamina}\n\n` +
      `💪 Força: ${player.strength}\n` +
      `🛡️ Defesa: ${player.defense}\n` +
      `🧠 Inteligência: ${player.intelligence}\n` +
      `💨 Velocidade: ${player.speed}\n\n` +
      `📈 Pontos de upgrade: **${player.upgradePoints}**`
    )
    .setFooter({
      text: "Hunter x Hunter RPG • Use os botões para jogar"
    });
}

function characterEmbed(player) {
  const character = getCharacter(player.characterId);

  const skills = character.skills
    .map((skill, i) => {
      const [name, damage, cost, level] = skill;
      const unlocked = player.unlockedSkills.includes(i);

      return `${unlocked ? "✅" : "🔒"} **${name}** — 💥 ${damage} dano — ✨ ${cost} XP — Lv.${level}`;
    })
    .join("\n");

  return new EmbedBuilder()
    .setColor(embedColor(player.rarity))
    .setTitle(`🎭 ${character.name}`)
    .setDescription(
      `⭐ **Raridade:** ${character.rarity}\n` +
      `🎲 **Chance:** ${character.chance}%\n` +
      `💰 **Valor:** ${character.value}\n` +
      `🔮 **Nen:** ${player.nen}\n\n` +
      `❤️ HP: ${player.maxHp}\n` +
      `💪 Força: ${player.strength}\n` +
      `🛡️ Defesa: ${player.defense}\n` +
      `⚡ Stamina: ${player.maxStamina}\n` +
      `🧠 Inteligência: ${player.intelligence}\n` +
      `💨 Velocidade: ${player.speed}\n\n` +
      `**⚡ Poderes do personagem**\n${skills}`
    );
}

function nenEmbed(player) {
  const nen = nenTypes.find(n => n.name === player.nen);

  return new EmbedBuilder()
    .setColor(0x8e44ad)
    .setTitle("🔮 Seu Nen")
    .setDescription(
      `Seu Nen foi sorteado **separadamente do personagem**.\n\n` +
      `🔮 **Tipo:** ${player.nen}\n` +
      `🎲 **Chance do tipo:** ${nen ? nen.chance : "?"}%\n\n` +
      `⚠️ O Nen **não pode ser girado novamente**.\n` +
      `🎭 Os poderes/habilidades disponíveis continuam sendo determinados pelo seu personagem.`
    );
}

function profileEmbed(player) {
  return new EmbedBuilder()
    .setColor(embedColor(player.rarity))
    .setTitle(`👤 Perfil de ${player.characterName}`)
    .addFields(
      {
        name: "🎭 Personagem",
        value:
          `${player.characterName}\n` +
          `⭐ ${player.rarity}\n` +
          `🎲 ${player.characterChance}%\n` +
          `💰 Valor: ${player.characterValue}`,
        inline: true
      },
      {
        name: "🔮 Nen",
        value: `${player.nen}`,
        inline: true
      },
      {
        name: "📊 Progressão",
        value:
          `Nível: ${player.level}\n` +
          `XP: ${player.xp}/${xpNeeded(player.level)}\n` +
          `XP total: ${player.totalXp}\n` +
          `💰 Dinheiro: ${player.money}`,
        inline: true
      },
      {
        name: "❤️ Combate",
        value:
          `HP: ${player.hp}/${player.maxHp}\n` +
          `Stamina: ${player.stamina}/${player.maxStamina}\n` +
          `Força: ${player.strength}\n` +
          `Defesa: ${player.defense}`,
        inline: true
      },
      {
        name: "🧠 Atributos",
        value:
          `Inteligência: ${player.intelligence}\n` +
          `Velocidade: ${player.speed}\n` +
          `Upgrades: ${player.upgradePoints}`,
        inline: true
      },
      {
        name: "🏆 Histórico",
        value:
          `Vitórias: ${player.wins}\n` +
          `Derrotas: ${player.losses}`,
        inline: true
      }
    );
}

function skillsEmbed(player) {
  const character = getCharacter(player.characterId);

  const text = character.skills
    .map((skill, index) => {
      const [name, damage, cost, level] = skill;
      const unlocked = player.unlockedSkills.includes(index);

      return (
        `${unlocked ? "✅" : "🔒"} **${name}**\n` +
        `💥 Dano: ${damage}\n` +
        `✨ XP: ${cost}\n` +
        `📊 Nível: ${level}\n`
      );
    })
    .join("\n");

  return new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle(`⚡ Habilidades de ${character.name}`)
    .setDescription(
      `As habilidades são determinadas pelo seu personagem.\n` +
      `Você usa XP para desbloqueá-las.\n\n${text}`
    );
}

function upgradeEmbed(player) {
  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle("📈 Upgrades")
    .setDescription(
      `Você possui **${player.upgradePoints} pontos**.\n\n` +
      `❤️ Vida: ${player.maxHp}\n` +
      `⚡ Stamina: ${player.maxStamina}\n` +
      `💪 Força: ${player.strength}\n` +
      `🛡️ Defesa: ${player.defense}\n` +
      `🧠 Inteligência: ${player.intelligence}\n` +
      `💨 Velocidade: ${player.speed}\n\n` +
      `Cada upgrade custa **1 ponto**.`
    );
}

function battleEmbed(player) {
  const boss = getBoss(player.currentBossId);

  if (!boss) {
    return panelEmbed(player);
  }

  const hpPercent = Math.max(
    0,
    Math.floor((player.currentBossHp / boss.hp) * 100)
  );

  return new EmbedBuilder()
    .setColor(0xe74c3c)
    .setTitle(`⚔️ Batalha — ${boss.name}`)
    .setDescription(
      `👹 **${boss.name}**\n` +
      `🏷️ ${boss.group}\n` +
      `📊 Nível mínimo: ${boss.minLevel}\n\n` +
      `❤️ **Boss HP:** ${player.currentBossHp}/${boss.hp} (${hpPercent}%)\n` +
      `💥 **Dano do Boss:** ${boss.damage}\n` +
      `🛡️ **Defesa do Boss:** ${boss.defense}\n\n` +
      `👤 **${player.characterName}**\n` +
      `❤️ Vida: ${player.hp}/${player.maxHp}\n` +
      `⚡ Stamina: ${player.stamina}/${player.maxStamina}\n\n` +
      `💥 Seu dano básico: ${calculatePlayerDamage(player)}`
    );
}

// ======================================================
// BOTÕES
// ======================================================

function mainButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("character")
        .setLabel("Personagem")
        .setEmoji("🎭")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("nen")
        .setLabel("Nen")
        .setEmoji("🔮")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("bosses")
        .setLabel("Bosses")
        .setEmoji("👹")
        .setStyle(ButtonStyle.Danger)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("skills")
        .setLabel("Habilidades")
        .setEmoji("⚡")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("upgrades")
        .setLabel("Upgrades")
        .setEmoji("📈")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("profile")
        .setLabel("Perfil")
        .setEmoji("👤")
        .setStyle(ButtonStyle.Secondary)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("battle_random")
        .setLabel("Batalhar")
        .setEmoji("⚔️")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("refresh")
        .setLabel("Atualizar")
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Secondary)
    )
  ];
}

function backButton() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("back_panel")
      .setLabel("Voltar")
      .setEmoji("⬅️")
      .setStyle(ButtonStyle.Secondary)
  );
}

function upgradeButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("up_hp")
        .setLabel("Vida +")
        .setEmoji("❤️")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("up_stamina")
        .setLabel("Stamina +")
        .setEmoji("⚡")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("up_strength")
        .setLabel("Força +")
        .setEmoji("💪")
        .setStyle(ButtonStyle.Primary)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("up_defense")
        .setLabel("Defesa +")
        .setEmoji("🛡️")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("up_intelligence")
        .setLabel("Inteligência +")
        .setEmoji("🧠")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("up_speed")
        .setLabel("Velocidade +")
        .setEmoji("💨")
        .setStyle(ButtonStyle.Primary)
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("back_panel")
        .setLabel("Voltar")
        .setEmoji("⬅️")
        .setStyle(ButtonStyle.Secondary)
    )
  ];
}

function battleButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("attack")
        .setLabel("Atacar")
        .setEmoji("⚔️")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("use_skill")
        .setLabel("Habilidade")
        .setEmoji("⚡")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("defend")
        .setLabel("Defender")
        .setEmoji("🛡️")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("flee")
        .setLabel("Fugir")
        .setEmoji("🏃")
        .setStyle(ButtonStyle.Secondary)
    )
  ];
}

// ======================================================
// REGISTRO DO /RPG E /ADM
// ======================================================

const commands = [
  new SlashCommandBuilder()
    .setName("rpg")
    .setDescription("Abrir o Hunter x Hunter RPG"),

  new SlashCommandBuilder()
    .setName("adm")
    .setDescription("Painel administrativo do RPG")
    .addStringOption(option =>
      option
        .setName("acao")
        .setDescription("Ação administrativa")
        .setRequired(true)
        .addChoices(
          { name: "Dar XP", value: "give_xp" },
          { name: "Dar dinheiro", value: "give_money" },
          { name: "Dar nível", value: "give_level" },
          { name: "Dar upgrade", value: "give_upgrade" },
          { name: "Evento XP", value: "event_xp" },
          { name: "Evento dinheiro", value: "event_money" }
        )
    )
    .addUserOption(option =>
      option
        .setName("usuario")
        .setDescription("Jogador que receberá a recompensa")
        .setRequired(false)
    )
    .addIntegerOption(option =>
      option
        .setName("quantidade")
        .setDescription("Quantidade")
        .setRequired(false)
        .setMinValue(1)
    )
];

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    {
      body: commands.map(command => command.toJSON())
    }
  );

  console.log("Comandos registrados.");
}

// ======================================================
// READY
// ======================================================

client.once("ready", async () => {
  console.log(`${client.user.tag} está online!`);

  try {
    await registerCommands();
  } catch (error) {
    console.error("Erro registrando comandos:", error);
  }
});

// ======================================================
// INTERAÇÕES
// ======================================================

client.on("interactionCreate", async interaction => {
  try {
    // ==================================================
    // /RPG
    // ==================================================

    if (interaction.isChatInputCommand() && interaction.commandName === "rpg") {
      const isNew = !players[interaction.user.id];

      const player = getPlayer(interaction.user.id);

      if (isNew) {
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(embedColor(player.rarity))
              .setTitle("🎉 Seu personagem foi sorteado!")
              .setDescription(
                `🎭 **${player.characterName}**\n` +
                `⭐ Raridade: **${player.rarity}**\n` +
                `🎲 Chance: **${player.characterChance}%**\n\n` +
                `🔮 Seu Nen também foi sorteado:\n` +
                `**${player.nen}**\n\n` +
                `Use os botões abaixo para começar.`
              )
          ],
          components: mainButtons()
        });
      } else {
        await interaction.reply({
          embeds: [panelEmbed(player)],
          components: mainButtons()
        });
      }

      return;
    }

    // ==================================================
    // /ADM
    // ==================================================

    if (interaction.isChatInputCommand() && interaction.commandName === "adm") {
      if (!isAdmin(interaction.user.id)) {
        return interaction.reply({
          content: "❌ Você não tem permissão para usar este comando.",
          ephemeral: true
        });
      }

      const action = interaction.options.getString("acao");
      const target = interaction.options.getUser("usuario");
      const amount = interaction.options.getInteger("quantidade") || 1;

      if (action.startsWith("event_")) {
        let affected = 0;

        for (const id of Object.keys(players)) {
          const p = players[id];

          if (action === "event_xp") {
            addXp(p, amount);
          }

          if (action === "event_money") {
            p.money += amount;
          }

          affected++;
        }

        savePlayers();

        return interaction.reply({
          content:
            `🎉 **Evento realizado!**\n` +
            `👥 Jogadores afetados: **${affected}**\n` +
            `${action === "event_xp" ? "✨ XP" : "💰 Dinheiro"} recebido: **${amount}**`,
          ephemeral: true
        });
      }

      if (!target) {
        return interaction.reply({
          content: "❌ Você precisa selecionar um usuário.",
          ephemeral: true
        });
      }

      const player = getPlayer(target.id);

      if (action === "give_xp") {
        const levels = addXp(player, amount);

        savePlayers();

        return interaction.reply({
          content:
            `✨ **${amount} XP** adicionados a ${target}.\n` +
            `📊 Nível atual: **${player.level}**` +
            (levels ? `\n⬆️ Subiu **${levels} nível(is)**!` : ""),
          ephemeral: true
        });
      }

      if (action === "give_money") {
        player.money += amount;
        savePlayers();

        return interaction.reply({
          content: `💰 **${amount}** adicionados para ${target}.`,
          ephemeral: true
        });
      }

      if (action === "give_level") {
        player.level += amount;
        player.upgradePoints += amount * 3;

        savePlayers();

        return interaction.reply({
          content:
            `📊 ${target} recebeu **${amount} nível(is)**.\n` +
            `Novo nível: **${player.level}**`,
          ephemeral: true
        });
      }

      if (action === "give_upgrade") {
        player.upgradePoints += amount;
        savePlayers();

        return interaction.reply({
          content:
            `📈 ${target} recebeu **${amount} ponto(s) de upgrade**.`,
          ephemeral: true
        });
      }
    }

    // ==================================================
    // BOTÕES
    // ==================================================

    if (!interaction.isButton() && !interaction.isStringSelectMenu()) {
      return;
    }

    const player = getPlayer(interaction.user.id);

    // --------------------------------------------------
    // PERSONAGEM
    // --------------------------------------------------

    if (interaction.customId === "character") {
      return interaction.update({
        embeds: [characterEmbed(player)],
        components: [backButton()]
      });
    }

    // --------------------------------------------------
    // NEN
    // --------------------------------------------------

    if (interaction.customId === "nen") {
      return interaction.update({
        embeds: [nenEmbed(player)],
        components: [backButton()]
      });
    }

    // --------------------------------------------------
    // PERFIL
    // --------------------------------------------------

    if (interaction.customId === "profile") {
      return interaction.update({
        embeds: [profileEmbed(player)],
        components: [backButton()]
      });
    }

    // --------------------------------------------------
    // HABILIDADES
    // --------------------------------------------------

    if (interaction.customId === "skills") {
      const character = getCharacter(player.characterId);

      const options = character.skills.map((skill, index) => {
        const unlocked = player.unlockedSkills.includes(index);

        return {
          label: skill[0],
          description: unlocked
            ? "Habilidade já desbloqueada"
            : `${skill[1]} dano • ${skill[2]} XP • nível ${skill[3]}`,
          value: String(index)
        };
      });

      const menu = new StringSelectMenuBuilder()
        .setCustomId("unlock_skill")
        .setPlaceholder("Selecione uma habilidade")
        .addOptions(options);

      return interaction.update({
        embeds: [skillsEmbed(player)],
        components: [
          new ActionRowBuilder().addComponents(menu),
          backButton()
        ]
      });
    }

    // --------------------------------------------------
    // DESBLOQUEAR HABILIDADE
    // --------------------------------------------------

    if (interaction.customId === "unlock_skill") {
      const index = Number(interaction.values[0]);
      const character = getCharacter(player.characterId);
      const skill = character.skills[index];

      if (!skill) {
        return interaction.update({
          embeds: [skillsEmbed(player)],
          components: [backButton()]
        });
      }

      const [name, damage, cost, requiredLevel] = skill;

      if (player.unlockedSkills.includes(index)) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0x2ecc71)
              .setTitle("⚡ Habilidade")
              .setDescription(
                `✅ **${name}** já está desbloqueada!\n\n` +
                `💥 Dano: **${damage}**`
              )
          ],
          components: [backButton()]
        });
      }

      if (player.level < requiredLevel) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe67e22)
              .setTitle("🔒 Habilidade bloqueada")
              .setDescription(
                `**${name}**\n\n` +
                `📊 Nível necessário: **${requiredLevel}**\n` +
                `📊 Seu nível: **${player.level}**`
              )
          ],
          components: [backButton()]
        });
      }

      if (player.totalXp < cost) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("❌ XP insuficiente")
              .setDescription(
                `**${name}** custa **${cost} XP**.\n\n` +
                `✨ Seu XP total: **${player.totalXp}**`
              )
          ],
          components: [backButton()]
        });
      }

      player.totalXp -= cost;
      player.unlockedSkills.push(index);

      savePlayers();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0x2ecc71)
            .setTitle("⚡ Habilidade desbloqueada!")
            .setDescription(
              `✅ **${name}** foi desbloqueada!\n\n` +
              `💥 Dano: **${damage}**\n` +
              `✨ XP gasto: **${cost}**`
            )
        ],
        components: [backButton()]
      });
    }

    // --------------------------------------------------
    // UPGRADES
    // --------------------------------------------------

    if (interaction.customId === "upgrades") {
      return interaction.update({
        embeds: [upgradeEmbed(player)],
        components: upgradeButtons()
      });
    }

    const upgradeMap = {
      up_hp: "hp",
      up_stamina: "stamina",
      up_strength: "strength",
      up_defense: "defense",
      up_intelligence: "intelligence",
      up_speed: "speed"
    };

    if (upgradeMap[interaction.customId]) {
      if (player.upgradePoints <= 0) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("❌ Sem pontos")
              .setDescription(
                "Você não possui pontos de upgrade disponíveis."
              )
          ],
          components: upgradeButtons()
        });
      }

      const stat = upgradeMap[interaction.customId];

      player.upgradePoints--;

      if (stat === "hp") {
        player.maxHp += 50;
        player.hp = Math.min(player.maxHp, player.hp + 50);
      } else if (stat === "stamina") {
        player.maxStamina += 10;
        player.stamina = Math.min(player.maxStamina, player.stamina + 10);
      } else {
        player[stat] += 5;
      }

      savePlayers();

      return interaction.update({
        embeds: [upgradeEmbed(player)],
        components: upgradeButtons()
      });
    }

    // --------------------------------------------------
    // BOSSES
    // --------------------------------------------------

    if (interaction.customId === "bosses") {
      const available = bosses.filter(
        boss => player.level >= boss.minLevel
      );

      if (!available.length) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("👹 Bosses")
              .setDescription(
                "Você ainda não possui nenhum boss disponível."
              )
          ],
          components: [backButton()]
        });
      }

      const options = available.slice(0, 25).map(boss => ({
        label: boss.name,
        description:
          `${boss.group} • Lv.${boss.minLevel}+ • ${boss.damage} dano`,
        value: boss.id
      }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId("boss_select")
        .setPlaceholder("Escolha um boss disponível")
        .addOptions(options);

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0xe74c3c)
            .setTitle("👹 Bosses disponíveis")
            .setDescription(
              `Seu nível: **${player.level}**\n\n` +
              available
                .map(
                  b =>
                    `👹 **${b.name}** — ${b.group} — Lv.${b.minLevel}+`
                )
                .join("\n")
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(menu),
          backButton()
        ]
      });
    }

    // --------------------------------------------------
    // BATALHA RANDOM
    // --------------------------------------------------

    if (interaction.customId === "battle_random") {
      if (player.hp <= 0) {
        player.hp = Math.max(1, Math.floor(player.maxHp * 0.25));
        player.stamina = Math.max(
          1,
          Math.floor(player.maxStamina * 0.25)
        );
      }

      const boss = randomBossForLevel(player.level);

      player.currentBossId = boss.id;
      player.currentBossHp = boss.hp;

      savePlayers();

      return interaction.update({
        embeds: [battleEmbed(player)],
        components: battleButtons()
      });
    }

    // --------------------------------------------------
    // SELEÇÃO DE BOSS
    // --------------------------------------------------

    if (interaction.customId === "boss_select") {
      const boss = getBoss(interaction.values[0]);

      if (!boss || player.level < boss.minLevel) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe74c3c)
              .setTitle("❌ Boss indisponível")
              .setDescription(
                "Seu nível ainda não permite enfrentar esse boss."
              )
          ],
          components: [backButton()]
        });
      }

      player.currentBossId = boss.id;
      player.currentBossHp = boss.hp;

      savePlayers();

      return interaction.update({
        embeds: [battleEmbed(player)],
        components: battleButtons()
      });
    }

    // --------------------------------------------------
    // ATAQUE
    // --------------------------------------------------

    if (interaction.customId === "attack") {
      const boss = getBoss(player.currentBossId);

      if (!boss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: mainButtons()
        });
      }

      const damage = calculatePlayerDamage(player);

      player.currentBossHp -= damage;
      player.stamina = Math.max(0, player.stamina - 5);

      if (player.currentBossHp <= 0) {
        player.currentBossHp = 0;

        const levels = addXp(player, boss.xp);
        player.money += boss.money;
        player.wins++;

        player.currentBossId = null;
        player.currentBossHp = 0;

        player.hp = Math.min(player.maxHp, player.hp + 50);
        player.stamina = Math.min(
          player.maxStamina,
          player.stamina + 15
        );

        savePlayers();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0x2ecc71)
              .setTitle("🏆 Vitória!")
              .setDescription(
                `Você derrotou **${boss.name}**!\n\n` +
                `⚔️ Dano causado: **${damage}**\n` +
                `✨ XP recebido: **${boss.xp}**\n` +
                `💰 Dinheiro recebido: **${boss.money}**\n\n` +
                `📊 Nível: **${player.level}**` +
                (levels
                  ? `\n⬆️ Você subiu **${levels} nível(is)!**`
                  : "")
              )
          ],
          components: mainButtons()
        });
      }

      const bossDamage = calculateBossDamage(player, boss);

      player.hp -= bossDamage;
      player.stamina = Math.max(
        0,
        player.stamina - Math.floor(bossDamage * 0.15)
      );

      if (player.hp <= 0) {
        player.hp = 0;
        player.losses++;

        // PENALIDADE DE MORTE
        player.maxHp = Math.max(
          100,
          player.maxHp - 50
        );

        player.maxStamina = Math.max(
          20,
          player.maxStamina - 10
        );

        player.hp = Math.max(
          1,
          Math.floor(player.maxHp * 0.25)
        );

        player.stamina = Math.max(
          1,
          Math.floor(player.maxStamina * 0.25)
        );

        player.currentBossId = null;
        player.currentBossHp = 0;

        savePlayers();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0x000000)
              .setTitle("💀 Você morreu!")
              .setDescription(
                `Você foi derrotado por **${boss.name}**.\n\n` +
                `📉 **Penalidade:**\n` +
                `❤️ Vida máxima: -50\n` +
                `⚡ Stamina máxima: -10\n\n` +
                `📈 Use **Upgrades** para recuperar e aumentar seus atributos.\n\n` +
                `❤️ Vida atual: ${player.hp}/${player.maxHp}\n` +
                `⚡ Stamina atual: ${player.stamina}/${player.maxStamina}`
              )
          ],
          components: mainButtons()
        });
      }

      savePlayers();

      return interaction.update({
        embeds: [
          battleEmbed(player),
          new EmbedBuilder()
            .setColor(0xe67e22)
            .setDescription(
              `⚔️ Você causou **${damage} de dano**.\n` +
              `👹 ${boss.name} causou **${bossDamage} de dano** em você.`
            )
        ],
        components: battleButtons()
      });
    }

    // --------------------------------------------------
    // DEFENDER
    // --------------------------------------------------

    if (interaction.customId === "defend") {
      const boss = getBoss(player.currentBossId);

      if (!boss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: mainButtons()
        });
      }

      const damage = calculateBossDamage(
        player,
        boss,
        true
      );

      player.hp -= damage;
      player.stamina = Math.min(
        player.maxStamina,
        player.stamina + 8
      );

      if (player.hp <= 0) {
        player.hp = 0;
        player.losses++;

        player.maxHp = Math.max(100, player.maxHp - 50);
        player.maxStamina = Math.max(
          20,
          player.maxStamina - 10
        );

        player.hp = Math.max(
          1,
          Math.floor(player.maxHp * 0.25)
        );

        player.stamina = Math.max(
          1,
          Math.floor(player.maxStamina * 0.25)
        );

        player.currentBossId = null;
        player.currentBossHp = 0;

        savePlayers();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0x000000)
              .setTitle("💀 Você morreu!")
              .setDescription(
                `Mesmo se defendendo, você foi derrotado por **${boss.name}**.\n\n` +
                `📉 Vida máxima: **-50**\n` +
                `📉 Stamina máxima: **-10**\n\n` +
                `Use **📈 Upgrades** para recuperar seus atributos.`
              )
          ],
          components: mainButtons()
        });
      }

      savePlayers();

      return interaction.update({
        embeds: [battleEmbed(player)],
        components: battleButtons()
      });
    }

    // --------------------------------------------------
    // USAR HABILIDADE
    // --------------------------------------------------

    if (interaction.customId === "use_skill") {
      const character = getCharacter(player.characterId);

      const unlocked = character.skills
        .map((skill, index) => ({
          skill,
          index
        }))
        .filter(x => player.unlockedSkills.includes(x.index));

      if (!unlocked.length) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0xe67e22)
              .setTitle("🔒 Nenhuma habilidade desbloqueada")
              .setDescription(
                "Vá em **⚡ Habilidades** e use XP para desbloquear os poderes do seu personagem."
              )
          ],
          components: [backButton()]
        });
      }

      const menu = new StringSelectMenuBuilder()
        .setCustomId("battle_skill")
        .setPlaceholder("Escolha uma habilidade")
        .addOptions(
          unlocked.map(({ skill, index }) => ({
            label: skill[0],
            description: `${skill[1]} dano`,
            value: String(index)
          }))
        );

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle("⚡ Escolha sua habilidade")
            .setDescription(
              `Personagem: **${player.characterName}**`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(menu),
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("back_battle")
              .setLabel("Voltar para batalha")
              .setEmoji("⬅️")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

    // --------------------------------------------------
    // HABILIDADE NA BATALHA
    // --------------------------------------------------

    if (interaction.customId === "battle_skill") {
      const boss = getBoss(player.currentBossId);
      const character = getCharacter(player.characterId);

      if (!boss || !character) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: mainButtons()
        });
      }

      const index = Number(interaction.values[0]);
      const skill = character.skills[index];

      if (!skill || !player.unlockedSkills.includes(index)) {
        return interaction.update({
          embeds: [battleEmbed(player)],
          components: battleButtons()
        });
      }

      const damage = Math.max(
        1,
        skill[1] - Math.floor(boss.defense * 0.25)
      );

      player.currentBossHp -= damage;
      player.stamina = Math.max(
        0,
        player.stamina - 12
      );

      if (player.currentBossHp <= 0) {
        player.currentBossHp = 0;

        const levels = addXp(player, boss.xp);
        player.money += boss.money;
        player.wins++;

        player.currentBossId = null;
        player.currentBossHp = 0;

        player.hp = Math.min(
          player.maxHp,
          player.hp + 75
        );

        savePlayers();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0x2ecc71)
              .setTitle("🏆 Vitória com habilidade!")
              .setDescription(
                `⚡ Você usou **${skill[0]}**.\n` +
                `💥 Dano: **${damage}**\n\n` +
                `👹 Boss derrotado: **${boss.name}**\n` +
                `✨ XP: **+${boss.xp}**\n` +
                `💰 Dinheiro: **+${boss.money}**\n\n` +
                `📊 Nível: **${player.level}**` +
                (levels
                  ? `\n⬆️ +${levels} nível(is)!`
                  : "")
              )
          ],
          components: mainButtons()
        });
      }

      const bossDamage = calculateBossDamage(player, boss);

      player.hp -= bossDamage;

      if (player.hp <= 0) {
        player.hp = 0;
        player.losses++;

        player.maxHp = Math.max(100, player.maxHp - 50);
        player.maxStamina = Math.max(
          20,
          player.maxStamina - 10
        );

        player.hp = Math.max(
          1,
          Math.floor(player.maxHp * 0.25)
        );

        player.stamina = Math.max(
          1,
          Math.floor(player.maxStamina * 0.25)
        );

        player.currentBossId = null;
        player.currentBossHp = 0;

        savePlayers();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setColor(0x000000)
              .setTitle("💀 Você morreu!")
              .setDescription(
                `Você usou **${skill[0]}**, mas **${boss.name}** derrotou você.\n\n` +
                `📉 Vida máxima: **-50**\n` +
                `📉 Stamina máxima: **-10**\n\n` +
                `Use **📈 Upgrades** para melhorar seus atributos.`
              )
          ],
          components: mainButtons()
        });
      }

      savePlayers();

      return interaction.update({
        embeds: [battleEmbed(player)],
        components: battleButtons()
      });
    }

    // --------------------------------------------------
    // VOLTAR PARA BATALHA
    // --------------------------------------------------

    if (interaction.customId === "back_battle") {
      return interaction.update({
        embeds: [battleEmbed(player)],
        components: battleButtons()
      });
    }

    // --------------------------------------------------
    // FUGIR
    // --------------------------------------------------

    if (interaction.customId === "flee") {
      player.currentBossId = null;
      player.currentBossHp = 0;

      savePlayers();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor(0xf1c40f)
            .setTitle("🏃 Você fugiu!")
            .setDescription(
              "A batalha foi encerrada."
            )
        ],
        components: mainButtons()
      });
    }

    // --------------------------------------------------
    // VOLTAR AO PAINEL
    // --------------------------------------------------

    if (interaction.customId === "back_panel") {
      return interaction.update({
        embeds: [panelEmbed(player)],
        components: mainButtons()
      });
    }

    // --------------------------------------------------
    // ATUALIZAR
    // --------------------------------------------------

    if (interaction.customId === "refresh") {
      return interaction.update({
        embeds: [panelEmbed(player)],
        components: mainButtons()
      });
    }

  } catch (error) {
    console.error("Erro na interação:", error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Ocorreu um erro ao executar essa ação.",
        ephemeral: true
      });
    }
  }
});

// ======================================================
// LOGIN
// ======================================================

client.login(TOKEN);
