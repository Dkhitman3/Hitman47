import { join } from 'path'
import { BaseCommand, Command, Message } from '../../Structures'

@Command('info', {
    description: "Displays bot's info",
    usage: 'info',
    category: 'general',
    cooldown: 10,
    exp: 100
})
export default class extends BaseCommand {
    private imageUrls: string[] = [
        'https://telegra.ph/file/047af0c09b6a73acd74bf.jpg',
        'https://telegra.ph/file/7479b4def83c4c676498a.jpg',
        'https://telegra.ph/file/7479b4def83c4c676498a.jpg',
        'https://telegra.ph/file/3e80abd28d2188dbf942b.jpg',
        'https://telegra.ph/file/3e80abd28d2188dbf942b.jpg',
    ]
    // you can add more pictures if you want bro or girl
    public override execute = async ({ reply }: Message): Promise<void> => {
        const users = await this.client.DB.user.count()
        let getGroups = await this.client.groupFetchAllParticipating()
        let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1])
        let res = groups.map((v) => v.id)
        console.log(res.length)
        const { description, name, homepage } = require(join(__dirname, '..', '..', '..', 'package.json')) as {
            description: string
            homepage: string
            name: string
        }
        const randomImageUrl = this.imageUrls[Math.floor(Math.random() * this.imageUrls.length)]
        const image = await this.client.utils.getBuffer(randomImageUrl)
        const uptime = this.client.utils.formatSeconds(process.uptime())
        const text = `*🍁 ${this.client.config.name} 🍁*\n\n📙 *Description: ${description}*\n\n🔗 *Commands:* ${this.handler.commands.size}\n🚦 *Uptime:* ${uptime}\n🎐 *Users:* ${users}\n🌃 *Mods:* ${this.client.config.mods.length}\n🔮 *Groups:* ${groups.length}
     *THIS 𝐌𝐀𝐑𝐈𝐀-𝐁𝐎𝐓 🤭 IS CREATED BY 𝆺𝅥⃝➳ᴹᴿ᭄𝐉𝐅𝐋𝐄𝐗 ོ ×፝֟͜×💀*
   *©𝐌𝐀𝐑𝐈𝐀-𝐁𝐎𝐓 🤭 Inc*`
        return void (await reply(image, 'image', undefined, undefined, text, undefined, {
            title: this.client.utils.capitalize(name),
            thumbnail: image,
            mediaType: 1,
            sourceUrl: homepage
        }))
    }
 }