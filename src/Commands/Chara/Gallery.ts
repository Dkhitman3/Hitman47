import { Character } from '@shineiichijo/marika'
import { Command, BaseCommand, Message } from '../../Structures'

@Command('gallery', {
    description: 'gallery',
    usage: 'gallery',
    category: 'characters',
    cooldown: 10,
    exp: 20
})
export default class extends BaseCommand {
    public override execute = async (M: Message): Promise<void> => {
        const { gallery } = await this.client.DB.getUser(M.sender.jid)
        if (!gallery.length) return void M.reply('no claimed chara')
        if (!M.numbers.length || M.numbers[0] < 1 || M.numbers[0] > gallery.length) {
            let text = M.sender.username
            text += ' '
            text += 'claimed charas'
            text += '\n'
            gallery.forEach((x, i) => (text += `\n*#${i + 1} ${x.name}*`))
            return void (await M.reply(
                await this.client.utils.getBuffer(gallery[0].images.jpg.image_url),
                'image',
                undefined,
                undefined,
                text
            ))
        }
        const data = gallery[M.numbers[0] - 1]
        await new Character()
            .getCharacterById(data.mal_id)
            .then(async (chara) => {
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
                return await this.execute(M)
            })
    }
}
