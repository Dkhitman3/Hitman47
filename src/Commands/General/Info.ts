import { Command, BaseCommand, Message } from '../../Structures'

@Command('info', {
    description: "Displays the bot's info",
    usage: 'info',
    category: 'general',
    exp: 10
})
export default class command extends BaseCommand {
    override execute = async ({ reply }: Message): Promise<void> => {
        const users = await this.client.DB.user.count()
        const uban = await this.client.DB.user.countDocuments({ banned: true })
        let getGroups = await this.client.groupFetchAllParticipating()
        let groups = Object.entries(getGroups)
            .slice(0)
            .map((entry) => entry[1])
        let res = groups.map((v) => v.id)
        console.log(res.length)
        const pad = (s: number): string => (s < 10 ? '0' : '') + s
        const formatTime = (seconds: number): string => {
            const hours = Math.floor(seconds / (60 * 60))
            const minutes = Math.floor((seconds % (60 * 60)) / 60)
            const secs = Math.floor(seconds % 60)
            return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
        }
        const uptime = formatTime(process.uptime())
        return void (await reply(
            `*━━━❰ ||◁ㅤℍ47ㅤ▷|| ❱━━━*\n\n📚 *Users:* ${users}\n🎎 *Banned Users:* ${uban}\n🌍 *Groups:* ${res.length}\n🎇 *Mods:* ${this.client.config.mods.length}\n🎆 *Commands:* ${this.handler.commands.size}\n💻 *Uptime:* ${uptime}`
        ))
    }
}
