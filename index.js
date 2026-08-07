const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
    ]
});

client.commands = new Collection();
client.prefix = "nn!"; // Prefijo por defecto para los comandos de texto

// Carga dinámica de comandos
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const restCommands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        restCommands.push(command.data.toJSON());
    }
}

client.once('ready', async () => {
    console.log(`¡Bot encendido con éxito como ${client.user.tag}!`);
    
    // Registro automático de Slash Commands
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        console.log('Registrando Slash Commands (/) en los servidores...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: restCommands },
        );
        console.log('¡Slash Commands registrados correctamente!');
    } catch (error) {
        console.error(error);
    }
});

// Manejador híbrido (Slash y Prefijo)
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '¡Hubo un error al ejecutar este comando!', ephemeral: true });
    }
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith(client.prefix)) return;

    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        // Adaptador simple para que el comando por prefijo funcione con la misma lógica
        await command.execute(message, client, args);
    } catch (error) {
        console.error(error);
        message.reply('¡Hubo un error al ejecutar este comando por prefijo!');
    }
});

client.login(process.env.DISCORD_TOKEN);