export function createSlsRocket(THREE) {
    const group = new THREE.Group();

    // Materials
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xcc5500, roughness: 0.8 }); // Core stage thermal protection
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const greyMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const blueMat = new THREE.MeshStandardMaterial({ color: 0x113388, metalness: 0.3, roughness: 0.2 });
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.4 });

    // 1. Core Stage
    const coreGeo = new THREE.CylinderGeometry(4.2, 4.2, 65, 32);
    const coreStage = new THREE.Mesh(coreGeo, orangeMat);
    coreStage.position.y = 32.5;
    group.add(coreStage);

    // 2. RS-25 Engine Array
    const engineArray = new THREE.Group();
    const nozzleGeo = new THREE.CylinderGeometry(1.2, 0.4, 3, 16);
    for(let i=0; i<4; i++) {
        const engine = new THREE.Mesh(nozzleGeo, nozzleMat);
        // Arrange in a square cluster
        engine.position.x = (i % 2 === 0 ? 1.8 : -1.8);
        engine.position.z = (i < 2 ? 1.8 : -1.8);
        engine.position.y = -1.5;
        engineArray.add(engine);
    }
    group.add(engineArray);

    // 3. Left Solid Rocket Booster (SRB)
    const srbGeo = new THREE.CylinderGeometry(1.8, 1.8, 54, 32);
    const leftBooster = new THREE.Mesh(srbGeo, whiteMat);
    leftBooster.position.set(-6.2, 27, 0);
    group.add(leftBooster);

    // 4. Right Solid Rocket Booster (SRB)
    const rightBooster = new THREE.Mesh(srbGeo, whiteMat);
    rightBooster.position.set(6.2, 27, 0);
    group.add(rightBooster);

    // 5. LVSA (Launch Vehicle Stage Adapter)
    const lvsaGeo = new THREE.CylinderGeometry(2.5, 4.2, 8.5, 32);
    const lvsa = new THREE.Mesh(lvsaGeo, orangeMat);
    lvsa.position.y = 65 + 4.25; // 69.25
    group.add(lvsa);

    // 6. ICPS (Interim Cryogenic Propulsion Stage)
    const icpsGeo = new THREE.CylinderGeometry(2.5, 2.5, 10, 32);
    const icps = new THREE.Mesh(icpsGeo, whiteMat);
    icps.position.y = 69.25 + 4.25 + 5; // 78.5
    group.add(icps);

    // 7. Orion Service Module
    const osmGeo = new THREE.CylinderGeometry(2.5, 2.5, 4, 32);
    const orionServiceModule = new THREE.Mesh(osmGeo, greyMat);
    orionServiceModule.position.y = 78.5 + 5 + 2; // 85.5
    group.add(orionServiceModule);

    // 8. Solar Arrays (European Service Module)
    const solarGeo = new THREE.BoxGeometry(18, 0.2, 3);
    const solarArrays = new THREE.Mesh(solarGeo, blueMat);
    solarArrays.position.y = 85.5;
    group.add(solarArrays);

    // 9. Orion Crew Capsule
    const capsuleGeo = new THREE.ConeGeometry(2.5, 3.5, 32);
    const orionCrewCapsule = new THREE.Mesh(capsuleGeo, whiteMat);
    orionCrewCapsule.position.y = 85.5 + 2 + 1.75; // 89.25
    group.add(orionCrewCapsule);

    // 10. Launch Abort System (LAS)
    const lasGeo = new THREE.CylinderGeometry(0.4, 2.5, 10, 32);
    const launchAbortSystem = new THREE.Mesh(lasGeo, whiteMat);
    launchAbortSystem.position.y = 89.25 + 1.75 + 5; // 96.0
    group.add(launchAbortSystem);

    return {
        model: group,
        update: function(time) {
            // Kinematics sequence: Liftoff, Pitch Program (Gravity Turn), SRB Staging
            const t = time;

            if (t < 15) {
                // Liftoff & Acceleration (T=0 to T=15)
                const accel = 3.0; // m/s^2
                group.position.y = 0.5 * accel * t * t;

                // Pitch program starts at T=5
                if (t > 5) {
                    const pitchAngle = (t - 5) * 0.04;
                    group.rotation.z = -pitchAngle; // Pitch downrange
                } else {
                    group.rotation.z = 0;
                }

                // Ensure SRBs are attached relative to the core
                leftBooster.position.set(-6.2, 27, 0);
                leftBooster.rotation.set(0, 0, 0);
                rightBooster.position.set(6.2, 27, 0);
                rightBooster.rotation.set(0, 0, 0);
            } else {
                // SRB Separation at T=15
                const t_sep = t - 15;
                const sepSpeedX = 8.0; // m/s outward relative to core
                const sepSpeedY = 12.0; // m/s backward relative to core

                // Core continues to accelerate vertically and downrange
                const v0_y = 3.0 * 15; // Velocity at separation
                const y0 = 0.5 * 3.0 * 15 * 15; // Position at separation
                const coreAccel = 4.5; // Acceleration increases after shedding weight
                group.position.y = y0 + v0_y * t_sep + 0.5 * coreAccel * t_sep * t_sep;

                // Continue pitching
                const pitchAngle = (15 - 5) * 0.04 + t_sep * 0.02;
                group.rotation.z = -pitchAngle;

                // Animate SRBs peeling away
                leftBooster.position.x = -6.2 - sepSpeedX * t_sep;
                leftBooster.position.y = 27 - sepSpeedY * t_sep;
                leftBooster.rotation.z = t_sep * 0.4; // Tumble

                rightBooster.position.x = 6.2 + sepSpeedX * t_sep;
                rightBooster.position.y = 27 - sepSpeedY * t_sep;
                rightBooster.rotation.z = -t_sep * 0.4; // Tumble
            }
        },
        metadata: {
            name: 'Space Launch System (SLS)',
            description: 'A highly detailed 3D kinematic model of NASA\'s Space Launch System rocket, featuring a liftoff and booster separation sequence.',
            parts: [
                'Core Stage',
                'RS-25 Engine Array',
                'Left Solid Rocket Booster',
                'Right Solid Rocket Booster',
                'LVSA (Launch Vehicle Stage Adapter)',
                'ICPS (Interim Cryogenic Propulsion Stage)',
                'Orion Service Module',
                'Solar Arrays',
                'Orion Crew Capsule',
                'Launch Abort System'
            ],
            quiz: [
                {
                    question: "How many RS-25 engines power the core stage of the SLS?",
                    options: ["Two", "Three", "Four", "Five"],
                    answer: "Four"
                },
                {
                    question: "What is the primary visual characteristic of the SLS Core Stage?",
                    options: ["Painted white", "Orange thermal insulation", "Bare metallic silver", "Black carbon fiber"],
                    answer: "Orange thermal insulation"
                },
                {
                    question: "What spacecraft is mounted on top of the SLS for crewed missions?",
                    options: ["Apollo", "Dragon", "Starliner", "Orion"],
                    answer: "Orion"
                },
                {
                    question: "What does the Launch Abort System (LAS) do?",
                    options: ["Aborts the engine ignition", "Pulls the crew module away from the rocket in an emergency", "Destroys the rocket if it goes off course", "Ejects the solid rocket boosters early"],
                    answer: "Pulls the crew module away from the rocket in an emergency"
                },
                {
                    question: "What type of boosters provide the majority of thrust at liftoff for the SLS?",
                    options: ["Liquid Hydrogen Boosters", "Solid Rocket Boosters (SRBs)", "Nuclear Thermal Boosters", "Ion Thrusters"],
                    answer: "Solid Rocket Boosters (SRBs)"
                },
                {
                    question: "What does ICPS stand for?",
                    options: ["Internal Combustion Propulsion System", "Interim Cryogenic Propulsion Stage", "Integrated Command Payload System", "International Crew Protection Shield"],
                    answer: "Interim Cryogenic Propulsion Stage"
                }
            ]
        }
    };
}
