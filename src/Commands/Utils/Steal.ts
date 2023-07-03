import { BaseCommand, Command, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { Sticker, StickerTypes, Categories } from 'wa-sticker-formatter'
import { tmpdir } from 'os'
import { writeFile, readFile, unlink } from 'fs-extra'

@Command('steal', {
    description: 'steal stickers',
    aliases: ['take', 'steal', 'me'],
    category: 'utils',
    usage: 'steal',
    exp: 10,
    cooldown: 5
})
export default class command extends BaseCommand {
    override execute = async (M: Message, { flags, context }: IArgs): Promise<void> => {
        if (!M.quoted || M.quoted.type !== 'stickerMessage') return void M.reply('sticker?')
        const pack = context.split('|')
        if (!pack[1]) return void M.reply(`pack and author?`)
        const buffer = await M.downloadMediaMessage(M.quoted.message)
        const filename = `${tmpdir()}/${Math.random().toString(36)}.webp`
        const getQuality = (): number => {
            const qualityFlag = context.match(/--(\d+)/g) || ''
            return qualityFlag.length
                ? parseInt(qualityFlag[0].split('--')[1], 10)
                : flags.includes('--broke')
                ? 1
                : flags.includes('--low')
                ? 10
                : flags.includes('--high')
                ? 100
                : 50
        }

        let quality = getQuality()
        if (quality > 100 || quality < 1) quality = 50

        flags.forEach((flag) => (context = context.replace(flag, '')))
        const getOptions = () => {
            const categories = (() => {
                const categories = flags.reduce((categories, flag) => {
                    switch (flag) {
                        case '--angry':
                            categories.push('💢')
                            break
                        case '--love':
                            categories.push('💕')
                            break
                        case '--sad':
                            categories.push('😭')
                            break
                        case '--happy':
                            categories.push('😂')
                            break
                        case '--greet':
                            categories.push('👋')
                            break
                        case '--celebrate':
                            categories.push('🎊')
                            break
                    }
                    return categories
                }, new Array<Categories>())
                categories.length = 2
                if (!categories[0]) categories.push('❤', '🌹')
                return categories
            })()
            return {
                categories,
                pack: pack[1] || 'Dkhitman47',
                author: pack[2] || `${M.sender.username}`,
                quality,
                type: StickerTypes[
                    flags.includes('--crop') || flags.includes('--c')
                        ? 'CROPPED'
                        : flags.includes('--stretch') || flags.includes('--s')
                        ? 'DEFAULT'
                        : 'FULL'
                ]
            }
        }
        flags.forEach((flag) => (context = context.replace(flag, '')))
        const sticker = await new Sticker(buffer, getOptions()).build()
        await writeFile(filename, sticker)
        const result = await readFile(filename)
        await unlink(filename)
        return void (await M.reply(result, 'sticker'))
    }
}
