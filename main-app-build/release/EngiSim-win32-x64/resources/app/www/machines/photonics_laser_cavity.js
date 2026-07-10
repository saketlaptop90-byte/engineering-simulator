import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {};

    // -----------------------------------------
    // Custom High-Tech Materials
    // -----------------------------------------
    const rubyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xff0033, transmission: 0.9, opacity: 1, transparent: true,
        roughness: 0.05, ior: 1.76, emissive: 0x880011, emissiveIntensity: 0.5, clearcoat: 1.0
    });

    const flashTubeMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, transmission: 1.0, opacity: 1, transparent: true,
        roughness: 0.1, ior: 1.5, emissive: 0xaaaaaa, emissiveIntensity: 0.3
    });

    const plasmaMat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
    });

    const beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, transparent: true, opacity: 0.8,
        blending: THREE.AdditiveBlending, depthWrite: false
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, transparent: true, opacity: 0.3,
        blending: THREE.AdditiveBlending, depthWrite: false
    });

    // -----------------------------------------
    // Helper Classes & Functions
    // -----------------------------------------
    class HelixCurve extends THREE.Curve {
        constructor(radius, height, turns) {
            super();
            this.radius = radius;
            this.height = height;
            this.turns = turns;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const angle = t * Math.PI * 2 * this.turns;
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;
            const z = (t - 0.5) * this.height;
            return optionalTarget.set(x, y, z);
        }
    }

    // -----------------------------------------
    // Sub-Assembly Builders
    // -----------------------------------------

    function buildOpticalTable() {
        const tableGroup = new THREE.Group();
        const localParts = [];

        // Main Table Breadboard
        const tableShape = new THREE.Shape();
        const tw = 60, td = 24, rad = 1.5;
        tableShape.moveTo(-tw/2 + rad, -td/2);
        tableShape.lineTo(tw/2 - rad, -td/2);
        tableShape.quadraticCurveTo(tw/2, -td/2, tw/2, -td/2 + rad);
        tableShape.lineTo(tw/2, td/2 - rad);
        tableShape.quadraticCurveTo(tw/2, td/2, tw/2 - rad, td/2);
        tableShape.lineTo(-tw/2 + rad, td/2);
        tableShape.quadraticCurveTo(-tw/2, td/2, -tw/2, td/2 - rad);
        tableShape.lineTo(-tw/2, -td/2 + rad);
        tableShape.quadraticCurveTo(-tw/2, -td/2, -tw/2 + rad, -td/2);

        const tableExtrude = { depth: 3, bevelEnabled: true, bevelSegments: 4, steps: 1, bevelSize: 0.2, bevelThickness: 0.2 };
        const tableGeom = new THREE.ExtrudeGeometry(tableShape, tableExtrude);
        tableGeom.rotateX(Math.PI / 2);
        const tableMesh = new THREE.Mesh(tableGeom, darkSteel);
        tableMesh.position.y = -4;
        tableGroup.add(tableMesh);
        
        // Massive Tapped Holes Array (Honeycomb Grid)
        const holeGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
        const holeMat = new THREE.MeshStandardMaterial({color: 0x050505, roughness: 1.0});
        const maxHoles = 2500;
        const holeInstanced = new THREE.InstancedMesh(holeGeom, holeMat, maxHoles);
        let idx = 0;
        const dummy = new THREE.Object3D();
        for (let x = -28; x <= 28; x += 1.5) {
            for (let z = -10; z <= 10; z += 1.5) {
                if (idx < maxHoles) {
                    dummy.position.set(x, -4.01, z);
                    dummy.updateMatrix();
                    holeInstanced.setMatrixAt(idx++, dummy.matrix);
                }
            }
        }
        tableGroup.add(holeInstanced);

        // Vibration Isolation Legs
        const legPoints = [];
        legPoints.push(new THREE.Vector2(2.5, 0));
        legPoints.push(new THREE.Vector2(2.2, 1));
        legPoints.push(new THREE.Vector2(2.2, 4));
        legPoints.push(new THREE.Vector2(1.5, 5));
        legPoints.push(new THREE.Vector2(1.5, 12));
        legPoints.push(new THREE.Vector2(3.0, 12.5));
        legPoints.push(new THREE.Vector2(3.0, 13));
        const legGeom = new THREE.LatheGeometry(legPoints, 64);
        
        const positions = [
            [-26, -17, -9],
            [26, -17, -9],
            [-26, -17, 9],
            [26, -17, 9]
        ];
        
        positions.forEach((pos, i) => {
            const leg = new THREE.Mesh(legGeom, steel);
            leg.position.set(...pos);
            tableGroup.add(leg);
        });

        localParts.push({
            name: "Optical Table & Isolators",
            description: "Heavy-duty honeycomb breadboard equipped with pneumatic isolation legs.",
            material: "darkSteel",
            function: "Isolates the highly sensitive laser cavity from external vibrations and thermal drift.",
            assemblyOrder: 1,
            connections: ["Kinematic Mounts", "Pumping Chamber"],
            failureEffect: "Loss of optical alignment, resulting in a catastrophic drop in output power.",
            cascadeFailures: ["Mirror damage due to hot spots", "Mode instability"],
            originalPosition: { x: 0, y: -4, z: 0 },
            explodedPosition: { x: 0, y: -20, z: 0 }
        });

        return { tableGroup, localParts };
    }

    function buildKinematicMount(isHR) {
        const mountGroup = new THREE.Group();
        const localParts = [];
        
        // Complex Base Extrusion
        const mountShape = new THREE.Shape();
        mountShape.moveTo(-3, 0);
        mountShape.lineTo(3, 0);
        mountShape.lineTo(3, 4);
        mountShape.absarc(0, 4, 3, 0, Math.PI, false);
        mountShape.lineTo(-3, 4);
        
        const holePath = new THREE.Path();
        holePath.absarc(0, 4, 1.8, 0, Math.PI * 2, true);
        mountShape.holes.push(holePath);

        const mountGeom = new THREE.ExtrudeGeometry(mountShape, {
            depth: 1.5, bevelEnabled: true, bevelThickness: 0.15, bevelSize: 0.15, bevelSegments: 4
        });
        mountGeom.translate(0, 0, -0.75);
        const mountMesh = new THREE.Mesh(mountGeom, darkSteel);
        mountMesh.position.y = -4; // Stand on the table surface
        mountGroup.add(mountMesh);
        
        // Mirror Insert
        const mirrorGeom = new THREE.CylinderGeometry(1.7, 1.7, 0.4, 64);
        mirrorGeom.rotateX(Math.PI / 2);
        const mirrorMat = isHR ? chrome : tinted; 
        const mirrorMesh = new THREE.Mesh(mirrorGeom, mirrorMat);
        mirrorMesh.position.set(0, 0, 0); 
        mountGroup.add(mirrorMesh);
        
        // High-Precision Micrometer Adjusters
        const micrometerGeom = new THREE.CylinderGeometry(0.3, 0.3, 2, 32);
        micrometerGeom.rotateX(Math.PI / 2);
        const knobPoints = [];
        for(let i=0; i<=20; i++){
            let y = i * 0.05;
            let r = 0.5 + (i%2)*0.05; // Knurling effect
            knobPoints.push(new THREE.Vector2(r, y));
        }
        const knobGeom = new THREE.LatheGeometry(knobPoints, 32);
        knobGeom.rotateX(Math.PI / 2);
        
        const m1 = new THREE.Group();
        m1.add(new THREE.Mesh(micrometerGeom, steel));
        const k1 = new THREE.Mesh(knobGeom, steel);
        k1.position.z = 1.0;
        m1.add(k1);
        m1.position.set(2, 2.5, 0.8);
        mountGroup.add(m1);
        
        const m2 = m1.clone();
        m2.position.set(-2, 2.5, 0.8);
        mountGroup.add(m2);

        const xPos = isHR ? -12 : 12;
        mountGroup.position.set(xPos, 0, 0);

        localParts.push({
            name: isHR ? "HR Kinematic Mount" : "OC Kinematic Mount",
            description: `Heavy precision kinematic mount holding the ${isHR ? 'High Reflector' : 'Output Coupler'}.`,
            material: "darkSteel",
            function: "Enables multi-axis sub-micron adjustments to perfectly align the optical resonance cavity.",
            assemblyOrder: isHR ? 2 : 3,
            connections: ["Optical Table"],
            failureEffect: "Loss of cavity resonance.",
            cascadeFailures: ["Lasing failure", "Beam wandering"],
            originalPosition: { x: xPos, y: 0, z: 0 },
            explodedPosition: { x: xPos * 1.5, y: 5, z: isHR ? -5 : 5 }
        });

        localParts.push({
            name: isHR ? "High Reflector Mirror" : "Output Coupler Mirror",
            description: isHR ? "Dielectric multi-layer mirror reflecting 99.9% of the laser wavelength." : "Partially transmissive mirror reflecting 80% and transmitting 20% of photons.",
            material: isHR ? "chrome" : "tinted",
            function: isHR ? "Bounces photons back through the gain medium for further amplification." : "Forms the output aperture for the laser beam while maintaining cavity resonance.",
            assemblyOrder: isHR ? 4 : 5,
            connections: [isHR ? "HR Kinematic Mount" : "OC Kinematic Mount"],
            failureEffect: "Cavity feedback loop fails instantly.",
            cascadeFailures: ["Complete laser failure"],
            originalPosition: { x: xPos, y: 0, z: 0 },
            explodedPosition: { x: xPos * 1.8, y: 0, z: isHR ? -10 : 10 }
        });

        return { mountGroup, localParts };
    }

    function buildCavity() {
        const cavityGroup = new THREE.Group();
        const localParts = [];

        // Gain Medium (Ruby Rod)
        const rodGeom = new THREE.CylinderGeometry(0.4, 0.4, 16, 64);
        rodGeom.rotateZ(Math.PI / 2);
        const rodMesh = new THREE.Mesh(rodGeom, rubyMaterial);
        cavityGroup.add(rodMesh);
        meshes.gainMedium = rodMesh;

        localParts.push({
            name: "Ruby Gain Medium",
            description: "Synthetic ruby rod (Cr:Al2O3) with optically flat, highly parallel ends.",
            material: "rubyMaterial",
            function: "Provides population inversion when pumped by the flash lamp, amplifying photons via stimulated emission.",
            assemblyOrder: 6,
            connections: ["Pumping Chamber", "Coolant Jacket"],
            failureEffect: "No stimulated emission, completely disabling the laser.",
            cascadeFailures: ["Thermal fracturing if uncooled"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 0, z: -15 }
        });

        // Flash Lamp
        const lampCurve = new HelixCurve(1.4, 15, 18);
        const lampGeom = new THREE.TubeGeometry(lampCurve, 1024, 0.2, 32, false);
        lampGeom.rotateY(Math.PI / 2); 
        
        const lampMesh = new THREE.Mesh(lampGeom, flashTubeMat);
        cavityGroup.add(lampMesh);
        
        const plasmaGeom = new THREE.TubeGeometry(lampCurve, 1024, 0.1, 16, false);
        plasmaGeom.rotateY(Math.PI / 2);
        const plasmaMesh = new THREE.Mesh(plasmaGeom, plasmaMat);
        cavityGroup.add(plasmaMesh);
        
        meshes.flashLamp = lampMesh;
        meshes.flashPlasma = plasmaMesh;

        localParts.push({
            name: "Xenon Flash Lamp",
            description: "Helical high-pressure Xenon flashtube tightly wrapping around the gain medium.",
            material: "glass/plasma",
            function: "Fires intense bursts of broad-spectrum light to pump the atoms in the rod into an excited state.",
            assemblyOrder: 7,
            connections: ["Power Cables", "Pumping Chamber"],
            failureEffect: "Inability to achieve population inversion.",
            cascadeFailures: ["Ignition failure", "Tube explosion if overpowered"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 8, z: -8 }
        });

        // Coolant Jacket
        const jacketGeom = new THREE.CylinderGeometry(2.0, 2.0, 15.5, 64);
        jacketGeom.rotateZ(Math.PI / 2);
        const jacketMesh = new THREE.Mesh(jacketGeom, glass); 
        cavityGroup.add(jacketMesh);
        meshes.coolantJacket = jacketMesh;

        localParts.push({
            name: "Coolant Jacket",
            description: "Borosilicate glass sleeve sealing the deionized water around the rod and lamp.",
            material: "glass",
            function: "Prevents thermal destruction of the rod and lamp by maintaining a constant flow of chilled water.",
            assemblyOrder: 8,
            connections: ["Coolant Hoses", "Housing Base"],
            failureEffect: "Immediate thermal runaway.",
            cascadeFailures: ["Rod shattering", "Flash lamp explosion"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 15, z: 0 }
        });

        // Outer Housing & Fins (Hyper-detailed Lathe)
        const hPoints = [];
        for(let i=0; i<=400; i++){
            let x = (i/400)*17 - 8.5;
            let r = 3.5;
            if (Math.abs(x) < 8.0) {
                let finPattern = Math.sin(x * 40);
                r = 3.5 + (finPattern > 0.4 ? 1.5 : 0); // Deep heat fins
            }
            if (Math.abs(x) >= 8.0 && Math.abs(x) < 8.5) r = 4.5; // Flanges
            hPoints.push(new THREE.Vector2(r, x));
        }
        const housingGeom = new THREE.LatheGeometry(hPoints, 128);
        housingGeom.rotateZ(Math.PI / 2);
        const housingMesh = new THREE.Mesh(housingGeom, aluminum);
        cavityGroup.add(housingMesh);

        // Warning Label Plate on Housing
        const labelGeom = new THREE.PlaneGeometry(3, 1.5);
        const labelMat = new THREE.MeshStandardMaterial({color: 0xcc0000});
        const labelMesh = new THREE.Mesh(labelGeom, labelMat);
        labelMesh.position.set(0, 3.6, 3.6);
        labelMesh.rotation.x = -Math.PI / 4;
        cavityGroup.add(labelMesh);

        localParts.push({
            name: "Pumping Chamber Housing",
            description: "Massive aluminum block heavily finned for air cooling and enclosing the optical pumping cavity.",
            material: "aluminum",
            function: "Contains the flashlamp light, reflecting it back into the rod via gold-plated inner walls.",
            assemblyOrder: 9,
            connections: ["Housing Base", "Optical Table"],
            failureEffect: "Light leakage and thermal expansion causing cavity misalignment.",
            cascadeFailures: ["Decreased laser efficiency", "Overheating of adjacent optics"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 25, z: 0 }
        });

        return { cavityGroup, localParts };
    }

    function buildChiller() {
        const chillerGroup = new THREE.Group();
        const localParts = [];

        // Massive Chiller Block
        const chillerG = new THREE.BoxGeometry(8, 6, 10);
        const chillerM = new THREE.Mesh(chillerG, aluminum);
        chillerM.position.set(0, -1, -14); 
        chillerGroup.add(chillerM);

        // Complex Hydraulic Hoses connecting Chiller to Cavity
        const curve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 2.5, -2), // Cavity jacket top
            new THREE.Vector3(2, 5, -5),
            new THREE.Vector3(3, 2, -10),
            new THREE.Vector3(2, 1, -14) // Chiller inlet
        ]);
        const hose1 = new THREE.Mesh(new THREE.TubeGeometry(curve1, 128, 0.4, 32, false), rubber);
        chillerGroup.add(hose1);

        const curve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -2.5, -2), // Cavity jacket bottom
            new THREE.Vector3(-2, -4, -5),
            new THREE.Vector3(-3, -2, -10),
            new THREE.Vector3(-2, -1, -14) // Chiller outlet
        ]);
        const hose2 = new THREE.Mesh(new THREE.TubeGeometry(curve2, 128, 0.4, 32, false), rubber);
        chillerGroup.add(hose2);

        localParts.push({
            name: "High-Flow Chiller Unit & Hoses",
            description: "Closed-loop deionized water chiller with high-pressure reinforced rubber hoses.",
            material: "aluminum/rubber",
            function: "Circulates refrigerated coolant through the pumping chamber to prevent thermal fracturing of the gain medium.",
            assemblyOrder: 10,
            connections: ["Optical Table", "Coolant Jacket"],
            failureEffect: "Immediate cavitation and boiling inside the chamber, shattering the rod.",
            cascadeFailures: ["Water leak onto high voltage components"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 0, y: 12, z: -30 }
        });

        return { chillerGroup, localParts };
    }

    function buildPowerSupply() {
        const hvpsGroup = new THREE.Group();
        const localParts = [];

        const hvpsG = new THREE.BoxGeometry(10, 8, 8);
        const hvpsM = new THREE.Mesh(hvpsG, darkSteel);
        hvpsM.position.set(-18, 0, -12); 
        hvpsGroup.add(hvpsM);

        // Massive Capacitor Banks
        const capG = new THREE.CylinderGeometry(1.0, 1.0, 3, 32);
        for(let x=-3; x<=3; x+=3){
            for(let z=-2; z<=2; z+=4){
                const cap = new THREE.Mesh(capG, aluminum);
                cap.position.set(-18 + x, 5.5, -12 + z);
                hvpsGroup.add(cap);
            }
        }

        // Extremely Thick High Voltage Cables
        const cableCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-18, 3, -8),
            new THREE.Vector3(-12, 6, -4),
            new THREE.Vector3(-6, 3, -1),
            new THREE.Vector3(-4, 0, 0)
        ]);
        const cable = new THREE.Mesh(new THREE.TubeGeometry(cableCurve, 128, 0.3, 32, false), copper);
        hvpsGroup.add(cable);

        localParts.push({
            name: "High Voltage Pulse-Forming Network",
            description: "Massive capacitor bank and switching electronics.",
            material: "darkSteel/aluminum",
            function: "Stores electrical energy and discharges it in microsecond pulses to drive the flash lamp.",
            assemblyOrder: 11,
            connections: ["Optical Table", "Flash Lamp"],
            failureEffect: "Flash lamp fails to ignite.",
            cascadeFailures: ["Capacitor dielectric breakdown", "Power grid surge"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -30, y: 10, z: -20 }
        });

        localParts.push({
            name: "High-Current Transmission Cables",
            description: "Thick, heavily insulated coaxial cables.",
            material: "copper",
            function: "Safely delivers kiloampere current pulses from the power supply to the pumping chamber.",
            assemblyOrder: 12,
            connections: ["Pulse-Forming Network", "Pumping Chamber"],
            failureEffect: "Arcing to the optical table.",
            cascadeFailures: ["Catastrophic short circuit and fire"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: -15, y: 20, z: -10 }
        });

        return { hvpsGroup, localParts };
    }

    function buildAccessories() {
        const accGroup = new THREE.Group();
        const localParts = [];
        
        // 1. Safety Shutter
        const shutterGroup = new THREE.Group();
        const sHousingG = new THREE.BoxGeometry(3, 6, 3);
        const sHousingM = new THREE.Mesh(sHousingG, plastic);
        sHousingM.position.set(0, -1, 0); // Extends down to table
        shutterGroup.add(sHousingM);
        
        const bladeG = new THREE.PlaneGeometry(2.5, 2.5);
        const bladeM = new THREE.Mesh(bladeG, steel);
        bladeM.position.set(0, 0, 1.51); // Blocks Y=0
        shutterGroup.add(bladeM);
        meshes.shutterBlade = bladeM;
        
        shutterGroup.position.set(16, 0, 0);
        accGroup.add(shutterGroup);

        localParts.push({
            name: "Safety Shutter",
            description: "High-speed electro-mechanical beam block.",
            material: "plastic",
            function: "Instantly terminates external beam delivery during interlock breaches or standby mode.",
            assemblyOrder: 13,
            connections: ["Optical Table", "Control System"],
            failureEffect: "Uncontrolled beam emission posing severe safety hazards.",
            cascadeFailures: ["Sensor overload", "Accidental target ignition"],
            originalPosition: { x: 16, y: 0, z: 0 },
            explodedPosition: { x: 16, y: 15, z: 8 }
        });

        // 2. Beam Expander Telescope
        const expanderPoints = [];
        for(let i=0; i<=30; i++){
            let y = (i/30)*6; 
            let r = 0.8 + Math.pow(y/6, 2) * 2.0; 
            expanderPoints.push(new THREE.Vector2(r, y));
        }
        const expanderG = new THREE.LatheGeometry(expanderPoints, 64);
        expanderG.rotateZ(-Math.PI / 2); // Flare opens towards +X
        const expanderM = new THREE.Mesh(expanderG, aluminum);
        
        // Lens inside expander
        const lensG = new THREE.SphereGeometry(2.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 4);
        lensG.rotateY(-Math.PI / 2);
        const lensM = new THREE.Mesh(lensG, tinted);
        lensM.position.x = 5.8;
        expanderM.add(lensM);

        expanderM.position.set(20, 0, 0);
        accGroup.add(expanderM);

        localParts.push({
            name: "Galilean Beam Expander",
            description: "Multi-element Galilean telescope lens assembly.",
            material: "aluminum",
            function: "Increases beam diameter to reduce divergence and prevent optical damage to downstream components.",
            assemblyOrder: 14,
            connections: ["Optical Table"],
            failureEffect: "Beam divergence increases rapidly, reducing focused energy density.",
            cascadeFailures: ["Lens cracking due to intense focal hot spots"],
            originalPosition: { x: 20, y: 0, z: 0 },
            explodedPosition: { x: 30, y: 12, z: 0 }
        });

        // 3. Photodiode Sensor Panel
        const sensorG = new THREE.CylinderGeometry(2, 2, 1.5, 32);
        sensorG.rotateX(Math.PI / 2);
        const sensorM = new THREE.Mesh(sensorG, darkSteel);
        sensorM.position.set(28, 0, 3.0);
        
        const screenG = new THREE.PlaneGeometry(2.5, 2.5);
        const screenM = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const screen = new THREE.Mesh(screenG, screenM);
        screen.position.set(0, 0, 0.76);
        sensorM.add(screen);
        meshes.sensorScreen = screen;
        
        accGroup.add(sensorM);

        localParts.push({
            name: "Photodiode Power Meter",
            description: "Calibrated thermal or semiconductor sensor intercepting a fraction of the beam.",
            material: "darkSteel",
            function: "Provides real-time feedback on laser output power and pulse stability.",
            assemblyOrder: 15,
            connections: ["Control System"],
            failureEffect: "Loss of closed-loop power regulation.",
            cascadeFailures: ["Overpowering and damaging targets"],
            originalPosition: { x: 28, y: 0, z: 3.0 },
            explodedPosition: { x: 28, y: 18, z: 12 }
        });

        // 4. Fans Array
        const fanGroup = new THREE.Group();
        const fanHousing = new THREE.Mesh(new THREE.TorusGeometry(3, 0.5, 32, 64), plastic);
        fanGroup.add(fanHousing);
        
        const blades = new THREE.Group();
        for(let i=0; i<7; i++){
            const b = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.6, 0.1), plastic); // Blade approximation
            b.rotation.z = (i / 7) * Math.PI * 2;
            blades.add(b);
        }
        fanGroup.add(blades);
        meshes.coolingFanBlades = blades;
        
        fanGroup.position.set(0, 8.5, 6.0); 
        fanGroup.rotation.x = Math.PI / 2;
        accGroup.add(fanGroup);

        localParts.push({
            name: "Forced Air Cooling Array",
            description: "High-RPM brushless DC fan assembly.",
            material: "plastic",
            function: "Extracts waste heat from the finned pumping chamber housing to ambient air.",
            assemblyOrder: 16,
            connections: ["Pumping Chamber Housing"],
            failureEffect: "Slow thermal buildup.",
            cascadeFailures: ["Coolant loop overheating", "System emergency shutdown"],
            originalPosition: { x: 0, y: 8.5, z: 6.0 },
            explodedPosition: { x: 0, y: 25, z: 18 }
        });

        // 5. Massive Laser Beam
        const beamGroup = new THREE.Group();
        
        const cBeamG = new THREE.CylinderGeometry(0.15, 0.15, 24, 32);
        cBeamG.rotateZ(Math.PI / 2);
        const cBeam = new THREE.Mesh(cBeamG, beamMaterial);
        cBeam.position.set(0, 0, 0); 
        beamGroup.add(cBeam);
        meshes.cavityBeam = cBeam;
        
        const eBeamG = new THREE.CylinderGeometry(0.3, 0.3, 80, 32);
        eBeamG.rotateZ(Math.PI / 2);
        const eBeamCore = new THREE.Mesh(eBeamG, new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, blending: THREE.AdditiveBlending}));
        
        const eBeamGlowG = new THREE.CylinderGeometry(0.8, 0.8, 80, 32);
        eBeamGlowG.rotateZ(Math.PI / 2);
        const eBeamGlow = new THREE.Mesh(eBeamGlowG, glowMaterial);
        
        const extBeamGroup = new THREE.Group();
        extBeamGroup.add(eBeamCore);
        extBeamGroup.add(eBeamGlow);
        extBeamGroup.position.set(56, 0, 0); 
        beamGroup.add(extBeamGroup);
        
        meshes.extBeamCore = eBeamCore;
        meshes.extBeamGlow = eBeamGlow;
        
        accGroup.add(beamGroup);

        localParts.push({
            name: "Photon Coherent Beam",
            description: "High-intensity, highly collimated beam of coherent photons.",
            material: "Energy",
            function: "The ultimate output of the laser system, capable of transferring immense optical energy to a target.",
            assemblyOrder: 17,
            connections: ["Optical Cavity"],
            failureEffect: "System fails to emit.",
            cascadeFailures: ["No downstream processing possible"],
            originalPosition: { x: 0, y: 0, z: 0 },
            explodedPosition: { x: 100, y: 0, z: 0 }
        });

        return { accGroup, localParts };
    }

    // Assemble everything
    const { tableGroup, localParts: tParts } = buildOpticalTable();
    group.add(tableGroup);
    parts.push(...tParts);

    const { mountGroup: hrMount, localParts: hrParts } = buildKinematicMount(true);
    group.add(hrMount);
    parts.push(...hrParts);

    const { mountGroup: ocMount, localParts: ocParts } = buildKinematicMount(false);
    group.add(ocMount);
    parts.push(...ocParts);

    const { cavityGroup, localParts: cParts } = buildCavity();
    group.add(cavityGroup);
    parts.push(...cParts);

    const { chillerGroup, localParts: chParts } = buildChiller();
    group.add(chillerGroup);
    parts.push(...chParts);

    const { hvpsGroup, localParts: hParts } = buildPowerSupply();
    group.add(hvpsGroup);
    parts.push(...hParts);

    const { accGroup, localParts: aParts } = buildAccessories();
    group.add(accGroup);
    parts.push(...aParts);

    // -----------------------------------------
    // Animation Function
    // -----------------------------------------
    const animate = (time, speed) => {
        // High frequency pulse (simulating Q-switching or flashlamp pumping)
        const pulseRate = 3.0; // Hz
        const cycle = (time * pulseRate) % 1.0;
        
        // Fast attack, slow decay
        let pumpIntensity = 0;
        if (cycle < 0.05) {
            pumpIntensity = cycle / 0.05;
        } else if (cycle < 0.4) {
            pumpIntensity = 1.0 - ((cycle - 0.05) / 0.35);
        }
        
        if (meshes.flashPlasma && meshes.flashLamp) {
            meshes.flashPlasma.material.opacity = pumpIntensity * 0.9 + 0.1;
            meshes.flashLamp.material.emissiveIntensity = pumpIntensity * 4.0 + 0.5;
        }
        
        if (meshes.gainMedium) {
            meshes.gainMedium.material.emissiveIntensity = pumpIntensity * 3.0 + 0.2;
        }

        // Shutter Logic (Open for 6 seconds, Close for 4)
        const globalCycle = time % 10.0;
        const shutterOpen = globalCycle > 4.0;

        if (meshes.shutterBlade) {
            const targetY = shutterOpen ? 3.5 : 0.0;
            meshes.shutterBlade.position.y = THREE.MathUtils.lerp(meshes.shutterBlade.position.y, targetY, 0.2 * speed);
        }

        // External Beam Logic
        if (meshes.extBeamCore && meshes.extBeamGlow) {
            if (shutterOpen) {
                meshes.extBeamCore.material.opacity = pumpIntensity * 1.0 + 0.1;
                meshes.extBeamGlow.material.opacity = pumpIntensity * 0.7 + 0.1;
            } else {
                meshes.extBeamCore.material.opacity = THREE.MathUtils.lerp(meshes.extBeamCore.material.opacity, 0, 0.2 * speed);
                meshes.extBeamGlow.material.opacity = THREE.MathUtils.lerp(meshes.extBeamGlow.material.opacity, 0, 0.2 * speed);
            }
        }

        if (meshes.cavityBeam) {
            meshes.cavityBeam.material.opacity = pumpIntensity * 0.9 + 0.1;
        }

        if (meshes.coolantJacket) {
            meshes.coolantJacket.scale.setScalar(1.0 + pumpIntensity * 0.002);
        }
        
        if (meshes.coolingFanBlades) {
            meshes.coolingFanBlades.rotation.z -= speed * 25.0; // extremely fast
        }
        
        if (meshes.sensorScreen) {
            const hue = shutterOpen ? 0.3 : 0.0; // Green if firing, red if blocked
            meshes.sensorScreen.material.color.setHSL(hue, 1.0, pumpIntensity * 0.4 + 0.3);
        }
    };

    // -----------------------------------------
    // Quiz Questions
    // -----------------------------------------
    const quizQuestions = [
        {
            question: "What is the primary function of the heavily finned aluminum housing surrounding the laser rod?",
            options: [
                "To provide magnetic shielding for the optical table",
                "To dissipate immense thermal energy generated by the Xenon flash lamp",
                "To focus the output laser beam into a single point",
                "To prevent acoustic vibrations from escaping the cavity"
            ],
            correctAnswer: 1,
            explanation: "The flash lamp generates extreme heat. The finned aluminum housing, combined with the coolant jacket, rapidly dissipates this heat to prevent thermal lensing and rod fracture."
        },
        {
            question: "In this optical cavity, what defines the 'Output Coupler'?",
            options: [
                "A highly reflective mirror that reflects 99.9% of photons",
                "A partially transmissive mirror that allows a percentage of the coherent beam to escape",
                "A mechanical shutter used for safety",
                "The deionized water flowing through the coolant jacket"
            ],
            correctAnswer: 1,
            explanation: "The Output Coupler (OC) is precisely engineered to transmit a specific fraction of the laser light (e.g., 5-20%) while reflecting the rest back into the cavity to sustain stimulated emission."
        },
        {
            question: "Why is the Xenon flash lamp shaped as a helix wrapped around the gain medium?",
            options: [
                "To maximize the surface area of light hitting the gain medium from all angles",
                "To create a magnetic vortex that aligns the photons",
                "Because a straight tube would shatter under high voltage",
                "To slow down the cooling water passing through the jacket"
            ],
            correctAnswer: 0,
            explanation: "A helical flash lamp surrounds the rod, providing uniform and highly efficient optical pumping across the entire volume of the gain medium."
        },
        {
            question: "What role do the kinematic mounts play at either end of the optical table?",
            options: [
                "They generate the high voltage required for the lamp",
                "They provide ultra-precise, sub-milliradian angular adjustments for the cavity mirrors",
                "They pump cooling fluid through the system",
                "They measure the wavelength of the emitted beam"
            ],
            correctAnswer: 1,
            explanation: "Kinematic mounts use fine micrometer screws to perfectly align the mirrors, ensuring the laser beam resonates exactly back and forth through the gain medium."
        },
        {
            question: "What is the primary consequence of optical misalignment between the High Reflector and the Output Coupler?",
            options: [
                "The laser wavelength shifts to the ultraviolet spectrum",
                "The flash lamp fails to ignite",
                "Stimulated emission ceases and the laser stops lancing",
                "The cooling system pressurizes and ruptures"
            ],
            correctAnswer: 2,
            explanation: "If the mirrors are misaligned, photons are not reflected back through the gain medium. The optical feedback loop breaks, and stimulated emission cannot be sustained."
        }
    ];

    return {
        group,
        parts,
        description: "A highly advanced, ultra-realistic solid-state Nd:YAG / Ruby Laser Cavity system. Features an intricate optical pumping chamber, a helical Xenon flashlamp, kinematic mirror mounts, vibration-isolated optical table, closed-loop chilling system, and a high-voltage pulse-forming network. Experience hyper-realistic simulated photon emission.",
        quizQuestions,
        animate
    };
}

// Auto-generated missing stub
export function createLaserCavity() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
