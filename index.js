const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
              GatewayIntentBits.MessageContent
                ]
                });

                const banco = {};

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
                                const cmd = args[0];

                                  criarConta(msg.author.id);

                                    // 💰 VER SALDO
                                      if (cmd === "!saldo") {
                                          let user = banco[msg.author.id];
                                              msg.reply(`💰 ${user.galeoes}G ${user.sicles}S ${user.nuques}N`);
                                                }

                                                  // ➕ ADICIONAR DINHEIRO
                                                    if (cmd === "!add") {
                                                        let tipo = args[1];
                                                            let valor = parseInt(args[2]);

                                                                if (!["g", "s", "n"].includes(tipo)) {
                                                                      return msg.reply("Use: !add g/s/n valor");
                                                                          }

                                                                              if (isNaN(valor)) return msg.reply("Valor inválido");

                                                                                  if (tipo === "g") banco[msg.author.id].galeoes += valor;
                                                                                      if (tipo === "s") banco[msg.author.id].sicles += valor;
                                                                                          if (tipo === "n") banco[msg.author.id].nuques += valor;

                                                                                              msg.reply("💰 Dinheiro adicionado!");
                                                                                                }

                                                                                                  // 🛒 COMPRAR
                                                                                                    if (cmd === "!comprar") {
                                                                                                        let tipo = args[1];
                                                                                                            let valor = parseInt(args[2]);

                                                                                                                let user = banco[msg.author.id];

                                                                                                                    if (!["g", "s", "n"].includes(tipo)) {
                                                                                                                          return msg.reply("Use: !comprar g/s/n valor");
                                                                                                                              }

                                                                                                                                  if (isNaN(valor)) return msg.reply("Valor inválido");

                                                                                                                                      if (tipo === "g" && user.galeoes >= valor) {
                                                                                                                                            user.galeoes -= valor;
                                                                                                                                                } else if (tipo === "s" && user.sicles >= valor) {
                                                                                                                                                      user.sicles -= valor;
                                                                                                                                                          } else if (tipo === "n" && user.nuques >= valor) {
                                                                                                                                                                user.nuques -= valor;
                                                                                                                                                                    } else {
                                                                                                                                                                          return msg.reply("❌ Dinheiro insuficiente!");
                                                                                                                                                                              }

                                                                                                                                                                                  msg.reply("🛒 Compra realizada!");
                                                                                                                                                                                    }
                                                                                                                                                                                    });

                                                                                                                                                                                    client.login(process.env.TOKEN);