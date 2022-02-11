interface Prefix {
  literal: string;
  type: 'prefix';
}

export function prefixSplitString(prefix: Prefix): string {
  return ` /${prefix.literal} `;
}

function createPrefix(literal: string): Prefix {
  return {
    literal: literal,
    type: 'prefix',
  };
}

// for example, hello /n nikita
export const namePrefix: Prefix = createPrefix('n');
