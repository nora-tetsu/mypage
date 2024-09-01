
export type FileData = {
    id: string,
    title: string,
    type: 'document' | 'folder',
    permission: number,
    collapsed?: boolean,
    children?: string[],
}
export type ChangeFileRequest = {
    action: 'edit' | 'move' | 'create',
    type: 'document' | 'folder',
    file_id?: string, // edit | move
    parent_id?: string, // move | create
    index?: number, // move | create
    title?: string, // edit | create
}
export type NodeData = {
    id: string,
    content: string,
    note: string,
    checked?: boolean,
    checkbox?: boolean,
    color?: number, // 0~6
    heading?: number, // 0~3
    created: number,
    modified: number,
    collapsed?: boolean,
    children: string[], // idの配列
}
export type SendToInboxRequest = {
    index: number,
    content: string,
    note?: string,
    checked?: boolean,
    checkbox?: boolean,
    heading?: number,
    color?: number,
    token?: string,
}

export class DynalistClient{
    token: string;
    constructor(token: string) {
        this.token = token;
    }
    file = {
        list: async () => {
            return await fetch('https://dynalist.io/api/v1/file/list', {
                method: 'POST',
                body: JSON.stringify({
                    token: this.token,
                }),
            })
                .then(response => response.json())
                .then(json => json.files as FileData[])
        },
        edit: async (changes: ChangeFileRequest[]) => {
            return await fetch('https://dynalist.io/api/v1/file/edit', {
                method: 'POST',
                body: JSON.stringify({
                    token: this.token,
                    changes: changes,
                }),
            })
                .then(response => response.json())
        }
    }
    doc = {
        read: async (fileId: string) => {
            return await fetch('https://dynalist.io/api/v1/doc/read', {
                method: 'POST',
                body: JSON.stringify({
                    token: this.token,
                    'file_id': fileId,
                }),
            })
                .then(response => response.json())
                .then(json => json.nodes as NodeData[])
        }
    }
    inbox = {
        add: async (req: SendToInboxRequest) => {
            req.token = this.token;
            return await fetch('https://dynalist.io/api/v1/inbox/add', {
                method: 'POST',
                body: JSON.stringify(req),
            })
                .then(response => response.json() as Promise<{
                    _code: string,
                    _msg: string,
                    file_id: string,
                    node_id: string,
                    index: number,
                }>)
        }
    }
}
