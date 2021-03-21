export interface Message {
    id: number;
    senderId: number;
    senderPhotoUrl: string;
    senderKnownAs: string;
    recipientId: number;
    recipientPhotoUrl: string;
    recipientKnownAs: string;
    content: string;
    dateRead: Date;
    isRead: boolean;
    messageSent: Date;

}
