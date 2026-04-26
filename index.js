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

                                    if (cmd === "!saldo") {
                                        let u = banco[msg.author.id];
                                            msg.reply(`💰 ${u.galeoes}G ${u.sicles}S ${u.nuques}N`);
                                              }

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

                                                                                          msg.reply("💰 Adicionado!");
                                                                                            }

                                                                                              if (cmd === "!comprar") {
                                                                                                  let tipo = args[1];
                                                                                                      let valor = parseInt(args[2]);

                                                                                                          let u = banco[msg.author.id];

                                                                                                              if (tipo === "g" && u.galeoes >= valor) u.galeoes -= valor;
                                                                                                                  else if (tipo === "s" && u.sicles >= valor) u.sicles -= valor;
                                                                                                                      else if (tipo === "n" && u.nuques >= valor) u.nuques -= valor;
                                                                                                                          else return msg.reply("❌ Sem dinheiro!");

                                                                                                                              msg.reply("🛒 Compra feita!");
                                                                                                                                }
                                                                                                                                });

                                                                                                                                client.login(process.env.TOKEN);