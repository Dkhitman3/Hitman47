import { join } from 'path'
import { readdirSync } from 'fs-extra'
import chalk from 'chalk'
import { schedule } from 'node-cron'
import Game from 'chess-node'
import { ICharacter as WaifuResponse, Character } from '@shineiichijo/marika'
import { AnyMessageContent, proto, delay } from '@whiskeysockets/baileys'
import { IQuiz } from 'anime-quiz'
import { Message, Client, BaseCommand } from '../Structures'
import { getStats } from '../lib'
import axios from 'axios'
import { ICommand, IArgs, IPokemonAPIResponse } from '../Types'
import { Pokemon } from '../Database'

export class MessageHandler {
    constructor(private client: Client) {}

    public groups!: string[]

    public wild: string[] = []

    public chara: string[] = []

    public chess = {
        games: new Map<string, Game | undefined>(),
        challenges: new Map<string, { challenger: string; challengee: string } | undefined>(),
        ongoing: new Set<string>()
    }

    private spawnPokemon = async (): Promise<void> => {
        schedule('*/7 * * * *', async () => {
            if (this.wild.length < 1) return void null
            for (let i = 0; i < this.wild.length; i++) {
                setTimeout(async () => {
                    const { wild, bot } = await this.client.DB.getGroup(this.wild[i])
                    if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0]) return void null
                    if (!wild) return void null
                    const id = Math.floor(Math.random() * 898)
                    const data = await this.client.utils.fetch<IPokemonAPIResponse>(
                        `https://pokeapi.co/api/v2/pokemon/${id}`
                    )
                    const level = Math.floor(Math.random() * (30 - 15) + 15)
                    const image = data.sprites.other['official-artwork'].front_default as string
                    this.pokemonResponse.set(this.wild[i], {
                        name: data.name,
                        level,
                        image,
                        id
                    })
                    const buffer = await this.client.utils.getBuffer(image)
                    await this.client.sendMessage(this.wild[i], {
                        image: buffer,
                        caption: `A wild Pokemon appeared Type #catch and name of Pokemon!`
                    })
                }, (i + 1) * 45 * 1000)
            }
        })
    }

    public summonPokemon = async (
        jid: string,
        options: { pokemon: string | number; level?: number }
    ): Promise<void> => {
        const i = typeof options.pokemon === 'string' ? options.pokemon.toLowerCase() : options.pokemon.toString()
        const level = options.level ? options.level : Math.floor(Math.random() * (30 - 15)) + 15
        const data = await this.client.utils.fetch<IPokemonAPIResponse>(`https://pokeapi.co/api/v2/pokemon/${i}`)
        if (!data.name)
            return void (await this.client.sendMessage(jid, {
                text: 'Invalid Pokemon name or ID'
            }))
        const image = data.sprites.other['official-artwork'].front_default as string
        this.pokemonResponse.set(jid, {
            name: data.name,
            level,
            image,
            id: data.id
        })
        const buffer = await this.client.utils.getBuffer(image)
        return void (await this.client.sendMessage(jid, {
            image: buffer,
            caption: `A wild Pokemon appeared!`
        }))
    }

    public handleMessage = async (M: Message): Promise<void> => {
        const { prefix } = this.client.config
        const args = M.content.split(' ')
        const title = M.chat === 'group' ? M.groupMetadata?.subject || 'Group' : 'DM'
        const text = M.content
        if (M.chat === 'dm' && (await this.client.DB.getFeature('chatbot')).state) {
            if (M.message.key.fromMe) return void null
            if (this.client.config.chatBotUrl) {
                const myUrl = this.client.config.chatBotUrl
                let get = new URL(myUrl)
                let params = get.searchParams
                await axios
                    .get(
                        `${encodeURI(
                            `http://api.brainshop.ai/get?bid=${params.get('bid')}&key=${params.get('key')}&uid=${
                                M.sender.jid
                            }&msg=${text}`
                        )}`
                    )
                    .then((res) => {
                        if (res.status !== 200) return void M.reply(`Error: ${res.status}`)
                        return void M.reply(res.data.cnt)
                    })
                    .catch(() => {
                        M.reply(`Well....`)
                    })
            }
        }
        await this.moderate(M)
        if (!args[0] || !args[0].startsWith(prefix))
            return void this.client.log(
                `${chalk.cyanBright('Message')} from ${chalk.yellowBright(M.sender.username)} in ${chalk.blueBright(
                    title
                )}`
            )
        this.client.log(
            `${chalk.cyanBright(`Command ${args[0]}[${args.length - 1}]`)} from ${chalk.yellowBright(
                M.sender.username
            )} in ${chalk.blueBright(`${title}`)}`
        )
        const { bot } = await this.client.DB.getGroup(M.from)
        const commands = ['switch', 'hello', 'hi']
        const { banned, tag } = await this.client.DB.getUser(M.sender.jid)
        if (banned) return void M.reply('You are banned from using commands')
        if (!tag)
            await this.client.DB.updateUser(M.sender.jid, 'tag', 'set', this.client.utils.generateRandomUniqueTag())
        const cmd = args[0].toLowerCase().slice(prefix.length)
        const command = this.commands.get(cmd) || this.aliases.get(cmd)
        if (!command) return void M.reply('*🚫Do you mean help*')
        const disabledCommands = await this.client.DB.getDisabledCommands()
        const index = disabledCommands.findIndex((CMD) => CMD.command === command.name)
        if (index >= 0)
            return void M.reply(
                `*${this.client.utils.capitalize(cmd)}* is currently disabled by *${
                    disabledCommands[index].disabledBy
                }* in *${disabledCommands[index].time} (GMT)*. ❓ *Reason:* ${disabledCommands[index].reason}`
            )
        if (command.config.category === 'dev' && !this.client.config.mods.includes(M.sender.jid))
            return void M.reply('This command can only be used by the MODS')
        if (M.chat === 'dm' && !command.config.dm) return void M.reply('This command can only be used in groups')
        if (command.config.category === 'moderation' && !M.sender.isAdmin)
            return void M.reply('This command can only be used by the group admins')
        if (command.config.casino && M.from !== this.client.config.casinoGroup)
            return void M.reply(
                `This command can only be used in the casino group. Use ${this.client.config.prefix}support to get the casino group link`
            )
        const isAdmin = M.groupMetadata?.admins?.includes(this.client.correctJid(this.client.user?.id || ''))
        if (command.config.adminRequired && !isAdmin) return void M.reply('I need to be an admin to use this command')
        const { nsfw } = await this.client.DB.getGroup(M.from)
        if (command.config.category === 'nsfw' && !nsfw)
            return void M.reply('This command can only be used in NSFW enabled groups')
        const cooldownAmount = (command.config.cooldown ?? 3) * 1000
        const time = cooldownAmount + Date.now()
        if (this.cooldowns.has(`${M.sender.jid}${command.name}`)) {
            const cd = this.cooldowns.get(`${M.sender.jid}${command.name}`)
            const remainingTime = this.client.utils.convertMs((cd as number) - Date.now())
            return void M.reply(
                `*You are on a free mode Wait *${remainingTime}* ${
                    remainingTime > 1 ? 'seconds' : 'second'
                } *before using this command again*`
            )
        } else this.cooldowns.set(`${M.sender.jid}${command.name}`, time)
        setTimeout(() => this.cooldowns.delete(`${M.sender.jid}${command.name}`), cooldownAmount)
        await this.client.DB.setExp(M.sender.jid, command.config.exp || 10)
        await this.handleUserStats(M)
        try {
            await command.execute(M, this.formatArgs(args))
        } catch (error) {
            this.client.log((error as any).message, true)
        }
    }

    public loadWildEnabledGroups = async (): Promise<void> => {
        const groups = !this.groups ? await this.client.getAllGroups() : this.groups
        for (const group of groups) {
            const data = await this.client.DB.getGroup(group)
            if (!data.wild) continue
            this.wild.push(group)
        }
        this.client.log(
            `Successfully loaded ${chalk.blueBright(`${this.wild.length}`)} ${
                this.wild.length > 1 ? 'groups' : 'group'
            } which has enabled wild`
        )
        await this.spawnPokemon()
    }

    public loadCharaEnabledGroups = async (): Promise<void> => {
        const groups = !this.groups ? await this.client.getAllGroups() : this.groups
        for (const group of groups) {
            const data = await this.client.DB.getGroup(group)
            if (!data.chara) continue
            this.chara.push(group)
        }
        this.client.log(
            `Successfully loaded ${chalk.blueBright(`${this.chara.length}`)} ${
                this.chara.length > 1 ? 'groups' : 'group'
            } which has enabled chara`
        )
        await this.spawnChara()
    }

    private moderate = async (M: Message): Promise<void> => {
        if (M.chat !== 'group') {
            const urls = M.urls
            if (!urls.length) return void null
            const groupinvites = urls.filter((url) => url.includes('chat.whatsapp.com'))
            if (!groupinvites.length) return void null
            this.client.log(
                `${chalk.blueBright('GROUP REQUEST')} from ${chalk.yellowBright(
                    M.sender.username
                )} in ${chalk.cyanBright('DM')}`
            )
            const text = `*━━━❰ GROUP REQUEST ❱━━━*\n\n*🚀Request:* from *@${
                M.sender.jid.split('@')[0]
            }*\n\n*📃Message:* ${M.content}`
            if (M.message.key.fromMe) return void null
            await this.client.sendMessage(this.client.config.adminsGroup, {
                text,
                mentions: [M.sender.jid]
            })
            return void M.reply('Your request has been sent🎉')
        }
        const { mods } = await this.client.DB.getGroup(M.from)
        if (
            !mods ||
            M.sender.isAdmin ||
            !M.groupMetadata?.admins?.includes(this.client.correctJid(this.client.user?.id || ''))
        )
            return void null
        const urls = M.urls
        if (urls.length > 0) {
            const groupinvites = urls.filter((url) => url.includes('chat.whatsapp.com'))
            if (groupinvites.length > 0) {
                groupinvites.forEach(async (invite) => {
                    const code = await this.client.groupInviteCode(M.from)
                    const inviteSplit = invite.split('/')
                    if (inviteSplit[inviteSplit.length - 1] !== code) {
                        const title = M.groupMetadata?.subject || 'Group'
                        this.client.log(
                            `${chalk.blueBright('MOD')} ${chalk.green('Group Invite')} by ${chalk.yellow(
                                M.sender.username
                            )} in ${chalk.cyanBright(title)}`
                        )
                        return void (await this.client.groupParticipantsUpdate(M.from, [M.sender.jid], 'remove'))
                    }
                })
            }
        }
    }

    private formatArgs = (args: string[]): IArgs => {
        args.splice(0, 1)
        return {
            args,
            context: args.join(' ').trim(),
            flags: args.filter((arg) => arg.startsWith('--'))
        }
    }

    private spawnChara = async (): Promise<void> => {
        schedule('*/5 * * * *', async () => {
            if (this.chara.length < 1) return void null
            for (let i = 0; i < this.chara.length; i++) {
                setTimeout(async () => {
                    const { chara, bot } = await this.client.DB.getGroup(this.wild[i])
                    if (bot !== 'all' && bot !== this.client.config.name.split(' ')[0]) return void null
                    if (!chara) return void null
                    await new Character()
                        .getRandomCharacter()
                        .then(async (chara) => {
                            const price = Math.floor(Math.random() * (50000 - 25000) + 25000)
                            let source = ''
                            await new Character()
                                .getCharacterAnime(chara.mal_id)
                                .then((res) => (source = res.data[0].anime.title))
                                .catch(async () => {
                                    await new Character()
                                        .getCharacterManga(chara.mal_id.toString())
                                        .then((res) => (source = res.data[0].manga.title))
                                        .catch(() => {})
                                })
                            const buffer = await this.client.utils.getBuffer(chara.images.jpg.image_url)
                            const MessageX = {
                                image: buffer,
                                caption: `*A claimable character Appeared!*\n\n🏮 *Name: ${chara.name}*\n\n📑 *About:* ${chara.about}\n\n🌐 *Source: ${source}*\n\n💰 *Price: ${price}*\n\n*[Use ${this.client.config.prefix}claim to have this character in your gallery]*`
                            }
                            this.charaResponse.set(this.chara[i], { price, data: chara })
                            await this.client.sendMessage(this.chara[i], MessageX)
                        })
                        .catch(() => {})
                }, (i + 1) * 20 * 1000)
            }
        })
    }

    public loadCommands = (): void => {
        this.client.log('Loading Commands...')
        const files = readdirSync(join(...this.path)).filter((file) => !file.startsWith('_'))
        for (const file of files) {
            this.path.push(file)
            const Commands = readdirSync(join(...this.path))
            for (const Command of Commands) {
                this.path.push(Command)
                const command: BaseCommand = new (require(join(...this.path)).default)()
                command.client = this.client
                command.handler = this
                this.commands.set(command.name, command)
                if (command.config.aliases) command.config.aliases.forEach((alias) => this.aliases.set(alias, command))
                this.client.log(
                    `Loaded: ${chalk.yellowBright(command.name)} from ${chalk.cyanBright(command.config.category)}`
                )
                this.path.splice(this.path.indexOf(Command), 1)
            }
            this.path.splice(this.path.indexOf(file), 1)
        }
        return this.client.log(
            `Successfully loaded ${chalk.cyanBright(this.commands.size)} ${
                this.commands.size > 1 ? 'commands' : 'command'
            } with ${chalk.yellowBright(this.aliases.size)} ${this.aliases.size > 1 ? 'aliases' : 'alias'}`
        )
    }

    private handleUserStats = async (M: Message): Promise<void> => {
        const { experience, level } = await this.client.DB.getUser(M.sender.jid)
        const { requiredXpToLevelUp } = getStats(level)
        if (requiredXpToLevelUp > experience) return void null
        await this.client.DB.updateUser(M.sender.jid, 'level', 'inc', 1)
    }

    public commands = new Map<string, ICommand>()

    public aliases = new Map<string, ICommand>()

    private cooldowns = new Map<string, number>()

    private path = [__dirname, '..', 'Commands']

    public pokemonResponse = new Map<string, Pokemon>()

    public pokemonTradeResponse = new Map<string, { offer: Pokemon; creator: string; with: string }>()

    public charaResponse = new Map<string, { price: number; data: WaifuResponse }>()

    public haigushaResponse = new Map<string, WaifuResponse>()

    private genders = ['female', 'male']

    public quiz = {
        game: new Map<string, { answer: string; options: string[] }>(),
        timer: new Map<string, { id: NodeJS.Timer }>(),
        board: new Map<string, { players: { jid: string; points: number }[] }>(),
        answered: new Map<string, { players: string[] }>(),
        forfeitable: new Map<string, boolean>()
    }
}
