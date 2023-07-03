import { BaseCommand, Command, Message } from '../../Structures'
import { Pokemon } from '../../Database'

@Command('trade-confirm', {
    description: '',
    category: 'pokemon',
    usage: 'trade-confirm',
    cooldown: 15,
    aliases: []
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!this.handler.pokemonTradeResponse.has(M.from)) return void M.reply('no trade')
        const trade = this.handler.pokemonTradeResponse.get(M.from)
        if (trade?.creator === M.sender.jid) return void M.reply("you can't tade with yourself")
        const { party } = await this.client.DB.getUser(M.sender.jid)
        const i = party.findIndex((x) => x.name === (trade?.with as string))
        if (i < 0) return void M.reply(`you don\'t have ${trade?.with as string} in your party*`)
        const pkmn = trade?.offer as Pokemon
        const pokemon = party[i]
        const { party: Party } = await this.client.DB.getUser(trade?.creator as string)
        const index = Party.findIndex((x) => x.name === pkmn.name && x.level === pkmn.level)
        party[i] = pkmn
        Party[index] = pokemon
        await this.client.DB.user.updateOne({ jid: trade?.creator as string }, { $set: { party: Party } })
        await this.client.DB.user.updateOne({ jid: M.sender.jid }, { $set: { party } })
        this.handler.pokemonTradeResponse.delete(M.from)
        return void M.reply(
            `${pkmn.name}* = *@${trade?.creator.split('@')[0]}*\n\n*${pokemon.name}* = *@${
                M.sender.jid.split('@')[0]
            }*`,
            'text',
            undefined,
            undefined,
            undefined,
            [M.sender.jid, trade?.creator as string]
        )
    }
}
