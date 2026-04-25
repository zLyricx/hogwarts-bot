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
                  if (!banco[id]) banco[id] = { nuques: 0 };
                  }

                  function converter(nuques) {
                    let galeoes = Math.floor(nuques / (17 * 29));
                      let resto = nuques % (17 * 29);
                        let sicles = Math.floor(resto / 29);
                          let n = resto % 29;

                            return `${galeoes}G ${sicles}S ${n}N`;
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
                                            msg.reply(`💰 ${converter(banco[msg.author.id].nuques)}`);
                                              }

                                                if (cmd === "!add") {
                                                    let valor = parseInt(args[1]);
                                                        banco[msg.author.id].nuques += valor;
                                                            msg.reply("💰 Dinheiro adicionado!");
                                                              }

                                                                if (cmd === "!comprar") {
                                                                    let preco = parseInt(args[1]);

                                                                        if (banco[msg.author.id].nuques >= preco) {
                                                                              banco[msg.author.id].nuques -= preco;
                                                                                    msg.reply("🛒 Compra realizada!");
                                                                                        } else {
                                                                                              msg.reply("❌ Dinheiro insuficiente!");
                                                                                                  }
                                                                                                    }
                                                                                                    });

                                                                                                    client.login(process.env.TOKEN);