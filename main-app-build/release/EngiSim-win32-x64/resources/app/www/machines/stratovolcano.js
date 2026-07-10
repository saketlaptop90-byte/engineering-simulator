export function createStratovolcano(THREE) {
    const group = new THREE.Group();
    const parts = [];

    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0xaa2200, roughness: 0.2 });
    const lavaMat = new THREE.MeshStandardMaterial({ color: 0xff5500, emissive: 0xcc3300, roughness: 0.4 });
    const ashMat = new THREE.MeshStandardMaterial({ color: 0x555555, transparent: true, opacity: 0.8 });
    const layerMat1 = new THREE.MeshStandardMaterial({ color: 0x6b4226, side: THREE.DoubleSide });
    const layerMat2 = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, side: THREE.DoubleSide });
    const cutMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });

    // 1. Magma Chamber
    const magmaChamber = new THREE.Mesh(new THREE.SphereGeometry(3, 32, 32), magmaMat);
    magmaChamber.position.set(0, -3, 0);
    group.add(magmaChamber);
    parts.push({
        name: "Magma Chamber",
        description: "A large underground pool of liquid rock found beneath the surface of the Earth.",
        mesh: magmaChamber
    });

    // 2. Main Conduit
    const mainConduit = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 11.5, 16), magmaMat);
    mainConduit.position.set(0, 2.75, 0);
    group.add(mainConduit);
    parts.push({
        name: "Main Conduit",
        description: "The primary pipe or channel that carries magma from the chamber to the surface.",
        mesh: mainConduit
    });

    // 6. Tephra Layers
    const tephraGroup = new THREE.Group();
    const segments = 5;
    const totalHeight = 10;
    const segmentHeight = totalHeight / segments;
    const baseRadius = 10;
    const topRadius = 1.5;

    for(let i=0; i<segments; i++) {
        const curBase = baseRadius - (baseRadius - topRadius) * (i / segments);
        const curTop = baseRadius - (baseRadius - topRadius) * ((i + 1) / segments);
        
        const geo = new THREE.CylinderGeometry(curTop, curBase, segmentHeight, 32, 1, false, 0, Math.PI * 1.5);
        const mat = i % 2 === 0 ? layerMat1 : layerMat2;
        const layer = new THREE.Mesh(geo, mat);
        
        layer.position.y = i * segmentHeight + segmentHeight / 2;
        tephraGroup.add(layer);
    }

    // Cut face 1: X<0, Z=0
    const cutFaceGeo1 = new THREE.BufferGeometry();
    const vertices1 = new Float32Array([
        0, 0, 0,
        -10, 0, 0,
        0, 8.5, 0,
        -1.5, 10, 0
    ]);
    const indices1 = [ 0, 2, 1, 1, 2, 3 ];
    cutFaceGeo1.setAttribute('position', new THREE.BufferAttribute(vertices1, 3));
    cutFaceGeo1.setIndex(indices1);
    cutFaceGeo1.computeVertexNormals();
    tephraGroup.add(new THREE.Mesh(cutFaceGeo1, cutMat));

    // Cut face 2: X=0, Z>0
    const cutFaceGeo2 = new THREE.BufferGeometry();
    const vertices2 = new Float32Array([
        0, 0, 0,
        0, 0, 10,
        0, 8.5, 0,
        0, 10, 1.5
    ]);
    const indices2 = [ 0, 1, 2, 1, 3, 2 ];
    cutFaceGeo2.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
    cutFaceGeo2.setIndex(indices2);
    cutFaceGeo2.computeVertexNormals();
    tephraGroup.add(new THREE.Mesh(cutFaceGeo2, cutMat));

    group.add(tephraGroup);
    parts.push({
        name: "Tephra Layers",
        description: "Alternating layers of lava flows, volcanic ash, cinders, and blocks that build up the stratovolcano.",
        mesh: tephraGroup
    });

    // 7. Crater
    const craterGeo = new THREE.CylinderGeometry(1.5, 0.8, 1.5, 32, 1, false, 0, Math.PI * 1.5);
    const craterMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide });
    const crater = new THREE.Mesh(craterGeo, craterMat);
    crater.position.set(0, 9.25, 0);
    group.add(crater);
    parts.push({
        name: "Crater",
        description: "A bowl-shaped depression at the top of the volcano, formed during explosive eruptions.",
        mesh: crater
    });

    // 3. Secondary Vent
    const secVent = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 7.2, 16), magmaMat);
    secVent.position.set(-3, 4, 0.5); 
    secVent.rotation.z = Math.atan2(6, 4); 
    group.add(secVent);
    parts.push({
        name: "Secondary Vent",
        description: "A smaller outlet on the side of the volcano through which magma can erupt.",
        mesh: secVent
    });

    // 8. Sill
    const sillGeo = new THREE.BoxGeometry(4, 0.4, 2);
    const sill = new THREE.Mesh(sillGeo, magmaMat);
    sill.position.set(-4, 1.5, 0.5); 
    group.add(sill);
    parts.push({
        name: "Sill",
        description: "A horizontal intrusion of magma that squeezes between layers of older rock.",
        mesh: sill
    });

    // 9. Dike
    const dikeGeo = new THREE.BoxGeometry(0.4, 6, 3);
    const dike = new THREE.Mesh(dikeGeo, magmaMat);
    dike.position.set(-0.5, 3, 4); 
    group.add(dike);
    parts.push({
        name: "Dike",
        description: "A vertical or steeply dipping intrusion of magma that cuts across existing rock layers.",
        mesh: dike
    });

    // 4. Ash Cloud
    const ashCloud = new THREE.Group();
    for (let i = 0; i < 30; i++) {
        const size = Math.random() * 2 + 1;
        const ashPart = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 16), ashMat);
        ashPart.position.set(
            (Math.random() - 0.5) * 8,
            12 + Math.random() * 6,
            (Math.random() - 0.5) * 8
        );
        ashCloud.add(ashPart);
    }
    group.add(ashCloud);
    parts.push({
        name: "Ash Cloud",
        description: "A cloud of fine volcanic rock and glass fragments propelled into the atmosphere during an eruption.",
        mesh: ashCloud
    });

    // 5. Lava Flow
    const lavaFlowGeo = new THREE.CylinderGeometry(0.3, 1.2, 10.5, 16);
    const lavaFlow = new THREE.Mesh(lavaFlowGeo, lavaMat);
    lavaFlow.position.set(0, 5, -5.75);
    lavaFlow.rotation.x = Math.atan(0.85);
    lavaFlow.scale.set(1, 1, 0.2); 
    group.add(lavaFlow);
    parts.push({
        name: "Lava Flow",
        description: "Streams of molten rock that pour or ooze from an erupting vent.",
        mesh: lavaFlow
    });

    // 10. Fumarole
    const fumaroleGroup = new THREE.Group();
    const fumeVent = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.5, 16), layerMat2);
    fumeVent.position.set(5.75, 5, 0);
    fumeVent.rotation.z = Math.atan(0.85); 
    fumaroleGroup.add(fumeVent);

    const smokeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 });
    for(let i=0; i<5; i++) {
        const smoke = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 8), smokeMat);
        smoke.position.set(5.75 + i*0.5, 5 + i*0.8, 0); 
        fumaroleGroup.add(smoke);
    }
    group.add(fumaroleGroup);
    parts.push({
        name: "Fumarole",
        description: "An opening in or near a volcano, through which hot sulfurous gases emerge.",
        mesh: fumaroleGroup
    });

    let time = 0;

    return {
        group: group,
        parts: parts,
        update: function(delta) {
            time += delta;
            
            const scale = 1 + Math.sin(time * 2) * 0.05;
            magmaChamber.scale.set(scale, scale, scale);

            lavaMat.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.5;
            magmaMat.emissiveIntensity = 0.7 + Math.sin(time * 3) * 0.3;

            ashCloud.children.forEach((child, index) => {
                child.position.y += Math.sin(time * 2 + index) * 0.01;
                child.rotation.x += 0.01;
                child.rotation.y += 0.02;
            });

            fumaroleGroup.children.forEach((child, index) => {
                if(index > 0) { 
                    child.position.x += delta * 0.5;
                    child.position.y += delta * 1.5;
                    child.scale.set(
                        1 + (child.position.y - 5) * 0.2,
                        1 + (child.position.y - 5) * 0.2,
                        1 + (child.position.y - 5) * 0.2
                    );
                    if (child.position.y > 9) {
                        child.position.set(5.75, 5, 0);
                        child.scale.set(1, 1, 1);
                    }
                }
            });
        },
        quizzes: [
            {
                question: "What is the primary characteristic of a stratovolcano's structure?",
                options: ["Broad and flat", "Made entirely of ash", "Built up by many layers of hardened lava and tephra", "Consists only of a magma chamber"],
                answer: 2
            },
            {
                question: "What forms the Ash Cloud during a volcanic eruption?",
                options: ["Evaporated seawater", "Fine fragments of pulverized rock, minerals, and volcanic glass", "Burning trees and vegetation", "Pure carbon dioxide"],
                answer: 1
            },
            {
                question: "What is a Sill in the context of volcanic anatomy?",
                options: ["A vertical intrusion of magma", "The main eruptive vent", "A horizontal intrusion of magma between older rock layers", "A type of volcanic rock"],
                answer: 2
            },
            {
                question: "How does a Dike differ from a Sill?",
                options: ["Dikes are horizontal, sills are vertical", "Dikes cut vertically or steeply across rock layers, sills are horizontal", "Dikes only contain water, sills contain magma", "There is no difference"],
                answer: 1
            },
            {
                question: "What function does a Fumarole serve?",
                options: ["It emits hot gases and steam", "It erupts large quantities of lava", "It stores magma underground", "It prevents volcanic eruptions"],
                answer: 0
            },
            {
                question: "Where is the Magma Chamber typically located?",
                options: ["In the ash cloud", "At the very top of the crater", "On the flanks of the volcano", "Beneath the surface of the Earth, under the volcano"],
                answer: 3
            }
        ]
    };
}
