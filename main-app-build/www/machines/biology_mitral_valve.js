import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff0033,
        emissive: 0xff0033,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        wireframe: true
    });

    const bioLuminescentBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const glowingTissue = new THREE.MeshStandardMaterial({
        color: 0xff5555,
        emissive: 0x440000,
        roughness: 0.6,
        metalness: 0.1
    });

    // 1. Annulus (Fibrous Ring)
    const annulusGeometry = new THREE.TorusGeometry(3, 0.4, 32, 64);
    const annulus = new THREE.Mesh(annulusGeometry, chrome);
    annulus.rotation.x = Math.PI / 2;
    group.add(annulus);
    parts.push({
        name: "Mitral Annulus",
        description: "The fibrous ring that supports the mitral valve leaflets.",
        material: "Chrome / Fibrous Tissue",
        function: "Maintains valve shape and acts as an anchor for the leaflets.",
        assemblyOrder: 1,
        connections: ["Anterior Leaflet", "Posterior Leaflet", "Left Atrium", "Left Ventricle"],
        failureEffect: "Annular dilation leading to mitral regurgitation.",
        cascadeFailures: ["Volume overload in left atrium", "Pulmonary hypertension"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: annulus
    });

    const neonRingGeometry = new THREE.TorusGeometry(3.1, 0.1, 16, 64);
    const neonRing = new THREE.Mesh(neonRingGeometry, neonRed);
    neonRing.rotation.x = Math.PI / 2;
    group.add(neonRing);

    // 2. Anterior Leaflet
    const anteriorGeometry = new THREE.CylinderGeometry(0, 2.9, 4, 32, 1, false, 0, Math.PI);
    const anteriorLeaflet = new THREE.Mesh(anteriorGeometry, bioLuminescentBlue);
    anteriorLeaflet.rotation.y = Math.PI;
    anteriorLeaflet.position.y = -2;
    group.add(anteriorLeaflet);
    parts.push({
        name: "Anterior Leaflet",
        description: "The larger, semicircular flap of the mitral valve.",
        material: "Bio-luminescent / Fibroelastic",
        function: "Opens during diastole to allow blood flow, closes during systole to prevent backflow.",
        assemblyOrder: 2,
        connections: ["Annulus", "Chordae Tendineae"],
        failureEffect: "Prolapse or flail leaflet causing severe regurgitation.",
        cascadeFailures: ["Heart failure", "Arrhythmias"],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 5 },
        mesh: anteriorLeaflet
    });

    // 3. Posterior Leaflet
    const posteriorGeometry = new THREE.CylinderGeometry(0, 2.9, 3, 32, 1, false, Math.PI, Math.PI);
    const posteriorLeaflet = new THREE.Mesh(posteriorGeometry, bioLuminescentBlue);
    posteriorLeaflet.position.y = -1.5;
    group.add(posteriorLeaflet);
    parts.push({
        name: "Posterior Leaflet",
        description: "The smaller, crescent-shaped flap of the mitral valve.",
        material: "Bio-luminescent / Fibroelastic",
        function: "Coapts with the anterior leaflet to seal the left ventricular inflow tract.",
        assemblyOrder: 3,
        connections: ["Annulus", "Chordae Tendineae"],
        failureEffect: "Restricted motion or prolapse, leading to regurgitation.",
        cascadeFailures: ["Left atrial enlargement", "Atrial fibrillation"],
        originalPosition: { x: 0, y: -1.5, z: 0 },
        explodedPosition: { x: 0, y: -1.5, z: -5 },
        mesh: posteriorLeaflet
    });

    // 4. Chordae Tendineae (Heart Strings)
    const chordaeGroup = new THREE.Group();
    const chordaeMaterial = neonRed;
    const numStrings = 12;
    
    for(let i=0; i<numStrings; i++) {
        const angle = (i / numStrings) * Math.PI * 2;
        const radius = 2.5;
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = x1 * 0.5;
        const z2 = z1 * 0.5;
        const y1 = -3.5;
        const y2 = -7;

        const curve = new THREE.LineCurve3(
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(x2, y2, z2)
        );
        const tubeGeom = new THREE.TubeGeometry(curve, 8, 0.05, 8, false);
        const stringMesh = new THREE.Mesh(tubeGeom, chordaeMaterial);
        chordaeGroup.add(stringMesh);
    }
    group.add(chordaeGroup);
    parts.push({
        name: "Chordae Tendineae",
        description: "Tough, tendinous cords connecting leaflets to papillary muscles.",
        material: "Neon Red / Collagenous Strings",
        function: "Prevents the valve leaflets from prolapsing into the atrium during ventricular contraction.",
        assemblyOrder: 4,
        connections: ["Anterior Leaflet", "Posterior Leaflet", "Papillary Muscles"],
        failureEffect: "Rupture leading to acute mitral valve prolapse and severe regurgitation.",
        cascadeFailures: ["Cardiogenic shock", "Pulmonary edema"],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: -5, y: -5, z: 0 },
        mesh: chordaeGroup
    });

    // 5. Papillary Muscles
    const papGeometry = new THREE.CylinderGeometry(1.5, 2.5, 3, 16);
    const pap1 = new THREE.Mesh(papGeometry, glowingTissue);
    pap1.position.set(1.5, -8.5, 1.5);
    const pap2 = new THREE.Mesh(papGeometry, glowingTissue);
    pap2.position.set(-1.5, -8.5, -1.5);
    const papGroup = new THREE.Group();
    papGroup.add(pap1);
    papGroup.add(pap2);
    group.add(papGroup);
    parts.push({
        name: "Papillary Muscles",
        description: "Muscular pillars in the ventricle wall attaching to the chordae tendineae.",
        material: "Glowing Tissue / Myocardium",
        function: "Contract to tighten the chordae tendineae, keeping the valve securely closed.",
        assemblyOrder: 5,
        connections: ["Chordae Tendineae", "Left Ventricular Wall"],
        failureEffect: "Ischemia or rupture causing acute valve dysfunction.",
        cascadeFailures: ["Massive mitral regurgitation", "Heart failure"],
        originalPosition: { x: 0, y: -8.5, z: 0 },
        explodedPosition: { x: 5, y: -8.5, z: 0 },
        mesh: papGroup
    });

    const description = "The Mitral Valve is a complex bio-mechanical apparatus regulating blood flow from the left atrium to the left ventricle. This model highlights its key components including the annulus, leaflets, chordae tendineae, and papillary muscles, utilizing high-tech materials to emphasize structural and functional relationships.";

    const quizQuestions = [
        {
            question: "Which component prevents the mitral valve leaflets from prolapsing into the left atrium during ventricular contraction?",
            options: ["Mitral Annulus", "Chordae Tendineae", "Interatrial Septum", "Aortic Valve"],
            correct: 1,
            explanation: "The chordae tendineae (heart strings) act like tethering lines, anchoring the leaflets to the papillary muscles and preventing them from flipping backward into the atrium when ventricular pressure rises.",
            difficulty: "Medium"
        },
        {
            question: "What is the primary function of the mitral valve?",
            options: [
                "To oxygenate the blood",
                "To prevent backflow of blood from the left ventricle to the left atrium",
                "To regulate blood flow from the right ventricle to the pulmonary artery",
                "To generate electrical impulses for the heart"
            ],
            correct: 1,
            explanation: "The mitral valve closes during ventricular systole to ensure blood is pumped out through the aorta, preventing it from flowing backward into the left atrium.",
            difficulty: "Easy"
        },
        {
            question: "Ischemic damage to which of the following structures would most likely result in acute mitral regurgitation?",
            options: ["Anterior Leaflet", "Papillary Muscles", "Mitral Annulus", "Coronary Sinus"],
            correct: 1,
            explanation: "The papillary muscles rely on coronary blood supply. Ischemia or infarction can cause papillary muscle dysfunction or rupture, leading to a loss of tension on the chordae tendineae and subsequent acute mitral regurgitation.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        const cycle = (time * speed) % 2; 
        
        let isOpen = false;
        let t = 0;

        if (cycle < 1) {
            isOpen = false;
            t = Math.min(cycle * 5, 1);
        } else {
            isOpen = true;
            t = Math.min((cycle - 1) * 5, 1);
        }

        const anterior = parts[1].mesh;
        const posterior = parts[2].mesh;
        
        if (anterior && posterior) {
            if (isOpen) {
                anterior.scale.set(1, 1 - 0.5 * t, 1);
                posterior.scale.set(1, 1 - 0.5 * t, 1);
                
                anterior.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.3;
                posterior.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.3;
            } else {
                anterior.scale.set(1, 0.5 + 0.5 * t, 1);
                posterior.scale.set(1, 0.5 + 0.5 * t, 1);
                
                anterior.material.emissiveIntensity = 0.8;
                posterior.material.emissiveIntensity = 0.8;
            }
        }
        
        const paps = parts[4].mesh;
        if (paps) {
            if (!isOpen) {
                paps.scale.y = 1 - 0.1 * t;
            } else {
                paps.scale.y = 0.9 + 0.1 * t;
            }
        }
        
        const annulusNode = parts[0].mesh;
        if (annulusNode) {
            const scalePulse = 1 + 0.02 * Math.sin(time * speed * Math.PI);
            annulusNode.scale.set(scalePulse, scalePulse, scalePulse);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createMitralValve() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
