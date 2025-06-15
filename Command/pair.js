const { sleep } = require('../lib/myfunc');

async function pairCommand(sock, chatId, message, q) {
    try {
        if (!q) {
            return await sock.sendMessage(chatId, {
                text: "Please provide a valid WhatsApp number\nExample: .pair 91702395XXXX",
            });
        }

        const numbers = q.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 5 && v.length < 20);

        if (numbers.length === 0) {
            return await sock.sendMessage(chatId, {
                text: "Invalid number❌️ Please use the correct format!",
            });
        }

        // Example pairing logic
        for (const number of numbers) {
            const response = await axios.get(`https://knight-bot-paircode.onrender.com/code?number=${number}`);
            if (response.data && response.data.code) {
                const code = response.data.code;
                await sock.sendMessage(chatId, {
                    text: `Your pairing code: ${code}`,
                });
            } else {
                throw new Error('Invalid response from server');
            }
        }
    } catch (error) {
        console.error('Error pairing number:', error);
        await sock.sendMessage(chatId, {
            text: "Failed to generate pairing code. Please try again later.",
        });
    }
}

module.exports = pairCommand;
