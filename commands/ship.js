const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('Calcula el porcentaje de compatibilidad amorosa o de dúo entre dos usuarios.')
        .addUserOption(option => option.setName('usuario1').setDescription('Primer usuario').setRequired(true))
        .addUserOption(option => option.setName('usuario2').setDescription('Segundo usuario').setRequired(true)),
    async execute(interaction) {
        const user1 = interaction.options.getUser('usuario1');
        const user2 = interaction.options.getUser('usuario2');

        // Generar un porcentaje pseudoaleatorio basado en sus IDs para que sea constante
        const percentage = Math.abs(parseInt(user1.id) + parseInt(user2.id)) % 101;
        
        let description = '💖 ¡Hacen una pareja increíble!';
        if (percentage < 40) description = '💔 Sus caminos difícilmente se cruzarán en ranked...';
        else if (percentage > 80) description = '🔥 ¡Dúo dinámico imparable! Cuidado con el 1v9.';

        const embed = new EmbedBuilder()
            .setTitle('💘 Medidor de Ship / Dúo')
            .setDescription(`**${user1.username}** ❤️ **${user2.username}**\n\nCompatibilidad: **${percentage}%**\n${description}`)
            .setColor('FF69B4');

        await interaction.reply({ embeds: [embed] });
    }
};