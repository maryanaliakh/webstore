export const getSearchParam = (search: string, param: string) => {
    let params = new URLSearchParams(search);
    return params.get(param) || undefined
}

export const getSearchParams = (search: string, param: string) => {
    let params = new URLSearchParams(search);
    return params.getAll(param)
}