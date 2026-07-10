import * as THREE from 'three';

export function createGlacialPreserver(THREE_LIB) {
    const T = THREE_LIB || THREE;
    const group = new T.Group();
    const parts = [];

    // --- Materials ---
    const iceMat = new T.MeshStandardMaterial({ color: 0x88ccee, metalness: 0.1, roughness: 0.15, transparent: true, opacity: 0.65 });
    const frameMat = new T.MeshStandardMaterial({ color: 0x556677, metalness: 0.85, roughness: 0.2 });
    const pipeMat = new T.MeshStandardMaterial({ color: 0x334466, metalness: 0.7, roughness: 0.3 });
    const coolantMat = new T.MeshStandardMaterial({ color: 0x00bbff, emissive: 0x0066aa, emissiveIntensity: 0.4, transparent: true, opacity: 0.6 });
    const panelMat = new T.MeshStandardMaterial({ color: 0x445566, metalness: 0.6, roughness: 0.4 });
    const sensorMat = new T.MeshStandardMaterial({ color: 0x33ff77, emissive: 0x22cc55, emissiveIntensity: 0.5 });
    const baseMat = new T.MeshStandardMaterial({ color: 0x3a3f4a, metalness: 0.7, roughness: 0.45 });
    const glacierMat = new T.MeshStandardMaterial({ color: 0xaaddff, metalness: 0.0, roughness: 0.3, transparent: true, opacity: 0.75 });
    const cryoMat = new T.MeshStandardMaterial({ color: 0x55aaff, emissive: 0x2288cc, emissiveIntensity: 0.6 });

    // --- Base Platform ---
    const base = new T.Mesh(new T.CylinderGeometry(5, 5.5, 0.6, 32), baseMat);
    base.position.y = -3;
    base.userData = { name: 'Foundation Platform', material: 'Reinforced Concrete', function: 'Structural base for preservation chamber', connections: ['Support Pillars', 'Coolant Lines'], failure: 'Total structural collapse' };
    group.add(base);
    parts.push(base.userData);

    // --- Support Pillars ---
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const pillar = new T.Mesh(new T.CylinderGeometry(0.2, 0.25, 5, 8), frameMat);
        pillar.position.set(Math.cos(angle) * 4.2, 0, Math.sin(angle) * 4.2);
        pillar.userData = { name: `Support Pillar ${i + 1}`, material: 'Cryogenic Steel', function: 'Structural support for containment dome' };
        group.add(pillar);
        parts.push(pillar.userData);
    }

    // --- Containment Dome (outer shell) ---
    const domeOuter = new T.Mesh(new T.SphereGeometry(4.5, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2), frameMat);
    domeOuter.position.y = 0;
    domeOuter.userData = { name: 'Containment Dome Shell', material: 'Titanium Alloy', function: 'Insulated outer containment shell', connections: ['Support Pillars', 'Cryo Coils'], failure: 'Thermal breach — ice loss' };
    group.add(domeOuter);
    parts.push(domeOuter.userData);

    // --- Inner Ice Core (glacier sample) ---
    const iceCore = new T.Mesh(new T.DodecahedronGeometry(2.2, 1), glacierMat);
    iceCore.position.y = 1.5;
    iceCore.userData = { name: 'Preserved Glacier Core', material: 'Antarctic Ice (10,000+ years)', function: 'Primary preservation target — climate record', connections: ['Cryogenic Coils'], failure: 'Catastrophic melting — data loss' };
    group.add(iceCore);
    parts.push(iceCore.userData);

    // --- Cryogenic Cooling Coils ---
    const coilCurve = new T.TorusGeometry(3.2, 0.12, 8, 48);
    for (let j = 0; j < 4; j++) {
        const coil = new T.Mesh(coilCurve, coolantMat);
        coil.position.y = -0.5 + j * 1.2;
        coil.rotation.x = Math.PI / 2;
        coil.userData = { name: `Cryo Cooling Ring ${j + 1}`, material: 'Copper-Nickel Alloy', function: 'Circulates liquid nitrogen to maintain sub-zero temperatures', connections: ['Coolant Pump', 'Ice Core'], failure: 'Temperature rise — ice degradation' };
        group.add(coil);
        parts.push(coil.userData);
    }

    // --- Coolant Pump Unit ---
    const pumpBody = new T.Mesh(new T.CylinderGeometry(0.6, 0.6, 1.2, 16), pipeMat);
    pumpBody.position.set(4.5, -1.5, 0);
    pumpBody.userData = { name: 'Cryogenic Coolant Pump', material: 'Stainless Steel', function: 'Pressurizes and circulates liquid nitrogen through cooling coils', connections: ['Cryo Cooling Rings', 'Coolant Reservoir'], failure: 'Coolant circulation stops' };
    group.add(pumpBody);
    parts.push(pumpBody.userData);

    // Pump motor
    const motor = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 0.6, 12), sensorMat);
    motor.position.set(4.5, -0.7, 0);
    motor.userData = { name: 'Pump Motor', material: 'Copper Windings', function: 'Drives the coolant pump impeller' };
    group.add(motor);
    parts.push(motor.userData);

    // --- Coolant Supply Lines ---
    for (let k = 0; k < 3; k++) {
        const angle = (k / 3) * Math.PI * 2 + 0.5;
        const pipe = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 4, 8), pipeMat);
        pipe.position.set(Math.cos(angle) * 3.8, -1, Math.sin(angle) * 3.8);
        pipe.userData = { name: `Coolant Line ${k + 1}`, material: 'Insulated Copper', function: 'Delivers liquid nitrogen to cooling coils' };
        group.add(pipe);
        parts.push(pipe.userData);
    }

    // --- Temperature Sensors ---
    for (let s = 0; s < 8; s++) {
        const angle = (s / 8) * Math.PI * 2;
        const sensor = new T.Mesh(new T.SphereGeometry(0.1, 8, 8), sensorMat);
        sensor.position.set(Math.cos(angle) * 2.8, 0.5 + Math.sin(s) * 0.8, Math.sin(angle) * 2.8);
        sensor.userData = { name: `Temperature Sensor ${s + 1}`, material: 'Thermocouple', function: 'Monitors internal chamber temperature in real-time' };
        group.add(sensor);
        parts.push(sensor.userData);
    }

    // --- Control Panel ---
    const panel = new T.Mesh(new T.BoxGeometry(1.2, 0.8, 0.15), panelMat);
    panel.position.set(-4.5, 0, 0);
    panel.rotation.y = Math.PI / 2;
    panel.userData = { name: 'Control Panel', material: 'Aluminum Housing', function: 'System monitoring and temperature control interface', connections: ['Temperature Sensors', 'Coolant Pump'], failure: 'Loss of monitoring — undetected thaw' };
    group.add(panel);
    parts.push(panel.userData);

    // Screen on panel
    const screen = new T.Mesh(new T.PlaneGeometry(0.9, 0.55), new T.MeshStandardMaterial({ color: 0x001133, emissive: 0x0044aa, emissiveIntensity: 0.8 }));
    screen.position.set(-4.42, 0.05, 0);
    screen.rotation.y = Math.PI / 2;
    screen.userData = { name: 'Display Screen', material: 'LCD', function: 'Shows temperature readouts and system status' };
    group.add(screen);
    parts.push(screen.userData);

    // --- Cryo Emission Nozzles ---
    for (let n = 0; n < 6; n++) {
        const angle = (n / 6) * Math.PI * 2;
        const nozzle = new T.Mesh(new T.ConeGeometry(0.15, 0.4, 8), cryoMat);
        nozzle.position.set(Math.cos(angle) * 2.5, 3.2, Math.sin(angle) * 2.5);
        nozzle.rotation.x = Math.PI;
        nozzle.userData = { name: `Cryo Nozzle ${n + 1}`, material: 'Brass', function: 'Sprays atomized liquid nitrogen onto glacier core' };
        group.add(nozzle);
        parts.push(nozzle.userData);
    }

    // --- Emergency Vent ---
    const vent = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.8, 12), frameMat);
    vent.position.set(0, 4.8, 0);
    vent.userData = { name: 'Emergency Pressure Vent', material: 'Steel', function: 'Releases excess pressure if coolant boils off unexpectedly', connections: ['Containment Dome'], failure: 'Overpressure rupture' };
    group.add(vent);
    parts.push(vent.userData);

    // --- Insulation Panels (inner dome) ---
    const insulation = new T.Mesh(new T.SphereGeometry(4.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshStandardMaterial({ color: 0x667788, metalness: 0.1, roughness: 0.9, transparent: true, opacity: 0.3, side: T.BackSide }));
    insulation.position.y = 0;
    insulation.userData = { name: 'Aerogel Insulation Layer', material: 'Silica Aerogel', function: 'Minimizes thermal conduction through dome wall' };
    group.add(insulation);
    parts.push(insulation.userData);

    // --- Coolant Reservoir Tank ---
    const reservoir = new T.Mesh(new T.CylinderGeometry(0.8, 0.8, 2.5, 16), pipeMat);
    reservoir.position.set(4.5, -2.5, 2);
    reservoir.userData = { name: 'Liquid Nitrogen Reservoir', material: 'Stainless Steel', function: 'Stores bulk liquid nitrogen supply', connections: ['Coolant Pump'], failure: 'Coolant depletion — rapid thaw' };
    group.add(reservoir);
    parts.push(reservoir.userData);

    // --- Animation ---
    const animParts = { iceCore, coilRings: [], nozzles: [], sensors: [] };
    group.children.forEach(c => {
        if (c.userData.name && c.userData.name.includes('Cryo Cooling Ring')) animParts.coilRings.push(c);
        if (c.userData.name && c.userData.name.includes('Cryo Nozzle')) animParts.nozzles.push(c);
        if (c.userData.name && c.userData.name.includes('Temperature Sensor')) animParts.sensors.push(c);
    });

    function animate(delta) {
        const t = performance.now() * 0.001;
        // Ice core slowly rotates and pulses
        iceCore.rotation.y += delta * 0.1;
        iceCore.scale.setScalar(1 + Math.sin(t * 0.5) * 0.02);

        // Cooling coils pulse
        animParts.coilRings.forEach((ring, i) => {
            ring.material.opacity = 0.4 + Math.sin(t * 2 + i * 1.5) * 0.2;
        });

        // Sensors blink
        animParts.sensors.forEach((sensor, i) => {
            sensor.material.emissiveIntensity = 0.3 + Math.sin(t * 4 + i) * 0.3;
        });

        // Nozzles glow pulsation
        animParts.nozzles.forEach((nozzle, i) => {
            nozzle.material.emissiveIntensity = 0.4 + Math.sin(t * 3 + i * 0.8) * 0.3;
        });
    }

    return {
        group,
        parts,
        name: 'Glacial Preserver',
        description: 'An advanced cryogenic preservation chamber designed to maintain ancient glacier ice cores at sub-zero temperatures for climate research. Uses liquid nitrogen cooling coils, aerogel insulation, and precision temperature monitoring to prevent degradation of 10,000+ year-old ice samples that contain invaluable atmospheric data.',
        animate,
        quizQuestions: [
            {
                question: 'What is the primary scientific value of deep ice cores from glaciers?',
                options: ['They contain fossils', 'Trapped gas bubbles record past atmospheric composition', 'They are sources of pure drinking water', 'They contain rare minerals'],
                correct: 1,
                explanation: 'Ice cores trap tiny bubbles of ancient atmosphere, allowing scientists to measure CO₂, methane, and other gases going back hundreds of thousands of years.'
            },
            {
                question: 'What temperature must glacier ice cores typically be stored at to prevent degradation?',
                options: ['0°C', '-10°C', '-20°C or colder', '-196°C (liquid nitrogen)'],
                correct: 2,
                explanation: 'Ice cores are typically stored at -20°C to -36°C in specialized freezer facilities to prevent recrystallization and gas loss.'
            },
            {
                question: 'Which insulation material has one of the lowest thermal conductivities known?',
                options: ['Fiberglass', 'Polystyrene foam', 'Silica aerogel', 'Mineral wool'],
                correct: 2,
                explanation: 'Silica aerogel has a thermal conductivity of ~0.015 W/(m·K), making it one of the best insulators available, used in cryogenic and space applications.'
            },
            {
                question: 'What gas is most commonly used as a cryogenic coolant in preservation systems?',
                options: ['Carbon dioxide', 'Argon', 'Liquid nitrogen', 'Helium'],
                correct: 2,
                explanation: 'Liquid nitrogen (LN₂) at -196°C is the most widely used cryogenic coolant due to its low cost, inertness, and extreme cold temperature.'
            },
            {
                question: 'The longest ice core ever drilled reached how far back in time?',
                options: ['50,000 years', '200,000 years', '800,000 years', '4.5 billion years'],
                correct: 2,
                explanation: 'The EPICA Dome C ice core from Antarctica reached back approximately 800,000 years, providing the longest continuous climate record from ice.'
            }
        ]
    };
}