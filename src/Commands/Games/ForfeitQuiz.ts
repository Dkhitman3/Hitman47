import { BaseCommand, Command, Message } from '../../Structures'

@Command('forfeit-quiz', {
    description: 'Forfeits the ongoing quiz',
    aliases: ['ff-quiz', 'ff'],
    category: 'games',
    exp: 20,
    cooldown: 15,
    usage: 'forfeit-quiz'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!this.handler.quiz.board.has(M.from)) return void M.reply('No quiz are going on right now, Baka!')
        const ff = this.handler.quiz.forfeitable.get(M.from)
        if (!ff) return void M.reply('*The game has just started. You can forfeit when the next question comes*')
        const id = this.handler.quiz.timer.get(M.from)?.id as NodeJS.Timer
        clearInterval(id)
        const players = this.handler.quiz.board.get(M.from)?.players as {
            jid: string
            points: number
        }[]
        this.handler.quiz.game.delete(M.from)
        this.handler.quiz.board.delete(M.from)
        this.handler.quiz.timer.delete(M.from)
        this.handler.quiz.answered.delete(M.from)
        let Text = `🎡 *Quiz Points*\n`
        players.sort((a, b) => b.points - a.points)
        const length = players.length as number
        if (length > 0 && (players[0].points as number) > 0) {
            await this.client.DB.setExp(players[0].jid as string, (players[0].points as number) * 3)
            await this.client.DB.updateUser(players[0].jid as string, 'quizWins', 'inc', 1)
            for (let i = 0; i < length; i++)
                Text += `\n*#${i + 1} @${players[i].jid.split('@')[0]}* - *${players[i].points}*`
            Text += `\n\n🎉 *@${players[0].jid.split('@')[0]}* won this one 🎉`
            return void (await this.client.sendMessage(M.from, {
                text: Text,
                mentions: players.map((player) => player.jid)
            }))
        }
    }
}
