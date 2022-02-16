/**
 * status: 0 = 初期状態
 *         1 = 在室
 *         2 = 外室
 *         3 = アンチパスバック
 */

export interface member {
    id: number,
    name: string,
    lastname: string,
    firstname: string,
    company: string,
    enable: boolean,
    status: number
}