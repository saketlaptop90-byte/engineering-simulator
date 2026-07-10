export function createVoyagerProbe(THREE) {
    const group = new THREE.Group();

    // 1. High-Gain Antenna
    const antennaGeo = new THREE.CylinderGeometry(2, 0.1, 0.5, 32);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
    antenna.position.set(0, 1.25, 0);
    antenna.userData = { id: 'high_gain_antenna', name: 'High-Gain Antenna' };
    group.add(antenna);

    // 2. RTG
    const rtgGroup = new THREE.Group();
    const rtgBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3), new THREE.MeshStandardMaterial({ color: 0x555555 }));
    rtgBoom.rotation.z = Math.PI / 2;
    rtgBoom.position.set(-1.5, 0.5, 0);
    const rtgBody = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.5), new THREE.MeshStandardMaterial({ color: 0x333333 }));
    rtgBody.rotation.z = Math.PI / 2;
    rtgBody.position.set(-3, 0.5, 0);
    rtgGroup.add(rtgBoom, rtgBody);
    rtgGroup.userData = { id: 'rtg', name: 'RTG' };
    group.add(rtgGroup);

    // 3. Cosmic Ray Subsystem
    const crs = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x8888ff }));
    crs.position.set(1.5, 0.5, -1.5);
    crs.userData = { id: 'cosmic_ray_subsystem', name: 'Cosmic Ray Subsystem' };
    group.add(crs);

    // 4. Magnetometer Boom
    const magBoom = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 8), new THREE.MeshStandardMaterial({ color: 0x999999 }));
    magBoom.rotation.x = Math.PI / 2;
    magBoom.position.set(0, 0.5, 4);
    magBoom.userData = { id: 'magnetometer_boom', name: 'Magnetometer Boom' };
    group.add(magBoom);

    // 5. Plasma Spectrometer
    const pls = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffaa00 }));
    pls.position.set(-0.5, 0.5, 0.8);
    pls.userData = { id: 'plasma_spectrometer', name: 'Plasma Spectrometer' };
    group.add(pls);

    // 6. Imaging Science Subsystem
    const iss = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.8), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    iss.rotation.x = Math.PI / 2;
    iss.position.set(2, 0.5, 2);
    iss.userData = { id: 'imaging_science_subsystem', name: 'Imaging Science Subsystem' };
    group.add(iss);

    // 7. Golden Record
    const record = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 32), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.2 }));
    record.rotation.x = Math.PI / 2;
    record.rotation.z = Math.PI / 8;
    record.position.set(0.8, 0.5, 0.8);
    record.userData = { id: 'golden_record', name: 'Golden Record' };
    group.add(record);

    // 8. Thrusters & Bus
    const thrustersGroup = new THREE.Group();
    const bus = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1, 10), new THREE.MeshStandardMaterial({ color: 0xaaaaaa }));
    bus.position.set(0, 0.5, 0);
    const thruster = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.3), new THREE.MeshStandardMaterial({ color: 0x444444 }));
    thruster.position.set(0, -0.15, 0);
    thruster.rotation.x = Math.PI;
    thrustersGroup.add(bus, thruster);
    thrustersGroup.userData = { id: 'thrusters', name: 'Thrusters' };
    group.add(thrustersGroup);

    // 9. LECP
    const lecp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.3), new THREE.MeshStandardMaterial({ color: 0x77ff77 }));
    lecp.position.set(1.5, 0.5, 1);
    lecp.userData = { id: 'lecp', name: 'LECP' };
    group.add(lecp);

    // 10. Photopolarimeter
    const pps = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.4, 0.2), new THREE.MeshStandardMaterial({ color: 0xaaaa00 }));
    pps.position.set(2.5, 0.5, 1.5);
    pps.userData = { id: 'photopolarimeter', name: 'Photopolarimeter' };
    group.add(pps);

    group.update = function(delta) {
        group.rotation.y += delta * 0.05; // Slow space rotation
        lecp.rotation.y += delta * 0.5; // LECP continuous stepping
    };

    group.quizzes = [
        {
            question: "What is the purpose of the Golden Record carried by Voyager?",
            options: ["To store operational code", "To carry sounds and images of Earth to extraterrestrials", "To deflect space debris", "To reflect sunlight for power"],
            answer: 1
        },
        {
            question: "How is the Voyager probe powered?",
            options: ["Solar panels", "Batteries", "Radioisotope Thermoelectric Generators (RTGs)", "Nuclear fusion"],
            answer: 2
        },
        {
            question: "What does the Magnetometer Boom measure?",
            options: ["Solar wind speed", "Magnetic fields in space", "Temperature of planets", "Cosmic ray particles"],
            answer: 1
        },
        {
            question: "Which instrument takes pictures of planets and moons?",
            options: ["Photopolarimeter", "Cosmic Ray Subsystem", "Imaging Science Subsystem", "LECP"],
            answer: 2
        },
        {
            question: "What does the High-Gain Antenna do?",
            options: ["Collects solar energy", "Communicates with Earth", "Measures radiation", "Navigates the probe"],
            answer: 1
        },
        {
            question: "What does LECP stand for?",
            options: ["Low-Energy Charged Particle instrument", "Lunar Exploration Camera Probe", "Light-Emitting Cosmic Particle", "Laser Emission Communication Port"],
            answer: 0
        }
    ];

    return group;
}
