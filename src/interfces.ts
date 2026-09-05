export interface BookFile {
    fileCover: string
    fileName: string
    fileBook:string
}

export interface Book {
    id: string
    title: string
    description: string
    authors: string
    favorite: boolean
    file: BookFile;
}
