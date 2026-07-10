export function createPhotosynthesisSystem(THREE) {
    const group = new THREE.Group();

    // 1. Sun
    const sunGeo = new THREE.SphereGeometry(2, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 15, 0);
    group.add(sun);

    // 2. Leaf Surface
    const leafGeo = new THREE.BoxGeometry(16, 0.5, 10);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x228b22, transparent: true, opacity: 0.8 });
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(0, -5, 0);
    group.add(leaf);

    // 3. Stomata
    const stomataGeo = new THREE.TorusGeometry(0.5, 0.2, 16, 16);
    const stomataMat = new THREE.MeshStandardMaterial({ color: 0x004400 });
    const stomata = new THREE.Mesh(stomataGeo, stomataMat);
    stomata.rotation.x = Math.PI / 2;
    stomata.position.set(-3, -5, 2);
    group.add(stomata);

    // 4. Mesophyll Cell
    const cellGeo = new THREE.BoxGeometry(8, 6, 6);
    const cellMat = new THREE.MeshStandardMaterial({ color: 0x7cfc00, transparent: true, opacity: 0.3 });
    const cell = new THREE.Mesh(cellGeo, cellMat);
    cell.position.set(0, 0, 0);
    group.add(cell);

    // 5. Chloroplast
    const chloroGeo = new THREE.SphereGeometry(2.5, 32, 16);
    chloroGeo.scale(1, 0.6, 0.8);
    const chloroMat = new THREE.MeshStandardMaterial({ color: 0x006400, transparent: true, opacity: 0.6 });
    const chloroplast = new THREE.Mesh(chloroGeo, chloroMat);
    chloroplast.position.set(0, 0, 0);
    group.add(chloroplast);

    // 6. Thylakoid Stack
    const thylakoidGroup = new THREE.Group();
    for(let i=0; i<4; i++) {
        const diskGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.15, 16);
        const diskMat = new THREE.MeshStandardMaterial({ color: 0x32cd32 });
        const disk = new THREE.Mesh(diskGeo, diskMat);
        disk.position.y = i * 0.25 - 0.375;
        thylakoidGroup.add(disk);
    }
    thylakoidGroup.position.set(-0.8, 0, 0);
    group.add(thylakoidGroup);

    // 7. Stroma
    const stromaGeo = new THREE.SphereGeometry(2.2, 16, 16);
    stromaGeo.scale(1, 0.5, 0.7);
    const stromaMat = new THREE.MeshStandardMaterial({ color: 0xadff2f, transparent: true, opacity: 0.4 });
    const stroma = new THREE.Mesh(stromaGeo, stromaMat);
    stroma.position.set(0, 0, 0);
    group.add(stroma);

    // 8. Water Molecules
    const waterGroup = new THREE.Group();
    const waterGeo = new THREE.SphereGeometry(0.2, 8, 8);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true });
    for(let i=0; i<3; i++) {
        const h2o = new THREE.Mesh(waterGeo, waterMat);
        h2o.position.set(i*0.5, 0, 0);
        waterGroup.add(h2o);
    }
    waterGroup.position.set(-2, -6, 0);
    group.add(waterGroup);

    // 9. Carbon Dioxide Molecules
    const co2Group = new THREE.Group();
    const co2Geo = new THREE.SphereGeometry(0.25, 8, 8);
    const co2Mat = new THREE.MeshStandardMaterial({ color: 0x808080, transparent: true });
    for(let i=0; i<3; i++) {
        const co2 = new THREE.Mesh(co2Geo, co2Mat);
        co2.position.set(0, i*0.5, 0);
        co2Group.add(co2);
    }
    co2Group.position.set(-3, -7, 2);
    group.add(co2Group);

    // 10. Oxygen Molecules
    const o2Group = new THREE.Group();
    const o2Geo = new THREE.SphereGeometry(0.2, 8, 8);
    const o2Mat = new THREE.MeshStandardMaterial({ color: 0xadd8e6, transparent: true });
    for(let i=0; i<2; i++) {
        const o2 = new THREE.Mesh(o2Geo, o2Mat);
        o2.position.set(i*0.4, 0, 0);
        o2Group.add(o2);
    }
    o2Group.position.set(0, 1, 0);
    group.add(o2Group);

    // Extra: Photons for animation
    const photonGroup = new THREE.Group();
    const photonGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    for(let i=0; i<5; i++) {
        const p = new THREE.Mesh(photonGeo, photonMat);
        p.userData.offset = i * 2;
        photonGroup.add(p);
    }
    group.add(photonGroup);

    const parts = [
        { name: "Sun", description: "Provides the light energy (photons) required to drive photosynthesis." },
        { name: "Leaf Surface", description: "The broad, flat outer layer of the plant that captures sunlight." },
        { name: "Stomata", description: "Pores on the leaf surface that allow gas exchange (CO2 in, O2 out)." },
        { name: "Mesophyll Cell", description: "Cells inside the leaf containing many chloroplasts where photosynthesis occurs." },
        { name: "Chloroplast", description: "The organelle where the photosynthetic reactions take place." },
        { name: "Thylakoid Stack", description: "Also known as a granum, these are stacks of thylakoid discs where the light-dependent reactions occur." },
        { name: "Stroma", description: "The aqueous fluid surrounding the thylakoids where the light-independent reactions (Calvin cycle) occur." },
        { name: "Water Molecules", description: "H2O molecules absorbed by roots and used in the light-dependent reactions to provide electrons." },
        { name: "Carbon Dioxide Molecules", description: "CO2 molecules absorbed from the air, used to build glucose in the Calvin cycle." },
        { name: "Oxygen Molecules", description: "O2 molecules released as a byproduct when water is split." }
    ];

    const quizzes = [
        {
            question: "Which part of the chloroplast hosts the light-dependent reactions?",
            options: ["Stroma", "Thylakoid Stack", "Outer Membrane", "Ribosome"],
            answer: "Thylakoid Stack"
        },
        {
            question: "What gas enters the leaf through the stomata for photosynthesis?",
            options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
            answer: "Carbon Dioxide"
        },
        {
            question: "What provides the initial energy to drive the photosynthetic process?",
            options: ["Soil nutrients", "Sun", "Water", "Wind"],
            answer: "Sun"
        },
        {
            question: "What is the fluid-filled space where the Calvin cycle (light-independent reactions) takes place?",
            options: ["Thylakoid Stack", "Stroma", "Stomata", "Mesophyll Cell"],
            answer: "Stroma"
        },
        {
            question: "Which molecules are released as a byproduct of splitting water during photosynthesis?",
            options: ["Carbon Dioxide", "Glucose", "Oxygen Molecules", "Methane"],
            answer: "Oxygen Molecules"
        },
        {
            question: "Which type of cell contains a large number of chloroplasts and makes up the primary photosynthetic tissue of the leaf?",
            options: ["Epidermal Cell", "Guard Cell", "Mesophyll Cell", "Xylem"],
            answer: "Mesophyll Cell"
        }
    ];

    function animation(time) {
        // Photons travel from Sun to Chloroplast
        photonGroup.children.forEach(p => {
            const t = ((time * 2 + p.userData.offset) % 10) / 10;
            p.position.set(0, 15 - (15 * t), 0);
        });

        // Water moves into Chloroplast
        const waterT = (time % 4) / 4;
        waterGroup.position.x = -2 + (1.2 * waterT);
        waterGroup.position.y = -6 + (6 * waterT);
        waterGroup.children.forEach(c => c.material.opacity = 1 - waterT);

        // CO2 moves from stomata to chloroplast
        const co2T = ((time + 1) % 4) / 4;
        co2Group.position.x = -3 + (3.5 * co2T);
        co2Group.position.y = -7 + (7 * co2T);
        co2Group.position.z = 2 - (2 * co2T);
        co2Group.children.forEach(c => c.material.opacity = 1 - co2T);

        // O2 moves from chloroplast outward
        const o2T = ((time + 2) % 4) / 4;
        o2Group.position.x = 3 * o2T;
        o2Group.position.y = 5 * o2T;
        o2Group.position.z = 2 * o2T;
        o2Group.children.forEach(c => c.material.opacity = o2T); // Fades in as it leaves
        
        // Spin Sun slowly
        sun.rotation.y = time * 0.5;
    }

    return {
        group,
        parts,
        quizzes,
        animation
    };
}
