const bcrypt = require('bcryptjs');

async function generateHash(password) {
  try {
    // Generar un nuevo salt
    const salt = await bcrypt.genSalt(10);
    console.log('Generated salt:', salt);
    
    // Generar el hash
    const hash = await bcrypt.hash(password, salt);
    console.log('Password:', password);
    console.log('Generated hash:', hash);
    
    // Verificar el hash
    const isValid = await bcrypt.compare(password, hash);
    console.log('Verification test:', isValid);
    
    // Verificar con el hash existente
    const existingHash = '$2b$10$aF2UhKKQCx4rnZc951RPl.mFtaYi0iD0ylaWBNhD/Cz7uhA2MXVqe';
    const isValidWithExisting = await bcrypt.compare(password, existingHash);
    console.log('Verification with existing hash:', isValidWithExisting);
    
    // Generar un hash más simple para pruebas
    const simpleHash = await bcrypt.hash(password, 10);
    console.log('Simple hash:', simpleHash);
    const isValidSimple = await bcrypt.compare(password, simpleHash);
    console.log('Verification with simple hash:', isValidSimple);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Generar hash para admin123
generateHash('admin123'); 