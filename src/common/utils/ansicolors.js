// Foreground colors mapping: code -> color
const fgColors = {
    30: 'black',
    31: 'red',
    32: 'green',
    33: 'yellow',
    34: 'blue',
    35: 'purple',
    36: 'cyan',
    37: 'white'
};

/**
 * Reverses ANSI color coding present in the specified string buffer.
 *
 * ANSI color codes for reference:
 *
╔══════════╦════════════════════════════════╦═════════════════════════════════════════════════════════════════════════╗
║  Code    ║             Effect             ║                                   Note                                  ║
╠══════════╬════════════════════════════════╬═════════════════════════════════════════════════════════════════════════╣
║ 0        ║  Reset / Normal                ║  all attributes off                                                     ║
║ 1        ║  Bold or increased intensity   ║                                                                         ║
║ 2        ║  Faint (decreased intensity)   ║  Not widely supported.                                                  ║
║ 3        ║  Italic                        ║  Not widely supported. Sometimes treated as inverse.                    ║
║ 4        ║  Underline                     ║                                                                         ║
║ 5        ║  Slow Blink                    ║  less than 150 per minute                                               ║
║ 6        ║  Rapid Blink                   ║  MS-DOS ANSI.SYS; 150+ per minute; not widely supported                 ║
║ 7        ║  [[reverse video]]             ║  swap foreground and background colors                                  ║
║ 8        ║  Conceal                       ║  Not widely supported.                                                  ║
║ 9        ║  Crossed-out                   ║  Characters legible, but marked for deletion.  Not widely supported.    ║
║ 10       ║  Primary(default) font         ║                                                                         ║
║ 11–19    ║  Alternate font                ║  Select alternate font `n-10`                                           ║
║ 20       ║  Fraktur                       ║  hardly ever supported                                                  ║
║ 21       ║  Bold off or Double Underline  ║  Bold off not widely supported; double underline hardly ever supported. ║
║ 22       ║  Normal color or intensity     ║  Neither bold nor faint                                                 ║
║ 23       ║  Not italic, not Fraktur       ║                                                                         ║
║ 24       ║  Underline off                 ║  Not singly or doubly underlined                                        ║
║ 25       ║  Blink off                     ║                                                                         ║
║ 27       ║  Inverse off                   ║                                                                         ║
║ 28       ║  Reveal                        ║  conceal off                                                            ║
║ 29       ║  Not crossed out               ║                                                                         ║
║ 30–37    ║  Set foreground color          ║  See color table below                                                  ║
║ 38       ║  Set foreground color          ║  Next arguments are `5;<n>` or `2;<r>;<g>;<b>`, see below               ║
║ 39       ║  Default foreground color      ║  implementation defined (according to standard)                         ║
║ 40–47    ║  Set background color          ║  See color table below                                                  ║
║ 48       ║  Set background color          ║  Next arguments are `5;<n>` or `2;<r>;<g>;<b>`, see below               ║
║ 49       ║  Default background color      ║  implementation defined (according to standard)                         ║
║ 51       ║  Framed                        ║                                                                         ║
║ 52       ║  Encircled                     ║                                                                         ║
║ 53       ║  Overlined                     ║                                                                         ║
║ 54       ║  Not framed or encircled       ║                                                                         ║
║ 55       ║  Not overlined                 ║                                                                         ║
║ 60       ║  ideogram underline            ║  hardly ever supported                                                  ║
║ 61       ║  ideogram double underline     ║  hardly ever supported                                                  ║
║ 62       ║  ideogram overline             ║  hardly ever supported                                                  ║
║ 63       ║  ideogram double overline      ║  hardly ever supported                                                  ║
║ 64       ║  ideogram stress marking       ║  hardly ever supported                                                  ║
║ 65       ║  ideogram attributes off       ║  reset the effects of all of 60-64                                      ║
║ 90–97    ║  Set bright foreground color   ║  aixterm (not in standard)                                              ║
║ 100–107  ║  Set bright background color   ║  aixterm (not in standard)                                              ║
╚══════════╩════════════════════════════════╩═════════════════════════════════════════════════════════════════════════╝
 * @param {string} str Input string for color coding parse.
 * @returns Color coded string in HTML.
 */

export function ansiColors(input) {
    /* eslint-disable no-control-regex */
    const defaultEndElement = '</span>';

    let str = input;
    Object.keys(fgColors).forEach(code => {
        const span = `<span style="color: ${fgColors[code]}">`;

        // `\x1b[Xm` == `\x1b[0;Xm` sets foreground color to `X`
        str = str.replace(new RegExp(`\x1b\\[${code}m`, 'g'), span)
            .replace(new RegExp(`\x1b\\[0;${code}m`, 'g'), span);
    });

    // `\x1b[1m` enables bold font, `\x1b[22m` disables it
    str = str.replace(/\x1b\[1m/g, '<b>').replace(/\x1b\[22m/g, '</b>');

    // `\x1b[3m` enables italics font, `\x1b[23m` disables it
    str = str.replace(/\x1b\[3m/g, '<i>').replace(/\x1b\[23m/g, '</i>');

    // Reset
    str = str.replace(/\x1b\[0m/g, defaultEndElement);

    // Default foreground color
    str = str.replace(/\x1b\[39m/g, defaultEndElement);

    /* eslint-enable no-control-regex */

    return str;
}
