import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    group.name = "bio_photosynthetic_harvester";

    const parts = [];
    const meshes = {};

    const neonGreenGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
    });

    const neonBlueGlow = new THREE.MeshPhysicalMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.2,
        metalness: 0.5,
    });

    const frameGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const frameMesh = new THREE.Mesh(frameGeo, darkSteel);
    frameMesh.position.set(0, -0.25, 0);
    group.add(frameMesh);
    meshes.frame = frameMesh;

    parts.push({
        name: "Titanium Substrate Frame",
        description: "The primary structural foundation holding the catalyst arrays.",
        material: "darkSteel",
        function: "Structural support and heat dissipation.",
        assemblyOrder: 1,
        connections: ["Bio-Catalyst Plate"],
        failureEffect: "Overall structural instability.",
        cascadeFailures: ["Rupture of fluid lines", "Misalignment of solar collectors"],
        originalPosition: {x: 0, y: -0.25, z: 0},
        explodedPosition: {x: 0, y: -2, z: 0}
    });

    const plateGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.2, 32);
    const plateMesh = new THREE.Mesh(plateGeo, neonGreenGlow);
    plateMesh.position.set(0, 0.1, 0);
    group.add(plateMesh);
    meshes.plate = plateMesh;

    parts.push({
        name: "Bio-Catalyst Plate",
        description: "A highly complex matrix embedded with engineered photosynthetic enzymes.",
        material: "neonGreenGlow",
        function: "Absorbs photons and drives the water-splitting reaction.",
        assemblyOrder: 2,
        connections: ["Titanium Substrate Frame", "Photon Concentrator Dome"],
        failureEffect: "Immediate halt of hydrogen production.",
        cascadeFailures: ["Enzyme denaturation", "Overheating of substrate"],
        originalPosition: {x: 0, y: 0.1, z: 0},
        explodedPosition: {x: 0, y: 1, z: 0}
    });

    const domeGeo = new THREE.SphereGeometry(1.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, glass);
    domeMesh.position.set(0, 0.2, 0);
    group.add(domeMesh);
    meshes.dome = domeMesh;

    parts.push({
        name: "Photon Concentrator Dome",
        description: "A hyper-clear geodesic glass dome that focuses sunlight onto the catalyst.",
        material: "glass",
        function: "Maximizes photon flux density onto the catalyst plate.",
        assemblyOrder: 3,
        connections: ["Bio-Catalyst Plate"],
        failureEffect: "Reduced efficiency in low light.",
        cascadeFailures: ["Drop in reaction rate"],
        originalPosition: {x: 0, y: 0.2, z: 0},
        explodedPosition: {x: 0, y: 3, z: 0}
    });

    const coreGeo = new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
    const coreMesh = new THREE.Mesh(coreGeo, neonBlueGlow);
    coreMesh.position.set(0, 1, 0);
    group.add(coreMesh);
    meshes.core = coreMesh;

    parts.push({
        name: "Hydrogen Extraction Core",
        description: "An ion-selective conduit that captures and compresses neon-blue ionized hydrogen gas.",
        material: "neonBlueGlow",
        function: "Separates and channels the generated hydrogen away from oxygen.",
        assemblyOrder: 4,
        connections: ["Bio-Catalyst Plate"],
        failureEffect: "Hydrogen-oxygen recombination (explosive risk).",
        cascadeFailures: ["System rupture", "Catastrophic combustion"],
        originalPosition: {x: 0, y: 1, z: 0},
        explodedPosition: {x: 0, y: 5, z: 0}
    });

    const ringGeo = new THREE.TorusGeometry(1.5, 0.1, 16, 64);
    const ringMesh = new THREE.Mesh(ringGeo, chrome);
    ringMesh.position.set(0, 0.3, 0);
    ringMesh.rotation.x = Math.PI / 2;
    group.add(ringMesh);
    meshes.ring = ringMesh;

    parts.push({
        name: "Oxygen Venting Ring",
        description: "A chrome-plated manifold that safely diffuses waste oxygen into the atmosphere.",
        material: "chrome",
        function: "Releases oxygen by-product.",
        assemblyOrder: 5,
        connections: ["Bio-Catalyst Plate"],
        failureEffect: "Oxygen buildup, slowing the reaction.",
        cascadeFailures: ["Catalyst oxidation"],
        originalPosition: {x: 0, y: 0.3, z: 0},
        explodedPosition: {x: 0, y: 2.5, z: 0}
    });

    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 100;
    const positions = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 3;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.1,
        transparent: true,
        opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);
    meshes.particles = particles;

    const description = "The Bio-Photosynthetic Harvester, or 'Artificial Leaf', represents a breakthrough in sustainable energy. By mimicking plant biology using advanced nanostructures and engineered enzymes, it absorbs solar photons to drive the splitting of water into hydrogen and oxygen. The glowing green bio-catalyst plate represents the active reaction site, while the glowing blue core signifies the extraction of pure, high-energy hydrogen fuel.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Bio-Catalyst Plate in the Artificial Leaf?",
            options: [
                "To store electrical energy like a battery.",
                "To absorb photons and drive the water-splitting reaction.",
                "To filter impurities from the water supply.",
                "To cool the surrounding components."
            ],
            correct: 1,
            explanation: "The Bio-Catalyst Plate absorbs sunlight and uses that energy to break water molecules (H2O) into hydrogen and oxygen.",
            difficulty: "easy"
        },
        {
            question: "Why is the Hydrogen Extraction Core crucial for the safe operation of the harvester?",
            options: [
                "It prevents the recombination of hydrogen and oxygen, which could cause an explosion.",
                "It makes the device look visually appealing with its blue glow.",
                "It generates the magnetic field needed for the reaction.",
                "It pumps water into the catalyst plate."
            ],
            correct: 0,
            explanation: "Hydrogen and oxygen are highly reactive. If they aren't separated quickly and efficiently by the core, they can recombine explosively.",
            difficulty: "medium"
        },
        {
            question: "What happens if the Oxygen Venting Ring fails?",
            options: [
                "The system produces more hydrogen.",
                "The core temperature drops significantly.",
                "Oxygen buildup occurs, potentially oxidizing and degrading the catalyst.",
                "The photon dome shatters."
            ],
            correct: 2,
            explanation: "If oxygen cannot escape, it builds up and can cause the oxidation of the sensitive bio-catalyst, ruining its efficiency.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshesObj) {
        const pulse = Math.sin(time * speed * 2) * 0.5 + 0.5;
        if(meshesObj.plate && meshesObj.plate.material) {
            meshesObj.plate.material.emissiveIntensity = 1.0 + pulse * 2.0;
        }

        if(meshesObj.ring) {
            meshesObj.ring.rotation.z += 0.01 * speed;
        }

        if(meshesObj.core && meshesObj.core.material) {
            meshesObj.core.material.emissiveIntensity = 1.0 + Math.cos(time * speed * 3) * 1.5;
        }
        
        if(meshesObj.particles && meshesObj.particles.geometry.attributes.position) {
            const positions = meshesObj.particles.geometry.attributes.position.array;
            for(let i = 1; i < positions.length; i += 3) {
                positions[i] += 0.02 * speed;
                if (positions[i] > 3) {
                    positions[i] = -0.5;
                    positions[i-1] = (Math.random() - 0.5) * 3;
                    positions[i+1] = (Math.random() - 0.5) * 3;
                }
            }
            meshesObj.particles.geometry.attributes.position.needsUpdate = true;
        }
    }

    return { group, parts, description, quizQuestions, animate, meshes };
}

// Auto-generated missing stub
export function createPhotosyntheticProteinHarvester() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
