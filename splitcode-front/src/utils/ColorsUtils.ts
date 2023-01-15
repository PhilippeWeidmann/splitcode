function pastel_colour(input_str: string): string {

    //adjust base colour values below based on theme
    const baseRed = 220;
    const baseGreen = 220;
    const baseBlue = 220;

    //lazy seeded random hack to get values from 0 - 256
    //for seed just take bitwise XOR of first two chars
    let seed = input_str.charCodeAt(0) ^ input_str.charCodeAt(1);
    const rand_1 = Math.abs((Math.sin(seed++) * 10000)) % 256;
    const rand_2 = Math.abs((Math.sin(seed++) * 10000)) % 256;
    const rand_3 = Math.abs((Math.sin(seed++) * 10000)) % 256;

    //build colour
    const red = Math.round((rand_1 + baseRed) / 2);
    const green = Math.round((rand_2 + baseGreen) / 2);
    const blue = Math.round((rand_3 + baseBlue) / 2);

    return rgbToHex(red, green, blue);
}

const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')

function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    let child = name.charAt(0);
    if (name.indexOf(' ') > -1) {
        child = `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: child,
    };
}

const pastelPalette = [
    "#FFF1E6",
    "#FDE2E4",
    "#FAD2E1",
    "#E2ECE9",
    "#BEE1E6",
    "#F0EFEB",
    "#DFE7FD",
    "#CDDAFD",
    "#EAE4E9",
    "#D7E1FD"
]

export {pastel_colour, stringAvatar, pastelPalette};
