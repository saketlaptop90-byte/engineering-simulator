export function createFluidizedBedReactor(THREE) {
    const group = new THREE.Group();

    // 1. Base Support
    const baseGeometry = new THREE.CylinderGeometry(3, 3, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const baseSupport = new THREE.Mesh(baseGeometry, baseMaterial);
    baseSupport.position.set(0, 0.25, 0);
    group.add(baseSupport);

    // 2. Vertical Reactor Column
    const columnGeometry = new THREE.CylinderGeometry(2, 2, 10, 32);
    const columnMaterial = new THREE.MeshPhysicalMaterial({ color: 0x88ccff, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
    const reactorColumn = new THREE.Mesh(columnGeometry, columnMaterial);
    reactorColumn.position.set(0, 5.5, 0);
    group.add(reactorColumn);

    // 3. Distributor Plate
    const plateGeometry = new THREE.CylinderGeometry(2, 2, 0.2, 32);
    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const distributorPlate = new THREE.Mesh(plateGeometry, plateMaterial);
    distributorPlate.position.set(0, 1.5, 0);
    group.add(distributorPlate);

    // 4. Gas Inlet at Bottom
    const inletGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    const inletMaterial = new THREE.MeshStandardMaterial({ color: 0x33aa33 });
    const gasInlet = new THREE.Mesh(inletGeometry, inletMaterial);
    gasInlet.position.set(0, 0.5, 0);
    group.add(gasInlet);

    // 5. Product Gas Outlet at Top
    const outletGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1, 16);
    const outletMaterial = new THREE.MeshStandardMaterial({ color: 0xcc3333 });
    const gasOutlet = new THREE.Mesh(outletGeometry, outletMaterial);
    gasOutlet.position.set(0, 11, 0);
    group.add(gasOutlet);

    // 6. Cyclone Separator
    const cycloneGroup = new THREE.Group();
    const cycloneTopGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.5, 32);
    const cycloneBotGeo = new THREE.CylinderGeometry(1.5, 0.4, 2, 32);
    const cycloneMat = new THREE.MeshStandardMaterial({ color: 0x777777 });
    const cycloneTop = new THREE.Mesh(cycloneTopGeo, cycloneMat);
    const cycloneBot = new THREE.Mesh(cycloneBotGeo, cycloneMat);
    cycloneTop.position.set(0, 1.75, 0);
    cycloneBot.position.set(0, 0, 0);
    cycloneGroup.add(cycloneTop);
    cycloneGroup.add(cycloneBot);
    // Connection pipe to reactor
    const connectPipeGeo = new THREE.CylinderGeometry(0.4, 0.4, 2, 16);
    const connectPipeMat = new THREE.MeshStandardMaterial({ color: 0x999999 });
    const connectPipe = new THREE.Mesh(connectPipeGeo, connectPipeMat);
    connectPipe.rotation.z = Math.PI / 2;
    connectPipe.position.set(-1, 1.5, 0);
    cycloneGroup.add(connectPipe);
    cycloneGroup.position.set(3, 8.5, 0);
    group.add(cycloneGroup);

    // 7. Dipleg
    const diplegGeometry = new THREE.CylinderGeometry(0.4, 0.4, 5, 16);
    const diplegMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const dipleg = new THREE.Mesh(diplegGeometry, diplegMaterial);
    dipleg.position.set(3, 5, 0);
    group.add(dipleg);

    // 8. Heat Exchanger Coils
    const coilGroup = new THREE.Group();
    const coilMaterial = new THREE.MeshStandardMaterial({ color: 0xb87333 }); // Copper
    for (let i = 0; i < 6; i++) {
        const torusGeometry = new THREE.TorusGeometry(1.2, 0.1, 16, 50);
        const coil = new THREE.Mesh(torusGeometry, coilMaterial);
        coil.rotation.x = Math.PI / 2;
        coil.position.set(0, 3 + i * 0.6, 0);
        coilGroup.add(coil);
    }
    group.add(coilGroup);

    // 9. Pressure Manometer
    const manometerGroup = new THREE.Group();
    const uTubeGeo = new THREE.TorusGeometry(0.5, 0.05, 16, 32, Math.PI);
    const uTubeMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const uTube = new THREE.Mesh(uTubeGeo, uTubeMat);
    uTube.rotation.x = Math.PI;
    const straightTubeGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 16);
    const leftTube = new THREE.Mesh(straightTubeGeo, uTubeMat);
    leftTube.position.set(-0.5, 1, 0);
    const rightTube = new THREE.Mesh(straightTubeGeo, uTubeMat);
    rightTube.position.set(0.5, 1, 0);
    manometerGroup.add(uTube, leftTube, rightTube);
    // Connection line to reactor
    const tapGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16);
    const tap = new THREE.Mesh(tapGeo, uTubeMat);
    tap.rotation.z = Math.PI / 2;
    tap.position.set(0.75, 1, 0);
    manometerGroup.add(tap);
    manometerGroup.position.set(-2.5, 2.5, 0);
    group.add(manometerGroup);

    // 10. Catalyst Particles/Bed
    const particlesGroup = new THREE.Group();
    const particleCount = 800;
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({ color: 0xddaa00 });
    
    const instancedParticles = new THREE.InstancedMesh(particleGeo, particleMat, particleCount);
    const dummy = new THREE.Object3D();
    const particleData = [];
    
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 1.8;
        const theta = Math.random() * Math.PI * 2;
        const x = radius * Math.cos(theta);
        const y = Math.random() * 4; // Initial height
        const z = radius * Math.sin(theta);
        
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        instancedParticles.setMatrixAt(i, dummy.matrix);
        
        particleData.push({
            x, y, z,
            phase: Math.random() * Math.PI * 2,
            speed: 1.0 + Math.random() * 2.0,
            state: 'bed' // states: 'bed', 'rising', 'cyclone', 'dipleg'
        });
    }
    particlesGroup.add(instancedParticles);
    particlesGroup.position.set(0, 1.6, 0); // Just above distributor plate
    group.add(particlesGroup);

    // Animation loop
    const clock = new THREE.Clock();

    group.userData.update = function(t) {
        const time = t !== undefined ? t : clock.getElapsedTime();

        for (let i = 0; i < particleCount; i++) {
            const data = particleData[i];

            if (data.state === 'bed') {
                // Bubbling motion in bed
                const bubbleLift = Math.sin(time * data.speed + data.phase);
                let currentY = data.y + bubbleLift * 0.5;
                if (currentY < 0.1) currentY = 0.1;
                
                // Occasional entrainment
                if (Math.random() < 0.0005 && currentY > 3.0) {
                    data.state = 'rising';
                    data.currentY = currentY;
                    data.currentX = data.x;
                    data.currentZ = data.z;
                }
                dummy.position.set(data.x, currentY, data.z);

            } else if (data.state === 'rising') {
                data.currentY += 0.05;
                
                if (data.currentY > 6.0) { // Start bending towards cyclone pipe at relative Y=8.4
                    data.currentX += (3.0 - data.currentX) * 0.05;
                    data.currentZ += (0 - data.currentZ) * 0.05;
                }
                
                if (data.currentY > 8.4) {
                    data.state = 'cyclone';
                    data.angle = 0;
                }
                dummy.position.set(data.currentX, data.currentY, data.currentZ);

            } else if (data.state === 'cyclone') {
                data.angle += 0.5; // Fast spin
                data.currentY -= 0.03; // Fall down cyclone
                
                // Cyclone radius tapers down from ~1.2 to ~0.3.
                const progress = (8.4 - data.currentY) / (8.4 - 5.9);
                const currentRadius = 1.2 * (1 - progress) + 0.3 * progress;
                
                data.currentX = 3.0 + Math.cos(data.angle) * currentRadius;
                data.currentZ = Math.sin(data.angle) * currentRadius;
                
                if (data.currentY < 5.9) {
                    data.state = 'dipleg';
                }
                dummy.position.set(data.currentX, data.currentY, data.currentZ);

            } else if (data.state === 'dipleg') {
                data.currentY -= 0.1; // Fall down dipleg
                data.currentX = 3.0;
                data.currentZ = 0;
                
                if (data.currentY < 0.9) {
                    data.state = 'bed';
                    data.y = 1.0 + Math.random() * 2;
                    const radius = Math.random() * 1.8;
                    const theta = Math.random() * Math.PI * 2;
                    data.x = radius * Math.cos(theta);
                    data.z = radius * Math.sin(theta);
                }
                dummy.position.set(data.currentX, data.currentY, data.currentZ);
            }
            
            dummy.updateMatrix();
            instancedParticles.setMatrixAt(i, dummy.matrix);
        }
        instancedParticles.instanceMatrix.needsUpdate = true;

        // Visual manometer vibration
        manometerGroup.position.y = 2.5 + Math.sin(time * 20) * 0.01;
    };

    // Quiz Questions
    group.userData.quiz = [
        {
            question: "What is the primary function of the Distributor Plate in a fluidized bed reactor?",
            options: [
                "To collect the final product",
                "To cool the reactor down",
                "To evenly distribute the incoming fluidizing gas across the bed",
                "To separate catalyst from gas"
            ],
            correctAnswer: 2
        },
        {
            question: "What does the Cyclone Separator do?",
            options: [
                "It cools the gas",
                "It mixes the solid and gas",
                "It removes entrained solid particles from the exiting gas stream",
                "It compresses the gas"
            ],
            correctAnswer: 2
        },
        {
            question: "Which component returns separated catalyst particles from the cyclone back to the reactor bed?",
            options: [
                "Distributor Plate",
                "Dipleg",
                "Gas Outlet",
                "Heat Exchanger Coils"
            ],
            correctAnswer: 1
        },
        {
            question: "What is 'fluidization' in this context?",
            options: [
                "Melting the solid catalyst into a liquid",
                "Suspending solid particles in an upward-flowing gas so they behave like a fluid",
                "Adding water to the reactor",
                "Condensing a gas into a liquid state"
            ],
            correctAnswer: 1
        },
        {
            question: "Why are Heat Exchanger Coils often submerged in the fluidized bed?",
            options: [
                "To hold the catalyst particles in place",
                "Because fluidized beds have excellent heat transfer rates, making it efficient to add or remove reaction heat",
                "To slow down the gas flow",
                "To distribute the gas"
            ],
            correctAnswer: 1
        },
        {
            question: "What does a manometer typically measure in a fluidized bed reactor?",
            options: [
                "The temperature of the bed",
                "The chemical composition of the product",
                "The pressure drop across the distributor plate and catalyst bed",
                "The velocity of the particles"
            ],
            correctAnswer: 2
        }
    ];

    return group;
}
