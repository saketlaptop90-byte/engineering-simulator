export function createOrbitalCentrifuge(THREE) {
    const group = new THREE.Group();

    // Materials
    const hullMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.4 });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x112255, metalness: 0.1, roughness: 0.1 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.6, metalness: 0.9, roughness: 0.1 });
    const radiatorMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.2, roughness: 0.8 });
    const habitatMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.6 });

    // 1. Central Hub (cylinder)
    const hubGeom = new THREE.CylinderGeometry(2, 2, 10, 32);
    const centralHub = new THREE.Mesh(hubGeom, hullMat);
    group.add(centralHub);

    // Rotating section
    const rotatingGroup = new THREE.Group();
    group.add(rotatingGroup);

    // 2. Rotating Torus
    const torusGeom = new THREE.TorusGeometry(20, 3, 32, 64);
    const rotatingTorus = new THREE.Mesh(torusGeom, hullMat);
    rotatingTorus.rotation.x = Math.PI / 2;
    rotatingGroup.add(rotatingTorus);

    // 3. Connecting Spokes
    const numSpokes = 4;
    for(let i=0; i<numSpokes; i++) {
        const angle = (i / numSpokes) * Math.PI * 2;
        const spokeGeom = new THREE.CylinderGeometry(0.5, 0.5, 17, 16);
        const spoke = new THREE.Mesh(spokeGeom, darkMat);
        // Position spoke between hub and torus inner edge
        spoke.position.set(Math.cos(angle) * 10, 0, Math.sin(angle) * 10);
        spoke.rotation.z = Math.PI / 2;
        spoke.rotation.y = -angle;
        rotatingGroup.add(spoke);
    }

    // 4. Solar Arrays (Tracking sun, so separate group)
    const solarGroup = new THREE.Group();
    centralHub.add(solarGroup);
    const panelGeom = new THREE.BoxGeometry(15, 0.2, 5);
    const panel1 = new THREE.Mesh(panelGeom, solarMat);
    panel1.position.set(10, 0, 0);
    const panel2 = new THREE.Mesh(panelGeom, solarMat);
    panel2.position.set(-10, 0, 0);
    solarGroup.add(panel1);
    solarGroup.add(panel2);
    solarGroup.position.y = 4;

    // 5. Docking Ports
    const dockGeom = new THREE.CylinderGeometry(1, 1, 2, 16);
    const dockingPort = new THREE.Mesh(dockGeom, darkMat);
    dockingPort.position.y = 6;
    centralHub.add(dockingPort);

    // 6. Radiator Panels
    const radGeom = new THREE.BoxGeometry(0.5, 8, 4);
    const rad1 = new THREE.Mesh(radGeom, radiatorMat);
    rad1.position.set(0, -2, 5);
    const rad2 = new THREE.Mesh(radGeom, radiatorMat);
    rad2.position.set(0, -2, -5);
    centralHub.add(rad1);
    centralHub.add(rad2);

    // 7. Communications Array
    const dishGeom = new THREE.SphereGeometry(1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const commArray = new THREE.Mesh(dishGeom, hullMat);
    commArray.position.set(0, 6, 2);
    commArray.rotation.x = Math.PI / 4;
    centralHub.add(commArray);

    // 8. Habitat Modules inside the Torus
    const habGeom = new THREE.BoxGeometry(2.5, 2.5, 4);
    for(let i=0; i<8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const hab = new THREE.Mesh(habGeom, habitatMat);
        hab.position.set(Math.cos(angle) * 20, 0, Math.sin(angle) * 20);
        hab.rotation.y = -angle;
        rotatingGroup.add(hab);
    }

    // 9. Observation Cupola
    const cupolaGeom = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupola = new THREE.Mesh(cupolaGeom, glassMat);
    cupola.position.set(0, -5, 0);
    cupola.rotation.x = Math.PI;
    centralHub.add(cupola);

    // 10. Attitude Control Thrusters
    const thrusterGeom = new THREE.ConeGeometry(0.3, 0.6, 8);
    for(let i=0; i<4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const thruster = new THREE.Mesh(thrusterGeom, darkMat);
        thruster.position.set(Math.cos(angle) * 2, -4, Math.sin(angle) * 2);
        thruster.rotation.x = Math.PI / 2;
        thruster.rotation.y = -angle;
        centralHub.add(thruster);
    }

    // Animation / Kinematics
    // R = 20m. g = v^2 / R = omega^2 * R. For 1g (9.81 m/s^2):
    // omega = sqrt(9.81 / 20) = 0.70035 rad/s.
    const omega = Math.sqrt(9.81 / 20); 
    
    group.tick = (delta, time) => {
        // Rotate torus to simulate 1g gravity at R=20m
        rotatingGroup.rotation.y += omega * delta;
        
        // Solar panels tracking a hypothetical sun position
        const sunAngle = time * 0.1;
        solarGroup.rotation.y = sunAngle;
        solarGroup.rotation.z = Math.sin(time * 0.05) * 0.2;
    };

    // Quizzes
    group.quizzes = [
        {
            question: "What dictates the artificial gravity experienced in the rotating torus?",
            options: [
                "The color of the hull",
                "The angular velocity and the radius of the torus",
                "The mass of the central hub",
                "The size of the solar arrays"
            ],
            answer: 1
        },
        {
            question: "In this model, with a radius of 20 meters, what is the required angular velocity to simulate 1g (9.81 m/s^2)?",
            options: [
                "~0.7 rad/s",
                "~1.4 rad/s",
                "~9.8 rad/s",
                "~20 rad/s"
            ],
            answer: 0
        },
        {
            question: "Why does the central hub typically not rotate with the torus?",
            options: [
                "It reduces the overall weight of the station",
                "It looks better",
                "To allow for easier docking of incoming spacecraft",
                "Because solar panels cannot rotate"
            ],
            answer: 2
        },
        {
            question: "What is the purpose of the radiator panels on a space station?",
            options: [
                "To generate heat",
                "To cool the station by radiating excess heat into space",
                "To absorb cosmic rays",
                "To act as a secondary communication array"
            ],
            answer: 1
        },
        {
            question: "How do attitude control thrusters help the station?",
            options: [
                "They provide primary propulsion for deep space travel",
                "They generate artificial gravity",
                "They manage the station's orientation and counteract torque from the rotating torus",
                "They increase the efficiency of the solar arrays"
            ],
            answer: 2
        },
        {
            question: "Why do the solar arrays need to track the sun?",
            options: [
                "To avoid overheating",
                "To maximize the amount of solar energy converted into electricity",
                "To block solar radiation from hitting the habitat modules",
                "To generate thrust via solar wind"
            ],
            answer: 1
        }
    ];

    return group;
}
