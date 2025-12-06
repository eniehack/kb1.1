import { expect, test } from 'vitest';
import { generateID, calculateLuhnCheckDigit } from '../src/lib/generateId';

test('adds 1 + 2 to equal 3', () => {
	expect(generateID('hoge', 0)).toBe('2K36-VNNW');
});

test('calculate checkdigit only 32 char', () => {
	expect(calculateLuhnCheckDigit('2VXMZRQ') === '3').toBe(true);
});

test('invalid checkdigit', () => {
	expect(calculateLuhnCheckDigit('2VXMZRU') === '3').toBe(false);
});

test('calculate checkdigit 32 char with hyphen', () => {
	expect(calculateLuhnCheckDigit('2VXM-ZRQ') === '3').toBe(true);
});

test('unexpected char', () => {
	expect(calculateLuhnCheckDigit('2VXM+ZRQ') === '3').toBe(true);
});
