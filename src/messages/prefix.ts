interface Prefix {
    literal: string;
    type: 'prefix';
}

export function prefixSplitString(prefix: Prefix): string {
    return " /"+ prefix.literal + " ";
}

// for example, hello /n nikita
export const namePrefix: Prefix = {
    literal: 'n',
    type: 'prefix',
}