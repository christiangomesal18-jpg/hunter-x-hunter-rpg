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

// =====================================================
// CONFIG
// =====================================================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ TOKEN ou CLIENT_ID não configurado.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const DATABASE = "./players.json";

// =====================================================
// BANCO
// =====================================================

let players = {};

if (fs.existsSync(DATABASE)) {
  try {
    players = JSON.parse(fs.readFileSync(DATABASE, "utf8"));
  } catch {
    players = {};
  }
}

function saveDatabase() {
  fs.writeFileSync(
    DATABASE,
    JSON.stringify(players, null, 2)
  );
}

// =====================================================
// PERSONAGENS
// =====================================================

const characters = [
  {
    name: "Gon Freecss",
    nen: "Reforço",
    bonuses: {
      strength: 15,
      defense: 10
    },
    skills: ["Jajanken"]
  },

  {
    name: "Killua Zoldyck",
    nen: "Transformação",
    bonuses: {
      stamina: 15,
      strength: 10,
      defense: 10
    },
    skills: ["Eletricidade", "Godspeed"]
  },

  {
    name: "Kurapika",
    nen: "Conjuração",
    bonuses: {
      intelligence: 15,
      nen: 15
    },
    skills: ["Dowsing Chain", "Holy Chain", "Emperor Time"]
  },

  {
    name: "Leorio Paradinight",
    nen: "Emissão",
    bonuses: {
      intelligence: 10,
      stamina: 10
    },
    skills: ["Remote Punch"]
  },

  {
    name: "Hisoka Morow",
    nen: "Transformação",
    bonuses: {
      nen: 15,
      intelligence: 10
    },
    skills: ["Bungee Gum", "Texture Surprise"]
  },

  {
    name: "Chrollo Lucilfer",
    nen: "Especialização",
    bonuses: {
      intelligence: 20,
      nen: 15
    },
    skills: ["Skill Hunter"]
  },

  {
    name: "Isaac Netero",
    nen: "Reforço",
    bonuses: {
      strength: 20,
      nen: 20
    },
    skills: ["100-Type Guanyin Bodhisattva"]
  },

  {
    name: "Zeno Zoldyck",
    nen: "Emissão",
    bonuses: {
      strength: 15,
      nen: 15
    },
    skills: ["Dragon Head", "Dragon Dive"]
  },

  {
    name: "Illumi Zoldyck",
    nen: "Manipulação",
    bonuses: {
      intelligence: 15,
      nen: 10
    },
    skills: ["Needle People"]
  },

  {
    name: "Kalluto Zoldyck",
    nen: "Manipulação",
    bonuses: {
      speed: 10,
      nen: 10
    },
    skills: ["Paper Manipulation"]
  },

  {
    name: "Biscuit Krueger",
    nen: "Transformação",
    bonuses: {
      strength: 15,
      defense: 15
    },
    skills: ["Cookie-chan"]
  },

  {
    name: "Ging Freecss",
    nen: "Especialização",
    bonuses: {
      intelligence: 20,
      nen: 15
    },
    skills: ["Copy"]
  },

  {
    name: "Feitan Portor",
    nen: "Transmutação",
    bonuses: {
      speed: 15,
      strength: 10
    },
    skills: ["Pain Packer"]
  },

  {
    name: "Phinks Magcub",
    nen: "Reforço",
    bonuses: {
      strength: 20,
      stamina: 10
    },
    skills: ["Ripper Cyclotron"]
  },

  {
    name: "Uvogin",
    nen: "Reforço",
    bonuses: {
      strength: 25,
      defense: 15
    },
    skills: ["Big Bang Impact"]
  },

  {
    name: "Meruem",
    nen: "Especialização",
    bonuses: {
      strength: 30,
      defense: 25,
      nen: 20
    },
    skills: ["Rage Blast"]
  }
];

// =====================================================
// BOSSES
// =====================================================

const bosses = [

  // -------------------------------
  // LEVEL 1-25
  // -------------------------------

  {
    name: "Bandido",
    minLevel: 1,
    maxLevel: 10,
    hp: 100,
    strength: 15,
    defense: 10,
    stamina: 20,
    nen: 0,
    xp: 30,
    money: 80
  },

  {
    name: "Ladrão",
    minLevel: 1,
    maxLevel: 15,
    hp: 140,
    strength: 20,
    defense: 15,
    stamina: 25,
    nen: 0,
    xp: 45,
    money: 120
  },

  {
    name: "Usuário de Nen Iniciante",
    minLevel: 10,
    maxLevel: 25,
    hp: 220,
    strength: 35,
    defense: 25,
    stamina: 35,
    nen: 30,
    xp: 80,
    money: 250
  },

  {
    name: "Caçador Renegado",
    minLevel: 15,
    maxLevel: 25,
    hp: 300,
    strength: 45,
    defense: 35,
    stamina: 45,
    nen: 40,
    xp: 120,
    money: 400
  },

  // -------------------------------
  // TRUPE FANTASMA
  // -------------------------------

  {
    name: "Kalluto Zoldyck",
    minLevel: 25,
    maxLevel: 70,
    hp: 550,
    strength: 80,
    defense: 70,
    stamina: 100,
    nen: 110,
    xp: 250,
    money: 800
  },

  {
    name: "Shalnark",
    minLevel: 30,
    maxLevel: 70,
    hp: 650,
    strength: 90,
    defense: 80,
    stamina: 110,
    nen: 120,
    xp: 300,
    money: 950
  },

  {
    name: "Shizuku",
    minLevel: 30,
    maxLevel: 70,
    hp: 700,
    strength: 100,
    defense: 85,
    stamina: 110,
    nen: 130,
    xp: 330,
    money: 1000
  },

  {
    name: "Machi",
    minLevel: 35,
    maxLevel: 70,
    hp: 800,
    strength: 115,
    defense: 100,
    stamina: 130,
    nen: 150,
    xp: 380,
    money: 1200
  },

  {
    name: "Nobunaga",
    minLevel: 35,
    maxLevel: 70,
    hp: 850,
    strength: 125,
    defense: 110,
    stamina: 130,
    nen: 145,
    xp: 400,
    money: 1300
  },

  {
    name: "Phinks",
    minLevel: 40,
    maxLevel: 70,
    hp: 950,
    strength: 155,
    defense: 120,
    stamina: 160,
    nen: 160,
    xp: 500,
    money: 1600
  },

  {
    name: "Feitan",
    minLevel: 45,
    maxLevel: 70,
    hp: 1000,
    strength: 145,
    defense: 125,
    stamina: 180,
    nen: 180,
    xp: 550,
    money: 1800
  },

  {
    name: "Uvogin",
    minLevel: 50,
    maxLevel: 70,
    hp: 1400,
    strength: 220,
    defense: 180,
    stamina: 200,
    nen: 160,
    xp: 750,
    money: 2500
  },

  {
    name: "Chrollo Lucilfer",
    minLevel: 60,
    maxLevel: 70,
    hp: 1600,
    strength: 190,
    defense: 170,
    stamina: 200,
    nen: 240,
    xp: 1000,
    money: 4000
  },

  // -------------------------------
  // FORMIGAS QUIMERA
  // -------------------------------

  {
    name: "Soldado Quimera",
    minLevel: 70,
    maxLevel: 100,
    hp: 2000,
    strength: 250,
    defense: 230,
    stamina: 250,
    nen: 200,
    xp: 1200,
    money: 5000
  },

  {
    name: "Leol",
    minLevel: 75,
    maxLevel: 110,
    hp: 2800,
    strength: 320,
    defense: 270,
    stamina: 300,
    nen: 300,
    xp: 1600,
    money: 6500
  },

  {
    name: "Cheetu",
    minLevel: 80,
    maxLevel: 120,
    hp: 2600,
    strength: 280,
    defense: 250,
    stamina: 450,
    nen: 320,
    xp: 1700,
    money: 7000
  },

  {
    name: "Zazan",
    minLevel: 85,
    maxLevel: 130,
    hp: 3500,
    strength: 400,
    defense: 380,
    stamina: 350,
    nen: 350,
    xp: 2200,
    money: 9000
  },

  // -------------------------------
  // ELITE
  // -------------------------------

  {
    name: "Neferpitou",
    minLevel: 120,
    maxLevel: 200,
    hp: 9000,
    strength: 1000,
    defense: 900,
    stamina: 1100,
    nen: 1200,
    xp: 6000,
    money: 25000
  },

  {
    name: "Shaiapouf",
    minLevel: 120,
    maxLevel: 200,
    hp: 8500,
    strength: 850,
    defense: 850,
    stamina: 1200,
    nen: 1300,
    xp: 6000,
    money: 25000
  },

  {
    name: "Menthuthuyoupi",
    minLevel: 120,
    maxLevel: 200,
    hp: 12000,
    strength: 1400,
    defense: 1300,
    stamina: 1200,
    nen: 1100,
    xp: 7000,
    money: 30000
  },

  {
    name: "Meruem",
    minLevel: 180,
    maxLevel: 999,
    hp: 25000,
    strength: 2500,
    defense: 2300,
    stamina: 2400,
    nen: 2500,
    xp: 15000,
    money: 100000
  }
];

// =====================================================
// HABILIDADES
// =====================================================

const skills = {

  "Jajanken": {
    level: 5,
    xp: 150,
    money: 500,
    damage: 80
  },

  "Eletricidade": {
    level: 5,
    xp: 150,
    money: 600,
    damage: 90
  },

  "Godspeed": {
    level: 30,
    xp: 2000,
    money: 10000,
    damage: 300
  },

  "Bungee Gum": {
    level: 10,
    xp: 500,
    money: 2500,
    damage: 130
  },

  "Texture Surprise": {
    level: 15,
    xp: 800,
    money: 4000,
    damage: 170
  },

  "Skill Hunter": {
    level: 40,
    xp: 5000,
    money: 25000,
    damage: 500
  },

  "100-Type Guanyin Bodhisattva": {
    level: 70,
    xp: 10000,
    money: 50000,
    damage: 1000
  },

  "Dragon Head": {
    level: 30,
    xp: 2500,
    money: 12000,
    damage: 350
  },

  "Dragon Dive": {
    level: 50,
    xp: 5000,
    money: 20000,
    damage: 550
  },

  "Needle People": {
    level: 20,
    xp: 1500,
    money: 7000,
    damage: 250
  },

  "Big Bang Impact": {
    level: 45,
    xp: 4500,
    money: 18000,
    damage: 500
  },

  "Ripper Cyclotron": {
    level: 35,
    xp: 3000,
    money: 12000,
    damage: 400
  },

  "Pain Packer": {
    level: 45,
    xp: 5000,
    money: 20000,
    damage: 550
  },

  "Emperor Time": {
    level: 50,
    xp: 6000,
    money: 25000,
    damage: 650
  },

  "Copy": {
    level: 60,
    xp: 8000,
    money: 35000,
    damage: 700
  },

  "Rage Blast": {
    level: 100,
    xp: 20000,
    money: 100000,
    damage: 2000
  }
};

// =====================================================
// FUNÇÕES
// =====================================================

function randomNumber(min, max) {
  return Math.floor(
    Math.random() * (max - min + 1)
  ) + min;
}

function randomItem(array) {
  return array[
    Math.floor(Math.random() * array.length)
  ];
}

function baseStat() {
  return randomNumber(40, 60);
}

function createPlayer() {

  const character = randomItem(characters);

  const player = {
    character: character.name,
    nen: character.nen,

    level: 1,
    xp: 0,
    xpNeeded: 100,

    money: 500,

    upgradePoints: 5,

    stats: {
      health: baseStat(),
      strength: baseStat(),
      defense: baseStat(),
      stamina: baseStat(),
      intelligence: baseStat(),
      nen: baseStat(),
      speed: baseStat()
    },

    bonuses: character.bonuses,

    skills: [],

    battle: null
  };

  for (
    const [stat, value]
    of Object.entries(character.bonuses)
  ) {
    if (player.stats[stat] !== undefined) {
      player.stats[stat] += value;
    }
  }

  return player;
}

// =====================================================
// XP / LEVEL
// =====================================================

function giveXP(player, amount) {

  player.xp += amount;

  let levels = 0;

  while (player.xp >= player.xpNeeded) {

    player.xp -= player.xpNeeded;

    player.level++;

    player.upgradePoints += 3;

    player.xpNeeded =
      Math.floor(player.xpNeeded * 1.35);

    levels++;
  }

  return levels;
}

// =====================================================
// PAINEL PRINCIPAL
// =====================================================

function mainPanel(user, player) {

  const embed = new EmbedBuilder()
    .setTitle("🎴 HUNTER X HUNTER RPG")
    .setDescription(
      `👤 **${player.character}**\n` +
      `🧬 Nen: **${player.nen}**\n\n` +

      `🏆 Nível: **${player.level}**\n` +
      `⭐ XP: **${player.xp}/${player.xpNeeded}**\n` +
      `💰 Jenny: **${player.money}**\n` +
      `🎯 Pontos: **${player.upgradePoints}**`
    )
    .addFields({
      name: "📊 Atributos",
      value:
        `❤️ Vida: **${player.stats.health}**\n` +
        `💪 Força: **${player.stats.strength}**\n` +
        `🛡️ Defesa: **${player.stats.defense}**\n` +
        `⚡ Stamina: **${player.stats.stamina}**\n` +
        `🧠 Inteligência: **${player.stats.intelligence}**\n` +
        `✨ Nen: **${player.stats.nen}**\n` +
        `🏃 Velocidade: **${player.stats.speed}**`
    })
    .setFooter({
      text: "Hunter x Hunter RPG"
    });

  const row1 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("battle")
        .setLabel("Batalhar")
        .setEmoji("⚔️")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("skills")
        .setLabel("Habilidades")
        .setEmoji("🥋")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("upgrades")
        .setLabel("Upgrades")
        .setEmoji("⬆️")
        .setStyle(ButtonStyle.Success)
    );

  const row2 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("character")
        .setLabel("Personagem")
        .setEmoji("👤")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("inventory")
        .setLabel("Inventário")
        .setEmoji("🎒")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("refresh")
        .setLabel("Atualizar")
        .setEmoji("🔄")
        .setStyle(ButtonStyle.Secondary)
    );

  return {
    embeds: [embed],
    components: [row1, row2]
  };
}

// =====================================================
// PAINEL DE UPGRADE
// =====================================================

function upgradePanel(player) {

  const embed = new EmbedBuilder()
    .setTitle("⬆️ UPGRADES")
    .setDescription(
      `🎯 Pontos disponíveis: **${player.upgradePoints}**\n\n` +
      `Cada botão custa **1 ponto** e aumenta o atributo em **+5**.`
    );

  const row1 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("up_health")
        .setLabel("Vida +5")
        .setEmoji("❤️")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("up_strength")
        .setLabel("Força +5")
        .setEmoji("💪")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("up_defense")
        .setLabel("Defesa +5")
        .setEmoji("🛡️")
        .setStyle(ButtonStyle.Primary)
    );

  const row2 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("up_stamina")
        .setLabel("Stamina +5")
        .setEmoji("⚡")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("up_intelligence")
        .setLabel("Inteligência +5")
        .setEmoji("🧠")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("up_nen")
        .setLabel("Nen +5")
        .setEmoji("✨")
        .setStyle(ButtonStyle.Success)
    );

  const row3 = new ActionRowBuilder()
    .addComponents(

      new ButtonBuilder()
        .setCustomId("up_speed")
        .setLabel("Velocidade +5")
        .setEmoji("🏃")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("back")
        .setLabel("Voltar")
        .setEmoji("↩️")
        .setStyle(ButtonStyle.Secondary)
    );

  return {
    embeds: [embed],
    components: [row1, row2, row3]
  };
}

// =====================================================
// HABILIDADES
// =====================================================

function skillsPanel(player) {

  const character = characters.find(
    c => c.name === player.character
  );

  let text = "";

  for (const skillName of character.skills) {

    const skill = skills[skillName];

    const unlocked =
      player.skills.includes(skillName);

    text += unlocked
      ? `✅ **${skillName}** — DESBLOQUEADA\n`
      : `🔒 **${skillName}** — Nível ${skill.level} | ${skill.xp} XP | ${skill.money} Jenny\n`;
  }

  const embed = new EmbedBuilder()
    .setTitle("🥋 HABILIDADES")
    .setDescription(
      `**${player.character}**\n\n${text}\n` +
      `💡 Algumas habilidades exigem nível, XP e dinheiro para serem desbloqueadas.`
    );

  const available = character.skills.filter(
    skill => {
      const data = skills[skill];

      return (
        !player.skills.includes(skill) &&
        player.level >= data.level &&
        player.xp >= data.xp &&
        player.money >= data.money
      );
    }
  );

  const rows = [];

  if (available.length > 0) {

    const menu = new StringSelectMenuBuilder()
      .setCustomId("skill_buy")
      .setPlaceholder("Escolha uma habilidade para desbloquear");

    for (const skillName of available.slice(0, 25)) {

      const skill = skills[skillName];

      menu.addOptions({
        label: skillName,
        description:
          `${skill.money} Jenny • ${skill.xp} XP`,
        value: skillName
      });
    }

    rows.push(
      new ActionRowBuilder()
        .addComponents(menu)
    );
  }

  rows.push(
    new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId("back")
          .setLabel("Voltar")
          .setEmoji("↩️")
          .setStyle(ButtonStyle.Secondary)
      )
  );

  return {
    embeds: [embed],
    components: rows
  };
}

// =====================================================
// LISTA DE BOSSES
// =====================================================

function getAvailableBosses(level) {

  return bosses.filter(
    boss =>
      level >= boss.minLevel &&
      level <= boss.maxLevel
  );
}

// =====================================================
// PAINEL DE BATALHA
// =====================================================

function battlePanel(player) {

  const available = getAvailableBosses(
    player.level
  );

  if (!available.length) {

    return {
      embeds: [
        new EmbedBuilder()
          .setTitle("⚔️ BATALHAS")
          .setDescription(
            "Nenhum inimigo disponível para seu nível."
          )
      ],
      components: [
        new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId("back")
              .setLabel("Voltar")
              .setEmoji("↩️")
              .setStyle(ButtonStyle.Secondary)
          )
      ]
    };
  }

  const options = available
    .slice(0, 25)
    .map((boss, index) => ({
      label: boss.name,
      description:
        `Nível ${boss.minLevel}-${boss.maxLevel} • ${boss.xp} XP`,
      value: `boss_${bosses.indexOf(boss)}`
    }));

  const menu = new StringSelectMenuBuilder()
    .setCustomId("choose_boss")
    .setPlaceholder("Escolha um inimigo para batalhar")
    .addOptions(options);

  const embed = new EmbedBuilder()
    .setTitle("⚔️ BATALHAR")
    .setDescription(
      `Seu nível: **${player.level}**\n\n` +
      `Escolha um dos inimigos disponíveis.\n` +
      `Os inimigos mudam conforme seu nível.`
    );

  return {
    embeds: [embed],
    components: [
      new ActionRowBuilder()
        .addComponents(menu),

      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("back")
            .setLabel("Voltar")
            .setEmoji("↩️")
            .setStyle(ButtonStyle.Secondary)
        )
    ]
  };
}

// =====================================================
// BATALHA
// =====================================================

function battleEmbed(player, battle) {

  return new EmbedBuilder()
    .setTitle("⚔️ BATALHA")
    .setDescription(
      `👤 **${player.character}**\n` +
      `❤️ Sua vida: **${battle.playerHP}**\n\n` +

      `👹 **${battle.boss.name}**\n` +
      `❤️ Vida: **${battle.bossHP}/${battle.boss.hp}**`
    )
    .addFields(
      {
        name: "📊 Boss",
        value:
          `💪 ${battle.boss.strength}\n` +
          `🛡️ ${battle.boss.defense}\n` +
          `⚡ ${battle.boss.stamina}\n` +
          `✨ ${battle.boss.nen}`
      }
    );
}

function battleButtons() {

  return [
    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId("attack")
          .setLabel("Atacar")
          .setEmoji("⚔️")
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId("use_skill")
          .setLabel("Habilidade")
          .setEmoji("🥋")
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

// =====================================================
// COMANDO
// =====================================================

const commands = [
  new SlashCommandBuilder()
    .setName("rpg")
    .setDescription(
      "Abre o painel do Hunter x Hunter RPG"
    )
    .toJSON()
];

const rest = new REST({
  version: "10"
}).setToken(TOKEN);

// =====================================================
// REGISTRAR /RPG
// =====================================================

(async () => {

  try {

    console.log("🔄 Registrando /rpg...");

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: commands
      }
    );

    console.log("✅ /rpg registrado!");

  } catch (error) {

    console.error(
      "❌ Erro ao registrar /rpg:",
      error
    );

  }

})();

// =====================================================
// ONLINE
// =====================================================

client.once("ready", () => {

  console.log(
    `🟢 ${client.user.tag} está online!`
  );

});

// =====================================================
// INTERAÇÕES
// =====================================================

client.on(
  "interactionCreate",
  async interaction => {

    try {

      // ================================================
      // /RPG
      // ================================================

      if (
        interaction.isChatInputCommand() &&
        interaction.commandName === "rpg"
      ) {

        const id = interaction.user.id;

        if (!players[id]) {

          players[id] = createPlayer();

          saveDatabase();

          await interaction.reply({
            content:
              "🎲 **Seu personagem foi sorteado!**",
            ...mainPanel(
              interaction.user,
              players[id]
            )
          });

          return;
        }

        await interaction.reply(
          mainPanel(
            interaction.user,
            players[id]
          )
        );

        return;
      }

      // ================================================
      // BOTÕES
      // ================================================

      if (interaction.isButton()) {

        const id = interaction.user.id;
        const player = players[id];

        if (!player) {

          await interaction.reply({
            content:
              "❌ Use `/rpg` primeiro.",
            ephemeral: true
          });

          return;
        }

        // -----------------------------------------------
        // VOLTAR
        // -----------------------------------------------

        if (interaction.customId === "back") {

          await interaction.update(
            mainPanel(
              interaction.user,
              player
            )
          );

          return;
        }

        // -----------------------------------------------
        // ATUALIZAR
        // -----------------------------------------------

        if (interaction.customId === "refresh") {

          await interaction.update(
            mainPanel(
              interaction.user,
              player
            )
          );

          return;
        }

        // -----------------------------------------------
        // BATALHAR
        // -----------------------------------------------

        if (interaction.customId === "battle") {

          await interaction.update(
            battlePanel(player)
          );

          return;
        }

        // -----------------------------------------------
        // HABILIDADES
        // -----------------------------------------------

        if (interaction.customId === "skills") {

          await interaction.update(
            skillsPanel(player)
          );

          return;
        }

        // -----------------------------------------------
        // UPGRADES
        // -----------------------------------------------

        if (interaction.customId === "upgrades") {

          await interaction.update(
            upgradePanel(player)
          );

          return;
        }

        // -----------------------------------------------
        // PERSONAGEM
        // -----------------------------------------------

        if (interaction.customId === "character") {

          const character = characters.find(
            c => c.name === player.character
          );

          const bonuses =
            Object.entries(character.bonuses)
              .map(
                ([stat, value]) =>
                  `• ${stat}: +${value}`
              )
              .join("\n");

          const embed = new EmbedBuilder()
            .setTitle("👤 SEU PERSONAGEM")
            .setDescription(
              `**${character.name}**\n\n` +
              `🧬 Tipo de Nen: **${character.nen}**\n\n` +
              `⭐ **Bônus:**\n${bonuses}`
            );

          await interaction.update({
            embeds: [embed],
            components: [
              new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("Voltar")
                    .setEmoji("↩️")
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
          });

          return;
        }

        // -----------------------------------------------
        // INVENTÁRIO
        // -----------------------------------------------

        if (interaction.customId === "inventory") {

          const embed = new EmbedBuilder()
            .setTitle("🎒 INVENTÁRIO")
            .setDescription(
              `💰 **${player.money} Jenny**\n\n` +
              `Seu inventário ainda está vazio.`
            );

          await interaction.update({
            embeds: [embed],
            components: [
              new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId("back")
                    .setLabel("Voltar")
                    .setEmoji("↩️")
                    .setStyle(ButtonStyle.Secondary)
                )
            ]
          });

          return;
        }

        // -----------------------------------------------
        // UPGRADES
        // -----------------------------------------------

        const upgradeMap = {

          up_health: "health",
          up_strength: "strength",
          up_defense: "defense",
          up_stamina: "stamina",
          up_intelligence: "intelligence",
          up_nen: "nen",
          up_speed: "speed"

        };

        if (upgradeMap[interaction.customId]) {

          if (player.upgradePoints <= 0) {

            await interaction.reply({
              content:
                "❌ Você não possui pontos de upgrade.",
              ephemeral: true
            });

            return;
          }

          const stat =
            upgradeMap[interaction.customId];

          player.stats[stat] += 5;

          player.upgradePoints--;

          saveDatabase();

          await interaction.update(
            upgradePanel(player)
          );

          return;
        }

        // -----------------------------------------------
        // ATAQUE
        // -----------------------------------------------

        if (interaction.customId === "attack") {

          if (!player.battle) {

            await interaction.reply({
              content:
                "❌ Você não está em uma batalha.",
              ephemeral: true
            });

            return;
          }

          const battle = player.battle;

          const damage = Math.max(
            5,
            player.stats.strength -
            Math.floor(
              battle.boss.defense / 3
            ) +
            randomNumber(0, 20)
          );

          battle.bossHP -= damage;

          let message =
            `⚔️ Você causou **${damage} de dano**!`;

          if (battle.bossHP <= 0) {

            const gainedXP =
              battle.boss.xp;

            const money =
              battle.boss.money;

            const oldLevel =
              player.level;

            const levels =
              giveXP(
                player,
                gainedXP
              );

            player.money += money;

            player.battle = null;

            saveDatabase();

            message +=
              `\n\n🏆 **VITÓRIA!**\n` +
              `⭐ +${gainedXP} XP\n` +
              `💰 +${money} Jenny`;

            if (levels > 0) {

              message +=
                `\n🎉 Você subiu **${levels} nível(is)!**\n` +
                `🏆 Nível atual: **${player.level}**\n` +
                `🎯 +${levels * 3} pontos de upgrade`;
            }

            await interaction.update({
              content: message,
              embeds: [
                mainPanel(
                  interaction.user,
                  player
                ).embeds[0]
              ],
              components:
                mainPanel(
                  interaction.user,
                  player
                ).components
            });

            return;
          }

          // -------------------------------------------
          // ATAQUE DO BOSS
          // -------------------------------------------

          const bossDamage =
            Math.max(
              5,
              battle.boss.strength -
              Math.floor(
                player.stats.defense / 3
              ) +
              randomNumber(0, 15)
            );

          battle.playerHP -= bossDamage;

          message +=
            `\n👹 **${battle.boss.name}** causou ` +
            `**${bossDamage} de dano**!`;

          if (battle.playerHP <= 0) {

            player.battle = null;

            saveDatabase();

            message +=
              `\n\n💀 **Você perdeu a batalha!**`;

            await interaction.update({
              content: message,
              embeds: [],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("battle")
                      .setLabel("Tentar novamente")
                      .setEmoji("⚔️")
                      .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                      .setCustomId("back")
                      .setLabel("Voltar")
                      .setStyle(ButtonStyle.Secondary)
                  )
              ]
            });

            return;
          }

          saveDatabase();

          await interaction.update({
            content: message,
            embeds: [
              battleEmbed(
                player,
                battle
              )
            ],
            components: battleButtons()
          });

          return;
        }

        // -----------------------------------------------
        // DEFENDER
        // -----------------------------------------------

        if (interaction.customId === "defend") {

          if (!player.battle) return;

          const battle = player.battle;

          const damage =
            Math.max(
              2,
              Math.floor(
                battle.boss.strength / 4
              )
            );

          battle.playerHP -= damage;

          if (battle.playerHP <= 0) {

            player.battle = null;

            saveDatabase();

            await interaction.update({
              content:
                `🛡️ Você tentou se defender, mas ` +
                `**${battle.boss.name}** venceu!`,
              embeds: [],
              components: [
                new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("battle")
                      .setLabel("Voltar às batalhas")
                      .setEmoji("⚔️")
                      .setStyle(ButtonStyle.Danger)
                  )
              ]
            });

            return;
          }

          await interaction.update({
            content:
              `🛡️ Você reduziu o dano do inimigo!`,
            embeds: [
              battleEmbed(
                player,
                battle
              )
            ],
            components: battleButtons()
          });

          return;
        }

        // -----------------------------------------------
        // FUGIR
        // -----------------------------------------------

        if (interaction.customId === "flee") {

          player.battle = null;

          saveDatabase();

          await interaction.update(
            battlePanel(player)
          );

          return;
        }

        // -----------------------------------------------
        // HABILIDADE
        // -----------------------------------------------

        if (interaction.customId === "use_skill") {

          if (!player.battle) {

            await interaction.reply({
              content:
                "❌ Você não está em batalha.",
              ephemeral: true
            });

            return;
          }

          const character =
            characters.find(
              c =>
                c.name === player.character
            );

          const unlocked =
            character.skills.filter(
              skill =>
                player.skills.includes(skill)
            );

          if (!unlocked.length) {

            await interaction.reply({
              content:
                "🔒 Você ainda não desbloqueou nenhuma habilidade.",
              ephemeral: true
            });

            return;
          }

          const menu =
            new StringSelectMenuBuilder()
              .setCustomId("battle_skill")
              .setPlaceholder(
                "Escolha uma habilidade"
              )
              .addOptions(
                unlocked.map(skill => ({
                  label: skill,
                  value: skill
                }))
              );

          await interaction.reply({
            content:
              "🥋 Escolha uma habilidade:",
            components: [
              new ActionRowBuilder()
                .addComponents(menu)
            ],
            ephemeral: true
          });

          return;
        }
      }

      // ================================================
      // SELECT MENUS
      // ================================================

      if (interaction.isStringSelectMenu()) {

        const id = interaction.user.id;
        const player = players[id];

        // -----------------------------------------------
        // ESCOLHER BOSS
        // -----------------------------------------------

        if (
          interaction.customId === "choose_boss"
        ) {

          const index =
            Number(
              interaction.values[0]
                .replace("boss_", "")
            );

          const boss =
            bosses[index];

          player.battle = {
            boss: boss,
            bossHP: boss.hp,
            playerHP: player.stats.health
          };

          saveDatabase();

          await interaction.update({
            content:
              `⚔️ **Batalha iniciada contra ${boss.name}!**`,
            embeds: [
              battleEmbed(
                player,
                player.battle
              )
            ],
            components: battleButtons()
          });

          return;
        }

        // -----------------------------------------------
        // COMPRAR HABILIDADE
        // -----------------------------------------------

        if (
          interaction.customId === "skill_buy"
        ) {

          const skillName =
            interaction.values[0];

          const skill =
            skills[skillName];

          if (
            player.level < skill.level ||
            player.xp < skill.xp ||
            player.money < skill.money
          ) {

            await interaction.reply({
              content:
                "❌ Você não possui os requisitos.",
              ephemeral: true
            });

            return;
          }

          player.xp -= skill.xp;
          player.money -= skill.money;

          player.skills.push(
            skillName
          );

          saveDatabase();

          await interaction.update(
            skillsPanel(player)
          );

          return;
        }

        // -----------------------------------------------
        // USAR HABILIDADE EM BATALHA
        // -----------------------------------------------

        if (
          interaction.customId === "battle_skill"
        ) {

          if (!player.battle) {

            await interaction.update({
              content:
                "❌ A batalha acabou.",
              components: []
            });

            return;
          }

          const skillName =
            interaction.values[0];

          const skill =
            skills[skillName];

          const battle =
            player.battle;

          const damage =
            skill.damage +
            Math.floor(
              player.stats.nen / 2
            );

          battle.bossHP -= damage;

          let message =
            `🥋 **${skillName}** causou ` +
            `**${damage} de dano!**`;

          if (battle.bossHP <= 0) {

            const xp =
              battle.boss.xp;

            const money =
              battle.boss.money;

            const levels =
              giveXP(
                player,
                xp
              );

            player.money += money;

            player.battle = null;

            saveDatabase();

            message +=
              `\n\n🏆 **VITÓRIA!**\n` +
              `⭐ +${xp} XP\n` +
              `💰 +${money} Jenny`;

            if (levels) {

              message +=
                `\n🎉 Você subiu **${levels} nível(is)!**`;
            }

            await interaction.update({
              content: message,
              embeds: [
                mainPanel(
                  interaction.user,
                  player
                ).embeds[0]
              ],
              components:
                mainPanel(
                  interaction.user,
                  player
                ).components
            });

            return;
          }

          // Boss responde

          const bossDamage =
            Math.max(
              5,
              battle.boss.strength -
              Math.floor(
                player.stats.defense / 3
              ) +
              randomNumber(0, 15)
            );

          battle.playerHP -= bossDamage;

          message +=
            `\n👹 **${battle.boss.name}** causou ` +
            `**${bossDamage} de dano!**`;

          if (battle.playerHP <= 0) {

            player.battle = null;

            saveDatabase();

            await interaction.update({
              content:
                message +
                `\n\n💀 **Você perdeu!**`,
              components: []
            });

            return;
          }

          saveDatabase();

          await interaction.update({
            content: message,
            embeds: [
              battleEmbed(
                player,
                battle
              )
            ],
            components: battleButtons()
          });

          return;
        }
      }

    } catch (error) {

      console.error(
        "❌ Erro na interação:",
        error
      );

      if (!interaction.replied) {

        await interaction.reply({
          content:
            "❌ Ocorreu um erro ao executar essa ação.",
          ephemeral: true
        });

      }

    }

  }
);

// =====================================================
// LOGIN
// =====================================================

client.login(TOKEN);
