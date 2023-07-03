import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'

@Command('answer', {
    description: 'Answers the ongoing quiz question',
    aliases: ['ans', 'a'],
    category: 'games',
    exp: 15,
    cooldown: 10,
    usage: 'answer [option_number]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!this.handler.quiz.board.has(M.from)) return void M.reply('There are no quiz going on at the moment, Baka!')
        if (!this.handler.quiz.game.has(M.from) && this.handler.quiz.board.has(M.from))
            return void M.reply('Wait a few seconds. Another question is on the way')
        const players = this.handler.quiz.board.get(M.from)?.players as {
            jid: string
            points: number
        }[]
        const data = this.handler.quiz.answered.get(M.from)?.players as string[]
        if (data.includes(M.sender.jid))
            return void M.reply('You have recently attempted to answer this question. Give it a break')
        if (!context) return void M.reply('Provide the option number of the answer, Baka!')
        const option = parseInt(context.split(' ')[0])
        if (isNaN(option)) return void M.reply('The option should be a number, Baka!')
        if (option > 4) return void M.reply('*Invalid option*')
        let arr:
            | string[]
            | {
                  jid: string
                  points: number
              }[] = []
        let Arr = []
        const Data = this.handler.quiz.game.get(M.from) as {
            answer: string
            options: string[]
        }
        if (Data.options[option - 1] !== Data.answer) {
            const t = this.handler.quiz.answered.get(M.from)
            arr = t?.players as string[]
            arr.push(M.sender.jid)
            Arr = players
            const data = {
                jid: M.sender.jid,
                points: 0
            }
            if (Arr.findIndex((x) => x.jid === M.sender.jid) === -1) Arr.push(data)
            this.handler.quiz.board.set(M.from, { players: Arr })
            this.handler.quiz.answered.set(M.from, { players: arr })
            return void M.reply('Wrong guess!')
        } else {
            this.handler.quiz.game.delete(M.from)
            arr = players
            const index = arr.findIndex((x) => x.jid === M.sender.jid)
            if (index !== -1) {
                arr[index].points += 10
                this.handler.quiz.board.set(M.from, { players: arr })
            } else {
                const data = {
                    jid: M.sender.jid,
                    points: 10
                }
                arr.push(data)
                this.handler.quiz.board.set(M.from, { players: arr })
                this.handler.quiz.game.delete(M.from)
            }
            return void M.reply('🎉 Correct Answer. 🎉')
        }
    }
}
