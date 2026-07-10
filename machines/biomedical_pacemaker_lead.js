import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials for Visual Flair
    const glowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 3,
        transparent: true,
        opacity: 0.9
    });

    const tipMaterial = new THREE.MeshStandardMaterial({
        color: 0xe0e0e0,
        metalness: 1.0,
        roughness: 0.1,
        envMapIntensity: 2.5
    });

    const siliconeMaterial = new THREE.MeshStandardMaterial({
        color: 0x111111,
        metalness: 0.2,
        roughness: 0.8,
        transparent: true,
        opacity: 0.7
    });

    const coilMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        metalness: 0.8,
        roughness: 0.3
    });

    const steroidMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    // 1. Electrode Tip (Platinum-Iridium)
    const tipGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32);
    const tipMesh = new THREE.Mesh(tipGeometry, tipMaterial);
    tipMesh.position.set(0, 5.2, 0);
    group.add(tipMesh);
    parts.push({
        name: "Electrode Tip",
        mesh: tipMesh,
        description: "Delivers the electrical impulse to the heart tissue and senses intrinsic cardiac activity.",
        material: "Platinum-Iridium Alloy",
        function: "Pacing and Sensing",
        assemblyOrder: 1,
        connections: ["Conductor Coil", "Myocardium"],
        failureEffect: "Loss of pacing or sensing due to high threshold or exit block.",
        cascadeFailures: ["Inappropriate pacing", "Lack of pacing support"],
        originalPosition: { x: 0, y: 5.2, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 2. Fixation Tines (Silicone)
    const tineGroup = new THREE.Group();
    for (let i = 0; i < 4; i++) {
        const tineGeom = new THREE.ConeGeometry(0.08, 0.7, 16);
        const tineMesh = new THREE.Mesh(tineGeom, siliconeMaterial);
        tineMesh.rotation.x = Math.PI / 2;
        
        const angle = (i * Math.PI) / 2;
        const radius = 0.25;
        tineMesh.position.set(
            radius * Math.cos(angle),
            5.0,
            radius * Math.sin(angle)
        );
        
        tineMesh.lookAt(
            new THREE.Vector3(
                (radius + 1) * Math.cos(angle),
                4.5,
                (radius + 1) * Math.sin(angle)
            )
        );
        tineGroup.add(tineMesh);
    }
    group.add(tineGroup);
    parts.push({
        name: "Fixation Tines",
        mesh: tineGroup,
        description: "Passive fixation mechanism that anchors the lead in the trabeculae of the right ventricle or atrium.",
        material: "Medical Grade Silicone",
        function: "Anchor the lead",
        assemblyOrder: 2,
        connections: ["Electrode Tip", "Insulation"],
        failureEffect: "Lead dislodgement",
        cascadeFailures: ["Loss of pacing", "Phrenic nerve stimulation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 3 }
    });

    // 3. Steroid Eluting Collar
    const collarGeometry = new THREE.TorusGeometry(0.18, 0.05, 16, 32);
    const collarMesh = new THREE.Mesh(collarGeometry, steroidMaterial);
    collarMesh.rotation.x = Math.PI / 2;
    collarMesh.position.set(0, 4.8, 0);
    group.add(collarMesh);
    parts.push({
        name: "Steroid Eluting Collar",
        mesh: collarMesh,
        description: "Releases dexamethasone to reduce local inflammation and fibrosis at the implant site, keeping pacing thresholds low.",
        material: "Polymer with Dexamethasone",
        function: "Reduce inflammation",
        assemblyOrder: 3,
        connections: ["Electrode Tip"],
        failureEffect: "Increased pacing threshold over time.",
        cascadeFailures: ["Premature battery depletion"],
        originalPosition: { x: 0, y: 4.8, z: 0 },
        explodedPosition: { x: 0, y: 8, z: 0 }
    });

    // 4. Ring Electrode (Bipolar)
    const ringGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.4, 32);
    const ringMesh = new THREE.Mesh(ringGeom, tipMaterial);
    ringMesh.position.set(0, 3.8, 0);
    group.add(ringMesh);
    parts.push({
        name: "Ring Electrode",
        mesh: ringMesh,
        description: "Serves as the anode in a bipolar pacing system to complete the electrical circuit.",
        material: "Platinum-Iridium",
        function: "Anode for bipolar pacing/sensing",
        assemblyOrder: 4,
        connections: ["Outer Insulation", "Outer Conductor Coil"],
        failureEffect: "Loss of bipolar sensing; device may revert to unipolar mode.",
        cascadeFailures: ["Myopotential oversensing"],
        originalPosition: { x: 0, y: 3.8, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    // 5. Inner Conductor Coil & Glowing Pulse
    const coilGroup = new THREE.Group();
    const coilPath = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -5, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 4.8, 0)
    ]);
    const coilGeom = new THREE.TubeGeometry(coilPath, 100, 0.06, 16, false);
    const coilMesh = new THREE.Mesh(coilGeom, coilMaterial);
    coilGroup.add(coilMesh);
    
    // Add pulsing energy effect
    const pulseGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const pulseMesh = new THREE.Mesh(pulseGeom, glowMaterial);
    coilGroup.add(pulseMesh);
    group.add(coilGroup);

    parts.push({
        name: "Conductor Coil",
        mesh: coilGroup,
        description: "Multi-filar coiled wire transmitting electrical signals between the pacemaker generator and the heart.",
        material: "MP35N (Nickel-Cobalt-Chromium-Molybdenum Alloy)",
        function: "Conduct electrical impulses",
        assemblyOrder: 5,
        connections: ["Electrode Tip", "IS-1 Connector"],
        failureEffect: "Conductor fracture leading to high impedance and loss of capture.",
        cascadeFailures: ["Oversensing", "Inhibition of pacing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        pulseMesh: pulseMesh
    });

    // 6. Outer Insulation
    const insulationGeom = new THREE.TubeGeometry(coilPath, 100, 0.2, 32, false);
    const insulationMesh = new THREE.Mesh(insulationGeom, siliconeMaterial);
    group.add(insulationMesh);
    parts.push({
        name: "Outer Insulation",
        mesh: insulationMesh,
        description: "Protects the conductor coil and prevents electrical current from leaking into surrounding tissue.",
        material: "Silicone / Polyurethane blend (Optim)",
        function: "Electrical insulation",
        assemblyOrder: 6,
        connections: ["Conductor Coil", "Ring Electrode"],
        failureEffect: "Insulation breach causing low impedance and current leak.",
        cascadeFailures: ["Pocket stimulation", "Loss of capture", "Premature battery depletion"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3, y: 0, z: 0 }
    });

    const description = "Ultra high-tech biomedical pacemaker lead model, featuring the active electrode tip, passive fixation tines, steroid collar, ring electrode, internal conductor coil, and outer silicone insulation. Visualizes electrical impulses traveling through the insulated wire to the platinum tip.";

    const quizQuestions = [
        {
            question: "What is the primary function of the steroid eluting collar on a pacemaker lead?",
            options: ["To prevent blood clots", "To reduce local inflammation and maintain low pacing thresholds", "To anchor the lead in the myocardium", "To conduct electrical impulses"],
            correct: 1,
            explanation: "The steroid collar releases a drug (such as dexamethasone) that reduces inflammation and fibrosis at the tissue-electrode interface, maintaining a low pacing threshold.",
            difficulty: "Medium"
        },
        {
            question: "In a bipolar pacing lead, what serves as the anode?",
            options: ["The generator can", "The fixation tines", "The tip electrode", "The ring electrode"],
            correct: 3,
            explanation: "In a bipolar lead, the current flows from the tip electrode (cathode) to the ring electrode (anode), minimizing the electrical field size and reducing the chance of oversensing.",
            difficulty: "Hard"
        },
        {
            question: "What happens if the outer insulation of the pacemaker lead breaches?",
            options: ["High impedance", "Low impedance and current leak", "Increased battery life", "Improved sensing"],
            correct: 1,
            explanation: "An insulation breach allows current to leak into surrounding tissues, dropping the impedance and potentially causing loss of capture, pocket stimulation, or rapid battery drain.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, partsMap) {
        // Find the coil part to animate the glowing pulse
        const coilPart = partsMap.find(p => p.name === "Conductor Coil");
        if (coilPart && coilPart.pulseMesh) {
            const pulse = coilPart.pulseMesh;
            // Oscillate the pulse along the y-axis
            const yPos = (Math.sin(time * speed * 3) * 4.9);
            pulse.position.set(0, yPos, 0);
            
            // Intensify the glow when it reaches the tip (y ~ 4.8)
            const intensity = 1.5 + (yPos + 4.9) / 9.8 * 2.5; 
            pulse.material.emissiveIntensity = intensity;
        }

        // Slight rotation for visual appeal
        group.rotation.y = time * speed * 0.5;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createPacemakerLead() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
