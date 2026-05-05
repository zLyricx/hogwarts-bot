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

// carregar banco
let banco = {};
if (fs.existsSync(DB_FILE)) {
  banco = JSON.parse(fs.readFileSync(DB_FILE));
}

// salvar banco
function salvar() {
  fs.writeFileSync(DB_FILE, JSON.stringify(banco, null, 2));
}

// criar conta
function criarConta(id) {
  if (!banco[id]) {
    banco[id] = {
      galeoes: 0,
      sicles: 0,
      nuques: 0
    };
  }
}

// converter tudo pra nuques
function totalNuques(u) {
  return (u.galeoes * 17 * 29) + (u.sicles * 29) + u.nuques;
}

// converter de volta
function converter(total) {
  let g = Math.floor(total / (17 * 29));
  let resto = total % (17 * 29);

  let s = Math.floor(resto / 29);
  let n = resto % 29;

  return { g, s, n };
}

client.on("ready", () => {
  console.log("Bot online!");
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) return;

  const args = msg.content.split(" ");
  const cmd = args[0];

  criarConta(msg.author.id);

  // 💰 SALDO
  if (cmd === "!saldo") {
    const u = banco[msg.author.id];
    return msg.reply(`💰 ${u.galeoes}G | ${u.sicles}S | ${u.nuques}N`);
  }

  // ➕ DAR DINHEIRO (livre)
  if (cmd === "!dar") {
    let user = msg.mentions.users.first();
    let valor = parseInt(args[2]);
    let moeda = args[3];

    if (!user || !valor || !moeda) {
      return msg.reply("❌ Use: !dar @usuario 10 g/s/n");
    }

    criarConta(user.id);

    if (moeda === "g") banco[user.id].galeoes += valor;
    if (moeda === "s") banco[user.id].sicles += valor;
    if (moeda === "n") banco[user.id].nuques += valor;

    salvar();
    return msg.reply(`💸 ${valor}${moeda.toUpperCase()} enviado para ${user.username}`);
  }

  // 🔁 TRANSFERIR (tira de você e dá pro outro)
  if (cmd === "!transferir") {
    let user = msg.mentions.users.first();
    let valor = parseInt(args[2]);
    let moeda = args[3];

    if (!user || !valor || !moeda) {
      return msg.reply("❌ Use: !transferir @usuario 10 g/s/n");
    }

    const u1 = banco[msg.author.id];
    criarConta(user.id);
    const u2 = banco[user.id];

    if (moeda === "g" && u1.galeoes >= valor) {
      u1.galeoes -= valor;
      u2.galeoes += valor;
    } else if (moeda === "s" && u1.sicles >= valor) {
      u1.sicles -= valor;
      u2.sicles += valor;
    } else if (moeda === "n" && u1.nuques >= valor) {
      u1.nuques -= valor;
      u2.nuques += valor;
    } else {
      return msg.reply("❌ Você não tem esse valor.");
    }

    salvar();
    return msg.reply(`🔁 Transferido ${valor}${moeda.toUpperCase()} para ${user.username}`);
  }

  // ➖ REMOVER
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
    else return msg.reply("❌ Você não tem esse valor.");

    salvar();
    return msg.reply("💸 Removido!");
  }

  // 🛒 COMPRAR
  if (cmd === "!comprar") {
    let preco = parseInt(args[1]);

    if (!preco) return msg.reply("❌ Use: !comprar 100");

    const u = banco[msg.author.id];
    let total = totalNuques(u);

    if (total < preco) {
      return msg.reply("❌ Dinheiro insuficiente!");
    }

    total -= preco;

    let novo = converter(total);

    u.galeoes = novo.g;
    u.sicles = novo.s;
    u.nuques = novo.n;

    salvar();
    return msg.reply("🛒 Compra realizada!");
  }

});

client.login(process.env.TOKEN);
