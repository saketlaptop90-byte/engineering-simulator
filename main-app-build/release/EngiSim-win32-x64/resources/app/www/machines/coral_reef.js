export function createCoralReef(THREE) {
    const mainGroup = new THREE.Group();

    // 1. Calcium Carbonate Skeleton
    const skeletonGeom = new THREE.BoxGeometry(6, 2, 6);
    const skeletonMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.9 });
    const skeleton = new THREE.Mesh(skeletonGeom, skeletonMat);
    skeleton.position.set(0, -1, 0);
    skeleton.userData.name = 'Calcium Carbonate Skeleton';
    mainGroup.add(skeleton);

    // 2. Coral Polyp
    const polypGroup = new THREE.Group();
    const polypGeom = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const polypMat = new THREE.MeshStandardMaterial({ color: 0xff8888 });
    const polypBase = new THREE.Mesh(polypGeom, polypMat);
    polypGroup.add(polypBase);
    
    // Add some tentacles to the polyp for better appearance
    const tentacleGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
    for (let i = 0; i < 8; i++) {
        const tentacle = new THREE.Mesh(tentacleGeom, polypMat);
        const angle = (i / 8) * Math.PI * 2;
        tentacle.position.set(Math.cos(angle) * 0.4, 0.5, Math.sin(angle) * 0.4);
        tentacle.rotation.x = Math.sin(angle) * 0.5;
        tentacle.rotation.z = -Math.cos(angle) * 0.5;
        polypGroup.add(tentacle);
    }
    polypGroup.position.set(0, 0.5, 0);
    polypGroup.userData.name = 'Coral Polyp';
    mainGroup.add(polypGroup);

    // 3. Zooxanthellae/Algae
    const algaeGroup = new THREE.Group();
    const algaeGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const algaeMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    for (let i=0; i<15; i++) {
        const algae = new THREE.Mesh(algaeGeom, algaeMat);
        algae.position.set((Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8 + 0.5, (Math.random()-0.5)*0.8);
        algaeGroup.add(algae);
    }
    algaeGroup.userData.name = 'Zooxanthellae/Algae';
    mainGroup.add(algaeGroup);

    // 4. Sea Anemone
    const anemoneGroup = new THREE.Group();
    const baseGeom = new THREE.CylinderGeometry(0.8, 1, 0.5, 16);
    const anemoneMat = new THREE.MeshStandardMaterial({ color: 0x9932CC });
    const anemoneBase = new THREE.Mesh(baseGeom, anemoneMat);
    anemoneBase.position.y = 0.25;
    anemoneGroup.add(anemoneBase);
    
    // Anemone tentacles
    const aTentacleGeom = new THREE.CylinderGeometry(0.05, 0.1, 1.0);
    for (let i = 0; i < 30; i++) {
        const tentacle = new THREE.Mesh(aTentacleGeom, anemoneMat);
        const angle = (i / 30) * Math.PI * 2;
        const radius = 0.4 + Math.random() * 0.4;
        tentacle.position.set(Math.cos(angle) * radius, 0.6, Math.sin(angle) * radius);
        tentacle.rotation.x = Math.sin(angle) * 0.6 + (Math.random()-0.5)*0.3;
        tentacle.rotation.z = -Math.cos(angle) * 0.6 + (Math.random()-0.5)*0.3;
        anemoneGroup.add(tentacle);
    }
    anemoneGroup.position.set(-1.8, 0, 1.8);
    anemoneGroup.userData.name = 'Sea Anemone';
    mainGroup.add(anemoneGroup);

    // 5. Clownfish
    const fishGroup = new THREE.Group();
    const fishBodyGeom = new THREE.ConeGeometry(0.15, 0.6, 16);
    fishBodyGeom.rotateZ(-Math.PI/2);
    const fishMat = new THREE.MeshStandardMaterial({ color: 0xff8c00 });
    const fishWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    
    const body = new THREE.Mesh(fishBodyGeom, fishMat);
    const stripe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12), fishWhiteMat);
    stripe1.rotation.z = Math.PI/2;
    stripe1.position.x = 0.1;
    const stripe2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.12), fishWhiteMat);
    stripe2.rotation.z = Math.PI/2;
    stripe2.position.x = -0.15;
    
    fishGroup.add(body);
    fishGroup.add(stripe1);
    fishGroup.add(stripe2);
    
    fishGroup.position.set(-1.8, 1, 1.8);
    fishGroup.userData.name = 'Clownfish';
    mainGroup.add(fishGroup);

    // 6. Sponge
    const spongeGroup = new THREE.Group();
    const spongeGeom = new THREE.CylinderGeometry(0.4, 0.25, 1.5, 16);
    const spongeMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const sponge1 = new THREE.Mesh(spongeGeom, spongeMat);
    sponge1.position.set(0, 0.75, 0);
    
    const spongeGeom2 = new THREE.CylinderGeometry(0.25, 0.15, 1.0, 16);
    const sponge2 = new THREE.Mesh(spongeGeom2, spongeMat);
    sponge2.position.set(0.5, 0.5, 0.3);
    sponge2.rotation.z = -0.3;
    sponge2.rotation.x = -0.2;
    
    spongeGroup.add(sponge1);
    spongeGroup.add(sponge2);
    spongeGroup.position.set(1.8, 0, -1.8);
    spongeGroup.userData.name = 'Sponge';
    mainGroup.add(spongeGroup);

    // 7. Parrotfish
    const parrotfishGeom = new THREE.SphereGeometry(0.3, 16, 16);
    parrotfishGeom.scale(2, 1, 0.5);
    const parrotfishMat = new THREE.MeshStandardMaterial({ color: 0x00ffff });
    const parrotfish = new THREE.Mesh(parrotfishGeom, parrotfishMat);
    parrotfish.position.set(2.5, 2.5, 0);
    parrotfish.userData.name = 'Parrotfish';
    mainGroup.add(parrotfish);

    // 8. Seawater
    const waterGeom = new THREE.BoxGeometry(15, 12, 15);
    const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x006994, transparent: true, opacity: 0.2, transmission: 0.9, roughness: 0.1 });
    const seawater = new THREE.Mesh(waterGeom, waterMat);
    seawater.position.set(0, 4, 0);
    seawater.userData.name = 'Seawater';
    mainGroup.add(seawater);

    // 9. Sunlight
    const sunGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffffcc, transparent: true, opacity: 0.9 });
    const sunlight = new THREE.Mesh(sunGeom, sunMat);
    sunlight.position.set(0, 8, -4);
    sunlight.userData.name = 'Sunlight';
    mainGroup.add(sunlight);

    // 10. Starfish
    const starGroup = new THREE.Group();
    const starShape = new THREE.Shape();
    const outerRadius = 0.4;
    const innerRadius = 0.15;
    for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        if (i === 0) starShape.moveTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
        else starShape.lineTo(Math.sin(angle) * radius, Math.cos(angle) * radius);
    }
    const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const starGeom = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
    const starMat = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
    const starfish = new THREE.Mesh(starGeom, starMat);
    starfish.rotation.x = -Math.PI / 2;
    
    starGroup.add(starfish);
    starGroup.position.set(1.5, 0.05, 2);
    starGroup.userData.name = 'Starfish';
    mainGroup.add(starGroup);

    // Animation
    mainGroup.userData.animation = (time) => {
        // Clownfish swims around sea anemone
        fishGroup.position.x = -1.8 + Math.cos(time * 1.5) * 1.0;
        fishGroup.position.z = 1.8 + Math.sin(time * 1.5) * 1.0;
        fishGroup.rotation.y = -time * 1.5;

        // Parrotfish swims back and forth
        parrotfish.position.x = Math.sin(time * 0.8) * 4;
        parrotfish.position.y = 2.5 + Math.cos(time * 1.2) * 0.5;
        parrotfish.rotation.y = Math.cos(time * 0.8) > 0 ? Math.PI : 0;

        // Sunlight pulses slightly
        const scale = 1 + Math.sin(time * 2) * 0.05;
        sunlight.scale.set(scale, scale, scale);
        
        // Polyp tentacles swaying
        polypGroup.children.forEach((child, index) => {
            if (index > 0) { // skip base
                child.rotation.z = -Math.cos((index-1) / 8 * Math.PI * 2) * 0.5 + Math.sin(time * 2 + index) * 0.1;
                child.rotation.x = Math.sin((index-1) / 8 * Math.PI * 2) * 0.5 + Math.cos(time * 2 + index) * 0.1;
            }
        });
        
        // Anemone tentacles swaying
        anemoneGroup.children.forEach((child, index) => {
            if (index > 0) { // skip base
                const angle = ((index-1) / 30) * Math.PI * 2;
                child.rotation.z = -Math.cos(angle) * 0.6 + Math.sin(time * 1.5 + index) * 0.15;
                child.rotation.x = Math.sin(angle) * 0.6 + Math.cos(time * 1.5 + index) * 0.15;
            }
        });
    };

    // 6 Questions
    mainGroup.userData.questions = [
        {
            text: "What is the main structural component of a coral reef?",
            options: ["Calcium Carbonate", "Silica", "Chitin", "Keratin"],
            correctAnswer: 0
        },
        {
            text: "What is the symbiotic algae that lives inside coral polyps?",
            options: ["Kelp", "Sargassum", "Zooxanthellae", "Phytoplankton"],
            correctAnswer: 2
        },
        {
            text: "What does the coral provide for the zooxanthellae?",
            options: ["Oxygen and glucose", "Protection and compounds for photosynthesis", "Mobility and defense", "Nutrients from the deep ocean"],
            correctAnswer: 1
        },
        {
            text: "What type of relationship do clownfish and sea anemones have?",
            options: ["Parasitism", "Commensalism", "Mutualism", "Competition"],
            correctAnswer: 2
        },
        {
            text: "Why are parrotfish important to coral reefs?",
            options: ["They protect coral from predators", "They clean algae off coral and produce sand", "They provide shade for corals", "They sting intruders"],
            correctAnswer: 1
        },
        {
            text: "Coral bleaching occurs when corals lose their:",
            options: ["Calcium carbonate skeleton", "Tentacles", "Symbiotic zooxanthellae", "Nematocysts"],
            correctAnswer: 2
        }
    ];

    return mainGroup;
}
