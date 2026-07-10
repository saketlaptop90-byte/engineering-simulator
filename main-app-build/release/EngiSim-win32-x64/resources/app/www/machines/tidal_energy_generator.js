export function createTidalEnergyGenerator(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // Material definitions
    const materials = {
        concrete: new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 }),
        steel: new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 }),
        yellow: new THREE.MeshStandardMaterial({ color: 0xcccc00, metalness: 0.5, roughness: 0.5 }),
        darkGrey: new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.6 }),
        copper: new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.2 }),
        blackCable: new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }),
        bladeMat: new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.3 })
    };

    // 1. Gravity Base
    const baseGeom = new THREE.CylinderGeometry(5, 6, 2, 32);
    const baseMesh = new THREE.Mesh(baseGeom, materials.concrete);
    baseMesh.position.y = 1;
    model.add(baseMesh);
    parts.push({
        name: "Gravity Base",
        description: "A heavy concrete and steel foundation that anchors the turbine to the seabed using its own weight, resisting the strong forces of tidal currents.",
        mesh: baseMesh
    });

    // 2. Support Pylon
    const pylonGeom = new THREE.CylinderGeometry(1.5, 2, 15, 32);
    const pylonMesh = new THREE.Mesh(pylonGeom, materials.yellow);
    pylonMesh.position.y = 9.5; // 2 (base) + 7.5 (half pylon)
    model.add(pylonMesh);
    parts.push({
        name: "Support Pylon",
        description: "The main structural column supporting the nacelle and rotor at the optimal height for capturing tidal flow while maintaining clearance from the seabed.",
        mesh: pylonMesh
    });

    // 3. Nacelle
    const nacelleGroup = new THREE.Group();
    nacelleGroup.position.set(0, 17, 0);
    model.add(nacelleGroup);
    
    const nacelleGeom = new THREE.CylinderGeometry(2, 2, 8, 32);
    nacelleGeom.rotateX(Math.PI / 2);
    const nacelleMesh = new THREE.Mesh(nacelleGeom, materials.yellow);
    nacelleGroup.add(nacelleMesh);
    parts.push({
        name: "Nacelle",
        description: "The streamlined housing that contains the drivetrain, generator, and control electronics. It protects sensitive components from the harsh underwater environment.",
        mesh: nacelleMesh
    });

    // 4. Gearbox
    const gearboxGeom = new THREE.BoxGeometry(2.5, 2.5, 3);
    const gearboxMesh = new THREE.Mesh(gearboxGeom, materials.darkGrey);
    gearboxMesh.position.set(0, 0, 1);
    nacelleGroup.add(gearboxMesh);
    parts.push({
        name: "Gearbox",
        description: "A mechanical system that steps up the slow, high-torque rotation of the rotor to the high-speed rotation required by the generator.",
        mesh: gearboxMesh
    });

    // 5. Generator
    const generatorGeom = new THREE.CylinderGeometry(1.2, 1.2, 2.5, 32);
    generatorGeom.rotateX(Math.PI / 2);
    const generatorMesh = new THREE.Mesh(generatorGeom, materials.copper);
    generatorMesh.position.set(0, 0, -2);
    nacelleGroup.add(generatorMesh);
    parts.push({
        name: "Generator",
        description: "Converts the mechanical energy of the rotating shaft into electrical energy through electromagnetic induction.",
        mesh: generatorMesh
    });

    // 6. Rotor Hub
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(0, 0, 4.5);
    nacelleGroup.add(rotorGroup);

    const hubGeom = new THREE.SphereGeometry(1.5, 32, 16);
    const hubMesh = new THREE.Mesh(hubGeom, materials.darkGrey);
    rotorGroup.add(hubMesh);
    parts.push({
        name: "Rotor Hub",
        description: "The central attachment point for the blades, connecting them to the main shaft. It houses the pitch control mechanisms.",
        mesh: hubMesh
    });

    // 7. Pitch Actuator
    const actuatorGeom = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    const actuatorMesh = new THREE.Mesh(actuatorGeom, materials.steel);
    rotorGroup.add(actuatorMesh);
    parts.push({
        name: "Pitch Actuator",
        description: "Hydraulic or electrical rams that rotate the blades along their longitudinal axis to optimize energy capture or feather the blades in extreme currents.",
        mesh: actuatorMesh
    });

    // Blade geometries
    const bladeGeom = new THREE.BoxGeometry(0.5, 8, 1);
    bladeGeom.translate(0, 4.5, 0); // shift origin to base of blade

    // 8. Blade A
    const bladeAGroup = new THREE.Group();
    const bladeAMesh = new THREE.Mesh(bladeGeom, materials.bladeMat);
    bladeAGroup.add(bladeAMesh);
    rotorGroup.add(bladeAGroup);
    parts.push({
        name: "Blade A",
        description: "A hydrodynamic foil designed to capture the kinetic energy of moving water and convert it into rotational motion. Water's high density allows for shorter, thicker blades compared to wind turbines.",
        mesh: bladeAMesh
    });

    // 9. Blade B
    const bladeBGroup = new THREE.Group();
    const bladeBMesh = new THREE.Mesh(bladeGeom, materials.bladeMat);
    bladeBMesh.rotation.z = Math.PI; // Point opposite direction
    bladeBGroup.add(bladeBMesh);
    rotorGroup.add(bladeBGroup);
    parts.push({
        name: "Blade B",
        description: "The opposing hydrodynamic foil. Bi-directional blades can generate power on both ebb and flood tides without rotating the entire nacelle.",
        mesh: bladeBMesh
    });

    // 10. Power Cable
    const cableGeom = new THREE.CylinderGeometry(0.2, 0.2, 16, 8);
    const cableMesh = new THREE.Mesh(cableGeom, materials.blackCable);
    cableMesh.position.set(-1.8, 9, 0);
    model.add(cableMesh);
    parts.push({
        name: "Power Cable",
        description: "A heavily armored subsea cable that transmits the generated electricity from the turbine to a subsea hub or onshore substation.",
        mesh: cableMesh
    });

    // Kinematics and Animation
    let time = 0;
    
    // Simulate tidal flow variation over time
    const tidalCycleLength = 20; // seconds for a full cycle (accelerated for visualization)
    
    function update(deltaTime) {
        time += deltaTime;
        
        // Tidal flow velocity (sinusoidal, accelerates, decelerates, reverses)
        const flowVelocity = Math.sin((time / tidalCycleLength) * Math.PI * 2);
        
        // Rotor speed is proportional to flow velocity
        const rotorSpeed = flowVelocity * 2.5; 
        
        // Rotate the rotor hub
        rotorGroup.rotation.z -= rotorSpeed * deltaTime;
        
        // Generator spins much faster due to gearbox
        generatorMesh.rotation.z -= rotorSpeed * 40 * deltaTime;
        
        // Pitch actuation based on flow direction
        // When flow reverses, blades pitch 180 degrees
        const targetPitch = flowVelocity > 0 ? 0 : Math.PI;
        
        // Smoothly interpolate blade pitch
        bladeAGroup.rotation.y += (targetPitch - bladeAGroup.rotation.y) * Math.min(deltaTime * 2, 1);
        bladeBGroup.rotation.y += (targetPitch - bladeBGroup.rotation.y) * Math.min(deltaTime * 2, 1);
        
        // Actuator spins with blades but also moves slightly as pitch changes
        actuatorMesh.rotation.x = bladeAGroup.rotation.y;
    }

    const quizzes = [
        {
            question: "Why are the blades of a tidal energy turbine typically much shorter and thicker than those of a wind turbine?",
            options: [
                "To prevent them from getting tangled in seaweed",
                "Water is approximately 800 times denser than air, exerting much higher forces",
                "To reduce the visual impact from the shore",
                "Because shorter blades spin faster and generate more electricity"
            ],
            answer: 1
        },
        {
            question: "What is the primary function of a gravity base in a tidal generator?",
            options: [
                "To increase the gravitational pull on the passing water",
                "To house the main electrical generator",
                "To anchor the turbine to the seabed using massive weight instead of drilled piles",
                "To control the pitch of the blades based on tidal flow"
            ],
            answer: 2
        },
        {
            question: "How do tidal turbines typically handle the reversal of water flow between ebb and flood tides?",
            options: [
                "They only generate power during the flood tide",
                "They are removed from the water and turned around",
                "The entire generator physically rotates 180 degrees, or the blades pitch 180 degrees",
                "They use a secondary rotor on the back of the nacelle"
            ],
            answer: 2
        },
        {
            question: "What role does the gearbox play in the tidal generator's nacelle?",
            options: [
                "It steps up the slow rotational speed of the blades to the high speed needed by the generator",
                "It changes the gears to make the turbine spin in reverse",
                "It pumps hydraulic fluid to the pitch actuators",
                "It measures the speed of the tidal current"
            ],
            answer: 0
        },
        {
            question: "Which of the following makes tidal energy highly predictable compared to wind or solar energy?",
            options: [
                "Tides are driven by the gravitational interaction of the Earth, Moon, and Sun",
                "Water temperature is relatively constant throughout the year",
                "Tidal generators are located underwater where weather has no effect",
                "Marine life helps push the blades at a constant speed"
            ],
            answer: 0
        },
        {
            question: "What is the purpose of blade pitch actuators in a tidal turbine?",
            options: [
                "To clean the blades of marine growth",
                "To adjust the angle of the blades to optimize energy capture or protect them in extreme currents",
                "To convert rotational energy into electrical energy",
                "To secure the blades to the seabed during storms"
            ],
            answer: 1
        }
    ];

    return {
        model,
        parts,
        update,
        quizzes
    };
}
