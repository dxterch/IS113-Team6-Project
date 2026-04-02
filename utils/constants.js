module.exports = {
    // new Set(...) - Collection of values where each value must be unique
    // ... - Extracts unique values out of the Set
    // .sort() - Organizes the countries in alphabetically order
    COUNTRIES: [...new Set([
        "USA", "United Kingdom", "Canada", "South Korea", "Japan",
        "Australia", "Singapore", "Malaysia", "Nigeria", "Colombia",
        "Sweden", "France", "Germany", "Puerto Rico", "Brazil", "India"
    ])].sort(),
    
    GENDERS: [...new Set(['Male', 'Female', 'Other'])]
};