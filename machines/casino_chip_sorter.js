import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const laserMat = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 2, transparent: true, opacity: 0.8 });
    const blueNeon = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0088ff, emissiveIntensity: 1.5 });
    const greenNeon = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00, emissiveIntensity: 1.5 });
    
    // Meshes for animation
    const meshes = {};

    // 1. Base Frame
    const baseGeo = new THREE.BoxGeometry(10, 2, 8);
    const baseFrame = new THREE.Mesh(baseGeo, darkSteel);
    baseFrame.position.set(0, -1, 0);
    group.add(baseFrame);
    meshes.baseFrame = baseFrame;
    parts.push({
        name: "Main Chassis",
        description: "Heavy dark steel frame to absorb high-frequency vibrations from the sorting carousel.",
        material: "Dark Steel",
        function: "Structural support and vibration dampening.",
        assemblyOrder: 1,
        connections: ["Hopper", "Sorting Carousel", "Bins"],
        failureEffect: "Machine misalignment leading to sorting errors.",
        cascadeFailures: ["Optical Scanner", "Ejection Pneumatics"],
        originalPosition: {x: 0, y: -1, z: 0},
        explodedPosition: {x: 0, y: -10, z: 0}
    });

    // 2. Hopper
    const hopperGeo = new THREE.CylinderGeometry(4, 1, 4, 32, 1, true);
    const hopper = new THREE.Mesh(hopperGeo, tinted);
    hopper.position.set(-2, 6, 0);
    group.add(hopper);
    meshes.hopper = hopper;
    parts.push({
        name: "Input Hopper",
        description: "Tinted glass funnel holding unsorted casino chips.",
        material: "Tinted Glass",
        function: "Regulates the flow of chips into the feeder wheel.",
        assemblyOrder: 2,
        connections: ["Feeder Wheel", "Main Chassis"],
        failureEffect: "Chips jam or spill out of the machine.",
        cascadeFailures: ["Feeder Wheel"],
        originalPosition: {x: -2, y: 6, z: 0},
        explodedPosition: {x: -2, y: 15, z: 0}
    });

    // 3. Feeder Wheel
    const feederGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 16);
    const feederWheel = new THREE.Mesh(feederGeo, rubber);
    feederWheel.position.set(-2, 3.5, 0);
    feederWheel.rotation.x = Math.PI / 2;
    group.add(feederWheel);
    meshes.feederWheel = feederWheel;
    parts.push({
        name: "Feeder Wheel",
        description: "High-grip rubber wheel that extracts one chip at a time.",
        material: "Rubber",
        function: "Singulates chips for the optical scanner.",
        assemblyOrder: 3,
        connections: ["Hopper", "Optical Scanner"],
        failureEffect: "Feeds multiple chips at once, causing scanning errors.",
        cascadeFailures: ["Optical Scanner"],
        originalPosition: {x: -2, y: 3.5, z: 0},
        explodedPosition: {x: -10, y: 3.5, z: 0}
    });

    // 4. Optical Scanner
    const scannerGeo = new THREE.BoxGeometry(2, 1, 2);
    const scanner = new THREE.Mesh(scannerGeo, chrome);
    scanner.position.set(0.5, 3.5, 0);
    group.add(scanner);
    
    const laserBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserMat);
    laserBeam.position.set(0, -1, 0);
    scanner.add(laserBeam);
    
    meshes.scanner = scanner;
    parts.push({
        name: "Optical Scanner",
        description: "High-speed multi-spectral camera and laser sensor.",
        material: "Chrome & Laser",
        function: "Identifies chip color, denomination, and authenticates RFID.",
        assemblyOrder: 4,
        connections: ["Feeder Wheel", "Sorting Carousel"],
        failureEffect: "Misidentifies chips, sending high-value chips to low-value bins.",
        cascadeFailures: ["Ejection Pneumatics"],
        originalPosition: {x: 0.5, y: 3.5, z: 0},
        explodedPosition: {x: 0.5, y: 3.5, z: -10}
    });

    // 5. Sorting Carousel
    const carouselGeo = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const sortingCarousel = new THREE.Mesh(carouselGeo, aluminum);
    sortingCarousel.position.set(2.5, 2, 0);
    group.add(sortingCarousel);
    meshes.sortingCarousel = sortingCarousel;
    parts.push({
        name: "Sorting Carousel",
        description: "Ultra-fast spinning aluminum disc carrying chips to ejection points.",
        material: "Aluminum",
        function: "Transports chips radially to their designated bins.",
        assemblyOrder: 5,
        connections: ["Optical Scanner", "Ejection Pneumatics"],
        failureEffect: "Carousel wobbles, throwing chips out of the machine.",
        cascadeFailures: ["Bins"],
        originalPosition: {x: 2.5, y: 2, z: 0},
        explodedPosition: {x: 2.5, y: 2, z: 10}
    });

    // 6. Ejection Pneumatics
    const pneumGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
    const pneumatics = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const valve = new THREE.Mesh(pneumGeo, copper);
        const angle = (Math.PI / 2) * i;
        valve.position.set(Math.cos(angle) * 3.5, 0, Math.sin(angle) * 3.5);
        valve.lookAt(0, 0, 0);
        valve.rotation.x += Math.PI / 2;
        pneumatics.add(valve);
    }
    pneumatics.position.set(2.5, 2.2, 0);
    group.add(pneumatics);
    meshes.pneumatics = pneumatics;
    parts.push({
        name: "Ejection Pneumatics",
        description: "High-pressure copper air valves.",
        material: "Copper",
        function: "Fires a burst of air to blow the chip into the correct bin.",
        assemblyOrder: 6,
        connections: ["Sorting Carousel", "Bins"],
        failureEffect: "Fires late, missing the chip or sending it to the wrong bin.",
        cascadeFailures: [],
        originalPosition: {x: 2.5, y: 2.2, z: 0},
        explodedPosition: {x: 12, y: 2.2, z: 0}
    });

    // 7. Bins
    const binGeo = new THREE.BoxGeometry(2, 3, 2);
    const bins = new THREE.Group();
    const binColors = [blueNeon, greenNeon, new THREE.MeshStandardMaterial({color:0xffaa00}), new THREE.MeshStandardMaterial({color:0xaa00ff})];
    for (let i = 0; i < 4; i++) {
        const bin = new THREE.Mesh(binGeo, glass);
        const rim = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.2, 2.1), binColors[i]);
        rim.position.y = 1.5;
        bin.add(rim);
        const angle = (Math.PI / 2) * i;
        bin.position.set(Math.cos(angle) * 5, -1, Math.sin(angle) * 5);
        bins.add(bin);
    }
    bins.position.set(2.5, 1.5, 0);
    group.add(bins);
    meshes.bins = bins;
    parts.push({
        name: "Collection Bins",
        description: "Tempered glass bins with neon rims.",
        material: "Glass",
        function: "Safely catch and store the sorted chips.",
        assemblyOrder: 7,
        connections: ["Ejection Pneumatics", "Main Chassis"],
        failureEffect: "Bin overflows, causing chips to back up into the carousel.",
        cascadeFailures: ["Sorting Carousel"],
        originalPosition: {x: 2.5, y: 1.5, z: 0},
        explodedPosition: {x: 2.5, y: -5, z: 0}
    });

    // 8. Chips (Decorative/Animated)
    const chipGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 16);
    const chipsGroup = new THREE.Group();
    const chipInstances = [];
    for(let i=0; i<10; i++) {
        const c = new THREE.Mesh(chipGeo, binColors[i % 4]);
        chipsGroup.add(c);
        chipInstances.push(c);
    }
    group.add(chipsGroup);
    meshes.chipInstances = chipInstances;

    const description = "The Casino Chip Sorter is a high-speed, automated counting and sorting machine. Using an optical scanner and laser authentication, it reads chip denominations and RFID tags. A fast-spinning aluminum carousel transports chips to high-pressure copper pneumatic valves, which eject them into their respective illuminated glass bins.";

    const quizQuestions = [
        {
            question: "Why is heavy dark steel used for the Main Chassis instead of aluminum?",
            options: [
                "It is cheaper.",
                "To absorb high-frequency vibrations from the sorting carousel.",
                "To conduct electricity for the optical scanner.",
                "To prevent the pneumatic valves from overheating."
            ],
            correct: 1,
            explanation: "Heavy steel provides structural integrity and mass, which dampens the significant vibrations caused by the high-speed spinning of the sorting carousel.",
            difficulty: "Medium"
        },
        {
            question: "What triggers the chip to drop into the correct collection bin?",
            options: [
                "A mechanical trapdoor in the carousel.",
                "A burst of air from the high-pressure pneumatic valves.",
                "A robotic arm sweeping it off.",
                "Magnetic attraction."
            ],
            correct: 1,
            explanation: "The ejection pneumatics fire precise bursts of air to blow the chips off the sorting carousel and into the bins.",
            difficulty: "Easy"
        },
        {
            question: "What happens if the feeder wheel feeds multiple chips at once?",
            options: [
                "The machine speeds up.",
                "The optical scanner misidentifies chips, causing sorting errors.",
                "The pneumatic valves explode.",
                "The bins shatter."
            ],
            correct: 1,
            explanation: "The feeder wheel's job is singulation. If multiple chips pass at once, the optical scanner cannot correctly read the individual chip data.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, explodedProgress) {
        // Exploded view interpolation
        parts.forEach((part, index) => {
            const meshName = Object.keys(meshes)[index];
            if(meshes[meshName] && meshes[meshName].isMesh) {
                meshes[meshName].position.lerpVectors(
                    new THREE.Vector3(part.originalPosition.x, part.originalPosition.y, part.originalPosition.z),
                    new THREE.Vector3(part.explodedPosition.x, part.explodedPosition.y, part.explodedPosition.z),
                    explodedProgress
                );
            }
        });

        // Specific part animations
        meshes.feederWheel.rotation.y = time * 2 * speed;
        meshes.sortingCarousel.rotation.y = -time * 5 * speed;

        // Animate chips
        meshes.chipInstances.forEach((chip, i) => {
            const offset = (time * speed + (i * 0.5)) % 4;
            if (offset < 1) {
                // Drop from hopper
                chip.position.set(-2, 6 - (offset * 2.5), 0);
            } else if (offset < 2) {
                // Move through scanner
                chip.position.set(-2 + ((offset - 1) * 2.5), 3.5, 0);
            } else if (offset < 3) {
                // Spin on carousel
                const angle = (offset - 2) * Math.PI * 2;
                chip.position.set(2.5 + Math.cos(angle)*2.5, 2.2, Math.sin(angle)*2.5);
            } else {
                // Drop into bin
                const binIdx = i % 4;
                const angle = (Math.PI / 2) * binIdx;
                chip.position.set(
                    2.5 + Math.cos(angle) * (2.5 + (offset - 3) * 2.5),
                    2.2 - (offset - 3) * 3,
                    Math.sin(angle) * (2.5 + (offset - 3) * 2.5)
                );
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createChipSorter() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
