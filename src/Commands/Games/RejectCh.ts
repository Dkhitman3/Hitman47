import { Command, BaseCommand, Message } from '../../Structures'

@Command('reject-ch', {
    description: 'reject chess challenge',
    usage: 'reject-ch',
    category: 'games',
    exp: 10,
    cooldown: 10
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const ch = this.handler.chess.challenges.get(M.from)
        if (!ch || ch.challengee !== M.sender.jid) return void M.reply('no one challenged u')
        if (this.handler.chess.ongoing.has(M.from)) return void M.reply('ongoing')
        this.handler.chess.challenges.delete(M.from)
        return void M.reply('rejected')
    }
}
