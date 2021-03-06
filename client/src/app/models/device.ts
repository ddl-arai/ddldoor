export interface device {
    id: number,
    name: string,
    func: string,
    status: number,
    openStartTime?: number,
    timeout: number,
    open?: boolean,
    partnerId?: number,
    virtual?: boolean
}