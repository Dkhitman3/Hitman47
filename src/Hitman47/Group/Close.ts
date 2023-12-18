import { BaseCommand, Command, Message } from '../../Structures';

@Command('close', {
    description: 'Close the group chat',
    category: 'group',
    usage: 'close',
    exp: 5,
    cooldown: 10
})
export default class CloseCommand extends BaseCommand {
    public async execute({ from, reply, groupMetadata }: Message): Promise<void> {
        if (!groupMetadata) {
            return void reply('*Try Again!*');
        }

        const { announce } = groupMetadata;

        if (announce) {
            return void reply("The group's already closed");
        }

        await this.updateGroupAnnouncement(from, reply);
    }

    private async updateGroupAnnouncement(from: string, reply: Function): Promise<void> {
        try {
            await this.client.groupSettingUpdate(from, 'announcement');
        } catch (error) {
            // Handle error if needed
            console.error('Error occurred while updating group announcement:', error);
            reply('An error occurred while trying to close the group chat.');
        }
    }
}
