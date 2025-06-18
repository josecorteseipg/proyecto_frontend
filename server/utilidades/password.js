const bcrypt = require("bcrypt");
/**
 * Encripta la contraseña usando el algoritmo bcrypt
 */
const generaPasswordHash = async (password) => {
	const salt = await bcrypt.genSalt();
	const hash = await bcrypt.hash(password, salt);
	return hash;
};

/**
 * Valida la contraseña contra el hash
 */
const validaPassword = async (password, hash) => {
	const result = await bcrypt.compare(password, hash);
	return result;
};

/**
 * Verifica que el hash tenga un formato válido
 */
const esPasswordHash = (hash) => {
	if (!hash || hash.length !== 60) return false;
	try {
		bcrypt.getRounds(hash);
		return true;
	} catch {
		return false;
	}
};

module.exports = {
	generaPasswordHash,
	validaPassword,
	esPasswordHash,
};
