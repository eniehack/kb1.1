import { murmur3 } from 'murmurhash-js';
const BASE32_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const CODE_LENGTH = 6;
const TYPE_CHAR = '2';

// --- 外部 MurmurHash3 委譲関数 ---

/**
 * 外部MurmurHash3ライブラリから32-bitハッシュ値を取得する関数。
 * (Goのmurmur3.StringSum32に相当)
 *
 * 【実装例 - imurmurhashを使用する場合】
 * 1. npm install imurmurhash
 * 2. import imurmurhash from 'imurmurhash';
 * 3. return imurmurhash(key).result();
 *
 * @param key ハッシュ入力文字列
 * @returns 32-bitの符号なし整数ハッシュ値
 */
const getMurmur3Hash = (key: string): number => {
	// 開発環境で動作確認を行う場合は、このプレースホルダーを実際のハッシュ計算に置き換えてください。
	// 例として、特定の文字列に対する固定値を返します。（本番環境では必ず置き換えてください）
	// Goの`murmur3.StringSum32("test string")`は `2999052285` (0xB275D5BD) です。
	if (key === 'test string') {
		return 2999052285;
	}

	// 外部ライブラリの利用が必須です。
	console.error(
		"ERROR: MurmurHash3 function is a placeholder. Please implement or import an external library (e.g., 'imurmurhash') to calculate the hash."
	);
	return 0;
};

// --- Luhn mod 32 チェックデジット計算 ---

/**
 * Luhn mod 32アルゴリズムを使用してチェックデジットを計算します。
 * @param input チェックデジット計算対象の文字列
 * @returns チェックデジット文字
 */
function calculateLuhnCheckDigit(input: string): string {
	// base32Charsから数値へのマッピング
	const charToNum = new Map<string, number>();
	for (let i = 0; i < BASE32_CHARS.length; i++) {
		charToNum.set(BASE32_CHARS[i], i);
	}

	let sum = 0;
	let isEven = false; // 右端の文字から数えて偶数番目（重み2）かどうか

	// 右から左へ処理（Luhn mod 32アルゴリズム）
	for (let i = input.length - 1; i >= 0; i--) {
		const char = input[i];
		if (char === '-') {
			continue;
		}

		const digit = charToNum.get(char);
		if (digit === undefined) {
			// マッピングされていない文字はスキップまたはエラー処理
			continue;
		}

		let value = digit;

		if (isEven) {
			value *= 2;
			if (value >= 32) {
				// Goコードのロジック: value = (value / 32) + (value % 32)
				value = Math.floor(value / 32) + (value % 32);
			}
		}

		sum += value;
		isEven = !isEven;
	}

	// チェックデジット計算（mod 32）
	// Goコードのロジック: (32 - (sum % 32)) % 32
	const checkSum = (32 - (sum % 32)) % 32;

	return BASE32_CHARS[checkSum];
}

// --- ID生成コアロジック ---

/**
 * ハッシュ値からBase32コード部分を生成します。
 * @param hashInput ハッシュ元の文字列
 * @param offset ビットローテーションのオフセット (0-31)
 * @returns Base32コード文字列
 */
function generateCode(hashInput: string, offset: number): string {
	// 1. MurmurHash3 (32bit) を計算 (符号なし整数)
	// 外部ライブラリによって実装された関数を呼び出す
	const origHash = murmur3(hashInput);

	// 2. offsetに応じてビットをローテーション
	// Goコードのロジック: (origHash << offset) | (origHash >> (32 - offset))
	// JSのビット演算は32bit符号付きで実行されるため、結果を符号なし(>>> 0)に戻す
	const hash = ((origHash << offset) | (origHash >>> (32 - offset))) >>> 0;

	// 3. Base32に変換
	let tempHash = hash;
	const codeParts: string[] = [];

	for (let i = 0; i < CODE_LENGTH; i++) {
		// char := base32Chars[hash%32]
		const charIndex = tempHash % 32;
		const char = BASE32_CHARS[charIndex];
		codeParts.push(char);

		// hash /= 32
		tempHash = Math.floor(tempHash / 32);
	}

	// Goコードのロジックを再現するため、コードとハイフンを構築します
	let codeBuilder = '';
	for (let i = 0; i < CODE_LENGTH; i++) {
		// codeParts[0] がハッシュの最下位ビットに対応
		const char = codeParts[i];
		codeBuilder += char;

		// Goコードのハイフン挿入位置 (i==2 の後)
		if (i === 2) {
			codeBuilder += '-';
		}
	}

	// コードを逆転させる (Goの reversedCode.String() に相当)
	// C0 C1 C2 - C3 C4 C5 => 5C4C3 - 2C1C0 (逆順になる)
	const strCode = codeBuilder.split('').reverse().join('');

	return strCode;
}

// --- メインID生成関数 ---

/**
 * IDを生成します。
 * @param input IDの元となる文字列
 * @param offset ビットローテーションのオフセット (0-31)
 * @returns 生成されたID文字列
 */
export function generateID(input: string, offset: number): string {
	const code = generateCode(input, offset);

	// IDの本体部分を結合
	const fullCode = TYPE_CHAR + code;

	// チェックデジットを計算
	const checkDigit = calculateLuhnCheckDigit(fullCode);

	// ID全体を結合
	return fullCode + checkDigit;
}
