
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

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ==============================
// BANCO DE DADOS
// ==============================

const DB_FILE = "./players.json";

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2));
}

let players = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(players, null, 2));
}

// ==============================
// PERSONAGENS
// ==============================

const characters = [

  // COMUNS
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

  // INCOMUNS
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

  // RAROS
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

  // ÉPICOS
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

  // LENDÁRIOS
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

  // MÍTICO
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

// ==============================
// BOSSES
// ==============================

const bosses = [

  // LEVEL 1+
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

  // TRUPE FANTASMA
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

  // FORMIGAS QUIMERA
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

  // FINAL
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

// ==============================
// SORTEIO DE PERSONAGEM
// ==============================

function randomCharacter() {

  const total = characters.reduce((sum, c) => sum + c.chance, 0);

  let random = Math.random() * total;

  for (const character of characters) {

    random -= character.chance;

    if (random <= 0) {
      return character;
    }

  }

  return characters[0];
}

// ==============================
// CRIAR PLAYER
// ==============================

function createPlayer(id) {

  const character = randomCharacter();

  const player = {

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

    skills: character.skills,

    currentBoss: null

  };

  players[id] = player;

  saveDB();

  return player;
}

// ==============================
// LEVEL UP
// ==============================

function checkLevel(player) {

  let leveled = false;

  while (player.xp >= player.level * 100) {

    player.xp -= player.level * 100;

    player.level++;

    player.upgradePoints += 3;

    player.maxHp += 20;
    player.hp = player.maxHp;

    leveled = true;
  }

  return leveled;
}

// ==============================
// EMBED PERSONAGEM
// ==============================

function characterEmbed(player) {

  const c = characters.find(x => x.name === player.character);

  return new EmbedBuilder()
    .setTitle(`🎭 ${c.name}`)
    .setDescription(
      `**Raridade:** ${c.rarity}\n` +
      `🎯 Chance de sorteio: **${c.chance}%**\n` +
      `💠 Potencial Nen: **${c.nen}%**\n` +
      `🌀 Tipo: **${c.type}**`
    )
    .addFields(
      {
        name: "📊 Atributos",
        value:
          `❤️ Vida: **${player.hp}/${player.maxHp}**\n` +
          `⚔️ Força: **${player.strength}**\n` +
          `🛡️ Defesa: **${player.defense}**\n` +
          `⚡ Stamina: **${player.stamina}**\n` +
          `🧠 Inteligência: **${player.intelligence}**\n` +
          `💨 Velocidade: **${player.speed}**`
      },
      {
        name: "✨ Habilidades",
        value: player.skills.map(s => `• ${s}`).join("\n")
      }
    );
}

// ==============================
// PAINEL PRINCIPAL
// ==============================

function mainPanel(player) {

  return new EmbedBuilder()
    .setTitle("⚔️ HUNTER × HUNTER RPG")
    .setDescription(
      `🎭 **Personagem:** ${player.character}\n` +
      `⭐ **Raridade:** ${player.rarity}\n` +
      `🌀 **Nen:** ${player.nen}% — ${player.nenType}\n\n` +

      `📈 **Nível:** ${player.level}\n` +
      `✨ **XP:** ${player.xp}/${player.level * 100}\n` +
      `💰 **Dinheiro:** ¥${player.money}\n` +
      `🔮 **Pontos de Upgrade:** ${player.upgradePoints}`
    )
    .addFields({
      name: "📊 Status",
      value:
        `❤️ ${player.hp}/${player.maxHp} HP\n` +
        `⚔️ ${player.strength} Força\n` +
        `🛡️ ${player.defense} Defesa\n` +
        `⚡ ${player.stamina} Stamina\n` +
        `🧠 ${player.intelligence} Inteligência\n` +
        `💨 ${player.speed} Velocidade`
    });
}

// ==============================
// BOTÕES
// ==============================

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
      .setStyle(ButtonStyle.Success)

  );

}

// ==============================
// BOT
// ==============================

client.once("ready", async () => {

  console.log(`${client.user.tag} está online!`);

  const commands = [

    new SlashCommandBuilder()
      .setName("rpg")
      .setDescription("Abrir o Hunter x Hunter RPG")

  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands.map(c => c.toJSON()) }
  );

  console.log("Comando /rpg registrado.");

});

// ==============================
// INTERAÇÕES
// ==============================

client.on("interactionCreate", async interaction => {

  try {

    // ==========================
    // /RPG
    // ==========================

    if (interaction.isChatInputCommand()) {

      if (interaction.commandName === "rpg") {

        if (!players[interaction.user.id]) {

          const player = createPlayer(interaction.user.id);

          return interaction.reply({
            content: `🎲 **Seu personagem foi sorteado!**`,
            embeds: [characterEmbed(player)],
            components: [mainButtons()]
          });

        }

        const player = players[interaction.user.id];

        return interaction.reply({
          embeds: [mainPanel(player)],
          components: [mainButtons()]
        });

      }

    }

    // ==========================
    // PERSONAGEM
    // ==========================

    if (interaction.isButton() && interaction.customId === "character") {

      const player = players[interaction.user.id];

      if (!player) {
        return interaction.reply({
          content: "Use `/rpg` primeiro.",
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [characterEmbed(player)],
        ephemeral: true
      });

    }

    // ==========================
    // BOSSES
    // ==========================

    if (interaction.isButton() && interaction.customId === "bosses") {

      const player = players[interaction.user.id];

      const available = bosses.filter(
        boss => player.level >= boss.minLevel
      );

      if (!available.length) {
        return interaction.reply({
          content: "Você ainda não possui nenhum boss disponível.",
          ephemeral: true
        });
      }

      const options = available.slice(0, 25).map(boss => ({
        label: boss.name,
        description: `Nível ${boss.minLevel}+ • ${boss.hp} HP`,
        value: boss.name
      }));

      const menu = new StringSelectMenuBuilder()
        .setCustomId("boss_select")
        .setPlaceholder("Escolha um boss para enfrentar")
        .addOptions(options);

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("👹 BOSSES")
            .setDescription(
              `Seu nível: **${player.level}**\n\n` +
              `Selecione um boss para iniciar a batalha.`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(menu)
        ],
        ephemeral: true
      });

    }

    // ==========================
    // SELEÇÃO BOSS
    // ==========================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "boss_select"
    ) {

      const player = players[interaction.user.id];

      const boss = bosses.find(
        b => b.name === interaction.values[0]
      );

      if (!boss) return;

      player.currentBoss = {
        name: boss.name,
        hp: boss.hp,
        maxHp: boss.hp
      };

      saveDB();

      const battleButtons = new ActionRowBuilder().addComponents(

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

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle(`⚔️ BATALHA — ${boss.name}`)
            .setDescription(
              `👤 **${player.character}**\n` +
              `❤️ Seu HP: **${player.hp}/${player.maxHp}**\n\n` +
              `👹 **${boss.name}**\n` +
              `❤️ HP: **${boss.hp}/${boss.hp}**`
            )
        ],
        components: [battleButtons]
      });

    }

    // ==========================
    // ATAQUE
    // ==========================

    if (interaction.isButton() && interaction.customId === "attack") {

      const player = players[interaction.user.id];

      if (!player.currentBoss) {
        return interaction.reply({
          content: "Você não está em uma batalha.",
          ephemeral: true
        });
      }

      const boss = bosses.find(
        b => b.name === player.currentBoss.name
      );

      const damage = Math.floor(
        player.strength * 0.7 +
        player.nen * 0.5 +
        Math.random() * 30
      );

      player.currentBoss.hp -= damage;

      if (player.currentBoss.hp <= 0) {

        player.xp += boss.xp;
        player.money += boss.money;

        const leveled = checkLevel(player);

        player.currentBoss = null;

        saveDB();

        return interaction.update({
          embeds: [
            new EmbedBuilder()
              .setTitle("🏆 VITÓRIA!")
              .setDescription(
                `Você derrotou **${boss.name}**!\n\n` +
                `⚔️ Dano causado: **${damage}**\n` +
                `✨ XP ganho: **+${boss.xp}**\n` +
                `💰 Dinheiro: **+¥${boss.money}**` +
                (leveled
                  ? `\n\n🎉 **VOCÊ SUBIU DE NÍVEL!**`
                  : "")
              )
          ],
          components: [mainButtons()]
        });

      }

      const bossDamage = Math.floor(
        boss.attack * (0.7 + Math.random() * 0.4)
      );

      const reducedDamage = Math.max(
        1,
        bossDamage - player.defense * 0.25
      );

      player.hp -= Math.floor(reducedDamage);

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
              `👤 **${player.character}**\n` +
              `❤️ HP: **${player.hp}/${player.maxHp}**\n\n` +
              `👹 **${boss.name}**\n` +
              `❤️ HP: **${Math.max(0, player.currentBoss.hp)}/${boss.hp}**\n\n` +
              `⚔️ Você causou **${damage}** de dano.\n` +
              `💥 O boss causou **${Math.floor(reducedDamage)}** de dano.`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(

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

          )
        ]
      });

    }

    // ==========================
    // DEFENDER
    // ==========================

    if (interaction.isButton() && interaction.customId === "defend") {

      const player = players[interaction.user.id];

      if (!player.currentBoss) {
        return interaction.reply({
          content: "Você não está em uma batalha.",
          ephemeral: true
        });
      }

      const boss = bosses.find(
        b => b.name === player.currentBoss.name
      );

      const damage = Math.max(
        1,
        Math.floor(boss.attack * 0.25 - player.defense * 0.1)
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
                `O boss conseguiu derrotar você.\n\n` +
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
            .setTitle(`🛡️ DEFESA — ${boss.name}`)
            .setDescription(
              `Você se protegeu do ataque.\n\n` +
              `❤️ HP: **${player.hp}/${player.maxHp}**\n` +
              `👹 Boss: **${player.currentBoss.hp}/${boss.hp} HP**`
            )
        ],
        components: [
          new ActionRowBuilder().addComponents(

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

          )
        ]
      });

    }

    // ==========================
    // FUGIR
    // ==========================

    if (interaction.isButton() && interaction.customId === "flee") {

      const player = players[interaction.user.id];

      player.currentBoss = null;

      saveDB();

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setTitle("🏃 BATALHA ENCERRADA")
            .setDescription("Você fugiu da batalha.")
        ],
        components: [mainButtons()]
      });

    }

    // ==========================
    // UPGRADES
    // ==========================

    if (interaction.isButton() && interaction.customId === "upgrades") {

      const player = players[interaction.user.id];

      const row = new ActionRowBuilder().addComponents(

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

      );

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("📈 UPGRADES")
            .setDescription(
              `Pontos disponíveis: **${player.upgradePoints}**\n\n` +
              `❤️ Vida: ${player.maxHp}\n` +
              `⚔️ Força: ${player.strength}\n` +
              `🛡️ Defesa: ${player.defense}\n` +
              `⚡ Stamina: ${player.stamina}\n` +
              `💨 Velocidade: ${player.speed}`
            )
        ],
        components: [row],
        ephemeral: true
      });

    }

    // ==========================
    // APLICA UPGRADES
    // ==========================

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

      const player = players[interaction.user.id];

      if (player.upgradePoints <= 0) {

        return interaction.reply({
          content: "❌ Você não possui pontos de upgrade.",
          ephemeral: true
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
            .setTitle("📈 UPGRADE REALIZADO!")
            .setDescription(
              `Você melhorou **${stat}**!\n\n` +
              `⭐ Pontos restantes: **${player.upgradePoints}**`
            )
        ],
        components: []
      });

    }

    // ==========================
    // HABILIDADES
    // ==========================

    if (interaction.isButton() && interaction.customId === "skills") {

      const player = players[interaction.user.id];

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("✨ HABILIDADES")
            .setDescription(
              player.skills.length
                ? player.skills.map(s => `🔮 **${s}**`).join("\n")
                : "Você ainda não possui habilidades."
            )
        ],
        ephemeral: true
      });

    }

    // ==========================
    // HABILIDADE DURANTE BATALHA
    // ==========================

    if (interaction.isButton() && interaction.customId === "use_skill") {

      const player = players[interaction.user.id];

      if (!player.currentBoss) {

        return interaction.reply({
          content: "Você não está em uma batalha.",
          ephemeral: true
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

      return interaction.reply({
        content: "✨ **Escolha sua habilidade:**",
        components: [
          new ActionRowBuilder().addComponents(menu)
        ],
        ephemeral: true
      });

    }

    // ==========================
    // USAR HABILIDADE
    // ==========================

    if (
      interaction.isStringSelectMenu() &&
      interaction.customId === "battle_skill"
    ) {

      const player = players[interaction.user.id];

      if (!player.currentBoss) {

        return interaction.update({
          content: "❌ A batalha já terminou.",
          components: []
        });

      }

      const boss = bosses.find(
        b => b.name === player.currentBoss.name
      );

      const skill = interaction.values[0];

      const damage = Math.floor(
        player.nen * 1.5 +
        player.strength +
        Math.random() * 80
      );

      player.currentBoss.hp -= damage;

      if (player.currentBoss.hp <= 0) {

        player.xp += boss.xp;
        player.money += boss.money;

        const leveled = checkLevel(player);

        player.currentBoss = null;

        saveDB();

        return interaction.update({
          content:
            `🏆 **VITÓRIA!**\n\n` +
            `✨ Você usou **${skill}**.\n` +
            `💥 Dano: **${damage}**\n` +
            `👹 **${boss.name}** foi derrotado!\n\n` +
            `✨ XP: **+${boss.xp}**\n` +
            `💰 Dinheiro: **+¥${boss.money}**` +
            (leveled ? `\n\n🎉 **LEVEL UP!**` : ""),
          components: []
        });

      }

      saveDB();

      return interaction.update({
        content:
          `✨ **${skill}**!\n\n` +
          `💥 Dano causado: **${damage}**\n` +
          `👹 ${boss.name}: **${Math.max(
            0,
            player.currentBoss.hp
          )}/${boss.hp} HP**`,
        components: []
      });

    }

  } catch (error) {

    console.error(error);

    if (!interaction.replied && !interaction.deferred) {

      await interaction.reply({
        content: "❌ Ocorreu um erro no RPG.",
        ephemeral: true
      });

    }

  }

});

client.login(TOKEN);
