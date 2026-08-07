const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('Muestra información detallada de un usuario.')
        .addUserOption(option => option.setName('usuario').setDescription('Elige un usuario').setRequired(false)),
    async execute(interaction) {
        const targetUser = interaction.options.getUser('usuario') || interaction.user;
        const member = await interaction.guild.members.fetch(targetUser.id);

        const embed = new EmbedBuilder()
            .setTitle(`Información de ${targetUser.tag}`)
            .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'ID', value: targetUser.id, inline: true },
                { name: 'Apodo', value: member.nickname || 'Ninguno', inline: true },
                { name: 'Cuenta creada', value: `<t:${Math.floor(targetUser.createdTimestamp / 1000)}:R>`, inline: false },
                { name: 'Se unió al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: false }
            )
            .setColor('Random');

        await interaction.reply({ embeds: [embed] });
    }
};