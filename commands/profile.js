const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const profiles = new Map(); // Base de datos temporal

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Muestra el perfil de un usuario o edita el tuyo.')
        .addUserOption(option => option.setName('usuario').setDescription('Ver el perfil de otro miembro').setRequired(false))
        .addStringOption(option => option.setName('bio').setDescription('Actualiza tu biografía').setRequired(false))
        .addStringOption(option => option.setName('redes').setDescription('Actualiza tus redes o ID de juego').setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;
        const newBio = interaction.options.getString('bio');
        const newRedes = interaction.options.getString('redes');

        let userProfile = profiles.get(targetUser.id) || { bio: 'Aún no ha configurado su biografía.', redes: 'No especificadas' };

        // Si es su propio perfil y mandó datos para actualizar
        if (interaction.user.id === targetUser.id) {
            if (newBio) userProfile.bio = newBio;
            if (newRedes) userProfile.redes = newRedes;
            profiles.set(targetUser.id, userProfile);
        }

        const member = await interaction.guild.members.fetch(targetUser.id);

        const embed = new EmbedBuilder()
            .setTitle(`Perfil de ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 512 }))
            .addFields(
                { name: '👤 Apodo en el servidor', value: member.nickname || 'Ninguno', inline: true },
                { name: '🆔 ID de Discord', value: targetUser.id, inline: true },
                { name: '📅 Cuenta creada', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: false },
                { name: '📥 Se unió al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false },
                { name: '📝 Biografía', value: userProfile.bio, inline: false },
                { name: '🎮 Redes / Gaming', value: userProfile.redes, inline: false }
            )
            .setColor(member.displayHexColor !== '#000000' ? member.displayHexColor : 'Blurple');

        await interaction.reply({ embeds: [embed] });
    }
};