export function createSolarSailProbe(THREE) {
    const group = new THREE.Group();

    // Materials
    const busMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.8, roughness: 0.2 });
    const sailMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.05,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
    });
    const boomMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.4 });
    const copperMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.7, roughness: 0.3 });
    const glassMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });

    // 1. Central Payload Bus
    const payloadBus = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1.2), busMaterial);
    group.add(payloadBus);

    // 2. Battery/Power Unit
    const batteryUnit = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16), copperMaterial);
    batteryUnit.position.set(0, 0, -0.85);
    batteryUnit.rotation.x = Math.PI / 2;
    payloadBus.add(batteryUnit);

    // 3. Deployment Spool
    const deploymentSpool = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.1, 16), busMaterial);
    deploymentSpool.rotation.x = Math.PI / 2;
    deploymentSpool.position.set(0, 0, 0.7);
    payloadBus.add(deploymentSpool);

    // 4. Reaction Wheels (4 small cylinders)
    const reactionWheels = new THREE.Group();
    const rwGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
    for(let i=0; i<3; i++) {
        const wheel = new THREE.Mesh(rwGeom, copperMaterial);
        wheel.position.set(i===0? 0.3 : (i===1? -0.3 : 0), i===2? 0.3 : 0, -0.2);
        wheel.rotation.set(i===0? Math.PI/2 : 0, i===1? Math.PI/2 : 0, i===2? Math.PI/2 : 0);
        reactionWheels.add(wheel);
    }
    payloadBus.add(reactionWheels);

    // 5. Communications Laser
    const commLaser = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.6), busMaterial);
    commLaser.position.set(0, 0.6, 0);
    payloadBus.add(commLaser);

    // 6. Optical Sensors
    const opticalSensors = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), glassMaterial);
    opticalSensors.position.set(0.6, 0, 0);
    payloadBus.add(opticalSensors);

    // 7. Thermal Louvers
    const thermalLouvers = new THREE.Group();
    const louverGeom = new THREE.BoxGeometry(0.8, 0.05, 0.02);
    for(let i=-4; i<=4; i++) {
        const louver = new THREE.Mesh(louverGeom, busMaterial);
        louver.position.set(0, i*0.1, 0.61);
        louver.rotation.x = Math.PI/4;
        thermalLouvers.add(louver);
    }
    payloadBus.add(thermalLouvers);

    // 8. Support Booms (4 booms crossing in an X shape)
    const boomsMesh = new THREE.Group();
    const boomGeom = new THREE.CylinderGeometry(0.02, 0.02, 28, 8);
    const boom1 = new THREE.Mesh(boomGeom, boomMaterial);
    boom1.rotation.z = Math.PI / 4;
    const boom2 = new THREE.Mesh(boomGeom, boomMaterial);
    boom2.rotation.z = -Math.PI / 4;
    boomsMesh.add(boom1);
    boomsMesh.add(boom2);
    payloadBus.add(boomsMesh);

    // 9. Reflective Sail Quadrants
    // 4 separate planes to form a large 20x20 square sail
    const sailMesh = new THREE.Group();
    const sailGeom = new THREE.PlaneGeometry(10, 10, 20, 20); // High segment count for flexing
    const offsets = [
        [5, 5], [-5, 5], [-5, -5], [5, -5]
    ];
    offsets.forEach(pos => {
        const quad = new THREE.Mesh(sailGeom, sailMaterial);
        quad.position.set(pos[0], pos[1], 0);
        sailMesh.add(quad);
    });
    payloadBus.add(sailMesh);

    // 10. Attitude Control Vanes (at the tips of the 4 booms)
    const controlVanes = new THREE.Group();
    const vaneGeom = new THREE.PlaneGeometry(1.5, 1.5);
    const vanePos = [
        [9.9, 9.9], [-9.9, 9.9], [-9.9, -9.9], [9.9, -9.9]
    ];
    vanePos.forEach((pos, idx) => {
        const vane = new THREE.Mesh(vaneGeom, busMaterial);
        vane.position.set(pos[0], pos[1], 0.05);
        // Align vane with the respective boom angle
        vane.rotation.z = Math.PI/4 * (1 + idx*2);
        controlVanes.add(vane);
    });
    payloadBus.add(controlVanes);

    // Initial State for Deployment Animation
    boomsMesh.scale.set(0.001, 0.001, 0.001);
    sailMesh.scale.set(0.001, 0.001, 0.001);
    controlVanes.scale.set(0.001, 0.001, 0.001);

    // Add exactly 10 distinct parts into the expected structure
    const parts = [
        { name: "Central Payload Bus", object: payloadBus },
        { name: "Battery/Power Unit", object: batteryUnit },
        { name: "Deployment Spool", object: deploymentSpool },
        { name: "Reaction Wheels", object: reactionWheels },
        { name: "Communications Laser", object: commLaser },
        { name: "Optical Sensors", object: opticalSensors },
        { name: "Thermal Louvers", object: thermalLouvers },
        { name: "Support Booms", object: boomsMesh },
        { name: "Reflective Sail Quadrants", object: sailMesh },
        { name: "Attitude Control Vanes", object: controlVanes }
    ];

    // Quiz Questions (exactly 6)
    const quiz = [
        {
            question: "How does a solar sail generate thrust?",
            options: ["Solar wind catching the sail", "Photon momentum transfer", "Ejecting ionized gas", "Magnetic field repulsion"],
            answer: "Photon momentum transfer"
        },
        {
            question: "What is the primary purpose of the attitude control vanes?",
            options: ["To gather solar energy", "To adjust the center of pressure for steering", "To cool the spacecraft", "To communicate with Earth"],
            answer: "To adjust the center of pressure for steering"
        },
        {
            question: "Why are the sails made of highly reflective material rather than black absorbent material?",
            options: ["To prevent melting", "Reflection transfers roughly twice the momentum compared to absorption", "To remain invisible", "To reflect communications lasers"],
            answer: "Reflection transfers roughly twice the momentum compared to absorption"
        },
        {
            question: "What role do the support booms play in a deployed solar sail?",
            options: ["Provide structural tension to keep the thin sail material flat", "Generate electricity", "Store propellant", "House the main computers"],
            answer: "Provide structural tension to keep the thin sail material flat"
        },
        {
            question: "How does the photon pressure acting on the sail change with distance from the Sun?",
            options: ["It decreases linearly", "It increases exponentially", "It decreases with the square of the distance", "It remains constant"],
            answer: "It decreases with the square of the distance"
        },
        {
            question: "Why might a solar sail probe spin during deployment?",
            options: ["To confuse sensors", "Spin stabilization provides centrifugal force to help unfurl and maintain sail shape", "To simulate gravity for the crew", "To generate a magnetic shield"],
            answer: "Spin stabilization provides centrifugal force to help unfurl and maintain sail shape"
        }
    ];

    let deploymentProgress = 0;
    const deployDuration = 5.0; // Seconds until fully deployed

    // Store original vertices for the sail quadrants to compute dynamic flex accurately without drift
    const originalVertices = [];
    sailMesh.children.forEach(quad => {
        const posAttr = quad.geometry.attributes.position;
        const orig = new Float32Array(posAttr.array);
        originalVertices.push(orig);
    });

    const update = (delta, time) => {
        // Kinematic Animation: Unfurling Deployment Sequence
        if (deploymentProgress < 1.0) {
            deploymentProgress += delta / deployDuration;
            if (deploymentProgress > 1.0) deploymentProgress = 1.0;

            // Ease-out cubic formula for smooth snapping at the end of deployment
            const easeOut = 1 - Math.pow(1 - deploymentProgress, 3);
            const scaleVal = Math.max(0.001, easeOut);
            
            boomsMesh.scale.set(scaleVal, scaleVal, scaleVal);
            sailMesh.scale.set(scaleVal, scaleVal, scaleVal);
            controlVanes.scale.set(scaleVal, scaleVal, scaleVal);
            
            // Spool spins rapidly as sail unwinds
            deploymentSpool.rotation.y -= delta * 20 * (1 - deploymentProgress);
        } else {
            // Post-deployment dynamic response: flexing to photon pressure
            sailMesh.children.forEach((quad, index) => {
                const posAttr = quad.geometry.attributes.position;
                const orig = originalVertices[index];
                
                for(let i=0; i<posAttr.count; i++) {
                    const vx = orig[i*3];
                    const vy = orig[i*3 + 1];
                    
                    // Absolute spatial position relative to sail center
                    const absX = vx + quad.position.x;
                    const absY = vy + quad.position.y;
                    const dist = Math.sqrt(absX*absX + absY*absY);
                    
                    // Flex amplitude is modeled as a parabolic bow (constant pressure)
                    // plus a subtle flutter ripple over time.
                    const bow = -0.005 * dist * dist;
                    const flutter = 0.05 * Math.sin(time * 3 + dist * 0.8) * (dist / 14);
                    
                    posAttr.setZ(i, orig[i*3 + 2] + bow + flutter);
                }
                posAttr.needsUpdate = true;
            });

            // Control vanes actively adjust their pitch continuously for attitude control
            controlVanes.children.forEach((vane, i) => {
                vane.rotation.x = Math.sin(time * 0.5 + i) * 0.3;
                vane.rotation.y = Math.cos(time * 0.3 + i) * 0.2;
            });
        }

        // Entire payload bus slowly spin-stabilizes over its Z-axis
        payloadBus.rotation.z += delta * 0.15;

        // Internal reaction wheels spinning rapidly to control gyroscopic stability
        reactionWheels.children.forEach((wheel, i) => {
            wheel.rotation.y += delta * (8 + i * 2);
        });
    };

    return {
        model: group,
        update: update,
        parts: parts,
        quiz: quiz
    };
}
