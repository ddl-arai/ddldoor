export interface card {
    idm: string,
    id: number,
    enable: boolean,
    expire: string,  // Use new Date()
    remark: string,
    banDevids: number[]
}