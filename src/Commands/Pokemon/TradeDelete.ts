import { BaseCommand, Command, Message } from '../../Structures'

@Command('trade-delete', {
    category: 'pokemon',
    description: '=',
    usage: 'trade-delete',
    cooldown: 10,
    exp: 10,
    aliases: []
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        if (!this.handler.pokemonTradeResponse.has(M.from)) return void M.reply('no trade')
        const trade = this.handler.pokemonTradeResponse.get(M.from)
        if (trade?.creator !== M.sender.jid) return void M.reply("you can't delete it")
        this.handler.pokemonTradeResponse.delete(M.from)
        return void M.reply('deleted')
    }
}
