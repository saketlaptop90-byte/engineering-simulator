export function createHydrothermalVentSystem(THREE) {
    const group = new THREE.Group();

    // 1. MagmaHeatSource
    const magmaGeo = new THREE.SphereGeometry(10, 32, 32);
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff4500, emissive: 0x8b0000, roughness: 0.2 });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.set(0, -20, 0);
    magma.name = "MagmaHeatSource";
    group.add(magma);

    // 2. RechargeZone
    const rechargeGeo = new THREE.TorusGeometry(15, 3, 16, 100);
    const rechargeMat = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent: true, opacity: 0.5 });
    const recharge = new THREE.Mesh(rechargeGeo, rechargeMat);
    recharge.rotation.x = Math.PI / 2;
    recharge.position.set(0, -10, 0);
    recharge.name = "RechargeZone";
    group.add(recharge);

    // 3. ReactionZone
    const reactionGeo = new THREE.CylinderGeometry(12, 15, 6, 32);
    const reactionMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const reaction = new THREE.Mesh(reactionGeo, reactionMat);
    reaction.position.set(0, -10, 0);
    reaction.name = "ReactionZone";
    group.add(reaction);

    // 4. UpflowZone
    const upflowGeo = new THREE.CylinderGeometry(2, 4, 10, 32);
    const upflowMat = new THREE.MeshStandardMaterial({ color: 0x808080, transparent: true, opacity: 0.7 });
    const upflow = new THREE.Mesh(upflowGeo, upflowMat);
    upflow.position.set(0, -2, 0);
    upflow.name = "UpflowZone";
    group.add(upflow);

    // 5. SulfideMound
    const moundGeo = new THREE.ConeGeometry(8, 6, 32);
    const moundMat = new THREE.MeshStandardMaterial({ color: 0x2F4F4F });
    const mound = new THREE.Mesh(moundGeo, moundMat);
    mound.position.set(0, 3, 0);
    mound.name = "SulfideMound";
    group.add(mound);

    // 6. BlackSmokerChimney
    const blackChimneyGeo = new THREE.CylinderGeometry(1, 2, 8, 16);
    const blackChimneyMat = new THREE.MeshStandardMaterial({ color: 0x1A1A1A });
    const blackChimney = new THREE.Mesh(blackChimneyGeo, blackChimneyMat);
    blackChimney.position.set(-2, 10, 0);
    blackChimney.name = "BlackSmokerChimney";
    group.add(blackChimney);

    // 7. WhiteSmoker
    const whiteChimneyGeo = new THREE.CylinderGeometry(0.8, 1.5, 6, 16);
    const whiteChimneyMat = new THREE.MeshStandardMaterial({ color: 0xD3D3D3 });
    const whiteChimney = new THREE.Mesh(whiteChimneyGeo, whiteChimneyMat);
    whiteChimney.position.set(3, 8, 2);
    whiteChimney.name = "WhiteSmoker";
    group.add(whiteChimney);

    // 8. DiffuseFlow
    const diffuseGeo = new THREE.SphereGeometry(3, 16, 16);
    const diffuseMat = new THREE.MeshStandardMaterial({ color: 0xadd8e6, transparent: true, opacity: 0.4 });
    const diffuse = new THREE.Mesh(diffuseGeo, diffuseMat);
    diffuse.position.set(2, 4, -3);
    diffuse.name = "DiffuseFlow";
    group.add(diffuse);

    // 9. MineralPrecipitate
    const precipitateGeo = new THREE.DodecahedronGeometry(1.5);
    const precipitateMat = new THREE.MeshStandardMaterial({ color: 0xFFD700 });
    const precipitate = new THREE.Mesh(precipitateGeo, precipitateMat);
    precipitate.position.set(-3, 6, 2);
    precipitate.name = "MineralPrecipitate";
    group.add(precipitate);

    // 10. TubewormCluster
    const tubewormGroup = new THREE.Group();
    tubewormGroup.name = "TubewormCluster";
    for(let i=0; i<15; i++) {
        const wormGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
        const wormMat = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
        const worm = new THREE.Mesh(wormGeo, wormMat);
        worm.position.set(
            (Math.random() - 0.5) * 3,
            Math.random() * 1,
            (Math.random() - 0.5) * 3
        );
        worm.rotation.set(
            (Math.random() - 0.5) * 0.5,
            0,
            (Math.random() - 0.5) * 0.5
        );
        tubewormGroup.add(worm);
    }
    tubewormGroup.position.set(3, 3, 0);
    group.add(tubewormGroup);

    // Particles for animation (Black Smoker plume)
    const plumeCount = 50;
    const plumeGeo = new THREE.BufferGeometry();
    const plumePos = new Float32Array(plumeCount * 3);
    const plumeVel = [];
    for(let i=0; i<plumeCount; i++) {
        plumePos[i*3] = -2 + (Math.random() - 0.5) * 0.5;
        plumePos[i*3+1] = 14 + Math.random() * 5;
        plumePos[i*3+2] = (Math.random() - 0.5) * 0.5;
        plumeVel.push({
            y: 2 + Math.random() * 2,
            x: (Math.random() - 0.5) * 1,
            z: (Math.random() - 0.5) * 1
        });
    }
    plumeGeo.setAttribute('position', new THREE.BufferAttribute(plumePos, 3));
    const plumeMat = new THREE.PointsMaterial({ color: 0x333333, size: 0.8, transparent: true, opacity: 0.8 });
    const plume = new THREE.Points(plumeGeo, plumeMat);
    group.add(plume);

    let time = 0;
    group.userData.update = function(deltaTime) {
        time += deltaTime;
        const positions = plume.geometry.attributes.position.array;
        for(let i=0; i<plumeCount; i++) {
            positions[i*3] += plumeVel[i].x * deltaTime;
            positions[i*3+1] += plumeVel[i].y * deltaTime;
            positions[i*3+2] += plumeVel[i].z * deltaTime;

            // Reset particle
            if(positions[i*3+1] > 25) {
                positions[i*3] = -2 + (Math.random() - 0.5) * 0.5;
                positions[i*3+1] = 14;
                positions[i*3+2] = (Math.random() - 0.5) * 0.5;
            }
        }
        plume.geometry.attributes.position.needsUpdate = true;
        magma.material.emissiveIntensity = 0.5 + 0.5 * Math.sin(time * 2);
    };

    group.userData.quiz = [
        {
            question: "What is the primary heat source for a hydrothermal vent?",
            options: ["Solar energy", "Geothermal gradient", "Magma chambers", "Radioactive decay"],
            correctAnswer: 2
        },
        {
            question: "What gives 'black smokers' their dark color?",
            options: ["Dissolved carbon dioxide", "Precipitated iron and sulfur minerals", "Decomposing organic matter", "Ash from underwater volcanoes"],
            correctAnswer: 1
        },
        {
            question: "Which process sustains life around hydrothermal vents without sunlight?",
            options: ["Photosynthesis", "Chemosynthesis", "Radiosynthesis", "Fermentation"],
            correctAnswer: 1
        },
        {
            question: "What type of chimney emits lighter-colored, cooler fluids rich in barium, calcium, and silicon?",
            options: ["Black smoker", "White smoker", "Diffuse flow", "Sulfide mound"],
            correctAnswer: 1
        },
        {
            question: "In what zone of a hydrothermal system does cold seawater enter the ocean crust?",
            options: ["Reaction Zone", "Upflow Zone", "Recharge Zone", "Plume Zone"],
            correctAnswer: 2
        },
        {
            question: "Which iconic organism found at hydrothermal vents houses symbiotic bacteria to produce its food?",
            options: ["Giant tubeworm", "Vampire squid", "Dumbo octopus", "Anglerfish"],
            correctAnswer: 0
        }
    ];

    return group;
}
