import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Materials
    const concreteMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.9, metalness: 0.1 });
    const asphaltMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8, metalness: 0.1 });
    const glowingSteelMaterial = new THREE.MeshStandardMaterial({ color: 0x4444ff, emissive: 0x0000ff, emissiveIntensity: 0.5, metalness: 0.8, roughness: 0.2 });
    
    // Water
    const waterMaterial = new THREE.MeshStandardMaterial({ color: 0x0044aa, transparent: true, opacity: 0.8, roughness: 0.1, metalness: 0.8 });
    const waterGeo = new THREE.PlaneGeometry(200, 50);
    const water = new THREE.Mesh(waterGeo, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -10;
    group.add(water);

    // Deck
    const deckGeo = new THREE.BoxGeometry(100, 1, 10);
    const deck = new THREE.Mesh(deckGeo, asphaltMaterial);
    deck.position.set(0, 0, 0);
    group.add(deck);
    parts.push({
        name: "Bridge Deck",
        description: "The main roadway that carries traffic across the bridge.",
        material: "Asphalt and Steel",
        function: "Supports dynamic loads (vehicles, wind) and transfers them to the cables and pylons.",
        assemblyOrder: 3,
        connections: ["Cables", "Pylons"],
        failureEffect: "Collapse of the roadway, catastrophic failure of the bridge.",
        cascadeFailures: ["Cables snap due to uneven load distribution"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: deck
    });

    // Pylons (Towers)
    const pylonGeo = new THREE.BoxGeometry(4, 40, 4);
    
    const pylon1 = new THREE.Mesh(pylonGeo, concreteMaterial);
    pylon1.position.set(-25, 10, 0);
    group.add(pylon1);

    const pylon2 = new THREE.Mesh(pylonGeo, concreteMaterial);
    pylon2.position.set(25, 10, 0);
    group.add(pylon2);

    parts.push({
        name: "Pylons",
        description: "Massive concrete towers that anchor the cables.",
        material: "Reinforced Concrete",
        function: "Transfers the tensile forces from the cables into compressive forces down to the foundation.",
        assemblyOrder: 1,
        connections: ["Cables", "Foundation"],
        failureEffect: "Total collapse of the bridge structure.",
        cascadeFailures: ["Deck collapses, Cables lose tension"],
        originalPosition: { x: 0, y: 10, z: 0 }, // Grouping them logically
        explodedPosition: { x: 0, y: 20, z: 0 },
        mesh: [pylon1, pylon2]
    });

    // Cables
    const cables = [];
    
    // Create fan pattern of cables
    for(let i=0; i<5; i++) {
        // Left pylon, left side
        const dx1 = -45 + i*4; // Deck x
        const dy1 = 0; // Deck y
        const px1 = -25; // Pylon x
        const py1 = 28 - i*2; // Pylon y
        
        const length1 = Math.sqrt(Math.pow(dx1-px1, 2) + Math.pow(dy1-py1, 2));
        const cableGeo = new THREE.CylinderGeometry(0.1, 0.1, length1, 8);
        const cable1 = new THREE.Mesh(cableGeo, glowingSteelMaterial.clone());
        
        cable1.position.set((dx1+px1)/2, (dy1+py1)/2, 0);
        cable1.rotation.z = Math.atan2(py1-dy1, dx1-px1) + Math.PI/2;
        group.add(cable1);
        cables.push(cable1);

        // Left pylon, right side
        const dx2 = -5 - i*4;
        const length2 = Math.sqrt(Math.pow(dx2-px1, 2) + Math.pow(dy1-py1, 2));
        const cableGeo2 = new THREE.CylinderGeometry(0.1, 0.1, length2, 8);
        const cable2 = new THREE.Mesh(cableGeo2, glowingSteelMaterial.clone());
        
        cable2.position.set((dx2+px1)/2, (dy1+py1)/2, 0);
        cable2.rotation.z = Math.atan2(py1-dy1, dx2-px1) + Math.PI/2;
        group.add(cable2);
        cables.push(cable2);
        
        // Right pylon, left side
        const dx3 = 5 + i*4;
        const px2 = 25;
        const length3 = Math.sqrt(Math.pow(dx3-px2, 2) + Math.pow(dy1-py1, 2));
        const cableGeo3 = new THREE.CylinderGeometry(0.1, 0.1, length3, 8);
        const cable3 = new THREE.Mesh(cableGeo3, glowingSteelMaterial.clone());
        
        cable3.position.set((dx3+px2)/2, (dy1+py1)/2, 0);
        cable3.rotation.z = Math.atan2(py1-dy1, dx3-px2) + Math.PI/2;
        group.add(cable3);
        cables.push(cable3);
        
        // Right pylon, right side
        const dx4 = 45 - i*4;
        const length4 = Math.sqrt(Math.pow(dx4-px2, 2) + Math.pow(dy1-py1, 2));
        const cableGeo4 = new THREE.CylinderGeometry(0.1, 0.1, length4, 8);
        const cable4 = new THREE.Mesh(cableGeo4, glowingSteelMaterial.clone());
        
        cable4.position.set((dx4+px2)/2, (dy1+py1)/2, 0);
        cable4.rotation.z = Math.atan2(py1-dy1, dx4-px2) + Math.PI/2;
        group.add(cable4);
        cables.push(cable4);
    }

    parts.push({
        name: "Stay Cables",
        description: "High-tension glowing steel cables arranged in a fan pattern.",
        material: "Glowing High-Tension Steel",
        function: "Supports the deck segments and transfers the load to the pylons.",
        assemblyOrder: 2,
        connections: ["Deck", "Pylons"],
        failureEffect: "Deck sags and breaks, localized failure leading to full collapse.",
        cascadeFailures: ["Adjacent cables snap due to overloaded stress, deck collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 5 },
        mesh: cables
    });
    
    // Vehicles (Dynamic load visualization)
    const vehicles = [];
    for(let i=0; i<3; i++) {
        const vehicleGeo = new THREE.BoxGeometry(2, 1, 1);
        const vehicleMat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff, roughness: 0.4, metalness: 0.6 });
        const vehicle = new THREE.Mesh(vehicleGeo, vehicleMat);
        vehicle.position.set(-40 + i*30, 1, Math.random() * 4 - 2);
        group.add(vehicle);
        vehicles.push(vehicle);
    }

    const description = "A high-tech visualization of a Cable-Stayed Bridge. The cables glow to represent dynamic stress levels as vehicles traverse the deck. The massive concrete pylons anchor the cables, translating tension into compression down to the foundation.";

    const quizQuestions = [
        {
            question: "What type of force do the stay cables primarily experience?",
            options: ["Compression", "Tension", "Shear", "Torsion"],
            correct: 1,
            explanation: "Stay cables are pulled taut by the weight of the deck and traffic, subjecting them almost entirely to tensile forces.",
            difficulty: "Easy"
        },
        {
            question: "How do the pylons handle the forces transferred from the cables?",
            options: ["They bend to absorb the force.", "They transfer the force horizontally to the abutments.", "They convert the tensile force from the cables into compressive force down into the foundation.", "They vibrate to dissipate energy."],
            correct: 2,
            explanation: "The pylons are massive columns that take the downward pull of the cables and resist it with compressive strength, pushing down into the earth.",
            difficulty: "Medium"
        },
        {
            question: "In a fan cable arrangement (as seen here), why are the cables attached at varying heights on the pylon?",
            options: ["For aesthetic reasons only.", "To distribute the load more evenly across the height of the pylon.", "To make the cables the exact same length.", "To increase the wind resistance of the bridge."],
            correct: 1,
            explanation: "A fan or modified fan arrangement distributes the cable anchorage points along the upper part of the pylon, reducing the concentration of stress at a single point.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Vehicles moving across the bridge
        vehicles.forEach((vehicle, index) => {
            vehicle.position.x += 10 * speed * (index % 2 === 0 ? 1 : -1) * 0.016; // Assuming ~60fps
            if(vehicle.position.x > 50) vehicle.position.x = -50;
            if(vehicle.position.x < -50) vehicle.position.x = 50;
        });

        // Pulsing water
        water.position.y = -10 + Math.sin(time * 2) * 0.5;

        // Dynamic stress visualization on cables
        cables.forEach((cable, index) => {
            // Calculate a localized "stress" based on vehicle proximity
            let maxStress = 0;
            vehicles.forEach(vehicle => {
                const dist = Math.abs(vehicle.position.x - cable.position.x);
                if (dist < 15) {
                    maxStress = Math.max(maxStress, 1.0 - dist/15);
                }
            });
            
            // Base emission + stress emission
            const emissionIntensity = 0.2 + maxStress * 1.5 + Math.sin(time*5 + index)*0.1;
            cable.material.emissiveIntensity = emissionIntensity;
            
            // Color shifts from blue to red based on stress
            cable.material.emissive.setHSL(0.6 - maxStress*0.6, 1.0, 0.5);
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCableStayedBridge() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
