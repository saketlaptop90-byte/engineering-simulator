export function createIonThrusterDrive(THREE) {
    const group = new THREE.Group();
    group.name = "Ion Thruster Drive System";

    // Materials
    const materials = {
        chamber: new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 }),
        cathode: new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.4 }),
        magneticRings: new THREE.MeshStandardMaterial({ color: 0xaa2222, metalness: 0.6, roughness: 0.5 }),
        grid: new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.7, roughness: 0.3, wireframe: true }),
        propellantFeed: new THREE.MeshStandardMaterial({ color: 0x228822, metalness: 0.5, roughness: 0.5 }),
        ppu: new THREE.MeshStandardMaterial({ color: 0x2222aa, metalness: 0.4, roughness: 0.6 }),
        emitter: new THREE.MeshStandardMaterial({ color: 0xaaaa22, metalness: 0.8, roughness: 0.2 }),
        extraction: new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.7, roughness: 0.3 }),
        gimbal: new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 }),
        particle: new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 }),
        electron: new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.8 })
    };

    // 1. Ionization Chamber
    const chamberGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    const ionizationChamber = new THREE.Mesh(chamberGeo, materials.chamber);
    ionizationChamber.rotation.x = Math.PI / 2;
    ionizationChamber.name = "Ionization Chamber";
    group.add(ionizationChamber);

    // 2. Neutralizer Cathode
    const cathodeGeo = new THREE.CylinderGeometry(0.2, 0.2, 1, 16);
    const neutralizerCathode = new THREE.Mesh(cathodeGeo, materials.cathode);
    neutralizerCathode.position.set(2.5, 0, 2);
    neutralizerCathode.rotation.x = Math.PI / 2;
    neutralizerCathode.name = "Neutralizer Cathode";
    group.add(neutralizerCathode);

    // 3. Magnetic Confinement Rings
    const magneticConfinementRings = new THREE.Group();
    magneticConfinementRings.name = "Magnetic Confinement Rings";
    for (let i = -1.5; i <= 1.5; i += 1.5) {
        const ringGeo = new THREE.TorusGeometry(2.1, 0.2, 16, 32);
        const ring = new THREE.Mesh(ringGeo, materials.magneticRings);
        ring.position.z = i;
        magneticConfinementRings.add(ring);
    }
    group.add(magneticConfinementRings);

    // 4. Acceleration Grids
    const gridGeo = new THREE.CylinderGeometry(2, 2, 0.1, 32);
    const accelerationGrids = new THREE.Mesh(gridGeo, materials.grid);
    accelerationGrids.position.z = 2.2;
    accelerationGrids.rotation.x = Math.PI / 2;
    accelerationGrids.name = "Acceleration Grids";
    group.add(accelerationGrids);

    // 5. Screen Grid
    const screenGridGeo = new THREE.CylinderGeometry(2, 2, 0.1, 32);
    const screenGrid = new THREE.Mesh(screenGridGeo, materials.grid);
    screenGrid.position.z = 2.0;
    screenGrid.rotation.x = Math.PI / 2;
    screenGrid.name = "Screen Grid";
    group.add(screenGrid);

    // 6. Propellant Feed System
    const feedGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const propellantFeedSystem = new THREE.Mesh(feedGeo, materials.propellantFeed);
    propellantFeedSystem.position.set(0, 0, -2.5);
    propellantFeedSystem.rotation.x = Math.PI / 2;
    propellantFeedSystem.name = "Propellant Feed System";
    group.add(propellantFeedSystem);

    // 7. Power Processing Unit
    const ppuGeo = new THREE.BoxGeometry(3, 2, 1);
    const powerProcessingUnit = new THREE.Mesh(ppuGeo, materials.ppu);
    powerProcessingUnit.position.set(0, 2.5, -1);
    powerProcessingUnit.name = "Power Processing Unit";
    group.add(powerProcessingUnit);

    // 8. Electron Emitter
    const emitterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    const electronEmitter = new THREE.Mesh(emitterGeo, materials.emitter);
    electronEmitter.position.set(0, 0, -1.8);
    electronEmitter.rotation.x = Math.PI / 2;
    electronEmitter.name = "Electron Emitter";
    group.add(electronEmitter);

    // 9. Beam Extraction Assembly
    const extractionGeo = new THREE.CylinderGeometry(2.2, 2.2, 0.6, 32);
    const beamExtractionAssembly = new THREE.Mesh(extractionGeo, materials.extraction);
    beamExtractionAssembly.position.z = 2.5;
    beamExtractionAssembly.rotation.x = Math.PI / 2;
    beamExtractionAssembly.name = "Beam Extraction Assembly";
    group.add(beamExtractionAssembly);

    // 10. Mounting Gimbal
    const gimbalGeo = new THREE.TorusGeometry(3, 0.3, 16, 64);
    const mountingGimbal = new THREE.Mesh(gimbalGeo, materials.gimbal);
    mountingGimbal.position.z = 0;
    mountingGimbal.name = "Mounting Gimbal";
    group.add(mountingGimbal);

    // Particle system for ion beam emission and electron injection
    const particles = [];
    const particleCount = 200;
    const ionBeamGeo = new THREE.SphereGeometry(0.05, 8, 8);
    for (let i = 0; i < particleCount; i++) {
        const particle = new THREE.Mesh(ionBeamGeo, materials.particle);
        particle.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 2.5 + Math.random() * 5);
        particle.userData = {
            velocity: new THREE.Vector3(0, 0, 0.1 + Math.random() * 0.2),
            life: Math.random() * 100
        };
        particles.push(particle);
        group.add(particle);
    }

    const electrons = [];
    const electronCount = 50;
    const electronGeo = new THREE.SphereGeometry(0.03, 8, 8);
    for (let i = 0; i < electronCount; i++) {
        const electron = new THREE.Mesh(electronGeo, materials.electron);
        electron.position.set(2.5 + (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 2.5 + Math.random() * 2);
        electron.userData = {
            velocity: new THREE.Vector3(-0.05 - Math.random() * 0.05, 0, 0.05 + Math.random() * 0.1),
            life: Math.random() * 50
        };
        electrons.push(electron);
        group.add(electron);
    }

    // Animation Function
    group.userData.update = function(deltaTime) {
        // Ion beam kinematics
        particles.forEach(p => {
            p.position.add(p.userData.velocity);
            p.userData.life -= 1;
            if (p.userData.life <= 0 || p.position.z > 10) {
                p.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 2.5);
                p.userData.life = 100;
            }
        });

        // Electron injection kinematics
        electrons.forEach(e => {
            e.position.add(e.userData.velocity);
            e.userData.life -= 1;
            if (e.userData.life <= 0 || e.position.x < 0) {
                e.position.set(2.5, (Math.random() - 0.5) * 0.5, 2.5);
                e.userData.life = 50;
            }
        });

        // Slight gimbal movement for realism
        mountingGimbal.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        mountingGimbal.rotation.x = Math.cos(Date.now() * 0.0015) * 0.1;
    };

    group.userData.quiz = [
        {
            question: "What is the primary function of the ionization chamber in an ion thruster?",
            options: [
                "To cool the engine",
                "To ionize the propellant gas by bombarding it with electrons",
                "To accelerate the ions",
                "To neutralize the exhaust beam"
            ],
            answer: 1
        },
        {
            question: "Why is a neutralizer cathode necessary in an ion thruster system?",
            options: [
                "To inject electrons into the exhaust beam to prevent spacecraft charging",
                "To increase the mass of the exhaust",
                "To provide power to the grids",
                "To guide the ion beam"
            ],
            answer: 0
        },
        {
            question: "What role do the magnetic confinement rings play?",
            options: [
                "They steer the spacecraft",
                "They trap electrons to increase the ionization efficiency of the propellant",
                "They generate the primary power for the thruster",
                "They absorb excess heat"
            ],
            answer: 1
        },
        {
            question: "How do the acceleration grids generate thrust?",
            options: [
                "By burning the propellant",
                "By creating a high-voltage electrostatic field that accelerates positive ions out of the chamber",
                "By rapidly spinning the propellant",
                "By emitting photons"
            ],
            answer: 1
        },
        {
            question: "What is the purpose of the screen grid?",
            options: [
                "To filter out large particles",
                "To protect the acceleration grid and shape the electric field for optimal ion extraction",
                "To visually display engine status",
                "To mix the propellant with oxygen"
            ],
            answer: 1
        },
        {
            question: "What does the Power Processing Unit (PPU) do in an ion propulsion system?",
            options: [
                "It calculates the trajectory of the spacecraft",
                "It converts electrical power from the spacecraft's solar arrays into the voltages and currents needed by the thruster",
                "It stores propellant gas",
                "It physically moves the mounting gimbal"
            ],
            answer: 1
        }
    ];

    return group;
}
