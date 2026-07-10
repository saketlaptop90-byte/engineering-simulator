export function createXylemTranspiration(THREE) {
    const group = new THREE.Group();

    // 1. Root Cortex
    const rootCortexGeo = new THREE.CylinderGeometry(3, 2, 2, 32);
    const rootCortexMat = new THREE.MeshStandardMaterial({ color: 0x8B4513, transparent: true, opacity: 0.8 });
    const rootCortex = new THREE.Mesh(rootCortexGeo, rootCortexMat);
    rootCortex.position.y = -6;
    group.add(rootCortex);

    // 2. Xylem Vessel
    const vesselGeo = new THREE.CylinderGeometry(1, 1, 10, 32);
    const vesselMat = new THREE.MeshStandardMaterial({ color: 0xA0522D, transparent: true, opacity: 0.4 });
    const vessel = new THREE.Mesh(vesselGeo, vesselMat);
    group.add(vessel);

    // 3. Tracheid
    const tracheidGeo = new THREE.ConeGeometry(0.6, 8, 16);
    const tracheidMat = new THREE.MeshStandardMaterial({ color: 0xCD853F });
    const tracheid = new THREE.Mesh(tracheidGeo, tracheidMat);
    tracheid.position.set(1.8, 0, 0);
    group.add(tracheid);

    // 4. Pits
    const pitGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const pitMat = new THREE.MeshStandardMaterial({ color: 0x4B0082 });
    const pits = new THREE.Group();
    for(let i=-4; i<=4; i+=1.5) {
        const pit = new THREE.Mesh(pitGeo, pitMat);
        pit.position.set(1, i, 0);
        pits.add(pit);
    }
    group.add(pits);

    // 5. Lignin Rings
    const ligninMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const ligninRings = new THREE.Group();
    for(let i=-4.5; i<=4.5; i+=0.8) {
        const ligninGeo = new THREE.TorusGeometry(1, 0.08, 16, 32);
        const ring = new THREE.Mesh(ligninGeo, ligninMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = i;
        ligninRings.add(ring);
    }
    group.add(ligninRings);

    // 6. Water Column
    const waterGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 16);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x00BFFF, transparent: true, opacity: 0.5 });
    const waterColumn = new THREE.Mesh(waterGeo, waterMat);
    group.add(waterColumn);

    // 7. Cohesion Molecule
    const cohesionGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const cohesionMat = new THREE.MeshStandardMaterial({ color: 0x0000FF });
    const cohesionMolecules = new THREE.Group();
    for(let i=-4.8; i<=4.8; i+=0.6) {
        const mol = new THREE.Mesh(cohesionGeo, cohesionMat);
        mol.position.set(0, i, 0);
        cohesionMolecules.add(mol);
    }
    group.add(cohesionMolecules);

    // 8. Adhesion Interaction
    const adhesionGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const adhesionMat = new THREE.MeshStandardMaterial({ color: 0xFF1493 });
    const adhesions = new THREE.Group();
    for(let i=-4.5; i<=4.5; i+=1.2) {
        const ad1 = new THREE.Mesh(adhesionGeo, adhesionMat);
        ad1.position.set(0.8, i, 0);
        const ad2 = new THREE.Mesh(adhesionGeo, adhesionMat);
        ad2.position.set(-0.8, i, 0);
        adhesions.add(ad1);
        adhesions.add(ad2);
    }
    group.add(adhesions);

    // 9. Mesophyll Cell
    const mesophyllGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const mesophyllMat = new THREE.MeshStandardMaterial({ color: 0x228B22, transparent: true, opacity: 0.9 });
    const mesophyll = new THREE.Mesh(mesophyllGeo, mesophyllMat);
    mesophyll.position.set(0, 6.5, 0);
    group.add(mesophyll);

    // 10. Stomatal Pore
    const poreGeo = new THREE.TorusGeometry(0.6, 0.15, 16, 32);
    const poreMat = new THREE.MeshStandardMaterial({ color: 0x00FF00 });
    const stoma = new THREE.Mesh(poreGeo, poreMat);
    stoma.rotation.x = Math.PI / 2;
    stoma.position.set(0, 8, 0);
    group.add(stoma);

    let time = 0;
    const animate = (delta) => {
        time += delta;
        
        // Transpiration pull kinematics
        cohesionMolecules.children.forEach((mol, index) => {
            mol.position.y += delta * 2.5; // Water column moves up
            if (mol.position.y > 5) {
                mol.position.y = -5; // Recycles at the bottom
            }
            mol.position.x = Math.sin(time * 4 + index) * 0.15;
            mol.position.z = Math.cos(time * 4 + index) * 0.15;
        });

        // Pulsing water column
        waterColumn.scale.set(1 + Math.sin(time * 3) * 0.05, 1, 1 + Math.cos(time * 3) * 0.05);

        // Stomatal pore opening/closing simulation
        const poreScale = 1 + Math.sin(time * 1.5) * 0.3;
        stoma.scale.set(poreScale, poreScale, 1);
        
        // Adhesion interaction particles slightly vibrating
        adhesions.children.forEach((ad, i) => {
            ad.rotation.x += delta;
            ad.rotation.y += delta;
        });
    };

    return { group, animate };
}

export const quiz = [
    {
        question: "What is the primary mechanism driving water movement in the xylem?",
        options: ["Root pressure", "Transpiration pull", "Active transport", "Capillary action"],
        answer: "Transpiration pull"
    },
    {
        question: "Which component provides structural support to xylem vessels?",
        options: ["Cellulose", "Pectin", "Lignin rings", "Chitin"],
        answer: "Lignin rings"
    },
    {
        question: "What physical property of water is primarily responsible for holding the water column together?",
        options: ["Adhesion", "Cohesion", "High specific heat", "Surface tension"],
        answer: "Cohesion"
    },
    {
        question: "Through which structures does water exit the leaf into the atmosphere?",
        options: ["Lenticels", "Cuticle", "Stomatal pores", "Hydathodes"],
        answer: "Stomatal pores"
    },
    {
        question: "Which type of xylem cells are elongated with tapered ends?",
        options: ["Vessel elements", "Tracheids", "Parenchyma", "Fibers"],
        answer: "Tracheids"
    },
    {
        question: "What role do pits play in the xylem?",
        options: ["Energy production", "Sugar transport", "Lateral movement of water", "Gas exchange"],
        answer: "Lateral movement of water"
    }
];
