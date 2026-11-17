export interface Collection {
    id: number;
    name: string;
    image_1: string;
    image_2: string;
    image_3: string;
}

export interface CollectionState {
    data: Collection[];
}

export const LOAD_COLLECTION = 'COLLECTION/LOAD';
export const LOAD_LATEST_COLLECTION = 'COLLECTION/LOAD_LATEST_COLLECTION';

export interface LoadCollectionAction {
    type: typeof LOAD_COLLECTION,
    payload: {
        data: Collection[];
    }
}

export interface LoadLatestCollectionAction {
    type: typeof LOAD_LATEST_COLLECTION,
    payload: {
        data: Collection;
    }
}

export type CollectionActions = LoadCollectionAction | LoadLatestCollectionAction;