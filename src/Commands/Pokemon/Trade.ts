import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'

@Command('trade', {
    description: '',
    category: 'pokemon',
    usage: '',
    cooldown: 35,
    aliases: ['t'],
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (this.handler.pokemonTradeResponse.has(M.from)) return void M.reply('trade ongoing for this group')
        if (M.numbers.length < 1) return void M.reply(`index and name?*`)
        const { party } = await this.client.DB.getUser(M.sender.jid)
        M.numbers.forEach((x) => (context = context.replace(x.toString(), '')))
        if (M.numbers[0] > party.length || M.numbers[0] < 1) return void M.reply('invalid index')
        const index = M.numbers[0] - 1
        const term = context.trim().split(' ')[0].toLowerCase().trim()
        if (!term) return void M.reply('name?')
        await this.client.utils
            .fetch<IPokemonAPIResponse>(`https://pokeapi.co/api/v2/pokemon/${term}`)
            .then(async ({ name }) => {
                this.handler.pokemonTradeResponse.set(M.from, {
                    offer: party[index],
                    creator: M.sender.jid,
                    with: name
                })
                const text = `*Offer: ${this.client.utils.capitalize(
                    party[index].name
                )}*\n*For: ${this.client.utils.capitalize(name)}*`
                await M.reply(text)
                setTimeout(() => {
                    if (!this.handler.pokemonTradeResponse.has(M.from)) return void null
                    this.handler.pokemonTradeResponse.delete(M.from)
                    return void M.reply('cancelled')
                }, 6 * 10000)
            })
            .catch(() => {
                return void M.reply('no pokemon found')
            })
    }
}
