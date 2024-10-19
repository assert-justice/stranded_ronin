/**
 * Small fast counter 32 random number generator
 * Example:
 * const R = sfc32(0, 12345, 0, 1)
 * @param a 
 * @param b 
 * @param c 
 * @param d 
 * @returns 
 */

export function sfc32(a: number, b: number, c: number, d: number){
    return function(){
        a |= 0; b |= 0; c |= 0; d |= 0;
        const t = (a + b | 0) + d | 0;
        d = d + 1 | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = c << 21 | c >>> 11;
        c = c + t | 0;
        return (t >>> 0) // 4294967296
    }
}