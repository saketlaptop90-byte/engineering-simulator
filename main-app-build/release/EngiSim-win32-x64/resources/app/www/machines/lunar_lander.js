export function createLunarLander(THREE) {
    const group = new THREE.Group();

    // Materials
    const descentStageMat = new THREE.MeshStandardMaterial({ color: 0xcd853f, metalness: 0.8, roughness: 0.4 }); // Gold foil look
    const ascentStageMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.3, roughness: 0.7 });
    const legMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 });
    const padMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5, roughness: 0.8 });
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.3 });
    const tankMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.5 });
    const hatchMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const rcsMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.8, roughness: 0.2, wireframe: true });

    // 1. Descent Stage (Octagonal body)
    const descentGeo = new THREE.CylinderGeometry(2.5, 2.5, 1.5, 8);
    const descentStage = new THREE.Mesh(descentGeo, descentStageMat);
    descentStage.position.y = 1.5;
    group.add(descentStage);

    // 2. Ascent Stage (Cabin)
    const ascentGeo = new THREE.CylinderGeometry(1.5, 1.8, 1.8, 16);
    const ascentStage = new THREE.Mesh(ascentGeo, ascentStageMat);
    ascentStage.position.y = 3.15;
    group.add(ascentStage);

    // 3. Landing Pads (4 circular pads)
    // 4. Landing Legs (4 angled legs)
    const legsGroup = new THREE.Group();
    const landingPads = [];
    const landingLegs = [];
    for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        
        // Leg
        const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 4);
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
        // Angle the leg outwards
        leg.rotation.z = Math.cos(angle) * 0.5;
        leg.rotation.x = -Math.sin(angle) * 0.5;
        legsGroup.add(leg);
        landingLegs.push(leg);

        // Pad
        const padGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16);
        const pad = new THREE.Mesh(padGeo, padMat);
        // Position at the bottom of the leg
        pad.position.set(Math.cos(angle) * 3.5, -1.8, Math.sin(angle) * 3.5);
        legsGroup.add(pad);
        landingPads.push(pad);
    }
    legsGroup.position.y = 1.5;
    group.add(legsGroup);

    // 5. Descent Engine
    const descentEngineGeo = new THREE.CylinderGeometry(0.3, 0.8, 1);
    const descentEngine = new THREE.Mesh(descentEngineGeo, engineMat);
    descentEngine.position.y = 0.25;
    group.add(descentEngine);

    // 6. Ascent Engine
    const ascentEngineGeo = new THREE.CylinderGeometry(0.1, 0.3, 0.4);
    const ascentEngine = new THREE.Mesh(ascentEngineGeo, engineMat);
    ascentEngine.position.y = 2.15;
    group.add(ascentEngine);

    // 7. Crew Hatch
    const hatchGeo = new THREE.BoxGeometry(0.8, 0.8, 0.1);
    const hatch = new THREE.Mesh(hatchGeo, hatchMat);
    hatch.position.set(0, 3.15, 1.8);
    group.add(hatch);

    // 8. RCS Thrusters (Quads on ascent stage)
    const rcsGroup = new THREE.Group();
    for(let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const rcsGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const rcs = new THREE.Mesh(rcsGeo, rcsMat);
        rcs.position.set(Math.cos(angle) * 1.6, 3.15, Math.sin(angle) * 1.6);
        rcsGroup.add(rcs);
    }
    group.add(rcsGroup);

    // 9. High-Gain Antenna
    const antennaGeo = new THREE.SphereGeometry(0.4, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(1.2, 4.3, 0);
    antenna.rotation.x = -Math.PI / 4;
    group.add(antenna);

    // 10. Propellant Tanks (Spheres on descent stage)
    for(let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const tankGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const tank = new THREE.Mesh(tankGeo, tankMat);
        tank.position.set(Math.cos(angle) * 2.2, 1.5, Math.sin(angle) * 2.2);
        group.add(tank);
    }

    // Animation: RCS Thruster firing pulsing effect
    let time = 0;
    const rcsFlames = [];
    for(let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.8 });
        const flameGeo = new THREE.ConeGeometry(0.05, 0.3, 8);
        const flame = new THREE.Mesh(flameGeo, flameMat);
        // pointing outward
        flame.position.set(Math.cos(angle) * 1.85, 3.15, Math.sin(angle) * 1.85);
        flame.rotation.z = -Math.cos(angle) * Math.PI / 2;
        flame.rotation.x = Math.sin(angle) * Math.PI / 2;
        group.add(flame);
        rcsFlames.push(flame);
    }

    // Animate landing legs compression on touchdown and RCS firing
    function update(delta) {
        time += delta;
        
        // RCS thruster firing (flickering flame)
        rcsFlames.forEach((flame, index) => {
            const fire = Math.sin(time * 20 + index) > 0.5;
            flame.visible = fire;
            if (fire) {
                flame.scale.set(1, 1 + Math.random(), 1);
            }
        });

        // Simulating compression of legs over a slow cycle
        const compression = Math.sin(time) * 0.5 + 0.5; // 0 to 1
        legsGroup.position.y = 1.5 + compression * 0.2;
    }

    const questions = [
        {
            question: "What was the primary purpose of the gold foil on the Lunar Lander's descent stage?",
            options: ["Aesthetic appeal", "Thermal insulation", "Radar reflection", "Micrometeoroid protection"],
            correctAnswer: 1,
            explanation: "The gold-colored Kapton foil provided thermal insulation to protect the spacecraft and its propellants from the extreme temperature variations in space."
        },
        {
            question: "Why does a Lunar Lander separate into an Ascent Stage and a Descent Stage?",
            options: ["To leave weight behind on the Moon", "To save fuel by reducing mass for the return trip", "To provide a launch platform", "All of the above"],
            correctAnswer: 3,
            explanation: "The descent stage acts as a launch pad for the ascent stage, and leaving it behind significantly reduces the mass that must be accelerated back to lunar orbit, saving substantial fuel."
        },
        {
            question: "What propellants were commonly used for the Apollo Lunar Module engines?",
            options: ["Liquid Oxygen and Kerosene", "Liquid Hydrogen and Liquid Oxygen", "Aerozine 50 and Dinitrogen Tetroxide", "Solid Rocket Propellant"],
            correctAnswer: 2,
            explanation: "The Apollo LM used hypergolic propellants (Aerozine 50 fuel and Dinitrogen Tetroxide oxidizer) because they ignite spontaneously upon contact, eliminating the need for complex and potentially unreliable ignition systems."
        },
        {
            question: "What is the function of the RCS (Reaction Control System) thrusters on the Lander?",
            options: ["Primary propulsion for landing", "Providing breathable oxygen to the cabin", "Attitude control and small translational maneuvers", "Generating electrical power"],
            correctAnswer: 2,
            explanation: "RCS thrusters are small engines used to precisely control the orientation (pitch, roll, yaw) and perform minor adjustments in the spacecraft's trajectory."
        },
        {
            question: "Why do the landing pads have a large, dish-like shape?",
            options: ["To bounce upon landing", "To prevent sinking into the lunar dust", "To reflect heat from the engine", "To act as secondary antennas"],
            correctAnswer: 1,
            explanation: "The large surface area of the landing pads distributes the weight of the lander, preventing it from sinking too deeply into the loose lunar regolith (dust and soil)."
        },
        {
            question: "Which component is critical for communication between the Lunar Lander and Earth?",
            options: ["Descent Engine", "RCS Thrusters", "High-Gain Antenna", "Crew Hatch"],
            correctAnswer: 2,
            explanation: "The High-Gain Antenna provides the directional, high-bandwidth communication link necessary for transmitting voice, telemetry, and television signals back to Earth."
        }
    ];

    return {
        group,
        update,
        questions
    };
}
