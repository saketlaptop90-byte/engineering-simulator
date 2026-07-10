import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const protonPumpGlow = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 2,
        transparent: true,
        opacity: 0.8
    });

    const mitochondriaCore = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xffaa00,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.9
    });

    const acidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xccff00,
        emissive: 0xccff00,
        emissiveIntensity: 0.5,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 1.33,
        thickness: 0.5
    });

    const cytoplasmMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x112233,
        transmission: 0.9,
        opacity: 1,
        metalness: 0,
        roughness: 0.2,
        ior: 1.4,
        thickness: 2.0
    });

    // 1. Cell Membrane (Base structure)
    const membraneGeo = new THREE.CylinderGeometry(5, 5, 8, 32, 1, false, 0, Math.PI);
    const membraneMesh = new THREE.Mesh(membraneGeo, cytoplasmMaterial);
    membraneMesh.rotation.x = Math.PI / 2;
    group.add(membraneMesh);
    parts.push({
        name: "Cell Membrane & Cytoplasm",
        description: "The protective barrier of the parietal cell, housing internal organelles and maintaining the concentration gradient.",
        material: "cytoplasmMaterial",
        function: "Encloses cell contents and regulates the transport of ions.",
        assemblyOrder: 1,
        connections: ["Canaliculi", "Mitochondria"],
        failureEffect: "Cellular lysis and inability to contain acid.",
        cascadeFailures: ["Ion imbalance", "Cell death"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: -10 }
    });

    // 2. Secretory Canaliculi
    const canaliculiGeo = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const canaliculiMesh = new THREE.Mesh(canaliculiGeo, plastic);
    canaliculiMesh.position.set(0, 0, 2);
    group.add(canaliculiMesh);
    parts.push({
        name: "Secretory Canaliculi",
        description: "Deep infoldings of the apical cell membrane that vastly increase surface area for acid secretion.",
        material: "plastic",
        function: "Provides a massive surface area for proton pumps to secrete HCl into the gastric lumen.",
        assemblyOrder: 2,
        connections: ["Cell Membrane", "Proton Pumps"],
        failureEffect: "Reduced acid secretion capacity.",
        cascadeFailures: ["Hypochlorhydria", "Indigestion"],
        originalPosition: { x: 0, y: 0, z: 2 },
        explodedPosition: { x: 0, y: 5, z: 5 }
    });

    // 3. Proton Pumps (H+/K+ ATPase)
    const pumpGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const pumps = new THREE.Group();
    for(let i=0; i<12; i++) {
        const pump = new THREE.Mesh(pumpGeo, protonPumpGlow);
        const t = (i / 12) * Math.PI * 2;
        pump.position.set(Math.cos(t) * 2.5, Math.sin(t) * 2.5, 2.5);
        pumps.add(pump);
    }
    group.add(pumps);
    parts.push({
        name: "Proton Pumps (H+/K+ ATPase)",
        description: "Active transport proteins that use ATP to pump protons (H+) out of the cell in exchange for potassium (K+) ions.",
        material: "protonPumpGlow",
        function: "Generates the acidic environment by actively secreting H+ against a million-fold concentration gradient.",
        assemblyOrder: 3,
        connections: ["Canaliculi", "Mitochondria (ATP source)"],
        failureEffect: "Complete halt of stomach acid production.",
        cascadeFailures: ["Achlorhydria", "Bacterial overgrowth"],
        originalPosition: { x: 0, y: 0, z: 2.5 },
        explodedPosition: { x: 0, y: 10, z: 10 }
    });

    // 4. Mitochondria (Powerhouses)
    const mitoGeo = new THREE.CapsuleGeometry(0.5, 1, 16, 16);
    const mitoGroup = new THREE.Group();
    for(let i=0; i<5; i++) {
        const mito = new THREE.Mesh(mitoGeo, mitochondriaCore);
        mito.position.set(Math.random()*6-3, Math.random()*6-3, -1 - Math.random()*2);
        mito.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        mitoGroup.add(mito);
    }
    group.add(mitoGroup);
    parts.push({
        name: "Mitochondria",
        description: "Parietal cells are packed with mitochondria to supply the immense ATP needed by proton pumps.",
        material: "mitochondriaCore",
        function: "Produces ATP via cellular respiration to power the H+/K+ ATPase pumps.",
        assemblyOrder: 4,
        connections: ["Cytoplasm", "Proton Pumps"],
        failureEffect: "Energy depletion; pumps cease to function.",
        cascadeFailures: ["Acid secretion failure", "Cellular exhaustion"],
        originalPosition: { x: 0, y: 0, z: -2 },
        explodedPosition: { x: 5, y: -5, z: -10 }
    });

    // 5. Histamine / Gastrin Receptors (Activation switches)
    const receptorGeo = new THREE.ConeGeometry(0.4, 1, 16);
    const receptorGroup = new THREE.Group();
    for(let i=0; i<3; i++) {
        const receptor = new THREE.Mesh(receptorGeo, chrome);
        receptor.position.set(Math.cos(i*2.1)*4.8, Math.sin(i*2.1)*4.8, -3.8);
        receptor.rotation.x = Math.PI / 2;
        receptorGroup.add(receptor);
    }
    group.add(receptorGroup);
    parts.push({
        name: "Basolateral Receptors",
        description: "Receptors for histamine, acetylcholine, and gastrin that trigger the acid secretion process.",
        material: "chrome",
        function: "Receives signals from the body to initiate the translocation of proton pumps to the canaliculi.",
        assemblyOrder: 5,
        connections: ["Cell Membrane", "Intracellular signaling pathways"],
        failureEffect: "Inability to respond to food intake stimuli.",
        cascadeFailures: ["No acid secretion post-meal"],
        originalPosition: { x: 0, y: 0, z: -3.8 },
        explodedPosition: { x: -5, y: -10, z: -15 }
    });
    
    // Acid Flow visualization (Particles)
    const acidParticleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const acidParticles = new THREE.Group();
    for(let i=0; i<30; i++) {
        const particle = new THREE.Mesh(acidParticleGeo, acidMaterial);
        particle.userData = {
            angle: Math.random() * Math.PI * 2,
            radius: 2 + Math.random(),
            speed: 0.5 + Math.random() * 1.5,
            zOffset: Math.random() * 2
        };
        particle.position.set(
            Math.cos(particle.userData.angle) * particle.userData.radius,
            Math.sin(particle.userData.angle) * particle.userData.radius,
            3 + particle.userData.zOffset
        );
        acidParticles.add(particle);
    }
    group.add(acidParticles);

    const description = "The Parietal Cell is an intricate biological machine responsible for secreting hydrochloric acid (HCl) into the stomach. Powered by numerous mitochondria, its proton pumps (H+/K+ ATPase) actively transport hydrogen ions against a million-fold concentration gradient across highly folded secretory canaliculi.";

    const quizQuestions = [
        {
            question: "Which organelle provides the massive amount of ATP required for stomach acid secretion?",
            options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"],
            correct: 2,
            explanation: "Parietal cells are exceptionally rich in mitochondria, which produce the ATP necessary to power the highly energy-demanding H+/K+ ATPase (proton pumps).",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the secretory canaliculi in the parietal cell?",
            options: ["To store ATP", "To vastly increase the apical membrane surface area for proton pumps", "To digest proteins directly", "To absorb nutrients"],
            correct: 1,
            explanation: "The secretory canaliculi are deep infoldings of the membrane that greatly expand the surface area, allowing a massive number of proton pumps to operate simultaneously.",
            difficulty: "medium"
        },
        {
            question: "Which ion is exchanged for a proton (H+) by the primary active transport pump in the parietal cell?",
            options: ["Sodium (Na+)", "Calcium (Ca2+)", "Chloride (Cl-)", "Potassium (K+)"],
            correct: 3,
            explanation: "The pump is an H+/K+ ATPase, which actively transports a proton (H+) out of the cell and a potassium ion (K+) into the cell, using ATP.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Rotate canaliculi slowly
        if (canaliculiMesh) {
            canaliculiMesh.rotation.z = time * speed * 0.5;
        }
        
        // Pulse proton pumps
        if (pumps) {
            const scale = 1 + Math.sin(time * speed * 5) * 0.2;
            pumps.scale.set(scale, scale, scale);
            pumps.children.forEach((pump, i) => {
                pump.material.emissiveIntensity = 2 + Math.sin(time * speed * 8 + i) * 1.5;
            });
        }
        
        // Mitochondria throbbing
        if (mitoGroup) {
            mitoGroup.children.forEach((mito, i) => {
                mito.rotation.x += 0.01 * speed;
                mito.rotation.y += 0.02 * speed;
                mito.material.emissiveIntensity = 1.5 + Math.sin(time * speed * 3 + i) * 0.5;
            });
        }
        
        // Animate acid particles (H+ and Cl- secretion)
        if (acidParticles) {
            acidParticles.children.forEach(particle => {
                particle.userData.zOffset += particle.userData.speed * speed * 0.05;
                if (particle.userData.zOffset > 5) {
                    particle.userData.zOffset = 0;
                    particle.userData.radius = 2 + Math.random();
                }
                particle.position.set(
                    Math.cos(particle.userData.angle + time*speed) * particle.userData.radius,
                    Math.sin(particle.userData.angle + time*speed) * particle.userData.radius,
                    2.5 + particle.userData.zOffset
                );
            });
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createStomachParietalCell() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
