export function createSubductionZone(THREE) {
    const group = new THREE.Group();

    // 1. Asthenosphere (The semi-fluid mantle layer below lithosphere)
    const asthenosphereGeo = new THREE.BoxGeometry(14, 4, 6);
    const asthenosphereMat = new THREE.MeshStandardMaterial({ color: 0xc95e00, roughness: 0.8 });
    const asthenosphere = new THREE.Mesh(asthenosphereGeo, asthenosphereMat);
    asthenosphere.name = "Asthenosphere";
    asthenosphere.position.set(0, -3.5, 0);
    group.add(asthenosphere);

    // 2. Lithosphere (Rigid portion of mantle under continental crust)
    const lithosphereGeo = new THREE.BoxGeometry(7, 1.5, 6);
    const lithosphereMat = new THREE.MeshStandardMaterial({ color: 0x5a5a5a, roughness: 0.9 });
    const lithosphere = new THREE.Mesh(lithosphereGeo, lithosphereMat);
    lithosphere.name = "Lithosphere";
    lithosphere.position.set(3.5, -0.75, 0);
    group.add(lithosphere);

    // 3. Oceanic Crust (Denser crust that will subduct)
    const oceanicCrustGeo = new THREE.BoxGeometry(6, 1, 6);
    const oceanicCrustMat = new THREE.MeshStandardMaterial({ color: 0x2b4a5f, roughness: 0.7 });
    const oceanicCrust = new THREE.Mesh(oceanicCrustGeo, oceanicCrustMat);
    oceanicCrust.name = "Oceanic Crust";
    oceanicCrust.position.set(-4, 0, 0);
    group.add(oceanicCrust);

    // 4. Continental Crust (Less dense, thicker crust)
    const continentalCrustGeo = new THREE.BoxGeometry(7, 1.5, 6);
    const continentalCrustMat = new THREE.MeshStandardMaterial({ color: 0x6e8b3d, roughness: 0.8 });
    const continentalCrust = new THREE.Mesh(continentalCrustGeo, continentalCrustMat);
    continentalCrust.name = "Continental Crust";
    continentalCrust.position.set(3.5, 0.75, 0);
    group.add(continentalCrust);

    // 5. Subducting Slab (The oceanic crust diving into the mantle)
    const subductingSlabGeo = new THREE.BoxGeometry(7, 1, 6);
    const subductingSlabMat = new THREE.MeshStandardMaterial({ color: 0x2b4a5f, roughness: 0.7 });
    const subductingSlab = new THREE.Mesh(subductingSlabGeo, subductingSlabMat);
    subductingSlab.name = "Subducting Slab";
    // Angle it downward at 30 degrees
    subductingSlab.rotation.z = -Math.PI / 6;
    // Position it to seamlessly connect to oceanic crust
    subductingSlab.position.set(2.03, -1.75, 0);
    group.add(subductingSlab);

    // 6. Oceanic Trench (Deep depression formed at the subduction zone boundary)
    const trenchGeo = new THREE.CylinderGeometry(0.6, 0.1, 6, 4);
    const trenchMat = new THREE.MeshStandardMaterial({ color: 0x05101a, roughness: 1.0 });
    const oceanicTrench = new THREE.Mesh(trenchGeo, trenchMat);
    oceanicTrench.name = "Oceanic Trench";
    oceanicTrench.rotation.x = Math.PI / 2; // lay flat to stretch along Z
    oceanicTrench.rotation.z = Math.PI / 4; // angle to form a V-shape depression
    oceanicTrench.position.set(-1.1, -0.2, 0);
    group.add(oceanicTrench);

    // 7. Accretionary Wedge (Sediments scraped off the subducting plate)
    const wedgeGeo = new THREE.CylinderGeometry(0.8, 0.8, 6, 3);
    const wedgeMat = new THREE.MeshStandardMaterial({ color: 0xbc8f8f, roughness: 0.9 });
    const accretionaryWedge = new THREE.Mesh(wedgeGeo, wedgeMat);
    accretionaryWedge.name = "Accretionary Wedge";
    accretionaryWedge.rotation.x = Math.PI / 2;
    accretionaryWedge.rotation.z = -Math.PI / 6;
    accretionaryWedge.position.set(-0.2, 0.3, 0);
    group.add(accretionaryWedge);

    // 8. Melting Zone (Area where high pressure/temp creates magma)
    const meltingGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const meltingMat = new THREE.MeshStandardMaterial({ 
        color: 0xff3300, 
        emissive: 0xaa1100,
        transparent: true,
        opacity: 0.8
    });
    const meltingZone = new THREE.Mesh(meltingGeo, meltingMat);
    meltingZone.name = "Melting Zone";
    meltingZone.position.set(2.5, -3.2, 0);
    meltingZone.scale.set(1.5, 0.8, 1);
    group.add(meltingZone);

    // 9. Volcanic Arc (Volcano formed on the continental crust)
    const volcanoGeo = new THREE.ConeGeometry(1.5, 2.5, 16);
    const volcanoMat = new THREE.MeshStandardMaterial({ color: 0x4a4036, roughness: 0.9 });
    const volcanicArc = new THREE.Mesh(volcanoGeo, volcanoMat);
    volcanicArc.name = "Volcanic Arc";
    volcanicArc.position.set(3, 2.75, 0);
    group.add(volcanicArc);

    // 10. Magma Diapirs (Blobs of magma rising to form the volcano)
    const magmaDiapirs = new THREE.Group();
    magmaDiapirs.name = "Magma Diapirs";
    const diapirGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const diapirMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0xff2200 });
    
    const diapir1 = new THREE.Mesh(diapirGeo, diapirMat);
    diapir1.position.set(0, 0, 0);
    const diapir2 = new THREE.Mesh(diapirGeo, diapirMat);
    diapir2.position.set(-0.3, 0.8, 0.2);
    const diapir3 = new THREE.Mesh(diapirGeo, diapirMat);
    diapir3.position.set(0.4, 1.5, -0.1);
    
    magmaDiapirs.add(diapir1, diapir2, diapir3);
    magmaDiapirs.position.set(2.8, -2.5, 0);
    group.add(magmaDiapirs);

    // Animation Loop
    const update = (delta, time) => {
        // Pulse the melting zone to simulate extreme heat
        meltingZone.scale.set(1.5 + Math.sin(time * 3) * 0.1, 0.8 + Math.cos(time * 3) * 0.1, 1);

        // Magma diapirs rise from the melting zone towards the volcanic arc
        const riseCycle = (time % 3) / 3; // 0.0 to 1.0 cycle
        magmaDiapirs.position.y = -2.5 + riseCycle * 4.0; // Rises from -2.5 to 1.5
        
        // Scale magma diapirs so they grow as they form and fade out at the surface
        const scale = Math.sin(riseCycle * Math.PI); 
        magmaDiapirs.scale.setScalar(Math.max(0.1, scale));

        // Subducting slab subtle shift (conveyor belt illusion)
        const subductionOffset = (time % 1) * 0.1;
        subductingSlab.position.x = 2.03 + subductionOffset * Math.cos(-Math.PI / 6);
        subductingSlab.position.y = -1.75 + subductionOffset * Math.sin(-Math.PI / 6);
    };

    // Plate Tectonics Quiz
    const quiz = [
        {
            question: "What is the area called where one tectonic plate is forced under another?",
            options: ["Divergent boundary", "Subduction zone", "Transform fault", "Rift valley"],
            answer: 1
        },
        {
            question: "Which type of tectonic plate is typically denser and more likely to subduct?",
            options: ["Continental crust", "Oceanic crust", "Both are equally dense", "Neither subducts"],
            answer: 1
        },
        {
            question: "What deep ocean feature forms at the exact boundary where a plate begins to subduct?",
            options: ["Mid-ocean ridge", "Oceanic trench", "Abyssal plain", "Seamount"],
            answer: 1
        },
        {
            question: "What causes the formation of magma in the melting zone of a subducting slab?",
            options: ["Friction alone", "Flux melting from water release", "Decompression melting", "Solar radiation"],
            answer: 1
        },
        {
            question: "What surface feature is typically formed by the magma rising from a subduction zone on a continent?",
            options: ["Volcanic arc", "Island chain", "Rift valley", "Fold mountain"],
            answer: 0
        },
        {
            question: "What is the wedge-shaped mass of sediment scraped off the subducting plate called?",
            options: ["Accretionary wedge", "Moraine", "Alluvial fan", "Delta"],
            answer: 0
        }
    ];

    return { group, update, quiz };
}
