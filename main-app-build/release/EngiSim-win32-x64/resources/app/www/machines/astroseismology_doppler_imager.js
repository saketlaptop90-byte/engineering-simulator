import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials for visual flair
    const neonBlue = new THREE.MeshStandardMaterial({
        color: 0x0088ff,
        emissive: 0x0088ff,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const neonRed = new THREE.MeshStandardMaterial({
        color: 0xff2200,
        emissive: 0xff2200,
        emissiveIntensity: 0.8,
        metalness: 0.5,
        roughness: 0.2
    });

    const stellarShiftMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x8844ff,
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.6
    });

    // 1. Base Support
    const baseGeo = new THREE.CylinderGeometry(3, 3.5, 1, 32);
    const baseMesh = new THREE.Mesh(baseGeo, darkSteel);
    baseMesh.position.set(0, -2, 0);
    group.add(baseMesh);
    parts.push({
        name: 'Mounting Base',
        description: 'Stabilizes the imager to prevent terrestrial vibrations from corrupting stellar oscillation data.',
        material: 'darkSteel',
        function: 'Structural support and vibration dampening.',
        assemblyOrder: 1,
        connections: ['Main Yoke'],
        failureEffect: 'Vibrational noise exceeds signal strength.',
        cascadeFailures: ['Spectrometer misalignment', 'Tracking error'],
        originalPosition: { x: 0, y: -2, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: baseMesh
    });

    // 2. Main Yoke
    const yokeGeo = new THREE.BoxGeometry(2.5, 4, 1.5);
    const yokeMesh = new THREE.Mesh(yokeGeo, steel);
    yokeMesh.position.set(0, 0.5, 0);
    group.add(yokeMesh);
    parts.push({
        name: 'Main Yoke',
        description: 'Heavy duty alt-azimuth mount yoke for precision tracking of target stars.',
        material: 'steel',
        function: 'Supports the optical tube and houses tracking motors.',
        assemblyOrder: 2,
        connections: ['Mounting Base', 'Optical Tube'],
        failureEffect: 'Loss of tracking accuracy.',
        cascadeFailures: ['Target acquired loss', 'Data corruption'],
        originalPosition: { x: 0, y: 0.5, z: 0 },
        explodedPosition: { x: 0, y: 0.5, z: 5 },
        mesh: yokeMesh
    });

    // 3. Optical Tube (Primary Telescope)
    const tubeGeo = new THREE.CylinderGeometry(1.2, 1.2, 6, 32);
    const tubeMesh = new THREE.Mesh(tubeGeo, aluminum);
    tubeMesh.rotation.z = Math.PI / 2;
    tubeMesh.position.set(0, 2, 0);
    group.add(tubeMesh);
    parts.push({
        name: 'Primary Optical Tube',
        description: 'Gathers light from the target star and focuses it into the spectrometer.',
        material: 'aluminum',
        function: 'Light collection and focusing.',
        assemblyOrder: 3,
        connections: ['Main Yoke', 'Primary Lens', 'Spectrometer'],
        failureEffect: 'Reduced light intake, signal loss.',
        cascadeFailures: ['Spectrometer signal drop'],
        originalPosition: { x: 0, y: 2, z: 0 },
        explodedPosition: { x: -4, y: 5, z: 0 },
        mesh: tubeMesh
    });

    // 4. Primary Lens
    const lensGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.2, 32);
    const lensMesh = new THREE.Mesh(lensGeo, glass);
    lensMesh.rotation.z = Math.PI / 2;
    lensMesh.position.set(-3, 2, 0);
    group.add(lensMesh);
    parts.push({
        name: 'Aperture Lens',
        description: 'High-precision fused silica lens to prevent chromatic aberration.',
        material: 'glass',
        function: 'Focuses incoming starlight.',
        assemblyOrder: 4,
        connections: ['Primary Optical Tube'],
        failureEffect: 'Blurry or distorted starlight.',
        cascadeFailures: ['Doppler shift miscalculation'],
        originalPosition: { x: -3, y: 2, z: 0 },
        explodedPosition: { x: -8, y: 2, z: 0 },
        mesh: lensMesh
    });

    // 5. Doppler Spectrometer
    const specGeo = new THREE.BoxGeometry(2, 2, 2);
    const specMesh = new THREE.Mesh(specGeo, chrome);
    specMesh.position.set(3, 2, 0);
    group.add(specMesh);
    parts.push({
        name: 'Doppler Spectrometer',
        description: 'Ultra-stable spectrometer that splits light and measures minute blue and red shifts.',
        material: 'chrome',
        function: 'Measures radial velocity changes due to stellar oscillations.',
        assemblyOrder: 5,
        connections: ['Primary Optical Tube', 'Data Processor'],
        failureEffect: 'Cannot detect frequency shifts.',
        cascadeFailures: ['Complete operational failure'],
        originalPosition: { x: 3, y: 2, z: 0 },
        explodedPosition: { x: 7, y: 2, z: 0 },
        mesh: specMesh
    });

    // 6. Data Processor & Cooling Unit
    const procGeo = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 16);
    const procMesh = new THREE.Mesh(procGeo, copper);
    procMesh.position.set(3, 0.5, 0);
    group.add(procMesh);
    parts.push({
        name: 'Cryo-Cooling Processor',
        description: 'Cryogenically cooled data processing unit to minimize thermal noise in the CCD.',
        material: 'copper',
        function: 'Analyzes spectrum data and cools the sensor.',
        assemblyOrder: 6,
        connections: ['Doppler Spectrometer'],
        failureEffect: 'Thermal noise overwhelms the signal.',
        cascadeFailures: ['Spectrometer overheat', 'Processor failure'],
        originalPosition: { x: 3, y: 0.5, z: 0 },
        explodedPosition: { x: 7, y: -2, z: 0 },
        mesh: procMesh
    });

    // 7. Shifting Target Display (Hologram of Star)
    const holoGeo = new THREE.SphereGeometry(1, 32, 32);
    const holoMesh = new THREE.Mesh(holoGeo, stellarShiftMat);
    holoMesh.position.set(-1, 4.5, 0);
    group.add(holoMesh);
    parts.push({
        name: 'Stellar Oscillation Hologram',
        description: 'Real-time 3D representation of the observed star\'s pressure and gravity waves.',
        material: 'custom (stellarShift)',
        function: 'Visualizes the Doppler data as a pulsating star.',
        assemblyOrder: 7,
        connections: ['Data Processor'],
        failureEffect: 'Loss of visual feedback.',
        cascadeFailures: [],
        originalPosition: { x: -1, y: 4.5, z: 0 },
        explodedPosition: { x: -1, y: 8, z: 0 },
        mesh: holoMesh
    });

    // 8. Red/Blue Shift Indicators
    const indicatorGeo = new THREE.TorusGeometry(1.2, 0.05, 16, 64);
    
    const blueRing = new THREE.Mesh(indicatorGeo, neonBlue);
    blueRing.rotation.x = Math.PI / 2;
    blueRing.position.set(-1, 4.5, 0);
    group.add(blueRing);
    
    const redRing = new THREE.Mesh(indicatorGeo, neonRed);
    redRing.rotation.y = Math.PI / 2;
    redRing.position.set(-1, 4.5, 0);
    group.add(redRing);
    
    parts.push({
        name: 'Doppler Shift Rings',
        description: 'Neon rings indicating the current extremity of radial velocity (blue=toward, red=away).',
        material: 'custom (neon)',
        function: 'Indicates radial velocity direction and magnitude.',
        assemblyOrder: 8,
        connections: ['Stellar Oscillation Hologram'],
        failureEffect: 'No shift direction data displayed.',
        cascadeFailures: [],
        originalPosition: { x: -1, y: 4.5, z: 0 },
        explodedPosition: { x: -4, y: 8, z: 0 },
        mesh: blueRing
    });
    // Link red ring to the same part for animations
    redRing.userData.isPaired = true;
    blueRing.userData.pairedMesh = redRing;

    const description = "The Astroseismology Doppler Imager measures the internal structure of stars by observing their surface pulsations. It detects minute periodic shifts in the star's spectrum (Doppler shift) caused by sound waves bouncing around inside the star.";

    const quizQuestions = [
        {
            question: "What physical phenomenon does the Astroseismology Doppler Imager primarily measure?",
            options: [
                "The star's magnetic field strength",
                "The radial velocity shifts (Doppler shifts) of the star's surface",
                "The exact distance to the star using parallax",
                "The star's total mass by observing binary companions"
            ],
            correct: 1,
            explanation: "Astroseismology relies on measuring minute shifts in the star's spectral lines as its surface moves towards (blue shift) and away (red shift) from the observer due to internal sound waves.",
            difficulty: "Medium"
        },
        {
            question: "Why is the Data Processor cryogenically cooled?",
            options: [
                "To prevent the optical tube from melting",
                "To reduce thermal noise in the CCD sensors for ultra-precise measurements",
                "Because space is cold and the machine must match the ambient temperature",
                "To speed up the computer's clock cycles"
            ],
            correct: 1,
            explanation: "Measuring tiny Doppler shifts requires an extremely high signal-to-noise ratio. Cooling the spectrometer's sensors minimizes thermal 'dark current' noise.",
            difficulty: "Hard"
        },
        {
            question: "What do the red and blue neon rings in the hologram represent?",
            options: [
                "Power and Data transmission lines",
                "Magnetic North and South poles of the star",
                "The star's surface moving away from us (redshift) and towards us (blueshift)",
                "Heat distribution across the star's surface"
            ],
            correct: 2,
            explanation: "In astrophysics, light from an object moving away is stretched to longer (redder) wavelengths, while light from an object moving towards us is compressed to shorter (bluer) wavelengths.",
            difficulty: "Easy"
        }
    ];

    function animate(time, speed, meshes) {
        const t = time * speed;
        
        let holoMesh, blueRing, redRing;
        meshes.forEach(m => {
            if (m.geometry.type === 'SphereGeometry') holoMesh = m;
            if (m.geometry.type === 'TorusGeometry') {
                if (m.material.color.getHex() === 0x0088ff) blueRing = m;
                if (m.material.color.getHex() === 0xff2200) redRing = m;
            }
        });

        // Pulsating hologram effect
        if (holoMesh) {
            const scale = 1 + Math.sin(t * 3) * 0.05;
            holoMesh.scale.set(scale, scale, scale);
            holoMesh.rotation.y = t * 0.5;
            holoMesh.rotation.z = t * 0.2;
            
            const phase = Math.sin(t * 3);
            if (phase > 0) {
                holoMesh.material.emissive.setHex(0x0044ff);
                holoMesh.material.emissiveIntensity = 0.5 + phase * 0.5;
            } else {
                holoMesh.material.emissive.setHex(0xff2200);
                holoMesh.material.emissiveIntensity = 0.5 + Math.abs(phase) * 0.5;
            }
        }

        // Rotating rings
        if (blueRing) {
            blueRing.rotation.z = t * 2;
            blueRing.scale.setScalar(1 + Math.sin(t * 3) * 0.1);
        }
        if (redRing) {
            redRing.rotation.z = -t * 2.5;
            redRing.scale.setScalar(1 + Math.cos(t * 3) * 0.1);
        }
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createDopplerImager() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
