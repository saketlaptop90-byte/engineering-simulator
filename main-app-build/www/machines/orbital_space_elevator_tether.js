import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const meshes = {};

    // Custom Materials for Ultra-Tech Look
    const plasmaMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2.5,
        transparent: true,
        opacity: 0.8
    });
    
    const neonOrange = new THREE.MeshStandardMaterial({
        color: 0xff5500,
        emissive: 0xff3300,
        emissiveIntensity: 1.5,
        wireframe: true
    });
    
    const carbonRibbonMat = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const forceField = new THREE.MeshPhongMaterial({
        color: 0xaa00ff,
        emissive: 0x5500cc,
        transparent: true,
        opacity: 0.15,
        wireframe: true
    });
    
    const laserMat = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    // 1. Nanotube Ribbon (Vertical track)
    const ribbonGeo = new THREE.BoxGeometry(0.2, 30, 2);
    const ribbon = new THREE.Mesh(ribbonGeo, carbonRibbonMat);
    group.add(ribbon);
    meshes.ribbon = ribbon;

    // 2. Central Chassis (Main body)
    const chassisGeo = new THREE.CylinderGeometry(2, 2, 8, 8);
    const chassis = new THREE.Mesh(chassisGeo, darkSteel);
    chassis.position.set(0, 0, 0);
    group.add(chassis);
    meshes.chassis = chassis;

    // 3. Drive Wheels
    meshes.wheels = [];
    const wheelGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.8, 32);
    for (let i = 0; i < 4; i++) {
        const wheel = new THREE.Mesh(wheelGeo, rubber);
        const yPos = i < 2 ? 2 : -2;
        const zPos = i % 2 === 0 ? 1.5 : -1.5;
        wheel.position.set(0, yPos, zPos);
        wheel.rotation.z = Math.PI / 2;
        
        // Hubcap
        const hubcap = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.85, 16), chrome);
        hubcap.rotation.x = Math.PI / 2;
        wheel.add(hubcap);
        
        group.add(wheel);
        meshes.wheels.push(wheel);
    }

    // 4. Plasma Core Engine
    const coreGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const plasmaCore = new THREE.Mesh(coreGeo, plasmaMaterial);
    plasmaCore.position.set(0, -5, 0);
    plasmaCore.scale.set(1, 1.5, 1);
    group.add(plasmaCore);
    meshes.plasmaCore = plasmaCore;

    // 5. Magnetic Confinement Rings
    meshes.rings = [];
    const ringGeo = new THREE.TorusGeometry(2.5, 0.2, 16, 64);
    for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(ringGeo, copper);
        ring.position.set(0, -5, 0);
        group.add(ring);
        meshes.rings.push({ mesh: ring, offset: i * (Math.PI / 1.5) });
    }

    // 6. Force Field Shield
    const shieldGeo = new THREE.SphereGeometry(3, 32, 32);
    const shield = new THREE.Mesh(shieldGeo, forceField);
    shield.position.set(0, -5, 0);
    group.add(shield);
    meshes.shield = shield;

    // 7. Cargo / Crew Modules
    meshes.modules = [];
    const modGeo = new THREE.BoxGeometry(2, 3, 2);
    for (let i = 0; i < 2; i++) {
        const mod = new THREE.Mesh(modGeo, aluminum);
        const xPos = i === 0 ? 3 : -3;
        mod.position.set(xPos, 1, 0);
        
        // Window
        const win = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1, 1), tinted);
        mod.add(win);
        
        group.add(mod);
        meshes.modules.push(mod);
    }

    // 8. Radiator Wings / Solar Arrays
    meshes.wings = [];
    const wingGeo = new THREE.PlaneGeometry(3, 8);
    for (let i = 0; i < 4; i++) {
        const wing = new THREE.Mesh(wingGeo, neonOrange);
        wing.material.side = THREE.DoubleSide;
        wing.position.set(0, 3, 0); 
        wing.geometry.translate(0, 4, 0); 
        group.add(wing);
        meshes.wings.push({ mesh: wing, angleOffset: (Math.PI / 2) * i });
    }

    // 9. Laser Comm Array
    const commGeo = new THREE.CylinderGeometry(0.1, 0.5, 2, 16);
    const commArray = new THREE.Mesh(commGeo, chrome);
    commArray.position.set(0, 5, 0);
    group.add(commArray);
    meshes.commArray = commArray;

    const laserTip = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), laserMat);
    laserTip.position.set(0, 1, 0);
    commArray.add(laserTip);
    meshes.laserTip = laserTip;

    const parts = [
        {
            name: "Carbon Nanotube Ribbon",
            description: "The macroscopic fullerene strand extending from Earth's equator to a geostationary counterweight.",
            material: "Hyper-tensile Carbon Lattice",
            function: "Provides the physical track and structural integrity for orbital ascent.",
            assemblyOrder: 1,
            connections: ["Primary Drive Wheels"],
            failureEffect: "Catastrophic planetary debris field and atmospheric ignition event.",
            cascadeFailures: ["Complete system disintegration", "Loss of crawler track"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -10 }
        },
        {
            name: "Central Chassis",
            description: "The armored exoskeleton enclosing the main ascent mechanisms.",
            material: "Titanium-Tungsten Superalloy",
            function: "Houses all sensitive internal components and supports outer modules.",
            assemblyOrder: 2,
            connections: ["Carbon Nanotube Ribbon", "Cargo Modules", "Plasma Core Engine"],
            failureEffect: "Structural buckling under extreme G-forces and atmospheric drag.",
            cascadeFailures: ["Module detachment", "Drive wheel misalignment"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: 15 }
        },
        {
            name: "Primary Drive Wheels",
            description: "High-friction, magnetic-adhesion rollers that grip the tether.",
            material: "Graphene-infused Synthetic Rubber & Chrome",
            function: "Translates rotational torque into vertical ascension along the ribbon.",
            assemblyOrder: 3,
            connections: ["Central Chassis", "Carbon Nanotube Ribbon"],
            failureEffect: "Loss of traction resulting in uncontrolled descent.",
            cascadeFailures: ["Ribbon frictional overheating", "Emergency brake activation"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -8, y: 0, z: 0 }
        },
        {
            name: "Plasma Core Engine",
            description: "A compact fusion reactor providing the immense power required for orbital lift.",
            material: "Containment Field & Plasma",
            function: "Generates electrical power for drive wheels and life support.",
            assemblyOrder: 4,
            connections: ["Central Chassis", "Magnetic Confinement Rings"],
            failureEffect: "Power loss and potential plasma venting.",
            cascadeFailures: ["Magnetic field collapse", "Life support failure"],
            originalPosition: { x: 0, y: -5, z: 0 },
            explodedPosition: { x: 0, y: -15, z: 0 }
        },
        {
            name: "Magnetic Confinement Rings",
            description: "Superconducting toroids shaping the magnetic bottle.",
            material: "Copper-Niobium Superconductors",
            function: "Prevents the superheated plasma from melting the chassis.",
            assemblyOrder: 5,
            connections: ["Plasma Core Engine"],
            failureEffect: "Plasma core breach.",
            cascadeFailures: ["Reactor meltdown", "Hull breach"],
            originalPosition: { x: 0, y: -5, z: 0 },
            explodedPosition: { x: 0, y: -15, z: 10 }
        },
        {
            name: "Energy Shield Generator",
            description: "A localized electromagnetic deflector shield.",
            material: "Ionized Force Field",
            function: "Deflects micrometeoroids and space debris during ascent.",
            assemblyOrder: 6,
            connections: ["Plasma Core Engine"],
            failureEffect: "Vulnerability to high-velocity orbital impacts.",
            cascadeFailures: ["Hull penetration", "Decompression"],
            originalPosition: { x: 0, y: -5, z: 0 },
            explodedPosition: { x: 10, y: -5, z: 0 }
        },
        {
            name: "Crew & Cargo Modules",
            description: "Pressurized compartments for payload transport.",
            material: "Aerospace Aluminum & Transparent Alumina",
            function: "Safely transports personnel and materials to orbit.",
            assemblyOrder: 7,
            connections: ["Central Chassis"],
            failureEffect: "Loss of atmospheric pressure.",
            cascadeFailures: ["Hypoxia", "Payload freezing"],
            originalPosition: { x: 0, y: 1, z: 0 },
            explodedPosition: { x: 15, y: 1, z: 0 }
        },
        {
            name: "Radiator Wings / Solar Arrays",
            description: "Deployable thermal management and auxiliary power arrays.",
            material: "Neon-glowing Graphene Radiators",
            function: "Dissipates fusion heat and gathers solar energy in the upper atmosphere.",
            assemblyOrder: 8,
            connections: ["Central Chassis"],
            failureEffect: "Overheating of internal systems.",
            cascadeFailures: ["Computer shutdown", "Reactor scram"],
            originalPosition: { x: 0, y: 3, z: 0 },
            explodedPosition: { x: 0, y: 12, z: -10 }
        },
        {
            name: "Laser Comm Array",
            description: "High-bandwidth optical communication transceiver.",
            material: "Chrome & Photonic Emitters",
            function: "Maintains constant telemetry lock with ground control and the orbital counterweight.",
            assemblyOrder: 9,
            connections: ["Central Chassis"],
            failureEffect: "Loss of telemetry and remote override.",
            cascadeFailures: ["Navigational drift", "Automated abort"],
            originalPosition: { x: 0, y: 5, z: 0 },
            explodedPosition: { x: 0, y: 15, z: 5 }
        }
    ];

    const description = "The Orbital Space Elevator Tether (Crawler) represents the pinnacle of macro-engineering. Designed to scale a single, flawless strand of carbon nanotubes spanning 36,000 kilometers from the Earth's surface to a counterweight in geostationary orbit. It is powered by a compact plasma core, employing magnetic drive wheels and advanced thermal radiator arrays. The crawler hauls massive payloads with zero rocket emissions, making space accessible and sustainable.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Magnetic Confinement Rings?",
            options: [
                "To rotate the solar arrays",
                "To contain the superheated plasma in the engine",
                "To transmit laser communications",
                "To provide oxygen to the crew"
            ],
            correct: 1,
            explanation: "The Magnetic Confinement Rings use superconducting electromagnets to create a 'bottle' that safely contains the fusion plasma.",
            difficulty: "Medium"
        },
        {
            question: "Why does the Crawler use Carbon Nanotubes for its ribbon track?",
            options: [
                "Because they are highly conductive",
                "Due to their extreme tensile strength-to-weight ratio",
                "They are inexpensive to manufacture",
                "To absorb micrometeoroid impacts"
            ],
            correct: 1,
            explanation: "Carbon nanotubes possess an immensely high tensile strength, which is absolutely required to support a structure spanning 36,000 km without snapping under its own weight.",
            difficulty: "Hard"
        },
        {
            question: "What system protects the Crawler from micrometeoroids and space debris?",
            options: [
                "Energy Shield Generator",
                "Radiator Wings",
                "Laser Comm Array",
                "Drive Wheels"
            ],
            correct: 0,
            explanation: "The Energy Shield Generator creates an electromagnetic deflector field that repels high-velocity micro-debris during the ascent.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, activeMeshes = meshes) {
        // Pulse plasma core
        const pulse = (Math.sin(time * 5 * speed) + 1) / 2;
        if (activeMeshes.plasmaCore) {
            activeMeshes.plasmaCore.scale.set(
                1 + pulse * 0.1,
                1.5 + pulse * 0.2,
                1 + pulse * 0.1
            );
            activeMeshes.plasmaCore.material.emissiveIntensity = 1 + pulse * 2;
        }

        // Rotate magnetic rings
        if (activeMeshes.rings) {
            activeMeshes.rings.forEach((ringData) => {
                ringData.mesh.rotation.x = time * 2 * speed + ringData.offset;
                ringData.mesh.rotation.y = time * 3 * speed + ringData.offset;
            });
        }

        // Spin drive wheels
        if (activeMeshes.wheels) {
            activeMeshes.wheels.forEach((wheel, idx) => {
                const dir = idx < 2 ? 1 : -1;
                wheel.rotation.y += speed * dir * 0.5;
            });
        }

        // Rotate and pulse shield
        if (activeMeshes.shield) {
            activeMeshes.shield.rotation.y = time * speed;
            activeMeshes.shield.material.opacity = 0.1 + pulse * 0.1;
        }

        // Rotate radiator wings like a fan or expanding array
        if (activeMeshes.wings) {
            activeMeshes.wings.forEach((wingData) => {
                wingData.mesh.rotation.x = Math.sin(time * 0.5 * speed) * 0.2;
                wingData.mesh.rotation.y = wingData.angleOffset + time * speed * 0.2;
            });
        }

        // Rotate laser comm array and pulse tip
        if (activeMeshes.commArray) {
            activeMeshes.commArray.rotation.y = time * 3 * speed;
        }
        if (activeMeshes.laserTip) {
            activeMeshes.laserTip.material.color.setHSL((time * speed * 2) % 1, 1, 0.5);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}
