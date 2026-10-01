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

// ======================================================
// CONFIGURAÇÃO
// ======================================================

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN || !CLIENT_ID) {
  console.error("❌ TOKEN ou CLIENT_ID não configurado.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ======================================================
// BANCO DE DADOS
// ======================================================

const DB_FILE = "./players.json";

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "{}");
}

let players = {};

try {
  players = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
} catch {
  players = {};
}

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(players, null, 2));
}

// ======================================================
// PERSONAGENS
// ======================================================

const characters = [
  {
    name: "Leorio",
    rarity: "Comum",
    chance: 15,
    nen: 55,
    type: "Emissão",
    hp: 110,
    strength: 55,
    defense: 50,
    stamina: 55,
    intelligence: 70,
    speed: 45,
    skills: ["Remote Punch"]
  },

  {
    name: "Kalluto Zoldyck",
    rarity: "Comum",
    chance: 10,
    nen: 60,
    type: "Manipulação",
    hp: 105,
    strength: 50,
    defense: 50,
    stamina: 65,
    intelligence: 75,
    speed: 70,
    skills: ["Manipulação de Papel"]
  },

  {
    name: "Shizuku",
    rarity: "Incomum",
    chance: 7,
    nen: 70,
    type: "Conjuração",
    hp: 120,
    strength: 65,
    defense: 65,
    stamina: 70,
    intelligence: 80,
    speed: 60,
    skills: ["Blinky"]
  },

  {
    name: "Machi",
    rarity: "Incomum",
    chance: 6,
    nen: 76,
    type: "Transmutação",
    hp: 125,
    strength: 75,
    defense: 70,
    stamina: 80,
    intelligence: 82,
    speed: 78,
    skills: ["Fios de Nen"]
  },

  {
    name: "Phinks",
    rarity: "Incomum",
    chance: 5,
    nen: 78,
    type: "Reforço",
    hp: 140,
    strength: 90,
    defense: 80,
    stamina: 85,
    intelligence: 60,
    speed: 70,
    skills: ["Ripper Cyclotron"]
  },

  {
    name: "Feitan",
    rarity: "Incomum",
    chance: 5,
    nen: 82,
    type: "Transmutação",
    hp: 130,
    strength: 82,
    defense: 75,
    stamina: 90,
    intelligence: 85,
    speed: 95,
    skills: ["Pain Packer"]
  },

  {
    name: "Killua Zoldyck",
    rarity: "Raro",
    chance: 4,
    nen: 87,
    type: "Transmutação",
    hp: 145,
    strength: 88,
    defense: 82,
    stamina: 96,
    intelligence: 94,
    speed: 100,
    skills: ["Eletricidade", "Godspeed"]
  },

  {
    name: "Kurapika",
    rarity: "Raro",
    chance: 3.5,
    nen: 92,
    type: "Conjuração",
    hp: 140,
    strength: 80,
    defense: 80,
    stamina: 85,
    intelligence: 98,
    speed: 82,
    skills: ["Dowsing Chain", "Emperor Time"]
  },

  {
    name: "Uvogin",
    rarity: "Raro",
    chance: 3,
    nen: 90,
    type: "Reforço",
    hp: 200,
    strength: 100,
    defense: 98,
    stamina: 95,
    intelligence: 45,
    speed: 65,
    skills: ["Big Bang Impact"]
  },

  {
    name: "Hisoka",
    rarity: "Épico",
    chance: 2,
    nen: 95,
    type: "Transmutação",
    hp: 165,
    strength: 92,
    defense: 88,
    stamina: 94,
    intelligence: 100,
    speed: 92,
    skills: ["Bungee Gum", "Texture Surprise"]
  },

  {
    name: "Illumi Zoldyck",
    rarity: "Épico",
    chance: 1.8,
    nen: 94,
    type: "Manipulação",
    hp: 155,
    strength: 84,
    defense: 82,
    stamina: 90,
    intelligence: 99,
    speed: 88,
    skills: ["Needle People"]
  },

  {
    name: "Zeno Zoldyck",
    rarity: "Épico",
    chance: 1.5,
    nen: 96,
    type: "Emissão",
    hp: 180,
    strength: 94,
    defense: 92,
    stamina: 95,
    intelligence: 100,
    speed: 90,
    skills: ["Dragon Head", "Dragon Dive"]
  },

  {
    name: "Chrollo Lucilfer",
    rarity: "Lendário",
    chance: 1,
    nen: 98,
    type: "Especialização",
    hp: 180,
    strength: 90,
    defense: 88,
    stamina: 95,
    intelligence: 100,
    speed: 94,
    skills: ["Skill Hunter"]
  },

  {
    name: "Netero",
    rarity: "Lendário",
    chance: 0.7,
    nen: 99,
    type: "Reforço",
    hp: 190,
    strength: 98,
    defense: 95,
    stamina: 100,
    intelligence: 100,
    speed: 100,
    skills: ["100-Type Guanyin Bodhisattva"]
  },

  {
    name: "Ging Freecss",
    rarity: "Lendário",
    chance: 0.5,
    nen: 99,
    type: "Especialização",
    hp: 190,
    strength: 95,
    defense: 94,
    stamina: 98,
    intelligence: 100,
    speed: 96,
    skills: ["Copy"]
  },

  {
    name: "Meruem",
    rarity: "Mítico",
    chance: 0.2,
    nen: 100,
    type: "Especialização",
    hp: 300,
    strength: 150,
    defense: 145,
    stamina: 150,
    intelligence: 140,
    speed: 125,
    skills: ["Rage Blast"]
  }
];

// ======================================================
// BOSSES
// ======================================================

const bosses = [
  {
    name: "Bandido",
    minLevel: 1,
    hp: 100,
    attack: 15,
    defense: 8,
    xp: 30,
    money: 15
  },

  {
    name: "Ladrão",
    minLevel: 5,
    hp: 150,
    attack: 22,
    defense: 12,
    xp: 45,
    money: 25
  },

  {
    name: "Usuário de Nen",
    minLevel: 10,
    hp: 250,
    attack: 35,
    defense: 20,
    xp: 70,
    money: 40
  },

  {
    name: "Hunter Renegado",
    minLevel: 20,
    hp: 400,
    attack: 50,
    defense: 30,
    xp: 100,
    money: 60
  },

  // TRUPE
  {
    name: "Kalluto",
    minLevel: 25,
    hp: 500,
    attack: 60,
    defense: 40,
    xp: 130,
    money: 80
  },

  {
    name: "Shizuku",
    minLevel: 30,
    hp: 650,
    attack: 75,
    defense: 48,
    xp: 160,
    money: 100
  },

  {
    name: "Shalnark",
    minLevel: 35,
    hp: 750,
    attack: 85,
    defense: 55,
    xp: 190,
    money: 120
  },

  {
    name: "Machi",
    minLevel: 40,
    hp: 850,
    attack: 95,
    defense: 60,
    xp: 220,
    money: 140
  },

  {
    name: "Nobunaga",
    minLevel: 45,
    hp: 950,
    attack: 105,
    defense: 65,
    xp: 250,
    money: 160
  },

  {
    name: "Phinks",
    minLevel: 50,
    hp: 1100,
    attack: 120,
    defense: 75,
    xp: 280,
    money: 180
  },

  {
    name: "Feitan",
    minLevel: 55,
    hp: 1250,
    attack: 135,
    defense: 80,
    xp: 320,
    money: 210
  },

  {
    name: "Franklin",
    minLevel: 60,
    hp: 1400,
    attack: 145,
    defense: 90,
    xp: 350,
    money: 230
  },

  {
    name: "Bonolenov",
    minLevel: 60,
    hp: 1450,
    attack: 150,
    defense: 92,
    xp: 370,
    money: 240
  },

  {
    name: "Uvogin",
    minLevel: 65,
    hp: 1800,
    attack: 175,
    defense: 110,
    xp: 450,
    money: 300
  },

  {
    name: "Chrollo Lucilfer",
    minLevel: 70,
    hp: 2200,
    attack: 200,
    defense: 130,
    xp: 600,
    money: 400
  },

  // FORMIGAS
  {
    name: "Soldado Quimera",
    minLevel: 70,
    hp: 1600,
    attack: 160,
    defense: 100,
    xp: 400,
    money: 250
  },

  {
    name: "Rammot",
    minLevel: 75,
    hp: 1900,
    attack: 180,
    defense: 115,
    xp: 500,
    money: 300
  },

  {
    name: "Cheetu",
    minLevel: 85,
    hp: 2300,
    attack: 210,
    defense: 125,
    xp: 600,
    money: 400
  },

  {
    name: "Leol",
    minLevel: 95,
    hp: 2700,
    attack: 235,
    defense: 140,
    xp: 700,
    money: 450
  },

  {
    name: "Zazan",
    minLevel: 105,
    hp: 3200,
    attack: 260,
    defense: 160,
    xp: 850,
    money: 550
  },

  // GUARDA REAL
  {
    name: "Neferpitou",
    minLevel: 120,
    hp: 5000,
    attack: 350,
    defense: 250,
    xp: 1300,
    money: 900
  },

  {
    name: "Shaiapouf",
    minLevel: 130,
    hp: 4800,
    attack: 340,
    defense: 240,
    xp: 1250,
    money: 850
  },

  {
    name: "Menthuthuyoupi",
    minLevel: 140,
    hp: 6000,
    attack: 400,
    defense: 300,
    xp: 1600,
    money: 1100
  },

  {
    name: "Meruem",
    minLevel: 180,
    hp: 10000,
    attack: 600,
    defense: 450,
    xp: 3000,
    money: 2500
  }
];

// ======================================================
// FUNÇÕES
// ======================================================

function getCharacter(name) {
  return characters.find(c => c.name === name);
}

function getBoss(name) {
  return bosses.find(b => b.name === name);
}

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

function createPlayer(id) {
  const character = randomCharacter();

  players[id] = {
    id,

    character: character.name,
    rarity: character.rarity,

    level: 1,
    xp: 0,
    money: 100,
    upgradePoints: 5,

    hp: character.hp,
    maxHp: character.hp,

    strength: character.strength,
    defense: character.defense,
    stamina: character.stamina,
    intelligence: character.intelligence,
    speed: character.speed,

    nen: character.nen,
    nenType: character.type,

    skills: [...character.skills],

    currentBoss: null
  };

  saveDB();

  return players[id];
}

function levelUp(player) {
  let didLevel = false;

  while (player.xp >= player.level * 100) {
    player.xp -= player.level * 100;

    player.level++;
    player.upgradePoints += 3;

    player.maxHp += 20;
    player.hp = player.maxHp;

    didLevel = true;
  }

  return didLevel;
}

// ======================================================
// EMBEDS
// ======================================================

function panelEmbed(player) {
  const character = getCharacter(player.character);

  return new EmbedBuilder()
    .setTitle("⚔️ HUNTER × HUNTER RPG")
    .setDescription(
      `🎭 **Personagem:** ${player.character}\n` +
      `⭐ **Raridade:** ${player.rarity}\n` +
      `🌀 **Nen:** ${player.nen}% — ${player.nenType}\n\n` +
      `📈 **Nível:** ${player.level}\n` +
      `✨ **XP:** ${player.xp}/${player.level * 100}\n` +
      `💰 **Dinheiro:** ¥${player.money}\n` +
      `🔮 **Pontos:** ${player.upgradePoints}`
    )
    .addFields({
      name: "📊 ATRIBUTOS",
      value:
        `❤️ Vida: **${player.hp}/${player.maxHp}**\n` +
        `⚔️ Força: **${player.strength}**\n` +
        `🛡️ Defesa: **${player.defense}**\n` +
        `⚡ Stamina: **${player.stamina}**\n` +
        `🧠 Inteligência: **${player.intelligence}**\n` +
        `💨 Velocidade: **${player.speed}**`
    })
    .setFooter({
      text: `Tipo de Nen: ${character.type}`
    });
}

function characterEmbed(player) {
  const character = getCharacter(player.character);

  return new EmbedBuilder()
    .setTitle(`🎭 ${character.name}`)
    .setDescription(
      `⭐ **Raridade:** ${character.rarity}\n` +
      `🎯 **Chance:** ${character.chance}%\n` +
      `💠 **Potencial Nen:** ${character.nen}%\n` +
      `🌀 **Tipo:** ${character.type}`
    )
    .addFields({
      name: "📊 Atributos",
      value:
        `❤️ Vida: **${character.hp}**\n` +
        `⚔️ Força: **${character.strength}**\n` +
        `🛡️ Defesa: **${character.defense}**\n` +
        `⚡ Stamina: **${character.stamina}**\n` +
        `🧠 Inteligência: **${character.intelligence}**\n` +
        `💨 Velocidade: **${character.speed}**`
    }, {
      name: "✨ Habilidades",
      value: character.skills.map(s => `• ${s}`).join("\n")
    });
}

function bossEmbed(player, boss) {
  return new EmbedBuilder()
    .setTitle(`👹 ${boss.name}`)
    .setDescription(
      `🔓 **Nível necessário:** ${boss.minLevel}\n\n` +
      `❤️ **HP:** ${boss.hp}\n` +
      `⚔️ **Ataque:** ${boss.attack}\n` +
      `🛡️ **Defesa:** ${boss.defense}\n\n` +
      `✨ **XP:** ${boss.xp}\n` +
      `💰 **Recompensa:** ¥${boss.money}`
    );
}

// ======================================================
// BOTÕES DO PAINEL
// ======================================================

function mainButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("character")
      .setLabel("🎭 Personagem")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("bosses")
      .setLabel("👹 Bosses")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId("skills")
      .setLabel("✨ Habilidades")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("upgrades")
      .setLabel("📈 Upgrades")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("refresh")
      .setLabel("🔄 Atualizar")
      .setStyle(ButtonStyle.Secondary)
  );
}

// ======================================================
// BOTÕES DE BATALHA
// ======================================================

function battleButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("attack")
      .setLabel("⚔️ Atacar")
      .setStyle(ButtonStyle.Danger),

    new ButtonBuilder()
      .setCustomId("use_skill")
      .setLabel("✨ Habilidade")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("defend")
      .setLabel("🛡️ Defender")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("flee")
      .setLabel("🏃 Fugir")
      .setStyle(ButtonStyle.Secondary)
  );
}

// ======================================================
// READY
// ======================================================

client.once("ready", async () => {
  console.log(`✅ ${client.user.tag} está online!`);

  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);

    const commands = [
      new SlashCommandBuilder()
        .setName("rpg")
        .setDescription("Abrir o Hunter x Hunter RPG")
    ];

    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      {
        body: commands.map(command => command.toJSON())
      }
    );

    console.log("✅ /rpg registrado.");
  } catch (error) {
    console.error("Erro ao registrar comando:", error);
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

    if (interaction.isChatInputCommand()) {

      if (interaction.commandName !== "rpg") return;

      let player = players[interaction.user.id];

      if (!player) {
        player = createPlayer(interaction.user.id);

        return interaction.reply({
          content: "🎲 **Seu personagem foi sorteado!**",
          embeds: [characterEmbed(player)],
          components: [mainButtons()]
        });
      }

      return interaction.reply({
        embeds: [panelEmbed(player)],
        components: [mainButtons()]
      });
    }

    const player = players[interaction.user.id];

    if (!player) {
      return interaction.reply({
        content: "❌ Use `/rpg` primeiro.",
        ephemeral: true
      });
    }

    // ==================================================
    // ATUALIZAR
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "refresh"
    ) {
      return interaction.update({
        embeds: [panelEmbed(player)],
        components: [mainButtons()]
      });
    }

    // ==================================================
    // PERSONAGEM
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "character"
    ) {
      return interaction.update({
        embeds: [characterEmbed(player)],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("back_panel")
              .setLabel("↩️ Voltar")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

    // ==================================================
    // VOLTAR
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "back_panel"
    ) {
      return interaction.update({
        embeds: [panelEmbed(player)],
        components: [mainButtons()]
      });
    }

    // ==================================================
    // BOSSES
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "bosses"
    ) {

      const available = bosses.filter(
        boss => player.level >= boss.minLevel
      );

      if (!available.length) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("👹 BOSSES")
              .setDescription(
                "Você ainda não possui bosses disponíveis."
              )
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("back_panel")
                .setLabel("↩️ Voltar")
                .setStyle(ButtonStyle.Secondary)
            )
          ]
        });
      }

      const options = available.slice(0, 25).map(boss => ({
        label: boss.name,
        description: `Nível ${boss.minLevel}+ • ${boss.hp} HP`,
        value: boss.name
      }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId("boss_select")
        .setPlaceholder("Escolha um boss")
        .addOptions(options);

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("👹 BOSSES DISPONÍVEIS")
            .setDescription(
              `📈 Seu nível: **${player.level}**\n\n` +
              `Escolha um boss para começar a batalha.`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(menu),
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("back_panel")
              .setLabel("↩️ Voltar")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

    // ==================================================
    // ESCOLHER BOSS
    // ==================================================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "boss_select"
    ) {

      const boss = getBoss(interaction.values[0]);

      if (!boss) {
        return interaction.update({
          content: "❌ Boss não encontrado.",
          embeds: [],
          components: []
        });
      }

      player.currentBoss = {
        name: boss.name,
        hp: boss.hp,
        maxHp: boss.hp
      };

      saveDB();

      return interaction.update({
        content: null,
        embeds: [
          new EmbedBuilder()
            .setTitle(`⚔️ BATALHA — ${boss.name}`)
            .setDescription(
              `🎭 **${player.character}**\n` +
              `❤️ Seu HP: **${player.hp}/${player.maxHp}**\n\n` +
              `👹 **${boss.name}**\n` +
              `❤️ HP: **${boss.hp}/${boss.hp}**`
            )
        ],
        components: [battleButtons()]
      });
    }

    // ==================================================
    // ATAQUE
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "attack"
    ) {

      if (!player.currentBoss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: [mainButtons()]
        });
      }

      const boss = getBoss(player.currentBoss.name);

      if (!boss) return;

      const damage = Math.floor(
        player.strength * 0.7 +
        player.nen * 0.5 +
        Math.random() * 30
      );

      player.currentBoss.hp -= damage;

      // VITÓRIA
      if (player.currentBoss.hp <= 0) {

        player.xp += boss.xp;
        player.money += boss.money;

        const leveled = levelUp(player);

        player.currentBoss = null;

        saveDB();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("🏆 VITÓRIA!")
              .setDescription(
                `Você derrotou **${boss.name}**!\n\n` +
                `⚔️ Dano: **${damage}**\n` +
                `✨ XP: **+${boss.xp}**\n` +
                `💰 Dinheiro: **+¥${boss.money}**` +
                (leveled
                  ? `\n\n🎉 **LEVEL UP!**\n📈 Agora você é nível **${player.level}**!`
                  : "")
              )
          ],
          components: [mainButtons()]
        });
      }

      // ATAQUE DO BOSS
      const bossDamage = Math.max(
        1,
        Math.floor(
          boss.attack -
          player.defense * 0.25 +
          Math.random() * 20
        )
      );

      player.hp -= bossDamage;

      // DERROTA
      if (player.hp <= 0) {

        player.hp = player.maxHp;
        player.currentBoss = null;

        saveDB();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("💀 DERROTA")
              .setDescription(
                `Você foi derrotado por **${boss.name}**.\n\n` +
                `❤️ Seu HP foi restaurado.\n` +
                `📈 Seu nível e XP foram mantidos.`
              )
          ],
          components: [mainButtons()]
        });
      }

      saveDB();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle(`⚔️ BATALHA — ${boss.name}`)
            .setDescription(
              `🎭 **${player.character}**\n` +
              `❤️ Seu HP: **${player.hp}/${player.maxHp}**\n\n` +
              `👹 **${boss.name}**\n` +
              `❤️ HP: **${player.currentBoss.hp}/${boss.hp}**\n\n` +
              `⚔️ Você causou **${damage}** de dano.\n` +
              `💥 O boss causou **${bossDamage}** de dano.`
            )
        ],
        components: [battleButtons()]
      });
    }

    // ==================================================
    // DEFENDER
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "defend"
    ) {

      if (!player.currentBoss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: [mainButtons()]
        });
      }

      const boss = getBoss(player.currentBoss.name);

      const damage = Math.max(
        1,
        Math.floor(
          boss.attack * 0.25 -
          player.defense * 0.1
        )
      );

      player.hp -= damage;

      if (player.hp <= 0) {

        player.hp = player.maxHp;
        player.currentBoss = null;

        saveDB();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("💀 DERROTA")
              .setDescription(
                `Você não conseguiu resistir ao ataque.\n\n` +
                `❤️ HP restaurado.`
              )
          ],
          components: [mainButtons()]
        });
      }

      saveDB();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle(`🛡️ DEFESA — ${boss.name}`)
            .setDescription(
              `Você reduziu o dano recebido.\n\n` +
              `❤️ HP: **${player.hp}/${player.maxHp}**\n` +
              `👹 ${boss.name}: **${player.currentBoss.hp}/${boss.hp} HP**`
            )
        ],
        components: [battleButtons()]
      });
    }

    // ==================================================
    // FUGIR
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "flee"
    ) {

      player.currentBoss = null;

      saveDB();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("🏃 BATALHA ENCERRADA")
            .setDescription(
              `Você fugiu da batalha.\n\n` +
              `Seu painel foi atualizado.`
            )
        ],
        components: [mainButtons()]
      });
    }

    // ==================================================
    // HABILIDADES
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "skills"
    ) {

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("✨ HABILIDADES")
            .setDescription(
              player.skills.length
                ? player.skills
                    .map(skill => `🔮 **${skill}**`)
                    .join("\n")
                : "Você não possui habilidades."
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("back_panel")
              .setLabel("↩️ Voltar")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

    // ==================================================
    // USAR HABILIDADE
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "use_skill"
    ) {

      if (!player.currentBoss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: [mainButtons()]
        });
      }

      const menu = new StringSelectMenuBuilder()
        .setCustomId("battle_skill")
        .setPlaceholder("Escolha uma habilidade")
        .addOptions(
          player.skills.map(skill => ({
            label: skill,
            description: `Usar ${skill}`,
            value: skill
          }))
        );

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("✨ HABILIDADES DE BATALHA")
            .setDescription(
              `Escolha uma habilidade para atacar **${player.currentBoss.name}**.`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(menu),
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("back_battle")
              .setLabel("↩️ Voltar para batalha")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

    // ==================================================
    // VOLTAR PARA BATALHA
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "back_battle"
    ) {

      if (!player.currentBoss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: [mainButtons()]
        });
      }

      const boss = getBoss(player.currentBoss.name);

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle(`⚔️ BATALHA — ${boss.name}`)
            .setDescription(
              `🎭 **${player.character}**\n` +
              `❤️ Seu HP: **${player.hp}/${player.maxHp}**\n\n` +
              `👹 **${boss.name}**\n` +
              `❤️ HP: **${player.currentBoss.hp}/${boss.hp}**`
            )
        ],
        components: [battleButtons()]
      });
    }

    // ==================================================
    // HABILIDADE SELECIONADA
    // ==================================================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "battle_skill"
    ) {

      if (!player.currentBoss) {
        return interaction.update({
          embeds: [panelEmbed(player)],
          components: [mainButtons()]
        });
      }

      const boss = getBoss(player.currentBoss.name);
      const skill = interaction.values[0];

      const damage = Math.floor(
        player.nen * 1.5 +
        player.strength +
        Math.random() * 80
      );

      player.currentBoss.hp -= damage;

      // VITÓRIA
      if (player.currentBoss.hp <= 0) {

        player.xp += boss.xp;
        player.money += boss.money;

        const leveled = levelUp(player);

        player.currentBoss = null;

        saveDB();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("🏆 VITÓRIA!")
              .setDescription(
                `✨ Você usou **${skill}**!\n` +
                `💥 Dano: **${damage}**\n\n` +
                `👹 **${boss.name}** foi derrotado!\n\n` +
                `✨ XP: **+${boss.xp}**\n` +
                `💰 Dinheiro: **+¥${boss.money}**` +
                (leveled
                  ? `\n\n🎉 **LEVEL UP!**\n📈 Agora você é nível **${player.level}**!`
                  : "")
              )
          ],
          components: [mainButtons()]
        });
      }

      // BOSS CONTRA-ATACA
      const bossDamage = Math.max(
        1,
        Math.floor(
          boss.attack -
          player.defense * 0.2 +
          Math.random() * 20
        )
      );

      player.hp -= bossDamage;

      if (player.hp <= 0) {

        player.hp = player.maxHp;
        player.currentBoss = null;

        saveDB();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("💀 DERROTA")
              .setDescription(
                `O boss derrotou você após sua habilidade.\n\n` +
                `❤️ Seu HP foi restaurado.`
              )
          ],
          components: [mainButtons()]
        });
      }

      saveDB();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle(`⚔️ BATALHA — ${boss.name}`)
            .setDescription(
              `✨ **${skill}** causou **${damage}** de dano!\n\n` +
              `👤 **${player.character}**\n` +
              `❤️ HP: **${player.hp}/${player.maxHp}**\n\n` +
              `👹 **${boss.name}**\n` +
              `❤️ HP: **${player.currentBoss.hp}/${boss.hp}**\n\n` +
              `💥 O boss causou **${bossDamage}** de dano.`
            )
        ],
        components: [battleButtons()]
      });
    }

    // ==================================================
    // UPGRADES
    // ==================================================

    if (
      interaction.isButton() &&
      interaction.customId === "upgrades"
    ) {

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("📈 UPGRADES")
            .setDescription(
              `🔮 **Pontos disponíveis:** ${player.upgradePoints}\n\n` +
              `❤️ Vida: **${player.maxHp}**\n` +
              `⚔️ Força: **${player.strength}**\n` +
              `🛡️ Defesa: **${player.defense}**\n` +
              `⚡ Stamina: **${player.stamina}**\n` +
              `💨 Velocidade: **${player.speed}**`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("up_hp")
              .setLabel("❤️ Vida")
              .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
              .setCustomId("up_str")
              .setLabel("⚔️ Força")
              .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
              .setCustomId("up_def")
              .setLabel("🛡️ Defesa")
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setCustomId("up_sta")
              .setLabel("⚡ Stamina")
              .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
              .setCustomId("up_speed")
              .setLabel("💨 Velocidade")
              .setStyle(ButtonStyle.Secondary)
          ),
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("back_panel")
              .setLabel("↩️ Voltar")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

    // ==================================================
    // UPGRADES INDIVIDUAIS
    // ==================================================

    const upgradeMap = {
      up_hp: "hp",
      up_str: "strength",
      up_def: "defense",
      up_sta: "stamina",
      up_speed: "speed"
    };

    if (
      interaction.isButton() &&
      upgradeMap[interaction.customId]
    ) {

      if (player.upgradePoints <= 0) {
        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("❌ SEM PONTOS")
              .setDescription(
                "Você não possui pontos de upgrade."
              )
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("back_panel")
                .setLabel("↩️ Voltar")
                .setStyle(ButtonStyle.Secondary)
            )
          ]
        });
      }

      const stat = upgradeMap[interaction.customId];

      player.upgradePoints--;

      if (stat === "hp") {
        player.maxHp += 25;
        player.hp += 25;
      } else {
        player[stat] += 5;
      }

      saveDB();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("📈 UPGRADE REALIZADO")
            .setDescription(
              `Você aumentou **${stat}** em **+5**.\n\n` +
              `🔮 Pontos restantes: **${player.upgradePoints}**`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("upgrades")
              .setLabel("📈 Continuar Upgrades")
              .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
              .setCustomId("back_panel")
              .setLabel("↩️ Painel")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });
    }

  } catch (error) {

    console.error("❌ ERRO:", error);

    try {

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content: "❌ Ocorreu um erro no RPG."
        });
      } else {
        await interaction.reply({
          content: "❌ Ocorreu um erro no RPG.",
          ephemeral: true
        });
      }

    } catch {}
  }
});

// ======================================================
// LOGIN
// ======================================================

client.login(TOKEN);
