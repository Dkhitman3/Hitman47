import { BaseCommand, Command, Message } from '../../Structures'

@Command('leave', {
    description: 'Bot leaves the group',
    category: 'dev',
    usage: 'leave',
    cooldown: 5,
    dm: false
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const bye = [`*Goodbye* 👋`, 'Peace out', 'goodbye', 'I’ve got to get going', 'I must be going']
        const rand = this.client.utils.getRandomInt(1, bye.length - 1)
        await M.reply(bye[rand])
        const jid = M.from
        await this.client.groupLeave(jid)
    }
 }
