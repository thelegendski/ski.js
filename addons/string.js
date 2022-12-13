const randomString = val => {
    let result = '', 
        consonants = ['b', 'c', 'd', 'f', 'g', 'h', 
        'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 
        't', 'v', 'w', 'x', 'y', 'z'], 
        vowels = ['a', 'e', 'i', 'o', 'u', 'y'], 
        str = ''

    if(typeof val === 'number') 
        for(let i = val; i--;) 
            str += (random() < 0.5 ? 'v' : 'c')
    else str = val

    for(const char of str) 
        result += char === 'v' ? vowels[random(6) | 0] : consonants[random(21) | 0]

    return result
}
