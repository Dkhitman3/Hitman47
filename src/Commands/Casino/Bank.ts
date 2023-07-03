import { BaseCommand, Command, Message } from '../../Structures'

@Command('bank', {
    description: '',
    usage: 'bank',
    category: 'casino',
    exp: 10,
    cooldown: 100
})
export default class command extends BaseCommand {
    override execute = async ({ reply, sender }: Message): Promise<void> => {
        const { bank, tag } = await this.client.DB.getUser(sender.jid)
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/8e60b91b6885644855373.mp4')
        const text = `🏦 *Bank* 🏦\n\n🧧 *Name:- ${sender.username}*\n\n  ☘️ *Id tag: #${tag}*\n\n🪙 *Gold: ${bank}*`
        return void (await reply(buffer, 'video', true, undefined, text))
    }
}
