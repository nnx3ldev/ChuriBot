const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// Crear una instancia del cliente con los intents necesarios
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

// Registrar el evento cuando el bot esté listo
client.once('ready', async () => {
    console.log(`¡Bot encendido con éxito como ${client.user.tag}! Churi Network activo.`);

    // Definir el comando de barra
    const commands = [
        new SlashCommandBuilder()
            .setName('queque')
            .setDescription('Que queremos?')
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Registrando comandos de barra (Slash Commands)...');
        // Registra los comandos globalmente (o puedes adaptarlos para tu servidor)
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('¡Comandos registrados correctamente!');
    } catch (error) {
        console.error(error);
    }
});

// Manejar las interacciones de los comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'queque') {
        await interaction.reply('Quiero queque');
    }
});

// Iniciar sesión en Discord usando el token secreto
client.login(process.env.DISCORD_TOKEN);