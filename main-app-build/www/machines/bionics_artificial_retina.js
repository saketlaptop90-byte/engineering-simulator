import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const description = "The Artificial Retina (Visual Neuroprosthetic) is a sophisticated bio-electronic implant designed to restore vision. It bypasses damaged photoreceptors and directly stimulates the remaining healthy retinal ganglion cells using a microelectrode array. Visual information is captured by an external camera, processed, and transmitted wirelessly to the implant, where it is translated into electrical impulses.";

    // Custom glowing materials
    const glowBlue = new THREE.MeshStandardMaterial({ color: 0x0055ff, emissive: 0x00aaff, emissiveIntensity: 1.5, wireframe: true });
    const glowGold = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xff8800, emissiveIntensity: 2 });
    const neuralGlow = new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 2.5, transparent: true, opacity: 0.8 });
    const tissueMaterial = new THREE.MeshStandardMaterial({ color: 0xffaaaa, transparent: true, opacity: 0.2, side: THREE.DoubleSide });

    // 1. Retina Tissue Base
    const retinaGeo = new THREE.SphereGeometry(4, 32, 16, 0, Math.PI*2, Math.PI/2, Math.PI/2);
    const retinaMesh = new THREE.Mesh(retinaGeo, tissueMaterial);
    retinaMesh.position.set(0, 0, 0);
    group.add(retinaMesh);
    parts.push({
        name: "Retinal Tissue Bed",
        description: "The targeted area of the damaged macula where the microelectrode array is implanted.",
        material: "Organic Tissue",
        function: "Supports the microelectrode array and contains the surviving retinal ganglion cells.",
        assemblyOrder: 1,
        connections: ["Optic Nerve", "Microelectrode Array"],
        failureEffect: "Inflammation or scarring can increase impedance and reduce stimulation effectiveness.",
        cascadeFailures: ["Signal Degradation", "Array Detachment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: retinaMesh
    });

    // 2. Microelectrode Array (MEA)
    const meaGroup = new THREE.Group();
    const arrayGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const arrayBaseMesh = new THREE.Mesh(arrayGeo, plastic);
    meaGroup.add(arrayBaseMesh);
    
    // Add electrodes
    const electrodes = [];
    for(let i=-1; i<=1; i+=0.4) {
        for(let j=-1; j<=1; j+=0.4) {
            if(i*i + j*j <= 1) {
                const elGeo = new THREE.SphereGeometry(0.08, 8, 8);
                const elMesh = new THREE.Mesh(elGeo, glowGold);
                elMesh.position.set(i*1.2, 0.05, j*1.2);
                electrodes.push(elMesh);
                meaGroup.add(elMesh);
            }
        }
    }
    meaGroup.position.set(0, -3.8, 0); // At the bottom of the retina
    group.add(meaGroup);
    parts.push({
        name: "Microelectrode Array (MEA)",
        description: "A high-density grid of microelectrodes that deliver electrical pulses directly to the retina.",
        material: "Polyimide / Platinum-Iridium",
        function: "Bypasses dead photoreceptor cells to stimulate surviving neurons (bipolar and ganglion cells).",
        assemblyOrder: 2,
        connections: ["Retinal Tissue", "Data Ribbon Cable"],
        failureEffect: "Loss of specific visual field pixels, or complete failure if array delaminates.",
        cascadeFailures: ["Tissue Damage", "Vision Loss"],
        originalPosition: { x: 0, y: -3.8, z: 0 },
        explodedPosition: { x: 0, y: -6, z: 0 },
        mesh: meaGroup,
        electrodes: electrodes
    });

    // 3. Data Ribbon Cable
    const cableGeo = new THREE.TorusGeometry(3.9, 0.05, 8, 24, Math.PI);
    const cableMesh = new THREE.Mesh(cableGeo, copper);
    cableMesh.rotation.x = Math.PI / 2;
    cableMesh.position.set(0, 0, 0);
    group.add(cableMesh);
    parts.push({
        name: "Transcleral Ribbon Cable",
        description: "A flexible, hermetically sealed micro-cable routing data and power from the processing chip to the MEArray.",
        material: "Gold/Polyimide",
        function: "Transmits precisely timed electrical patterns from the receiver coil to individual electrodes.",
        assemblyOrder: 3,
        connections: ["Microelectrode Array", "Receiver Coil"],
        failureEffect: "Signal interruption causing flickering or complete loss of prosthetic vision.",
        cascadeFailures: ["Complete System Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 0, z: 0 },
        mesh: cableMesh
    });

    // 4. RF Receiver Coil (Implanted)
    const coilGeo = new THREE.TorusGeometry(2, 0.2, 16, 64);
    const coilMesh = new THREE.Mesh(coilGeo, darkSteel);
    coilMesh.position.set(3.9, 0, 0);
    coilMesh.rotation.y = Math.PI / 2;
    group.add(coilMesh);
    parts.push({
        name: "Subdermal Receiver Coil",
        description: "An inductive coil implanted around the eye (often under the conjunctiva).",
        material: "Titanium / Copper",
        function: "Receives power and data wirelessly from the external transmitter via inductive coupling.",
        assemblyOrder: 4,
        connections: ["Transcleral Ribbon Cable", "ASIC Processor"],
        failureEffect: "Inability to receive power or data, rendering the implant inert.",
        cascadeFailures: ["Data Desync", "Overheating"],
        originalPosition: { x: 3.9, y: 0, z: 0 },
        explodedPosition: { x: 6, y: 0, z: 0 },
        mesh: coilMesh
    });

    // 5. ASIC Processing Chip
    const asicGeo = new THREE.BoxGeometry(0.8, 0.8, 0.2);
    const asicMesh = new THREE.Mesh(asicGeo, chrome);
    asicMesh.position.set(3.9, 0, 0);
    group.add(asicMesh);
    parts.push({
        name: "ASIC Stimulator Chip",
        description: "An Application-Specific Integrated Circuit housed in a hermetic titanium can.",
        material: "Silicon / Titanium Canister",
        function: "Demodulates the RF signal and routes precise electrical currents to the correct microelectrodes.",
        assemblyOrder: 5,
        connections: ["Subdermal Receiver Coil"],
        failureEffect: "Corrupted stimulation patterns leading to scrambled visual perception.",
        cascadeFailures: ["Current Leakage", "Tissue Overstimulation"],
        originalPosition: { x: 3.9, y: 0, z: 0 },
        explodedPosition: { x: 8, y: 0, z: 0 },
        mesh: asicMesh
    });

    // 6. External Transmitter Glasses (Simplified representation)
    const glassesGroup = new THREE.Group();
    const frameGeo = new THREE.TorusGeometry(2, 0.1, 8, 32);
    const frameMesh = new THREE.Mesh(frameGeo, plastic);
    frameMesh.position.set(4.5, 0, 0);
    frameMesh.rotation.y = Math.PI / 2;
    const cameraGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16);
    const cameraMesh = new THREE.Mesh(cameraGeo, glass);
    cameraMesh.rotation.z = Math.PI / 2;
    cameraMesh.position.set(4.5, 2, 0);
    glassesGroup.add(frameMesh);
    glassesGroup.add(cameraMesh);
    group.add(glassesGroup);
    parts.push({
        name: "External Transmitter & Camera",
        description: "A pair of glasses housing a micro-camera and an RF transmitter coil.",
        material: "Plastic / Glass / Copper",
        function: "Captures the visual scene, encodes it into RF telemetry, and beams it across the skin to the implant.",
        assemblyOrder: 6,
        connections: ["RF Wireless Link"],
        failureEffect: "No visual input captured or transmitted.",
        cascadeFailures: ["Signal Loss"],
        originalPosition: { x: 4.5, y: 0, z: 0 },
        explodedPosition: { x: 10, y: 0, z: 0 },
        mesh: glassesGroup
    });

    // Add wireless signal visualization
    const signalGeo = new THREE.TorusGeometry(2.1, 0.05, 8, 32);
    const signalMesh = new THREE.Mesh(signalGeo, glowBlue);
    signalMesh.position.set(4.2, 0, 0);
    signalMesh.rotation.y = Math.PI / 2;
    group.add(signalMesh);

    const quizQuestions = [
        {
            question: "What is the primary function of the Microelectrode Array (MEA) in an artificial retina?",
            options: [
                "To focus light onto the optic nerve.",
                "To chemically regenerate dead photoreceptor cells.",
                "To bypass dead photoreceptors and electrically stimulate surviving retinal ganglion cells.",
                "To power the external camera."
            ],
            correct: 2,
            explanation: "The MEA delivers precisely timed electrical pulses to the surviving retinal cells (like bipolar or ganglion cells), effectively bypassing the damaged photoreceptors (rods and cones) to induce the perception of light.",
            difficulty: "Medium"
        },
        {
            question: "How does the implanted ASIC processor receive power and visual data?",
            options: [
                "Through a wire directly connected to a battery pack on the skull.",
                "Via inductive coupling using an RF link between an external transmitter coil and the implanted receiver coil.",
                "By converting ambient light into electrical energy using solar cells.",
                "It is powered by the eye's natural biological electrochemical gradients."
            ],
            correct: 1,
            explanation: "Most visual neuroprosthetics use an RF telemetry link. An external coil on the patient's glasses inductively couples with an implanted coil, transferring both power and the encoded visual data wirelessly across the skin/tissue.",
            difficulty: "Hard"
        },
        {
            question: "Why is the ASIC stimulator chip typically housed in a hermetic titanium canister?",
            options: [
                "To protect the silicon electronics from the corrosive saline environment of the body.",
                "Because titanium generates the necessary electrical current.",
                "To increase the weight of the implant so it doesn't float around.",
                "Titanium acts as the primary antenna for the camera."
            ],
            correct: 0,
            explanation: "The interior of the human body is a warm, highly corrosive saline environment. Complex electronics (like an ASIC) must be hermetically sealed, often in titanium or specialized ceramics, to prevent fluid ingress which would quickly short-circuit and destroy the chip.",
            difficulty: "Medium"
        }
    ];

    function animate(time, speed, meshes) {
        // Pulse the wireless signal
        const pulse = (Math.sin(time * speed * 5) + 1) / 2;
        signalMesh.scale.set(1 + pulse * 0.1, 1 + pulse * 0.1, 1 + pulse * 0.1);
        signalMesh.material.opacity = 0.5 + pulse * 0.5;

        // Animate the microelectrodes (firing sequence)
        parts.find(p => p.name === "Microelectrode Array (MEA)").electrodes.forEach((el, index) => {
            const fire = (Math.sin(time * speed * 10 + index) + 1) / 2;
            if (fire > 0.8) {
                el.material = neuralGlow;
                el.scale.setScalar(1.5);
            } else {
                el.material = glowGold;
                el.scale.setScalar(1.0);
            }
        });

        // Rotate the camera glasses slightly to simulate head movement
        glassesGroup.rotation.x = Math.sin(time * speed) * 0.1;
        glassesGroup.rotation.z = Math.cos(time * speed * 0.5) * 0.05;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createArtificialRetina() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
