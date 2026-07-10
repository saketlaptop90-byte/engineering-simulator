export function createOutbreakResponseCommandCenter(THREE) {
    const model = new THREE.Group();

    // Materials
    const screenMat = new THREE.MeshPhongMaterial({ color: 0x111111, emissive: 0x050511 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.6 });
    const redMat = new THREE.MeshPhongMaterial({ color: 0xff0000, emissive: 0x550000 });
    const lightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.8 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x005500 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });

    // 1. Central Strategy Table
    const tableGeom = new THREE.CylinderGeometry(2, 2, 0.5, 32);
    const table = new THREE.Mesh(tableGeom, metalMat);
    table.position.set(0, 0.25, 0);
    model.add(table);

    const hologramBaseGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const hologramBase = new THREE.Mesh(hologramBaseGeom, new THREE.MeshPhongMaterial({ color: 0x00ccff, emissive: 0x004488, transparent: true, opacity: 0.8 }));
    hologramBase.position.set(0, 0.55, 0);
    table.add(hologramBase);

    // 2. Global Map Display
    const mapGroup = new THREE.Group();
    mapGroup.position.set(0, 3, -4);
    model.add(mapGroup);
    
    const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(6.2, 3.2, 0.2), darkMetalMat);
    mapGroup.add(screenFrame);
    
    const screenDisplay = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 0.25), screenMat);
    mapGroup.add(screenDisplay);

    // Outbreak zones on the map
    const outbreakZones = [];
    const zoneGeom = new THREE.CircleGeometry(0.1, 16);
    const zoneMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.7 });
    for(let i = 0; i < 5; i++) {
        const zone = new THREE.Mesh(zoneGeom, zoneMat);
        zone.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2.5, 0.13);
        mapGroup.add(zone);
        outbreakZones.push({
            mesh: zone,
            baseScale: Math.random() * 0.5 + 0.5,
            phase: Math.random() * Math.PI * 2,
            speed: Math.random() * 2 + 1
        });
    }

    // 3. Epidemiology Workstations
    const deskGroup = new THREE.Group();
    for(let i = -1; i <= 1; i+=2) {
        const desk = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.8, 0.8), woodMat);
        desk.position.set(i * 3, 0.4, 1);
        deskGroup.add(desk);

        const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 0.1), screenMat);
        monitor.position.set(i * 3, 1.0, 0.8);
        monitor.rotation.x = -0.1;
        deskGroup.add(monitor);
    }
    model.add(deskGroup);

    // 4. Communication Antennas
    const antennaGroup = new THREE.Group();
    for(let i = -1; i <= 1; i+=2) {
        const poleGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const pole = new THREE.Mesh(poleGeom, metalMat);
        pole.position.set(i * 3.5, 3, -4);
        antennaGroup.add(pole);

        const dishGeom = new THREE.SphereGeometry(0.3, 16, 16, 0, Math.PI);
        const dish = new THREE.Mesh(dishGeom, metalMat);
        dish.position.set(i * 3.5, 3.8, -3.9);
        dish.rotation.x = -Math.PI / 4;
        antennaGroup.add(dish);
    }
    model.add(antennaGroup);

    // 5. Server Racks
    const rackGroup = new THREE.Group();
    const serverLights = [];
    for(let i = -1; i <= 1; i+=2) {
        const rack = new THREE.Mesh(new THREE.BoxGeometry(1, 2.5, 1), darkMetalMat);
        rack.position.set(i * 4, 1.25, -2);
        rackGroup.add(rack);

        // Data lights
        for(let j = 0; j < 5; j++) {
            const light = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.05, 1.05), new THREE.MeshBasicMaterial({color: 0x00ffff}));
            light.position.set(i * 4, 0.5 + j * 0.4, -2);
            rackGroup.add(light);
            serverLights.push(light);
        }
    }
    model.add(rackGroup);

    // 6. Alert Sirens
    const sirenGroup = new THREE.Group();
    const sirenGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
    const sirens = [];
    for(let i = -1; i <= 1; i+=2) {
        const siren = new THREE.Mesh(sirenGeom, redMat);
        siren.position.set(i * 2, 4, -4);
        siren.rotation.x = Math.PI / 2;
        sirenGroup.add(siren);
        sirens.push(siren);
    }
    model.add(sirenGroup);

    // 7. Personnel Seats
    const seatGroup = new THREE.Group();
    const seatGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    for(let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const seat = new THREE.Mesh(seatGeom, chairMat);
        seat.position.set(Math.cos(angle) * 3, 0.25, Math.sin(angle) * 3);
        seatGroup.add(seat);
    }
    model.add(seatGroup);

    // 8. Overhead Lighting
    const lightingGroup = new THREE.Group();
    const lightFrame = new THREE.Mesh(new THREE.TorusGeometry(3, 0.1, 8, 24), metalMat);
    lightFrame.rotation.x = Math.PI / 2;
    lightFrame.position.set(0, 4.5, 0);
    lightingGroup.add(lightFrame);

    for(let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), lightMat);
        bulb.position.set(Math.cos(angle) * 3, 4.4, Math.sin(angle) * 3);
        lightingGroup.add(bulb);
    }
    model.add(lightingGroup);

    // 9. Power Generator
    const generator = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 2), darkMetalMat);
    generator.position.set(0, 0.75, 4);
    model.add(generator);

    const fanGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 16);
    const fan = new THREE.Mesh(fanGeom, metalMat);
    fan.position.set(0, 0.75, 5);
    fan.rotation.x = Math.PI / 2;
    model.add(fan);

    // 10. Data Cables
    const cablesGroup = new THREE.Group();
    const cableCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(4, 0, -2),
        new THREE.Vector3(0, -0.5, -1),
        new THREE.Vector3(0, 0, 0)
    );
    const cableGeom = new THREE.TubeGeometry(cableCurve, 20, 0.05, 8, false);
    const cable1 = new THREE.Mesh(cableGeom, wireMat);
    cablesGroup.add(cable1);

    const cableCurve2 = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-4, 0, -2),
        new THREE.Vector3(0, -0.5, -1),
        new THREE.Vector3(0, 0, 0)
    );
    const cableGeom2 = new THREE.TubeGeometry(cableCurve2, 20, 0.05, 8, false);
    const cable2 = new THREE.Mesh(cableGeom2, wireMat);
    cablesGroup.add(cable2);

    model.add(cablesGroup);

    // Animation variables
    let time = 0;

    // Tick function
    model.tick = (delta) => {
        time += delta;

        // Animate Map outbreak zones
        outbreakZones.forEach(zone => {
            const scale = zone.baseScale + Math.sin(time * zone.speed + zone.phase) * 0.3;
            zone.mesh.scale.set(scale, scale, 1);
            zone.mesh.material.opacity = 0.5 + Math.sin(time * zone.speed + zone.phase) * 0.3;
        });

        // Animate Data flowing through server racks
        serverLights.forEach((light, index) => {
            light.material.color.setHSL((time * 0.5 + index * 0.1) % 1, 1, 0.5);
            light.scale.z = 1 + Math.sin(time * 5 + index) * 0.1;
        });

        // Rotate generator fan
        fan.rotation.y += delta * 5;

        // Alert sirens pulse
        const sirenIntensity = (Math.sin(time * 8) + 1) / 2;
        sirens.forEach(siren => {
            siren.material.emissiveIntensity = sirenIntensity;
        });
        
        // Hologram base pulse
        hologramBase.scale.x = 1 + Math.sin(time * 2) * 0.05;
        hologramBase.scale.z = 1 + Math.sin(time * 2) * 0.05;
    };

    // Quiz Questions
    const quiz = [
        {
            question: "What is the primary function of an epidemiology command center during an outbreak?",
            options: ["Coordinating response and analyzing data", "Treating infected patients directly", "Manufacturing vaccines", "Drafting new public health laws"],
            answer: 0,
            explanation: "An epidemiology command center acts as the central hub for gathering data, analyzing spread, and coordinating the overall public health response rather than providing direct clinical care."
        },
        {
            question: "Which term describes the first identified case of a disease outbreak?",
            options: ["Patient Zero (Index Case)", "Primary Vector", "Alpha Carrier", "Sentinel Case"],
            answer: 0,
            explanation: "The index case, often referred to as 'Patient Zero,' is the first documented case of a disease in an outbreak."
        },
        {
            question: "What is the basic reproduction number (R0) used for in epidemiology?",
            options: ["Estimating how contagious an infectious disease is", "Measuring the mortality rate", "Counting the total number of vaccines needed", "Calculating the incubation period"],
            answer: 0,
            explanation: "The R0 value estimates the average number of people who will contract a contagious disease from one person with that disease in a susceptible population."
        },
        {
            question: "Why are real-time global map displays crucial in an outbreak command center?",
            options: ["To track the geographic spread and velocity of the disease", "To monitor weather patterns", "To locate specific hospitals", "To monitor social media trends"],
            answer: 0,
            explanation: "Real-time mapping allows epidemiologists to visualize the geographical spread, identify hotspots, and deploy resources efficiently to contain the outbreak."
        },
        {
            question: "What is the role of communication antennas in an emergency public health response?",
            options: ["Ensuring uninterrupted data flow and coordination with field teams", "Emitting signals to neutralize the virus", "Broadcasting public television shows", "Controlling local traffic lights"],
            answer: 0,
            explanation: "Antennas and robust communication systems are vital for maintaining constant contact with field epidemiologists, hospitals, and government agencies."
        },
        {
            question: "What does 'contact tracing' involve in an outbreak scenario?",
            options: ["Identifying and monitoring individuals who may have been exposed to the disease", "Tracking the origin of the disease in animals", "Drawing maps of hospital layouts", "Testing all surfaces for the pathogen"],
            answer: 0,
            explanation: "Contact tracing is the process of identifying, assessing, and managing people who have been exposed to a disease to prevent onward transmission."
        }
    ];

    return {
        model,
        quiz
    };
}
