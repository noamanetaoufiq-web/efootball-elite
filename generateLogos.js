const fs = require('fs');

const generateLogos = () => {
    const logos = [];
    let idCounter = 1;

    // Morocco (Botola Pro)
    const moroccoTeams = [
        { name: "Raja Casablanca", logo: "https://upload.wikimedia.org/wikipedia/fr/5/50/Raja_Club_Athletic_logo.png" },
        { name: "Wydad AC", logo: "https://upload.wikimedia.org/wikipedia/fr/b/b8/Wydad_Athletic_Club_%28logo%29.png" },
        { name: "AS FAR", logo: "https://upload.wikimedia.org/wikipedia/fr/5/5b/Association_sportive_des_Forces_arm%C3%A9es_royales_%28football%29_logo.png" },
        { name: "RS Berkane", logo: "https://upload.wikimedia.org/wikipedia/fr/a/a2/RSB_logo.png" },
        { name: "Hassania Agadir", logo: "https://upload.wikimedia.org/wikipedia/fr/6/69/Hassania_Union_Sport_d%27Agadir.png" },
        { name: "Ittihad Tanger", logo: "https://upload.wikimedia.org/wikipedia/fr/e/eb/Ittihad_Riadhi_de_Tanger_%28logo%29.png" },
        { name: "Maghreb de Fès", logo: "https://upload.wikimedia.org/wikipedia/fr/1/15/Maghreb_AS_logo.png" },
        { name: "FUS Rabat", logo: "https://upload.wikimedia.org/wikipedia/fr/8/87/Fath_Union_Sport_%28logo%29.png" }
    ];

    moroccoTeams.forEach(t => {
        logos.push({ id: idCounter++, name: t.name, logo: t.logo, region: "Morocco" });
    });

    // Europe Top Teams
    const europeTeams = [
        { name: "Real Madrid", logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg" },
        { name: "FC Barcelona", logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg" },
        { name: "Manchester City", logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg" },
        { name: "Manchester United", logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg" },
        { name: "Liverpool", logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg" },
        { name: "Arsenal", logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg" },
        { name: "Chelsea", logo: "https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" },
        { name: "Bayern Munich", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg" },
        { name: "Borussia Dortmund", logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg" },
        { name: "Paris Saint-Germain", logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg" },
        { name: "Juventus", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg" },
        { name: "AC Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Logo_of_AC_Milan.svg" },
        { name: "Inter Milan", logo: "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg" }
    ];

    europeTeams.forEach(t => {
        logos.push({ id: idCounter++, name: t.name, logo: t.logo, region: "Europe" });
    });

    // Generate remaining to hit 300+
    const regions = ["Europe", "Asia", "Americas", "Africa"];
    const prefixes = ["FC", "Sporting", "Real", "Atletico", "Union", "United"];
    const cities = ["London", "Tokyo", "Cairo", "Dubai", "Sydney", "Berlin", "Paris", "Seoul", "Rio", "Lisbon", "Riyadh", "Doha", "Casablanca", "Madrid", "Rome"];
    
    while(logos.length < 320) {
        const p = prefixes[Math.floor(Math.random() * prefixes.length)];
        const c = cities[Math.floor(Math.random() * cities.length)];
        const r = regions[Math.floor(Math.random() * regions.length)];
        const generatedName = `${p} ${c} ${Math.floor(Math.random() * 100)}`;
        
        // Generic shield logo for auto-generated ones
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
