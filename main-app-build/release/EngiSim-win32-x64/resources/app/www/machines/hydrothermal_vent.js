export function createHydrothermalVent(THREE) {
    const group = new THREE.Group();

    // 1. Basaltic Crust
    const crustGeo = new THREE.BoxGeometry(16, 2, 16);
    const crustMat = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const crust = new THREE.Mesh(crustGeo, crustMat);
    crust.position.y = -1;
    group.add(crust);

    // 2. Magma Heat Source
    const magmaGeo = new THREE.BoxGeometry(8, 2, 8);
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff1100, roughness: 0.8 });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.y = -3;
    group.add(magma);

    // 3. Cold Seawater Infiltration Zone
    const infiltrationGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const arrowGeo = new THREE.ConeGeometry(0.3, 1, 8);
        const arrowMat = new THREE.MeshLambertMaterial({ color: 0x0088ff, transparent: true, opacity: 0.7 });
        const arrow = new THREE.Mesh(arrowGeo, arrowMat);
        const r = 5 + Math.random() * 2;
        const theta = (i / 8) * Math.PI * 2;
        arrow.position.set(r * Math.cos(theta), 1, r * Math.sin(theta));
        arrow.rotation.x = Math.PI; // point down
        arrow.userData = { baseY: 1, speed: 1 + Math.random() };
        infiltrationGroup.add(arrow);
    }
    group.add(infiltrationGroup);

    // 4. Base Mound
    const moundGeo = new THREE.ConeGeometry(4, 4, 16);
    const moundMat = new THREE.MeshLambertMaterial({ color: 0x665544 });
    const mound = new THREE.Mesh(moundGeo, moundMat);
    mound.position.y = 2;
    group.add(mound);

    // 5. Sulfide Chimney
    const chimneyGeo = new THREE.CylinderGeometry(0.6, 1.2, 4, 8);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.9 });
    const chimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    chimney.position.y = 6;
    group.add(chimney);

    // 6. Superheated Fluid Upflow
    const upflowGeo = new THREE.CylinderGeometry(0.25, 0.25, 10, 8);
    const upflowMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
    const upflow = new THREE.Mesh(upflowGeo, upflowMat);
    upflow.position.y = 3;
    group.add(upflow);

    // 7. Tubeworm Colony
    const wormsGroup = new THREE.Group();
    for (let i = 0; i < 30; i++) {
        const r = 1.5 + Math.random() * 2.5;
        const theta = Math.random() * Math.PI * 2;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = 4 - r * 1.0 + Math.random() * 0.5; // align roughly with mound slope

        const wormGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6);
        const wormMat = new THREE.MeshLambertMaterial({ color: 0xeeeeee });
        const worm = new THREE.Mesh(wormGeo, wormMat);
        
        const tipGeo = new THREE.SphereGeometry(0.06);
        const tipMat = new THREE.MeshLambertMaterial({ color: 0xdd0000 });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.position.y = 0.3;
        worm.add(tip);

        worm.position.set(x, y, z);
        const tiltX = (Math.random() - 0.5) * 0.5;
        const tiltZ = (Math.random() - 0.5) * 0.5;
        worm.rotation.set(tiltX, 0, tiltZ);
        wormsGroup.add(worm);
    }
    group.add(wormsGroup);

    // 8. Anhydrite Crystals
    const crystalsGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
        const crysGeo = new THREE.ConeGeometry(0.08, 0.8, 4);
        const crysMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, roughness: 0.2 });
        const crys = new THREE.Mesh(crysGeo, crysMat);
        
        const r = 0.6 + Math.random() * 0.4;
        const theta = Math.random() * Math.PI * 2;
        crys.position.set(r * Math.cos(theta), 5 + Math.random() * 2.5, r * Math.sin(theta));
        
        crys.rotation.z = (Math.random() - 0.5) * Math.PI;
        crys.rotation.x = (Math.random() - 0.5) * Math.PI;
        crystalsGroup.add(crys);
    }
    group.add(crystalsGroup);

    // 9. Vent Orifice
    const orificeGeo = new THREE.TorusGeometry(0.5, 0.15, 8, 16);
    const orificeMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    const orifice = new THREE.Mesh(orificeGeo, orificeMat);
    orifice.rotation.x = Math.PI / 2;
    orifice.position.y = 8;
    group.add(orifice);

    // 10. Mineral Plume (Black Smoke)
    const plumeGroup = new THREE.Group();
    const particleCount = 80;
    for (let i = 0; i < particleCount; i++) {
        const pSize = 0.15 + Math.random() * 0.2;
        const pGeo = new THREE.SphereGeometry(pSize, 6, 6);
        const pMat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.8 });
        const pMesh = new THREE.Mesh(pGeo, pMat);
        pMesh.position.set((Math.random() - 0.5) * 0.8, Math.random() * 6, (Math.random() - 0.5) * 0.8);
        pMesh.userData = {
            speed: 2 + Math.random() * 3,
            xDrift: (Math.random() - 0.5) * 0.5,
            zDrift: (Math.random() - 0.5) * 0.5,
            baseScale: pSize
        };
        plumeGroup.add(pMesh);
    }
    plumeGroup.position.y = 8;
    group.add(plumeGroup);

    const parts = [
        { name: "Sulfide Chimney", description: "A hollow mineral structure formed as dissolved minerals precipitate upon contacting cold seawater.", mesh: chimney },
        { name: "Mineral Plume", description: "The 'black smoke' consisting of iron and sulfur-rich minerals precipitating out of the superheated vent fluid.", mesh: plumeGroup },
        { name: "Magma Heat Source", description: "The shallow magma chamber that provides the immense heat necessary to drive the hydrothermal convection system.", mesh: magma },
        { name: "Cold Seawater Infiltration Zone", description: "Area where cold, dense seawater seeps down into the oceanic crust through cracks and faults.", mesh: infiltrationGroup },
        { name: "Superheated Fluid Upflow", description: "Buoyant, mineral-rich fluid heated by magma rising rapidly back to the seafloor.", mesh: upflow },
        { name: "Tubeworm Colony", description: "Chemosynthetic ecosystems relying on symbiotic bacteria to convert hydrogen sulfide into organic matter.", mesh: wormsGroup },
        { name: "Base Mound", description: "A large accumulation of collapsed chimneys and precipitated minerals forming the foundation of the vent.", mesh: mound },
        { name: "Anhydrite Crystals", description: "Calcium sulfate minerals that precipitate at high temperatures to form the initial framework of a new chimney.", mesh: crystalsGroup },
        { name: "Basaltic Crust", description: "The highly fractured volcanic rock that forms the oceanic tectonic plates.", mesh: crust },
        { name: "Vent Orifice", description: "The opening at the top of the chimney where high-velocity, superheated fluid exits into the ocean.", mesh: orifice }
    ];

    let time = 0;
    const update = function(delta) {
        time += delta;

        // Animate infiltration arrows moving down
        infiltrationGroup.children.forEach(arrow => {
            arrow.position.y -= arrow.userData.speed * delta;
            if (arrow.position.y < -2) {
                arrow.position.y = arrow.userData.baseY;
            }
        });

        // Animate upflow pulse
        upflow.material.opacity = 0.6 + 0.3 * Math.sin(time * 5);
        upflow.scale.x = 1 + 0.1 * Math.sin(time * 10);
        upflow.scale.z = 1 + 0.1 * Math.sin(time * 10);

        // Animate magma glow
        magma.material.emissiveIntensity = 0.8 + 0.2 * Math.sin(time * 2);

        // Animate mineral plume
        plumeGroup.children.forEach(particle => {
            particle.position.y += particle.userData.speed * delta;
            particle.position.x += particle.userData.xDrift * delta;
            particle.position.z += particle.userData.zDrift * delta;
            
            // Expand as they rise
            const scale = 1 + particle.position.y * 0.3;
            particle.scale.set(scale, scale, scale);

            // Fade out
            particle.material.opacity = Math.max(0, 0.8 - (particle.position.y / 6));

            if (particle.position.y > 6) {
                particle.position.set((Math.random() - 0.5) * 0.8, 0, (Math.random() - 0.5) * 0.8);
                particle.scale.set(1, 1, 1);
                particle.material.opacity = 0.8;
            }
        });

        // Tubeworms gentle swaying
        wormsGroup.children.forEach((worm, index) => {
            worm.rotation.x += Math.sin(time * 2 + index) * 0.005;
            worm.rotation.z += Math.cos(time * 2 + index) * 0.005;
        });
    };

    const quizzes = [
        {
            question: "What provides the primary energy source for the ecosystems around deep-sea hydrothermal vents?",
            options: ["Sunlight (Photosynthesis)", "Geothermal heat", "Chemosynthesis using hydrogen sulfide", "Organic detritus falling from the surface"],
            answer: 2
        },
        {
            question: "What causes the 'black smoke' in a black smoker hydrothermal vent?",
            options: ["Burning magma", "Iron and sulfur minerals precipitating upon hitting cold water", "Carbon dioxide bubbles", "Decomposing organic matter"],
            answer: 1
        },
        {
            question: "What role does the basaltic crust play in the formation of a hydrothermal vent?",
            options: ["It provides a fractured medium for seawater infiltration and fluid upflow.", "It directly melts to form the black smoke.", "It acts as a shield to block magma.", "It provides the oxygen needed by tubeworms."],
            answer: 0
        },
        {
            question: "Which mineral often forms the initial scaffolding of a black smoker chimney before sulfides precipitate?",
            options: ["Quartz", "Anhydrite (Calcium sulfate)", "Halite", "Diamond"],
            answer: 1
        },
        {
            question: "Why does the superheated vent fluid not boil despite reaching temperatures over 350°C (660°F)?",
            options: ["The water has high salinity.", "The extreme pressure of the deep ocean prevents boiling.", "The minerals absorb the heat.", "It actually does boil continuously."],
            answer: 1
        },
        {
            question: "Tubeworms found near hydrothermal vents lack a stomach and gut. How do they obtain nutrients?",
            options: ["By absorbing them directly through their skin.", "From symbiotic bacteria living inside their bodies.", "By filtering small particles from the black smoke.", "By eating smaller crustaceans."],
            answer: 1
        }
    ];

    return {
        group,
        parts,
        update,
        quizzes
    };
}
