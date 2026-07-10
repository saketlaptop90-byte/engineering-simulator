import {
    steel, castIron, aluminum, copper, brass, chrome, darkSteel, titanium, lead,
    rubber, plastic, whitePlastic, ceramic, glass, greenPCB, insulation, carbonFiber,
    redAccent, blueAccent, orangeAccent, yellowAccent, greenAccent, purpleAccent,
    electrolyte, fire, wireCoil, tinted
} from '../utils/materials.js';

export function createManualTransmission(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. Input Shaft
    const inputGroup = new THREE.Group();
    inputGroup.position.set(0, 1, 0);

    const inShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16), steel);
    inShaft.position.set(-2.25, 0, 0);
    inShaft.rotation.z = Math.PI / 2;
    inputGroup.add(inShaft);

    const inGear = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 20), steel);
    inGear.position.set(-1.5, 0, 0);
    inGear.rotation.z = Math.PI / 2;
    inputGroup.add(inGear);

    // 2. Countershaft
    const counterGroup = new THREE.Group();
    counterGroup.position.set(0, -1, 0);

    const cShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 5, 16), steel);
    cShaft.position.set(0.75, 0, 0);
    cShaft.rotation.z = Math.PI / 2;
    counterGroup.add(cShaft);

    const cgIn = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 20), steel);
    cgIn.position.set(-1.5, 0, 0);
    cgIn.rotation.z = Math.PI / 2;
    counterGroup.add(cgIn);

    const cg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 10), steel);
    cg1.position.set(0, 0, 0);
    cg1.rotation.z = Math.PI / 2;
    counterGroup.add(cg1);

    const cg2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 20), steel);
    cg2.position.set(1.5, 0, 0);
    cg2.rotation.z = Math.PI / 2;
    counterGroup.add(cg2);

    const cg3 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 30), steel);
    cg3.position.set(3.0, 0, 0);
    cg3.rotation.z = Math.PI / 2;
    counterGroup.add(cg3);

    // 3. Main Shaft
    const mainGroup = new THREE.Group();
    mainGroup.position.set(0, 1, 0);

    const mShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 5.5, 16), titanium);
    mShaft.position.set(1.75, 0, 0);
    mShaft.rotation.z = Math.PI / 2;
    mainGroup.add(mShaft);

    // 4. First Gear
    const gear1Group = new THREE.Group();
    gear1Group.position.set(0, 1, 0);

    const mGear1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 30), brass);
    mGear1.position.set(0, 0, 0);
    mGear1.rotation.z = Math.PI / 2;
    gear1Group.add(mGear1);

    const dog1 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), darkSteel);
    dog1.position.set(0.3, 0, 0);
    dog1.rotation.z = Math.PI / 2;
    gear1Group.add(dog1);

    // 5. Second Gear
    const gear2Group = new THREE.Group();
    gear2Group.position.set(0, 1, 0);

    const mGear2 = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.4, 20), brass);
    mGear2.position.set(1.5, 0, 0);
    mGear2.rotation.z = Math.PI / 2;
    gear2Group.add(mGear2);

    const dog2 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), darkSteel);
    dog2.position.set(1.2, 0, 0);
    dog2.rotation.z = Math.PI / 2;
    gear2Group.add(dog2);

    // 6. Third Gear
    const gear3Group = new THREE.Group();
    gear3Group.position.set(0, 1, 0);

    const mGear3 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.4, 10), brass);
    mGear3.position.set(3.0, 0, 0);
    mGear3.rotation.z = Math.PI / 2;
    gear3Group.add(mGear3);

    const dog3 = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16), darkSteel);
    dog3.position.set(2.7, 0, 0);
    dog3.rotation.z = Math.PI / 2;
    gear3Group.add(dog3);

    // 7. Synchronizers
    const syncGroup = new THREE.Group();
    syncGroup.position.set(0, 1, 0);

    const sync12 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 24), orangeAccent);
    sync12.position.set(0.75, 0, 0);
    sync12.rotation.z = Math.PI / 2;
    syncGroup.add(sync12);

    const sync3 = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.4, 24), orangeAccent);
    sync3.position.set(2.25, 0, 0);
    sync3.rotation.z = Math.PI / 2;
    syncGroup.add(sync3);

    // 8. Shift Forks
    const forksGroup = new THREE.Group();

    const fork12arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), steel);
    fork12arm.position.set(0.75, 1.9, -0.25);
    fork12arm.rotation.x = 0.463; // Math.atan2(0.5, 1.0)
    forksGroup.add(fork12arm);

    const fork12ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 16, Math.PI), steel);
    fork12ring.position.set(0.75, 1.0, 0);
    fork12ring.rotation.y = Math.PI / 2;
    forksGroup.add(fork12ring);

    const fork3arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 8), steel);
    fork3arm.position.set(2.25, 1.9, 0.25);
    fork3arm.rotation.x = -0.463; // Math.atan2(-0.5, 1.0)
    forksGroup.add(fork3arm);

    const fork3ring = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.08, 8, 16, Math.PI), steel);
    fork3ring.position.set(2.25, 1.0, 0);
    fork3ring.rotation.y = Math.PI / 2;
    forksGroup.add(fork3ring);

    // 9. Shift Rods
    const rodsGroup = new THREE.Group();

    const rod12 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8), darkSteel);
    rod12.position.set(1.5, 2.5, -0.5);
    rod12.rotation.z = Math.PI / 2;
    rodsGroup.add(rod12);

    const rod3 = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4, 8), darkSteel);
    rod3.position.set(1.5, 2.5, 0.5);
    rod3.rotation.z = Math.PI / 2;
    rodsGroup.add(rod3);

    // 10. Gear Shifter
    const shifterGroup = new THREE.Group();

    const stickGroup = new THREE.Group();
    stickGroup.position.set(1.5, 3.5, 0);

    const upperStick = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8), chrome);
    upperStick.position.set(0, 0.75, 0);
    stickGroup.add(upperStick);

    const lowerStick = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.0, 8), chrome);
    lowerStick.position.set(0, -0.5, 0);
    stickGroup.add(lowerStick);

    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), plastic);
    knob.position.set(0, 1.5, 0);
    stickGroup.add(knob);

    const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), darkSteel);
    pivot.position.set(0, 0, 0);
    stickGroup.add(pivot);

    shifterGroup.add(stickGroup);

    // Part Metadata
    parts.push({
        group: inputGroup,
        name: "Input Shaft",
        description: "Receives power directly from the engine via the clutch.",
        material: steel,
        function: "Transmits engine torque to the countershaft.",
        assemblyOrder: 1,
        connections: ["Clutch", "Countershaft Input Gear"],
        failureEffect: "Total loss of power transmission.",
        cascadeFailures: ["Clutch disc wear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -3, y: 2, z: 0 }
    });

    parts.push({
        group: counterGroup,
        name: "Countershaft (Layshaft)",
        description: "A parallel shaft that carries fixed gears.",
        material: steel,
        function: "Transfers power from the input shaft to the main shaft gears at various ratios.",
        assemblyOrder: 2,
        connections: ["Input Shaft", "Main Shaft Gears"],
        failureEffect: "Loss of all gear drives.",
        cascadeFailures: ["Gear teeth shearing"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -3, z: 0 }
    });

    parts.push({
        group: mainGroup,
        name: "Main Shaft (Output Shaft)",
        description: "The primary shaft that delivers power to the driveshaft.",
        material: titanium,
        function: "Carries the free-spinning gears and synchronizers, outputting selected torque.",
        assemblyOrder: 3,
        connections: ["Driveshaft", "Synchronizers"],
        failureEffect: "Vehicle cannot move.",
        cascadeFailures: ["U-joint failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 5, y: 2, z: 0 }
    });

    parts.push({
        group: gear1Group,
        name: "First Gear",
        description: "The largest gear on the main shaft, providing the highest torque.",
        material: brass,
        function: "Provides a high gear ratio for starting from a standstill and climbing.",
        assemblyOrder: 4,
        connections: ["Countershaft 1st Gear", "1-2 Synchronizer"],
        failureEffect: "Inability to launch smoothly or climb steep hills.",
        cascadeFailures: ["Synchronizer wear"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 4, z: -4 }
    });

    parts.push({
        group: gear2Group,
        name: "Second Gear",
        description: "Medium-sized gear on the main shaft.",
        material: brass,
        function: "Provides a balanced ratio for moderate speeds and acceleration.",
        assemblyOrder: 5,
        connections: ["Countershaft 2nd Gear", "1-2 Synchronizer"],
        failureEffect: "Loss of 2nd gear, requiring a large RPM jump from 1st to 3rd.",
        cascadeFailures: ["Engine lugging"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 1.5, y: 4, z: -4 }
    });

    parts.push({
        group: gear3Group,
        name: "Third Gear",
        description: "Smallest gear shown on the main shaft.",
        material: brass,
        function: "Provides a near 1:1 ratio for higher speeds and cruising.",
        assemblyOrder: 6,
        connections: ["Countershaft 3rd Gear", "3rd Synchronizer"],
        failureEffect: "Loss of higher speed cruising capability.",
        cascadeFailures: ["Decreased fuel efficiency"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 3.0, y: 4, z: -4 }
    });

    parts.push({
        group: syncGroup,
        name: "Synchronizer Rings and Hubs",
        description: "Collars that slide along the main shaft to engage gears.",
        material: orangeAccent,
        function: "Matches the speed of the gear to the shaft and locks them together.",
        assemblyOrder: 7,
        connections: ["Shift Forks", "Main Shaft", "Gears"],
        failureEffect: "Grinding noises and inability to shift gears.",
        cascadeFailures: ["Dog teeth destruction"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 0, z: 4 }
    });

    parts.push({
        group: forksGroup,
        name: "Shift Forks",
        description: "Yoke-like levers that straddle the synchronizer hubs.",
        material: steel,
        function: "Pushes the synchronizers forward or backward into the gears.",
        assemblyOrder: 8,
        connections: ["Synchronizers", "Shift Rods"],
        failureEffect: "Unable to move synchronizers, stuck in gear or neutral.",
        cascadeFailures: ["Shift rod bending"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 3, z: 3 }
    });

    parts.push({
        group: rodsGroup,
        name: "Shift Rods (Rails)",
        description: "Parallel rails that slide back and forth above the gears.",
        material: darkSteel,
        function: "Transmits the driver's shifting motion from the stick to the forks.",
        assemblyOrder: 9,
        connections: ["Gear Shifter", "Shift Forks"],
        failureEffect: "Shifter feels disconnected, cannot change gears.",
        cascadeFailures: ["Detent ball failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: -2 }
    });

    parts.push({
        group: shifterGroup,
        name: "Gear Shifter (Stick)",
        description: "The driver's interface for changing gears.",
        material: chrome,
        function: "Acts as a lever to move the shift rods selectively.",
        assemblyOrder: 10,
        connections: ["Shift Rods", "Driver's hand"],
        failureEffect: "No control over transmission.",
        cascadeFailures: ["Linkage binding"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 6, z: 0 }
    });

    parts.forEach(p => group.add(p.group));

    const description = "A manual transmission (gearbox) uses different gear ratios to manage the engine's torque and speed before transmitting it to the wheels. This 3-speed model demonstrates the power flow from the input shaft, through the constantly meshed countershaft, to the selectively engaged gears on the main shaft. Synchronizer rings lock the free-spinning gears to the output shaft when pushed by the shift forks.";

    const quizQuestions = [
        {
            question: "When a smaller gear drives a larger gear (like in 1st gear), what is the effect on the output?",
            options: [
                "Increases speed and decreases torque",
                "Increases torque and decreases speed",
                "Increases both speed and torque",
                "Decreases both speed and torque"
            ],
            correct: 1,
            explanation: "A smaller driving gear turning a larger driven gear creates a mechanical advantage, increasing torque at the cost of rotational speed.",
            difficulty: "easy"
        },
        {
            question: "What is the primary function of the synchronizer rings?",
            options: [
                "To reverse the direction of rotation",
                "To permanently lock gears to the main shaft",
                "To match the rotational speed of the gear and shaft before engagement",
                "To provide lubrication to the gear teeth"
            ],
            correct: 2,
            explanation: "Synchronizers use friction to bring the free-spinning gear and the main shaft to the same rotational speed before the dog teeth lock them together, preventing grinding.",
            difficulty: "medium"
        },
        {
            question: "What role does the countershaft (layshaft) play in a manual transmission?",
            options: [
                "It connects directly to the wheels",
                "It acts as an intermediate shaft, carrying fixed gears that constantly mesh with the main shaft gears",
                "It disengages the engine from the transmission",
                "It only spins when the car is in reverse"
            ],
            correct: 1,
            explanation: "The countershaft is driven by the input shaft and holds gears that constantly mesh with the free-spinning gears on the main shaft.",
            difficulty: "medium"
        },
        {
            question: "Why must the driver press the clutch pedal before shifting gears?",
            options: [
                "To apply the brakes automatically",
                "To increase engine RPMs",
                "To disconnect the engine's power from the transmission, removing load from the gears",
                "To lock the differential"
            ],
            correct: 2,
            explanation: "The clutch temporarily disconnects engine torque, allowing the synchronizers to match speeds without fighting the force of the engine.",
            difficulty: "easy"
        },
        {
            question: "In 3rd gear (or a higher gear), the gear ratio is closer to 1:1. How does this compare to 1st gear?",
            options: [
                "It provides lower wheel speed but higher acceleration",
                "It provides higher wheel speed but less torque for acceleration",
                "It consumes more fuel at highway speeds",
                "It is used primarily for climbing steep hills"
            ],
            correct: 1,
            explanation: "Higher gears sacrifice torque multiplier for higher output speeds, making them ideal for cruising rather than heavy acceleration.",
            difficulty: "easy"
        },
        {
            question: "What happens mechanically when the transmission is in Neutral?",
            options: [
                "The input shaft stops spinning entirely",
                "All gears disengage from each other",
                "None of the free-spinning main shaft gears are locked to the main shaft by the synchronizers",
                "The countershaft slides out of alignment"
            ],
            correct: 2,
            explanation: "In Neutral, the input shaft, countershaft, and main shaft gears all spin, but no synchronizer is engaged, so no power is transferred to the output shaft.",
            difficulty: "hard"
        }
    ];

    function animate(time, speed, meshes) {
        function smooth(a, b, progress) {
            progress = Math.max(0, Math.min(1, progress));
            const ease = progress * progress * (3 - 2 * progress);
            return a + (b - a) * ease;
        }

        const cycleLen = 10;
        const fullT = time * speed * 0.5;
        const t = fullT % cycleLen;

        let s12 = 0.75;
        let s3 = 2.25;

        if (t < 1.0) {
            // Neutral
        } else if (t < 1.5) {
            s12 = smooth(0.75, 0.3, (t - 1.0) / 0.5);
        } else if (t < 3.5) {
            s12 = 0.3;
        } else if (t < 4.0) {
            s12 = smooth(0.3, 1.2, (t - 3.5) / 0.5);
        } else if (t < 6.0) {
            s12 = 1.2;
        } else if (t < 6.5) {
            s12 = smooth(1.2, 0.75, (t - 6.0) / 0.5);
        } else if (t < 7.0) {
            s3 = smooth(2.25, 2.7, (t - 6.5) / 0.5);
        } else if (t < 9.0) {
            s3 = 2.7;
        } else if (t < 9.5) {
            s3 = smooth(2.7, 2.25, (t - 9.0) / 0.5);
        }

        let fullCycles = Math.floor(fullT / cycleLen);
        let ct = fullT % cycleLen;
        let rotPerCycle = 8.666; 
        let outputRot = fullCycles * rotPerCycle;
        if (ct > 1.5) outputRot += Math.min(ct - 1.5, 2.0) * 0.333;
        if (ct > 4.0) outputRot += Math.min(ct - 4.0, 2.0) * 1.0;
        if (ct > 7.0) outputRot += Math.min(ct - 7.0, 2.0) * 3.0;

        const baseInputSpeed = 5.0;
        const inputRot = fullT * baseInputSpeed;
        const counterRot = -inputRot;

        // 1. Input Shaft
        meshes[0].group.rotation.x = inputRot;
        
        // 2. Countershaft
        meshes[1].group.rotation.x = counterRot;
        
        // 3. Main Shaft
        meshes[2].group.rotation.x = outputRot * baseInputSpeed;
        
        // 4-6. Main shaft free spinning gears
        meshes[3].group.rotation.x = counterRot * (-0.5 / 1.5); // 1st
        meshes[4].group.rotation.x = counterRot * (-1.0 / 1.0); // 2nd
        meshes[5].group.rotation.x = counterRot * (-1.5 / 0.5); // 3rd
        
        // 7. Synchronizers
        meshes[6].group.rotation.x = outputRot * baseInputSpeed;
        meshes[6].group.children[0].position.x = s12;
        meshes[6].group.children[1].position.x = s3;

        // 8. Shift Forks
        meshes[7].group.children[0].position.x = s12;
        meshes[7].group.children[1].position.x = s12;
        meshes[7].group.children[2].position.x = s3;
        meshes[7].group.children[3].position.x = s3;

        // 9. Shift Rods
        meshes[8].group.children[0].position.x = 1.5 + (s12 - 0.75);
        meshes[8].group.children[1].position.x = 1.5 + (s3 - 2.25);

        // 10. Gear Shifter
        const shifterGroup = meshes[9].group;
        let targetZ = 0;
        if (ct >= 0.5 && ct < 6.2) targetZ = -0.5;
        else if (ct >= 6.2 && ct < 9.8) targetZ = 0.5;

        if (shifterGroup.userData.smoothedStickZ === undefined) {
            shifterGroup.userData.smoothedStickZ = 0;
        }
        shifterGroup.userData.smoothedStickZ += (targetZ - shifterGroup.userData.smoothedStickZ) * 0.2;
        
        const shiftStick = shifterGroup.children[0];
        shiftStick.rotation.x = Math.asin(shifterGroup.userData.smoothedStickZ / 1.0);
        
        let stickRotZ = 0;
        if (Math.abs(s12 - 0.75) > 0.01) {
            stickRotZ = -Math.asin((s12 - 0.75) / 1.0);
        } else if (Math.abs(s3 - 2.25) > 0.01) {
            stickRotZ = -Math.asin((s3 - 2.25) / 1.0);
        }
        shiftStick.rotation.z = stickRotZ;
    }

    return {
        group,
        parts,
        description,
        quizQuestions,
        animate
    };
}
