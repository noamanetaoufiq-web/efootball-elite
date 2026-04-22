const fs = require('fs');

const generateLogos = () => {
    const logos = [];
    let idCounter = 1;

    // Morocco (Botola Pro)
    const moroccoTeams = [
        { id: 967, name: "Raja Casablanca", logo: "https://images.seeklogo.com/logo-png/25/1/raja-club-athletic-rca-logo-png_seeklogo-256064.png" },
        { id: 968, name: "Wydad AC" },
        { id: 969, name: "AS FAR" },
        { id: 971, name: "RS Berkane" },
        { id: 974, name: "Maghreb de Fès" },
        { id: 972, name: "Ittihad Tanger" },
        { id: 970, name: "Hassania Agadir" },
        { id: 973, name: "FUS Rabat" },
        { id: 975, name: "Moghreb Tétouan" },
        { id: 977, name: "Renaissance Zemamra" },
        { id: 978, name: "Union Touarga" },
        { id: 976, name: "JS Soualem" },
        { id: 979, name: "SCC Mohammédia" },
        { id: 981, name: "Chabab Mohammédia" }
    ];

    moroccoTeams.forEach(t => {
        logos.push({ 
            id: idCounter++, 
            name: t.name, 
            logo: t.logo || `https://media.api-sports.io/football/teams/${t.id}.png`, 
            region: "Morocco" 
        });
    });

    // Europe Top Teams
    const europeTeams = [
        { id: 541, name: "Real Madrid" },
        { id: 529, name: "FC Barcelona" },
        { id: 530, name: "Atletico Madrid" },
        { id: 50, name: "Manchester City" },
        { id: 33, name: "Manchester United" },
        { id: 40, name: "Liverpool" },
        { id: 42, name: "Arsenal" },
        { id: 49, name: "Chelsea" },
        { id: 47, name: "Tottenham Hotspur" },
        { id: 66, name: "Aston Villa" },
        { id: 157, name: "Bayern Munich" },
        { id: 165, name: "Borussia Dortmund" },
        { id: 168, name: "Bayer Leverkusen" },
        { id: 85, name: "Paris Saint-Germain" },
        { id: 81, name: "Olympique de Marseille" },
        { id: 80, name: "Olympique Lyonnais" },
        { id: 496, name: "Juventus" },
        { id: 505, name: "Inter Milan" },
        { id: 489, name: "AC Milan" },
        { id: 492, name: "Napoli" },
        { id: 497, name: "AS Roma" },
        { id: 194, name: "Ajax" },
        { id: 197, name: "PSV Eindhoven" },
        { id: 196, name: "Feyenoord" },
        { id: 190, name: "Benfica" },
        { id: 211, name: "FC Porto" },
        { id: 212, name: "Sporting CP" },
        { id: 238, name: "Celtic FC" },
        { id: 239, name: "Rangers FC" }
    ];

    europeTeams.forEach(t => {
        logos.push({ id: idCounter++, name: t.name, logo: `https://media.api-sports.io/football/teams/${t.id}.png`, region: "Europe" });
    });

    // Asia & Americas (Saudi, MLS, etc)
    const worldTeams = [
        { id: 2901, name: "Al Nassr", region: "Asia" },
        { id: 2900, name: "Al Hilal", region: "Asia" },
        { id: 2902, name: "Al Ittihad", region: "Asia" },
        { id: 2905, name: "Al Ahli", region: "Asia" },
        { id: 284, name: "Yokohama Marinos", region: "Asia" },
        { id: 282, name: "Urawa Reds", region: "Asia" },
        { id: 9568, name: "Inter Miami", region: "Americas" },
        { id: 1604, name: "LA Galaxy", region: "Americas" },
        { id: 1602, name: "New York Red Bulls", region: "Americas" },
        { id: 127, name: "Flamengo", region: "Americas" },
        { id: 121, name: "Palmeiras", region: "Americas" },
        { id: 435, name: "River Plate", region: "Americas" },
        { id: 451, name: "Boca Juniors", region: "Americas" },
        { id: 1131, name: "Al Ahly", region: "Africa" },
        { id: 1132, name: "Zamalek", region: "Africa" },
        { id: 1141, name: "Esperance Tunis", region: "Africa" },
        { id: 994, name: "Mamelodi Sundowns", region: "Africa" }
    ];

    worldTeams.forEach(t => {
        logos.push({ id: idCounter++, name: t.name, logo: `https://media.api-sports.io/football/teams/${t.id}.png`, region: t.region });
    });

    // Generate remaining to hit 320+ (Generic/Fictional)
    const regions = ["Europe", "Asia", "Americas", "Africa"];
    const prefixes = ["FC", "Sporting", "Real", "Atletico", "Union", "United"];
    const cities = ["London", "Tokyo", "Cairo", "Dubai", "Sydney", "Berlin", "Paris", "Seoul", "Rio", "Lisbon", "Riyadh", "Doha", "Casablanca", "Madrid", "Rome"];
    
    while(logos.length < 320) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const c = cities[Math.floor(Math.random() * cities.length)];
        const r = regions[Math.floor(Math.random() * regions.length)];
        const generatedName = `${p} ${c} ${Math.floor(Math.random() * 100)}`;
        
        const logoUrl = `https://ui-avatars.com/api/?name=${generatedName.replace(' ', '+')}&background=random&color=fff&rounded=true&bold=true`;
        
        logos.push({
            id: idCounter++,
            name: generatedName,
            logo: logoUrl,
            region: r
        });
    }

    fs.writeFileSync('frontend/src/data/logos.json', JSON.stringify(logos, null, 2));
    console.log(`Generated ${logos.length} logos.`);
};

// Ensure dir exists
if (!fs.existsSync('frontend/src/data')){
    fs.mkdirSync('frontend/src/data', { recursive: true });
}

generateLogos();
