import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom Materials
    const glowBlue = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.8
    });
    
    const glowOrange = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        emissive: 0xff8800,
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.8,
        roughness: 0.2,
        metalness: 0.8
    });

    const siliconeMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0.6,
        roughness: 0.4,
        metalness: 0.1
    });

    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        metalness: 1.0,
        roughness: 0.2
    });

    // 1. Receiver Coil (Extraocular, sits on sclera)
    // Modeled as a thin torus
    const coilGeo = new THREE.TorusGeometry(3, 0.2, 16, 64);
    const receiverCoil = new THREE.Mesh(coilGeo, copper);
    receiverCoil.position.set(-6, 0, 0);
    receiverCoil.rotation.y = Math.PI / 2;
    group.add(receiverCoil);

    const coilBaseGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.1, 64);
    const coilBase = new THREE.Mesh(coilBaseGeo, siliconeMaterial);
    coilBase.position.set(-6.1, 0, 0);
    coilBase.rotation.z = Math.PI / 2;
    group.add(coilBase);
    
    // Add glowing data pulses on the coil
    const coilPulseGeo = new THREE.TorusGeometry(3, 0.22, 16, 64);
    const coilPulse = new THREE.Mesh(coilPulseGeo, glowBlue);
    coilPulse.position.set(-6, 0, 0);
    coilPulse.rotation.y = Math.PI / 2;
    group.add(coilPulse);
    
    parts.push({
        name: "Receiver Coil",
        description: "Receives power and visual data wirelessly from the external transmitter.",
        material: "Copper/Silicone",
        function: "Inductive power and data telemetry.",
        assemblyOrder: 1,
        connections: ["ASIC Enclosure"],
        failureEffect: "Loss of power and signal, device turns off.",
        cascadeFailures: ["Complete system shutdown"],
        originalPosition: {x: -6, y: 0, z: 0},
        explodedPosition: {x: -12, y: 0, z: 0}
    });

    // 2. ASIC Enclosure (Electronics Case)
    const asicGeo = new THREE.BoxGeometry(2, 2, 0.5);
    const asicCase = new THREE.Mesh(asicGeo, chrome);
    asicCase.position.set(-3, 0, 0);
    group.add(asicCase);

    const asicChipGeo = new THREE.BoxGeometry(1.2, 1.2, 0.55);
    const asicChip = new THREE.Mesh(asicChipGeo, darkSteel);
    asicChip.position.set(-3, 0, 0);
    group.add(asicChip);
    
    parts.push({
        name: "Stimulator ASIC",
        description: "Application-Specific Integrated Circuit that decodes visual data and generates stimulation pulses.",
        material: "Titanium/Silicon",
        function: "Data decoding and pulse generation.",
        assemblyOrder: 2,
        connections: ["Receiver Coil", "Flex Cable"],
        failureEffect: "Incorrect or zero stimulation of the retina.",
        cascadeFailures: ["Electrode Array"],
        originalPosition: {x: -3, y: 0, z: 0},
        explodedPosition: {x: -3, y: 5, z: 0}
    });

    // 3. Flex Cable
    // We'll make a curved cable connecting ASIC to the array
    const cableCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(0, 3, 0),
        new THREE.Vector3(2, 0, 0)
    );
    const tubeGeo = new THREE.TubeGeometry(cableCurve, 64, 0.15, 8, false);
    const flexCable = new THREE.Mesh(tubeGeo, siliconeMaterial);
    group.add(flexCable);
    
    const cableWiresGeo = new THREE.TubeGeometry(cableCurve, 64, 0.05, 8, false);
    const cableWires = new THREE.Mesh(cableWiresGeo, goldMaterial);
    group.add(cableWires);

    // Glowing data flow along the cable
    const dataFlowGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const dataFlow = new THREE.Mesh(dataFlowGeo, glowBlue);
    group.add(dataFlow);

    parts.push({
        name: "Polyimide Flex Cable",
        description: "Routes electrical signals from the stimulator chip into the eye to the electrode array.",
        material: "Polyimide/Gold",
        function: "Signal transmission across the sclera.",
        assemblyOrder: 3,
        connections: ["Stimulator ASIC", "Electrode Array"],
        failureEffect: "Loss of signal to specific electrodes or full array failure.",
        cascadeFailures: [],
        originalPosition: {x: 0, y: 1.5, z: 0},
        explodedPosition: {x: 0, y: 8, z: 0}
    });

    // 4. Scleral Tack
    const tackGeo = new THREE.CylinderGeometry(0.05, 0.2, 1, 16);
    const tack = new THREE.Mesh(tackGeo, chrome);
    tack.rotation.z = Math.PI / 2;
    tack.position.set(1.5, 0.5, 0);
    group.add(tack);
    
    parts.push({
        name: "Scleral Tack",
        description: "Titanium tack used to anchor the electrode array to the retina.",
        material: "Titanium",
        function: "Mechanical fixation.",
        assemblyOrder: 4,
        connections: ["Flex Cable", "Electrode Array"],
        failureEffect: "Array detachment, leading to loss of visual perception.",
        cascadeFailures: ["Retinal damage"],
        originalPosition: {x: 1.5, y: 0.5, z: 0},
        explodedPosition: {x: 1.5, y: 0.5, z: 4}
    });

    // 5. Epiretinal Microelectrode Array
    const arrayGroup = new THREE.Group();
    arrayGroup.position.set(3, 0, 0);
    arrayGroup.rotation.y = -Math.PI / 4;
    group.add(arrayGroup);

    const arrayBaseGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const arrayBase = new THREE.Mesh(arrayBaseGeo, siliconeMaterial);
    arrayBase.rotation.x = Math.PI / 2;
    arrayGroup.add(arrayBase);

    // Grid of electrodes
    const electrodes = [];
    const rows = 8;
    const cols = 8;
    const spacing = 0.3;
    
    const electrodeGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.15, 16);

    for(let i=0; i<rows; i++) {
        for(let j=0; j<cols; j++) {
            // Cut off corners to make it somewhat circular
            const dx = i - (rows-1)/2;
            const dy = j - (cols-1)/2;
            if (dx*dx + dy*dy > 12) continue;

            const electrode = new THREE.Mesh(electrodeGeo, goldMaterial);
            electrode.position.set(dx * spacing, dy * spacing, 0.05);
            electrode.rotation.x = Math.PI / 2;
            arrayGroup.add(electrode);
            
            // Add a glowing effect mesh for each electrode
            const glowMesh = new THREE.Mesh(electrodeGeo, glowOrange.clone());
            glowMesh.position.copy(electrode.position);
            glowMesh.rotation.copy(electrode.rotation);
            glowMesh.scale.set(1.2, 1.2, 1.2);
            glowMesh.material.opacity = 0; // Will be animated
            arrayGroup.add(glowMesh);
            electrodes.push(glowMesh);
        }
    }

    parts.push({
        name: "Microelectrode Array",
        description: "Grid of stimulation electrodes that interface directly with the retinal ganglion cells.",
        material: "Platinum/Iridium/Silicone",
        function: "Neural stimulation to create phosphenes (spots of light).",
        assemblyOrder: 5,
        connections: ["Flex Cable", "Retina"],
        failureEffect: "Missing pixels in the patient's vision.",
        cascadeFailures: [],
        originalPosition: {x: 3, y: 0, z: 0},
        explodedPosition: {x: 8, y: 0, z: 0}
    });

    // Animation variables attached to the group
    group.userData = {
        cableCurve,
        dataFlow,
        coilPulse,
        electrodes,
        timeAcc: 0
    };

    const description = "The Retinal Implant is an advanced neuroprosthetic device designed to restore functional vision to patients with retinal degenerative diseases like Retinitis Pigmentosa. It bridges damaged photoreceptors by directly stimulating the surviving retinal ganglion cells with electrical pulses. The system comprises an external camera and transmitter, an implanted receiver coil, an ASIC for signal decoding, and a high-density microelectrode array tacked to the epiretinal surface.";

    const quizQuestions = [
        {
            question: "What is the primary function of the Microelectrode Array in a retinal implant?",
            options: [
                "To capture images from the outside world.",
                "To power the device wirelessly.",
                "To bypass damaged photoreceptors and directly stimulate retinal ganglion cells.",
                "To decode visual data signals."
            ],
            correct: 2,
            explanation: "The microelectrode array is placed on the retina to deliver electrical pulses directly to surviving neural cells (retinal ganglion cells), effectively bypassing the damaged photoreceptors.",
            difficulty: "Medium"
        },
        {
            question: "Why is a Scleral Tack used during the implantation of a retinal prosthesis?",
            options: [
                "To provide electrical grounding.",
                "To mechanically anchor the electrode array securely to the retina.",
                "To connect the flex cable to the ASIC.",
                "To measure intraocular pressure."
            ],
            correct: 1,
            explanation: "A scleral tack is a tiny titanium nail used to physically hold the microelectrode array flush against the retinal surface to ensure good electrical contact.",
            difficulty: "Easy"
        },
        {
            question: "Which component is responsible for receiving power and data wirelessly through the skin?",
            options: [
                "Stimulator ASIC",
                "Receiver Coil",
                "Microelectrode Array",
                "Flex Cable"
            ],
            correct: 1,
            explanation: "The Receiver Coil uses inductive coupling to receive both power and telemetry data from an external transmitter coil worn by the patient.",
            difficulty: "Medium"
        },
        {
            question: "What happens if the Flex Cable breaks?",
            options: [
                "The patient sees static.",
                "The receiver coil overheats.",
                "Loss of signal transmission to the electrode array, leading to vision loss.",
                "The ASIC regenerates the signal."
            ],
            correct: 2,
            explanation: "The flex cable routes the decoded electrical signals from the ASIC to the electrode array. If it breaks, those signals cannot reach the retina, resulting in partial or complete loss of artificial vision.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        if (!meshes || !meshes.userData) return;
        const { cableCurve, dataFlow, coilPulse, electrodes } = meshes.userData;
        
        // Update accumulated time
        meshes.userData.timeAcc += speed * 0.016; 
        const t = meshes.userData.timeAcc;

        // 1. Animate the data packet flowing along the flex cable
        const curvePoint = (t % 2) / 2; 
        if (curvePoint <= 1.0) {
            const pos = cableCurve.getPointAt(curvePoint);
            dataFlow.position.copy(pos);
            dataFlow.visible = true;
        } else {
            dataFlow.visible = false;
        }

        // 2. Pulse the receiver coil (power/data reception)
        if (coilPulse) {
            coilPulse.scale.setScalar(1.0 + Math.sin(t * 5) * 0.05);
            coilPulse.material.opacity = 0.5 + Math.sin(t * 5) * 0.3;
        }

        // 3. Twinkling electrodes (visual data stimulation patterns)
        if (electrodes) {
            electrodes.forEach((glow, idx) => {
                // Create a pseudo-random twinkling effect
                const noise = Math.sin(t * 3 + idx * 1.5) * Math.cos(t * 2 + idx * 0.5);
                glow.material.opacity = noise > 0.5 ? (noise - 0.5) * 2 : 0;
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
export function createRetinalImplant() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
