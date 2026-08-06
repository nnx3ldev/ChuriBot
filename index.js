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
            .setDescription('Roba un emoji mediante un enlace o pegándolo directamente')
            .addStringOption(option =>
                option.setName('emoji')
                    .setDescription('Pega el link directo de la imagen o el emoji del otro servidor')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('nombre')
                    .setDescription('El nombre que tendrá el emoji (opcional)')
                    .setRequired(false))
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
        if (!interaction.member.permissions.has('ManageEmojisAndStickers')) {
            return interaction.reply({ content: '❌ No tienes permisos para gestionar emojis en este servidor.', ephemeral: true });
        }

        const input = interaction.options.getString('emoji');
        let customName = interaction.options.getString('nombre');
        let imageUrl = '';

        await interaction.deferReply({ ephemeral: true });

        try {
            // Caso 1: Si el usuario escribió o pegó un emoji de Discord (ej: <:nombre:123456789>)
            const customEmojiMatch = input.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);

            if (customEmojiMatch) {
                const animated = customEmojiMatch[1];
                const emojiName = customEmojiMatch[2];
                const emojiId = customEmojiMatch[3];
                
                // Si no puso un nombre personalizado, usamos el original del emoji
                if (!customName) customName = emojiName;

                // Construimos la URL oficial de CDN de Discord para ese emoji
                imageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${animated ? 'gif' : 'png'}?size=96`;
            } else if (input.startsWith('http://') || input.startsWith('https://')) {
                // Caso 2: Si el usuario pegó un enlace directo de internet
                imageUrl = input;
                if (!customName) {
                    return interaction.editReply('❌ Si vas a usar un enlace web directo, por favor escribe obligatoriamente un nombre para el emoji en la opción `nombre`.');
                }
            } else {
                return interaction.editReply('❌ Formato no válido. Debes pegar un emoji de otro servidor o un enlace web directo (URL) que comience con http/https.');
            }

            // Creamos el emoji en el servidor usando la URL obtenida
            const emoji = await interaction.guild.emojis.create({ 
                attachment: imageUrl, 
                name: customName 
            });

            await interaction.editReply(`✅ ¡Éxito! El emoji ${emoji} ha sido robado y agregado correctamente como \`:${customName}:\`.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Hubo un error al robar el emoji. Asegúrate de que el enlace sea una imagen válida, que el bot tenga permisos o que el servidor no esté lleno.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);