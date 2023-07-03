import { BaseCommand, Command, Message } from '../../Structures'
import { Character } from '@shineiichijo/marika'
@Command('hg', {
    description: 'Displays partner',
    usage: 'hg',
    category: 'weeb',
    cooldown: 15,
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async (M: Message): Promise<void> => {
        const user = !M.mentioned.length && !M.quoted ? M.sender.jid : M.quoted ? M.quoted.sender.jid : M.mentioned[0]
        const { haigusha } = await this.client.DB.getUser(user)
        if (!haigusha.married) return void M.reply(`Not married`)
        await new Character()
            .getCharacterById(haigusha.data.mal_id)
            .then(async (chara) => {
                //const chara = data[0]
                let source!: string
                await new Character()
                    .getCharacterAnime(chara.mal_id)
                    .then((res) => (source = res.data[0].anime.title))
                    .catch(async () => {
                        await new Character()
                            .getCharacterManga(chara.mal_id.toString())
                            .then((res) => (source = res.data[0].manga.title))
                            .catch(() => (source = ''))
                    })
                let text = `💙 *Name:* ${chara.name}\n💚 *Nicknames:* ${chara.nicknames.join(
                    ', '
                )}\n💛 *Source:* ${source}`
                if (chara.about !== null) text += `\n\n❤ *Description:* ${chara.about}`
                const image = await this.client.utils.getBuffer(chara.images.jpg.image_url)
                return void (await M.reply(image, 'image', undefined, undefined, text, undefined, {
                    title: chara.name,
                    mediaType: 1,
                    thumbnail: image,
                    sourceUrl: chara.url
                }))
            })
            .catch(async () => {
                return void (await M.reply('try again'))
            })
    }
}
