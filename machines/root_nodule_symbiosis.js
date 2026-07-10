export function createRootNoduleSymbiosis(THREE) {
    const group = new THREE.Group();

    // Materials
    const epidermisMat = new THREE.MeshStandardMaterial({ color: 0x8B5A2B, transparent: true, opacity: 0.8 }); // Brownish
    const rootHairMat = new THREE.MeshStandardMaterial({ color: 0xDEB887 }); // Lighter brown
    const cortexMat = new THREE.MeshStandardMaterial({ color: 0xF5DEB3, transparent: true, opacity: 0.5 }); // Wheat color
    const infectionThreadMat = new THREE.MeshStandardMaterial({ color: 0x32CD32, transparent: true, opacity: 0.9 }); // Greenish tube
    const bacteroidMat = new THREE.MeshStandardMaterial({ color: 0x1E90FF }); // Blue bacteria
    const symbiosomeMat = new THREE.MeshStandardMaterial({ color: 0xADD8E6, transparent: true, opacity: 0.4 }); // Light blue membrane
    const vascularMat = new THREE.MeshStandardMaterial({ color: 0x6B8E23 }); // Olive drab
    const xylemMat = new THREE.MeshStandardMaterial({ color: 0x00CED1 }); // Dark turquoise
    const phloemMat = new THREE.MeshStandardMaterial({ color: 0xFF8C00 }); // Dark orange
    const leghemoglobinMat = new THREE.MeshStandardMaterial({ color: 0xFF0000, transparent: true, opacity: 0.3 }); // Reddish tint

    // 1. Epidermis (Outer root layer)
    const epidermisGeo = new THREE.CylinderGeometry(2, 2, 10, 32);
    const epidermis = new THREE.Mesh(epidermisGeo, epidermisMat);
    epidermis.position.set(0, 0, 0);
    epidermis.userData = { id: 'epidermis', name: 'Epidermis' };
    group.add(epidermis);

    // 2. Root Hair
    const rootHairGeo = new THREE.CylinderGeometry(0.2, 0.3, 4, 16);
    const rootHair = new THREE.Mesh(rootHairGeo, rootHairMat);
    rootHair.rotation.z = Math.PI / 2;
    rootHair.position.set(3, 2, 0);
    rootHair.userData = { id: 'rootHair', name: 'Root Hair' };
    group.add(rootHair);

    // 3. Cortex (Nodule body)
    const cortexGeo = new THREE.SphereGeometry(3, 32, 32);
    const cortex = new THREE.Mesh(cortexGeo, cortexMat);
    cortex.position.set(4, -2, 0);
    cortex.userData = { id: 'cortex', name: 'Cortex' };
    group.add(cortex);

    // 4. Infection Thread
    // A simple tube going from root hair to cortex
    class CustomSinCurve extends THREE.Curve {
        constructor(scale = 1) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const tx = 5 - t * 4;
            const ty = 2 - t * 4;
            const tz = Math.sin(t * Math.PI * 2) * 0.5;
            return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
        }
    }
    const path = new CustomSinCurve(1);
    const infectionThreadGeo = new THREE.TubeGeometry(path, 20, 0.15, 8, false);
    const infectionThread = new THREE.Mesh(infectionThreadGeo, infectionThreadMat);
    infectionThread.userData = { id: 'infectionThread', name: 'Infection Thread' };
    group.add(infectionThread);

    // 5. Bacteroids
    const bacteroidsGroup = new THREE.Group();
    bacteroidsGroup.position.set(4, -2, 0);
    const bacteroidGeo = new THREE.CapsuleGeometry(0.1, 0.2, 4, 8);
    for (let i = 0; i < 20; i++) {
        const bacteroid = new THREE.Mesh(bacteroidGeo, bacteroidMat);
        bacteroid.position.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        );
        bacteroid.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        bacteroidsGroup.add(bacteroid);
    }
    bacteroidsGroup.userData = { id: 'bacteroids', name: 'Bacteroids' };
    group.add(bacteroidsGroup);

    // 6. Symbiosome Membrane
    const symbiosomeGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const symbiosomeMembrane = new THREE.Mesh(symbiosomeGeo, symbiosomeMat);
    symbiosomeMembrane.position.set(4, -2, 0);
    symbiosomeMembrane.userData = { id: 'symbiosomeMembrane', name: 'Symbiosome Membrane' };
    group.add(symbiosomeMembrane);

    // 7. Vascular Bundle
    const vascularGeo = new THREE.CylinderGeometry(1, 1, 10, 32);
    const vascularBundle = new THREE.Mesh(vascularGeo, vascularMat);
    vascularBundle.position.set(0, 0, 0);
    vascularBundle.userData = { id: 'vascularBundle', name: 'Vascular Bundle' };
    group.add(vascularBundle);

    // 8. Xylem
    const xylemGeo = new THREE.CylinderGeometry(0.4, 0.4, 10.1, 16);
    const xylem = new THREE.Mesh(xylemGeo, xylemMat);
    xylem.position.set(0.3, 0, 0.3);
    xylem.userData = { id: 'xylem', name: 'Xylem' };
    group.add(xylem);

    // 9. Phloem
    const phloemGeo = new THREE.CylinderGeometry(0.4, 0.4, 10.1, 16);
    const phloem = new THREE.Mesh(phloemGeo, phloemMat);
    phloem.position.set(-0.3, 0, -0.3);
    phloem.userData = { id: 'phloem', name: 'Phloem' };
    group.add(phloem);

    // 10. Leghemoglobin Zone
    const leghemoglobinGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const leghemoglobinZone = new THREE.Mesh(leghemoglobinGeo, leghemoglobinMat);
    leghemoglobinZone.position.set(4, -2, 0);
    leghemoglobinZone.userData = { id: 'leghemoglobinZone', name: 'Leghemoglobin Zone' };
    group.add(leghemoglobinZone);

    // Animation
    function animate(delta, time) {
        // Bacteroids multiply/move
        bacteroidsGroup.children.forEach((bacteroid, index) => {
            bacteroid.rotation.x += delta * (index % 2 === 0 ? 1 : -1);
            bacteroid.rotation.y += delta * (index % 3 === 0 ? 1 : -1);
            
            // Pulsating motion
            const scale = 1 + Math.sin(time * 2 + index) * 0.1;
            bacteroid.scale.set(scale, scale, scale);
        });

        // Leghemoglobin pulsing (oxygen regulation)
        leghemoglobinZone.material.opacity = 0.2 + (Math.sin(time * 3) + 1) * 0.15;

        // Infection thread flowing effect
        infectionThread.material.opacity = 0.5 + (Math.sin(time * 5) + 1) * 0.25;
    }

    const questions = [
        {
            question: "What is the primary function of root nodules in legumes?",
            options: ["Photosynthesis", "Water absorption", "Nitrogen fixation", "Seed dispersal"],
            correctAnswer: 2,
            explanation: "Root nodules host rhizobia bacteria that convert atmospheric nitrogen into a form the plant can use, a process known as nitrogen fixation."
        },
        {
            question: "Which specific type of bacteria are typically found inside these root nodules?",
            options: ["E. coli", "Rhizobia", "Cyanobacteria", "Lactobacillus"],
            correctAnswer: 1,
            explanation: "Rhizobia are soil bacteria that establish a symbiotic relationship with leguminous plants, residing inside the root nodules to fix nitrogen."
        },
        {
            question: "What is the role of leghemoglobin in the root nodule?",
            options: ["It binds oxygen to protect the nitrogenase enzyme", "It produces nitrogen", "It gives the plant a green color", "It stores water"],
            correctAnswer: 0,
            explanation: "Leghemoglobin has a high affinity for oxygen. It maintains a low oxygen environment in the nodule, which is essential because the nitrogen-fixing enzyme, nitrogenase, is destroyed by oxygen."
        },
        {
            question: "Through which structure do rhizobia initially invade the plant root?",
            options: ["Stomata", "Vascular bundle", "Infection thread via a root hair", "Phloem"],
            correctAnswer: 2,
            explanation: "Rhizobia attach to a root hair, causing it to curl. They then enter the root hair and travel through a tube called the infection thread to reach the cortical cells."
        },
        {
            question: "What form of nitrogen is produced by the bacteroids and supplied to the plant?",
            options: ["Nitrogen gas (N2)", "Nitric acid (HNO3)", "Ammonia/Ammonium (NH3/NH4+)", "Nitrous oxide (N2O)"],
            correctAnswer: 2,
            explanation: "The bacteroids fix atmospheric nitrogen (N2) into ammonia (NH3), which is rapidly protonated to ammonium (NH4+) and assimilated by the plant."
        },
        {
            question: "What kind of ecological relationship exists between the legume plant and the rhizobia?",
            options: ["Parasitism", "Commensalism", "Mutualism", "Competition"],
            correctAnswer: 2,
            explanation: "The relationship is mutualistic. The plant benefits from the fixed nitrogen provided by the bacteria, and the bacteria benefit from the carbohydrates and a protected environment provided by the plant."
        }
    ];

    return {
        group,
        animate,
        questions
    };
}
