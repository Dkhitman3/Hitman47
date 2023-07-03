import axios from 'axios'
import { tmpdir } from 'os'
import { promisify } from 'util'
import { exec } from 'child_process'
import { readFile, readdirSync, unlink, writeFile } from 'fs-extra'
const { uploadByBuffer } = require('telegraph-uploader')
import FormData from 'form-data'
import Canvas from 'canvas'
import { load } from 'cheerio'
import regex from 'emoji-regex'
import * as linkify from 'linkifyjs'
import { MessageHandler } from '../Handlers'
import { Client } from '../Structures'

export class Utils {
    public generateRandomHex = (): string => `#${(~~(Math.random() * (1 << 24))).toString(16)}`

    public capitalize = (content: string): string => `${content.charAt(0).toUpperCase()}${content.slice(1)}`

    public generateRandomUniqueTag = (n: number = 4): string => {
        let max = 11
        if (n > max) return `${this.generateRandomUniqueTag(max)}${this.generateRandomUniqueTag(n - max)}`
        max = Math.pow(10, n + 1)
        const min = max / 10
        return (Math.floor(Math.random() * (max - min + 1)) + min).toString().substring(1)
    }

    public getHangman = (state: number = 0): Buffer => {
        const createLine = (
            ctx: Canvas.CanvasRenderingContext2D,
            fromX: number,
            fromY: number,
            toX: number,
            toY: number,
            color: string = '#000000'
        ) => {
            ctx.beginPath()
            ctx.strokeStyle = color
            ctx.moveTo(fromX, fromY)
            ctx.lineTo(toX, toY)
            ctx.stroke()
            ctx.closePath()
        }
        const canvas = Canvas.createCanvas(300, 350)
        const ctx = canvas.getContext('2d')
        ctx.lineWidth = 5
        createLine(ctx, 50, 330, 150, 330)
        createLine(ctx, 100, 330, 100, 50)
        createLine(ctx, 100, 50, 200, 50)
        createLine(ctx, 200, 50, 200, 80)
        if (state >= 1) {
            ctx.strokeStyle = '#000000'
            ctx.beginPath()
            ctx.arc(200, 100, 20, 0, 2 * Math.PI)
            ctx.stroke()
            ctx.closePath()
        }
        if (state >= 2) createLine(ctx, 200, 120, 200, 200, '#000000')
        if (state >= 3) createLine(ctx, 200, 150, 170, 130, state < 3 ? '#a3a3a3' : '#000000')
        if (state >= 4) createLine(ctx, 200, 150, 230, 130, state < 4 ? '#a3a3a3' : '#000000')
        if (state >= 5) createLine(ctx, 200, 200, 180, 230, state < 5 ? '#a3a3a3' : '#000000')
        if (state >= 6) createLine(ctx, 200, 200, 220, 230, state < 6 ? '#a3a3a3' : '#000000')
        return canvas.toBuffer()
    }

    public getRepeatedWords = (str: string): { [K: string]: number } => {
        let tmp: { [K: string]: number } = {}
        let c!: string
        for (let i = str.length - 1; i >= 0; i--) {
            c = str.charAt(i)
            if (c in tmp) tmp[c] += 1
            else tmp[c] = 1
        }
        let result: { [K: string]: number } = {}
        for (c in tmp) {
            if (tmp.hasOwnProperty(c) && tmp[c] > 1) result[c] = tmp[c]
        }
        return result
    }

    public extractNumbers = (content: string): number[] => {
        const search = content.match(/(-\d+|\d+)/g)
        if (search !== null) return search.map((string) => parseInt(string))
        return []
    }

    public extractUrls = (content: string): string[] => {
        const urls = linkify.find(content)
        const arr = []
        for (const url of urls) {
            arr.push(url.value)
        }
        return arr
    }

    public superFetch = async (url: string): Promise<string> =>
        await this.fetch<string>(`https://web-production-418e.up.railway.app/raw?url=${url}`)

    public getRandomFile = (dir: string): string => {
        let document: string = ''
        try {
            const result = readdirSync(dir)
            document = result[Math.floor(Math.random() * result.length)].split(/\.(?=[^\.]+$)/)[0]
        } catch {
            document = '404'
        }
        return document
    }

    public extractEmojis = (content: string): string[] => content.match(regex()) || []

    public formatSeconds = (seconds: number): string => new Date(seconds * 1000).toISOString().substr(11, 8)

    public bufferToUrl = async (media: Buffer): Promise<Buffer> => (await uploadByBuffer(media)).link

    public convertMs = (ms: number, to: 'seconds' | 'minutes' | 'hours' = 'seconds'): number => {
        const seconds = parseInt((ms / 1000).toString().split('.')[0])
        const minutes = parseInt((seconds / 60).toString().split('.')[0])
        const hours = parseInt((minutes / 60).toString().split('.')[0])
        if (to === 'hours') return hours
        if (to === 'minutes') return minutes
        return seconds
    }

    public webpToPng = async (webp: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.webp`, webp)
        await this.exec(`dwebp "${filename}.webp" -o "${filename}.png"`)
        const buffer = await readFile(`${filename}.png`)
        Promise.all([unlink(`${filename}.png`), unlink(`${filename}.webp`)])
        return buffer
    }

    public mp3ToOpus = async (mp3: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.mp3`, mp3)
        await this.exec(`ffmpeg -i ${filename}.mp3 -c:a libopus ${filename}.opus`)
        const buffer = await readFile(`${filename}.opus`)
        Promise.all([unlink(`${filename}.mp3`), unlink(`${filename}.opus`)])
        return buffer
    }

    public webpToMp4 = async (webp: Buffer): Promise<Buffer> => {
        const responseFile = async (form: FormData, buffer = '') => {
            return axios.post(
                buffer ? `https://ezgif.com/webp-to-mp4/${buffer}` : 'https://ezgif.com/webp-to-mp4',
                form,
                {
                    headers: { 'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}` }
                }
            )
        }
        return new Promise(async (resolve, reject) => {
            const form: any = new FormData()
            form.append('new-image-url', '')
            form.append('new-image', webp, { filename: 'blob' })
            responseFile(form)
                .then(({ data }) => {
                    const datafrom: any = new FormData()
                    const $ = load(data)
                    const file = $('input[name="file"]').attr('value')
                    datafrom.append('file', file)
                    datafrom.append('convert', 'Convert WebP to MP4!')
                    responseFile(datafrom, file)
                        .then(async ({ data }) => {
                            const $ = load(data)
                            const result = await this.getBuffer(
                                `https:${$('div#output > p.outfile > video > source').attr('src')}`
                            )
                            resolve(result)
                        })
                        .catch(reject)
                })
                .catch(reject)
        })
    }

    public gifToMp4 = async (gif: Buffer): Promise<Buffer> => {
        const filename = `${tmpdir()}/${Math.random().toString(36)}`
        await writeFile(`${filename}.gif`, gif)
        await this.exec(
            `ffmpeg -f gif -i ${filename}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${filename}.mp4`
        )
        const buffer = await readFile(`${filename}.mp4`)
        Promise.all([unlink(`${filename}.gif`), unlink(`${filename}.mp4`)])
        return buffer
    }

    public fetch = async <T>(url: string): Promise<T> => (await axios.get(url)).data

    public getBuffer = async (url: string): Promise<Buffer> =>
        (
            await axios.get<Buffer>(url, {
                responseType: 'arraybuffer'
            })
        ).data

    public exec = promisify(exec)

    public chunk = <T>(arr: T[], length: number): T[][] => {
        const result = []
        for (let i = 0; i < arr.length / length; i++) result.push(arr.slice(i * length, i * length + length))
        return result
    }

    public parseChessBoard = (board: string[]): string[][] =>
        this.chunk(
            board.map((tile) => {
                if (tile === 'bK') return 'k'
                if (tile === 'wK') return 'K'
                if (tile === 'wk') return 'N'
                if (tile === 'bk') return 'n'
                if (tile[0] === 'w') return tile[1].toUpperCase()
                return tile[1].toLowerCase()
            }),
            8
        ).reverse()

    public endChess = async (
        handler: MessageHandler,
        client: Client,
        jid: string,
        winner?: 'Black' | 'White' | string
    ): Promise<void> => {
        const game = handler.chess.games.get(jid)
        const challenge = handler.chess.challenges.get(jid)
        if (!game || !challenge) return void null
        const w = winner?.endsWith('.net')
            ? winner
            : winner === 'White'
            ? challenge.challenger
            : winner === 'Black'
            ? challenge.challengee
            : null
        handler.chess.challenges.set(jid, undefined)
        handler.chess.games.set(jid, undefined)
        handler.chess.ongoing.delete(jid)
        if (!w)
            return void (await client.sendMessage(jid, {
                text: 'Match ended in a Draw!'
            }))
        await client.DB.setExp(w, 1500)
        if (w)
            return void (await client.sendMessage(jid, {
                text: `@${w.split('@')[0]} Won`,
                mentions: [w]
            }))
    }
}
