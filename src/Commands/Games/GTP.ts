import { Pokemon } from '@shineiichijo/canvas-chan'
import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'

@Command('guess-pokemon', {
    description: "Who's that Pokemon?",
    aliases: ['gtp'],
    category: 'games',
    exp: 15,
    cooldown: 10,
    usage: 'guess-pokemon start'
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        const term = context.toLowerCase().split(' ')
        let players: string[] = []
        switch (term[0]) {
            default:
                return void (await M.reply('Invalid Usage'))
            case 'start':
                if (this.game.has(M.from)) return void (await M.reply('A session is already going on'))
                const i = Math.floor(Math.random() * 898).toString()
                const data = await this.client.utils.fetch<IPokemonAPIResponse>(
                    `https://pokeapi.co/api/v2/pokemon/${i}`
                )
                const hidden = await this.createImage(i, true)
                const result = await this.createImage(i, false)
                this.game.set(M.from, { pokemon: data.name, players })
                await M.reply(
                    hidden,
                    'image',
                    undefined,
                    undefined,
                    `Who's this pokemon?\nUse *${this.client.config.prefix}guess-pokemon guess [pokemon_name]* to guess this pokemon`
                )
                setTimeout(async () => {
                    if (!this.game.has(M.from)) return
                    const t = this.game.get(M.from)
                    this.game.delete(M.from)
                    return void (await M.reply(
                        result,
                        'image',
                        undefined,
                        undefined,
                        `Timed out! The pokemon name was *${this.client.utils.capitalize(t?.pokemon || '')}*`
                    ))
                }, 60000)
                break
            case 'guess':
            case 'g':
                if (!this.game.has(M.from)) return void (await M.reply("There aren't any games for you to guess"))
                if (!term[1] || term[1] === undefined || term[1] === '')
                    return void (await M.reply('Provide the pokemon name, Baka!'))
                const Data = this.game.get(M.from)
                const img = await this.createImage(Data?.pokemon || '', false)
                if (Data?.players?.includes(M.sender.jid))
                    return void (await M.reply('You have recently attempted to guess this pokemon. Give it a break'))
                players = Data?.players || []
                if (Data?.pokemon !== term[1]) {
                    players.push(M.sender.jid)
                    this.game.set(M.from, { pokemon: Data?.pokemon || '', players })
                    return void (await M.reply('Wrong guess!'))
                } else {
                    this.game.delete(M.from)
                    await this.client.DB.setExp(M.sender.jid, 150)
                    return void (await M.reply(img, 'image', undefined, undefined, 'Correct!'))
                }
        }
    }

    private game = new Map<string, { pokemon: string; players: string[] }>()

    private createImage = async (pokemon: string, hidden: boolean): Promise<Buffer> =>
        (await new Pokemon(pokemon, hidden)).build()
}
