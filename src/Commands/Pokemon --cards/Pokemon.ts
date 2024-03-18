import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs, IPokemonAPIResponse } from '../../Types'

@Command('pokemon', {
    description: '',
    usage: 'pokemon',
    category: 'pokemon',
    cooldown: 10,
    exp: 5
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { context }: IArgs): Promise<void> => {
        if (!context) return void M.reply('name?')
        const term = context.trim().split(' ')[0].toLowerCase().trim()
        await this.client.utils
            .fetch<IPokemonAPIResponse>(`https://pokeapi.co/api/v2/pokemon/${term}`)
            .then(async (res) => {
                const { party, pc } = await this.client.DB.getUser(M.sender.jid)
                const text = `*Name:* ${this.client.utils.capitalize(res.name)}\n\n*ID:* ${res.id}\n\n*${
                    res.types.length > 1 ? 'Types' : 'Type'
                }:* ${res.types.map((type) => `${this.client.utils.capitalize(type.type.name)}`).join(', ')}\n\n*${
                    res.abilities.length > 1 ? 'Abilities' : 'Ability'
                }:* ${res.abilities
                    .map((ability) => `${this.client.utils.capitalize(ability.ability.name)}`)
                    .join(', ')}`
                const image = await this.client.utils.getBuffer(
                    res.sprites.other['official-artwork'].front_default as string
                )
                return void (await M.reply(image, 'image', undefined, undefined, text))
            })
            .catch(() => {
                return void M.reply('Invalid pokemon name or pokedex ID')
            })
    }
}
