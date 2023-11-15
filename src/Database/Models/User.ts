import { prop, getModelForClass } from '@typegoose/typegoose'
import { Document } from 'mongoose'

class Ban {
    @prop({ type: Boolean, required: true, default: false })
    public banned!: boolean

    @prop({ type: String })
    public reason?: string

    @prop({ type: String })
    public bannedBy?: string

    @prop({ type: String })
    public bannedIn?: string

    @prop({ type: String })
    public time?: string  
}

export class UserSchema {
    @prop({ type: String, required: true, unique: true })
    public jid!: string

    @prop({ type: () => Ban, required: true, default: () => ({ banned: false }) })
    public ban!: Ban

    @prop({ type: String, required: true })
    public tag!: string
}

export type TUserModel = UserSchema & Document

export const userSchema = getModelForClass(UserSchema)
