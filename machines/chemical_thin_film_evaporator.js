import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const glowingFilm = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00, emissive: 0xff5500, emissiveIntensity: 2,
        transparent: true, opacity: 0.9, side: THREE.DoubleSide
    });

    const bodyGeo = new THREE.CylinderGeometry(2.5, 2.5, 8, 32);
    const bodyMesh = new THREE.Mesh(bodyGeo, glass);
    bodyMesh.position.set(0, 4, 0);
    group.add(bodyMesh);
    parts.push({
        name: "Heated Cylindrical Jacket",
        description: "The outer shell which is heated by steam or hot oil.",
        material: "Steel (Glass)",
        function: "Provides the intense thermal energy needed for evaporation.",
        assemblyOrder: 1,
        connections: ["Rotor"],
        failureEffect: "Cold spots.",
        cascadeFailures: ["Incomplete evaporation"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:0, y:4, z:-8}
    });

    const rotorGeo = new THREE.CylinderGeometry(0.5, 0.5, 9, 16);
    const rotorMesh = new THREE.Mesh(rotorGeo, chrome);
    rotorMesh.position.set(0, 4, 0);
    
    // Add wiper blades
    const bladeGeo = new THREE.BoxGeometry(4.8, 7.5, 0.1);
    const blade1 = new THREE.Mesh(bladeGeo, chrome);
    rotorMesh.add(blade1);
    const blade2 = new THREE.Mesh(bladeGeo, chrome);
    blade2.rotation.y = Math.PI / 2;
    rotorMesh.add(blade2);
    
    group.add(rotorMesh);
    parts.push({
        name: "High-Speed Wiper Rotor",
        description: "Rotating shaft with scraper blades that almost touch the wall.",
        material: "Chrome / Teflon",
        function: "Mechanically forces the viscous liquid into a microscopic thin film against the heated wall.",
        assemblyOrder: 2,
        connections: ["Motor", "Heated Jacket"],
        failureEffect: "Blade wear.",
        cascadeFailures: ["Thick film", "Product burning", "Rotor jamming"],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:0, y:12, z:0}
    });

    const filmGeo = new THREE.CylinderGeometry(2.45, 2.45, 7.5, 32, 1, true);
    const filmMesh = new THREE.Mesh(filmGeo, glowingFilm);
    filmMesh.position.set(0, 4, 0);
    group.add(filmMesh);
    parts.push({
        name: "Mechanically Agitated Thin Film",
        description: "Glowing, highly turbulent layer of chemical product.",
        material: "Glowing Viscous Liquid",
        function: "Evaporates extremely rapidly due to the forced high surface area and intense turbulence.",
        assemblyOrder: 3,
        connections: ["Wiper Rotor"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: {x:0, y:4, z:0},
        explodedPosition: {x:6, y:4, z:0}
    });

    const description = "Agitated Thin Film Evaporator (ATFE): Used for extremely viscous, heat-sensitive, or fouling chemicals. A high-speed rotor mechanically smears the thick liquid into a microscopic film against a hot wall, forcing it to evaporate instantly before it can burn.";

    const quizQuestions = [
        {
            question: "Why use an Agitated Thin Film Evaporator instead of a standard Falling Film Evaporator?",
            options: ["The chemical is too thick/viscous to fall down the tubes by gravity alone, or it tends to foul the walls", "It is much cheaper to build", "It holds more volume", "It works without heat"],
            correct: 0,
            explanation: "If a liquid is highly viscous (like heavy oils or polymers), gravity isn't enough. The ATFE uses mechanical wiper blades to actively force the thick liquid into a film and scrape the walls clean.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the rotor's wiper blades?",
            options: ["To constantly smear the liquid into a thin film and create extreme turbulence", "To chop the liquid into blocks", "To cool the reactor down", "To pump the liquid upward"],
            correct: 0,
            explanation: "The blades operate with millimeters of clearance, constantly smearing the viscous sludge into a microscopic film and creating turbulence, which dramatically increases heat transfer.",
            difficulty: "Hard"
        },
        {
            question: "What prevents the heat-sensitive chemicals from burning in the ATFE?",
            options: ["The extremely short residence time (it evaporates in seconds)", "The walls are refrigerated", "Chemical inhibitors are added", "It operates in the dark"],
            correct: 0,
            explanation: "Because the film is so thin and the evaporation is so rapid, the chemical spends only seconds in the high-heat zone, evaporating before thermal degradation can occur.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Spin the wiper rotor
        if (meshes[1]) meshes[1].rotation.y = time * speed * 10;
        // Pulse film
        if (meshes[2]) meshes[2].material.emissiveIntensity = 2 + Math.sin(time*speed*15)*0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createThinFilmEvaporator() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
