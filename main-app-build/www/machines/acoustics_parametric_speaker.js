import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];

    // =========================================================================
    // CUSTOM HIGH-TECH MATERIALS
    // =========================================================================
    const ultraNeonCyan = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 4.5,
        transparent: true,
        opacity: 0.85,
        transmission: 0.9,
        roughness: 0.1,
        metalness: 0.8,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    });

    const carrierWaveMat = new THREE.MeshStandardMaterial({
        color: 0xff00ff,
        emissive: 0xff00aa,
        emissiveIntensity: 6.0,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
    });

    const distortionMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        emissive: 0x5555ff,
        emissiveIntensity: 2.0,
        transparent: true,
        opacity: 0.3,
        roughness: 0.0,
        metalness: 1.0,
        ior: 1.5,
        transmission: 1.0,
        side: THREE.DoubleSide
    });

    const laserMat = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const glowingPanel = new THREE.MeshStandardMaterial({
        color: 0x111111,
        emissive: 0x00ff88,
        emissiveIntensity: 1.5,
        roughness: 0.5
    });

    const metaMaterialReflector = new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        emissive: 0x111111,
        metalness: 1.0,
        roughness: 0.2,
        clearcoat: 1.0,
        wireframe: false
    });

    // =========================================================================
    // HELPER FUNCTIONS FOR COMPLEX GEOMETRIES
    // =========================================================================
    function createLathePedestal() {
        const points = [];
        for (let i = 0; i <= 200; i++) {
            const t = i / 200;
            const y = t * 15;
            let x = 8 - y * 0.3 + Math.sin(y * Math.PI) * 1.5;
            if (i > 180) x += (i - 180) * 0.2; 
            if (i < 20) x += (20 - i) * 0.1;
            // Add ribbed texture mathematically
            x += Math.sin(y * 40) * 0.15;
            points.push(new THREE.Vector2(x, y));
        }
        return new THREE.LatheGeometry(points, 256);
    }

    function createHexDish(radius, depth) {
        const shape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const px = Math.cos(angle) * radius;
            const py = Math.sin(angle) * radius;
            if (i === 0) shape.moveTo(px, py);
            else shape.lineTo(px, py);
        }
        shape.closePath();

        const extrudeSettings = {
            depth: depth,
            bevelEnabled: true,
            bevelSegments: 10,
            steps: 5,
            bevelSize: 0.5,
            bevelThickness: 1.0
        };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }

    function createCoolingTubeSpline(offset) {
        class CustomSinCurve extends THREE.Curve {
            constructor(scale, phase) {
                super();
                this.scale = scale;
                this.phase = phase;
            }
            getPoint(t, optionalTarget = new THREE.Vector3()) {
                const tx = Math.cos(t * Math.PI * 8 + this.phase) * 6;
                const ty = t * 30 - 15;
                const tz = Math.sin(t * Math.PI * 8 + this.phase) * 6;
                return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
            }
        }
        const path = new CustomSinCurve(1, offset);
        return new THREE.TubeGeometry(path, 300, 0.4, 16, false);
    }

    function createHydraulicPiston() {
        const group = new THREE.Group();
        const cylinderGeo = new THREE.CylinderGeometry(0.8, 0.8, 10, 32);
        const rodGeo = new THREE.CylinderGeometry(0.4, 0.4, 12, 32);
        const base = new THREE.Mesh(cylinderGeo, darkSteel);
        const rod = new THREE.Mesh(rodGeo, chrome);
        rod.position.y = 8;
        group.add(base);
        group.add(rod);
        return { group, rod };
    }

    function createHeatSink(w, h, d, fins) {
        const group = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(w, 0.5, d);
        const base = new THREE.Mesh(baseGeo, aluminum);
        group.add(base);
        
        const finW = w / (fins * 2);
        const finGeo = new THREE.BoxGeometry(finW, h, d);
        for(let i=0; i<fins; i++) {
            const fin = new THREE.Mesh(finGeo, aluminum);
            fin.position.x = -w/2 + finW/2 + (i * finW * 2);
            fin.position.y = h/2 + 0.25;
            group.add(fin);
        }
        return group;
    }

    // =========================================================================
    // SYSTEM ASSEMBLY
    // =========================================================================
    
    // 1. Pedestal Base
    const pedestalGeo = createLathePedestal();
    const pedestal = new THREE.Mesh(pedestalGeo, darkSteel);
    pedestal.position.y = -15;
    group.add(pedestal);

    parts.push({
        name: "Omni-Directional Lathe Pedestal",
        description: "A massively reinforced titanium-carbide pedestal absorbing terra-newtons of recoil force from intense acoustic pressure waves.",
        material: "Dark Steel / Titanium",
        function: "Structural anchoring and vibration dumping",
        assemblyOrder: 1,
        connections: ["Vibration Isolation Dampers", "Azimuth Gimbal Ring"],
        failureEffect: "Catastrophic structural resonance cascade leading to array self-destruction.",
        cascadeFailures: ["Azimuth Gimbal Ring", "Cooling Loops"],
        originalPosition: { x: 0, y: -15, z: 0 },
        explodedPosition: { x: 0, y: -30, z: 0 }
    });

    // 2. Vibration Dampers
    for(let i=0; i<8; i++) {
        const damperGeo = new THREE.CylinderGeometry(1, 1.2, 4, 32);
        const damper = new THREE.Mesh(damperGeo, rubber);
        const angle = (i / 8) * Math.PI * 2;
        damper.position.set(Math.cos(angle)*7, -13, Math.sin(angle)*7);
        group.add(damper);
    }
    parts.push({
        name: "Vibration Isolation Dampers",
        description: "Magneto-rheological elastomer blocks.",
        material: "Synthetic Rubber",
        function: "Prevents non-linear acoustic feedback from shattering the planetary crust.",
        assemblyOrder: 2,
        connections: ["Omni-Directional Lathe Pedestal"],
        failureEffect: "Micro-fractures in pedestal base.",
        cascadeFailures: ["Omni-Directional Lathe Pedestal"],
        originalPosition: { x: 7, y: -13, z: 0 },
        explodedPosition: { x: 20, y: -20, z: 20 }
    });

    // 3. Azimuth Gimbal
    const azimuthGeo = new THREE.TorusGeometry(10, 1.5, 32, 100);
    const azimuthGimbal = new THREE.Mesh(azimuthGeo, steel);
    azimuthGimbal.rotation.x = Math.PI / 2;
    azimuthGimbal.position.y = 1;
    group.add(azimuthGimbal);

    parts.push({
        name: "Azimuth Gimbal Ring",
        description: "Superconducting magnetic levitation ring for frictionless 360-degree rotation of the multi-ton acoustic array.",
        material: "Steel",
        function: "Horizontal beam steering",
        assemblyOrder: 3,
        connections: ["Elevation Trunnion Mounts", "Omni-Directional Lathe Pedestal"],
        failureEffect: "Loss of horizontal targeting capability, beam drift.",
        cascadeFailures: ["Laser Targeting Optics"],
        originalPosition: { x: 0, y: 1, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    // 4. Elevation Trunnions
    const trunnionLeftGeo = new THREE.BoxGeometry(3, 15, 6);
    const trunnionLeft = new THREE.Mesh(trunnionLeftGeo, aluminum);
    trunnionLeft.position.set(-11, 8, 0);
    group.add(trunnionLeft);

    const trunnionRight = trunnionLeft.clone();
    trunnionRight.position.set(11, 8, 0);
    group.add(trunnionRight);

    parts.push({
        name: "Elevation Trunnion Mounts",
        description: "Massive articulated pylons supporting the array dish, housing superconducting elevation motors.",
        material: "Aluminum",
        function: "Vertical beam steering and dish support",
        assemblyOrder: 4,
        connections: ["Azimuth Gimbal Ring", "Ultrasonic Transducer Dish", "Hydraulic Pitch Actuators"],
        failureEffect: "Dish collapses downwards under gravity, rupturing cooling lines.",
        cascadeFailures: ["Ultrasonic Transducer Dish", "Liquid Helium Cooling Loop"],
        originalPosition: { x: -11, y: 8, z: 0 },
        explodedPosition: { x: -30, y: 8, z: 0 }
    });

    // 5. Array Gimbal/Dish Holder
    const arrayAssembly = new THREE.Group();
    arrayAssembly.position.set(0, 12, 0);
    group.add(arrayAssembly);

    const dishGeo = createHexDish(12, 2);
    const dish = new THREE.Mesh(dishGeo, darkSteel);
    dish.position.z = -1; // Center it
    arrayAssembly.add(dish);

    parts.push({
        name: "Ultrasonic Transducer Dish Chassis",
        description: "A hexagonal carbon-nanotube matrix chassis designed to hold millions of piezoelectric emitters in perfect geometric alignment.",
        material: "Dark Steel / Carbon Nanotube",
        function: "Houses emitters and absorbs back-emf.",
        assemblyOrder: 5,
        connections: ["Elevation Trunnion Mounts", "Phased Emitter Array"],
        failureEffect: "Phase misalignment leading to catastrophic beam divergence.",
        cascadeFailures: ["Phased Emitter Array", "Non-linear Acoustic Focusing Lens"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 30, z: -10 }
    });

    // 6. Millions of Transducers (InstancedMesh)
    // We will simulate millions with a dense 128x128 hexagonal grid = ~16k highly visible emitters
    const emitterCount = 16384;
    const emitterGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 6);
    // Rotate to face forward (Z-axis)
    emitterGeo.rotateX(Math.PI / 2);
    const emitterInstanced = new THREE.InstancedMesh(emitterGeo, ultraNeonCyan, emitterCount);
    
    const dummy = new THREE.Object3D();
    let idx = 0;
    const gridCols = 128;
    const gridRows = 128;
    const spacing = 0.18;
    
    for (let r = 0; r < gridRows; r++) {
        for (let c = 0; c < gridCols; c++) {
            if (idx >= emitterCount) break;
            // Hexagonal offset
            const xOffset = (r % 2 === 0) ? 0 : spacing / 2;
            const x = (c - gridCols / 2) * spacing + xOffset;
            const y = (r - gridRows / 2) * (spacing * 0.866);
            
            // Mask to hexagon shape
            const radiusSq = x*x + y*y;
            if (radiusSq < 11.5*11.5) {
                dummy.position.set(x, y, 1.1);
                dummy.updateMatrix();
                emitterInstanced.setMatrixAt(idx, dummy.matrix);
                idx++;
            }
        }
    }
    emitterInstanced.count = idx;
    arrayAssembly.add(emitterInstanced);

    parts.push({
        name: "Phased Emitter Array (Millions of Elements)",
        description: "An ultra-dense matrix of piezoelectric transducers capable of firing 100 MHz ultrasonic pulses with picosecond timing accuracy.",
        material: "Ultra Neon Cyan Emissive",
        function: "Generates the carrier wave for non-linear air demodulation.",
        assemblyOrder: 6,
        connections: ["Ultrasonic Transducer Dish Chassis", "Phase Modulator Banks"],
        failureEffect: "Loss of beam coherence, resulting in localized sonic booms instead of targeted audio.",
        cascadeFailures: ["Demodulation Target Zone"],
        originalPosition: { x: 0, y: 12, z: 1.1 },
        explodedPosition: { x: 0, y: 12, z: 30 }
    });

    // 7. Liquid Helium Cooling Loops
    const coolingGroup = new THREE.Group();
    for(let i=0; i<6; i++) {
        const tube = new THREE.Mesh(createCoolingTubeSpline(i * (Math.PI/3)), copper);
        coolingGroup.add(tube);
    }
    arrayAssembly.add(coolingGroup);

    parts.push({
        name: "Liquid Helium Cooling Loop Network",
        description: "Super-chilled copper tubing circulating liquid helium at 4 Kelvin to prevent the array from melting under petawatt loads.",
        material: "Copper",
        function: "Thermal management.",
        assemblyOrder: 7,
        connections: ["Ultrasonic Transducer Dish Chassis", "Cryo-Pumps"],
        failureEffect: "Array overheats and melts into slag within 1.2 seconds of operation.",
        cascadeFailures: ["Phased Emitter Array", "High-Power Amplifier Rack"],
        originalPosition: { x: 0, y: 12, z: -2 },
        explodedPosition: { x: 0, y: -20, z: -40 }
    });

    // 8. Phase Modulator Banks (Heat sinks on the back)
    for(let i=0; i<12; i++) {
        const hs = createHeatSink(2, 1, 2, 8);
        const angle = (i/12) * Math.PI * 2;
        hs.position.set(Math.cos(angle)*6, Math.sin(angle)*6, -2.5);
        hs.rotation.x = Math.PI/2;
        arrayAssembly.add(hs);
    }
    parts.push({
        name: "Phase Modulator Banks",
        description: "High-frequency FPGA arrays calculating the exact phase delay for each of the millions of emitters to steer the beam.",
        material: "Aluminum",
        function: "Beam steering computation and signal modulation.",
        assemblyOrder: 8,
        connections: ["Phased Emitter Array", "Data Bus Fiber Optics"],
        failureEffect: "Uncontrolled beam scanning, potential collateral damage to surrounding facilities.",
        cascadeFailures: ["Laser Targeting Optics"],
        originalPosition: { x: 0, y: 12, z: -2.5 },
        explodedPosition: { x: 0, y: 40, z: -20 }
    });

    // 9. High-Power Amplifier Rack
    const ampRackGeo = new THREE.BoxGeometry(8, 6, 4);
    const ampRack = new THREE.Mesh(ampRackGeo, steel);
    ampRack.position.set(0, -10, -5);
    group.add(ampRack);
    
    // Add glowing panels to amp rack
    const panelGeo = new THREE.PlaneGeometry(7, 5);
    const ampPanel = new THREE.Mesh(panelGeo, glowingPanel);
    ampPanel.position.set(0, -10, -2.9);
    group.add(ampPanel);

    parts.push({
        name: "Petawatt High-Power Amplifier Rack",
        description: "Class-D amplification modules utilizing graphene semiconductors to push extreme power into the transducers.",
        material: "Steel / Glowing Screens",
        function: "Signal amplification.",
        assemblyOrder: 9,
        connections: ["Power Distribution Hub", "Phase Modulator Banks"],
        failureEffect: "Loss of acoustic range.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: -10, z: -5 },
        explodedPosition: { x: 0, y: -10, z: -30 }
    });

    // 10. Hydraulic Pitch Actuators
    const { group: hyd1, rod: rod1 } = createHydraulicPiston();
    hyd1.position.set(-8, -2, -3);
    hyd1.rotation.x = -Math.PI / 4;
    group.add(hyd1);

    const { group: hyd2, rod: rod2 } = createHydraulicPiston();
    hyd2.position.set(8, -2, -3);
    hyd2.rotation.x = -Math.PI / 4;
    group.add(hyd2);

    parts.push({
        name: "Hydraulic Pitch Actuators",
        description: "Twin heavy-duty hydraulic rams filled with synthetic incompressible fluid, articulating the dish elevation.",
        material: "Dark Steel / Chrome",
        function: "Mechanical elevation adjustment.",
        assemblyOrder: 10,
        connections: ["Omni-Directional Lathe Pedestal", "Elevation Trunnion Mounts"],
        failureEffect: "Dish stuck at current elevation angle.",
        cascadeFailures: [],
        originalPosition: { x: -8, y: -2, z: -3 },
        explodedPosition: { x: -20, y: -2, z: -20 }
    });

    // 11. Central Targeting Laser Optics
    const laserOpticsGeo = new THREE.CylinderGeometry(0.5, 0.5, 3, 32);
    laserOpticsGeo.rotateX(Math.PI/2);
    const laserOptics = new THREE.Mesh(laserOpticsGeo, chrome);
    laserOptics.position.set(0, 0, 1.5);
    arrayAssembly.add(laserOptics);

    parts.push({
        name: "Central Laser Targeting Optics",
        description: "A hyper-spectral laser designator to measure atmospheric density gradients and aim the acoustic beam.",
        material: "Chrome / Glass",
        function: "Aiming and atmospheric compensation.",
        assemblyOrder: 11,
        connections: ["Ultrasonic Transducer Dish Chassis", "Atmospheric Distortion Compensator"],
        failureEffect: "Inability to focus the acoustic beam at long distances due to wind sheer.",
        cascadeFailures: ["Atmospheric Distortion Compensator"],
        originalPosition: { x: 0, y: 12, z: 1.5 },
        explodedPosition: { x: 0, y: 12, z: 15 }
    });

    // 12. Laser Beam
    const laserBeamGeo = new THREE.CylinderGeometry(0.05, 0.05, 1000, 8);
    laserBeamGeo.rotateX(Math.PI/2);
    // Shift geometry so origin is at base
    laserBeamGeo.translate(0, 0, 500);
    const laserBeam = new THREE.Mesh(laserBeamGeo, laserMat);
    laserBeam.position.set(0, 0, 3);
    arrayAssembly.add(laserBeam);

    parts.push({
        name: "Targeting Laser Beam",
        description: "Continuous wave photon stream. Not acoustic, but critical for alignment.",
        material: "Red Photons",
        function: "Visual and spectral targeting.",
        assemblyOrder: 12,
        connections: ["Central Laser Targeting Optics"],
        failureEffect: "N/A",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12, z: 503 },
        explodedPosition: { x: 0, y: 50, z: 503 }
    });

    // 13. Acoustic Meta-Material Reflector (Side lobes suppression)
    const baffleGeo = new THREE.TorusGeometry(12.5, 2, 64, 6);
    const baffle = new THREE.Mesh(baffleGeo, metaMaterialReflector);
    baffle.rotation.z = Math.PI / 6;
    arrayAssembly.add(baffle);

    parts.push({
        name: "Acoustic Meta-Material Baffle",
        description: "Engineered sub-wavelength structures designed to perfectly absorb and cancel out parasitic side-lobes.",
        material: "Meta-Material",
        function: "Prevents immediate deafness to operators standing next to the machine.",
        assemblyOrder: 13,
        connections: ["Ultrasonic Transducer Dish Chassis"],
        failureEffect: "Lethal acoustic pressure levels in the immediate vicinity of the emitter.",
        cascadeFailures: ["Control Cabin"],
        originalPosition: { x: 0, y: 12, z: 0 },
        explodedPosition: { x: 0, y: 12, z: -15 }
    });

    // 14. Carrier Wave Beam (The god-tier sound beam)
    // We will make a complex pulsing shell structure to represent the ultrasonic carrier wave
    const waveGroup = new THREE.Group();
    waveGroup.position.set(0, 0, 2);
    arrayAssembly.add(waveGroup);

    const waveGeo = new THREE.CylinderGeometry(11, 2, 200, 64, 50, true);
    waveGeo.rotateX(Math.PI/2);
    waveGeo.translate(0, 0, 100);
    
    // Deform geometry slightly for wave effect base
    const posAttribute = waveGeo.attributes.position;
    for(let i=0; i<posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        const z = posAttribute.getZ(i);
        // Ripple effect stored in userData for animation later
    }
    const carrierBeam = new THREE.Mesh(waveGeo, carrierWaveMat);
    waveGroup.add(carrierBeam);

    parts.push({
        name: "Primary Ultrasonic Carrier Beam",
        description: "The immense, invisible (visualized here) column of extremely high-intensity ultrasound. It physically displaces air molecules non-linearly.",
        material: "Magenta Plasma Wireframe",
        function: "Propagates through the air acting as a virtual speaker array.",
        assemblyOrder: 14,
        connections: ["Phased Emitter Array"],
        failureEffect: "Beam collapse.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12, z: 102 },
        explodedPosition: { x: 50, y: 12, z: 102 }
    });

    // 15. Non-linear Atmospheric Distortion Rings
    // These represent the shockwaves forming due to non-linear propagation (Burgers' equation simulation)
    const distortionRings = [];
    for(let i=0; i<15; i++) {
        const ringGeo = new THREE.TorusGeometry(10 - (i*0.5), 0.5 + (i*0.1), 32, 100);
        const ring = new THREE.Mesh(ringGeo, distortionMat);
        ring.position.z = 10 + i * 15;
        waveGroup.add(ring);
        distortionRings.push(ring);
    }

    parts.push({
        name: "Atmospheric Shockwave Distortion Fields",
        description: "Zones where the acoustic pressure is so high that the speed of sound locally increases, causing the wave peaks to catch up with the troughs, forming shockwaves.",
        material: "Distorted Refractive Plasma",
        function: "Self-demodulation process of the audio signal.",
        assemblyOrder: 15,
        connections: ["Primary Ultrasonic Carrier Beam"],
        failureEffect: "Signal fails to demodulate, target hears nothing.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12, z: 50 },
        explodedPosition: { x: -50, y: 12, z: 50 }
    });

    // 16. Demodulation Target Zone (Where the sound appears)
    const targetZoneGeo = new THREE.SphereGeometry(8, 32, 32);
    const targetMat = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffaa00,
        emissiveIntensity: 3.0,
        wireframe: true,
        transparent: true,
        opacity: 0.5
    });
    const targetZone = new THREE.Mesh(targetZoneGeo, targetMat);
    targetZone.position.z = 210;
    waveGroup.add(targetZone);

    parts.push({
        name: "Demodulation Target Sphere",
        description: "The focal point where the difference frequency (the actual audible sound) reaches maximum amplitude. Anyone standing here hears the voice inside their head.",
        material: "Golden Energy Sphere",
        function: "Payload delivery (Audible Sound).",
        assemblyOrder: 16,
        connections: ["Primary Ultrasonic Carrier Beam"],
        failureEffect: "No localized audio.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 12, z: 212 },
        explodedPosition: { x: 0, y: 100, z: 212 }
    });

    // 17. Control Cabin
    const cabinGroup = new THREE.Group();
    cabinGroup.position.set(-15, -5, 10);
    group.add(cabinGroup);

    const cabinGeo = new THREE.BoxGeometry(8, 8, 8);
    const cabin = new THREE.Mesh(cabinGeo, steel);
    cabinGroup.add(cabin);

    const windowGeo = new THREE.PlaneGeometry(7, 4);
    const cabinWindow = new THREE.Mesh(windowGeo, tinted);
    cabinWindow.position.set(0, 1, 4.01);
    cabinGroup.add(cabinWindow);

    parts.push({
        name: "Armored Operator Control Cabin",
        description: "Lead and acoustic-foam lined command center for the operator. Includes holographic interfaces for beam steering and wave-form modulation.",
        material: "Steel / Tinted Glass",
        function: "Human interface.",
        assemblyOrder: 17,
        connections: ["Omni-Directional Lathe Pedestal"],
        failureEffect: "Operator is exposed to 180dB of ultrasonic leakage.",
        cascadeFailures: ["Operator"],
        originalPosition: { x: -15, y: -5, z: 10 },
        explodedPosition: { x: -40, y: -5, z: 10 }
    });

    // 18. Atmospheric Distortion Compensator
    const compensatorGeo = new THREE.TorusKnotGeometry(2, 0.5, 100, 16);
    const compensator = new THREE.Mesh(compensatorGeo, copper);
    compensator.position.set(0, 4, 3);
    arrayAssembly.add(compensator);

    parts.push({
        name: "Atmospheric Distortion Compensator",
        description: "Calculates real-time inverse phase filters to pre-distort the wavefront, completely neutralizing atmospheric turbulence.",
        material: "Copper Coils",
        function: "Maintains beam integrity over planetary distances.",
        assemblyOrder: 18,
        connections: ["Central Laser Targeting Optics", "Phase Modulator Banks"],
        failureEffect: "Beam scatters in rain or heavy wind.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 16, z: 3 },
        explodedPosition: { x: 0, y: 30, z: 3 }
    });

    // =========================================================================
    // DESCRIPTION
    // =========================================================================
    const description = `
**Ultra God Tier Parametric Speaker System (UGT-PSS)**

This is not a mere loudspeaker. This is a weaponized, planetary-scale phased array utilizing extreme non-linear acoustics. 
By generating a massive array of tightly focused ultrasonic carrier waves, the UGT-PSS forces the very air molecules themselves to act as a virtual speaker.

**Core Principles:**
1. **Parametric Acoustic Array:** Discovered by Peter Westervelt, this principle uses the non-linearity of the air to mix two high-frequency (ultrasonic) beams.
2. **Self-Demodulation:** As the immense ultrasonic waves propagate, they distort. The high-pressure peaks travel faster than the low-pressure troughs (due to the adiabatic equation of state of air). This distortion creates shockwaves.
3. **The Difference Frequency:** The resulting non-linear mixing generates new frequencies, specifically the difference between the carrier frequencies. This difference frequency is in the audible range.
4. **Laser-Tight Beam:** Because the virtual audio source is a long column of air in front of the machine (the ultrasonic beam), the resulting audible sound is highly directional, acting like a laser beam of sound. You can target a single person 5 miles away, and nobody else will hear it.

**System Architecture:**
Over 16,384 independent piezoelectric transducers form the primary dish. Each is driven by a petawatt amplification system cooled by liquid helium. Real-time FPGA banks calculate phase delays for every single element to electronically steer the beam without moving the colossal dish. 
    `;

    // =========================================================================
    // QUIZ QUESTIONS (PhD LEVEL NON-LINEAR ACOUSTICS)
    // =========================================================================
    const quizQuestions = [
        {
            question: "In the context of the Parametric Acoustic Array, which equation governs the non-linear propagation of the finite-amplitude sound beam including the effects of diffraction, absorption, and nonlinearity?",
            options: [
                "The Westervelt Equation",
                "The Khokhlov-Zabolotskaya-Kuznetsov (KZK) Equation",
                "The Burgers' Equation",
                "The Lighthill Equation"
            ],
            correctAnswer: 1,
            explanation: "The KZK equation is the parabolic approximation of the non-linear wave equation that accounts for diffraction, thermoviscous absorption, and non-linearity in directional sound beams."
        },
        {
            question: "The Gol'dberg number (Γ) is a critical dimensionless parameter in non-linear acoustics. What does it represent?",
            options: [
                "The ratio of the shock formation distance to the Rayleigh distance.",
                "The ratio of non-linear effects to thermoviscous absorption effects.",
                "The ratio of the carrier frequency to the difference frequency.",
                "The degree of phase mismatch across the transducer array."
            ],
            correctAnswer: 1,
            explanation: "The Gol'dberg number is defined as the shock formation distance divided by the absorption length. A high Gol'dberg number means non-linear effects dominate before the wave is absorbed, leading to shock formation."
        },
        {
            question: "According to Westervelt's theory for the Parametric Acoustic Array, the secondary audio field (difference frequency) directivity is governed by what virtual source distribution?",
            options: [
                "A spherical point source at the transducer face.",
                "An end-fire array of virtual sources exponentially decaying along the axis of propagation.",
                "A broadside dipole array formed by atmospheric reflection.",
                "A parametric resonance cavity localized at the target."
            ],
            correctAnswer: 1,
            explanation: "The non-linear interaction of the primary waves creates virtual sources of the difference frequency along the beam path. This acts like an exponentially shaded end-fire array, which is why the resulting audio beam is extremely narrow."
        },
        {
            question: "In the self-demodulation of a pulsed ultrasonic carrier, what mathematical operation roughly describes the resulting audible waveform relative to the envelope of the original pulse (in the far field)?",
            options: [
                "The integral of the envelope.",
                "The exact replica of the envelope.",
                "The second derivative of the square of the envelope.",
                "The Fourier transform of the envelope."
            ],
            correctAnswer: 2,
            explanation: "Berktay's far-field approximation shows that the demodulated low-frequency pressure is proportional to the second time derivative of the square of the modulation envelope function."
        },
        {
            question: "What is the primary physical mechanism that causes a high-amplitude sinusoidal acoustic wave to distort into a sawtooth shockwave as it propagates through air?",
            options: [
                "Frequency dispersion in diatomic gases.",
                "The local speed of sound increases with acoustic pressure and particle velocity, causing wave peaks to travel faster than troughs.",
                "Constructive interference from side-lobes.",
                "Quantum acoustic tunneling of phonons at the wavefront."
            ],
            correctAnswer: 1,
            explanation: "In high-amplitude waves, the temperature and pressure variations are large enough that the speed of sound is no longer constant. High-pressure peaks heat the air slightly and have forward particle velocity, making them travel faster and catch up to the troughs."
        }
    ];

    // =========================================================================
    // EXTREME ANIMATION LOGIC
    // =========================================================================
    // We pre-calculate variables to optimize the animation loop
    const dummyMatrix = new THREE.Matrix4();
    const dummyPos = new THREE.Vector3();
    const dummyQuat = new THREE.Quaternion();
    const dummyScale = new THREE.Vector3();
    
    // Store original positions of transducers for phase calculations
    const transducerPositions = [];
    for(let i=0; i<emitterInstanced.count; i++) {
        emitterInstanced.getMatrixAt(i, dummyMatrix);
        dummyPos.setFromMatrixPosition(dummyMatrix);
        transducerPositions.push(dummyPos.clone());
    }

    let timeOffset = 0;
    
    // Random target seeking
    let targetAzimuth = 0;
    let targetElevation = 0;
    let currentAzimuth = 0;
    let currentElevation = 0;

    function animate(time, speed, meshes) {
        // time is absolute, but we can speed it up
        timeOffset = time * 2.0 * speed;
        
        // 1. Array Mechanical Steering (Slow, heavy moving)
        if (Math.random() < 0.01) {
            // Pick a new target occasionally
            targetAzimuth = (Math.random() - 0.5) * Math.PI * 0.5;
            targetElevation = (Math.random() - 0.5) * Math.PI * 0.3;
        }
        
        // Interpolate current mechanical position to target (inertia)
        currentAzimuth += (targetAzimuth - currentAzimuth) * 0.01 * speed;
        currentElevation += (targetElevation - currentElevation) * 0.01 * speed;
        
        // Apply to Azimuth Gimbal
        azimuthGimbal.rotation.y = currentAzimuth;
        // Trunnions rotate with azimuth
        trunnionLeft.position.x = -11 * Math.cos(currentAzimuth);
        trunnionLeft.position.z = 11 * Math.sin(currentAzimuth);
        trunnionLeft.rotation.y = currentAzimuth;
        
        trunnionRight.position.x = 11 * Math.cos(currentAzimuth);
        trunnionRight.position.z = -11 * Math.sin(currentAzimuth);
        trunnionRight.rotation.y = currentAzimuth;

        // Array dish assembly moves with azimuth AND elevation
        arrayAssembly.rotation.y = currentAzimuth;
        arrayAssembly.rotation.x = currentElevation;

        // 2. Hydraulic Piston tracking
        // Complex inverse kinematics for pistons simplified:
        const extension = currentElevation * 5;
        rod1.position.y = 8 + extension;
        rod2.position.y = 8 + extension;

        // 3. Electronic Beam Steering & Phased Array visualization
        // To visualize the phased array, we modulate the scale/emissive of the 16k elements
        // creating a "sweeping" phase wave across the dish.
        const steeringPhaseX = Math.sin(timeOffset * 0.5) * 0.5; // Electronic azimuth steer
        const steeringPhaseY = Math.cos(timeOffset * 0.3) * 0.5; // Electronic elevation steer
        
        for(let i=0; i<emitterInstanced.count; i++) {
            const pos = transducerPositions[i];
            
            // Calculate phase based on position and steering vector
            const phase = (pos.x * steeringPhaseX + pos.y * steeringPhaseY) * 2.0;
            // High frequency carrier pulse mixed with steering phase
            const pulse = Math.sin(timeOffset * 20.0 + phase);
            
            // Map pulse to scale
            const s = 1.0 + Math.max(0, pulse * 0.5);
            
            dummyPos.copy(pos);
            dummyQuat.identity();
            dummyScale.set(s, s, s);
            
            dummyMatrix.compose(dummyPos, dummyQuat, dummyScale);
            emitterInstanced.setMatrixAt(i, dummyMatrix);
            
            // Color modulation is handled via physical material, but we can't do per-instance color easily 
            // without custom shader. Scale is enough to give an incredible rippling effect.
        }
        emitterInstanced.instanceMatrix.needsUpdate = true;

        // 4. Carrier Wave Pulsing and Demodulation Simulation
        // The main wireframe cylinder pulses and expands
        const wavePulse = (Math.sin(timeOffset * 15.0) + 1.0) / 2.0;
        carrierBeam.scale.set(1.0 + wavePulse * 0.05, 1.0, 1.0 + wavePulse * 0.05);
        carrierWaveMat.emissiveIntensity = 4.0 + wavePulse * 4.0;
        
        // 5. Atmospheric Distortion Rings (Shockwaves)
        // They translate rapidly down the beam, simulating propagation
        for(let i=0; i<distortionRings.length; i++) {
            const ring = distortionRings[i];
            // Move along Z axis
            ring.position.z += 50.0 * speed * 0.016; // 60fps assumed
            
            // Pulse the scale non-linearly to simulate steepening shock front
            const dist = ring.position.z;
            const shockSteepness = Math.min(1.0, dist / 150.0); // More distorted further out
            
            ring.scale.set(
                1.0 + Math.sin(timeOffset*10 + i)*0.2*shockSteepness,
                1.0,
                1.0 + Math.cos(timeOffset*10 + i)*0.2*shockSteepness
            );

            // Wrap around
            if (ring.position.z > 200) {
                ring.position.z = 10;
            }
        }

        // 6. Target Zone Pulsing (The difference frequency audible sound)
        // Modulate at a low frequency to represent audio beating
        const audioBeat = (Math.sin(timeOffset * 2.0) * Math.sin(timeOffset * 3.1)) ;
        targetZone.scale.setScalar(1.0 + Math.abs(audioBeat) * 0.5);
        targetMat.emissiveIntensity = 2.0 + Math.abs(audioBeat) * 5.0;
        
        // 7. Atmospheric Compensator spinning
        compensator.rotation.z += 0.1 * speed;
        compensator.rotation.x = Math.sin(timeOffset) * 0.2;
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createParametricSpeaker() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
