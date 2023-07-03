import { AnyMessageContent } from '@whiskeysockets/baileys'
import { load } from 'cheerio'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'

@Command('hangman', {
    description: 'Hangman game',
    aliases: [],
    category: 'games',
    exp: 15,
    cooldown: 10,
    usage: 'hangman start',
    dm: true
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const data = this.game.get(M.from)
        if (!context)
            return void (await M.reply(
                this.client.utils.getHangman(6),
                'image',
                undefined,
                undefined,
                `Hangman game\n\n*${this.client.config.prefix}hangman start* - Starts a hangman game\n\n*${this.client.config.prefix}hangman guess [letter]* - Used to guess a letter of the word\n\n*${this.client.config.prefix}hangman forfeit* - Forfeits the ongoing hangman game`
            ))
        const terms = context.trim().toLowerCase().split(' ')
        const term = terms[0]
        switch (term) {
            default:
                return void (await M.reply(
                    `Invalid Usage! Use *${this.client.config.prefix}hangman* to see all the available commands.`
                ))
            case 'start':
            case 's':
                if (!data) return void (await this.startGame(M))
                if (data.jid === M.sender.jid)
                    return void (await M.reply(
                        `You are already playing a game here. Use *${this.client.config.prefix}hangman forfeit* to forfeit the ongoing hangman game.`
                    ))
                else
                    return void (await M.reply(
                        "Someone is already playing a game here. Wait for them to finish or go play elsewhere (You can also play this game in the bot's DM."
                    ))
            case 'forfeit':
            case 'ff':
                if (!data || data.jid !== M.sender.jid) return void (await M.reply("You aren't playing a game here"))
                this.game.delete(M.from)
                const text = `You're hanged! The answer was *${data.word.toUpperCase()}*`
                const buffer = this.client.utils.getHangman(6)
                return void (await this.client.sendMessage(
                    M.from,
                    {
                        image: buffer,
                        caption: text,
                        jpegThumbnail: buffer.toString('base64'),
                        contextInfo: {
                            externalAdReply: {
                                title: 'Hangman game',
                                body: data.word.toUpperCase(),
                                thumbnail: buffer
                            }
                        }
                    } as unknown as AnyMessageContent,
                    {
                        quoted: M.message
                    }
                ))
            case 'guess':
            case 'g':
                if (!data || data.jid !== M.sender.jid) return void (await M.reply("You aren't playing a game here"))
                if (!terms[1] || terms[1] === '')
                    return void (await M.reply(
                        `Provide the letter. Example: *${this.client.config.prefix}hangman guess d*`
                    ))
                const x = this.client.utils.extractNumbers(terms[1])
                if (x.length) return void (await M.reply("You shouldn't include a number"))
                if (terms[1].length > 1)
                    return void (await M.reply(
                        `Provide only one letter. Example: *${this.client.config.prefix}hangman guess d*`
                    ))
                if (!data.remaining.includes(terms[1])) {
                    data.wrong += 1
                    const buffer = this.client.utils.getHangman(data.wrong)
                    if (data.wrong >= 6) {
                        this.game.delete(M.from)
                        const text = `You're hanged! The answer was *${data.word.toUpperCase()}*`
                        return void (await this.client.sendMessage(
                            M.from,
                            {
                                image: buffer,
                                caption: text,
                                jpegThumbnail: buffer.toString('base64'),
                                contextInfo: {
                                    externalAdReply: {
                                        title: 'Hangman game',
                                        body: data.word.toUpperCase(),
                                        thumbnail: buffer
                                    }
                                }
                            } as unknown as AnyMessageContent,
                            {
                                quoted: M.message
                            }
                        ))
                    }
                    this.game.set(M.from, data)
                    const lives = 6 - data.wrong
                    return void (await this.client.sendMessage(
                        M.from,
                        {
                            image: buffer,
                            caption: `Wrong guess! You've got *${lives}* more lives remaining.\nGuess the word: *${data.shown
                                .join(' ')
                                .toUpperCase()}*`,
                            jpegThumbnail: buffer.toString('base64'),
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Hangman game',
                                    body: data.shown.join(' ').toUpperCase(),
                                    thumbnail: this.client.utils.getHangman(6)
                                }
                            }
                        } as unknown as AnyMessageContent,
                        {
                            quoted: M.message
                        }
                    ))
                }
                const repeated = this.client.utils.getRepeatedWords(data.word)
                for (let i = 0; i < data.word.length; i++) {
                    if (Object.keys(repeated).includes(data.word[i]) && terms[1] === data.word[i]) {
                        data.shown[i] = data.word[i]
                        data.remaining.splice(data.remaining.indexOf(data.word[i]), 1)
                    } else if (!Object.keys(repeated).includes(data.word[i]) && terms[1] === data.word[i]) {
                        data.shown[i] = data.word[i]
                        data.remaining.splice(data.remaining.indexOf(data.word[i]), 1)
                    }
                }
                const image = this.client.utils.getHangman(data.wrong)
                if (!data.shown.includes('_')) {
                    this.game.delete(M.from)
                    const text = `Congrats! You saved yourself from getting hanged by guessing the word *${data.word.toUpperCase()}* correctly.`
                    return void (await this.client.sendMessage(
                        M.from,
                        {
                            image,
                            caption: text,
                            jpegThumbnail: image.toString('base64'),
                            contextInfo: {
                                externalAdReply: {
                                    title: 'Hangman game',
                                    body: data.word.toUpperCase(),
                                    thumbnail: this.client.utils.getHangman(6)
                                }
                            }
                        } as unknown as AnyMessageContent,
                        {
                            quoted: M.message
                        }
                    ))
                }
                this.game.set(M.from, data)
                const caption = `Correct! You guessed it right. Now, guess ${
                    data.shown.filter((x) => x === '_').length === 1
                        ? 'this only remaining letter'
                        : 'these remaining words'
                } to win this game.\nGuess the word: *${data.shown.join(' ').toUpperCase()}*`
                return void (await this.client.sendMessage(
                    M.from,
                    {
                        image,
                        caption,
                        jpegThumbnail: image.toString('base64'),
                        contextInfo: {
                            externalAdReply: {
                                title: 'Hangman game',
                                body: data.shown.join(' ').toUpperCase(),
                                thumbnail: this.client.utils.getHangman(6)
                            }
                        }
                    } as unknown as AnyMessageContent,
                    {
                        quoted: M.message
                    }
                ))
        }
    }

    private startGame = async (M: Message): Promise<void> => {
        const data = await this.client.utils.fetch<string>(
            'https://scrap-shoob.vercel.app/raw?url=https://raw.githubusercontent.com/Natemo6348/xiao/master/assets/json/word-list.json'
        )
        const $ = load(data)
        const words: string[] = JSON.parse($.text())
        const word = words[Math.floor(Math.random() * 50934)]
        const shown: string[] = []
        const remaining: string[] = []
        for (let i = 0; i < word.length; i++) {
            shown.push('_')
            if (!remaining.includes(word[i])) remaining.push(word[i])
        }
        this.game.set(M.from, { word, jid: M.sender.jid, wrong: 0, shown, remaining })
        const buffer = this.client.utils.getHangman()
        return void (await this.client.sendMessage(
            M.from,
            {
                image: buffer,
                caption: `Hangman game started!\nGuess the word: *${shown.join(' ').toUpperCase()}*`,
                jpegThumbnail: buffer.toString('base64'),
                contextInfo: {
                    externalAdReply: {
                        title: 'Hangman game',
                        body: shown.join(' ').toUpperCase(),
                        thumbnail: this.client.utils.getHangman(6)
                    }
                }
            } as unknown as AnyMessageContent,
            {
                quoted: M.message
            }
        ))
    }

    private game = new Map<string, { word: string; jid: string; wrong: number; shown: string[]; remaining: string[] }>()
}
