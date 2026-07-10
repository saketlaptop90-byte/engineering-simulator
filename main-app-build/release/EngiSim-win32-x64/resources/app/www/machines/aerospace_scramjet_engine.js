import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00aaff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8,
        wireframe: true
    });

    const fireMaterial = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff2200,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9
    });

    const neonGreenMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2
    });

    // 1. Inlet Casing (Outer stealth shell)
    const casingGeo = new THREE.CylinderGeometry(2, 3, 10, 32, 1, true);
    const casing = new THREE.Mesh(casingGeo, darkSteel);
    casing.rotation.z = Math.PI / 2;
    casing.position.set(0, 0, 0);
    group.add(casing);
    parts.push({
        name: "Inlet Casing",
        description: "Titanium stealth composite outer shell for thermal protection.",
        material: "darkSteel",
        function: "Provides aerodynamic structure and thermal shielding at Mach 5+.",
        assemblyOrder: 1,
        connections: ["Shockwave Cone", "Combustor"],
        failureEffect: "Thermal ablation and immediate structural disintegration.",
        cascadeFailures: ["Complete engine failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 }
    });
    
    // 2. Shockwave Cone (Isolator)
    const coneGeo = new THREE.ConeGeometry(1.5, 4, 32);
    const cone = new THREE.Mesh(coneGeo, chrome);
    cone.rotation.z = -Math.PI / 2;
    cone.position.set(-3, 0, 0);
    group.add(cone);
    parts.push({
        name: "Shockwave Cone",
        description: "Supersonic compression cone.",
        material: "chrome",
        function: "Generates oblique shockwaves to compress incoming hypersonic air.",
        assemblyOrder: 2,
        connections: ["Inlet Casing", "Magnetic Compressor"],
        failureEffect: "Unstart condition, loss of supersonic compression.",
        cascadeFailures: ["Engine flameout", "Shockwave blowback"],
        originalPosition: { x: -3, y: 0, z: 0 },
        explodedPosition: { x: -6, y: 0, z: 0 }
    });

    // 3. Magnetic Compressor Array
    const magCompressorGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.2, 1.4, 0.4);
        const blade = new THREE.Mesh(bladeGeo, neonGreenMaterial);
        blade.position.y = 0.8;
        const pivot = new THREE.Group();
        pivot.rotation.x = (i / 8) * Math.PI * 2;
        pivot.add(blade);
        magCompressorGroup.add(pivot);
    }
    magCompressorGroup.position.set(-1, 0, 0);
    group.add(magCompressorGroup);
    parts.push({
        name: "Magnetic Compressor Array",
        description: "Hybrid magnetohydrodynamic compressor stage.",
        material: "neonGreen",
        function: "Slows and compresses incoming air using electromagnetic fields.",
        assemblyOrder: 3,
        connections: ["Shockwave Cone", "Fuel Injectors"],
        failureEffect: "Loss of airflow stabilization.",
        cascadeFailures: ["Combustor stall"],
        originalPosition: { x: -1, y: 0, z: 0 },
        explodedPosition: { x: -3, y: -4, z: 0 }
    });

    // 4. Fuel Injection Rings
    const injectorRingGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 100);
    const injectorRing = new THREE.Mesh(injectorRingGeo, copper);
    injectorRing.rotation.y = Math.PI / 2;
    injectorRing.position.set(0.5, 0, 0);
    
    // Add glowing plasma nodes on the ring
    for (let i = 0; i < 12; i++) {
        const nodeGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const node = new THREE.Mesh(nodeGeo, plasmaMaterial);
        node.position.set(Math.cos((i/12)*Math.PI*2)*1.5, Math.sin((i/12)*Math.PI*2)*1.5, 0);
        injectorRing.add(node);
    }
    group.add(injectorRing);
    parts.push({
        name: "Plasma Fuel Injectors",
        description: "Supercritical fuel injection ring with plasma pre-ionizers.",
        material: "copper / plasma",
        function: "Injects and pre-ignites fuel in supersonic airflow.",
        assemblyOrder: 4,
        connections: ["Magnetic Compressor", "Plasma Combustor"],
        failureEffect: "Uneven combustion or flameout.",
        cascadeFailures: ["Thrust asymmetry", "Engine unstart"],
        originalPosition: { x: 0.5, y: 0, z: 0 },
        explodedPosition: { x: 0.5, y: 4, z: -4 }
    });

    // 5. Plasma Combustor Core
    const combustorGeo = new THREE.CylinderGeometry(1.2, 1.8, 4, 32);
    const combustor = new THREE.Mesh(combustorGeo, fireMaterial);
    combustor.rotation.z = Math.PI / 2;
    combustor.position.set(3, 0, 0);
    group.add(combustor);
    parts.push({
        name: "Supersonic Plasma Combustor",
        description: "Scramjet combustion chamber operating at plasma temperatures.",
        material: "fireMaterial",
        function: "Maintains supersonic combustion, generating massive thrust.",
        assemblyOrder: 5,
        connections: ["Fuel Injectors", "Exhaust Nozzle"],
        failureEffect: "Combustion collapse.",
        cascadeFailures: ["Complete loss of thrust"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 3, y: -5, z: 0 }
    });

    // 6. Thermal Cooling Channels
    const coolingGroup = new THREE.Group();
    for (let i = 0; i < 16; i++) {
        const pipeGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
        const pipe = new THREE.Mesh(pipeGeo, steel);
        pipe.rotation.z = Math.PI / 2;
        pipe.position.set(3, Math.cos((i/16)*Math.PI*2)*1.9, Math.sin((i/16)*Math.PI*2)*1.9);
        coolingGroup.add(pipe);
    }
    group.add(coolingGroup);
    parts.push({
        name: "Cryogenic Cooling Channels",
        description: "Regenerative cooling network pumping cryogenic fuel.",
        material: "steel",
        function: "Prevents the combustor from melting by circulating cryogenic fuel.",
        assemblyOrder: 6,
        connections: ["Plasma Combustor"],
        failureEffect: "Combustor wall meltdown.",
        cascadeFailures: ["Catastrophic engine explosion"],
        originalPosition: { x: 3, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 5, z: 4 }
    });

    // 7. Exhaust Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(1.8, 2.5, 3, 32, 1, true);
    const nozzle = new THREE.Mesh(nozzleGeo, darkSteel);
    nozzle.rotation.z = Math.PI / 2;
    nozzle.position.set(6.5, 0, 0);
    group.add(nozzle);
    parts.push({
        name: "Expanding Exhaust Nozzle",
        description: "High-expansion ratio titanium nozzle.",
        material: "darkSteel",
        function: "Expands exhaust gases to maximize hypersonic thrust.",
        assemblyOrder: 7,
        connections: ["Plasma Combustor"],
        failureEffect: "Thrust vectoring loss.",
        cascadeFailures: ["Vehicle instability"],
        originalPosition: { x: 6.5, y: 0, z: 0 },
        explodedPosition: { x: 9, y: 0, z: 0 }
    });

    // 8. Magnetic Confinement Rings
    const magRingsGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
        const ringGeo = new THREE.TorusGeometry(2.2, 0.15, 16, 64);
        const ring = new THREE.Mesh(ringGeo, neonGreenMaterial);
        ring.rotation.y = Math.PI / 2;
        ring.position.set(5.5 + i * 1.0, 0, 0);
        magRingsGroup.add(ring);
    }
    group.add(magRingsGroup);
    parts.push({
        name: "Magnetic Confinement Rings",
        description: "Electromagnetic fields containing plasma exhaust.",
        material: "neonGreenMaterial",
        function: "Prevents plasma exhaust from eroding the physical nozzle.",
        assemblyOrder: 8,
        connections: ["Exhaust Nozzle"],
        failureEffect: "Rapid nozzle ablation.",
        cascadeFailures: ["Nozzle structural failure"],
        originalPosition: { x: 6.5, y: 0, z: 0 },
        explodedPosition: { x: 9, y: 4, z: 0 }
    });

    const description = "The Scramjet (Supersonic Combusting Ramjet) Engine represents the pinnacle of hypersonic air-breathing propulsion. Operating at speeds exceeding Mach 5, it uses the vehicle's forward motion to compress incoming air through shockwaves, mixing it with cryogenic fuel and igniting it while still flowing at supersonic velocities. This ultra high-tech model features magnetic compressor stabilization, plasma pre-ionization fuel injectors, and a magnetically confined plasma combustor core.";

    const quizQuestions = [
        {
            question: "What is the primary difference between a scramjet and a traditional ramjet?",
            options: [
                "Scramjets use turbines for compression",
                "Scramjets have subsonic combustion",
                "Scramjets maintain supersonic airflow through the combustion chamber",
                "Scramjets operate only in a vacuum"
            ],
            correct: 2,
            explanation: "In a traditional ramjet, incoming air is slowed to subsonic speeds for combustion. In a scramjet (Supersonic Combusting Ramjet), the airflow remains supersonic throughout the entire engine, allowing for much higher speeds.",
            difficulty: "Medium"
        },
        {
            question: "Why are Cryogenic Cooling Channels critical in this scramjet design?",
            options: [
                "To freeze the incoming air",
                "To prevent the combustor walls from melting due to extreme heat",
                "To reduce the engine's radar cross-section",
                "To power the magnetic compressor"
            ],
            correct: 1,
            explanation: "At hypersonic speeds, friction and supersonic combustion generate immense heat. Regenerative cooling uses the cold fuel to cool the engine walls before the fuel is injected into the combustor.",
            difficulty: "Easy"
        },
        {
            question: "What function do the Magnetic Confinement Rings serve at the exhaust?",
            options: [
                "They generate electricity for the aircraft",
                "They prevent the ultra-hot plasma exhaust from eroding the nozzle",
                "They compress the incoming air",
                "They mix the fuel and air"
            ],
            correct: 1,
            explanation: "The exhaust temperatures in an advanced scramjet can reach plasma states. Magnetic confinement pushes the plasma away from the physical walls of the nozzle, preventing rapid ablation and structural failure.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate magnetic compressor
        if (meshes[2]) {
            meshes[2].rotation.x = time * speed * 2.0;
        }
        
        // Pulse plasma material on fuel injectors
        if (meshes[3]) {
            const pulse = (Math.sin(time * speed * 5.0) + 1) / 2;
            meshes[3].children.forEach(node => {
                if(node.material) {
                    node.material.emissiveIntensity = 1.0 + pulse * 3.0;
                    node.scale.setScalar(1.0 + pulse * 0.2);
                }
            });
        }
        
        // Pulse plasma combustor core
        if (meshes[4]) {
            const firePulse = (Math.random() * 0.5 + 0.5);
            meshes[4].material.opacity = 0.7 + firePulse * 0.3;
            meshes[4].scale.set(1.0, 1.0 + Math.sin(time * speed * 10) * 0.05, 1.0 + Math.sin(time * speed * 10) * 0.05);
        }

        // Rotate magnetic confinement rings
        if (meshes[7]) {
            meshes[7].children.forEach((ring, idx) => {
                ring.rotation.z = time * speed * (idx % 2 === 0 ? 1 : -1) * 3.0;
                ring.scale.setScalar(1.0 + Math.sin(time * speed * 4.0 + idx) * 0.05);
            });
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
export function createScramjetEngine() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
