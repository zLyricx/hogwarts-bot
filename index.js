const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const DB_FILE = "banco.json";
let banco = {};

// carregar dados
if (fs.existsSync(DB_FILE)) {
  banco = JSON.parse(fs.readFileSync(DB_FILE));
}

// salvar dados
function salvar() {
  fs.writeFileSync(DB_FILE, JSON.stringify(banco, null, 2));
}

// criar conta
function criarConta(id) {
  if (!banco[id]) {
    banco[id] = { galeoes: 0, sicles: 0, nuques: 0 };
  }
}

client.on("ready", () => {
  console.log("Bot online!");
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  const args = msg.content.split(" ");
  const cmd = args[0].toLowerCase();

  criarConta(msg.author.id);

  // SALDO
  if (cmd === "!saldo") {
    const u = banco[msg.author.id];
    return msg.reply(`💰 ${u.galeoes}G | ${u.sicles}S | ${u.nuques}N`);
  }

  // ADD (FUNCIONANDO)
  if (cmd === "!add") {
    let valor = parseInt(args[1]);
    let moeda = args[2];

    if (!valor || !moeda) {
      return msg.reply("❌ Use: !add 10 g/s/n");
    }

    const u = banco[msg.author.id];

    if (moeda === "g") u.galeoes += valor;
    else if (moeda === "s") u.sicles += valor;
    else if (moeda === "n") u.nuques += valor;
    else return msg.reply("❌ Moeda inválida!");

    salvar();
    return msg.reply("✅ Adicionado!");
  }

  // REMOVER
  if (cmd === "!remover") {
    let valor = parseInt(args[1]);
    let moeda = args[2];

    const u = banco[msg.author.id];

    if (!valor || !moeda) {
      return msg.reply("❌ Use: !remover 10 g/s/n");
    }

    if (moeda === "g" && u.galeoes >= valor) u.galeoes -= valor;
    else if (moeda === "s" && u.sicles >= valor) u.sicles -= valor;
    else if (moeda === "n" && u.nuques >= valor) u.nuques -= valor;
    else return msg.reply("❌ Sem dinheiro!");

    salvar();
    return msg.reply("💸 Removido!");
  }

});

client.login(process.env.TOKEN);
