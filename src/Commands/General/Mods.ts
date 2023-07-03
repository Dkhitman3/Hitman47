import { Message, Command, BaseCommand } from '../../Structures'

@Command('mods', {
    description: "Displays the bot's moderators",
    exp: 20,
    cooldown: 5,
    dm: true,
    category: 'general',
    usage: 'mods',
    aliases: ['mods', 'owner', 'moderators']
})
export default class extends BaseCommand {
    public override execute = async ({ reply }: Message): Promise<void> => {
        if (!this.client.config.mods.length) return void reply('*[UNMODERATED]*')
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/c81e4a1dd709f8e30f0ad.mp4')
        let text = `🤖 *𝐌𝐎𝐃𝐒* \n`
        for (let i = 0; i < this.client.config.mods.length; i++)
            text += `\n*#${i + 1}*\n🧧 *Username:* ${
                this.client.contact.getContact(this.client.config.mods[i]).username
            }\n🌀 *Contact: https://wa.me/+${this.client.config.mods[i].split('@')[0]}*`
        return void (await reply(buffer, 'video', true, undefined, text))
    }
}
