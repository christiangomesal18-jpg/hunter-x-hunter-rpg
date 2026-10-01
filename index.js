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
    StringSelectMenuBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const OWNER_ID = process.env.OWNER_ID;

if (!TOKEN || !CLIENT_ID) {
    console.error("❌ TOKEN ou CLIENT_ID não configurado.");
    process.exit(1);
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const PLAYERS_FILE = "./players.json";

// ======================================================
// BANCO DE DADOS
// ======================================================

if (!fs.existsSync(PLAYERS_FILE)) {
    fs.writeFileSync(PLAYERS_FILE, "{}");
}

function loadPlayers() {
    try {
        return JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf8"));
    } catch {
        return {};
    }
}

function savePlayers(players) {
    fs.writeFileSync(
        PLAYERS_FILE,
        JSON.stringify(players, null, 2)
    );
}

const players = loadPlayers();

// ======================================================
// PERSONAGENS
// ======================================================

const characters = [
    {
        name: "Gon Freecss",
        rarity: "Raro",
        chance: 8,
        base: {
            hp: 120,
            stamina: 100,
            strength: 18,
            defense: 12,
            intelligence: 8,
            speed: 12,
            nen: 15
        },
        skills: [
            { name: "Pedra", damage: 60, xp: 100 },
            { name: "Tesoura", damage: 50, xp: 180 },
            { name: "Papel", damage: 40, xp: 140 },
            { name: "Jajanken", damage: 90, xp: 400 }
        ]
    },

    {
        name: "Killua Zoldyck",
        rarity: "Raro",
        chance: 7,
        base: {
            hp: 110,
            stamina: 125,
            strength: 15,
            defense: 13,
            intelligence: 14,
            speed: 22,
            nen: 16
        },
        skills: [
            { name: "Raio", damage: 40, xp: 100 },
            { name: "Eletricidade", damage: 55, xp: 200 },
            { name: "Godspeed", damage: 90, xp: 450 }
        ]
    },

    {
        name: "Kurapika",
        rarity: "Épico",
        chance: 4,
        base: {
            hp: 115,
            stamina: 105,
            strength: 14,
            defense: 13,
            intelligence: 20,
            speed: 13,
            nen: 22
        },
        skills: [
            { name: "Dowsing Chain", damage: 45, xp: 120 },
            { name: "Holy Chain", damage: 60, xp: 250 },
            { name: "Emperor Time", damage: 95, xp: 500 }
        ]
    },

    {
        name: "Leorio",
        rarity: "Comum",
        chance: 15,
        base: {
            hp: 105,
            stamina: 90,
            strength: 10,
            defense: 10,
            intelligence: 12,
            speed: 8,
            nen: 8
        },
        skills: [
            { name: "Socão", damage: 25, xp: 50 },
            { name: "Punch Nen", damage: 45, xp: 150 }
        ]
    },

    {
        name: "Hisoka",
        rarity: "Lendário",
        chance: 2.5,
        base: {
            hp: 125,
            stamina: 115,
            strength: 18,
            defense: 16,
            intelligence: 23,
            speed: 18,
            nen: 25
        },
        skills: [
            { name: "Bungee Gum", damage: 55, xp: 150 },
            { name: "Texture Surprise", damage: 45, xp: 220 },
            { name: "Bungee Trap", damage: 80, xp: 400 }
        ]
    },

    {
        name: "Chrollo Lucilfer",
        rarity: "Lendário",
        chance: 1.5,
        base: {
            hp: 130,
            stamina: 120,
            strength: 19,
            defense: 17,
            intelligence: 27,
            speed: 17,
            nen: 30
        },
        skills: [
            { name: "Skill Hunter", damage: 75, xp: 250 },
            { name: "Bandit's Secret", damage: 100, xp: 600 }
        ]
    },

    {
        name: "Netero",
        rarity: "Lendário",
        chance: 0.8,
        base: {
            hp: 150,
            stamina: 140,
            strength: 28,
            defense: 24,
            intelligence: 30,
            speed: 28,
            nen: 35
        },
        skills: [
            { name: "100-Type Guanyin", damage: 100, xp: 700 }
        ]
    },

    {
        name: "Zeno Zoldyck",
        rarity: "Épico",
        chance: 3,
        base: {
            hp: 135,
            stamina: 125,
            strength: 20,
            defense: 18,
            intelligence: 25,
            speed: 20,
            nen: 27
        },
        skills: [
            { name: "Dragon Head", damage: 60, xp: 180 },
            { name: "Dragon Dive", damage: 80, xp: 400 }
        ]
    },

    {
        name: "Illumi Zoldyck",
        rarity: "Épico",
        chance: 2,
        base: {
            hp: 120,
            stamina: 110,
            strength: 17,
            defense: 15,
            intelligence: 24,
            speed: 16,
            nen: 25
        },
        skills: [
            { name: "Needle People", damage: 55, xp: 180 },
            { name: "Needle Control", damage: 80, xp: 400 }
        ]
    },

    {
        name: "Kalluto Zoldyck",
        rarity: "Comum",
        chance: 10,
        base: {
            hp: 100,
            stamina: 100,
            strength: 10,
            defense: 10,
            intelligence: 15,
            speed: 15,
            nen: 14
        },
        skills: [
            { name: "Paper Manipulation", damage: 35, xp: 100 },
            { name: "Paper Storm", damage: 60, xp: 250 }
        ]
    },

    {
        name: "Biscuit Krueger",
        rarity: "Épico",
        chance: 3,
        base: {
            hp: 140,
            stamina: 125,
            strength: 25,
            defense: 22,
            intelligence: 25,
            speed: 17,
            nen: 28
        },
        skills: [
            { name: "Super Strength", damage: 55, xp: 150 },
            { name: "True Form", damage: 85, xp: 450 }
        ]
    },

    {
        name: "Ging Freecss",
        rarity: "Lendário",
        chance: 1,
        base: {
            hp: 140,
            stamina: 135,
            strength: 23,
            defense: 20,
            intelligence: 32,
            speed: 22,
            nen: 34
        },
        skills: [
            { name: "Nen Copy", damage: 70, xp: 300 },
            { name: "Nen Mastery", damage: 100, xp: 700 }
        ]
    },

    {
        name: "Feitan",
        rarity: "Épico",
        chance: 2.5,
        base: {
            hp: 125,
            stamina: 115,
            strength: 22,
            defense: 15,
            intelligence: 18,
            speed: 24,
            nen: 24
        },
        skills: [
            { name: "Rising Sun", damage: 85, xp: 400 },
            { name: "Pain Packer", damage: 100, xp: 650 }
        ]
    },

    {
        name: "Phinks",
        rarity: "Raro",
        chance: 5,
        base: {
            hp: 135,
            stamina: 110,
            strength: 25,
            defense: 17,
            intelligence: 12,
            speed: 15,
            nen: 20
        },
        skills: [
            { name: "Ripper Cyclotron", damage: 75, xp: 350 }
        ]
    },

    {
        name: "Machi",
        rarity: "Raro",
        chance: 5,
        base: {
            hp: 115,
            stamina: 115,
            strength: 15,
            defense: 15,
            intelligence: 20,
            speed: 19,
            nen: 21
        },
        skills: [
            { name: "Nen Threads", damage: 45, xp: 150 },
            { name: "Thread Trap", damage: 70, xp: 300 }
        ]
    },

    {
        name: "Uvogin",
        rarity: "Épico",
        chance: 2.5,
        base: {
            hp: 160,
            stamina: 115,
            strength: 32,
            defense: 28,
            intelligence: 7,
            speed: 10,
            nen: 23
        },
        skills: [
            { name: "Big Bang Impact", damage: 80, xp: 400 },
            { name: "Maximum Power", damage: 100, xp: 650 }
        ]
    },

    {
        name: "Meruem",
        rarity: "Mítico",
        chance: 0.2,
        base: {
            hp: 200,
            stamina: 180,
            strength: 40,
            defense: 35,
            intelligence: 40,
            speed: 30,
            nen: 45
        },
        skills: [
            { name: "Rage Blast", damage: 100, xp: 800 },
            { name: "Aura Synthesis", damage: 120, xp: 1200 }
        ]
    }
];

// ======================================================
// NEN — INDEPENDENTE DO PERSONAGEM
// ======================================================

const nenTypes = [
    {
        name: "Especialização",
        chance: 5,
        skills: [
            { name: "Técnica Especial", damage: 40, xp: 100 },
            { name: "Habilidade Única", damage: 65, xp: 300 },
            { name: "Poder Especial", damage: 90, xp: 700 }
        ]
    },
    {
        name: "Fortificação",
        chance: 20,
        skills: [
            { name: "Reforço Básico", damage: 25, xp: 80 },
            { name: "Aura Reforçada", damage: 45, xp: 220 },
            { name: "Impacto de Aura", damage: 70, xp: 500 }
        ]
    },
    {
        name: "Emissão",
        chance: 15,
        skills: [
            { name: "Rajada de Aura", damage: 30, xp: 80 },
            { name: "Disparo de Aura", damage: 50, xp: 220 },
            { name: "Explosão Emissora", damage: 75, xp: 500 }
        ]
    },
    {
        name: "Transformação",
        chance: 15,
        skills: [
            { name: "Aura Alterada", damage: 30, xp: 80 },
            { name: "Aura Elétrica", damage: 55, xp: 250 },
            { name: "Transformação Avançada", damage: 80, xp: 550 }
        ]
    },
    {
        name: "Conjuração",
        chance: 20,
        skills: [
            { name: "Lâmina de Aura", damage: 30, xp: 80 },
            { name: "Corrente de Aura", damage: 55, xp: 250 },
            { name: "Prisão de Aura", damage: 80, xp: 550 }
        ]
    },
    {
        name: "Manipulação",
        chance: 25,
        skills: [
            { name: "Controle", damage: 35, xp: 80 },
            { name: "Agulhas de Aura", damage: 55, xp: 250 },
            { name: "Dominação", damage: 80, xp: 550 }
        ]
    }
];

// ======================================================
// BOSS
// ======================================================

const bosses = [
    { name: "Bandido", minLevel: 1, hp: 100, damage: 8, xp: 40, money: 15 },
    { name: "Ladrão", minLevel: 5, hp: 150, damage: 12, xp: 60, money: 25 },
    { name: "Usuário de Nen", minLevel: 10, hp: 230, damage: 18, xp: 90, money: 40 },
    { name: "Hunter Renegado", minLevel: 20, hp: 350, damage: 25, xp: 130, money: 60 },

    // TRUPE FANTASMA
    { name: "Kalluto Zoldyck", minLevel: 25, hp: 500, damage: 32, xp: 180, money: 90 },
    { name: "Shizuku", minLevel: 30, hp: 600, damage: 38, xp: 220, money: 110 },
    { name: "Shalnark", minLevel: 35, hp: 700, damage: 42, xp: 250, money: 130 },
    { name: "Machi", minLevel: 40, hp: 800, damage: 48, xp: 280, money: 150 },
    { name: "Nobunaga", minLevel: 45, hp: 900, damage: 55, xp: 320, money: 170 },
    { name: "Phinks", minLevel: 50, hp: 1000, damage: 62, xp: 350, money: 190 },
    { name: "Feitan", minLevel: 55, hp: 1100, damage: 68, xp: 390, money: 210 },
    { name: "Franklin", minLevel: 60, hp: 1250, damage: 75, xp: 430, money: 230 },
    { name: "Bonolenov", minLevel: 60, hp: 1200, damage: 72, xp: 420, money: 220 },
    { name: "Pakunoda", minLevel: 65, hp: 1300, damage: 78, xp: 450, money: 240 },
    { name: "Uvogin", minLevel: 65, hp: 1500, damage: 90, xp: 500, money: 270 },
    { name: "Chrollo Lucilfer", minLevel: 70, hp: 1800, damage: 105, xp: 650, money: 350 },

    // CHIMERA ANTS
    { name: "Soldado Quimera", minLevel: 70, hp: 1600, damage: 85, xp: 500, money: 280 },
    { name: "Rammot", minLevel: 75, hp: 1900, damage: 95, xp: 550, money: 300 },
    { name: "Cheetu", minLevel: 85, hp: 2200, damage: 110, xp: 650, money: 350 },
    { name: "Leol", minLevel: 95, hp: 2600, damage: 125, xp: 750, money: 400 },
    { name: "Zazan", minLevel: 105, hp: 3000, damage: 140, xp: 850, money: 450 },

    // GUARDAS REAIS
    { name: "Neferpitou", minLevel: 120, hp: 4500, damage: 180, xp: 1200, money: 650 },
    { name: "Shaiapouf", minLevel: 130, hp: 4800, damage: 195, xp: 1300, money: 700 },
    { name: "Menthuthuyoupi", minLevel: 140, hp: 5500, damage: 220, xp: 1450, money: 800 },

    // REI
    { name: "Meruem", minLevel: 180, hp: 8000, damage: 300, xp: 2500, money: 1500 }
];

// ======================================================
// FUNÇÕES
// ======================================================

function randomCharacter() {
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

function randomNen() {
    const total = nenTypes.reduce((sum, n) => sum + n.chance, 0);
    let roll = Math.random() * total;

    for (const nen of nenTypes) {
        roll -= nen.chance;

        if (roll <= 0) {
            return nen;
        }
    }

    return nenTypes[0];
}

function randomNenPercentage() {
    return Math.floor(Math.random() * 51) + 50;
}

function createPlayer(userId) {
    const character = randomCharacter();
    const nen = randomNen();

    players[userId] = {
        userId,

        character: character.name,
        rarity: character.rarity,
        characterChance: character.chance,

        nen: nen.name,
        nenChance: nen.chance,
        nenPercentage: randomNenPercentage(),

        level: 1,
        xp: 0,
        xpNext: 100,
        money: 100,

        hp: character.base.hp,
        maxHp: character.base.hp,

        stamina: character.base.stamina,
        maxStamina: character.base.stamina,

        strength: character.base.strength,
        defense: character.base.defense,
        intelligence: character.base.intelligence,
        speed: character.base.speed,
        nenPower: character.base.nen,

        upgradePoints: 5,

        unlockedCharacterSkills: [],
        unlockedNenSkills: [],

        currentBoss: null,
        defending: false
    };

    savePlayers(players);

    return players[userId];
}

function getPlayer(id) {
    return players[id];
}

function getCharacter(player) {
    return characters.find(c => c.name === player.character);
}

function getNen(player) {
    return nenTypes.find(n => n.name === player.nen);
}

function getBoss(name) {
    return bosses.find(b => b.name === name);
}

function levelUp(player) {
    let levels = 0;

    while (player.xp >= player.xpNext) {
        player.xp -= player.xpNext;
        player.level++;
        player.xpNext = Math.floor(player.xpNext * 1.35);
        player.upgradePoints += 3;

        levels++;
    }

    return levels;
}

function availableBosses(player) {
    return bosses.filter(b => player.level >= b.minLevel);
}

function chooseRandomBoss(player) {
    const available = availableBosses(player);

    if (!available.length) return null;

    return available[Math.floor(Math.random() * available.length)];
}

// ======================================================
// EMBEDS
// ======================================================

function panelEmbed(player) {
    return new EmbedBuilder()
        .setTitle("Hunter x Hunter RPG")
        .setDescription(
            `**${player.character}** • ${player.rarity}\n` +
            `Nen: **${player.nen}**\n` +
            `Potência de Nen: **${player.nenPercentage}%**\n\n` +

            `⭐ Nível: **${player.level}**\n` +
            `✨ XP: **${player.xp}/${player.xpNext}**\n` +
            `💰 Dinheiro: **R$ ${player.money}**\n\n` +

            `❤️ HP: **${player.hp}/${player.maxHp}**\n` +
            `⚡ Stamina: **${player.stamina}/${player.maxStamina}**\n\n` +

            `💪 Força: **${player.strength}**\n` +
            `🛡️ Defesa: **${player.defense}**\n` +
            `🧠 Inteligência: **${player.intelligence}**\n` +
            `💨 Velocidade: **${player.speed}**\n` +
            `🔮 Nen: **${player.nenPower}**\n\n` +

            `🔧 Pontos de upgrade: **${player.upgradePoints}**`
        );
}

function characterEmbed(player) {
    const character = getCharacter(player);

    const skills = character.skills
        .map(s =>
            `• **${s.name}** — ${s.damage} dano — ${s.xp} XP`
        )
        .join("\n");

    return new EmbedBuilder()
        .setTitle(`🎭 ${character.name}`)
        .setDescription(
            `Raridade: **${character.rarity}**\n` +
            `Chance: **${character.chance}%**\n\n` +

            `❤️ HP: ${character.base.hp}\n` +
            `⚡ Stamina: ${character.base.stamina}\n` +
            `💪 Força: ${character.base.strength}\n` +
            `🛡️ Defesa: ${character.base.defense}\n` +
            `🧠 Inteligência: ${character.base.intelligence}\n` +
            `💨 Velocidade: ${character.base.speed}\n\n` +

            `### Habilidades do personagem\n${skills}`
        );
}

function profileEmbed(player) {
    return new EmbedBuilder()
        .setTitle("👤 Perfil do Jogador")
        .setDescription(
            `🎭 Personagem: **${player.character}**\n` +
            `💎 Raridade: **${player.rarity}**\n` +
            `🎲 Chance: **${player.characterChance}%**\n\n` +

            `🔮 Nen: **${player.nen}**\n` +
            `🎲 Chance do Nen: **${player.nenChance}%**\n` +
            `⚡ Potência de Nen: **${player.nenPercentage}%**\n\n` +

            `⭐ Nível: **${player.level}**\n` +
            `✨ XP: **${player.xp}/${player.xpNext}**\n` +
            `💰 Dinheiro: **R$ ${player.money}**\n\n` +

            `❤️ HP: **${player.hp}/${player.maxHp}**\n` +
            `⚡ Stamina: **${player.stamina}/${player.maxStamina}**\n\n` +

            `💪 Força: **${player.strength}**\n` +
            `🛡️ Defesa: **${player.defense}**\n` +
            `🧠 Inteligência: **${player.intelligence}**\n` +
            `💨 Velocidade: **${player.speed}**\n` +
            `🔮 Nen: **${player.nenPower}**\n\n` +

            `🔧 Pontos de upgrade: **${player.upgradePoints}**`
        );
}

function skillsEmbed(player) {
    const character = getCharacter(player);
    const nen = getNen(player);

    const characterSkills = character.skills
        .map(skill => {
            const unlocked = player.unlockedCharacterSkills.includes(skill.name);
            return `${unlocked ? "✅" : "🔒"} **${skill.name}** — ${skill.damage} dano — ${skill.xp} XP`;
        })
        .join("\n");

    const nenSkills = nen.skills
        .map(skill => {
            const unlocked = player.unlockedNenSkills.includes(skill.name);
            return `${unlocked ? "✅" : "🔒"} **${skill.name}** — ${skill.damage} dano — ${skill.xp} XP`;
        })
        .join("\n");

    return new EmbedBuilder()
        .setTitle("⚔️ Habilidades")
        .setDescription(
            `### 🎭 Habilidades de ${character.name}\n` +
            `${characterSkills}\n\n` +

            `### 🔮 Habilidades de ${nen.name}\n` +
            `${nenSkills}\n\n` +

            `Use os botões abaixo para desbloquear habilidades com XP.`
        );
}

// ======================================================
// BOTÕES
// ======================================================

function mainButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("character")
            .setLabel("Personagem")
            .setEmoji("🎭")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("boss")
            .setLabel("Batalhar")
            .setEmoji("👹")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("skills")
            .setLabel("Habilidades")
            .setEmoji("⚔️")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("upgrades")
            .setLabel("Upgrades")
            .setEmoji("🔧")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("profile")
            .setLabel("Perfil")
            .setEmoji("👤")
            .setStyle(ButtonStyle.Secondary)
    );
}

function backButton() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("back_panel")
            .setLabel("Voltar")
            .setEmoji("↩️")
            .setStyle(ButtonStyle.Secondary)
    );
}

function battleButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("attack")
            .setLabel("Atacar")
            .setEmoji("⚔️")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("use_skill")
            .setLabel("Habilidade")
            .setEmoji("✨")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("defend")
            .setLabel("Defender")
            .setEmoji("🛡️")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("flee")
            .setLabel("Fugir")
            .setEmoji("🏃")
            .setStyle(ButtonStyle.Secondary)
    );
}

function upgradeButtons() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("up_hp")
            .setLabel("HP +")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("up_stamina")
            .setLabel("Stamina +")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("up_strength")
            .setLabel("Força +")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId("up_defense")
            .setLabel("Defesa +")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("up_speed")
            .setLabel("Velocidade +")
            .setStyle(ButtonStyle.Success)
    );
}

function upgradeButtons2() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("up_intelligence")
            .setLabel("Inteligência +")
            .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
            .setCustomId("up_nen")
            .setLabel("Nen +")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId("upgrades")
            .setLabel("Continuar")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("back_panel")
            .setLabel("Painel")
            .setStyle(ButtonStyle.Secondary)
    );
}

// ======================================================
// COMANDOS
// ======================================================

const commands = [
    new SlashCommandBuilder()
        .setName("rpg")
        .setDescription("Abrir o Hunter x Hunter RPG"),

    new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Comandos administrativos do RPG")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub =>
            sub
                .setName("xp")
                .setDescription("Dar XP")
                .addUserOption(o =>
                    o.setName("usuario")
                        .setDescription("Jogador")
                        .setRequired(true)
                )
                .addIntegerOption(o =>
                    o.setName("quantidade")
                        .setDescription("Quantidade de XP")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName("dinheiro")
                .setDescription("Dar dinheiro")
                .addUserOption(o =>
                    o.setName("usuario")
                        .setDescription("Jogador")
                        .setRequired(true)
                )
                .addIntegerOption(o =>
                    o.setName("quantidade")
                        .setDescription("Quantidade")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName("nivel")
                .setDescription("Dar níveis")
                .addUserOption(o =>
                    o.setName("usuario")
                        .setDescription("Jogador")
                        .setRequired(true)
                )
                .addIntegerOption(o =>
                    o.setName("quantidade")
                        .setDescription("Quantidade de níveis")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName("evento")
                .setDescription("Dar recompensa de evento")
                .addIntegerOption(o =>
                    o.setName("xp")
                        .setDescription("XP")
                        .setRequired(true)
                )
                .addIntegerOption(o =>
                    o.setName("dinheiro")
                        .setDescription("Dinheiro")
                        .setRequired(true)
                )
        )
        .addSubcommand(sub =>
            sub
                .setName("reset")
                .setDescription("Resetar um jogador")
                .addUserOption(o =>
                    o.setName("usuario")
                        .setDescription("Jogador")
                        .setRequired(true)
                )
        )
].map(command => command.toJSON());

// ======================================================
// REGISTRAR COMANDOS
// ======================================================

const rest = new REST({ version: "10" }).setToken(TOKEN);

async function registerCommands() {
    try {
        console.log("Registrando comandos...");

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log("✅ Comandos registrados.");
    } catch (error) {
        console.error("Erro ao registrar comandos:", error);
    }
}

// ======================================================
// READY
// ======================================================

client.once("ready", () => {
    console.log(`✅ ${client.user.tag} está online!`);
});

// ======================================================
// INTERAÇÕES
// ======================================================

client.on("interactionCreate", async interaction => {
    try {
        // ==============================================
        // /RPG
        // ==============================================

        if (interaction.isChatInputCommand()) {

            if (interaction.commandName === "rpg") {

                let player = getPlayer(interaction.user.id);

                if (!player) {
                    player = createPlayer(interaction.user.id);

                    const embed = characterEmbed(player);

                    return interaction.reply({
                        embeds: [embed],
                        components: [mainButtons()]
                    });
                }

                return interaction.reply({
                    embeds: [panelEmbed(player)],
                    components: [mainButtons()]
                });
            }

            // ==========================================
            // ADMIN
            // ==========================================

            if (interaction.commandName === "admin") {

                if (
                    interaction.user.id !== OWNER_ID &&
                    !interaction.memberPermissions?.has(
                        PermissionFlagsBits.Administrator
                    )
                ) {
                    return interaction.reply({
                        content: "❌ Você não tem permissão para usar o sistema administrativo.",
                        ephemeral: true
                    });
                }

                const sub = interaction.options.getSubcommand();

                // DAR XP
                if (sub === "xp") {
                    const user = interaction.options.getUser("usuario");
                    const amount = interaction.options.getInteger("quantidade");

                    const player = getPlayer(user.id);

                    if (!player) {
                        return interaction.reply({
                            content: "❌ Esse jogador ainda não iniciou o RPG.",
                            ephemeral: true
                        });
                    }

                    player.xp += amount;
                    const levels = levelUp(player);

                    savePlayers(players);

                    return interaction.reply(
                        `✅ ${user} recebeu **${amount} XP**.` +
                        (levels > 0 ? ` Subiu **${levels} nível(is)**!` : "")
                    );
                }

                // DAR DINHEIRO
                if (sub === "dinheiro") {
                    const user = interaction.options.getUser("usuario");
                    const amount = interaction.options.getInteger("quantidade");

                    const player = getPlayer(user.id);

                    if (!player) {
                        return interaction.reply({
                            content: "❌ Esse jogador ainda não iniciou o RPG.",
                            ephemeral: true
                        });
                    }

                    player.money += amount;

                    savePlayers(players);

                    return interaction.reply(
                        `✅ ${user} recebeu **R$ ${amount}**.`
                    );
                }

                // DAR NÍVEL
                if (sub === "nivel") {
                    const user = interaction.options.getUser("usuario");
                    const amount = interaction.options.getInteger("quantidade");

                    const player = getPlayer(user.id);

                    if (!player) {
                        return interaction.reply({
                            content: "❌ Esse jogador ainda não iniciou o RPG.",
                            ephemeral: true
                        });
                    }

                    player.level += amount;
                    player.upgradePoints += amount * 3;

                    savePlayers(players);

                    return interaction.reply(
                        `✅ ${user} recebeu **${amount} nível(is)**.`
                    );
                }

                // EVENTO
                if (sub === "evento") {
                    const xp = interaction.options.getInteger("xp");
                    const money = interaction.options.getInteger("dinheiro");

                    let count = 0;

                    for (const id of Object.keys(players)) {
                        players[id].xp += xp;
                        players[id].money += money;

                        levelUp(players[id]);

                        count++;
                    }

                    savePlayers(players);

                    return interaction.reply(
                        `🎉 **EVENTO ATIVADO!**\n\n` +
                        `👥 Jogadores afetados: **${count}**\n` +
                        `✨ XP recebido: **${xp}**\n` +
                        `💰 Dinheiro recebido: **R$ ${money}**`
                    );
                }

                // RESET
                if (sub === "reset") {
                    const user = interaction.options.getUser("usuario");

                    delete players[user.id];

                    savePlayers(players);

                    return interaction.reply(
                        `♻️ O RPG de ${user} foi resetado.\n` +
                        `Ele receberá um novo personagem e um novo Nen ao usar /rpg.`
                    );
                }
            }
        }

        // ==============================================
        // BOTÕES
        // ==============================================

        if (interaction.isButton()) {

            const player = getPlayer(interaction.user.id);

            if (!player) {
                return interaction.reply({
                    content: "❌ Use `/rpg` primeiro.",
                    ephemeral: true
                });
            }

            // PERSONAGEM
            if (interaction.customId === "character") {
                return interaction.update({
                    embeds: [characterEmbed(player)],
                    components: [backButton()]
                });
            }

            // PERFIL
            if (interaction.customId === "profile") {
                return interaction.update({
                    embeds: [profileEmbed(player)],
                    components: [backButton()]
                });
            }

            // VOLTAR
            if (interaction.customId === "back_panel") {
                return interaction.update({
                    embeds: [panelEmbed(player)],
                    components: [mainButtons()]
                });
            }

            // BATALHAR
            if (interaction.customId === "boss") {

                const boss = chooseRandomBoss(player);

                if (!boss) {
                    return interaction.update({
                        content: "❌ Nenhum boss disponível para seu nível.",
                        embeds: [],
                        components: [backButton()]
                    });
                }

                player.currentBoss = {
                    name: boss.name,
                    hp: boss.hp,
                    maxHp: boss.hp
                };

                player.defending = false;

                savePlayers(players);

                const battleEmbed = new EmbedBuilder()
                    .setTitle(`👹 Boss: ${boss.name}`)
                    .setDescription(
                        `⚔️ Um boss apareceu!\n\n` +
                        `👹 **${boss.name}**\n` +
                        `❤️ HP: **${boss.hp}/${boss.hp}**\n` +
                        `💥 Dano: **${boss.damage}**\n\n` +

                        `👤 **${player.character}**\n` +
                        `❤️ HP: **${player.hp}/${player.maxHp}**\n` +
                        `⚡ Stamina: **${player.stamina}/${player.maxStamina}**`
                    );

                return interaction.update({
                    embeds: [battleEmbed],
                    components: [battleButtons()]
                });
            }

            // ATAQUE NORMAL
            if (interaction.customId === "attack") {

                if (!player.currentBoss) {
                    return interaction.update({
                        embeds: [panelEmbed(player)],
                        components: [mainButtons()]
                    });
                }

                const boss = getBoss(player.currentBoss.name);

                const damage =
                    Math.floor(
                        player.strength +
                        player.speed / 2 +
                        Math.random() * 15
                    );

                player.currentBoss.hp -= damage;

                let text =
                    `⚔️ Você causou **${damage} de dano**!`;

                if (player.currentBoss.hp <= 0) {

                    player.xp += boss.xp;
                    player.money += boss.money;

                    const levels = levelUp(player);

                    player.currentBoss = null;
                    player.defending = false;

                    savePlayers(players);

                    text +=
                        `\n\n🏆 **BOSS DERROTADO!**\n` +
                        `✨ +${boss.xp} XP\n` +
                        `💰 +R$ ${boss.money}`;

                    if (levels > 0) {
                        text += `\n⭐ Você subiu ${levels} nível(is)!`;
                    }

                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("🏆 Vitória!")
                                .setDescription(text)
                        ],
                        components: [mainButtons()]
                    });
                }

                let bossDamage = boss.damage;

                if (player.defending) {
                    bossDamage = Math.floor(bossDamage * 0.5);
                    player.defending = false;
                }

                player.hp -= bossDamage;

                text += `\n👹 O boss causou **${bossDamage} de dano**!`;

                // MORTE
                if (player.hp <= 0) {

                    player.hp = Math.max(
                        1,
                        Math.floor(player.maxHp * 0.5)
                    );

                    player.maxHp = Math.max(
                        50,
                        player.maxHp - 10
                    );

                    player.maxStamina = Math.max(
                        40,
                        player.maxStamina - 5
                    );

                    player.stamina = Math.min(
                        player.stamina,
                        player.maxStamina
                    );

                    player.currentBoss = null;

                    savePlayers(players);

                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("💀 Você morreu!")
                                .setDescription(
                                    `Você foi derrotado por **${boss.name}**.\n\n` +
                                    `❤️ Seu HP máximo diminuiu em **10**.\n` +
                                    `⚡ Sua Stamina máxima diminuiu em **5**.\n\n` +
                                    `🔧 Use **Upgrades** para recuperar seus atributos.`
                                )
                        ],
                        components: [mainButtons()]
                    });
                }

                savePlayers(players);

                const battleEmbed = new EmbedBuilder()
                    .setTitle(`👹 ${boss.name}`)
                    .setDescription(
                        `❤️ Boss: **${Math.max(0, player.currentBoss.hp)}/${boss.hp}**\n` +
                        `❤️ Você: **${player.hp}/${player.maxHp}**\n` +
                        `⚡ Stamina: **${player.stamina}/${player.maxStamina}**\n\n` +
                        text
                    );

                return interaction.update({
                    embeds: [battleEmbed],
                    components: [battleButtons()]
                });
            }

            // DEFENDER
            if (interaction.customId === "defend") {

                if (!player.currentBoss) {
                    return interaction.update({
                        embeds: [panelEmbed(player)],
                        components: [mainButtons()]
                    });
                }

                player.defending = true;

                savePlayers(players);

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("🛡️ Defesa")
                            .setDescription(
                                `Você entrou em posição defensiva.\n\n` +
                                `O próximo dano do boss será reduzido.`
                            )
                    ],
                    components: [battleButtons()]
                });
            }

            // FUGIR
            if (interaction.customId === "flee") {

                player.currentBoss = null;
                player.defending = false;

                savePlayers(players);

                return interaction.update({
                    embeds: [panelEmbed(player)],
                    components: [mainButtons()]
                });
            }

            // HABILIDADES
            if (interaction.customId === "skills") {

                return interaction.update({
                    embeds: [skillsEmbed(player)],
                    components: [
                        new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId("unlock_character")
                                .setLabel("Desbloquear Personagem")
                                .setEmoji("🎭")
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId("unlock_nen")
                                .setLabel("Desbloquear Nen")
                                .setEmoji("🔮")
                                .setStyle(ButtonStyle.Success)
                        ),
                        backButton()
                    ]
                });
            }

            // DESBLOQUEAR HABILIDADES DO PERSONAGEM
            if (interaction.customId === "unlock_character") {

                const character = getCharacter(player);

                const available = character.skills.filter(
                    skill =>
                        !player.unlockedCharacterSkills.includes(skill.name)
                );

                if (!available.length) {
                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("🎭 Habilidades")
                                .setDescription(
                                    "✅ Você já desbloqueou todas as habilidades do personagem."
                                )
                        ],
                        components: [backButton()]
                    });
                }

                const options = available.slice(0, 25).map(skill => ({
                    label: `${skill.name} — ${skill.damage} dano`,
                    description: `Custa ${skill.xp} XP`,
                    value: skill.name
                }));

                const menu = new StringSelectMenuBuilder()
                    .setCustomId("unlock_character_select")
                    .setPlaceholder("Escolha uma habilidade")
                    .addOptions(options);

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("🎭 Habilidades do Personagem")
                            .setDescription(
                                `Você tem **${player.xp} XP**.\n\n` +
                                `Escolha uma habilidade para desbloquear.`
                            )
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(menu),
                        backButton()
                    ]
                });
            }

            // DESBLOQUEAR NEN
            if (interaction.customId === "unlock_nen") {

                const nen = getNen(player);

                const available = nen.skills.filter(
                    skill =>
                        !player.unlockedNenSkills.includes(skill.name)
                );

                if (!available.length) {
                    return interaction.update({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle("🔮 Habilidades de Nen")
                                .setDescription(
                                    "✅ Você já desbloqueou todas as habilidades do seu Nen."
                                )
                        ],
                        components: [backButton()]
                    });
                }

                const options = available.map(skill => ({
                    label: `${skill.name} — ${skill.damage} dano`,
                    description: `Custa ${skill.xp} XP`,
                    value: skill.name
                }));

                const menu = new StringSelectMenuBuilder()
                    .setCustomId("unlock_nen_select")
                    .setPlaceholder("Escolha uma habilidade")
                    .addOptions(options);

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle(`🔮 Nen — ${nen.name}`)
                            .setDescription(
                                `Você tem **${player.xp} XP**.\n\n` +
                                `Escolha uma habilidade para desbloquear.`
                            )
                    ],
                    components: [
                        new ActionRowBuilder().addComponents(menu),
                        backButton()
                    ]
                });
            }

            // UPGRADES
            if (interaction.customId === "upgrades") {

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("🔧 Upgrades")
                            .setDescription(
                                `Você tem **${player.upgradePoints} pontos**.\n\n` +
                                `❤️ HP: ${player.maxHp}\n` +
                                `⚡ Stamina: ${player.maxStamina}\n` +
                                `💪 Força: ${player.strength}\n` +
                                `🛡️ Defesa: ${player.defense}\n` +
                                `🧠 Inteligência: ${player.intelligence}\n` +
                                `💨 Velocidade: ${player.speed}\n` +
                                `🔮 Nen: ${player.nenPower}`
                            )
                    ],
                    components: [upgradeButtons(), upgradeButtons2()]
                });
            }

            // UPGRADES INDIVIDUAIS
            const upgradeMap = {
                up_hp: "hp",
                up_stamina: "stamina",
                up_strength: "strength",
                up_defense: "defense",
                up_speed: "speed",
                up_intelligence: "intelligence",
                up_nen: "nenPower"
            };

            if (upgradeMap[interaction.customId]) {

                if (player.upgradePoints <= 0) {
                    return interaction.reply({
                        content: "❌ Você não possui pontos de upgrade.",
                        ephemeral: true
                    });
                }

                const stat = upgradeMap[interaction.customId];

                player.upgradePoints--;

                if (stat === "hp") {
                    player.maxHp += 10;
                    player.hp += 10;
                } else if (stat === "stamina") {
                    player.maxStamina += 10;
                    player.stamina += 10;
                } else {
                    player[stat]++;
                }

                savePlayers(players);

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("🔧 Upgrade realizado!")
                            .setDescription(
                                `Você aumentou **${stat}**.\n\n` +
                                `🔧 Pontos restantes: **${player.upgradePoints}**`
                            )
                    ],
                    components: [upgradeButtons(), upgradeButtons2()]
                });
            }
        }

        // ==============================================
        // SELECT MENUS
        // ==============================================

        if (interaction.isStringSelectMenu()) {

            const player = getPlayer(interaction.user.id);

            if (!player) {
                return interaction.reply({
                    content: "❌ Use `/rpg` primeiro.",
                    ephemeral: true
                });
            }

            // SKILL DO PERSONAGEM
            if (interaction.customId === "unlock_character_select") {

                const name = interaction.values[0];
                const character = getCharacter(player);
                const skill = character.skills.find(s => s.name === name);

                if (!skill) return;

                if (player.xp < skill.xp) {
                    return interaction.reply({
                        content:
                            `❌ Você precisa de **${skill.xp} XP** para desbloquear essa habilidade.`,
                        ephemeral: true
                    });
                }

                player.xp -= skill.xp;
                player.unlockedCharacterSkills.push(skill.name);

                savePlayers(players);

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("✅ Habilidade desbloqueada!")
                            .setDescription(
                                `🎭 **${skill.name}**\n\n` +
                                `💥 Dano: **${skill.damage}**\n` +
                                `✨ XP gasto: **${skill.xp}**`
                            )
                    ],
                    components: [backButton()]
                });
            }

            // SKILL DE NEN
            if (interaction.customId === "unlock_nen_select") {

                const name = interaction.values[0];
                const nen = getNen(player);
                const skill = nen.skills.find(s => s.name === name);

                if (!skill) return;

                if (player.xp < skill.xp) {
                    return interaction.reply({
                        content:
                            `❌ Você precisa de **${skill.xp} XP** para desbloquear essa habilidade.`,
                        ephemeral: true
                    });
                }

                player.xp -= skill.xp;
                player.unlockedNenSkills.push(skill.name);

                savePlayers(players);

                return interaction.update({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("✅ Habilidade de Nen desbloqueada!")
                            .setDescription(
                                `🔮 **${skill.name}**\n\n` +
                                `💥 Dano: **${skill.damage}**\n` +
                                `✨ XP gasto: **${skill.xp}**`
                            )
                    ],
                    components: [backButton()]
                });
            }
        }

    } catch (error) {
        console.error("Erro na interação:", error);

        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
                content: "❌ Ocorreu um erro no RPG.",
                ephemeral: true
            }).catch(() => {});
        }
    }
});

// ======================================================
// INICIAR
// ======================================================

(async () => {
    await registerCommands();
    await client.login(TOKEN);
})();
