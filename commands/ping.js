const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Mide el retraso de respuesta (latencia) del bot.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Calculando retraso de red...', fetchReply: true });
        
        const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('🏓 Estado de Conexión')
            .addFields(
                { name: 'Retraso de Ida y Vuelta', value: `${roundtripLatency}ms`, inline: true },
                { name: 'Retraso del WebSocket', value: `${wsLatency}ms`, inline: true }
            )
            .setColor(wsLatency < 150 ? 'Green' : 'Yellow');

        await interaction.editReply({ content: null, embeds: [embed] });
    }
};