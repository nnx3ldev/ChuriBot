const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');
require('dotenv').config();

// Servidor web con Express para que Render detecte tráfico y no duerma el bot
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Churi Network Bot está activo y funcionando 24/7!');
});

app.listen(PORT, () => {
    console.log(`Servidor web interno corriendo en el puerto ${PORT}`);
});

// Configuración del Cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers
    ]
});

client.once('ready', async () => {
    console.log(`¡Bot encendido con éxito como ${client.user.tag}! Churi Network activo.`);

    const commands = [
        new SlashCommandBuilder()
            .setName('quiero')
            .setDescription('que quieres'),
        new SlashCommandBuilder()
            .setName('robar')
            .setDescription('Sube un emoji nuevo al servidor mediante una imagen')
            .addAttachmentOption(option =>
                option.setName('imagen')
                    .setDescription('La imagen del emoji (PNG, JPG o GIF)')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('El nombre que tendrá el emoji')
                    .setRequired(true))
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Registrando comandos de barra...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('¡Comandos registrados correctamente!');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'quiero') {
        await interaction.reply('queque');
    }
    if (interaction.commandName === 'robar') {
        // Verificamos si el usuario tiene permisos para gestionar emojis
        if (!interaction.member.permissions.has('ManageEmojisAndStickers')) {
            return interaction.reply({ content: '❌ No tienes permisos para gestionar emojis en este servidor.', ephemeral: true });
        }

        const imagen = interaction.options.getAttachment('imagen');
        const nombre = interaction.options.getString('nombre');

        await interaction.deferReply({ ephemeral: true });

        try {
            // Creamos el emoji en el servidor usando la URL de la imagen adjunta
            const emoji = await interaction.guild.emojis.create({ 
                attachment: imagen.url, 
                name: nombre 
            });

            await interaction.editReply(`✅ ¡Éxito! El emoji ${emoji} ha sido agregado correctamente como \`:${nombre}:\`.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Hubo un error al intentar subir el emoji. Asegúrate de que la imagen sea válida y que el servidor tenga espacio.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);