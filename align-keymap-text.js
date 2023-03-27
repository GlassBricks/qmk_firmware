const layout = `
######     ######
######     ######
######## ########
   ##### #####
`.trim()

const indexToRC = []

const lines = layout.split("\n")
for (let row = 0; row < lines.length; row++) {
    const line = lines[row]
    for (let col = 0; col < line.length; col++) {
        if (line[col] !== " ") {
            indexToRC.push([row, col])
        }
    }
}
console.log(indexToRC)

const preIndent = "\t\t"
const tabWidth = 4
/**
 * @param {string} input
 */
function formatList(input) {
    // const parts = input.split(",").map(x => x.trim())
    // split by comma, but respect commas inside parens
    /** @type {string[]} */
    const parts = []
    let current = ""
    let parens = 0
    for (let i = 0; i < input.length; i++) {
        const char = input[i]
        if (char === "," && parens === 0) {
            parts.push(current.trim() + ",")
            current = ""
        } else {
            current += char
            if (char === "(") {
                parens++
            } else if (char === ")") {
                parens--
            }
        }
    }
    parts.push(current.trim())
    // console.log(parts)

    let tabsNeededForCol = Array.from({length: 20}, () => 3)

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const [, col] = indexToRC[i]
        const neededTabs = Math.ceil((part.length + 1) / tabWidth)
        tabsNeededForCol[col] = Math.max(tabsNeededForCol[col], neededTabs)
    }


    let result = preIndent
    let lastRow = 0
    let lastCol = 0
    let lastWidth = 0
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        const [row, col] = indexToRC[i]
        if (row !== lastRow) {
            result += "\n" + preIndent
            lastCol = 0
            lastRow = row
        } else {
            if (lastCol < col){
                const spaces = tabsNeededForCol[lastCol] * tabWidth
                const actuallyNeededTabs = Math.ceil((spaces - lastWidth) / tabWidth)
                result += "\t".repeat(actuallyNeededTabs)
                lastCol++
            }
        }
        for (; lastCol < col; lastCol++) {
            result += "\t".repeat(tabsNeededForCol[lastCol])
        }
        result += part
        lastWidth = part.length
    }
    return "\n" + result + "\n\t"
}

/** @param {string} input */
function format(input) {
    const regex = /LAYOUT\(([\S\s]*?)\),?\n/g

    // console.log(regex.exec(input))

    return input.replaceAll(regex, (_, x) => {
        // console.log(x)
        return `LAYOUT(${formatList(x)}),\n`
    })
}

// console.log(format(layout))
const input = `

const uint16_t PROGMEM keymaps[][MATRIX_ROWS][MATRIX_COLS] = {
	[_BASE] = LAYOUT(
		KC_TAB,		KC_Q,	KC_W,	KC_F,	KC_P,		KC_B,																	KC_J,	KC_L,	KC_U,		KC_Y,	KC_SCLN,	KC_SLSH,
		KC_ESC,		KC_A,	KC_R,	KC_S,	KC_T,		KC_G,																	KC_M,	KC_N,	KC_E,		KC_I,	KC_O,		KC_BSPC,
		KC_LCTL,	KC_Z,	KC_X,	KC_C,	KC_D,		KC_V,			KC_MINS,	KC_BSLS,			CW_TOGG,	KC_UNDS,	KC_K,	KC_H,	KC_COMM,	KC_DOT,	KC_QUOT,	KC_ENT,
									KC_NO,	KC_LGUI,	OSM(MOD_LSFT),	MO(3),		MO(2),				MO(4),		KC_SPC,		MO(1),	MO(5),	KC_NO
	),
	[_SYM] = LAYOUT(
		KC_TRNS,	QK_MACRO_0,	KC_LBRC,	KC_RBRC,	KC_PERC,	KC_AT,																	KC_TILD,	KC_PIPE,	KC_AMPR,	KC_QUES,	KC_TRNS,	KC_TRNS,
		KC_TRNS,	KC_EXLM,	KC_MINS,	KC_PLUS,	KC_EQL,		KC_HASH,																KC_CIRC,	KC_COLN,	KC_LPRN,	KC_RPRN,	KC_RCBR,	KC_TRNS,
		MO(2),		KC_ASTR,	KC_LT,		KC_GT,		KC_SLSH,	KC_BSLS,	KC_UNDS,		KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_DOT,		KC_LCBR,	KC_DLR,		KC_GRV,		KC_DQUO,	KC_TRNS,
											KC_TRNS,	KC_TRNS,	KC_TRNS,	LT(3,KC_SPC),	KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS
	),
	[_NUM] = LAYOUT(
		KC_TRNS,	KC_UNDS,	KC_LBRC,	KC_RBRC,	KC_PERC,	KC_AT,																	KC_TILD,	KC_7,		KC_8,	KC_9,	KC_TRNS,	KC_TRNS,
		KC_TRNS,	KC_EXLM,	KC_MINS,	KC_PLUS,	KC_EQL,		KC_HASH,																KC_CIRC,	KC_4,		KC_5,	KC_6,	KC_0,		KC_TRNS,
		KC_TRNS,	KC_ASTR,	KC_LT,		KC_GT,		KC_SLSH,	KC_NUHS,	KC_TRNS,		KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_DOT,		KC_1,		KC_2,	KC_3,	KC_COMM,	KC_TRNS,
											KC_TRNS,	KC_TRNS,	KC_TRNS,	LT(3,KC_SPC),	KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS
	),
	[_EXT] = LAYOUT(
		KC_TRNS,	TO(6),			KC_ESC,			KC_SPC,			KC_NO,			KC_NO,																KC_PGUP,	KC_HOME,	KC_UP,		KC_END,		KC_NO,		KC_TRNS,
		KC_TRNS,	OSM(MOD_LGUI),	OSM(MOD_LALT),	OSM(MOD_LSFT),	OSM(MOD_LCTL),	LCTL(KC_A),															KC_PGDN,	KC_LEFT,	KC_DOWN,	KC_RGHT,	KC_DEL,		KC_TRNS,
		MO(4),		LCTL(KC_Z),		LCTL(KC_X),		LCTL(KC_C),		KC_TAB,			LCTL(KC_V),	KC_TRNS,	KC_SCRL,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_BSPC,	KC_APP,		KC_INS,		KC_PSCR,	KC_TRNS,
													KC_TRNS,		KC_TRNS,		KC_TRNS,	KC_TRNS,	KC_TRNS,			KC_TRNS,	KC_TRNS,		KC_TRNS,	KC_TRNS,	KC_TRNS
	),
	[_FUN] = LAYOUT(
		KC_TRNS,	KC_TRNS,		KC_MPRV,		KC_MPLY,		KC_MNXT,		KC_VOLU,															KC_TRNS,	KC_F7,		KC_F8,	KC_F9,	KC_F12,	KC_TRNS,
		KC_TRNS,	OSM(MOD_LGUI),	OSM(MOD_LALT),	OSM(MOD_LSFT),	OSM(MOD_LCTL),	KC_VOLD,															KC_TRNS,	KC_F4,		KC_F5,	KC_F6,	KC_F10,	KC_TRNS,
		KC_TRNS,	KC_TRNS,		KC_TRNS,		KC_TRNS,		LCTL(KC_TAB),	KC_MUTE,	KC_TRNS,	KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_F1,		KC_F2,	KC_F3,	KC_F11,	KC_TRNS,
													KC_TRNS,		KC_TRNS,		KC_TRNS,	KC_TRNS,	KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS
	),
	[_ADJ] = LAYOUT(
		EE_CLR,		RGB_RMOD,	RGB_HUI,	RGB_SAI,	RGB_VAI,	KC_TRNS,															KC_WH_U,	KC_BTN1,	KC_MS_U,	KC_BTN2,	KC_ACL0,	KC_TRNS,
		KC_TRNS,	RGB_MOD,	RGB_HUD,	RGB_SAD,	RGB_VAD,	RGB_TOG,															KC_WH_D,	KC_MS_L,	KC_MS_D,	KC_MS_R,	KC_ACL1,	KC_TRNS,
		KC_TRNS,	KC_TRNS,	KC_TRNS,	RGB_SPD,	RGB_SPI,	KC_TRNS,	KC_TRNS,	KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_BTN4,	KC_BTN3,	KC_BTN5,	KC_ACL2,	KC_TRNS,
											KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS
	),
	[_YAY] = LAYOUT(
		KC_TAB,		KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,															KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,
		KC_ESC,		KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,															KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,
		KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_MINS,	KC_BSLS,			KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,	KC_TRNS,
											KC_TRNS,	TG(6),		KC_LSFT,	KC_SPC,		KC_LALT,			KC_TRNS,	KC_TRNS,	KC_TRNS,	TG(6),		KC_TRNS
	),
};

`

console.log(format(input))
require("fs").writeFileSync("keymap.c", format(input))
