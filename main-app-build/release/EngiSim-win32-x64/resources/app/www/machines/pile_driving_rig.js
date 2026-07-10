export function createPileDrivingRig(THREE) {
    const rig = new THREE.Group();

    // 1. Crawler Base
    const crawlerBase = new THREE.Mesh(
        new THREE.BoxGeometry(4, 1, 6),
        new THREE.MeshStandardMaterial({ color: 0x2c3e50 })
    );
    crawlerBase.position.set(0, 0.5, 0);
    rig.add(crawlerBase);

    // 2. Counterweight
    const counterweight = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2, 2),
        new THREE.MeshStandardMaterial({ color: 0x7f8c8d })
    );
    counterweight.position.set(0, 2, -2);
    rig.add(counterweight);

    // 3. Operator Cab
    const cab = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 2),
        new THREE.MeshStandardMaterial({ color: 0xf39c12 })
    );
    cab.position.set(-1.25, 2, 1);
    rig.add(cab);

    // 4. Hydraulic Power Pack
    const powerPack = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1.5, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x2980b9 })
    );
    powerPack.position.set(1, 1.75, -0.5);
    rig.add(powerPack);

    // 5. Mast (Leader)
    const mast = new THREE.Mesh(
        new THREE.BoxGeometry(1, 18, 1),
        new THREE.MeshStandardMaterial({ color: 0xc0392b })
    );
    mast.position.set(0, 9, 3);
    rig.add(mast);

    // 6. Leader Rails
    const leaderRails = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 17.5, 0.2),
        new THREE.MeshStandardMaterial({ color: 0x95a5a6 })
    );
    leaderRails.position.set(0, 9, 3.6);
    rig.add(leaderRails);

    // 7. Winch
    const winch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 2, 16),
        new THREE.MeshStandardMaterial({ color: 0x34495e })
    );
    winch.rotation.z = Math.PI / 2;
    winch.position.set(0, 2, 1.5);
    rig.add(winch);

    // 8. Pile
    const pile = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 10, 16),
        new THREE.MeshStandardMaterial({ color: 0xbdc3c7 })
    );
    // Position handled via physics update
    rig.add(pile);

    // 9. Pile Cap (Helmet)
    const pileCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16),
        new THREE.MeshStandardMaterial({ color: 0xe67e22 })
    );
    rig.add(pileCap);

    // 10. Hammer
    const hammer = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x2c3e50 })
    );
    rig.add(hammer);

    // Animation / Kinematics variables
    let state = 'LIFTING';
    let hammerY = 12;
    let pileY = 5; // Local Y of the center of the 10m pile (initial bottom at 0)
    const maxHammerY = 16.5; // Max hoist height near top of mast
    let dropVelocity = 0;
    const gravity = 60; // m/s^2 for a snappy fall
    let pauseTimer = 0;
    let driveVelocity = 0;

    // Kinematic Animation Logic
    rig.userData.update = function(deltaTime) {
        const dt = Math.min(deltaTime, 0.1); // Prevent huge jumps
        
        const pileTop = pileY + 5; 
        const capHalfHeight = 0.25;
        const hammerHalfHeight = 1;
        const impactY = pileTop + (capHalfHeight * 2) + hammerHalfHeight;

        switch (state) {
            case 'LIFTING':
                hammerY += 4 * dt;
                if (hammerY >= maxHammerY) {
                    hammerY = maxHammerY;
                    state = 'PAUSING';
                    pauseTimer = 0.4;
                }
                break;
            case 'PAUSING':
                pauseTimer -= dt;
                if (pauseTimer <= 0) {
                    state = 'DROPPING';
                    dropVelocity = 0;
                }
                break;
            case 'DROPPING':
                dropVelocity += gravity * dt;
                hammerY -= dropVelocity * dt;
                if (hammerY <= impactY) {
                    hammerY = impactY;
                    state = 'DRIVING';
                    driveVelocity = dropVelocity * 0.4; // Transfer energy
                }
                break;
            case 'DRIVING':
                driveVelocity -= 120 * dt; // Soil friction decelerates the drive
                if (driveVelocity < 0) driveVelocity = 0;
                
                const driveDelta = driveVelocity * dt;
                pileY -= driveDelta;
                hammerY -= driveDelta;
                
                if (driveVelocity <= 0) {
                    if (pileY <= 0) { 
                        // Pile is fully driven, trigger reset logic
                        state = 'RESETTING';
                        pauseTimer = 1.0;
                    } else {
                        // Needs more hits
                        state = 'LIFTING';
                    }
                }
                break;
            case 'RESETTING':
                pauseTimer -= dt;
                if (pauseTimer <= 0) {
                    pileY += 5 * dt; // Automatically pulling pile out to loop simulation
                    hammerY += 5 * dt;
                    if (pileY >= 5) {
                        pileY = 5;
                        state = 'LIFTING';
                    }
                }
                break;
        }

        // Apply updated transformations
        pile.position.set(0, pileY, 4.2);
        pileCap.position.set(0, pileY + 5 + 0.25, 4.2);
        hammer.position.set(0, hammerY, 4.2);
    };

    // Quiz Questions
    rig.userData.quiz = [
        {
            question: "What is the primary function of the hammer on a pile driving rig?",
            options: ["To extract piles", "To drive piles into the ground", "To mix concrete", "To lift heavy loads"],
            correct: 1
        },
        {
            question: "Which component guides the hammer and ensures it strikes the pile perfectly straight?",
            options: ["The crawler base", "The winch", "The leader (mast)", "The counterweight"],
            correct: 2
        },
        {
            question: "What is the purpose of the pile cap (or helmet)?",
            options: ["To distribute the impact evenly and protect the pile", "To add extra weight to the hammer", "To provide a resting place for birds", "To guide the pile into the soil"],
            correct: 0
        },
        {
            question: "Why are counterweights used on a pile driving rig?",
            options: ["To make the rig sink into the mud", "To offset the heavy weight of the mast and hammer", "To speed up the hammering process", "To store hydraulic fluid"],
            correct: 1
        },
        {
            question: "What generates the lifting force for the hammer in hydraulic rigs?",
            options: ["Wind turbines", "Steam engines", "Hydraulic power pack and winch", "Manual labor"],
            correct: 2
        },
        {
            question: "During the driving process, what happens immediately after the hammer hits the pile?",
            options: ["The pile bounces out of the ground", "Energy transfers, driving the pile downward", "The rig automatically shuts down", "The hammer disintegrates"],
            correct: 1
        }
    ];

    return rig;
}
