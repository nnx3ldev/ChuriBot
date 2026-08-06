const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const express = require('express');

// Configuración del servidor web para mantener el bot activo 24/7
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('¡Churi Network está activo y funcionando 24/7!');
});

app.listen(PORT, () => {
    console.log(`Servidor web interno corriendo en el puerto ${PORT}`);
});

// Configuración del Cliente de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', async () => {
    console.log(`¡Bot encendido con éxito como ${client.user.tag}! Churi Network activo.`);

    // Definición de los 20 comandos de barra (Slash Commands)
    const commands = [
        new SlashCommandBuilder().setName('quiero').setDescription('que quieres'),
        new SlashCommandBuilder()
            .setName('robar')
            .setDescription('Roba un emoji mediante un enlace o pegándolo directamente')
            .addStringOption(option => option.setName('emoji').setDescription('Pega el link de la imagen o el emoji del otro servidor').setRequired(true))
            .addStringOption(option => option.setName('nombre').setDescription('El nombre que tendrá el emoji (opcional)').setRequired(false)),
        new SlashCommandBuilder()
            .setName('perfil')
            .setDescription('Muestra la información y fecha de ingreso de un usuario')
            .addUserOption(option => option.setName('usuario').setDescription('El usuario del que quieres ver la información').setRequired(false)),
        new SlashCommandBuilder()
            .setName('limpiar')
            .setDescription('Borra una cantidad específica de mensajes de un canal')
            .addIntegerOption(option => option.setName('cantidad').setDescription('Número de mensajes a borrar (1 a 100)').setRequired(true).setMinValue(1).setMaxValue(100)),
        new SlashCommandBuilder().setName('ping').setDescription('Muestra la latencia actual del bot y de la API de Discord'),
        new SlashCommandBuilder().setName('servidor').setDescription('Muestra información detallada del servidor actual'),
        new SlashCommandBuilder().setName('dado').setDescription('Lanza un dado de 6 caras aleatoriamente'),
        new SlashCommandBuilder().setName('moneda').setDescription('Lanza una moneda: ¿Cara o Cruz?'),
        new SlashCommandBuilder()
            .setName('decir')
            .setDescription('Hace que el bot repita el mensaje que escribas')
            .addStringOption(option => option.setName('mensaje').setDescription('Lo que quieres que diga el bot').setRequired(true)),
        new SlashCommandBuilder()
            .setName('encuesta')
            .setDescription('Crea una encuesta rápida con reacciones automáticas')
            .addStringOption(option => option.setName('pregunta').setDescription('Pregunta de la encuesta').setRequired(true)),
        new SlashCommandBuilder()
            .setName('kick')
            .setDescription('Expulsa a un miembro del servidor')
            .addUserOption(option => option.setName('usuario').setDescription('Usuario a expulsar').setRequired(true))
            .addStringOption(option => option.setName('razon').setDescription('Razón de la expulsión').setRequired(false)),
        new SlashCommandBuilder()
            .setName('ban')
            .setDescription('Banea a un miembro del servidor')
            .addUserOption(option => option.setName('usuario').setDescription('Usuario a banear').setRequired(true))
            .addStringOption(option => option.setName('razon').setDescription('Razón del baneo').setRequired(false)),
        new SlashCommandBuilder()
            .setName('timeout')
            .setDescription('Silencia temporalmente a un usuario (Timeout)')
            .addUserOption(option => option.setName('usuario').setDescription('Usuario a silenciar').setRequired(true))
            .addIntegerOption(option => option.setName('minutos').setDescription('Minutos de silencio').setRequired(true))
            .addStringOption(option => option.setName('razon').setDescription('Razón del silencio').setRequired(false)),
        new SlashCommandBuilder().setName('avatar').setDescription('Muestra la foto de perfil en grande de un usuario').addUserOption(option => option.setName('usuario').setDescription('Usuario del que quieres el avatar').setRequired(false)),
        new SlashCommandBuilder().setName('soporte').setDescription('Muestra enlaces y contactos de ayuda de Churi Network'),
        new SlashCommandBuilder().setName('reglas').setDescription('Muestra el panel oficial de normas del servidor'),
        new SlashCommandBuilder().setName('roles').setDescription('Muestra la cantidad de roles y miembros actuales'),
        new SlashCommandBuilder().setName('invitacion').setDescription('Genera un enlace de invitación permanente del bot'),
        new SlashCommandBuilder().setName('tiempo').setDescription('Muestra el tiempo activo ininterrumpido (Uptime) del bot'),
        new SlashCommandBuilder().setName('version').setDescription('Muestra la versión actual de desarrollo de ChuriBot')
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

// Manejador de Interacciones para los 20 comandos
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'quiero') {
        await interaction.reply('que quieres');
    }

    else if (commandName === 'robar') {
        if (!interaction.member.permissions.has('ManageEmojisAndStickers')) {
            return interaction.reply({ content: '❌ No tienes permisos para gestionar emojis en este servidor.', ephemeral: true });
        }

        const input = interaction.options.getString('emoji');
        let customName = interaction.options.getString('nombre');
        let imageUrl = '';

        await interaction.deferReply({ ephemeral: true });

        try {
            const customEmojiMatch = input.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/);

            if (customEmojiMatch) {
                const animated = customEmojiMatch[1];
                const emojiName = customEmojiMatch[2];
                const emojiId = customEmojiMatch[3];
                
                if (!customName) customName = emojiName;
                imageUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${animated ? 'gif' : 'png'}?size=96`;
            } else if (input.startsWith('http://') || input.startsWith('https://')) {
                imageUrl = input;
                if (!customName) {
                    return interaction.editReply('❌ Si vas a usar un enlace web directo, por favor escribe obligatoriamente un nombre para el emoji.');
                }
            } else {
                return interaction.editReply('❌ Formato no válido. Debes pegar un emoji de otro servidor o un enlace web directo (http/https).');
            }

            const emoji = await interaction.guild.emojis.create({ attachment: imageUrl, name: customName });
            await interaction.editReply(`✅ ¡Éxito! El emoji ${emoji} ha sido robado y agregado como \`:${customName}:\`.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Hubo un error al robar el emoji. Revisa que el enlace sea válido y que el servidor tenga espacio.');
        }
    }

    else if (commandName === 'perfil') {
        const miembro = interaction.options.getMember('usuario') || interaction.member;
        const usuario = miembro.user;

        const embed = {
            color: 0x5865F2,
            title: `👤 Perfil de ${usuario.username}`,
            thumbnail: { url: usuario.displayAvatarURL({ dynamic: true, size: 512 }) },
            fields: [
                { name: '🆔 ID de Usuario', value: `\`${usuario.id}\``, inline: true },
                { name: '📅 Creación de cuenta', value: `<t:${Math.floor(usuario.createdTimestamp / 1000)}:R>`, inline: true },
                { name: '📥 Ingreso al servidor', value: miembro.joinedTimestamp ? `<t:${Math.floor(miembro.joinedTimestamp / 1000)}:R>` : 'Desconocido', inline: true }
            ],
            footer: { text: `Solicitado por ${interaction.user.tag}` }
        };

        await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'limpiar') {
        if (!interaction.member.permissions.has('ManageMessages')) {
            return interaction.reply({ content: '❌ No tienes permisos para gestionar mensajes.', ephemeral: true });
        }

        const cantidad = interaction.options.getInteger('cantidad');
        await interaction.deferReply({ ephemeral: true });

        try {
            const mensajesBorrados = await interaction.channel.bulkDelete(cantidad, true);
            await interaction.editReply(`🧹 Se han eliminado **${mensajesBorrados.size}** mensajes correctamente.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('❌ Error al borrar mensajes (recuerda que los mensajes de más de 14 días no se pueden borrar en masa).');
        }
    }

    else if (commandName === 'ping') {
        const ping = Math.round(client.ws.ping);
        await interaction.reply(`🏓 ¡Pong! La latencia de la API de Discord es de **${ping}ms**.`);
    }

    else if (commandName === 'servidor') {
        const { guild } = interaction;
        const embed = {
            color: 0x5865F2,
            title: `📊 Información de ${guild.name}`,
            thumbnail: { url: guild.iconURL({ dynamic: true }) },
            fields: [
                { name: '👑 Propietario', value: `<@${guild.ownerId}>`, inline: true },
                { name: '👥 Miembros', value: `${guild.memberCount}`, inline: true },
                { name: '📅 Creado el', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: false }
            ]
        };
        await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'dado') {
        const resultado = Math.floor(Math.random() * 6) + 1;
        await interaction.reply(`🎲 Has lanzado el dado y ha salido: **${resultado}**`);
    }

    else if (commandName === 'moneda') {
        const resultado = Math.random() < 0.5 ? '🪙 Cara' : '🪙 Cruz';
        await interaction.reply(`El resultado del lanzamiento es: **${resultado}**`);
    }

    else if (commandName === 'decir') {
        const texto = interaction.options.getString('mensaje');
        await interaction.reply({ content: texto });
    }

    else if (commandName === 'encuesta') {
        const pregunta = interaction.options.getString('pregunta');
        const mensaje = await interaction.reply({ content: `📊 **Encuesta:** ${pregunta}\n*Reacciona abajo:*`, fetchReply: true });
        await mensaje.react('👍');
        await mensaje.react('👎');
    }

    else if (commandName === 'kick') {
        if (!interaction.member.permissions.has('KickMembers')) {
            return interaction.reply({ content: '❌ No tienes permisos para expulsar miembros.', ephemeral: true });
        }
        const miembro = interaction.options.getMember('usuario');
        const razon = interaction.options.getString('razon') || 'Sin razón especificada';
        
        if (!miembro.kickable) return interaction.reply({ content: '❌ No puedo expulsar a este usuario.', ephemeral: true });

        await miembro.kick(razon);
        await interaction.reply(`✅ El usuario **${miembro.user.tag}** ha sido expulsado. Razón: ${razon}`);
    }

    else if (commandName === 'ban') {
        if (!interaction.member.permissions.has('BanMembers')) {
            return interaction.reply({ content: '❌ No tienes permisos para banear miembros.', ephemeral: true });
        }
        const miembro = interaction.options.getMember('usuario');
        const razon = interaction.options.getString('razon') || 'Sin razón especificada';

        if (!miembro.bannable) return interaction.reply({ content: '❌ No puedo banear a este usuario.', ephemeral: true });

        await miembro.ban({ reason: razon });
        await interaction.reply(`🔨 El usuario **${miembro.user.tag}** ha sido baneado. Razón: ${razon}`);
    }

    else if (commandName === 'timeout') {
        if (!interaction.member.permissions.has('ModerateMembers')) {
            return interaction.reply({ content: '❌ No tienes permisos para silenciar miembros.', ephemeral: true });
        }
        const miembro = interaction.options.getMember('usuario');
        const minutos = interaction.options.getInteger('minutos');
        const razon = interaction.options.getString('razon') || 'Sin razón';

        await miembro.timeout(minutos * 60 * 1000, razon);
        await interaction.reply(`🔇 **${miembro.user.tag}** ha sido silenciado por ${minutos} minuto(s). Razón: ${razon}`);
    }

    else if (commandName === 'avatar') {
        const usuario = interaction.options.getUser('usuario') || interaction.user;
        const embed = {
            color: 0x5865F2,
            title: `🖼️ Avatar de ${usuario.username}`,
            image: { url: usuario.displayAvatarURL({ dynamic: true, size: 1024 }) }
        };
        await interaction.reply({ embeds: [embed] });
    }

    else if (commandName === 'soporte') {
        await interaction.reply({ content: '🛠️ Si necesitas ayuda con **Churi Network**, contacta al staff del servidor o revisa los canales principales.', ephemeral: true });
    }

    else if (commandName === 'reglas') {
        await interaction.reply({ content: '📜 **Normas de Churi Network:**\n1. Respeto mutuo.\n2. No Spam.\n3. Mantener los canales en su respectiva categoría.' });
    }

    else if (commandName === 'roles') {
        await interaction.reply(`🏷️ El servidor cuenta con **${interaction.guild.roles.cache.size}** roles creados y **${interaction.guild.memberCount}** usuarios totales.`);
    }

    else if (commandName === 'invitacion') {
        await interaction.reply({ content: '🔗 ¡Usa el panel de integraciones de Discord para invitar al bot a otros servidores!', ephemeral: true });
    }

    else if (commandName === 'tiempo') {
        const segundos = Math.floor(client.uptime / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        await interaction.reply(`⏱️ El bot lleva activo: **${horas} horas, ${minutos % 60} minutos y ${segundos % 60} segundos**.`);
    }

    else if (commandName === 'version') {
        await interaction.reply({ content: '🚀 **ChuriBot** - Versión 2.0 (Optimizado para Render 24/7).', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);