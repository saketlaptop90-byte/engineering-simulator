import { plastic, aluminum, glass, copper, steel, darkSteel, rubber, chrome, tinted } from '../utils/materials.js';

export function createMachine(THREE) {
    const group = new THREE.Group();
    const parts = [];
    const meshes = {
        westPistons: [],
        eastPistons: [],
        stressNodes: [],
        lasers: [],
        gears: [],
        truckWheels: []
    };

    // --- Helper Geometries & Components ---

    function createLaserStation(x, z, angle, colorHex) {
        const station = new THREE.Group();
        station.position.set(x, 0, z);
        station.rotation.y = angle;
        
        // Tripod Legs
        const legG = new THREE.CylinderGeometry(0.1, 0.1, 3, 12);
        for(let i=0; i<3; i++) {
            const leg = new THREE.Mesh(legG, aluminum);
            leg.position.set(Math.sin(i*Math.PI*2/3)*0.6, 1.5, Math.cos(i*Math.PI*2/3)*0.6);
            leg.rotation.x = -Math.PI/8 * Math.cos(i*Math.PI*2/3);
            leg.rotation.z = Math.PI/8 * Math.sin(i*Math.PI*2/3);
            station.add(leg);
        }
        
        // Emitter Main Body
        const emitterG = new THREE.BoxGeometry(1.2, 0.6, 1.4);
        const emitter = new THREE.Mesh(emitterG, darkSteel);
        emitter.position.set(0, 3, 0);
        station.add(emitter);
        
        // Precision Lens
        const lensG = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        const lens = new THREE.Mesh(lensG, glass);
        lens.rotation.x = Math.PI/2;
        lens.position.set(0, 3, 0.8);
        station.add(lens);
        
        // Laser Beam
        const beamM = new THREE.MeshBasicMaterial({color: colorHex, transparent: true, opacity: 0.6});
        const beamG = new THREE.CylinderGeometry(0.04, 0.04, 45, 16);
        const beam = new THREE.Mesh(beamG, beamM);
        beam.rotation.x = Math.PI/2;
        beam.position.set(0, 3, 23.3); // Shoots straight across the fault
        station.add(beam);
        
        return { station, beamM };
    }

    function createHydraulicRam() {
        const ramGroup = new THREE.Group();
        
        // Outer Cylinder Chassis
        const outerGeom = new THREE.CylinderGeometry(1.8, 1.8, 12, 32);
        const outer = new THREE.Mesh(outerGeom, darkSteel);
        outer.rotation.z = Math.PI / 2;
        ramGroup.add(outer);
        
        // Base mount pivot
        const pivotG = new THREE.CylinderGeometry(2, 2, 4, 32);
        const pivot = new THREE.Mesh(pivotG, steel);
        pivot.position.set(-6, 0, 0);
        ramGroup.add(pivot);
        
        // Inner Piston (The moving part)
        const innerGeom = new THREE.CylinderGeometry(1.2, 1.2, 14, 32);
        const inner = new THREE.Mesh(innerGeom, chrome);
        inner.rotation.z = Math.PI / 2;
        inner.position.x = 4; // Default extension
        ramGroup.add(inner);
        
        // Complex Hydraulic Lines wrapping the cylinder
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-4, 2, 0),
            new THREE.Vector3(-2, 2.5, 1),
            new THREE.Vector3(0, 2.5, 1),
            new THREE.Vector3(2, 2, 0)
        ]);
        const pipeG = new THREE.TubeGeometry(curve, 20, 0.2, 8, false);
        const pipe = new THREE.Mesh(pipeG, rubber);
        ramGroup.add(pipe);
        
        return { ramGroup, inner };
    }

    function createHyperTire() {
        const wheelGroup = new THREE.Group();
        
        // Main Tire Torus
        const tireGeom = new THREE.TorusGeometry(2, 0.9, 32, 100);
        const tire = new THREE.Mesh(tireGeom, rubber);
        wheelGroup.add(tire);
        
        // Aggressive Off-Road Treads
        const lugGeom = new THREE.BoxGeometry(1.6, 0.4, 0.7);
        for(let i=0; i<120; i++) {
            const angle = (i / 120) * Math.PI * 2;
            const lug = new THREE.Mesh(lugGeom, rubber);
            const radius = 2.85; 
            lug.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
            lug.rotation.z = angle;
            lug.rotation.x = (i % 2 === 0) ? 0.35 : -0.35;
            wheelGroup.add(lug);
        }
        
        // Inner Rim
        const rimGeom = new THREE.CylinderGeometry(1.6, 1.6, 1.3, 64);
        const rim = new THREE.Mesh(rimGeom, chrome);
        rim.rotation.x = Math.PI/2;
        wheelGroup.add(rim);
        
        // Complex Rim Spokes
        for(let i=0; i<12; i++) {
            const spokeG = new THREE.CylinderGeometry(0.15, 0.25, 3.2, 16);
            const spoke = new THREE.Mesh(spokeG, darkSteel);
            spoke.rotation.x = Math.PI/2;
            spoke.rotation.z = (i/12) * Math.PI * 2;
            wheelGroup.add(spoke);
        }
        
        // Hubcap
        const capG = new THREE.CylinderGeometry(0.5, 0.5, 1.6, 32);
        const cap = new THREE.Mesh(capG, aluminum);
        cap.rotation.x = Math.PI/2;
        wheelGroup.add(cap);
        
        return wheelGroup;
    }

    function createCommandTruck() {
        const truckGroup = new THREE.Group();
        
        // Massive Chassis
        const bodyG = new THREE.BoxGeometry(8, 4, 22);
        const body = new THREE.Mesh(bodyG, darkSteel);
        body.position.set(0, 3, 0);
        truckGroup.add(body);
        
        // Operator Cabin
        const cabG = new THREE.BoxGeometry(8, 3.5, 7);
        const cab = new THREE.Mesh(cabG, steel);
        cab.position.set(0, 6.75, 7.5);
        truckGroup.add(cab);
        
        // Tinted Viewing Windows
        const winG = new THREE.BoxGeometry(7.8, 2.2, 6.8);
        const win = new THREE.Mesh(winG, tinted);
        win.position.set(0, 6.75, 7.5);
        truckGroup.add(win);

        // Sensory Antennas on Roof
        for(let i=0; i<4; i++) {
            const antG = new THREE.CylinderGeometry(0.05, 0.05, 4, 8);
            const ant = new THREE.Mesh(antG, copper);
            ant.position.set(-3 + i*2, 10, 8);
            truckGroup.add(ant);
        }
        
        // Exhaust Stacks
        for(let i=0; i<2; i++) {
            const stackG = new THREE.CylinderGeometry(0.4, 0.4, 6, 16);
            const stack = new THREE.Mesh(stackG, chrome);
            stack.position.set(-4.2 + i*8.4, 6, -8);
            truckGroup.add(stack);
        }
        
        // 8x8 Drive Wheels
        const wheelPositions = [
            [-4.8, 2, 8], [4.8, 2, 8],
            [-4.8, 2, 2], [4.8, 2, 2],
            [-4.8, 2, -4], [4.8, 2, -4],
            [-4.8, 2, -10], [4.8, 2, -10]
        ];
        
        const wheels = [];
        wheelPositions.forEach(pos => {
            const w = createHyperTire();
            w.position.set(pos[0], pos[1], pos[2]);
            w.rotation.y = Math.PI/2;
            truckGroup.add(w);
            wheels.push(w);
        });
        
        return { truckGroup, wheels };
    }

    // --- Core Architecture Assembly ---

    // 1. Subterranean Base Truss
    const baseGroup = new THREE.Group();
    for(let i=0; i<15; i++) {
        // Lateral Cross beams
        const beamG = new THREE.BoxGeometry(60, 1.5, 2.5);
        const beam = new THREE.Mesh(beamG, steel);
        beam.position.set(0, -7, -28 + i*4);
        baseGroup.add(beam);
        
        // Longitudinal Beams
        const zBeamG = new THREE.BoxGeometry(2.5, 1.5, 60);
        const zBeam = new THREE.Mesh(zBeamG, darkSteel);
        zBeam.position.set(-28 + i*4, -8.5, 0);
        baseGroup.add(zBeam);
        
        // Vertical Suspension Pillars
        for(let j=0; j<15; j++) {
            if(i%2===0 && j%2===0) {
                const pillarG = new THREE.CylinderGeometry(0.8, 0.8, 6, 16);
                const pillar = new THREE.Mesh(pillarG, chrome);
                pillar.position.set(-28 + i*4, -4, -28 + j*4);
                baseGroup.add(pillar);
            }
        }
    }
    group.add(baseGroup);

    // 2. Generate Tectonic Fault Line Geometry
    const faultCurve = [];
    for(let i=0; i<=60; i++) {
        const curveY = -30 + i; // World Z mapping
        // Extremely complex, natural-looking jagged fractal generation
        const curveX = Math.sin(i * 1.4) * 0.9 + Math.cos(i * 3.1) * 0.6 + Math.sin(i * 0.5) * 1.8 + Math.cos(i * 0.1) * 2.0;
        faultCurve.push(new THREE.Vector2(curveX, curveY));
    }

    const westShape = new THREE.Shape();
    westShape.moveTo(-25, -30);
    westShape.lineTo(faultCurve[0].x, faultCurve[0].y);
    for(let i=1; i<faultCurve.length; i++) {
        westShape.lineTo(faultCurve[i].x, faultCurve[i].y);
    }
    westShape.lineTo(-25, 30);
    westShape.lineTo(-25, -30);

    const eastShape = new THREE.Shape();
    eastShape.moveTo(25, -30);
    // Gap of 0.4 units to separate plates
    eastShape.lineTo(faultCurve[0].x + 0.4, faultCurve[0].y);
    for(let i=1; i<faultCurve.length; i++) {
        eastShape.lineTo(faultCurve[i].x + 0.4, faultCurve[i].y);
    }
    eastShape.lineTo(25, 30);
    eastShape.lineTo(25, -30);

    const plateExtrudeSettings = {
        depth: 5,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.3,
        bevelSegments: 4,
        steps: 2
    };

    const westPlateGeo = new THREE.ExtrudeGeometry(westShape, plateExtrudeSettings);
    const westPlateMesh = new THREE.Mesh(westPlateGeo, darkSteel);
    westPlateMesh.rotation.x = Math.PI / 2;
    // Offset so top surface is at Y=0
    westPlateMesh.position.y = 0; 
    
    const westPlateGroup = new THREE.Group();
    westPlateGroup.add(westPlateMesh);
    meshes.plateWest = westPlateGroup;
    group.add(westPlateGroup);

    const eastPlateGeo = new THREE.ExtrudeGeometry(eastShape, plateExtrudeSettings);
    const eastPlateMesh = new THREE.Mesh(eastPlateGeo, steel);
    eastPlateMesh.rotation.x = Math.PI / 2;
    eastPlateMesh.position.y = 0;
    
    const eastPlateGroup = new THREE.Group();
    eastPlateGroup.add(eastPlateMesh);
    meshes.plateEast = eastPlateGroup;
    group.add(eastPlateGroup);

    // 3. Offset Highway Infrastructure
    // Highway Route 1 West Section
    const roadWestGeo = new THREE.BoxGeometry(24, 0.6, 8);
    const roadWestMesh = new THREE.Mesh(roadWestGeo, rubber); // Asphalt analog
    roadWestMesh.position.set(-13, 0.3, 0);
    westPlateGroup.add(roadWestMesh);
    
    // West Road Lines
    for(let i=0; i<10; i++) {
        const lineG = new THREE.BoxGeometry(1.8, 0.05, 0.3);
        const lineM = new THREE.MeshBasicMaterial({color: 0xffffff});
        const line = new THREE.Mesh(lineG, lineM);
        line.position.set(-23 + i*2.2, 0.61, 0);
        westPlateGroup.add(line);
    }

    // Highway Route 1 East Section
    const roadEastGeo = new THREE.BoxGeometry(24, 0.6, 8);
    const roadEastMesh = new THREE.Mesh(roadEastGeo, rubber);
    roadEastMesh.position.set(13, 0.3, 0);
    eastPlateGroup.add(roadEastMesh);
    
    // East Road Lines
    for(let i=0; i<10; i++) {
        const lineG = new THREE.BoxGeometry(1.8, 0.05, 0.3);
        const lineM = new THREE.MeshBasicMaterial({color: 0xffffff});
        const line = new THREE.Mesh(lineG, lineM);
        line.position.set(3 + i*2.2, 0.61, 0);
        eastPlateGroup.add(line);
    }

    // 4. Fault Gap Stress Emulators (Glowing arrays)
    for(let i=0; i<faultCurve.length; i+=2) {
        const nodeG = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16);
        const nodeM = new THREE.MeshStandardMaterial({color: 0x111111, emissive: 0x00ff00, emissiveIntensity: 1.0});
        const node = new THREE.Mesh(nodeG, nodeM);
        // Embedded slightly into the west plate boundary
        node.position.set(faultCurve[i].x - 0.2, 0.25, faultCurve[i].y);
        westPlateGroup.add(node);
        meshes.stressNodes.push(node);
        
        // Sub-surface borehole strain gauges
        const holeG = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
        const hole = new THREE.Mesh(holeG, copper);
        hole.position.set(faultCurve[i].x - 1.5, -4, faultCurve[i].y);
        westPlateGroup.add(hole);
    }

    // 5. Mobile Command Truck on East Plate
    const { truckGroup, wheels: tWheels } = createCommandTruck();
    truckGroup.position.set(12, 0.5, -15);
    eastPlateGroup.add(truckGroup);
    meshes.truckWheels.push(...tWheels);

    // 6. Laser Interferometer Network
    // Station on West Plate shooting to East Plate reflector
    for(let i=0; i<3; i++) {
        const { station, beamM } = createLaserStation(-18, -20 + i*20, 0, 0x00ff00);
        westPlateGroup.add(station);
        meshes.lasers.push(beamM);
        
        // Reflector on East Plate
        const refG = new THREE.BoxGeometry(0.5, 2, 2);
        const ref = new THREE.Mesh(refG, chrome);
        ref.position.set(20, 2, -20 + i*20);
        eastPlateGroup.add(ref);
    }

    // 7. Massive Hydraulic Rams Array
    for(let i=0; i<4; i++) {
        // West Rams pushing right
        const { ramGroup: wRam, inner: wInner } = createHydraulicRam();
        wRam.position.set(-30, -2, -22 + i*14);
        group.add(wRam);
        meshes.westPistons.push(wInner);
        
        // East Rams pushing left
        const { ramGroup: eRam, inner: eInner } = createHydraulicRam();
        eRam.position.set(30, -2, -22 + i*14);
        eRam.rotation.y = Math.PI; // Face opposite direction
        group.add(eRam);
        meshes.eastPistons.push(eInner);
    }

    // 8. Shear Stress Gearbox
    const gearG = new THREE.CylinderGeometry(5, 5, 2, 32);
    const gearM = new THREE.Mesh(gearG, darkSteel);
    gearM.position.set(0, -9, 32);
    gearM.rotation.x = Math.PI/2;
    // Add teeth
    for(let i=0; i<20; i++) {
        const toothG = new THREE.BoxGeometry(1, 2, 1.5);
        const tooth = new THREE.Mesh(toothG, steel);
        tooth.position.set(Math.cos(i/20 * Math.PI*2)*5.2, 0, Math.sin(i/20 * Math.PI*2)*5.2);
        tooth.rotation.y = -i/20 * Math.PI*2;
        gearM.add(tooth);
    }
    group.add(gearM);
    meshes.gears.push(gearM);

    // --- Part Definitions ---
    parts.push({
        name: "Pacific Plate Analog (West Block)",
        description: "Massive dark-steel extruded block simulating the oceanic Pacific Plate. Meticulously shaped with a jagged boundary to emulate crustal asperities.",
        material: "Dark Steel / Synthetic Crust",
        function: "Provides the western kinetic mass for shear stress accumulation and fault-slip generation.",
        assemblyOrder: 1,
        connections: ["Subterranean Base Truss", "West Hydraulic Rams", "Highway Route 1 (West)"],
        failureEffect: "Loss of simulated continental collision boundary, preventing shear force buildup.",
        cascadeFailures: ["Complete Loss of Shear Stress", "Interferometer Misalignment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -30, y: 5, z: 0 }
    });

    parts.push({
        name: "North American Plate Analog (East Block)",
        description: "Heavy steel extruded block simulating the continental North American Plate. Its geometry perfectly complements the west block, maintaining a critical locking gap.",
        material: "Steel / Synthetic Crust",
        function: "Provides the eastern resisting mass, absorbing and eventually releasing kinetic energy during the slip phase.",
        assemblyOrder: 2,
        connections: ["Subterranean Base Truss", "East Hydraulic Rams", "Highway Route 1 (East)"],
        failureEffect: "Unilateral sliding without stress accumulation.",
        cascadeFailures: ["Hydraulic Piston Over-extension"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 5, z: 0 }
    });

    parts.push({
        name: "Subterranean Base Truss",
        description: "An immense super-structure of interwoven steel and dark steel girders providing the foundational support for the dynamic tectonic simulator.",
        material: "Heavy Steel",
        function: "Absorbs downward lithostatic forces and provides low-friction rails for horizontal plate displacement.",
        assemblyOrder: 3,
        connections: ["Pacific Plate Analog", "North American Plate Analog", "Shear Stress Gearbox"],
        failureEffect: "Catastrophic structural collapse of the entire simulation facility.",
        cascadeFailures: ["All systems failure", "Command Truck Derailment"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -20, z: 0 }
    });

    parts.push({
        name: "West Hydraulic Drive Array",
        description: "A series of massive, high-pressure cylinders powered by subterranean pumps, designed to impart inexorable eastward pressure on the West Plate.",
        material: "Dark Steel, Chrome, Rubber",
        function: "Simulates far-field tectonic forces driving crustal plates together and laterally.",
        assemblyOrder: 4,
        connections: ["Pacific Plate Analog", "Subterranean Pump Network"],
        failureEffect: "Inability to generate sufficient locking stress across the fault boundary.",
        cascadeFailures: ["Premature Stress Release", "Coseismic Delay"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -45, y: -5, z: 0 }
    });

    parts.push({
        name: "East Hydraulic Drive Array",
        description: "Opposing high-pressure cylinders applying continuous westward force to the East Plate, ensuring the asperities remain locked.",
        material: "Dark Steel, Chrome, Rubber",
        function: "Maintains required normal force (clamping) to maximize friction before the slip event.",
        assemblyOrder: 5,
        connections: ["North American Plate Analog", "Subterranean Pump Network"],
        failureEffect: "Fault slides freely with no stick-slip behavior (aseismic creep).",
        cascadeFailures: ["Stress Emulator Deactivation"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 45, y: -5, z: 0 }
    });

    parts.push({
        name: "Fault Gap Stress Emulators",
        description: "A continuous array of embedded cylindrical sensors and emissive nodes lining the jagged fault boundary.",
        material: "Standard Emissive Plastic, Titanium",
        function: "Visually indicates the accumulation of elastic strain energy via shifting color gradients and intensity.",
        assemblyOrder: 6,
        connections: ["Pacific Plate Analog"],
        failureEffect: "Loss of critical telemetry regarding imminent slip events.",
        cascadeFailures: ["Data logging corruption"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: 15, z: 0 }
    });

    parts.push({
        name: "Interferometry Laser Stations",
        description: "Ultra-precise optical benches mounted on tripod chassis, firing continuous coherent light beams across the fault line.",
        material: "Aluminum, Glass, Dark Steel",
        function: "Detects sub-millimeter aseismic creep and rapid coseismic displacement by measuring laser phase shifts.",
        assemblyOrder: 7,
        connections: ["Pacific Plate Analog", "Laser Reflectors"],
        failureEffect: "Blindness to micro-slip, invalidating fault behavior data.",
        cascadeFailures: ["Command Truck Warning System Failure"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -20, y: 12, z: 0 }
    });

    parts.push({
        name: "Highway Route 1 (Offset Infrastructure)",
        description: "A simulated asphalt roadway built directly across the active fault to physically demonstrate lateral displacement during seismic events.",
        material: "Rubber / Asphalt Analog",
        function: "Provides a visceral, macro-scale visualization of strike-slip shearing and terrain offset.",
        assemblyOrder: 8,
        connections: ["Pacific Plate Analog", "North American Plate Analog"],
        failureEffect: "None mechanically, but diminishes the visual impact of the geological simulation.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: 10, z: 0 }
    });

    parts.push({
        name: "Mobile Command Truck",
        description: "A massive, hyper-detailed 8x8 off-road vehicle featuring giant treaded tires, complex suspension, and a tinted operator cabin.",
        material: "Steel, Tinted Glass, Chrome, Rubber",
        function: "Serves as a resilient on-site monitoring station that rides atop the tectonic plate to record local accelerations.",
        assemblyOrder: 9,
        connections: ["North American Plate Analog"],
        failureEffect: "Loss of localized seismogram recording and operator safety.",
        cascadeFailures: ["Antenna Array Collapse"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: 15, z: 0 }
    });

    parts.push({
        name: "Hyper-Tread Off-Road Tires",
        description: "Colossal Torus-based tires enveloped in 120 aggressively extruded BoxGeometry treads, mounted on complex 12-spoke rims.",
        material: "Rubber, Chrome, Dark Steel",
        function: "Allows the Command Truck to traverse and absorb extreme lateral ground accelerations during simulated quakes.",
        assemblyOrder: 10,
        connections: ["Mobile Command Truck"],
        failureEffect: "Truck loses traction and incurs severe structural damage during the slip phase.",
        cascadeFailures: ["Operator Cabin Rupture"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 35, y: 15, z: 0 }
    });

    parts.push({
        name: "Borehole Strain Gauges",
        description: "Deep-penetrating copper cylinders installed adjacent to the fault boundary.",
        material: "Copper",
        function: "Monitors volumetric and shear strain variations at depths analogous to the seismogenic zone.",
        assemblyOrder: 11,
        connections: ["Pacific Plate Analog"],
        failureEffect: "Inability to map 3D strain tensors.",
        cascadeFailures: ["Inaccurate Stress Emission"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: -10, y: -10, z: 0 }
    });

    parts.push({
        name: "Shear Stress Gearbox",
        description: "Massive interlocking cogs driven by primary simulation motors.",
        material: "Dark Steel, Steel",
        function: "Converts high-torque rotary motion into massive linear shear force transferred to the plates.",
        assemblyOrder: 12,
        connections: ["Subterranean Base Truss"],
        failureEffect: "Total motive power loss; simulation halts.",
        cascadeFailures: ["Hydraulic Back-pressure Spike"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 0, y: -25, z: 25 }
    });

    parts.push({
        name: "Sensory Antenna Array",
        description: "Copper transmission spires mounted on the Command Truck roof.",
        material: "Copper",
        function: "Broadcasts high-frequency telemetry back to the main engineering grid.",
        assemblyOrder: 13,
        connections: ["Mobile Command Truck"],
        failureEffect: "Telemetry blackout.",
        cascadeFailures: [],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 25, y: 22, z: 0 }
    });
    
    parts.push({
        name: "Thermal Exhaust Stacks",
        description: "Chrome exhaust pipes venting heat from the Command Truck's onboard generators.",
        material: "Chrome",
        function: "Prevents thermal overload of the mobile computing clusters.",
        assemblyOrder: 14,
        connections: ["Mobile Command Truck"],
        failureEffect: "Server meltdown inside the truck.",
        cascadeFailures: ["Telemetry blackout"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 20, y: 20, z: 0 }
    });

    parts.push({
        name: "Laser Reflectors",
        description: "High-polished chrome cubes positioned exactly opposite the laser emitters.",
        material: "Chrome",
        function: "Bounces the coherent light back to the interferometer for phase comparison.",
        assemblyOrder: 15,
        connections: ["North American Plate Analog"],
        failureEffect: "Breaks the optical circuit, blinding the laser measurement system.",
        cascadeFailures: ["Interferometry Laser Stations"],
        originalPosition: { x: 0, y: 0, z: 0 },
        explodedPosition: { x: 30, y: 12, z: 0 }
    });

    const description = "The Tectono-Kinematic Transform Fault Simulator is a colossal, hyper-advanced mechanical rig designed to replicate the immense forces, stick-slip behavior, and physical displacement of tectonic plates along a transform boundary. Featuring high-tech laser interferometry, glowing stress emulators, deep borehole strain gauges, and a massive hydraulic drive system, it provides unparalleled insight into seismic stress accumulation and earthquake genesis. An integrated mobile command center with extreme off-road locomotion monitors the simulated crustal dynamics in real-time.";

    const quizQuestions = [
        {
            question: "During the stick-slip cycle of a transform fault, what does the sudden drop in emissive intensity on the fault emulators represent?",
            options: ["Elastic rebound and coseismic stress release", "Plastic deformation of the asthenosphere", "Increase in lithostatic pressure", "Subduction of the oceanic crust"],
            correctAnswer: 0
        },
        {
            question: "Why are the massive hydraulic rams positioned to exert tremendous lateral force?",
            options: ["To artificially induce both normal forces (clamping) and shear forces (slip) on the asperities", "To prevent the entire simulation rig from tipping over", "To inject cooling fluids into the fault gap", "To measure the magnetic anomalies in the synthetic crust"],
            correctAnswer: 0
        },
        {
            question: "In the context of the laser interferometry stations, what would a high-frequency phase shift during the 'stick' phase indicate?",
            options: ["Aseismic micro-creep or foreshock activity along the locked fault", "A total failure of the optical bench", "Rapid cooling of the synthetic lithosphere", "A complete decoupling of the tectonic plates"],
            correctAnswer: 0
        },
        {
            question: "What is the primary function of the deeply embedded borehole strain gauges (copper cylinders)?",
            options: ["To monitor volumetric and shear strain variations at seismogenic depths prior to rupture", "To pump hydraulic fluid directly into the fault zone", "To serve as anchoring bolts for the subterranean truss", "To extract geothermal energy to power the simulation"],
            correctAnswer: 0
        },
        {
            question: "Observe the offset highway infrastructure. Which geological feature does this lateral displacement best illustrate?",
            options: ["A strike-slip fault offset (e.g., San Andreas Fault offsetting a stream or road)", "A dip-slip normal fault creating a graben", "A thrust fault generating a scarp", "A divergent boundary creating a rift valley"],
            correctAnswer: 0
        }
    ];

    function animate(time, speed) {
        const cycleLength = 8.0;
        const localTime = (time * speed * 0.5) % cycleLength;
        
        let plateDisplacement = 0;
        let stressLevel = 0;
        let isQuake = false;
        
        // Simulating the Seismic Cycle: Interseismic strain accumulation vs Coseismic slip
        if (localTime < 7.0) {
            // Stick phase: Plates are locked by friction, but far-field forces slowly warp them
            const progress = localTime / 7.0;
            plateDisplacement = progress * 1.5; 
            stressLevel = progress; // Stress builds from 0.0 to 1.0
        } else {
            // Slip phase (Earthquake): Fault ruptures, elastic rebound snaps plates forward
            const progress = (localTime - 7.0) / 1.0;
            // Damped harmonic oscillator to simulate the violent snap and ringing
            const damp = Math.exp(-progress * 6);
            plateDisplacement = 1.5 * damp * Math.cos(progress * Math.PI * 5); 
            stressLevel = (1.0 - progress); // Stress dissipates rapidly
            isQuake = true;
        }
        
        // Apply Plate Movement (Opposing Z directions for Strike-Slip)
        if (meshes.plateWest) meshes.plateWest.position.z = plateDisplacement;
        if (meshes.plateEast) meshes.plateEast.position.z = -plateDisplacement;
        
        // Violent Camera/Base shaking during Earthquake
        if (isQuake) {
            group.position.x = (Math.random() - 0.5) * 0.8;
            group.position.y = (Math.random() - 0.5) * 0.8;
            group.position.z = (Math.random() - 0.5) * 0.8;
        } else {
            group.position.x = 0;
            group.position.y = 0;
            group.position.z = 0;
        }
        
        // Update Hydraulic Pistons based on displacement
        meshes.westPistons.forEach(piston => {
            // Piston extends to push the plate
            piston.position.x = 4 + plateDisplacement * 0.2;
        });
        meshes.eastPistons.forEach(piston => {
            piston.position.x = 4 + plateDisplacement * 0.2;
        });
        
        // Update Glowing Stress Emulators
        meshes.stressNodes.forEach(node => {
            const r = stressLevel;
            const g = 0.2 + (1.0 - stressLevel) * 0.8;
            const b = 0.1;
            node.material.emissive.setRGB(r, g, b);
            
            if (isQuake) {
                // Flash intensely during rupture
                node.material.emissiveIntensity = 2.0 + Math.random() * 8.0;
            } else {
                // Steady glow proportional to accumulated strain
                node.material.emissiveIntensity = 0.5 + stressLevel * 4.0;
            }
        });
        
        // Pulse Laser Interferometers
        meshes.lasers.forEach(laser => {
            if (isQuake) {
                laser.opacity = 0.8 + Math.random() * 0.2;
                laser.color.setHex(0xff0000); // Red warning during slip
            } else {
                laser.opacity = 0.4 + stressLevel * 0.4;
                laser.color.setHex(0x00ff00); // Green monitoring during stick
            }
        });
        
        // Rotate Shear Gears continuously
        meshes.gears.forEach(gear => {
            gear.rotation.z = time * speed * 0.5;
            if(isQuake) {
                gear.rotation.z += (Math.random() - 0.5) * 0.3; // Grinding shudder
            }
        });
        
        // Spin Command Truck Wheels to simulate balancing/driving
        meshes.truckWheels.forEach(wheel => {
            wheel.rotation.x -= speed * 0.08;
            if(isQuake) {
                wheel.rotation.z = (Math.random() - 0.5) * 0.2; // Wobbly steering
            } else {
                wheel.rotation.z = 0;
            }
        });
    }

    return { group, parts, description, quizQuestions, animate };
}

// Auto-generated missing stub
export function createTransformFault() {
    const group = new THREE.Group();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 0xff0000}));
    group.add(mesh);
    return group;
}
