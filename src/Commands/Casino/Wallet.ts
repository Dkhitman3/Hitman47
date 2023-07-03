import { BaseCommand, Command, Message } from '../../Structures'

@Command('wallet', {
    description: '',
    usage: 'wallet',
    category: 'casino',
    exp: 10,
    cooldown: 100
})
export default class command extends BaseCommand {
    override execute = async ({ reply, sender }: Message): Promise<void> => {
        const { wallet, tag } = await this.client.DB.getUser(sender.jid)
        const buffer = await this.client.utils.getBuffer('https://telegra.ph/file/251b371b7d756a1e60765.mp4')
        const text = `👛 *Wallet* 👛\n\n🧧 *Name:- ${sender.username}*\n\n  ☘️ *Id tag: #${tag}*\n\n💵 *gold: ${wallet}*`
        return void (await reply(buffer, 'video', true, undefined, text))
    }
}
