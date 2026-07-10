export function createRootOsmosis(THREE) {
    const group = new THREE.Group();

    // 1. Soil Particle
    const soilGeo = new THREE.DodecahedronGeometry(1.5, 1);
    const soilMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.9 });
    const soilParticle = new THREE.Mesh(soilGeo, soilMat);
    soilParticle.position.set(-6, 0, 0);
    soilParticle.name = "Soil Particle";
    group.add(soilParticle);

    // 2. Water Molecule
    const waterGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x00aaff, transparent: true, opacity: 0.8 });
    const waterMolecule = new THREE.Mesh(waterGeo, waterMat);
    waterMolecule.position.set(-4, 0.5, 0);
    waterMolecule.name = "Water Molecule";
    group.add(waterMolecule);

    // 3. Mineral Ion
    const ionGeo = new THREE.TetrahedronGeometry(0.2);
    const ionMat = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const mineralIon = new THREE.Mesh(ionGeo, ionMat);
    mineralIon.position.set(-5, -1, 1);
    mineralIon.name = "Mineral Ion";
    group.add(mineralIon);

    // 4. Root Hair Cell
    const rootGeo = new THREE.CylinderGeometry(0.5, 0.8, 4, 16);
    rootGeo.rotateZ(Math.PI / 2);
    const rootMat = new THREE.MeshStandardMaterial({ color: 0xaaffaa, transparent: true, opacity: 0.6 });
    const rootHairCell = new THREE.Mesh(rootGeo, rootMat);
    rootHairCell.position.set(-1, 0, 0);
    rootHairCell.name = "Root Hair Cell";
    group.add(rootHairCell);

    // 5. Cell Membrane
    const membraneGeo = new THREE.CylinderGeometry(0.48, 0.78, 3.9, 16);
    membraneGeo.rotateZ(Math.PI / 2);
    const membraneMat = new THREE.MeshStandardMaterial({ color: 0xffffaa, wireframe: true });
    const cellMembrane = new THREE.Mesh(membraneGeo, membraneMat);
    cellMembrane.position.set(-1, 0, 0);
    cellMembrane.name = "Cell Membrane";
    group.add(cellMembrane);

    // 6. Tonoplast
    const tonoGeo = new THREE.CylinderGeometry(0.3, 0.5, 2.5, 16);
    tonoGeo.rotateZ(Math.PI / 2);
    const tonoMat = new THREE.MeshStandardMaterial({ color: 0xaaaaff, wireframe: true });
    const tonoplast = new THREE.Mesh(tonoGeo, tonoMat);
    tonoplast.position.set(-0.5, 0, 0);
    tonoplast.name = "Tonoplast";
    group.add(tonoplast);

    // 7. Vacuole
    const vacuoleGeo = new THREE.CylinderGeometry(0.28, 0.48, 2.4, 16);
    vacuoleGeo.rotateZ(Math.PI / 2);
    const vacuoleMat = new THREE.MeshStandardMaterial({ color: 0x5555ff, transparent: true, opacity: 0.5 });
    const vacuole = new THREE.Mesh(vacuoleGeo, vacuoleMat);
    vacuole.position.set(-0.5, 0, 0);
    vacuole.name = "Vacuole";
    group.add(vacuole);

    // 8. Cortex Cell
    const cortexGeo = new THREE.BoxGeometry(2, 2, 2);
    const cortexMat = new THREE.MeshStandardMaterial({ color: 0x88ff88, transparent: true, opacity: 0.7 });
    const cortexCell = new THREE.Mesh(cortexGeo, cortexMat);
    cortexCell.position.set(2, 0, 0);
    cortexCell.name = "Cortex Cell";
    group.add(cortexCell);

    // 9. Endodermis
    const endoGeo = new THREE.BoxGeometry(1.5, 3, 2.5);
    const endoMat = new THREE.MeshStandardMaterial({ color: 0x44aa44 });
    const endodermis = new THREE.Mesh(endoGeo, endoMat);
    endodermis.position.set(4, 0, 0);
    endodermis.name = "Endodermis";
    group.add(endodermis);

    // 10. Casparian Strip
    const stripGeo = new THREE.BoxGeometry(0.2, 3.1, 2.6);
    const stripMat = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const casparianStrip = new THREE.Mesh(stripGeo, stripMat);
    casparianStrip.position.set(4, 0, 0);
    casparianStrip.name = "Casparian Strip";
    group.add(casparianStrip);

    let time = 0;

    return {
        group,
        animate: (delta) => {
            time += delta;
            
            // Animate Water Molecule moving from soil to root hair, then cortex
            // A simple looped animation path
            let progress = (time % 5) / 5; // 0 to 1 over 5 seconds
            
            if (progress < 0.4) {
                // Soil to Root Hair
                let p = progress / 0.4;
                waterMolecule.position.x = -5 + p * 4; // -5 to -1
                waterMolecule.position.y = 0.5 * Math.cos(p * Math.PI * 2);
            } else if (progress < 0.8) {
                // Root Hair to Cortex
                let p = (progress - 0.4) / 0.4;
                waterMolecule.position.x = -1 + p * 3; // -1 to 2
                waterMolecule.position.y = 0.5 * Math.sin(p * Math.PI);
            } else {
                // Cortex to Endodermis
                let p = (progress - 0.8) / 0.2;
                waterMolecule.position.x = 2 + p * 2; // 2 to 4
                waterMolecule.position.y = 0;
            }

            // Small jiggle for mineral ion
            mineralIon.position.x = -5 + Math.sin(time * 3) * 0.2;
            mineralIon.position.y = -1 + Math.cos(time * 4) * 0.2;

            // Vacuole pulsing slightly
            let scale = 1 + Math.sin(time * 2) * 0.05;
            vacuole.scale.set(1, scale, scale);
        }
    };
}

export const quiz = [
    {
        question: "Which cellular structure is primarily responsible for absorbing water from the soil?",
        options: ["Cortex Cell", "Root Hair Cell", "Endodermis", "Casparian Strip"],
        answer: 1
    },
    {
        question: "Osmosis is the movement of water across a semi-permeable membrane from an area of:",
        options: ["Low to high water concentration", "High to low solute concentration", "Low to high solute concentration", "Equal concentration"],
        answer: 2
    },
    {
        question: "Which of the following acts as a waterproof barrier preventing water from flowing back out of the vascular cylinder?",
        options: ["Tonoplast", "Vacuole", "Casparian Strip", "Cell Membrane"],
        answer: 2
    },
    {
        question: "What is the name of the membrane that surrounds the central vacuole in a plant cell?",
        options: ["Cell Membrane", "Endodermis", "Casparian Strip", "Tonoplast"],
        answer: 3
    },
    {
        question: "Water movement through the root cortex occurs primarily via which two pathways?",
        options: ["Apoplastic and Symplastic", "Xylem and Phloem", "Active and Passive", "Endodermis and Casparian"],
        answer: 0
    },
    {
        question: "What is the main driving force for water uptake by root hairs?",
        options: ["Gravity", "Transpirational pull and root pressure", "Active transport of water", "Capillary action in soil"],
        answer: 1
    }
];
