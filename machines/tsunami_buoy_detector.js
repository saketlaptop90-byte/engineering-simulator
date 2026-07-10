export function createTsunamiBuoyDetector(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // 1. SurfaceBuoy
    const buoyGeom = new THREE.CylinderGeometry(4, 4, 6, 32);
    const buoyMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    const surfaceBuoy = new THREE.Mesh(buoyGeom, buoyMat);
    surfaceBuoy.position.set(0, 50, 0);

    // 2. CommAntenna
    const antennaGeom = new THREE.CylinderGeometry(0.2, 0.2, 10, 8);
    const antennaMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    const commAntenna = new THREE.Mesh(antennaGeom, antennaMat);
    commAntenna.position.set(0, 58, 0);

    // 3. SolarPanels
    const solarGeom = new THREE.BoxGeometry(6, 0.5, 6);
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x000055 });
    const solarPanels = new THREE.Mesh(solarGeom, solarMat);
    solarPanels.position.set(0, 53.5, 0);

    // 4. MooringLine
    const lineGeom = new THREE.CylinderGeometry(0.1, 0.1, 100, 8);
    const lineMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const mooringLine = new THREE.Mesh(lineGeom, lineMat);
    mooringLine.position.set(0, 0, 0);

    // 5. Anchor
    const anchorGeom = new THREE.BoxGeometry(10, 4, 10);
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const anchor = new THREE.Mesh(anchorGeom, anchorMat);
    anchor.position.set(0, -50, 0);

    // 6. BottomPressureRecorder
    const bprGeom = new THREE.BoxGeometry(3, 3, 3);
    const bprMat = new THREE.MeshStandardMaterial({ color: 0xff8800 });
    const bpr = new THREE.Mesh(bprGeom, bprMat);
    bpr.position.set(5, -48.5, 0);

    // 7. AcousticTransducer
    const transGeom = new THREE.ConeGeometry(1, 2, 16);
    const transMat = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const transducer = new THREE.Mesh(transGeom, transMat);
    transducer.position.set(5, -46, 0);

    // 8. CPUHousing
    const cpuGeom = new THREE.BoxGeometry(2, 2, 2);
    const cpuMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const cpuHousing = new THREE.Mesh(cpuGeom, cpuMat);
    cpuHousing.position.set(0, 50, 0); // Located inside/on the surface buoy

    // 9. BatteryPack
    const batteryGeom = new THREE.BoxGeometry(2, 2, 4);
    const batteryMat = new THREE.MeshStandardMaterial({ color: 0x22aa22 });
    const batteryPack = new THREE.Mesh(batteryGeom, batteryMat);
    batteryPack.position.set(8, -49, 0); // Located near the BPR

    // 10. FlotationModules
    const floatGeom = new THREE.SphereGeometry(1.5, 16, 16);
    const floatMat = new THREE.MeshStandardMaterial({ color: 0xff6600 });
    const flotationModules = new THREE.Mesh(floatGeom, floatMat);
    flotationModules.position.set(0, -20, 0); // Attached to the mooring line

    // Add exactly 10 distinct parts to the group
    const objects = [
        { name: "SurfaceBuoy", mesh: surfaceBuoy },
        { name: "CommAntenna", mesh: commAntenna },
        { name: "SolarPanels", mesh: solarPanels },
        { name: "MooringLine", mesh: mooringLine },
        { name: "Anchor", mesh: anchor },
        { name: "BottomPressureRecorder", mesh: bpr },
        { name: "AcousticTransducer", mesh: transducer },
        { name: "CPUHousing", mesh: cpuHousing },
        { name: "BatteryPack", mesh: batteryPack },
        { name: "FlotationModules", mesh: flotationModules }
    ];

    objects.forEach(obj => {
        group.add(obj.mesh);
        parts.push(obj.name);
    });

    // --- Animation Entities ---
    
    // Acoustic Ping (travels from transducer up to the surface buoy)
    const pingGeom = new THREE.SphereGeometry(0.8, 16, 16);
    const pingMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.8 });
    const ping = new THREE.Mesh(pingGeom, pingMat);
    ping.position.set(5, -46, 0);
    group.add(ping);

    // Radio Wave (emitted from antenna to satellite)
    const waveGeom = new THREE.TorusGeometry(3, 0.2, 16, 50);
    const waveMat = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0 });
    const radioWave = new THREE.Mesh(waveGeom, waveMat);
    radioWave.position.set(0, 63, 0);
    radioWave.rotation.x = Math.PI / 2;
    group.add(radioWave);

    // Separate material instance for BPR to animate anomaly detection (pulsing)
    const anomalyMat = bprMat.clone();
    bpr.material = anomalyMat;

    group.userData = {
        parts: parts,
        animation: function(time) {
            // Speed factor
            const t = time * 1.5; 

            // 1. BottomPressureRecorder detects anomaly (pulses color from orange to red)
            const pulse = (Math.sin(t * 6) + 1) / 2;
            anomalyMat.color.setRGB(1, 0.5 - pulse * 0.5, 0);

            // 2. Acoustic Ping travels up
            const cycle = t % 4; // 4-second animation cycle
            if (cycle < 2.5) {
                // Ping moves from y = -46 up to y = 50
                const progress = cycle / 2.5;
                ping.position.y = -46 + progress * 96;
                // Ping moves horizontally from BPR to Mooring line
                ping.position.x = 5 - progress * 5;
                ping.material.opacity = 1 - progress * 0.5;
            } else {
                // Reset ping
                ping.position.set(5, -46, 0);
                ping.material.opacity = 0;
            }

            // 3. Surface Buoy transmits data (Radio waves expand from antenna)
            if (cycle >= 2.5) {
                const waveTime = (cycle - 2.5) / 1.5; // Normalized to 0-1 over 1.5 seconds
                const scale = 1 + waveTime * 5;
                radioWave.scale.set(scale, scale, scale);
                radioWave.material.opacity = 1 - waveTime;
            } else {
                radioWave.scale.set(0.1, 0.1, 0.1);
                radioWave.material.opacity = 0;
            }
        },
        quiz: [
            {
                question: "What is the primary function of a Bottom Pressure Recorder (BPR) in a tsunami detection system?",
                options: [
                    "To measure the speed of ocean currents",
                    "To detect slight changes in water pressure caused by passing tsunamis",
                    "To measure the ocean surface temperature",
                    "To anchor the surface buoy directly to the seabed"
                ],
                correctAnswer: 1
            },
            {
                question: "How does the Bottom Pressure Recorder communicate its anomaly data to the surface buoy?",
                options: [
                    "Via a physical fiber optic cable running up the mooring line",
                    "Through acoustic telemetry (underwater sound waves)",
                    "Using wireless Bluetooth technology",
                    "By releasing small buoyant data packages to the surface"
                ],
                correctAnswer: 1
            },
            {
                question: "Why does the surface buoy need a CommAntenna?",
                options: [
                    "To catch radio signals from passing ships",
                    "To receive acoustic pings from the seabed",
                    "To act as a lightning rod to protect the circuits",
                    "To transmit the detected anomaly data to satellites for early warning"
                ],
                correctAnswer: 3
            },
            {
                question: "What powers the surface components of the tsunami detector over long deployment periods?",
                options: [
                    "Solar panels",
                    "Diesel generators",
                    "Wind turbines",
                    "Geothermal energy"
                ],
                correctAnswer: 0
            },
            {
                question: "What is the purpose of Flotation Modules attached to the mooring line?",
                options: [
                    "To keep the line taut and support underwater acoustic receivers",
                    "To mark the location for commercial fishing ships",
                    "To measure wind-driven wave height",
                    "To provide emergency buoyancy for the heavy anchor"
                ],
                correctAnswer: 0
            },
            {
                question: "How does a tsunami wave in the deep ocean differ fundamentally from a wind-driven surface wave?",
                options: [
                    "It only affects the top few meters of the water column",
                    "It travels much slower than a wind-driven wave",
                    "It has a very short wavelength and high frequency",
                    "It affects the entire water column down to the seabed, changing the bottom pressure"
                ],
                correctAnswer: 3
            }
        ]
    };

    return group;
}
