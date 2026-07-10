export function createGiantSquidAnatomy(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Colors
    const mantleColor = 0x8b0000; // dark red
    const finColor = 0x660000;
    const funnelColor = 0xa52a2a;
    const armColor = 0xb22222;
    const tentacleColor = 0xdc143c;
    const beakColor = 0x111111;
    const eyeColor = 0x000000;
    const gillColor = 0xffa07a;
    const inkSacColor = 0x222222;
    const heartColor = 0xff0000;

    // 1. Mantle
    const mantleGeo = new THREE.CylinderGeometry(1, 2, 8, 32);
    const mantleMat = new THREE.MeshStandardMaterial({ color: mantleColor, transparent: true, opacity: 0.7 });
    const mantle = new THREE.Mesh(mantleGeo, mantleMat);
    mantle.rotation.x = Math.PI / 2;
    mantle.position.set(0, 0, 4);
    group.add(mantle);
    parts.push({
        mesh: mantle,
        name: "Mantle",
        description: "The highly muscular body tube of the squid, containing its major internal organs."
    });

    // 2. Fins
    const finGeo = new THREE.ConeGeometry(3, 4, 3);
    const finMat = new THREE.MeshStandardMaterial({ color: finColor });
    const fin1 = new THREE.Mesh(finGeo, finMat);
    fin1.rotation.z = Math.PI / 2;
    fin1.position.set(-2.5, 0, 7);
    const fin2 = new THREE.Mesh(finGeo, finMat);
    fin2.rotation.z = -Math.PI / 2;
    fin2.position.set(2.5, 0, 7);
    group.add(fin1);
    group.add(fin2);
    parts.push({
        mesh: fin1,
        name: "Fins",
        description: "Flap-like structures at the top of the mantle used for steering and slow swimming."
    });

    // 3. Funnel/Siphon
    const funnelGeo = new THREE.CylinderGeometry(0.3, 0.6, 2, 16);
    const funnelMat = new THREE.MeshStandardMaterial({ color: funnelColor });
    const funnel = new THREE.Mesh(funnelGeo, funnelMat);
    funnel.rotation.x = Math.PI / 2;
    funnel.position.set(0, -1.8, 0.5);
    group.add(funnel);
    parts.push({
        mesh: funnel,
        name: "Funnel/Siphon",
        description: "A muscular tube used to jet water out for rapid locomotion."
    });

    // 4. Arms
    const armGroup = new THREE.Group();
    const armGeo = new THREE.CylinderGeometry(0.2, 0.4, 5, 16);
    const armMat = new THREE.MeshStandardMaterial({ color: armColor });
    for (let i = 0; i < 8; i++) {
        const arm = new THREE.Mesh(armGeo, armMat);
        const angle = (i / 8) * Math.PI * 2;
        arm.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, -2.5);
        arm.rotation.x = Math.PI / 2;
        arm.rotation.z = angle;
        arm.userData = { offset: i };
        armGroup.add(arm);
    }
    group.add(armGroup);
    parts.push({
        mesh: armGroup.children[0], // using first arm as the interactive part
        name: "Arms",
        description: "Eight thick appendages equipped with suckers used to hold prey."
    });

    // 5. Feeding Tentacles
    const tentacleGroup = new THREE.Group();
    const tentacleGeo = new THREE.CylinderGeometry(0.15, 0.3, 12, 16);
    const tentacleMat = new THREE.MeshStandardMaterial({ color: tentacleColor });
    
    const tentacle1 = new THREE.Mesh(tentacleGeo, tentacleMat);
    tentacle1.rotation.x = Math.PI / 2;
    tentacle1.position.set(1.5, 0, -6);
    tentacle1.userData = { isTentacle: true, phaseOffset: 0 };
    tentacleGroup.add(tentacle1);

    const tentacle2 = new THREE.Mesh(tentacleGeo, tentacleMat);
    tentacle2.rotation.x = Math.PI / 2;
    tentacle2.position.set(-1.5, 0, -6);
    tentacle2.userData = { isTentacle: true, phaseOffset: Math.PI };
    tentacleGroup.add(tentacle2);
    
    group.add(tentacleGroup);
    parts.push({
        mesh: tentacle1,
        name: "Feeding Tentacles",
        description: "Two elongated tentacles with clubs at the ends used to snatch prey from a distance."
    });

    // 6. Beak
    const beakGeo = new THREE.ConeGeometry(0.5, 1, 16);
    const beakMat = new THREE.MeshStandardMaterial({ color: beakColor });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.rotation.x = -Math.PI / 2;
    beak.position.set(0, 0, -0.5);
    group.add(beak);
    parts.push({
        mesh: beak,
        name: "Beak",
        description: "A hard, parrot-like beak situated in the center of the arms, used for tearing food."
    });

    // 7. Eye
    const eyeGroup = new THREE.Group();
    const eyeGeo = new THREE.SphereGeometry(0.8, 32, 32);
    const eyeMat = new THREE.MeshStandardMaterial({ color: eyeColor });
    const eye1 = new THREE.Mesh(eyeGeo, eyeMat);
    eye1.position.set(1.8, 0, 0.5);
    const eye2 = new THREE.Mesh(eyeGeo, eyeMat);
    eye2.position.set(-1.8, 0, 0.5);
    eyeGroup.add(eye1);
    eyeGroup.add(eye2);
    group.add(eyeGroup);
    parts.push({
        mesh: eye1,
        name: "Eye",
        description: "Enormous eyes, among the largest in the animal kingdom, adapted for seeing in the deep dark ocean."
    });

    // 8. Gills
    const gillGeo = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const gillMat = new THREE.MeshStandardMaterial({ color: gillColor });
    const gill1 = new THREE.Mesh(gillGeo, gillMat);
    gill1.rotation.x = Math.PI / 2;
    gill1.position.set(1, 0, 4);
    const gill2 = new THREE.Mesh(gillGeo, gillMat);
    gill2.rotation.x = Math.PI / 2;
    gill2.position.set(-1, 0, 4);
    group.add(gill1);
    group.add(gill2);
    parts.push({
        mesh: gill1,
        name: "Gills",
        description: "Feathery organs that extract oxygen from the water as it is pumped through the mantle cavity."
    });

    // 9. Ink Sac
    const inkGeo = new THREE.CapsuleGeometry(0.4, 1.5, 16, 16);
    const inkMat = new THREE.MeshStandardMaterial({ color: inkSacColor });
    const inkSac = new THREE.Mesh(inkGeo, inkMat);
    inkSac.rotation.x = Math.PI / 2;
    inkSac.position.set(0, -0.8, 3);
    group.add(inkSac);
    parts.push({
        mesh: inkSac,
        name: "Ink Sac",
        description: "An organ that produces and stores dark ink, which can be squirted out to confuse predators."
    });

    // 10. Hearts
    const heartGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const heartMat = new THREE.MeshStandardMaterial({ color: heartColor });
    const systemicHeart = new THREE.Mesh(heartGeo, heartMat);
    systemicHeart.position.set(0, 0.5, 5);
    const branchialHeart1 = new THREE.Mesh(heartGeo, heartMat);
    branchialHeart1.position.set(1.2, 0, 4.5);
    const branchialHeart2 = new THREE.Mesh(heartGeo, heartMat);
    branchialHeart2.position.set(-1.2, 0, 4.5);
    group.add(systemicHeart);
    group.add(branchialHeart1);
    group.add(branchialHeart2);
    parts.push({
        mesh: systemicHeart,
        name: "Hearts",
        description: "Squids have three hearts: one systemic heart that pumps blood to the body, and two branchial hearts that pump blood to the gills."
    });

    // Animation
    let time = 0;
    function animate() {
        time += 0.05;

        // Animate arms
        armGroup.children.forEach((arm, i) => {
            arm.rotation.x = Math.PI / 2 + Math.sin(time + i) * 0.1;
            arm.rotation.y = Math.cos(time + i) * 0.1;
        });

        // Animate tentacles
        tentacleGroup.children.forEach((tentacle) => {
            const phase = tentacle.userData.phaseOffset;
            tentacle.position.z = -6 + Math.sin(time + phase) * 1.5;
        });

        // Animate funnel (pulsing slightly)
        const pulse = 1 + Math.sin(time * 2) * 0.1;
        funnel.scale.set(pulse, pulse, pulse);
    }

    const questions = [
        {
            question: "How many hearts does a giant squid have?",
            options: ["One", "Two", "Three", "Four"],
            correctAnswer: 2,
            explanation: "Squids have three hearts: one systemic heart for the body and two branchial hearts for the gills."
        },
        {
            question: "What is the primary function of the siphon (funnel)?",
            options: ["Breathing", "Eating", "Jet propulsion", "Ink production"],
            correctAnswer: 2,
            explanation: "The siphon jets out water from the mantle cavity to propel the squid rapidly through the water."
        },
        {
            question: "How many feeding tentacles does a giant squid have?",
            options: ["Two", "Four", "Eight", "Ten"],
            correctAnswer: 0,
            explanation: "Giant squids have exactly two elongated feeding tentacles used to snatch prey."
        },
        {
            question: "Where is the beak of the giant squid located?",
            options: ["At the end of the mantle", "Inside the stomach", "In the center of the arms", "On the fins"],
            correctAnswer: 2,
            explanation: "The sharp beak is located in the very center of the squid's arms and tentacles."
        },
        {
            question: "What does the ink sac do?",
            options: ["Aids in digestion", "Produces dark fluid to confuse predators", "Pumps blood", "Helps in buoyancy"],
            correctAnswer: 1,
            explanation: "The ink sac stores dark ink that is expelled to create a cloud, confusing predators and allowing escape."
        },
        {
            question: "What is the function of the giant squid's enormous eyes?",
            options: ["To see in the dark depths of the ocean", "To communicate with other squids", "To attract mates", "To detect water pressure"],
            correctAnswer: 0,
            explanation: "Their massive eyes, some of the largest in the animal kingdom, help them capture faint light in the deep ocean to spot predators like sperm whales."
        }
    ];

    return {
        model: group,
        parts: parts,
        animate: animate,
        questions: questions
    };
}
