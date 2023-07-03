import { IQuiz, Quiz } from 'anime-quiz'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('start-quiz', {
    description: 'Starts a quiz in the group',
    category: 'games',
    exp: 10,
    cooldown: 120,
    aliases: ['quiz'],
    usage: 'start-quiz [number of quizzes]'
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (
            this.handler.quiz.game.has(M.from) ||
            this.handler.quiz.timer.has(M.from) ||
            this.handler.quiz.board.has(M.from)
        )
            return void M.reply('A quiz is already going on for this group')
        if (M.numbers.length < 1)
            return void M.reply(
                `Provide the number of quiz you want to have. Example - *${this.client.config.prefix}start-quiz 10*`
            )
        const { getRandom } = new Quiz()
        const quizzes: IQuiz[] = []
        const session = M.numbers[0]
        if (isNaN(session)) return void M.reply('The number of quizzes should be number, Baka!')
        if (session < 3) return void M.reply('The minimum number of quizzes should be 3')
        if (session > 30) return void M.reply('The maximum number of quizzes should be 30')
        for (let i = 0; i < session; i++) quizzes.push(getRandom())
        this.handler.quiz.answered.set(M.from, { players: [] })
        this.handler.quiz.board.set(M.from, { players: [] })
        let text = `🍀 *Question: ${quizzes[0].question}*\n`
        for (let i = 0; i < quizzes[0].options.length; i++) text += `\n${this.emojis[i]} ${quizzes[0].options[i]}`
        text += `\n\n🧧 *Use ${this.client.config.prefix}answer <option_number> to answer this question.*\n\n📒 *Note: You only have 60 seconds to answer.*`
        this.handler.quiz.game.set(M.from, {
            answer: quizzes[0].answer,
            options: quizzes[0].options
        })
        this.handler.quiz.forfeitable.set(M.from, false)
        M.reply(text)
        setTimeout(async () => {
            if (!this.handler.quiz.board.has(M.from)) return void null
            if (this.handler.quiz.game.has(M.from)) {
                const i = this.handler.quiz.game.get(M.from) as {
                    answer: string
                    options: string[]
                }
                await this.client.sendMessage(M.from, {
                    text: `🕕 Timed out! The correct answer was ${
                        this.emojis[i.options.findIndex((x) => x === i.answer)]
                    } ${i.answer}`
                })
                this.handler.quiz.game.delete(M.from)
            }
            const players = this.handler.quiz.board.get(M.from)
            let Text = `🎡 *Quiz Points*\n`
            players?.players.sort((a, b) => b.points - a.points)
            const length = players?.players.length as number
            if (length > 0)
                for (let i = 0; i < length; i++)
                    Text += `\n*#${i + 1} @${players?.players[i].jid.split('@')[0]}* - *${players?.players[i].points}*`
            if (length > 0)
                await this.client.sendMessage(M.from, {
                    text: Text,
                    mentions: players?.players.map((player) => player.jid)
                })
        }, 60 * 1000)
        let counter = 0
        const id = setInterval(async () => {
            counter += 1
            if (counter > quizzes.length - 1) {
                clearInterval(id)
                const players = this.handler.quiz.board.get(M.from)
                this.handler.quiz.game.delete(M.from)
                this.handler.quiz.board.delete(M.from)
                this.handler.quiz.timer.delete(M.from)
                this.handler.quiz.answered.delete(M.from)
                let Text = `🎡 *Quiz Points*\n`
                players?.players.sort((a, b) => b.points - a.points)
                const length = players?.players.length as number
                if (length > 0 && (players?.players[0].points as number) > 0) {
                    await this.client.DB.setExp(
                        players?.players[0].jid as string,
                        (players?.players[0].points as number) * 3
                    )
                    await this.client.DB.updateUser(players?.players[0].jid as string, 'quizWins', 'inc', 1)
                    for (let i = 0; i < length; i++)
                        Text += `\n*#${i + 1} @${players?.players[i].jid.split('@')[0]}* - *${
                            players?.players[i].points
                        }*`
                    Text += `\n\n🎉 *@${players?.players[0].jid.split('@')[0]}* won this one 🎉`
                    return void (await this.client.sendMessage(M.from, {
                        text: Text,
                        mentions: players?.players.map((player) => player.jid)
                    }))
                } else if (players?.players[0].points === 0) {
                    for (let i = 0; i < length; i++)
                        Text += `\n*#${i + 1} @${players?.players[i].jid.split('@')[0]}* - *${
                            players?.players[i].points
                        }*`
                    Text += `\n\n*No one won this game*`
                    return void (await this.client.sendMessage(M.from, {
                        text: Text,
                        mentions: players?.players.map((player) => player.jid)
                    }))
                } else if ((players?.players?.length as number) < 1)
                    return void (await this.client.sendMessage(M.from, {
                        text: '*Quiz ended with no winner*'
                    }))
            }
            let text = `🍀 *Question: ${quizzes[counter].question}*\n`
            for (let i = 0; i < quizzes[counter].options.length; i++)
                text += `\n${this.emojis[i]} ${quizzes[counter].options[i]}`
            text += `\n\n🧧 *Use ${this.client.config.prefix}answer <option_number> to answer this question.*\n\n📒 *Note: You only have 60 seconds to answer.*`
            this.handler.quiz.game.set(M.from, {
                answer: quizzes[counter].answer,
                options: quizzes[counter].options
            })
            this.handler.quiz.forfeitable.set(M.from, true)
            this.handler.quiz.timer.set(M.from, { id })
            this.handler.quiz.answered.set(M.from, { players: [] })
            await this.client.sendMessage(M.from, {
                text
            })
            setTimeout(async () => {
                if (!this.handler.quiz.board.has(M.from)) return void null
                if (this.handler.quiz.game.has(M.from)) {
                    const i = this.handler.quiz.game.get(M.from) as {
                        answer: string
                        options: string[]
                    }
                    await this.client.sendMessage(M.from, {
                        text: `🕕 Timed out! The correct answer was ${
                            this.emojis[i.options.findIndex((x) => x === i.answer)]
                        } ${i.answer}`
                    })
                    this.handler.quiz.game.delete(M.from)
                }
                const players = this.handler.quiz.board.get(M.from)
                let Text = `🎡 *Quiz Points*\n`
                players?.players.sort((a, b) => b.points - a.points)
                const length = players?.players.length as number
                if (length > 0)
                    for (let i = 0; i < length; i++)
                        Text += `\n*#${i + 1} @${players?.players[i].jid.split('@')[0]}* - *${
                            players?.players[i].points
                        }*`
                if (length > 0 && counter !== quizzes.length - 1)
                    await this.client.sendMessage(M.from, {
                        text: Text,
                        mentions: players?.players.map((player) => player.jid)
                    })
            }, 60 * 1000)
        }, 70 * 1000)
    }

    private emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
}
