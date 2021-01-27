export interface Album {
    id?: number;
    title: string;
    year: string;
    artistId: number;
    artist?: string;
}

export interface Artist {
    id: number;
    name: string;
}
