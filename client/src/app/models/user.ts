export interface user {
    email: string,
    password: string,
    admin: false,
    associated_member_id?: number,
    messageIds?: number[],
    tutorial?: boolean
}