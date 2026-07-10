import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const neutrinoGlow = new THREE.MeshPhysicalMaterial({
        color: 0x00aaff,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0
    });

    const goldenPhotocathode = new THREE.MeshPhysicalMaterial({
        color: 0xffaa00,
        emissive: 0x553300,
        emissiveIntensity: 0.3,
        roughness: 0.2,
        metalness: 0.9,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.9
    });

    const cherenkovGlow = new THREE.MeshBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.0,
        blending: THREE.AdditiveBlending
    });

    const dynodeMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        roughness: 0.4,
        metalness: 0.8,
        emissive: 0x222222,
        emissiveIntensity: 0.1
    });

    // 1. Bulb (Glass Envelope) - The massive golden sphere structure
    const bulbGeometry = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.65);
    const bulbMesh = new THREE.Mesh(bulbGeometry, goldenPhotocathode);
    bulbMesh.position.set(0, 0, 0);
    group.add(bulbMesh);
    parts.push({
        name: 'Glass Envelope & Photocathode',
        description: 'Large spherical glass vacuum bulb coated with a golden photosensitive layer to convert Cherenkov photons into photoelectrons.',
        material: 'goldenPhotocathode',
        function: 'Photon collection and conversion',
        assemblyOrder: 1,
        connections: ['Dynode Chain', 'Support Structure'],
        failureEffect: 'Vacuum leak, failure to detect photons.',
        cascadeFailures: ['Complete module failure'],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 0 },
        mesh: bulbMesh
    });

    // 2. Bulb Neck / Housing
    const neckGeometry = new THREE.CylinderGeometry(0.8, 1.2, 1.5, 32);
    const neckMesh = new THREE.Mesh(neckGeometry, glass);
    neckMesh.position.set(0, -1.8, 0);
    group.add(neckMesh);
    parts.push({
        name: 'Glass Neck',
        description: 'Neck of the PMT housing the electron multiplier structure and vacuum seal.',
        material: 'glass',
        function: 'Structural support and containment for dynodes',
        assemblyOrder: 2,
        connections: ['Glass Envelope', 'Base Socket'],
        failureEffect: 'Implosion risk if structure compromised.',
        cascadeFailures: ['Shockwave damaging nearby PMTs'],
        originalPosition: { x: 0, y: -1.8, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 },
        mesh: neckMesh
    });

    // 3. Dynode Chain (Electron Multiplier)
    const dynodeGroup = new THREE.Group();
    dynodeGroup.position.set(0, -1.5, 0);
    const numDynodes = 10;
    for (let i = 0; i < numDynodes; i++) {
        const dyGeom = new THREE.CylinderGeometry(0.5 - i*0.03, 0.5 - i*0.03, 0.1, 16);
        const dyMesh = new THREE.Mesh(dyGeom, dynodeMaterial);
        dyMesh.position.set(0, -i * 0.15, 0);
        dyMesh.rotation.x = Math.PI * 0.05 * (i % 2 === 0 ? 1 : -1);
        dynodeGroup.add(dyMesh);
    }
    group.add(dynodeGroup);
    parts.push({
        name: 'Dynode Chain',
        description: 'A series of electrodes (dynodes) at increasingly positive potentials that multiply the electron avalanche by a factor of ~10^7.',
        material: 'dynodeMaterial',
        function: 'Signal amplification',
        assemblyOrder: 3,
        connections: ['Glass Neck', 'Anode'],
        failureEffect: 'Loss of signal gain, degraded detection.',
        cascadeFailures: ['Incorrect energy readings'],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 2, y: -2, z: 0 },
        mesh: dynodeGroup
    });

    // 4. Anode Base Socket
    const baseGeometry = new THREE.CylinderGeometry(0.85, 0.85, 0.5, 32);
    const baseMesh = new THREE.Mesh(baseGeometry, plastic);
    baseMesh.position.set(0, -2.6, 0);
    group.add(baseMesh);
    parts.push({
        name: 'Anode Base Socket',
        description: 'Connects the dynode chain to the data acquisition electronics and supplies high voltage.',
        material: 'plastic',
        function: 'Electrical interface and HV supply',
        assemblyOrder: 4,
        connections: ['Dynode Chain', 'Cables'],
        failureEffect: 'High voltage short circuit.',
        cascadeFailures: ['Power supply trip'],
        originalPosition: { x: 0, y: -2.6, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // 5. Cherenkov Radiation Flash (Invisible initially)
    const flashGeom = new THREE.SphereGeometry(1.6, 32, 32);
    const flashMesh = new THREE.Mesh(flashGeom, cherenkovGlow);
    group.add(flashMesh);
    parts.push({
        name: 'Cherenkov Flash Detection',
        description: 'A visual representation of the faint blue Cherenkov light cone produced by faster-than-light particles in water/ice.',
        material: 'cherenkovGlow',
        function: 'Particle detection signature',
        assemblyOrder: 5,
        connections: [],
        failureEffect: 'N/A',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 3, z: 0 },
        mesh: flashMesh
    });

    const description = "Neutrino Photomultiplier Tube (PMT): An ultra-sensitive light detector used in giant observatories like IceCube or Super-Kamiokande. It detects the faint Cherenkov radiation emitted when high-energy particles (like muons from neutrino interactions) travel through water or ice faster than the local speed of light.";

    const quizQuestions = [
        {
            question: "What is the primary function of the PMT in a neutrino observatory?",
            options: [
                "To detect the faint Cherenkov light produced by secondary particles.",
                "To directly capture neutrinos via gravity.",
                "To cool the surrounding ice or water.",
                "To emit high-energy lasers to stimulate the water."
            ],
            correct: 0,
            explanation: "PMTs are incredibly sensitive light detectors. They look for the faint, brief flashes of blue Cherenkov light emitted when charged particles travel faster than the phase velocity of light in the surrounding medium (ice or water).",
            difficulty: "Medium"
        },
        {
            question: "What role does the dynode chain play in the PMT?",
            options: [
                "It cools the photomultiplier tube.",
                "It filters out background radiation.",
                "It multiplies the initial photoelectron into an avalanche of millions of electrons.",
                "It focuses the incoming light cone."
            ],
            correct: 2,
            explanation: "The dynode chain multiplies the weak initial signal (a single electron) through a cascading effect. Each dynode is at a higher voltage, accelerating electrons to strike the next one, releasing more electrons, achieving a gain of up to 10^7.",
            difficulty: "Hard"
        },
        {
            question: "Why are these PMTs often coated in a golden or metallic looking substance on the inner glass?",
            options: [
                "To reflect light back out.",
                "It is the photocathode material that converts photons to electrons via the photoelectric effect.",
                "To prevent the glass from shattering under high pressure.",
                "To look aesthetic for funding presentations."
            ],
            correct: 1,
            explanation: "The inner surface of the glass envelope is coated with a thin layer of photosensitive material (the photocathode, often a bialkali compound). When a photon strikes it, it can eject an electron via the photoelectric effect.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Subtle floating / hovering effect
        group.position.y = Math.sin(time * 0.001 * speed) * 0.1;
        
        // Simulating random particle impacts (Cherenkov flashes)
        const flashMod = Math.random();
        if (flashMod > 0.95) {
            cherenkovGlow.opacity = Math.random() * 0.5 + 0.3; // Flash!
            goldenPhotocathode.emissiveIntensity = 0.8;
            dynodeMaterial.emissiveIntensity = 0.8;
        } else {
            cherenkovGlow.opacity = Math.max(0, cherenkovGlow.opacity - 0.05 * speed); // Fade out
            goldenPhotocathode.emissiveIntensity = Math.max(0.3, goldenPhotocathode.emissiveIntensity - 0.02 * speed);
            dynodeMaterial.emissiveIntensity = Math.max(0.1, dynodeMaterial.emissiveIntensity - 0.05 * speed);
        }
        
        // Spin slowly
        group.rotation.y = time * 0.0002 * speed;
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
export function createNeutrinoPMT() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
