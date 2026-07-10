import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing/neon materials
    const glowingBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowingOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff5500,
        emissiveIntensity: 1.2,
        roughness: 0.3,
        metalness: 0.7
    });

    const neonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        metalness: 0.9,
        roughness: 0.1
    });

    const createPart = (name, geometry, material, position, explodedPosition, metadata) => {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        mesh.userData = { originalPosition: position.clone(), explodedPosition: explodedPosition.clone(), ...metadata };
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        
        parts.push({
            name,
            ...metadata,
            mesh,
            originalPosition: position,
            explodedPosition: explodedPosition
        });
        return mesh;
    };

    // --- Geometries ---
    
    // 1. Intake Guard (top dome/grid)
    const guardGeo = new THREE.TorusGeometry(3.8, 0.1, 16, 64);
    const guardMesh = createPart('Intake Guard', guardGeo, chrome, new THREE.Vector3(0, 2.5, 0), new THREE.Vector3(0, 6, 0), {
        description: 'Aerodynamic intake safety mesh and flow guide.',
        material: 'Chrome',
        function: 'Prevents large debris from entering the fan while optimizing inlet airflow.',
        assemblyOrder: 6,
        connections: ['Fan Housing'],
        failureEffect: 'Debris ingestion leading to catastrophic blade failure.',
        cascadeFailures: ['Rotor Blades', 'Drive Shaft']
    });

    for (let i = 0; i < 8; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.05, 0.05, 7.6, 8);
        const spoke = new THREE.Mesh(spokeGeo, chrome);
        spoke.rotation.x = Math.PI / 2;
        spoke.rotation.z = (Math.PI / 8) * i;
        guardMesh.add(spoke);
    }

    // 2. Fan Housing / Shroud
    const housingGeo = new THREE.CylinderGeometry(4, 4, 3, 64, 1, true);
    const housingOuterGeo = new THREE.CylinderGeometry(4.2, 4.2, 3, 64, 1, true);
    const housingTopTorus = new THREE.TorusGeometry(4.1, 0.1, 16, 64);
    housingTopTorus.rotateX(Math.PI / 2);
    housingTopTorus.translate(0, 1.5, 0);
    const housingBottomTorus = new THREE.TorusGeometry(4.1, 0.1, 16, 64);
    housingBottomTorus.rotateX(Math.PI / 2);
    housingBottomTorus.translate(0, -1.5, 0);

    const housingMaterial = darkSteel;
    const housingGroup = new THREE.Group();
    const h1 = new THREE.Mesh(housingGeo, housingMaterial);
    const h2 = new THREE.Mesh(housingOuterGeo, housingMaterial);
    const h3 = new THREE.Mesh(housingTopTorus, glowingBlue);
    const h4 = new THREE.Mesh(housingBottomTorus, neonCyan);
    h1.material.side = THREE.DoubleSide;
    h2.material.side = THREE.DoubleSide;
    housingGroup.add(h1, h2, h3, h4);

    const housingMetadata = {
        description: 'Duct housing that encloses the lift fan, minimizing tip vortex losses.',
        material: 'Dark Steel / Carbon Composite',
        function: 'Increases thrust efficiency and directs the generated lift air downward.',
        assemblyOrder: 1,
        connections: ['Stator Vanes', 'Hovercraft Deck'],
        failureEffect: 'Severe loss of lift pressure and potential blade strikes.',
        cascadeFailures: ['Rotor Blades']
    };
    
    housingGroup.position.set(0, 0, 0);
    group.add(housingGroup);
    parts.push({
        name: 'Fan Housing',
        ...housingMetadata,
        mesh: housingGroup,
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, 0, 0)
    });

    // 3. Stator Vanes (Stationary guides)
    const statorGroup = new THREE.Group();
    for(let i = 0; i < 9; i++) {
        const vaneGeo = new THREE.BoxGeometry(3.5, 0.8, 0.1);
        const vane = new THREE.Mesh(vaneGeo, steel);
        vane.position.set(1.9, -1, 0);
        vane.rotation.y = -Math.PI / 6; 
        
        const pivot = new THREE.Group();
        pivot.rotation.y = (Math.PI * 2 / 9) * i;
        pivot.add(vane);
        statorGroup.add(pivot);
    }
    statorGroup.position.set(0, 0, 0);
    group.add(statorGroup);
    parts.push({
        name: 'Stator Vanes',
        description: 'Stationary aerodynamic vanes located below the rotor.',
        material: 'Steel',
        function: 'Recovers rotational swirl energy from the rotor to increase downward axial thrust.',
        assemblyOrder: 2,
        connections: ['Fan Housing', 'Central Hub'],
        failureEffect: 'Reduced lift efficiency and increased turbulence in the cushion.',
        cascadeFailures: ['Hover Skirt'],
        mesh: statorGroup,
        originalPosition: new THREE.Vector3(0, 0, 0),
        explodedPosition: new THREE.Vector3(0, -3, 0)
    });

    // 4. Central Hub / Motor Casing
    const hubGeo = new THREE.CylinderGeometry(0.8, 1, 2, 32);
    const hubMesh = createPart('Central Motor Hub', hubGeo, aluminum, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -6, 0), {
        description: 'Central housing for the high-torque electric lift motor.',
        material: 'Aluminum',
        function: 'Provides power to the drive shaft and serves as the structural core of the fan assembly.',
        assemblyOrder: 3,
        connections: ['Stator Vanes', 'Drive Shaft'],
        failureEffect: 'Total loss of lift power.',
        cascadeFailures: ['Drive Shaft', 'Rotor Blades']
    });
    
    const hubRing = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.05, 16, 32), glowingOrange);
    hubRing.rotation.x = Math.PI / 2;
    hubRing.position.y = 0.8;
    hubMesh.add(hubRing);

    // 5. Drive Shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
    const shaftMesh = createPart('Drive Shaft', shaftGeo, steel, new THREE.Vector3(0, 1.25, 0), new THREE.Vector3(0, 3, 0), {
        description: 'High-speed rotational transmission shaft connecting motor to rotor.',
        material: 'Steel',
        function: 'Transmits rotational kinetic energy from the motor hub to the rotor blades.',
        assemblyOrder: 4,
        connections: ['Central Motor Hub', 'Rotor Assembly'],
        failureEffect: 'Decoupling of rotor, sudden loss of lift.',
        cascadeFailures: ['Rotor Assembly']
    });

    // 6. Rotor Assembly
    const rotorGroup = new THREE.Group();
    
    const spinnerGeo = new THREE.ConeGeometry(0.8, 1, 32);
    const spinner = new THREE.Mesh(spinnerGeo, chrome);
    spinner.position.set(0, 0.5, 0);
    rotorGroup.add(spinner);

    const spinnerBaseGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.5, 32);
    const spinnerBase = new THREE.Mesh(spinnerBaseGeo, aluminum);
    spinnerBase.position.set(0, -0.25, 0);
    rotorGroup.add(spinnerBase);

    const numBlades = 7;
    for (let i = 0; i < numBlades; i++) {
        const bladeGeo = new THREE.BoxGeometry(3.0, 0.05, 0.6);
        const positions = bladeGeo.attributes.position;
        for (let j = 0; j < positions.count; j++) {
            const x = positions.getX(j);
            if (x > 0) {
                positions.setZ(j, positions.getZ(j) * 0.5); 
            }
        }
        bladeGeo.computeVertexNormals();

        const blade = new THREE.Mesh(bladeGeo, plastic); 
        blade.position.set(1.5, 0, 0);
        blade.rotation.x = Math.PI / 6;
        
        const pivot = new THREE.Group();
        pivot.rotation.y = (Math.PI * 2 / numBlades) * i;
        pivot.add(blade);
        
        const edgeGeo = new THREE.BoxGeometry(3.0, 0.06, 0.05);
        const edge = new THREE.Mesh(edgeGeo, neonCyan);
        edge.position.set(1.5, 0, 0.28);
        pivot.add(edge);

        rotorGroup.add(pivot);
    }
    
    rotorGroup.position.set(0, 1.75, 0);
    group.add(rotorGroup);
    parts.push({
        name: 'Rotor Assembly',
        description: 'Multi-blade variable pitch rotor system.',
        material: 'Carbon Composite / Neon Trims',
        function: 'Accelerates air downward to generate the high-pressure cushion needed for hover.',
        assemblyOrder: 5,
        connections: ['Drive Shaft'],
        failureEffect: 'Severe vibration and catastrophic lift failure.',
        cascadeFailures: ['Fan Housing', 'Drive Shaft'],
        mesh: rotorGroup,
        originalPosition: new THREE.Vector3(0, 1.75, 0),
        explodedPosition: new THREE.Vector3(0, 8, 0)
    });

    const description = "The Aero Hovercraft Lift Fan is a high-tech ducted propulsion system designed to generate immense downward air pressure. Encased in a durable carbon-composite shroud with neon-cyan accents, it utilizes a 7-blade high-speed rotor to force air into the hovercraft's skirt. Stationary stator vanes recover swirl energy to maximize axial thrust, while a centralized high-torque electric motor ensures rapid spool-up times. Proper maintenance of the rotor pitch and intake guard is critical for stable hover dynamics.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Stator Vanes located below the rotor?",
            options: [
                "To structurally support the Hovercraft Deck.",
                "To cool the central motor hub.",
                "To recover rotational swirl energy and increase downward axial thrust.",
                "To chop incoming debris before it hits the deck."
            ],
            correct: 2,
            explanation: "The stator vanes are designed to straighten the airflow coming off the spinning rotor, converting rotational swirl energy into useful downward thrust.",
            difficulty: "Medium"
        },
        {
            question: "Why is the fan enclosed within a Fan Housing (Duct)?",
            options: [
                "To prevent the blades from rusting.",
                "To minimize tip vortex losses and direct thrust efficiently.",
                "To act as a structural bumper against collisions.",
                "To reduce the noise of the electric motor."
            ],
            correct: 1,
            explanation: "A ducted fan prevents high-pressure air from escaping around the tips of the blades (tip vortices), significantly increasing the efficiency and thrust of the fan.",
            difficulty: "Hard"
        },
        {
            question: "What cascade failure is most likely if the Intake Guard fails and allows debris ingestion?",
            options: [
                "Stator Vanes will bend backward.",
                "Central Motor Hub will overheat.",
                "Catastrophic failure of the Rotor Blades and Drive Shaft.",
                "The Fan Housing will crack from vibration."
            ],
            correct: 2,
            explanation: "Ingesting large debris at high RPMs will cause severe impact damage to the fast-moving rotor blades, immediately unbalancing the system and destroying the drive shaft.",
            difficulty: "Easy"
        }
    ];

    const animate = (time, speed, partsRefs) => {
        const targetRotor = partsRefs?.find(p => p.name === 'Rotor Assembly')?.mesh;
        const targetShaft = partsRefs?.find(p => p.name === 'Drive Shaft')?.mesh;
        
        if (targetRotor) targetRotor.rotation.y -= 0.5 * speed;
        if (targetShaft) targetShaft.rotation.y -= 0.5 * speed;

        const pulse = Math.sin(time * 5 * speed) * 0.5 + 0.5;
        glowingBlue.emissiveIntensity = 1.0 + pulse * 1.0;
        neonCyan.emissiveIntensity = 1.5 + pulse * 1.5;
        glowingOrange.emissiveIntensity = 0.8 + pulse * 0.8;
    };

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createLiftFan() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
