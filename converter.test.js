// converter.test.js
const { romanToArabic, arabicToRoman } = require('./index'); // O './converter' si lo separaste

describe('romanToArabic (R2A) Tests', () => {
    // 1. Casos de éxito
    test('Debe convertir numeros romanos simples correctamente', () => {
        expect(romanToArabic('I')).toBe(1);
        expect(romanToArabic('V')).toBe(5);
        expect(romanToArabic('X')).toBe(10);
    });

    test('Debe manejar la lógica de resta (subtraction)', () => {
        expect(romanToArabic('IV')).toBe(4);
        expect(romanToArabic('IX')).toBe(9);
        expect(romanToArabic('XIX')).toBe(19);
        expect(romanToArabic('MCMXCIV')).toBe(1994);
    });

    test('Debe ser insensible a mayúsculas/minúsculas', () => {
        expect(romanToArabic('xiv')).toBe(14);
    });

    // 2. Casos de error (basados en tus 'throw')
    test('Debe lanzar TypeError si la entrada no es una cadena', () => {
        expect(() => romanToArabic(123)).toThrow(TypeError);
        expect(() => romanToArabic('')).toThrow(TypeError); // Cadena vacía
    });
    
    test('Debe lanzar Error si encuentra símbolos no válidos', () => {
        expect(() => romanToArabic('IIA')).toThrow('Simbolos no válidos encontrador');
    });
});

describe('arabicToRoman (A2R) Tests', () => {
    // 1. Casos de éxito
    test('Debe convertir numeros arábigos simples correctamente', () => {
        expect(arabicToRoman(1)).toBe('I');
        expect(arabicToRoman(10)).toBe('X');
        expect(arabicToRoman(100)).toBe('C');
    });

    test('Debe convertir números complejos correctamente', () => {
        expect(arabicToRoman(4)).toBe('IV');
        expect(arabicToRoman(19)).toBe('XIX');
        expect(arabicToRoman(1994)).toBe('MCMXCIV');
    });

    // 2. Casos de error (basados en tus 'throw')
    test('Debe lanzar RangeError para numeros fuera de rango (1-3999)', () => {
        expect(() => arabicToRoman(0)).toThrow(RangeError);
        expect(() => arabicToRoman(4000)).toThrow(RangeError);
        expect(() => arabicToRoman(-5)).toThrow(RangeError);
    });

    test('Debe lanzar Error si la entrada no es de tipo number', () => {
        expect(() => arabicToRoman('hola')).toThrow('La entrada debe ser un número');
    });
});
