const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Usa el puerto de Vercel (o 3000 local)

// Suponemos que tus funciones A2R y R2A están accesibles
// (por simplicidad, las incluimos aquí, pero deberían estar en otro archivo)

function romanToArabic(roman) {
	if (typeof roman !== 'string' || roman.length === 0) { 	
	throw new TypeError("La entrada debe ser una cadena no vacía de números romanos.")
}
	//robustez (ahora maneja "iv", "xix" etc.
	roman = roman.toUpperCase();
	const symbols = {
		'I': 1, 'V': 5, 'X': 10, 'L': 50,
		'C': 100, 'D':500, 'M': 1000
	};
	//2. Validar Caracteres Permitidos
	// Da errpr si no está en "IVXLCDM" = lanzar error
	if (!/^[IVXLCDM]+$/.test(roman)) {
		throw new Error("Simbolos no válidos encontrador. Usar solo I, V, X, L, C, D, M. (Regrese a roma)");
	}
	let result = 0;
	for (let i=0; i < roman.length; i++) {
		const current = symbols[roman[i]];
		const next = symbols[roman[i + 1]];
		
		//Manejo de errores
		if (current === undefined) {
			throw new Error("Símbolo desconocido: ${roman[i]}");
		}
		//Lógica de resta
		if (next > current) {
			result += (next - current);
			i++; //Saltar siguiente letra
		} else {
			result += current;
		}
	}
	return result;
}
//ejemplo: romantToArabic('IV') = 4
// XIX = 19

//2. Arábigo a Romano (AToR)
function arabicToRoman(arabic) {
	//except 1: ¿es número?
	if(typeof arabic !== 'number') {
		throw new Error('La entrada debe ser un número. No "${arabic}" ');
	};
	//except 2: ¿está dentro de rango?
	if (arabic <= 0 || arabic >= 4000) {
		//El "try - except" al estilo JS
		throw new RangeError('Número fuera de rango: ${arabic}. Debe estar entre 1 a 3999.')
	}
	
	const numerals = [
		[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'],
		[90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'],
		[9, 'IX'], [4, 'IV'], [1, 'I']
	];
	let result = '';
	let num = arabic;
	
	for (const [value, symbol] of numerals) {
		while (num >= value) {
			result += symbol;
			num -= value;
		}
	}
	return result;
}
		

// Middleware de manejo de Errores Global
// Esto es CRUCIAL para capturar tus 'throw' y devolver un error HTTP
app.use((err, req, res, next) => {
    // Si la excepción es un error conocido (TypeError, RangeError, o Error genérico)
    if (err instanceof TypeError || err instanceof RangeError || err instanceof Error) {
        // Devolvemos 400 Bad Request
        res.status(400).json({ 
            error: err.name, 
            message: err.message 
        });
    } else {
        // Para errores inesperados, devolvemos 500 Internal Server Error
        console.error(err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Ocurrió un error inesperado en el servidor.'
        });
    }
});
// ----------------------------------------------

/**
 * 🔗 ENDPOINT 1: Romano a Arábigo (R2A)
 * Ejemplo: /r2a/IV -> { "roman": "IV", "arabic": 4 }
 */
app.get('/r2a/:romanNum', (req, res, next) => {
    try {
        const roman = req.params.romanNum;
        // La función romanToArabic puede lanzar (throw) errores, por eso la metemos en un try-catch.
        // Ojo: En Express moderno, si no hay un 'return' después del 'throw', puedes usar 'next(error)'
        const arabic = romanToArabic(roman);
        
        res.json({
            roman: roman.toUpperCase(),
            arabic: arabic
        });
    } catch (error) {
        // En lugar de manejarlo aquí, pasamos el error al middleware global (app.use)
        next(error); 
    }
});

/**
 * 🔗 ENDPOINT 2: Arábigo a Romano (A2R)
 * Ejemplo: /a2r/4 -> { "arabic": 4, "roman": "IV" }
 */
app.get('/a2r/:arabicNum', (req, res, next) => {
    try {
        // Convierte el parámetro de la URL a un número entero
        const arabic = parseInt(req.params.arabicNum, 10); 
        
        // Si la conversión falla (e.g., /a2r/hola), arabic será NaN.
        if (isNaN(arabic)) {
            throw new TypeError("El parámetro de entrada debe ser un número entero.");
        }

        const roman = arabicToRoman(arabic);

        res.json({
            arabic: arabic,
            roman: roman
        });
    } catch (error) {
        // Pasamos el error al middleware global
        next(error);
    }
});

module.exports = {
    romanToArabic,
    arabicToRoman,
    app
};

if (require.main === module) {
   
    app.listen(port, () => {
        console.log(`API escuchando en http://localhost:${port}`);
    });
}
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`);
});
