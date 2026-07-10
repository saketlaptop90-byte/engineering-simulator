export function createClockworkMechanism(THREE) {
    const group = new THREE.Group();

    // Materials
    const brassMaterial = new THREE.MeshStandardMaterial({ color: 0xb5a642, metalness: 0.8, roughness: 0.3 });
    const steelMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.4 });
    const rubyMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.8 });
    
    const parts = {};

    // 1. Winding Stem (cylinder)
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
    const stem = new THREE.Mesh(stemGeometry, steelMaterial);
    stem.position.set(-3, 0, 0);
    stem.rotation.z = Math.PI / 2;
    group.add(stem);
    parts.windingStem = stem;

    // 2. Mainspring (flat cylinder to represent the coiled spring)
    const mainspringGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 32);
    const mainspring = new THREE.Mesh(mainspringGeometry, steelMaterial);
    mainspring.position.set(-1.5, 0, 0);
    group.add(mainspring);
    parts.mainspring = mainspring;

    // 3. Barrel (hollow cylinder enclosing mainspring, represented as a slightly larger cylinder)
    const barrelGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
    const barrel = new THREE.Mesh(barrelGeometry, brassMaterial);
    barrel.position.set(-1.5, 0, 0);
    group.add(barrel);
    parts.barrel = barrel;

    // Helper to create gears
    function createGear(radius, thickness, teeth, colorMaterial) {
        const gearGroup = new THREE.Group();
        const bodyGeo = new THREE.CylinderGeometry(radius - 0.1, radius - 0.1, thickness, 32);
        const body = new THREE.Mesh(bodyGeo, colorMaterial);
        gearGroup.add(body);

        const toothGeo = new THREE.BoxGeometry(0.2, thickness, 0.2);
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            const tooth = new THREE.Mesh(toothGeo, colorMaterial);
            tooth.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            tooth.rotation.y = -angle;
            gearGroup.add(tooth);
        }
        return gearGroup;
    }

    // 4. Center Wheel
    const centerWheel = createGear(1.2, 0.2, 24, brassMaterial);
    centerWheel.position.set(0, 0, 0);
    group.add(centerWheel);
    parts.centerWheel = centerWheel;

    // 5. Third Wheel
    const thirdWheel = createGear(0.9, 0.2, 18, brassMaterial);
    thirdWheel.position.set(1.5, -0.3, 1.5);
    group.add(thirdWheel);
    parts.thirdWheel = thirdWheel;

    // 6. Fourth Wheel
    const fourthWheel = createGear(0.7, 0.2, 14, brassMaterial);
    fourthWheel.position.set(3, -0.6, 0);
    group.add(fourthWheel);
    parts.fourthWheel = fourthWheel;

    // 7. Escape Wheel (special teeth)
    const escapeWheelGroup = new THREE.Group();
    const escapeBody = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const eBodyMesh = new THREE.Mesh(escapeBody, steelMaterial);
    escapeWheelGroup.add(eBodyMesh);
    const eToothGeo = new THREE.BoxGeometry(0.3, 0.1, 0.1);
    for(let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const tooth = new THREE.Mesh(eToothGeo, steelMaterial);
        tooth.position.set(Math.cos(angle) * 0.6, 0, Math.sin(angle) * 0.6);
        tooth.rotation.y = -angle + 0.5; // angled teeth
        escapeWheelGroup.add(tooth);
    }
    escapeWheelGroup.position.set(4, -0.9, -1);
    group.add(escapeWheelGroup);
    parts.escapeWheel = escapeWheelGroup;

    // 8. Pallet Fork
    const palletForkGroup = new THREE.Group();
    const forkGeo = new THREE.BoxGeometry(1.2, 0.1, 0.2);
    const forkMesh = new THREE.Mesh(forkGeo, steelMaterial);
    palletForkGroup.add(forkMesh);
    
    // Pallet jewels
    const jewelGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2);
    const jewel1 = new THREE.Mesh(jewelGeo, rubyMaterial);
    jewel1.position.set(-0.5, 0, 0.2);
    palletForkGroup.add(jewel1);
    const jewel2 = new THREE.Mesh(jewelGeo, rubyMaterial);
    jewel2.position.set(0.5, 0, 0.2);
    palletForkGroup.add(jewel2);

    palletForkGroup.position.set(4.5, -0.9, -0.2);
    palletForkGroup.rotation.y = Math.PI / 4;
    group.add(palletForkGroup);
    parts.palletFork = palletForkGroup;

    // 9. Balance Wheel
    const balanceWheel = new THREE.Group();
    const rimGeo = new THREE.TorusGeometry(0.8, 0.05, 8, 32);
    const rimMesh = new THREE.Mesh(rimGeo, brassMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    balanceWheel.add(rimMesh);
    const spokeGeo = new THREE.BoxGeometry(1.6, 0.05, 0.1);
    const spokeMesh = new THREE.Mesh(spokeGeo, brassMaterial);
    balanceWheel.add(spokeMesh);
    balanceWheel.position.set(5.5, -0.9, 0.5);
    group.add(balanceWheel);
    parts.balanceWheel = balanceWheel;

    // 10. Hairspring (spiral-like torus)
    const hairspringGeo = new THREE.TorusGeometry(0.4, 0.02, 8, 64);
    const hairspring = new THREE.Mesh(hairspringGeo, steelMaterial);
    hairspring.rotation.x = Math.PI / 2;
    hairspring.position.set(5.5, -0.8, 0.5);
    group.add(hairspring);
    parts.hairspring = hairspring;

    let time = 0;

    const update = (delta) => {
        time += delta;
        
        // Winding stem rotates slowly
        parts.windingStem.rotation.x += delta * 0.5;

        // Barrel and mainspring (slow continuous motion)
        parts.barrel.rotation.y += delta * 0.1;
        parts.mainspring.rotation.y += delta * 0.1;

        // Center wheel, third wheel, fourth wheel (progressively faster)
        parts.centerWheel.rotation.y += delta * 0.5;
        parts.thirdWheel.rotation.y -= delta * 1.5; // Counter rotation
        parts.fourthWheel.rotation.y += delta * 4;

        // Ticking motion for escapement and balance wheel
        // Tick every 0.25 seconds
        const tickRate = 4; // ticks per second
        const tickPhase = (time * tickRate) % 1;
        
        // Escape wheel moves in discrete steps
        const step = Math.floor(time * tickRate);
        const smoothStep = step + Math.pow(tickPhase, 3); // ease in tick
        parts.escapeWheel.rotation.y = smoothStep * (Math.PI * 2 / 15);

        // Pallet fork oscillates
        parts.palletFork.rotation.y = (Math.PI / 4) + Math.sin(time * tickRate * Math.PI) * 0.15;

        // Balance wheel oscillates with hairspring
        const balanceOscillation = Math.sin(time * tickRate * Math.PI) * 2;
        parts.balanceWheel.rotation.y = balanceOscillation;
        
        // Hairspring expands and contracts slightly
        const scale = 1 + Math.sin(time * tickRate * Math.PI) * 0.1;
        parts.hairspring.scale.set(scale, 1, scale);
    };

    const quizzes = [
        {
            question: "What is the primary power source in a mechanical clockwork?",
            options: ["The Balance Wheel", "The Mainspring", "The Escape Wheel", "The Pallet Fork"],
            answer: "The Mainspring"
        },
        {
            question: "Which component regulates the release of energy, creating the ticking sound?",
            options: ["The Barrel", "The Center Wheel", "The Escapement (Escape Wheel and Pallet Fork)", "The Winding Stem"],
            answer: "The Escapement (Escape Wheel and Pallet Fork)"
        },
        {
            question: "What part oscillates back and forth, acting as the timekeeping element?",
            options: ["The Balance Wheel", "The Winding Stem", "The Mainspring", "The Fourth Wheel"],
            answer: "The Balance Wheel"
        },
        {
            question: "What provides the restoring force to the balance wheel?",
            options: ["The Center Wheel", "The Hairspring", "The Pallet Fork", "The Barrel"],
            answer: "The Hairspring"
        },
        {
            question: "Which wheel typically drives the minute hand in a traditional watch movement?",
            options: ["The Third Wheel", "The Balance Wheel", "The Escape Wheel", "The Center Wheel"],
            answer: "The Center Wheel"
        },
        {
            question: "What is used to wind the mainspring manually?",
            options: ["The Winding Stem", "The Fourth Wheel", "The Pallet Fork", "The Third Wheel"],
            answer: "The Winding Stem"
        }
    ];

    return {
        group,
        update,
        quizzes
    };
}
