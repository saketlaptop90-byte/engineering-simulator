export function createVasimrEngine(THREE) {
    const group = new THREE.Group();

    // 10 parts
    // 1. Gas Feed System
    // 2. Helicon Antenna (Ionization)
    // 3. Forward Magnetic Choke
    // 4. Central Magnetic Cell
    // 5. ICRH Antenna (Heating)
    // 6. Rear Magnetic Choke
    // 7. Superconducting Coils
    // 8. Thermal Shielding
    // 9. Magnetic Nozzle
    // 10. Plasma Exhaust

    // Materials
    const metalMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.2 });
    const copperMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 });
    const superconductingMaterial = new THREE.MeshStandardMaterial({ color: 0x3344cc, metalness: 0.9, roughness: 0.1 });
    const plasmaMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const shieldMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.5, roughness: 0.5 });
    
    // 1. Gas Feed System
    const gasFeedGeom = new THREE.CylinderGeometry(0.5, 0.5, 2, 16);
    const gasFeed = new THREE.Mesh(gasFeedGeom, metalMaterial);
    gasFeed.position.set(0, 0, -6);
    gasFeed.rotation.x = Math.PI / 2;
    group.add(gasFeed);

    // 2. Helicon Antenna (Ionization stage)
    const heliconGeom = new THREE.TorusGeometry(1.2, 0.2, 16, 32);
    const helicon = new THREE.Mesh(heliconGeom, copperMaterial);
    helicon.position.set(0, 0, -4.5);
    group.add(helicon);

    // 3. Forward Magnetic Choke
    const forwardChokeGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const forwardChoke = new THREE.Mesh(forwardChokeGeom, superconductingMaterial);
    forwardChoke.position.set(0, 0, -3.5);
    forwardChoke.rotation.x = Math.PI / 2;
    group.add(forwardChoke);

    // 4. Central Magnetic Cell (Tube where plasma flows)
    const centralCellGeom = new THREE.CylinderGeometry(1, 1, 4, 32);
    const centralCell = new THREE.Mesh(centralCellGeom, metalMaterial);
    centralCell.position.set(0, 0, -1);
    centralCell.rotation.x = Math.PI / 2;
    group.add(centralCell);

    // 5. ICRH Antenna (Heating stage)
    const icrhGeom = new THREE.TorusGeometry(1.6, 0.3, 16, 32);
    const icrh = new THREE.Mesh(icrhGeom, copperMaterial);
    icrh.position.set(0, 0, 0);
    group.add(icrh);

    // 6. Rear Magnetic Choke
    const rearChokeGeom = new THREE.CylinderGeometry(1.5, 1.5, 1, 32);
    const rearChoke = new THREE.Mesh(rearChokeGeom, superconductingMaterial);
    rearChoke.position.set(0, 0, 1.5);
    rearChoke.rotation.x = Math.PI / 2;
    group.add(rearChoke);

    // 7. Superconducting Coils (Outer coils)
    const coilGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const coilGeom = new THREE.TorusGeometry(2.5, 0.4, 16, 32);
        const coil = new THREE.Mesh(coilGeom, superconductingMaterial);
        coil.position.set(0, 0, -3 + i * 1.5);
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // 8. Thermal Shielding
    const shieldGeom = new THREE.CylinderGeometry(3.5, 3.5, 8, 32, 1, true);
    const shield = new THREE.Mesh(shieldGeom, shieldMaterial);
    shield.position.set(0, 0, -1);
    shield.rotation.x = Math.PI / 2;
    shield.material.side = THREE.DoubleSide;
    group.add(shield);

    // 9. Magnetic Nozzle
    const nozzleGeom = new THREE.CylinderGeometry(1, 3, 3, 32, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeom, metalMaterial);
    nozzle.position.set(0, 0, 3.5);
    nozzle.rotation.x = Math.PI / 2;
    nozzle.material.side = THREE.DoubleSide;
    group.add(nozzle);

    // 10. Plasma Exhaust
    const exhaustGeom = new THREE.CylinderGeometry(0.8, 4, 6, 32);
    const exhaust = new THREE.Mesh(exhaustGeom, plasmaMaterial);
    exhaust.position.set(0, 0, 8);
    exhaust.rotation.x = Math.PI / 2;
    group.add(exhaust);

    // Tick function for animation
    group.tick = (time) => {
        // Animate plasma exhaust
        const scale = 1 + 0.1 * Math.sin(time * 10);
        exhaust.scale.set(scale, 1, scale);
        plasmaMaterial.opacity = 0.6 + 0.3 * Math.sin(time * 15);

        // Animate ICRH heating (pulse)
        icrh.scale.set(1 + 0.05 * Math.sin(time * 5), 1 + 0.05 * Math.sin(time * 5), 1 + 0.05 * Math.sin(time * 5));

        // Animate Helicon Antenna
        helicon.rotation.z = time * 2;
    };

    // Quiz Data
    group.userData.quiz = [
        {
            question: "What does VASIMR stand for?",
            options: [
                "Variable Specific Impulse Magnetoplasma Rocket",
                "Virtual Atomic Space Ignition Motor Rocket",
                "Volumetric Acceleration System In Magnetic Resonance",
                "Vacuum Accelerated Specific Impulse Mass Relay"
            ],
            correctAnswer: 0
        },
        {
            question: "What is the primary function of the Helicon antenna in a VASIMR engine?",
            options: [
                "Accelerate plasma",
                "Ionize the propellant gas into plasma",
                "Provide electrical power",
                "Cool the superconducting coils"
            ],
            correctAnswer: 1
        },
        {
            question: "How is the plasma heated to extreme temperatures in the second stage?",
            options: [
                "Chemical combustion",
                "Laser ablation",
                "Ion Cyclotron Resonance Heating (ICRH)",
                "Friction against the walls"
            ],
            correctAnswer: 2
        },
        {
            question: "What is used to contain and direct the high-temperature plasma to prevent it from melting the engine walls?",
            options: [
                "Tungsten shielding",
                "Magnetic fields generated by superconducting coils",
                "Liquid helium cooling",
                "Carbon-carbon composites"
            ],
            correctAnswer: 1
        },
        {
            question: "What does it mean for the VASIMR to have a 'Variable Specific Impulse'?",
            options: [
                "It uses different types of fuel simultaneously.",
                "It can 'shift gears' between high thrust/low exhaust velocity and low thrust/high exhaust velocity.",
                "Its weight varies as it consumes fuel.",
                "It depends entirely on solar radiation for propulsion."
            ],
            correctAnswer: 1
        },
        {
            question: "What component accelerates the heated plasma out of the engine to produce thrust?",
            options: [
                "Mechanical turbine",
                "Combustion chamber",
                "Magnetic nozzle",
                "Electrostatic grid"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
