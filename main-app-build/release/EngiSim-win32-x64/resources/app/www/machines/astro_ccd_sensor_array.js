import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // Custom glowing materials
    const photonGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.8
    });

    const readOutGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
        emissiveIntensity: 1.2,
        roughness: 0.2,
        metalness: 0.5
    });
    
    const coolingGlowMaterial = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        emissive: 0x0022ff,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const pcbMaterial = new THREE.MeshStandardMaterial({
        color: 0x003300,
        roughness: 0.8,
        metalness: 0.1
    });

    const goldContactMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.1,
        metalness: 1.0
    });

    // 1. Base / Dewar (Cryogenic Chamber)
    const dewarGeometry = new THREE.CylinderGeometry(8, 8, 10, 32);
    const dewarMesh = new THREE.Mesh(dewarGeometry, aluminum);
    dewarMesh.position.set(0, -5, 0);
    group.add(dewarMesh);
    parts.push({
        name: 'Cryogenic Dewar',
        description: 'A vacuum-sealed chamber that houses the CCD array, maintaining extremely low temperatures to reduce thermal noise (dark current).',
        material: 'Aluminum',
        function: 'Thermal Isolation & Structural Support',
        assemblyOrder: 1,
        connections: ['Cryo Cooler', 'Sensor Backplane'],
        failureEffect: 'Thermal leaks increase dark current, obscuring faint astronomical signals.',
        cascadeFailures: ['Sensor Array (Overheating)'],
        originalPosition: { x: 0, y: -5, z: 0 },
        explodedPosition: { x: 0, y: -15, z: 0 },
        mesh: dewarMesh
    });

    // 2. Cryo Cooler (Thermoelectric / Stirling)
    const coolerGeometry = new THREE.BoxGeometry(4, 6, 4);
    const coolerMesh = new THREE.Mesh(coolerGeometry, darkSteel);
    coolerMesh.position.set(0, -12, 0);
    group.add(coolerMesh);
    parts.push({
        name: 'Cryocooler Unit',
        description: 'Actively cools the sensor array down to -100°C or lower using closed-cycle helium or liquid nitrogen.',
        material: 'Dark Steel / Copper',
        function: 'Active Heat Extraction',
        assemblyOrder: 2,
        connections: ['Cryogenic Dewar', 'Heat Sink'],
        failureEffect: 'Rapid temperature rise in the CCD, rendering images useless due to thermal electron generation.',
        cascadeFailures: ['CCD Array', 'Dewar Vacuum'],
        originalPosition: { x: 0, y: -12, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 0 },
        mesh: coolerMesh
    });

    // 3. Sensor Backplane (PCB)
    const backplaneGeometry = new THREE.CylinderGeometry(6, 6, 0.5, 32);
    const backplaneMesh = new THREE.Mesh(backplaneGeometry, pcbMaterial);
    backplaneMesh.position.set(0, -0.5, 0);
    group.add(backplaneMesh);
    parts.push({
        name: 'Readout Electronics Backplane',
        description: 'Multi-layer printed circuit board routing high-speed clock signals and analog video outputs from the CCDs.',
        material: 'FR4 / Copper',
        function: 'Signal Routing & Component Mounting',
        assemblyOrder: 3,
        connections: ['CCD Array', 'Dewar', 'Data Cables'],
        failureEffect: 'Loss of communication with specific CCD segments or catastrophic short circuits.',
        cascadeFailures: ['Readout Amplifiers', 'Data Acquisition System'],
        originalPosition: { x: 0, y: -0.5, z: 0 },
        explodedPosition: { x: 0, y: -5, z: 0 },
        mesh: backplaneMesh
    });

    // 4. CCD Sensor Array (Mosaic of 4x4 chips)
    const arrayGroup = new THREE.Group();
    arrayGroup.position.set(0, 0, 0);
    const chips = [];
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const chipGeom = new THREE.BoxGeometry(1.8, 0.2, 1.8);
            const chipMesh = new THREE.Mesh(chipGeom, photonGlowMaterial);
            chipMesh.position.set(-2.85 + j * 1.9, 0, -2.85 + i * 1.9);
            arrayGroup.add(chipMesh);
            chips.push(chipMesh);
            
            // Gold contacts
            const contactGeom = new THREE.BoxGeometry(1.9, 0.1, 0.1);
            const contactMesh1 = new THREE.Mesh(contactGeom, goldContactMaterial);
            contactMesh1.position.set(-2.85 + j * 1.9, -0.05, -2.85 + i * 1.9 + 0.95);
            const contactMesh2 = new THREE.Mesh(contactGeom, goldContactMaterial);
            contactMesh2.position.set(-2.85 + j * 1.9, -0.05, -2.85 + i * 1.9 - 0.95);
            arrayGroup.add(contactMesh1);
            arrayGroup.add(contactMesh2);
        }
    }
    group.add(arrayGroup);
    parts.push({
        name: 'Mosaic CCD Sensor Array',
        description: 'An array of highly sensitive back-illuminated silicon charge-coupled devices designed to capture individual photons with near-perfect quantum efficiency.',
        material: 'Silicon / Photonic Material',
        function: 'Photon to Electron Conversion',
        assemblyOrder: 4,
        connections: ['Backplane', 'Optical Window'],
        failureEffect: 'Dead pixels, dead columns, or complete failure of specific chips in the mosaic.',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 5, z: 0 },
        mesh: arrayGroup
    });

    // 5. Optical Window / Filter
    const windowGeometry = new THREE.CylinderGeometry(6.5, 6.5, 0.2, 32);
    const windowMesh = new THREE.Mesh(windowGeometry, tinted);
    windowMesh.position.set(0, 1, 0);
    group.add(windowMesh);
    parts.push({
        name: 'Optical Window & AR Coating',
        description: 'A precision-polished fused silica window with anti-reflective coatings, sealing the vacuum chamber while allowing specific wavelengths of light to pass.',
        material: 'Fused Silica Glass',
        function: 'Vacuum Seal & Optical Transmission',
        assemblyOrder: 5,
        connections: ['Dewar'],
        failureEffect: 'Condensation or frosting on the sensor array, or loss of vacuum pressure.',
        cascadeFailures: ['Dewar Vacuum', 'Sensor Array'],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 12, z: 0 },
        mesh: windowMesh
    });

    // 6. Readout Amplifiers (Glowing elements showing data transfer)
    const ampGroup = new THREE.Group();
    const amps = [];
    for (let i = 0; i < 8; i++) {
        const ampGeom = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const ampMesh = new THREE.Mesh(ampGeom, readOutGlowMaterial);
        const angle = (i / 8) * Math.PI * 2;
        ampMesh.position.set(Math.cos(angle) * 5.5, -0.3, Math.sin(angle) * 5.5);
        ampGroup.add(ampMesh);
        amps.push(ampMesh);
    }
    group.add(ampGroup);
    parts.push({
        name: 'Readout Amplifiers',
        description: 'Low-noise amplifiers that convert the tiny packets of charge from the CCD pixels into measurable voltage signals.',
        material: 'Semiconductor / Neon',
        function: 'Signal Amplification',
        assemblyOrder: 6,
        connections: ['Sensor Backplane'],
        failureEffect: 'Extreme read noise or completely saturated images (white-out).',
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -2, z: 0 },
        mesh: ampGroup
    });

    const description = "The Astronomical CCD Sensor Array is the heart of modern professional telescopes. Operating in a vacuum at ultra-low temperatures, it consists of a mosaic of back-illuminated silicon chips that detect individual photons from distant galaxies with extraordinary efficiency. Cryogenic cooling eliminates thermal noise, while advanced readout electronics precisely measure the accumulated charge in millions of pixels.";

    const quizQuestions = [
        {
            question: "Why must the CCD array in a professional astronomical telescope be cryogenically cooled?",
            options: [
                "To prevent the silicon from melting under starlight.",
                "To reduce 'dark current' (thermal noise) which would otherwise drown out faint astronomical signals.",
                "To speed up the readout rate of the amplifiers.",
                "To shrink the pixels and increase the overall resolution."
            ],
            correct: 1,
            explanation: "At room temperature, thermal energy spontaneously generates electrons in the silicon, creating 'dark current'. Cooling the array to extreme temperatures reduces this thermal noise, allowing the detection of extremely faint sources.",
            difficulty: "Medium"
        },
        {
            question: "What is the purpose of the 'Mosaic' design (multiple chips instead of one giant chip)?",
            options: [
                "It looks more aesthetically pleasing.",
                "Different chips capture different colors of light simultaneously.",
                "Manufacturing one giant defect-free silicon wafer is incredibly difficult and expensive; tiling smaller chips is more practical.",
                "It allows the telescope to look in multiple directions at once."
            ],
            correct: 2,
            explanation: "Yield rates for large silicon wafers are very low. It is far more cost-effective to manufacture smaller, defect-free CCDs and tile them together into a large mosaic to cover the telescope's focal plane.",
            difficulty: "Medium"
        },
        {
            question: "What role do the Readout Amplifiers play in the CCD array?",
            options: [
                "They amplify the incoming starlight before it hits the sensor.",
                "They convert the accumulated electron charge in each pixel into a measurable voltage signal.",
                "They power the cryocooler system.",
                "They transmit the final images to Earth via radio waves."
            ],
            correct: 1,
            explanation: "After an exposure, the charge (electrons) collected in each pixel is shifted across the chip to the readout amplifiers, which convert these tiny charge packets into voltages that can be digitized.",
            difficulty: "Hard"
        }
    ];

    function animate(time, speed, meshes) {
        // Animate the CCD chips to simulate photon collection (breathing glow)
        chips.forEach((chip, index) => {
            const offsetGlow = 0.5 + 0.5 * Math.sin(time * speed * 2 + index * 0.5);
            chip.material.emissiveIntensity = 0.4 + 0.6 * offsetGlow;
        });

        // Animate the readout amplifiers (fast pulsing to simulate data transfer)
        amps.forEach((amp, index) => {
            const active = (Math.floor(time * speed * 10) % 8) === index;
            amp.material.emissiveIntensity = active ? 2.0 : 0.2;
            amp.scale.setScalar(active ? 1.2 : 1.0);
        });

        // Slowly rotate the entire array to show off the mosaic
        group.rotation.y = time * speed * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createCCDSensorArray() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
