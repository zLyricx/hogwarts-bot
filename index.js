const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
              GatewayIntentBits.MessageContent
                ]
                });

                // 💰 banco simples (24h online - memória)
                const banco = {};

                // ===============================
                // 🧠 CONVERSÃO BASE (493 knuts = 1 galeão)
                // ===============================
                function paraKnuts(valor, moeda) {
                  if (moeda === "g") return valor * 493;
                    if (moeda === "s") return valor * 29;
                      if (moeda === "n") return valor;
                        return 0;
                        }

                        function formatar(knuts) {
                          let galeoes = Math.floor(knuts / 493);
                            let resto = knuts % 493;
                              let sicles = Math.floor(resto / 29);
                                let n = resto % 29;

                                  return `${galeoes}G ${sicles}S ${n}N`;
                                  }

                                  // ===============================
                                  // 🧾 CRIAR CONTA
                                  // ===============================
                                  function criarConta(id) {
                                    if (!banco[id]) {
                                        banco[id] = {
                                              knuts: 0
                                                  };
                                                    }
                                                    }

                                                    // ===============================
                                                    // 🤖 BOT ONLINE
                                                    // ===============================
                                                    client.on("ready", () => {
                                                      console.log("Bot online!");
                                                      });

                                                      // ===============================
                                                      // 💬 COMANDOS
                                                      // ===============================
                                                      client.on("messageCreate", (msg) => {
                                                        if (msg.author.bot) return;

                                                          const args = msg.content.split(" ");
                                                            const cmd = args[0];

                                                              criarConta(msg.author.id);

                                                                // 💰 saldo
                                                                  if (cmd === "!saldo") {
                                                                      msg.reply(`💰 ${formatar(banco[msg.author.id].knuts)}`);
                                                                        }

                                                                          // ➕ adicionar dinheiro
                                                                            // uso: !add 5 g | !add 10 s | !add 100 n
                                                                              if (cmd === "!add") {
                                                                                  let valor = parseInt(args[1]);
                                                                                      let moeda = args[2];

                                                                                          if (!valor || !moeda) return msg.reply("❌ Use: !add quantidade g/s/n");

                                                                                              banco[msg.author.id].knuts += paraKnuts(valor, moeda);

                                                                                                  msg.reply("💰 Dinheiro adicionado!");
                                                                                                    }

                                                                                                      // 🛒 comprar
                                                                                                        // uso: !comprar 200
                                                                                                          if (cmd === "!comprar") {
                                                                                                              let preco = parseInt(args[1]);

                                                                                                                  if (!preco) return msg.reply("❌ Use: !comprar valor em knuts");

                                                                                                                      if (banco[msg.author.id].knuts >= preco) {
                                                                                                                            banco[msg.author.id].knuts -= preco;
                                                                                                                                  msg.reply("🛒 Compra realizada!");
                                                                                                                                      } else {
                                                                                                                                            msg.reply("❌ Dinheiro insuficiente!");
                                                                                                                                                }
                                                                                                                                                  }
                                                                                                                                                  });

                                                                                                                                                  // ===============================
                                                                                                                                                  client.login(process.env.TOKEN);