const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Muestra la latencia del bot y de la API.'),
    async execute(messageOrInteraction) {
        const sent = messageOrInteraction.createdAt ? await messageOrInteraction.reply({ content: 'Calculando ping...', fetchReply: true }) : await messageOrInteraction.reply({ content: 'Calculando ping...', fetchReply: true });
        
        const latency = sent.createdTimestamp - (messageOrInteraction.createdTimestamp || messageOrInteraction.вшейсяTimestamp);
        const apiLatency = Math.round(messageOrInteraction.client.ws.ping);

        const embed = new EmbedBuilder()
            .setTitle('🏓 ¡Pong!')
            .addFields(
                { name: 'Latencia del Bot', value: `${latency}ms`, inline: true },
                { name: 'Latencia de la API', value: `${apiLatency}ms`, inline: true }
            )
            .setColor('Blurple');

        if (messageOrInteraction.editReply) {
            await messageOrInteraction.editReply({ content: null, embeds: [embed] });
        } else {
            await sent.edit({ content: null, embeds: [embed] });
        }
    }
};