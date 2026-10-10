export function randfloat(min, max) {
    return (Math.random() * (max - min)) + min
}

export function randint(min, max) {
    return Math.floor(randfloat(min, max))
}