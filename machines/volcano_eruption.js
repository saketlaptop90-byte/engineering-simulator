export function createVolcanoEruption(THREE) {
    const group = new THREE.Group();
    
    const parts = [
        { name: "Magma Chamber", description: "A large underground pool of liquid rock found beneath the surface." },
        { name: "Main Vent", description: "The central tube through which magma travels to the surface." },
        { name: "Crater", description: "A bowl-shaped depression at the top of the volcano." },
        { name: "Ash Cloud", description: "A cloud of ash and tephra released into the atmosphere during an eruption." },
        { name: "Lava Flow", description: "Streams of molten rock that pour or ooze from an erupting vent." },
        { name: "Magma", description: "Molten rock beneath the Earth's surface." },
        { name: "Secondary Vent", description: "Smaller outlets that branch off the main vent." },
        { name: "Parasitic Cone", description: "A smaller cone on the side of a volcano formed by eruptions from a secondary vent." },
        { name: "Bedrock", description: "The solid rock underlying loose deposits such as soil or alluvium." },
        { name: "Ash Fall", description: "Volcanic ash that has fallen through the air from an eruption cloud." }
    ];

    // 1. Bedrock
    const bedrockGeo = new THREE.CylinderGeometry(10, 10, 2, 32);
    const bedrockMat = new THREE.MeshStandardMaterial({ color: 0x4a4a4a });
    const bedrock = new THREE.Mesh(bedrockGeo, bedrockMat);
    bedrock.position.y = -1;
    group.add(bedrock);

    // 2. Magma Chamber
    const chamberGeo = new THREE.SphereGeometry(3, 32, 32);
    const chamberMat = new THREE.MeshStandardMaterial({ color: 0xff3300, emissive: 0x881100 });
    const magmaChamber = new THREE.Mesh(chamberGeo, chamberMat);
    magmaChamber.position.y = -2;
    group.add(magmaChamber);

    // 3. Main Vent
    const ventGeo = new THREE.CylinderGeometry(0.5, 1.5, 6, 16);
    const ventMat = new THREE.MeshStandardMaterial({ color: 0xff3300 });
    const mainVent = new THREE.Mesh(ventGeo, ventMat);
    mainVent.position.y = 2;
    group.add(mainVent);

    // 4. Magma (rising)
    const magmaGeo = new THREE.CylinderGeometry(0.4, 1.2, 5, 16);
    const magmaMat = new THREE.MeshStandardMaterial({ color: 0xffdd00, emissive: 0xff5500 });
    const magma = new THREE.Mesh(magmaGeo, magmaMat);
    magma.position.y = 1.5;
    group.add(magma);

    // 5. Secondary Vent
    const secVentGeo = new THREE.CylinderGeometry(0.3, 0.5, 4, 16);
    const secVentMat = new THREE.MeshStandardMaterial({ color: 0x5a3a3a });
    const secVent = new THREE.Mesh(secVentGeo, secVentMat);
    secVent.position.set(2, 2, 0);
    secVent.rotation.z = -Math.PI / 4;
    group.add(secVent);

    // 6. Parasitic Cone
    const coneGeo = new THREE.ConeGeometry(2, 3, 32);
    const coneMat = new THREE.MeshStandardMaterial({ color: 0x6a4a3a });
    const parasiticCone = new THREE.Mesh(coneGeo, coneMat);
    parasiticCone.position.set(3, 1.5, 0);
    group.add(parasiticCone);

    // 7. Crater
    const craterGeo = new THREE.TorusGeometry(1.5, 0.5, 16, 32);
    const craterMat = new THREE.MeshStandardMaterial({ color: 0x3a2a2a });
    const crater = new THREE.Mesh(craterGeo, craterMat);
    crater.position.y = 5;
    crater.rotation.x = Math.PI / 2;
    group.add(crater);

    // Volcano body (Visual representation, not counted in 10 parts array directly but part of structure)
    const bodyGeo = new THREE.ConeGeometry(8, 6, 32);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x554433, transparent: true, opacity: 0.8 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 2;
    group.add(body);

    // 8. Ash Cloud
    const cloudGeo = new THREE.SphereGeometry(2, 16, 16);
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0x888888, transparent: true, opacity: 0.6 });
    const ashCloud = new THREE.Mesh(cloudGeo, cloudMat);
    ashCloud.position.y = 7;
    group.add(ashCloud);

    // 9. Lava Flow
    const flowGeo = new THREE.PlaneGeometry(1.5, 8);
    const flowMat = new THREE.MeshStandardMaterial({ color: 0xff4400, side: THREE.DoubleSide, emissive: 0xaa2200 });
    const lavaFlow = new THREE.Mesh(flowGeo, flowMat);
    lavaFlow.position.set(-2.5, 2, 0);
    lavaFlow.rotation.z = Math.PI / 4;
    lavaFlow.rotation.y = Math.PI / 2;
    group.add(lavaFlow);

    // 10. Ash Fall
    const ashFallGeo = new THREE.CylinderGeometry(3, 6, 4, 32, 1, true);
    const ashFallMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const ashFall = new THREE.Mesh(ashFallGeo, ashFallMat);
    ashFall.position.y = 6;
    group.add(ashFall);

    let time = 0;
    function update(delta) {
        time += delta;
        
        // Animate Magma rising
        magma.position.y = 1.5 + Math.sin(time * 2) * 0.5;
        magma.material.emissiveIntensity = 0.5 + Math.sin(time * 5) * 0.5;
        
        // Animate Ash Cloud expanding and rising
        const scale = 1 + Math.sin(time) * 0.3;
        ashCloud.scale.set(scale, scale, scale);
        ashCloud.position.y = 7 + (time % 3);
        ashCloud.material.opacity = 0.8 - (time % 3) * 0.2;
        
        // Animate Lava Flow
        lavaFlow.material.emissiveIntensity = 0.5 + Math.sin(time * 3) * 0.5;
        
        // Animate Ash Fall
        ashFall.rotation.y += delta * 0.5;
    }

    const questions = [
        {
            question: "What is a magma chamber?",
            options: ["A pool of liquid rock beneath the surface", "The top opening of a volcano", "A cloud of volcanic ash", "Dried lava on the surface"],
            correctAnswer: 0
        },
        {
            question: "Through which part does magma predominantly travel to the surface?",
            options: ["Crater", "Main Vent", "Parasitic Cone", "Bedrock"],
            correctAnswer: 1
        },
        {
            question: "What forms on the side of a volcano from a secondary vent?",
            options: ["Magma Chamber", "Lava Flow", "Parasitic Cone", "Ash Cloud"],
            correctAnswer: 2
        },
        {
            question: "What is the bowl-shaped depression at the top called?",
            options: ["Magma Chamber", "Crater", "Secondary Vent", "Bedrock"],
            correctAnswer: 1
        },
        {
            question: "What distinguishes magma from lava?",
            options: ["Its color", "Its temperature", "Magma is below surface, lava is above", "There is no difference"],
            correctAnswer: 2
        },
        {
            question: "What is an ash cloud composed of?",
            options: ["Water vapor only", "Liquid magma", "Ash and tephra", "Solidified bedrock"],
            correctAnswer: 2
        }
    ];

    return { group, parts, update, questions };
}
