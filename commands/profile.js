const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Simulación de Base de Datos en memoria (Usa MongoDB o Firebase en producción)
const profiles = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Muestra o edita tu perfil social en el servidor.')
        .addUserOption(option => option.setName('usuario').setDescription('Ver perfil de otro usuario'))
        .addStringOption(option => option.setName('bio').setDescription('Establece tu biografía'))
        .addStringOption(option => option.setName('redes').setDescription('Tus enlaces o redes sociales')),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;
        const newBio = interaction.options.getString('bio');
        const newRedes = interaction.options.getString('redes');

        let userProfile = profiles.get(targetUser.id) || { bio: 'No configurada', redes: 'Ninguna' };

        if (interaction.user.id === targetUser.id) {
            if (newBio) userProfile.bio = newBio;
            if (newRedes) userProfile.redes = newRedes;
            profiles.set(targetUser.id, userProfile);
        }

        const member = await interaction.guild.members.fetch(targetUser.id);
        const embed = new EmbedBuilder()
            .setTitle(`Perfil de ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'Apodo', value: member.nickname || 'Ninguno', inline: true },
                { name: 'Creado el', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Se unió el', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Biografía', value: userProfile.bio },
                { name: 'Redes / Gaming', value: userProfile.redes }
            )
            .setColor('Random');

        await interaction.reply({ embeds: [embed] });
    }
};