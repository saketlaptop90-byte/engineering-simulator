export function createSternGerlachApparatus(THREE) {
    const group = new THREE.Group();

    // 1. Oven
    const ovenGeo = new THREE.BoxGeometry(2, 2, 2);
    const ovenMat = new THREE.MeshStandardMaterial({color: 0x888888, metalness: 0.5, roughness: 0.5});
    const oven = new THREE.Mesh(ovenGeo, ovenMat);
    oven.position.set(-9, 0, 0);
    oven.name = "Oven";
    group.add(oven);

    // 2. Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.1, 0.3, 1, 16);
    const nozzleMat = new THREE.MeshStandardMaterial({color: 0xaaaaaa, metalness: 0.7, roughness: 0.3});
    const nozzle = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzle.rotation.z = -Math.PI / 2;
    nozzle.position.set(-7.5, 0, 0);
    nozzle.name = "Nozzle";
    group.add(nozzle);

    // 3. Collimator
    const colGeo = new THREE.BoxGeometry(0.2, 3, 3);
    const colMat = new THREE.MeshStandardMaterial({color: 0x444444, metalness: 0.2, roughness: 0.8});
    const collimator = new THREE.Mesh(colGeo, colMat);
    collimator.position.set(-4, 0.5, 0);
    collimator.name = "Collimator";
    group.add(collimator);

    // 4. Magnet North (Pointed pole)
    const mnGeo = new THREE.ConeGeometry(1, 1.6, 4);
    const mnMat = new THREE.MeshStandardMaterial({color: 0xcc2222, metalness: 0.3, roughness: 0.4});
    const magnetNorth = new THREE.Mesh(mnGeo, mnMat);
    magnetNorth.position.set(0, 1.0, 0);
    magnetNorth.rotation.x = Math.PI;
    magnetNorth.rotation.y = Math.PI / 4;
    magnetNorth.name = "MagnetNorth";
    group.add(magnetNorth);

    // 5. Magnet South (Flat/Grooved pole)
    const msGeo = new THREE.BoxGeometry(1.5, 1.6, 1.5);
    const msMat = new THREE.MeshStandardMaterial({color: 0x2222cc, metalness: 0.3, roughness: 0.4});
    const magnetSouth = new THREE.Mesh(msGeo, msMat);
    magnetSouth.position.set(0, -1.0, 0);
    magnetSouth.name = "MagnetSouth";
    group.add(magnetSouth);

    // 6. Coil North
    const cnGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.2, 16);
    const cnMat = new THREE.MeshStandardMaterial({color: 0xb87333, metalness: 0.6, roughness: 0.4});
    const coilNorth = new THREE.Mesh(cnGeo, cnMat);
    coilNorth.position.set(0, 1.2, 0);
    coilNorth.name = "CoilNorth";
    group.add(coilNorth);

    // 7. Coil South
    const csGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.2, 16);
    const csMat = new THREE.MeshStandardMaterial({color: 0xb87333, metalness: 0.6, roughness: 0.4});
    const coilSouth = new THREE.Mesh(csGeo, csMat);
    coilSouth.position.set(0, -1.2, 0);
    coilSouth.name = "CoilSouth";
    group.add(coilSouth);

    // 8. Screen
    const screenGeo = new THREE.BoxGeometry(0.2, 5, 5);
    const screenMat = new THREE.MeshStandardMaterial({color: 0xf0f8ff, metalness: 0.1, roughness: 0.9});
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(7, 1.0, 0);
    screen.name = "DetectorScreen";
    group.add(screen);

    // 9. Base Table
    const tableGeo = new THREE.BoxGeometry(20, 1, 6);
    const tableMat = new THREE.MeshStandardMaterial({color: 0x4a3b32, metalness: 0.1, roughness: 0.8});
    const baseTable = new THREE.Mesh(tableGeo, tableMat);
    baseTable.position.set(-1, -1.5, 0);
    baseTable.name = "BaseTable";
    group.add(baseTable);

    // 10. Atoms (InstancedMesh)
    const atomCount = 1000;
    const atomGeo = new THREE.SphereGeometry(0.06, 8, 8);
    const atomMat = new THREE.MeshBasicMaterial({color: 0xffffff});
    const atoms = new THREE.InstancedMesh(atomGeo, atomMat, atomCount);
    atoms.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    atoms.name = "SilverAtoms";
    group.add(atoms);

    // --- Kinematics state & logic ---
    const dummy = new THREE.Object3D();
    const atomsData = [];
    for (let i = 0; i < atomCount; i++) {
        atomsData.push({
            active: false,
            hit: false,
            life: 0,
            position: new THREE.Vector3(-1000, -1000, -1000),
            velocity: new THREE.Vector3(),
            spin: 1
        });
        dummy.position.set(-1000, -1000, -1000);
        dummy.updateMatrix();
        atoms.setMatrixAt(i, dummy.matrix);
    }
    atoms.instanceMatrix.needsUpdate = true;

    let spawnIndex = 0;
    let timeAccumulator = 0;

    group.userData.update = function(delta, time) {
        timeAccumulator += delta;
        const spawnRate = 80; // atoms per second
        const spawnsThisFrame = Math.floor(timeAccumulator * spawnRate);
        if (spawnsThisFrame > 0) {
            timeAccumulator -= spawnsThisFrame / spawnRate;
            for (let k = 0; k < spawnsThisFrame; k++) {
                let idx = spawnIndex % atomCount;
                let a = atomsData[idx];
                a.active = true;
                a.hit = false;
                a.life = 2.0 + Math.random(); 
                
                // Spawn with a wide spread to demonstrate collimation
                a.position.set(-7.0, (Math.random()-0.5)*0.6, (Math.random()-0.5)*0.6);
                a.velocity.set(6 + Math.random()*2, (Math.random()-0.5)*1.0, (Math.random()-0.5)*1.0);
                
                // Quantum spin (+1 or -1)
                a.spin = Math.random() < 0.5 ? 1 : -1;
                
                spawnIndex++;
            }
        }

        for (let i = 0; i < atomCount; i++) {
            let a = atomsData[i];
            if (a.active) {
                if (!a.hit) {
                    a.position.x += a.velocity.x * delta;
                    a.position.y += a.velocity.y * delta;
                    a.position.z += a.velocity.z * delta;
                    
                    // Collimator collision
                    if (a.position.x >= -4.1 && a.position.x <= -3.9) {
                        // Let through a narrow beam
                        if (Math.abs(a.position.y) > 0.1 || Math.abs(a.position.z) > 0.1) {
                            a.position.x = -4.1; // stick to front of collimator
                            a.hit = true;
                            a.life = 0.5; // quickly decay
                        }
                    }

                    // Interaction with inhomogeneous magnetic field
                    if (!a.hit && a.position.x > -1.5 && a.position.x < 1.5) {
                        const force = a.spin * 4.5; // Acceleration due to dB_y/dy
                        a.velocity.y += force * delta;
                    }

                    // Screen collision
                    if (!a.hit && a.position.x >= 6.9) {
                        a.position.x = 6.9;
                        a.hit = true;
                    }
                } else {
                    a.life -= delta;
                    if (a.life <= 0) {
                        a.active = false;
                        a.position.set(-1000, -1000, -1000);
                    }
                }
                
                dummy.position.copy(a.position);
                if (a.hit) {
                    let scale = Math.min(1.0, Math.max(0.001, a.life));
                    dummy.scale.setScalar(scale);
                } else {
                    dummy.scale.setScalar(1);
                }
                dummy.updateMatrix();
                atoms.setMatrixAt(i, dummy.matrix);
            }
        }
        atoms.instanceMatrix.needsUpdate = true;
    };

    // --- Quiz Data ---
    group.userData.quiz = [
        {
            "question": "What fundamental quantum mechanical concept was demonstrated by the Stern-Gerlach experiment?",
            "options": [
                "The wave-particle duality of light",
                "Space quantization and discrete angular momentum",
                "The uncertainty principle",
                "Quantum entanglement"
            ],
            "correct": 1
        },
        {
            "question": "Why did the original experiment use silver atoms?",
            "options": [
                "Silver is highly magnetic",
                "Silver atoms are easy to vaporize",
                "Silver has a single unpaired electron in its outer shell (5s1)",
                "Silver atoms emit a bright visible light"
            ],
            "correct": 2
        },
        {
            "question": "What would classical physics predict for the beam pattern on the screen?",
            "options": [
                "A single dot in the center",
                "A continuous smear or line of atoms",
                "Two distinct dots",
                "Three distinct dots"
            ],
            "correct": 1
        },
        {
            "question": "Why must the magnetic field in the apparatus be inhomogeneous (non-uniform)?",
            "options": [
                "A uniform field would only exert a torque, not a net deflecting force",
                "A uniform field would magnetize the entire apparatus",
                "Inhomogeneous fields are easier to produce",
                "It prevents the atoms from colliding with each other"
            ],
            "correct": 0
        },
        {
            "question": "What is the shape of the magnetic pole pieces used to create the inhomogeneous field?",
            "options": [
                "Two flat parallel plates",
                "Two sharp points facing each other",
                "One sharp pointed pole and one flat or grooved pole",
                "A spherical cavity"
            ],
            "correct": 2
        },
        {
            "question": "How does the electron spin relate to the magnetic dipole moment?",
            "options": [
                "They are independent of each other",
                "The magnetic dipole moment is proportional to the spin angular momentum",
                "The magnetic dipole moment is inversely proportional to the spin",
                "Spin cancels out the magnetic dipole moment entirely"
            ],
            "correct": 1
        }
    ];

    return group;
}
