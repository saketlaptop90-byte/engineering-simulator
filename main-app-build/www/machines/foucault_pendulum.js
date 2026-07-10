export function createFoucaultPendulum(THREE) {
    const group = new THREE.Group();

    // 1. Ceiling (support structure top)
    const p1 = new THREE.Mesh(
        new THREE.CylinderGeometry(6, 6, 0.4, 64), 
        new THREE.MeshStandardMaterial({color: 0xcccccc, roughness: 0.7})
    );
    p1.position.set(0, 20, 0);

    // 2. Floor dial (base)
    const p2 = new THREE.Mesh(
        new THREE.CylinderGeometry(7, 7, 0.4, 64), 
        new THREE.MeshStandardMaterial({color: 0xe0e0e0, roughness: 0.8})
    );
    p2.position.set(0, 0, 0);

    // 3. Pivot joint
    const p3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32), 
        new THREE.MeshStandardMaterial({color: 0x444444, metalness: 0.7, roughness: 0.3})
    );
    p3.position.set(0, 19.5, 0);

    // 4. Cable
    const cableGeom = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    cableGeom.translate(0, -0.5, 0);
    const p4 = new THREE.Mesh(
        cableGeom, 
        new THREE.MeshStandardMaterial({color: 0x999999, metalness: 0.9, roughness: 0.1})
    );
    p4.position.set(0, 19.5, 0);
    p4.scale.set(1, 17.0, 1);

    // 5. Massive Bob
    const p5 = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 64, 64), 
        new THREE.MeshStandardMaterial({color: 0xb87333, metalness: 0.8, roughness: 0.2})
    );

    // 6. Pointer
    const p6 = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 1.0, 32), 
        new THREE.MeshStandardMaterial({color: 0xffd700, metalness: 0.8, roughness: 0.2})
    );
    p6.rotation.x = Math.PI; // point downwards

    // 7. Pegs (Knocked-over objects)
    const p7 = new THREE.Group();
    const numPegs = 36;
    const pegRadius = 4.15;
    const pegGeom = new THREE.BoxGeometry(0.15, 0.8, 0.15);
    pegGeom.translate(0, 0.4, 0); // Pivot at bottom
    const pegMat = new THREE.MeshStandardMaterial({color: 0xdd2222, metalness: 0.1, roughness: 0.8});
    for(let i=0; i<numPegs; i++) {
        const angle = (i / numPegs) * Math.PI * 2;
        const peg = new THREE.Mesh(pegGeom, pegMat);
        peg.position.set(Math.cos(angle) * pegRadius, 0.2, Math.sin(angle) * pegRadius);
        peg.lookAt(0, 0.2, 0);
        peg.userData = { angle: angle, knocked: false };
        p7.add(peg);
    }

    // 8. Support Legs
    const p8 = new THREE.Group();
    const pillarGeom = new THREE.CylinderGeometry(0.3, 0.3, 20, 16);
    const pillarMat = new THREE.MeshStandardMaterial({color: 0x555555, metalness: 0.5, roughness: 0.5});
    const positions = [
        [5, 10, 5],
        [-5, 10, 5],
        [5, 10, -5],
        [-5, 10, -5]
    ];
    positions.forEach(pos => {
        const pillar = new THREE.Mesh(pillarGeom, pillarMat);
        pillar.position.set(pos[0], pos[1], pos[2]);
        p8.add(pillar);
    });

    // 9. Outer Decorative Ring
    const p9 = new THREE.Mesh(
        new THREE.TorusGeometry(6.5, 0.3, 16, 64), 
        new THREE.MeshStandardMaterial({color: 0x8b4513, metalness: 0.3, roughness: 0.6})
    );
    p9.position.set(0, 0.2, 0);
    p9.rotation.x = Math.PI / 2;

    // 10. Center Marker
    const p10 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.05, 32), 
        new THREE.MeshStandardMaterial({color: 0x222222})
    );
    p10.position.set(0, 0.22, 0);

    group.add(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

    // Kinematics and Animation
    let swingTime = 0;
    let precessionTime = 0;
    const cableLength = 17.0;
    const swingFreq = Math.sqrt(9.81 / cableLength); 
    const swingAmplitude = 0.25; // radians
    const precessionRate = 0.05; // rad/s
    const pivotY = 19.5;

    group.userData.update = function(delta, time) {
        const dt = Math.min(delta, 0.1); // prevent huge jumps
        swingTime += dt;
        precessionTime += dt * precessionRate;
        
        const theta = swingAmplitude * Math.cos(swingFreq * swingTime);
        const phi = precessionTime;
        
        const bobX = -cableLength * Math.sin(theta) * Math.cos(phi);
        const bobZ = cableLength * Math.sin(theta) * Math.sin(phi);
        const bobY = pivotY - cableLength * Math.cos(theta);
        
        p5.position.set(bobX, bobY, bobZ);
        p6.position.set(bobX, bobY - 1.2 - 0.5, bobZ); 
        
        const down = new THREE.Vector3(0, -1, 0);
        const dir = new THREE.Vector3(bobX, bobY - pivotY, bobZ).normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(down, dir);
        p4.setRotationFromQuaternion(quat);
        
        const pointerTip = new THREE.Vector3(bobX, bobY - 2.2, bobZ);
        
        p7.children.forEach(peg => {
            if (!peg.userData.knocked) {
                const dx = pointerTip.x - peg.position.x;
                const dz = pointerTip.z - peg.position.z;
                const dist2D = Math.sqrt(dx * dx + dz * dz);
                if (dist2D < 0.4) {
                    peg.userData.knocked = true;
                }
            }
            if (peg.userData.knocked) {
                peg.rotation.x = THREE.MathUtils.lerp(peg.rotation.x, -Math.PI / 2, dt * 5.0);
            }
        });
    };

    group.userData.quiz = [
        {
            question: "What primary scientific principle does a Foucault pendulum demonstrate?",
            options: ["Earth's magnetic field", "Conservation of momentum", "Earth's rotation on its axis", "The curvature of spacetime"],
            correct: 2
        },
        {
            question: "In the Northern Hemisphere, what direction does the pendulum's plane of oscillation appear to rotate?",
            options: ["Clockwise", "Counter-clockwise", "It doesn't rotate", "Alternates daily"],
            correct: 0
        },
        {
            question: "How long does it take for a Foucault pendulum to complete one full rotation at the North Pole?",
            options: ["12 hours", "24 hours (1 sidereal day)", "365 days", "Depends on the cable length"],
            correct: 1
        },
        {
            question: "At what location on Earth would the Foucault pendulum's plane of oscillation not precess at all?",
            options: ["The North Pole", "The South Pole", "The Equator", "45 degrees latitude"],
            correct: 2
        },
        {
            question: "What parameters determine the period (time for one swing) of a Foucault pendulum?",
            options: ["Mass of the bob and length of the cable", "Length of the cable and acceleration due to gravity", "Earth's rotation speed", "Initial push force"],
            correct: 1
        },
        {
            question: "Why is a very heavy bob and long cable typically used in Foucault pendulums?",
            options: ["To maximize air resistance", "To demonstrate heavier gravity", "To increase momentum and minimize the dampening effect of air resistance", "To prevent the cable from snapping"],
            correct: 2
        }
    ];

    return group;
}
