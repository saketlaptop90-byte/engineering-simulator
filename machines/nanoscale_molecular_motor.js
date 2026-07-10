export function createNanoscaleMolecularMotor(THREE) {
    const group = new THREE.Group();

    // Materials
    const matStator = new THREE.MeshStandardMaterial({ color: 0x444488, metalness: 0.8, roughness: 0.2 });
    const matAxle = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.1 });
    const matRotor = new THREE.MeshStandardMaterial({ color: 0xdd4444, metalness: 0.6, roughness: 0.3 });
    const matSite = new THREE.MeshStandardMaterial({ color: 0x44dd44, emissive: 0x114411 });
    const matLinker = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, wireframe: true });
    const matArm = new THREE.MeshStandardMaterial({ color: 0xdddd44 });
    const matBlocker = new THREE.MeshStandardMaterial({ color: 0xaa2222 });
    const matShaft = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.8 });
    const matAntenna = new THREE.MeshStandardMaterial({ color: 0xff88ff, emissive: 0x441144 });
    const matPayload = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.9 });

    // 1. stator_base
    const statorGeo = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const stator = new THREE.Mesh(statorGeo, matStator);
    stator.name = "stator_base";
    stator.userData.description = "The stationary foundation of the molecular motor.";
    group.add(stator);

    // 2. central_axle
    const axleGeo = new THREE.CylinderGeometry(0.3, 0.3, 4, 16);
    const axle = new THREE.Mesh(axleGeo, matAxle);
    axle.position.y = 2;
    axle.name = "central_axle";
    axle.userData.description = "The central axis around which the rotor turns.";
    group.add(axle);

    // 3. power_source_binding_site
    const siteGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const site = new THREE.Mesh(siteGeo, matSite);
    site.position.set(1.5, 0.5, 0);
    site.name = "power_source_binding_site";
    site.userData.description = "Where chemical fuel or photons interact to provide energy.";
    group.add(site);

    // 4. flexible_linker
    const linkerGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 8);
    const linker = new THREE.Mesh(linkerGeo, matLinker);
    linker.position.set(1.2, 1, 0);
    linker.rotation.z = Math.PI / 4;
    linker.name = "flexible_linker";
    linker.userData.description = "Connects structural domains while allowing conformational changes.";
    group.add(linker);

    // 5. sterical_blocker
    const blockerGeo = new THREE.ConeGeometry(0.3, 0.6, 16);
    const blocker = new THREE.Mesh(blockerGeo, matBlocker);
    blocker.position.set(-1.2, 0.5, 0);
    blocker.rotation.x = Math.PI / 2;
    blocker.name = "sterical_blocker";
    blocker.userData.description = "Acts as a ratchet to prevent backward rotation, ensuring unidirectional motion.";
    group.add(blocker);

    // Moving Parts Group
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = 1;
    group.add(rotorGroup);

    // 6. rotor_ring
    const rotorGeo = new THREE.TorusGeometry(1, 0.2, 16, 32);
    const rotor = new THREE.Mesh(rotorGeo, matRotor);
    rotor.rotation.x = Math.PI / 2;
    rotor.name = "rotor_ring";
    rotor.userData.description = "The component that rotates around the axle.";
    rotorGroup.add(rotor);

    // 7. driving_arm
    const armGeo = new THREE.BoxGeometry(1.5, 0.2, 0.2);
    const arm = new THREE.Mesh(armGeo, matArm);
    arm.position.set(0.75, 0, 0);
    arm.name = "driving_arm";
    arm.userData.description = "Transfers the mechanical force from the rotor.";
    rotorGroup.add(arm);

    // 8. transmission_shaft
    const shaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 3, 16);
    const shaft = new THREE.Mesh(shaftGeo, matShaft);
    shaft.position.y = 2.5;
    shaft.name = "transmission_shaft";
    shaft.userData.description = "Transmits the rotary motion to other molecular components.";
    rotorGroup.add(shaft);

    // 9. light_harvesting_antenna
    const antennaGeo = new THREE.IcosahedronGeometry(0.5);
    const antenna = new THREE.Mesh(antennaGeo, matAntenna);
    antenna.position.y = 4.5;
    antenna.name = "light_harvesting_antenna";
    antenna.userData.description = "Absorbs light energy to drive the motor's rotation.";
    rotorGroup.add(antenna);

    // 10. payload_attachment_point
    const payloadGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const payload = new THREE.Mesh(payloadGeo, matPayload);
    payload.position.y = 5.2;
    payload.name = "payload_attachment_point";
    payload.userData.description = "Where target molecules can be attached for transport or work.";
    rotorGroup.add(payload);

    group.update = function(delta) {
        rotorGroup.rotation.y += 2 * delta;
        antenna.rotation.x += 1 * delta;
        antenna.rotation.z += 1 * delta;
    };

    group.quiz = [
        {
            question: "What is a typical energy source for artificial molecular motors?",
            options: ["Light or chemical energy", "Coal", "Nuclear fission", "Wind power"],
            correctAnswer: 0
        },
        {
            question: "Who were awarded the 2016 Nobel Prize in Chemistry for the design and synthesis of molecular machines?",
            options: ["Curie, Einstein, and Bohr", "Sauvage, Stoddart, and Feringa", "Watson, Crick, and Franklin", "Pauling, Sanger, and Hodgkin"],
            correctAnswer: 1
        },
        {
            question: "What role does a sterical blocker (ratchet mechanism) typically play in a molecular motor?",
            options: ["To increase the speed", "To prevent the motor from turning backwards (unidirectional motion)", "To cool down the molecule", "To make the molecule glow"],
            correctAnswer: 1
        },
        {
            question: "Which of the following is a naturally occurring biological molecular motor?",
            options: ["Carbon nanotube", "ATP synthase", "Graphene", "Fullerene"],
            correctAnswer: 1
        },
        {
            question: "Which type of motion is characteristic of a Feringa-type molecular motor?",
            options: ["Linear motion", "Unidirectional rotary motion", "Random Brownian motion only", "Expansion and contraction"],
            correctAnswer: 1
        },
        {
            question: "In molecular nanotechnology, what is a 'stator'?",
            options: ["The moving part of the motor", "The stationary part to which the moving part is attached", "A type of molecular fuel", "A tool for measuring molecular mass"],
            correctAnswer: 1
        }
    ];

    return group;
}
