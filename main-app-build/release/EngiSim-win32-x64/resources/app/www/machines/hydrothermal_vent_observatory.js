export function createHydrothermalVentObservatory(THREE) {
    const model = new THREE.Group();
    const parts = [];

    // 1. Vent Chimney
    const chimneyGeo = new THREE.CylinderGeometry(0.8, 2.5, 8, 12);
    const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x2e3b32, roughness: 0.9 });
    const ventChimney = new THREE.Mesh(chimneyGeo, chimneyMat);
    ventChimney.position.set(-4, 4, 0);
    model.add(ventChimney);
    parts.push({ name: "Vent Chimney", description: "Natural mineral deposit emitting mineral-rich, superheated fluids from the Earth's crust.", mesh: ventChimney });

    // 2. Base Frame
    const frameGeo = new THREE.BoxGeometry(4, 0.5, 4);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 0.5 });
    const baseFrame = new THREE.Mesh(frameGeo, frameMat);
    baseFrame.position.set(2, 0.25, 0);
    
    const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    for(let i=0; i<4; i++) {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set((i%2===0?1.8:-1.8), 1, (i<2?1.8:-1.8));
        baseFrame.add(leg);
    }
    const platform = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 4), frameMat);
    platform.position.set(0, 2, 0);
    baseFrame.add(platform);
    model.add(baseFrame);
    parts.push({ name: "Base Frame", description: "Sturdy structural support keeping the scientific instruments stable on the uneven seafloor.", mesh: baseFrame });

    // 3. Seismometer
    const seismGeo = new THREE.SphereGeometry(0.6, 16, 16);
    const seismMat = new THREE.MeshStandardMaterial({ color: 0xcc5500, roughness: 0.7 });
    const seismometer = new THREE.Mesh(seismGeo, seismMat);
    seismometer.position.set(4, 0.6, 3);
    model.add(seismometer);
    parts.push({ name: "Seismometer", description: "Measures micro-earthquakes and tectonic activity related to magma movement.", mesh: seismometer });

    // 4. Mass Spectrometer
    const massSpecGeo = new THREE.BoxGeometry(1.2, 0.8, 1.2);
    const massSpecMat = new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.6 });
    const massSpectrometer = new THREE.Mesh(massSpecGeo, massSpecMat);
    massSpectrometer.position.set(2, 2.7, -1);
    model.add(massSpectrometer);
    parts.push({ name: "Mass Spectrometer", description: "Analyzes the chemical composition of vent fluids and dissolved gases in real-time.", mesh: massSpectrometer });

    // 5. Temperature Probes
    const probeGeo = new THREE.CylinderGeometry(0.05, 0.05, 3);
    const probeMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const temperatureProbes = new THREE.Group();
    for(let i=0; i<3; i++) {
        const p = new THREE.Mesh(probeGeo, probeMat);
        p.rotation.z = Math.PI / 2;
        p.position.set(0, 0.5 * i, 0.2 * i);
        temperatureProbes.add(p);
    }
    temperatureProbes.position.set(-2, 5, 0);
    model.add(temperatureProbes);
    parts.push({ name: "Temperature Probes", description: "High-temperature thermistors directly inserted into the vent fluid to monitor rapid thermal fluctuations.", mesh: temperatureProbes.children[0] });

    // 6. Acoustic Modem
    const modemGeo = new THREE.CylinderGeometry(0.2, 0.2, 1);
    const modemMat = new THREE.MeshStandardMaterial({ color: 0xddaa00, metalness: 0.5 });
    const acousticModem = new THREE.Mesh(modemGeo, modemMat);
    acousticModem.position.set(3.5, 2.8, 1.5);
    const modemLight = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
    modemLight.position.y = 0.5;
    acousticModem.add(modemLight);
    model.add(acousticModem);
    parts.push({ name: "Acoustic Modem", description: "Transmits data wirelessly through the water column to surface buoys using sound waves.", mesh: acousticModem });

    // 7. HD Camera System
    const camGeo = new THREE.BoxGeometry(0.6, 0.4, 0.8);
    const camMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const hdCamera = new THREE.Mesh(camGeo, camMat);
    hdCamera.position.set(0.5, 2.7, 0);
    hdCamera.lookAt(new THREE.Vector3(-4, 5, 0));
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.2), new THREE.MeshStandardMaterial({color: 0x2255ff, metalness: 0.8}));
    lens.rotation.x = Math.PI / 2;
    lens.position.z = -0.4;
    hdCamera.add(lens);
    model.add(hdCamera);
    parts.push({ name: "HD Camera System", description: "Captures high-resolution video of biological communities and vent fluid dynamics.", mesh: hdCamera });

    // 8. Titanium Housing
    const housingGeo = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 16);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x909099, metalness: 0.9, roughness: 0.2 });
    const titaniumHousing = new THREE.Mesh(housingGeo, housingMat);
    titaniumHousing.rotation.x = Math.PI / 2;
    titaniumHousing.position.set(2, 2.8, 1);
    model.add(titaniumHousing);
    parts.push({ name: "Titanium Housing", description: "Pressure-resistant enclosure protecting the main processing unit and power management systems from extreme depth pressures.", mesh: titaniumHousing });

    // 9. Cable Connectors
    const connectorGeo = new THREE.TorusGeometry(0.12, 0.04, 8, 16);
    const connectorMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.6 });
    const cableConnectors = new THREE.Group();
    for(let i=0; i<3; i++) {
        const c = new THREE.Mesh(connectorGeo, connectorMat);
        c.position.set(2, 2.8, 0.5 + i*0.4);
        c.rotation.y = Math.PI / 2;
        cableConnectors.add(c);
    }
    model.add(cableConnectors);
    parts.push({ name: "Cable Connectors", description: "Waterproof, oil-filled connectors distributing power and routing data between sensors and the central hub.", mesh: cableConnectors.children[0] });

    // 10. Flow Meter
    const flowMeterGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4);
    const flowMeterMat = new THREE.MeshStandardMaterial({ color: 0x4444ff });
    const flowMeter = new THREE.Mesh(flowMeterGeo, flowMeterMat);
    flowMeter.position.set(-3, 6, 1);
    
    const propeller = new THREE.Group();
    const bladeGeo = new THREE.BoxGeometry(0.8, 0.1, 0.1);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    const blade2 = new THREE.Mesh(bladeGeo, bladeMat);
    blade2.rotation.y = Math.PI / 2;
    propeller.add(blade1);
    propeller.add(blade2);
    propeller.position.y = 0.25;
    flowMeter.add(propeller);
    
    // Support rod for flow meter
    const rodGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const rod = new THREE.Mesh(rodGeo, rodMat);
    rod.rotation.z = Math.PI / 4;
    rod.position.set(0.5, -0.5, 0);
    flowMeter.add(rod);
    
    model.add(flowMeter);
    parts.push({ name: "Flow Meter", description: "Measures the velocity of the fluid escaping the vent to calculate total thermal and chemical output.", mesh: flowMeter });

    // Particles (Smoke/Bubbles from Vent)
    const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.6 });
    const particles = [];
    for(let i=0; i<25; i++) {
        const p = new THREE.Mesh(particleGeo, particleMat);
        p.position.set(-4 + (Math.random() - 0.5), 8 + Math.random() * 5, (Math.random() - 0.5));
        p.userData = { offset: Math.random() * 5, speed: 0.5 + Math.random() * 0.5 };
        model.add(p);
        particles.push(p);
    }

    const quizzes = [
        {
            question: "What is the primary function of the Titanium Housing?",
            options: [
                "To attract deep-sea marine life",
                "To protect sensitive electronics from extreme pressure",
                "To generate electricity from heat",
                "To store collected mineral samples"
            ],
            correctAnswer: 1
        },
        {
            question: "How does the observatory transmit data to the surface?",
            options: [
                "Through physical fiber-optic cables attached to boats",
                "Using an Acoustic Modem to send sound waves",
                "Via direct satellite radio links",
                "Releasing floating data drives"
            ],
            correctAnswer: 1
        },
        {
            question: "What does the Mass Spectrometer analyze?",
            options: [
                "The speed of the water current",
                "The structural integrity of the base frame",
                "The chemical composition of the vent fluids",
                "The size of the vent chimney"
            ],
            correctAnswer: 2
        },
        {
            question: "Which instrument measures tectonic activity and magma movement?",
            options: [
                "Seismometer",
                "Temperature Probes",
                "Flow Meter",
                "HD Camera System"
            ],
            correctAnswer: 0
        },
        {
            question: "Why are the Temperature Probes necessary?",
            options: [
                "To warm up the titanium housing",
                "To cool the surrounding seawater",
                "To monitor rapid thermal fluctuations in the vent fluid",
                "To measure the air temperature"
            ],
            correctAnswer: 2
        },
        {
            question: "What role do the Cable Connectors play in the deep-sea environment?",
            options: [
                "They anchor the observatory to the seafloor",
                "They provide waterproof data and power routing between instruments",
                "They transmit acoustic signals",
                "They capture particles from the vent smoke"
            ],
            correctAnswer: 1
        }
    ];

    function update(time) {
        // Spin propeller
        propeller.rotation.y = time * 4;
        
        // Blink acoustic modem light
        modemLight.material.color.setHex((Math.sin(time * 5) > 0) ? 0x00ff00 : 0x003300);

        // Animate particles
        particles.forEach(p => {
            p.position.y += p.userData.speed * 0.05;
            p.position.x += Math.sin(time + p.userData.offset) * 0.02;
            p.scale.setScalar(1 + (p.position.y - 8) * 0.15);
            p.material.opacity = Math.max(0, 0.6 - (p.position.y - 8) / 5);
            if (p.position.y > 13) {
                p.position.y = 8;
                p.position.x = -4 + (Math.random() - 0.5) * 0.5;
                p.scale.setScalar(1);
                p.material.opacity = 0.6;
            }
        });
    }

    return {
        model,
        update,
        parts,
        quizzes
    };
}
