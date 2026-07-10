import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });

    const bioGreen = new THREE.MeshStandardMaterial({
        color: 0x39ff14,
        emissive: 0x39ff14,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
    });
    
    // 1. Tank Vessel
    const tankGeometry = new THREE.CylinderGeometry(2, 2, 8, 32);
    const tank = new THREE.Mesh(tankGeometry, glass);
    tank.position.set(0, 4, 0);
    group.add(tank);
    parts.push({
        name: "Main Vessel",
        description: "A sterilized glass and steel vessel where the biological reaction takes place.",
        material: "Glass/Steel",
        function: "Contains the culture medium and microorganisms in a controlled environment.",
        assemblyOrder: 1,
        connections: ["Agitator Shaft", "Sparger", "Sensors", "Cooling Jacket"],
        failureEffect: "Contamination of the culture or loss of containment.",
        cascadeFailures: ["Complete batch loss", "Environmental hazard"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 4, z: 5},
        mesh: tank
    });
    
    // Base/Bottom Dish
    const dishGeometry = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const bottomDish = new THREE.Mesh(dishGeometry, steel);
    bottomDish.position.set(0, 0, 0);
    bottomDish.rotation.x = Math.PI;
    group.add(bottomDish);
    parts.push({
        name: "Bottom Dish",
        description: "The curved base of the bioreactor, designed for easy drainage and cleaning.",
        material: "Stainless Steel",
        function: "Supports the vessel and facilitates harvesting of the product.",
        assemblyOrder: 2,
        connections: ["Main Vessel", "Harvest Valve"],
        failureEffect: "Leakage of the culture medium.",
        cascadeFailures: ["Loss of pressure", "Contamination"],
        originalPosition: {x: 0, y: 0, z: 0},
        explodedPosition: {x: 0, y: -3, z: 0},
        mesh: bottomDish
    });
    
    const topDish = new THREE.Mesh(dishGeometry, steel);
    topDish.position.set(0, 8, 0);
    group.add(topDish);
    parts.push({
        name: "Top Dish (Headplate)",
        description: "The sealed top cover, containing various ports for sensors and additions.",
        material: "Stainless Steel",
        function: "Maintains sterility and provides access for probes, feeds, and exhaust.",
        assemblyOrder: 3,
        connections: ["Main Vessel", "Agitator Motor", "Exhaust Filter"],
        failureEffect: "Loss of sterility or pressure.",
        cascadeFailures: ["Contamination", "Aeration failure"],
        originalPosition: {x: 0, y: 8, z: 0},
        explodedPosition: {x: 0, y: 12, z: 0},
        mesh: topDish
    });

    // 2. Agitator Shaft
    const shaftGeometry = new THREE.CylinderGeometry(0.1, 0.1, 7.5, 16);
    const shaft = new THREE.Mesh(shaftGeometry, chrome);
    shaft.position.set(0, 4.25, 0);
    group.add(shaft);
    parts.push({
        name: "Agitator Shaft",
        description: "Central rotating shaft that drives the impellers.",
        material: "Chrome/Steel",
        function: "Transfers mechanical power from the motor to the impellers for mixing.",
        assemblyOrder: 4,
        connections: ["Agitator Motor", "Rushton Impellers"],
        failureEffect: "Inadequate mixing.",
        cascadeFailures: ["Poor mass transfer", "Cell death", "Temperature gradients"],
        originalPosition: {x: 0, y: 4.25, z: 0},
        explodedPosition: {x: 0, y: 4.25, z: -5},
        mesh: shaft
    });
    
    // Motor
    const motorGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const motor = new THREE.Mesh(motorGeometry, darkSteel);
    motor.position.set(0, 8.5, 0);
    group.add(motor);
    parts.push({
        name: "Agitator Motor",
        description: "High-torque electric motor driving the agitator.",
        material: "Dark Steel",
        function: "Provides the rotational force required for mixing the culture.",
        assemblyOrder: 5,
        connections: ["Top Dish", "Agitator Shaft"],
        failureEffect: "Loss of agitation.",
        cascadeFailures: ["Cell settling", "Oxygen starvation"],
        originalPosition: {x: 0, y: 8.5, z: 0},
        explodedPosition: {x: 0, y: 14, z: 0},
        mesh: motor
    });

    // Impellers
    const impellerGroup = new THREE.Group();
    impellerGroup.position.set(0, 4.25, 0);
    const impellers = [];
    
    for (let i = 0; i < 3; i++) {
        const impellerY = -2 + i * 2;
        const discGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.05, 16);
        const disc = new THREE.Mesh(discGeometry, steel);
        disc.position.set(0, impellerY, 0);
        impellerGroup.add(disc);
        
        for (let j = 0; j < 6; j++) {
            const bladeGeometry = new THREE.BoxGeometry(0.4, 0.3, 0.02);
            const blade = new THREE.Mesh(bladeGeometry, steel);
            const angle = (j / 6) * Math.PI * 2;
            blade.position.set(Math.cos(angle) * 0.7, impellerY, Math.sin(angle) * 0.7);
            blade.rotation.y = -angle;
            impellerGroup.add(blade);
        }
    }
    group.add(impellerGroup);
    parts.push({
        name: "Rushton Impellers",
        description: "Flat-blade disc turbines used for high-shear mixing and gas dispersion.",
        material: "Stainless Steel",
        function: "Breaks up air bubbles from the sparger and ensures homogenous mixing.",
        assemblyOrder: 6,
        connections: ["Agitator Shaft"],
        failureEffect: "Poor gas dispersion.",
        cascadeFailures: ["Low dissolved oxygen", "Suboptimal growth"],
        originalPosition: {x: 0, y: 4.25, z: 0},
        explodedPosition: {x: 5, y: 4.25, z: 0},
        mesh: impellerGroup
    });
    
    // 3. Sparger (Aeration)
    const spargerRingGeometry = new THREE.TorusGeometry(0.8, 0.05, 8, 32);
    const spargerRing = new THREE.Mesh(spargerRingGeometry, neonBlue);
    spargerRing.rotation.x = Math.PI / 2;
    spargerRing.position.set(0, 1.5, 0);
    group.add(spargerRing);
    
    const spargerPipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 7.5, 8);
    const spargerPipe = new THREE.Mesh(spargerPipeGeometry, steel);
    spargerPipe.position.set(0.8, 5, 0);
    group.add(spargerPipe);
    
    parts.push({
        name: "Ring Sparger",
        description: "A perforated ring that introduces sterile air or oxygen into the bottom of the tank.",
        material: "Stainless Steel (Glowing Blue Aeration)",
        function: "Provides essential oxygen for aerobic microorganisms.",
        assemblyOrder: 7,
        connections: ["Air Supply Line", "Bottom Dish"],
        failureEffect: "Lack of oxygen supply.",
        cascadeFailures: ["Hypoxia", "Shift to anaerobic metabolism", "Cell death"],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: -5, y: 1.5, z: 0},
        mesh: spargerRing
    });
    
    // Cooling Jacket
    const jacketGeometry = new THREE.CylinderGeometry(2.1, 2.1, 6, 32, 1, true);
    const jacket = new THREE.Mesh(jacketGeometry, bioGreen);
    jacket.position.set(0, 4, 0);
    group.add(jacket);
    parts.push({
        name: "Cooling Jacket",
        description: "Outer shell surrounding the vessel through which coolant flows.",
        material: "Glowing Green (Coolant)",
        function: "Removes excess metabolic heat generated by the growing cells.",
        assemblyOrder: 8,
        connections: ["Chiller", "Main Vessel"],
        failureEffect: "Inability to control temperature.",
        cascadeFailures: ["Overheating", "Protein denaturation", "Culture death"],
        originalPosition: {x: 0, y: 4, z: 0},
        explodedPosition: {x: 0, y: 4, z: -8},
        mesh: jacket
    });

    const description = "A high-tech industrial bioreactor used for cultivating microorganisms or cells in a highly controlled environment. Features a glass and stainless steel construction with Rushton impellers for high-shear mixing, a ring sparger for aeration, and a cooling jacket for temperature regulation.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Rushton Impellers in this bioreactor?",
            options: [
                "To control the temperature of the culture.",
                "To measure the pH level.",
                "To break up air bubbles and ensure homogenous mixing.",
                "To sterilize the incoming air."
            ],
            correct: 2,
            explanation: "Rushton impellers are flat-blade disc turbines specifically designed for high-shear mixing and effective gas dispersion, breaking up bubbles from the sparger.",
            difficulty: "Medium"
        },
        {
            question: "Why is a Cooling Jacket necessary in an industrial bioreactor?",
            options: [
                "To keep the microorganisms dormant.",
                "To remove excess metabolic heat generated during rapid cell growth.",
                "To freeze the final product for storage.",
                "To prevent the glass vessel from shattering."
            ],
            correct: 1,
            explanation: "Microorganisms generate significant metabolic heat during rapid growth. The cooling jacket is essential to maintain the optimal temperature and prevent the culture from overheating and dying.",
            difficulty: "Easy"
        },
        {
            question: "What would be the most immediate consequence of a Sparger failure?",
            options: [
                "The culture would become contaminated.",
                "The impeller would spin out of control.",
                "The cells would suffer from oxygen starvation (hypoxia).",
                "The tank would over-pressurize and explode."
            ],
            correct: 2,
            explanation: "The sparger is responsible for introducing air/oxygen into the culture. Its failure would immediately lead to a lack of dissolved oxygen, causing hypoxia in aerobic cells.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (meshes && meshes.length > 0) {
            // Find impeller group
            const impellerPart = meshes.find(m => m.name === "Rushton Impellers");
            if (impellerPart && impellerPart.mesh) {
                impellerPart.mesh.rotation.y += 0.05 * speed;
            }
            
            // Find shaft and rotate it at the same speed
            const shaftPart = meshes.find(m => m.name === "Agitator Shaft");
            if (shaftPart && shaftPart.mesh) {
                shaftPart.mesh.rotation.y += 0.05 * speed;
            }
            
            // Pulsate cooling jacket
            const jacketPart = meshes.find(m => m.name === "Cooling Jacket");
            if (jacketPart && jacketPart.mesh) {
                jacketPart.mesh.material.opacity = 0.5 + Math.sin(time * 0.002 * speed) * 0.3;
            }
        }
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createBioreactor() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
