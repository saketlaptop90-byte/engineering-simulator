export function createStratovolcanoEruptionModel(THREE) {
    const group = new THREE.Group();

    // Materials
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9, flatShading: true });
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xaa1100, emissiveIntensity: 0.8 });
    const ashMat = new THREE.MeshStandardMaterial({ color: 0x333333, transparent: true, opacity: 0.8 });
    const pyroclasticMat = new THREE.MeshStandardMaterial({ color: 0x774433, transparent: true, opacity: 0.9 });
    const bombMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const laharMat = new THREE.MeshStandardMaterial({ color: 0x443322 });
    const fumaroleMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, transparent: true, opacity: 0.6 });

    // 1. CraterVent (The main mountain structure with a crater)
    const ventGeometry = new THREE.CylinderGeometry(2, 15, 20, 16, 1, false);
    const craterVent = new THREE.Mesh(ventGeometry, rockMat);
    craterVent.position.y = 10;
    group.add(craterVent);

    // 2. MainConduit (The central pipe)
    const conduitGeometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 8);
    const mainConduit = new THREE.Mesh(conduitGeometry, magmaMat);
    mainConduit.position.y = 10;
    group.add(mainConduit);

    // 3. MagmaPlumbing (Magma chamber at the base)
    const chamberGeometry = new THREE.SphereGeometry(4, 16, 16);
    const magmaPlumbing = new THREE.Mesh(chamberGeometry, magmaMat);
    magmaPlumbing.position.y = -2;
    magmaPlumbing.scale.set(1, 0.5, 1);
    group.add(magmaPlumbing);

    // 4. AshPlume (Rising ash cloud)
    const plumeGeometry = new THREE.SphereGeometry(3, 16, 16);
    const ashPlume = new THREE.Mesh(plumeGeometry, ashMat);
    ashPlume.position.y = 23;
    group.add(ashPlume);

    // 5. PyroclasticFlow (Avalanche of hot ash)
    const flowGeometry = new THREE.BoxGeometry(4, 1, 8);
    const pyroclasticFlow = new THREE.Mesh(flowGeometry, pyroclasticMat);
    pyroclasticFlow.position.set(5, 5, 0);
    pyroclasticFlow.rotation.z = Math.PI / 4;
    group.add(pyroclasticFlow);

    // 6. ParasiticCone (Small cone on the flank)
    const coneGeometry = new THREE.ConeGeometry(2, 4, 16);
    const parasiticCone = new THREE.Mesh(coneGeometry, rockMat);
    parasiticCone.position.set(-8, 5, 5);
    parasiticCone.rotation.x = -Math.PI / 8;
    group.add(parasiticCone);

    // 7. TephraFallout (Falling tephra particles)
    const tephraGeometry = new THREE.BufferGeometry();
    const tephraCount = 100;
    const tephraPos = new Float32Array(tephraCount * 3);
    for(let i=0; i<tephraCount; i++) {
        tephraPos[i*3] = (Math.random() - 0.5) * 20;
        tephraPos[i*3+1] = 20 + Math.random() * 10;
        tephraPos[i*3+2] = (Math.random() - 0.5) * 20;
    }
    tephraGeometry.setAttribute('position', new THREE.BufferAttribute(tephraPos, 3));
    const tephraFallout = new THREE.Points(tephraGeometry, new THREE.PointsMaterial({ color: 0x2a2a2a, size: 0.5 }));
    group.add(tephraFallout);

    // 8. VolcanicBombs (Large ejected rocks)
    const bombGeometry = new THREE.DodecahedronGeometry(0.5);
    const volcanicBombs = new THREE.Group();
    for(let i=0; i<5; i++) {
        const bomb = new THREE.Mesh(bombGeometry, bombMat);
        bomb.position.set((Math.random()-0.5)*10, 20 + Math.random()*5, (Math.random()-0.5)*10);
        volcanicBombs.add(bomb);
    }
    group.add(volcanicBombs);

    // 9. Fumarole (Gas vent)
    const fumaroleGeo = new THREE.SphereGeometry(1, 8, 8);
    const fumarole = new THREE.Mesh(fumaroleGeo, fumaroleMat);
    fumarole.position.set(-4, 12, -4);
    group.add(fumarole);

    // 10. LaharChannel (Mudflow path)
    const laharGeo = new THREE.PlaneGeometry(3, 15);
    const laharChannel = new THREE.Mesh(laharGeo, laharMat);
    laharChannel.position.set(0, 5, 8);
    laharChannel.rotation.x = -Math.PI / 3;
    group.add(laharChannel);

    let time = 0;
    group.userData.update = function(deltaTime) {
        time += deltaTime;

        // Animate Ash Plume
        ashPlume.position.y = 23 + Math.sin(time * 2) * 1.5;
        ashPlume.scale.setScalar(1 + Math.sin(time) * 0.1);

        // Animate Tephra Fallout
        const positions = tephraFallout.geometry.attributes.position.array;
        for(let i=0; i<tephraCount; i++) {
            positions[i*3+1] -= deltaTime * 5;
            if(positions[i*3+1] < 0) {
                positions[i*3+1] = 20 + Math.random() * 10;
            }
        }
        tephraFallout.geometry.attributes.position.needsUpdate = true;

        // Animate Volcanic Bombs
        volcanicBombs.children.forEach((bomb, i) => {
            bomb.position.y -= deltaTime * 8;
            bomb.position.x += Math.sin(time + i) * 0.05;
            if (bomb.position.y < 0) {
                bomb.position.y = 20 + Math.random() * 5;
                bomb.position.x = (Math.random()-0.5)*10;
                bomb.position.z = (Math.random()-0.5)*10;
            }
        });
        
        // Fumarole pulsing
        fumarole.scale.setScalar(1 + Math.sin(time * 5) * 0.2);
    };

    group.userData.quiz = [
        {
            question: "What is the primary characteristic of a stratovolcano?",
            options: ["Broad, flat slopes", "Steep, conical profile", "Made entirely of ash", "Found only underwater"],
            correctAnswer: 1
        },
        {
            question: "What type of magma is typically associated with explosive stratovolcano eruptions?",
            options: ["Low viscosity basaltic", "High viscosity andesitic/rhyolitic", "Pure liquid iron", "Water-rich mud"],
            correctAnswer: 1
        },
        {
            question: "What is a pyroclastic flow?",
            options: ["A slow-moving lava stream", "A fast-moving current of hot gas and volcanic matter", "A mudslide caused by rain", "An underwater eruption"],
            correctAnswer: 1
        },
        {
            question: "What are volcanic bombs?",
            options: ["Man-made explosives used to stop lava", "Large fragments of liquid or semi-liquid magma ejected during an eruption", "Small ash particles", "Gases trapped in the magma chamber"],
            correctAnswer: 1
        },
        {
            question: "What is a lahar?",
            options: ["A type of volcanic rock", "A violent mudflow or debris flow composed of volcanic materials", "A continuous stream of lava", "A crater lake"],
            correctAnswer: 1
        },
        {
            question: "What role does the main conduit play?",
            options: ["It cools the volcano", "It transports magma from the chamber to the surface vent", "It absorbs seismic waves", "It creates tectonic plates"],
            correctAnswer: 1
        }
    ];

    return group;
}
