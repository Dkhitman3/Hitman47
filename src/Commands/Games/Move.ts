import { Command, BaseCommand, Message } from '../../Structures'
import { IArgs } from '../../Types'
import { genRealMove } from 'chess-node'
import CIG from 'chess-image-generator-ts'

@Command('move', {
    description: 'chess game move',
    cooldown: 10,
    exp: 10,
    usage: 'move',
    category: 'games'
})
export default class extends BaseCommand {
    public override execute = async (M: Message, { args }: IArgs): Promise<void> => {
        const print = (msg: string) => {
            if (msg === 'Invalid Move' || msg === 'Not your turn') return void M.reply(msg)
            this.client.sendMessage(M.from, {
                text: msg
            })
            if (msg.includes('stalemate')) return void this.client.utils.endChess(this.handler, this.client, M.from)
            if (msg.includes('wins')) {
                const winner = msg.includes('Black wins') ? 'Black' : 'White'
                return void this.client.utils.endChess(this.handler, this.client, M.from, winner)
            }
        }
        const g = this.handler.chess.games.get(M.from)
        if (!g) return void M.reply('No Chess sessions are currently going on')
        if (args.length > 3 || args.length < 2)
            return void M.reply(
                `The move command must be formatted like: \"${this.client.config.prefix}move fromTile toTile\"`
            )
        if (args[0] == 'castle') {
            const to = args[1]
            if (to.length != 2 || !(typeof to[0] == 'string') || isNaN(parseInt(to[1])))
                return void M.reply(
                    "A move's fromTile and toTile must be of the from 'XZ', where X is a letter A-H, and Z is a number 1-8."
                )
            const move = {
                piece: genRealMove(to)
            }
            return void g.eventEmitter.emit(M.from, move, print, M.sender.jid, () => async () => {
                const cig = new CIG()
                cig.loadArray(this.client.utils.parseChessBoard(g.board.getPieces(g.white, g.black)))
                let sent = false
                while (!sent) {
                    try {
                        await cig.generateBuffer().then(async (data) => await M.reply(data, 'image'))
                        sent = true
                    } catch (err) {
                        continue
                    }
                }
            })
        }
        const from = args[0]
        const to = args[1]
        if (
            from.length != 2 ||
            !(typeof from[0] == 'string') ||
            isNaN(parseInt(from[1])) ||
            to.length != 2 ||
            !(typeof to[0] == 'string') ||
            isNaN(parseInt(to[1]))
        )
            return void M.reply(
                "A move's fromTile and toTile must be of the from 'XZ', where X is a letter A-H, and Z is a number 1-8."
            )
        const toMove = genRealMove(to)
        const fromMove = genRealMove(from)
        if (toMove == null || fromMove == null)
            return void M.reply(
                "A move's fromTile and toTile must be of the from 'XZ', where X is a letter A-H, and Z is a number 1-8."
            )
        const move = {
            from: fromMove,
            to: toMove
        }
        return void g.eventEmitter.emit(M.from, move, print, M.sender.jid, async () => {
            const cig = new CIG()
            cig.loadArray(this.client.utils.parseChessBoard(g.board.getPieces(g.white, g.black)))
            let sent = false
            while (!sent) {
                try {
                    await cig.generateBuffer().then(async (data) => await M.reply(data, 'image'))
                    sent = true
                } catch (err) {
                    continue
                }
            }
        })
    }
}
