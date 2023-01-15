let parseIntOrNull = (input: string | undefined) => {
    if (input) {
        return parseInt(input)
    }
    return null
}

export {parseIntOrNull}
