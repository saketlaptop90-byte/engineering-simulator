export function createKidney(THREE) {
    const group = new THREE.Group();

    // Materials
    const arteryMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const veinMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
    const ureterMat = new THREE.MeshStandardMaterial({ color: 0xffffaa });
    const cortexMat = new THREE.MeshStandardMaterial({ color: 0x8b4513, transparent: true, opacity: 0.8 });
    const medullaMat = new THREE.MeshStandardMaterial({ color: 0xa0522d });
    const pelvisMat = new THREE.MeshStandardMaterial({ color: 0xffe4b5 });
    const calycesMat = new THREE.MeshStandardMaterial({ color: 0xd2b48c });
    const nephronMat = new THREE.MeshStandardMaterial({ color: 0xcd853f });
    const glomerulusMat = new THREE.MeshStandardMaterial({ color: 0xb22222 });
    const bowmanMat = new THREE.MeshStandardMaterial({ color: 0xfffacd, transparent: true, opacity: 0.6 });

    // 1. Renal Artery
    const arteryGeom = new THREE.CylinderGeometry(0.5, 0.5, 4, 16);
    const artery = new THREE.Mesh(arteryGeom, arteryMat);
    artery.position.set(-2, 2, 0);
    artery.rotation.z = Math.PI / 4;
    group.add(artery);

    // 2. Renal Vein
    const veinGeom = new THREE.CylinderGeometry(0.6, 0.6, 4, 16);
    const vein = new THREE.Mesh(veinGeom, veinMat);
    vein.position.set(-2, 1, 0.5);
    vein.rotation.z = Math.PI / 4;
    group.add(vein);

    // 3. Ureter
    const ureterGeom = new THREE.CylinderGeometry(0.4, 0.4, 8, 16, 32); // more segments for peristalsis
    const ureter = new THREE.Mesh(ureterGeom, ureterMat);
    ureter.position.set(-2, -4, 0);
    group.add(ureter);

    // 4. Cortex (Outer layer)
    const cortexGeom = new THREE.CapsuleGeometry(3, 4, 16, 32);
    const cortex = new THREE.Mesh(cortexGeom, cortexMat);
    group.add(cortex);

    // 5. Medulla (Inner pyramids)
    const medullaGeom = new THREE.ConeGeometry(1, 2, 4);
    const medulla = new THREE.Mesh(medullaGeom, medullaMat);
    medulla.position.set(1, 0, 0);
    medulla.rotation.z = -Math.PI / 2;
    group.add(medulla);

    // 6. Renal Pelvis
    const pelvisGeom = new THREE.TorusGeometry(1, 0.5, 16, 32, Math.PI);
    const pelvis = new THREE.Mesh(pelvisGeom, pelvisMat);
    pelvis.position.set(-1.5, 0, 0);
    pelvis.rotation.y = Math.PI / 2;
    group.add(pelvis);

    // 7. Calyces
    const calycesGeom = new THREE.CylinderGeometry(0.2, 0.5, 1.5, 8);
    const calyces = new THREE.Mesh(calycesGeom, calycesMat);
    calyces.position.set(-0.5, 0, 0);
    calyces.rotation.z = Math.PI / 2;
    group.add(calyces);

    // 8. Nephrons
    const nephronGeom = new THREE.TorusKnotGeometry(0.2, 0.05, 64, 8);
    const nephron = new THREE.Mesh(nephronGeom, nephronMat);
    nephron.position.set(1.5, 1, 0);
    group.add(nephron);

    // 9. Glomerulus
    const glomerulusGeom = new THREE.SphereGeometry(0.15, 16, 16);
    const glomerulus = new THREE.Mesh(glomerulusGeom, glomerulusMat);
    glomerulus.position.set(1.5, 1.5, 0);
    group.add(glomerulus);

    // 10. Bowman's Capsule
    const bowmanGeom = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI);
    const bowman = new THREE.Mesh(bowmanGeom, bowmanMat);
    bowman.position.set(1.5, 1.5, 0);
    group.add(bowman);

    // Save initial vertices of Ureter for peristalsis animation
    const ureterVertices = ureterGeom.attributes.position.array;
    const initialUreterVertices = new Float32Array(ureterVertices.length);
    for (let i = 0; i < ureterVertices.length; i++) {
        initialUreterVertices[i] = ureterVertices[i];
    }

    group.tick = (time) => {
        // Blood flow pulsing from artery to vein
        const pulse = 1 + 0.1 * Math.sin(time * 5); // 5 rad/s heart rate
        artery.scale.set(pulse, 1, pulse);
        
        const veinPulse = 1 + 0.05 * Math.sin(time * 5 - Math.PI); // Out of phase
        vein.scale.set(veinPulse, 1, veinPulse);

        // Ureter peristalsis
        const positions = ureter.geometry.attributes.position;
        for (let i = 0; i < positions.count; i++) {
            const y = initialUreterVertices[i * 3 + 1];
            // Sine wave moving down the ureter (y direction)
            const radiusScale = 1 + 0.2 * Math.sin(y * 2 - time * 3);
            
            positions.setX(i, initialUreterVertices[i * 3] * radiusScale);
            positions.setZ(i, initialUreterVertices[i * 3 + 2] * radiusScale);
        }
        positions.needsUpdate = true;
    };

    group.userData.quiz = [
        {
            question: "Which structure carries oxygenated blood into the kidney?",
            options: ["Renal Vein", "Renal Artery", "Ureter", "Calyx"],
            correctOption: 1
        },
        {
            question: "What is the functional unit of the kidney?",
            options: ["Glomerulus", "Nephron", "Medulla", "Cortex"],
            correctOption: 1
        },
        {
            question: "What process forces fluid out of the glomerulus into Bowman's capsule?",
            options: ["Active transport", "Osmosis", "Hydrostatic pressure", "Diffusion"],
            correctOption: 2
        },
        {
            question: "What structure collects urine from the renal pelvis and carries it to the bladder?",
            options: ["Urethra", "Renal Artery", "Calyces", "Ureter"],
            correctOption: 3
        },
        {
            question: "What are the cone-shaped structures in the renal medulla called?",
            options: ["Renal pyramids", "Renal columns", "Nephrons", "Glomeruli"],
            correctOption: 0
        },
        {
            question: "Which part of the kidney contains the majority of the nephrons?",
            options: ["Renal Pelvis", "Medulla", "Cortex", "Ureter"],
            correctOption: 2
        }
    ];

    return group;
}
